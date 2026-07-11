# Contratos/Schemas — Pipeline Hierárquica v1 (2026-07-10)

> Frente: CONTRATOS/SCHEMAS entre etapas da pipeline hierárquica (fonte → curso → módulos →
> aulas → blocos didáticos → representação). Usa o vocabulário de
> `docs/redesign-pipeline-v2/vocabulario-canonico-v1.md` exatamente como definido lá.
> Desenho de contrato apenas — **nenhum código real foi implementado nesta frente**.
> Convenção de tag adotada abaixo: **VERIFIED** (confirmado lendo código/schema real do
> repo), **HYPOTHESIS** (proposta desta frente, ainda não ratificada por Lucas),
> **GAP** (lacuna conhecida, não resolvida aqui).

## 0. O que foi lido antes de desenhar

- `artifacts.id = 1b210767-6861-4a92-9ac2-93504507d334` (mapa da pipeline ANTIGA, linear).
- `artifacts.id = 82dfa3eb-d9d9-4d54-9e3c-6ce9a2674042` (1 objeto por subagente da pipeline ANTIGA).
- Código real: `fabrica/agents/*.py`, `fabrica/orchestrator.py`, `fabrica/schemas/*.json`,
  `fabrica/prompts/*.md`, `docs/fabrica-de-aulas-design-doc-v2.md`,
  `docs/lesson-ux-principles-v1.md`.
- **VERIFIED**: os limiares numéricos (máx 3 conceitos/beat, 6/aula, 12–20 steps, score
  mínimo 42/60, conjunto crítico P1/P2/P3/P7/P15/P23/P28) estão hoje duplicados em pelo
  menos 3 lugares — `fabrica/prompts/content_author_system.md` (prosa),
  `fabrica/agents/content_author.py` / `fabrica/agents/condemn.py` (código) e
  `docs/fabrica-de-aulas-design-doc-v2.md` (doc). Isso é exatamente o problema que o
  ponto 9 do plano aprovado quer resolver — ver seção 5.

---

## 1. Mapa do Curso — objeto de contexto global (somente-leitura)

Regra de design: este objeto é passado por referência para toda chamada especializada,
mas **nunca deve crescer proporcionalmente ao conteúdo total do curso** — só resumos
curtos e índices leves. Ele existe pra permitir detectar redundância/gap entre módulos
sem que nenhuma chamada precise "ler o curso inteiro" (premissa central: pipeline pensada
pra modelos mais fracos).

