import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_LINKS } from '../data/nav'
import { scrollToHash } from '../lib/scrollTo'

export default function Nav({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 48)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollToHash(href), open ? 350 : 0)
  }

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[80] border-b transition-[background-color,border-color,height,opacity] duration-500"
        style={{
          height: scrolled ? 56 : 84,
          opacity: visible ? 1 : 0,
          backgroundColor: scrolled ? 'rgba(8,8,8,.92)' : 'rgba(8,8,8,0)',
          borderColor: scrolled ? 'rgba(235,230,218,.16)' : 'rgba(235,230,218,.12)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
        }}
      >
        <nav aria-label="Primary" className="mx-auto flex h-full max-w-[1800px] items-center justify-between px-6 sm:px-10">
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); scrollToHash('#top') }}
            className="display text-[1.55rem] tracking-[.06em] transition-[font-size] duration-500"
            style={{ fontSize: scrolled ? '1.3rem' : '1.7rem' }}
            data-cursor="TOP"
          >
            Arcthane
          </a>

          <ul className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className="tiny group relative py-2 transition-[letter-spacing] duration-500"
                  style={{ letterSpacing: scrolled ? '.06em' : '.12em' }}
                >
                  {l.label}
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ivory transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <a
              href="#contact"
              onClick={(e) => go(e, '#contact')}
              data-cursor="OPEN"
              className="tiny hidden border border-ivory/40 px-4 py-2 transition-colors duration-300 hover:bg-ivory hover:text-ink md:inline-block"
            >
              Let’s talk ↗
            </a>
            <button
              className="tiny md:hidden -mr-2 px-2 py-3"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[75] flex flex-col justify-between bg-ink px-6 pb-10 pt-28 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul>
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  className="border-b border-ivory/15"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.06 } }}
                >
                  <a href={l.href} onClick={(e) => go(e, l.href)} className="display block py-4 text-[16vw]">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href="#contact" onClick={(e) => go(e, '#contact')} className="tiny border border-ivory/40 py-4 text-center">
              Let’s talk ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
