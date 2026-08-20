/* js/screens-ops.js — Operational screens inside a project. */
function agentTable(pid, empty) {
  const list = AGENTS[pid] || []
  if (empty || !list.length) {
    return `<div class="card"><div class="empty">
      <div class="illu">${icon('agents')}</div>
      <h2 class="h2">AI-агентов ещё нет</h2>
      <p class="muted">AI-агент отвечает моделью — голосом или в чате. Это не сценарий и не NLU-модель.</p>
      <button class="btn mt-16" type="button" data-nav="#/p/${pid}/agents/new">Создать AI-агента</button>
    </div></div>`
  }
  return `<div class="entity-grid">${list.map((a) => agentCard(pid, a)).join('')}</div>`
}

function screenAgents(pid, empty) {
  const list = AGENTS[pid] || []
  const isEmpty = empty || !list.length
  const toolbar = isEmpty
    ? ''
    : `<div class="toolbar">
      <div class="search">${icon('search', 16)}<input placeholder="Имя или ID" /></div>
      <select class="select"><option>Все статусы</option><option>Активен</option><option>Пауза</option><option>Черновик</option></select>
    </div>`
  return shell(
    pid,
    'agents',
    `${header('AI-агенты', 'agents', entCreateBtn(pid, 'agent'))}
    ${toolbar}
    ${agentTable(pid, empty)}`,
  )
}

function screenBots(pid, empty) {
  const list = BOTS[pid] || []
  const body = empty || !list.length
    ? `<div class="card"><div class="empty"><div class="illu">${icon('bots')}</div>
        <h2 class="h2">Сценариев нет</h2>
        <p class="muted">Сценарий — флоу на блоках. Голос или чат. Внутри может быть NLU-модель или AI-агент.</p>
        <button class="btn mt-16" type="button" data-nav="#/p/${pid}/bots/new">Создать сценарий</button>
      </div></div>`
    : `<div class="entity-grid">${list.map((b) => botCard(pid, b)).join('')}</div>`
  return shell(pid, 'bots', `${header('Сценарии', 'bots', entCreateBtn(pid, 'bot'))}${body}`)
}

function screenNluList(pid, empty) {
  const list = NLU[pid] || []
  const body = empty || !list.length
    ? `<div class="card"><div class="empty"><div class="illu">${icon('nlu')}</div>
        <h2 class="h2">NLU-моделей нет</h2>
        <p class="muted">NLU-модель классифицирует фразы. С клиентом сама не говорит — её подключают в сценарий.</p>
        <button class="btn mt-16" type="button" data-nav="#/p/${pid}/nlu/new">Создать NLU-модель</button>
      </div></div>`
    : `<div class="entity-grid">${list.map((n) => nluCard(pid, n)).join('')}</div>`
  return shell(pid, 'nlu', `${header('NLU-модели', 'nlu', entCreateBtn(pid, 'nlu'))}${body}`)
}

function screenCalls(pid, empty) {
  const list = JOBS[pid] || []
  const tabs = sectionTabs(pid, 'calls', [
    { id: '', label: 'Задания' },
    { id: 'templates', label: 'Шаблоны заданий' },
    { id: 'history', label: 'Детализация' },
    { id: 'schedule', label: 'Расписание' },
    { id: 'blacklist', label: 'Чёрный список' },
  ], '')
  const body = empty || !list.length
    ? `<div class="card"><div class="empty"><div class="illu">${icon('calls')}</div>
        <h2 class="h2">Заданий на обзвон нет</h2>
        <p class="muted">Задание — не агент. Номера и входящая — в «Номерах» и настройках проекта.</p>
        <button class="btn mt-16" type="button" data-nav="#/p/${pid}/calls/new">Создать задание</button>
      </div></div>`
    : `<div class="entity-grid">${list.map((j) => jobCard(pid, j)).join('')}</div>`
  return shell(pid, 'calls', `${header('Звонки', 'calls', entCreateBtn(pid, 'job'))}${tabs}${body}`)
}

function screenCallTemplates(pid) {
  const list = ofList(JOB_TEMPLATES, pid)
  const tabs = sectionTabs(pid, 'calls', [
    { id: '', label: 'Задания' },
    { id: 'templates', label: 'Шаблоны заданий' },
    { id: 'history', label: 'Детализация' },
    { id: 'schedule', label: 'Расписание' },
    { id: 'blacklist', label: 'Чёрный список' },
  ], 'templates')
  const body = list.length
    ? `<div class="entity-grid">${list.map((t) => tplCard('jobtpl', 'is-job', t, pid)).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('calls')}</div><h2 class="h2">Шаблонов заданий нет</h2><p class="muted">Шаблон — заготовка задания. Кто говорит — AI-агент или сценарий.</p><button class="btn mt-16" type="button" data-nav="#/p/${pid}/calls/templates/new">Создать шаблон</button></div></div>`
  return shell(pid, 'calls', `${header('Звонки', 'calls', entCreateBtn(pid, 'jobtpl'), 'calls-templates')}${tabs}${body}`)
}

