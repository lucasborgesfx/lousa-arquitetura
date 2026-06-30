# Princípios Canônicos de UX de Aula — Lousa de Arquitetura (v1)

> **O que é este doc:** o *harness* que os 3 agentes de autoria obedecem. Garante que toda aula
> tenha UX fantástica E ensine de verdade, por design — não por improviso.
> Destilado de pesquisa com fontes reais (Mayer, Sweller, Shneiderman; NN/G, Pudding, Scrollama, GSAP).
> Cada regra tagueada **[V]** = verificada na fonte · **[H]** = aplicação derivada (calibrar na prática).

---

## 0. Os 3 papéis que obedecem este doc

1. **Autor de Conteúdo** — *o quê*: roteiro pedagógico, ordem das ideias, "why before what". Não pensa em câmera.
2. **Adaptador de Fluxograma** — *onde*: mapeia cada ideia ao nó/view do LikeC4. A ponte conteúdo↔diagrama.
3. **Diretor de Apresentação** — *como*: ritmo, transições suaves, zoom/pan/recenter, o flow scroll-driven.

Regra de ouro: **o quê (1) ≠ onde (2) ≠ como (3).** Misturar os três é o que produz aula "vagabunda".

---

## 1. Estrutura macro da aula (pedagogia)

- **P1 [V] Overview-first.** Abra com o diagrama inteiro em estado calmo/esmaecido (mapa do território). Depois zoom/destaque um nó por vez. Só então detalhes. Nunca abrir no detalhe. (Shneiderman: *overview first → zoom & filter → details-on-demand*.)
- **P2 [V] Why before what.** Cada aula/seção começa pelo problema que aquela arquitetura resolve, antes do mecanismo. Narrativa ancora o desconhecido no familiar.
- **P3 [V] Pré-treino de vocabulário.** Antes de animar o sistema funcionando, apresente em beats curtos os nomes/papéis dos componentes-chave. Aprender "o que é X" e "como X interage" ao mesmo tempo estoura a working memory. (Pretraining principle.)
- **P4 [H] Fecho consolidador.** Ao fim de cada seção, re-monte o overview agora todo "aceso" pra consolidar o esquema antes da próxima. (zoom in → zoom out.)
- **P5 [H] Currículo segue o mesmo mantra.** Aula 1 = mapa do sistema; aulas seguintes = zoom em subsistemas; últimas = detalhes de implementação.

## 2. Ritmo e chunking (quanto por vez)

- **P6 [V] Segmentação com ritmo do aluno.** Segmentos curtos, aluno avança quando pronto. Nada de auto-play corrido.
- **P7 [V/H] Um beat = um step = uma ideia = um movimento de câmera.** Cada bloco de texto mapeia pra exatamente UM estado de câmera. No máximo um conceito novo (um nó, uma aresta, uma relação) por beat. Não empilhe transições.
- **P8 [H] Acumule, não resete.** Ao revelar um nó novo, mantenha os já ensinados visíveis (esmaecidos). O aluno constrói o esquema do todo; não zere a tela a cada beat.
- **P9 [H] Texto por step ≈ 0.7–1 viewport de scroll.** Suficiente pra câmera completar a transição antes do próximo gatilho. (Sem número canônico — calibrar.)

## 3. Sinalização e sincronização (foco)

- **P10 [V] Sinalize o foco atual.** Realce/brilho/contorno no elemento ativo + dim do resto. (Signaling principle.)
- **P11 [V] Texto colado ao elemento.** Explicação perto/ligada ao nó que descreve. Senão = split-attention. (Spatial contiguity.)
- **P12 [V] Texto e câmera juntos no tempo.** A frase e o movimento/realce aparecem sincronizados, não em momentos diferentes. (Temporal contiguity.)
- **P13 [V] Texto complementa, não transcreve.** Não duplique no texto o que o diagrama já diz. Redundância rouba working memory. (Redundancy principle.)

## 4. Mecânica de scroll (engine)

