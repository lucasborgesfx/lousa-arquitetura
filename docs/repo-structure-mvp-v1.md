# Arquitetura Canônica da Repo — MVP v1

**Status:** proposta arquitetural pronta para orientar refactor  
**Origem:** task `/op` `7e14c248-971b-4928-9a52-f80f1bdc3f92`  
**Escopo:** estrutura física da repo, sem mover arquivos nem reescrever a aplicação nesta etapa

## Decisão

A repo da Lousa passa a ter quatro zonas canônicas e um isolamento explícito do legado:

1. `app/` = plataforma de runtime da Lousa.
2. `lessons/<lesson-slug>/` = pacote de uma aula específica.
3. `docs/architecture/` = planta arquitetural versionada do projeto.
4. `fabrica/` = geração local de artefatos pedagógicos.
5. `legacy/` = quarentena de artefatos históricos que não pertencem mais ao caminho principal.

O princípio central é:

- a plataforma não carrega mais uma aula hardcoded de dentro do próprio `src/`;
- a aula vira pacote explícito, com fonte, script, fluxo e manifesto;
- a planta `.c4` do projeto continua em `docs/architecture/`;
- o `.c4` de uma aula vive dentro do pacote da própria aula;
- artefatos gerados ficam junto do pacote que os originou, nunca misturados ao código da plataforma.

## Árvore alvo

```text
.
├── README.md
├── app/
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── lessons/
│   └── <lesson-slug>/
│       ├── source.md
│       ├── script.md
│       ├── flow.c4
│       ├── lesson.json
│       ├── generated/
│       │   └── likec4/
│       │       ├── likec4-views.mjs
│       │       └── likec4-views.d.mts
│       └── assets/
├── docs/
│   ├── architecture/
│   │   ├── model.c4
│   │   ├── model.views.c4
│   │   └── _spec.c4
│   └── *.md
├── fabrica/
│   ├── agents/
│   ├── prompts/
│   ├── schemas/
│   └── test_data/
└── legacy/
    ├── p1-html/
    └── notes/
```

## Fronteiras de responsabilidade

### `app/`

- Contém somente o código da experiência de estudo.
- Pode conhecer o contrato de `lesson.json`, mas não possuir conteúdo de uma aula específica dentro de `src/`.
- Pode renderizar markdown, manifestos e artefatos gerados de diagrama, mas não é dona desses arquivos.
- Não deve ser o lugar onde vivem `source.md`, `script.md`, `flow.c4` ou `likec4-views.mjs` de uma aula específica.

### `lessons/<lesson-slug>/`

- É a unidade canônica de uma aula.
- Guarda tudo o que pertence semanticamente a uma aula específica.
- Arquivos mínimos obrigatórios:
  - `source.md` = material-base humano ou insumo principal da fábrica
  - `script.md` = narrativa pedagógica humana/curada
  - `flow.c4` = fonte textual do fluxo conceitual da aula
  - `lesson.json` = contrato consumível pela plataforma
- `generated/likec4/` guarda somente artefatos derivados do `flow.c4`.
- `assets/` é reservado para imagens, anexos e mídias próprias da aula.

### `docs/architecture/`

- Guarda a planta arquitetural da própria Lousa.
- Modela a engenharia da repo, do app, da fábrica e dos pacotes de aula.
- Não substitui o `flow.c4` de uma aula específica.
- É a fonte canônica para dúvidas sobre fronteiras do sistema.

### `fabrica/`

- Guarda agentes, prompts, schemas e utilitários de geração local.
- Produz artefatos para dentro de `lessons/<lesson-slug>/`.
- Não vira pasta de runtime do app.
- Não vira depósito de conteúdo publicado para a aula final.

### `legacy/`

- Isola protótipos, caminhos históricos e referências que ainda ajudam na migração.
- Não entra no fluxo principal do produto.
- Tudo que estiver aqui deve ser ou migrado de forma explícita para `app/` ou `lessons/`, ou removido depois.

## Destino do legado atual

| Artefato atual | Decisão canônica |
|---|---|
| `content/` | Deixa de existir como raiz canônica. O que for conteúdo-base de uma aula vai para `lessons/<lesson-slug>/source.md`. O que for sobra histórica ou material de comparação vai para `legacy/notes/` até ser absorvido ou descartado. |
| `lesson-app/src/lesson-story4.json` | Vira `lessons/<lesson-slug>/lesson.json`. O app passa a carregar a aula por contrato, não por import direto em `src/`. |
| `lesson-app/src/likec4-views.mjs` | Sai da plataforma e vira artefato derivado do pacote da aula em `lessons/<lesson-slug>/generated/likec4/likec4-views.mjs`. Nunca deve ser editado manualmente. |
| `index.html` | Sai do caminho principal e vai para `legacy/p1-html/index.html` como referência histórica temporária. |
| `start.sh p1` | Deixa de ser caminho canônico. Se sobreviver durante a migração, vira apenas lançador do legado em `legacy/p1-html/`; o fluxo principal passa a iniciar só a plataforma atual. |

## Regras mínimas de nomeação para futuras aulas

- Diretório de aula: `lessons/<lesson-slug>/`
- `<lesson-slug>` em kebab-case, curto e estável.
- O slug descreve a aula, não a tecnologia. Ex.: `mind-panorama`, `fluxo-hibrido`, `supabase-data-plane`.
- Os nomes canônicos dos arquivos-base são fixos:
  - `source.md`
  - `script.md`
  - `flow.c4`
  - `lesson.json`
- Artefatos gerados vão sempre para `generated/`.
- Arquivos versionados manualmente nunca devem usar prefixo `generated-`.
- A versão da aula vive no conteúdo de `lesson.json`, não no nome do diretório.

## Consequências práticas para o refactor

1. O primeiro refactor estrutural é separar o código do app do conteúdo da aula atual.
2. O segundo é transformar a aula hardcoded atual em um pacote explícito dentro de `lessons/`.
3. O terceiro é mover o legado HTML/P1 para uma zona de quarentena.
4. O quarto é fazer a fábrica escrever no pacote da aula, não no `src/` do app.

## Regra de ouro

Se um arquivo responde à pergunta “isso é código da plataforma ou conteúdo/estrutura de uma aula específica?”, ele não pode ficar num lugar ambíguo.
