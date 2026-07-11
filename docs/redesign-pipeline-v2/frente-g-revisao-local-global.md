# Frente G — Revisão Local e Global de Coerência

## Achado que ancora tudo

`concepts_introduced[]` já foi desenhado no design-doc-v2 (linha 270) exatamente para "rastreabilidade cross-aula, evita re-ensino", mas nunca foi lido de volta por ninguém — a revisão global é o consumidor que falta pra um dado que já existe.

## Critérios de revisão GLOBAL (G1-G8)

| # | Critério | Como é decidido |
|---|---|---|
| G1 | Redundância de exemplo sem justificativa (mesmo exemplo nomeado em 2+ aulas, sem reforço declarado) | Determinístico + LLM só no par suspeito |
| G2 | Referências cruzadas resolvem de verdade ("como vimos na aula X") | 100% determinístico (lookup) |
| G3 | Progressão de pré-requisito (termo usado antes de ser definido) | 100% determinístico (checagem topológica) |
| G4 | Conceito reintroduzido do zero (tratado como novo 2x) | Determinístico |
| G5 | Cobertura sem buracos | Determinístico |
| G6 | Consistência terminológica (mesmo conceito, nomes diferentes) | LLM leve |
| G7 | Repetição de representação sem propósito | Determinístico (diff de viewId/node) |
| G8 | Reforço espaçado é auditável (repetição intencional sempre declarada, nunca inferida) | Determinístico (existência do campo) |

G2,G3,G5,G7,G8 = zero LLM. Só G1/G4/G6 exigem julgamento, e só no par candidato.

## Critério intencional vs. redundância ruim

Repetição só é boa se **as duas** condições batem: **(1) declarada** (campo explícito amarrando a 2ª ocorrência à 1ª) e **(2) nova faceta** (responde pergunta diferente sobre o mesmo conceito, ou é fecho consolidador explícito). Falhando qualquer uma → redundância ruim.

**Prova real no Capítulo 2**: repete a regra da reciprocidade ~10x, mas cada bloco vem sob subtítulo que declara faceta nova ("A regra é esmagadora" L1070 — supera a simpatia; "reforça dívidas não solicitadas" L1371; "pode desencadear trocas desiguais" L1463; "Concessões recíprocas" L1567 — mecanismo diferente). `grep` confirmou: nenhum dos ~10 exemplos nomeados se repete — capítulos posteriores só fazem *callback* de 1 linha (L8078), nunca reexplicam do zero. **O risco real**: `scope_planner.py` corta por densidade de texto, sem saber "isso já foi coberto" — nada impede `content_author` (chamado isolado) de reintroduzir a mesma história como se fosse a primeira vez.

## Relação com o mapa do curso

Bidirecional, mas só o REGISTRO (nunca o texto): lê (conceitos, exemplos nomeados, referências cruzadas) e contribui (append-only, nunca reescreve aulas passadas). Papel de juiz, não de editor — quando reprova, roteia via `send_back_to` (mesmo padrão do `condemn.py`).

## Arquitetura: incremental, nunca 1 chamada sobre o curso inteiro

**Aula nova vs. registro, nunca curso inteiro vs. curso inteiro.** Motivos: (1) o vocabulário já decidiu isso (contexto global é referência somente-leitura); (2) 331 páginas não cabem com confiança no orçamento de modelo fraco numa chamada só; (3) publicar aula N não pode forçar rejulgar N-1 aulas aprovadas (contradiz estado append-only do orchestrator); (4) custo certo é O(conceitos/exemplos no registro), não O(tamanho do curso) — G2,G3,G5,G7,G8 são lookup puro, zero custo LLM.

```
aula aprovada localmente (crítico+condenador)
  → DIFF DETERMINÍSTICO contra mapa do curso (candidatos G1/G4/G6)
  → JUDGE LLM ESTREITO só nos candidatos (2 excertos por chamada)
  → append determinístico no mapa do curso (nunca reescreve aulas antigas)
```
