# Estratégia de Testes — Migração LangGraph (baseline vs. futuro)

Data: 2026-07-15
Depende de: `baseline-freeze-inventario-v1.md` (mesma pasta)
Autorização: Lucas via `gpt_web` (`agent_messages.id=67067be6-913d-4ec1-89ff-fa150542c227`), que pediu explicitamente: "explique quais testes são obrigatórios antes da migração, quais podem ser feitos durante, e quais não valem o custo... prefira testes de comportamento independentes da implementação, reutilizáveis para comparar o baseline com o LangGraph."

Princípio geral: todo teste aqui é de **contrato** (input real → output esperado), nunca de implementação interna — assim o mesmo teste roda contra o Python atual E contra qualquer versão LangGraph futura, sem reescrever o teste quando o motor muda por baixo.

Fixtures reais já existentes no repo, reaproveitadas (não inventei casos sintéticos do zero):
- `fixtures/fabrica-test-2026-07-06-critic/{positive,negative}/` — `lesson.json` real aprovado por Lucas + versão corrompida deliberadamente (3 defeitos injetados), ambos já rodados contra `lesson_critic.py`/`condemn.py` com `critic_report.json` de resultado.
- `fixtures/fabrica-test-2026-07-06-flowchart-adapter/` — `roteiro_pedagogico.json`/`roteiro_mapeado.json` reais + `comparacao.md` (14/14 beats batendo com o mapeamento aprovado).
- `fixtures/fabrica-test-2026-07-06-presentation-director/` — `lesson.json` gerado vs. real aprovado, comparação passo a passo.

---

## 1. OBRIGATÓRIO antes de tocar em qualquer código

Comportamentos que, se quebrados silenciosamente, custam caro descobrir depois — precisam de teste de contrato ANTES do primeiro corte (concorrência de fatias) começar.

### 1.1 Roteamento `send_back_to` (o mais crítico dos 6 riscos do inventário)
**Teste:** dado um `report` com uma violation `FAIL` em `content_author` e outra `PARTIAL` em `presentation_director`, `choose_send_back_to` deve retornar `"content_author"` (prioridade upstream vence). Repetir a matriz completa de precedência documentada no inventário (7 casos: FAIL→cada um dos 3 destinos, depois PARTIAL→cada um, depois nenhum roteável→`None`).
**Fixture real:** `fixtures/fabrica-test-2026-07-06-critic/negative/critic_report.json` já tem `send_back_to: "content_author"` na primeira violation (P3 FAIL) — usar como caso-base e derivar variações da matriz a partir dele.
**Por que obrigatório:** é lógica 100% determinística que rege pra onde o sistema manda retrabalho; um bug aqui manda correção pro agente errado silenciosamente.

### 1.2 Gate de aprovação (`condemn`)
**Teste:** (a) qualquer `FAIL` em princípio de `CRITICAL_PRINCIPLES` reprova IMEDIATAMENTE, mesmo com `score_total` alto; (b) `score_total < 42` reprova mesmo sem nenhum crítico falho; (c) `score_total >= 42` sem crítico falho aprova.
**Fixture real:** `fixtures/fabrica-test-2026-07-06-critic/negative/critic_report.json` (`score_total=44`, mas reprovado pelo caminho crítico P3 FAIL — exercita exatamente o caso (a), onde score alto não salva) e `fixtures/fabrica-test-2026-07-06-critic/positive/critic_report.json` (`score_total=49`, 7 violations, também reprovado por P3 FAIL — segundo caso real de (a), útil porque já foi investigado manualmente e o veredito de cada violação está documentado em `analise.md`).
**Por que obrigatório:** é o gate que decide se uma aula vai pro aluno ou volta pra retrabalho — comportamento errado aqui é o pior tipo de regressão silenciosa.

### 1.3 Validação de schema nos 4 contratos JSON
**Teste:** `roteiro_pedagogico.json`, `roteiro_mapeado.json`, `lesson_output.json`, `lesson_critic_output.json` continuam validando os mesmos casos válidos/inválidos depois da migração (schema em si não muda, mas quem valida pode mudar de framework).
**Fixture real:** os 3 pares gerado/aprovado citados acima já são positivos conhecidos; para negativo, usar o `negative/lesson.json` corrompido do fixture do crítico.
**Por que obrigatório:** contratos JSON são a fronteira definida no plano de execução entre camada de IA e resto do sistema — se a validação afrouxar sem querer, dados inválidos vazam pro frontend.

### 1.4 Regra hard C2 (ordem de walkthrough)
**Teste:** `_validate_walkthrough_rule` continua rejeitando uma sequência de `edgeIndex` fora de ordem, e aceitando a sequência real aprovada.
**Fixture real:** `fixtures/fabrica-test-2026-07-06-flowchart-adapter/roteiro_mapeado.json` (14 beats com `edgeIndex` 1-12 em ordem, já confirmado batendo 100% com o `lesson.json` aprovado via `comparacao.md`) — criar variação com 2 índices trocados como caso negativo.
**Por que obrigatório:** é a regra central de negócio do Adaptador, 100% Python determinístico hoje; se a migração "confiar no LLM" em vez de portar essa validação, o bug some silenciosamente até um aluno ver um fluxograma fora de ordem.

