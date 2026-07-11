# Revisão — Protocolo Canônico de Ensino (dormente) vs. Arquitetura V2

> Base: `docs/protocolo-ensino-canonico-v1.md` (ratificado por Lucas em 2026-06-30, `project_events.id=2a1d33e0-bd9b-40e1-b568-90a6f9f7d8cc`) comparado item a item contra o que existe hoje em código (`content_author_system.md`, `flowchart_adapter_system.md`, `content_author.py`, `lesson_critic_system.md`) e contra as propostas da síntese de 8 frentes (`SINTESE-FINAL-v1.md`). Decisão pendente de Lucas por item: **reaproveitar / adaptar / descartar / transformar em princípio orientador**.

Cada item segue o mesmo formato pedido: (1) regra/princípio antigo, (2) finalidade original, (3) problema observado, (4) proposta na arquitetura nova, (5) decisão necessária.

---

## Item 1 — §0: Frame de 2 níveis (Gagné 9 eventos + núcleo plugável por tipo de conteúdo)

1. **Regra antiga**: um frame universal (9 Eventos de Gagné, dentro da moldura problem-centered de Merrill) + um núcleo trocável por tipo de conteúdo (Conceito/Procedimento/Princípio/Processo-Sistema/Fato).
2. **Finalidade original**: reconhecer que cada tipo de conteúdo tem um jeito diferente de começar, sem abandonar um esqueleto comum.
3. **Problema observado**: `content_author_system.md` só implementa o esqueleto de 5 blocos (WHY→OVERVIEW→PRÉ-TREINO→DESENVOLVIMENTO→CONSOLIDAÇÃO), sem os 9 eventos nomeados e sem o classificador de tipo — todo conteúdo é tratado com linguagem implícita de "sistema/diagrama", mesmo quando a fonte é Princípio ou Fato. Confirmado real: o Cap. 2 do Cialdini mistura Princípio (dominante) + Procedimento (seção DEFESA) + Fato (citação "Regan, 1971") no MESMO capítulo.
4. **Proposta na arquitetura nova**: campo `content_type` por **bloco didático** (não por aula/curso), decidido antes do Autor escrever, consumido pelo próprio Autor (escolhe núcleo/abertura certos) e validado pelo Crítico/Condenador (bate núcleo aplicado com tipo declarado?).
5. **Decisão necessária**: manter o esqueleto de 5 blocos como está (mais simples pra modelo fraco, ordem macro já validada) e SÓ adicionar o classificador de tipo por bloco por cima dele — ou expandir pros 9 eventos nomeados também? Adotar o classificador de 5 tipos na V2?

---

## Item 2 — §1: Frame macro da aula / cobertura dos 9 eventos de Gagné

1. **Regra antiga**: sequência de 9 eventos (ganhar atenção, informar objetivo, ativar conhecimento prévio, apresentar conteúdo, guiar, provocar prática, feedback, avaliar, reforçar retenção) dentro da moldura Merrill.
2. **Finalidade original**: garantir que a aula não pule etapas cognitivas — em especial prática ativa, feedback e avaliação, que não são "decoração", são onde a retenção realmente acontece.
3. **Problema observado** (mapeamento real, evento a evento):

   | Evento Gagné | Coberto por | Status |
   |---|---|---|
   | 1. Ganhar atenção | WHY | sim |
   | 2. Informar objetivo | — | só metadado, nunca beat visível |
   | 3. Ativar conhecimento prévio | PRÉ-TREINO | parcial |
   | 4. Apresentar conteúdo | DESENVOLVIMENTO | sim |
   | 5. Guiar | DESENVOLVIMENTO | fundido, sem beat próprio |
   | 6. Provocar prática | — | **ausente** |
   | 7. Feedback | — | **ausente** |
   | 8. Avaliar | — | **ausente** |
   | 9. Reforçar retenção | CONSOLIDAÇÃO | sim |

   Achado concreto: cada capítulo do Cialdini termina em "PERGUNTAS DE ESTUDO" (L2198-2233), já divididas em "Domínio do conteúdo" e "Pensamento crítico" — o evento 8 (avaliar) já existe pronto na própria fonte, sem precisar inventar nada, e o harness hoje nem sabe que essas seções existem.
