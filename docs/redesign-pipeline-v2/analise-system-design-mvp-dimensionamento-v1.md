# Análise de System Design — Dimensionamento do MVP (site + pipeline restrita) v1

> Pedido de Lucas: analisar o dimensionamento do MVP da Lousa como um todo — **site** (leitura
> pública de aulas) + **pipeline de geração** (fábrica de aulas, hoje restrita a ele). **Documento
> de análise, sem implementação** — nenhum código, infraestrutura real ou arquivo `.c4` foi
> tocado. Metodologia: skill `system-design-likec4`
> (`~/.claude/skills/system-design-likec4/SKILL.md`, seções `discovery-e-requisitos.md` e
> `estimativa-de-capacidade.md`). Grounding: `HOME.md`, `README.md`,
> `docs/architecture/model.c4`, `model.c4` (raiz), `app/src/lessonLoader.js`, `fabrica/`
> (verificado via grep — nenhum framework de servidor web presente),
> `docs/redesign-pipeline-v2/concorrencia-orquestrador-hierarquico-v1.md`. Convenção de tag:
> **VERIFIED** (confirmado lendo código/doc real nesta rodada), **HYPOTHESIS** (inferência
> razoável, não ratificada por Lucas), **GAP** (lacuna sem solução, não inventada). Este documento
> é coerente com, e não repete, `analise-lousa-v2-arquitetura-spike.md` — aquele já cobriu a
> pipeline interna (filaAulas, datastores, checkpoints); o foco aqui é o dimensionamento do MVP
> como um todo, com o cenário de tráfego real dado por Lucas.

## 0. Estado real verificado antes de dimensionar

- A arquitetura-alvo do produto já separa explicitamente duas coisas: **fábrica privada**
  (conversão de material bruto em aula) e **runtime público** (leitura/execução de aulas prontas)
  — `HOME.md`, seção "Arquitetura canônica atual": "a inteligência principal da Lousa fica fora do
  navegador; o navegador recebe apenas o necessário para tocar uma aula pronta" [VERIFIED].
- O **site** (`app/`) é uma SPA React/Vite. Lendo `app/src/lessonLoader.js` linha a linha: o
  carregamento de uma aula é **100% leitura de arquivos estáticos** — `fetch` de `lesson.json`,
  `fetch` dos arquivos `.md` de cada step (com cache em memória por sessão,
  `markdownCache`), e `import()` dinâmico do módulo `.mjs` de diagrama já compilado. **Não existe
  nenhuma chamada a um backend/API em tempo de leitura** [VERIFIED, `app/src/lessonLoader.js`].
  Isso é o melhor cenário possível de capacidade: conteúdo cacheável em CDN, sem computação por
  requisição.
- O **deploy-alvo já declarado** para o site é Cloudflare Pages (hospedagem estática/CDN) —
  `HOME.md`, seção "Deploy alvo do MVP": "`Cloudflare Pages` = frontend público do
  player/runtime" [VERIFIED]. Este documento não está propondo essa escolha; está checando se ela
  é proporcional ao tráfego real (seção 3).
- A **pipeline** (`fabrica/`) hoje **não expõe nenhum serviço de rede**: busca por
  `fastapi|flask|express|uvicorn|@app\.(get|post)|http\.server` em todo `fabrica/*.py` não
  encontra nenhuma ocorrência [VERIFIED via grep, executado nesta rodada]. Ou seja, "restrito ao
  Lucas" hoje não é uma regra de autenticação — é a ausência total de qualquer porta de rede. Quem
  tem acesso ao terminal/filesystem desta máquina tem acesso à fábrica; não existe hoje uma camada
  de autenticação a proteger, porque não existe hoje um endpoint a proteger.
- A análise de concorrência já feita para a V2 hierárquica (`concorrencia-orquestrador-hierarquico-v1.md`)
  já registrou dois fatos relevantes para este documento, sem precisar refazer a conta: (1) "o
  backend real de LLM hoje é 1 endpoint só, não uma fazenda de inferência com concorrência alta"
  [VERIFIED, linha 87-88 daquele doc]; (2) `LlmBudget` foi desenhado para 1 processo sequencial
  acumulando chamadas, e sua correção sob concorrência real de múltiplos jobs **já é um GAP aberto
  independente de qualquer usuário externo** [VERIFIED, linhas 485-492 daquele doc]. Isso importa
  aqui porque é um sinal técnico concreto e já existente de que "abrir para mais usuários" tem um
  pré-requisito de correção, não só de capacidade.
