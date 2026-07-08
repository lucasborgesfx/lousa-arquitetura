"""
Condenador — Fábrica de Aulas v2 (design doc v2, seção C)
Responsabilidade: decidir APROVADO/REPROVADO a partir do relatório do Crítico.

100% determinístico, SEM chamar LLM. Mesma lógica do pseudocódigo do design doc:
  - Gate duro: qualquer princípio crítico com status FAIL -> REPROVADO imediato,
    independente do score_total.
  - Score mínimo: 70% de 60 = 42. score_total < 42 -> REPROVADO.
  - Caso contrário: APROVADO.

Princípios críticos (P1, P2, P3, P7, P15, P23, P28) inegociáveis: só FAIL
reprova automaticamente por esse caminho — PARTIAL neles não reprova por
aqui (mas ainda reduz score_total, podendo reprovar pelo caminho do score).
"""
import json
import sys
from pathlib import Path

CRITICAL_PRINCIPLES = {"P1", "P2", "P3", "P7", "P15", "P23", "P28"}
MIN_SCORE = 42  # 70% de 60
ROUTE_PRIORITY = ("content_author", "flowchart_adapter", "presentation_director")


def condemn(report: dict) -> tuple[bool, str]:
    """
    Args:
        report: dict do relatório do Crítico (score_total, violations[]).

    Returns:
        (aprovado: bool, motivo: str)
    """
    for v in report["violations"]:
        if v["principle"] in CRITICAL_PRINCIPLES and v["status"] == "FAIL":
            return False, f"Reprovado: {v['principle']} (crítico) violado em {v.get('field')} — {v.get('issue')}"

    if report["score_total"] < MIN_SCORE:
        return False, f"Reprovado: score insuficiente ({report['score_total']}/60, mínimo {MIN_SCORE})"

    return True, f"Aprovado (score {report['score_total']}/60)"


def choose_send_back_to(report: dict) -> str | None:
    """
    Escolhe deterministicamente para qual papel devolver o retrabalho.

    Política:
      1. Prioriza violations com status FAIL.
      2. Entre múltiplos papéis, escolhe o mais a montante
         (content_author -> flowchart_adapter -> presentation_director),
         porque corrigir upstream absorve os ajustes downstream.
      3. Se só houver PARTIALs roteáveis, aplica a mesma prioridade.
    """
    violations = report.get("violations", [])
    for allowed_statuses in ({"FAIL"}, {"FAIL", "PARTIAL"}):
        routed = {
            v.get("send_back_to")
            for v in violations
            if v.get("status") in allowed_statuses and v.get("send_back_to") in ROUTE_PRIORITY
        }
        for target in ROUTE_PRIORITY:
            if target in routed:
                return target
    return None


def condemn_with_routing(report: dict) -> tuple[bool, str, str | None]:
    approved, reason = condemn(report)
    if approved:
        return True, reason, None
    return False, reason, choose_send_back_to(report)


# ── CLI ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Condenador — Fábrica de Aulas (determinístico, sem LLM)")
    parser.add_argument("report_file", help="Arquivo do relatório do Crítico (critic_report.json)")
    args = parser.parse_args()

    report_data = json.loads(Path(args.report_file).read_text(encoding="utf-8"))
    approved, reason = condemn(report_data)

    print(reason)
    sys.exit(0 if approved else 1)