function screenCallHistory(pid) {
  const rows = (CALL_HISTORY[pid] || CALL_HISTORY.courier)
    .map(
      (r) => `<tr>
        <td class="muted">${r.time}</td>
        <td class="mono">${r.who}</td>
        <td>${r.result}</td>
        <td class="muted">${r.dur}</td>
        <td>${r.brain ? entityRef(r.brain.kind, r.brain.name) : ''}</td>
      </tr>`,
    )
    .join('')
  const tabs = sectionTabs(pid, 'calls', [
    { id: '', label: 'Задания' },
    { id: 'templates', label: 'Шаблоны заданий' },
    { id: 'history', label: 'Детализация' },
    { id: 'schedule', label: 'Расписание' },
    { id: 'blacklist', label: 'Чёрный список' },
  ], 'history')
  return shell(
    pid,
    'calls',
    `${header('Звонки', 'calls', '', 'calls-history')}${tabs}
    <div class="card"><table class="table">
      <thead><tr><th>Время</th><th>Номер</th><th>Результат</th><th>Длит.</th><th>Кто говорил</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`,
  )
}

function screenSchedule(pid) {
  const tabs = sectionTabs(pid, 'calls', [
    { id: '', label: 'Задания' },
    { id: 'templates', label: 'Шаблоны заданий' },
    { id: 'history', label: 'Детализация' },
    { id: 'schedule', label: 'Расписание' },
    { id: 'blacklist', label: 'Чёрный список' },
  ], 'schedule')
  const rows = SCHEDULE.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')
  return shell(
    pid,
    'calls',
    `${header('Звонки', 'calls', '', 'calls-schedule')}${tabs}
    <div class="card"><table class="table">
      <thead><tr><th>Дни</th><th>Окно</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="hint mt-8">Расписание проекта, не компании. Входящие вне окна не берём.</p>`,
  )
}

function screenBlacklist(pid) {
  const tabs = sectionTabs(pid, 'calls', [
    { id: '', label: 'Задания' },
    { id: 'templates', label: 'Шаблоны заданий' },
    { id: 'history', label: 'Детализация' },
    { id: 'schedule', label: 'Расписание' },
    { id: 'blacklist', label: 'Чёрный список' },
  ], 'blacklist')
  const rows = BLACKLIST.map((r) => `<tr><td class="mono">${r.phone}</td><td>${r.reason}</td><td class="muted">${r.added}</td></tr>`).join('')
  return shell(
    pid,
    'calls',
    `${header('Звонки', 'calls', '<button class="btn" type="button" data-action="toast" data-toast="Номер добавлен в прототипе">Добавить номер</button>', 'calls-blacklist')}${tabs}
    <div class="card"><table class="table">
      <thead><tr><th>Номер</th><th>Причина</th><th>Добавлен</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`,
  )
}

function screenChats(pid, tab) {
  const p = project(pid)
  const list = chatsOf(pid)
  const tabs = sectionTabs(pid, 'chats', [
    { id: '', label: 'Диалоги' },
    { id: 'templates', label: 'Шаблоны' },
  ], tab || '')
  const body = !list.length
    ? `<div class="card"><div class="empty"><div class="illu">${icon('chats')}</div>
        <h2 class="h2">Диалогов пока нет</h2>
        <p class="muted">Чаты появятся, когда канал начнёт отвечать в этом проекте.</p>
        ${p.phase === 'setup' ? `<button class="btn mt-16" type="button" data-action="setup-done" data-step="chats" data-pid="${pid}">Канал будет здесь</button>` : `<button class="btn mt-16" type="button" data-nav="#/p/${pid}/chats/new">Создать диалог</button>`}
      </div></div>`
    : `<div class="chats-col">${list.map((c) => chatCard(pid, c)).join('')}</div>`
  return shell(pid, 'chats', `${header('Чаты', 'chats', entCreateBtn(pid, 'chat'))}${tabs}${body}`)
}

function screenChatTemplates(pid) {
  const list = ofList(CHAT_TEMPLATES, pid)
  const tabs = sectionTabs(pid, 'chats', [
    { id: '', label: 'Диалоги' },
    { id: 'templates', label: 'Шаблоны' },
  ], 'templates')
  const body = list.length
    ? `<div class="entity-grid">${list.map((t) => tplCard('chattpl', 'is-chat', t, pid)).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('chats')}</div><h2 class="h2">Шаблонов нет</h2><p class="muted">Быстрые ответы оператору и сценарию.</p><button class="btn mt-16" type="button" data-nav="#/p/${pid}/chats/templates/new">Создать шаблон</button></div></div>`
  return shell(pid, 'chats', `${header('Чаты', 'chats', entCreateBtn(pid, 'chattpl'), 'chats-templates')}${tabs}${body}`)
}

