/* js/entity-crud.js — Create / view / edit / versions for entity cards. */
const ENT_HIST = {}
const DELETE_WAIT = 5

const STATUS_OPTS = [
  ['draft', 'Черновик'],
  ['active', 'Активен'],
  ['paused', 'Пауза'],
]
const MEDIUM_OPTS = [
  ['voice', 'Голос'],
  ['text', 'Чат'],
  ['both', 'Голос и чат'],
]
const LANG_OPTS = [
  ['Русский', 'Русский'],
  ['English', 'English'],
  ['Қазақша', 'Қазақша'],
]
const CH_OPTS = [
  ['WhatsApp', 'WhatsApp'],
  ['Telegram', 'Telegram'],
  ['SMS', 'SMS'],
  ['Email', 'Email'],
  ['Голос', 'Голос'],
]
const DOC_OPTS = [
  ['PDF', 'PDF'],
  ['DOCX', 'DOCX'],
  ['AUDIO', 'AUDIO'],
]
const KIND_OPTS = [
  ['ai', 'AI-агент'],
  ['graph', 'Сценарий'],
  ['nlu', 'NLU-модель'],
  ['campaign', 'Рассылка'],
]
const REP_OPTS = [
  ['Звонки', 'Звонки'],
  ['Чаты', 'Чаты'],
  ['Рассылки', 'Рассылки'],
  ['Расход', 'Расход'],
]

function clone(x) {
  return JSON.parse(JSON.stringify(x))
}

function f(key, label, type, extra) {
  return Object.assign({ key, label, type: type || 'text' }, extra || {})
}

function brainsOf(pid) {
  return []
    .concat((AGENTS[pid] || []).map((a) => ({ kind: 'ai', id: a.id, name: a.name })))
    .concat((BOTS[pid] || []).map((b) => ({ kind: 'graph', id: b.id, name: b.name })))
}

function nlusOf(pid) {
  return (NLU[pid] || []).map((n) => ({ id: n.id, name: n.name }))
}

function brainPack(b) {
  return b && b.kind ? `${b.kind}|${b.id || ''}|${b.name || ''}` : ''
}

function brainUnpack(s) {
  if (!s) return null
  const p = String(s).split('|')
  if (!p[0]) return null
  return { kind: p[0], id: p[1] || '', name: p.slice(2).join('|') }
}

function histKey(type, pid, id) {
  return `${type}:${pid}:${id}`
}

function entPath(pid, type, tail) {
  const e = ENT[type]
  let h = `#/p/${pid}/${e.seg}`
  if (e.sub) h += `/${e.sub}`
  if (tail) h += `/${tail}`
  return h
}

function entCreateBtn(pid, type) {
  const e = ENT[type]
  return `<button class="btn" type="button" data-nav="${entPath(pid, type, 'new')}">${icon('plus', 16)} ${e.create}</button>`
}

function entItems(type, pid) {
  const e = ENT[type]
  if (e.items) return e.items(pid)
  if (type === 'chat') return chatsOf(pid)
  if (type === 'campaign') return campaignsOf(pid)
  return ofList(e.store(), pid)
}

function entMut(type, pid) {
  const e = ENT[type]
  if (e.mut) return e.mut(pid)
  const map = e.store()
  if (!map[pid]) map[pid] = entItems(type, pid).map(clone)
  return map[pid]
}

function entFind(type, pid, id) {
  return entItems(type, pid).find((x) => x.id === id)
}

function entSync(pid, type) {
  const e = ENT[type]
  const p = project(pid)
  if (e.count && p) p[e.count] = entMut(type, pid).length
}

function ensureHist(type, pid, item, note) {
  const k = histKey(type, pid, item.id)
  if (!ENT_HIST[k]) {
    ENT_HIST[k] = [{ v: 1, at: item.created || 'создано', actor: 'система', note: note || 'Исходная версия', data: clone(item) }]
  }
  return ENT_HIST[k]
}

function pushHist(type, pid, item, note) {
  const list = ensureHist(type, pid, item)
  const v = list[list.length - 1].v + 1
  list.push({ v, at: 'только что', actor: 'Анна Козлова', note: note || 'Изменение', data: clone(item) })
  return v
}

function captureEntFields() {
  if (!ui.ent || !ui.ent.draft) return
  document.querySelectorAll('[data-ent-field]').forEach((el) => {
    const key = el.getAttribute('data-ent-field')
    const spec = (ENT[ui.ent.type] && (ENT[ui.ent.type].fields || []).find((x) => x.key === key)) || {}
    if (spec.type === 'brain') ui.ent.draft[key] = brainUnpack(el.value)
    else if (spec.type === 'number') ui.ent.draft[key] = Number(el.value || 0)
    else ui.ent.draft[key] = el.value
  })
}

function entObj(type, pid, id) {
  if (type === 'project') return project(id || pid)
  return entFind(type, pid, id)
}

function entPrepare(pid, type, mode, id) {
  const family = mode === 'edit' || mode === 'view' ? `item:${id}` : 'create'
  const key = `${pid}:${type}:${family}`
  if (!ui.ent || ui.ent.key !== key) {
    const e = ENT[type]
    const draft = clone((e && e.defaults) || {})
    if (family.startsWith('item:')) {
      const item = entObj(type, pid, id)
      if (item) Object.assign(draft, clone(item))
    }
    ui.ent = { key, type, pid, draft, preset: '' }
  }
  if (mode === 'preset' && id && ui.ent.preset !== id) {
    const pr = ((ENT[type] && ENT[type].presets) || []).find((x) => x.id === id)
    if (pr) Object.assign(ui.ent.draft, clone(pr.fields))
    ui.ent.preset = id
  }
}

