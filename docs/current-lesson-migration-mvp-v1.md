# Plano de Migração da Aula Atual — MVP v1

**Status:** decisão arquitetural pronta para orientar o refactor físico  
**Origem:** task `/op` `ceb3cab3-8b33-441d-9e08-d818db72fc57`  
**Dependências explícitas:** T1 (`repo-structure-mvp-v1.md`), T2 (`lesson-contract-mvp-v1.md`) e planta atual em `docs/architecture/`

## Objetivo

Transformar a aula atual aprovada no `lesson-app` em um pacote canônico separado da plataforma, sem reimplementar ainda o app e sem quebrar o walkthrough aprovado.

Este plano fecha a arquitetura de migração. Ele **não executa** o refactor físico da aplicação.

## Base verificada

Entradas confirmadas nesta task:

- `docs/repo-structure-mvp-v1.md` definiu a separação `app/`, `lessons/`, `docs/architecture/`, `fabrica/` e `legacy/`.
- `docs/lesson-contract-mvp-v1.md` definiu `lesson.json` como contrato direto do app.
- `docs/architecture/model.c4` e `docs/architecture/model.views.c4` já consolidam plataforma, pacote de aula, artefatos gerados e legado.
- A aula aprovada hoje vive em `lesson-app/src/lesson-story4.json`.
- O diagrama consumido pelo app está em `lesson-app/src/likec4-views.mjs`.
- O conteúdo em `content/*.md` pertence ao protótipo P1 e não coincide 1:1 com a narrativa inline da aula aprovada.

## Aula alvo

Slug canônico recomendado para a aula atual:

- `lessons/mind-task-flow/`

Justificativa:

- descreve o assunto real da aula atual;
- evita o id genérico `lesson-002`;
- continua estável mesmo que o layout ou a tecnologia da plataforma mudem.

## Destino canônico dos artefatos atuais

| Origem atual | Destino canônico | Decisão |
|---|---|---|
| `lesson-app/` | `app/` | O diretório atual do runtime vira a plataforma canônica após o loader por contrato estar pronto. |
| `lesson-app/src/lesson-story4.json` | `lessons/mind-task-flow/lesson.json` | Vira o manifesto da aula atual. O `id` deve deixar de ser genérico e passar a refletir o slug. |
| `lesson-story4.json.steps[].content` | `lessons/mind-task-flow/script.md` | O markdown inline deve ser extraído para um `script.md` com âncoras estáveis por step. Durante a transição, `lesson.json` pode carregar `content` inline como fallback até o loader novo entrar. |
| `lesson-app/src/likec4-views.mjs` | `lessons/mind-task-flow/generated/likec4/likec4-views.mjs` | Artefato derivado do fluxo da aula. Sai do `src/` da plataforma. |
| `lesson-app/src/likec4-views.d.mts` | `lessons/mind-task-flow/generated/likec4/likec4-views.d.mts` | Vai junto com o módulo gerado para preservar tipagem e inspeção. |
| `content/overview.md` | `legacy/notes/overview.md` ou insumo curado para `source.md` | Não deve virar `script.md` automaticamente: pertence ao protótipo P1 e descreve outra narrativa. |
| `content/mind-runtime.md` | `legacy/notes/mind-runtime.md` ou insumo curado para `source.md` | Mesma regra: é material de referência, não a aula runtime aprovada. |
| ausência de `source.md` para a aula atual | `lessons/mind-task-flow/source.md` | Deve nascer como consolidação curada dos insumos humanos usados para montar a aula atual. Se isso não estiver pronto no primeiro corte, criar placeholder explícito. |
| ausência de `flow.c4` da aula atual | `lessons/mind-task-flow/flow.c4` | Deve receber a fonte textual do fluxo específico da aula. Enquanto o fluxo da aula existir só no compilado, isso é um GAP de autoria a ser fechado no refactor. |
| `index.html` | `legacy/p1-html/index.html` | Legado histórico; sai do caminho principal do produto. |
| `start.sh` modo `p1` | launcher transitório de legado/inspeção | Continua apenas como infraestrutura humana de leitura durante a migração. Não é contrato do produto. |
| `docs/lesson-engine-schema-v1.md` | permanece em `docs/` até revisão | Está parcialmente desalinhado do runtime atual porque assume markdown externo e múltiplas views por step. Deve ser revisado depois do loader novo. |
| `docs/fabrica-de-aulas-design-doc-v2.md` | permanece em `docs/` com follow-up | Continua válido conceitualmente, mas referências ao compilado em `src/` precisam migrar para o pacote da aula. |

## Decisão de transição para `lesson.json`

Há um desencaixe real entre o contrato-alvo e o runtime aprovado:

- T2 pressupõe `script.md` + referências por âncora;
- o app atual lê `steps[].content` inline;
- parte da documentação antiga ainda pressupõe `content/*.md`.

Para evitar regressão desnecessária, a migração deve usar **dupla representação temporária**:

1. extrair o texto atual para `script.md`;
2. adicionar referências `markdown.file` + `markdown.anchor` em `lesson.json`;
3. manter `steps[].content` como fallback temporário;
4. só remover `content` inline depois que o loader novo estiver estável.

Essa regra reduz o risco de quebrar a UX aprovada enquanto o app aprende a carregar a aula por contrato.

