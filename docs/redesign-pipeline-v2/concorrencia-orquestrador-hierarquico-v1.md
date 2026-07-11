# Concorrência do Orquestrador Hierárquico — v1 (2026-07-11)

> Frente: pesquisa e desenho de arquitetura para a etapa **J. Orquestrador Hierárquico**
> (`docs/redesign-pipeline-v2/contratos-schemas-pipeline-hierarquica-v1.md`, seção 3, última
> linha da tabela + nota HYPOTHESIS logo abaixo). **Nenhum código real foi escrito/editado
> nesta frente** — só leitura de `fabrica/orchestrator.py`, `fabrica/agents/condemn.py` e
> `fabrica/agents/lesson_critic.py` como referência, e desenho em prosa/pseudocódigo.
> Convenção de tag: **VERIFIED** (confirmado lendo código real do repo, citado por
> `arquivo:linha`), **HYPOTHESIS** (proposta desta frente, não ratificada por Lucas),
> **GAP** (lacuna conhecida, sem solução fechada aqui).

## 0. Resumo executivo (recomendação final adiantada)

A HYPOTHESIS já registrada em `contratos-schemas-pipeline-hierarquica-v1.md` (linhas 361-367:
"módulos serializados... mas aulas do mesmo módulo em paralelo") é **validada nesta pesquisa,
com uma correção de precisão e uma extensão concreta de mecanismo**:

- **Correção de precisão**: a nota original diz que aulas "não dependem... do índice global
  mutável entre si". Isso não é exato — o contrato da etapa C (Autor de Conteúdo, mesma seção 3,
  linha 352) mostra que o Autor **recebe** `curso.indice_conceitos_nucleares` como input. A
  distinção real não é "lê ou não lê", é **"lê sim, escreve não"** — leitura concorrente de um
  objeto read-only-por-chamada é segura; o risco real está inteiramente do lado da **escrita**
  (patch/append).
- **Extensão de mecanismo**: em vez de inventar um esquema de lock/fila novo, esta pesquisa
  propõe reaproveitar **recursivamente** a própria classe `JobStore` (`fabrica/orchestrator.py:285-343`)
  e o comando `work-next` (`fabrica/orchestrator.py:1034-1048`) — hoje usados para coordenar
  múltiplos processos concorrentes disputando jobs de uma fila global — como o mecanismo de
  concorrência intra-módulo: cada módulo ativo cria sua própria fila local de aulas (mesma
  classe, mesmo `flock`, só outro path), e N processos-worker chamam `reserve_next()` até a
  fila esvaziar. Módulos continuam encadeados por uma barreira (curso-level), aulas do módulo
  ativo correm em paralelo dentro dessa fila local.
- A escrita no `mapa_do_curso` nunca é feita por um agente/LLM diretamente — é feita **uma vez
  por módulo**, pelo código determinístico do orquestrador, no fechamento de barreira, sob o
  mesmo padrão de lock já usado em `JobStore` (`_locked_file`, `fabrica/orchestrator.py:126-138`).
  Como módulos são serializados, esse lock quase nunca compete de verdade — é uma rede de
  segurança, não uma fila de contenção.

Estratégia canônica em 1 frase: **serializar módulos via barreira explícita no
`mapa_do_curso`, paralelizar aulas dentro do módulo ativo via fila local reaproveitando
`JobStore`, e nunca deixar um agente escrever no mapa do curso — só o código do orquestrador,
uma vez por módulo, sob lock.**

---

## 1. Módulos sequenciais vs. paralelos

### 1.1 A race condition concreta no `indice_conceitos_nucleares`

