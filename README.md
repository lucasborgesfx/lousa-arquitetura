# Lousa de Arquitetura

Ferramenta pessoal, local-first e standalone para estudar arquitetura por meio de aulas, visualizações e geração local de conteúdo.

Planta arquitetural do projeto:
- [`docs/architecture/`](</home/lusga/projects/lousa-arquitetura/docs/architecture>)

Se houver dúvida sobre estrutura, fluxos e fronteiras do sistema, priorizar o `.c4`.
Os arquivos `.c4` versionados são a planta canônica do projeto; um viewer local do LikeC4, quando usado, é apenas ferramenta opcional de inspeção.

## O que este projeto é

- uma Lousa local de estudo;
- um MVP de aula + player + fábrica de aulas;
- um repositório pensado para evoluir com apoio de IA e revisão por diff.

## O que este projeto não é

- parte do ecossistema Mind;
- parte do Braide;
- dependente de Supabase;
- dependente de `/op` ou runtime multiagente distribuído.
- viewer geral dos seus projetos paralelos.

## Regra crítica sobre LikeC4

Se a Lousa usar LikeC4, isso significa apenas:

- LikeC4 pode ser uma tecnologia interna do produto;
- LikeC4 pode servir para diagramas da própria experiência de estudo.

Isso não significa:

- transformar a Lousa em painel dos outros projetos;
- usar esta repo como hub dos spikes paralelos;
- depender de `likec4 start` para o produto existir ou para a aula funcionar;
- misturar plataforma de estudo com stream geral de arquitetura.

Regra prática:

- **Lousa** = plataforma de estudo
- **spikes/** = exploração paralela de outros projetos

## Fonte de verdade

Este repositório no GitHub deve ser tratado como a fonte de verdade operacional do projeto.

Regra prática:

- `main` = estado aceito e validado;
- toda mudança nova nasce em branch curta;
- diff e PR servem como revisão, mesmo em fluxo solo;
- experimentos de arquitetura podem acontecer em branches próprias sem contaminar `main`.

## Padrão de branches

Usar prefixos simples:

- `feat/*`
- `fix/*`
- `docs/*`
- `spike/*`
- `c4/*`

Exemplos:

- `feat/player-navegacao`
- `docs/identidade-da-lousa`
- `spike/fluxo-fabrica-local`
- `c4/blueprint-da-aula`

Regra do MVP:

- uma branch = uma hipótese;
- merge rápido quando validada;
- apagar a branch depois.

## Padrão de commits

Usar convenção mínima:

- `feat:`
- `fix:`
- `docs:`
- `c4:`
- `refactor:`
- `chore:`
- `spike:`

Exemplos:

- `docs: definir github como fonte de verdade`
- `feat: adicionar navegação entre blocos da aula`
- `c4: explorar fluxo da fabrica local`

## Estrutura atual da repo

- `lesson-app/` = app React/Vite atual
- `fabrica/` = geração local de aulas e harness pedagógico
- `docs/` = protocolos, design docs e decisões
- `content/` = conteúdo-base para estudo
- `index.html` = protótipo anterior em HTML puro
- `HOME.md` = guarda de contexto para IA/agentes

Observação crítica:
o stream paralelo dos seus outros projetos deve permanecer fora desta repo, em `workspace/spikes/...`.

## Como rodar

App atual:

```bash
cd lesson-app
npm install
npm run dev -- --port 5174
```

Script legado da repo:

```bash
./start.sh lesson
```

Observação:
o modo `p1` ainda referencia um spike externo de LikeC4 e deve ser tratado como provisório, não como arquitetura canônica da Lousa.
Mesmo quando um viewer local for útil para inspecionar a planta `.c4`, isso continua sendo apoio de documentação, não componente obrigatório do fluxo ideal do produto.

## Regra de decisão

Antes de incorporar qualquer ideia nova, perguntar:

`isso simplifica a Lousa como tool pessoal de estudo, ou está puxando contexto de outro sistema?`

Se estiver puxando contexto de outro sistema, a decisão padrão deve ser não incorporar.
