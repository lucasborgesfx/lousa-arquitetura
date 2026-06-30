# Design Doc — Fábrica de Aulas v2

**Versão:** 2.0 · **Status:** Decisão canônica · **Autoria:** claude_linux · 2026-06-30  
**Supersede:** v1 (26b07fd5)  
**Projeto:** lousa-arquitetura (a17e1014)  
**Referência de qualidade:** UX aprovada em localhost:5175 (lesson-story4.json + walkthrough nativo)

**Síntese de 4 subagentes dedicados:**
- S1: Docling vs Unstructured vs pymupdf4llm para livros longos (benchmarks verificados)
- S2: Padrões multi-agente de crítica/refino (Self-Refine, Reflexion, Critic-Actor, LLM-as-Judge)
- S3: Validação visual UX automatizável (Playwright DOM inspection, LLM-as-judge visual)
- S4: Chunking de livro técnico longo em aulas navegáveis (literatura pedagógica verificada)

---

## Correções obrigatórias da v1

### C1 — Validação Visual é gate real, não escopo futuro

A v1 delegou validação visual para "próximas stories". **Errado.** A câmera andando pelas arestas é o comportamento central do produto — sem gate que confirme isso, qualquer publicação é risco. C1 está resolvido na seção F deste doc.

### C2 — Adaptador de Fluxograma deve gerar dynamic view CONTÍNUA

A v1 não impunha restrição sobre o tipo de view mapeada. Resultado: qualquer aula que o Adaptador produza usando views estáticas diferentes por step herda o bug "troca de fluxo" (corte seco de viewId), o bug original da Story 3. C2 está resolvido na seção B como regra hard do harness.

---

## A — Ingestão (PDF → Formato Estruturado)

### Comparativo com benchmarks reais (junho/2026)

| Ferramenta | Score geral | Headings F1 | Tabelas TEDS | Velocidade (200p) | RAM pico | Licença |
|---|---|---|---|---|---|---|
| **Docling** | **0.877–0.882** | **0.824** | **0.887** | ~152s | 2.4–6.2 GB | MIT ✅ |
| Unstructured | 0.788–0.841 | 0.749 | 0.588–0.701 | ~600s | 2–10+ GB | Apache-2.0 ✅ |
| pymupdf4llm | 0.732–0.802 | 0.412 | 0.401–0.612 | **~18s** | < 1 GB | AGPL-3.0 ⚠️ |

Fontes: Procycons PDF Benchmark 2025, bswen.com benchmark junho/2026, arXiv 2408.09869v5.

### Decisão: Docling como engine, pymupdf4llm como pré-validação

**Docling** é o único com saída JSON em árvore (`body → grupos → seções → parágrafos`), pronta para chunking semântico por capítulo sem pós-processamento heroico. Melhor em headings (crítico para livros com H1/H2/H3), melhor em tabelas complexas, preserva TOC fielmente. MIT.

```python
from docling.document_converter import DocumentConverter
converter = DocumentConverter()
doc = converter.convert("livro.pdf").document
tree   = doc.export_to_dict()    # árvore: body → seções → parágrafos
md     = doc.export_to_markdown()
```

**pymupdf4llm como pré-validação rápida (18s/200p):** detectar se o PDF é nativo (não escaneado) antes de rodar Docling. Se o pymupdf4llm extrair texto coerente, o PDF é processável. Se não, acionar Docling com OCR habilitado.

**Gap conhecido (nenhum resolve):** blocos de código perdem a language tag (```python → ```). Pós-processamento: heurística por palavras-chave de sintaxe ou chamada LLM leve para classificar linguagem.

### Capacidade para livros longos (VERIFIED — S1)

- Sem limite hard de páginas; RAM é o gargalo (até 6.2 GB para livros pesados)
- 300 páginas: ~3.8 minutos, ~5 GB RAM — aceitável em pipeline batch
- TOC preservado fidelmente — serve como esqueleto de chunking por capítulo

---

## B — Arquitetura: 3 Papéis + Regras de Harness

### Fluxo completo

