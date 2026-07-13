"""
Orquestrador da Fábrica — backend local aprovado na arquitetura canônica.

Responsabilidade:
  - Encadear Autor -> Adaptador -> Diretor -> Crítico/Condenador.
  - Persistir artefatos intermediários em disco.
  - Reprocessar deterministicamente a etapa indicada pelo Crítico.
  - Publicar o pacote final da aula quando aprovado.
  - Opcionalmente operar uma fila local simples de jobs (JSON), 1 worker por vez.

Decisões alinhadas com docs/architecture/model.c4 (2026-07-06):
  - sem LangGraph/LangChain;
  - state machine Python simples;
  - roteamento de retrabalho decidido em código puro;
  - 1 job por vez;
  - esgotou tentativas -> failed/dead-letter, sem escalar pra humano.
"""
from __future__ import annotations

import argparse
import copy
import fcntl
import hashlib
import json
import os
import re
import shutil
import sys
import traceback
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator

FABRICA_DIR = Path(__file__).resolve().parent
REPO_ROOT = FABRICA_DIR.parent
DEFAULT_STORE_PATH = REPO_ROOT / "fabrica" / "jobs" / "queue.json"
DEFAULT_RUNS_DIR = REPO_ROOT / "fabrica" / "runs"
DEFAULT_PUBLISH_ROOT = REPO_ROOT / ".tmp" / "fabrica-published"
ENV_PATH = FABRICA_DIR / ".env"
DEFAULT_MAX_LLM_CALLS = 20
DEFAULT_MAX_LLM_TOKENS = 120000


def _load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


_load_dotenv(ENV_PATH)

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from fabrica.agents.condemn import condemn_with_routing
from fabrica.agents.content_author import generate_roteiro
from fabrica.agents.flowchart_adapter import generate_mapeamento
from fabrica.agents.lesson_critic import critique_lesson
from fabrica.agents.presentation_director import generate_lesson
from fabrica.agents.scope_planner import plan_scopes


def _utcnow() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "job"


def _stable_job_id(source_file: Path, tema: str, objetivo: str) -> str:
    """job_id determinístico quando o job-file não declara um explícito.

    Precisa ser estável entre execuções do MESMO job-file pra existir "o
    mesmo job" a retomar — uuid4 gerava um job novo a cada chamada, o que
    tornava checkpoint/resume impossível (run_dir/publish_dir mudavam sempre).
    """
    digest_source = f"{source_file.resolve()}|{tema}|{objetivo}"
    digest = hashlib.sha1(digest_source.encode("utf-8")).hexdigest()[:12]
    return f"{_slugify(Path(source_file).stem)}-{digest}"


def _resolve_existing_path(value: str, *, base_dir: Path) -> Path:
    path = Path(value)
    if path.is_absolute():
        return path
    candidate = (base_dir / path).resolve()
    if candidate.exists():
        return candidate
    return (REPO_ROOT / path).resolve()


