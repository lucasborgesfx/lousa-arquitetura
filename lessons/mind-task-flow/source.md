# Source — mind-task-flow

**Status: placeholder explícito (GAP de autoria).**

Este arquivo ainda não existe como insumo humano consolidado. A aula `mind-task-flow`
foi originalmente escrita direto como `steps[].content` dentro de
`lesson-app/src/lesson-story4.json`, sem um `source.md` prévio — não há material-base
separado para curar retroativamente sem risco de inventar contexto que não existiu.

## O que existe hoje

- A narrativa pedagógica final está em [`script.md`](./script.md), extraída 1:1 do
  `content` de cada step do JSON aprovado.
- Não existe uma versão "bruta" anterior a essa narrativa.

## O que falta para fechar este GAP

- Se um dia houver necessidade de regenerar ou expandir esta aula pela fábrica, um
  `source.md` real precisa ser escrito por Lucas ou curado a partir de material externo
  (ex.: docs do Mind, transcrições, notas) — não a partir do próprio `script.md`, para
  não criar um ciclo de auto-referência sem material-base genuíno.
- Até lá, tratar esta aula como **script-first**: a fábrica não deve tentar regenerar
  `script.md` a partir deste placeholder.

Ver também: `docs/current-lesson-migration-mvp-v1.md`, seção "Destino canônico dos
artefatos atuais", linha `ausência de source.md`.
