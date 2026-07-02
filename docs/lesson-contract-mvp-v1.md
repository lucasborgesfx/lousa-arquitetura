# Contrato Canônico App ↔ Aula — MVP v1

**Status:** decisão arquitetural canônica  
**Origem:** task `/op` `6c157341-723d-4a2c-9380-1ea3fa5bf063`  
**Escopo:** definir o contrato entre a plataforma da Lousa e uma aula individual, sem implementar código

## Decisão

No MVP, a plataforma consome **um único arquivo de entrada direta** por aula:

- `lesson.json`

Todo o resto da aula existe para autoria, geração, auditoria ou renderização indireta, mas não deve ser importado diretamente pelo app como fonte primária de contrato.

## Pacote canônico de uma aula

Cada aula vive em:

```text
lessons/<lesson-slug>/
├── source.md
├── script.md
├── flow.c4
├── lesson.json
├── generated/
│   └── likec4/
│       ├── likec4-views.mjs
│       └── likec4-views.d.mts
└── assets/
```

## Arquivos mínimos e papéis

### `source.md`

- Material-base da aula.
- Pode ser texto humano, conteúdo consolidado ou insumo vindo de ingestão.
- É lido pela fábrica, não pela plataforma.
- Não precisa obedecer ao formato final de apresentação.

### `script.md`

- Roteiro pedagógico humano/curado da aula.
- Explicita a narrativa e a ordem didática em linguagem legível por humano.
- Serve como intermediário entre `source.md` e `lesson.json`.
- Pode ser gerado ou revisado pela fábrica.

### `flow.c4`

- Fonte textual do fluxo conceitual da aula.
- Define as views e os elementos que a navegação visual da aula pode usar.
- É a fonte do diagrama da aula, não da arquitetura da plataforma.
- Não é consumido diretamente pelo app em runtime.

### `lesson.json`

- **Contrato consumível pela plataforma.**
- É o único arquivo que o app precisa abrir diretamente para rodar a aula.
- Contém a sequência de steps, presets de câmera, referências de markdown, view principal e ponteiros para artefatos gerados.
- Deve ser suficiente para o app renderizar a experiência sem imports hardcoded no `src/`.

### `generated/likec4/likec4-views.mjs`

- Artefato compilado derivado de `flow.c4`.
- É consumido indiretamente pela plataforma por referência do contrato da aula.
- Nunca é a fonte de verdade da aula.
- Nunca deve ser editado manualmente.

### `assets/`

- Arquivos auxiliares próprios da aula.
- Inclui imagens, anexos, ícones ou mídias referenciadas por markdown ou manifesto.
- Não deve misturar assets do app com assets da aula.

## O que a plataforma consome diretamente

Consumo direto do app:

1. `lesson.json`

Consumo indireto, resolvido a partir do contrato:

1. markdown de step
2. âncoras
3. módulo compilado do diagrama
4. assets da aula

Regra de ouro:

- o app **não** importa `source.md`
- o app **não** importa `script.md`
- o app **não** importa `flow.c4`
- o app **não** importa `likec4-views.mjs` como detalhe hardcoded do próprio `src`

Tudo isso deve ser descoberto a partir de `lesson.json`.

## Output esperado da fábrica local

Para uma aula do MVP, a fábrica local deve produzir ou atualizar:

1. `script.md`
2. `lesson.json`
3. opcionalmente `flow.c4`, se a task incluir adaptação estrutural do diagrama
4. nunca o código da plataforma

Separação de responsabilidade:

- `source.md` é insumo principal
- `script.md` é saída pedagógica humana/curada
- `flow.c4` é saída estrutural do fluxo, quando a task exigir
- `lesson.json` é saída contratual obrigatória para a plataforma
- `generated/likec4/*` é derivado técnico, não autoria

## Estrutura mínima de `lesson.json`

O contrato do MVP precisa carregar estes blocos:

```json
{
  "id": "mind-panorama",
  "title": "Panorama do Mind",
  "description": "Resumo curto da aula",
  "version": "1.0",
  "diagram": {
    "source": "flow.c4",
    "generatedModule": "generated/likec4/likec4-views.mjs",
    "defaultView": "flow"
  },
  "steps": [
    {
      "id": "step-01",
      "label": "Introdução",
      "markdown": { "file": "script.md", "anchor": "#introducao" },
      "camera": { "preset": "overview" }
    }
  ]
}
```

## Como ficam presets, steps e referência ao diagrama

### Presets de câmera

- Continuam parte do contrato da aula.
- Vivem em cada `step.camera`.
- São vocabulário semântico do contrato, não detalhe de implementação do app.

### Steps

- Continuam sendo a unidade atômica da apresentação.
- Cada step sincroniza:
  - referência textual (`markdown.file` + `anchor`)
  - intenção de câmera (`camera.preset`, `node`, `nodes`)
- O array `steps` vive dentro de `lesson.json`.

### Referência ao fluxo/diagrama

- O contrato da aula deve declarar explicitamente:
  - a fonte do diagrama (`flow.c4`)
  - o artefato compilado (`generated/likec4/likec4-views.mjs`)
  - a view padrão (`defaultView`)
- Isso impede que a plataforma esconda em código qual diagrama usar.

## Leitura canônica do contrato

### App

- Lê `lesson.json`
- Resolve `diagram.generatedModule`
- Resolve os arquivos markdown referenciados pelos steps
- Renderiza navegação, texto e câmera a partir desse contrato

### Fábrica

- Lê `source.md`
- Produz/revisa `script.md`
- Produz `lesson.json`
- Quando aplicável, colabora com o `flow.c4`

### Humano

- Pode editar `source.md`, `script.md` e `flow.c4`
- Não deveria precisar editar `likec4-views.mjs`
- Só edita `lesson.json` manualmente quando estiver refinando o contrato final

## Regra de estabilidade

O contrato do MVP deve ser estável o suficiente para:

1. tirar a aula atual de dentro do `src/`;
2. manter presets e steps já aprovados;
3. permitir futura troca do loader do app sem redefinir a aula;
4. permitir que a fábrica gere contrato sem acoplamento ao código da plataforma.

## Resumo executivo

- a aula canônica do MVP é um **pacote**
- o app consome **somente `lesson.json` diretamente**
- `script.md` e `flow.c4` continuam importantes, mas são suporte/autoria, não ponto de entrada do runtime
- `generated/likec4/` é derivado técnico e fica dentro do pacote da aula