function screenCampaigns(pid) {
  const p = project(pid)
  const list = campaignsOf(pid)
  const empty = p.phase === 'setup' && !list.length
  const tabs = sectionTabs(pid, 'campaigns', [
    { id: '', label: 'Кампании' },
    { id: 'templates', label: 'Шаблоны' },
  ], '')
  const body = empty
    ? `<div class="card"><div class="empty"><div class="illu">${icon('campaigns')}</div>
        <h2 class="h2">Рассылок нет</h2>
        <p class="muted">Кампания живёт в проекте. В v1 достаточно отметить шаг запуска.</p>
        <button class="btn mt-16" type="button" data-nav="#/p/${pid}/campaigns/new">Создать рассылку</button>
      </div></div>`
    : `<div class="entity-grid">${list.map((c) => campaignCard(pid, c)).join('')}</div>`
  return shell(pid, 'campaigns', `${header('Рассылки', 'campaigns', entCreateBtn(pid, 'campaign'))}${tabs}${body}`)
}

function screenCampTemplates(pid) {
  const list = ofList(CAMP_TEMPLATES, pid)
  const tabs = sectionTabs(pid, 'campaigns', [
    { id: '', label: 'Кампании' },
    { id: 'templates', label: 'Шаблоны' },
  ], 'templates')
  const body = list.length
    ? `<div class="entity-grid">${list.map((t) => tplCard('camptpl', 'is-campaign', t, pid)).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('campaigns')}</div><h2 class="h2">Шаблонов рассылок нет</h2><p class="muted">Текст кампании с подстановками. Редактор в v1 не рисуем.</p><button class="btn mt-16" type="button" data-nav="#/p/${pid}/campaigns/templates/new">Создать шаблон</button></div></div>`
  return shell(pid, 'campaigns', `${header('Рассылки', 'campaigns', entCreateBtn(pid, 'camptpl'), 'campaigns-templates')}${tabs}${body}`)
}

function screenIntegrations(pid, none) {
  const p = project(pid)
  const setup = p.phase === 'setup' || Array.isArray(p.channels)
  const items = INTEGRATIONS.map((i) => {
    const connected = setup ? (p.channels || []).includes(i.id) : none ? false : i.connected
    return `<button class="int-card" type="button" data-nav="#/p/${pid}/integrations/${i.id}">
      <div class="int-head">
        <div class="int-logo" style="background:${i.color}">${i.name.slice(0, 2)}</div>
        <div>
          <div class="h5">${i.name}</div>
          <div class="verysmall muted">${i.group}</div>
        </div>
      </div>
      ${connected ? '<span class="chip chip-connected">подключено</span>' : '<span class="chip">не подключено</span>'}
    </button>`
  }).join('')
  const empty = setup && !(p.channels || []).length
  return shell(
    pid,
    'integrations',
    `${header('Интеграции', 'integrations', none || empty ? '<span class="chip">ничего не подключено</span>' : '')}
    <div class="catalog">${items}</div>`,
  )
}

function screenIntegration(pid, iid) {
  const p = project(pid)
  const i = INTEGRATIONS.find((x) => x.id === iid) || INTEGRATIONS[0]
  const connected = Array.isArray(p.channels) ? p.channels.includes(i.id) : i.connected
  const setup = p.phase === 'setup'
  return shell(
    pid,
    'integrations',
    `${header(i.name, 'integrations', connected ? chip('active') : '<span class="chip">не подключено</span>', 'integration')}
    ${formCard(`
      <p class="muted flush">Один шаблон подключения. Отдельные страницы на каждый тип в v1 не рисуем.</p>
      <div class="field"><label>Токен / ключ</label><input class="input" value="${connected ? '•••••••••••• 91qx' : ''}" placeholder="Вставьте ключ" /></div>
      <div class="field"><label>ID</label>${copyField('int_' + i.id + '_04')}</div>
      <div class="row gap-8">
        <button class="btn" type="button" data-action="${setup && !connected ? 'connect-int' : 'toast'}" data-id="${i.id}" data-toast="Сохранили">${connected ? 'Сохранить' : 'Подключить'}</button>
        ${connected ? '<button class="btn btn-danger" type="button">Отключить</button>' : ''}
      </div>
    `)}`,
  )
}