Ninguém edita este objeto por reescrita livre. Só duas etapas propõem patches nele
(seção 3.A e 3.H), sempre como adição pequena (novo módulo resumido, novo conceito
indexado, novo alerta) — nunca reescrita integral.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "mapa_do_curso.schema.v1",
  "title": "MapaDoCurso",
  "description": "Contexto global do curso, somente-leitura para as etapas de conteúdo. Só Estruturador de Curso e Crítico de Coerência de Curso podem propor patches, e sempre pequenos.",
  "type": "object",
  "required": ["curso_id", "schema_version", "fonte", "titulo", "modulos", "indice_conceitos_nucleares", "meta"],
  "additionalProperties": false,
  "properties": {
    "curso_id": { "type": "string", "description": "slug estável, hash determinístico de fonte+título — mesmo padrão de job_id em orchestrator.py (_stable_job_id)" },
    "schema_version": { "type": "string", "description": "semver deste objeto, ex: 1.0.0 — ver seção 5" },
    "fonte": {
      "type": "object",
      "required": ["arquivo", "tipo", "extraido_em", "marcadores_de_pagina_preservados"],
      "additionalProperties": false,
      "properties": {
        "arquivo": { "type": "string" },
        "tipo": { "enum": ["livro", "artigo", "apostila", "transcricao", "outro"] },
        "paginas_totais": { "type": ["integer", "null"] },
        "capitulos_reais": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["capitulo_id", "titulo"],
            "properties": {
              "capitulo_id": { "type": "string" },
              "titulo": { "type": "string" },
              "pagina_inicio": { "type": ["integer", "null"] },
              "pagina_fim": { "type": ["integer", "null"] }
            }
          }
        },
        "extraido_em": { "type": "string", "format": "date-time" },
        "extrator": { "type": "string", "description": "ex: pdftotext -layout, docling" },
        "marcadores_de_pagina_preservados": {
          "type": "boolean",
          "description": "GAP verificado nesta frente: o .txt de teste (as-armas-da-persuasao.txt, pdftotext -layout) tem quebras de página (form feed) mas NENHUM marcador textual de nº de página. Se este campo for false, todo campo pagina_* rio abaixo é HYPOTHESIS, nunca VERIFIED. Recomendação: Ingest deve preservar página como comentário invisível no markdown limpo (ex: <!-- pagina:47 -->) antes de entregar à pipeline."
        }
      }
    },
    "titulo": { "type": "string" },
    "objetivo_geral": { "type": "string" },
    "nivel": { "type": "string" },
    "modulos": {
      "type": "array",
      "description": "Projeção resumida de CADA módulo já decidido. É uma cópia derivada de modulo.schema.v1 (resumo, status, conceitos_nucleares_aqui) — a fonte de verdade de cada campo é o próprio objeto módulo (seção 2); este array é regenerado quando o módulo muda, nunca editado à mão diretamente aqui.",
      "items": {
        "type": "object",
        "required": ["modulo_id", "ordem", "titulo", "resumo", "status", "conceitos_nucleares_aqui"],
        "additionalProperties": false,
        "properties": {
          "modulo_id": { "type": "string" },
          "ordem": { "type": "integer" },
          "titulo": { "type": "string" },
          "resumo": { "type": "string", "maxLength": 600, "description": "2-4 frases. Se precisar crescer além disso, o dado pertence a outro objeto, não aqui." },
          "status": { "enum": ["planejado", "em_progresso", "aprovado", "reprovado"] },
          "capitulo_fonte": { "type": ["string", "null"] },
          "conceitos_nucleares_aqui": {
            "type": "array",
            "items": { "$ref": "#/definitions/conceito_indexado" }
          }
        }
      }
    },
    "indice_conceitos_nucleares": {
      "type": "array",
      "description": "Índice CURSO-INTEIRO deduplicado. Fonte única de verdade sobre 'este conceito já foi ensinado'. Resolve o gap 'duas réguas de conceito' + inflação por sinônimo já identificado no artifact 82dfa3eb (concepts_introduced sem dedupe semântico).",
      "items": {
        "type": "object",
        "required": ["conceito_canonico", "sinonimos", "primeira_introducao", "modulos_que_referenciam"],
        "properties": {
          "conceito_canonico": { "type": "string" },
          "sinonimos": { "type": "array", "items": { "type": "string" }, "description": "ex: 'DDD' e 'Domain-Driven Design' apontando pro mesmo conceito canônico" },
          "primeira_introducao": {
            "type": "object",
            "required": ["modulo_id", "aula_id"],
            "properties": { "modulo_id": { "type": "string" }, "aula_id": { "type": "string" } }
          },
          "modulos_que_referenciam": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "alertas_de_coerencia": {
      "type": "array",
      "description": "Só o Crítico de Coerência de Curso (seção 3.H) escreve aqui. Nunca o Autor/Adaptador/Diretor.",
      "items": {
        "type": "object",
        "required": ["tipo", "modulos_envolvidos", "descricao", "status"],
        "properties": {
          "tipo": { "enum": ["redundancia_sem_justificativa", "gap_de_pre_requisito", "inconsistencia_terminologica"] },
          "modulos_envolvidos": { "type": "array", "items": { "type": "string" } },
          "descricao": { "type": "string" },
          "status": { "enum": ["aberto", "justificado", "resolvido"] }
        }
      }
    },
    "meta": {
      "type": "object",
      "properties": {
        "gerado_por": { "type": "string" },
        "ultima_atualizacao": { "type": "string", "format": "date-time" },
        "versao_conteudo": { "type": "integer", "description": "incrementa a cada patch aceito — permite a uma chamada detectar que leu uma cópia obsoleta do mapa" }
      }
    }
  },
  "definitions": {
    "conceito_indexado": {
      "type": "object",
      "required": ["conceito", "definicao_curta", "aula_origem_id"],
      "properties": {
        "conceito": { "type": "string" },
        "definicao_curta": { "type": "string", "maxLength": 200 },
        "aula_origem_id": { "type": "string" }
      }
    }
  }
}
```

---

## 2. Schemas de Módulo e Aula (com Bloco Didático embutido)

Princípio de design: **1 ponteiro ascendente só** por objeto (aula aponta pro módulo,
módulo aponta pro curso) — nunca duplicar `curso_id` dentro de aula, por exemplo. Isso
evita reintroduzir uma segunda régua de verdade sobre hierarquia.

### 2.1 `modulo.schema.v1`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "modulo.schema.v1",
  "title": "Modulo",
  "type": "object",
  "required": ["modulo_id", "curso_id", "ordem", "titulo", "objetivo_do_modulo", "resumo", "origem_na_fonte", "aulas", "status", "meta"],
  "additionalProperties": false,
  "properties": {
    "modulo_id": { "type": "string" },
    "curso_id": { "type": "string" },
    "ordem": { "type": "integer" },
    "titulo": { "type": "string" },
    "objetivo_do_modulo": { "type": "string" },
    "resumo": { "type": "string", "maxLength": 600, "description": "fonte única de verdade — espelhado (projetado) em mapa_do_curso.modulos[].resumo" },
    "origem_na_fonte": {
      "type": "object",
      "required": ["capitulo_id", "confianca_pagina"],
      "additionalProperties": false,
      "properties": {
        "capitulo_id": { "type": "string" },
        "titulo_capitulo": { "type": ["string", "null"] },
        "pagina_inicio": { "type": ["integer", "null"] },
        "pagina_fim": { "type": ["integer", "null"] },
        "confianca_pagina": { "enum": ["verified", "hypothesis", "desconhecida"], "description": "só 'verified' se fonte.marcadores_de_pagina_preservados=true no mapa do curso" }
      }
    },
    "aulas": {
      "type": "array",
      "description": "Lista ORDENADA de aula_id (referência, não conteúdo embutido) — aula é objeto standalone (seção 2.2).",
      "items": { "type": "string" }
    },
    "conceitos_nucleares_aqui": { "type": "array", "items": { "$ref": "modulo_definitions.json#/conceito_indexado" } },
    "status": { "enum": ["planejado", "em_progresso", "aprovado", "reprovado"] },
    "meta": {
      "type": "object",
      "properties": {
        "etapa_geradora": { "type": "string" },
        "model": { "type": ["string", "null"] },
        "gerado_em": { "type": "string", "format": "date-time" },
        "schema_version": { "type": "string" }
      }
    }
  }
}
```

### 2.2 `aula.schema.v1`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "aula.schema.v1",
  "title": "Aula",
  "description": "Unidade de trabalho de 1 chamada do Autor de Conteúdo, igual em espírito ao antigo roteiro_pedagogico.json (fabrica/schemas/roteiro_pedagogico.json), agora com posição explícita na hierarquia e rastreabilidade de origem obrigatória.",
  "type": "object",
  "required": ["aula_id", "modulo_id", "ordem_no_modulo", "titulo", "objetivo", "origem_na_fonte", "abertura", "blocos", "fechamento", "status", "meta"],
  "additionalProperties": false,
  "properties": {
    "aula_id": { "type": "string", "pattern": "^aula-[0-9]{2,3}$" },
    "modulo_id": { "type": "string", "description": "único ponteiro ascendente — curso_id resolve-se via módulo" },
    "ordem_no_modulo": { "type": "integer" },
    "titulo": { "type": "string" },
    "objetivo": { "type": "string", "description": "o que o aluno sabe ao final (1 frase) — reaproveita roteiro_pedagogico.objective" },
    "origem_na_fonte": {
      "type": "object",
      "required": ["capitulo_id", "confianca_pagina"],
      "additionalProperties": false,
      "properties": {
        "capitulo_id": { "type": "string" },
        "secao": { "type": ["string", "null"] },
        "pagina_inicio": { "type": ["integer", "null"] },
        "pagina_fim": { "type": ["integer", "null"] },
        "confianca_pagina": { "enum": ["verified", "hypothesis", "desconhecida"] }
      }
    },
    "abertura": {
      "type": "object",
      "description": "Campo explícito pra P2 (why-before-what) + protocolo de abertura por gap de curiosidade — não depende do LLM lembrar de abrir bem. Campos cena_problema/abertura_da_lacuna/organizador_uma_frase APROVADOS pro MVP em 2026-07-11 (agent_messages.id=49d1a5d5, ver docs/redesign-pipeline-v2/eixo-pedagogico-pratica-feedback-avaliacao-v1.md seção 3.1): é uma tela introdutória calma da experiência, nunca escolha interativa do aluno. Todos os 3 são opcionais (MINOR bump) — aula simples preenche só problema_ou_gap como antes.",
      "properties": {
        "problema_ou_gap": { "type": "string", "description": "o problema/pergunta que motiva a aula, antes do mecanismo" },
        "cena_problema": { "type": "string", "description": "situação concreta, nomeada, ancorada na fonte — nunca abstrata (APROVADO MVP)" },
        "abertura_da_lacuna": { "type": "string", "description": "a pergunta 'por que isso é estranho/não-óbvio' — Loewenstein (APROVADO MVP)" },
        "organizador_uma_frase": { "type": "string", "maxLength": 150, "description": "nomeia o destino sem entregar a resposta (APROVADO MVP)" },
        "recap_aula_anterior": { "type": ["string", "null"], "description": "obrigatório (não-null) se gap > 2 aulas desde a última menção dos mesmos conceitos nucleares — regra herdada de design-doc-v2 seção E" }
      }
    },
    "blocos": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "bloco_didatico.schema.v1" }
    },
    "fechamento": {
      "type": "object",
      "properties": { "consolidacao": { "type": "string", "description": "P4 — remontagem do overview 'aceso', síntese final" } }
    },
    "status": { "enum": ["draft", "em_critica", "aprovada", "reprovada"] },
    "meta": {
      "type": "object",
      "properties": {
        "author_agent": { "type": "string" },
        "adapter_agent": { "type": ["string", "null"] },
        "director_agent": { "type": ["string", "null"] },
        "model": { "type": ["string", "null"] },
        "schema_version": { "type": "string" },
        "total_conceitos_novos": { "type": "integer", "description": "SEMPRE recalculado em código a partir de blocos[].conceitos_introduzidos — nunca autorrelato do LLM, mesmo padrão de content_author.py hoje" }
      }
    }
  }
}
```

### 2.3 `bloco_didatico.schema.v1`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "bloco_didatico.schema.v1",
  "title": "BlocoDidatico",
  "type": "object",
  "required": ["bloco_id", "label", "ideia_central", "conteudo", "conceitos_introduzidos", "conceitos_referenciados", "papel_na_aula", "representacao", "origem_na_fonte"],
  "additionalProperties": false,
  "properties": {
    "bloco_id": { "type": "string", "pattern": "^bloco-[0-9]{2}$" },
    "label": { "type": "string", "maxLength": 40 },
    "ideia_central": { "type": "string", "maxLength": 120, "description": "reaproveita beats[].idea do roteiro_pedagogico atual" },
    "conteudo": { "type": "string", "description": "markdown, sem câmera, sem LikeC4 — reaproveita beats[].content" },
    "conceitos_introduzidos": { "type": "array", "items": { "type": "string" }, "description": "termos NOVOS aqui — vira input pro dedupe contra indice_conceitos_nucleares do curso" },
    "conceitos_referenciados": { "type": "array", "items": { "type": "string" }, "description": "CAMPO NOVO (não existia na pipeline antiga): termos já ensinados em módulo/aula anterior, citados por recap ou reuso. Só pode citar termos que já existem em indice_conceitos_nucleares — validado em código, não por autorrelato." },
    "papel_na_aula": { "enum": ["abertura", "desenvolvimento", "fechamento"] },
    "origem_na_fonte": {
      "type": "object",
      "required": ["pagina_inicio", "confianca"],
      "additionalProperties": false,
      "properties": {
        "pagina_inicio": { "type": ["integer", "null"] },
        "pagina_fim": { "type": ["integer", "null"] },
        "trecho_citado": { "type": ["string", "null"], "maxLength": 300, "description": "citação literal curta da fonte que fundamenta o bloco — auditável, nunca paráfrase" },
        "confianca": { "enum": ["verified", "hypothesis", "desconhecida"] }
      }
    },
    "representacao": {
      "type": "object",
      "required": ["tipo"],
      "additionalProperties": false,
      "description": "Escolhida por bloco, NUNCA fixa por curso/job (decisão já tomada no vocabulário canônico, linha 'representação'). Isso fecha o gap explícito do artifact 1b210767: '1 fluxograma por job, fixo, decisão 100% humana'.",
      "properties": {
        "tipo": { "enum": ["diagrama", "tabela", "texto_puro", "combinacao"] },
        "diagrama": {
          "type": ["object", "null"],
          "properties": {
            "fonte_diagrama": { "type": "string", "description": "qual .c4/view — pode reaproveitar um diagrama já usado em bloco/aula anterior do mesmo curso, não precisa ser 1 fixo por job" },
            "mapping_type": { "enum": ["overview", "walkthrough-start", "walkthrough", "focus", "cluster", "consolidate"] },
            "edgeIndex": { "type": ["integer", "null"] },
            "node": { "type": ["string", "null"] },
            "nodes": { "type": "array", "items": { "type": "string" } },
            "revelacao": {
              "enum": ["calma_inteira", "progressiva"],
              "description": "HYPOTHESIS, não é decisão fechada. Guarda a resolução da tensão P1 (abrir calmo com diagrama inteiro) vs §5.1 do protocolo dormente (nunca mostrar diagrama inteiro de início) registrada em vocabulario-canonico-v1.md. Proposta desta frente: 'calma_inteira' para blocos papel_na_aula=abertura, 'progressiva' para os de desenvolvimento — mas isso precisa virar decisão explícita de Lucas, não fica implícito no schema."
            }
          }
        },
        "tabela": { "type": ["object", "null"], "properties": { "colunas": { "type": "array", "items": { "type": "string" } }, "linhas": { "type": "array", "items": { "type": "array" } } } },
        "combinacao": { "type": ["array", "null"], "items": { "type": "object" } }
      }
    }
  }
}
```

