# Baseline Freeze — Inventário de Comportamento, Dependências e Riscos (pré-LangGraph)

Data: 2026-07-15
Autorização: Lucas via `gpt_web` (`agent_messages.id=67067be6-913d-4ec1-89ff-fa150542c227`)
Ponto de retorno seguro: tag `baseline-pre-langgraph-migration-2026-07-14` (commit `04b3b10`)
Branch desta task: `migracao-langgraph-2026-07-14`
Produzido por: `claude_linux` (orquestrador) + 3 subagentes, cada um cobrindo um recorte não sobreposto do código, para evitar concentrar leitura pesada num único LLM.

Escopo: `fabrica/agents/{content_author,flowchart_adapter,presentation_director,lesson_critic,condemn}.py` + `fabrica/orchestrator.py`. Objetivo: documentar o comportamento REAL do código (não o que a documentação diz que deveria ser) antes de qualquer linha de LangGraph ser escrita, para que a migração não perca comportamento que ninguém lembra que existe.

Convenção de tags: **VERIFIED** (lido direto no código, com arquivo:linha) vs **HYPOTHESIS** (inferência razoável, sem confirmação direta).

---

## Sumário executivo — os 6 riscos mais críticos pra migração

1. **`send_back_to` é uma enum de 3 valores duplicada em pelo menos 3 lugares** (schema `lesson_critic_output.json`, `condemn.py:21` `ROUTE_PRIORITY`, e implicitamente nos outros agentes) sem import compartilhado — risco de drift silencioso.
2. **`CRITICAL_PRINCIPLES` (7 princípios) está duplicada, com os mesmos valores literais, em `lesson_critic.py:59` e `condemn.py:19`** — editar um lado sem o outro quebra o gate de aprovação silenciosamente.
3. **`MIN_SCORE=42` é um número mágico acoplado a "30 princípios × 2 pontos"** — se o número de princípios mudar, nada recalcula os 42/60 automaticamente.
4. **A cascata de rework "reprocessar uma fase força reprocessamento de tudo rio abaixo"** está codificada como `if target in {...}` ad hoc no `orchestrator.py` (linhas 589/642/671) — um grafo LangGraph ingênuo com aresta condicional simples de volta perde esse efeito colateral se não for desenhado conscientemente.
5. **O lock (`flock`) só protege o `JobStore`/fila — a execução `run` direta roda sem nenhuma proteção de concorrência.**
6. **`NeedRescope` dispara por match textual frágil de 2 substrings em português** (`_is_concept_budget_error`, `orchestrator.py:353-355`) na mensagem de exceção de `content_author.py` — qualquer mudança de wording durante a própria migração desativa o rescoping sem erro visível.

---

## 1. `fabrica/agents/content_author.py`

### Contrato real
`generate_roteiro(chapter_markdown, tema, objetivo, nivel="intermediário", *, feedback=None, before_request=None, usage_hook=None, verbose=False) -> dict` (VERIFIED :122-132). Retorna dict validado contra `roteiro_pedagogico.json`; `meta.total_concepts` é **recalculado em Python**, nunca aceito do LLM (:212-214, 220). Falha: `RuntimeError` após `MAX_RETRIES=3` (:228-232), só guardando os erros da última tentativa.

### Dependências ocultas
- Lê `PROMPTS_DIR/content_author_system.md` e `SCHEMAS_DIR/roteiro_pedagogico.json` do disco a cada chamada (:24-29, 39-44) — `FileNotFoundError` cru se ausentes.
- `OLLAMA_*` lidos como globais de módulo **no import**, não por chamada (:32-34).
- Só erros de parsing de JSON (`ValueError`/`JSONDecodeError`) são retryable (:205-209) — erro de rede/API do client aborta sem retry e sem o wrapper `RuntimeError`.