### 1.5 Recompute-don't-trust do Diretor (`walkthroughStart`/`walkthroughEnd` recalculados, não aceitos do LLM)
**Teste:** mesmo se a saída do LLM alegar `walkthroughStart`/`End` errados, o valor final no `lesson.json` deve ser o recalculado a partir do `edgeIndex` real dos beats.
**Fixture real:** `fixtures/fabrica-test-2026-07-06-presentation-director/lesson.json` + `comparacao.md` já confirmam `walkthroughStart=1, walkthroughEnd=12` batendo com o real — usar como regressão base.
**Por que obrigatório:** é um padrão "não confiar no LLM" que precisa sobreviver literalmente à migração — fácil de perder se o novo grafo passar a aceitar esses campos direto da saída do modelo.

---

## 2. PODE SER FEITO DURANTE a migração (paridade incremental, peça por peça)

- **Paridade de contrato por peça conforme migra**: quando o corte da concorrência de fatias (primeiro corte, já definido no plano de execução) entrar, rodar o MESMO job de teste (ex.: o módulo real "As Armas da Persuasão" já usado na avaliação adversarial anterior) nas duas versões (sequencial atual vs. LangGraph `Send`) e comparar: mesmos `lesson.json` produzidos por fatia, mesma ordem de aprovação/reprovação, mesmo tempo total. Não precisa estar pronto antes de começar o corte — é o próprio critério de validação DO corte.
- **Teste de idempotência/resume por nó**, à medida que cada fase (Autor/Adaptador/Diretor/Crítico+Condenador) migrar para um nó LangGraph dedicado: interromper o processo no meio e confirmar que o resume não repete chamadas de LLM já bem-sucedidas. Só faz sentido quando existir de fato um nó LangGraph pra testar — não antes.
- **Teste de `NeedRescope`** replicando o acoplamento textual frágil já documentado (`_is_concept_budget_error`) — pode esperar até a fase de rework/`_run_slice` ser o alvo de um corte (não é o primeiro corte), mas vale registrar o caso de teste agora pra não esquecer.

## 3. NÃO VALE O CUSTO

- **Testar a estrutura interna do `flock`/`JobStore`** — é infraestrutura de claim de fila que não migra nesta fase (confirmado no plano de execução, fica como está). Testar os detalhes de implementação de algo que não vai mudar é desperdício.
- **Testar o parser regex de `.mjs`** do `flowchart_adapter.py` linha a linha — já é reconhecido no inventário de baseline como o ponto mais frágil do sistema (acoplado à formatação exata do compilador LikeC4), mas não faz parte do escopo desta migração (é sintaxe/organização LikeC4, território da skill `likec4-dsl`, não da camada de IA). Testar isso aqui seria testar comportamento de uma peça que este projeto não vai tocar.
- **Testar valores exatos de `temperature`/`max_tokens` por agente** — são parâmetros de tuning, não contrato de comportamento; documentados no inventário de baseline para serem portados conscientemente, mas não merecem suíte de teste própria (mudança de valor não é bug, é ajuste).
- **Testar o fallback silencioso de `extract_usage`** (retorna zeros em qualquer falha) — é telemetria de uso de tokens, não comportamento de negócio; um teste aqui não protegeria nenhuma aula de sair errada pro aluno.
- **Recriar do zero os 2 casos de fixture já existentes** (`fixtures/fabrica-test-2026-07-06-*`) — já têm análise manual documentada (`analise.md`, `comparacao.md`) com veredito humano registrado; a estratégia certa é formalizar esses casos JÁ EXISTENTES como testes automatizados, não inventar novos casos equivalentes do zero.

---

## 4. Achado extra durante esta task (não solicitado, mas relevante)

Lendo `fixtures/fabrica-test-2026-07-06-critic/positive/analise.md`, o caso positivo real (`lesson.json` de `mind-task-flow`, já aprovado por Lucas) foi reprovado pelo Crítico atual (P3 FAIL) numa investigação anterior, com 2 achados documentados que **não foram corrigidos ainda**:
- Possível desalinhamento entre a rubrica dos 30 princípios (assume aluno novato) e aulas de "auto-documentação para o próprio arquiteto" (P3) — decisão de produto pendente, não travei isso, só registro que existe.
- Gap real identificado no prompt do Crítico (`lesson_critic_system.md`): P10/P11/P12 deveriam ser tratados como satisfeitos automaticamente pelo motor nativo de walkthrough do app em steps `walkthrough`/`walkthrough-start` (hoje só P14/P16-21/P24-30 estão nessa lista) — bug de prompt, não de migração, mas vale a pena corrigir antes ou durante a migração pra não portar um falso-negativo conhecido pro LangGraph junto.

Não corrigi nada disso agora (fora do escopo desta task de estratégia de testes) — só sinalizo pra não se perder, já que apareceu na leitura dos fixtures.

## 5. Resumo — ordem prática

1. Escrever os 5 testes da seção 1 (obrigatórios) usando os fixtures já existentes, ANTES do primeiro corte de código.
2. Implementar o primeiro corte (concorrência de fatias) — usar os testes de paridade da seção 2 como critério de validação do próprio corte, conforme já definido no plano de execução.
3. Deixar os itens da seção 3 fora do escopo de teste desta migração.
4. Rotear pra Lucas (via `gpt_web`) os 2 achados da seção 4, se/quando fizer sentido revisitar a rubrica do Crítico — não é bloqueante pra migração.