## Ordem segura do refactor

### Fase 0 — congelar a aula aprovada

1. Confirmar que `lesson-story4.json` é a baseline aprovada.
2. Escolher e fixar o slug `mind-task-flow`.
3. Não reordenar steps nem alterar presets nesta fase.

### Fase 1 — materializar o pacote sem trocar o runtime

1. Criar `lessons/mind-task-flow/`.
2. Copiar `lesson-story4.json` para `lessons/mind-task-flow/lesson.json`.
3. Copiar `likec4-views.mjs` e `likec4-views.d.mts` para `generated/likec4/`.
4. Criar `script.md` a partir do markdown inline atual.
5. Criar `source.md` com status explícito:
   - consolidado, se os insumos humanos estiverem claros;
   - placeholder documentado, se ainda não estiverem.

### Fase 2 — introduzir o loader por contrato

1. Ensinar o app a carregar `lesson.json` fora do `src/`.
2. Ensinar o app a resolver `diagram.generatedModule`.
3. Ensinar o app a resolver `markdown.file` + `anchor`.
4. Preservar fallback para `steps[].content` até o corte final.

### Fase 3 — desacoplar a plataforma do conteúdo

1. Remover import hardcoded de `./lesson-story4.json`.
2. Remover import hardcoded de `./likec4-views.mjs`.
3. Isolar qualquer lógica de path da aula em um loader único.
4. Só depois disso renomear `lesson-app/` para `app/`.

### Fase 4 — quarentena do legado

1. Mover `index.html` para `legacy/p1-html/`.
2. Mover `content/*.md` para `legacy/notes/` ou anexá-los curadamente à aula certa.
3. Deixar `start.sh p1` como caminho legado/inspeção, nunca como bootstrap principal do produto.

### Fase 5 — limpeza pós-corte

1. Revisar docs antigas que ainda apontam para `content/` ou `src/`.
2. Atualizar a fábrica para emitir caminhos do pacote canônico.
3. Remover fallback inline de `steps[].content`.

## Riscos de regressão

### R1 — quebra do walkthrough aprovado

Se a ordem dos steps mudar ou se `walkthroughStart`/`walkthroughEnd` não continuarem coerentes, o fluxo contínuo quebra.

Mitigação:

- preservar ordem e índices no primeiro corte;
- comparar comportamento visual antes de remover qualquer fallback.

### R2 — loader Vite não resolver arquivos fora do `src/`

O app atual importa tudo de dentro do próprio `src/` e ainda serve `content/` por middleware customizado.

Mitigação:

- introduzir um loader dedicado;
- migrar o acesso a markdown e módulo gerado de forma explícita, não por imports espalhados.

### R3 — `content/*.md` contaminar a aula errada

Os arquivos de `content/` são herança do protótipo P1 e não equivalem à aula runtime atual.

Mitigação:

- tratá-los como `legacy/notes/` ou como insumo curado;
- nunca promovê-los automaticamente a `script.md`.

### R4 — inexistência da fonte textual `flow.c4` — ✅ RESOLVIDO (2026-07-03, task F2)

Hoje a aula runtime já depende do compilado, mas a fonte textual da aula não está materializada no pacote.

Mitigação:

- criar `flow.c4` antes de considerar a migração concluída;
- tratar a ausência dessa fonte como GAP explícito de autoria.

**Resolução:** `lessons/mind-task-flow/flow.c4` criado portando fielmente o bloco
`dynamic view flow { ... }` e os elementos mínimos de model.c4 necessários, a partir de
`/home/lusga/workspace/spikes/001-likec4-mind-bootstrap/projects/mind-blueprint-spike/src/`
(datado de 2026-07-01; diagnóstico de origem na task F1, `agent_tasks.726c2fbe`; uso
autorizado por Lucas em 2026-07-03). `npx likec4 validate`/`export json` confirmam 12
arestas, mesmo título e descrição do compilado já aprovado — sem inventar autoria.

### R5 — documentação antiga continuar ensinando o caminho errado

Há docs que ainda falam em `content/*.md`, múltiplas views por step ou compilado dentro do `src/`.

Mitigação:

- revisar docs correlatos no mesmo batch do refactor físico;
- deixar claro o que é histórico e o que é canônico.

## Definition of done para a próxima task de refactor

O refactor físico pode ser considerado fechado quando:

1. o app roda a aula a partir de `lessons/mind-task-flow/lesson.json`;
2. o diagrama é carregado a partir de `generated/likec4/`;
3. o texto da aula vem de `script.md` por âncoras, sem depender de `content/`;
4. `lesson-app/` já tiver virado `app/`;
5. `index.html` e `content/` já não estiverem no caminho principal;
6. ✅ `flow.c4` da aula existir e virar a fonte do compilado (resolvido em 2026-07-03, task F2);
7. a UX aprovada continuar idêntica do ponto de vista do walkthrough.

## Resumo executivo

- a planta `.c4` já está coerente após T1 + T2;
- a migração segura da aula atual exige pacote duplicado primeiro, loader novo depois;
- `content/*.md` não deve ser promovido automaticamente para a aula atual;
- o maior risco técnico é quebrar o walkthrough ao trocar paths e formato de conteúdo;
- o próximo passo correto não é redesenhar a arquitetura de novo, e sim executar o refactor físico guiado por este plano.
