# Eixo Pedagógico — Gagné/Merrill, Prática, Feedback e Avaliação (V2)

> Aprofundamento pedido por Lucas em cima do Item 2 (cobertura dos 9 eventos de Gagné) e Item 5
> (protocolo de abertura) de `revisao-protocolo-canonico-vs-v2.md`. Usa os schemas já desenhados em
> `contratos-schemas-pipeline-hierarquica-v1.md` como base — este documento propõe EXTENSÕES, não
> reescreve o que já existe. Nenhum código foi implementado. Grounding: exemplos reais extraídos de
> `fonte-real/as-armas-da-persuasao.txt` (não hipotéticos).

## STATUS — decisão de Lucas para o MVP (2026-07-11, `agent_messages.id=49d1a5d5`)

| Decisão (seção final) | Resultado |
|---|---|
| 1. Expandir `aula.abertura` (cena_problema, abertura_da_lacuna, organizador_uma_frase) | **APROVADO pro MVP** — tela introdutória calma, não é escolha interativa do aluno. Já mergeado em `contratos-schemas-pipeline-hierarquica-v1.md` §2.2. |
| 2. `pre_treino`/`pratica` no enum `papel_na_aula` | **FORA DO MVP** |
| 3. Objeto `interacao` (pergunta/opções/gabarito/feedback) | **FORA DO MVP** |
| 4. Prática obrigatória/recomendada dentro da aula | **FORA DO MVP** |
| 5. Heurística content_type→tipo_interacao | **FORA DO MVP** |
| 6. Princípio `P-PRAT` no Crítico | **FORA DO MVP** |
| 7. Revisão espaçada / qualquer prova-teste-avaliação | **FORA DESTA RODADA** — se existir, será sistema/artefato separado da aula principal, não parte deste schema |
| 8. Transformação essay→clique das perguntas de estudo | **FORA DO MVP** |

**Diretriz do MVP**: foco em apresentação de alta qualidade (fluxograma + texto); a aula não é interrompida por teste/prática/avaliação. As seções 2-10 abaixo continuam como referência de design (não descartadas, não contraditas) para quando essa rodada futura for priorizada — não fazem parte do contrato MVP atual.

---

## 1-2. Em quais etapas entram + quem produz/revisa/valida

| Elemento pedagógico | Etapa que produz | Etapa que revisa/valida | Onde mora no schema |
|---|---|---|---|
| Abertura/gancho (curiosity gap) | C. Autor de Conteúdo | F. Crítico (P2, crítico) | `aula.abertura` (já existe, proposta expandir — seção 3) |
| Ativação de conhecimento prévio | C. Autor de Conteúdo | F. Crítico (P3, crítico) | `bloco.papel_na_aula` (proposta adicionar valor `pre_treino` — hoje só abertura/desenvolvimento/fechamento) |
| Explicação (núcleo) | C. Autor de Conteúdo | F. Crítico (P7, P13) | `bloco.conteudo`, sem mudança |
| Prática | C. Autor de Conteúdo (decide o quê) + D. Adaptador de Representação (decide se reusa diagrama já existente como superfície de clique) | F. Crítico (novo princípio, seção 10) | novo objeto `interacao` (seção 3) |
| Feedback | C. Autor de Conteúdo (escreve o texto por opção) | F. Crítico (checa presença e não-genericidade) | dentro de `interacao.opcoes[].feedback` |
| Checagem de compreensão | C. Autor de Conteúdo | F. Crítico + H. Crítico de Coerência de Curso (checa se repete a mesma pergunta em aulas diferentes sem variação) | mesmo objeto `interacao`, `finalidade=avaliacao` |
| Revisão espaçada | **fora do escopo desta pipeline** (decisão já registrada: "saída futura", contradiz engine ephemeral) | — | hook mínimo já existe: `indice_conceitos_nucleares[].primeira_introducao` no mapa do curso já registra qual aula introduziu qual conceito — é o dado mínimo que um agendador futuro precisaria; nada novo a desenhar agora |

Nenhuma etapa nova (A-J) precisa ser criada. As responsabilidades encaixam nas etapas C, D, F, H já desenhadas — só D e F ganham escopo adicional (D decide se a prática reusa um diagrama já compilado; F ganha 1-2 princípios novos).

---

## 3. Schemas — extensões propostas (não substituem o que já existe)

### 3.1 `aula.abertura` — expandir (Item 5 da revisão)

Hoje: `{ problema_ou_gap, recap_aula_anterior }`. Proposta:

```json
"abertura": {
  "properties": {
    "cena_problema": { "type": "string", "description": "situação concreta, nomeada, ancorada na fonte — nunca abstrata" },
    "abertura_da_lacuna": { "type": "string", "description": "a pergunta 'por que isso é estranho/não-óbvio' — Loewenstein" },
    "organizador_uma_frase": { "type": "string", "maxLength": 150, "description": "nomeia o destino sem entregar a resposta" },
    "problema_ou_gap": { "type": "string", "description": "campo já existente, mantido por compat" },
    "recap_aula_anterior": { "type": ["string", "null"] }
  }
}
```