4. **Proposta na arquitetura nova**: NÃO trocar os 5 blocos pelos 9 eventos nomeados (a ordem macro já está certa e é mais simples pra modelo fraco). Adicionar 2 capacidades reais: (a) beat de AVALIAÇÃO populado a partir de perguntas de estudo quando existirem na fonte; (b) pontos de predição/self-explanation dentro do DESENVOLVIMENTO (compatível com engine ephemeral — resposta na mesma sessão, diferente de revisão espaçada entre sessões).
5. **Decisão necessária**: aprovar essas 2 adições específicas (beat de avaliação a partir da fonte; pontos de predição intra-desenvolvimento) sem reestruturar os 5 blocos existentes.

---

## Item 3 — §2: Classificador de tipo + núcleos plugáveis

1. **Regra antiga**: 5 tipos de conteúdo (Conceito, Procedimento, Princípio, Processo/Sistema, Fato), cada um com template de abertura e núcleo de desenvolvimento diferente (ex: Conceito abre com definição+atributos críticos e usa não-exemplos; Procedimento abre com demonstração e usa fading de prática guiada).
2. **Finalidade original**: reconhecer que "como explicar bem" depende do tipo de conteúdo — um Fato não deveria receber o mesmo tratamento narrativo que um Processo.
3. **Problema observado**: nunca implementado. O harness atual trata tudo com linguagem de "sistema"/"diagrama"/"território", que funciona bem pra arquitetura de software (nosso caso original) mas é um gap real confirmado ao testar com o Cialdini (não é um sistema técnico).
4. **Proposta na arquitetura nova**: campo `content_type` por bloco no schema do Autor de Conteúdo. Acréscimo importante da Frente C: o classificador DETERMINA a representação visual, não o contrário — Princípio favorece diagrama causal pequeno, Fato favorece texto/mnemônica, Conceito favorece tabela (comparação de atributos).
5. **Decisão necessária**: confirmar que a granularidade certa é por BLOCO DIDÁTICO (não aula, não curso) — isso já é a recomendação técnica de 2 frentes independentes (C e D), mas é uma decisão de schema que trava o contrato do Autor de Conteúdo V2, então precisa do sim explícito antes de fechar.

---

## Item 4 — §3: Sequenciamento e scaffolding (5 sub-regras)

1. **Regra antiga**: (a) whole-part-whole/elaboration — beat 0 = fluxograma inteiro no caminho feliz, depois reintroduzir uma complicação por beat sempre voltando ao todo; (b) concreteness fading — caso concreto nomeado → diagrama genérico → princípio abstrato; (c) par exemplo→problema — todo conceito novo vem com exemplo resolvido antes de um problema gêmeo; (d) fading adaptativo — o andaime diminui quando o aluno acerta, não em ritmo fixo; (e) espaçamento+intercalação — aquisição em blocos por padrão, revisão intercalada só entre conceitos confundíveis.
2. **Finalidade original**: evitar 2 erros opostos — carga cognitiva desnecessária (andaime demais pro aluno avançado) e generalização errada (aluno não sabe distinguir 2 conceitos parecidos).
3. **Problema observado**: whole-part-whole está parcialmente presente via OVERVIEW→DESENVOLVIMENTO→CONSOLIDAÇÃO, mas "reintroduzir uma complicação por beat, sempre voltando ao todo" nunca foi formalizado como regra checável. As outras 4 sub-regras (concreteness fading, par exemplo-problema, fading adaptativo, intercalação seletiva) nunca chegaram nem ao prompt nem ao código — zero verificação, zero guardrail hoje.
4. **Proposta na arquitetura nova**: nenhuma das 8 frentes desta rodada desenhou isso em detalhe — o escopo da pesquisa foi a estrutura curso→módulos→aulas→blocos→representação, não a escrita fina do Autor dentro de um bloco já definido. Candidato natural a virar **princípio orientador em texto** pro Autor (não guardrail determinístico), porque checar "fading adaptativo" ou "intercalação seletiva" automaticamente exigiria estado de progresso do aluno — o que hoje contradiz a decisão de engine ephemeral (mesma tensão da revisão espaçada, já registrada como GAP separado).
5. **Decisão necessária**: Lucas decide se esse item vira pesquisa própria dedicada (nível de ambição alto) ou se por ora entra só como texto-guia no prompt do Autor, sem guardrail de verificação (nível de ambição contido, ganho mais rápido).