```
SOURCE (PDF / DOCX / PPTX / texto)
    │
    ▼
[INGESTOR — Python]
Pré-check: pymupdf4llm (~18s) → PDF nativo? → sim: Docling full
                                              → não: Docling + OCR
Saída: DoclingDocument (árvore JSON)
    │
    ▼
[AUTOR DE CONTEÚDO — agent: content_author]
Input:  DoclingDocument + briefing (tema, nível, view LikeC4 alvo)
Output: roteiro_pedagogico.json
        {beats: [{id, titulo, ideia_central, texto_markdown,
                  concepts_introduced: []}]}

Responsabilidade: O QUÊ
  - P1-P5: why-before-what, overview-first, pré-treino, fecho
  - Chunking por capítulo: ≤6 conceitos novos OU ≤4 nós novos por aula
  - Cada beat = 1 ideia atômica (P7)
  - 12 min / 20 máx steps por aula
  - Preenche concepts_introduced[] por beat
  - Gera 1 step recap no início se há aula anterior no mesmo livro
  - NÃO pensa em câmera nem em LikeC4
    │
    ▼
[ADAPTADOR DE FLUXOGRAMA — agent: flowchart_adapter]
Input:  roteiro_pedagogico.json + modelo .c4 compilado (likec4-views.mjs)
Output: roteiro_mapeado.json

Responsabilidade: ONDE
  - Para aulas baseadas em fluxo: DEVE usar dynamic view existente
    ┌─────────────────────────────────────────────────────────────┐
    │  REGRA HARD (C2): dynamic view → walkthrough CONTÍNUO       │
    │  - A sequência de beats DEVE seguir a ordem das arestas     │
    │    da dynamic view (aresta 1 → aresta 2 → … aresta N)       │
    │  - É PROIBIDO saltar arestas ou misturar múltiplas views    │
    │  - Verificação obrigatória: para cada step com preset       │
    │    "walkthrough", o Adaptador DEVE confirmar que a aresta    │
    │    correspondente existe no .c4 na posição correta           │
    │  - Se o conteúdo não mapeia para uma dynamic view contínua: │
    │    usar view estática (focus/cluster) — nunca simular        │
    │    walkthrough com troca de viewId                           │
    └─────────────────────────────────────────────────────────────┘
  - Para aulas baseadas em nós: focus/cluster em view estática
  - Define viewId, walkthroughStart/End (se dynamic)
  - Verifica FQNs existem no likec4-views.mjs compilado
  - NÃO escreve conteúdo pedagógico
    │
    ▼
[DIRETOR DE APRESENTAÇÃO — agent: presentation_director]
Input:  roteiro_mapeado.json
Output: lesson.json (schema canônico)

Responsabilidade: COMO
  - P6-P30: ritmo, câmera, acessibilidade
  - minHeight: 85vh por step (P9)
  - presets corretos: walkthrough para dynamic, focus/cluster para estáticas
  - aria-labels, reduced-motion suportado
  - NÃO reescreve conteúdo pedagógico
    │
    ▼
[LOOP DE QUALIDADE — seção C]
    │
    ▼
[GATE VISUAL — seção F]
    │
    ▼
lesson.json publicado
```

---

## C — Loop de Qualidade: Crítica + Condenação

### Padrão: Constitutional AI + Critic-Actor + LLM-as-Judge gate

Decisão baseada em S2 (literaturas verificadas: Madaan NeurIPS 2023, Shinn NeurIPS 2023, Du ICML 2024, Zheng NeurIPS 2023, Bai Anthropic 2022).

**Por que esse conjunto:**
- Temos rubrica explícita (30 princípios) → Constitutional AI aproveita rubricas operacionais
- Queremos gate de qualidade, não só melhora → LLM-as-Judge como decisor final
- Maior risco = sycophancy → separação de modelos + prompt adversarial

### Estrutura do Crítico

```python
# Modelo diferente do Gerador OU mesma família com temperatura baixa
# Gerador: claude-sonnet-4-6 (T=0.7)
# Crítico:  claude-opus-4-8  (T=0.15)   ← diferente para reduzir sycophancy
```