Os 3 campos novos são **opcionais** (schema MINOR bump, não MAJOR) — uma aula simples/curta pode preencher só `problema_ou_gap` como hoje; uma aula que se beneficia do protocolo completo preenche os 3.

### 3.2 `bloco.papel_na_aula` — adicionar `pre_treino`

Hoje: `enum: [abertura, desenvolvimento, fechamento]`. Proposta: `enum: [abertura, pre_treino, desenvolvimento, pratica, fechamento]`. Justifica: o esqueleto de 5 blocos do harness já distingue PRÉ-TREINO de DESENVOLVIMENTO na prosa (`content_author_system.md` linha 39), mas o schema atual não tem essa distinção — bug de cobertura análogo ao achado do Item 2. Adicionar `pratica` deixa explícito onde os pontos de prática/checagem entram na sequência de blocos, sem precisar inventar um objeto novo por fora do array `blocos[]`.

### 3.3 Novo objeto `interacao` (dentro de `bloco_didatico` quando `papel_na_aula=pratica`)

Reaproveita a MESMA estrutura para prática (Gagné 6) e checagem/avaliação (Gagné 8) — diferenciados só pelo campo `finalidade`, evitando 2 schemas quase-duplicados:

```json
"interacao": {
  "type": "object",
  "required": ["tipo_interacao", "finalidade", "conceito_alvo", "pergunta", "opcoes", "origem"],
  "properties": {
    "tipo_interacao": {
      "enum": ["multipla_escolha", "verdadeiro_falso", "clique_no_elemento", "ordenar_passos"],
      "description": "escolhido a partir do content_type do bloco que está sendo praticado (seção 5) — nunca fixo"
    },
    "finalidade": { "enum": ["pratica", "avaliacao"], "description": "pratica = Gagné 6 (baixo risco, dentro do desenvolvimento); avaliacao = Gagné 8 (fim de aula/módulo)" },
    "conceito_alvo": { "type": "string", "description": "DEVE existir em indice_conceitos_nucleares — validado em código, mesmo padrão de conceitos_referenciados" },
    "pergunta": { "type": "string" },
    "elemento_diagrama_alvo": { "type": ["string", "null"], "description": "só para tipo_interacao=clique_no_elemento — FQN do nó/aresta já presente na view compilada usada por este bloco/aula. Reusa o diagrama já renderizado, zero superfície visual nova." },
    "opcoes": {
      "type": "array", "minItems": 2, "maxItems": 5,
      "items": {
        "type": "object",
        "required": ["texto", "correta", "feedback"],
        "properties": {
          "texto": { "type": "string" },
          "correta": { "type": "boolean" },
          "feedback": { "type": "string", "description": "obrigatório mesmo quando correta=true — feedback positivo curto, não só 'certo!'" }
        }
      },
      "description": "validação em código: exatamente 1 item com correta=true para multipla_escolha/verdadeiro_falso/clique_no_elemento; ordenar_passos usa 'ordem_correta' em vez de 'correta' (variante, ver 3.4)"
    },
    "origem": {
      "type": "object",
      "required": ["fonte", "adaptado_de_pergunta_fonte"],
      "properties": {
        "fonte": { "enum": ["gerado_do_conteudo", "adaptado_de_pergunta_de_estudo"] },
        "adaptado_de_pergunta_fonte": { "type": ["string", "null"], "description": "citação literal da pergunta original da fonte (ex: PERGUNTAS DE ESTUDO), se o tipo_interacao foi transformado de um formato aberto pra clique — auditável, mesma disciplina de origem_na_fonte.trecho_citado" }
      }
    }
  }
}
```

`ordenar_passos` usa uma variante mínima de `opcoes` (cada item ganha `ordem_correta: integer` em vez de `correta: boolean`) — mesma família de objeto, não um schema à parte.

**Validação determinística (código, nunca autorrelato)**: exatamente 1 `correta=true` (exceto `ordenar_passos`); `conceito_alvo` existe no índice; se `tipo_interacao=clique_no_elemento`, `elemento_diagrama_alvo` existe nos FQNs válidos da view (mesmo padrão de `_validate_fqns` já existente); distratores não citam fato/número/nome ausente da fonte (reaproveita a mesma checagem anti-invenção textual já usada no bloco `conteudo`, aplicada também aos `opcoes[].texto`).

---

## 4. Como evitar sequência rígida e repetitiva

