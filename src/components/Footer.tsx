export default function Footer() {
  return (
    <>
      <section id="contact" aria-labelledby="contact-h" className="relative bg-ink px-6 pb-[14svh] pt-[14svh] sm:px-10">
        <div className="mx-auto max-w-[1800px] border-t border-ivory/20 pt-[10svh]">
          <h2 id="contact-h" className="display text-[clamp(2.8rem,9vw,11rem)]">
            Have a<br />hard problem?
          </h2>
          <p className="mt-8 max-w-[28rem] text-[clamp(1rem,1.35vw,1.3rem)] leading-relaxed text-ivory/70">
            Let’s build the system that solves it.
          </p>
        </div>
      </section>

      <footer className="border-t border-ivory/15 bg-ink px-6 pb-8 pt-12 sm:px-10">
        <div className="mx-auto grid max-w-[1800px] gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="display text-3xl">Arcthane AI</p>
            <p className="tiny mt-4 text-ash">Intelligent systems.<br />Engineered for impact.</p>
          </div>
          <nav aria-label="Footer" className="md:col-span-6">
            <ul className="tiny flex flex-wrap gap-x-10 gap-y-3 md:justify-end">
              {['Work', 'Capabilities', 'About', 'Contact'].map((l) => (
                <li key={l}><a href={`#${l.toLowerCase()}`} className="border-b border-transparent pb-1 hover:border-ivory">{l}</a></li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="tiny mx-auto mt-16 flex max-w-[1800px] flex-wrap justify-between gap-4 text-ash">
          <span>© 2026 Arcthane AI</span>
          <span>System status: online</span>
          <span>Build: 2026.09</span>
        </div>
      </footer>
    </>
  )
}
