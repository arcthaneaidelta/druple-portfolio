import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { canUse3D, heroProgress, pointer, prefersReducedMotion, smooth } from '../lib/shared'

gsap.registerPlugin(ScrollTrigger)
const HeroScene = lazy(() => import('./HeroScene'))

const LAYERS = ['AI', 'SOFTWARE', 'AUTOMATION', 'DATA', 'SYSTEMS']

/** Light 2D composition for phones, tablets, reduced motion and low-power devices. */
function Hero2D({ groups, labels }: { groups: React.MutableRefObject<(SVGGElement | null)[]>; labels: React.MutableRefObject<(SVGTextElement | null)[]> }) {
  return (
    <svg viewBox="0 0 400 520" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g transform="translate(200 270)" fill="none" stroke="#ebe6da" strokeWidth=".7">
        {LAYERS.map((name, i) => (
          <g key={name} ref={(el) => { groups.current[i] = el }}>
            {[150, 112, 74, 36].map((rx) => (
              <ellipse key={rx} rx={rx} ry={rx * 0.34} opacity={0.18 + (rx < 80 ? 0.15 : 0)} />
            ))}
            {Array.from({ length: 12 }).map((_, k) => {
              const a = (k / 12) * Math.PI * 2
              return <line key={k} x1={Math.cos(a) * 36} y1={Math.sin(a) * 12} x2={Math.cos(a) * 150} y2={Math.sin(a) * 51} opacity=".14" />
            })}
            {Array.from({ length: 12 }).map((_, k) => {
              const a = (k / 12) * Math.PI * 2
              return <circle key={k} cx={Math.cos(a) * 150} cy={Math.sin(a) * 51} r="1.6" fill="#ebe6da" stroke="none" />
            })}
            <text
              ref={(el) => { labels.current[i] = el }}
              x="0" y="62" textAnchor="middle" fill="#ebe6da" stroke="none" opacity="0"
              style={{ font: "10px 'IBM Plex Mono', monospace", letterSpacing: '.1em' }}
            >
              {name}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export default function Hero({ start }: { start: boolean }) {
  const wrap = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLHeadingElement>(null)
  const micro = useRef<HTMLDivElement>(null)
  const coord = useRef<HTMLSpanElement>(null)
  const g2 = useRef<(SVGGElement | null)[]>([])
  const l2 = useRef<(SVGTextElement | null)[]>([])
  const [use3D] = useState(canUse3D)
  const [compact, setCompact] = useState(() => window.innerWidth < 700)
  const [active, setActive] = useState(true)

  const lines = compact ? ['WE BUILD', 'WHAT COMES', 'NEXT.'] : ['WE BUILD', 'WHAT COMES NEXT.']

  useEffect(() => {
    const on = () => setCompact(window.innerWidth < 700)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  // Fit each headline line to the container width so the type dominates the frame.
  useLayoutEffect(() => {
    const fit = () => {
      const box = head.current
      if (!box) return
      const W = box.clientWidth
      const els = Array.from(box.querySelectorAll<HTMLElement>('[data-fit]'))
      const sizes = els.map((el) => {
        el.style.fontSize = '100px'
        const inner = el.querySelector<HTMLElement>('[data-enter]')!
        return (100 * W * 0.985) / inner.getBoundingClientRect().width
      })
      const totalH = sizes.reduce((a, s) => a + s * 0.84, 0)
      const maxH = window.innerHeight * (compact ? 0.44 : 0.52)
      const k = Math.min(1, maxH / totalH)
      els.forEach((el, i) => { el.style.fontSize = `${sizes[i] * k}px` })
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [compact])

  // Scroll: progress drives 3D (or 2D fallback) and fades the headline.
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress
          heroProgress.value = p
          if (!use3D) {
            const e = smooth(0.12, 0.6, p), f = smooth(0.85, 1, p)
            g2.current.forEach((g, i) => {
              if (!g) return
              const d = i - 2
              gsap.set(g, { y: d * (16 + e * 62), opacity: 1 - f, scale: 1 - 0.1 * e })
            })
            l2.current.forEach((t) => t && gsap.set(t, { opacity: smooth(0.6, 0.85, p) * (1 - f) }))
          }
        },
        onToggle: (self) => setActive(self.isActive || self.progress < 0.02),
      })
      gsap.to([head.current, micro.current], {
        opacity: 0, yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: 'top top', end: '+=55%', scrub: true },
      })
    }, wrap)
    return () => ctx.revert()
  }, [use3D])

  // Entrance: line 1 rises, line 2 slides in laterally, then cursor response is enabled.
  useLayoutEffect(() => {
    gsap.set('[data-enter]', { opacity: 0 })
    gsap.set('[data-micro]', { opacity: 0 })
  }, [])

  useEffect(() => {
    if (!start) return
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      const els = gsap.utils.toArray<HTMLElement>('[data-enter]')
      els.forEach((el, i) => {
        if (reduced) { tl.set(el, { opacity: 1 }); return }
        if (i === 0) tl.fromTo(el, { yPercent: 108, opacity: 1 }, { yPercent: 0, duration: 1.4 }, 0)
        else tl.fromTo(el, { xPercent: i % 2 ? -14 : 14, yPercent: 0, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.5 }, 0.18 * i + 0.2)
      })
      tl.to('[data-micro]', { opacity: 1, duration: 1, stagger: 0.12 }, 0.9)
    }, wrap)
    return () => ctx.revert()
  }, [start, compact])

  // Cursor-reactive typography + live grid readout.
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const reduced = prefersReducedMotion()
    const wrappers = Array.from(head.current?.querySelectorAll<HTMLElement>('[data-par]') ?? [])
    const qx = wrappers.map((w) => gsap.quickTo(w, 'x', { duration: 0.9, ease: 'power3.out' }))
    const qy = wrappers.map((w) => gsap.quickTo(w, 'y', { duration: 0.9, ease: 'power3.out' }))
    let raf = 0
    const move = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0
        if (coord.current) coord.current.textContent = `X ${((pointer.x + 1) / 2).toFixed(3)}  Y ${((1 - pointer.y) / 2).toFixed(3)}`
      })
      if (reduced) return
      wrappers.forEach((_, i) => {
        const dir = i % 2 ? -1 : 1
        qx[i](pointer.x * 22 * dir)
        qy[i](-pointer.y * 9 * dir)
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [compact])

  return (
    <section
      id="top"
      ref={wrap}
      aria-label="Introduction"
      className="relative"
      style={{ height: use3D ? '340vh' : '260vh' }}
    >
      <div
        ref={stage}
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 42%, #151514 0%, #080808 68%)' }}
      >
        {/* architectural grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(235,230,218,.06) 1px, transparent 1px)',
            backgroundSize: '25% 100%',
          }}
        />

        {use3D ? (
          <Suspense fallback={null}>
            <HeroScene start={start} active={active} />
          </Suspense>
        ) : (
          <Hero2D groups={g2} labels={l2} />
        )}

        <div className="absolute inset-0 flex items-center px-6 sm:px-10">
          <h1 ref={head} className="display w-full text-ivory" aria-label="We build what comes next.">
            {lines.map((t, i) => (
              <span
                key={t}
                data-fit
                className="-mx-6 block overflow-hidden px-6 sm:-mx-10 sm:px-10"
                style={{ paddingTop: '.14em', marginTop: '-.14em', paddingBottom: '.1em', marginBottom: '-.1em' }}
                aria-hidden="true"
              >
                <span data-par className="block will-change-transform">
                  <span data-enter className="inline-block whitespace-nowrap">{t}</span>
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div ref={micro} className="pointer-events-none absolute inset-0">
          <ul data-micro className="tiny absolute bottom-10 left-6 space-y-1.5 sm:left-10">
            <li>AI Systems</li>
            <li>Custom Software</li>
            <li>Automation</li>
            <li>Digital Infrastructure</li>
          </ul>
          <p data-micro className="tiny absolute bottom-8 right-6 hidden sm:right-10 sm:block">Scroll to explore ↓</p>
          <div data-micro className="tiny absolute right-6 top-24 hidden text-right leading-[1.9] text-ash sm:right-10 md:block" aria-hidden="true">
            <p>31°32′ N</p>
            <p>74°21′ E</p>
            <p>System / 01</p>
            <p><span ref={coord}>X 0.500  Y 0.500</span></p>
          </div>
        </div>
      </div>
    </section>
  )
}