**Regra proposta (GUIA, não crítica — teste crítico-vs-guia da Frente F aplicado aqui)**: um bloco `pratica` só é **esperado** (não obrigatório em toda aula) quando `aula.meta.total_conceitos_novos >= 2` E a aula não é puramente `fechamento`/recap. Aulas curtas de 1 conceito não ganham prática forçada — isso reusa um dado que já existe (`total_conceitos_novos`, já recalculado em código hoje), não inventa heurística nova.

**Frequência**: 1 bloco de prática por agrupamento natural de desenvolvimento (não 1 por beat — isso violaria P6/P9, ritmo do aluno), decidido pelo próprio Autor de Conteúdo ao escrever a aula, validado pelo Crítico só quanto à presença/qualidade, nunca quanto à contagem exata (contagem exata seria regra mecânica demais, o oposto do que Lucas pediu no ponto 4).

**Variação de tipo**: `tipo_interacao` não é fixo — é escolhido a partir do `content_type` do bloco (ver seção 5), o que já impede repetição automática do mesmo formato aula após aula.

---

## 5. Adaptar intensidade e tipo por contexto

| `content_type` (Item 3 da revisão) | `tipo_interacao` preferencial | Por quê |
|---|---|---|
| Fato | `multipla_escolha` ou `verdadeiro_falso` | associação simples, sem estrutura causal |
| Princípio | `verdadeiro_falso` sobre um caso novo, ou `multipla_escolha` "qual dessas consequências segue da regra?" | testa a relação causal, não só a lembrança |
| Processo/Sistema | `clique_no_elemento` no diagrama já renderizado | reusa a representação visual já produzida — zero custo extra de autoria de opções textuais |
| Procedimento | `ordenar_passos` | testa a sequência, que é o próprio conteúdo do tipo |
| Conceito | `multipla_escolha` com 1 exemplo real + distratores que são **não-exemplos** (mesma técnica do §2 do protocolo: "diferindo em 1 atributo crítico") | reaproveita a técnica de não-exemplo já prevista no protocolo dormente, nunca implementada |

**Intensidade por `nivel`** (campo já existente em `aula`): iniciante → prática mais frequente, opções mais claramente distintas (poucos distratores plausíveis); avançado → prática menos frequente mas mais discriminativa (distratores mais próximos/plausíveis, ex: 2 nós vizinhos no diagrama em vez de 2 nós distantes).

---

## 6. Interações simples e gamificadas por clique — exemplo real aplicado ao PDF

**Achado importante**: o formato NATIVO das "PERGUNTAS DE ESTUDO" da fonte é 100% dissertativo/aberto (ex: "Descreva como o estudo de Regan ilustra cada uma das três características dessa regra" — L2204-2205). Isso **contradiz diretamente** o pedido de interação simples por clique. A pipeline não pode simplesmente extrair essas perguntas — precisa de uma transformação real: essay → clique, preservando o alvo cognitivo (recall vs. aplicação) mas trocando o modo de resposta.

**Exemplo concreto (Cap. 2, L2200-2201, `Domínio do conteúdo` pergunta 1)**:

- Pergunta original da fonte: *"O que é a regra da reciprocidade? Por que ela é tão poderosa em nossa sociedade?"* (dissertativa)
- Transformação proposta (`tipo_interacao=multipla_escolha`, `finalidade=avaliacao`, `origem.fonte=adaptado_de_pergunta_de_estudo`):
  - `pergunta`: "Qual das opções abaixo define corretamente a regra da reciprocidade?"
  - `opcoes`: (a) "Devemos retribuir o que outra pessoa nos oferece" — `correta=true`, feedback: "Isso mesmo — e o texto mostra que essa obrigação é sentida mesmo quando não pedimos o favor." (b) "Devemos ajudar quem tem menos que nós" — `correta=false`, feedback: "Não é isso — a regra não depende de quem tem mais ou menos, e sim de quem deu primeiro." (c) "Devemos retribuir só a quem gostamos" — `correta=false`, feedback: "O texto mostra o contrário: a regra funciona mesmo sem simpatia pelo doador (ver experimento de Regan)."
  - Distratores (b) e (c) são construídos a partir de conceitos REAIS do mesmo capítulo (simpatia, dádiva não solicitada) — nunca fatos inventados, honrando a regra anti-invenção já em vigor no Autor de Conteúdo.

**Exemplo de `clique_no_elemento` (hipotético, aplicável a material com diagrama de processo)**: pergunta "Qual etapa do fluxo é responsável por X?", `elemento_diagrama_alvo` aponta pro FQN correto, opções de clique são os 3-4 nós já visíveis naquele momento do walkthrough — nenhuma opção textual nova precisa ser escrita, só o rótulo do gabarito certo/errado por nó.

---

## 7. Fronteira pipeline (dados) vs. interface (futuro)

