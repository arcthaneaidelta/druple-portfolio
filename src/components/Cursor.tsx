import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { isCoarsePointer } from '../lib/shared'

/**
 * Custom cursor. Any element with data-cursor="LABEL" grows the circle and shows the label.
 * Disabled on touch devices. Uses difference blending so it reads on black and ivory.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isCoarsePointer() || !window.matchMedia('(hover: hover)').matches) return
    const el = dot.current!
    document.documentElement.classList.add('has-cursor')
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })
    const x = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3.out' })
    let shown = false

    const move = (e: PointerEvent) => {
      if (!shown) { gsap.set(el, { x: e.clientX, y: e.clientY }); gsap.to(el, { opacity: 1, duration: 0.3 }); shown = true }
      x(e.clientX); y(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      const text = t?.dataset.cursor
      if (text) {
        if (label.current) label.current.textContent = text
        gsap.to(el, { width: 88, height: 88, duration: 0.4, ease: 'expo.out' })
        gsap.to(label.current, { opacity: 1, duration: 0.25 })
      } else {
        gsap.to(el, { width: 12, height: 12, duration: 0.4, ease: 'expo.out' })
        gsap.to(label.current, { opacity: 0, duration: 0.15 })
      }
    }
    const leave = () => { gsap.to(el, { opacity: 0, duration: 0.2 }); shown = false }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('mouseleave', leave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[150] flex items-center justify-center rounded-full bg-white text-black"
      style={{ width: 12, height: 12, opacity: 0, mixBlendMode: 'difference' }}
    >
      <span ref={label} className="tiny opacity-0 !text-[10px]" style={{ color: '#000' }} />
    </div>
  )
}