---

## 3. Contrato de cada etapa especializada

Formato reaproveitado literalmente do artifact `82dfa3eb...` (campos:
missão/inputs/outputs/guardrails/limites de autoridade/dependências) — já validado
como bom padrão de documentação de subagente, só estendido com a coluna **NUNCA vê**
que esta frente foi encarregada de explicitar.

| Etapa | Recebe (pequeno/local) | NUNCA precisa ver | Produz | Reaproveitado / Novo |
|---|---|---|---|---|
| **A. Estruturador de Curso** *(NOVO, proposto — pesquisa própria pendente, já registrado assim no artifact 82dfa3eb)* | Fonte inteira (markdown limpo) + metadados de ingest (capítulos reais, se detectados) | Nenhum bloco/aula já escrito em paralelo por outra etapa; não decide conteúdo pedagógico | Esqueleto de `mapa_do_curso.modulos[]` (resumo placeholder, status=planejado) + `fonte.capitulos_reais` | **GAP explícito, não resolvido aqui.** Combinado com Lucas em 2026-07-09/10 que precisa de pesquisa própria antes de implementar, por alterar a pipeline inteira. Esta frente só desenha o contrato de entrada/saída, não a lógica interna. |
| **B. Planejador de Módulo** (módulo → lista de aulas) | `modulo.origem_na_fonte` (fatia de markdown do capítulo) + `objetivo_do_modulo` + concept_budget | Outros módulos; `indice_conceitos_nucleares` do curso inteiro (corta por estrutura/densidade local, não precisa do índice global) | Lista ordenada de `aula` (esqueleto, sem blocos ainda) | **Reaproveita `fabrica/agents/scope_planner.py` quase 100%** (função pura, sem IA, heurística por heading/parágrafo). Só troca a unidade de saída de "fatia" (ambígua) para "aula" (explícita). Gap herdado, não resolvido: `ACRONYM_RE` penaliza termos capitalizados do domínio (Container, Component, GitHub) — mesmo bug de hoje. |
| **C. Autor de Conteúdo** (aula → blocos com conteúdo) | Markdown da aula + `modulo.resumo` + `modulo.objetivo_do_modulo` + `curso.indice_conceitos_nucleares` (só nome+definição curta, nunca texto completo de outra aula) + feedback do Crítico se reprocessando | Conteúdo bruto de outras aulas/módulos; `alertas_de_coerencia` (isso é do Crítico de Coerência de Curso, não do Autor) | `aula.blocos[]` preenchido (`conteudo`, `ideia_central`, `conceitos_introduzidos`, `conceitos_referenciados`) | **Reaproveita `content_author.py`** quase integralmente (máx 3 conceitos/beat, 6/aula, recontagem em código nunca autorrelato). **Novo:** `conceitos_referenciados` só pode citar termos já existentes no índice do curso — validação nova em código. |
| **D. Adaptador de Representação** (bloco → onde/como apresentar) | 1 bloco (conteúdo já escrito) + catálogo de diagramas/views disponíveis no curso (nomes/paths compilados, não o `.c4` inteiro) | Blocos de outras aulas; `indice_conceitos_nucleares` (decide ONDE, não O QUÊ) | `bloco.representacao` preenchido | **Reaproveita REGRA HARD C2** (contiguidade de edgeIndex), FQN check e recálculo determinístico de walkthroughStart/End de `flowchart_adapter.py`. **Novo:** generaliza para escolher `tabela`/`texto_puro`/`combinacao` quando não há dynamic view contínua aplicável — fecha o gap antigo "ainda tenta mapear tudo no mesmo diagrama do job" citado no artifact 1b210767. |
| **E. Diretor de Apresentação** (aula mapeada → câmera/timing final) | Aula com todos os `blocos[].representacao` já decididos | Outras aulas; não decide diagrama nem conteúdo (papel de tradutor fino, igual hoje) | Aula pronta pra crítica (equivalente ao `lesson.json` de hoje, em escopo de aula) | **Reaproveita `presentation_director.py`** sem mudança de contrato (1 step walkthrough-start obrigatório, conteúdo intacto, câmera 1:1 do mapping). |
| **F. Crítico de Aula** | 1 aula completa | Outras aulas/módulos — escopo estreito idêntico ao de hoje | `critic_report.json` (30 princípios, 7 críticos) | **Reaproveita `lesson_critic.py`/`lesson_critic_output.json`** quase sem alteração — só o objeto avaliado passa a ser `aula` em vez de `lesson.json` de fatia solta. Resolve de quebra o GAP antigo "Diretor não sabe se sua fatia é parte de uma aula maior", porque agora aula é a unidade explícita, não fatia ambígua. |
| **G. Condenador de Aula** | `critic_report` da aula | Tudo o resto | Veredito aprovado/reprovado + `send_back_to` | **Reaproveita `condemn.py` 100%**, zero mudança de lógica (críticos P1/P2/P3/P7/P15/P23/P28, score mínimo 42/60). |
| **H. Crítico de Coerência de Curso** *(NOVO)* | `mapa_do_curso.modulos[]` (resumos) + `indice_conceitos_nucleares` — objetos pequenos por design | Conteúdo bruto (`blocos[].conteudo`) de qualquer aula, por padrão. Se precisar confirmar suspeita, deve pedir 1 aula específica por vez — nunca carregar o curso inteiro numa chamada | `mapa_do_curso.alertas_de_coerencia[]` | **Fecha gap que não existia na pipeline antiga**: implementa a definição de "qualidade" do vocabulário canônico ("coerência global do curso... sem redundância... sem justificativa pedagógica") e resolve estruturalmente o "achado das duas réguas de conceito" ao trabalhar sobre o índice único, não sobre contagens duplicadas por aula. |
| **I. Condenador de Curso** *(NOVO, determinístico, sem IA)* | `alertas_de_coerencia` abertos + status de cada módulo/aula | Conteúdo bruto — só olha vereditos/alertas já estruturados | Veredito M/N módulos aprovados (mesmo espírito do `manifest.json` do orchestrator hoje) | Mesma filosofia de `condemn.py` (código determinístico, zero LLM), estendida pro nível curso. |
| **J. Orquestrador Hierárquico** | `curso_id` + spec completa do job | Decide fluxo, não conteúdo | Checkpoints aninhados curso→módulo→aula + `manifest.json` | **Reaproveita quase tudo de `orchestrator.py`**: hash determinístico (agora `curso_id`), `state.json` por fase, lock, escrita atômica, isolamento de falha por unidade, `NeedRescope`. **Novo:** 1 nível extra de checkpoint (módulo) + decisão de concorrência — ver nota abaixo. |