- **Nota sobre os dois arquivos `.c4` do repositório**: existem hoje dois modelos LikeC4 distintos.
  `model.c4` (raiz) é a "Fonte canônica da arquitetura hierárquica V2" (`LIKEC4.md`), mas
  `likec4.config.json` **exclui explicitamente `docs/**`** do projeto visual ativo — logo esse
  modelo raiz cobre só o interior da pipeline (V2 hierárquica), sem nenhum elemento de site
  [VERIFIED, já observado em `analise-lousa-v2-arquitetura-spike.md`]. Já `docs/architecture/model.c4`
  é um arquivo separado, mais antigo (último commit sobre ele é anterior ao commit que promoveu o
  `model.c4` da V2 para a raiz — `git log` confirma), que modela o produto inteiro: `privateFactory`,
  `publicRuntime`, `cloudflarePages`, `privateServer`, `githubOrigin` [VERIFIED, lido nesta rodada].
  Nenhum dos dois modelos tem qualquer `metadata`/`notes` de NFR, QPS, latência ou disponibilidade
  anexado — checklist de `discovery-e-requisitos.md` totalmente em branco nos dois arquivos
  [GAP, esperado no estágio atual do projeto]. **Consequência prática**: hoje não existe uma planta
  `.c4` única, atualizada, que mostre site + pipeline V2 juntos — isso não bloqueia este documento
  (que parte do texto de `HOME.md`/`README.md` + do cenário de tráfego dado por Lucas), mas é um
  GAP de consolidação de planta que vale registrar.

---

## 1. Pergunta central: estimar tráfego agora, ou construir uma base simples que escala depois?

A pergunta que Lucas trouxe tem duas leituras técnicas legítimas, com trade-offs reais — nenhuma é
"óbvia" sem olhar o número (seção 3). Nenhuma das duas opções abaixo autoriza pular a conta; o
`SKILL.md` desta análise é explícito: "nunca recomendar tecnologia sem antes declarar o
requisito/número que a justifica."

**Opção (a) — dimensionar a partir de uma estimativa numérica de uso/crescimento agora**

O que significa: calcular QPS médio/pico, armazenamento e banda a partir do tráfego real conhecido
hoje (e de uma projeção de 6-12 meses), e escolher a infraestrutura mínima que atende esse número.

- Prós: evita gasto e complexidade que a carga real não demanda (a armadilha oposta ao cargo
  cult); a decisão fica auditável — "escolhemos X porque o número é Y"; mais fácil de justificar
  orçamento e tempo de engenharia para Lucas.
- Contras: se a estimativa estiver errada por ordem de grandeza — em especial por crescimento
  **inorgânico** (lançamento, divulgação, uso viral) que ninguém previu — o sistema pode ficar
  subdimensionado sem lead time para reagir. O Google SRE Book cita isso como a armadilha central
  de capacity planning: dimensionar só para o estado atual ignora que o sistema precisa de tempo
  para ganhar capacidade [VERIFIED, `estimativa-de-capacidade.md`, linha 71]. Além disso, uma
  estimativa feita hoje fica desatualizada rápido se o **escopo** mudar (abrir a pipeline para
  outros usuários não é "mais do mesmo tráfego" — é um perfil de carga e de risco diferente,
  seção 5).

**Opção (b) — construir uma arquitetura-base simples que escala depois com mais recursos/replicação**

O que significa: escolher hoje uma arquitetura que não é otimizada para o número atual, mas que
tem "válvulas" conhecidas para crescer (hospedagem que escala horizontalmente sem re-arquitetar,
fila que aceita mais workers, provedor de LLM com quota ajustável), sem gastar tempo estimando o
número exato agora.

- Prós: menos trabalho de estimativa upfront; menos risco de "a estimativa errada trava a
  decisão"; alinhado à fase real do projeto — a própria Lousa se declara em "fase de arquitetura,
  não fase de implementação da fábrica" (`HOME.md`, "Linha de corte da fase atual")
  [VERIFIED] — não é hora de otimizar prematuramente para um número que pode mudar de forma.
- Contras: "escalar depois" não é automático nem gratuito — sem um sinal concreto de **quando**
  acionar a escala (seção 8), essa opção vira desculpa para nunca revisitar a arquitetura. E o
  próprio `SKILL.md` desta análise não dispensa a conta mesmo quando a decisão final é "manter
  simples" — a conta é o que prova que "simples" é suficiente, não um chute.