### Riscos de migração
- Idempotência não garantida (`temperature=0.2` + feedback acumulado entre tentativas).
- Dedupe de conceitos é só normalização de string — sinônimos contam como conceitos diferentes; mudar essa lógica muda silenciosamente o comportamento do limite `MAX_CONCEPTS_PER_LESSON=6`.
- **Achado de schema**: `roteiro_pedagogico.json` descreve `"beats"` como "12 mín, 20 máx" no texto, mas o `minItems` real é **3** — se a migração copiar a descrição em vez do valor enforced, o comportamento de validação muda (VERIFIED, discrepância confirmada no JSON).

---

## 2. `fabrica/agents/flowchart_adapter.py`

### Contrato real
`parse_compiled_model(mjs_path) -> dict` (scanner de chaves sobre o `.mjs` compilado do LikeC4, não parser JS real — comentário explícito :72-76). `generate_mapeamento(roteiro, view_id, c4_module_path, ...) -> dict`, validado contra `roteiro_mapeado.json` + regra hard C2 de ordem de arestas + validação de FQNs. `ValueError` imediato se `view_id` não existir no `.mjs`, ANTES de qualquer chamada LLM (:345-349).

### Dependências ocultas — a mais frágil dos 6 arquivos
- Acoplamento por regex ao formato de saída do compilador LikeC4 (indentação de tab literal, ordem exata de campos em cada aresta) — qualquer mudança de versão do compilador quebra silenciosamente (degrada para `nodes=[]` em vez de erro, ou só falha depois de 0 matches).
- Não há checagem de hash/mtime entre o `.c4` fonte e o `.mjs` compilado — pode rodar contra artefato obsoleto sem aviso (GAP).

### Riscos de migração
- **Regra hard C2** (sequência de walkthrough segue ordem real de arestas) é 100% determinística em Python (`_validate_walkthrough_rule`, :209-277) — maior risco de regressão se não for portada 1:1, em vez de "confiar" no LLM/framework novo.
- **Padrão "recompute, don't trust"**: depois do LLM responder, o código força de volta os campos originais do roteiro (label/idea/content/concepts) e recalcula `walkthroughStart/End` a partir de `edgeIndex` real, ignorando o que o LLM autorrelatou — esse padrão precisa sobreviver à migração.
- Mesma lacuna dos outros: erros de rede/API não são retryable.

---

## 3. `fabrica/agents/presentation_director.py`

### Contrato real
`generate_lesson(mapeado, *, version="1.0", diagram_source=None, diagram_module=None, ...) -> dict`. Só 2 campos são de fato gerados pelo LLM: `description` (≤160 chars) e `director_notes` (advisory, não bloqueia nada) — todo o resto do `lesson.json` é montado deterministicamente em Python a partir do `mapeado` (VERIFIED :276-294).

### Achado mais concreto de contrato quebrado
`_build_steps`/`_build_camera` rodam **fora** do loop de retry. Se `mapping.type` de um beat tiver valor fora do enum conhecido, `_build_camera` lança `ValueError` **cru, não capturado em lugar nenhum** — quebra o contrato uniforme "RuntimeError após N tentativas" que os outros 2 agentes oferecem. Um orquestrador que despache por tipo de exceção não pegaria essa falha hoje.

### Riscos de migração
- Tratamento assimétrico: `description` malformado é retryable, `director_notes` malformado é silenciosamente descartado (vira `[]`) sem retry.
- Depende de invariante do frontend (`DiagramController.jsx`, "exatamente 1 walkthrough-start") só por comentário/string de erro — sem contrato de tipos compartilhado; pode divergir silenciosamente se o frontend mudar.

---

## 4. `fabrica/agents/lesson_critic.py`

### Contrato real
`critique_lesson(lesson, *, content_types=None, ...) -> dict`. Sem validação de schema no `lesson` de entrada — só leitura via `.get()` com defaults. Saída: `score_total` (0-60, soma determinística em Python), `violations[]`, `principles[]` (30 entradas, auditoria), `content_type_review` (opcional, puramente informativo). `RuntimeError` após `MAX_RETRIES=3` — mas isso é falha ESTRUTURAL (JSON inválido), não "aula reprovada" (reprovação é decidida depois, em `condemn.py`).

