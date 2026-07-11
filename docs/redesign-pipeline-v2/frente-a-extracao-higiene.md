# Frente A — Extração & Higiene Documental

> Caso de teste real: `fonte-real/as-armas-da-persuasao.txt` (Cialdini, 331 páginas, extração `pdftotext -layout`).

## Ruído real encontrado (com evidência de linha)

- **Zona pré-textual (L1-165)**: resenhas de terceiros (L1-32), copyright/ficha catalográfica (L36-83), Sumário (L84-165 — não é ruído puro, vira candidato a esqueleto de módulos).
- **Zona pós-textual (L9631-10801)**: Notas por capítulo, Bibliografia, colofão/propaganda da editora (puro descarte).
- **Estrutura recorrente válida (não é ruído, é sinal)**: "RESUMO" (8x, 1/capítulo), "PERGUNTAS DE ESTUDO" (8x, capitalização inconsistente — 7 em CAPS, 1 "Perguntas de estudo"), "DEFESA" (só 6x — capítulos 1 e 8 não têm; regra ingênua "todo capítulo tem Defesa" quebraria em 2/8).
- **Caixas "DEPOIMENTO DE LEITOR N.M"**: 11+ ocorrências, sinal determinístico forte (indentação uniforme em todas as linhas do bloco).
- **"Anexo N.M" — 2 subtipos de risco diferente**: tabela real espremida por espaçamento (colapsar espaços destrói a semântica de coluna) vs. legenda de figura **sem nenhum dado no texto** (risco real de alucinação se um agente não for avisado que o dado não existe).
- **Reflow de parágrafo**: sinalizado só por indentação de 4 espaços na 1ª linha, sem blank line entre parágrafos.
- **Hifenização de quebra de linha**: 35 ocorrências, todas hífen real do português nesta fonte específica (não é garantia geral — PDFs OCR quebram palavra sem hífen).
- **Sem cabeçalho/rodapé repetido por página** (achado positivo, extração limpa).
- **Proveniência de página recuperável de graça**: 331 caracteres form-feed (`\x0c`) no arquivo = nº real de páginas. `pdftotext -layout` preserva isso: dá pra mapear linha→página física sem custo, **mas não há marcador textual de número de página** — só o form-feed.

## Contrato/Schema proposto

**Input**: PDF bruto (ou saída `pdftotext -layout` com form-feeds preservados — não descartar `\f`).

**Output**: lista de blocos, cada um com `bloco_id`, `tipo` (corpo | epigrafe | resenha_terceiro | copyright_ficha | sumario_fonte | secao_resumo | secao_perguntas_estudo | secao_defesa | depoimento_leitor | nota_autor | anexo_tabela | anexo_figura_sem_dados | nota_rodape | bibliografia | colofao), `texto_limpo`, `proveniencia` (página início/fim, linha raw início/fim, capítulo), `origem_da_classificacao` (determinístico|heurística|llm), `confianca`, `flags[]`. Mais um **relatório de descarte separado** (auditável, nunca silencioso).

## Determinístico vs. LLM

**100% determinístico** (mesmo pra modelo fraco): split por `\f`; corte de front/back-matter; detecção de headers recorrentes por regex case-insensitive; reflow por indentação; dehifenização via lista de prefixos/sufixos PT-BR; detecção de marcador de nota de rodapé; normalização de espaços só em prosa já classificada.

**Exige LLM**: reconstrução de tabela por alinhamento posicional; decidir destino de figura-sem-dado (nunca inventar o dado); resíduo ambíguo de dehifenização; decidir se Depoimento/Nota vira bloco pedagógico próprio (decisão de produto); distinguir nota de rodapé substantiva de puramente bibliográfica.

## Cenários de escala

1. **PDF curto**: ruído dominante é o OPOSTO (cabeçalho/rodapé repetido por página) — detectar por repetição posicional entre páginas, LLM quase dispensável.
2. **Livro 100+ páginas** (caso testado): front/back-matter só 1x cada; estrutura recorrente por capítulo é valiosa, não ruído; volume cresce O(linhas), sem gargalo de LLM (chamadas por bloco pequeno).
3. **Conteúdo repetitivo**: "aprender" o padrão estrutural 1x (com LLM+confirmação), aplicar regra determinística parametrizada depois — mas **sinalizar** quando uma unidade não bate no padrão esperado (não assumir presença silenciosamente; capítulos 1/8 sem "Defesa" provam que isso acontece de verdade).