**O que a conta (seção 3) muda nessa escolha, sem decidir por Lucas**: aplicado ao número real
dado ("centenas de acessos por dia"), o resultado é que estimar (a) **não empurra para uma
arquitetura mais pesada** — empurra para uma arquitetura **mais simples** do que talvez pareça
necessário à primeira vista, porque o QPS resultante é ordens de grandeza menor do que qualquer
infraestrutura de replicação/fila/multi-região justificaria. E a arquitetura-base-que-escala (b),
aplicada a uma carga desse tamanho, colapsa na prática na **mesma escolha simples** — não existe
aqui um "meio-termo caro" que (b) estaria evitando. Isso é um achado técnico (a matemática é a
mesma independentemente da filosofia escolhida), não uma recomendação de negócio. **O que continua
sendo decisão de Lucas, e não decorre da matemática**: quanto investir *à frente da demanda* em
disciplina operacional (monitoramento, testes de carga, documentação de runbook) mesmo sabendo que
o volume de tráfego não exige isso hoje — isso é preferência sobre custo de oportunidade vs.
tranquilidade futura, não um fato técnico (ver seção 6).

---

## 2. Duas cargas com perfis completamente diferentes — não dimensionar como sistema único

| Dimensão | Site (runtime público) | Pipeline de geração (fábrica) |
|---|---|---|
| Quem acessa | Qualquer visitante externo (leitura pública) | Só Lucas, hoje (mono-usuário) |
| Padrão de uso | Read-only, sessões de estudo espaçadas ao longo do dia | Jobs sob demanda, disparados manualmente |
| Onde roda | Estático/CDN (Cloudflare Pages, alvo já declarado) | Local/servidor privado, invocado como script |
| Gargalo real | Nenhum verificado — carga é trivial (seção 3) | 1 endpoint de LLM serial (seção 4) |
| Superfície de rede hoje | Pública, mas só leitura de arquivos já publicados | **Nenhuma** — sem servidor web no código (seção 0) |
| O que já foi analisado em outro doc | Não coberto ainda (nenhum doc de análise dedicado ao site) | Sim — filas/datastores internos em `analise-lousa-v2-arquitetura-spike.md` |

Tratar os dois como "um sistema" e aplicar a mesma régua de capacidade a ambos seria o erro que o
pedido de Lucas já antecipa evitar: o site pode crescer para "muitos usuários" sem que a pipeline
precise, e a pipeline pode abrir para "mais usuários" (decisão de produto) sem que isso mude nada
na arquitetura do site, que já é desacoplada por design (`lesson.json` como fronteira,
`HOME.md`: "`lesson.json` = fronteira direta do runtime").

---

## 3. A conta explícita — tráfego do site

"Centenas de acessos por dia" é uma faixa, não um número único — a tabela abaixo cobre a faixa
inteira (100 a 900/dia) usando a fórmula padrão de `estimativa-de-capacidade.md`:

```
QPS médio = acessos/dia ÷ 86400
QPS de pico = QPS médio × fator de pico (2x–3x, padrão; picos virais podem ser 10x+)
```

| Acessos/dia | QPS médio | QPS pico (2x) | QPS pico (3x) | QPS pico (10x, cenário viral) |
|---|---|---|---|---|
| 100 | 0,00116 | 0,00231 | 0,00347 | 0,0116 |
| 300 (ilustrativo, meio da faixa) | 0,00347 | 0,00694 | 0,01042 | 0,0347 |
| 900 (topo da faixa "centenas") | 0,01042 | 0,02083 | 0,03125 | 0,1042 |

[VERIFIED — aritmética direta a partir do número dado por Lucas; o número de entrada
("centenas/dia") é o dado fornecido, a conta em si não é uma suposição]

Em todos os cenários, inclusive um pico viral 10x sobre o topo da faixa, o QPS de pico fica **bem
abaixo de 1 requisição por segundo** (pior caso: ~0,10 req/s, ou seja, cerca de 1 requisição a
cada ~10 segundos no pico).

**Fan-out por visita** [HYPOTHESIS — número exato de sub-requisições por sessão não foi medido]:
uma única "visita" a uma aula não é 1 requisição HTTP — pelo `lessonLoader.js`, é
1× `lesson.json` + N arquivos `.md` de step (cache por sessão) + 1 import dinâmico do diagrama
compilado + bundle estático (JS/CSS/imagens). Assumindo um fan-out generoso de ~15
sub-requisições por sessão (a maioria delas arquivos imutáveis, cacheáveis por hash de build —
JS/CSS/diagrama — que nem chegam a repetir na origem entre sessões diferentes), o pico de
requisições HTTP brutas (sem crédito de cache) fica em torno de:

