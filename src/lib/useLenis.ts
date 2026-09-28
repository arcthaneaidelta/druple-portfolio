import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './shared'

gsap.registerPlugin(ScrollTrigger)

export let lenis: Lenis | null = null

/** Smooth scroll bound to GSAP's ticker so ScrollTrigger stays in sync. */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenis = instance
    instance.stop() // released by the preloader
    const onScroll = () => ScrollTrigger.update()
    instance.on('scroll', onScroll)
    const tick = (t: number) => instance.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [])
}
