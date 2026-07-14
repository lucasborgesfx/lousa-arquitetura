# Análise de falhas de `content_type` — pipeline de geração de aulas (v1)

> Pedido direto de Lucas via `gpt_web` (`agent_messages.id=3445d85a-f05e-49dc-834a-95ade9f820e6`),
> antes de decidir se o Crítico deve poder reprovar uma aula por `content_type` incompatível. Task
> formal: `agent_tasks.id=08ac014d-9b83-4ae7-a23b-70856203abe7`. **Documento de análise, sem
> implementação** — nenhum `.py`/`.json` de schema foi tocado. Grounding: código real
> (`fabrica/agents/content_author.py`, `flowchart_adapter.py`, `lesson_critic.py`, `condemn.py`,
> `orchestrator.py`) + exemplos reais extraídos de `fonte-real/as-armas-da-persuasao.txt` (nunca
> hipotéticos). Convenção de tag: **VERIFIED** (confirmado lendo o código/fonte real nesta rodada),
> **HYPOTHESIS** (proposta desta análise, não ratificada por Lucas), **GAP** (lacuna sem solução).

## 0. Estado real verificado, antes de analisar falhas

`content_type` já está implementado ponta a ponta (tasks `6f652b22`, `d56f30ff`, commits `cd60f1c`,
`7a58cce`):

1. **Autor de Conteúdo** classifica cada beat em um de 5 valores (`conceito`, `procedimento`,
   `princípio`, `processo/sistema`, `fato`) — campo **obrigatório** no schema
   (`fabrica/schemas/roteiro_pedagogico.json`, `required: [..., "content_type"]`, enum fechado). A
   classificação é feita **depois** de decidir o conteúdo real do beat, nunca antes
   (`content_author_system.md`, seção "Classificação de content_type por beat").
2. **Adaptador de Fluxograma** recebe `content_type` de cada beat em `beats_brief` como **sinal
   auxiliar** para escolher `mapping.type` (preset de câmera) — nunca determinístico, nunca
   sobrepõe a REGRA HARD C2 (ordem de arestas do walkthrough). Pode estar ausente (`null`);
   tratado como "sem sinal adicional" (`flowchart_adapter_system.md`).
3. **Crítico** recebe `content_type` repassado pelo `orchestrator.py`, casando por **id do beat**
   (nunca por posição — a validação do Adaptador só garante que o *conjunto* de ids bate entre
   `roteiro` e `mapeado`, não a ordem do array). Produz `content_type_review[]` — um item por step
   avaliado, com `step`, `content_type_declarado`, `aderente` (bool), `justificativa`. **Puramente
   informativo**: `_enrich()` em `lesson_critic.py` só inclui `content_type_review` no relatório se
   o LLM o retornou; nunca entra em `score_total` nem em `violations[]`.
4. **Condenador** (`condemn.py`, 100% determinístico, sem LLM) só lê `report["violations"]`
   (derivado dos 30 princípios fixos P1-P30) e `report["score_total"]` (máx 60, `MIN_SCORE=42`).
   Nunca lê `content_type_review`. `lesson_critic_output.json` tem `principles` com
   `minItems`/`maxItems: 30` e regex `^P([1-9]|[12][0-9]|30)$` — lista fechada.
5. **Diretor de Apresentação** e o schema `lesson.json` não são tocados — `content_type` não existe
   no `lesson.json`, só no `roteiro_pedagogico.json` (Autor) e no sinal separado passado ao Crítico.

Consequência direta: hoje, uma aula com `content_type` sistematicamente errado em todos os beats
**passa** pelo Condenador exatamente igual a uma aula com classificação perfeita, contanto que os
30 princípios estejam OK. Esta análise cobre o que fazer com isso — sem implementar nada.

---

## 1. Tipos de erro possíveis de `content_type`

### 1.1 Classificação errada

O Autor rotula o beat com um `content_type` diferente do que o conteúdo real pede — havendo, entre
os 5 valores fechados, um outro tipo objetivamente mais correto. É o erro "escolhi a caixa errada
entre as 5 disponíveis".

*Exemplo esquemático*: um beat cujo texto é "1985: Etiópia enviou 5 mil dólares ao México porque em
1935 o México ajudou a Etiópia" é um `fato` (evento datado, específico, verificável) — rotulá-lo
`princípio` (a regra causal que o fato *ilustra*, não o fato em si) é classificação errada.