**Nota sobre concorrência (Orquestrador Hierárquico, HYPOTHESIS a validar com Lucas):**
recomendo módulos **serializados entre si** (módulo B só roda o Autor de Conteúdo depois
que o módulo A fecha seu `resumo`/`conceitos_nucleares_aqui` no mapa do curso — evita
condição de corrida no `indice_conceitos_nucleares` global), mas **aulas do mesmo módulo
em paralelo** (elas dependem só do `resumo`/`objetivo_do_modulo` do próprio módulo, já
fechado antes delas começarem, não do índice global mutável entre si). Mais simples de
verificar com modelos fracos do que um esquema de lock otimista cross-módulo.

---

## 4. O que é reaproveitado vs novo — resumo direto

**Reaproveitado (validado, não reabrir):**
- Nunca confiar em autorrelato do LLM para contagem/score — sempre recalcular em código
  (`content_author.py`, `condemn.py`, `lesson_critic_output.json` já fazem isso; os novos
  campos `total_conceitos_novos` em `aula.schema.v1` e o dedupe de
  `indice_conceitos_nucleares` seguem o mesmo princípio).
- REGRA HARD C2 (contiguidade de `edgeIndex` em walkthrough) — vale tal como está,
  só generalizada pra conviver com `representacao.tipo` != diagrama.