- 900 acessos/dia, pico 3x, ×15 sub-requisições ≈ **0,47 requisições/segundo** no pior caso.

Ainda assim, menos de 1 requisição por segundo. Isso é a armadilha de fan-out que
`estimativa-de-capacidade.md` pede para nunca ignorar — e mesmo contabilizando-a no pior cenário
plausível, a conclusão não muda.

**Banda** [HYPOTHESIS — tamanho médio de payload por sessão não foi medido; assumindo 5 MB/sessão
como estimativa generosa, incluindo bundle + assets + diagrama]: banda de pico ≈ QPS de sessão de
pico × tamanho médio ≈ 0,03 sessões/s × 5 MB ≈ 150 KB/s no pico. Para referência de ordem de
grandeza, um uplink de datacenter de 10 Gbps equivale a ~1,25 GB/s [VERIFIED,
`estimativa-de-capacidade.md`, linha 43] — a banda estimada aqui está entre 4 e 5 ordens de
grandeza abaixo desse valor de referência. Armazenamento total do conteúdo (pacotes de aula) é
igualmente pequeno em qualquer leitura razoável do número de aulas hoje existentes — não há um
gargalo de armazenamento a resolver neste MVP.

**Conclusão desta seção, sem cargo cult**: dado esse volume, nenhuma das seguintes escolhas tem
justificativa técnica no cenário de tráfego atual — fila de mensagens (Kafka ou similar),
replicação multi-região, sharding de dados, load balancer dedicado, camada de cache dedicada
(Redis) para o site, ou autoscaling de infraestrutura. Isso não é uma opinião contra essas
tecnologias — é a aplicação direta da regra "no cargo cult" do `SKILL.md`: recomendar qualquer uma
delas aqui exigiria primeiro um número que as justificasse, e o número real é 2 a 5 ordens de
grandeza menor do que o ponto em que essas peças começam a compensar seu custo/complexidade. Uma
hospedagem estática/CDN (o alvo já declarado, Cloudflare Pages) atende esse volume com folga em
qualquer plano, inclusive gratuito.

---

## 4. A pipeline — carga hoje: mono-usuário, sequencial, sem necessidade de dimensionar fila ainda

A pipeline **não tem, hoje, um problema de tráfego a estimar** — ela tem um único operador (Lucas),
disparando jobs manualmente, um de cada vez. Isso não é uma simplificação desta análise: é o que o
código mostra.

- [VERIFIED, seção 0] Nenhum servidor web existe em `fabrica/` — não há requisições HTTP
  concorrentes a dimensionar porque não há um endpoint recebendo requisições.
- [VERIFIED, `concorrencia-orquestrador-hierarquico-v1.md`] O gargalo real de throughput hoje é
  **1 endpoint de LLM serial**, não a arquitetura de orquestração — paralelizar mais processos
  locais contra 1 backend de inferência serial não compra velocidade real.
- [VERIFIED, `docs/architecture/model.c4`] O desenho-alvo já registrado no modelo (não implementado
  ainda) descreve o orquestrador da fábrica como `'worker sequencial + checkpoint/resume'` e já
  prevê um `executionLease` (`'claim/lock/CAS'`) para "impedir concorrência e escrita parcial" —
  ou seja, o modelo já antecipa, no papel, que rodar mais de 1 job ao mesmo tempo é um cenário a
  tratar, mesmo que a implementação de hoje seja mono-usuário.
- [VERIFIED, `docs/architecture/model.c4`, componente `ingestApi`] O modelo-alvo também já desenha
  uma `'Porta de Entrada da Fábrica'` (`'upload/API/job'`) como ponto de entrada — mas isso é
  **desenho, não implementação**: a busca por framework de servidor web em `fabrica/` (seção 0)
  confirma que esse componente não existe no código hoje. Ou seja: o caminho para abrir a fábrica
  para mais usuários já tem um desenho de referência no próprio repositório — falta construí-lo.

**O que isso significa para o dimensionamento do MVP**: não existe, hoje, uma decisão de
capacidade/fila a tomar para a pipeline, porque não existe carga concorrente real. A pergunta que
precisa de dimensionamento aqui não é "quantas requisições por segundo", é "quanto tempo/custo leva
para gerar 1 aula" — isso já foi tratado (concorrência interna de módulos/aulas) no doc de
concorrência e no exemplo de análise da V2; não é repetido aqui.

