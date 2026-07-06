# Home — Lousa de Arquitetura

## Regra operacional imediata sobre `.c4`

Sempre que a planta `.c4` da Lousa for atualizada:

- fazer commit da mudança na repo;
- atualizar a stream visual/local host usada para leitura humana;
- assumir que agentes externos (como `gptiphone` e outros) podem ler a planta pelo GitHub;
- assumir que Lucas precisa ver essa mesma planta na tela dele.

Estado operacional atual:

- planta canônica do produto = `view productCanonical`;
- view auxiliar de migração/comparação = `view migrationComparison`;
- stream local atual do LikeC4 = `http://localhost:4310/`.
- repositório GitHub = fonte de verdade compartilhável para agentes externos;
- host visual local = projeção humana do `.c4`, não a fonte de verdade.

Regra prática:

- `.c4` atualizado sem commit = contexto incompleto para agentes externos;
- `.c4` atualizado sem stream visual = contexto incompleto para Lucas.

Regra de leitura:

- a planta principal para decisão é a **canônica**;
- a view de migração existe só para comparar legado vs alvo;
- a view de migração não redefine o produto.

## Identidade canônica

Este projeto é a **Lousa**, uma ferramenta **pessoal**, **local-first** e **standalone** para estudo.

Ela **não** faz parte do ecossistema Mind, Braide, `/op` ou Supabase.

## Arquitetura canônica atual

A separação correta do sistema agora é:

- **fábrica privada** = conversão de conteúdo bruto em aula;
- **runtime público** = leitura e execução de aulas já prontas.

Regra estrutural:

- a inteligência principal da Lousa fica fora do navegador;
- o navegador recebe apenas o necessário para tocar uma aula pronta;
- parsing, extração, seleção, simplificação, geração da aula e regras pedagógicas ficam no backend/pipeline privado.

Leitura operacional:

- `repo` = origem única do código e da arquitetura;
- `frontend público` = deploy separado do backend;
- `backend privado` = deploy separado do frontend;
- `lesson.json` = fronteira direta do runtime.

Regra de acesso:

- a função de conversão não é pública por default;
- apenas usuários permitidos podem gerar aulas;
- a massa de usuários acessa só as aulas já publicadas.

## Linha de corte da fase atual

Neste momento, a Lousa está em **fase de arquitetura**, não em fase de implementação da fábrica.

Ordem correta:

- fechar a planta canônica no `.c4`;
- validar fluxos, fronteiras e responsabilidades;
- fechar os modos do MVP;
- fechar os formatos de entrada do MVP;
- validar isso com Lucas;
- só depois abrir implementação de `harness.py`, módulos Python e pipeline real.

Regra prática:

- docs ou spikes antigos de harness podem servir como referência histórica;
- eles **não** autorizam implementação imediata;
- qualquer task de Python antes do fechamento arquitetural deve ser tratada como adiantada.

## Modos do MVP

No MVP, a Lousa terá apenas dois modos de aula:

- `resumo`
- `completo`

Regra de densidade:

- a densidade da aula segue a preferência do usuário;
- ela não segue automaticamente o volume bruto do material;
- material gigante não justifica aula confusa nem despejo de conteúdo.

Regra prática:

- `resumo` = filtro mais agressivo para captar ideia geral e correlações principais;
- `completo` = cobertura mais ampla, ainda objetiva, pragmática e simplificada.

## Inputs prioritários do MVP

Formatos prioritários da fábrica de aulas:

- `Markdown`
- `TXT`
- `PDF`
- `DOCX`
- `URL`

Regra de interpretação:

- `URL` não significa só uma página isolada;
- a coleta pode incluir páginas vizinhas do mesmo assunto, desde que isso continue controlado e previsível.

## Deploy alvo do MVP

Desenho-alvo atual:

- `GitHub` = repositório privado e fonte de verdade do código;
- `Cloudflare Pages` = frontend público do player/runtime;
- `backend privado` = fábrica da aula e lógica protegida;
- `localhost:4310` = stream humana da arquitetura, fora do produto.

Regra de profissionalismo:

- o frontend pode ser público;
- o repositório pode continuar privado;
- o valor principal da ferramenta deve permanecer no backend;
- esconder JavaScript não protege a ferramenta;
- separar runtime público de fábrica privada protege melhor o produto.

## Distinção obrigatória de contexto

### A. LikeC4 provisório para leitura

O LikeC4 aberto no spike externo foi usado **temporariamente** para:

- visualizar ideias;
- ler fluxos;
- inspecionar possibilidades de navegação da Lousa.

Ele **não** define a arquitetura canônica do produto.
Ele **não** é backend da aula.
Ele **não** é componente obrigatório da Lousa Ideal.

### B. Projeto real da Lousa

O projeto real é a própria Lousa:

- aula;
- player;
- fábrica de aulas;
- ingestão de conteúdo;
- geração de `lesson.json`;
- experiência local de estudo.

## Planta aprovada do produto

A planta aceita hoje separa explicitamente duas coisas:

- **produto canônico** = a arquitetura que a Lousa deve seguir;
- **comparação de migração** = a fotografia auxiliar que mostra onde o estado atual ainda diverge.

Leitura canônica aprovada:

- `lesson source` entra na fábrica local;
- a fábrica gera `script.md`;
- `flow.c4` gera o diagrama da aula;
- `assets`, `script` e `diagram` convergem no `manifest`;
- a plataforma consome o `manifest`.

Objetivo dessa planta:

- manter o produto simples;
- separar conteúdo, geração e consumo;
- evitar mistura entre aula, documentação solta e runtime.

