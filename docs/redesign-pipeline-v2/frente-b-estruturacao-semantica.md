# Frente B — Estruturação Semântica / Mapa Conceitual

> Caso de teste real: Capítulo 2 (Reciprocidade, L906-2234) e Capítulo 7 (Escassez, L8155-9214).

## Diagnóstico do gap, com números reais

Só dentro do conceito nuclear "reciprocidade cria obrigação retribuível", o Cap. 2 empilha **~15 exemplos concretos diferentes**: cartão de Natal, Etiópia↔México, Holanda↔Nova Orleans, experimento Regan/Coca-Cola, Hare Krishna, amostra de queijo, BUG da Amway, soldado alemão, assaltante armado, Jonestown, etiquetas ADV, bombom do garçom, carro emprestado, depoimento de enfermeira, escoteiro — **antes** de entrar na 2ª técnica do mesmo capítulo (rejeição-recuo). A pipeline antiga corta por densidade de texto, sem perceber que são a mesma prova repetida.

## O "mapa do curso": schema por significado

Árvore curso→módulos→**conceitos nucleares** (não capítulos brutos — 1 capítulo tem múltiplos conceitos nucleares: Reciprocidade já tem ≥4 distintos: regra básica / obrigação não solicitada / trocas desiguais / rejeição-recuo+contraste). Cada conceito nuclear carrega exemplos com campo **`papel`**:
- `canonico` — exemplo que vira o exemplo trabalhado na aula (1, no máx 2).
- `reforco_redundante` — mesma prova sem acréscimo; registrado (citável em nota) mas não gera bloco novo.
- `variante_com_nuance` — parece igual mas prova algo estrutural a mais (ex: Hare Krishna combina "funciona mesmo sem gostar" + "não solicitado").
- `reuso_transversal` — não é redundância, é citação legítima de conceito de OUTRO módulo (ex: "contraste perceptivo" do Cap.1 citado no Cap.2, L1774) — vira aresta no grafo, não duplicação.

### Teste operacional (verificável até por modelo fraco)

Instrução: *"Para cada exemplo do cluster, escreva 1 frase: 'o que ESTE exemplo prova que os outros não provam.' Se a frase ficar vazia ou repetir a ideia central, marque `reforco_redundante`."* Transforma julgamento vago em tarefa de completar frase.

## Pipeline em chamadas pequenas

- **Stage 1** — resumo por seção (1 chamada por nó-folha Docling, ~500-1500 palavras). Nunca vê o livro inteiro.
- **Stage 2** — agrupamento por módulo (1 chamada/capítulo, input = só os resumos do Stage 1, não texto bruto). Confirma conceito(s) nuclear(es), agrupa por "moral em 1 frase", aplica o teste operacional, escolhe canônico(s).
- **Stage 3** — montagem do mapa do curso (1 chamada única, leve, sobre metadados já agregados). Detecta `reuso_transversal`.
- **Stage 4** (opcional) — auditoria cross-módulo de redundância, só sobre `enunciado`+exemplos canônicos.

## Granularidade de bloco: este livro vs. arquitetura de software

Classificador de tipo (protocolo dormente) já responde: software = Processo/Sistema (bloco = 1 componente/aresta, diagrama natural); este livro = **Princípio** (causa-efeito) — bloco natural = tríade **regra + mecanismo + exemplo canônico**. Representação dominante = texto puro/narrativa. Diagrama só se justifica pro padrão transversal "clique-zum" (fixed-action pattern, reaparece em todos os 6 capítulos) — candidato a 1 diagrama causal reutilizável entre módulos.

**Achado extra**: DEFESA/RESUMO/PERGUNTAS DE ESTUDO são atributo de **módulo** (cobrem todos os conceitos nucleares do capítulo), não de bloco/conceito nuclear. E "PERGUNTAS DE ESTUDO" já existem prontas na fonte — o mapa do curso deveria só registrar a referência, não gerar do zero.

## Atrito com decisões antigas (a resolver)

- `fabrica-de-aulas-design-doc-v2.md` §E usa `páginas/aula ≤15` como fronteira — deveria virar só alarme ("releia, pode ter >1 conceito"), nunca o critério que decide a fronteira.
- Contagem de conceitos diverge entre docs (≤6 vs 5-7/3-4 por beat) — GAP separado, resolvido pela Frente F (ver síntese final).