function anStat(label, kpi) {
  if (!kpi) return ''
  const delta = kpi.delta
    ? `<span class="delta ${kpi.good ? 'is-up' : 'is-down'}">${kpi.delta}</span>`
    : ''
  return `<div class="stat">
    <div class="label">${label}</div>
    <div class="value-row"><div class="value">${kpi.value}</div>${delta}</div>
    ${kpi.sub ? `<div class="sub">${kpi.sub}</div>` : ''}
  </div>`
}

function anStats(items) {
  return statsGrid(items)
}

function anCard(title, extra, body) {
  return `<div class="card card-pad">
    <div class="an-card-head">
      <h2 class="h4">${title}</h2>
      ${extra || ''}
    </div>
    ${body}
  </div>`
}

function anLegend(items) {
  return `<div class="an-legend">${items
    .map((x) => `<span><i style="background:${x.color}"></i>${x.label}</span>`)
    .join('')}</div>`
}

function anPairChart(days, a, b, colorA, colorB) {
  const max = Math.max(...a, ...b, 1)
  const cols = days
    .map(
      (d, i) => `<div class="bar-col" title="${d}">
      <div class="bar" style="height:${Math.max(6, Math.round((a[i] / max) * 100))}%;background:${colorA};${a[i] ? '' : 'opacity:.15'}"></div>
      <div class="bar" style="height:${Math.max(6, Math.round((b[i] / max) * 100))}%;background:${colorB};${b[i] ? '' : 'opacity:.15'}"></div>
    </div>`,
    )
    .join('')
  return `<div class="an-chart">
    <div class="bars is-pair">${cols}</div>
    <div class="bar-axis">${days.map((d) => `<span>${d}</span>`).join('')}</div>
  </div>`
}

function anBars(days, values, color) {
  const max = Math.max(...values, 1)
  return `<div class="an-chart">
    <div class="bars">${values
      .map((v) => `<div class="bar" style="height:${Math.max(8, Math.round((v / max) * 100))}%;background:${color}"></div>`)
      .join('')}</div>
    <div class="bar-axis">${days.map((d) => `<span>${d}</span>`).join('')}</div>
  </div>`
}

function anMix(rows, color) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  return `<div class="an-mix">${rows
    .map(
      (r) => `<div class="an-mix-row">
      <div class="small">${r.label}</div>
      <div class="an-mix-bar"><span style="width:${Math.round((r.value / max) * 100)}%;background:${r.color || color}"></span></div>
      <div class="small muted an-mix-n">${r.right != null ? r.right : r.value}</div>
    </div>`,
    )
    .join('')}</div>`
}

function anFunnel(rows) {
  const top = rows[0] ? rows[0].value : 1
  return `<div class="an-funnel">${rows
    .map((r, i) => {
      const pct = Math.max(28, Math.round((r.value / top) * 100))
      const drop = i ? Math.round((1 - r.value / rows[i - 1].value) * 100) : 0
      return `<div class="an-funnel-step">
        <div class="an-funnel-bar" style="width:${pct}%"><span>${r.label}</span><b>${r.right}</b></div>
        ${i ? `<div class="verysmall muted">−${drop}%</div>` : ''}
      </div>`
    })
    .join('')}</div>`
}

function anEmpty(title, text) {
  return `<div class="card"><div class="empty"><div class="illu">${icon('analytics')}</div><h2 class="h2">${title}</h2><p class="muted">${text}</p></div></div>`
}

function analyticsPeriod() {
  return `<select class="select"><option>Последние 7 дней</option><option>30 дней</option><option>Этот месяц</option></select>`
}

function analyticsTabList(pid) {
  const tabs = [{ id: '', label: 'Сводка' }]
  if (projectHas(pid, 'calls')) tabs.push({ id: 'calls', label: 'Звонки' })
  if (projectHas(pid, 'chats')) tabs.push({ id: 'chats', label: 'Чаты' })
  if (projectHas(pid, 'campaigns')) tabs.push({ id: 'campaigns', label: 'Рассылки' })
  tabs.push({ id: 'spend', label: 'Расход' }, { id: 'reports', label: 'Отчёты' })
  return tabs
}

function analyticsKpis(pid, a) {
  const voice = projectHas(pid, 'calls')
  const chat = projectHas(pid, 'chats')
  const camp = projectHas(pid, 'campaigns')
  const k = a.kpis || {}
  const items = [
    voice && k.calls && anStat('Звонки', k.calls),
    chat && k.chats && anStat('Диалоги', k.chats),
    voice && k.answered && anStat('Дозвон', k.answered),
    chat && k.csi && anStat('CSI', k.csi),
    chat && k.first && anStat('Первый ответ', k.first),
    voice && k.avgDur && anStat('Средняя длина', k.avgDur),
    camp && k.sent && anStat('Отправлено', k.sent),
    camp && k.delivered && anStat('Доставка', k.delivered),
  ].filter(Boolean)
  const spend = k.spend && anStat('Расход', k.spend)
  if (spend) items.splice(Math.min(items.length, 4), 0, spend)
  return anStats(items.slice(0, 5))
}

