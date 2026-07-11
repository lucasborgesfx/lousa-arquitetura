# Frente F — Harnesses, Guardrails e Vocabulário Canônico

## Achado que ancora a análise

O protocolo dormente (§6) já resolve a ambiguidade do limite de conceitos: **por-beat é hard (≤3 alvo/4 teto)**, **por-aula é guia (5-7, remédio = segmentar em mais aulas)**. Mas `content_author.py:70,108-118` implementa `MAX_CONCEPTS_PER_LESSON=6` como número único tratado como gate duro, com remédio ERRADO ("reduzir conceitos") em vez do remédio correto ("segmentar"). Este é o caso de teste da classificação crítico-vs-guia abaixo.

## Guardrails determinísticos propostos (hierarquia curso→módulos→aulas→blocos)

| ID | Nível | Checa | Reaproveita padrão de |
|---|---|---|---|
| G-MAP-COVERAGE | curso→módulo | Todo módulo tem ≥1 aula; todo trecho da fonte mapeado | gate duro do condemn.py |
| G-MODULE-COVERAGE | módulo | União de `concepts_introduced` cobre os conceitos nucleares prometidos | `_unique_concepts`/recontagem (nunca autorrelato) |
| G-CROSS-DUP-CONCEPT | bloco (curso) | Conceito nuclear reintroduzido sem justificativa concreta citando bloco anterior real | `_looks_concrete_justification` |
| G-BEAT-CONCEPT-CAP | bloco | ≤3 alvo/4 teto | `MAX_CONCEPTS_PER_BEAT` (já existe) |
| G-LESSON-CONCEPT-GUIDE | aula | Faixa 5-7 (não número único); teto duro maior (~10) sim crítico | corrige o erro do MAX_CONCEPTS_PER_LESSON=6 |
| G-C2-WALKTHROUGH | bloco c/ diagrama | Contiguidade de arestas — agora por bloco, não por job inteiro | `_validate_walkthrough_rule` (já existe) |
| G-FQN | bloco c/ diagrama | FQN existe na view compilada | `_validate_fqns` (já existe) |
| G-REPRESENTATION-SCHEMA | bloco | Campos batem com tipo de representação declarado | jsonschema condicional |
| G-MODULE-VIEW-SCOPE | módulo/aula | `viewId` pertence à hierarquia do módulo | parser `.mjs` já existe |
| G-TOPO-ORDER | curso | Pré-requisito citado tem primeira ocorrência real antes da aula que cita | grafo dirigido (design doc v2 §E, nunca implementado) |
| G-VISUAL-GATE | aula renderizada | Câmera se moveu de fato (Playwright DOM) | design doc v2 §F |

Todos código puro — o LLM produz dado estruturado, o Python decide.

## Adições propostas ao vocabulário canônico (reportadas, não editadas diretamente)

1. **"conceito nuclear"** — distinguir de "conceito" simples; sem isso G-MODULE-COVERAGE/G-CROSS-DUP-CONCEPT dão falso-positivo em menção incidental.
2. **"mapa do curso"** — promover a termo formal com contrato mínimo (lista de conceitos nucleares planejados por módulo).
3. **"justificativa concreta"** — herdar régua de `_looks_concrete_justification` (mín 24 chars + citação de campo/id real).
4. **"guardrail crítico" / "guardrail guia"** — formalizar (ver classificação abaixo).
5. **"job"** — vocabulário não diz a unidade atômica de execução (bloco? aula? módulo?) — GAP a decidir.

## Teste objetivo: crítico vs. guia

> Um guardrail só pode ser **CRÍTICO** (reprova na hora, sem override) se **(a)** checa fato objetivo contra artefato determinístico real (nunca estimativa de literatura com faixa aberta) **E (b)** o remédio correto está ao alcance do papel que recebe o `send_back_to`. Se o remédio exige decisão de nível acima (ex.: "segmentar em mais aulas" é decisão de módulo, fora do alcance do Autor sozinho), o guardrail é **GUIA** ou escala — nunca gate duro no mesmo loop.

Aplicado: G-C2-WALKTHROUGH, G-FQN, G-REPRESENTATION-SCHEMA, G-MODULE-VIEW-SCOPE, G-BEAT-CONCEPT-CAP, G-VISUAL-GATE, G-TOPO-ORDER, G-MAP/MODULE-COVERAGE → **crítico**. **G-LESSON-CONCEPT-GUIDE → GUIA** (faixa aberta + remédio fora do alcance do Autor — corrige o bug real do `MAX_CONCEPTS_PER_LESSON=6`). G-CROSS-DUP-CONCEPT → guia por padrão, crítico só se zero justificativa. G-EXAMPLE-DEDUP → sempre guia (pode ser reforço intencional). P1-P30 herdados: mantém P1/P2/P3/P7/P15/P23/P28 crítico, resto guia (sem mudança).

## Código puro vs. LLM-juiz (modelo fraco)

**Sempre código puro**: todos os guardrails de fato-contra-artefato (lista acima). Modelo fraco é argumento A FAVOR de manter puro, nunca a favor de relaxar. **Precisa LLM-juiz**: G-CROSS-DUP-CONCEPT (mesma ideia ou coincidência?), G-EXAMPLE-DEDUP, fatia subjetiva de P1-P30 — sempre com as 3 regras de `lesson_critic.py` (nunca autorrelato de score; justificativa concreta validada por regex+tamanho; resposta malformada rejeitada e re-tentada, nunca aproveitada parcial). **Painel de 2-3 modelos**: hoje inviável (1 só credencial em `.env`) — alvo futuro, só pra guardrails guia de fronteira, agregação sempre em Python.