Cenário mínimo: módulo A e módulo B rodando de verdade em paralelo (2 pipelines LLM
simultâneos). O Autor de Conteúdo do módulo A introduz o conceito "Reciprocidade" numa aula;
quase ao mesmo tempo, o Autor de Conteúdo do módulo B introduz o mesmo conceito sob o nome
"Norma da Reciprocidade" (ambos plausíveis, extraídos independentemente do mesmo capítulo-fonte
sobre Cialdini). Se cada módulo, ao terminar, faz seu próprio "ler índice atual → decidir se é
conceito novo → apendar", e as duas leituras acontecem **antes** de qualquer das duas escritas
ter sido commitada, nenhum dos dois lados vê a entrada do outro. Resultado: **duas entradas em
`indice_conceitos_nucleares` para o mesmo conceito real**, cada uma com seu próprio
`primeira_introducao` — exatamente a "inflação por sinônimo" que o próprio schema
(`contratos-schemas-pipeline-hierarquica-v1.md` linha 106) foi desenhado pra resolver. Pior:
como o Crítico de Coerência de Curso (etapa H) usa esse índice como fonte única de verdade
sobre "isso já foi ensinado", uma duplicação silenciosa aqui **quebra a premissa de entrada da
etapa H inteira** — ela pode deixar passar uma redundância real (porque, pro sistema, são "dois
conceitos diferentes") que o dedupe deveria ter pego antes.

Esse é um lost-update clássico (read-modify-write sem exclusão mútua) — o mesmo problema que
`JobStore` já resolve hoje pra fila de jobs via `_locked_file` (`fabrica/orchestrator.py:298-330`).
A diferença crítica: **é resolvível com lock** (seção 6 abaixo), então o risco por si só não
obriga serialização de módulos — mas combinado com o ganho real (1.2), a serialização ainda
vence.

### 1.2 Ganho real de paralelizar módulos — e por que hoje é menor do que parece

Quantificação com o dado real disponível: a fonte de teste (`vocabulario-canonico-v1.md`
linhas 56-58) tem **8 capítulos reais** (logo, provavelmente ~8 módulos), e a síntese final
estima "~20-25 aulas" pro livro inteiro (`SINTESE-FINAL-v1.md` linha 46 — **HYPOTHESIS,
não contagem humana real**, o próprio documento já marca isso como não validado). Isso dá
~2,5-3 aulas por módulo em média.

Paralelizar só aulas-dentro-do-módulo-ativo (até ~3 de cada vez) já absorve a maior parte do
ganho de wall-clock possível: 8 módulos sequenciais × (latência de ~1 aula, se as ~3 aulas do
módulo rodam de fato em paralelo) ≈ 8x mais rápido que rodar as ~24 aulas 100% em série — sem
tocar no risco do índice global. Paralelizar módulos por cima disso só multiplicaria o ganho
por um fator adicional de até ~8x **se** o backend de inferência suportasse ~24 chamadas
verdadeiramente concorrentes. Isso não bate com o que está configurado hoje: `lesson_critic.py`
documenta explicitamente que "a única credencial disponível em `fabrica/.env` é um único modelo
(qwen3-235b via OpenRouter)" (`fabrica/agents/lesson_critic.py:6-11`), com fallback padrão pra
`http://localhost:11434/v1` (Ollama local, `fabrica/agents/lesson_critic.py:22,48`) — ou seja,
**VERIFIED**: o backend real de LLM hoje é 1 endpoint só, não uma fazenda de inferência com
concorrência alta. Rodar N pipelines de módulo em paralelo contra 1 endpoint serial não compra
wall-clock de verdade — só enfileira chamadas na porta do modelo, adicionando a complexidade e
o risco do índice sem o ganho que justificaria.

### 1.3 Veredito

**Validado, com precisão**: módulos serializados **não porque a race não tem solução**, mas
porque (a) o ganho real de paralelizá-los é pequeno dado o backend de inferência atual de 1
endpoint, e (b) a maior parte do ganho de throughput alcançável já vem de paralelizar aulas
dentro do módulo ativo, que é mais barato de tornar seguro (fold único, no fechamento de
barreira, nunca concorrente entre módulos por construção — seção 6). Se no futuro o backend
passar a suportar múltiplos modelos/providers em paralelo de verdade, módulo-paralelo vira
viável **sem redesenhar nada**, porque o mecanismo de lock em `mapa_do_curso` (seção 6) já é
seguro sob concorrência — só a decisão operacional de "quantos módulos ativos ao mesmo tempo"
muda, não o contrato.

---

## 2. Aulas paralelas dentro do módulo

### 2.1 Dependências reais encontradas

Duas dependências reais existem entre aulas do mesmo módulo (nenhuma é sobre conteúdo bruto de
outra aula — o contrato da etapa C já proíbe isso, `contratos-schemas-pipeline-hierarquica-v1.md`
linha 352, coluna "NUNCA precisa ver"):

1. **`abertura.recap_aula_anterior`** (`aula.schema.v1`, linha 253): obrigatório (não-null) "se
   gap > 2 aulas desde a última menção dos mesmos conceitos nucleares". Isso não é
   estritamente "aula imediatamente anterior" — é uma regra de espaçamento que olha pra trás no
   histórico de menções de um conceito, potencialmente cruzando módulos.
2. **`conceitos_referenciados`** em `bloco_didatico.schema.v1` (linha 297): "só pode citar
   termos que já existem em `indice_conceitos_nucleares` — validado em código, não por
   autorrelato". Esta é a dependência mais direta: se a Aula 2 quer referenciar um conceito que
   a Aula 1 (do mesmo módulo, rodando em paralelo) acabou de introduzir, mas a Aula 1 ainda não
   terminou (e portanto seu conceito ainda não está commitado em lugar nenhum que a Aula 2 possa
   ler), a validação em código simplesmente rejeita a citação — a Aula 2 não pode legitimamente
   apontar pra um conceito que "ainda não existe" do ponto de vista do sistema.

### 2.2 Isso quebra paralelismo total, ou é pontual/contornável?

**É pontual e contornável, não uma trava geral.** Nenhuma aula precisa do *conteúdo* de outra
aula pra rodar — o Autor de Conteúdo de cada aula roda com o markdown da própria aula +
`modulo.resumo` + `modulo.objetivo_do_modulo` + o índice do curso *como estava no início do
módulo* (mais o feedback do Crítico se estiver reprocessando, nada disso exige as OUTRAS aulas
do módulo estarem prontas). O único efeito de rodar aulas 100% em paralelo sem nenhum
escalonamento é uma **degradação de qualidade, não uma falha estrutural**: `conceitos_referenciados`
fica vazio/mais pobre entre aulas irmãs que terminam quase ao mesmo tempo (a aula não referencia
o que a irmã acabou de introduzir, porque ainda não está no índice), e `recap_aula_anterior`
pode ficar `null` quando deveria citar algo — um objeto pedagogicamente mais fraco, mas
schema-válido e revisável (o Crítico de Coerência de Curso, etapa H, roda depois e pode
sinalizar isso como `alertas_de_coerencia.tipo = "gap_de_pre_requisito"` se for grave).

### 2.3 Recomendação canônica para esta pesquisa (v1, simples)

**Aulas do módulo ativo rodam em paralelismo total** (sem escalonamento por ordem), aceitando a
degradação pontual de 2.2 como limitação conhecida de v1 — na pior das hipóteses, produz uma
aula com menos conexão explícita entre irmãs, capturável e sinalizável pela etapa H, nunca um
erro de pipeline.

**Alternativa de otimização (HYPOTHESIS explícita, não obrigatória agora)**: se dados de
qualidade mostrarem que essa degradação é custosa demais, existe um refinamento barato —
escalonar só a fase *Autor de Conteúdo* das aulas (a fase mais barata/rápida das 4) em ordem de
`ordem_no_modulo`, publicando `conceitos_introduzidos` de cada aula num arquivo de staging
*local ao módulo* assim que essa fase termina (não o índice global do curso, só um documento
efêmero por módulo), permitindo que aulas seguintes da fila leiam esse staging antes de decidir
`conceitos_referenciados`. Isso preserva a maior parte do paralelismo (as fases caras —
Adaptador, Diretor, Crítico — continuam paralelas) e resolve a degradação, mas é complexidade
adicional que só vale a pena se a v1 mostrar o problema na prática. Não é a recomendação
canônica agora — é a válvula de escape se 2.2 doer.

---

## 3. Checkpoints — estrutura de `state.json` aninhada

### 3.1 O que já existe hoje (1 nível, VERIFIED)

Hoje o checkpoint é só por fatia (`slice`), dentro de 1 job:

```
fabrica/runs/<job_id>/
  job.json                       (JobSpec público — orchestrator.py:389)
  scope_plan.json                (orchestrator.py:822)
  llm_budget.json                (orchestrator.py:424,829)
  result.json                    (terminal do JOB — orchestrator.py:941/981)
  slices/<slice_id>/
    state.json                    ({target, rework_count, feedback_text} — orchestrator.py:400-408)
    slice.json / source.md        (orchestrator.py:394-397)
    roteiro_pedagogico.json
    roteiro_mapeado.json
    lesson.draft.json
    critic_report.json
    result.json                   (terminal da FATIA — orchestrator.py:552-560 checa isso pra resume)
```

`state.json` é gravado **antes** de cada fase rodar (`_save_slice_state`, chamado nas linhas
590, 643, 672, 697), nunca depois — é assim que o resume sabe qual fase estava em andamento
quando o processo morreu (a fase em si é refeita do zero, não é "resumida no meio", mas o
*roteamento* entre fases não se perde). `result.json` só existe quando a fatia chega a um
veredito terminal (`done`/`failed`); sua ausência é o sinal de "ainda não terminou", checado
antes de tudo em `_run_slice` (linhas 552-560).

### 3.2 Extensão pra 2 níveis (HYPOTHESIS desta pesquisa)

Proposta: inserir exatamente **1 diretório a mais** (`modulos/<modulo_id>/`) entre o `curso_id`
raiz e `aulas/<aula_id>/` — a forma de aula/estado é **idêntica** ao slice de hoje, só o nome
muda; o que é genuinamente novo é o nível módulo e o objeto `mapa_do_curso.json` na raiz:

```
fabrica/runs/<curso_id>/
  curso.json                       (spec do curso — equivalente a job.json)
  mapa_do_curso.json                (objeto compartilhado — schema seção 1 do doc de contratos)
  mapa_do_curso.json.lock           (arquivo de lock flock — mesmo padrão de .queue.json.lock)
  state.json                        (NOVO — nível CURSO, ver 3.2.1)
  result.json                       (terminal do CURSO — M/N módulos aprovados, mesma filosofia de manifest.json)
  modulos/<modulo_id>/
    modulo.json                      (spec/plano do módulo — equivalente a slice.json)
    state.json                       (NOVO — nível MÓDULO, ver 3.2.2)
    queue.json                       (NOVO — fila local de aulas deste módulo; MESMA CLASSE JobStore)
    queue.json.lock                  (flock da fila local — mesmo padrão de hoje)
    result.json                      (terminal do MÓDULO — aprovado/reprovado, decidido por etapa I)
    aulas/<aula_id>/
      state.json                     (IDÊNTICO em forma ao state.json de slice hoje)
      roteiro_pedagogico.json
      roteiro_mapeado.json
      lesson.draft.json
      critic_report.json
      result.json                    (IDÊNTICO em forma ao result.json de slice hoje)
```

#### 3.2.1 `state.json` de nível CURSO (novo)

```json
{
  "curso_id": "as-armas-da-persuasao-3f9a21",
  "modulos_planejados": ["modulo-01", "...", "modulo-08"],
  "modulo_ativo": "modulo-03",
  "modulos_fechados": ["modulo-01", "modulo-02"],
  "mapa_do_curso_versao_content_no_inicio_do_ativo": 7,
  "updated_at": "2026-07-11T12:00:00+00:00"
}
```

Generaliza `_save_slice_state`/`_load_slice_state` (`orchestrator.py:400-415`) um nível acima:
em vez de `target` (fase dentro de 1 unidade), guarda **qual módulo é o único autorizado a ter
aulas em andamento agora** — é a barreira em si, persistida (não só em memória), pra sobreviver
a um `kill -9` do processo orquestrador inteiro.

#### 3.2.2 `state.json` de nível MÓDULO (novo)

```json
{
  "modulo_id": "modulo-03",
  "status": "em_progresso",
  "aulas_planejadas": ["aula-07", "aula-08", "aula-09"],
  "aulas_terminal": {"aula-07": "done", "aula-08": "done", "aula-09": null},
  "barrier_closed": false,
  "mapa_patch_applied": false,
  "updated_at": "2026-07-11T12:03:00+00:00"
}
```

`aulas_terminal[aula_id] = null` significa "ainda não tem `result.json`" — o mesmo sinal usado
hoje em `_run_slice` (linhas 552-560), só espelhado num índice de nível módulo pra não precisar
re-abrir cada `aulas/<id>/result.json` pra saber o estado agregado. `barrier_closed` e
`mapa_patch_applied` são campos separados de propósito — ver 5.2 (idempotência do fechamento de
barreira).

`state.json` de aula: **sem mudança nenhuma de forma** em relação ao slice de hoje
(`{target, rework_count, feedback_text, updated_at}`) — só muda o path onde mora.

---

## 4. Retries e reprovação — trava aulas irmãs? Trava o módulo seguinte?

### 4.1 Trava aulas irmãs? Não — VERIFIED por construção existente

O loop de retrabalho (`_run_slice`, `while True:` em `orchestrator.py:588-761`) opera **inteiramente
dentro de `slice_run_dir`** — nunca lê nem escreve nada fora do diretório da própria fatia.
Quando uma fatia esgota `max_reworks` (`JobSpec.max_reworks`, default 2 —
`orchestrator.py:213,245`), ela vira dead-letter (`status: failed`) e o loop externo em `run_job`
simplesmente segue pra próxima fatia pendente (`orchestrator.py:834-918`, especialmente o
comentário nas linhas 913-915: "Esgotamento/falha desta fatia (dead-letter) NÃO derruba o job
inteiro"). Isso já é verdade hoje mesmo em execução sequencial; ao tornar aulas irmãs
literalmente **processos concorrentes separados** (seção 6), o isolamento fica ainda mais
explícito — o rework loop da Aula 8 rodando em 1 worker não tem nenhum canal de comunicação
com o worker rodando a Aula 7, exceto a fila compartilhada (`queue.json`), que só entrega
"próxima aula pendente", nunca estado de retrabalho de outra aula.

### 4.2 Trava o módulo seguinte? Só de forma limitada e previsível

Como o fechamento de barreira do módulo (seção 6) só acontece depois que **todas** as aulas do
módulo ativo chegam a estado terminal (`done` ou `failed`), uma aula presa em retrabalho longo
atrasa esse fechamento — e por módulos serem serializados (seção 1), isso atrasa o início do
módulo seguinte. Mas o atraso é **limitado**, nunca infinito: `max_reworks` garante que toda
aula alcança estado terminal em no máximo `1 + max_reworks` tentativas (hoje, 3). Não existe
cenário de módulo travado pra sempre por causa de 1 aula.

Módulo pode fechar como **parcialmente aprovado** (M/N aulas aprovadas, N-M em dead-letter) —
mesma filosofia M/N já implementada no nível job hoje (`orchestrator.py:944-954`,
`job_status = "partial_done"` quando há `done_results` e `failed_results` misturados). A única
diferença: `modulo.schema.v1` (`contratos-schemas-pipeline-hierarquica-v1.md` linha 202) só tem
enum binário `["planejado", "em_progresso", "aprovado", "reprovado"]` — sem valor
`"parcialmente_aprovado"`. **Resolução recomendada, sem bump de schema**: não é preciso
adicionar um terceiro valor — a etapa I (Condenador de Curso, determinística, "mesma filosofia
de `condemn.py`... estendida pro nível curso", linha 358 do doc de contratos) decide
`aprovado`/`reprovado` do módulo **contando o campo `status` de cada aula individual** (aula já
tem seu próprio enum `draft/em_critica/aprovada/reprovada`, linha 265) — o detalhe M/N fica só
no `result.json` operacional do módulo (artefato de implementação, não schema), exatamente como
`manifest.json` hoje carrega o detalhe por-fatia sem que isso precise estar no schema de
`lesson.json` (`orchestrator.py:764-788`).

---

## 5. Reentrada — resumir sem duplicar trabalho em 2 níveis

### 5.1 Sequência de resume (top-down, generalizando o padrão já testado com `kill -9`)

1. Ler `runs/<curso_id>/state.json` → obter `modulo_ativo` e `modulos_fechados`.
2. Para cada módulo em `modulos_fechados`: pular inteiramente — já tem `result.json` terminal
   e já foi commitado no `mapa_do_curso`. (Generaliza a checagem de `terminal_result_path.exists()`
   já usada em `_run_slice`, linhas 552-560, um nível acima.)
3. Para `modulo_ativo`: ler `modulos/<id>/state.json` → para cada `aula_id` em
   `aulas_planejadas`, checar `aulas/<aula_id>/result.json`:
   - Se existe e status terminal (`done`/`failed`): pular, reaproveitar resultado (idêntico ao
     que `_run_slice` já faz, linhas 552-560, sem nenhuma mudança de lógica).
   - Se não existe: essa aula ainda está em andamento ou nunca começou — repor na fila local
     do módulo (`queue.json`) se ainda não estiver lá, e deixar os workers pegarem via
     `reserve_next()`.
   - Se não existe `result.json` mas existe `aulas/<aula_id>/state.json`: ler esse
     `state.json` (mesma função `_load_slice_state`, linhas 411-415, sem mudança) e retomar
     exatamente da fase (`target`) e `rework_count` registrados — **isso é o que já foi testado
     com `kill -9` real hoje, só operando 1 nível mais fundo na árvore de diretórios.**
4. Quando todas as aulas de `modulo_ativo` estiverem terminais: verificar
   `modulos/<id>/state.json.barrier_closed`.
   - Se `false`: (re)executar o fechamento de barreira (seção 6) — **precisa ser idempotente**,
     ver 5.2.
   - Se `true`: módulo já fechado (só faltou avançar `modulo_ativo` no `state.json` do curso —
     um passo puramente de escrita, também precisa ser seguro a repetir).
5. Avançar `modulo_ativo` pro próximo item de `modulos_planejados`, mover o módulo atual pra
   `modulos_fechados`, escrever `state.json` do curso atomicamente (`_write_json`,
   `orchestrator.py:115-123` — reaproveitado sem mudança).

### 5.2 Idempotência do fechamento de barreira (o único ponto genuinamente novo)

O padrão de escrita atômica (`os.replace`, `orchestrator.py:115-123`) já garante que o arquivo
`mapa_do_curso.json` nunca fica truncado/corrompido por um `kill -9` no meio da escrita — isso é
**VERIFIED, reaproveitado sem mudança**. O que **não existe hoje** (porque hoje não há um
"fold" de múltiplas unidades num objeto agregado) é proteção contra **aplicar o mesmo patch duas
vezes** se o processo morrer *entre* "todas as aulas terminaram" e "módulo marcado como
`barrier_closed: true`" — nesse intervalo, um restart ingênuo poderia tentar apender os
conceitos da Aula 7/8/9 no índice de novo, duplicando entradas mesmo sem nenhuma concorrência
real envolvida (é um bug de re-execução, não de race).

**Solução concreta (HYPOTHESIS, mas barata de implementar)**: o campo `mapa_patch_applied` no
`state.json` do módulo (proposto em 3.2.2) é escrito **depois** que a escrita em
`mapa_do_curso.json` já foi commitada (não antes) — se o processo morre entre o commit do mapa
e a escrita desse marcador, o restart detecta "aulas terminais, `barrier_closed=false`,
`mapa_patch_applied=false`" e tenta de novo; a aplicação do patch em si checa
`mapa_do_curso.meta.versao_conteudo` esperado vs. atual antes de reaplicar — se o conceito já
está lá (porque a escrita anterior de fato completou e só o marcador local não foi atualizado),
o fold é um no-op idempotente (dedupe contra o que já existe), não uma duplicação. Isso é o
mesmo princípio geral de "recalcular em vez de confiar em autorrelato" que já rege
`condemn.py`/`lesson_critic.py` hoje, aplicado à idempotência de escrita em vez de à avaliação
de conteúdo.

---

## 6. Consistência global — mecanismo exato de escrita segura no `mapa_do_curso`

### 6.1 Quando a escrita acontece (só 2 pontos, nunca durante execução de aula)

1. **Uma vez, no início do curso**: Estruturador de Curso (etapa A) grava o esqueleto inicial —
   nenhuma concorrência possível, é o primeiro passo, single-threaded por definição.
2. **Uma vez por módulo, no fechamento de barreira**: o **código do orquestrador** (não um
   agente/LLM) lê o estado atual do `mapa_do_curso.json`, aplica o patch (resumo do módulo,
   `conceitos_nucleares_aqui` de cada aula aprovada dedupicados contra o índice existente,
   `versao_conteudo += 1`), e escreve de volta.

**Regra dura (HYPOTHESIS, mas alinhada ao padrão já existente de `condemn.py` ser 100%
determinístico/sem-LLM)**: nenhum Autor/Adaptador/Diretor/Crítico de Aula escreve no
`mapa_do_curso` diretamente — eles só **leem** um snapshot passado por referência. Isso já é
regra do próprio schema (`contratos-schemas-pipeline-hierarquica-v1.md` linha 36: "Ninguém
edita este objeto por reescrita livre"); esta pesquisa só torna explícito que o fechamento de
barreira também é feito por código puro, mesma filosofia de `condemn.py` (determinístico, sem
chamar LLM, `fabrica/agents/condemn.py` linhas 4-9).

### 6.2 Mecanismo: reaproveitar `_locked_file` exatamente como em `JobStore`

```
com _locked_file(mapa_do_curso.json.lock):          # fabrica/orchestrator.py:126-138
    mapa = _read_json(mapa_do_curso.json)            # fabrica/orchestrator.py:111-113
    mapa = aplicar_patch_modulo(mapa, patch_ja_computado)   # NOVO, puro, sem I/O de rede
    _write_json(mapa_do_curso.json, mapa)            # fabrica/orchestrator.py:115-123 (atômico)
```

Isso é **literalmente** o mesmo padrão de `JobStore.enqueue`/`reserve_next`/`finish`
(`orchestrator.py:298-343`): lock exclusivo sobre 1 arquivo protege a sequência
read-modify-write inteira, não só a escrita — é assim que `JobStore` já evita "lost update"
entre invocações concorrentes de `work-next` hoje (comentário explícito em
`orchestrator.py:317-320`). Não é fila de patches, não é lock otimista por módulo — é o mutex
mais simples possível, no MESMO nível de granularidade (1 arquivo, 1 lock) que já está validado
em produção.

**Por que não precisa ser mais sofisticado**: como módulos são serializados (seção 1), só existe
**um** módulo fazendo fechamento de barreira por vez — o lock quase nunca compete de verdade;
ele existe como rede de segurança contra uso indevido (ex: alguém invocar manualmente 2
processos de fechamento por engano) e contra a etapa H (Crítico de Coerência de Curso) lendo o
arquivo enquanto ele está sendo escrito (o `os.replace` atômico já garante que toda leitura
concorrente vê ou a versão antiga completa ou a nova completa, nunca um arquivo truncado —
VERIFIED, mesmo mecanismo de `_write_json`).

### 6.3 Regra dura sobre onde o lock NÃO pode ser mantido

Qualquer chamada de LLM para dedupe de sinônimo (mecanismo G6 citado em `SINTESE-FINAL-v1.md`
linha 23 — julgamento par-a-par pra decidir se 2 nomes são o mesmo conceito) **deve acontecer
antes de adquirir o lock**, nunca dentro da seção crítica. Manter um `flock` de arquivo aberto
durante uma chamada de rede (LLM) é o tipo de erro que travaria qualquer outro worker tentando
fechar barreira de outro módulo (mesmo raro) por segundos/minutos ao invés de milissegundos —
princípio já implícito hoje: nenhuma chamada de LLM em `_run_slice` roda dentro de um
`_locked_file` (o lock só protege o `queue.json`, nunca as fases de agente). Esta pesquisa só
torna essa regra explícita para o novo caso de uso.

---

## 7. Cenários concretos de conflito e o que a estratégia recomendada faz

| # | Cenário | Passo a passo sob a estratégia recomendada |
|---|---|---|
| 1 | **Módulo B começa antes do módulo A commitar seu resumo no mapa do curso** | Estruturalmente prevenido: o loop externo (nível curso) só marca `modulo_ativo = B` depois que A aparece em `modulos_fechados` (seção 5.1, passo 5). Só pode acontecer por uso indevido (ex: 2 processos orquestradores apontados pro mesmo curso). Defesa em profundidade: (a) o `mapa_do_curso.json.lock` ainda serializa as ESCRITAS de A e B corretamente, sem corrupção; (b) antes de B fechar sua própria barreira, o orquestrador compara o `versao_conteudo` que B leu no início contra o atual — se A commitou algo novo nesse meio-tempo (indício de que a invariante foi violada), marca o resultado de B com `coherence_recheck_needed: true`, forçando 1 passada extra da etapa H antes de aprovar B, em vez de confiar cegamente numa invariante que foi quebrada por uso indevido. |
| 2 | **Aula 2 e aula 3 do mesmo módulo terminam ao mesmo tempo e tentam propor patch simultâneo** | Não existe "proposta simultânea de patch" no desenho recomendado — cada aula só escreve seu próprio `aulas/<id>/result.json` (caminho exclusivo, sem contenção entre irmãs). O fold no `mapa_do_curso` só acontece 1 vez, no fechamento de barreira, depois que TODAS as aulas do módulo (incluindo 2 e 3) já são terminais — processado em ordem determinística (`ordem_no_modulo`) por 1 único caminho de código, não por 2 escritores concorrentes. Se aula 2 e aula 3 introduziram o mesmo conceito sob sinônimos diferentes, o fold usa o critério G6 (par-a-par) pra mesclar as duas entradas, atribuindo `primeira_introducao` à aula de menor `ordem_no_modulo` (desempate pedagógico determinístico, não por ordem de chegada no disco). |
| 3 | **Processo do orquestrador morre (`kill -9`) no meio do retrabalho de uma aula reprovada, com outras aulas do módulo ainda em andamento** | `aulas/<aula_id>/state.json` da aula em retrabalho já foi gravado ANTES da fase atual rodar (`_save_slice_state`, chamado antes de cada fase — `orchestrator.py:590/643/672/697`), preservando `target` e `rework_count` corretos. No restart: aulas irmãs (com seu próprio `state.json`/`result.json` independentes) são resumidas cada uma a partir do seu próprio checkpoint, sem nenhuma interferência cruzada — exatamente o padrão já testado com `kill -9` real no nível de fatia, aplicado por aula dentro do módulo. `rework_count` não é resetado pelo crash (evita loop infinito de retrabalho reiniciando o contador a cada crash). |
| 4 (bônus) | **Processo morre exatamente durante o fechamento de barreira, entre a escrita do `mapa_do_curso.json` e a marcação `barrier_closed=true`** | Coberto em 5.2: `mapa_patch_applied` só é marcado depois que a escrita do mapa já foi commitada; se o restart encontra "todas aulas terminais + `barrier_closed=false`", ele reexecuta o fechamento, e a aplicação do patch é idempotente (checa `versao_conteudo` antes de reaplicar), então não duplica entradas no índice mesmo com a tentativa repetida. |

---

## 8. Recomendação canônica final

**Uma estratégia, não uma lista de opções:**

1. Curso processa módulos **serializados** por uma barreira explícita persistida
   (`state.json` de nível curso, campo `modulo_ativo`) — só 1 módulo tem aulas em andamento a
   qualquer momento.
2. Dentro do módulo ativo, aulas rodam em **paralelismo total** via uma **fila local
   reaproveitando a classe `JobStore` sem modificação** (`fabrica/orchestrator.py:285-343`),
   instanciada num path por-módulo (`modulos/<id>/queue.json`) — N processos-worker chamam
   `reserve_next()` (mesmo `flock`, `orchestrator.py:321-330`) até a fila esvaziar.
3. O `mapa_do_curso` **nunca** é escrito por um agente/LLM — só pelo código determinístico do
   orquestrador, **uma vez por módulo**, no fechamento de barreira, sob o mesmo `_locked_file`
   (`orchestrator.py:126-138`) + escrita atômica (`orchestrator.py:115-123`) já usados hoje pra
   `queue.json`.
4. Checkpoint aninhado em 2 níveis novos (`state.json` de curso e de módulo) envolvendo o
   checkpoint de aula já existente (`state.json`/`result.json` de fatia), sem mudar sua forma —
   só sua profundidade no diretório.
5. Reprovação/retrabalho continua 100% isolado por unidade (aula), com `max_reworks` limitando
   o atraso que 1 aula problemática pode impor ao fechamento do módulo (e por consequência ao
   início do módulo seguinte) — nunca trava pra sempre.
6. Escalonamento de módulo-paralelo fica **desligado por padrão hoje** (ganho real baixo dado o
   backend de 1 endpoint), mas o mecanismo de lock no `mapa_do_curso` já é seguro se essa decisão
   mudar no futuro — é uma troca de configuração, não um redesenho de contrato.

---

## 9. Lógica arquitetural vs. decisão de implementação

### Regras de arquitetura (devem valer sempre — quebrar isso quebra o contrato)

| Regra | Tag |
|---|---|
| Só o código determinístico do orquestrador escreve no `mapa_do_curso`; nenhum agente/LLM escreve nele diretamente | HYPOTHESIS (extensão explícita do princípio "nunca confiar em autorrelato" já VERIFIED em `condemn.py`/`lesson_critic.py`) |
| Módulos avançam via barreira — módulo N+1 nunca começa antes de módulo N estar em `modulos_fechados` | HYPOTHESIS (valida e precisa a nota original do doc de contratos) |
| Toda unidade (aula) tem checkpoint próprio (`state.json`) gravado ANTES da fase que descreve rodar | VERIFIED — já existe assim hoje (`orchestrator.py:400-408,590,643,672,697`) |
| O loop de retrabalho de uma unidade nunca lê/escreve fora do diretório da própria unidade | VERIFIED — já é assim hoje (`_run_slice` opera só dentro de `slice_run_dir`) |
| `max_reworks` limita todo loop de retrabalho | VERIFIED — `JobSpec.max_reworks`, default 2 (`orchestrator.py:213,245`) |
| Exceção de qualquer fase vira dead-letter da MENOR unidade, nunca derruba a unidade-pai | VERIFIED — `_handle_phase_exhaustion` + dead-letter em `run_job` (`orchestrator.py:477-522,913-918`) |
| Escrita num objeto compartilhado é sempre lock + atômica (read-modify-write inteiro sob exclusão mútua, nunca só a escrita final) | VERIFIED como padrão (`JobStore`, `orchestrator.py:298-343`), HYPOTHESIS como aplicado ao `mapa_do_curso` |
| Nenhuma chamada de LLM roda com um lock de arquivo mantido | HYPOTHESIS (regra nova, mas consistente com o uso atual de `_locked_file` só ao redor de I/O local) |

### Decisões de implementação (podem mudar sem quebrar o contrato)

| Decisão | Tag |
|---|---|
| Layout exato de diretórios (`runs/<curso_id>/modulos/<id>/aulas/<id>/...`) | HYPOTHESIS — só uma forma possível de nomear/organizar |
| Paralelismo de aula via processos OS (N invocações de `work-next`-equivalente) vs. threads vs. async dentro de 1 processo Python | GAP — orchestrator.py hoje não tem NENHUM precedente de threading/asyncio/multiprocessing (verificado: `grep` nos imports não encontra nenhum); o precedente real é concorrência **entre processos OS distintos** via `JobStore`/`flock`, que é o que esta pesquisa reaproveita. Threads/async dentro de 1 processo seriam uma alternativa válida mas SEM precedente no código hoje — ficaria por conta de quem implementar escolher, desde que preserve as regras de arquitetura acima. |
| Paralelismo total de aulas vs. escalonamento por `ordem_no_modulo` (seção 2.3) | HYPOTHESIS — ajustável por dado de qualidade, não afeta a segurança do índice em nenhum dos dois casos |
| `max_reworks=2`, profundidade de rescope=2, thresholds numéricos | já eram decisão de implementação hoje (config do job), continuam sendo |
| Algoritmo exato de dedupe de sinônimo (G6, par-a-par) | GAP herdado, já registrado em `contratos-schemas-pipeline-hierarquica-v1.md` linha 470-472 e `SINTESE-FINAL-v1.md` linha 22 — esta pesquisa assume que ALGUM mecanismo de dedupe existe e desenha SÓ o quando/onde ele é chamado em relação ao lock (seção 6.3), não resolve o COMO ele julga |
| Se módulo-paralelo é ativado no futuro (config) | decisão de implementação/operação — mecanismo de lock já suporta, é troca de config, não redesenho |

---

## 10. Lacunas e riscos que ficam explicitamente em aberto

1. **GAP — primitiva real de concorrência intra-processo**: esta pesquisa resolve "como
   coordenar N workers com segurança" (reaproveitando `JobStore`+`flock`), mas não resolve "os N
   workers são N processos OS, N threads, ou N tasks assíncronas" — isso não tem nenhum
   precedente no código hoje e fica pra quem implementar decidir, respeitando as regras da
   seção 9.
2. **GAP — orçamento de LLM (`LlmBudget`) sob concorrência real**: `LlmBudget`
   (`orchestrator.py:160-195`) é hoje um objeto em memória, mutado por callback
   (`_budget_callback`, linhas 418-426), pensado pra 1 processo sequencial acumulando chamadas.
   Se aulas do módulo ativo rodam como processos OS separados, cada processo teria sua PRÓPRIA
   instância de `LlmBudget` — o teto `max_llm_calls`/`max_llm_tokens` do curso/módulo como um
   todo não seria respeitado automaticamente por essa classe como está hoje. Precisa de uma
   segunda rodada de desenho (orçamento agregado por módulo, seja via arquivo compartilhado sob
   lock análogo ao do `mapa_do_curso`, seja via orçamento pré-fatiado por aula) — não resolvido
   nesta pesquisa, sinalizado aqui porque foi encontrado ao analisar o código real.
3. **GAP — acoplamento de diagrama entre aulas paralelas (REGRA HARD C2)**: o doc de contratos
   menciona que `bloco.representacao.diagrama.fonte_diagrama` "pode reaproveitar um diagrama já
   usado em bloco/aula anterior" (`contratos-schemas-pipeline-hierarquica-v1.md` linha 320). Se
   2 aulas paralelas do mesmo módulo decidissem estender continuamente a MESMA view (walkthrough
   compartilhado), a contiguidade de `edgeIndex` da REGRA HARD C2 poderia exigir coordenação
   adicional entre elas. **Não aprofundado nesta pesquisa** — o escopo pedido foi
   `mapa_do_curso`/concorrência de orquestração, e `fabrica/agents/flowchart_adapter.py` não foi
   lido nesta rodada (fora da lista de arquivos indicados). Sinalizado como ponto de atenção
   pra quando a etapa D (Adaptador de Representação) for desenhada em detalhe.
4. **Risco operacional não resolvido**: o cenário 1 da tabela da seção 7 (2 processos
   orquestradores apontados pro mesmo curso por engano) é tratado com defesa em profundidade,
   mas a causa raiz (nada impede hoje 2 invocações manuais do comando de curso apontando pro
   mesmo `curso_id`) não tem um guard-rail de "single writer" no nível do PROCESSO orquestrador
   em si (só no nível do arquivo `mapa_do_curso.json`). Um lock adicional em
   `curso.json.lock` (mesmo padrão, granularidade acima) resolveria isso de forma barata, mas
   não foi formalizado nesta pesquisa como parte obrigatória do desenho.
5. **Depende de decisão pendente de Lucas**: esta pesquisa deixa `SINTESE-FINAL-v1.md` seção 5
   item 3 (concorrência do Orquestrador Hierárquico) tecnicamente respondida, mas ainda como
   HYPOTHESIS até ratificação explícita — nenhuma parte desta pesquisa deve ser tratada como
   decisão fechada sem essa ratificação.