function fieldHtml(field, val, pid) {
  const v = val == null ? '' : val
  if (field.type === 'select') {
    const opts = field.options || []
    return `<div class="field"><label>${field.label}</label><select class="select" data-ent-field="${field.key}">${opts
      .map((o) => `<option value="${attrEsc(o[0])}" ${String(v) === String(o[0]) ? 'selected' : ''}>${o[1]}</option>`)
      .join('')}</select></div>`
  }
  if (field.type === 'textarea') {
    return `<div class="field"><label>${field.label}</label><textarea class="textarea" data-ent-field="${field.key}">${v}</textarea></div>`
  }
  if (field.type === 'brain') {
    const cur = brainPack(v)
    const opts = [['', 'Не назначен']].concat(brainsOf(pid).map((b) => [brainPack(b), `${KINDS[b.kind].label} · ${b.name}`]))
    return `<div class="field"><label>${field.label}</label><select class="select" data-ent-field="${field.key}">${opts
      .map((o) => `<option value="${attrEsc(o[0])}" ${o[0] === cur ? 'selected' : ''}>${o[1]}</option>`)
      .join('')}</select></div>`
  }
  if (field.type === 'nlu') {
    const opts = [['', 'Не выбрана']].concat(nlusOf(pid).map((n) => [n.id, n.name]))
    return `<div class="field"><label>${field.label}</label><select class="select" data-ent-field="${field.key}">${opts
      .map((o) => `<option value="${attrEsc(o[0])}" ${String(v) === String(o[0]) ? 'selected' : ''}>${o[1]}</option>`)
      .join('')}</select></div>`
  }
  if (field.type === 'number') {
    return `<div class="field"><label>${field.label}</label><input class="input" type="number" data-ent-field="${field.key}" value="${attrEsc(v)}" /></div>`
  }
  return `<div class="field"><label>${field.label}</label><input class="input" data-ent-field="${field.key}" value="${attrEsc(v)}" ${field.placeholder ? `placeholder="${attrEsc(field.placeholder)}"` : ''} /></div>`
}

function fieldRead(field, item, pid) {
  const v = item[field.key]
  if (field.type === 'brain') return v ? entityRef(v.kind, v.name, { href: brainHref(pid, v) }) : '<span class="muted">Не назначен</span>'
  if (field.type === 'nlu') {
    const n = v && findNlu(pid, v)
    return n
      ? `${entityRef('nlu', n.name)}<button class="btn btn-ghost table-link" type="button" data-nav="#/p/${pid}/nlu/${n.id}">Открыть</button>`
      : '<span class="muted">Не выбрана</span>'
  }
  if (field.key === 'medium') return mediumChip(v || 'text')
  if (field.key === 'status') return chip(v || 'draft')
  if (field.key === 'kind' && KINDS[v]) return kindChip(v)
  if (v == null || v === '') return '<span class="muted">—</span>'
  return `<div>${v}</div>`
}

function jsonPre(obj) {
  return `<pre class="json-pre">${htmlEsc(JSON.stringify(obj, null, 2))}</pre>`
}

function htmlEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

function entDiff(before, after) {
  const keys = Array.from(new Set(Object.keys(before || {}).concat(Object.keys(after || {})))).sort()
  return keys
    .map((k) => {
      const a = JSON.stringify((before || {})[k])
      const b = JSON.stringify((after || {})[k])
      if (a === b) return null
      if ((before || {})[k] === undefined) return { k, op: 'add', to: b }
      if ((after || {})[k] === undefined) return { k, op: 'del', from: a }
      return { k, op: 'chg', from: a, to: b }
    })
    .filter(Boolean)
}

function diffHtml(rows) {
  if (!rows.length) return '<p class="muted">Изменений нет.</p>'
  return `<div class="diff-list">${rows
    .map((r) => {
      if (r.op === 'add') return `<div class="diff-row is-add"><span class="diff-k">${r.k}</span><span class="diff-v">+ ${htmlEsc(r.to)}</span></div>`
      if (r.op === 'del') return `<div class="diff-row is-del"><span class="diff-k">${r.k}</span><span class="diff-v">− ${htmlEsc(r.from)}</span></div>`
      return `<div class="diff-row is-chg"><span class="diff-k">${r.k}</span><span class="diff-v">${htmlEsc(r.from)} → ${htmlEsc(r.to)}</span></div>`
    })
    .join('')}</div>`
}

function mergeDraft(type, base) {
  const e = ENT[type]
  const next = clone(base)
  ;(e.fields || []).forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(ui.ent.draft, field.key)) next[field.key] = ui.ent.draft[field.key]
  })
  next.updated = 'только что'
  return next
}

function stopDeleteTimer() {
  if (ui._delInt) {
    clearInterval(ui._delInt)
    ui._delInt = null
  }
}

function startDeleteTimer() {
  stopDeleteTimer()
  ui.delete.left = DELETE_WAIT
  ui._delInt = setInterval(() => {
    if (!ui.delete || ui.modal !== 'ent-delete') {
      stopDeleteTimer()
      return
    }
    ui.delete.left -= 1
    if (ui.delete.left <= 0) stopDeleteTimer()
    render()
  }, 1000)
}

function entAskDelete(type, pid, id, title) {
  ui.delete = { type, pid, id, title, left: DELETE_WAIT }
  ui.modal = 'ent-delete'
  startDeleteTimer()
}

function entDoDelete() {
  const d = ui.delete
  if (!d) return
  if (d.type === 'project') {
    const i = PROJECTS.findIndex((p) => p.id === d.id)
    if (i >= 0) PROJECTS.splice(i, 1)
    ui.modal = null
    ui.delete = null
    stopDeleteTimer()
    go('#/projects')
    return
  }
  const list = entMut(d.type, d.pid)
  const i = list.findIndex((x) => x.id === d.id)
  if (i >= 0) list.splice(i, 1)
  delete ENT_HIST[histKey(d.type, d.pid, d.id)]
  entSync(d.pid, d.type)
  ui.modal = null
  ui.delete = null
  stopDeleteTimer()
  ui.toast = 'Удалили'
  setTimeout(() => {
    ui.toast = null
    render()
  }, 1600)
  go(entPath(d.pid, d.type))
}

function entFinishCreate(pid, type) {
  captureEntFields()
  const e = ENT[type]
  const name = (ui.ent.draft.name || ui.ent.draft.title || ui.ent.draft.city || '').trim()
  if (e.needName && !name) {
    ui.toast = 'Нужно имя'
    setTimeout(() => {
      ui.toast = null
      render()
    }, 1600)
    render()
    return
  }
  const item = Object.assign(clone(e.defaults || {}), clone(ui.ent.draft), {
    id: e.prefix + Math.random().toString(36).slice(2, 6),
    created: 'только что',
    updated: 'только что',
  })
  if (!item.name && name) item.name = name
  if (e.kind && !item.kind) item.kind = e.kind
  entMut(type, pid).unshift(item)
  entSync(pid, type)
  ensureHist(type, pid, item, 'Создание')
  if (e.setup) markSetup(pid, e.setup)
  ui.ent = { draft: {} }
  maybePromote(pid)
  go(entPath(pid, type, item.id))
}

