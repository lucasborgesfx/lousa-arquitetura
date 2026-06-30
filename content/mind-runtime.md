# Mind Runtime — detalhe

## O que é

O Mind Runtime é a **camada de código sistêmico** do ecossistema:
governa o comportamento dos agentes, valida contratos e entrega contexto.

## Componentes internos

### Camada de Código Sistêmico
- **Motor de Estado do Fluxo** — define estágios e o que vem a seguir
- **Roteamento & Dispatch** — roteia trabalho entre agentes e frentes
- **Aplicação de Contrato** — verificação determinística (realizada pelo `python.enforce`)
- **Política de Auditoria** — padroniza evidências, logs e estados

### Camada de Entrega de Contexto
Recupera "onde paramos" e entrega ao humano ou ao próximo agente.

### Registro de Frentes & Subprojetos
Torna frentes de trabalho entidades de primeira classe.

### Pipeline de Publicação do Blueprint
Cadeia: **fonte LikeC4 → export → snapshot → Supabase** →
disponível para GPT Web e Claude Web consultarem sem export manual.

## Gap crítico atual

A camada sistêmica existe como conceito, mas **o código ainda não existe**.
O Python worker realiza `enforce` e `pipeline` — mas o roteamento e o
motor de estado são ainda design.

> ← Voltar ao panorama
