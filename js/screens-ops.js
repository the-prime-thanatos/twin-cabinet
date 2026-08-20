/* js/screens-ops.js — Operational screens inside a project. */
function agentTable(pid, empty) {
  const list = AGENTS[pid] || []
  if (empty || !list.length) {
    return `<div class="card"><div class="empty">
      <div class="illu">${icon('agents')}</div>
      <h2 class="h2">AI-агентов ещё нет</h2>
      <p class="muted">AI-агент отвечает моделью — голосом или в чате. Это не сценарий и не NLU-модель.</p>
      <button class="btn mt-16" type="button" data-action="modal" data-modal="create-agent">Создать AI-агента</button>
    </div></div>`
  }
  return `<div class="entity-grid">${list.map((a) => agentCard(pid, a)).join('')}</div>`
}

function screenAgents(pid, empty) {
  return shell(
    pid,
    'agents',
    `${header('AI-агенты', 'agents', `<button class="btn" data-action="modal" data-modal="create-agent">${icon('plus', 16)} Создать AI-агента</button>`)}
    <div class="toolbar">
      <div class="search">${icon('search', 16)}<input placeholder="Имя или ID" /></div>
      <select class="select" style="width:180px"><option>Все статусы</option><option>Активен</option><option>Пауза</option><option>Черновик</option></select>
    </div>
    ${agentTable(pid, empty)}`,
  )
}

function screenAgent(pid, aid) {
  const a = (AGENTS[pid] || []).find((x) => x.id === aid) || (AGENTS.courier || [])[0]
  const settings = `<div class="stack" style="max-width:560px">
    <div class="field"><label>Имя</label><input class="input" value="${a.name}" /></div>
    <div class="field"><label>Язык</label><select class="select"><option>Русский</option><option>English</option></select></div>
    <div class="field"><label>ID</label><div class="search"><span class="mono">${a.id}</span><button class="icon-btn" type="button">${icon('copy', 16)}</button></div></div>
    <button class="btn" type="button" data-action="toast" data-toast="Сохранили">Сохранить</button>
  </div>`
  const kb = `<div class="card"><table class="table">
    <thead><tr><th>Документ</th><th>Обновлён</th><th></th></tr></thead>
    <tbody>
      <tr><td>${icon('file', 16)} Скрипт скрининга.pdf</td><td class="muted">18 авг</td><td></td></tr>
      <tr><td>${icon('file', 16)} FAQ по слотам.docx</td><td class="muted">12 авг</td><td></td></tr>
    </tbody>
  </table></div>
  <button class="btn btn-secondary mt-16" type="button" data-nav="#/p/${pid}/knowledge">Все документы проекта</button>
  <p class="hint mt-8">В v1 это список файлов, не редактор базы. Полный список — в «Базе знаний».</p>`
  return shell(
    pid,
    'agents',
    `${header(a.name, 'agents', `<div class="chips">${kindChip(a.kind || 'ai')}${mediumChip(a.medium || 'voice')}${chip(a.status)}</div>`, 'agent')}
    <div class="tabs">
      <button class="tab ${ui.tab === 'settings' ? 'is-active' : ''}" data-action="tab" data-tab="settings">Настройки</button>
      <button class="tab ${ui.tab === 'kb' ? 'is-active' : ''}" data-action="tab" data-tab="kb">База знаний</button>
    </div>
    ${ui.tab === 'kb' ? kb : settings}`,
  )
}

function screenBots(pid, empty) {
  const list = BOTS[pid] || []
  const body = empty || !list.length
    ? `<div class="card"><div class="empty"><div class="illu">${icon('bots')}</div>
        <h2 class="h2">Сценариев нет</h2>
        <p class="muted">Сценарий — флоу на блоках. Голос или чат. Внутри может быть NLU-модель или AI-агент.</p>
        <button class="btn mt-16" type="button" data-action="create-bot">Создать сценарий</button>
      </div></div>`
    : `<div class="entity-grid">${list.map((b) => botCard(pid, b)).join('')}</div>`
  return shell(pid, 'bots', `${header('Сценарии', 'bots', `<button class="btn" type="button" data-action="create-bot">${icon('plus', 16)} Создать сценарий</button>`)}${body}`)
}

