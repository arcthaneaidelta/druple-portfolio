import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { heroProgress, pointer, smooth } from '../lib/shared'

const LAYERS = ['AI', 'SOFTWARE', 'AUTOMATION', 'DATA', 'SYSTEMS']
const GAP = 0.42
const IVORY = '#ebe6da'

function rng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/** One horizontal strata of the system: concentric node rings, spokes, chords, data points. */
function buildLayer(index: number) {
  const rand = rng(7919 + index * 104729)
  const radii = [0.55, 1.15, 1.75, 2.35, 2.95]
  const counts = [6, 11, 16, 22, 28]
  const rings: THREE.Vector3[][] = []
  radii.forEach((r, k) => {
    const ring: THREE.Vector3[] = []
    const aligned = k >= 3 // outer rings line up across layers so connectors meet cleanly
    const a0 = aligned ? 0 : rand() * Math.PI * 2
    for (let i = 0; i < counts[k]; i++) {
      const j = aligned ? 0 : 1
      const th = a0 + (i / counts[k]) * Math.PI * 2 + (rand() - 0.5) * 0.18 * j
      const rad = r * (1 + (rand() - 0.5) * 0.1 * j)
      const y = Math.sin(th * (2 + index) + k) * 0.045
      ring.push(new THREE.Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad))
    }
    rings.push(ring)
  })

  const seg: number[] = []
  const push = (a: THREE.Vector3, b: THREE.Vector3) => seg.push(a.x, a.y, a.z, b.x, b.y, b.z)
  const centre = new THREE.Vector3()
  rings[0].forEach((n) => push(centre, n))
  rings.forEach((ring, k) => {
    ring.forEach((n, i) => {
      push(n, ring[(i + 1) % ring.length])
      if (k > 0) {
        const prev = rings[k - 1]
        let best = prev[0], bd = Infinity
        prev.forEach((p) => { const d = p.distanceToSquared(n); if (d < bd) { bd = d; best = p } })
        push(n, best)
        if (rand() < 0.35) push(n, prev[Math.floor(rand() * prev.length)])
      }
    })
  })

  const nodes: number[] = [0, 0, 0]
  rings.forEach((ring) => ring.forEach((n) => nodes.push(n.x, n.y, n.z)))

  const data: number[] = []
  for (let i = 0; i < 70; i++) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 3.1
    data.push(Math.cos(a) * r, (rand() - 0.5) * 0.14, Math.sin(a) * r)
  }

  const conn: number[] = []
  if (index < LAYERS.length - 1) {
    rings[4].forEach((n, i) => { if (i % 2 === 0) conn.push(n.x, n.y, n.z, n.x, n.y + GAP, n.z) })
    rings[3].forEach((n, i) => { if (i % 3 === 0) conn.push(n.x, n.y, n.z, n.x, n.y + GAP, n.z) })
  }

  const mk = (arr: number[]) => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3))
    return g
  }
  return { lines: mk(seg), nodes: mk(nodes), data: mk(data), conn: mk(conn) }
}

type LayerGeo = ReturnType<typeof buildLayer>

function Layer({ index, geo, startRef }: { index: number; geo: LayerGeo; startRef: React.MutableRefObject<number> }) {
  const slot = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const line = useRef<THREE.LineBasicMaterial>(null)
  const conn = useRef<THREE.LineBasicMaterial>(null)
  const pts = useRef<THREE.PointsMaterial>(null)
  const dat = useRef<THREE.PointsMaterial>(null)
  const fill = useRef<THREE.MeshBasicMaterial>(null)
  const label = useRef<HTMLDivElement>(null)
  const acc = useRef(0)

  useFrame((_, dt) => {
    const p = heroProgress.value
    const e = smooth(0.12, 0.5, p) // vertical explode
    const s = smooth(0.55, 0.85, p) // spread into five components
    const f = smooth(0.88, 1, p) // dissolve
    const intro = smooth(0, 1, startRef.current)
    const i = index - 2
    const y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(i * GAP, i * 1.15, e), 0, s) + (1 - intro) * i * 2.4
    slot.current!.position.set(i * 2.7 * s, y, 0)
    slot.current!.scale.setScalar(1 - 0.5 * s)
    acc.current += dt * 0.14 * e * (index % 2 ? 1 : -1)
    spin.current!.rotation.y = acc.current * e

    const a = (1 - f) * intro
    line.current!.opacity = 0.38 * a
    conn.current!.opacity = 0.32 * a * (1 - smooth(0.05, 0.3, p))
    pts.current!.opacity = 0.95 * a
    dat.current!.opacity = 0.5 * a
    fill.current!.opacity = 0.035 * a
    if (label.current) label.current.style.opacity = String(smooth(0.78, 0.95, p) * (1 - f))
  })

  return (
    <group ref={slot}>
      <group ref={spin}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.0, 48]} />
          <meshBasicMaterial ref={fill} color={IVORY} transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <lineSegments geometry={geo.lines}>
          <lineBasicMaterial ref={line} color={IVORY} transparent depthWrite={false} toneMapped={false} />
        </lineSegments>
        <lineSegments geometry={geo.conn}>
          <lineBasicMaterial ref={conn} color={IVORY} transparent depthWrite={false} toneMapped={false} />
        </lineSegments>
        <points geometry={geo.nodes}>
          <pointsMaterial ref={pts} color="#ffffff" size={3.2} sizeAttenuation={false} transparent depthWrite={false} toneMapped={false} />
        </points>
        <points geometry={geo.data}>
          <pointsMaterial ref={dat} color={IVORY} size={1.6} sizeAttenuation={false} transparent depthWrite={false} toneMapped={false} />
        </points>
      </group>
      <Html position={[0, -3.6, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
        <div ref={label} className="tiny whitespace-nowrap text-ivory" style={{ opacity: 0 }}>
          {LAYERS[index]}
        </div>
      </Html>
    </group>
  )
}

function Rig({ start, children }: { start: boolean; children: (startRef: React.MutableRefObject<number>) => React.ReactNode }) {
  const root = useRef<THREE.Group>(null)
  const acc = useRef(0)
  const startT = useRef(0)
  const { camera, size } = useThree()

  useFrame((_, dt) => {
    if (start) startT.current = Math.min(1, startT.current + dt / 2.4)
    const p = heroProgress.value
    const s = smooth(0.55, 0.85, p)
    const f = smooth(0.88, 1, p)
    acc.current += dt * 0.07 * (1 - s)
    const g = root.current!
    // structure leans toward the cursor; ambient rotation dies away as components separate
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, acc.current * (1 - s) + pointer.x * 0.42 * (1 - 0.92 * s), 3.5, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, THREE.MathUtils.lerp(0.95, 0.42, s) + pointer.y * 0.22, 3.5, dt)
    g.scale.setScalar(1 + f * 0.25)
    const aspect = size.width / size.height
    const z = (9.6 + 3.6 * s) * Math.max(1, 1.75 / aspect)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3, dt)
    camera.lookAt(0, 0, 0)
  })

  return <group ref={root}>{children(startT)}</group>
}

export default function HeroScene({ start, active }: { start: boolean; active: boolean }) {
  const geos = useMemo(() => LAYERS.map((_, i) => buildLayer(i)), [])
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 35, position: [0, 1, 9.6], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <Rig start={start}>
        {(startRef) => geos.map((g, i) => <Layer key={i} index={i} geo={g} startRef={startRef} />)}
      </Rig>
    </Canvas>
  )
}
