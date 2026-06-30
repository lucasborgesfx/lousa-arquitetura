# Design Doc — Schema Canônico do Sistema de Aulas da Lousa

**Versão:** 1.0  
**Status:** Decisão canônica  
**Autoria:** claude_linux · 2026-06-29  
**Referência:** Story 1 · task `7971cac8`

---

## 1. Princípio de design

A lousa separa dois papéis completamente:

| Papel | Quem escreve | O que produz |
|---|---|---|
| **Engine** | desenvolvedor (Story 2+) | motor que lê uma aula e executa os steps |
| **Author** | agente-autor (Story 3+) | arquivo JSON de aula usando o vocabulário canônico |

O engine nunca sabe "o que a aula ensina". O agente-autor nunca sabe "como o iframe funciona". Este doc define a fronteira entre os dois.

---

## 2. Camera Presets — conjunto finito e canônico

Um **preset** descreve a intenção visual da câmera do LikeC4, não os parâmetros técnicos. O engine traduz preset → API nativa do LikeC4 (fit-to-node, fitDiagram, etc). O autor usa só o nome do preset.

| Preset | Intenção | `node` obrigatório? | Caso de uso típico |
|---|---|---|---|
| `overview` | Tudo visível, diagrama inteiro cabe na tela. Estado inicial de qualquer view. | Não | Introdução de uma aula, contexto geral |
| `focus` | Um nó ocupa ~50% do viewport, centralizado, rótulo legível. | Sim | "Este é o X. Ele faz Y." |
| `focus-expanded` | Um nó + seus filhos diretos visíveis. Nó no topo, filhos ao redor. | Sim | "X é composto por estas partes." |
| `cluster` | Viewport encaixado no bounding box de um conjunto nomeado de nós. | Sim (`nodes: [...]`) | "Veja como A, B e C se relacionam." |
| `detail` | Zoom máximo num nó único — preenche o viewport, metadados legíveis. | Sim | Aprofundamento final de um componente |

> **Regra lean**: os 5 presets cobrem 100% dos casos esperados. Nenhum novo preset deve ser criado sem evidência de um caso concreto não coberto.

---

## 3. Schema declarativo de um STEP

Um step é **a unidade atômica de uma aula**: um par sincronizado (posição de markdown ↔ estado de câmera do LikeC4).

### Schema JSON de step

```json
{
  "id": "step-01",
  "label": "Visão geral do ecossistema",
  "view": "index",
  "camera": {
    "preset": "overview"
  },
  "markdown": {
    "file": "content/overview.md",
    "anchor": null
  }
}
```

```json
{
  "id": "step-03",
  "label": "A camada sistêmica do Mind",
  "view": "systemic",
  "camera": {
    "preset": "focus-expanded",
    "node": "mind.systemic"
  },
  "markdown": {
    "file": "content/mind-runtime.md",
    "anchor": "#camada-de-código-sistêmico"
  }
}
```

```json
{
  "id": "step-05",
  "label": "Como A, B e C se encaixam",
  "view": "hybrid",
  "camera": {
    "preset": "cluster",
    "nodes": ["braide", "harness", "supabase"]
  },
  "markdown": {
    "file": "content/hybrid.md",
    "anchor": "#três-fronteiras"
  }
}
```

### Campos do step

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | string | sim | Identificador único dentro da aula (`step-NN`) |
| `label` | string | sim | Título curto para a barra de navegação |
| `view` | string | sim | ID da view LikeC4 (deve existir no `.c4`) |
| `camera.preset` | enum | sim | Um dos 5 presets canônicos |
| `camera.node` | string | condicional | ID do elemento LikeC4 (obrigatório para `focus`, `focus-expanded`, `detail`) |
| `camera.nodes` | string[] | condicional | IDs dos elementos (obrigatório para `cluster`) |
| `markdown.file` | string | sim | Caminho relativo ao arquivo `.md` |
| `markdown.anchor` | string \| null | sim | Âncora CSS (`#heading-id`) ou `null` para o topo |

---

## 4. Schema de uma AULA

Uma aula é uma sequência ordenada de steps com metadados de apresentação.

```json
{
  "id": "lesson-001",
  "title": "Panorama do Mind — do nada ao ecossistema",
  "description": "Visão geral dos 4 blocos principais em 6 passos.",
  "version": "1.0",
  "steps": [
    {
      "id": "step-01",
      "label": "Introdução",
      "view": "index",
      "camera": { "preset": "overview" },
      "markdown": { "file": "content/overview.md", "anchor": null }
    },
    {
      "id": "step-02",
      "label": "O Mind Runtime",
      "view": "mind",
      "camera": { "preset": "focus", "node": "mind" },
      "markdown": { "file": "content/mind-runtime.md", "anchor": null }
    },
    {
      "id": "step-03",
      "label": "Camada sistêmica",
      "view": "systemic",
      "camera": { "preset": "focus-expanded", "node": "mind.systemic" },
      "markdown": { "file": "content/mind-runtime.md", "anchor": "#camada-de-código-sistêmico" }
    },
    {
      "id": "step-04",
      "label": "O Supabase como data plane",
      "view": "continuity",
      "camera": { "preset": "overview" },
      "markdown": { "file": "content/overview.md", "anchor": "#o-supabase-como-data-plane" }
    },
    {
      "id": "step-05",
      "label": "As quatro fronteiras",
      "view": "hybrid",
      "camera": { "preset": "cluster", "nodes": ["braide", "harness", "python", "supabase"] },
      "markdown": { "file": "content/overview.md", "anchor": "#os-quatro-blocos-principais" }
    },
    {
      "id": "step-06",
      "label": "O fluxo ponta a ponta",
      "view": "flow",
      "camera": { "preset": "overview" },
      "markdown": { "file": "content/overview.md", "anchor": "#como-a-arquitetura-flui" }
    }
  ]
}
```

