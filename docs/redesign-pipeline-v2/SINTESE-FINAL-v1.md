# Síntese Final — Pesquisa Arquitetural (8 frentes, revisão adversarial cruzada)

> Subcoordenador: claude_linux. Todas as 8 frentes leram `vocabulario-canonico-v1.md` e trabalharam sobre a fonte real (`fonte-real/as-armas-da-persuasao.txt`, Cialdini, 331 páginas). Este documento resolve convergências, aponta as poucas divergências reais, e lista o que fica explicitamente em aberto para decisão de Lucas.

## 1. Convergências fortes (achadas independentemente por frentes diferentes — alta confiança)

1. **"Carga visual por step" continua fora** — nenhuma frente reabriu isso; confirmado que REGRA HARD C2 já resolve.
2. **Granularidade do classificador de tipo é por BLOCO, não por curso/aula** — Frente C confirmou isso lendo o texto real (Princípio+Procedimento coexistindo no mesmo capítulo); Frente D usou a mesma premissa pra conectar tipo↔representação; Frente B organiza o mapa do curso por "conceitos nucleares" (nível de bloco), não por capítulo.
3. **Revisão global nunca é 1 chamada sobre o curso inteiro** — Frente G (critérios G1-G8: determinístico + LLM só no par candidato) e Frente H (T10a/T10b, "nunca implementar T11 como tarefa única") chegaram à MESMA decomposição por caminhos independentes. Reforça fortemente a validade da abordagem.
4. **"Mapa do curso" como objeto pequeno, somente-leitura, nunca cresce com o conteúdo total** — decisão idêntica em B, E, F, G, H.
5. **T1 (curso→módulos) é a única tarefa genuinamente grande/cara** — Frente H formalizou isso; Frente E's Etapa A (Estruturador de Curso) e Frente B's Stage 3 (montagem do mapa) mapeiam pro mesmo ponto da arquitetura.
6. **Reaproveitar `scope_planner.py`, `condemn.py`, o padrão de "nunca confiar em autorrelato", e o checkpoint/resume do orchestrator** — unânime em todas as frentes que tocaram nisso (B, E, F, G, H).

## 2. Tensões identificadas e como foram resolvidas

### 2.1 Tensão P1 (overview calmo) vs. §5.1 do protocolo dormente (revelação progressiva)
**Resolvida por convergência independente**: Frente C (leu o código, achou que `flowchart_adapter_system.md` já implementa `overview→walkthrough→consolidate` sem documentar o porquê) e Frente E (schema `bloco_didatico.representacao.diagrama.revelacao`, enum `calma_inteira`/`progressiva`) chegaram à MESMA resolução: P1 rege o beat de abertura/orientação; revelação progressiva rege os beats de desenvolvimento; ambos só se aplicam quando `representação=diagrama`. **Ainda precisa da ratificação explícita de Lucas** (ambas as frentes marcaram como HYPOTHESIS, não decisão fechada) — mas a convergência de 2 análises independentes eleva a confiança.

### 2.2 Divergência real nos limiares numéricos de conceito entre docs antigos
`fabrica-de-aulas-design-doc-v2.md` §E diz "≤6 conceitos/aula" (número único). `protocolo-ensino-canonico-v1.md` §6 diz "3-4 por beat (hard) + 5-7 por aula (guia)". **Resolvida pela Frente F**: adota a versão do protocolo (mais rica, com fonte dupla Cowan+Mayer+Guo), reclassifica o limite por-aula de CRÍTICO pra GUIA (o remédio certo — segmentar — não está ao alcance do Autor sozinho reescrevendo a mesma aula). Frente E incorpora isso no catálogo único `regras_criticas.json` proposto.

### 2.3 Mecanismo de dedupe de sinônimos de conceito (`indice_conceitos_nucleares.sinonimos`)
Frente E deixou em aberto (embedding? LLM leve? lista curada?). **Resposta parcial da Frente G**: seu critério G6 ("Consistência terminológica") já propõe LLM-leve pareado pra esse exato problema — mesmo conceito, nomes diferentes, julgamento em par pequeno, nunca curso inteiro. Adotamos G6 como o mecanismo de dedupe de sinônimos; não é embedding, é o mesmo padrão de "judge estreito só no candidato" já usado no resto da arquitetura.

### 2.4 Conexão classificador de tipo ↔ escolha de representação (pergunta que a Frente D deixou aberta)
Frente D perguntou explicitamente: Princípio sempre não-precisa-de-diagrama? **Resposta, cruzando D com C**: não é tão simples — Princípio enunciado como regra isolada (1 aresta) → texto; Princípio operacionalizado como técnica repetível (sequência de passos, como rejeição-recuo) → empurra pra comportamento de Processo/Sistema e SIM gera diagrama. A fronteira não é o tipo declarado, é se o texto desenvolve o tipo em sequência com dependência real entre passos. Isso já está documentado na Frente C (seção 1) e Frente D (seção "conexão com classificador").

