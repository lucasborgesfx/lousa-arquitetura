# Plano de Execução — Migração Incremental pra LangGraph

Data: 2026-07-15
Depende de: `baseline-freeze-inventario-v1.md` (mesma pasta) — leia antes deste documento.
Autorização: Lucas via `gpt_web` (`agent_messages.id=67067be6-913d-4ec1-89ff-fa150542c227`)
Branch: `migracao-langgraph-2026-07-14`

## 1. Primeiro corte incremental — confirmado, com evidência nova

**Decisão: a concorrência de aulas dentro de um módulo continua sendo o primeiro corte correto.**

Já era a recomendação da avaliação adversarial original (`knowledge_items.key=project.lousa-redesign-hierarquico-v2.decisao.langgraph-avaliacao-adversarial.v1`): é a única peça do design sem código de produção. O inventário de baseline agora confirma isso com evidência de código, não só de docs — `run_job` (`orchestrator.py`) processa `pending_slices` de forma estritamente sequencial:
```python
while pending_slices:
    slice_plan = pending_slices.pop(0)
    ...
```
Não há paralelismo real de fatias/aulas dentro de um job hoje — é FIFO simples, uma de cada vez. Isso confirma: introduzir LangGraph aqui não implica reescrever nada maduro, porque não existe "maduro" nesse ponto específico — existe só um loop sequencial simples esperando ser substituído.

**Escopo exato do corte:** o loop `while pending_slices` em `run_job` (parte central do congestionamento serial), reimplementado como subgrafo LangGraph isolado usando `Send` + `max_concurrency` (conforme já detalhado na avaliação adversarial original, seção "Spike proposto"). Tudo antes disso (Planejador/`plan_scopes`) e tudo dentro de `_run_slice` (as 4 fases + Crítico/Condenador) **não muda nesta primeira fatia** — continuam sendo chamadas Python diretas, só a orquestração de QUAIS fatias rodam em paralelo e QUANDO migra.

**Por que não expandir o escopo agora:** o inventário de baseline mostrou que `_run_slice` sozinho já tem comportamento denso e frágil (cascata de rework por `target in {...}`, `NeedRescope` com acoplamento textual, `rework_count` compartilhado) — tentar portar isso junto com a concorrência no mesmo corte violaria a própria diretriz de Lucas de migração incremental. Fica para um segundo corte, só depois que o primeiro provar valor.

## 2. Fronteira entre camada de IA e resto da arquitetura

| Camada | Conteúdo | Fica onde |
|---|---|---|
| **Camada de IA (candidata a LangGraph, incremental)** | Orquestração do fluxo por fatia/aula: sequenciamento Autor→Adaptador→Diretor→Crítico+Condenador, roteamento de rework (`send_back_to`), concorrência de fatias dentro do módulo, checkpoint/resume por fatia | Migra em cortes sucessivos, começando pelo corte da seção 1 |
| **Contratos de dados** | Schemas JSON (`roteiro_pedagogico`, `roteiro_mapeado`, `lesson_output`, `lesson_critic_output`), regras de validação (`jsonschema`) | Não muda — são o contrato estável entre a camada de IA e tudo mais, independente de qual motor de orquestração está por trás |
| **Persistência de arquivo** | Layout `run_dir`/`publish_dir`, `_write_json` atômico, `state.json`/`result.json` por fatia | Não muda nesta fase — só muda se/quando um checkpointer do LangGraph substituir isso, decisão futura e explícita, não acidental |
| **Fila/lock** | `JobStore`, `queue.json`, `flock` | Não muda nesta fase — é infraestrutura de claim de job entre processos, ortogonal à orquestração interna de um job já claimed |
| **Bridge Supabase (/op)** | `agent_tasks`, `task_outputs`, `agent_messages`, Project Home | Não muda — é coordenação entre agentes humanos/IA, camada acima de tudo isso |
| **Frontend** | App React/Vite que consome `lesson.json` | Não muda — contrato de saída (`lesson_output.json`) é o que importa pra ele, não como foi gerado |
| **LikeC4/blueprint** | `.c4` canônico, governança de repo | Não muda — já resolvido em task anterior (GAP de rollout fechado) |

Regra prática: o resto do sistema "orbita" a camada de IA através dos contratos JSON já existentes — ninguém além da camada de IA precisa saber que o motor de orquestração mudou, desde que o `lesson.json`/`critic_report.json`/etc. continuem tendo o mesmo shape.

## 3. Estratégia de branch

A branch `migracao-langgraph-2026-07-14` (já criada, a partir da tag `baseline-pre-langgraph-migration-2026-07-14`) é suficiente para o primeiro corte — é pequeno, isolado, aditivo (novo módulo, não reescreve `orchestrator.py`/`condemn.py` maduros). Não é necessário criar sub-branch para este corte específico.

**Regra pra próximos cortes:** cada corte incremental subsequente deve avaliar, no início da sua própria task de planejamento, se cabe na mesma branch ou merece sub-branch própria — critério: se o corte é aditivo/isolado (novo arquivo, não toca código maduro), mesma branch; se o corte precisa tocar `orchestrator.py`/`condemn.py` diretamente (cortes futuros, ainda não autorizados), sub-branch com seu próprio PR, mergeada só depois de validação lado a lado contra o baseline.

**Risco operacional já observado neste projeto** (achado real, não hipotético): duas tasks rodando em paralelo no mesmo working directory já colidiram num commit só (task `7d914170` + `bc49d962`, 2026-07-13) — se mais de uma task desta migração rodar ao mesmo tempo tocando arquivos no mesmo repo local, usar `git add` com paths exatos e confirmar `git status` antes de commitar, não commitar "tudo que estiver no diretório".

## 4. Ordem concreta de próximos passos

1. Task `be2a2f9e-7433-4cac-9711-7b3af007a20e` (estratégia de testes) — se ainda não tiver terminado, é pré-requisito prático antes de escrever qualquer código do primeiro corte: precisamos do teste de contrato pra comparar o `pending_slices` sequencial atual com a versão paralela em LangGraph.
2. Implementar o spike do primeiro corte (subgrafo `Send`+`max_concurrency` isolado, comparado lado a lado com a versão `asyncio`/semáforo custom, conforme já especificado na avaliação adversarial original seção "Spike proposto") — só depois que os testes de contrato existirem.
3. Medir as métricas já definidas na avaliação adversarial (first-pass yield, taxa de retrabalho, recuperação sem intervenção, custo por curso, latência) comparando as duas implementações do spike.
4. Critério de go/no-go pra esse corte específico: só integrar a versão LangGraph se reduzir código/complexidade E não introduzir dependência de checkpoint externo (Postgres/Redis) — critério já registrado na avaliação adversarial, reafirmado aqui.
5. Só depois do primeiro corte validado em produção, abrir uma nova task de planejamento pro segundo corte (candidato natural: extrair a máquina de estados de rework de `_run_slice`, dado que o inventário de baseline já mapeou exatamente onde ela vive).

## 5. O que não decidi sozinho (fica pra Lucas via gpt_web, se necessário)

- Quanto tempo/esforço vale investir no spike antes de decidir go/no-go — isso é preferência de negócio, não decidi um prazo.
- Se o segundo corte (rework/`_run_slice`) deve esperar validação completa do primeiro em produção real, ou pode começar em paralelo assim que o spike (não produção) do primeiro estiver pronto — trade-off de velocidade vs. risco que depende de quanto Lucas quer acelerar.

Nenhuma dessas duas precisa de resposta pra continuar o trabalho já autorizado (passos 1-4 da seção 4) — só afetam quando abrir a task do segundo corte.
