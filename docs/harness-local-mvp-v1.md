# Harness Local da Fábrica de Aulas — MVP v1

**Status:** Decisão canônica (planejamento) · **Autoria:** claude_linux · 2026-07-02
**Task:** `agent_tasks.6c8a44ef-6216-48a2-9b69-90068f4737af` ("Lousa - A1 Arquitetura do Harness Local")
**Projeto:** lousa-arquitetura (`a17e1014`)
**Base:** `docs/fabrica-de-aulas-design-doc-v2.md` (papéis, schema, loop de qualidade, gate visual)
**Complementa:** `docs/architecture/model.c4` (elementos `lousa.localFactory2.*`) e
`docs/architecture/model.views.c4` (views `harnessInternal` e `fabricaHarnessFlow`)

Este doc não define código de plataforma nem do harness — só a arquitetura, os contratos
entre etapas e um rascunho de pseudo-código para orientar a implementação futura.

---

## 1 — Decisão: entrypoint único, módulos internos pequenos

O harness é **um único ponto de entrada local** (`fabrica/harness.py`, ainda a criar) que
chama módulos pequenos e testáveis isoladamente, em vez de orquestração distribuída via
`agent_tasks`.

**Por quê não usar `agent_tasks` para o loop interno** (correção da seção E do design-doc-v2):
a seção E do design-doc-v2 esboçou orquestração via `INSERT agent_tasks` entre cada etapa
(content_author → flowchart_adapter → …). Isso é adequado para coordenação humana/entre
agentes de longa duração, mas é o arranjo errado para o laço interno do pipeline de uma
aula: introduz latência de rede, depende do bridge estar de pé, e a próxima etapa só roda
quando *algum* agente pegar a task — não é determinístico nem replayable localmente.

O `agent_tasks`/`agent_messages` continuam tendo um papel, só que **fora** do laço interno:
1. abrir "gerar aula X" como uma `agent_task` de alto nível (unidade de trabalho visível a Lucas/outros agentes);
2. o Condenador usar `agent_messages` só para **escalar ao Lucas** quando `iteration_count > 2`.

**Por que sem LangChain:** o pipeline é um grafo quase-linear fixo (6 etapas + 1 loop de
correção com no máximo 2 iterações, sem ramificação decidida dinamicamente pelo LLM). Isso
é resolvido com funções Python puras encadeadas por um dict de estado — não há necessidade
de tool-calling dinâmico, memória multi-turno ou roteamento decidido por agente, que é onde
frameworks de agente se justificam. Se essa premissa mudar (ex.: o Adaptador precisar decidir
dinamicamente entre múltiplas estratégias de mapeamento com backtracking real), reavaliar
com prova concreta do gargalo — não antes.

**Padrão de módulo** (já estabelecido por `fabrica/agents/content_author.py`): cada etapa
expõe uma função pura `entrada_tipada -> saída_tipada`, valida a saída contra um JSON Schema
próprio, e só o `harness.py` decide o que fazer com o resultado (avançar, repetir, escalar).

---

## 2 — Etapas canônicas: nome, input, output

| # | Etapa | Módulo | Input | Output | Natureza |
|---|---|---|---|---|---|
| 1 | Ingestor | `fabrica/ingest/ingestor.py` (a criar) | PDF/DOCX/texto | `DoclingDocument` (árvore JSON) | Determinístico (Docling + pré-check pymupdf4llm) |
| 2 | Autor de Conteúdo | `fabrica/agents/content_author.py` (existe) | `DoclingDocument` + briefing | `roteiro_pedagogico.json` | LLM (Ollama) |
| 3 | Adaptador de Fluxograma | `fabrica/agents/flowchart_adapter.py` (a criar) | `roteiro_pedagogico.json` + `.c4` compilado | `roteiro_mapeado.json` | LLM + verificação determinística de FQN/aresta |
| 4 | Diretor de Apresentação | `fabrica/agents/presentation_director.py` (a criar) | `roteiro_mapeado.json` | `lesson.draft.json` | LLM |
| 5 | Crítico | `fabrica/critic/lesson_critic.py` (a criar) | `lesson.draft.json` | `critic_report.json` | LLM adversarial (modelo/temperatura diferente) |
| 6 | Condenador | `fabrica/critic/condemn.py` (a criar) | `critic_report.json` | aprovado/reprovado + destino do retrabalho | Determinístico, Python puro |
| 7 | Gate Visual | `fabrica/gates/visual_gate.py` (a criar) | `lesson.json` aprovado | liberado/bloqueado | Determinístico (Playwright) + LLM-judge (só aula nova) |

Publicação (gravar `lessons/<slug>/lesson.json`) é responsabilidade do `harness.py` após o
Gate Visual aprovar — não é uma etapa de conteúdo, é I/O do orquestrador.

---

## 3 — Artefatos intermediários: o que vale existir no MVP

**Vale persistir em disco** (debugável, retomável sem re-rodar etapas caras):
- `DoclingDocument` (ou ao menos o markdown intermediário) — reprocessar Docling é caro (até ~4 min/livro).
- `roteiro_pedagogico.json` — contrato já existe (`fabrica/schemas/roteiro_pedagogico.json`).
- `roteiro_mapeado.json` — contrato do Adaptador (schema a criar junto com o módulo).
- `lesson.draft.json` — separado de `lesson.json` final publicado, para não sujar o pacote
  da aula com versões reprovadas pelo Crítico.
