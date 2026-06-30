# Design Doc — Fábrica de Aulas v1

**Versão:** 1.0 · **Status:** Decisão canônica · **Autoria:** claude_linux · 2026-06-30  
**Projeto:** lousa-arquitetura (a17e1014)  
**Referência de qualidade:** UX aprovada em localhost:5175 (lesson-story4.json + walkthrough nativo)

---

## Propósito

Definir a pipeline multi-agente que converte **qualquer fonte de conteúdo** (PDF, DOCX, texto, slides) em uma **aula com UX fantástica** no player React da Lousa — de forma sistemática, replicável e sem retrabalho manual.

Restrições:
- **NÃO usar LangChain.** Consistência vem do schema + harness; orquestração já existe no bridge.
- **Lean-build**: não reinventar ingestão — usar ferramentas prontas.
- **Qualidade não é opcional**: o pipeline tem loop de crítica + condenação antes de publicar.

---

## A — Ferramentas de Ingestão (PDF → Formato Estruturado)

### Comparativo pesquisado

| Ferramenta | Entrada | Saída | PDFs complexos | GPU? | Licença |
|---|---|---|---|---|---|
| **Docling** (DS4SD/docling) | PDF, DOCX, PPTX, HTML | Markdown + JSON estruturado (DoclingDocument) | Excelente — OCR + layout analysis | CPU funcional | MIT ✅ |
| **Marker** (VikParuchuri/marker) | PDF, EPUB | Markdown | Excelente — tabelas, colunas, equações | GPU recomendado | GPL-3.0 ⚠️ |
| **pymupdf4llm** | PDF | Markdown | Boa — layouts simples/médios | CPU apenas | AGPL-3.0 |
| **Unstructured** | PDF, DOCX, HTML, PPTX, EML | JSON tipado (Title, Table, NarrativeText...) | Boa — Tesseract/PDFMiner | CPU | Apache-2.0 ✅ |
| **Zerox** | PDF, imagens | Markdown (via VLM) | Excelente | Cloud obrigatório ❌ | MIT |
| **LlamaParse** | PDF, DOCX, PPTX | Markdown, JSON | Excelente | Cloud pago ❌ | Proprietário |

### Decisão

**Engine principal: Docling**  
Roda local sem GPU obrigatória. Aceita PDF + DOCX + PPTX + HTML. Produz `DoclingDocument` — JSON com hierarquia semântica (seções, tabelas, figuras) mapeável diretamente para o JSON de aula. MIT sem restrição. API Python limpa.

**Fallback leve: pymupdf4llm**  
Para PDFs simples ou lotes de alta velocidade. Zero dependências pesadas.

**Eventual: Zerox via Anthropic API**  
Se a qualidade de OCR for crítica (PDFs escaneados/ruins) e houver budget de API.

---

## B — Arquitetura: Os 3 Papéis e o Fluxo

Os papéis são do doc de UX (lesson-ux-principles-v1.md, seção 0). Cada um é um **agente separado com harness próprio** — tarefa em `agent_tasks`, output em `task_outputs`.