function analyticsSummary(pid, a) {
  const voice = projectHas(pid, 'calls')
  const chat = projectHas(pid, 'chats')
  const s = a.series
  const legend = [
    voice && { color: 'var(--malachite)', label: 'Звонки' },
    chat && { color: 'var(--blue)', label: 'Диалоги' },
  ].filter(Boolean)
  let chartBody = anBars(s.days, s.spend, 'var(--purple)')
  if (voice && chat) chartBody = anPairChart(s.days, s.calls, s.chats, 'var(--malachite)', 'var(--blue)')
  else if (voice) chartBody = anBars(s.days, s.calls, 'var(--malachite)')
  else if (chat) chartBody = anBars(s.days, s.chats, 'var(--blue)')
  const chart = anCard(
    'Нагрузка по дням',
    anLegend(legend.length ? legend : [{ color: 'var(--purple)', label: 'Расход' }]),
    chartBody,
  )
  const side = []
  if (a.calls && voice) {
    side.push(anCard('Исход звонка', '', anMix(a.calls.statuses, 'var(--malachite)')))
  } else if (a.chats && chat) {
    side.push(anCard('Каналы диалогов', '', anMix(a.chats.sources, 'var(--blue)')))
  }
  if (a.spend) side.push(anCard('Что съело деньги', '<span class="verysmall muted">проект, не биллинг</span>', anMix(a.spend.items, 'var(--purple)')))
  const quality = a.chats && chat
    ? `<div class="an-kpi-strip">
        <div><div class="label">CSI</div><div class="value">${a.chats.quality.csi}</div></div>
        <div><div class="label">NPS</div><div class="value">${a.chats.quality.nps}</div></div>
        <div><div class="label">FCR</div><div class="value">${a.chats.quality.fcr}</div></div>
        <div><div class="label">Первый ответ</div><div class="value">${a.chats.quality.firstAnswer}</div></div>
      </div>`
    : ''
  const jobs = a.calls && voice && a.calls.jobs
    ? `<div class="card mt-16"><table class="table">
        <thead><tr><th>Задание</th><th>Звонки</th><th>Человек</th><th>Эффект</th><th>Ср. длина</th><th>Расход</th></tr></thead>
        <tbody>${a.calls.jobs
          .map(
            (j) => `<tr>
            <td><button class="btn btn-ghost table-link" type="button" data-nav="#/p/${pid}/calls/${j.id}">${j.name}</button></td>
            <td>${j.calls}</td><td>${j.human}</td><td>${j.effective}</td><td class="muted">${j.avgDur}</td><td>${j.cost}</td>
          </tr>`,
          )
          .join('')}</tbody>
      </table></div>`
    : ''
  return `${analyticsKpis(pid, a)}
    <div class="an-cols mt-16">${chart}${side[0] || ''}</div>
    ${quality ? `<div class="mt-16">${anCard('Качество диалогов', '<span class="verysmall muted">CSI · NPS · FCR</span>', quality)}</div>` : ''}
    ${side[1] ? `<div class="mt-16">${side[1]}</div>` : ''}
    ${jobs}
    <p class="hint mt-8">Сводка проекта за период. Счета и подписка — в биллинге аккаунта, не здесь.</p>`
}

