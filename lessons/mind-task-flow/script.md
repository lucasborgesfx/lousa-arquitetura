# Script — mind-task-flow

> Roteiro pedagogico extraido de `lesson-app/src/lesson-story4.json` (baseline aprovada) na R3 de reorganizacao estrutural.
> O arquivo original foi removido do `src/` na limpeza de 2026-07-06 (Fase 2 tornou-o redundante — o app le a aula via `lessons/mind-task-flow/lesson.json`); este `script.md` e a representacao curada e definitiva do mesmo conteudo, referenciada por ancora em `lesson.json`.

<a id="step-intro"></a>
## O que você vai ver

## O que você vai ver

Uma task nasce no Supabase. Ela passa pelo Harness, chega em um agente, é validada pelo Python e o resultado vai pro banco — com evidência verificável.

Este é o **fluxo canônico ponta a ponta** do Mind. Ao invés de descrever os blocos separados, você vai **percorrer o caminho** — aresta por aresta — no próprio diagrama.

Role pra baixo para começar.

<a id="step-wt-01"></a>
## Lucas dispara a task

## 1 — Lucas cria e dispara a task

Tudo começa aqui: Lucas decide que algo precisa ser feito. Ele (ou um agente) insere uma row em `agent_tasks` com `status = pending`, `to_agent = <quem vai executar>` e as instruções.

O Harness está ouvindo — polling contínuo nessa tabela. Assim que a task aparece no filtro `pending_filter`, o loop acorda.

<a id="step-wt-02"></a>
## Harness reivindica a task

## 2 — Harness Loop → Supabase Tasks

O loop do Harness `reclama` a task: `UPDATE agent_tasks SET status = 'claimed', claimed_by = '...', claimed_at = now()`. Depois marca `running`.

Este passo é crítico: sem ele, dois runners poderiam pegar a mesma task ao mesmo tempo. A transação atômica no Supabase garante exclusividade — só um runner vence a claim.

<a id="step-wt-03"></a>
## Harness Runner entra

## 3 — Harness Loop → Harness Runner

O loop não executa diretamente. Ele **despacha** a task para o Runner: uma camada separada que sabe como invocar agentes de diferentes tipos (Claude, Codex, scripts Python).

Por quê a separação? O Loop gerencia estado (o que executar, quando parar). O Runner gerencia execução (como invocar, coletar output, timeout). Um não precisa saber sobre o outro.

<a id="step-wt-04"></a>
## Runner invoca o agente

## 4 — Harness Runner → Agents

O Runner chama o agente correto para a task. Para `claude_linux`, isso é `claude --resume` com o contexto da task. Para `codex_linux`, é `codex exec`.

O agente recebe a task, faz o trabalho, e retorna um **contrato de saída** — campos obrigatórios: `summary`, `output`, `evidence`, `status`. Se algum campo faltar, o contrato é rejeitado antes de chegar no banco.

<a id="step-wt-05"></a>
## Output vai pro Python Enforce

## 5 — Harness Runner → Python Enforce

O output bruto do agente **não vai direto pro Supabase**. Primeiro passa pelo `python.enforce`: um validador determinístico.

Ele checa:
- Campos obrigatórios presentes?
- `from_agent` bate com quem deveria executar?
- `evidence.confidence` definido?
- `files_changed` é array, não null?

Se qualquer check falhar: `status = error`, mensagem de erro registrada, output rejeitado.

<a id="step-wt-06"></a>
## Output validado gravado

## 6 — Python Enforce → Supabase Outputs

Após validação: `INSERT INTO task_outputs (task_id, from_agent, status, summary, output, evidence, ...)`. Só então a task recebe `status = done`.

**O Supabase é a fonte de verdade final.** Um agente pode ter executado com sucesso internamente, mas enquanto não houver row em `task_outputs` com `status = done`, o trabalho não conta — para nenhum agente, nenhum humano, nenhum sistema.

<a id="step-wt-07"></a>
## Artifacts pesados ancorados

## 7 — Harness Runner → Supabase Artifacts

Arquivos grandes, binários ou outputs que não cabem confortavelmente numa row de `task_outputs` vão para `artifacts`.

O Runner ancora esses payloads separadamente e o `task_output.evidence` referencia o `artifact_id`. Quem precisar do arquivo busca por lá — o output continua pequeno e consultável via SQL.

<a id="step-wt-08"></a>
## Lucas desenvolve no Braide

## 8 — Lucas → Braide ACP

Em paralelo ao fluxo de tasks, há outro caminho: desenvolvimento de código e arquitetura.

Lucas abre uma sessão no Braide Cockpit. O agente ACP (Codex/GPT) edita arquivos dentro do worktree isolado. Código vai pro git. Decisões de arquitetura vão pro `.c4`.

> Regra fundamental do Braide: nunca misturar as duas coisas. Código no git. Arquitetura no `.c4`.

<a id="step-wt-09"></a>
## Braide promove decisão

## 9 — Braide ACP → Braide Bridge.c4

Quando uma decisão de arquitetura emerge da sessão (um novo componente, uma relação nova entre sistemas), o ACP a transcreve pro arquivo `.c4` dentro do projeto.

O `bridge.c4` é a ponte entre o rascunho da sessão e o blueprint canônico. Ele é revisado e, quando aprovado, promovido.

<a id="step-wt-10"></a>
## Blueprint canônico atualizado

## 10 — Braide Bridge.c4 → LikeC4 Source

O arquivo `.c4` promovido entra no repositório canônico do LikeC4 — o mesmo que gera este diagrama que você está vendo agora.

Ao fazer commit, o pipeline de CI começa: o LikeC4 recompila as views, gera os type defs e aciona o worker de publicação.

<a id="step-wt-11"></a>
## Snapshot publicado

## 11 — Python Pipeline → Mind Blueprint Publish

O `python.pipeline` executa a cadeia: `likec4 build → snapshot JSON → Supabase`.

Este é o worker determinístico que garante que a atualização de arquitetura chegue no banco sem intervenção manual. O snapshot publicado é versionado — é possível comparar qualquer versão anterior do blueprint com a atual.

<a id="step-wt-12"></a>
## Snapshot disponível

## 12 — Mind Blueprint Publish → Supabase Snapshots

O snapshot chega em `supabase.snapshots`. Qualquer agente — Claude, Codex, um script Python — pode agora consultar o estado atual da arquitetura sem depender de arquivos locais.

Isso fecha o ciclo: **o que foi construído no Braide, validado pelo Python, agora está disponível para todos os agentes como conhecimento estruturado.**

<a id="step-consolidate"></a>
## Ciclo completo

## O ciclo completo

Você percorreu o fluxo canônico do Mind — cada seta que viu tem uma regra e um protocolo.

**O que garantem essas regras?**

- **Rastreabilidade:** qualquer task tem evidência verificável no Supabase
- **Exclusividade:** o mecanismo de claim evita duplicação
- **Determinismo:** o Python enforce garante que só outputs válidos chegam no banco
- **Continuidade:** qualquer agente pode retomar de onde outro parou — sem dependência de memória de conversa

Este sistema foi desenhado para não depender de nenhum agente específico. Você pode trocar o Claude por outro — enquanto respeitar o contrato, o ecossistema continua funcionando.