```
┌──────────────────────────────────────────────────────────────────┐
│  SOURCE                                                          │
│  PDF / DOCX / PPTX / texto bruto                                │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                    [INGESTOR — Python]
                    Docling → DoclingDocument
                    Extrai: seções, tabelas, termos-chave
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  AUTOR DE CONTEÚDO (agent: content_author)                       │
│  Input: DoclingDocument + briefing do Lucas                      │
│  Output: roteiro_pedagogico.json                                 │
│                                                                  │
│  Responsabilidade: O QUÊ                                         │
│  - Aplica P1-P5 (why-before-what, overview-first, pré-treino)   │
│  - Define sequência de beats: por que → mapa → termos → fluxo   │
│  - Cada beat: {id, titulo, ideia_central, texto_markdown}        │
│  - NÃO pensa em câmera, NÃO pensa em LikeC4                    │
│  - Conhecimento: 30 princípios (seções 1-2)                     │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  ADAPTADOR DE FLUXOGRAMA (agent: flowchart_adapter)             │
│  Input: roteiro_pedagogico.json + modelo .c4 compilado          │
│  Output: roteiro_mapeado.json                                    │
│                                                                  │
│  Responsabilidade: ONDE                                          │
│  - Para cada beat: escolhe viewId + nodeId/nodeIds do LikeC4    │
│  - Define camera.preset: overview | walkthrough-start |          │
│    walkthrough | focus | cluster | consolidate                   │
│  - Para dynamic views: define walkthroughStart/End              │
│  - Verifica que os IDs existem no likec4-views.mjs compilado    │
│  - NÃO escreve conteúdo pedagógico                              │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  DIRETOR DE APRESENTAÇÃO (agent: presentation_director)         │
│  Input: roteiro_mapeado.json                                     │
│  Output: lesson.json (schema canônico do player)                 │
│                                                                  │
│  Responsabilidade: COMO                                          │
│  - Aplica P6-P30 (ritmo, câmera, acessibilidade)                │
│  - Calibra minHeight por step (P9: ~0.85vh)                     │
│  - Garante P7 (1 beat = 1 step = 1 câmera)                     │
│  - Adiciona metadados de acessibilidade (aria-labels, etc.)     │
│  - Garante que presets de câmera usam o padrão correto          │
│    (walkthrough para dynamic views, focus/cluster para estáticas)│
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
                    [LOOP DE QUALIDADE]
```

---

## C — Loop de Qualidade: Crítica + Condenação

Dois gates obrigatórios antes de publicar. Sem eles, a UX não é garantida — é improviso.

```
lesson.json
    │
    ▼
┌────────────────────────────────────────────────────────┐
│  CRÍTICO (agent: lesson_critic)                        │
│                                                        │
│  Lê lesson.json + doc 30 princípios                   │
│  Para cada princípio P1-P30: score 0-2 + justificativa│
│  Output: critic_report.json                            │
│  {                                                     │
│    "score_total": 0-60,                                │
│    "violations": [{"principle": "P7", "step": 3,       │
│      "issue": "dois conceitos no mesmo beat",          │
│      "send_back_to": "content_author"}],               │
│    "suggestions": [...]                                │
│  }                                                     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  CONDENADOR (validador binário — Python determinístico)│
│                                                        │
│  Regras de condenação (qualquer uma → REPROVADO):      │
│  - score_total < 42 (70% de 60)                        │
│  - qualquer P1, P2, P3, P7 com score = 0              │
│  - P15 violado (scroll-jacking)                        │
│  - P28 violado (sem reduced-motion)                    │
│  - P23 violado (cut entre nós distantes)              │
│                                                        │
│  Se REPROVADO:                                         │
│    - Lê "send_back_to" do Crítico                      │
│    - Cria nova task para o agente responsável          │
│    - Passa violations + suggestions como contexto     │
│    - Incrementa iteration_count                        │
│                                                        │
│  Se iteration_count > 3: escalate → Lucas             │
│  Se APROVADO: publica lesson.json                     │
└───────────────────────────┬────────────────────────────┘
                            │
                    APROVADO │ REPROVADO
                            │      │
                            ▼      └→ agent responsável
                    lesson.json        recria o step/seção
                    publicado
```

### Por que o Condenador é Python e não LLM?

Determinismo. Um LLM pode ser persuadido a "aprovar com ressalvas". O Condenador aplica regras binárias verificáveis — não raciocina, executa. O Crítico pensa; o Condenador decide.

---

## D — Formato de Saída (Schema Estendido)

Baseado em `lesson-engine-schema.v1` + adições da Story 4.

```json
{
  "id": "lesson-003",
  "title": "string",
  "description": "string",
  "version": "string",
  "source": {
    "file": "caminho/relativo.pdf",
    "ingestor": "docling | pymupdf4llm",
    "ingested_at": "ISO8601"
  },
  "viewId": "string | null",
  "walkthroughStart": "number | null",
  "walkthroughEnd": "number | null",
  "steps": [
    {
      "id": "step-01",
      "label": "string",
      "camera": {
        "preset": "overview | focus | focus-expanded | cluster | walkthrough-start | walkthrough | consolidate",
        "node": "fqn-string | null",
        "nodes": ["fqn-string"] 
      },
      "content": "string (markdown inline)"
    }
  ],
  "meta": {
    "author_agent": "content_author",
    "adapter_agent": "flowchart_adapter",
    "director_agent": "presentation_director",
    "critic_score": 52,
    "iteration_count": 1,
    "approved_at": "ISO8601"
  }
}
```