- **P14 [V] IntersectionObserver, nunca scroll-events** pra disparar steps (evita jank). Lib de referência: Scrollama.
- **P15 [V] Sem scroll-jacking.** Scroll nativo, só *monitorado*. Sequestrar scroll quebra power-users, hardware antigo e tecnologia assistiva.
- **P16 [V] Sticky graphic.** Diagrama (direita) `position: sticky` enquanto o texto (esquerda) scrolla. Preferir CSS sticky a gerência JS.
- **P17 [V] Trigger no centro do viewport (offset 0.5).** Step ativa ao cruzar o meio da tela. Evite topo/fundo como gatilho primário.
- **P18 [V] Dispare câmera só na MUDANÇA de step ativo**, não a cada pixel. Se calcular à mão: throttle ~50ms + requestAnimationFrame. Com IO, desnecessário.

## 5. Câmera — timing, easing, choreography

- **P19 [V] Durações:** recenter/ajuste pequeno **200–300ms**; movimento grande (pan longo/zoom amplo) **até 400ms**; highlight instantâneo **~100ms**. **Nunca ≥500ms** (vira "drag").
- **P20 [V] Distância ↔ duração.** Quanto maior o movimento, mais longa a transição. Mas ajuste pequeno ainda merece transição — nunca cut abrupto.
- **P21 [V] Easing:** `ease-out` como padrão; `ease-in-out` pros movimentos grandes (zoom). **Nunca linear.**
- **P22 [V] Gramática de movimento:** **zoom in** = focar/aprofundar num nó; **zoom out** = dar contexto/overview; **pan** = revelar/seguir elemento adjacente sem mudar de nível.
- **P23 [V] Interpole, não pule.** Entre nós distantes: zoom-out → pan → zoom-in. Cut abrupto entre nós distantes é desconfortável.
- **P24 [V] Se usar scrub atado ao scroll (GSAP):** `scrub: 0.5`–`1` (lag suave), nunca `scrub: true` (treme).
- **P25 [V] Assimetria:** entrar mais lento que sair (ex.: overlay aparece 300ms / some 200–250ms).

## 6. Motion sickness (evitar enjoo)

- **P26 [V] Sem parallax / profundidade durante pan.** Background mais lento que foreground = náusea, mesmo sem distúrbio vestibular. É o pior efeito.
- **P27 [V] Movimentos previsíveis, curtos, com easing.** Não combine zoom+rotação+pan extremos simultâneos.

## 7. Acessibilidade (obrigatório)

- **P28 [V] Honrar `prefers-reduced-motion: reduce`:** trocar transições de câmera por cuts instantâneos.
- **P29 [V] Navegável SEM scroll/animação:** índice de steps clicável + markdown legível linearmente. Não prender o aluno num túnel guiado.
- **P30 [V] Performance é acessibilidade:** `will-change` nas transformações da câmera, diagrama leve.

---

## 8. Anti-padrões a BANIR (causam reação negativa real em testes)

Scroll-jacking · parallax pesado · transições abruptas · transições ≥500ms · scroll-fatigue (forçar o dobro de scroll) · travar navegação · ignorar reduced-motion · disparar câmera em todo pixel (jitter) · texto que transcreve o diagrama · abrir a aula no detalhe.

---

## 9. Contrato canônico de uma aula (resumo de 1 linha)

**Why → overview → pré-treino de termos → 1 ideia por beat (texto colado + câmera sincronizada + foco sinalizado, acumulando no diagrama) → transições 200–400ms ease-out, zoom/pan/interpolado, jamais cut nem ≥500ms → corte o supérfluo, nunca transcreva → re-monte o overview pra consolidar. Aluno controla o ritmo. Reduced-motion e navegação livre sempre.**

---

## Fontes
Pedagogia: Mayer (12 principles of multimedia learning); Sweller (Cognitive Load Theory); Shneiderman (*The Eyes Have It*, 1996, visual information-seeking mantra).
UX/câmera/scroll: NN/G (Animation Duration; Scrolljacking 101); Pudding (scrollytelling how-to / sticky / Scrollama); Scrollama (GitHub); GSAP ScrollTrigger; Cora Wang (pan & zoom); Parachute Design; Metadrop.

## GAPs a calibrar empiricamente
- Word-count exato e distância de scroll por step (P9) — sem fonte canônica; medir na prática.
- Durações de câmera (P19) extrapoladas de UI genérica pra "voar por arquitetura" — validar visualmente na aula-modelo.
