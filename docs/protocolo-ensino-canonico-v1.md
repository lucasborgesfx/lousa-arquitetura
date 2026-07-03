# Protocolo Canônico de Ensino — Fábrica de Aulas (v1, PROPOSTO)

> Síntese de 5 pesquisas independentes (modelos de design instrucional, sequenciamento/scaffolding,
> tipo-de-conteúdo, aberturas/narrativa, aprendizado por diagramas). Cada agente da fábrica obedece este
> protocolo. Status: **PROPOSTO — aguardando ratificação do Lucas** antes de virar harness obrigatório.
> Tags: [V] = verificado em fonte primária/meta-análise · [~] = aplicação fundamentada.

---

## 0. Arquitetura em 2 níveis (a decisão estrutural)
A literatura converge: **um frame externo único + um núcleo trocável por tipo de conteúdo.**
- **Frame universal (toda aula):** os **9 Eventos de Gagné**, dentro da **moldura problem-centered de Merrill**.
- **Núcleo plugável (varia por tipo):** Conceito / Procedimento / Princípio / Processo-Sistema / Fato.
- Para arquitetura de software o modo dominante é **Processo/Princípio** (modelo mental causal), **não** "passo a passo".

Isso responde sua pergunta: **sim, cada tema tem um jeito diferente de iniciar — mas dentro do mesmo esqueleto.**

---

## 1. Frame macro da aula (Merrill + Gagné) [V]
Moldura: ancore a aula inteira num **problema concreto real** ("siga uma requisição até o banco"). Dentro dela, a sequência de beats segue Gagné:
1. Ganhar atenção (abertura — ver §4) · 2. Informar objetivo · 3. Ativar conhecimento prévio · 4. Apresentar conteúdo (núcleo por tipo — §2) · 5. Guiar · 6. Provocar prática · 7. Feedback · 8. Avaliar · 9. Reforçar retenção/transferência.
Merrill dá o *porquê* macro (problema→demonstração→aplicação→integração); Gagné dá a *ordem* micro.

## 2. Classificador de tipo + núcleos plugáveis [V]
O agente classifica cada bloco e escolhe o template do slot "apresentar conteúdo":

| Tipo | Como iniciar | Núcleo |
|---|---|---|
| **Conceito** (ex: microsserviço) | definição (atributos críticos) | def → exemplos → **não-exemplos** (diferindo em 1 atributo) → classificar novos |
| **Procedimento** (ex: configurar CI) | demonstração | worked example → prática guiada → fading |
| **Princípio** (causa-efeito) | enunciar relação se→então | regra causal → prever → explicar caso novo |
| **Processo/Sistema** (fluxo, NOSSO caso) | modelo mental do todo | macro do fluxo → componentes+relações → comportamento; **problema-primeiro** |
| **Fato** (porta X usa Y) | apresentar associação | associação + mnemônica + repetição espaçada |

## 3. Sequenciamento e scaffolding [V]
- **Whole-part-whole / Elaboration (Reigeluth):** Beat 0 = o **fluxograma inteiro no caminho feliz** (caso mais simples). Depois "zoom in" reintroduzindo **uma complicação por beat** (falha, concorrência, escala), sempre voltando ao todo.
- **Concreteness fading:** caso **concreto nomeado** → diagrama genérico → princípio abstrato. Nunca abrir na definição abstrata.
- **Par exemplo→problema:** cada conceito novo = exemplo resolvido → problema gêmeo. Nunca mandar projetar do zero.
- **Fading adaptativo do suporte:** o andaime **decai quando o aluno acerta** (não em ritmo fixo) — senão *expertise reversal* (andaime demais entedia o avançado).
- **Espaçamento + intercalação:** aquisição = **blocada** (um padrão por vez); revisão = **intercalada, só entre conceitos confundíveis** (orquestração vs coreografia, CQRS vs event sourcing). Intercalar coisa não-confundível só adiciona carga.