function versionsCard(type, pid, item) {
  const hist = ensureHist(type, pid, item)
  const last = hist[hist.length - 1]
  const rows = hist
    .slice()
    .reverse()
    .map(
      (h) => `<div class="ver-row ${h.v === last.v ? 'is-on' : ''}">
        <div>
          <div class="h6">v${h.v} · ${h.note}</div>
          <div class="verysmall muted">${h.actor} · ${when(h.at)}</div>
        </div>
        ${h.v === last.v ? '<span class="chip">текущая</span>' : `<button class="btn btn-ghost" type="button" data-action="ent-rollback" data-ent="${type}" data-pid="${pid}" data-id="${item.id}" data-v="${h.v}">Откатить</button>`}
      </div>`,
    )
    .join('')
  return `<div class="card card-pad mt-16">
    <div class="h5">Версии</div>
    <p class="small muted flush mt-8">Снимок объекта при создании и каждом сохранении. Откат пишет новую версию, историю не затирает.</p>
    <div class="ver-list mt-16">${rows}</div>
  </div>`
}

function agentExtra(pid, a) {
  const kb = `<div class="card"><table class="table">
    <thead><tr><th>Документ</th><th>Обновлён</th></tr></thead>
    <tbody>
      <tr><td>${entityRef('doc', 'Скрипт скрининга.pdf')}</td><td class="muted">${when('18 авг')}</td></tr>
      <tr><td>${entityRef('doc', 'FAQ по слотам.docx')}</td><td class="muted">${when('12 авг')}</td></tr>
    </tbody>
  </table>
  <div class="card-foot">
    <button class="btn btn-secondary" type="button" data-nav="#/p/${pid}/knowledge">Все документы проекта</button>
    <p class="hint mt-8">Список файлов, не редактор базы.</p>
  </div></div>`
  return `<div class="tabs">
    <button class="tab ${ui.tab !== 'kb' ? 'is-active' : ''}" data-action="tab" data-tab="settings">Карточка</button>
    <button class="tab ${ui.tab === 'kb' ? 'is-active' : ''}" data-action="tab" data-tab="kb">База знаний</button>
  </div>${ui.tab === 'kb' ? kb : ''}`
}

function jobExtra(pid, j) {
  const playing = j.status === 'running'
  const people = [
    ['Игорь Смирнов', '+7 999 120-44-11', 'ответил', '0:42'],
    ['Мария Ким', '+7 913 220-11-04', 'нет ответа', '—'],
    ['Павел Орлов', '+7 905 441-90-12', 'перезвон', '0:11'],
    ['Алина Бек', '+7 777 102-33-90', 'ошибка', '—'],
  ]
  const rows = people.map((r) => `<tr><td>${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td class="muted">${r[3]}</td></tr>`).join('')
  return `<div class="row gap-8 mt-8">
    <button class="btn ${playing ? 'btn-secondary' : ''}" type="button" data-action="toast" data-toast="${playing ? 'Пауза в v1 не останавливает мок' : 'Запуск в v1 не стартует обзвон'}">${playing ? icon('pause', 16) + ' Пауза' : icon('play', 16) + ' Запустить'}</button>
  </div>
  <div class="card mt-16"><table class="table">
    <thead><tr><th>Кандидат</th><th>Номер</th><th>Результат</th><th>Длительность</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`
}

function botExtra(pid, b) {
  const nlu = b.nluId && findNlu(pid, b.nluId)
  const ai = b.aiId && findAgent(pid, b.aiId)
  return `<p class="muted flush">Canvas в v1 не входит. Связи те же, что на карточке.</p>
    ${nlu ? `<div class="field"><label>Открыть NLU</label><button class="btn btn-ghost table-link" type="button" data-nav="#/p/${pid}/nlu/${nlu.id}">${nlu.name}</button></div>` : ''}
    ${ai ? `<div class="field"><label>Открыть AI-агента</label><button class="btn btn-ghost table-link" type="button" data-nav="#/p/${pid}/agents/${ai.id}">${ai.name}</button></div>` : ''}
    <button class="btn btn-secondary" type="button" data-action="toast" data-toast="Редактор в v1 старый, сюда не рисуем">Открыть редактор</button>`
}

