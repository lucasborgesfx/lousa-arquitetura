# Vocabulário Canônico v1 — Redesign da Pipeline (2026-07-10)

> Todo subagente/frente desta pesquisa usa estes termos exatamente como definidos aqui.
> Não redefinir por conta própria. Se um termo for insuficiente, reportar ao subcoordenador
> (claude_linux) em vez de divergir silenciosamente — foi exatamente a falta disso que causou
> o gap das "duas réguas de conceito" na arquitetura anterior.

## Termos

- **conceito** — menor unidade de conteúdo cuja aprendizagem exige reter e relacionar
  elementos na memória de trabalho simultaneamente (base: *element interactivity*, Sweller —
  não é contagem de termos/palavras-chave).
- **bloco didático** — menor unidade de apresentação; pode conter 1 ou mais conceitos
  tratados juntos por fazerem parte do mesmo raciocínio.
- **aula** — sequência coerente de blocos didáticos com início/objetivo/fechamento próprios.
- **módulo** — agrupamento de aulas que compartilham um tema/capítulo maior da fonte original
  (informado pela fonte, não necessariamente 1:1 com capítulo do livro).
- **curso** — a fonte inteira (ex: 1 livro) transformada em experiência de estudo completa.
- **representação** — forma escolhida para apresentar um bloco: diagrama (processo/relação
  causal entre partes), tabela (comparação de atributos), texto puro (conceito sem estrutura
  relacional visualizável), ou combinação. Escolhida por bloco, nunca fixa por curso/job.
- **qualidade** — aderência aos princípios pedagógicos já documentados
  (`docs/lesson-ux-principles-v1.md`) + coerência global do curso (sem redundância de
  exemplo/explicação entre aulas do mesmo curso sem justificativa pedagógica).

## Decisões já tomadas nesta negociação (não reabrir sem motivo novo)

- **NÃO existe guardrail de "carga visual por step"** — a REGRA HARD C2 já implementada
  (contiguidade de arestas no walkthrough) já cobre esse caso. Foi proposto e retirado
  em 2026-07-10 por ser redundante. Único ponto em aberto: preset `focus` num nó de alto
  grau — vira critério de validação a confirmar com teste real, não regra nova antecipada.
- **1 diagrama fixo por job é premissa a ser abandonada** — a unidade correta é hierárquica
  (fonte → curso → módulos → aulas → blocos → representação), decidida por significado,
  não por tamanho.
- **Pipeline pensada para modelos mais fracos** — tarefas pequenas e verificáveis por
  chamada; contexto global vive num objeto "mapa do curso" passado como referência
  somente-leitura, nunca exigindo que 1 chamada raciocine sobre a fonte inteira.
- **Pesquisa pedagógica antiga (`docs/protocolo-ensino-canonico-v1.md`) foi RATIFICADA em
  2026-06-30 mas nunca propagada ao harness real** — esta pesquisa deve ser revivida e
  decidida (propagar ou descartar formalmente), não redescoberta do zero. Achados centrais:
  classificador de tipo de conteúdo (Conceito/Procedimento/Princípio/Processo-Sistema/Fato,
  cada um com núcleo pedagógico próprio), frame Merrill+Gagné, sequenciamento
  whole-part-whole/elaboration, protocolo de abertura com gap de curiosidade (Loewenstein),
  10 técnicas de percorrer diagrama (revelação progressiva, sinalização parcimoniosa,
  pontos de predição/self-explanation).
- **Tensão a resolver**: P1 já implementado ("abra com diagrama inteiro, calmo") vs.
  §5.1 do protocolo dormente ("nunca mostre o diagrama inteiro de início"). Hipótese de
  resolução: P1 rege o beat de orientação/abertura; revelação progressiva rege os beats
  de walkthrough seguintes. Precisa virar decisão explícita, não ficar implícita.
- **"Revisão espaçada entre sessões" (spaced retrieval, Roediger & Butler 2011) é decisão
  separada**, não entra no escopo desta pesquisa arquitetural — depende de guardar
  progresso do aluno entre sessões, o que contradiz a decisão atual de engine "ephemeral".

## Caso de teste real desta rodada

Fonte: `docs/redesign-pipeline-v2/fonte-real/as-armas-da-persuasao.txt` — extração real
(pdftotext -layout) de "As Armas da Persuasão" (Robert Cialdini), 331 páginas, 8 capítulos
reais (Reciprocidade, Compromisso e Coerência, Aprovação Social, Afeição, Autoridade,
Escassez, mais introdução e conclusão). Extração limpa confirmada (poucos artefatos de
rodapé/página). Cada capítulo já tem estrutura recorrente própria (seções "DEFESA",
"RESUMO", "PERGUNTAS DE ESTUDO") — dado real relevante para as frentes de estruturação
semântica e estratégia pedagógica.
