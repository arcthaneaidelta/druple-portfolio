import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CAPABILITIES } from '../data/capabilities'
import Diagram from './Diagrams'
import { prefersReducedMotion } from '../lib/shared'

gsap.registerPlugin(ScrollTrigger)

export default function Capabilities() {
  const section = useRef<HTMLElement>(null)
  const curtain = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(curtain.current, { clipPath: 'inset(50% 0% 50% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top 96%', end: 'top 18%', scrub: true },
      })
      gsap.from('[data-cap-title]', {
        yPercent: 105, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '[data-cap-title]', start: 'top 85%' },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} id="capabilities" aria-labelledby="cap-h" className="relative text-ivory">
      <div ref={curtain} className="absolute left-0 top-0 h-[100svh] w-full bg-ink" aria-hidden="true" />
      <div className="absolute left-0 top-[100svh] bottom-0 w-full bg-ink" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1800px] px-6 pb-[16svh] pt-[18svh] sm:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 id="cap-h" className="display overflow-hidden pb-[.05em] text-[clamp(2.8rem,8vw,10rem)]">
            <span data-cap-title className="block">What we build.</span>
          </h2>
          <p className="max-w-[22rem] text-[14px] leading-relaxed text-ash md:pb-3">
            Six disciplines, one engineering practice. Each one ships as production software, not a prototype.
          </p>
        </div>

        <ul className="mt-[10svh] border-t border-ivory/20" onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}>
          {CAPABILITIES.map((c, i) => {
            const open = active === i
            return (
              <li
                key={c.id}
                className="border-b border-ivory/20 transition-colors duration-500"
                style={{ backgroundColor: open ? '#ebe6da' : 'transparent', color: open ? '#080808' : '#ebe6da', ['--diagram-bg' as string]: open ? '#ebe6da' : '#080808' }}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
              >
                <button
                  id={`cap-btn-${c.id}`}
                  aria-expanded={open}
                  aria-controls={`cap-panel-${c.id}`}
                  data-cursor="INSPECT"
                  className="flex w-full items-center gap-5 px-2 py-5 text-left sm:gap-10 sm:px-6 md:py-6"
                  onFocus={() => setActive(i)}
                  onClick={(e) => {
                    if ((e.nativeEvent as PointerEvent).pointerType === 'mouse') return // hover already opens it
                    setActive(open ? null : i)
                  }}
                >
                  <span className="tiny w-8 shrink-0 tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
                  <span
                    className="display block text-[clamp(2rem,5.5vw,6rem)] transition-[font-weight,letter-spacing] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{ fontWeight: open ? 800 : 400, letterSpacing: open ? '.01em' : '-.005em' }}
                  >
                    {c.title}
                  </span>
                  <span aria-hidden="true" className="tiny ml-auto hidden self-center sm:block">{open ? '−' : '+'}</span>
                </button>

                <div
                  id={`cap-panel-${c.id}`}
                  role="region"
                  aria-labelledby={`cap-btn-${c.id}`}
                  aria-hidden={!open}
                  className="grid transition-[grid-template-rows] duration-[650ms] ease-[cubic-bezier(.76,0,.24,1)]"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="grid gap-8 px-2 pb-10 pt-2 sm:px-6 md:grid-cols-12 md:pb-14">
                      <p className="max-w-[26rem] text-[clamp(1.05rem,1.4vw,1.35rem)] leading-snug md:col-span-5 md:col-start-2">
                        {c.blurb}
                      </p>
                      <div className="h-[260px] md:col-span-5 md:col-start-7 md:h-[300px]">
                        <Diagram key={open ? 'on' : 'off'} kind={c.kind} />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