function analyticsCalls(pid, a) {
  const c = a.calls
  if (!c) return anEmpty('Голоса в проекте нет', 'Звонки появятся, когда в контуре будет задание или входящая линия.')
  const stats = anStats([
    anStat('Исходящие', { value: c.outgoing.count, sub: c.outgoing.cost, good: true }),
    anStat('Входящие', { value: c.incoming.count, sub: c.incoming.cost, good: true }),
    anStat('Дозвон', { value: c.answered, sub: 'человек взял трубку' }),
    anStat('Средняя длина', { value: c.avgDur, sub: `исх. ${c.outgoing.avgDur} · вх. ${c.incoming.avgDur}` }),
    anStat('Расход голоса', { value: c.cost, sub: 'транк + STT/TTS/LLM' }),
  ])
  const rows = (c.recent || [])
    .map(
      (r) => `<tr>
        <td class="muted">${r.time}</td>
        <td class="mono">${r.phone}</td>
        <td>${r.dir}</td>
        <td><span class="chip">${r.status}</span></td>
        <td class="muted">${r.dur}</td>
        <td>${r.price}</td>
        <td class="small">${r.brain}</td>
      </tr>`,
    )
    .join('')
  const jobs = (c.jobs || [])
    .map(
      (j) => `<tr>
        <td><button class="btn btn-ghost table-link" type="button" data-nav="#/p/${pid}/calls/${j.id}">${j.name}</button></td>
        <td>${j.candidates}</td><td>${j.calls}</td><td>${j.answered}</td><td>${j.human}</td><td>${j.effective}</td><td class="muted">${j.avgDur}</td><td>${j.cost}</td>
      </tr>`,
    )
    .join('')
  return `${stats}
    <div class="an-cols mt-16">
      ${anCard('Звонки по дням', anLegend([{ color: 'var(--malachite)', label: 'Голос' }]), anBars(a.series.days, a.series.calls, 'var(--malachite)'))}
      ${anCard('Исход', '', anMix(c.statuses, 'var(--malachite)'))}
    </div>
    <div class="mt-16">${anCard('Расход на звонок', '<span class="verysmall muted">транк · STT · TTS · LLM · AMD</span>', anMix(c.costSplit, 'var(--purple)'))}</div>
    <div class="card mt-16"><table class="table">
      <thead><tr><th>Задание</th><th>База</th><th>Звонки</th><th>Ответ</th><th>Человек</th><th>Эффект</th><th>Длит.</th><th>₽</th></tr></thead>
      <tbody>${jobs}</tbody>
    </table></div>
    <div class="card mt-16"><table class="table">
      <thead><tr><th>Время</th><th>Номер</th><th>Напр.</th><th>Статус</th><th>Длит.</th><th>Цена</th><th>Кто говорил</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="hint mt-8">Агрегат по звонку: длительность, STT/TTS, статус. Журнал номеров — вкладка «Детализация» в «Звонках».</p>`
}

function analyticsChats(pid, a) {
  const c = a.chats
  if (!c) return anEmpty('Диалогов в проекте нет', 'Чаты появятся, когда в контуре будет мессенджер или AI-агент на текст.')
  const stats = anStats([
    anStat('Диалоги', { value: c.sessions, sub: `сценарий ${c.messages.bot} · клиент ${c.messages.client}` }),
    anStat('CSI', { value: c.quality.csi, sub: `промоутеры в оценке` }),
    anStat('NPS', { value: c.quality.nps }),
    anStat('FCR', { value: c.quality.fcr, sub: 'решили с первого касания' }),
    anStat('Первый ответ', { value: c.quality.firstAnswer, sub: 'оператор, не сценарий' }),
  ])
  const ops = (c.operators || [])
    .map(
      (o) => `<tr>
        <td>${o.name}</td><td>${o.handled}</td><td>${o.answered}</td><td class="muted">${o.wait}</td><td>${o.csi}</td>
      </tr>`,
    )
    .join('')
  return `${stats}
    <div class="an-cols mt-16">
      ${anCard('Сообщения по дням', anLegend([{ color: 'var(--blue)', label: 'Диалоги' }]), anBars(a.series.days, a.series.chats, 'var(--blue)'))}
      ${anCard('Откуда пишут', '', anMix(c.sources, 'var(--blue)'))}
    </div>
    <div class="an-cols mt-16">
      ${anCard('Что говорят клиенты', '<span class="verysmall muted">популярные фразы</span>', anMix(c.phrases, 'var(--sky)'))}
      ${anCard('Воронка сценария', '<span class="verysmall muted">узлы, не редактор</span>', anFunnel(c.funnel))}
    </div>
    <div class="card mt-16"><table class="table">
      <thead><tr><th>Оператор</th><th>Диалоги</th><th>Ответил</th><th>Первый ответ</th><th>CSI</th></tr></thead>
      <tbody>${ops}</tbody>
    </table></div>
    <p class="hint mt-8">Качество и фразы — про этот проект. Инбокс оператора в v1 не открываем.</p>`
}

function analyticsCampaigns(pid, a) {
  const m = a.messaging
  if (!m) return anEmpty('Рассылок в проекте нет', 'Кампании SMS, WhatsApp и email появятся, когда модуль включён в контуре.')
  const ch = (m.channels || [])
    .map(
      (r) => `<tr>
        <td>${r.channel}</td><td>${r.sent}</td><td>${r.delivered}</td><td>${r.rate}</td><td>${r.price}</td>
      </tr>`,
    )
    .join('')
  return `${anStats([
    anStat('Отправлено', { value: m.sent }),
    anStat('Доставлено', { value: m.delivered }),
    anStat('Расход рассылок', { value: m.cost, sub: 'не счёт компании' }),
  ])}
    <div class="an-cols mt-16">
      ${anCard('Отправки по дням', '', anBars(a.series.days, m.series, 'var(--pumpkin)'))}
      ${anCard('Статусы', '', anMix(m.statuses, 'var(--pumpkin)'))}
    </div>
    <div class="card mt-16"><table class="table">
      <thead><tr><th>Канал</th><th>Отправлено</th><th>Доставлено</th><th>%</th><th>Расход</th></tr></thead>
      <tbody>${ch}</tbody>
    </table></div>
    <p class="hint mt-8">Доставка кампании проекта. Карточки рассылок — в разделе «Рассылки».</p>`
}