- `condemn.py` inteiro (críticos P1/P2/P3/P7/P15/P23/P28, score mínimo 42/60,
  `send_back_to` com prioridade content_author → flowchart_adapter → presentation_director).
- `scope_planner.py` inteiro, incluindo seus gaps conhecidos (heurística lexical, `ACRONYM_RE`).
- Padrão de checkpoint do `orchestrator.py` (job_id/curso_id hash estável, `state.json`,
  lock, escrita atômica, isolamento de falha por unidade, `NeedRescope`).
- Formato de documentação por etapa (missão/inputs/outputs/guardrails/limites de
  autoridade/dependências) do artifact `82dfa3eb`.

**Novo nesta frente:**
- `mapa_do_curso.schema.v1` inteiro — não existia nada equivalente; a pipeline antiga não
  tinha nenhum objeto de contexto global, só `job.json` (1 diagrama fixo, sem hierarquia).
- `modulo.schema.v1`, `aula.schema.v1` (hierarquia explícita — antes "aula" era termo
  ambíguo/sobrecarregado, conforme o próprio artifact 1b210767 relata).
- `indice_conceitos_nucleares` deduplicado com sinônimos — resolve a "inflação por
  sinônimo" e as "duas réguas" citadas nos dois artifacts antigos.
- `conceitos_referenciados` em bloco — não existia distinção entre conceito novo e
  conceito reusado.
