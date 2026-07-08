"""
Planejador de Escopo — Fábrica de Aulas v2
Responsabilidade: cortar o material-fonte em fatias menores antes do Autor de
Conteúdo, respeitando o orçamento global de conceitos por aula.

Nesta fase o Ingestor ainda não existe. O input já é markdown limpo.
O planner é determinístico: usa estrutura do markdown (seções/parágrafos) e um
heurístico simples de densidade conceitual para decidir quando uma seção
precisa ser quebrada em fatias menores.
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from fabrica.agents.content_author import MAX_CONCEPTS_PER_LESSON

HEADING_RE = re.compile(r"^(#{2,6})\s+(.+?)\s*$")
ANCHOR_RE = re.compile(r'^\s*<a id="[^"]+"></a>\s*$')
INLINE_CODE_RE = re.compile(r"`([^`]+)`")
BOLD_RE = re.compile(r"\*\*([^*]+)\*\*")
ACRONYM_RE = re.compile(r"\b[A-Z][A-Za-z0-9_.-]{2,}\b")


@dataclass
class ScopeSlice:
    slice_id: str
    title: str
    markdown: str
    estimated_concepts: int
    section_title: str
    strategy: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "slice_id": self.slice_id,
            "title": self.title,
            "markdown": self.markdown,
            "estimated_concepts": self.estimated_concepts,
            "section_title": self.section_title,
            "strategy": self.strategy,
        }


@dataclass
class _Unit:
    heading: str | None
    body_lines: list[str]
    anchor_lines: list[str]

    def markdown(self) -> str:
        parts: list[str] = []
        parts.extend(self.anchor_lines)
        if self.heading:
            parts.append(self.heading)
        parts.extend(self.body_lines)
        return "\n".join(parts).strip() + "\n"

    def title(self) -> str:
        if self.heading:
            match = HEADING_RE.match(self.heading.strip())
            if match:
                return match.group(2).strip()
        for line in self.body_lines:
            text = line.strip()
            if text:
                return text[:80]
        return "Fatia sem título"


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "fatia"


def _iter_paragraphs(lines: list[str]) -> list[list[str]]:
    paragraphs: list[list[str]] = []
    current: list[str] = []
    in_code_fence = False

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            current.append(line)
            in_code_fence = not in_code_fence
            continue

        if not in_code_fence and not stripped:
            if current:
                paragraphs.append(current)
                current = []
            continue

        current.append(line)

    if current:
        paragraphs.append(current)
    return paragraphs


def _has_body_content(unit: _Unit) -> bool:
    return any(line.strip() for line in unit.body_lines)


def _split_into_units(markdown: str) -> list[_Unit]:
    lines = markdown.splitlines()
    units: list[_Unit] = []
    preamble: list[str] = []
    pending_anchors: list[str] = []
    current: _Unit | None = None

    for line in lines:
        if ANCHOR_RE.match(line):
            if current is None:
                pending_anchors.append(line)
            else:
                current.anchor_lines.append(line)
            continue

        if HEADING_RE.match(line):
            if current is not None:
                units.append(current)
            current = _Unit(heading=line, body_lines=[], anchor_lines=pending_anchors)
            pending_anchors = []
            if preamble:
                current.body_lines = preamble + [""] + current.body_lines
                preamble = []
            continue

        if current is None:
            preamble.append(line)
        else:
            current.body_lines.append(line)

    if current is not None:
        units.append(current)
    elif preamble:
        units.append(_Unit(heading=None, body_lines=preamble, anchor_lines=pending_anchors))

    if preamble and units and units[0].heading:
        units[0].body_lines = preamble + [""] + units[0].body_lines

    return [unit for unit in units if unit.markdown().strip()]


def _compact_units(units: list[_Unit]) -> list[_Unit]:
    compacted: list[_Unit] = []
    for unit in units:
        if unit.heading and not _has_body_content(unit):
            continue
        compacted.append(unit)
    return compacted


def _extract_concept_tokens(text: str) -> list[str]:
    tokens: list[str] = []
    for match in INLINE_CODE_RE.findall(text):
        tokens.append(match.strip().lower())
    for match in BOLD_RE.findall(text):
        tokens.append(match.strip().lower())
    for raw_line in text.splitlines():
        line = raw_line.strip()
        heading = HEADING_RE.match(line)
        if heading:
            tokens.append(heading.group(2).strip().lower())
    for match in ACRONYM_RE.findall(text):
        tokens.append(match.strip().lower())
    return tokens


def estimate_concepts(markdown: str) -> int:
    seen: dict[str, None] = {}
    for token in _extract_concept_tokens(markdown):
        if token not in seen:
            seen[token] = None
    return max(1, min(len(seen), 99))


def _split_large_unit(unit: _Unit, *, concept_budget: int) -> list[_Unit]:
    paragraphs = _iter_paragraphs(unit.body_lines)
    if len(paragraphs) <= 1:
        return [unit]

    expanded: list[_Unit] = []
    for idx, paragraph in enumerate(paragraphs, start=1):
        heading = unit.heading
        if unit.heading and len(paragraphs) > 1:
            base_title = unit.title()
            heading = f"## {base_title} — parte {idx}"
        expanded.append(
            _Unit(
                heading=heading,
                body_lines=paragraph,
                anchor_lines=unit.anchor_lines if idx == 1 else [],
            )
        )

    # Se todas as partes ainda parecem densas, devolve as partes mesmo assim:
    # cada uma é menor e o orquestrador já as tratará individualmente.
    return expanded


def _merge_units(units: list[_Unit]) -> _Unit:
    merged = _Unit(
        heading=units[0].heading,
        body_lines=list(units[0].body_lines),
        anchor_lines=list(units[0].anchor_lines),
    )

    for unit in units[1:]:
        if unit.anchor_lines:
            merged.body_lines.extend([""] + unit.anchor_lines)
        if unit.heading:
            merged.body_lines.extend(["", unit.heading])
        merged.body_lines.extend(unit.body_lines)

    return merged


def plan_scopes(
    chapter_markdown: str,
    *,
    tema: str,
    objetivo: str,
    concept_budget: int = MAX_CONCEPTS_PER_LESSON,
    source_label: str | None = None,
    max_units_per_slice: int = 2,
    overflow_threshold: int | None = None,
) -> dict[str, Any]:
    units = _compact_units(_split_into_units(chapter_markdown))
    if not units:
        units = [_Unit(heading=None, body_lines=chapter_markdown.splitlines(), anchor_lines=[])]

    overflow_threshold = (
        max(concept_budget * 2, concept_budget + 4)
        if overflow_threshold is None
        else overflow_threshold
    )
    planned_units: list[tuple[_Unit, str]] = []
    for unit in units:
        estimate = estimate_concepts(unit.markdown())
        if estimate > overflow_threshold:
            for child in _split_large_unit(unit, concept_budget=concept_budget):
                planned_units.append((child, "paragraph-fallback"))
        else:
            planned_units.append((unit, "section"))

    grouped_units: list[tuple[_Unit, str]] = []
    for start in range(0, len(planned_units), max_units_per_slice):
        chunk = planned_units[start : start + max_units_per_slice]
        grouped_units.append(
            (
                _merge_units([unit for unit, _ in chunk]),
                "paragraph-fallback" if any(strategy != "section" for _, strategy in chunk) else "section",
            )
        )

    slices: list[ScopeSlice] = []
    for idx, (unit, strategy) in enumerate(grouped_units, start=1):
        title = unit.title()
        markdown = unit.markdown()
        slices.append(
            ScopeSlice(
                slice_id=f"{idx:02d}-{_slugify(title)}",
                title=title,
                markdown=markdown,
                estimated_concepts=estimate_concepts(markdown),
                section_title=unit.title(),
                strategy=strategy,
            )
        )

    return {
        "planner_agent": "scope_planner",
        "tema": tema,
        "objetivo": objetivo,
        "concept_budget": concept_budget,
        "source_label": source_label,
        "slice_count": len(slices),
        "strategy": "section-first-then-paragraph-fallback",
        "slices": [slice_.to_dict() for slice_ in slices],
    }


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Planejador de Escopo — Fábrica de Aulas")
    parser.add_argument("chapter_file", help="Arquivo markdown do material-fonte")
    parser.add_argument("--tema", required=True)
    parser.add_argument("--objetivo", required=True)
    parser.add_argument("--concept-budget", type=int, default=MAX_CONCEPTS_PER_LESSON)
    args = parser.parse_args()

    chapter = Path(args.chapter_file).read_text(encoding="utf-8")
    plan = plan_scopes(
        chapter,
        tema=args.tema,
        objetivo=args.objetivo,
        concept_budget=args.concept_budget,
        source_label=args.chapter_file,
    )
    print(json.dumps(plan, ensure_ascii=False, indent=2))