**Pipeline entrega (dados, esta arquitetura)**: o objeto `interacao` completo e validado — pergunta, opções, qual é certa, feedback por opção, conceito alvo, proveniência. Isso é o mesmo nível de responsabilidade que a pipeline já tem hoje sobre `representacao` (decide diagrama/tabela/texto, não decide pixel).

**Interface decide (fora desta pipeline, não desenhado aqui)**: como o clique é renderizado (botão, cartão, drag-handle), animação de acerto/erro, som, pontuação/streak/gamificação de progresso, se guarda histórico de tentativas do aluno. Nenhum desses campos entra em `bloco_didatico.schema.v1` — mesma disciplina já usada para não misturar "o quê" (Autor) com "como" (Diretor/app).

---

## 8. Modelo fraco e consistência

Gerar 1 objeto `interacao` para 1 bloco já escrito é uma tarefa **pequena e limitada** (mesma classe T3-T5 da Frente H): input é só o `conteudo` daquele bloco + o `conceito_alvo` já decidido, output é um objeto categórico pequeno (2-5 opções), validável 100% em código (contagem de opções, exatamente 1 correta, `conceito_alvo` existe no índice, distratores sem fato novo). Nenhuma chamada precisa "ver a aula inteira" pra gerar uma prática — mesma disciplina de escopo estreito já adotada em todo o resto da arquitetura V2.

---

## 9. Reaproveitar / adaptar / descartar do protocolo antigo (cruza com a revisão já enviada)

- **Reaproveitar sem mudança**: P2/P3/P7/P8/P13 (já no harness), REGRA HARD C2, anti-invenção.
- **Adaptar**: protocolo de abertura §4 (Item 5) — expandir de 1 frase pra 3 campos estruturados; classificador de tipo (Item 1/3) — usado agora também pra decidir `tipo_interacao`, não só representação visual.
- **Transformar em capacidade nova, não só princípio orientador**: extração de "PERGUNTAS DE ESTUDO" da fonte (Item 2) — precisa de um passo real de transformação essay→clique, não é reaproveitamento direto.
- **Nada a descartar** neste eixo — nenhum item do protocolo se mostrou inútil ou incompatível, mesma conclusão da revisão anterior.

---

## 10. Validar qualidade sem checklist mecânico

**Camada determinística (código, gate duro)**: objeto `interacao` bem formado (contagem de opções, 1 correta, conceito existe, FQN existe se `clique_no_elemento`, sem fato inventado nos distratores via mesmo verificador textual já usado no `conteudo`).

**Camada de julgamento (Crítico, G-Eval — mesmo método já usado em P13 no `lesson_critic_system.md`, não um novo checklist)**: 1 princípio novo proposto, **P-PRAT** (não crítico, mesmo tratamento de P6/P9/P10/P11/P13/P22/P27 — PASS exige justificativa concreta citando bloco/conceito real): *"Se a aula introduziu conceito nuclear novo, existe pelo menos um ponto de prática/checagem que testa esse conceito especificamente — não um teste genérico que serviria pra qualquer aula do curso?"* Avaliado por evidência observável (mesmo padrão dos exemplos PASS/FAIL já documentados pro P13), não por contagem.

**Camada de curso (Crítico de Coerência de Curso, etapa H)**: reusa exatamente a lógica G1 já desenhada pela Frente G — mesma pergunta ("a mesma checagem se repete em 2+ aulas sem variar?") aplicada a `interacao.pergunta` em vez de exemplo narrativo. Nenhuma lógica nova, só o mesmo padrão aplicado a um novo tipo de conteúdo.

---

## Decisões que dependem de Lucas

1. Aprovar a expansão de `aula.abertura` pra 3 campos novos (cena_problema, abertura_da_lacuna, organizador_uma_frase) — MINOR bump, opcional, mantém compatibilidade.
2. Aprovar adicionar `pre_treino` e `pratica` ao enum `bloco.papel_na_aula`.
3. Aprovar o objeto `interacao` como novo componente de `bloco_didatico` (schema completo na seção 3.3).
4. Aprovar a regra de "prática esperada só se `total_conceitos_novos >= 2` e aula não é recap" como GUIA (não crítica) — evita rigidez mecânica.
5. Aprovar a tabela `content_type → tipo_interacao` da seção 5 como heurística inicial (sujeita a ajuste depois do benchmark).
6. Aprovar o novo princípio **P-PRAT** no Crítico (G-Eval, não crítico, mesmo padrão de P6/P9/P10/P11/P13/P22/P27).
7. Confirmar que revisão espaçada continua fora de escopo desta rodada — só o hook de dados (`primeira_introducao` no índice de conceitos) já existente é suficiente por ora, nada novo a desenhar.
8. Decidir se a transformação essay→clique das "PERGUNTAS DE ESTUDO" da fonte é prioridade desta rodada ou fica pro backlog (é capacidade nova, não reaproveitamento — tem custo de implementação real).
