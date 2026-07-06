/**
 * Loader por contrato — lê lessons/<slug>/lesson.json de fora do src/
 * (docs/lesson-contract-mvp-v1.md) e resolve:
 *   1. markdown.file + anchor de cada step (busca o .md e extrai a âncora)
 *   2. diagram.generatedModule (import dinâmico do .mjs compilado do pacote)
 *   3. diagram.defaultView
 *
 * O app não deve mais importar lesson.json/likec4-views.mjs direto do src/.
 */

const ANCHOR_RE = /<a id="([^"]+)"><\/a>/g

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`)
  return res.text()
}

// script.md (gerado na R3) tem, por step: `<a id="X"></a>`, uma linha
// `## {label}` (título estrutural do arquivo, não o conteúdo em si), uma
// linha em branco, e só então o `content` original do step. Aqui removemos
// esse título estrutural para recuperar exatamente o `content` original.
function extractAnchorSection(markdown, anchorId) {
  const matches = [...markdown.matchAll(ANCHOR_RE)]
  const idx = matches.findIndex(m => m[1] === anchorId)
  if (idx === -1) return null

  const start = matches[idx].index + matches[idx][0].length
  const end = idx + 1 < matches.length ? matches[idx + 1].index : markdown.length
  let section = markdown.slice(start, end).trim()

  const lines = section.split('\n')
  if (lines[0]?.startsWith('## ')) {
    let i = 1
    while (i < lines.length && lines[i].trim() === '') i++
    section = lines.slice(i).join('\n').trim()
  }
  return section
}

async function resolveStepMarkdown(step, base, markdownCache) {
  if (!step.markdown?.file) return step
  try {
    const fileUrl = `${base}/${step.markdown.file}`
    if (!markdownCache.has(fileUrl)) markdownCache.set(fileUrl, fetchText(fileUrl))
    const markdown = await markdownCache.get(fileUrl)
    const anchorId = step.markdown.anchor?.replace(/^#/, '')
    const resolved = anchorId ? extractAnchorSection(markdown, anchorId) : null
    return resolved ? { ...step, content: resolved } : step
  } catch {
    // fallback: mantém o content inline original (dual representation transicional,
    // docs/current-lesson-migration-mvp-v1.md)
    return step
  }
}

export async function loadLesson(slug) {
  const base = `/lessons/${slug}`
  const lesson = JSON.parse(await fetchText(`${base}/lesson.json`))

  const markdownCache = new Map()
  const steps = await Promise.all(
    lesson.steps.map(step => resolveStepMarkdown(step, base, markdownCache)),
  )

  const generatedModuleUrl = `/@fs/${__LESSONS_ROOT_ABS__}/${slug}/${lesson.diagram.generatedModule}`
  const { LikeC4View } = await import(/* @vite-ignore */ generatedModuleUrl)

  return {
    lesson: { ...lesson, steps },
    LikeC4View,
    defaultView: lesson.diagram?.defaultView ?? lesson.viewId,
  }
}
