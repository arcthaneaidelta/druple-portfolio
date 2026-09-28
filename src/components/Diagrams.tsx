import type { DiagramKind } from '../data/capabilities'

const T = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '.08em' } as const
const stroke = { stroke: 'currentColor', fill: 'none', strokeWidth: 1 } as const

function Workflow() {
  const steps = ['TRIGGER', 'AI', 'DECISION', 'ACTION', 'RESULT']
  return (
    <g>
      {steps.map((s, i) => {
        const y = 8 + i * 50
        return (
          <g key={s}>
            {i > 0 && <line className="flow" x1="180" y1={y - 16} x2="180" y2={y} {...stroke} />}
            <g style={{ animation: 'pulseStep 5s infinite', animationDelay: `${i * 0.8}s`, opacity: 0.35 }}>
              <rect x="105" y={y} width="150" height="34" {...stroke} />
              <text x="180" y={y + 21} textAnchor="middle" fill="currentColor" style={T}>{s}</text>
            </g>
          </g>
        )
      })}
    </g>
  )
}

function Stack() {
  const layers = ['INTERFACE', 'API', 'LOGIC', 'DATA']
  return (
    <g transform="translate(70 30)">
      {layers.map((l, i) => (
        <g key={l} style={{ animation: 'slab .9s cubic-bezier(.16,1,.3,1) both', animationDelay: `${i * 0.12}s` }}>
          <g transform={`translate(0 ${i * 52})`}>
            <path d="M0 26 L110 0 L220 26 L110 52 Z" {...stroke} />
            <path d="M0 26 V38 L110 64 L220 38 V26" {...stroke} opacity=".5" />
            <text x="110" y="30" textAnchor="middle" fill="currentColor" style={T}>{l}</text>
          </g>
        </g>
      ))}
    </g>
  )
}

function Crm() {
  const cols = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'WON']
  return (
    <g transform="translate(14 20)">
      {cols.map((c, i) => (
        <g key={c} transform={`translate(${i * 84} 0)`}>
          <text x="0" y="0" fill="currentColor" style={{ ...T, fontSize: 8 }}>{c}</text>
          <line x1="0" y1="10" x2="72" y2="10" {...stroke} />
          {[0, 1].map((k) => <rect key={k} x="0" y={22 + k * 44} width="72" height="34" {...stroke} opacity=".28" />)}
        </g>
      ))}
      <g>
        <rect x="0" y="44" width="72" height="34" fill="currentColor" opacity=".9" />
        <animateTransform attributeName="transform" type="translate" dur="7s" repeatCount="indefinite"
          values="0 0;0 0;84 0;84 0;168 0;168 0;252 0;252 0" keyTimes="0;.12;.28;.4;.56;.68;.84;1" />
      </g>
      <text x="0" y="170" fill="currentColor" opacity=".6" style={{ ...T, fontSize: 9 }}>FOLLOW-UP SCHEDULED AUTOMATICALLY</text>
    </g>
  )
}

function Agent() {
  const nodes: [string, number, number][] = [['PERCEIVE', 180, 24], ['PLAN', 296, 130], ['ACT', 180, 236], ['OBSERVE', 64, 130]]
  return (
    <g>
      <circle cx="180" cy="130" r="106" {...stroke} className="flow" />
      <circle r="3.5" fill="currentColor">
        <animateMotion dur="6s" repeatCount="indefinite" path="M180 24 A106 106 0 1 1 179.9 24" />
      </circle>
      {nodes.map(([l, x, y]) => (
        <g key={l}>
          <circle cx={x} cy={y} r="5" fill="currentColor" />
          <text x={x} y={y + (y < 100 ? -12 : y > 200 ? 20 : 20)} textAnchor="middle" fill="currentColor" style={T}>{l}</text>
        </g>
      ))}
      <text x="180" y="134" textAnchor="middle" fill="currentColor" style={T}>AGENT</text>
    </g>
  )
}

function Api() {
  const out: [string, number, number][] = [['CRM', 50, 40], ['ERP', 310, 40], ['PAY', 30, 150], ['DB', 330, 150], ['WEB', 180, 240]]
  return (
    <g>
      {out.map(([l, x, y], i) => (
        <g key={l}>
          <line x1="180" y1="120" x2={x} y2={y} {...stroke} opacity=".4" />
          <circle r="2.5" fill="currentColor">
            <animateMotion dur={`${2.4 + i * 0.35}s`} repeatCount="indefinite" path={`M180 120 L${x} ${y}`} />
          </circle>
          <rect x={x - 22} y={y - 12} width="44" height="24" fill="none" stroke="currentColor" />
          <text x={x} y={y + 4} textAnchor="middle" fill="currentColor" style={T}>{l}</text>
        </g>
      ))}
      <rect x="150" y="100" width="60" height="40" fill="currentColor" />
      <text x="180" y="124" textAnchor="middle" style={{ ...T, fill: 'var(--diagram-bg, #080808)' }}>API</text>
    </g>
  )
}

function DataSys() {
  const bars = [40, 78, 56, 104, 90, 130]
  return (
    <g>
      {[50, 100, 150].map((y, i) => (
        <g key={y}>
          <circle cx="24" cy={y} r="4" fill="currentColor" />
          <line className="flow" x1="30" y1={y} x2="118" y2="100" {...stroke} style={{ animationDelay: `${i * 0.3}s` }} />
        </g>
      ))}
      <rect x="118" y="78" width="66" height="44" {...stroke} />
      <text x="151" y="104" textAnchor="middle" fill="currentColor" style={T}>PIPELINE</text>
      <line className="flow" x1="184" y1="100" x2="214" y2="100" {...stroke} />
      <g transform="translate(220 214)">
        {bars.map((h, i) => (
          <rect key={i} x={i * 22} y={-h} width="14" height={h} fill="currentColor"
            style={{ transformBox: 'fill-box', transformOrigin: 'bottom', animation: 'grow 1.1s cubic-bezier(.16,1,.3,1) both', animationDelay: `${0.15 * i}s` }} />
        ))}
        <line x1="-6" y1="0" x2="136" y2="0" {...stroke} />
      </g>
      <text x="220" y="236" fill="currentColor" opacity=".6" style={{ ...T, fontSize: 9 }}>REPORT</text>
    </g>
  )
}

export default function Diagram({ kind }: { kind: DiagramKind }) {
  return (
    <svg viewBox="0 0 360 260" role="img" aria-label={`${kind} diagram`} className="h-full max-h-[300px] w-full">
      {kind === 'workflow' && <Workflow />}
      {kind === 'stack' && <Stack />}
      {kind === 'crm' && <Crm />}
      {kind === 'agent' && <Agent />}
      {kind === 'api' && <Api />}
      {kind === 'data' && <DataSys />}
    </svg>
  )
}