---

## 5. O que muda quando a pipeline (ou o site) abrir para mais usuários

| Dimensão | Hoje (site público + pipeline só Lucas) | Quando abrir para mais usuários |
|---|---|---|
| Autenticação da pipeline | Inexistente — não há endpoint a proteger (superfície de rede = zero) | Precisa existir de fato, antes de qualquer acesso externo — não é "reforçar", é "criar do zero" |
| Autorização/quota | N/A | Rate limit por usuário; teto de geração por usuário/período |
| Fila de jobs | Não necessária (1 operador, jobs sequenciais) | Necessária para enfileirar jobs concorrentes de N usuários contra 1(+) endpoint(s) de LLM |
| Orçamento de LLM | `LlmBudget` por job/módulo, sob controle direto de Lucas | Precisa de teto financeiro **agregado mensal**, com alerta — hoje esse teto não existe em nenhum doc revisado [GAP] |
| Cache/capacidade do site | Nenhuma ação necessária — leitura estática já trivial (seção 3) | Só muda se o site ganhar uma função dinâmica (login, geração sob demanda, personalização) — não é função do número de leitores |
| Superfície de segurança da pipeline | Praticamente zero (sem rede, sem input de terceiros) | Aparece no momento em que input de conteúdo de um usuário externo chega à fábrica — precisa validação de input, controle de abuso (ex.: spam de geração para estourar custo de LLM) |
| Observabilidade da fila/custo | Não instrumentada hoje [GAP] | Precisa existir **antes** de qualquer gatilho de fila (seção 8) poder ser medido de verdade |

---

## 6. Decisões de negócio pendentes — Lucas decide, esta análise não decide

Isso não é uma limitação de instrução, é a divisão de trabalho correta desta skill: `SKILL.md`
declara explicitamente que "business trade-offs (...) são calls de humano; o papel desta skill é
garantir que o humano tem o trade-off real na frente, não uma suposição silenciosa."

- **Quanto de headroom comprar à frente da demanda** — mesmo sabendo que o tráfego atual não
  exige nada além do que já está no plano (Cloudflare Pages + backend privado simples), investir
  em monitoramento/teste de carga antecipado é uma escolha de custo de oportunidade vs.
  tranquilidade operacional futura, não um fato técnico.
- **Teto de custo mensal de LLM** que deveria disparar revisão de arquitetura antes de abrir para
  mais usuários — não existe hoje um valor definido em nenhum doc revisado; `LlmBudget` só limita
  por job/módulo, não agrega um teto financeiro mensal [GAP]. O valor exato (ex.: "R$X/mês") é
  decisão de negócio de Lucas, não uma dedução técnica desta análise.
- **O que "abrir para mais usuários" significa de fato** — usuários pagantes, convidados
  selecionados, ou público geral sem controle? Isso muda drasticamente o desenho de
  autenticação/quota (rate limit generoso para um convidado confiável é diferente de rate limit
  para público anônimo) e não foi especificado ainda [GAP de produto, não técnico].
- **Tempo de espera de fila aceitável** antes de considerar "fila cheia" (seção 8) — é uma
  preferência de experiência/paciência de Lucas como operador, não um número técnico universal.
- **Se/quando o site ganha alguma função dinâmica** (login, comentários, progresso salvo em
  servidor) — isso é o único evento que realmente mudaria o perfil de carga do site (seção 3), e é
  puramente uma decisão de produto, não uma necessidade de infraestrutura hoje.

---

## Lista final (a) — Fazer AGORA no MVP (site restrito de leitura pública + pipeline só do Lucas)

1. Manter o site como está desenhado hoje: build estático (`app/`) publicado em hospedagem
   estática/CDN (Cloudflare Pages, alvo já declarado em `HOME.md`) — o tráfego real (seção 3) não
   justifica nada além disso; não adicionar load balancer, autoscaling, cache dedicado ou
   replicação multi-região para este volume.
2. Manter a pipeline exatamente como está hoje em termos de exposição: **sem** servidor web,
   invocada localmente por Lucas. Não é preciso adiantar nenhuma camada de autenticação/API agora
   — construir isso antes de haver um segundo usuário real seria esforço sem uso imediato
   (over-engineering na direção oposta ao pedido de Lucas).
