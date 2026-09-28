import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Capabilities from './components/Capabilities'
import Footer from './components/Footer'
import { lenis, useLenis } from './lib/useLenis'

export default function App() {
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)
  useLenis()

  const onDone = useCallback(() => {
    setDone(true)
    lenis?.start()
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <a href="#main" className="skip-link tiny">Skip to content</a>
      <Cursor />
      {!done && <Preloader onReveal={() => setRevealed(true)} onDone={onDone} />}
      <Nav visible={revealed} />
      <main>
        <Hero start={revealed} />
        <Intro />
        <Capabilities />
      </main>
      <Footer />
    </>
  )
}