### Dependências ocultas e validações extras não expressas no JSON Schema
- `principles`: lista **fechada** de exatamente 30 (`minItems=30, maxItems=30`, regex `P1`..`P30`) — VERIFIED no schema.
- `_validate_raw` (:148-187) exige: todos os 30 princípios aparecem 1x; `PARTIAL`/`FAIL` exigem `field`+`issue`; `FAIL` exige `instruction`+`send_back_to` preenchidos — **essa regra é o que garante que `condemn.py` sempre tenha `send_back_to` em todo FAIL**, dependência crítica cross-arquivo.
- `_fill_subjective_pass_justifications` (:133-143): se o LLM retorna PASS num princípio subjetivo sem justificativa concreta suficiente, o harness **substitui silenciosamente** por um template — fallback fácil de perder numa reimplementação, mascarando respostas fracas do LLM hoje.
- `content_type_review` é estritamente informativo — nunca deve entrar em `score_total`/gate (comentário explícito no código e no schema).

---

## 5. `fabrica/agents/condemn.py`

100% determinístico, sem LLM.

### Gate de aprovação (`condemn`, :24-39) — ordem exata
1. Primeira violation com `principle` em `CRITICAL_PRINCIPLES` **e** `status == "FAIL"` → reprova IMEDIATAMENTE, independe de score. (PARTIAL em princípio crítico não cai neste gate.)
2. Senão, `score_total < MIN_SCORE (42)` → reprova por score.
3. Senão, aprova.

### Tabela EXATA de roteamento (`choose_send_back_to`, :42-63)
Duas rodadas de filtro — primeiro só `FAIL`, depois `FAIL ∪ PARTIAL` — e dentro de cada rodada, prioridade fixa `content_author → flowchart_adapter → presentation_director` (mais upstream sempre vence). Resumo de precedência (mais alta → mais baixa):
1. FAIL → content_author
2. FAIL → flowchart_adapter
3. FAIL → presentation_director
4. (nenhum FAIL roteável) FAIL-ou-PARTIAL → content_author
5. FAIL-ou-PARTIAL → flowchart_adapter
6. FAIL-ou-PARTIAL → presentation_director
7. `None` (nada roteável)

### Riscos de migração
- `CRITICAL_PRINCIPLES` e o número mágico `MIN_SCORE=42` (=70% de 30×2) dependem de sincronia manual com `lesson_critic.py` — nenhum dos dois deriva do outro.
- A ORDEM de `report["violations"]` importa para qual mensagem de motivo é retornada no gate crítico (primeira violation crítica-FAIL encontrada) — se algum consumidor faz parsing de texto de `reason`, mudar a ordem quebra isso mesmo sem mudar o resultado booleano.
- CLI standalone de `condemn.py` usa só `condemn()`, não `condemn_with_routing()` — não expõe `send_back_to`.

---

## 6. `fabrica/orchestrator.py` (1105 linhas — peça central)

### Checkpoint / resume
- `_stable_job_id` = sha1(`source_file.resolve() | tema | objetivo`)[:12] (:82-91) — **não cobre** `concept_budget`, `nivel`, `view_id`, `max_reworks` etc. Mudar esses campos sem mudar os 3 componentes do hash reaproveita silenciosamente o mesmo `run_dir`/cache antigo.
- **`plan_scopes` (Planejador) NUNCA é cacheado** — roda do zero em toda invocação de `run_job` (:838-845); só o veredito terminal de cada FATIA é cacheado via `slice_run_dir/result.json` (chave `"slice_id"` presente + `status in {done,failed}`, :552-560) — **sem validar que o conteúdo do plano atual bate com o que gerou aquele resultado antigo**.
- Resume dentro de uma fatia: `state.json` grava `{target, rework_count, feedback_text}` antes de cada fase (:400-408); ao retomar, recarrega esse estado e os artefatos já persistidos — **nada é comparado contra o input atual**, o resume só confia cegamente no checkpoint existente.
- Caso especial: quando o job tem 1 fatia só, `slice_run_dir == job.run_dir` — o `result.json` da fatia e do job compartilham o mesmo path, distinguidos só pela presença da chave `"slice_id"` (convenção implícita e frágil).

