# Frente C — Estratégia Pedagógica + Revivência do Protocolo Dormente

> `docs/protocolo-ensino-canonico-v1.md` foi RATIFICADO por Lucas em 2026-06-30 (project_events 2a1d33e0), mas só um subconjunto pequeno (P2,P3,P7,P8,P13 + esqueleto WHY→OVERVIEW→PRÉ-TREINO→DESENVOLVIMENTO→CONSOLIDAÇÃO) chegou em `content_author_system.md`.

## 1. Classificador de tipo (§2) — revive, escopo POR BLOCO (não por curso)

Cap. 2 do Cialdini mistura **Princípio (dominante)** + **Procedimento** (seção DEFESA, L1990-2146: reconhecer oferta → decidir se é tática → redefinir mentalmente → agir sem culpa) + **Fato** (evidência: "Regan, 1971"). Um único capítulo já quebra a suposição de tipo único — mais forte que entre cursos diferentes. Decisão: campo `content_type` por **bloco didático**, não por aula/curso.

## 2. Tensão P1 vs §5.1 — confirmada e refinada

**Já parcialmente implementada, nunca documentada como tal**: `flowchart_adapter_system.md` já usa `overview → walkthrough-start/walkthrough (edgeIndex sequencial) → consolidate` — isso JÁ é P1 (overview calmo) seguido de revelação progressiva (§5.1) seguido de P4 (fecho consolidador). Refinamento: (a) "overview" não é fixo em "diagrama de sistema" — generaliza pra "mostre a representação escolhida inteira, calma"; (b) P1/§5.1 só se aplicam quando `representação=diagrama` — pra tabela/texto puro a tensão nem se coloca.

**Recomendação de propagação**: adicionar linha explícita de escopo ao revivificar §5.1: "regras 1-9 aplicam-se a beats de DESENVOLVIMENTO quando representação=diagrama; beat OVERVIEW é exceção deliberada por P1."

**Risco de calibração (GAP, não regra)**: grafo causal pequeno (Princípio, ~3-5 nós) pode ter overview quase idêntico ao walkthrough — medir empiricamente antes de assumir mesmo nº de passos que em arquitetura de software.

## 3. Merrill+Gagné (9 eventos) — esqueleto atual OK na ORDEM, incompleto em COBERTURA

| Evento Gagné | Coberto por | Status |
|---|---|---|
| 1. Ganhar atenção | WHY | sim |
| 2. Informar objetivo | — | só metadado, nunca beat visível |
| 3. Ativar conhecimento prévio | PRÉ-TREINO | parcial |
| 4. Apresentar conteúdo | DESENVOLVIMENTO | sim |
| 5. Guiar | DESENVOLVIMENTO | fundido, sem beat próprio |
| 6. Provocar prática | — | **ausente** |
| 7. Feedback | — | **ausente** |
| 8. Avaliar | — | **ausente** |
| 9. Reforçar retenção | CONSOLIDAÇÃO | sim |

**Achado concreto que prova o gap**: cada capítulo termina em "PERGUNTAS DE ESTUDO" (L2198-2233), já divididas em "Domínio do conteúdo" (verificação) e "Pensamento crítico" (aplicação) — **evento 8 pronto na fonte, sem inventar nada**, e o harness hoje nem sabe que essas seções existem. Decisão: NÃO trocar os 5 blocos pelos 9 eventos nomeados (ordem macro já certa, mais simples pra modelo fraco). MAS faltam 2 capacidades reais: (a) beat de AVALIAÇÃO populado a partir de PERGUNTAS DE ESTUDO quando disponíveis na fonte; (b) pontos de predição/self-explanation intra-DESENVOLVIMENTO (compatível com engine ephemeral — resposta na mesma sessão, diferente de spaced retrieval entre sessões).

## 4. Exemplo real de abertura por gap de curiosidade (Loewenstein)

> Cena-problema: Etiópia (1985, fome generalizada) enviou 5 mil dólares ao México após terremoto (L964-973). Gap: por que um país devastado ajudaria um em situação melhor? Why-before-what: em 1935, o México ajudou a Etiópia invadida pela Itália — a dívida atravessou 50 anos (L980-982). Organizador de 1 frase: existe uma regra social forte o bastante pra sobreviver a 50 anos e uma crise humanitária. Narrativa: tensão entre "guardar o pouco que resta" e a obrigação de retribuir.

Achado: **o próprio Cialdini já usa essa técnica organicamente** (repete o padrão com o caso Holanda/Nova Orleans logo em seguida) — não é imposição pedagógica externa ao gênero.

## 5. Onde entra na arquitetura

**Núcleo pedagógico**, mesma etapa que decide "o quê" — classificador DETERMINA a representação (Princípio favorece diagrama causal pequeno, Fato favorece texto/mnemônica, Conceito favorece tabela), não o contrário. Campo `content_type` por bloco no schema do Autor de Conteúdo, consumido pelo próprio Autor (escolhe núcleo/abertura certo) e validado pelo Crítico/Condenador (bate núcleo aplicado com tipo declarado?).