function screenBot(pid, bid) {
  const b = findBot(pid, bid) || (BOTS[pid] || BOTS.courier || [])[0]
  const nlu = b.nluId && findNlu(pid, b.nluId)
  const ai = b.aiId && findAgent(pid, b.aiId)
  const links = [
    nlu && `<button class="btn btn-ghost" type="button" data-nav="#/p/${pid}/nlu/${nlu.id}">${kindChip('nlu')} ${nlu.name}</button>`,
    ai && `<button class="btn btn-ghost" type="button" data-nav="#/p/${pid}/agents/${ai.id}">${kindChip('ai')} ${ai.name}</button>`,
  ].filter(Boolean)
  return shell(
    pid,
    'bots',
    `${header(b.name, 'bots', `<div class="chips">${kindChip('graph')}${mediumChip(b.medium || 'text')}${chip(b.status)}</div>`, 'bot')}
    <div class="card card-pad stack" style="max-width:560px">
      <p class="muted">Сценарий отвечает блоками. Canvas в v1 не входит.</p>
      <div class="field"><label>ID</label><div class="mono muted-dark">${b.id}</div></div>
      <div class="field"><label>Канал доставки</label><div>${b.channel}</div></div>
      <div>
        <div class="h5" style="margin-bottom:8px">Внутри сценария</div>
        ${links.length ? `<div class="stack gap-8">${links.join('')}</div>` : '<p class="muted" style="margin:0">NLU и AI не привязаны.</p>'}
      </div>
      <button class="btn btn-temp" type="button" data-action="toast" data-toast="Редактор в v1 старый, сюда не рисуем">Открыть редактор</button>
    </div>`,
  )
}

function screenNluList(pid, empty) {
  const list = NLU[pid] || []
  const body = empty || !list.length
    ? `<div class="card"><div class="empty"><div class="illu">${icon('nlu')}</div>
        <h2 class="h2">NLU-моделей нет</h2>
        <p class="muted">NLU-модель классифицирует фразы. С клиентом сама не говорит — её подключают в сценарий.</p>
        <button class="btn mt-16" type="button" data-action="create-nlu">Создать NLU-модель</button>
      </div></div>`
    : `<div class="entity-grid">${list.map((n) => nluCard(pid, n)).join('')}</div>`
  return shell(pid, 'nlu', `${header('NLU-модели', 'nlu', `<button class="btn" type="button" data-action="create-nlu">${icon('plus', 16)} Создать NLU-модель</button>`)}${body}`)
}

