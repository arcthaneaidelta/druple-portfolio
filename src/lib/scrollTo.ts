import { lenis } from './useLenis'

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash)
  if (!el) return
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -40, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
