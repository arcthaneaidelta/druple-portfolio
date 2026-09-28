// Mutable shared state read inside rAF loops (kept outside React to avoid re-renders).
export const pointer = { x: 0, y: 0, px: 0, py: 0 }
export const heroProgress = { value: 0 }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/** Decide if the heavy WebGL hero should run. Otherwise a 2D composition is used. */
export const canUse3D = () => {
  if (typeof window === 'undefined') return false
  const cores = navigator.hardwareConcurrency ?? 8
  return window.innerWidth >= 1024 && !isCoarsePointer() && !prefersReducedMotion() && cores >= 4
}

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