- `critic_report.json` — rastreabilidade e futura análise de quais princípios falham mais.

**Não vale existir como artefato formal no MVP** (evitar sobre-engenharia):
- Screenshots do Gate Visual nível 2 — temporários, não versionados no pacote da aula.
- Cache de embeddings/índice semântico de termos técnicos para ordenação de livro inteiro
  (mencionado na seção E do design-doc-v2) — só entra quando o modo "livro inteiro" virar
  escopo real; hoje o harness roda uma aula por vez.
- Histórico completo de todas as iterações do `critic_report` — manter só a última mais um
  log simples (`iteration_count`, motivo) já embutido em `lesson.json.meta`, conforme schema
  v2 do design-doc.
- Qualquer `agent_tasks` intermediária entre etapas do laço interno (ver seção 1).

---

## 4 — Pontos de validação determinística

| Depois de | Validação | Onde mora |
|---|---|---|
| Ingestor | árvore não vazia, ≥ 1 seção — fail-fast se PDF ilegível | `ingestor.py` |
| Autor | JSON Schema (`roteiro_pedagogico.json`) já validado; falta hoje a regra ~5–7 conceitos/aula (pendência aberta no HANDOFF do Project Home) | `content_author.py::_validate` |
| Adaptador | cada FQN referenciado existe no `likec4-views.mjs` compilado; regra hard C2 (walkthrough contínuo) checada comparando a sequência de arestas do roteiro com a ordem real no `.c4` | `flowchart_adapter.py` (determinístico, sem LLM nesta parte) |
| Diretor | JSON Schema do `lesson.json` (seção D do design-doc-v2): presets válidos, `minHeight`, campos obrigatórios | `presentation_director.py` |
| Crítico → Condenador | `condemn()` já esboçado no design-doc-v2 seção C: gate duro nos princípios críticos + score mínimo 42/60 | `condemn.py` |
| Gate Visual nível 1 | Playwright DOM: atributo SVG (`viewBox`/`transform`) muda entre steps | `visual_gate.py` |
| Antes de publicar `flow.c4` novo/alterado | `npx likec4 validate docs/architecture` (já usado e verificado nesta mesma repo) | comando externo, chamado pelo `harness.py` se o Adaptador tocar `flow.c4` |

---

## 5 — Registro no LikeC4 (feito nesta task)

- `docs/architecture/model.c4`: `lousa.localFactory2` deixou de ser um componente único e
  passou a conter os 7 módulos do harness como filhos (`harnessEntry`, `ingestor`, `autor`,
  `adaptador`, `diretor`, `critico`, `condenador`, `gateVisual`), com as relações do caminho
  feliz e as 3 relações de retrabalho (`condenador -> autor/adaptador/diretor`). Adicionado
  `actor 'Lucas'` no nível raiz do model e a relação de escalação
  `lousa.localFactory2.condenador -> lucas`.
- `docs/architecture/model.views.c4`: duas views novas —
  `view harnessInternal of lousa.localFactory2` (estrutura interna completa, inclui o loop
  de retrabalho) e `dynamic view fabricaHarnessFlow` (caminho feliz, walkthrough).
- Validado: `cd lesson-app && npx likec4 validate ../docs/architecture` → `Valid (3 files)`.
- Notas de pseudo-código (abaixo) ficam neste doc, não no `.c4` — descrições dos componentes
  no `.c4` são curtas (o que a etapa faz e seu contrato); o "como" fica aqui.

---

## Apêndice — pseudo-código do orquestrador (rascunho, não implementar ainda)

```
# fabrica/harness.py — RASCUNHO, não é código a rodar

def run(source_path, tema, objetivo, nivel):
    doc            = ingestor.ingest(source_path)                 # etapa 1
    roteiro        = autor.generate_roteiro(doc, tema, objetivo, nivel)   # etapa 2

    iteration = 0
    lesson_draft = None
    while True:
        mapeado      = adaptador.map(roteiro, likec4_compiled)    # etapa 3
        lesson_draft = diretor.direct(mapeado)                    # etapa 4
        report       = critico.review(lesson_draft)               # etapa 5
        aprovado, motivo, send_back_to = condenador.condemn(report)  # etapa 6

        if aprovado:
            break

        iteration += 1
        if iteration > 2:
            agent_messages.escalate(to="lucas", motivo=motivo, lesson_draft=lesson_draft)
            return HarnessResult(status="escalated", motivo=motivo)

        # devolve para a etapa indicada por send_back_to e repete o laço
        if send_back_to == "content_author":
            roteiro = autor.generate_roteiro(doc, tema, objetivo, nivel, feedback=report)
        elif send_back_to == "flowchart_adapter":
            continue  # refaz Adaptador -> Diretor -> Crítico com o mesmo roteiro
        elif send_back_to == "presentation_director":
            continue  # idem, mapeado já existe, só refaz Diretor -> Crítico

    if not gate_visual.check(lesson_draft):                        # etapa 7
        return HarnessResult(status="visual_gate_failed", lesson=lesson_draft)

    publish(lesson_draft)  # grava lessons/<slug>/lesson.json
    return HarnessResult(status="published", lesson=lesson_draft)
```

Este pseudo-código não decide detalhes de implementação (retry parcial vs. total do laço
quando `send_back_to != content_author`, formato exato de `HarnessResult`) — fica para a
story de implementação do harness.