### Lock (`flock`)
- Bloqueante (`LOCK_EX` sem `LOCK_NB`, sem timeout), usado **somente** dentro de `JobStore` (enqueue/reserve_next/finish) sobre um arquivo `.lock` irmão — nunca sobre o processamento em si.
- **`command_run` (execução direta via `run --job-file`) nunca passa pelo `JobStore`/lock** — dois processos rodando o mesmo job-file diretamente colidem sem nenhuma proteção (last-writer-wins por arquivo, sequência de fases potencialmente inconsistente).
- Sem timeout/expiração: se um worker crasha depois de marcar `running` na fila mas antes de `finish`, o registro fica travado pra sempre (sem recuperação automática).

### Escrita atômica
`_write_json`: escreve em `.{nome}.tmp-{pid}` no mesmo diretório, depois `os.replace` (rename atômico POSIX) — garante que um crash não trunca o arquivo final. Atomicidade é **por arquivo**, não hácross-arquivo — `state.json` e o artefato de fase correspondente são 2 escritas separadas; um crash entre elas é coberto pelo desenho de resume (artefato ausente → fase re-executada), mas não há transação real entre os dois.

### Isolamento de falha — unidade real é a FATIA, com 1 exceção
- Falha de fase (RuntimeError esgotado), reprovação do Crítico/Condenador, e `NeedRescope` esgotado → todos viram dead-letter **da fatia** (`status: failed`), sem propagar exceção; `run_job` segue para as próximas fatias `pending`.
- **`LlmBudgetExceeded` é a exceção**: é repassada (`raise`) por dentro de `_run_slice`, sobe até `run_job` e **aborta todo o loop de fatias pendentes** — única falha isolada em nível de JOB, não de fatia (mas preserva no resultado as fatias já `done`).
- **Exceção não mapeada** (bug genérico): cai no catch-all de `run_job_safely`, grava `error.txt` com traceback — mas o `result.json` desse caminho **não tem a chave `"slices"`** (ao contrário do caminho de `LlmBudgetExceeded`, que tem) — perda real de granularidade no resultado agregado do job (os `result.json` de cada fatia continuam intactos em disco, só não aparecem agregados).

### `NeedRescope`
Disparado só quando o Autor esgota retries com uma mensagem de erro que bate `_is_concept_budget_error` — match de 2 substrings literais em português (`"Aula introduz"` + `"conceitos únicos"`, :353-355) na exceção de `content_author.py`. Limite de profundidade 2 (`rescope_depth >= 2` → desiste). Ao disparar, reinvoca `plan_scopes` só sobre o markdown daquela fatia, forçando granularidade fina, e insere as fatias-filhas no início da fila. **Diretórios da fatia-pai ficam órfãos** (nunca marcados como encerrados nem limpos) — invisível hoje só porque nada relê esses diretórios.

### Ordem de execução — máquina de estados por pertencimento de conjunto, não igualdade
```
target == "content_author"                                    → roda Autor
target in {content_author, flowchart_adapter}                 → roda Adaptador
target in {content_author, flowchart_adapter, presentation_director} → roda Diretor
(sempre, sem guarda de target)                                 → roda Crítico + Condenador
```
Efeito real: reprocessar uma fase força reprocessamento de **tudo que vem depois dela** (cascata pra frente), nunca das fases anteriores — não é "retry só do nó que falhou". `feedback_text` só é passado explicitamente pra fase que é o `target` exato da passada; fases que rodam "de carona" pela cascata recebem `feedback=None`.

Desvios adicionais: modo `--until content_author` sai do pipeline logo após o Autor, pulando tudo depois; `NeedRescope` é um retorno ao Planejador, não a nenhuma fase de `_run_slice`; `rework_count` é um único contador compartilhado entre esgotamento de fase E rejeição do Condenador (não são orçamentos independentes).

