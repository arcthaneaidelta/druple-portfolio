# Arcthane AI — Immersive Engineering Portfolio (vertical slice)

React + TypeScript + Vite + Tailwind + GSAP/ScrollTrigger + Lenis + Framer Motion + Three.js (R3F/Drei).
Frontend only. No backend, no env vars, no external services (fonts are self-hosted via Fontsource).

```
npm install
npm run dev
npm run build     # → dist/  (Netlify: build `npm run build`, publish `dist`)
```

## Built in this pass
- Preloader (progress bar, system messages, compress-to-centre exit, Skip)
- Sticky/shrinking nav + fullscreen mobile menu
- Custom cursor (`data-cursor="VIEW|EXPLORE|OPEN|INSPECT"`; disabled on touch)
- Hero: fitted display type, per-line entrance, cursor-reactive type, live grid readout
- Hero 3D: five-layer network structure, leans toward cursor, scroll disassembles it into
  AI / SOFTWARE / AUTOMATION / DATA / SYSTEMS, then dissolves (lazy-loaded chunk)
- 2D fallback for mobile, tablets, touch, low core-count and reduced-motion
- Intro: black→ivory curtain, scroll-scrubbed word reveal (one word stays offset)
- Capabilities: six giant rows, hover/focus/tap expands with an animated SVG diagram each
- Contact teaser + footer

## Not yet built (next passes)
Work case studies, System horizontal timeline, Tech constellation, Architecture, Data Core,
Philosophy, How We Think, The Lab, Stats, About, Globe, contact panel, sound toggle.
Nav links Work / Approach / About are placeholders until those sections exist.

## Structure
- `src/components/` — Preloader, Nav, Cursor, Hero, HeroScene (3D), Intro, Capabilities, Diagrams, Footer
- `src/lib/shared.ts` — pointer/scroll state shared with rAF loops, capability detection
- `src/data/` — hardcoded content
