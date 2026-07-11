# Frente H — Benchmark e Desenho para Modelos Fracos

## Evidência real já existente (reaproveitar, não redescobrir)

`fixtures/fabrica-test-2026-07-06-retry{1,2,3}` já rodou o MESMO capítulo do Cialdini ("Armas de Influência") com `minimax-m2.5` e `qwen3-235b-a22b-2507`. Achados reais: minimax vazou caractere chinês no meio do texto em português; duas rodadas de qwen no mesmo capítulo produziram **9 vs. 5 conceitos únicos** — variância real de granularidade entre execuções do mesmo modelo fraco sobre o mesmo input.

## Tarefas grande vs. pequena

| Tarefa | Tamanho | Por quê |
|---|---|---|
| T1: curso→módulos | **GRANDE** (modelo forte) | Precisa segurar todos os capítulos simultaneamente; decisão estrutural não-mecânica (capítulos reais variam ~2,6x em tamanho); erro propaga pra tudo depois |
| T2: módulo→aulas | **MÉDIA/híbrida** | Reaproveita `scope_planner.py` (já determinístico) pré-fatiando dentro do módulo; LLM só ajusta agrupamento fino, escopo bounded |
| T3: classificador de tipo de bloco | **PEQUENA** | Categórica, 5 valores, 1 bloco isolado, verificável por enum + resample |
| T4: autor de bloco | **PEQUENA** (maior volume) | Input bounded, núcleo plugável já desenhado (protocolo §2), verificável por schema |
| T5: classificador de representação | **PEQUENA** | Categórica, 4 opções, combinação tipo×representação suspeita vira flag automático |
| T6: adaptador de bloco (onde) | **PEQUENA** | Bounded a 1 bloco, checagem determinística contra `.c4` |
| T7: diretor de apresentação | **PEQUENA**, boa parte já regra fixa | P14,P16-P21,P24-P30 já são "PASS por padrão" |
| T8: crítico local | **PEQUENA** | Já implementado e testado |
| T9: condenador | **PEQUENA/determinística** | Já é Python puro |
| T10a: índice de redundância | **PEQUENA/determinística** | Match determinístico, gera só pares candidatos |
| T10b: julgamento par-a-par | **PEQUENA** | Bounded a 2 trechos apontados por T10a |
| T11: "leia o curso inteiro e julgue coerência" | **GRANDE — a EVITAR** | Versão ingênua de T10; nunca implementar como tarefa única |

**Insight central**: só T1 é genuinamente grande e insubstituível. Toda tarefa "olhe o todo" deve primeiro tentar virar (índice determinístico + N julgamentos pequenos) antes de aceitar que é grande — convergente com a decomposição G1-G8/T10a-b da Frente G, achada independentemente.

## Onde vive contexto global vs. especialização local

| Objeto | Vive em | Escreve | Lê (RO) |
|---|---|---|---|
| Mapa do curso | JSON estruturado | T1 (1x) + orquestrador (append determinístico pós-aula) | T2, T4, T10a |
| Plano do módulo | Objeto por módulo | T2 | T3-T8 dentro do módulo |
| Bloco local | Objeto por bloco | T3, T5 | T4, T6, T7, T8 |
| Índice de redundância candidata | Por curso, só pares suspeitos | T10a | T10b |
| `.c4` compilado | Referência de domínio | já existe | T6 |

Regra geral: contexto global nunca é "leia tudo e raciocine" — é objeto pequeno e estruturado, construído incrementalmente, de preferência sem LLM.

## Benchmark: 3 pipelines, 6 critérios

(a) pipeline atual (linear, 1 viewId fixo), (b) nova arquitetura hierárquica, (c) 1 agente forte de referência/teto (não candidato a produção).

1. **Qualidade pedagógica** — score médio/60 + % aprovada 1ª tentativa + % em ≤2 iterações. Zero trabalho novo (reusa `lesson_critic.py`/`condemn.py`).
2. **Coerência global** — taxa de redundância não-justificada (pares G1 sem justificativa / total candidatos). Hipótese: (a) deve ter taxa maior por não ter memória cross-aula.
3. **Granularidade** — desvio vs. estimativa humana (~20-25 aulas pro livro inteiro, derivado do design-doc-v2 §E aplicado às 331 páginas reais).
4. **Adequação de representação** — precision/recall de T5 contra gold-set de 20-30 blocos rotulados à mão. **(a) falha 100% por construção — não precisa medir, é leitura direta do schema** (sem campo de representação).
5. **Esforço de revisão humana** — proxy: nº de campos FAIL/PARTIAL × tempo médio calibrado 1x com Lucas.
6. **Robustez** — reaproveita `LlmBudget`/retries já existentes + nova métrica: variância entre 2-3 execuções idênticas (já provada real: 9 vs 5 conceitos).

## Ordem de execução (reduzir incerteza mais barata primeiro)

0. Reaproveitar teste já feito (retry1-3) → 1. bloco isolado (T3/T5 vs gold-set) → 2. 1 aula completa, (a) vs (b) vs (c) → 3. 1 módulo com múltiplas aulas → 4. capítulo denso ("Compromisso e Coerência", maior real) → 5. 2-3 capítulos consecutivos (1º teste real de T1 e T10, usa o próprio reuso do "clique-zum" entre capítulos como caso natural) → 6. livro inteiro (só depois de purgar bugs baratos nos estágios anteriores).

## Gaps sinalizados

Reuso de `scope_planner.py` pra T2 é decisão de implementação, não desta frente. Gold-set de representação ainda não existe (criar manualmente). Estimativa de "~20-25 aulas" é derivada de heurística, não contagem humana real — validar com Lucas.