### Campos da aula

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Identificador único da aula |
| `title` | string | Título exibido na lousa |
| `description` | string | Resumo de 1 linha para o índice de aulas |
| `version` | string | Controle de versão do conteúdo |
| `steps` | Step[] | Array ordenado de steps (mínimo 1) |

---

## 5. State machine linear — next() / prev()

```
Estados: IDLE | PRESENTING

IDLE
  └─ start(lesson) ──→ PRESENTING
                        currentIndex = 0
                        render(steps[0])

PRESENTING
  ├─ next()  → currentIndex = min(currentIndex + 1, steps.length - 1)
  │             render(steps[currentIndex])
  ├─ prev()  → currentIndex = max(currentIndex - 1, 0)
  │             render(steps[currentIndex])
  ├─ goto(n) → currentIndex = clamp(n, 0, steps.length - 1)
  │             render(steps[currentIndex])
  └─ exit()  ──→ IDLE

render(step):
  1. Navegar iframe para view: applyView(step.view)
  2. Aplicar preset: applyCamera(step.camera)
  3. Carregar markdown: loadMarkdown(step.markdown.file, step.markdown.anchor)
  4. Atualizar nav: updateNav(currentIndex, steps.length, step.label)
```

O estado da machine é **ephemeral** (memória do browser, sem persistência). Entre sessões, a aula começa do step-01.

---

## 6. Mapeamento de presets → LikeC4 nativo

O engine chama a API nativa do LikeC4; **não cria animação própria**.

| Preset | Ação LikeC4 pretendida | API provável (verificar na Story 2) |
|---|---|---|
| `overview` | Fit all: encaixa todo o diagrama | `fitDiagram()` / URL sem fragmento |
| `focus` | Fit to element | `fitElement(node_id)` via postMessage ou URL `#node_id` |
| `focus-expanded` | Fit to element + filhos | `fitElement(node_id, { includeChildren: true })` |
| `cluster` | Fit to bounding box de múltiplos elementos | `fitElements([id1, id2, ...])` |
| `detail` | Fit to element com padding mínimo | `fitElement(node_id, { padding: 4 })` |

> **GAP verificado para Story 2:** O LikeC4 web viewer (`likec4 start`) pode ou não expor uma API postMessage para câmera. Caminhos alternativos: (a) URL hash com parâmetros de câmera, (b) monkeypatch do React component via iframe eval (não preferido), (c) migrar de iframe para componente React embutido usando `likec4 generate react`. A Story 2 decide.

---

## 7. Vocabulário fechado do agente-autor

O agente-autor de aulas usa **apenas estas palavras** ao escrever uma aula. Nada mais.

```
view        → ID de uma view definida no arquivo .c4
preset      → overview | focus | focus-expanded | cluster | detail
node        → ID de um elemento LikeC4 (ex: "mind.systemic")
nodes       → lista de IDs de elementos (para preset cluster)
file        → caminho relativo a um arquivo .md (ex: "content/overview.md")
anchor      → âncora de seção no markdown (ex: "#camada-sistêmica") ou null
label       → texto curto para o botão de navegação (max 40 chars)
id          → identificador único do step (formato "step-NN")
title       → título da aula (exibido no header)
description → resumo de 1 linha (para índice de aulas)
steps       → lista ordenada de steps
```

O agente-autor **não conhece** e **não escreve**:
- Coordenadas de câmera (x, y, zoom)
- Parâmetros de API do LikeC4
- Lógica de renderização do iframe
- CSS ou código de animação

---

## 8. Views LikeC4 disponíveis no spike atual

Para referência do agente-autor ao criar aulas com o modelo atual:

| view ID | Título | Foco |
|---|---|---|
| `index` | Panorama do Mind | Ecossistema completo |
| `mind` | Mind Runtime | Sistema Mind isolado |
| `systemic` | Camada de Código Sistêmico | mind.systemic + contexto |
| `continuity` | Trilha de Continuidade Operacional | supabase + consumidores |
| `blueprint` | Fronteira Blueprint vs Runtime | likec4 + interfaces |
| `snapshots` | Pipeline de Publicação de Snapshot | mind.blueprint completo |
| `hybrid` | Desenho Híbrido | Braide + Harness + Python + Supabase |
| `flow` | Fluxo ponta a ponta | Dynamic view (sequência) |

---

## 9. O que este doc NÃO decide (fica para Story 2)

- Como exatamente o engine envia comandos de câmera ao iframe LikeC4 (postMessage vs URL vs React component embutido)
- Formato do arquivo de aula no sistema de arquivos (`.lesson.json` vs diretório com `lesson.json`)
- Interface do picker de aulas na lousa (dropdown no header vs página de índice)
- Persistência do `currentIndex` entre recargas