function analyticsSpend(pid, a) {
  const s = a.spend
  if (!s) return anEmpty('Расхода нет', 'Когда проект начнёт звонить или писать — здесь появится разбивка по сервисам.')
  return `${anStats([anStat('Расход проекта', { value: s.total, delta: (a.kpis.spend || {}).delta, good: false, sub: '7 дней · без подписки платформы' })])}
    <div class="an-cols mt-16">
      ${anCard('По сервисам', '<span class="verysmall muted">CIS · Chat · Messaging · Agent · GPT</span>', anMix(s.items, 'var(--purple)'))}
      ${anCard('Расход по дням', '', anBars(a.series.days, a.series.spend, 'var(--purple)'))}
    </div>
    <div class="an-cols mt-16">
      ${s.gpt && s.gpt.length ? anCard('GPT по моделям', '', anMix(s.gpt, 'var(--purple)')) : ''}
      ${s.tts && s.tts.length ? anCard('Синтез по провайдеру', '', anMix(s.tts, 'var(--sky)')) : anCard('Синтез', '', '<p class="muted flush">В этом проекте TTS почти не биллится — канал текстовый.</p>')}
    </div>
    <p class="hint mt-8">Это себестоимость контура. Пополнить баланс и скачать счета — Биллинг из аватара.</p>`
}

function analyticsReports(pid) {
  const list = ofList(REPORTS, pid)
  const body = list.length
    ? `<div class="entity-grid">${list.map((r) => reportCard(pid, r)).join('')}</div>`
    : anEmpty('Отчётов нет', 'Сохраните срез, чтобы не собирать одни и те же фильтры каждый понедельник.')
  return body
}

function screenAnalytics(pid, tab) {
  const a = analyticsOf(pid)
  const tabs = sectionTabs(pid, 'analytics', analyticsTabList(pid), tab || '')
  const voice = projectHas(pid, 'calls')
  const chat = projectHas(pid, 'chats')
  const camp = projectHas(pid, 'campaigns')
  let guide = 'analytics'
  let body = analyticsSummary(pid, a)
  let right = analyticsPeriod()
  if (tab === 'calls') {
    guide = 'analytics-calls'
    body = voice ? analyticsCalls(pid, a) : anEmpty('Голоса в этом проекте нет', 'Вкладка звонков нужна контуру с заданиями или входящей линией.')
  } else if (tab === 'chats') {
    guide = 'analytics-chats'
    body = chat ? analyticsChats(pid, a) : anEmpty('Чатов в этом проекте нет', 'Вкладка диалогов нужна контуру с мессенджером.')
  } else if (tab === 'campaigns') {
    guide = 'analytics-campaigns'
    body = camp ? analyticsCampaigns(pid, a) : anEmpty('Рассылок в этом проекте нет', 'Кампании живут отдельной вкладкой, не пунктом меню.')
  } else if (tab === 'spend') {
    guide = 'analytics-spend'
    body = analyticsSpend(pid, a)
  } else if (tab === 'reports') {
    guide = 'analytics-reports'
    right = entCreateBtn(pid, 'report')
    body = analyticsReports(pid)
  }
  return shell(pid, 'analytics', `${header('Аналитика', 'analytics', right, guide)}${tabs}${body}`)
}