def _resolve_output_path(value: str) -> Path:
    path = Path(value)
    if path.is_absolute():
        return path
    return (REPO_ROOT / path).resolve()


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, data: dict[str, Any]) -> None:
    """Escrita atômica: grava em arquivo temporário no mesmo diretório e
    renomeia por cima do destino. os.replace é atômico no mesmo filesystem —
    um kill -9 no meio nunca deixa o arquivo final truncado/corrompido,
    só o `.tmp` (descartável)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_name(f".{path.name}.tmp-{os.getpid()}")
    tmp_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp_path, path)


@contextmanager
def _locked_file(lock_path: Path) -> Iterator[None]:
    """Lease/lock simples via flock exclusivo — evita duas invocações
    concorrentes de work-next reservando o mesmo job ou perdendo updates
    (lost-update) no JobStore. Escopo do processo: bloqueia até liberar."""
    lock_path.parent.mkdir(parents=True, exist_ok=True)
    fd = os.open(str(lock_path), os.O_CREAT | os.O_RDWR)
    try:
        fcntl.flock(fd, fcntl.LOCK_EX)
        yield
    finally:
        fcntl.flock(fd, fcntl.LOCK_UN)
        os.close(fd)


def _write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _copy_file(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def _status_line(message: str, *, verbose: bool) -> None:
    if verbose:
        print(f"[orchestrator] {message}", file=sys.stderr)


class LlmBudgetExceeded(RuntimeError):
    pass


@dataclass
class LlmBudget:
    max_calls: int
    max_tokens: int
    calls: int = 0
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0

    def before_request(self, agent: str) -> None:
        if self.calls >= self.max_calls:
            raise LlmBudgetExceeded(
                f"job excedeu max_llm_calls={self.max_calls} antes de chamar {agent} "
                f"(calls usadas: {self.calls})"
            )

    def record_usage(self, agent: str, usage: dict[str, int]) -> None:
        self.calls += 1
        self.prompt_tokens += int(usage.get("prompt_tokens", 0))
        self.completion_tokens += int(usage.get("completion_tokens", 0))
        self.total_tokens += int(usage.get("total_tokens", 0))
        if self.total_tokens > self.max_tokens:
            raise LlmBudgetExceeded(
                f"job excedeu max_llm_tokens={self.max_tokens} após resposta de {agent} "
                f"(total_tokens acumulados: {self.total_tokens})"
            )

    def snapshot(self) -> dict[str, int]:
        return {
            "max_calls": self.max_calls,
            "max_tokens": self.max_tokens,
            "calls": self.calls,
            "prompt_tokens": self.prompt_tokens,
            "completion_tokens": self.completion_tokens,
            "total_tokens": self.total_tokens,
        }


@dataclass
class JobSpec:
    job_id: str
    source_file: Path
    tema: str
    objetivo: str
    nivel: str
    view_id: str
    diagram_source_file: Path
    diagram_module_file: Path
    diagram_source: str
    diagram_module: str
    publish_dir: Path
    run_dir: Path
    version: str
    max_reworks: int
    concept_budget: int
    max_llm_calls: int | None
    max_llm_tokens: int | None

    @classmethod
    def from_dict(cls, raw: dict[str, Any], *, base_dir: Path) -> "JobSpec":
        tema = str(raw["tema"]).strip()
        objetivo = str(raw["objetivo"]).strip()
        view_id = str(raw["view_id"]).strip()
        source_file = _resolve_existing_path(str(raw["source_file"]), base_dir=base_dir)
        diagram_source_file = _resolve_existing_path(str(raw["diagram_source_file"]), base_dir=base_dir)
        diagram_module_file = _resolve_existing_path(str(raw["diagram_module_file"]), base_dir=base_dir)

        job_id = str(raw.get("job_id") or _stable_job_id(source_file, tema, objetivo))
        publish_dir = _resolve_output_path(str(raw.get("publish_dir") or (DEFAULT_PUBLISH_ROOT / job_id)))
        run_dir = _resolve_output_path(str(raw.get("run_dir") or (DEFAULT_RUNS_DIR / job_id)))

        return cls(
            job_id=job_id,
            source_file=source_file,
            tema=tema,
            objetivo=objetivo,
            nivel=str(raw.get("nivel") or "intermediário"),
            view_id=view_id,
            diagram_source_file=diagram_source_file,
            diagram_module_file=diagram_module_file,
            diagram_source=str(raw.get("diagram_source") or diagram_source_file.name),
            diagram_module=str(raw.get("diagram_module") or diagram_module_file.name),
            publish_dir=publish_dir,
            run_dir=run_dir,
            version=str(raw.get("version") or "1.0"),
            max_reworks=int(raw.get("max_reworks", 2)),
            concept_budget=int(raw.get("concept_budget", 6)),
            max_llm_calls=(
                int(raw["max_llm_calls"])
                if raw.get("max_llm_calls") is not None
                else None
            ),
            max_llm_tokens=(
                int(raw["max_llm_tokens"])
                if raw.get("max_llm_tokens") is not None
                else None
            ),
        )

    def to_public_dict(self) -> dict[str, Any]:
        return {
            "job_id": self.job_id,
            "source_file": str(self.source_file),
            "tema": self.tema,
            "objetivo": self.objetivo,
            "nivel": self.nivel,
            "view_id": self.view_id,
            "diagram_source_file": str(self.diagram_source_file),
            "diagram_module_file": str(self.diagram_module_file),
            "diagram_source": self.diagram_source,
            "diagram_module": self.diagram_module,
            "publish_dir": str(self.publish_dir),
            "run_dir": str(self.run_dir),
            "version": self.version,
            "max_reworks": self.max_reworks,
            "concept_budget": self.concept_budget,
            "max_llm_calls": self.max_llm_calls,
            "max_llm_tokens": self.max_llm_tokens,
        }


class JobNotFoundError(Exception):
    """job_id ausente na fila — tratado graciosamente pelo chamador, nunca cru."""


class JobStore:
    def __init__(self, path: Path):
        self.path = path
        self._lock_path = path.with_name(f".{path.name}.lock")

    def _load(self) -> dict[str, Any]:
        if not self.path.exists():
            return {"jobs": []}
        return _read_json(self.path)

    def _save(self, data: dict[str, Any]) -> None:
        _write_json(self.path, data)

    def enqueue(self, raw_spec: dict[str, Any]) -> dict[str, Any]:
        spec = dict(raw_spec)
        if not spec.get("job_id"):
            job = JobSpec.from_dict(spec, base_dir=REPO_ROOT)
            spec["job_id"] = job.job_id
        with _locked_file(self._lock_path):
            data = self._load()
            record = {
                "job_id": spec["job_id"],
                "status": "pending",
                "created_at": _utcnow(),
                "updated_at": _utcnow(),
                "spec": spec,
                "result": None,
            }
            data["jobs"].append(record)
            self._save(data)
            return record

    def reserve_next(self) -> dict[str, Any] | None:
        """Adquire o lease exclusivo do arquivo da fila inteira antes de ler+escrever
        — impede duas invocações concorrentes de work-next reservarem o mesmo job
        (dupla reserva) ou perderem update uma da outra (lost-update)."""
        with _locked_file(self._lock_path):
            data = self._load()
            for record in data["jobs"]:
                if record["status"] == "pending":
                    record["status"] = "running"
                    record["started_at"] = _utcnow()
                    record["updated_at"] = _utcnow()
                    self._save(data)
                    return copy.deepcopy(record)
            return None

    def finish(self, job_id: str, *, status: str, result: dict[str, Any]) -> None:
        with _locked_file(self._lock_path):
            data = self._load()
            for record in data["jobs"]:
                if record["job_id"] == job_id:
                    record["status"] = status
                    record["updated_at"] = _utcnow()
                    record["finished_at"] = _utcnow()
                    record["result"] = result
                    self._save(data)
                    return
        raise JobNotFoundError(f"job_id não encontrado na fila: {job_id}")


class NeedRescope(RuntimeError):
    def __init__(self, slice_plan: dict[str, Any], reason: str):
        super().__init__(reason)
        self.slice_plan = slice_plan
        self.reason = reason


def _is_concept_budget_error(exc: RuntimeError) -> bool:
    message = str(exc)
    return "Aula introduz" in message and "conceitos únicos" in message


def _choose_feedback_violations(report: dict[str, Any], target: str | None) -> list[dict[str, Any]]:
    violations = report.get("violations", [])
    if target:
        filtered = [v for v in violations if v.get("send_back_to") == target]
        if filtered:
            return filtered
    return violations


def _build_feedback_text(report: dict[str, Any], *, reason: str, target: str | None) -> str:
    lines = [
        f"Veredito do Condenador: {reason}",
        f"Score do Crítico: {report.get('score_total')}/60",
    ]
    if target:
        lines.append(f"Etapa a reprocessar: {target}")
    lines.append("")
    lines.append("Violations a corrigir:")
    for violation in _choose_feedback_violations(report, target):
        principle = violation.get("principle")
        status = violation.get("status")
        field = violation.get("field") or "(campo não informado)"
        issue = violation.get("issue") or "(issue não informado)"
        instruction = violation.get("instruction") or "corrigir sem alterar o resto do contrato"
        lines.append(f"- {principle} [{status}] em {field}: {issue}")
        lines.append(f"  instrução: {instruction}")
    return "\n".join(lines)


def _prepare_job_run_dir(job: JobSpec, *, source_text: str, verbose: bool) -> None:
    job.run_dir.mkdir(parents=True, exist_ok=True)
    _write_json(job.run_dir / "job.json", job.to_public_dict())
    _write_text(job.run_dir / f"source{job.source_file.suffix or '.txt'}", source_text)
    _status_line(f"artefatos do job em {job.run_dir}", verbose=verbose)


def _prepare_slice_run_dir(run_dir: Path, slice_plan: dict[str, Any]) -> None:
    run_dir.mkdir(parents=True, exist_ok=True)
    _write_json(run_dir / "slice.json", slice_plan)
    _write_text(run_dir / "source.md", str(slice_plan["markdown"]))


def _save_slice_state(slice_run_dir: Path, *, target: str, rework_count: int, feedback_text: str | None) -> None:
    """Checkpoint de qual fase/tentativa esta fatia está em, gravado ANTES de
    cada fase rodar. Restart relê isso (ver _load_slice_state) pra retomar do
    ponto exato em vez de refazer tudo — só entra em jogo se o slice ainda não
    tiver result.json terminal (done/failed)."""
    _write_json(
        slice_run_dir / "state.json",
        {"target": target, "rework_count": rework_count, "feedback_text": feedback_text, "updated_at": _utcnow()},
    )


def _load_slice_state(slice_run_dir: Path) -> dict[str, Any] | None:
    state_path = slice_run_dir / "state.json"
    if not state_path.exists():
        return None
    return _read_json(state_path)


def _budget_callback(job: JobSpec, budget: LlmBudget) -> tuple[Any, Any]:
    def _before_request(agent: str) -> None:
        budget.before_request(agent)

    def _record_usage(agent: str, usage: dict[str, int]) -> None:
        budget.record_usage(agent, usage)
        _write_json(job.run_dir / "llm_budget.json", budget.snapshot())

    return _before_request, _record_usage


def _resolve_budget_limits(job: JobSpec, scope_plan: dict[str, Any]) -> tuple[int, int]:
    slice_count = max(1, int(scope_plan["slice_count"]))
    max_rounds_per_slice = 1 + job.max_reworks
    auto_max_calls = max(DEFAULT_MAX_LLM_CALLS, slice_count * 4 * max_rounds_per_slice)
    auto_max_tokens = max(
        DEFAULT_MAX_LLM_TOKENS,
        slice_count * max_rounds_per_slice * 20000,
    )
    return (
        job.max_llm_calls if job.max_llm_calls is not None else auto_max_calls,
        job.max_llm_tokens if job.max_llm_tokens is not None else auto_max_tokens,
    )


def _publish_lesson(
    publish_dir: Path,
    job: JobSpec,
    lesson_draft: dict[str, Any],
    critic_report: dict[str, Any],
    *,
    slice_plan: dict[str, Any],
    source_copy_path: Path,
    iteration_count: int,
    verbose: bool,
) -> Path:
    publish_dir.mkdir(parents=True, exist_ok=True)

    final_lesson = copy.deepcopy(lesson_draft)
    meta = final_lesson.setdefault("meta", {})
    meta["critic_score"] = critic_report["score_total"]
    meta["critic_agent"] = critic_report.get("meta", {}).get("critic_agent")
    meta["critic_model"] = critic_report.get("meta", {}).get("model")
    meta["iteration_count"] = iteration_count
    meta["approved_at"] = _utcnow()
    meta["job_id"] = job.job_id
    meta["scope_slice_id"] = slice_plan["slice_id"]
    meta["scope_slice_title"] = slice_plan["title"]

    lesson_path = publish_dir / "lesson.json"
    _write_json(lesson_path, final_lesson)
    _copy_file(job.diagram_source_file, publish_dir / job.diagram_source)
    _copy_file(job.diagram_module_file, publish_dir / job.diagram_module)
    _copy_file(source_copy_path, publish_dir / source_copy_path.name)

    _status_line(f"lesson publicado em {lesson_path}", verbose=verbose)
    return lesson_path


def _handle_phase_exhaustion(
    job: JobSpec,
    slice_plan: dict[str, Any],
    slice_run_dir: Path,
    slice_publish_dir: Path,
    budget: LlmBudget,
    *,
    phase: str,
    exc: Exception,
    rework_count: int,
    verbose: bool,
) -> tuple[int, str, str | None, dict[str, Any] | None]:
    """Esgotamento de flowchart_adapter/presentation_director (RuntimeError após
    MAX_RETRIES internos deles) reaproveita o mesmo mecanismo de
    rework_count/max_reworks que já trata reprovação do Crítico — vira falha
    DA FATIA (dead-letter), nunca propaga pra derrubar o job inteiro.

    Retorna (rework_count, próximo target, feedback_text, resultado terminal
    ou None). Quando o 4º item não é None, o chamador deve retornar esse
    resultado imediatamente (fatia esgotada)."""
    if rework_count >= job.max_reworks:
        result = {
            "slice_id": slice_plan["slice_id"],
            "slice_title": slice_plan["title"],
            "job_id": job.job_id,
            "status": "failed",
            "reason": f"{phase} esgotou tentativas: {exc}",
            "send_back_to": phase,
            "rework_count": rework_count,
            "critic_score": None,
            "run_dir": str(slice_run_dir),
            "publish_dir": str(slice_publish_dir),
            "finished_at": _utcnow(),
            "llm_budget": budget.snapshot(),
        }
        _write_json(slice_run_dir / "result.json", result)
        _status_line(f"fatia esgotada em {phase} após {rework_count} retrabalhos: {exc}", verbose=verbose)
        return rework_count, phase, None, result

    rework_count += 1
    feedback_text = f"Tentativa anterior de {phase} falhou: {exc}\n\nCorrigir e tentar novamente."
    _status_line(
        f"{phase} falhou; reprocessando (tentativa de retrabalho {rework_count}/{job.max_reworks}): {exc}",
        verbose=verbose,
    )
    return rework_count, phase, feedback_text, None


def _run_slice(
    job: JobSpec,
    slice_plan: dict[str, Any],
    budget: LlmBudget,
    *,
    until_stage: str,
    total_slices: int,
    verbose: bool = False,
) -> dict[str, Any]:
    roteiro = None
    mapeado = None
    lesson_draft = None
    critic_report = None
    target = "content_author"
    feedback_text = None
    rework_count = 0
    slice_slug = slice_plan["slice_id"]
    slice_run_dir = job.run_dir if total_slices == 1 else job.run_dir / "slices" / slice_slug
    slice_publish_dir = job.publish_dir if total_slices == 1 else job.publish_dir / "slices" / slice_slug

    # RESUME — se a fatia já chegou a um veredito terminal numa execução
    # anterior (done ou failed/esgotada), reaproveita sem rodar de novo.
    # Quando total_slices==1, slice_run_dir == job.run_dir — o result.json final
    # do JOB (escrito no fim de run_job) e o da FATIA colidem no mesmo path.
    # "slice_id" só existe no formato de resultado de fatia, nunca no de job;
    # usa isso pra não confundir um result.json de job antigo com um veredito
    # de fatia retomável.
    terminal_result_path = slice_run_dir / "result.json"
    if terminal_result_path.exists():
        cached = _read_json(terminal_result_path)
        if "slice_id" in cached and cached.get("status") in ("done", "failed"):
            _status_line(
                f"fatia {slice_slug} já tinha veredito terminal ({cached['status']}) — pulando, reaproveitando resultado",
                verbose=verbose,
            )
            return cached

    _prepare_slice_run_dir(slice_run_dir, slice_plan)
    source_copy_path = slice_run_dir / "source.md"
    before_request, record_usage = _budget_callback(job, budget)

    # RESUME parcial — fatia foi interrompida no meio (sem result.json terminal
    # mas com state.json + artefatos de fase já gravados). Recarrega de onde
    # parou em vez de refazer as fases já concluídas.
    state = _load_slice_state(slice_run_dir)
    if state is not None:
        target = state["target"]
        rework_count = int(state["rework_count"])
        feedback_text = state.get("feedback_text")
        roteiro_path = slice_run_dir / "roteiro_pedagogico.json"
        mapeado_path = slice_run_dir / "roteiro_mapeado.json"
        lesson_draft_path = slice_run_dir / "lesson.draft.json"
        if roteiro_path.exists():
            roteiro = _read_json(roteiro_path)
        if mapeado_path.exists():
            mapeado = _read_json(mapeado_path)
        if lesson_draft_path.exists():
            lesson_draft = _read_json(lesson_draft_path)
        _status_line(
            f"fatia {slice_slug} retomada do checkpoint: target={target}, rework_count={rework_count}",
            verbose=verbose,
        )

    while True:
        if target == "content_author":
            _save_slice_state(slice_run_dir, target=target, rework_count=rework_count, feedback_text=feedback_text)
            _status_line("fase 1/4: Autor de Conteúdo", verbose=verbose)
            try:
                roteiro = generate_roteiro(
                    str(slice_plan["markdown"]),
                    tema=job.tema if total_slices == 1 else f"{job.tema} — {slice_plan['title']}",
                    objetivo=job.objetivo if total_slices == 1 else f"{job.objetivo} Recorte desta fatia: {slice_plan['title']}.",
                    nivel=job.nivel,
                    feedback=feedback_text,
                    before_request=before_request,
                    usage_hook=record_usage,
                    verbose=verbose,
                )
            except LlmBudgetExceeded:
                raise
            except RuntimeError as exc:
                if _is_concept_budget_error(exc):
                    raise NeedRescope(slice_plan, str(exc)) from exc
                # Esgotamento do Autor por qualquer OUTRO motivo (ex.: beat com
                # conceitos demais, campo longo demais) não é orçamento — mesmo
                # isolamento por fatia aplicado ao Adaptador/Diretor, não derruba
                # o job inteiro.
                rework_count, target, feedback_text, exhausted_result = _handle_phase_exhaustion(
                    job, slice_plan, slice_run_dir, slice_publish_dir, budget,
                    phase="content_author", exc=exc, rework_count=rework_count, verbose=verbose,
                )
                if exhausted_result is not None:
                    return exhausted_result
                continue
            _write_json(slice_run_dir / "roteiro_pedagogico.json", roteiro)
            mapeado = None
            lesson_draft = None
            if until_stage == "content_author":
                result = {
                    "slice_id": slice_plan["slice_id"],
                    "slice_title": slice_plan["title"],
                    "job_id": job.job_id,
                    "status": "done",
                    "reason": "content_author_approved",
                    "send_back_to": None,
                    "rework_count": rework_count,
                    "critic_score": None,
                    "run_dir": str(slice_run_dir),
                    "publish_dir": None,
                    "roteiro_file": str(slice_run_dir / "roteiro_pedagogico.json"),
                    "lesson_file": None,
                    "finished_at": _utcnow(),
                    "llm_budget": budget.snapshot(),
                }
                _write_json(slice_run_dir / "result.json", result)
                return result

        if target in {"content_author", "flowchart_adapter"}:
            _save_slice_state(slice_run_dir, target="flowchart_adapter", rework_count=rework_count, feedback_text=feedback_text)
            _status_line("fase 2/4: Adaptador de Fluxograma", verbose=verbose)
            try:
                mapeado = generate_mapeamento(
                    roteiro,
                    view_id=job.view_id,
                    c4_module_path=job.diagram_module_file,
                    feedback=feedback_text if target == "flowchart_adapter" else None,
                    before_request=before_request,
                    usage_hook=record_usage,
                    verbose=verbose,
                )
            except LlmBudgetExceeded:
                raise
            except RuntimeError as exc:
                # Esgotamento do Adaptador (após seus próprios MAX_RETRIES internos)
                # não pode derrubar o job inteiro — vira retrabalho da FATIA,
                # mesmo mecanismo de rework_count/max_reworks da reprovação do Crítico.
                rework_count, target, feedback_text, exhausted_result = _handle_phase_exhaustion(
                    job, slice_plan, slice_run_dir, slice_publish_dir, budget,
                    phase="flowchart_adapter", exc=exc, rework_count=rework_count, verbose=verbose,
                )
                if exhausted_result is not None:
                    return exhausted_result
                continue
            _write_json(slice_run_dir / "roteiro_mapeado.json", mapeado)
            lesson_draft = None

        if target in {"content_author", "flowchart_adapter", "presentation_director"}:
            _save_slice_state(slice_run_dir, target="presentation_director", rework_count=rework_count, feedback_text=feedback_text)
            _status_line("fase 3/4: Diretor de Apresentação", verbose=verbose)
            try:
                lesson_draft = generate_lesson(
                    mapeado,
                    version=job.version,
                    diagram_source=job.diagram_source,
                    diagram_module=job.diagram_module,
                    feedback=feedback_text if target == "presentation_director" else None,
                    before_request=before_request,
                    usage_hook=record_usage,
                    verbose=verbose,
                )
            except LlmBudgetExceeded:
                raise
            except RuntimeError as exc:
                rework_count, target, feedback_text, exhausted_result = _handle_phase_exhaustion(
                    job, slice_plan, slice_run_dir, slice_publish_dir, budget,
                    phase="presentation_director", exc=exc, rework_count=rework_count, verbose=verbose,
                )
                if exhausted_result is not None:
                    return exhausted_result
                continue
            _write_json(slice_run_dir / "lesson.draft.json", lesson_draft)

        _save_slice_state(slice_run_dir, target="lesson_critic", rework_count=rework_count, feedback_text=feedback_text)
        _status_line("fase 4/4: Crítico + Condenador", verbose=verbose)
        # content_type é campo do roteiro (Autor de Conteúdo), não existe em
        # lesson_draft/steps[] (Diretor de Apresentação não muda de contrato
        # nesta task) — repassamos como sinal separado pro Crítico, casando por
        # id do beat (NUNCA por posição: a validação do Adaptador só garante
        # que o CONJUNTO de ids de mapeado["beats"] bate com o roteiro, não a
        # ORDEM — então não dá pra assumir roteiro["beats"][i] == mapeado["beats"][i]).
        # mapeado["beats"] está na mesma ordem usada por _build_steps() do
        # Diretor pra gerar steps[] (índice i = posição no array), então
        # step_content_types[i] corresponde a lesson_draft["steps"][i].
        if roteiro and mapeado:
            content_type_by_beat_id = {b["id"]: b.get("content_type") for b in roteiro["beats"]}
            step_content_types = [
                content_type_by_beat_id.get(beat["id"])
                for beat in mapeado["beats"]
            ]
        else:
            # Fallback defensivo — não deveria ocorrer nos caminhos de resume
            # atuais (roteiro/mapeado são persistidos em disco antes do
            # checkpoint apontar pra "lesson_critic" e recarregados no resume),
            # mas se algum caminho futuro chegar aqui sem eles, o Crítico trata
            # content_type=None como "não disponível", nunca como erro.
            step_content_types = [None] * len(lesson_draft.get("steps", []))
        critic_report = critique_lesson(
            lesson_draft,
            content_types=step_content_types,
            before_request=before_request,
            usage_hook=record_usage,
            verbose=verbose,
        )
        _write_json(slice_run_dir / "critic_report.json", critic_report)

        approved, reason, send_back_to = condemn_with_routing(critic_report)
        if approved:
            lesson_path = _publish_lesson(
                slice_publish_dir,
                job,
                lesson_draft,
                critic_report,
                slice_plan=slice_plan,
                source_copy_path=source_copy_path,
                iteration_count=rework_count,
                verbose=verbose,
            )
            result = {
                "slice_id": slice_plan["slice_id"],
                "slice_title": slice_plan["title"],
                "job_id": job.job_id,
                "status": "done",
                "reason": reason,
                "send_back_to": None,
                "rework_count": rework_count,
                "critic_score": critic_report["score_total"],
                "run_dir": str(slice_run_dir),
                "publish_dir": str(slice_publish_dir),
                "lesson_file": str(lesson_path),
                "finished_at": _utcnow(),
                "llm_budget": budget.snapshot(),
            }
            _write_json(slice_run_dir / "result.json", result)
            return result

        if rework_count >= job.max_reworks:
            result = {
                "slice_id": slice_plan["slice_id"],
                "slice_title": slice_plan["title"],
                "job_id": job.job_id,
                "status": "failed",
                "reason": reason,
                "send_back_to": send_back_to,
                "rework_count": rework_count,
                "critic_score": critic_report["score_total"],
                "run_dir": str(slice_run_dir),
                "publish_dir": str(slice_publish_dir),
                "finished_at": _utcnow(),
                "llm_budget": budget.snapshot(),
            }
            _write_json(slice_run_dir / "result.json", result)
            return result

        rework_count += 1
        target = send_back_to or "presentation_director"
        feedback_text = _build_feedback_text(critic_report, reason=reason, target=target)
        _status_line(
            f"reprovado; reprocessando etapa {target} (tentativa de retrabalho {rework_count}/{job.max_reworks})",
            verbose=verbose,
        )


def _write_publish_manifest(job: JobSpec, scope_plan: dict[str, Any], slice_results: list[dict[str, Any]]) -> Path:
    manifest = {
        "job_id": job.job_id,
        "status": "done",
        "planner": {
            "agent": scope_plan["planner_agent"],
            "concept_budget": scope_plan["concept_budget"],
            "slice_count": scope_plan["slice_count"],
            "strategy": scope_plan["strategy"],
        },
        "slices": [
            {
                "slice_id": result["slice_id"],
                "title": result["slice_title"],
                "lesson_file": result["lesson_file"],
                "publish_dir": result["publish_dir"],
                "critic_score": result["critic_score"],
            }
            for result in slice_results
        ],
        "generated_at": _utcnow(),
    }
    manifest_path = job.publish_dir / "manifest.json"
    _write_json(manifest_path, manifest)
    return manifest_path


def _expand_slice_for_rescope(job: JobSpec, slice_plan: dict[str, Any]) -> list[dict[str, Any]]:
    fine_plan = plan_scopes(
        str(slice_plan["markdown"]),
        tema=job.tema,
        objetivo=job.objetivo,
        concept_budget=job.concept_budget,
        source_label=f"{job.source_file}#{slice_plan['slice_id']}",
        max_units_per_slice=1,
        overflow_threshold=0,
    )
    expanded: list[dict[str, Any]] = []
    for index, child in enumerate(fine_plan["slices"], start=1):
        child_plan = dict(child)
        child_plan["slice_id"] = f"{slice_plan['slice_id']}-{index:02d}"
        child_plan["title"] = f"{slice_plan['title']} — refinamento {index}"
        child_plan["rescope_depth"] = int(slice_plan.get("rescope_depth", 0)) + 1
        expanded.append(child_plan)
    return expanded


def run_job(job: JobSpec, *, until_stage: str = "full", verbose: bool = False) -> dict[str, Any]:
    chapter_markdown = job.source_file.read_text(encoding="utf-8")
    _prepare_job_run_dir(job, source_text=chapter_markdown, verbose=verbose)

    scope_plan = plan_scopes(
        chapter_markdown,
        tema=job.tema,
        objetivo=job.objetivo,
        concept_budget=job.concept_budget,
        source_label=str(job.source_file),
    )
    _write_json(job.run_dir / "scope_plan.json", scope_plan)
    _status_line(
        f"scope_planner gerou {scope_plan['slice_count']} fatias para o job {job.job_id}",
        verbose=verbose,
    )
    max_llm_calls, max_llm_tokens = _resolve_budget_limits(job, scope_plan)
    budget = LlmBudget(max_calls=max_llm_calls, max_tokens=max_llm_tokens)
    _write_json(job.run_dir / "llm_budget.json", budget.snapshot())

    pending_slices = [dict(slice_plan, rescope_depth=0) for slice_plan in scope_plan["slices"]]
    slice_results: list[dict[str, Any]] = []
    total_slices = len(pending_slices)
    while pending_slices:
        index = len(slice_results) + 1
        slice_plan = pending_slices.pop(0)
        _status_line(
            f"executando fatia {index}/{total_slices}: {slice_plan['title']}",
            verbose=verbose,
        )
        try:
            slice_result = _run_slice(
                job,
                slice_plan,
                budget,
                until_stage=until_stage,
                total_slices=total_slices,
                verbose=verbose,
            )
        except LlmBudgetExceeded as exc:
            # Orçamento do job inteiro estourou — não há mais o que fazer, mas
            # preserva as fatias JÁ aprovadas (slice_results) em vez de perdê-las
            # no result.json, como acontecia antes (run_job_safely engolia tudo
            # no handler genérico de exceção sem "slices").
            done_count = sum(1 for r in slice_results if r["status"] == "done")
            result = {
                "job_id": job.job_id,
                "status": "partial_done" if done_count else "failed",
                "reason": f"LlmBudgetExceeded: {exc}",
                "send_back_to": None,
                "scope_plan": {
                    "slice_count": scope_plan["slice_count"],
                    "concept_budget": scope_plan["concept_budget"],
                },
                "slices": slice_results,
                "run_dir": str(job.run_dir),
                "publish_dir": str(job.publish_dir),
                "finished_at": _utcnow(),
                "llm_budget": budget.snapshot(),
            }
            if done_count and until_stage == "full":
                _write_publish_manifest(job, scope_plan, [r for r in slice_results if r["status"] == "done"])
            _write_json(job.run_dir / "result.json", result)
            return result
        except NeedRescope as exc:
            # Esgotamento do re-escopo (profundidade máxima ou expansão que não
            # reduz a fatia) é dead-letter DESTA fatia, mesmo princípio de
            # isolamento aplicado às outras fases — não derruba o job inteiro,
            # as outras fatias pending continuam normalmente.
            rescope_exhausted = int(slice_plan.get("rescope_depth", 0)) >= 2
            expanded = [] if rescope_exhausted else _expand_slice_for_rescope(job, exc.slice_plan)
            if rescope_exhausted or len(expanded) <= 1:
                dead_letter = {
                    "slice_id": slice_plan["slice_id"],
                    "slice_title": slice_plan["title"],
                    "job_id": job.job_id,
                    "status": "failed",
                    "reason": exc.reason,
                    "send_back_to": "scope_planner",
                    "rework_count": None,
                    "critic_score": None,
                    "run_dir": str(job.run_dir / "slices" / slice_plan["slice_id"]),
                    "publish_dir": None,
                    "finished_at": _utcnow(),
                    "llm_budget": budget.snapshot(),
                }
                slice_results.append(dead_letter)
                total_slices = len(slice_results) + len(pending_slices)
                _status_line(
                    f"fatia {slice_plan['slice_id']} esgotou re-escopo (dead-letter): {exc.reason}",
                    verbose=verbose,
                )
                continue

            _status_line(
                f"scope_planner refinou a fatia {slice_plan['slice_id']} em {len(expanded)} subfatias",
                verbose=verbose,
            )
            pending_slices = expanded + pending_slices
            total_slices = len(slice_results) + len(pending_slices)
            continue

        # Esgotamento/falha desta fatia (dead-letter) NÃO derruba o job inteiro —
        # segue pro próximo job da fila (aqui: próxima fatia pending), preservando
        # as demais N-1. Resultado final vira partial_done (M/N) ou failed (0/N).
        slice_results.append(slice_result)
        total_slices = len(slice_results) + len(pending_slices)

    done_results = [r for r in slice_results if r["status"] == "done"]
    failed_results = [r for r in slice_results if r["status"] != "done"]

    if until_stage != "full":
        # Modo --until content_author: todo slice_result aqui é "content_author_approved"
        # (done) por definição de _run_slice — não há noção de partial_done.
        lesson_file = slice_results[0]["lesson_file"] if len(slice_results) == 1 else None
        result = {
            "job_id": job.job_id,
            "status": "done",
            "reason": "content_author_approved",
            "send_back_to": None,
            "until_stage": until_stage,
            "scope_plan": {"slice_count": scope_plan["slice_count"], "concept_budget": scope_plan["concept_budget"]},
            "slices": slice_results,
            "run_dir": str(job.run_dir),
            "publish_dir": None,
            "lesson_file": lesson_file,
            "manifest_file": None,
            "finished_at": _utcnow(),
            "llm_budget": budget.snapshot(),
        }
        _write_json(job.run_dir / "result.json", result)
        return result

    if not done_results:
        job_status = "failed"
        reason = f"0/{len(slice_results)} fatias aprovadas — " + (
            failed_results[-1]["reason"] if failed_results else "nenhuma fatia processada"
        )
    elif failed_results:
        job_status = "partial_done"
        reason = f"{len(done_results)}/{len(slice_results)} fatias aprovadas, {len(failed_results)} esgotada(s) em dead-letter"
    else:
        job_status = "done"
        reason = "approved"

    if len(slice_results) > 1:
        manifest_path = _write_publish_manifest(job, scope_plan, done_results) if done_results else None
        lesson_file = None
    else:
        manifest_path = None
        lesson_file = done_results[0]["lesson_file"] if done_results else None

    result = {
        "job_id": job.job_id,
        "status": job_status,
        "reason": reason,
        "send_back_to": None,
        "until_stage": until_stage,
        "scope_plan": {
            "slice_count": scope_plan["slice_count"],
            "concept_budget": scope_plan["concept_budget"],
        },
        "slices": slice_results,
        "run_dir": str(job.run_dir),
        "publish_dir": str(job.publish_dir) if done_results else None,
        "lesson_file": lesson_file,
        "manifest_file": str(manifest_path) if manifest_path else None,
        "finished_at": _utcnow(),
        "llm_budget": budget.snapshot(),
    }
    _write_json(job.run_dir / "result.json", result)
    return result


def run_job_safely(job: JobSpec, *, until_stage: str = "full", verbose: bool = False) -> dict[str, Any]:
    try:
        return run_job(job, until_stage=until_stage, verbose=verbose)
    except Exception as exc:
        job.run_dir.mkdir(parents=True, exist_ok=True)
        trace = traceback.format_exc()
        _write_text(job.run_dir / "error.txt", trace)
        budget_path = job.run_dir / "llm_budget.json"
        llm_budget = _read_json(budget_path) if budget_path.exists() else None
        result = {
            "job_id": job.job_id,
            "status": "failed",
            "reason": f"{type(exc).__name__}: {exc}",
            "send_back_to": None,
            "rework_count": None,
            "critic_score": None,
            "run_dir": str(job.run_dir),
            "publish_dir": str(job.publish_dir),
            "finished_at": _utcnow(),
            "llm_budget": llm_budget,
        }
        _write_json(job.run_dir / "result.json", result)
        _status_line(f"job falhou com exceção não tratada: {exc}", verbose=verbose)
        return result


def _load_job_spec_file(path: Path) -> tuple[dict[str, Any], JobSpec]:
    raw = _read_json(path)
    job = JobSpec.from_dict(raw, base_dir=path.parent.resolve())
    raw = dict(raw)
    raw["job_id"] = job.job_id
    return raw, job


def command_run(args: argparse.Namespace) -> int:
    _, job = _load_job_spec_file(Path(args.job_file).resolve())
    result = run_job_safely(job, until_stage=args.until, verbose=args.verbose)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["status"] == "done" else 1


def command_enqueue(args: argparse.Namespace) -> int:
    _, job = _load_job_spec_file(Path(args.job_file).resolve())
    store = JobStore(_resolve_output_path(args.store))
    record = store.enqueue(job.to_public_dict())
    print(json.dumps(record, ensure_ascii=False, indent=2))
    return 0


def command_work_next(args: argparse.Namespace) -> int:
    store = JobStore(_resolve_output_path(args.store))
    record = store.reserve_next()
    if not record:
        print(json.dumps({"status": "idle", "message": "nenhum job pending"}, ensure_ascii=False, indent=2))
        return 0

    job = JobSpec.from_dict(record["spec"], base_dir=REPO_ROOT)
    result = run_job_safely(job, verbose=args.verbose)
    try:
        store.finish(job.job_id, status=result["status"], result=result)
    except JobNotFoundError as exc:
        print(json.dumps({"status": "error", "message": str(exc)}, ensure_ascii=False, indent=2), file=sys.stderr)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["status"] == "done" else 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Orquestrador local da Fábrica de Aulas")
    sub = parser.add_subparsers(dest="command", required=True)

    run = sub.add_parser("run", help="Executa um job diretamente a partir de um job-file JSON")
    run.add_argument("--job-file", required=True, help="Arquivo JSON com o job a executar")
    run.add_argument("--until", choices=["content_author", "full"], default="full")
    run.add_argument("--verbose", action="store_true")
    run.set_defaults(func=command_run)

    enqueue = sub.add_parser("enqueue", help="Enfileira um job num store JSON local")
    enqueue.add_argument("--job-file", required=True, help="Arquivo JSON com o job a enfileirar")
    enqueue.add_argument("--store", default=str(DEFAULT_STORE_PATH), help="Arquivo JSON da fila local")
    enqueue.set_defaults(func=command_enqueue)

    work_next = sub.add_parser("work-next", help="Processa o próximo job pending da fila local")
    work_next.add_argument("--store", default=str(DEFAULT_STORE_PATH), help="Arquivo JSON da fila local")
    work_next.add_argument("--verbose", action="store_true")
    work_next.set_defaults(func=command_work_next)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
