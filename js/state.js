/* js/state.js — ui state, pins, setup checklist. */
const ui = {
  collapsed: false,
  menu: null,
  modal: null,
  toast: null,
  tab: 'settings',
  navFull: {},
  pins: {},
  setupDone: {},
  currentPid: null,
  create: { name: '', desc: '', modules: {}, channels: {} },
  notes: {},
  editingNote: false,
  pageGuide: 'cover',
  tour: null,
  ask: null,
  insight: false,
}

function project(id) {
  return PROJECTS.find((p) => p.id === id) || PROJECTS[0]
}

function navOps() {
  return NAV.filter((n) => !n.divider && n.id !== 'overview' && n.id !== 'settings')
}

function pinsOf(pid) {
  if (ui.pins[pid]) return ui.pins[pid].slice()
  const p = project(pid)
  if (Array.isArray(p.pins)) return p.pins.slice()
  return (p.modules || []).slice()
}

function projectModules(pid) {
  return pinsOf(pid)
}

function isPinned(pid, id) {
  return pinsOf(pid).includes(id)
}

function hasModule(pid, id) {
  return isPinned(pid, id)
}

function markSetup(pid, step) {
  ui.setupDone[pid] = ui.setupDone[pid] || {}
  ui.setupDone[pid][step] = true
}

function setupSteps(pid) {
  const p = project(pid)
  const pins = pinsOf(pid)
  const done = ui.setupDone[pid] || {}
  const steps = [
    {
      id: 'note',
      title: 'Напишите заметку команде',
      hint: 'Зачем проект и какие правила — чтобы не объяснять в чате',
      action: 'edit-note',
      pid,
      done: !!noteText(pid).trim(),
    },
  ]
  if (!pins.length) {
    steps.push({
      id: 'pin',
      title: 'Закрепите разделы в меню',
      hint: 'Пресет делает это сам. Здесь откройте «Меню» и нажмите булавку',
      action: 'open-menu',
      pid,
      done: pins.length > 0,
    })
  }
  const map = {
    agents: {
      title: 'Создайте AI-агента',
      hint: 'Отвечает моделью. Канал — голос, текст или оба',
      modal: 'create-agent',
      done: (AGENTS[pid] || []).length > 0 || !!done.agents,
    },
    bots: {
      title: 'Создайте сценарий',
      hint: 'Флоу на блоках. Редактор в v1 старый — достаточно карточки',
      action: 'create-bot',
      done: (BOTS[pid] || []).length > 0 || !!done.bots,
    },
    nlu: {
      title: 'Создайте NLU-модель',
      hint: 'Намерения для сценария. С клиентом сама не говорит',
      action: 'create-nlu',
      done: (NLU[pid] || []).length > 0 || !!done.nlu,
    },
    calls: {
      title: 'Создайте задание на обзвон',
      hint: 'Список кандидатов можно загрузить позже',
      action: 'create-job',
      done: (JOBS[pid] || []).length > 0 || !!done.calls,
    },
    chats: {
      title: 'Проверьте чаты проекта',
      hint: 'Пока диалогов нет — отметьте, что канал будет здесь',
      mark: true,
      done: !!done.chats || (p.chats || 0) > 0,
    },
    campaigns: {
      title: 'Соберите первую рассылку',
      hint: 'Канал и текст. В прототипе достаточно отметить шаг',
      mark: true,
      done: !!done.campaigns || (p.campaigns || 0) > 0,
    },
    integrations: {
      title: 'Подключите канал или CRM',
      hint: 'Ключи не обязательны — достаточно отметить канал',
      href: `#/p/${pid}/integrations`,
      done: (p.channels || []).length > 0 || !!done.integrations,
    },
    knowledge: {
      title: 'Загрузите документ в базу знаний',
      hint: 'Файлы для AI-агентов этого проекта',
      href: `#/p/${pid}/knowledge`,
      done: !!(DOCS[pid] || []).length || !!done.knowledge,
    },
    numbers: {
      title: 'Подключите номер',
      hint: 'Свой или из витрины. Нужен для звонков проекта',
      href: `#/p/${pid}/numbers`,
      done: !!(PHONES[pid] || []).length || !!done.numbers,
    },
    market: {
      title: 'Посмотрите маркетплейс',
      hint: 'Готовые AI-агенты и сценарии. Можно пропустить',
      href: `#/p/${pid}/market`,
      done: !!done.market,
    },
    analytics: {
      title: 'Откройте аналитику',
      hint: 'Пока пусто — это нормально для нового проекта',
      href: `#/p/${pid}/analytics`,
      done: !!done.analytics,
    },
  }
  pins.forEach((id) => {
    if (map[id]) steps.push({ id, pid, ...map[id] })
  })
  return steps
}

function maybePromote(pid) {
  const p = project(pid)
  if (!p || p.phase === 'live') return false
  const steps = setupSteps(pid)
  if (steps.length && steps.every((s) => s.done)) {
    p.phase = 'live'
    ui.toast = 'Проект в работе. Чеклист запуска скрыли.'
    setTimeout(() => {
      ui.toast = null
      render()
    }, 1800)
    return true
  }
  return false
}

function noteText(pid) {
  if (ui.notes[pid] !== undefined) return ui.notes[pid]
  return NOTES[pid] || ''
}

function attentionFor(pid) {
  const items = []
  const agents = AGENTS[pid] || []
  const jobs = JOBS[pid] || []
  const bots = BOTS[pid] || []
  if (hasModule(pid, 'agents')) {
    agents.filter((a) => a.status === 'error').forEach((a) => items.push({ tone: 'error', text: `${a.name} — ошибка`, href: `#/p/${pid}/agents/${a.id}` }))
    agents.filter((a) => a.status === 'paused').forEach((a) => items.push({ tone: 'paused', text: `${a.name} на паузе`, href: `#/p/${pid}/agents/${a.id}` }))
    agents.filter((a) => a.status === 'draft').forEach((a) => items.push({ tone: 'draft', text: `Черновик: ${a.name}`, href: `#/p/${pid}/agents/${a.id}` }))
  }
  if (hasModule(pid, 'calls')) {
    jobs.filter((j) => j.status === 'paused').forEach((j) => items.push({ tone: 'paused', text: `Обзвон на паузе: ${j.name}`, href: `#/p/${pid}/calls/${j.id}` }))
    jobs.filter((j) => j.status === 'error').forEach((j) => items.push({ tone: 'error', text: `Сбой задания: ${j.name}`, href: `#/p/${pid}/calls/${j.id}` }))
  }
  if (hasModule(pid, 'bots')) {
    bots.filter((b) => b.status === 'paused').forEach((b) => items.push({ tone: 'paused', text: `Сценарий на паузе: ${b.name}`, href: `#/p/${pid}/bots` }))
  }
  return items.slice(0, 4)
}