- `representacao` por bloco (polimórfica: diagrama/tabela/texto_puro/combinação) —
  substitui "1 fluxograma fixo por job", fechando o gap mais citado nos dois artifacts
  antigos.
- Etapas H (Crítico de Coerência de Curso) e I (Condenador de Curso) — não existia
  nenhuma etapa que olhasse o curso como um todo antes.
- Rastreabilidade `origem_na_fonte` com página/trecho em módulo/aula/bloco — a pipeline
  antiga só tinha `source_chapter` opcional em string livre, sem página nem citação.
- Campo `revelacao` (HYPOTHESIS) — lugar reservado pra decisão ainda em aberto (P1 vs
  §5.1), não implica que a tensão já foi resolvida.

---

## 5. Versionamento dos contratos (ponto 9 do plano aprovado)

Objetivo: **toda regra importante mora em schema/contrato, nunca só em prosa de prompt.**
Hoje isso já falha de forma verificada (seção 0): o limite "máx 3 conceitos novos por
beat" está escrito em `fabrica/prompts/content_author_system.md` (prosa), em
`content_author.py` (`MAX_CONCEPTS_PER_LESSON`, código) e em
`docs/fabrica-de-aulas-design-doc-v2.md` (doc) — três lugares que podem divergir sem
nenhum aviso. O mesmo vale para o conjunto crítico P1/P2/P3/P7/P15/P23/P28, duplicado em
`lesson_critic_system.md` e `condemn.py`.