---

## Item 5 — §4: Protocolo de abertura por gap de curiosidade (Loewenstein)

1. **Regra antiga**: cena-problema concreta → abrir a lacuna ("o óbvio falha — por quê?") → why-before-what → organizador de 1 frase (nomeia o destino sem entregar a resposta) → conduzir como narrativa (conflito = trade-off; stakes = o que falha); variar por público (iniciante precisa de âncora/analogia antes; experiente aguenta um gap maior, pode furar uma crença que já tem).
2. **Finalidade original**: curiosidade genuína ativa "modo-retenção" no cérebro (Gruber/Neuron) — até o detalhe seguinte gruda melhor.
3. **Problema observado**: só a versão resumida de P2 chegou ao harness ("P2 Why before what: abra com o problema antes do mecanismo") — 1 linha, sem a estrutura completa de 4-5 passos, sem exemplo, sem variação por nível do aluno. Achado real da Frente C: o próprio Cialdini já usa esse padrão organicamente (caso Etiópia/México doou US$ 5 mil ao México em 1985 após terremoto, retribuindo ajuda recebida em 1935 — L964-982), o que dá um exemplo real e pronto pra virar few-shot no prompt.
4. **Proposta na arquitetura nova**: expandir P2 de "1 frase resumida" pra um protocolo de abertura explícito de 4-5 passos no prompt do Autor, com o exemplo real do Cialdini anexado como referência.
5. **Decisão necessária**: aprovar essa expansão — trade-off real a decidir: mais texto/estrutura no prompt tende a produzir aberturas melhores, mas também aumenta o risco de um modelo fraco se perder ou ignorar parte de um prompt mais longo. Vale testar antes de adotar como regra fixa?

---

## Item 6 — §5: Percorrer o diagrama (10 técnicas de revelação/câmera)

1. **Regra antiga**: 10 técnicas (nunca mostrar o todo de início; 1 passo=1 conceito=1 câmera; câmera lenta/pausável; texto e movimento juntos no tempo; signaling com parcimônia; movimento congruente com o fluxo real; parada self-contained; tour por zoom C4 sem misturar níveis; pontos de predição antes de revelar o próximo passo; manter o já-explicado visível).
2. **Finalidade original**: transformar "diagrama tudo de uma vez" (carga alta) em passos discretos com ritmo controlado (Tversky).
3. **Problema observado**: JÁ implementado em boa parte, mas nunca documentado como aplicação direta do protocolo — `flowchart_adapter_system.md` (REGRA HARD C2) já força `overview → walkthrough-start/walkthrough sequencial → consolidate`, que é exatamente §5.1 (progressive reveal) somado a P1 (overview calmo) e P4 (fecho consolidador). Faltam de verdade: pontos de predição/self-explanation (mesmo gap do Item 2) e a garantia de que o "tour por zoom C4" (context→container→component) vai se sustentar quando a hierarquia virar curso→módulo→aula→bloco (ainda não testado).
4. **Proposta na arquitetura nova**: (a) generalizar "overview" pra "mostre a representação escolhida inteira, calma" — não só diagrama, também tabela/texto puro (Frente C); (b) declarar explicitamente que as 10 técnicas do §5 só se aplicam quando `representação=diagrama` — resolve a tensão P1 (overview calmo) vs. §5.1 (revelação progressiva), já convergida independentemente por 2 frentes (C e E), mas ainda sem o sim formal de Lucas (é o item 1 das 7 decisões abertas da síntese).
5. **Decisão necessária**: (a) ratificar formalmente a resolução P1/§5.1 acima; (b) decidir se pontos de predição/self-explanation entram nesta rodada de implementação ou ficam pro backlog.

