# Governança `.c4` — Lousa (v1)

**Status:** decisão operacional em vigor · consolidada na task `/op` C4-G4 (2026-07-03),
depois da limpeza C4-G2 (backport, commit `0d0692c`) e C4-G3 (workspace 4310).

Regra curta: **repo lidera, host projeta, spikes têm nome inequívoco e vida curta.**

## Onde fica o canônico

### Atualização 2026-07-13 — Pipeline V2 hierárquica

- Fonte canônica da arquitetura V2: arquivos `.c4` na raiz do repo
  (`_spec.c4`, `model.c4`, `views/*.c4`) mais `likec4.config.json`.
- A cópia em `workspace/spikes/001-likec4-mind-bootstrap/projects/lousa-v2-arquitetura-spike/`
  existe só para o host visual local `http://localhost:4310/`; ela não é fonte de verdade.
- O material antigo em `docs/architecture/` continua como referência da arquitetura anterior
  da Lousa, mas não é o canônico da pipeline V2.

### Histórico 2026-07-03 — arquitetura anterior

- Fonte canônica única: `docs/architecture/{model.c4, model.views.c4, _spec.c4}`, neste repo.
- Uma mudança só conta como propagada quando existir `commit` + `git push` — ver
  `bridge.project.blueprint.c4-github-stream.v1`.
- O host visual local (`http://localhost:4310/`, projeto `lousa-arquitetura`) é **projeção
  humana**, nunca a fonte. Se o host tiver conteúdo que o repo não tem, é sinal de
  **backport pendente** — não motivo para tratar o host como se estivesse certo e o repo
  errado (foi exatamente o que C4-G1 encontrou e C4-G2 corrigiu).

## Como nomear um spike novo

- Prefixo `lousa-spike-<assunto>-<data>` no slug **e** no `title` do `likec4.config.json`
  do projeto no host.
- O título deve dizer **o que o spike realmente modela** — ex.: "roadmap de execução do
  lote", não deixar implícito que é arquitetura de produto só porque tem "Lousa" no nome.
- Nunca reusar o slug `lousa-arquitetura` para um spike — esse nome é reservado para a
  projeção do canônico.

## Quando promover um spike (backport pro repo)

- Promover quando: Lucas validou o conteúdo **e** ele descreve arquitetura/produto (não
  plano de execução, não reunião, não roadmap de tarefas).
- Promover = trazer o trecho para `docs/architecture/*.c4`, `commit`, `push`. Só depois
  disso conta como canônico — o host sozinho nunca conta.

## Quando arquivar um spike

- Arquivar quando um spike mais novo contém, comprovadamente por conteúdo (não só por
  data), a totalidade do que o mais antigo tinha — aí o antigo é rascunho superado, não
  concorrente.
- **Nunca apagar de fato.** Mover preserva o conteúdo; o histórico de commits do Git já
  preserva o resto.
- **Pegadinha operacional:** `likec4 start .` varre `likec4.config.json`
  **recursivamente em todo o workspace** — arquivar movendo para uma subpasta *dentro*
  do workspace não tira o projeto do `ProjectsOverview`. É preciso mover para **fora**
  da árvore esconeada pelo host (ex.: `archive-lousa-<contexto>-<data>/`, irmã do
  workspace, não filha). Depois de mover, reiniciar o processo `likec4 start .` — ele não
  faz live-reload de estrutura de projetos, só de conteúdo `.c4` já aberto.

## Regra geral (reutilizável além da Lousa)

Para qualquer projeto na trilha de blueprint do Lucas: o repo lidera, o host visual só
projeta, e todo spike tem nome inequívoco e vida curta — ou é promovido, ou é arquivado.
Spikes não se acumulam indefinidamente disputando espaço com o canônico.

## Referência de leitura humana atual (2026-07-03)

- **Canônico:** `docs/architecture/` neste repo — GitHub `lucasborgesfx/lousa-arquitetura`,
  branch `reorg/estrutura-mvp-2026-07-03`.
- **Host visual (arquitetura do produto):** http://localhost:4310/lousa-arquitetura
- **Host visual (roadmap de execução do lote, ainda vivo):**
  http://localhost:4310/lousa-spike-entrega-0307
- **Arquivo/legado** (não precisa abrir no dia a dia):
  `/home/lusga/workspace/spikes/archive-lousa-c4-g3-2026-07-03/`