function screenSettings(pid, tab) {
  const p = project(pid)
  entPrepare(pid, 'project', 'edit', pid)
  ensureHist('project', pid, p)
  const general = `${formCard(`
    <div class="field"><label>Имя</label><input class="input" data-ent-field="name" value="${attrEsc(ui.ent.draft.name || p.name)}" /></div>
    <div class="field"><label>Описание</label><textarea class="textarea" data-ent-field="desc">${ui.ent.draft.desc || p.desc}</textarea></div>
    <div class="row gap-8">
      <button class="btn" type="button" data-action="ent-save-ask" data-ent="project" data-pid="${pid}" data-id="${pid}">Сохранить</button>
      <button class="btn btn-secondary" type="button" data-action="ent-json" data-ent="project" data-pid="${pid}" data-id="${pid}">Посмотреть JSON</button>
    </div>`)}
    ${versionsCard('project', pid, p)}
    <div class="danger-zone mt-16 form-narrow">
      <div><div class="h5">Опасная зона</div><div class="small muted">Удалит только этот проект. AI-агенты и задания внутри пропадут. Биллинг компании не тронется.</div></div>
      <button class="btn btn-danger" type="button" data-action="ent-delete-ask" data-ent="project" data-pid="${pid}" data-id="${pid}" data-title="${attrEsc(p.name)}">Удалить проект</button>
    </div>`
  const members = `<div class="card"><table class="table">
      <thead><tr><th>Человек</th><th>Роль в проекте</th></tr></thead>
      <tbody>
        <tr><td>Анна Козлова<br><span class="mono muted-dark">usr_anna</span></td><td>admin</td></tr>
        <tr><td>Кирилл Новиков<br><span class="mono muted-dark">usr_kir</span></td><td>member</td></tr>
      </tbody>
    </table></div>
    <p class="hint mt-8">Роли проекта: admin / member. Это не IAM SUPER_ADMIN.</p>`
  const telephony = `<div class="stack form-wide">
    <div class="card card-pad">
      <div class="h5">Входящее правило</div>
      <p class="small muted flush mt-8">Входящие на ${entityRef('phone', '+7 3812 55-12-00')} идут в ${entityRef('graph', 'Входящая запись')}. Вне расписания — автоответчик.</p>
    </div>
    <div class="card card-pad">
      <div class="h5">Пул исходящих</div>
      <p class="small muted flush mt-8">2 номера проекта. Карточки — в разделе «Номера».</p>
    </div>
    <div class="card card-pad">
      <div class="h5">Стоп-слова / перебивания</div>
      <p class="small muted flush mt-8">Список платформы. В v1 не редактируем.</p>
    </div>
  </div>`
  const body = tab === 'members' ? members : tab === 'telephony' ? telephony : general
  const right = tab === 'members' ? '<button class="btn" type="button">Пригласить</button>' : ''
  const guide = tab === 'members' ? 'settings-members' : tab === 'telephony' ? 'settings-telephony' : 'settings'
  return shell(
    pid,
    'settings',
    `${header('Настройки проекта', 'settings', right, guide)}
    <div class="tabs">
      <a class="tab ${tab === 'general' ? 'is-active' : ''}" data-nav="#/p/${pid}/settings">Проект</a>
      <a class="tab ${tab === 'members' ? 'is-active' : ''}" data-nav="#/p/${pid}/settings/members">Участники</a>
      <a class="tab ${tab === 'telephony' ? 'is-active' : ''}" data-nav="#/p/${pid}/settings/telephony">Телефония</a>
    </div>
    ${body}`,
  )
}

function screenKnowledge(pid) {
  const list = ofList(DOCS, pid)
  const body = list.length
    ? `<div class="entity-grid">${list.map((d) => docCard(pid, d)).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('knowledge')}</div>
        <h2 class="h2">База знаний пуста</h2>
        <p class="muted">Документы для AI-агентов этого проекта. Как «База знаний» в текущем ЛК у AI-агентов.</p>
        <button class="btn mt-16" type="button" data-nav="#/p/${pid}/knowledge/new">Добавить документ</button>
      </div></div>`
  return shell(pid, 'knowledge', `${header('База знаний', 'knowledge', entCreateBtn(pid, 'doc'))}${body}`)
}

function screenNumbers(pid, tab) {
  const tabs = sectionTabs(pid, 'numbers', [
    { id: '', label: 'Мои номера' },
    { id: 'shop', label: 'Витрина' },
  ], tab || '')
  if (tab === 'shop') {
    return shell(pid, 'numbers', `${header('Номера', 'numbers', entCreateBtn(pid, 'offer'), 'numbers-shop')}${tabs}<div class="entity-grid">${MARKET_PHONES.map((ph) => offerCard(pid, ph)).join('')}</div>`)
  }
  const list = ofList(PHONES, pid)
  const body = list.length
    ? `<div class="entity-grid">${list.map((ph) => phoneCard(pid, ph)).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('numbers')}</div>
        <h2 class="h2">Номеров нет</h2>
        <p class="muted">Возьмите из витрины или привяжите свой. Нужны для заданий и входящей.</p>
        <div class="row gap-8 mt-16">
          <button class="btn" type="button" data-nav="#/p/${pid}/numbers/new">Привязать номер</button>
          <button class="btn btn-secondary" type="button" data-nav="#/p/${pid}/numbers/shop">Открыть витрину</button>
        </div>
      </div></div>`
  return shell(pid, 'numbers', `${header('Номера', 'numbers', entCreateBtn(pid, 'phone'))}${tabs}${body}`)
}

function screenMarket(pid) {
  return shell(
    pid,
    'market',
    `${header('Маркетплейс', 'market', entCreateBtn(pid, 'market'))}
    <div class="entity-grid">${MARKET.map((m) => marketCard(pid, m)).join('')}</div>`,
  )
}
