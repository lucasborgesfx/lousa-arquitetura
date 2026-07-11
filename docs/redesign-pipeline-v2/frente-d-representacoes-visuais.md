# Frente D — Representações Visuais e Quando Não Usar Diagrama

> Caso de teste real: Capítulo 2 completo (Reciprocidade, L906-2234).

## Heurística — "teste de estrutura relacional visualizável"

Duas perguntas sim/não sobre a estrutura do bloco (mesma lógica de *element interactivity*, não contagem):

- **Q1 (aresta real)**: existe relação direcional/causal entre ≥2 partes tal que remover a ordem mudaria o que se aprende? (Não conta narrar "primeiro X depois Y" se independentes.)
- **Q2 (matriz real)**: existem ≥2 itens comparáveis lado a lado em ≥2 atributos, onde o valor está no CONTRASTE?

| Q1 | Q2 | Representação |
|---|---|---|
| sim | não | diagrama |
| não | sim | tabela |
| sim | sim | combinação |
| não | não | texto puro |

**Regra de desempate**: se o bloco existe só pra reforçar/ilustrar um princípio já representado, a resposta é **texto**, mesmo que o exemplo tenha estrutura interna rica — forçar diagrama numa ilustração redundante viola coerência de Mayer (elemento gráfico sem estrutura nova é carga extrínseca pura).

## Aplicação real ao Capítulo 2 (4 exemplos + 1 caso descartado)

1. **TEXTO** — anedotas de reforço (cartões de Natal, Etiópia/México, flor Hare Krishna, depoimentos): mesma aresta repetida com ator diferente, sem 2º item pra comparar.
2. **TABELA** — experimento de Regan (L1038-1120): 2 condições (recebeu/não recebeu Coca-Cola) × 2 atributos (bilhetes de rifa comprados, efeito da simpatia) — o ponto é o contraste, não uma cadeia causal única.
3. **TABELA** — estudos pós-recuo (L1899-1926): 2 condições × múltiplos atributos (% concordância, % comparecimento) — resultados paralelos, sem dependência entre si.
4. **DIAGRAMA** — único bloco do capítulo com cadeia causal real: rejeição-recuo (L1665-1988) — pedido grande recusado → recuo → pedido pequeno aceito (só funciona por ser *percebido como concessão*, dependente do passo anterior) → 2 efeitos colaterais dependentes. Remover a ordem destrói o efeito (o próprio texto confirma isso).
5. **Descartado**: Johnson vs. Carter (L1207-1229) parece candidato a tabela (2 itens) mas só tem 1 atributo compartilhado — Q2 falha, fica texto. Prova que a heurística discrimina, não carimba "2 coisas = tabela" sempre.

## Avaliação honesta: maioria NÃO pede diagrama

No capítulo inteiro (~1.330 linhas): ~10+ blocos → texto; 2 blocos → tabela; **1 único bloco** → diagrama. Confirmado, não hipotético. Esperado: livro de psicologia social organizado em "1 regra + galeria de exemplos paralelos", não sistema técnico com componentes interdependentes.

## Critério "focus em nó de alto grau" — não aplicável neste capítulo

O único diagrama candidato é cadeia linear com bifurcação de 2 saídas — grau máx de qualquer nó = 2. Domínio (regra psicológica + variações) não produz topologia hub. Critério fica **sem evidência de teste real neste caso** — recomendado validar contra o material antigo de arquitetura de software, não forçar exemplo artificial aqui.

## Conexão com classificador de tipo (hipótese pra reconciliar — ver síntese final)

- **Fato** → quase sempre texto.
- **Princípio enunciado como regra isolada** → texto (1 única aresta, sem topologia).
- **Princípio operacionalizado como técnica repetível** (rejeição-recuo = sequência de passos) → empurra pra comportamento de Processo/Sistema, aí sim gera diagrama.
- **Conceito com sub-elementos em ciclo** (tríade de Mauss, L1397) → caso-limite, texto recomendado por baixo retorno de diagrama trivial de 3 nós — vale testar contra mais exemplos.
- **Procedimento** não apareceu como núcleo dominante no capítulo — hipótese: só emerge quando o bloco pede que o aluno EXECUTE os passos, não quando só descreve terceiros executando.