**Novas adições vs schema v1:**
- `source` — rastreabilidade da origem (qual arquivo, qual ingestor)
- `viewId` + `walkthroughStart/End` — suporte a dynamic views com walkthrough nativo
- `camera.preset` expandido com `walkthrough-start`, `walkthrough`, `consolidate`
- `meta` — audit trail: quais agentes produziram, score do Crítico, iterações

**Compatibilidade retroativa:** campos novos são opcionais. Aulas antigas (Story 3 schema) continuam funcionando no player.

---

## E — Escalabilidade: Novas Aulas sem Retrabalho

### Template de nova aula

Para criar uma aula nova, Lucas (ou Eddie) cria uma task assim:

```yaml
title: "Criar aula: <tema>"
to_agent: content_author
instructions: |
  Fonte: /caminho/do/arquivo.pdf
  Tema: <descrição do que a aula deve ensinar>
  View LikeC4 alvo: <viewId ou null se não souber>
  Nível do aluno: intermediário / iniciante / avançado
  Número de steps alvo: 8-12
context: |
  Referência de qualidade: lesson-story4.json (14 steps, walkthrough nativo)
  Doc UX: knowledge 4cea5329
  Schema: knowledge 2b84d664
```

O pipeline executa automaticamente: Ingestor → Autor → Adaptador → Diretor → Crítico → Condenador → publicação.

### Harness de orquestração

Cada agente lê sua task de `agent_tasks`, escreve em `task_outputs`, e ao finalizar **cria a próxima task** para o agente seguinte com `context` contendo o output atual. O Condenador fecha o loop ou escala.

```
content_author (done) → cria task flowchart_adapter com roteiro_pedagogico_id
flowchart_adapter (done) → cria task presentation_director com roteiro_mapeado_id  
presentation_director (done) → cria task lesson_critic com lesson_json_id
lesson_critic (done) → Condenador lê critic_report, decide
```

Nenhuma orquestração central LLM — só tasks no Supabase + agentes Python/Claude executando sequencialmente. Escalável: N aulas em paralelo são N conjuntos de tasks.

### Reuso entre aulas

- **Views LikeC4 fixas** → reutilizadas. Uma nova aula pode usar `flow`, `index`, `hybrid` sem recriar o diagrama.
- **Princípios (30 regras)** → fixture do Crítico. Imutáveis. Nova aula = mesmo Crítico.
- **Schema** → versionado. Mudanças são backward-compatible (campos opcionais).
- **Player React** → agnóstico a conteúdo. Qualquer `lesson.json` válido funciona.

---

## Decisões registradas

| Decisão | Motivo |
|---|---|
| NÃO usar LangChain | Consistência vem do schema+harness; orquestração já existe no bridge |
| Docling como ingestor | MIT, roda local, JSON estruturado, suporte PDF+DOCX+PPTX |
| Condenador é Python determinístico | LLM pode ser persuadido; regras binárias não |
| 3 agentes separados (Autor/Adaptador/Diretor) | Misturar "o quê" + "onde" + "como" é o que produz aula "vagabunda" |
| Loop máximo de 3 iterações | Após 3, o problema é de arquitetura — escalate humano |
| Schema estendido backward-compatible | Aulas antigas continuam funcionando |

---

## O que este doc NÃO define (próximas stories)

- Implementação do `content_author` (prompts, few-shots, schema de output)
- Implementação do `flowchart_adapter` (mapeamento nó→FQN automatizado)
- Implementação do `lesson_critic` (rubrica automatizada dos 30 princípios)
- Implementação do Condenador Python
- Interface de upload de PDF (requisito futuro do Lucas — #1)
- Testes de regressão de UX (smoke test após cada publicação)