function screenNlu(pid, nid) {
  const n = findNlu(pid, nid) || (NLU[pid] || NLU.courier || [])[0]
  const host = n.usedIn && findBot(pid, n.usedIn)
  return shell(
    pid,
    'nlu',
    `${header(n.name, 'nlu', `<div class="chips">${kindChip('nlu')}${chip(n.status)}</div>`, 'nlu-one')}
    <div class="card card-pad stack" style="max-width:560px">
      <p class="muted">NLU-модель не отвечает клиенту напрямую. Её вызывает сценарий.</p>
      <div class="field"><label>ID</label><div class="mono muted-dark">${n.id}</div></div>
      <div class="field"><label>Намерения</label><div>${n.intents || 0}</div></div>
      <div class="field"><label>Сущности</label><div>${n.entities || 0}</div></div>
      ${host ? `<button class="btn btn-ghost" type="button" data-nav="#/p/${pid}/bots/${host.id}">${kindChip('graph')} ${host.name}</button>` : '<p class="muted" style="margin:0">Пока не подключён к сценарию.</p>'}
    </div>`,
  )
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
        <button class="btn mt-16" type="button" data-action="create-job">Создать задание</button>
      </div></div>`
    : `<div class="entity-grid">${list.map((j) => jobCard(pid, j)).join('')}</div>`
  return shell(pid, 'calls', `${header('Звонки', 'calls', `<button class="btn" type="button" data-action="create-job">${icon('plus', 16)} Создать задание</button>`)}${tabs}${body}`)
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
    ? `<div class="entity-grid">${list.map((t) => tplCard('jobtpl', 'is-job', t)).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('calls')}</div><h2 class="h2">Шаблонов заданий нет</h2><p class="muted">Шаблон — заготовка задания. Кто говорит — AI-агент или сценарий.</p></div></div>`
  return shell(pid, 'calls', `${header('Звонки', 'calls', '', 'calls-templates')}${tabs}${body}`)
}

function screenCallHistory(pid) {
  const rows = (CALL_HISTORY[pid] || CALL_HISTORY.courier)
    .map(
      (r) => `<tr>
        <td class="muted">${r.time}</td>
        <td class="mono">${r.who}</td>
        <td>${r.result}</td>
        <td class="muted">${r.dur}</td>
        <td>${r.brain ? kindChip(r.brain.kind) + ' ' + r.brain.name : ''}</td>
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

function screenJob(pid, jid) {
  const j = (JOBS[pid] || []).find((x) => x.id === jid) || (JOBS.courier || [])[0]
  const playing = j.status === 'running'
  const people = [
    ['Игорь Смирнов', '+7 999 120-44-11', 'ответил', '0:42'],
    ['Мария Ким', '+7 913 220-11-04', 'нет ответа', '—'],
    ['Павел Орлов', '+7 905 441-90-12', 'перезвон', '0:11'],
    ['Алина Бек', '+7 777 102-33-90', 'ошибка', '—'],
  ]
  const rows = people
    .map(
      (r) => `<tr><td>${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td class="muted">${r[3]}</td></tr>`,
    )
    .join('')
  return shell(
    pid,
    'calls',
    `${header(
      j.name,
      'calls',
      `<div class="row gap-8">${j.brain ? kindChip(j.brain.kind) : ''}${chip(j.status)}
        <button class="btn ${playing ? 'btn-secondary' : ''}" type="button">${playing ? icon('pause', 16) + ' Пауза' : icon('play', 16) + ' Запустить'}</button>
      </div>`,
      'job',
    )}
    <div class="card card-pad" style="margin-bottom:16px">
      <div class="h5" style="margin-bottom:8px">Кто отвечает</div>
      ${j.brain ? `<button class="btn btn-ghost" type="button" data-nav="${brainHref(pid, j.brain)}">${kindChip(j.brain.kind)} ${j.brain.name}</button>` : '<p class="muted" style="margin:0">Не назначен AI-агент или сценарий.</p>'}
    </div>
    <div class="card"><table class="table">
      <thead><tr><th>Кандидат</th><th>Номер</th><th>Результат</th><th>Длительность</th></tr></thead>
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
        ${p.phase === 'setup' ? `<button class="btn mt-16" type="button" data-action="setup-done" data-step="chats" data-pid="${pid}">Канал будет здесь</button>` : ''}
      </div></div>`
    : `<div class="chats-col">${list.map(chatCard).join('')}</div>`
  return shell(pid, 'chats', `${header('Чаты', 'chats')}${tabs}${body}`)
}

function screenChatTemplates(pid) {
  const list = ofList(CHAT_TEMPLATES, pid)
  const tabs = sectionTabs(pid, 'chats', [
    { id: '', label: 'Диалоги' },
    { id: 'templates', label: 'Шаблоны' },
  ], 'templates')
  const body = list.length
    ? `<div class="entity-grid">${list.map((t) => tplCard('chattpl', 'is-chat', t)).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('chats')}</div><h2 class="h2">Шаблонов нет</h2><p class="muted">Быстрые ответы оператору и сценарию.</p></div></div>`
  return shell(pid, 'chats', `${header('Чаты', 'chats', '', 'chats-templates')}${tabs}${body}`)
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
        <button class="btn mt-16" type="button" data-action="setup-done" data-step="campaigns" data-pid="${pid}">Отметить шаг</button>
      </div></div>`
    : `<div class="entity-grid">${list.map(campaignCard).join('')}</div>`
  return shell(pid, 'campaigns', `${header('Рассылки', 'campaigns')}${tabs}${body}`)
}

function screenCampTemplates(pid) {
  const list = ofList(CAMP_TEMPLATES, pid)
  const tabs = sectionTabs(pid, 'campaigns', [
    { id: '', label: 'Кампании' },
    { id: 'templates', label: 'Шаблоны' },
  ], 'templates')
  const body = list.length
    ? `<div class="entity-grid">${list.map((t) => tplCard('camptpl', 'is-campaign', t)).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('campaigns')}</div><h2 class="h2">Шаблонов рассылок нет</h2></div></div>`
  return shell(pid, 'campaigns', `${header('Рассылки', 'campaigns', '', 'campaigns-templates')}${tabs}${body}`)
}

function screenIntegrations(pid, none) {
  const p = project(pid)
  const setup = p.phase === 'setup' || Array.isArray(p.channels)
  const items = INTEGRATIONS.map((i) => {
    const connected = setup ? (p.channels || []).includes(i.id) : none ? false : i.connected
    return `<button class="int-card" type="button" data-nav="#/p/${pid}/integrations/${i.id}">
      <div class="int-logo" style="background:${i.color}">${i.name.slice(0, 2)}</div>
      <div class="h5">${i.name}</div>
      ${connected ? '<span class="chip chip-connected">подключено</span>' : '<span class="chip">не подключено</span>'}
    </button>`
  }).join('')
  const empty = setup && !(p.channels || []).length
  return shell(
    pid,
    'integrations',
    `${header('Интеграции', 'integrations')}
    ${none || empty ? '<p class="muted" style="margin-top:-12px">Ничего не подключено в этом проекте.</p>' : ''}
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
    <div class="card card-pad stack" style="max-width:560px">
      <p class="muted">Один шаблон подключения. Отдельные страницы на каждый тип в v1 не рисуем.</p>
      <div class="field"><label>Токен / ключ</label><input class="input" value="${connected ? '•••••••••••• 91qx' : ''}" placeholder="Вставьте ключ" /></div>
      <div class="field"><label>ID</label><div class="mono muted-dark">int_${i.id}_04</div></div>
      <div class="row gap-8">
        <button class="btn" type="button" data-action="${setup && !connected ? 'connect-int' : 'toast'}" data-id="${i.id}" data-toast="Сохранили">${connected ? 'Сохранить' : 'Подключить'}</button>
        ${connected ? '<button class="btn btn-danger" type="button">Отключить</button>' : ''}
      </div>
    </div>`,
  )
}

function screenAnalytics(pid, tab) {
  const heights = [40, 70, 55, 90, 62, 48, 80]
  const tabs = sectionTabs(pid, 'analytics', [
    { id: '', label: 'Сводка' },
    { id: 'reports', label: 'Отчёты' },
  ], tab || '')
  if (tab === 'reports') {
    const list = ofList(REPORTS, pid)
    const body = list.length
      ? `<div class="entity-grid">${list.map(reportCard).join('')}</div>`
      : `<div class="card"><div class="empty"><div class="illu">${icon('analytics')}</div><h2 class="h2">Отчётов нет</h2><p class="muted">Конструктор как в текущем ЛК. В v1 — карточка отчёта.</p></div></div>`
    return shell(pid, 'analytics', `${header('Аналитика', 'analytics', '', 'analytics-reports')}${tabs}${body}`)
  }
  return shell(
    pid,
    'analytics',
    `${header('Аналитика', 'analytics', `<select class="select" style="width:200px"><option>Последние 7 дней</option><option>30 дней</option><option>Этот месяц</option></select>`)}
    ${tabs}
    <div class="grid-stats" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat"><div class="label">Звонки</div><div class="value">1 284</div></div>
      <div class="stat"><div class="label">Диалоги</div><div class="value">3 041</div></div>
      <div class="stat"><div class="label">Расход</div><div class="value">8 120 ₽</div></div>
    </div>
    <div class="card card-pad mt-24">
      <h2 class="h4">Звонки по дням</h2>
      <div class="bars">${heights.map((h) => `<div class="bar" style="height:${h}%"></div>`).join('')}</div>
    </div>`,
  )
}

function screenSettings(pid, tab) {
  const p = project(pid)
  const general = `<div class="stack" style="max-width:560px">
    <div class="field"><label>Имя</label><input class="input" value="${p.name}" /></div>
    <div class="field"><label>Описание</label><textarea class="textarea">${p.desc}</textarea></div>
    <button class="btn" type="button" data-action="toast" data-toast="Сохранили">Сохранить</button>
    <div class="card card-pad">
      <div class="h5">Телефония</div>
      <p class="muted">Входящие правила, пулы и стоп-слова — отдельная вкладка. Не пункт «Финансы».</p>
      <button class="btn btn-secondary" type="button" data-nav="#/p/${pid}/settings/telephony">Открыть</button>
    </div>
    <div class="danger-zone">
      <div><div class="h5">Опасная зона</div><div class="small muted">Удалит только этот проект</div></div>
      <button class="btn btn-danger" type="button" data-action="modal" data-modal="confirm-delete">Удалить проект</button>
    </div>
  </div>`
  const members = `<div class="toolbar"><button class="btn" type="button">Пригласить</button></div>
    <div class="card"><table class="table">
      <thead><tr><th>Человек</th><th>Роль в проекте</th><th></th></tr></thead>
      <tbody>
        <tr><td>Анна Козлова<br><span class="mono muted-dark">usr_anna</span></td><td>admin</td><td></td></tr>
        <tr><td>Кирилл Новиков<br><span class="mono muted-dark">usr_kir</span></td><td>member</td><td></td></tr>
      </tbody>
    </table></div>
    <p class="hint mt-8">Роли проекта: admin / member. Это не IAM SUPER_ADMIN.</p>`
  const telephony = `<div class="stack" style="max-width:640px">
    <p class="muted" style="margin:0">Из текущего ЛК: входящие правила, пул номеров, стоп-слова. Провайдеры платформы — не здесь.</p>
    <div class="card card-pad">
      <div class="h5">Входящее правило</div>
      <p class="small muted" style="margin:8px 0 0">3812 → сценарий «Входящая запись». Вне расписания — автоответчик.</p>
    </div>
    <div class="card card-pad">
      <div class="h5">Пул исходящих</div>
      <p class="small muted" style="margin:8px 0 0">2 номера проекта. Карточки — в разделе «Номера».</p>
    </div>
    <div class="card card-pad">
      <div class="h5">Стоп-слова / перебивания</div>
      <p class="small muted" style="margin:8px 0 0">Список платформы. В v1 не редактируем.</p>
    </div>
  </div>`
  const body = tab === 'members' ? members : tab === 'telephony' ? telephony : general
  return shell(
    pid,
    'settings',
    `${header('Настройки проекта', 'settings', '', tab === 'members' ? 'settings-members' : tab === 'telephony' ? 'settings-telephony' : 'settings')}
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
    ? `<div class="entity-grid">${list.map(docCard).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('knowledge')}</div>
        <h2 class="h2">База знаний пуста</h2>
        <p class="muted">Документы для AI-агентов этого проекта. Как «База знаний» в текущем ЛК у AI-агентов.</p>
        <button class="btn mt-16" type="button" data-action="setup-done" data-step="knowledge" data-pid="${pid}">Отметить шаг</button>
      </div></div>`
  return shell(pid, 'knowledge', `${header('База знаний', 'knowledge', '<button class="btn" type="button" data-action="toast" data-toast="Загрузка в v1 не рисуем">Загрузить</button>')}${body}`)
}

function screenNumbers(pid, tab) {
  const tabs = sectionTabs(pid, 'numbers', [
    { id: '', label: 'Мои номера' },
    { id: 'shop', label: 'Витрина' },
  ], tab || '')
  if (tab === 'shop') {
    return shell(pid, 'numbers', `${header('Номера', 'numbers', '', 'numbers-shop')}${tabs}<div class="entity-grid">${MARKET_PHONES.map(offerCard).join('')}</div>`)
  }
  const list = ofList(PHONES, pid)
  const body = list.length
    ? `<div class="entity-grid">${list.map(phoneCard).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="illu">${icon('numbers')}</div>
        <h2 class="h2">Номеров нет</h2>
        <p class="muted">Возьмите из витрины или привяжите свой. Нужны для заданий и входящей.</p>
      </div></div>`
  return shell(pid, 'numbers', `${header('Номера', 'numbers')}${tabs}${body}`)
}

function screenMarket(pid) {
  return shell(
    pid,
    'market',
    `${header('Маркетплейс', 'market')}
    <div class="entity-grid">${MARKET.map(marketCard).join('')}</div>`,
  )
}
