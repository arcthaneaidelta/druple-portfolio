import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/shared'

const BAR = 24
const MESSAGES: [number, string][] = [
  [0, 'LOADING EXPERIENCE'],
  [26, 'CALIBRATING INTERFACE'],
  [56, 'INITIALIZING SYSTEMS'],
  [86, 'ESTABLISHING CONNECTION'],
]

interface Props {
  onReveal: () => void // hero may start animating
  onDone: () => void // overlay removed, scrolling released
}

export default function Preloader({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const msg = useRef<HTMLSpanElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const finishing = useRef(false)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    document.documentElement.style.overflow = 'hidden'
    const state = { v: 0 }
    let lastMsg = -1

    const paint = () => {
      const v = Math.round(state.v)
      const filled = Math.round((v / 100) * BAR)
      if (bar.current) bar.current.textContent = `[${'█'.repeat(filled)}${'░'.repeat(BAR - filled)}] ${String(v).padStart(2, '0')}%`
      let idx = 0
      MESSAGES.forEach(([t], i) => { if (v >= t) idx = i })
      if (idx !== lastMsg && msg.current) { msg.current.textContent = MESSAGES[idx][1]; lastMsg = idx }
    }

    const ctx = gsap.context(() => {
      const t = gsap.timeline()
      tl.current = t
      // Intro of the mark
      t.from('[data-pre="mark"]', { yPercent: 110, duration: 0.9, ease: 'expo.out' }, 0.15)
        .from('[data-pre="fade"]', { opacity: 0, duration: 0.8, stagger: 0.12 }, 0.5)
      // Progress with stalls, like a real boot sequence
      const total = reduced ? 1 : 5.2
      t.to(state, { v: 34, duration: total * 0.3, ease: 'power2.out', onUpdate: paint }, 0.4)
        .to(state, { v: 71, duration: total * 0.3, ease: 'power1.inOut', onUpdate: paint })
        .to(state, { v: 92, duration: total * 0.25, ease: 'power1.in', onUpdate: paint })
        .to(state, { v: 100, duration: total * 0.15, ease: 'expo.out', onUpdate: paint })
        .add(() => finish(false))
      paint()
    }, root)

    return () => { ctx.revert(); tl.current?.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const finish = (fast: boolean) => {
    if (finishing.current) return
    finishing.current = true
    const reduced = prefersReducedMotion()
    tl.current?.pause()
    const el = root.current
    if (!el) return
    const k = fast ? 0.55 : 1
    if (bar.current) bar.current.textContent = `[${'█'.repeat(BAR)}] 100%`
    const out = gsap.timeline({
      onComplete: () => { document.documentElement.style.overflow = ''; onDone() },
    })
    if (reduced) {
      out.add(onReveal).to(el, { opacity: 0, duration: 0.4 })
      return
    }
    out
      // the interface compresses toward the centre …
      .to(content.current, { scaleY: 0.004, duration: 0.5 * k, ease: 'expo.in', transformOrigin: '50% 50%' })
      .to(content.current, { scaleX: 0, duration: 0.25 * k, ease: 'power3.in' })
      // … the black field collapses to a line …
      .to(el, { clipPath: 'inset(50% 0% 50% 0%)', duration: 0.7 * k, ease: 'expo.inOut' }, '>-0.05')
      .add(onReveal, '<0.25')
      // … and the line closes.
      .to(el, { clipPath: 'inset(50% 50% 50% 50%)', duration: 0.35 * k, ease: 'expo.in' })
  }

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading Arcthane AI"
      className="fixed inset-0 z-[120] bg-ink text-ivory"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div ref={content} className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="overflow-hidden">
          <p data-pre="mark" className="display text-[clamp(2.4rem,7vw,6rem)] pb-[.08em]">Arcthane AI</p>
        </div>
        <p data-pre="fade" className="tiny mt-6 text-ash">System initializing</p>
        <p data-pre="fade" className="tiny mt-10 tabular-nums" aria-hidden="true">
          <span ref={bar} />
        </p>
        <p data-pre="fade" className="tiny mt-3 text-ash h-4" aria-live="off">
          <span ref={msg} />
        </p>
      </div>
      <button
        onClick={() => finish(true)}
        data-cursor="SKIP"
        className="tiny absolute bottom-8 right-6 sm:right-10 border-b border-ivory/40 pb-1 hover:border-ivory transition-colors"
      >
        Skip
      </button>
      <span className="tiny absolute bottom-8 left-6 sm:left-10 text-ash">Build 2026.09</span>
    </div>
  )
}
