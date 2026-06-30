/**
 * DiagramController — filho de <LikeC4View> para acessar useDiagram().
 *
 * Story 4: controla o walkthrough NATIVO da dynamic view `flow`.
 * - preset "overview"          → fitDiagram (intro)
 * - preset "walkthrough-start" → startWalkthrough()
 * - preset "walkthrough"       → walkthroughStep(dir) por delta
 * - preset "consolidate"       → stopWalkthrough() + fitDiagram
 *
 * walkthroughActive ref garante que scroll reverso pós-consolidate
 * reinicia o walkthrough na posição correta, sem quebrar.
 */
import { useEffect, useRef } from 'react'
import { useDiagram } from 'likec4/react'

export default function DiagramController({ stepIdx, steps }) {
  const api = useDiagram()
  const prevIdx = useRef(-1)
  const walkthroughActive = useRef(false)

  useEffect(() => {
    if (!api) return
    const prev = prevIdx.current
    prevIdx.current = stepIdx
    if (prev === stepIdx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay = reducedMotion ? 0 : 80

    const t = setTimeout(() => {
      const preset = steps[stepIdx]?.camera?.preset ?? 'overview'
      const direction = stepIdx > prev ? 'next' : 'previous'
      const delta = Math.abs(stepIdx - (prev < 0 ? stepIdx : prev))
      const walkthroughStartIdx = steps.findIndex(s => s.camera?.preset === 'walkthrough-start')

      if (preset === 'overview') {
        if (walkthroughActive.current) {
          api.stopWalkthrough()
          walkthroughActive.current = false
        }
        api.fitDiagram(reducedMotion ? 0 : 400)

      } else if (preset === 'walkthrough-start') {
        api.startWalkthrough()
        walkthroughActive.current = true

      } else if (preset === 'walkthrough') {
        if (!walkthroughActive.current) {
          // Reinicia o walkthrough (vindo do consolidate ou cold-start)
          api.startWalkthrough()
          walkthroughActive.current = true
          const stepsToAdvance = stepIdx - walkthroughStartIdx
          for (let i = 0; i < stepsToAdvance; i++) api.walkthroughStep('next')
        } else {
          for (let i = 0; i < delta; i++) api.walkthroughStep(direction)
        }

      } else if (preset === 'consolidate') {
        if (walkthroughActive.current) {
          api.stopWalkthrough()
          walkthroughActive.current = false
        }
        api.fitDiagram(reducedMotion ? 0 : 400)
      }
    }, delay)

    return () => clearTimeout(t)
  }, [stepIdx, api, steps])

  return null
}