3. Registrar explicitamente (mesmo que só em texto, sem código) que "restrito ao Lucas" hoje
   significa "sem porta de rede", não "com autenticação fraca" — isso evita uma falsa sensação de
   segurança caso alguém no futuro assuma que existe uma camada de auth a reforçar em vez de uma a
   criar.
4. Definir e documentar o teto de custo mensal de LLM e o "tempo de espera aceitável" antes de
   qualquer decisão de fila (pendências da seção 6) — isso é barato de fazer agora e é o
   pré-requisito para os gatilhos concretos da lista (b) funcionarem quando chegar a hora.
5. Instrumentação mínima de observabilidade da fábrica (mesmo que rudimentar): registrar por job
   quanto custou em chamadas de LLM e quanto tempo levou. Sem isso, nenhum dos gatilhos de custo
   ou fila da lista (b) pode ser medido de verdade quando a hora chegar — hoje esse dado não é
   coletado [GAP verificado nesta rodada].
6. Não implementar hoje o componente `ingestApi`/autenticação já desenhado (mas não construído) em
   `docs/architecture/model.c4` — ele é o caminho certo para quando a decisão de abrir for tomada
   (lista (b)), mas construí-lo antes de haver um segundo usuário é trabalho adiantado sem
   validação (mesmo princípio já registrado em `HOME.md`: "qualquer task de Python antes do
   fechamento arquitetural deve ser tratada como adiantada").

## Lista final (b) — Gatilhos concretos para abrir a pipeline (e revisitar o site) para mais usuários

1. **Concorrência real na pipeline — sinal: 2º usuário simultâneo.** No momento em que mais de 1
   pessoa (além de Lucas) precisar gerar uma aula ao mesmo tempo, isso já é o gatilho — não é
   preciso esperar "muitos" usuários. Motivo: o backend de LLM hoje é 1 endpoint serial e o
   `LlmBudget` já tem uma correção pendente sob concorrência real, documentada
   independentemente desta análise (`concorrencia-orquestrador-hierarquico-v1.md`). Resolver esse
   GAP é pré-requisito técnico, não opcional, antes de permitir 2 jobs concorrentes de usuários
   diferentes.
2. **Fila cheia com frequência perceptível.** Forma concreta do sinal, uma vez que a
   instrumentação da lista (a) item 5 exista: fila com pelo menos 1 job pendente em mais de X% do
   tempo observado numa janela de 1-2 semanas, **ou** tempo de espera antes de começar a rodar
   ultrapassando o limite que Lucas definir (seção 6 — pendente, é preferência de operador, não
   fato técnico). Sem a instrumentação mínima, este gatilho não pode ser medido — construir a
   instrumentação (lista (a)) precede o gatilho.
3. **Custo mensal de LLM ultrapassando o teto definido por Lucas** (ou se aproximando — ex.:
   alerta a 80% do teto). O valor exato do teto é decisão de negócio pendente (seção 6); a forma do
   gatilho — teto mensal agregado com alerta, não só limite técnico por job — é a parte técnica
   desta recomendação.
4. **Qualquer exposição de rede da pipeline, mesmo que só para Lucas usar remotamente.** No
   instante em que a fábrica deixar de ser "só CLI local" e ganhar qualquer endpoint acessível pela
   rede — mesmo que a intenção seja só Lucas acessar de outro dispositivo — a camada de
   autenticação/autorização real precisa existir **antes** desse endpoint subir, não depois. Isso
   não é um gatilho de "abrir para mais gente" no sentido de volume — é um gatilho estrutural:
   expor uma porta sem autenticação por trás dela é o mesmo risco esteja ela destinada a 1 pessoa
   ou a muitas.
5. **Site: não há gatilho de volume realista dentro da faixa discutida aqui.** Dado que a leitura
   é 100% estática e cacheável, mesmo um salto de 2-3 ordens de grandeza no tráfego (de centenas
   para dezenas de milhares de acessos/dia) ainda resultaria em QPS de pico bem abaixo do que uma
   hospedagem estática/CDN atende sem mudança nenhuma. O gatilho real para revisitar a arquitetura
   do site é **funcional, não volumétrico**: a primeira vez que o site ganhar qualquer
   funcionalidade dinâmica (login, progresso salvo em servidor, comentários, geração sob demanda)
   — isso muda o perfil de "estático cacheável" para "computação por requisição", e é nesse momento
   que cache/rate-limit/backend do site voltam a ser uma pergunta real de capacidade.
