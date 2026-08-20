/* js/kinds.js — Ordinary chips vs named entity mentions. Lookups. */
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
  int: { label: 'Интеграция', icon: 'integrations' },
}

const KIND_SKIN = {
  ai: 'is-ai',
  graph: 'is-graph',
  nlu: 'is-nlu',
  job: 'is-job',
  jobtpl: 'is-job',
  chat: 'is-chat',
  chattpl: 'is-chat',
  campaign: 'is-campaign',
  camptpl: 'is-campaign',
  project: 'is-project',
  doc: 'is-doc',
  phone: 'is-phone',
  offer: 'is-phone',
  report: 'is-report',
  market: 'is-market',
  int: 'is-int',
}

const NAV_KIND = {
  agents: 'ai',
  knowledge: 'doc',
  bots: 'graph',
  nlu: 'nlu',
  calls: 'job',
  numbers: 'phone',
  chats: 'chat',
  campaigns: 'campaign',
  integrations: 'int',
  market: 'market',
  analytics: 'report',
}

const MONTH_FULL = {
  янв: 'января',
  фев: 'февраля',
  мар: 'марта',
  апр: 'апреля',
  мая: 'мая',
  июн: 'июня',
  июл: 'июля',
  авг: 'августа',
  сен: 'сентября',
  окт: 'октября',
  ноя: 'ноября',
  дек: 'декабря',
}

function attrEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function expandWhen(short) {
  if (!short) return ''
  const s = String(short).trim()
  if (s === 'собирается') return ''
  if (s === 'только что') return '20 августа 2026, только что'
<<<<<<< HEAD
  if (/^\d{1,2} мин$/.test(s)) return `20 августа 2026 · ${s} назад`
  if (s === 'час назад') return '20 августа 2026 · час назад'
  if (/^\d{1,2}:\d{2}$/.test(s)) return `20 августа 2026, ${s}`
  if (s.startsWith('сегодня')) {
    const rest = s.slice(7).replace(/^,\s*/, '')
    return rest ? `20 августа 2026, ${rest}` : '20 августа 2026'
  }
  if (s.startsWith('вчера')) {
    const rest = s.slice(5).replace(/^,\s*/, '')
    return rest ? `19 августа 2026, ${rest}` : '19 августа 2026'
  }
  const m = s.match(/^(\d{1,2})\s+(янв|фев|мар|апр|мая|июн|июл|авг|сен|окт|ноя|дек)\.?(?:\s*,\s*(.+))?$/)
  if (m) {
    const full = `${m[1]} ${MONTH_FULL[m[2]]} 2026`
    return m[3] ? `${full}, ${m[3]}` : full
=======
  if (/^\d{1,2} мин$/.test(s)) return '20 августа 2026 · ' + s + ' назад'
  if (s === 'час назад') return '20 августа 2026 · час назад'
  if (/^\d{1,2}:\d{2}$/.test(s)) return '20 августа 2026, ' + s
  if (s.indexOf('сегодня') === 0) {
    const rest = s.slice(7).replace(/^,\s*/, '')
    return rest ? '20 августа 2026, ' + rest : '20 августа 2026'
  }
  if (s.indexOf('вчера') === 0) {
    const rest = s.slice(5).replace(/^,\s*/, '')
    return rest ? '19 августа 2026, ' + rest : '19 августа 2026'
  }
  const m = s.match(/^(\d{1,2})\s+(янв|фев|мар|апр|мая|июн|июл|авг|сен|окт|ноя|дек)\.?(?:\s*,\s*(.+))?$/)
  if (m) {
    const full = m[1] + ' ' + MONTH_FULL[m[2]] + ' 2026'
    return m[3] ? full + ', ' + m[3] : full
>>>>>>> 31a027dc55395067f6194ed9bc8a8ce494b3694c
  }
  return s
}

function when(short) {
  if (!short) return ''
  const full = expandWhen(short)
<<<<<<< HEAD
  if (!full) return `<span>${short}</span>`
  return `<time class="when" title="${attrEsc(full)}">${short}</time>`
=======
  if (!full) return '<span>' + short + '</span>'
  return '<time class="when" title="' + attrEsc(full) + '">' + short + '</time>'
>>>>>>> 31a027dc55395067f6194ed9bc8a8ce494b3694c
}

function entityDates(obj) {
  if (!obj) return ''
  const created = obj.created
  const updated = obj.updated || obj.time
  const bits = []
<<<<<<< HEAD
  if (created) bits.push(`<span>созд. ${when(created)}</span>`)
  if (updated) bits.push(`<span>изм. ${when(updated)}</span>`)
  if (!bits.length) return ''
  return `<div class="entity-dates verysmall muted">${bits.join('<span aria-hidden="true">·</span>')}</div>`
}

function entityRef(kind, name, opts) {
  if (!name) return ''
  const o = opts || {}
  const k = KINDS[kind] || KINDS.ai
  const skin = KIND_SKIN[kind] || 'is-ai'
  const cls = ['entity-ref', skin, o.kindOnly ? 'is-type' : ''].filter(Boolean).join(' ')
  const title = o.kindOnly ? k.label : `${k.label} · ${name}`
  const inner = `<span class="entity-ref-mark">${icon(k.icon, 16)}</span><span class="entity-ref-name">${name}</span>`
  if (o.href) {
    return `<a class="${cls}" href="${o.href}" data-nav="${o.href}" title="${attrEsc(title)}">${inner}</a>`
  }
  return `<span class="${cls}" title="${attrEsc(title)}">${inner}</span>`
=======
  if (created) bits.push('<span>созд. ' + when(created) + '</span>')
  if (updated) bits.push('<span>изм. ' + when(updated) + '</span>')
  if (!bits.length) return ''
  return '<div class="entity-dates verysmall muted">' + bits.join('<span aria-hidden="true">·</span>') + '</div>'
}

/* Ordinary chip: status, channel, type, section. Pill, no icon, no kind bar. */
const KIND_CHIP = {
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
  int: 'chip-kind-int',
>>>>>>> 31a027dc55395067f6194ed9bc8a8ce494b3694c
}

function kindChip(kind) {
  const k = KINDS[kind]
<<<<<<< HEAD
  return entityRef(kind, k ? k.label : kind, { kindOnly: true })
=======
  const cls = KIND_CHIP[kind] || ''
  return `<span class="chip${cls ? ' ' + cls : ''}">${k ? k.label : kind}</span>`
>>>>>>> 31a027dc55395067f6194ed9bc8a8ce494b3694c
}

function navChip(navId) {
  const nav = NAV.find((n) => n.id === navId)
  if (!nav) return ''
<<<<<<< HEAD
  const kind = NAV_KIND[navId]
  if (!kind) return `<span class="chip">${nav.label}</span>`
  return entityRef(kind, nav.label, { kindOnly: true })
}

function entityPick(inner) {
  return `<button class="entity-pick" type="button" data-action="toast" data-toast="Выбор сущности в v1 не открываем">
    <span class="entity-pick-val">${inner || '<span class="muted">Не выбран</span>'}</span>
    ${icon('chevron', 16)}
  </button>`
=======
  const cls = KIND_CHIP[NAV_KIND[navId]] || ''
  return `<span class="chip${cls ? ' ' + cls : ''}">${nav.label}</span>`
}

/* Named instance outside the unique card: ordinary gray chip. Kind lives in the label. */
function entityChip(kind, name) {
  if (!name) return ''
  const k = KINDS[kind]
  const text = k ? k.label + ' · ' + name : name
  return `<span class="chip entity-chip">${text}</span>`
}

function entityRef(kind, name, opts) {
  const o = opts || {}
  const inner = entityChip(kind, name)
  if (!inner) return ''
  if (o.href) {
    return `<a class="entity-chip-link" href="${o.href}" data-nav="${o.href}">${inner}</a>`
  }
  return inner
}

function entityPick(inner) {
  return '<button class="entity-pick" type="button" data-action="toast" data-toast="Выбор сущности в v1 не открываем">' +
    '<span class="entity-pick-val">' + (inner || '<span class="muted">Не выбран</span>') + '</span>' +
    icon('chevron', 16) +
    '</button>'
>>>>>>> 31a027dc55395067f6194ed9bc8a8ce494b3694c
}

function mediumChip(medium) {
  const map = {
    voice: ['chip-medium-voice', 'Голос'],
    text: ['chip-medium-text', 'Чат'],
    both: ['chip-medium-both', 'Голос и чат'],
  }
  const pair = map[medium] || map.text
  return '<span class="chip ' + pair[0] + '">' + pair[1] + '</span>'
}

function entityHead(kind, extra) {
  const k = KINDS[kind] || KINDS.ai
  return '<div class="entity-head">' +
    '<span class="entity-type">' +
    '<span class="entity-mark">' + icon(k.icon, 16) + '</span>' +
    '<span class="entity-type-name">' + k.label + '</span>' +
    '</span>' +
    (extra || '') +
    '</div>'
}

function entityFoot(parts) {
  return '<div class="entity-foot">' + parts.filter(Boolean).join('') + '</div>'
}

function brainHref(pid, brain) {
  if (!brain || !brain.kind) return ''
  if (brain.kind === 'ai') return '#/p/' + pid + '/agents/' + brain.id
  if (brain.kind === 'graph') return '#/p/' + pid + '/bots/' + brain.id
  if (brain.kind === 'nlu') return '#/p/' + pid + '/nlu/' + brain.id
  return ''
}

function brainMark(brain) {
  if (!brain) return ''
  return entityRef(brain.kind, brain.name)
}

function findBot(pid, id) {
  return (BOTS[pid] || []).find(function (x) { return x.id === id })
}

function findNlu(pid, id) {
  return (NLU[pid] || []).find(function (x) { return x.id === id })
}

function findAgent(pid, id) {
  return (AGENTS[pid] || []).find(function (x) { return x.id === id })
}