---

## Item 7 — §6: Regra de conceitos (2 limiares — bug real confirmado em código)

1. **Regra antiga**: dois limites que medem coisas diferentes — POR BEAT (hard): ≤3 conceitos novos (alvo), 4 = teto (carga instantânea, working memory ~4 chunks — Cowan); POR AULA (guia): 5-7 conceitos novos no total, remédio se passar = **segmentar em mais aulas** (Mayer segmenting; atenção cai ~6 min — Guo).
2. **Finalidade original**: por-beat controla a carga simultânea da tela; por-aula controla escopo/fadiga do todo — não são a mesma coisa, um não substitui o outro.
3. **Problema observado** (bug real, não hipotético — `content_author.py:69-70,108-118`): `MAX_CONCEPTS_PER_BEAT=3` está correto e bate com o protocolo. Mas `MAX_CONCEPTS_PER_LESSON=6` é implementado como **número único tratado como gate duro** — se a aula tiver mais de 6 conceitos, o harness REJEITA e manda o Autor tentar de novo com a instrução: *"Reduzir o número de conceitos distintos ou focar em menos ideias"*. Esse é o remédio ERRADO. O protocolo original manda segmentar em mais aulas — decisão de nível de módulo, fora do alcance do Autor sozinho reescrevendo a mesma aula.
4. **Proposta na arquitetura nova** (Frente F, usando o teste objetivo crítico-vs-guia desenvolvido nesta rodada): reclassificar o limite por-aula de CRÍTICO (gate duro, retry no mesmo loop) para GUIA com escalação — vira uma faixa (5-7 alvo, teto maior ~10 realmente crítico) que aciona reestruturação em nível de módulo (mais aulas), nunca um retry pedindo "apague conceito" na mesma aula. `MAX_CONCEPTS_PER_BEAT=3` continua crítico sem mudança.
5. **Decisão necessária**: aprovar a correção do bug — mudar de "gate duro no mesmo loop" pra "guia com escalação pro nível de módulo". Este item já tem consenso técnico forte (código real, bug real, remédio já desenhado e testado na lógica), risco baixo de estar errado — mas por ser mudança de regra crítica no schema, ainda exige o sim explícito de Lucas antes de virar contrato.

---

## Resumo executivo (pra decisão rápida)

| Item | Nível de consenso técnico | Esforço se aprovado |
|---|---|---|
| 1. Frame 2 níveis + classificador de tipo | Alto (2 frentes convergem) | Médio — novo campo no schema do Autor |
| 2. Cobertura dos 9 eventos (avaliação + predição) | Alto (achado concreto na fonte real) | Baixo — 2 capacidades pontuais, sem reestruturar |
| 3. Classificador de tipo por bloco | Alto (2 frentes convergem) | Médio — mesmo campo do item 1, decide também representação |
| 4. Scaffolding fino (5 sub-regras) | Baixo (não pesquisado nesta rodada) | Alto se virar guardrail; baixo se só virar texto-guia |
| 5. Protocolo de abertura completo | Médio (achado real, mas trade-off de prompt longo) | Baixo — expandir 1 seção do prompt |
| 6. Percorrer o diagrama (10 técnicas) | Alto (maior parte já implementada) | Baixo — só falta formalizar + 2 gaps pontuais |
| 7. Regra de conceitos (bug real) | Muito alto (bug confirmado em código) | Baixo — mudança de classificação, não de arquitetura |
