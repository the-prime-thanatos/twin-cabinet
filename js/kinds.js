/* js/kinds.js — Chips, entity chrome, lookups. */
function chip(status) {
  const map = {
    draft: ['chip-draft', 'черновик'],
    active: ['chip-active', 'активен'],
    paused: ['chip-paused', 'пауза'],
    error: ['chip-error', 'ошибка'],
    running: ['chip-running', 'идёт'],
  }
  const [cls, label] = map[status] || map.draft
  return `<span class="chip ${cls}"><span class="dot"></span>${label}</span>`
}

function waveBars(id) {
  const seed = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0)
  return [0, 1, 2, 3, 4].map((i) => `<i style="height:${8 + ((seed * (i + 3)) % 16)}px"></i>`).join('')
}

const KINDS = {
  ai: { label: 'AI-агент', icon: 'agents' },
  graph: { label: 'Сценарий', icon: 'bots' },
  nlu: { label: 'NLU-модель', icon: 'nlu' },
  job: { label: 'Задание', icon: 'calls' },
  jobtpl: { label: 'Шаблон задания', icon: 'calls' },
  chat: { label: 'Диалог', icon: 'chats' },
  chattpl: { label: 'Шаблон чата', icon: 'chats' },
  campaign: { label: 'Рассылка', icon: 'campaigns' },
  camptpl: { label: 'Шаблон рассылки', icon: 'campaigns' },
  project: { label: 'Проект', icon: 'folder' },
  doc: { label: 'Документ', icon: 'knowledge' },
  phone: { label: 'Номер', icon: 'numbers' },
  offer: { label: 'Витрина', icon: 'numbers' },
  report: { label: 'Отчёт', icon: 'analytics' },
  market: { label: 'Карточка', icon: 'market' },
}

function kindChip(kind) {
  const k = KINDS[kind]
  const cls = {
    ai: 'chip-kind-ai',
    graph: 'chip-kind-graph',
    nlu: 'chip-kind-nlu',
    job: 'chip-kind-job',
    jobtpl: 'chip-kind-job',
    chat: 'chip-kind-chat',
    chattpl: 'chip-kind-chat',
    campaign: 'chip-kind-campaign',
    camptpl: 'chip-kind-campaign',
    project: 'chip-kind-project',
    doc: 'chip-kind-doc',
    phone: 'chip-kind-phone',
    offer: 'chip-kind-phone',
    report: 'chip-kind-report',
    market: 'chip-kind-market',
  }[kind] || 'chip'
  return `<span class="chip ${cls}">${k ? k.label : kind}</span>`
}

function mediumChip(medium) {
  const map = {
    voice: ['chip-medium-voice', 'Голос'],
    text: ['chip-medium-text', 'Чат'],
    both: ['chip-medium-both', 'Голос и чат'],
  }
  const [cls, label] = map[medium] || map.text
  return `<span class="chip ${cls}">${label}</span>`
}

function entityHead(kind, extra = '') {
  const k = KINDS[kind] || KINDS.ai
  return `<div class="entity-head">
    <span class="entity-type">
      <span class="entity-mark">${icon(k.icon, 16)}</span>
      <span class="entity-type-name">${k.label}</span>
    </span>
    ${extra}
  </div>`
}

function entityFoot(parts) {
  return `<div class="entity-foot">${parts.filter(Boolean).join('')}</div>`
}

function brainHref(pid, brain) {
  if (!brain || !brain.kind) return ''
  if (brain.kind === 'ai') return `#/p/${pid}/agents/${brain.id}`
  if (brain.kind === 'graph') return `#/p/${pid}/bots/${brain.id}`
  if (brain.kind === 'nlu') return `#/p/${pid}/nlu/${brain.id}`
  return ''
}

function brainMark(brain) {
  if (!brain) return ''
  return `<div class="rel-line">${kindChip(brain.kind)} ${brain.name}</div>`
}

function findBot(pid, id) {
  return (BOTS[pid] || []).find((x) => x.id === id)
}

function findNlu(pid, id) {
  return (NLU[pid] || []).find((x) => x.id === id)
}

function findAgent(pid, id) {
  return (AGENTS[pid] || []).find((x) => x.id === id)
}