const ENT = {
  agent: {
    kind: 'ai',
    seg: 'agents',
    icon: 'agents',
    title: 'AI-агенты',
    one: 'AI-агент',
    create: 'Создать AI-агента',
    prefix: 'agt_',
    setup: 'agents',
    count: 'agents',
    needName: true,
    guideView: 'agent',
    store: () => AGENTS,
    defaults: { name: '', lang: 'Русский', status: 'draft', kind: 'ai', medium: 'voice' },
    fields: [f('name', 'Имя'), f('lang', 'Язык', 'select', { options: LANG_OPTS }), f('medium', 'Канал', 'select', { options: MEDIUM_OPTS }), f('status', 'Статус', 'select', { options: STATUS_OPTS })],
    presets: [
      { id: 'screen', name: 'Скрининг голосом', desc: 'Русский, голос, сразу в работу', fields: { name: 'Скрининг', lang: 'Русский', medium: 'voice', status: 'active', kind: 'ai' } },
      { id: 'faq', name: 'FAQ в чате', desc: 'Текстовый канал, без голоса', fields: { name: 'FAQ', lang: 'Русский', medium: 'text', status: 'draft', kind: 'ai' } },
      { id: 'both', name: 'Голос и чат', desc: 'Один агент на оба канала', fields: { name: 'Универсальный', lang: 'Русский', medium: 'both', status: 'draft', kind: 'ai' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Канал', ['medium']],
      ['Язык и статус', ['lang', 'status']],
    ],
    extra: agentExtra,
  },
  bot: {
    kind: 'graph',
    seg: 'bots',
    icon: 'bots',
    title: 'Сценарии',
    one: 'Сценарий',
    create: 'Создать сценарий',
    prefix: 'bot_',
    setup: 'bots',
    count: 'bots',
    needName: true,
    guideView: 'bot',
    store: () => BOTS,
    defaults: { name: '', channel: 'WhatsApp', status: 'draft', kind: 'graph', medium: 'text', nluId: '', aiId: '' },
    fields: [f('name', 'Имя'), f('channel', 'Канал доставки', 'select', { options: CH_OPTS }), f('medium', 'Среда', 'select', { options: MEDIUM_OPTS }), f('nluId', 'NLU-модель', 'nlu'), f('status', 'Статус', 'select', { options: STATUS_OPTS })],
    presets: [
      { id: 'wa', name: 'WhatsApp квалификация', desc: 'Текст, WhatsApp, под NLU', fields: { name: 'WhatsApp · квалификация', channel: 'WhatsApp', medium: 'text', status: 'draft', kind: 'graph' } },
      { id: 'voice', name: 'Входящая голосом', desc: 'Голосовой флоу записи', fields: { name: 'Входящая запись', channel: 'Голос', medium: 'voice', status: 'draft', kind: 'graph' } },
      { id: 'tg', name: 'Telegram статус', desc: 'Текстовый сценарий статуса', fields: { name: 'Telegram · статус', channel: 'Telegram', medium: 'text', status: 'draft', kind: 'graph' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Канал', ['channel', 'medium']],
      ['NLU и статус', ['nluId', 'status']],
    ],
    extra: botExtra,
  },
  project: {
    kind: 'project',
    one: 'Проект',
    needName: true,
    fields: [f('name', 'Имя'), f('desc', 'Описание', 'textarea')],
    defaults: { name: '', desc: '' },
  },
  nlu: {
    kind: 'nlu',
    seg: 'nlu',
    icon: 'nlu',
    title: 'NLU-модели',
    one: 'NLU-модель',
    create: 'Создать NLU-модель',
    prefix: 'nlu_',
    setup: 'nlu',
    count: 'nlu',
    needName: true,
    guideView: 'nlu-one',
    extra: function nluExtra(pid, n) {
      const host = n.usedIn && findBot(pid, n.usedIn)
      return host
        ? `<div class="field"><label>Вызывает сценарий</label>${entityRef('graph', host.name, { href: `#/p/${pid}/bots/${host.id}` })}</div>`
        : '<p class="muted flush">Пока не подключён к сценарию. С клиентом сама не говорит.</p>'
    },
    store: () => NLU,
    defaults: { name: '', status: 'draft', intents: 0, entities: 0 },
    fields: [f('name', 'Имя'), f('intents', 'Намерения', 'number'), f('entities', 'Сущности', 'number'), f('status', 'Статус', 'select', { options: STATUS_OPTS })],
    presets: [
      { id: 'hr', name: 'Квалификация', desc: '18 намерений, 6 сущностей', fields: { name: 'Квалификация', intents: 18, entities: 6, status: 'draft' } },
      { id: 'slot', name: 'Запись в слот', desc: 'Короткий набор слотов', fields: { name: 'Запись в слот', intents: 12, entities: 4, status: 'draft' } },
      { id: 'ret', name: 'Возвраты', desc: 'Магазин, возврат заказа', fields: { name: 'Возвраты · намерения', intents: 9, entities: 3, status: 'draft' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Покрытие', ['intents', 'entities']],
      ['Статус', ['status']],
    ],
  },
  job: {
    kind: 'job',
    seg: 'calls',
    icon: 'calls',
    title: 'Звонки',
    one: 'Задание',
    create: 'Создать задание',
    prefix: 'job_',
    setup: 'calls',
    count: 'calls',
    needName: true,
    guideView: 'job',
    store: () => JOBS,
    defaults: { name: '', status: 'draft', progress: 0, from: 'сегодня', to: 'сегодня', brain: null },
    fields: [f('name', 'Имя'), f('brain', 'Кто говорит', 'brain'), f('from', 'С'), f('to', 'По'), f('status', 'Статус', 'select', { options: STATUS_OPTS.concat([['running', 'Идёт']]) })],
    presets: [
      { id: 'today', name: 'Обзвон сегодня', desc: 'Черновик на текущий день', fields: { name: 'Обзвон заявок', status: 'draft', progress: 0, from: 'сегодня', to: 'сегодня' } },
      { id: 'retry', name: 'Дозвон «не взяли»', desc: 'Повтор по недозвонам', fields: { name: 'Дозвон «не взяли трубку»', status: 'paused', progress: 0, from: 'сегодня', to: 'завтра' } },
      { id: 'night', name: 'Ночной слот', desc: 'Черновик на ночь', fields: { name: 'Ночной слот', status: 'draft', progress: 0, from: 'сегодня', to: 'сегодня' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Кто говорит', ['brain']],
      ['Окно', ['from', 'to', 'status']],
    ],
    extra: jobExtra,
  },
  jobtpl: {
    kind: 'jobtpl',
    seg: 'calls',
    sub: 'templates',
    icon: 'calls',
    title: 'Шаблоны заданий',
    one: 'Шаблон задания',
    create: 'Создать шаблон',
    prefix: 'jt_',
    needName: true,
    guideView: 'calls-templates',
    store: () => JOB_TEMPLATES,
    defaults: { name: '', status: 'draft', medium: 'voice', brain: null },
    fields: [f('name', 'Имя'), f('brain', 'Кто говорит', 'brain'), f('medium', 'Канал', 'select', { options: MEDIUM_OPTS }), f('status', 'Статус', 'select', { options: STATUS_OPTS })],
    presets: [
      { id: 'slot', name: 'Скрининг слота', desc: 'Голос, AI на линии', fields: { name: 'Скрининг слота', medium: 'voice', status: 'active' } },
      { id: 'retry', name: 'Дозвон', desc: 'Повтор недозвона', fields: { name: 'Дозвон «не взяли»', medium: 'voice', status: 'paused' } },
      { id: 'in', name: 'Входящая', desc: 'Шаблон входящей линии', fields: { name: 'Входящая линия', medium: 'voice', status: 'draft' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Кто говорит', ['brain', 'medium']],
      ['Статус', ['status']],
    ],
  },
  chat: {
    kind: 'chat',
    seg: 'chats',
    icon: 'chats',
    title: 'Чаты',
    one: 'Диалог',
    create: 'Создать диалог',
    prefix: 'cht_',
    setup: 'chats',
    needName: true,
    guideView: 'chat-one',
    store: () => CHATS,
    defaults: { title: '', name: '', channel: 'WhatsApp', preview: '', status: 'active', unread: 0, brain: null },
    fields: [f('title', 'Тема'), f('channel', 'Канал', 'select', { options: CH_OPTS }), f('preview', 'Превью', 'textarea'), f('brain', 'Кто отвечает', 'brain'), f('status', 'Статус', 'select', { options: STATUS_OPTS })],
    presets: [
      { id: 'wa', name: 'Заявка WhatsApp', desc: 'Входящий тред квалификации', fields: { title: 'Заявка', channel: 'WhatsApp', preview: 'Готов выйти на смену', status: 'active' } },
      { id: 'faq', name: 'FAQ', desc: 'AI уже ответил, ждём человека', fields: { title: 'FAQ', channel: 'WhatsApp', preview: 'AI-агент ответил, ждём человека', status: 'active' } },
      { id: 'tg', name: 'Telegram слот', desc: 'Подтверждение адреса', fields: { title: 'Слот', channel: 'Telegram', preview: 'Подтвердите адрес', status: 'paused' } },
    ],
    wizard: [
      ['Тема', ['title']],
      ['Канал', ['channel', 'brain']],
      ['Превью', ['preview', 'status']],
    ],
  },
  chattpl: {
    kind: 'chattpl',
    seg: 'chats',
    sub: 'templates',
    icon: 'chats',
    title: 'Шаблоны чатов',
    one: 'Шаблон чата',
    create: 'Создать шаблон',
    prefix: 'ct_',
    needName: true,
    guideView: 'chats-templates',
    store: () => CHAT_TEMPLATES,
    defaults: { name: '', channel: 'WhatsApp', body: '' },
    fields: [f('name', 'Имя'), f('channel', 'Канал', 'select', { options: CH_OPTS }), f('body', 'Текст', 'textarea')],
    presets: [
      { id: 'hi', name: 'Приветствие', desc: 'Первая реплика в WhatsApp', fields: { name: 'Приветствие', channel: 'WhatsApp', body: 'Здравствуйте! Напишите город и удобную смену.' } },
      { id: 'ok', name: 'Слот подтверждён', desc: 'Подстановка времени', fields: { name: 'Слот подтверждён', channel: 'Telegram', body: 'Слот {{time}} подтверждён.' } },
      { id: 'ret', name: 'Возврат принят', desc: 'Магазин, деньги на карту', fields: { name: 'Возврат принят', channel: 'WhatsApp', body: 'Заявку на возврат приняли. Деньги — до 5 дней.' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Канал', ['channel']],
      ['Текст', ['body']],
    ],
  },
  campaign: {
    kind: 'campaign',
    seg: 'campaigns',
    icon: 'campaigns',
    title: 'Рассылки',
    one: 'Рассылка',
    create: 'Создать рассылку',
    prefix: 'cmp_',
    setup: 'campaigns',
    count: 'campaigns',
    needName: true,
    guideView: 'campaign-one',
    store: () => CAMPAIGNS,
    defaults: { name: '', channel: 'SMS', status: 'draft', sent: 0, total: 0 },
    fields: [f('name', 'Имя'), f('channel', 'Канал', 'select', { options: CH_OPTS }), f('total', 'Всего', 'number'), f('status', 'Статус', 'select', { options: STATUS_OPTS.concat([['running', 'Идёт']]) })],
    presets: [
      { id: 'sms', name: 'SMS-напоминание', desc: 'Слот / визит за сутки', fields: { name: 'Напоминание', channel: 'SMS', status: 'draft', sent: 0, total: 2000 } },
      { id: 'wa', name: 'WhatsApp прогрев', desc: 'Дожим в мессенджере', fields: { name: 'Прогрев WhatsApp', channel: 'WhatsApp', status: 'paused', sent: 0, total: 800 } },
      { id: 'mail', name: 'Email', desc: 'Письмо с офертой', fields: { name: 'Прогрев лида', channel: 'Email', status: 'draft', sent: 0, total: 1200 } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Канал', ['channel']],
      ['Объём', ['total', 'status']],
    ],
  },
  camptpl: {
    kind: 'camptpl',
    seg: 'campaigns',
    sub: 'templates',
    icon: 'campaigns',
    title: 'Шаблоны рассылок',
    one: 'Шаблон рассылки',
    create: 'Создать шаблон',
    prefix: 'mt_',
    needName: true,
    guideView: 'campaigns-templates',
    store: () => CAMP_TEMPLATES,
    defaults: { name: '', channel: 'SMS', body: '' },
    fields: [f('name', 'Имя'), f('channel', 'Канал', 'select', { options: CH_OPTS }), f('body', 'Текст', 'textarea')],
    presets: [
      { id: 'd24', name: 'Напоминание 24ч', desc: 'SMS со слотом', fields: { name: 'Напоминание 24ч', channel: 'SMS', body: 'Напоминаем о визите завтра в {{time}}.' } },
      { id: 'd2', name: 'Напоминание 2ч', desc: 'WhatsApp за два часа', fields: { name: 'Напоминание 2ч', channel: 'WhatsApp', body: 'Через 2 часа приём. Ждём вас.' } },
      { id: 'slot', name: 'Слот завтра', desc: 'Подтверждение смены', fields: { name: 'Слот завтра', channel: 'SMS', body: 'Завтра смена с {{time}}. Напишите +, если выходите.' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Канал', ['channel']],
      ['Текст', ['body']],
    ],
  },
  doc: {
    kind: 'doc',
    seg: 'knowledge',
    icon: 'knowledge',
    title: 'База знаний',
    one: 'Документ',
    create: 'Добавить документ',
    prefix: 'doc_',
    setup: 'knowledge',
    needName: true,
    guideView: 'doc-one',
    store: () => DOCS,
    defaults: { name: '', type: 'PDF', size: '0 КБ', agent: '' },
    fields: [f('name', 'Имя файла'), f('type', 'Тип', 'select', { options: DOC_OPTS }), f('size', 'Размер'), f('agent', 'Для AI-агента')],
    presets: [
      { id: 'pdf', name: 'Скрипт PDF', desc: 'Типовой скрипт скрининга', fields: { name: 'Скрипт скрининга.pdf', type: 'PDF', size: '240 КБ' } },
      { id: 'faq', name: 'FAQ DOCX', desc: 'Ответы по слотам', fields: { name: 'FAQ по слотам.docx', type: 'DOCX', size: '88 КБ' } },
      { id: 'audio', name: 'Аудиоскрипт', desc: 'Запись голосом', fields: { name: 'Скрипт записи.mp3', type: 'AUDIO', size: '1.2 МБ' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Тип', ['type', 'size']],
      ['Агент', ['agent']],
    ],
  },
  phone: {
    kind: 'phone',
    seg: 'numbers',
    icon: 'numbers',
    title: 'Номера',
    one: 'Номер',
    create: 'Привязать номер',
    prefix: 'ph_',
    setup: 'numbers',
    needName: true,
    guideView: 'phone-one',
    store: () => PHONES,
    defaults: { name: '', number: '', city: '', status: 'active', until: 'до 1 окт' },
    fields: [f('city', 'Город'), f('number', 'Номер'), f('until', 'Срок'), f('status', 'Статус', 'select', { options: STATUS_OPTS })],
    presets: [
      { id: 'msk', name: 'Москва', desc: 'Городской пул 495', fields: { city: 'Москва', number: '+7 495 120-00-00', until: 'до 1 окт', status: 'active', name: 'Москва' } },
      { id: 'spb', name: 'Санкт-Петербург', desc: 'Пул 812', fields: { city: 'Санкт-Петербург', number: '+7 812 441-00-00', until: 'до 1 окт', status: 'active', name: 'Санкт-Петербург' } },
      { id: 'omsk', name: 'Омск', desc: 'Городская линия', fields: { city: 'Омск', number: '+7 3812 55-00-00', until: 'городская линия', status: 'active', name: 'Омск' } },
    ],
    wizard: [
      ['Город', ['city']],
      ['Номер', ['number']],
      ['Срок', ['until', 'status']],
    ],
  },
  offer: {
    kind: 'offer',
    seg: 'numbers',
    sub: 'shop',
    icon: 'numbers',
    title: 'Витрина',
    one: 'Карточка витрины',
    create: 'Добавить в витрину',
    prefix: 'mp_',
    needName: true,
    guideView: 'numbers-shop',
    items: () => MARKET_PHONES,
    mut: () => MARKET_PHONES,
    defaults: { name: '', number: '', city: '', price: '0 ₽ / мес' },
    fields: [f('city', 'Город'), f('number', 'Номер'), f('price', 'Цена')],
    presets: [
      { id: 'msk', name: 'Москва', desc: '1 200 ₽ / мес', fields: { city: 'Москва', number: '+7 495 •• ••-00', price: '1 200 ₽ / мес', name: 'Москва' } },
      { id: 'spb', name: 'Санкт-Петербург', desc: '980 ₽ / мес', fields: { city: 'Санкт-Петербург', number: '+7 812 •• ••-00', price: '980 ₽ / мес', name: 'Санкт-Петербург' } },
      { id: 'nsk', name: 'Новосибирск', desc: '640 ₽ / мес', fields: { city: 'Новосибирск', number: '+7 383 •• ••-00', price: '640 ₽ / мес', name: 'Новосибирск' } },
    ],
    wizard: [
      ['Город', ['city']],
      ['Номер', ['number']],
      ['Цена', ['price']],
    ],
  },
  report: {
    kind: 'report',
    seg: 'analytics',
    sub: 'reports',
    icon: 'analytics',
    title: 'Отчёты',
    one: 'Отчёт',
    create: 'Создать отчёт',
    prefix: 'rep_',
    needName: true,
    guideView: 'analytics-reports',
    store: () => REPORTS,
    defaults: { name: '', type: 'Звонки', service: 'CIS · cis_call_aggregated', status: 'GENERATED' },
    fields: [f('name', 'Имя'), f('type', 'Тип', 'select', { options: REP_OPTS }), f('service', 'Сервис')],
    presets: [
      { id: 'calls', name: 'Дозвон по дням', desc: 'Срез CIS', fields: { name: 'Дозвон по дням', type: 'Звонки', service: 'CIS · cis_call_aggregated', status: 'GENERATED' } },
      { id: 'chat', name: 'Сессии чата', desc: 'CHAT · sessions', fields: { name: 'Сессии чата', type: 'Чаты', service: 'CHAT · chat_sessions', status: 'GENERATED' } },
      { id: 'spend', name: 'Расход', desc: 'Себестоимость контура', fields: { name: 'Расход по сервисам', type: 'Расход', service: 'platform_total_cost', status: 'GENERATED' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Тип', ['type']],
      ['Сервис', ['service']],
    ],
  },
  market: {
    kind: 'market',
    seg: 'market',
    icon: 'market',
    title: 'Маркетплейс',
    one: 'Карточка магазина',
    create: 'Добавить карточку',
    prefix: 'mk_',
    setup: 'market',
    needName: true,
    guideView: 'market-one',
    items: () => MARKET,
    mut: () => MARKET,
    defaults: { name: '', kind: 'ai', price: 'бесплатно' },
    fields: [f('name', 'Имя'), f('kind', 'Тип объекта', 'select', { options: KIND_OPTS }), f('price', 'Цена')],
    presets: [
      { id: 'ai', name: 'AI-агент', desc: 'Готовая персона, бесплатно', fields: { name: 'Скрининг', kind: 'ai', price: 'бесплатно' } },
      { id: 'graph', name: 'Сценарий', desc: 'Флоу записи в слот', fields: { name: 'Запись в слот', kind: 'graph', price: '4 900 ₽' } },
      { id: 'nlu', name: 'NLU', desc: 'Намерения возврата', fields: { name: 'NLU · возвраты', kind: 'nlu', price: '1 200 ₽' } },
    ],
    wizard: [
      ['Имя', ['name']],
      ['Тип', ['kind']],
      ['Цена', ['price']],
    ],
  },
}

function entNeedName(type, draft) {
  const d = draft || {}
  return (d.name || d.title || d.city || '').trim()
}

function screenEntCreate(pid, type, step, sub) {
  const e = ENT[type]
  entPrepare(pid, type, step || 'choose', sub)
  const back = `<button class="btn btn-ghost" type="button" data-nav="${entPath(pid, type, step ? 'new' : '')}">Назад</button>`
  if (!step || step === 'choose') {
    return shell(
      pid,
      e.seg,
      `${header(`Новый · ${e.one}`, e.icon, '', 'ent-new')}
      <div class="choice-grid">
        <button class="choice-card" type="button" data-nav="${entPath(pid, type, 'new/blank')}">
          <span class="tag">Пустой</span>
          <div class="h3">С нуля</div>
          <p class="small muted">Имя и базовые поля. Остальное — в карточке после создания.</p>
        </button>
        <button class="choice-card" type="button" data-nav="${entPath(pid, type, 'new/preset')}">
          <span class="tag">Пресет</span>
          <div class="h3">Готовый состав</div>
          <p class="small muted">Типовой объект этого раздела. Поля можно поправить на следующем шаге.</p>
        </button>
        <button class="choice-card" type="button" data-nav="${entPath(pid, type, 'new/wizard')}">
          <span class="tag">Мастер</span>
          <div class="h3">По шагам</div>
          <p class="small muted">Спрашиваем только нужное. Холст и тренер NLU сюда не входят.</p>
        </button>
      </div>`,
    )
  }
  if (step === 'blank') {
    const fields = (e.fields || []).filter((x) => ['name', 'title', 'city', 'number'].includes(x.key))
    const rest = fields.length ? fields : e.fields.slice(0, 1)
    return shell(
      pid,
      e.seg,
      `${header(`Пустой · ${e.one}`, e.icon, '', 'ent-new')}
      <div class="steps"><span class="is-on">Имя</span><span>Готово</span></div>
      ${formCard(rest.map((field) => fieldHtml(field, ui.ent.draft[field.key], pid)).join(''))}
      <div class="row gap-8 mt-24">${back}<button class="btn" type="button" data-action="ent-create" data-ent="${type}">Создать</button></div>`,
    )
  }
  if (step === 'preset' && !sub) {
    const cards = (e.presets || [])
      .map(
        (pr) => `<button class="choice-card" type="button" data-nav="${entPath(pid, type, 'new/preset/' + pr.id)}">
          <div class="h4">${pr.name}</div>
          <p class="small muted">${pr.desc}</p>
        </button>`,
      )
      .join('')
    return shell(
      pid,
      e.seg,
      `${header(`Пресет · ${e.one}`, e.icon, '', 'ent-new')}
      <div class="steps"><span>Путь</span><span class="is-on">Пресет</span><span>Имя</span></div>
      <div class="choice-grid">${cards}</div>
      <div class="mt-16">${back}</div>`,
    )
  }
  if (step === 'preset' && sub) {
    const nameField = (e.fields || []).find((x) => x.key === 'name' || x.key === 'title' || x.key === 'city') || e.fields[0]
    return shell(
      pid,
      e.seg,
      `${header((e.presets || []).find((x) => x.id === sub)?.name || e.one, e.icon, '', 'ent-new')}
      <div class="steps"><span>Путь</span><span>Пресет</span><span class="is-on">Имя</span></div>
      ${formCard(fieldHtml(nameField, ui.ent.draft[nameField.key], pid))}
      <div class="row gap-8 mt-24">
        <button class="btn btn-ghost" type="button" data-nav="${entPath(pid, type, 'new/preset')}">Назад</button>
        <button class="btn" type="button" data-action="ent-create" data-ent="${type}">Создать</button>
      </div>`,
    )
  }
  if (step === 'wizard') {
    const steps = e.wizard || []
    const i = Math.max(0, Math.min(steps.length - 1, Number(sub || 1) - 1))
    const cur = steps[i]
    const dots = steps.map((s, n) => `<span class="${n === i ? 'is-on' : ''}">${n + 1}. ${s[0]}</span>`).join('')
    const body = cur[1].map((key) => {
      const field = e.fields.find((x) => x.key === key)
      return field ? fieldHtml(field, ui.ent.draft[key], pid) : ''
    }).join('')
    const prev = i === 0 ? entPath(pid, type, 'new') : entPath(pid, type, `new/wizard/${i}`)
    const next =
      i === steps.length - 1
        ? `<button class="btn" type="button" data-action="ent-create" data-ent="${type}">Создать</button>`
        : `<button class="btn" type="button" data-action="ent-wizard-next" data-ent="${type}" data-to="${entPath(pid, type, `new/wizard/${i + 2}`)}">Дальше</button>`
    return shell(
      pid,
      e.seg,
      `${header(`Мастер · ${e.one}`, e.icon, '', 'ent-new')}
      <div class="steps">${dots}</div>
      ${formCard(body)}
      <div class="row gap-8 mt-24"><button class="btn btn-ghost" type="button" data-nav="${prev}">Назад</button>${next}</div>`,
    )
  }
  return screenEntCreate(pid, type)
}

function screenEntView(pid, type, id) {
  const e = ENT[type]
  const item = entFind(type, pid, id)
  if (!item) return screen404(pid)
  entPrepare(pid, type, 'view', id)
  ensureHist(type, pid, item)
  const title = item.name || item.title || item.city || e.one
  const hideFields = e.extra && type === 'agent' && ui.tab === 'kb'
  const tools = `<div class="ent-toolbar">
    <button class="btn" type="button" data-nav="${entPath(pid, type, id + '/edit')}">Редактировать</button>
    <button class="btn btn-danger" type="button" data-action="ent-delete-ask" data-ent="${type}" data-pid="${pid}" data-id="${id}" data-title="${attrEsc(title)}">Удалить</button>
  </div>`
  const fields = hideFields
    ? ''
    : formCard(
        `<div class="field"><label>ID</label>${copyField(item.id)}</div>` +
          (e.fields || [])
            .map((field) => `<div class="field"><label>${field.label}</label>${fieldRead(field, item, pid)}</div>`)
            .join('') +
          `<div class="row gap-8">
            <button class="btn btn-secondary" type="button" data-action="ent-json" data-ent="${type}" data-pid="${pid}" data-id="${item.id}">Посмотреть JSON</button>
          </div>`,
      )
  const extraHead = type === 'agent' ? agentExtra(pid, item) : ''
  const extraBody = type === 'agent' ? '' : e.extra ? e.extra(pid, item) : ''
  const showCard = !(type === 'agent' && ui.tab === 'kb')
  return shell(
    pid,
    e.seg,
    `${header(
      title,
      e.icon,
      `<div class="chips">${kindChip(e.kind)}${item.medium ? mediumChip(item.medium) : ''}${item.status && ['draft', 'active', 'paused', 'error', 'running'].includes(item.status) ? chip(item.status) : ''}</div>`,
      e.guideView,
    )}
    ${tools}
    ${extraHead}
    ${showCard ? fields : ''}
    ${showCard ? extraBody : ''}
    ${showCard ? versionsCard(type, pid, item) : ''}`,
  )
}

function screenEntEdit(pid, type, id) {
  const e = ENT[type]
  const item = entFind(type, pid, id)
  if (!item) return screen404(pid)
  entPrepare(pid, type, 'edit', id)
  const body = (e.fields || []).map((field) => fieldHtml(field, ui.ent.draft[field.key], pid)).join('')
  return shell(
    pid,
    e.seg,
    `${header(`Редактировать · ${item.name || item.title || item.city || e.one}`, e.icon, '', 'ent-edit')}
    ${formCard(body)}
    <div class="row gap-8 mt-24">
      <button class="btn btn-ghost" type="button" data-nav="${entPath(pid, type, id)}">Отмена</button>
      <button class="btn" type="button" data-action="ent-save-ask" data-ent="${type}" data-pid="${pid}" data-id="${id}">Сохранить</button>
    </div>`,
  )
}

function routeEnt(pid, type, rest) {
  const a = rest[0]
  const b = rest[1]
  const c = rest[2]
  const e = ENT[type]
  if (!a) return e.list ? e.list(pid, false) : screen404(pid)
  if (a === 'empty') return e.list ? e.list(pid, true) : screen404(pid)
  if (a === 'new') return screenEntCreate(pid, type, b, c)
  if (b === 'edit') return screenEntEdit(pid, type, a)
  return screenEntView(pid, type, a)
}

function handleEntAction(type, el) {
  if (type === 'ent-wizard-next') {
    const to = el.getAttribute('data-to')
    const ent = el.getAttribute('data-ent')
    if (ENT[ent] && ENT[ent].needName && !entNeedName(ent, ui.ent && ui.ent.draft)) {
      ui.toast = 'Нужно имя'
      setTimeout(() => {
        ui.toast = null
        render()
      }, 1600)
      render()
      return true
    }
    go(to)
    return true
  }
  if (type === 'ent-create') {
    entFinishCreate(ui.currentPid, el.getAttribute('data-ent'))
    return true
  }
  if (type === 'ent-json') {
    ui.json = { type: el.getAttribute('data-ent'), pid: el.getAttribute('data-pid') || ui.currentPid, id: el.getAttribute('data-id') }
    ui.modal = 'ent-json'
    render()
    return true
  }
  if (type === 'ent-delete-ask') {
    ui.menu = null
    entAskDelete(el.getAttribute('data-ent'), el.getAttribute('data-pid') || ui.currentPid, el.getAttribute('data-id'), el.getAttribute('data-title'))
    render()
    return true
  }
  if (type === 'ent-delete-go') {
    if (ui.delete && ui.delete.left > 0) return true
    entDoDelete()
    return true
  }
  if (type === 'ent-save-ask') {
    const et = el.getAttribute('data-ent')
    const pid = el.getAttribute('data-pid')
    const id = el.getAttribute('data-id')
    const item = entObj(et, pid, id)
    const after = mergeDraft(et, item)
    const rows = entDiff(item, after)
    ui.diff = { type: et, pid, id, before: item, after, rows }
    ui.modal = 'ent-diff'
    render()
    return true
  }
  if (type === 'ent-save-apply') {
    const d = ui.diff
    if (!d) return true
    if (d.type === 'project') {
      const p = project(d.id)
      Object.assign(p, { name: d.after.name, desc: d.after.desc, updated: 'только что' })
      pushHist('project', d.id, p, 'Сохранение')
    } else {
      const list = entMut(d.type, d.pid)
      const i = list.findIndex((x) => x.id === d.id)
      if (i >= 0) list[i] = d.after
      pushHist(d.type, d.pid, d.after, 'Сохранение')
      entSync(d.pid, d.type)
    }
    ui.modal = null
    ui.diff = null
    ui.toast = 'Сохранили'
    setTimeout(() => {
      ui.toast = null
      render()
    }, 1600)
    if (d.type === 'project') go(`#/p/${d.id}/settings`)
    else go(entPath(d.pid, d.type, d.id))
    return true
  }
  if (type === 'ent-rollback') {
    const et = el.getAttribute('data-ent')
    const pid = el.getAttribute('data-pid')
    const id = el.getAttribute('data-id')
    const v = Number(el.getAttribute('data-v'))
    const item = entFind(et, pid, id)
    const snap = ensureHist(et, pid, item).find((h) => h.v === v)
    if (!snap) return true
    const next = Object.assign(clone(snap.data), { id, updated: 'только что' })
    const list = entMut(et, pid)
    const i = list.findIndex((x) => x.id === id)
    if (i >= 0) list[i] = next
    pushHist(et, pid, next, `Откат к v${v}`)
    entSync(pid, et)
    ui.toast = `Откатили к версии ${v}`
    setTimeout(() => {
      ui.toast = null
      render()
    }, 1600)
    render()
    return true
  }
  return false
}

function entModals() {
  if (ui.modal === 'ent-json' && ui.json) {
    const it = entObj(ui.json.type, ui.json.pid, ui.json.id)
    const title = it ? it.name || it.title || it.city || it.id : ui.json.id
    return `<div class="modal-backdrop" data-action="close-modal">
      <div class="modal is-wide" onclick="event.stopPropagation()">
        <h2 class="h2">JSON · ${title}</h2>
        <p class="muted">То, что лежит в объекте после последнего сохранения.</p>
        ${it ? jsonPre(it) : '<p class="muted">Объект не найден</p>'}
        <div class="modal-actions"><button class="btn" type="button" data-action="close-modal">Закрыть</button></div>
      </div>
    </div>`
  }
  if (ui.modal === 'ent-diff' && ui.diff) {
    const empty = !ui.diff.rows.length
    return `<div class="modal-backdrop" data-action="close-modal">
      <div class="modal is-wide" onclick="event.stopPropagation()">
        <h2 class="h2">JSON diff</h2>
        <p class="muted">Что изменится в хранилище, если подтвердить сохранение.</p>
        ${diffHtml(ui.diff.rows)}
        <div class="diff-cols">
          <div><div class="h6">Было</div>${jsonPre(ui.diff.before)}</div>
          <div><div class="h6">Станет</div>${jsonPre(ui.diff.after)}</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" data-action="close-modal">Отмена</button>
          <button class="btn ${empty ? 'is-disabled' : ''}" type="button" data-action="ent-save-apply" ${empty ? 'disabled' : ''}>Применить</button>
        </div>
      </div>
    </div>`
  }
  if (ui.modal === 'ent-delete' && ui.delete) {
    const left = ui.delete.left
    const ready = left <= 0
    const label = ui.delete.type === 'project' ? 'проект' : (ENT[ui.delete.type] && ENT[ui.delete.type].one) || 'объект'
    return `<div class="modal-backdrop" data-action="close-modal">
      <div class="modal" onclick="event.stopPropagation()">
        <h2 class="h2">Удалить ${label}?</h2>
        <p class="muted">${ui.delete.title || ''}. Действие в прототипе сразу убирает карточку из списка. Кнопка откроется через ${DELETE_WAIT} секунд — чтобы не удалить с ходу.</p>
        <div class="timer-line ${ready ? 'is-on' : ''}"><span style="width:${Math.round(((DELETE_WAIT - Math.max(left, 0)) / DELETE_WAIT) * 100)}%"></span></div>
        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" data-action="close-modal">Оставить</button>
          <button class="btn btn-danger ${ready ? '' : 'is-disabled'}" type="button" data-action="ent-delete-go" ${ready ? '' : 'disabled'}>${ready ? 'Удалить' : `Подождите ${left} с`}</button>
        </div>
      </div>
    </div>`
  }
  return ''
}