### O que é arriscado mudar sem rede de segurança (resumo pra decisão de arquitetura do grafo)
1. Granularidade do nó LangGraph importa: se as 4 fases virarem 1 nó só, resume depois de interrupção repete as 4 chamadas de LLM inteiras — precisa ser 1 nó por fase (Autor / Adaptador / Diretor / Crítico+Condenador).
2. `plan_scopes` sem cache hoje só funciona porque o resto do pipeline confia em determinismo do planejador (não verificado neste inventário — é escopo de `scope_planner.py`, GAP explícito pra próxima investigação).
3. `job_id`/chave de checkpoint precisa cobrir todos os parâmetros relevantes do job, não só 3 campos — do contrário a mesma armadilha de cache stale se reproduz num checkpointer novo.
4. A cascata "rework regenera tudo rio abaixo" precisa virar desenho consciente de arestas no grafo, não assumida por cópia mecânica do fluxo atual.
5. `rework_count` compartilhado entre fases e Condenador precisa de decisão explícita de modelagem no estado do grafo (senão o teto real de retrabalho muda de comportamento).
6. `LlmBudget` reseta a cada `run_job()` hoje (nunca persistido) — decisão explícita necessária: orçamento acumula entre resumes ou reseta?
7. Acoplamento textual frágil do `NeedRescope` — altíssimo risco de regressão silenciosa se o texto de erro do Autor for tocado durante a própria migração.
8. Lock (`flock`) e escrita atômica (`os.replace`) são garantias que precisam de equivalente consciente no backend de persistência do LangGraph (Postgres/SQLite/etc.) — não assumir que "vem de graça".

---

## Achados cross-arquivo consolidados

- **Enum `send_back_to`** (`content_author`, `flowchart_adapter`, `presentation_director`) hardcoded em pelo menos 3 lugares sem import compartilhado: schema `lesson_critic_output.json`, `condemn.py:21`, e presumivelmente nos outros agentes.
- **`MAX_RETRIES=3`** duplicado literalmente em 3 arquivos (`content_author.py:36`, `flowchart_adapter.py:42`, `presentation_director.py:51`) — não é constante compartilhada.
- **Nenhum dos 5 agentes trata erro de rede/API do client LLM dentro do loop de retry** — só erros de parsing de JSON são retryable nos 5. Esse é o gap de resiliência mais consistente do sistema e o primeiro candidato a teste de regressão antes de migrar (LangGraph terá seu próprio modelo de retry).
- **`OLLAMA_BASE_URL`/`OLLAMA_MODEL`/`OLLAMA_API_KEY`** lidos como globais de módulo no import (não por chamada) nos 3 agentes de conteúdo — mudar env var em runtime não tem efeito no processo já rodando.
- **`extract_usage`/`wrap_document`** (`llm_utils.py`) compartilhados por todos os agentes — `extract_usage` é fail-safe silencioso (nunca lança, sempre retorna zeros em falha), mascarando falhas de origem de dados de uso se usado pra billing/telemetria.
- **Temperature/max_tokens divergem entre agentes** sem constante compartilhada (content_author=0.2/4096, flowchart_adapter=0.1/4096, presentation_director=0.2/1024, lesson_critic=0.0) — precisam ser portados explicitamente, nenhum teste cobre esses valores hoje.

## Gaps explícitos para investigação futura (fora do escopo desta task)
- Determinismo real de `scope_planner.plan_scopes` (`slice_id` estável entre chamadas repetidas) — pré-condição silenciosa para o cache de fatia funcionar corretamente hoje.
- Mensagem de erro exata de `content_author.py` que aciona `_is_concept_budget_error` — cruzar meta com o subagente/arquivo fonte pra confirmar que bate exatamente com o match textual do orchestrator.
- Consumidor frontend (`DiagramController.jsx`) das invariantes de câmera/walkthrough — validado só por comentário/string de erro no `presentation_director.py`, sem contrato de tipos compartilhado.
