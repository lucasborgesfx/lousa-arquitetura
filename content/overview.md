# Panorama do Mind — fase de arquitetura

## Para que serve este sistema?

O **Mind** é o ponto central de continuidade do ecossistema multiagente do Lucas.
Ele não é um chatbot — é a **superfície onde o trabalho fica vivo**:
tarefas, evidências, decisões e arquitetura, tudo num lugar rastreável.

## Os quatro blocos principais

### 1. Braide Cockpit
O ambiente onde Lucas e o agente ACP **escrevem código e arquitetura** juntos.
Cada decisão de arquitetura vira um `.c4` que entra no blueprint canônico.

### 2. Harness Local /op
O *execution loop* orientado a tasks do Supabase.
O orquestrador (`orchestrator.py`) pega tasks, chama agentes, valida outputs.

### 3. Supabase / Estado do /op
O **data plane canônico**: tasks, outputs, conhecimento, artifacts e events.
É a fonte de verdade — nada é real enquanto não está aqui.

### 4. Python / Hermes — Enforcement & Pipeline
Enforcement determinístico de protocolo + worker de publicação de snapshot.
Garante que outputs respeitem contratos antes de side-effects.

## Como a arquitetura flui

```
Lucas → Braide → .c4 → LikeC4 Blueprint
Lucas → Harness → task → agentes → Python enforce → Supabase
Supabase → snapshot → GPT/Claude Web
```

## O que ainda falta definir

- **Motor de Estado do Fluxo** — como gerenciar estágios e transições
- **Roteamento & Dispatch** — quem decide qual agente pega qual task
- **Camada de Contexto** — como entregar "onde paramos" de forma utilizável

> Clique num componente do diagrama à direita para descer um nível ↓
