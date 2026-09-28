export type DiagramKind = 'workflow' | 'stack' | 'crm' | 'agent' | 'api' | 'data'

export interface Capability {
  id: string
  title: string
  blurb: string
  kind: DiagramKind
}

export const CAPABILITIES: Capability[] = [
  { id: 'ai-automation', title: 'AI Automation', kind: 'workflow', blurb: 'Workflows that read, decide and act on their own, with a person involved only where judgment is needed.' },
  { id: 'custom-software', title: 'Custom Software', kind: 'stack', blurb: 'Applications shaped around how your operation actually runs, not how a template assumes it does.' },
  { id: 'crm-systems', title: 'CRM Systems', kind: 'crm', blurb: 'Pipelines, contacts and follow-ups in one place your team keeps current because it saves them time.' },
  { id: 'ai-agents', title: 'AI Agents', kind: 'agent', blurb: 'Software that holds a conversation, uses your tools and reports back with a result.' },
  { id: 'api-integration', title: 'API & Integration', kind: 'api', blurb: 'Your systems connected through clean interfaces and dependable hand-offs.' },
  { id: 'data-systems', title: 'Data Systems', kind: 'data', blurb: 'Structured, queryable data from ingestion through to the report someone reads on Monday.' },
]
