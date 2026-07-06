/**
 * Story 4 — Walkthrough nativo da dynamic view `flow`
 * P14: IntersectionObserver trigger ao centro do viewport
 * P15: Scroll nativo — sem jacking
 * P16: Diagrama sticky à direita, texto scrolla à esquerda
 * P28: prefers-reduced-motion via CSS
 * P29: índice de steps clicável no header
 *
 * Diferença central vs Story 3:
 * - Uma única LikeC4View (viewId="flow" fixo, sem key por step)
 * - Câmera controlada por api.startWalkthrough() / walkthroughStep()
 * - Nunca troca viewId — percorre o caminho do fluxo aresta por aresta
 */
import { useState, useEffect, useRef, useCallback, memo } from 'react'
import DiagramController from './DiagramController'
import { marked } from 'marked'
import { loadLesson } from './lessonLoader'
import './App.css'

const LESSON_SLUG = 'mind-task-flow'

export default function App() {
  const [loaded, setLoaded] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const sectionRefs = useRef([])
  const scrollRef = useRef(null)
  const ignoreIO = useRef(false)

  // ── Loader por contrato: lesson.json fora do src/, resolvendo markdown+anchor
  //    e o módulo compilado do diagrama (docs/lesson-contract-mvp-v1.md)
  useEffect(() => {
    let cancelled = false
    loadLesson(LESSON_SLUG)
      .then(result => { if (!cancelled) setLoaded(result) })
      .catch(err => { if (!cancelled) setLoadError(err) })
    return () => { cancelled = true }
  }, [])

  const steps = loaded?.lesson.steps ?? []

  // ── IntersectionObserver: trigger ao centro do viewport (P17)
  useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean)
    if (!sections.length) return

    const io = new IntersectionObserver(
      (entries) => {
        if (ignoreIO.current) return
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx)
            setActiveIdx(idx)
          }
        })
      },
      { root: scrollRef.current, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )
    sections.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [steps.length])

  // ── Goto: scroll programático + suprime IO brevemente
  const goto = useCallback((idx) => {
    setMenuOpen(false)
    setActiveIdx(idx)
    ignoreIO.current = true
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => { ignoreIO.current = false }, 800)
  }, [])

  const prev = useCallback(() => goto(Math.max(0, activeIdx - 1)), [activeIdx, goto])
  const next = useCallback(() => goto(Math.min(steps.length - 1, activeIdx + 1)), [activeIdx, goto, steps.length])

  if (loadError) {
    return (
      <div style={{ ...rootStyle, alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#f44747' }}>Erro ao carregar a aula: {loadError.message}</p>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div style={{ ...rootStyle, alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#555' }}>Carregando…</p>
      </div>
    )
  }

  const { lesson, LikeC4View, defaultView } = loaded
  const step = steps[activeIdx]

  return (
    <div style={rootStyle}>
      {/* ── Header ── */}
      <header style={headerStyle}>
        <div style={brandStyle}>
          <BrandIcon />
          <span style={brandWordStyle}>Lousa de Arquitetura</span>
        </div>
        <span style={sepStyle}>|</span>
        <span style={lessonTitleStyle}>{lesson.title}</span>

        {/* Índice clicável (P29) */}
        <nav style={navStyle} aria-label="Índice da aula">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goto(i)}
              title={s.label}
              aria-current={i === activeIdx ? 'step' : undefined}
              style={{ ...dotBtnStyle, background: i === activeIdx ? '#4da3e8' : 'rgba(255,255,255,0.14)', boxShadow: i === activeIdx ? '0 0 7px #4da3e870' : 'none' }}
            />
          ))}
        </nav>

        {/* Setas complementares (P6: aluno controla ritmo) */}
        <div style={arrowsStyle}>
          <button style={arrowBtnStyle} onClick={prev} disabled={activeIdx === 0} aria-label="Anterior">←</button>
          <span style={counterStyle}>{activeIdx + 1} / {steps.length}</span>
          <button style={arrowBtnStyle} onClick={next} disabled={activeIdx === steps.length - 1} aria-label="Próximo">→</button>
        </div>
      </header>

      {/* ── Body: esquerda scrolla, direita sticky ── */}
      <div style={bodyStyle}>
        {/* Coluna esquerda: texto scrollável */}
        <div ref={scrollRef} style={leftStyle}>
          {steps.map((s, i) => (
            <section
              key={s.id}
              data-idx={i}
              ref={el => { sectionRefs.current[i] = el }}
              style={{ ...sectionStyle, borderLeft: i === activeIdx ? '3px solid #4da3e8' : '3px solid transparent' }}
            >
              <StepLabel label={s.label} active={i === activeIdx} />
              <div
                className="md-body"
                dangerouslySetInnerHTML={{ __html: marked.parse(s.content) }}
              />
            </section>
          ))}
          <div style={endPadStyle} />
        </div>

        {/* CTA: botão "Recomeçar" — slide-up fixo quando na última step */}
        <RestartCTA visible={activeIdx === steps.length - 1} onRestart={() => goto(0)} />

        {/* Coluna direita: UMA única LikeC4View, viewId fixo, sem key */}
        <div style={rightStyle}>
          <div style={viewLabelStyle}>
            LikeC4 — <span style={{color:'#4da3e8'}}>{defaultView}</span>
            <span style={stepHintStyle}>step {activeIdx + 1} / {steps.length}</span>
          </div>
          <div style={diagramWrapStyle}>
            <LikeC4View
              viewId={defaultView}
              style={{ width: '100%', height: '100%' }}
              controls={false}
              fitView
              pannable
              zoomable
              enableFocusMode
              enableDynamicViewWalkthrough
            >
              <DiagramController stepIdx={activeIdx} steps={steps} />
            </LikeC4View>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepLabel({ label, active }) {
  return (
    <div style={{ ...stepLabelStyle, color: active ? '#4da3e8' : '#333', transition: 'color .3s' }}>
      {label}
    </div>
  )
}