## 3. Nenhuma divergência irreconciliável encontrada

As 8 frentes convergem ou se complementam em todos os pontos onde se cruzam. Isso é, em si, um resultado — não houve necessidade de arbitrar entre propostas incompatíveis, só de conectar peças que cada frente desenhou olhando um ângulo diferente do mesmo objeto (principalmente o "mapa do curso", que E, B, F e G desenharam a partir de necessidades diferentes e chegou a um schema coerente único, ver `contratos-schemas-pipeline-hierarquica-v1.md` seção 1).

## 4. Achados novos de alto valor que nenhuma pesquisa anterior tinha (mesmo o protocolo dormente)

1. **Anexo/figura sem dado no texto** (Frente A) — risco real de alucinação, nenhum guardrail cobria isso antes; deve virar `flag: fonte_incompleta` no schema de bloco (a acrescentar).
2. **"PERGUNTAS DE ESTUDO" prontas na fonte, nunca usadas** (Frente C) — evento 8 de Gagné (avaliar) já existe no material, de graça, e o harness atual não sabe disso.
3. **Evidência real de variância de modelo fraco** (Frente H, reaproveitando `fixtures/fabrica-test-2026-07-06-retry`) — 9 vs. 5 conceitos no mesmo capítulo/modelo, vazamento de idioma — isso já existia como dado real, nunca tinha sido conectado ao redesign.
4. **Drift de regra em 3 lugares** (Frente E) — máx-3-conceitos/beat e o conjunto crítico P1/P2/P3/P7/P15/P23/P28 vivem duplicados em prompt+código+doc, sem fonte única — motivou a proposta de `regras_criticas.json`.
5. **Marcadores de página (`\x0c`) existem no PDF mas não há número textual** (Frente A + E, convergente) — toda rastreabilidade de página fica `confianca: hypothesis` até o Ingest (ainda 100% manual) preservar isso.

## 5. Decisões que ficam EXPLICITAMENTE em aberto para Lucas

1. **Ratificar a resolução da tensão P1/§5.1** (seção 2.1 acima) — já convergida por 2 frentes, falta só o sim formal.
2. **Estruturador de Curso (T1/Etapa A) — lógica interna** — combinado antes que precisa de pesquisa própria; esta rodada só desenhou o contrato de entrada/saída, não a lógica de decisão. Não foi resolvido aqui de propósito.
3. **Concorrência do Orquestrador Hierárquico** (módulos serializados + aulas paralelas dentro do módulo) — HYPOTHESIS da Frente E, não testada.
4. **Gold-set de representação** (20-30 blocos rotulados à mão) — precisa ser criado por Lucas ou por um agente com revisão humana antes do benchmark estágio 1.
5. **Estimativa de "~20-25 aulas" pro livro inteiro** — derivada de heurística do design-doc-v2, não contagem humana real. Validar ou substituir.
6. **Revisão espaçada entre sessões** — decisão separada, já registrada como fora do escopo desta pesquisa (exige estado persistido do aluno, contradiz engine ephemeral).
7. **Se/quando propagar o restante do protocolo-ensino-canonico** (frame completo Merrill+Gagné, pontos de predição, beat de avaliação) — a Frente C recomenda propagação, mas é decisão de escopo/prioridade de Lucas, não fato técnico.

## 6. Estado dos entregáveis do plano de 9 passos (passo 5: "desenhar arquitetura completa sem codar")

- ✅ Schemas dos objetos intermediários (`contratos-schemas-pipeline-hierarquica-v1.md`)
- ✅ Contratos por etapa (mesmo arquivo, seção 3, 10 etapas incl. 2 novas)
- ✅ Autoridade e limites de cada agente (mesmo arquivo)
- ✅ Vocabulário canônico (refinado, `vocabulario-canonico-v1.md` + adições da Frente F ainda pendentes de merge)
- ✅ Critérios de sucesso/falha (Frente H, 6 critérios mensuráveis)
- ✅ Revisão local e global (Frente G)
- ✅ Plano de benchmark (Frente H, 6 estágios de execução)
- ✅ Indicação do que reaproveitar da pipeline atual (seção 4 do documento de contratos)
- ⬜ **C4 da pipeline inteira** — ainda não desenhado em LikeC4; próximo passo natural depois desta síntese ser revisada por Lucas.
- ⬜ Merge das adições de vocabulário (Frente F) no arquivo canônico — pendente de decisão de Lucas sobre os termos propostos.
