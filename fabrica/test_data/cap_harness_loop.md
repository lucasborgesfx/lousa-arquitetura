# Capítulo 3 — O Harness Loop: como o Mind executa tasks

## 3.1 O problema que o Harness resolve

Sem um executor central, cada agente precisaria saber quando acordar, que task pegar, como evitar conflito com outros agentes e onde gravar o resultado. Isso é lógica de infraestrutura que nada tem a ver com o trabalho intelectual do agente.

O Harness isola esse problema. Os agentes executam; o Harness coordena.

## 3.2 Estrutura do Harness

O Harness tem três componentes:

**Loop (orchestrator.py):** polling contínuo na tabela `agent_tasks`. Filtra por `to_agent = <nome>` e `status = pending`. Quando encontra uma task, executa o protocolo de claim.

**Protocolo de claim:** UPDATE atômico que muda `status` de `pending` para `claimed` com `claimed_by` e `claimed_at`. Garante exclusividade — só um runner vence. Depois marca `running` com `started_at`.

**Runner:** invoca o agente correto (claude --resume para Claude, codex exec para Codex, scripts Python para workers). Recebe o output e passa para validação.

## 3.3 Ciclo de vida de uma task

```
pending → claimed → running → done | error
```

Cada transição é um UPDATE no Supabase. A task nunca "some" — sempre tem um estado verificável.

Regra fundamental: **uma task só conta como feita quando há row em `task_outputs` com `status = done`**. O runner pode ter terminado internamente, mas sem a row, para o ecossistema não aconteceu nada.

## 3.4 Por que o Supabase como data plane

O Supabase funciona como o "sistema nervoso" do Mind: qualquer agente, em qualquer máquina, pode consultar o estado exato de qualquer task. Não há dependência de memória de conversa ou de arquivos locais.

Isso torna o sistema **reiniciável**: se o Harness travar, basta reiniciar — ele recolhe as tasks `running` sem `completed_at` e retoma de onde parou.

## 3.5 Relação com os outros componentes

O Harness não decide o que executar — ele executa o que está no Supabase. O Python Enforce valida o output antes de gravar. O Braide opera em paralelo para decisões de arquitetura.

O Harness é subordinado ao data plane: **o Supabase decide o que existe; o Harness executa**.
