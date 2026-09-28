import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitWords from './SplitWords'
import { prefersReducedMotion } from '../lib/shared'

gsap.registerPlugin(ScrollTrigger)

export default function Intro() {
  const section = useRef<HTMLElement>(null)
  const curtain = useRef<HTMLDivElement>(null)
  const statement = useRef<HTMLHeadingElement>(null)
  const body = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      // Black → ivory: the field opens from a single horizontal line, echoing the preloader collapse.
      gsap.fromTo(curtain.current, { clipPath: 'inset(50% 0% 50% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top 96%', end: 'top 18%', scrub: true },
      })
      const words = (el: HTMLElement | null) => Array.from(el?.querySelectorAll<HTMLElement>('[data-word]') ?? [])
      gsap.set(words(statement.current), { opacity: 0.12, yPercent: 24 })
      gsap.to(words(statement.current), {
        opacity: 1,
        yPercent: (_i: number, el: HTMLElement) => (el.dataset.offset ? 12 : 0), // one word stays out of line
        stagger: 0.12, ease: 'none',
        scrollTrigger: { trigger: statement.current, start: 'top 80%', end: 'bottom 48%', scrub: 0.6 },
      })
      gsap.set(words(body.current), { opacity: 0.14 })
      gsap.to(words(body.current), {
        opacity: 1, stagger: 0.06, ease: 'none',
        scrollTrigger: { trigger: body.current, start: 'top 88%', end: 'bottom 62%', scrub: 0.5 },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} id="main" className="relative text-ink" aria-labelledby="intro-h">
      <div ref={curtain} className="absolute left-0 top-0 h-[100svh] w-full bg-ivory" aria-hidden="true" />
      <div className="absolute left-0 top-[100svh] bottom-0 w-full bg-ivory" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1800px] px-6 pb-[22svh] pt-[22svh] sm:px-10">
        <h2 id="intro-h" ref={statement} className="display text-[clamp(2.8rem,8.5vw,9rem)] !normal-case !leading-[.88]">
          <SplitWords text="Complex businesses deserve simple systems." offsetWord="simple" />
        </h2>

        <div className="mt-[8svh] grid grid-cols-12 gap-x-6">
          <p ref={body} className="col-span-12 max-w-[34rem] text-[clamp(1.05rem,1.45vw,1.35rem)] leading-[1.5] md:col-span-5 md:col-start-8">
            <SplitWords text="Arcthane AI designs and builds intelligent software, automation systems and digital infrastructure that transform complicated operations into scalable technology." />
          </p>
        </div>
      </div>
    </section>
  )
}
