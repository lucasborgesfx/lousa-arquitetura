"""
Autor de Conteúdo — Fábrica de Aulas v2
Responsabilidade: O QUÊ (roteiro pedagógico, sem câmera nem LikeC4)

Provedor: Ollama (OpenAI-compatible)
Config via env:
  OLLAMA_BASE_URL  default: http://localhost:11434/v1
  OLLAMA_MODEL     default: minimax-m2.5:cloud
  OLLAMA_API_KEY   default: ollama  (Ollama ignora, mas openai client exige)
"""
import json
import os
import re
import sys
from pathlib import Path

from openai import OpenAI
from jsonschema import validate, ValidationError

# ── Paths ─────────────────────────────────────────────────────────────────────
_HERE = Path(__file__).parent
PROMPTS_DIR = _HERE.parent / "prompts"
SCHEMAS_DIR = _HERE.parent / "schemas"

SYSTEM_PROMPT_PATH = PROMPTS_DIR / "content_author_system.md"
SCHEMA_PATH        = SCHEMAS_DIR / "roteiro_pedagogico.json"

# ── Config ────────────────────────────────────────────────────────────────────
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
OLLAMA_MODEL    = os.getenv("OLLAMA_MODEL", "minimax-m2.5:cloud")
OLLAMA_API_KEY  = os.getenv("OLLAMA_API_KEY", "ollama")

MAX_RETRIES = 3  # máximo de tentativas de geração+validação


def _load_system_prompt() -> str:
    return SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")


def _load_schema() -> dict:
    return json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))


def _extract_json(text: str) -> str:
    """Extrai JSON de uma resposta que pode conter texto antes/depois."""
    # Tenta fence ```json ... ```
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if m:
        return m.group(1)
    # Tenta o primeiro { ... } de nível raiz
    start = text.find("{")
    if start == -1:
        raise ValueError("Nenhum JSON encontrado na resposta do modelo")
    # Encontra o fechamento correto contando brackets
    depth = 0
    for i, ch in enumerate(text[start:], start):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    raise ValueError("JSON malformado: sem fechamento de '}'")


def _validate(data: dict, schema: dict) -> list[str]:
    """Retorna lista de erros de validação (vazia = ok)."""
    errors = []
    try:
        validate(instance=data, schema=schema)
    except ValidationError as e:
        errors.append(e.message)
    # Regra extra: máx 3 conceitos novos por beat (CLT: carga simultânea por step)
    for beat in data.get("beats", []):
        n = len(beat.get("concepts_introduced", []))
        if n > 3:
            errors.append(
                f"Beat {beat.get('id')} introduz {n} conceitos simultâneos "
                f"(máx 3 por beat — CLT). Distribuir entre beats."
            )
    return errors


def generate_roteiro(
    chapter_markdown: str,
    tema: str,
    objetivo: str,
    nivel: str = "intermediário",
    *,
    verbose: bool = False,
) -> dict:
    """
    Gera roteiro_pedagogico.json a partir de um capítulo em markdown.

    Args:
        chapter_markdown: Texto do capítulo (markdown).
        tema:             Tema/foco da aula.
        objetivo:         O que o aluno saberá ao final (1 frase).
        nivel:            'iniciante' | 'intermediário' | 'avançado'
        verbose:          Se True, imprime progresso no stderr.

    Returns:
        dict com o roteiro validado.

    Raises:
        RuntimeError: se não conseguir gerar JSON válido após MAX_RETRIES.
    """
    client = OpenAI(base_url=OLLAMA_BASE_URL, api_key=OLLAMA_API_KEY)
    system_prompt = _load_system_prompt()
    schema = _load_schema()

    user_message = (
        f"## Capítulo de origem\n\n{chapter_markdown}\n\n"
        f"---\n\n"
        f"## Briefing\n\n"
        f"- **Tema/foco:** {tema}\n"
        f"- **Objetivo de aprendizado:** {objetivo}\n"
        f"- **Nível do aluno:** {nivel}\n\n"
        f"Produza o roteiro pedagógico completo em JSON conforme o formato do harness."
    )

    last_errors: list[str] = []
    last_raw: str = ""

    for attempt in range(1, MAX_RETRIES + 1):
        feedback = ""
        if last_errors:
            feedback = (
                "\n\n---\n\n"
                f"**Tentativa anterior ({attempt - 1}) REPROVADA.** Erros encontrados:\n"
                + "\n".join(f"- {e}" for e in last_errors)
                + "\n\nCorrigir e retornar o JSON corrigido."
            )

        if verbose:
            print(f"[content_author] tentativa {attempt}/{MAX_RETRIES}...", file=sys.stderr)

        response = client.chat.completions.create(
            model=OLLAMA_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_message + feedback},
            ],
            temperature=0.2,
            max_tokens=4096,
        )

        last_raw = response.choices[0].message.content or ""

        try:
            json_str = _extract_json(last_raw)
            data = json.loads(json_str)
        except (ValueError, json.JSONDecodeError) as exc:
            last_errors = [f"Resposta não é JSON válido: {exc}"]
            if verbose:
                print(f"[content_author] parse error: {exc}", file=sys.stderr)
            continue

        # Injeta metadados de rastreabilidade
        data.setdefault("meta", {})
        data["meta"]["author_agent"] = "content_author"
        data["meta"]["model"] = OLLAMA_MODEL

        last_errors = _validate(data, schema)
        if not last_errors:
            if verbose:
                print(f"[content_author] ✓ aprovado na tentativa {attempt}", file=sys.stderr)
            return data

        if verbose:
            print(f"[content_author] validação falhou: {last_errors}", file=sys.stderr)

    raise RuntimeError(
        f"content_author falhou após {MAX_RETRIES} tentativas.\n"
        f"Últimos erros: {last_errors}\n"
        f"Última resposta bruta (primeiros 500 chars):\n{last_raw[:500]}"
    )


# ── CLI ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Autor de Conteúdo — Fábrica de Aulas")
    parser.add_argument("chapter_file", help="Arquivo markdown do capítulo")
    parser.add_argument("--tema",     required=True, help="Tema/foco da aula")
    parser.add_argument("--objetivo", required=True, help="Objetivo de aprendizado")
    parser.add_argument("--nivel",    default="intermediário")
    parser.add_argument("--output",   help="Arquivo de saída JSON (default: stdout)")
    parser.add_argument("--verbose",  action="store_true")
    args = parser.parse_args()

    chapter = Path(args.chapter_file).read_text(encoding="utf-8")

    roteiro = generate_roteiro(
        chapter,
        tema=args.tema,
        objetivo=args.objetivo,
        nivel=args.nivel,
        verbose=args.verbose,
    )

    output_json = json.dumps(roteiro, ensure_ascii=False, indent=2)
    if args.output:
        Path(args.output).write_text(output_json, encoding="utf-8")
        print(f"Roteiro salvo em: {args.output}", file=sys.stderr)
    else:
        print(output_json)