const RestartCTA = memo(function RestartCTA({ visible, onRestart }) {
  return (
    <div style={{ ...ctaContainerStyle, transform: visible ? 'translateY(0)' : 'translateY(120%)', opacity: visible ? 1 : 0 }}>
      <button onClick={onRestart} style={ctaBtnStyle} aria-label="Recomeçar do início">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        Recomeçar
      </button>
    </div>
  )
})

function BrandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="2" rx="1" fill="#4da3e8"/>
      <rect x="3" y="7" width="18" height="2" rx="1" fill="#4da3e8" opacity=".8"/>
      <rect x="3" y="11" width="12" height="2" rx="1" fill="#4da3e8" opacity=".6"/>
      <rect x="3" y="15" width="8" height="2" rx="1" fill="#ff8a3d" opacity=".9"/>
    </svg>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const rootStyle = {
  display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
  fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  background: '#0f0f0f', color: '#c8c8c8', fontSize: 13,
}
const headerStyle = {
  background: '#1a1a1a', borderBottom: '1px solid #282828',
  padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 10,
  flexShrink: 0, minHeight: 38,
}
const brandStyle = { display: 'flex', alignItems: 'center', gap: 7, userSelect: 'none', flexShrink: 0 }
const brandWordStyle = {
  fontSize: 14, fontWeight: 700,
  background: 'linear-gradient(100deg,#ff8a3d 0%,#ffd166 28%,#4da3e8 60%,#ff8a3d 100%)',
  backgroundSize: '280% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', animation: 'brandFlow 9s linear infinite',
}
const sepStyle = { color: '#282828', flexShrink: 0 }
const lessonTitleStyle = { fontSize: 11, color: '#444', flexShrink: 0 }
const navStyle = { display: 'flex', gap: 5, alignItems: 'center', marginLeft: 'auto' }
const dotBtnStyle = {
  width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
  padding: 0, transition: 'background .2s, box-shadow .2s',
}
const arrowsStyle = { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 12 }
const arrowBtnStyle = {
  background: 'none', border: '1px solid #333', color: '#c8c8c8',
  borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 14,
  lineHeight: 1.4, transition: 'opacity .15s',
}
const counterStyle = { fontSize: 10, color: '#444', minWidth: 36, textAlign: 'center' }
const stepHintStyle = { marginLeft: 'auto', fontSize: 10, color: '#333' }

const bodyStyle = { display: 'flex', flex: 1, overflow: 'hidden' }

const leftStyle = {
  width: '44%', minWidth: 280, maxWidth: 600,
  overflowY: 'auto', flexShrink: 0,
  background: '#0f0f0f',
}
const sectionStyle = {
  padding: '80px 52px 60px 40px',
  minHeight: '85vh',
  transition: 'border-color .3s',
}
const stepLabelStyle = {
  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '.12em', marginBottom: 28,
}
const endPadStyle = { height: '50vh' }

const rightStyle = {
  flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
  borderLeft: '1px solid #1e1e1e',
}
const viewLabelStyle = {
  padding: '4px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '.1em', color: '#333', background: '#1a1a1a',
  borderBottom: '1px solid #282828', flexShrink: 0,
  display: 'flex', alignItems: 'center',
}
const diagramWrapStyle = { flex: 1, position: 'relative', overflow: 'hidden' }

// CTA "Recomeçar" — fixed ao bottom da coluna esquerda, slide-up/down
const ctaContainerStyle = {
  position: 'fixed',
  bottom: 28,
  left: 0,
  width: '44%',
  maxWidth: 600,
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'auto',
  transition: 'transform 0.42s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
  zIndex: 50,
}
const ctaBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 22px',
  background: 'linear-gradient(135deg, #1a2a3a 0%, #1e3448 100%)',
  color: '#4da3e8',
  border: '1px solid #2a4a6a',
  borderRadius: 32,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '.06em',
  cursor: 'pointer',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(77,163,232,0.12)',
  backdropFilter: 'blur(8px)',
  transition: 'background .2s, box-shadow .2s, transform .15s',
}