**Prompt do Crítico (estrutura obrigatória):**
```
Para cada um dos 30 princípios UX abaixo, avalie o lesson.json:

1. Status: [PASS | PARTIAL | FAIL]
2. Se PARTIAL ou FAIL: cite o campo exato do lesson.json (ex: steps[3].content)
   e descreva a violação em uma frase concisa.
3. Se FAIL: forneça instrução de reescrita específica para aquele campo.
4. Indique send_back_to: content_author | flowchart_adapter | presentation_director

REGRA ANTI-SYCOPHANCY OBRIGATÓRIA:
Você DEVE encontrar pelo menos 3 FAILs ou PARTIALs.
Se não encontrar, você não está olhando com rigor suficiente.

Princípios críticos (FAIL automático → REPROVADO imediato):
P1 (overview-first), P2 (why-before-what), P3 (pré-treino),
P7 (1 beat = 1 ideia), P15 (sem scroll-jacking), P23 (sem cut entre nós distantes),
P28 (prefers-reduced-motion)
```

**Output do Crítico:**
```json
{
  "score_total": 0-60,
  "violations": [
    {
      "principle": "P7",
      "step": 3,
      "field": "steps[3].content",
      "issue": "dois conceitos distintos no mesmo beat",
      "instruction": "dividir em dois steps separados: primeiro o conceito A, depois o B",
      "send_back_to": "content_author"
    }
  ],
  "suggestions": []
}
```

### Condenador (Python determinístico)

```python
def condemn(report: dict) -> tuple[bool, str]:
    # Gate duro: princípios inegociáveis
    critical = {"P1", "P2", "P3", "P7", "P15", "P23", "P28"}
    for v in report["violations"]:
        if v["principle"] in critical and v["status"] == "FAIL":
            return False, f"Reprovado: {v['principle']} violado em {v['field']}"
    
    # Score mínimo: 70% de 60
    if report["score_total"] < 42:
        return False, f"Score insuficiente: {report['score_total']}/60"
    
    return True, "Aprovado"
```

**Loop:**
- APROVADO → segue para Gate Visual
- REPROVADO → cria nova `agent_task` para `send_back_to` com violations como contexto
- `iteration_count > 2` → escalate Lucas (não 3 — S2 mostra ganho marginal após iteração 2)

---

## D — Schema de Saída v2

Backward-compatible com v1 (todos os campos novos são opcionais).

```json
{
  "id": "lesson-003",
  "title": "string",
  "description": "string",
  "version": "string",
  "source": {
    "file": "caminho/relativo.pdf",
    "ingestor": "docling | pymupdf4llm",
    "ingested_at": "ISO8601",
    "chapter": "3.2",
    "book_lesson_index": 2
  },
  "viewId": "flow | index | hybrid | null",
  "walkthroughStart": 1,
  "walkthroughEnd": 12,
  "steps": [
    {
      "id": "step-01",
      "label": "string",
      "camera": {
        "preset": "overview | focus | focus-expanded | cluster | walkthrough-start | walkthrough | consolidate",
        "node": "fqn-string | null",
        "nodes": ["fqn-string"]
      },
      "content": "string (markdown inline)",
      "concepts_introduced": ["termo-A", "termo-B"]
    }
  ],
  "meta": {
    "author_agent": "content_author",
    "adapter_agent": "flowchart_adapter",
    "director_agent": "presentation_director",
    "critic_model": "claude-opus-4-8",
    "critic_score": 52,
    "iteration_count": 1,
    "visual_gate": "playwright-dom | llm-judge | human-checklist",
    "approved_at": "ISO8601"
  }
}
```

**Adições v2 vs v1:**
- `source.chapter`, `source.book_lesson_index` — rastreabilidade em livros com múltiplas aulas
- `steps[].concepts_introduced[]` — metadado pedagógico para coerência entre aulas
- `meta.critic_model` — qual modelo fez a crítica (rastreabilidade de sycophancy)
- `meta.visual_gate` — qual gate visual foi usado antes de publicar

---

## E — Escalabilidade: Novas Aulas sem Retrabalho

### Chunking de livro longo (S4 — VERIFIED via literatura)

Heurísticas implementáveis pelo Autor de Conteúdo:

| Dimensão | Limite | Fonte |
|---|---|---|
| Steps por aula | 12 mín — 20 máx | Merrill 2002 (módulos ~10-20 min) |
| Conceitos novos por aula | ≤ 6 | Sweller CLT (4 elementos working memory) |
| Nós LikeC4 novos por aula | ≤ 4 | Derivado de CLT |
| Páginas por aula | ≤ 15 → dividir | Heurística operacional |
| Recap entre aulas | 1 step obrigatório se gap > 2 aulas | Spaced retrieval (Roediger & Butler 2011) |

**Ordem pedagógica de livro:**
1. Extrair termos técnicos por capítulo (TF-IDF ou LLM)
2. Mapear primeira ocorrência de cada termo
3. Grafo dirigido: capítulo A → B se B usa termos definidos em A
4. Ordenação topológica = ordem de apresentação

**Quando capítulo → múltiplas aulas:** quando `conceitos novos > 6` OU `nós novos > 4` — criar fronteira antes do 5º nó/7º conceito. Cada sub-aula começa com recap do último nó adicionado.

### Template de nova aula

```yaml
title: "Criar aula: <tema>"
to_agent: content_author
instructions: |
  Fonte: /caminho/do/arquivo.pdf
  Capítulo(s): 3, 3.1, 3.2
  Tema: <descrição>
  View LikeC4 alvo: flow  # null se não souber
  Nível: intermediário
  Aula anterior: lesson-002 (concepts_introduced disponíveis em task_outputs)
context: |
  Referência: lesson-story4.json (14 steps, walkthrough nativo)
  Doc UX: knowledge 4cea5329
  Schema: este doc, seção D
```

### Harness de orquestração

```
content_author (done)
  → INSERT agent_tasks (to: flowchart_adapter, context: {roteiro_id})

flowchart_adapter (done)
  → INSERT agent_tasks (to: presentation_director, context: {mapeado_id})

presentation_director (done)
  → INSERT agent_tasks (to: lesson_critic, context: {lesson_id})

lesson_critic (done)
  → Condenador.py lê critic_report
  → APROVADO: INSERT agent_tasks (to: visual_gate_runner)
  → REPROVADO: INSERT agent_tasks (to: send_back_to, context: violations)
  → iteration_count > 2: INSERT agent_messages (to: lucas, escalate)

visual_gate_runner (done + approved)
  → publica lesson.json
```

---

## F — Validação Visual (C1 resolvido)

**Este gate é OBRIGATÓRIO antes de publicar.** Não é escopo futuro.

### Nível 1 — CI automático: Playwright DOM inspection (custo ~$0)

A câmera do LikeC4 walkthrough muta atributos SVG (`transform` ou `viewBox`) ao animar. Um teste determinístico verifica que esses atributos mudaram após cada scroll step.

```typescript
// gate-visual.spec.ts
test('câmera percorre arestas', async ({ page }) => {
  await page.goto('http://localhost:5175');
  
  // Descobrir qual atributo muda — fazer uma vez por versão do LikeC4:
  // inspecionar DOM após scroll e identificar o atributo que muda
  const getCameraState = () => page.$eval(
    '[data-likec4-diagram] svg',
    el => el.getAttribute('viewBox') ?? el.style.transform
  );
  
  const before = await getCameraState();
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(700); // aguardar animação
  const after = await getCameraState();
  
  expect(after).not.toEqual(before); // câmera se moveu
});
```

**Setup necessário (30 min de trabalho):** inspecionar o DOM do LikeC4 em runtime para identificar qual atributo SVG muda ao fazer walkthrough. Depois, a assertion é determinística e roda em < 10s.

### Nível 2 — Pre-publish: LLM-as-judge visual (~$0.50/aula)

Para cada aula nova antes da primeira publicação:

```python
import anthropic
from playwright.sync_api import sync_playwright
import base64

def visual_gate(lesson_url: str, checkpoints: list[int]) -> bool:
    """Tira screenshots em N scroll positions, passa pares para Claude."""
    client = anthropic.Anthropic()
    
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(lesson_url)
        
        screenshots = []
        for y in checkpoints:
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(700)
            screenshots.append(page.screenshot())
        
        browser.close()
    
    # Verificar que câmera se moveu entre cada par de screenshots
    for i in range(len(screenshots) - 1):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=200,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64",
                      "media_type": "image/png",
                      "data": base64.b64encode(screenshots[i]).decode()}},
                    {"type": "image", "source": {"type": "base64",
                      "media_type": "image/png",
                      "data": base64.b64encode(screenshots[i+1]).decode()}},
                    {"type": "text", "text":
                      "O diagrama de arquitetura (coluna direita) mudou entre "
                      "a imagem 1 e a imagem 2? Responda: SIM ou NÃO. "
                      "Se SIM, descreva brevemente o que mudou no diagrama."}
                ]
            }]
        )
        answer = response.content[0].text
        if answer.startswith("NÃO"):
            return False  # câmera não se moveu — gate falhou
    
    return True
```

### Nível 0 — Fallback humano (enquanto Playwright não estiver configurado)

```
Checklist de 5 pontos (2 minutos):
[ ] 1. Scroll lento do topo ao fim — câmera viajou visivelmente?
[ ] 2. Parar em 3 steps marcados — texto e diagrama estão em sync?
[ ] 3. Redimensionar para 1280px — layout não quebrou?
[ ] 4. DevTools > Console — zero erros JS?
[ ] 5. Scroll reverso do fim ao início — câmera voltou pelo caminho?
```

### Integração na pipeline

```
presentation_director → lesson.json
    ↓
Condenador.py (JSON/lógica)
    ↓ APROVADO
visual_gate_runner
    ├─ CI: Playwright DOM inspection (roda sempre, < 10s)
    └─ Pre-publish: LLM-as-judge visual (roda só em aulas novas, ~30s)
    ↓ GATE VISUAL APROVADO
lesson.json publicado
```

---

## G — Decisões Registradas

| Decisão | Motivo | Fonte |
|---|---|---|
| NÃO usar LangChain | Consistência vem do schema+harness; orquestração já existe no bridge | Restrição do projeto |
| Docling como ingestor | Melhor score em benchmarks reais, árvore JSON nativa, MIT | S1 (arXiv 2408.09869v5, Procycons 2025) |
| pymupdf4llm como pré-check | 18s/200p para detectar PDF nativo antes de rodar Docling pesado | S1 (bswen.com benchmark) |
| Constitutional AI + adversarial prompt | Rubricas explícitas + anti-sycophancy ("deve encontrar 3 FAILs") | S2 (Bai 2022, Zheng 2023) |
| Crítico com modelo diferente/temperatura baixa | Reduz sycophancy inter-modelo | S2 (Du ICML 2024) |
| Feedback campo-a-campo no lesson.json | Feedback global ("pode melhorar") não é acionável | S2 (HYPOTHESIS validado) |
| Máximo 2 iterações (não 3) | Ganho marginal após iteração 2 nos benchmarks | S2 (Madaan NeurIPS 2023) |
| Playwright DOM inspection como gate CI | Determinístico, custo zero, < 10s | S3 |
| LLM-as-judge visual como gate pre-publish | Semântico, ignora ruído de anti-aliasing, ~$0.50/aula | S3 (HYPOTHESIS com alta confiança) |
| Regra hard C2: dynamic view = walkthrough contínuo | Sem isso, toda aula herda o bug "troca de fluxo" da Story 3 | Diagnóstico Story 4 |
| ≤6 conceitos / ≤4 nós novos por aula | CLT working memory limit | S4 (Sweller 1988, Merrill 2002) |
| concepts_introduced[] por step | Rastreabilidade cross-aula, evita re-ensino | S4 (Roediger & Butler 2011) |
| Recap step obrigatório se gap > 2 aulas | Spaced retrieval | S4 |

---

## H — O que este doc NÃO define (próximas stories)

- Prompts completos e few-shots do `content_author` (Story 2 da Fábrica)
- Lógica de mapeamento FQN automático no `flowchart_adapter`
- Implementação completa do `lesson_critic` (rubrica automatizada dos 30 princípios)
- Implementação do `Condenador.py` (esqueleto na seção C, falta wiring completo)
- Interface de upload de PDF para Lucas
- Spaced retrieval entre sessões (reminders de revisão)
