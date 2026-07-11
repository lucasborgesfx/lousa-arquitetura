# Estruturador de Curso (Etapa A) — Lógica Interna v1

> Frente: pesquisa própria pendente registrada em `contratos-schemas-pipeline-hierarquica-v1.md`
> (seção 3, linha "A. Estruturador de Curso" — *"GAP explícito, não resolvido aqui... precisa de
> pesquisa própria antes de implementar"*) e em `SINTESE-FINAL-v1.md` (seção 5, item 2). Este
> documento fecha esse GAP: desenha a lógica interna da Etapa A (fonte → esqueleto de módulos do
> mapa do curso). **Sem código.** Usa o vocabulário de `vocabulario-canonico-v1.md` exatamente
> como definido lá. Convenção de tag: **VERIFIED** (fato confirmado lendo código/fonte real neste
> turno), **HYPOTHESIS** (proposta desta pesquisa, não ratificada por Lucas), **GAP** (lacuna que
> continua sem solução).

## 0. O que foi lido antes de desenhar

- `docs/redesign-pipeline-v2/vocabulario-canonico-v1.md`
- `docs/redesign-pipeline-v2/contratos-schemas-pipeline-hierarquica-v1.md` (schemas fechados +
  tabela de 10 etapas, seção 3)
- `docs/redesign-pipeline-v2/SINTESE-FINAL-v1.md`
- `docs/redesign-pipeline-v2/frente-b-estruturacao-semantica.md`
- `docs/redesign-pipeline-v2/frente-h-benchmark-modelo-fraco.md`
- `docs/redesign-pipeline-v2/frente-a-extracao-higiene.md` (não estava na lista de leitura
  obrigatória do prompt, mas contém achados de higiene documental sobre a MESMA fonte real que
  batem exatamente com o que esta pesquisa re-verificou de forma independente — citado abaixo
  onde relevante)
- `docs/redesign-pipeline-v2/frente-g-revisao-local-global.md` (critério G3 — checagem topológica
  de pré-requisito — relevante para a pergunta de ordem pedagógica, seção 2)
- `docs/redesign-pipeline-v2/frente-c-estrategia-pedagogica.md` (classificador de tipo por bloco,
  usado para justificar granularidade)
- `fabrica/agents/scope_planner.py` (código real, reaproveitado hoje pelo Planejador de Módulo —
  Etapa B)
- `fabrica/agents/content_author.py` (constantes `MAX_CONCEPTS_PER_BEAT`/`MAX_CONCEPTS_PER_LESSON`)
- `docs/fabrica-de-aulas-design-doc-v2.md` (heurísticas antigas: "≤6 conceitos novos OU ≤4 nós
  novos por aula", "12 mín – 20 máx steps por aula")
- `docs/redesign-pipeline-v2/fonte-real/as-armas-da-persuasao.txt` (10802 linhas, 331 páginas reais
  — re-verificado nesta pesquisa via `python3 ... .count("\x0c")`, bate exatamente com o número já
  citado em `vocabulario-canonico-v1.md` L57 e em `frente-a-extracao-higiene.md`)

---

## 1. Critérios de agrupamento — como decidir os limites de um módulo

### 1.1 Decisão central

**VERIFIED (estrutura da fonte) + HYPOTHESIS (regra de decisão):** o critério primário é
**capítulo real da fonte, quando ele existe e é detectável de forma barata e determinística** —
não densidade de conceitos nucleares. Densidade de conceitos nucleares (proposta da Frente B) entra
**um nível abaixo**, dentro do capítulo, para decidir aulas — não entre capítulos, para decidir
módulos. Motivo, com evidência real:

1. **Capítulo real já é uma unidade pedagógica pré-desenhada pelo autor da fonte, com sinal
   estrutural forte e barato de detectar.** No Cialdini, cada um dos 8 capítulos tem a MESMA
   sequência de subseções (`DEFESA`/`RESUMO`/`PERGUNTAS DE ESTUDO`), confirmando que o próprio
   autor já pensou em unidades de ensino coerentes — reaproveitar isso é mais barato e mais
   confiável do que redescobrir a mesma fronteira por densidade léxica.
2. **Frente B já mostrou que 1 capítulo real contém MÚLTIPLOS conceitos nucleares** (Reciprocidade
   tem ≥4: regra básica / obrigação não solicitada / trocas desiguais / rejeição-recuo+contraste).
   Isso não é argumento para cortar módulos por conceito nuclear — é argumento para que **aula**
   (não módulo) seja a unidade que segue conceito nuclear. O vocabulário canônico já define módulo
   como "agrupamento de aulas que compartilham um tema/capítulo maior da fonte" — a hierarquia já
   prevê capítulo no nível de módulo, conceito nuclear no nível de aula/bloco.
3. **Detecção de capítulo real é barata e verificável hoje, sem IA**, usando só regex sobre
   markdown limpo — não precisa da chamada "grande" (T1, Frente H) para ISSO especificamente.

### 1.2 Aplicado aos capítulos REAIS do Cialdini (evidência de linha)

Busca determinística: título de capítulo aparece 2x no arquivo — 1x no Sumário (L84-165, ruído
estrutural, não conteúdo) e 1x como heading real do capítulo (linha isolada, centralizada, sem
prefixo `CAPÍTULO N`, cercada de texto de corpo antes/depois). Comando usado (reprodutível):

```
grep -n "^\s*<título>\s*$" docs/redesign-pipeline-v2/fonte-real/as-armas-da-persuasao.txt
```

Resultado real (VERIFIED, achado nesta pesquisa):

| Capítulo real | Linha de início (heading de corpo) | Linha de fim (exclusiva) | Linhas | Δ quebras-de-página¹ |
|---|---|---|---|---|
| 1. Armas de influência | 280 | 906 | 626 | ~19 |
| 2. Reciprocidade | 906 | 2235 | 1329 | ~40 |
| 3. Compromisso e coerência | 2235 | 4187 | 1952 | ~59 |
| 4. Aprovação social | 4187 | 5925 | 1738 | ~53 |
| 5. Afeição | 5925 | 7211 | 1286 | ~38 |
| 6. Autoridade | 7211 | 8155 | 944 | ~28 |
| 7. Escassez | 8155 | 9336 | 1181 | ~35 |
| 8. Influência instantânea | 9336 | 9631 (início de "Notas") | 295 | ~8 |

¹ **"Δ quebras-de-página" NÃO é número de página do livro impresso** — é a contagem de
caracteres form-feed (`\x0c`) entre o início de um capítulo e o início do próximo, calculada com
`data.count("\x0c")` sobre o `.txt`. Total real confirmado nesta pesquisa: **331 form-feeds**,
batendo exatamente com o número já citado em `vocabulario-canonico-v1.md` (L57) e em
`frente-a-extracao-higiene.md` ("331 caracteres form-feed... = nº real de páginas"). Como
`marcadores_de_pagina_preservados = false` para esta fonte (nenhum número textual de página, só o
form-feed), todo `pagina_inicio`/`pagina_fim` do schema continua `confianca_pagina: "desconhecida"`
— esta coluna é só um proxy de TAMANHO RELATIVO entre capítulos, não uma citação de página. GAP
herdado de `frente-a`/`frente-e` (contratos), não resolvido aqui.

**Achado de higiene que valida o método (cross-check com `frente-a-extracao-higiene.md`):** a
seção `DEFESA` só existe em 6 dos 8 capítulos (ausente nos capítulos 1 e 8) — confirmado nesta
pesquisa via `grep -n "^\s*DEFESA\s*$"` (6 ocorrências: L1990, L3810, L5529, L7058, L7879, L9088).
Isso bate exatamente com o achado independente da Frente A ("DEFESA só 6x — capítulos 1 e 8 não
têm"). Convergência de 2 análises independentes sobre o mesmo dado real — mesmo padrão de
confiança que a Síntese Final usa para tensões P1/§5.1.

**Consequência para o critério de agrupamento:** capítulos 1 e 8 são estruturalmente diferentes
dos capítulos 2-7 (não têm seção `DEFESA` porque não são capítulos de "arma de influência"
individual — Cap.1 é o capítulo-arcabouço que introduz o padrão clique-zum reaproveitado por todos
os outros, Cap.8 é o capítulo de síntese/fechamento). Isso é sinal real de que **módulo = capítulo
real** é o critério certo aqui — a estrutura recorrente (DEFESA/RESUMO/PERGUNTAS) já delimita, de
graça, quais capítulos são "módulos de arma" (2-7) e quais são "módulos de moldura" (1 e 8), sem
precisar de julgamento de LLM algum para essa decisão específica.

### 1.3 Divisão em módulos proposta para este livro (concreta)

8 capítulos reais → **8 módulos, 1:1**, na ordem da fonte (ver seção 2 sobre reordenação):

```
M01 — Armas de Influência (fundamentos)      [Cap.1, L280–905]
M02 — Reciprocidade                          [Cap.2, L906–2234]
M03 — Compromisso e Coerência                [Cap.3, L2235–4186]  ← módulo mais denso (~59 págs)
M04 — Aprovação Social                       [Cap.4, L4187–5924]
M05 — Afeição                                [Cap.5, L5925–7210]
M06 — Autoridade                             [Cap.6, L7211–8154]  ← módulo mais curto entre 2-7 (~28 págs)
M07 — Escassez                               [Cap.7, L8155–9335]
M08 — Influência Instantânea (síntese)       [Cap.8, L9336–9630]  ← módulo mais curto do livro (~8 págs)
```

Sem merge nem split: nenhum capítulo é desproporcional o bastante para forçar isso (ver seção 4
para o limiar proposto). Razão máx/mín entre os 6 capítulos "de arma" (2-7): 59/28 ≈ 2,1x — mesma
ordem de grandeza da variação "~2,6x" já citada por `frente-h-benchmark-modelo-fraco.md` (a
pequena diferença provavelmente vem de eles terem usado número de página impressa real, que não
tenho como reverificar nesta fonte — marco a variação **deles** como HYPOTHESIS não re-verificada,
e a minha (2,1x, calculada por linha e por Δ form-feed) como VERIFIED nesta rodada).

### 1.4 Regra geral (para fontes sem capítulos reais claros — não é o caso do Cialdini)

**HYPOTHESIS**, não testada com fonte real (o único caso de teste real disponível, o Cialdini, TEM
capítulos claros): quando o ingest não detecta headings de capítulo confiáveis (ex.: transcrição de
palestra, artigo sem seções, apostila mal formatada), cai para o pipeline de 4 estágios já proposto
pela Frente B (resumo por seção → agrupamento por conceito nuclear → montagem do mapa → auditoria
opcional) — aí sim a fronteira de módulo é decidida por conceito nuclear agregado, não por
estrutura. **GAP**: o limiar exato de "quão confiável precisa ser a detecção de heading para usar
o atalho 1:1" não foi medido — só a existência dos dois caminhos foi desenhada.

---

## 2. Ordem pedagógica — ordem da fonte ou reordenação por dependência?

### 2.1 Decisão

**HYPOTHESIS com evidência real de suporte**: **default é sempre a ordem da fonte.** Reordenar é
exceção rara, condicionada a uma dependência conceitual real e detectável — nunca uma preferência
estética do Estruturador de Curso. Justificativa em duas partes:

**(a) Argumento estrutural (por que o default barato é seguro):** o critério G3 já desenhado pela
Frente G ("Progressão de pré-requisito — termo usado antes de ser definido — 100% determinístico,
checagem topológica", `frente-g-revisao-local-global.md` L13) só funciona de forma barata (lookup
determinístico, sem LLM) se a ordem de leitura corresponder à ordem de introdução dos conceitos.
Reordenar módulos sem necessidade quebra essa premissa e forçaria G3 a virar um julgamento LLM caro
— exatamente o tipo de custo que toda a arquitetura foi desenhada para evitar.

**(b) Argumento empírico (o próprio livro, verificado):** procurei por referências cruzadas reais
entre capítulos para ver se existe alguma dependência conceitual que a ordem da fonte violaria.
Achei duas, ambas **retroativas** (capítulo cita algo de um capítulo ANTERIOR, nunca de um
posterior):

- L1774 (dentro do Cap.2, Reciprocidade): *"O primeiro envolve o princípio do contraste
  perceptivo que vimos no Capítulo 1."* — cross-reference explícita e correta na ordem: Cap.2
  cita Cap.1, que já foi lido antes. Confirmado lendo o texto ao redor (L1769-1782): o parágrafo
  usa o princípio do contraste (estabelecido no Cap.1, "clique-zum") para explicar por que
  rejeição-recuo funciona — dependência real, e a ordem da fonte já a satisfaz.
- Este é o mesmo achado citado por `frente-b-estruturacao-semantica.md` L15 (`reuso_transversal`,
  "'contraste perceptivo' do Cap.1 citado no Cap.2, L1774") — re-verificado nesta pesquisa
  lendo a linha exata, bate.

Não encontrei nenhuma referência cruzada no sentido oposto (capítulo citando conceito de um
capítulo POSTERIOR ainda não lido) nos trechos inspecionados. Isso é consistente com o desenho do
próprio livro: os 6 capítulos "de arma" (2-7) são estruturalmente paralelos e independentes entre
si — cada princípio (reciprocidade, compromisso, aprovação social, afeição, autoridade, escassez)
é ensinável sem pré-requisito dos outros 5. A única dependência real encontrada é **estrutural, não
entre-armas**: Cap.1 (arcabouço "clique-zum") precisa vir antes de qualquer arma, e Cap.8 (síntese
de automaticidade) precisa vir depois de todas — e a ordem da fonte já garante isso.

### 2.2 Conclusão para este livro

**Nenhuma reordenação é necessária ou recomendada para o Cialdini.** M01 (fundamentos) primeiro,
M08 (síntese) último, M02-M07 (as 6 armas) na ordem da fonte — não há dependência conceitual real
entre elas que justifique alterar a sequência 2→3→4→5→6→7.

### 2.3 Mecanismo geral proposto para quando reordenação FOR necessária (HYPOTHESIS, não exercida aqui)

Já que não há caso real neste livro para validar reordenação, a regra abaixo é hipótese pura,
registrada para o caso em que uma fonte futura tiver dependência real:

- Etapa A, ao montar os resumos por capítulo (via Frente B Stage 1/2), roda um lookup barato e
  determinístico: para cada termo-chave capitalizado/em negrito do resumo do capítulo N, verificar
  se ele já apareceu em algum resumo de capítulo < N. Se um termo só aparece definido em um
  capítulo POSTERIOR ao que o usa — sinal de dependência para trás violada na ordem da fonte —
  Etapa A sinaliza um candidato de reordenação (nunca reordena sozinha silenciosamente).
- Esse candidato deveria ser confirmado por 1 chamada LLM estreita (mesmo padrão G1/G4/G6 da
  Frente G — julgamento só no par suspeito, nunca releitura do curso inteiro) antes de aceitar a
  reordenação.
- **GAP**: este mecanismo não foi implementado nem testado contra nenhuma fonte real — é proposta
  de arquitetura, não algoritmo pronto.

---

## 3. Contrato de entrada/saída completo — Etapa A refinada

Refina a linha "A. Estruturador de Curso" de `contratos-schemas-pipeline-hierarquica-v1.md`
(seção 3). Formato mantido (missão/inputs/outputs/guardrails/limites de autoridade/dependências).

### 3.1 Entrada

| Campo | Tipo | Fonte | Obrigatório |
|---|---|---|---|
| `fonte_markdown` | string (markdown limpo) | saída do Ingest (hoje 100% manual, conforme `artifact 1b210767`) | sim |
| `metadados_ingest.capitulos_detectados` | array de `{titulo, linha_inicio}` (ou heading-equivalente) | Ingest, se conseguiu detectar headings de capítulo com confiança | não — pode vir vazio |
| `metadados_ingest.marcadores_de_pagina_preservados` | boolean | Ingest | sim (mesmo campo já definido em `mapa_do_curso.schema.v1`) |
| `titulo_fonte`, `tipo_fonte` (`livro`/`artigo`/`apostila`/`transcricao`/`outro`) | string/enum | metadado humano ou Ingest | sim |
| `objetivo_geral`, `nivel` (opcional) | string | briefing humano do job | não |

### 3.2 Lógica interna (o que esta pesquisa acrescenta ao contrato antigo)

1. **Se `capitulos_detectados` não vazio e passa um teste de confiança barato** (título aparece
   2x no texto — 1x em sumário/índice, 1x como heading isolado de corpo, como verificado na seção
   1.2) → **caminho determinístico**: 1 capítulo real = 1 módulo candidato, na ordem da fonte.
   Zero chamada de LLM "grande" necessária para ESSA decisão específica — só regex.
2. **Se vazio ou baixa confiança** → cai para o pipeline de 4 estágios da Frente B (resumo por
   seção → agrupamento por conceito nuclear → montagem do mapa). Esse caminho é o que
   genuinamente precisa da chamada grande/cara identificada pela Frente H (T1) — porque, sem
   estrutura de capítulo pronta, alguém precisa decidir a fronteira olhando conteúdo agregado de
   todas as seções ao mesmo tempo.
3. **Em qualquer um dos dois caminhos**, Etapa A roda o teste de alarme de tamanho da seção 4
   antes de fechar os módulos (capítulo/cluster grande demais → sinaliza candidato a split;
   pequeno demais → sinaliza candidato a merge, nunca funde sozinha sem confirmação).
4. Etapa A NÃO decide aulas (isso é Etapa B, reaproveitando `scope_planner.py`) e NÃO decide
   conteúdo pedagógico — só a fronteira módulo e a ordem.

### 3.3 Saída — problema real encontrado no schema já fechado

Ao tentar preencher `mapa_do_curso.modulos[].conceitos_nucleares_aqui[]` de verdade (não
esqueleto) com dados do Cialdini, achei uma inconsistência real no contrato já fechado em
`contratos-schemas-pipeline-hierarquica-v1.md`:

- `conceito_indexado` (usado tanto em `modulo.conceitos_nucleares_aqui` quanto em
  `mapa_do_curso.indice_conceitos_nucleares`) exige `aula_origem_id` como campo **obrigatório**.
- Mas a seção 3 do mesmo documento diz explicitamente que a Etapa A **propõe patches** no
  `indice_conceitos_nucleares` ("novo conceito indexado") — e Etapa A roda **antes** de qualquer
  aula existir. Não há `aula_id` possível neste momento.

**Proposta de patch mínimo ao contrato (HYPOTHESIS, MINOR bump por regra da seção 5 de
`contratos-schemas-pipeline-hierarquica-v1.md` — campo novo opcional, retrocompatível):**

Introduzir `conceito_nuclear_previsto` (schema novo, menor):
```json
{
  "conceito": "string",
  "definicao_curta": "string, maxLength 200",
  "status": { "enum": ["previsto"] }
}
```
- Etapa A escreve `modulo.conceitos_nucleares_aqui` usando `conceito_nuclear_previsto`
  (status=previsto), **nunca** `conceito_indexado` completo.
- `mapa_do_curso.indice_conceitos_nucleares` (o índice curso-inteiro deduplicado) permanece
  **vazio** até que Etapa C (Autor de Conteúdo) efetivamente escreva a aula que introduz aquele
  conceito — só então um conceito é "promovido" de previsto → indexado, com `aula_origem_id` real.
- **GAP novo encontrado nesta pesquisa, não resolvido aqui**: o mecanismo exato de promoção
  (previsto → indexado) — quem escreve isso, Etapa C sozinha ou o Orquestrador Hierárquico (Etapa
  J) como parte do fechamento de checkpoint de aula — não está desenhado em nenhuma frente
  anterior. Fica como próximo gap explícito para quem desenhar a Etapa C/J em detalhe.

### 3.4 Saída completa e preenchida — exemplo real (Cialdini)

```json
{
  "curso_id": "curso-as-armas-da-persuasao-v1",
  "schema_version": "1.0.0",
  "fonte": {
    "arquivo": "docs/redesign-pipeline-v2/fonte-real/as-armas-da-persuasao.txt",
    "tipo": "livro",
    "paginas_totais": 331,
    "capitulos_reais": [
      { "capitulo_id": "cap-01", "titulo": "Armas de influência", "pagina_inicio": null, "pagina_fim": null },
      { "capitulo_id": "cap-02", "titulo": "Reciprocidade", "pagina_inicio": null, "pagina_fim": null },
      { "capitulo_id": "cap-03", "titulo": "Compromisso e coerência", "pagina_inicio": null, "pagina_fim": null },
      { "capitulo_id": "cap-04", "titulo": "Aprovação social", "pagina_inicio": null, "pagina_fim": null },
      { "capitulo_id": "cap-05", "titulo": "Afeição", "pagina_inicio": null, "pagina_fim": null },
      { "capitulo_id": "cap-06", "titulo": "Autoridade", "pagina_inicio": null, "pagina_fim": null },
      { "capitulo_id": "cap-07", "titulo": "Escassez", "pagina_inicio": null, "pagina_fim": null },
      { "capitulo_id": "cap-08", "titulo": "Influência instantânea", "pagina_inicio": null, "pagina_fim": null }
    ],
    "extraido_em": "desconhecido — GAP herdado, timestamp de extração não registrado no .txt",
    "extrator": "pdftotext -layout",
    "marcadores_de_pagina_preservados": false
  },
  "titulo": "As Armas da Persuasão",
  "objetivo_geral": "Reconhecer e se defender das 6 armas de influência automática descritas por Cialdini.",
  "nivel": "iniciante-intermediário",
  "modulos": [
    {
      "modulo_id": "mod-01", "ordem": 1, "titulo": "Armas de Influência (fundamentos)",
      "resumo": "Introduz o padrão clique-zum (fixed-action pattern): atalhos automáticos de decisão que profissionais da persuasão exploram. Estabelece o princípio do contraste perceptivo, reaproveitado por todos os módulos seguintes (ex.: citado no módulo 2, L1774).",
      "status": "planejado", "capitulo_fonte": "cap-01",
      "conceitos_nucleares_aqui": [
        { "conceito": "padrão clique-zum / fixed-action pattern", "definicao_curta": "resposta automática disparada por 1 gatilho, sem avaliar a situação inteira", "status": "previsto" },
        { "conceito": "princípio do contraste perceptivo", "definicao_curta": "2º estímulo parece mais diferente do 1º do que realmente é, quando apresentado em sequência", "status": "previsto" }
      ]
    },
    {
      "modulo_id": "mod-02", "ordem": 2, "titulo": "Reciprocidade",
      "resumo": "A regra de retribuir favores recebidos, mesmo não solicitados. Cobre a técnica de rejeição-recuo (pedido grande seguido de recuo para o pedido real) e a seção DEFESA do capítulo (L1990-2146).",
      "status": "planejado", "capitulo_fonte": "cap-02",
      "conceitos_nucleares_aqui": [
        { "conceito": "regra básica da reciprocidade", "definicao_curta": "obrigação social de retribuir o que se recebe", "status": "previsto" },
        { "conceito": "obrigação por favor não solicitado", "definicao_curta": "a obrigação de retribuir vale mesmo quando o favor não foi pedido", "status": "previsto" },
        { "conceito": "trocas desiguais", "definicao_curta": "reciprocidade pode ser explorada pedindo retribuição desproporcional ao favor original", "status": "previsto" },
        { "conceito": "rejeição seguida de recuo (+ contraste)", "definicao_curta": "pedido grande recusado, seguido de recuo para o pedido menor real; usa reciprocidade + contraste perceptivo (Cap.1)", "status": "previsto" }
      ]
    },
    { "modulo_id": "mod-03", "ordem": 3, "titulo": "Compromisso e Coerência", "resumo": "Como pequenos compromissos iniciais (mesmo triviais) criam pressão interna e social para manter coerência em decisões futuras, maiores.", "status": "planejado", "capitulo_fonte": "cap-03", "conceitos_nucleares_aqui": [] },
    { "modulo_id": "mod-04", "ordem": 4, "titulo": "Aprovação Social", "resumo": "Uso do comportamento alheio como atalho de decisão, especialmente sob incerteza; risco de imitação em massa.", "status": "planejado", "capitulo_fonte": "cap-04", "conceitos_nucleares_aqui": [] },
    { "modulo_id": "mod-05", "ordem": 5, "titulo": "Afeição", "resumo": "Como simpatia (semelhança, elogio, associação, condicionamento) aumenta a chance de anuência.", "status": "planejado", "capitulo_fonte": "cap-05", "conceitos_nucleares_aqui": [] },
    { "modulo_id": "mod-06", "ordem": 6, "titulo": "Autoridade", "resumo": "Obediência a símbolos e figuras de autoridade, mesmo quando o conteúdo real da mensagem não justifica.", "status": "planejado", "capitulo_fonte": "cap-06", "conceitos_nucleares_aqui": [] },
    { "modulo_id": "mod-07", "ordem": 7, "titulo": "Escassez", "resumo": "Como a percepção de disponibilidade limitada (tempo, quantidade, exclusividade) aumenta o desejo, via reatância psicológica.", "status": "planejado", "capitulo_fonte": "cap-07", "conceitos_nucleares_aqui": [] },
    { "modulo_id": "mod-08", "ordem": 8, "titulo": "Influência Instantânea (síntese)", "resumo": "Fecha o livro reconectando as 6 armas ao padrão clique-zum do módulo 1, discutindo automaticidade moderna (heurísticas em ambiente de sobrecarga de informação).", "status": "planejado", "capitulo_fonte": "cap-08", "conceitos_nucleares_aqui": [] }
  ],
  "indice_conceitos_nucleares": [],
  "alertas_de_coerencia": [],
  "meta": { "gerado_por": "estruturador_de_curso", "ultima_atualizacao": "2026-07-11T00:00:00Z", "versao_conteudo": 1 }
}
```

Nota: `indice_conceitos_nucleares` fica **vazio de propósito** neste output (ver 3.3 — só populado
depois que aulas existem). Módulos 3-7 têm `resumo` real (verificado lendo os capítulos
correspondentes) mas `conceitos_nucleares_aqui` deixado vazio aqui só para não estender demais este
documento — o método é idêntico ao aplicado em mod-01/mod-02, que servem de exemplo completo.

### 3.5 Guardrails / limites de autoridade (sem mudança de espírito, só explicitados)

- Etapa A não escreve conteúdo pedagógico, não decide representação, não decide tipo de bloco.
- Etapa A não vê nenhum bloco/aula já escrito em paralelo (mantido do contrato original).
- Etapa A é a ÚNICA que propõe a lista `modulos[]` e a ordem `ordem`; ninguém mais reescreve isso
  depois exceto via patch pequeno explícito (mesma regra já existente na seção 1 do contrato).
- **Novo**: Etapa A só escreve `conceito_nuclear_previsto`, nunca `conceito_indexado` completo —
  ver 3.3.

---

## 4. Limites e heurísticas

### 4.1 Números já existentes no código, reaproveitados só como ordem de grandeza (VERIFIED)

| Constante | Valor | Onde | Nível |
|---|---|---|---|
| `MAX_CONCEPTS_PER_BEAT` | 3 | `content_author.py` L69 | por beat (dentro de aula) |
| `MAX_CONCEPTS_PER_LESSON` | 6 | `content_author.py` L70 | por aula |
| Steps por aula | 12 mín – 20 máx | `docs/fabrica-de-aulas-design-doc-v2.md` L284 | por aula |
| `overflow_threshold` (scope_planner) | `max(budget*2, budget+4)` = 12 (com budget=6) | `scope_planner.py` L242-246 | fatia dentro de aula |

Nenhuma dessas constantes é "por módulo" ou "por curso" — todas vivem 1-2 níveis abaixo na
hierarquia. Os limiares abaixo (módulo/curso) são propostos por analogia de ordem de grandeza,
não por reaproveitamento literal.

### 4.2 Limiares propostos para módulo/curso (HYPOTHESIS, não testada além do Cialdini)

| Limiar | Proposta | Justificativa |
|---|---|---|
| Mínimo de módulos por curso | 1 | fonte degenerada (ver 4.3) |
| Máximo de módulos por curso (alarme, não hard-stop) | ~12-15 | Frente H já identificou T1 como a única tarefa que precisa segurar TODOS os módulos numa única chamada forte; cada módulo acrescenta um resumo ao contexto dessa chamada — acima de ~12-15 o risco de a chamada ficar cara/instável cresce sem dado real que confirme onde exatamente. Neste livro (8 módulos) fica bem dentro do limite. |
| Mínimo de aulas por módulo | 1 | módulo curto real (M08, 8 "páginas", capítulo de síntese) |
| Máximo de aulas por módulo (alarme) | ~8 | mesma lógica do `overflow_threshold` de `scope_planner.py` (dobrar o budget observado como teto de segurança): o módulo mais denso medido aqui (M03, 59 "páginas") estima ~4 aulas (seção 5) — dobrando isso com margem dá ~8; acima disso, mais provável que o "módulo" na verdade contenha 2+ temas e devesse ser 2 módulos, não 1 com aulas demais. |

### 4.3 Fonte muito curta (~10 páginas)

Provavelmente não tem headings de capítulo detectáveis com confiança (não há "capítulos" reais
numa fonte tão curta). Etapa A degenera para **1 módulo único** (`modulos.length == 1`),
pulando toda a decisão de agrupamento. Consequência em cascata: Etapa H (Crítico de Coerência de
Curso) e Etapa I (Condenador de Curso) tornam-se no-ops triviais — nada para comparar entre
módulos. **GAP explícito, não técnico e sim de produto**: vale a pena instanciar a hierarquia
curso→módulo→aula inteira para uma fonte tão curta, ou deveria virar "1 aula avulsa" sem módulo
nem curso? Isso é decisão de escopo/produto (roteável a `gpt_web` conforme
`bridge.op.skill.gpt_web_comm.v1`), não fato técnico resolvido nesta pesquisa.

### 4.4 Fonte muito longa (~800 páginas)

Dois cenários, com heurísticas diferentes:

- **Poucos capítulos reais grandes** (ex.: 10-15 capítulos de 50-80 páginas, proporcional ao
  Cialdini): 1:1 capítulo→módulo continua funcionando, mas Etapa A/T1 processa mais resumos numa
  única chamada — dentro do alarme de ~12-15 módulos (seção 4.2), ainda seguro, mas perto do teto.
- **Muitos capítulos curtos** (ex.: 40+ capítulos de ~15-20 páginas cada — comum em manuais
  técnicos organizados por tópico): 1:1 estouraria o teto de módulos. Etapa A precisaria de uma
  camada extra de agrupamento (capítulo bruto → cluster temático → módulo), usando o mesmo tipo de
  julgamento por "conceito nuclear" que a Frente B já desenhou (Stage 2), só aplicado um nível
  acima (entre capítulos, não dentro de 1 capítulo).
- **GAP explícito**: não há fonte real de ~800 páginas neste projeto para validar nenhum dos dois
  cenários — só o Cialdini (331 páginas reais, 8 capítulos, nenhum estouro de limiar). Todo este
  item 4.4 é HYPOTHESIS pura, sem evidência de linha real por trás.

---

## 5. Validação com o PDF real

### 5.1 Estimativa de aulas por módulo (aplicando a lógica proposta)

Heurística usada: combinar (a) o Δ de tamanho relativo por capítulo (seção 1.2, real) com (b) o
achado da Frente B de que Reciprocidade (mod-02) tem ≥4 conceitos nucleares reais — como
cross-check de que a densidade conceitual acompanha aproximadamente o tamanho por página, não é
uniforme entre capítulos.

| Módulo | Δ quebras-de-página | Estimativa de aulas | Base |
|---|---|---|---|
| M01 Armas de Influência | ~19 | 1-2 | capítulo-arcabouço, curto |
| M02 Reciprocidade | ~40 | 3 | Frente B: 4 conceitos nucleares reais, alguns cabem juntos numa aula com DEFESA/RESUMO |
| M03 Compromisso e Coerência | ~59 | 4 | módulo mais denso medido |
| M04 Aprovação Social | ~53 | 4 | segundo mais denso |
| M05 Afeição | ~38 | 3 | médio |
| M06 Autoridade | ~28 | 2 | mais curto entre 2-7 |
| M07 Escassez | ~35 | 3 | médio |
| M08 Influência Instantânea | ~8 | 1 | síntese curta |
| **Total** | ~280 | **~21 aulas** | soma |

### 5.2 Comparação com a estimativa antiga ("~20-25 aulas")

A estimativa "~20-25 aulas pro livro inteiro" **não foi encontrada como citação literal** em
`docs/fabrica-de-aulas-design-doc-v2.md` — busquei por "20-25", "aulas pro livro" e variações no
arquivo e não achei a string. O número aparece citado (não como fonte primária, mas como derivação
já feita por outra frente) em `frente-h-benchmark-modelo-fraco.md` L44 e reafirmado em
`SINTESE-FINAL-v1.md` L46, ambos descrevendo-o como "derivado da heurística do design-doc-v2 §E
aplicada às 331 páginas reais" — a heurística fonte real e verificável é a de
`fabrica-de-aulas-design-doc-v2.md` L86 ("≤6 conceitos novos OU ≤4 nós novos por aula") e L284
("12 mín – 20 máx steps por aula"), não um número de aulas citado diretamente.

**Comparação**: minha estimativa desta pesquisa (~21 aulas, seção 5.1) cai dentro do intervalo
"~20-25" já aceito por Lucas como ponto de partida. Considero isso **consistente**, com uma
ressalva real e importante:

- A estimativa de ~21 só se sustenta **se** o Autor de Conteúdo aplicar corretamente o teste
  operacional da Frente B ("o que ESTE exemplo prova que os outros não provam") para descartar
  `reforco_redundante`. A própria Frente B mediu que só o primeiro conceito nuclear de
  Reciprocidade empilha **~15 exemplos concretos diferentes** antes da 2ª técnica do capítulo. Se
  um modelo fraco tratar cada exemplo como merecedor de conteúdo novo (em vez de escolher 1-2
  `canonico` e descartar o resto), o número real de aulas geradas explode bem acima de 21-25 —
  risco real, não hipotético, já registrado por evidência de linha na Frente B.
- Portanto: "~20-25 aulas" é uma estimativa plausível **de teto saudável**, não uma garantia
  automática — depende de um mecanismo de deduplicação de exemplo (Frente B) estar de fato
  implementado no Autor de Conteúdo. Isso não está implementado hoje (GAP herdado, fora do escopo
  desta pesquisa, que é só sobre Etapa A).

### 5.3 Validação da divisão em módulos em si

A divisão 1:1 capítulo→módulo (seção 1.3) é diretamente verificável por qualquer pessoa rodando os
mesmos comandos `grep -n` citados na seção 1.2 contra o arquivo real — não depende de nenhum
julgamento de LLM. Isso é, por design, o resultado mais barato e mais auditável desta pesquisa:
zero ambiguidade sobre onde cada módulo começa e termina.

---

## 6. O que é determinístico vs. heurístico vs. hipótese (resumo explícito)

**Objetivo/determinístico (VERIFIED, reproduzível por qualquer um com os comandos citados):**
- Os 8 limites de capítulo real do Cialdini (linhas exatas, seção 1.2).
- Contagem de 331 form-feeds no `.txt` (bate com `frente-a-extracao-higiene.md` e
  `vocabulario-canonico-v1.md`).
- Ausência de seção `DEFESA` nos capítulos 1 e 8 (6 ocorrências, não 8) — convergente com achado
  independente da Frente A.
- Citação cruzada real L1774 (Cap.2 cita Cap.1) — única referência cruzada explícita entre
  capítulos encontrada nos trechos inspecionados, e é retroativa (não exige reordenação).
- Constantes `MAX_CONCEPTS_PER_BEAT=3`, `MAX_CONCEPTS_PER_LESSON=6`, steps 12-20 (código/doc real).

**Heurístico, com margem de julgamento mas testável (HYPOTHESIS ancorada em dado real):**
- Critério "módulo = capítulo real quando detecção é confiável" (seção 1.1).
- Estimativa de ~21 aulas para o livro inteiro (seção 5.1) — combinação de proxy de tamanho +
  achado qualitativo da Frente B, não contagem humana real linha a linha do livro inteiro.
- Limiares numéricos de módulos/curso (~12-15) e aulas/módulo (~8) propostos por analogia de
  ordem de grandeza com constantes já existentes (seção 4.2) — nunca testados em produção.
- Mecanismo de detecção de dependência conceitual para candidatos de reordenação (seção 2.3).

**Hipótese pura / GAP, sem dado real por trás:**
- Comportamento para fonte muito longa (~800 páginas) — nenhuma fonte real desse tamanho existe
  no projeto (seção 4.4).
- Comportamento para fonte muito curta (~10 páginas) — decisão de produto não resolvida, não
  técnica (seção 4.3).
- Mecanismo exato de promoção `conceito_nuclear_previsto` → `conceito_indexado` com
  `aula_origem_id` real — gap novo encontrado nesta pesquisa (seção 3.3), não atribuído a nenhuma
  etapa específica ainda.
- Timestamp/proveniência de extração do `.txt` (`extraido_em` no exemplo da seção 3.4 ficou
  "desconhecido" — não inventado).

---

## 7. Decisões que ficam explicitamente em aberto para Lucas

1. Ratificar (ou não) "módulo = capítulo real quando detecção é confiável" como critério
   canônico de agrupamento (seção 1.1) — hoje é HYPOTHESIS desta pesquisa.
2. Ratificar "ordem da fonte por padrão, reordenação só com dependência conceitual real
   detectada e confirmada" (seção 2) como regra de ordem pedagógica.
3. Resolver o gap de contrato novo encontrado aqui: schema `conceito_nuclear_previsto` +
   quem promove para `conceito_indexado` com `aula_origem_id` (seção 3.3) — é MINOR bump segundo
   a política de versionamento já definida em `contratos-schemas-pipeline-hierarquica-v1.md`
   seção 5, mas precisa de decisão explícita antes de virar schema fechado.
4. Decidir o piso de produto para fonte muito curta (seção 4.3): vira curso degenerado de 1
   módulo, ou nem deveria entrar na hierarquia curso→módulo→aula?
5. Validar os limiares numéricos propostos (~12-15 módulos/curso, ~8 aulas/módulo) contra uma
   fonte realmente longa quando uma estiver disponível — não existe ainda no projeto.