## 4. Protocolo de abertura (por potência) [V]
Estrutura de ~30–60s por aula/seção:
**cena-problema concreta** (sistema quebrando) → **abrir a lacuna** (Loewenstein: "o óbvio falha — por quê?") → **why before what** (a dor que resolve) → **organizador de 1 frase** (nomeia o destino sem entregar a resposta) → conduzir como **narrativa** (conflito = o trade-off; stakes = o que falha). Clareza Feynman, zero jargão gratuito.
- **Varia por público [V/~]:** iniciante → construir a âncora/analogia antes (advance organizer puro falha sem base); experiente → o gap é mais potente (curiosidade cresce com expertise), pode furar uma crença que ele já tem.
- Curiosidade genuína na abertura coloca o cérebro em **modo-retenção** (Gruber/Neuron) — até o detalhe seguinte gruda melhor.

## 5. Percorrer o diagrama (nosso medium) [V]
A vantagem do nosso formato vem de transformar "diagrama tudo de uma vez" em **passos discretos com ritmo controlado** (Tversky):
1. **Nunca mostrar o diagrama inteiro de início** — revelar nó/aresta conforme a narração chega (progressive reveal).
2. **1 passo = 1 conceito = 1 movimento de câmera**; microsteps com pausa.
3. **Câmera lenta, pausável, avançar/voltar** sob controle do aluno.
4. **Texto/narração correm JUNTO com o movimento** (temporal contiguity), nunca antes/depois.
5. **Signaling com parcimônia:** acende o nó ativo + **a aresta da relação**, esmaece o resto — um foco por vez. Highlight **acoplado à explicação** (guiar o olho não garante entender).
6. **Movimento congruente:** a câmera segue o fluxo real de dados/controle (Congruence — Tversky).
7. **Cada parada self-contained** (nome/tipo/propósito visíveis — notação C4); foco no centro.
8. **Tour = história, descendo zoom um nível por vez** (C4: context→container→component); não misturar níveis.
9. **Pontos de predição/self-explanation** antes de revelar o próximo passo ("o que acontece se falhar aqui?") — evita tour passivo.
10. **Manter o já-explicado visível** (mapa mental cumulativo).

## 6. Regra de conceitos — RESOLVIDA (era a dúvida do worker) [V]
Adotar **os dois limites** (não trocar um pelo outro — medem coisas diferentes):
- **POR BEAT (hard):** ≤ **3** conceitos novos (alvo), **4** = teto. Carga instantânea — working memory ~4 chunks (Cowan); conceito novo não é "agrupável" pelo aluno → puxa pro 3.
- **POR AULA (guia):** ~**5–7** conceitos novos no total; se passar, **segmentar em mais aulas** (Mayer segmenting; atenção cai ~6 min — Guo).
> O worker acertou em ADICIONAR o limite por beat; errou em APAGAR o por aula. O per-beat simplifica a *tela*; o per-aula controla *escopo/fadiga*.

## 7. Mapa protocolo → agentes da fábrica
- **Autor de Conteúdo:** §1 frame, §2 classificar tipo + núcleo, §3 sequência, §4 abertura, §6 limites. (Produz o roteiro pedagógico.)
- **Adaptador de Fluxograma:** §5 (mapear cada beat a nó/aresta; dynamic view contínua).
- **Diretor de Apresentação:** §5 timing/câmera + §4 ritmo narrativo.
- **Crítico/Condenador:** valida contra §3–§6 (e o gate visual valida §5 renderizado).

## Fontes (primárias/meta-análises)
Gagné (Nine Events); Merrill (First Principles / Component Display Theory); Reigeluth (Elaboration); Sweller/Renkl (worked examples, fading); Kalyuga (expertise reversal); Goldstone/Fyfe (concreteness fading); Rohrer/Brunmair&Richter (interleaving "similarity matters"); Kapur (productive failure); Loewenstein (curiosity gap); Gruber/Neuron 2014; anchored instruction (CTGV); Ausubel (advance organizers); Tversky (apprehension/congruence); Berney&Bétrancourt 2016 (meta g=0.23, system-paced+narração); Mayer (segmenting, signaling, temporal/spatial contiguity, modality); de Koning (cueing); Simon Brown (C4); Cowan (~4 chunks); Guo (atenção ~6min).