**Proposta:**

1. **`schema_version` obrigatório** em todo objeto persistido (`mapa_do_curso`, `modulo`,
   `aula`, `bloco_didatico` — já incluído nos schemas acima). Cada objeto grava sob qual
   versão de schema foi validado, pra uma checagem posterior (ex: Crítico de Coerência de
   Curso) saber se está comparando objetos gerados sob regras diferentes antes de acusar
   inconsistência falsa.

2. **Catálogo único de regras críticas** (proposto: `fabrica/schemas/regras_criticas.json`,
   ainda não criado — é desenho, não implementação): um arquivo pequeno com
   `MAX_CONCEPTS_PER_BLOCO`, `MAX_CONCEPTS_PER_AULA`, `MIN_STEPS_AULA`, `MAX_STEPS_AULA`,
   `SCORE_MINIMO`, `PRINCIPIOS_CRITICOS[]`, `OVERFLOW_THRESHOLD_FORMULA`. Tanto o código
   determinístico (Condenador) quanto os JSON Schemas (via `enum`/`const`/`maxItems`)
   quanto os prompts devem **referenciar** este catálogo por nome, nunca reescrever o
   número. Prompt passa a dizer "respeite os limites de `regras_criticas.json`" em vez de
   "máximo 3 conceitos" cravado na prosa.