### 1.2 Conteúdo incompatível com o tipo declarado

O texto do beat não corresponde ao que o rótulo promete — não necessariamente porque *outro* tipo
seria mais correto, mas porque a *execução* do beat não cumpre o contrato do tipo declarado. É o
erro "a caixa certa foi escolhida, mas o conteúdo dentro dela não parece o que deveria".

*Exemplo esquemático*: um beat rotulado `procedimento` mas cujo texto não descreve nenhuma sequência
de passos executáveis — só uma definição vaga ("a rejeição-e-recuo é uma técnica de persuasão"),
sem o "primeiro X, depois Y". O tipo escolhido pode até ser o certo para a *ideia* do beat, mas a
*redação* não entrega um procedimento.

Esta é, na prática, exatamente o que `content_type_review` do Crítico já avalia
(`lesson_critic_system.md`, seção "Pedido opcional adicional"): aderência do tratamento do step
(texto, preset, foco) ao tipo declarado.

### 1.3 Bloco misto

O beat genuinamente mistura mais de um `content_type` — ex.: explica o que uma coisa é (`conceito`)
E por que ela acontece (`princípio`) no mesmo beat. Isso já é, em si, candidato a violar **P7 [um
beat = uma ideia]** do harness do Autor (`content_author_system.md`: "1 beat = 1 ideia atômica —
nunca empilhe dois conceitos no mesmo beat"; `lesson_critic_system.md`, P7: "Cada step mapeia pra UM
estado de câmera e no máximo UM conceito/nó/aresta novo?").

**Nuance importante**: nem todo bloco misto é um P7 real. P7 pega "dois conceitos distintos
empilhados". Mas uma ideia genuinamente *atômica* pode, ainda assim, atravessar dois `content_type`
ao mesmo tempo — ex.: um beat que explica, numa única frase coesa, "a concessão mútua funciona
porque a regra da reciprocidade pressiona quem recebe a retribuir" mistura a *definição* do
mecanismo (`conceito`) com a *regra causal* de por que ele funciona (`princípio`), sem empilhar duas
ideias — é uma ideia só, que taxonomicamente não cabe limpo em nenhuma das 5 caixas. Este subtipo
**não** é coberto por P7 hoje.

### 1.4 Categoria ausente

O Autor não classificou o beat. Hoje isso **não deveria acontecer para aulas novas**: `content_type`
é campo obrigatório no schema (`required` array), validado via `jsonschema.validate()` em
`content_author.py`; uma resposta do LLM sem o campo é rejeitada e conta como tentativa (até
`MAX_RETRIES=3`), nunca chega ao Crítico sem o campo. Mas existem dois caminhos reais onde
"ausência" acontece hoje, e o código já trata os dois de forma graciosa (não como erro):

- **Aula legada**: um `roteiro_pedagogico.json` gerado antes da task `6f652b22` (commit `cd60f1c`)
  não tem `content_type` em nenhum beat. Se esse artefato for reprocessado (ex.: resume parcial de
  um job antigo), `b.get("content_type")` em `flowchart_adapter.py`/`orchestrator.py` retorna `None`
  silenciosamente — sem exceção.
- **Falha de propagação por algum caminho do orchestrator**: o fallback defensivo em
  `orchestrator.py` (`_run_slice`, comentário "não deveria ocorrer nos caminhos de resume atuais")
  cobre o caso de `roteiro`/`mapeado` estarem indisponíveis no momento de montar
  `step_content_types`, preenchendo `[None] * len(steps)` para toda a aula.

Em ambos os casos, `flowchart_adapter_system.md` já instrui "`content_type` pode até estar ausente
(`null`) em algum beat; trate como 'sem sinal adicional'" e `lesson_critic_system.md` já instrui
"Nem todo step vai ter esse campo — quando ausente, ignore aquele step". **Categoria ausente já
degrada graciosamente hoje, sem quebrar nada** — o que falta decidir é só a gravidade/visibilidade
desse estado (seção 2).

---

## 2. Gravidade de cada caso

### 2.1 Duas (+1) opções estruturais para o caso "reprovar"

Antes de atribuir gravidade, é preciso decidir *como* uma reprovação por `content_type` chegaria a
existir, porque isso limita o que é realista recomendar. `condemn.py` hoje só sabe reprovar por dois
caminhos: (a) FAIL num dos 7 princípios críticos, ou (b) `score_total < 42/60`. Nenhum dos dois lê
`content_type_review`.

**Opção A — `content_type_review` vira "P31"**

Estender a lista fechada de princípios de 30 para 31. Implica mudar, em pelo menos 5 lugares:
`ALL_PRINCIPLES` (`lesson_critic.py`), a regex/`minItems`/`maxItems` de `principles` em
`lesson_critic_output.json`, `score_total` passa a ser `/62`, `MIN_SCORE` do Condenador recalculado
proporcionalmente (`70% de 62 ≈ 43,4`, precisa decisão de arredondamento), e possivelmente
`CRITICAL_PRINCIPLES` (P31 é crítico — FAIL automático — ou só conta pontos?). Toda a documentação e
comentários que hoje dizem "30 princípios"/"score/60" (`lesson_critic.py`, `condemn.py`,
`lesson_critic_system.md`) precisariam de atualização — não é uma mudança isolada de
`content_type`, é uma mudança na régua de aprovação de **toda** a fábrica.

- **Prós**: consistência total — um único mecanismo de aprovação, um único formato de
  violação (`principle`/`status`/`field`/`issue`/`instruction`/`send_back_to`) já reaproveitado,
  auditável do mesmo jeito que os outros 30.
- **Contras**: infla o escopo do Crítico (que hoje é só sobre UX de aula, não sobre taxonomia
  pedagógica); muda a régua de aprovação de aulas que nem usam `content_type` como sinal relevante;
  qualquer ajuste futuro na definição/severidade de `content_type` volta a mexer na escala global.

**Opção B — gate separado, independente de `score_total`**

Um gate adicional em `condemn()` (ou uma função irmã) que lê `report.get("content_type_review")`
quando presente e decide reprovar com uma regra própria — ex.: "reprova se ≥N itens tiverem
`aderente=false` na mesma aula". `score_total`/30 princípios continuam intocados.

**Implicação real, não escondida**: o schema atual de `content_type_review` (`step`,
`content_type_declarado`, `aderente`, `justificativa`) não tem campo de severidade/gravidade — só
um booleano. Para o gate ser mais fino que "N ocorrências de `false`", seria preciso adicionar um
campo (ex.: `gravidade: "baixa"|"alta"`) — uma mudança de schema real, mas **escopada só ao objeto
`content_type_review`**, não à lista de 30 princípios.

- **Prós**: isolado e reversível — pode ser ligado/desligado sem tocar em `principles`/`score_total`;
  não muda a régua de aprovação de aulas que não usam `content_type`; combina com o fato de a
  taxonomia de 5 tipos ainda ser "enum inicial revisável" sem gold-set humano (decisão registrada no
  Project Home) — um sinal ainda em validação não deveria ter o mesmo peso estrutural que os 30
  princípios já maduros.
- **Contras**: cria um segundo "tipo" de critério de aprovação, com semântica diferente do resto
  (binário/threshold em vez de pontuação com PARTIAL); `condemn()` deixa de ser "leia só duas coisas"
  e passa a ler uma terceira estrutura — leve perda de uniformidade na auditoria.

**Opção C — gate no Orquestrador, não no Condenador (não recomendada, mas honesta)**

Manter `condemn.py` 100% intocado (preserva o contrato "só lê `score_total`+`violations`") e fazer o
`orchestrator.py` decidir, *depois* de chamar `condemn_with_routing()`, se sobrepõe o veredito com
base em `content_type_review`. Tecnicamente possível (`_run_slice` já tem acesso a `critic_report`
inteiro antes de decidir o que fazer).

- **Prós**: não abre `condemn.py` — módulo hoje documentado como "100% determinístico, decide
  APROVADO/REPROVADO a partir do relatório do Crítico" continua literalmente verdadeiro.
- **Contras**: pior separação de responsabilidade que B — o `orchestrator` passaria a poder
  "derrubar" um veredito que o Condenador já deu como aprovado, duplicando lógica de decisão em dois
  arquivos e criando uma fonte de verdade ambígua (`condemn()` diz aprovado, mas o job falha do mesmo
  jeito). Recomendação desta análise: **evitar C**, é estritamente pior que B para o mesmo resultado.

### 2.2 Gravidade recomendada por tipo de erro

| Tipo de erro | Gravidade recomendada | Por quê |
|---|---|---|
| **1.1 Classificação errada** | Alertar (sempre) | É erro sobre um sinal hoje auxiliar, não sobre o conteúdo pedagógico em si. Se o rótulo errado causar dano real (preset de câmera incoerente), esse dano já tem rede de segurança independente: P10/P22/P23 do Crítico avaliam a câmera pelo conteúdo real do step, não pelo `content_type` declarado. |
| **1.2 Conteúdo incompatível com o tipo declarado** | Alertar por padrão; candidato a reprovar (Opção B) só se **sistemático** (≥2 beats na mesma aula) | Uma incompatibilidade isolada é ruído esperado de um sinal ainda sem gold-set humano (GAP já registrado). Incompatibilidade sistemática (o Autor erra o padrão inteiro, não um caso pontual) é evidência mais forte de problema real, não de ruído do avaliador. |
| **1.3 Bloco misto** | Alertar apenas | Quando é P7 real, já reprova hoje (P7 é princípio crítico, FAIL automático, independente de `content_type`). Quando é mistura *só* de `content_type` sem violar P7 (ver nuance da seção 1.3), criar um segundo mecanismo de reprovação redundante com P7 adiciona complexidade sem ganho claro. |
| **1.4 Categoria ausente** | Alertar apenas, nunca reprovar | É majoritariamente um estado de infraestrutura (aula legada, resume parcial), não um erro pedagógico do Autor. Tratar ausência como reprovação puniria o sistema por um gap de propagação, não por conteúdo ruim — e o próprio harness (Adaptador/Crítico) já foi desenhado para degradar graciosamente aqui. |

**Corrigir automaticamente — nota geral para os 4 casos**: essa opção **não existe hoje em nenhum
agente da fábrica** para `content_type`. Nem o Crítico, nem o Adaptador, nem o Autor re-classificam
nada automaticamente — o único mecanismo de correção hoje é o ciclo completo
Crítico→reprovação→retrabalho→nova geração (seção 3 e 4). Se um dia isso for construído, os
candidatos mais baratos e menos arriscados são **categoria ausente** (reclassificação isolada de um
beat já existente, sem tocar no texto) e **classificação errada** (reclassificar com base no mesmo
conteúdo) — mas ambos precisam de guard-rail contra loop (o quê acontece se a reclassificação
automática errar de novo?). Isso é trabalho novo, fora do escopo desta análise.

---

## 3. Rota de retorno por caso

`condemn.py` já tem `choose_send_back_to()` genérico, roteando por `violation.send_back_to` entre
`content_author`, `flowchart_adapter`, `presentation_director`, priorizando o papel mais a montante.
Isso é **tecnicamente plugável** se a Opção A ou B da seção 2 forem adotadas — mas é implementação
futura, não desta task.

| Tipo de erro | Rota recomendada | Justificativa |
|---|---|---|
| **1.1 Classificação errada** | `content_author` | Quem classifica é o Autor (`content_author_system.md`: "Quem classifica é você, o Autor"). Ninguém mais no pipeline tem esse poder — o Adaptador só *consome* `content_type`, nunca o produz ou corrige. |
| **1.2 Conteúdo incompatível com o tipo declarado** | `content_author` | Mesmo quando a causa "parece" de apresentação, o texto do beat (`content`) é propriedade exclusiva do Autor. O Adaptador tem proibição explícita de reescrever `content`/`label`/`idea`/`concepts_introduced` (`flowchart_adapter_system.md`: "Você NUNCA reescreve... mesmo que ache que poderia melhorar"). Corrigir incompatibilidade sempre significa reescrever texto ou reclassificar — as duas coisas são do Autor. |
| **1.3 Bloco misto** | `content_author` | Já é a rota real hoje para violações de P7 (`lesson_critic_system.md`, exemplo P7: `"send_back_to": "content_author"`). Dividir um beat em dois, ou reformular a ideia atômica, é decisão de conteúdo — do Autor, não do Adaptador (que só mapeia beats já prontos para presets de câmera) nem do Diretor (que só traduz `mapping.type → camera.preset`, sem tocar em conteúdo). |
| **1.4 Categoria ausente** | Depende da causa, não é uniforme (ver nota abaixo) | — |

**Nota sobre 1.4**: se a causa é "o Autor não retornou `content_type` numa geração nova", o schema
já bloqueia isso antes de sair do Autor (retry interno até `MAX_RETRIES=3`, nunca chega ao Crítico
sem o campo) — não existe, hoje, um "beat sem `content_type`" vindo de uma geração nova bem-sucedida
para rotear. Se a causa é "artefato legado em disco" (roteiro salvo antes da task `6f652b22`) ou
"fallback defensivo do orquestrador", **não é um problema de beat, é um problema de job/infra** — a
correção certa não é "enviar de volta pro Autor via `send_back_to`" (esse mecanismo só existe dentro
do ciclo Crítico→Condenador→retrabalho de uma execução em andamento), é simplesmente **regenerar o
roteiro daquela fatia do zero** com o schema atual. `choose_send_back_to()` nem chegaria a ser
chamado para esse caso hoje, porque a ausência não vira uma `violation` — vira só "sem sinal
adicional" silencioso.

---

## 4. Limite de tentativas e comportamento após falhas repetidas

**O que já existe (verificado no código, não é proposta)**:

- `MAX_RETRIES = 3` em `content_author.py`, `flowchart_adapter.py`, `presentation_director.py` e
  `lesson_critic.py` — retry **interno e estrutural** (JSON malformado, campo faltando, violação de
  schema/REGRA HARD). Não é retry de qualidade pedagógica; é "o LLM não obedeceu o contrato de
  formato desta vez, tenta de novo".
- `rework_count`/`job.max_reworks` (default `max_reworks=2`, isto é, 1 tentativa inicial + até 2
  retrabalhos = 3 rodadas por fatia) em `orchestrator.py` — o ciclo **de qualidade**:
  Crítico reprova → `condemn_with_routing()` decide `send_back_to` → orquestrador incrementa
  `rework_count`, monta `feedback_text` a partir de `violations[]`, reprocessa a partir da etapa
  indicada.
- Esgotado `max_reworks`, a **fatia** (não o job inteiro) vira dead-letter: `status="failed"`,
  `result.json` gravado, mas as outras fatias continuam normalmente (`slice_results` isolado por
  fatia — verificado em `_run_slice`/`run_job`). O cabeçalho do próprio `orchestrator.py` já declara
  essa filosofia por decisão de arquitetura anterior (`docs/architecture/model.c4`, 2026-07-06):
  **"esgotou tentativas -> failed/dead-letter, sem escalar pra humano"**.

**Proposta para `content_type` (HYPOTHESIS desta análise)**: se a Opção B da seção 2 for adotada,
uma reprovação por `content_type` deve entrar **no mesmo `rework_count`/`max_reworks`** que já
existe — nunca um contador paralelo. Mecanicamente: o gate separado no Condenador retorna
`send_back_to="content_author"` (ou o alvo apropriado) do mesmo jeito que uma violação de princípio
retornaria; `orchestrator.py` não precisa saber que a causa foi `content_type` e não um dos 30
princípios — o loop `rework_count += 1; target = send_back_to` já trata os dois casos de forma
idêntica sem mudança de código no orquestrador.

**O que acontece depois de esgotar tentativas — três opções, com recomendação**:

(a) **Aceitar com ressalva** — publicar mesmo assim, marcando `meta.content_type_reliable=false` na
   aula publicada, sinalizando pra revisão humana posterior. Diverge da filosofia atual do sistema:
   hoje, **nenhuma** outra causa de reprovação tem esse tratamento especial — score baixo ou
   princípio crítico sempre bloqueiam publicação sem exceção. Criar uma exceção só para
   `content_type` introduziria dois pesos e duas medidas dentro do mesmo Condenador.

(b) **Escalar bloqueando publicação** — dead-letter da fatia, mesmo comportamento que toda outra
   reprovação já tem hoje. "Escalar" aqui não significa notificação ativa a um humano (esse canal
   não existe hoje para nenhuma causa de dead-letter) — significa apenas que a fatia não publica e
   fica registrada em `result.json`/fila, dependendo de alguém revisar os dead-letters depois.

(c) Alternativa não recomendada: tratamento especial por tipo de erro (ex.: (a) para "categoria
   ausente", (b) para os outros) — rejeitada por criar 4 caminhos de esgotamento diferentes para o
   mesmo mecanismo, contra a simplicidade que o resto do sistema já mantém.

**Recomendação desta análise**: **(b)**, por consistência com o resto do sistema — content_type não
deveria ganhar um comportamento de exceção que nenhuma outra causa de reprovação tem hoje. Mas isso
só é defensável **se** e **quando** `content_type` de fato virar motivo de reprovação — o que esta
análise recomenda adiar (ver Recomendação final) justamente porque a taxonomia ainda não tem
validação por gold-set humano (GAP já registrado no Project Home:
`gold-set de representação (20-30 blocos rotulados à mão)... não iniciado`). Bloquear publicação com
base num sinal ainda não validado é um risco real de falso positivo — aulas pedagogicamente boas
sendo dead-letradas por um rótulo auxiliar ainda instável.

---

## 5. Exemplos concretos pros 5 tipos

Todos os exemplos abaixo são ancorados em `fonte-real/as-armas-da-persuasao.txt` (Cialdini, Cap. 1
"Armas de influência" e Cap. 2 "Reciprocidade"), com linha de origem citada. Nenhum exemplo é
inventado — mesma regra anti-invenção que o Autor de Conteúdo segue.

| `content_type` | CORRETO | AMBÍGUO | INCORRETO |
|---|---|---|---|
| **conceito** | "Padrões fixos de ação": sequências de comportamento automático, tipo fita cassete, ativadas por um gatilho específico — "Clique, e a fita apropriada é ativada; zum, e eis que se desenrola a sequência de comportamentos padrão" (L342-349). Define O QUE é o fenômeno, sem alegar causa nem passo a passo. | O automatismo humano "clique, zum" aplicado ao experimento da palavra "porque" na fila da xerox (L377-404): pode ser lido como `conceito` (define o que é resposta automática/mindless a um gatilho verbal) OU como `princípio` (a regra causal "se X vem com 'porque', então mais gente concorda"). O próprio texto mistura definição e mecanismo causal na mesma passagem. | Rotular a narrativa do experimento de Regan/Joe (voluntários, Coca-Cola, rifa de 25 centavos, dobro de bilhetes vendidos, L1040-1068) como `conceito`. É um evento específico, datado (1971), com números e nomes — é `fato`, não uma definição abstrata. |
| **procedimento** | A técnica de rejeição-e-recuo como sequência executável: "primeiro fazer um pedido maior, que eu provavelmente rejeitarei. Depois de minha recusa, você faz o pedido menor, no qual estava interessado de fato" (L1670-1676) — passo 1, passo 2, resultado esperado. | A mesma técnica de rejeição-e-recuo, mas com o foco deslocado para "por que a pessoa cede ao segundo pedido" (a regra da reciprocidade obriga retribuir a concessão) em vez de "como executar os passos" — pode ser `procedimento` (como fazer) OU `princípio` (por que funciona), dependendo do que o beat de fato enfatiza. | Rotular a definição de "concessão mútua" como mecanismo social — "Isso se dá por procedimentos que promovam o compromisso. A concessão mútua é um deles... A regra da reciprocidade promove a concessão mútua de duas formas" (L1651-1662) — como `procedimento`. O beat explica DUAS RAZÕES causais (por quê a concessão mútua funciona), não um passo a passo executável; é `princípio`. |
| **princípio** | A regra causal extraída do estudo de Langer: pedidos acompanhados da palavra "porque" (mesmo sem justificativa real) elevam a taxa de consentimento — 94% com motivo real, 93% com "porque" vazio, contra 60% sem "porque" (L379-399). Regra causal generalizável, não um evento único. | "A regra da reciprocidade" como beat isolado: pode ser `princípio` (a regra causal "se alguém lhe dá algo, você se sente obrigado a retribuir") OU `conceito` (só definir o que a norma social É, sem declarar o mecanismo causal) — depende de o texto do beat afirmar o "se X então Y" ou só nomear a norma. | Rotular a narrativa histórica Etiópia/México/Holanda/Katrina (L963-1025: Etiópia manda ajuda ao México em 1985 porque o México ajudou a Etiópia em 1935; Holanda ajuda Nova Orleans no Katrina de 2005 porque Nova Orleans ajudou a Holanda em 1953) como `princípio`. São fatos históricos específicos que ILUSTRAM a regra da reciprocidade — a regra em si é o princípio, os eventos datados são `fato`. Confundir os dois é um erro comum quando o exemplo é vívido demais. |
| **processo/sistema** | A dinâmica de troca de concessões entre duas partes ao longo do tempo: "[a regra] pressiona o beneficiário de uma concessão a reagir de forma equivalente... as pessoas se sentem livres para fazer a concessão inicial e, assim, iniciar o processo benéfico de troca" (L1653-1662) — descreve como as ações de AMBAS as partes se retroalimentam, não um script fixo de uma pessoa só. | A técnica de rejeição-e-recuo, mas descrita do ponto de vista do sistema social completo (solicitante + alvo interagindo até o consentimento) em vez do script linear do persuasor — pode ser `processo/sistema` (dinâmica de duas partes) OU `procedimento` (passo a passo de quem pede). | Rotular o script fixo do experimento de Regan (Joe sai da sala, volta com 2 Cocas, dá uma ao voluntário, depois pede o favor da rifa, L1045-1059) como `processo/sistema`. É um roteiro único e linear de UM ator (Joe), sem múltiplas partes interagindo e se retroalimentando — é `procedimento` (ou `fato`, se o foco é "isso é o que aconteceu no experimento"), não um sistema com partes móveis. |
| **fato** | "Em 1985, a Etiópia... enviou 5 mil dólares em ajuda humanitária ao México... porque, em 1935, o México havia mandado ajuda à Etiópia quando esta foi invadida pela Itália" (L963-982) — evento datado, específico, verificável, sem generalização. | "94% das pessoas que ouviram um pedido com 'porque' concordaram, contra 60% sem a palavra" (L385-389, Langer) — pode ser `fato` (é uma estatística medida, específica) OU evidência citada dentro de um `princípio` (a regra causal que o número sustenta), dependendo se o beat só relata o número ou já o enquadra como prova da regra. | Rotular a generalização "as sociedades humanas obtêm uma grande vantagem competitiva da regra da reciprocidade e, portanto, zelam para que seus membros sejam educados para obedecê-la" (L1029-1037) como `fato`. Soa como afirmação direta ("as sociedades fazem X"), mas é uma generalização causal sem evento específico — é `princípio` (ou `conceito`), não `fato`. |

---

## Recomendação

**Regra prática proposta** (Lucas decide; abaixo, a recomendação desta análise com prós/contras
explícitos):

1. **Alertar sempre** — manter `content_type_review` exatamente como está hoje: informativo,
   gerado pelo Crítico, visível no relatório, nunca bloqueante. Custo zero, já implementado.
2. **Corrigir automaticamente: não implementar no MVP.** Não existe hoje em nenhum agente. Se
   Lucas quiser essa feature depois, os candidatos mais seguros são "categoria ausente" e
   "classificação errada" (seção 2.2) — mas é trabalho novo, com risco de loop, fora desta task.
3. **Reprovar: não ligar automaticamente ainda.** Se e quando ligar, usar a **Opção B** (gate
   separado no Condenador, independente de `score_total`/30 princípios) — nunca a Opção A ("P31").
   Escopo mínimo sugerido para quando isso for autorizado: reprovar só quando `content_type`
   incompatível (tipo 1.2) for **sistemático** (≥2 beats na mesma aula com `aderente=false`), nunca
   por classificação isolada errada (1.1), bloco misto (1.3, já coberto por P7 quando é real) ou
   categoria ausente (1.4, problema de infra, não de conteúdo).

**Por que adiar reprovação, mesmo tendo uma opção técnica pronta (B)**: a taxonomia de 5
`content_type` ainda não tem validação por gold-set humano — GAP explicitamente aberto no Project
Home (`Criar gold-set de representação (20-30 blocos rotulados à mão)... não iniciado`). Usar um
sinal ainda não validado para bloquear a publicação de uma aula pedagogicamente correta é um risco
real de falso positivo, e o próprio `orchestrator.py` já declara a filosofia de que esgotar
tentativas gera dead-letter sem exceção (seção 4) — aplicar essa mesma dureza a um sinal instável
seria desproporcional.

**Prós desta recomendação**: mantém o Condenador simples e a régua de aprovação intocada; não
inflaciona o escopo do Crítico; é reversível (a Opção B pode ser ligada a qualquer momento sem
mexer nos 30 princípios); dá tempo para o gold-set humano validar a taxonomia antes dela ganhar
poder de bloqueio.

**Contras**: aulas com `content_type` sistematicamente ruim continuam publicando normalmente até
alguém decidir ligar o gate B; o sinal fica "fraco" por mais tempo (só log, nunca ação); se Lucas
quiser reprovação rápida, essa recomendação atrasa o valor.

**Decisão final é de Lucas** — esta análise recomenda, não decide, particularmente sobre: (1) se e
quando ativar reprovação (Opção B); (2) o threshold exato de "sistemático" (proposto ≥2, mas é
arbitrário); (3) se "categoria ausente" deveria virar alerta mais visível (hoje é silencioso) antes
mesmo de qualquer decisão sobre reprovação.