### C. Regra crítica sobre o uso do LikeC4

Mesmo quando a Lousa usar a **tecnologia** LikeC4 dentro do produto:

- isso não transforma a Lousa em televisão dos outros projetos;
- isso não transforma a Lousa em cockpit do workspace inteiro;
- isso não autoriza puxar fluxos paralelos de outras frentes para dentro desta repo.

A Lousa continua sendo uma **plataforma de estudo**.

Se existir um stream paralelo de arquitetura, exploração ou experimentação de outros projetos, o lugar padrão disso é:

- `workspace/spikes/...`

### D. Regra crítica sobre ferramentas temporárias

Sempre classificar corretamente qualquer apoio pedido durante a conversa:

- parte do produto;
- documentação/planta;
- infraestrutura de desenvolvimento;
- spike temporário;
- ou ferramenta auxiliar de visualização, teste, debug ou explicação.

Regra padrão:

- ferramenta auxiliar temporária **não** vira requisito do produto;
- ferramenta auxiliar temporária **não** entra no fluxo ideal por default;
- ferramenta auxiliar temporária **não** deve ser promovida a componente canônico sem validação explícita.

Aplicação direta neste caso:

- o viewer local do LikeC4 foi apenas apoio de inspeção e conversa;
- a Lousa pode ter arquivos `.c4` próprios na repo;
- a Lousa **não depende** de `LikeC4 Local Viewer` como componente do produto.
- a stream local continua obrigatória como superfície de leitura humana, mas fora da lógica do produto.

## Regra anti-confusão

Sempre distinguir:

- **ferramenta temporária de apoio** = spike/LikeC4 externo;
- **documentação/planta** = arquivos `.c4` dentro da repo;
- **produto canônico** = Lousa nesta repo.
- **stream paralelo de projetos** = `spikes/`, fora da Lousa.

Não inferir Supabase, Mind, Braide, `/op`, tasks distribuídas ou runtime multiagente como parte do escopo da Lousa, a menos que isso seja pedido explicitamente depois.

## Direção pragmática atual

Tratar a Lousa como:

- single-user;
- local na fase de construção;
- simples;
- MVP;
- com runtime público leve;
- com backend privado para conversão;
- com deploy separado entre leitura pública e fábrica da aula.

## GitHub como fonte de verdade

Para este projeto, o GitHub deve ser tratado como:

- registro canônico do estado aceito;
- histórico de decisões;
- superfície de revisão via diff;
- espaço seguro para experimentar com branches curtas.

Regra prática:

- `main` = estado validado da Lousa;
- mudanças novas devem nascer em branch;
- branch curta, um assunto, merge rápido;
- experimentos de arquitetura podem viver em `c4/*` ou `spike/*`.

Padrão mínimo de nomes:

- `feat/*`
- `fix/*`
- `docs/*`
- `spike/*`
- `c4/*`

Padrão mínimo de commits:

- `feat:`
- `fix:`
- `docs:`
- `c4:`
- `refactor:`
- `chore:`
- `spike:`

Regra de operação:

- não misturar UI, docs e arquitetura no mesmo commit sem necessidade;
- usar diff/PR como revisão, mesmo sendo projeto solo;
- apagar branches depois do merge quando elas cumprirem o objetivo.

## Estrutura canônica da repo

Reorganizada fisicamente em 2026-07-03 (branch `reorg/estrutura-mvp-2026-07-03`). Hoje, a leitura correta da repo é:

- `lesson-app/` = app React/Vite atual; desde a Fase 2 (2026-07-06), carrega a aula via loader por contrato (`src/lessonLoader.js`), lendo `lessons/mind-task-flow/` — não tem mais `lesson-story4.json` nem `likec4-views.mjs` hardcoded no `src/`. Ainda não foi renomeado para `app/` (Fase 3, adiada).
- `lessons/mind-task-flow/` = pacote canônico da aula aprovada (`lesson.json`, `script.md`, `flow.c4`, `source.md`, `generated/likec4/`).
- `fabrica/` = geração local de aulas e harness pedagógico;
- `docs/` = decisões, protocolos e especificações (planta canônica em `docs/architecture/`);
- `legacy/` = quarentena do legado explícito — `p1-html/index.html` (protótipo HTML anterior) e `notes/` (conteúdo-base do protótipo P1, ex-`content/`). `content/` e `index.html` soltos na raiz não existem mais.

Leitura arquitetural alvo:

- `player/runtime` (`lesson-app/`, futuro `app/`) = executa aula pronta a partir do pacote (`lessons/<slug>/`);
- `fábrica/backend` = gera aula a partir de conteúdo bruto;
- `docs/architecture/` = planta canônica que separa essas duas camadas.

## Alerta máximo

Nunca assumir a regra abaixo:

**"se a Lousa usa LikeC4, então ela deve virar viewer dos meus outros projetos"**

Essa inferência está errada.

Regra correta:

- a Lousa pode usar LikeC4 como tecnologia interna;
- a Lousa pode manter arquivos `.c4` como planta arquitetural versionada;
- a Lousa continua sendo produto próprio, com escopo próprio;
- o viewer local é só ferramenta temporária quando usado para inspeção;
- o stream de projetos paralelos fica em `spikes/`.

## Próximo filtro de decisão

Ao avaliar qualquer ideia nova, perguntar primeiro:

**isso simplifica a Lousa como tool pessoal de estudo, ou está puxando contexto de outro sistema?**

Se estiver puxando contexto de outro sistema, a decisão padrão deve ser **não incorporar**.