3. **Registro central de schemas** (proposto: `docs/redesign-pipeline-v2/schemas/registry.json`
   ou, se a implementação seguir o padrão atual, `fabrica/schemas/registry.json`): mapeia
   nome do schema → versão atual → path do arquivo → quais etapas leem/escrevem nele.
   Serve pra qualquer frente futura (ou Lucas) responder "quem depende deste schema" sem
   grep manual.

4. **Política de bump semver:**
   - **PATCH** — só descrição/documentação muda, nenhum campo/regra muda.
   - **MINOR** — campo novo opcional adicionado (retrocompatível).
   - **MAJOR** — campo obrigatório adicionado/removido, valor de enum removido, ou um
     limiar numérico muda de forma incompatível (ex: `MAX_CONCEPTS_PER_AULA` de 6 para 4).
     Todo bump MAJOR exige nota de migração explícita — objetos já gerados sob a versão
     antiga não são reinterpretados silenciosamente sob a regra nova.

5. **Checagem de deriva (HYPOTHESIS, não implementada aqui):** um script simples que
   compara os números citados em `fabrica/prompts/*.md` contra `regras_criticas.json` e
   falha se divergirem — operacionaliza o ponto 9 de forma verificável, em vez de depender
   de disciplina manual do autor do prompt.

---

## 6. Lacunas/decisões em aberto que esta frente NÃO fecha

- **Estruturador de Curso (etapa A):** contrato de entrada/saída desenhado, lógica interna
  fica pendente de pesquisa própria — combinado explicitamente com Lucas, não reabrir sem
  motivo novo.
- **Tensão P1 vs §5.1** (abrir com diagrama inteiro calmo vs nunca mostrar o diagrama
  inteiro de início): schema reserva o campo `revelacao`, mas a decisão em si continua em
  aberto — precisa virar decisão explícita, não ficar implícita no default do schema.
- **Rastreabilidade de página depende do Ingest:** confirmado nesta frente que o `.txt`
  de teste (extração real via `pdftotext -layout`) tem quebras de página mas nenhum
  marcador textual de número de página. Sem um passo de Ingest que preserve isso (hoje
  Ingest é 100% manual, sem código — conforme artifact 1b210767), todo `pagina_inicio`/
  `pagina_fim` do schema fica `confianca: "hypothesis"` na prática, nunca `"verified"`.
- **Mecanismo de dedupe de sinônimos** (`indice_conceitos_nucleares.sinonimos`): o schema
  reserva o campo, mas não desenha o algoritmo (embedding? LLM leve de normalização?
  lista canônica mantida por glossário?) — decisão de implementação fica para depois.
- **Concorrência do Orquestrador Hierárquico:** proposta de módulos serializados + aulas
  paralelas dentro do módulo é HYPOTHESIS desta frente, não decisão fechada com Lucas.
