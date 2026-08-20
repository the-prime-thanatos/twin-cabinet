/* js/screens-projects.js — Project list, create flow, overview. */
function projectCard(p) {
  return `<button class="entity-card is-project" type="button" data-nav="#/p/${p.id}/overview">
    ${entityHead('project', p.phase === 'setup' ? '<span class="chip chip-running">запуск</span>' : '')}
    <div class="h5 entity-title">${p.name}</div>
    <div class="entity-sig">
      <div class="counts"><span>${p.agents} AI</span><span>${p.bots} сцен.</span><span>${p.nlu || 0} NLU</span></div>
    </div>
    ${entityFoot([
      `<div class="small muted">${p.desc}</div>`,
      `<div class="verysmall muted">${p.updated}</div>`,
    ])}
  </button>`
}

function createChrome(inner) {
  return `<div class="app"><div class="main">
    <div class="account-top">
      <button class="btn btn-ghost" type="button" data-nav="#/projects">${icon('back', 16)} К проектам</button>
    </div>
    <div class="page"><div class="create-wrap">${inner}</div></div>
  </div></div>${toast()}${guideChrome()}`
}

function selectedCreateModules() {
  const picked = MODULES.filter((m) => ui.create.modules[m.id]).map((m) => m.id)
  if (picked.length) picked.push('analytics')
  return [...new Set(picked)]
}

function selectedChannels() {
  return INTEGRATIONS.filter((i) => ui.create.channels[i.id]).map((i) => i.id)
}

function finishCreate(modules, extra) {
  const nameInput = document.getElementById('create-name')
  const descInput = document.getElementById('create-desc')
  if (nameInput) ui.create.name = nameInput.value.trim()
  if (descInput) ui.create.desc = descInput.value.trim()
  const name = ui.create.name
  if (!name) {
    ui.toast = 'Нужно имя проекта'
    setTimeout(() => {
      ui.toast = null
      render()
    }, 1600)
    render()
    return
  }
  const id = 'p_' + Math.random().toString(36).slice(2, 6)
  const pins = (modules || []).filter((mid) => ALL_MODULES.includes(mid))
  PROJECTS.unshift({
    id,
    name,
    desc: ui.create.desc || extra || '',
    updated: 'только что',
    agents: 0,
    bots: 0,
    nlu: 0,
    calls: 0,
    chats: 0,
    campaigns: 0,
    modules: pins,
    pins,
    phase: 'setup',
    channels: selectedChannels(),
  })
  ui.navFull[id] = pins.length === 0
  ui.pins[id] = pins.slice()
  ui.setupDone[id] = {}
  ui.create = { name: '', desc: '', modules: {}, channels: {} }
  go(`#/p/${id}/overview`)
}

function nameFields(placeholder) {
  return `<div class="stack" style="max-width:480px">
    <div class="field"><label>Название</label><input class="input" id="create-name" placeholder="${placeholder}" value="${ui.create.name || ''}" /></div>
    <div class="field"><label>Описание <span class="muted">необязательно</span></label><textarea class="textarea" id="create-desc" placeholder="Для чего этот проект">${ui.create.desc || ''}</textarea></div>
  </div>`
}

function screenCreate(rest) {
  const step = rest[0] || 'choose'
  const sub = rest[1]

  if (step === 'choose' || !step) {
    return createChrome(`${header('Новый проект', 'folder', '', 'create')}
      <div class="choice-grid">
        <button class="choice-card" type="button" data-nav="#/projects/new/blank">
          <span class="tag">Пустой</span>
          <div class="h3">Просто проект</div>
          <p class="small muted">Имя и всё. Закреплений нет — выберите их сами. На обзоре будет чеклист запуска.</p>
        </button>
        <button class="choice-card" type="button" data-nav="#/projects/new/preset">
          <span class="tag">Пресет</span>
          <div class="h3">Готовый сценарий</div>
          <p class="small muted">Обзвон, входящая линия, поддержка, рассылки. Нужные разделы сразу закреплены.</p>
        </button>
        <button class="choice-card" type="button" data-nav="#/projects/new/wizard">
          <span class="tag">Мастер</span>
          <div class="h3">Собрать по шагам</div>
          <p class="small muted">Отмечаете, что нужно — это станет закреплениями, не скрытым меню.</p>
        </button>
      </div>`)
  }

  if (step === 'blank') {
    return createChrome(`${header('Пустой проект', 'folder', '', 'create')}
      <div class="steps"><span class="is-on">Имя</span><span>Готово</span></div>
      ${nameFields('Например, Песочница')}
      <div class="row gap-8 mt-24">
        <button class="btn btn-ghost" type="button" data-nav="#/projects/new">Назад</button>
        <button class="btn" type="button" data-action="create-blank">Создать</button>
      </div>`)
  }

  if (step === 'preset' && !sub) {
    const cards = PRESETS.map(
      (pr) => `<button class="choice-card" type="button" data-nav="#/projects/new/preset/${pr.id}">
        <div class="h4">${pr.name}</div>
        <p class="small muted">${pr.desc}</p>
        <div class="counts">${pr.modules.filter((id) => id !== 'analytics').map((id) => `<span class="chip">${(NAV.find((n) => n.id === id) || {}).label}</span>`).join('')}</div>
      </button>`,
    ).join('')
    return createChrome(`${header('Пресет проекта', 'folder', '', 'create')}
      <div class="steps"><span>Путь</span><span class="is-on">Пресет</span><span>Имя</span></div>
      <div class="choice-grid">${cards}</div>
      <button class="btn btn-ghost mt-16" type="button" data-nav="#/projects/new">Назад</button>`)
  }

  if (step === 'preset' && sub) {
    const pr = PRESETS.find((x) => x.id === sub) || PRESETS[0]
    ui.create.preset = pr.id
    return createChrome(`${header(pr.name, 'folder', '', 'create')}
      <div class="steps"><span>Путь</span><span>Пресет</span><span class="is-on">Имя</span></div>
      <p class="muted">Закрепим в меню: ${pr.modules.filter((id) => id !== 'analytics').map((id) => (NAV.find((n) => n.id === id) || {}).label).join(', ')}. Остальное — в «Меню».</p>
      ${nameFields(pr.name)}
      <div class="row gap-8 mt-24">
        <button class="btn btn-ghost" type="button" data-nav="#/projects/new/preset">Назад</button>
        <button class="btn" type="button" data-action="create-preset" data-preset="${pr.id}">Создать</button>
      </div>`)
  }

  if (step === 'wizard' && !sub) {
    return createChrome(`${header('Собрать проект', 'folder', '', 'create')}
      <div class="steps"><span class="is-on">1. Имя</span><span>2. Что нужно</span><span>3. Каналы</span></div>
      ${nameFields('Например, WhatsApp поддержка')}
      <div class="row gap-8 mt-24">
        <button class="btn btn-ghost" type="button" data-nav="#/projects/new">Назад</button>
        <button class="btn" type="button" data-action="wizard-name">Дальше</button>
      </div>`)
  }

  if (step === 'wizard' && sub === 'modules') {
    const tiles = MODULES.map((m) => {
      const on = !!ui.create.modules[m.id]
      return `<button class="tile ${on ? 'is-on' : ''}" type="button" data-action="toggle-module" data-module="${m.id}">
        ${icon(m.id)}
        <div class="h5">${m.label}</div>
        <div class="small muted">${m.hint}</div>
        <span class="check">${on ? 'выбрано' : ''}</span>
      </button>`
    }).join('')
    return createChrome(`${header('Что нужно в проекте', 'folder', '', 'create')}
      <div class="steps"><span>1. Имя</span><span class="is-on">2. Что нужно</span><span>3. Каналы</span></div>
      <p class="muted" style="margin-top:-8px">Можно отметить несколько. Это закрепления, не прячем остальные разделы. Аналитика закрепится сама, если есть операционка.</p>
      <div class="tile-grid mt-16">${tiles}</div>
      <div class="row gap-8 mt-24">
        <button class="btn btn-ghost" type="button" data-nav="#/projects/new/wizard">Назад</button>
        <button class="btn" type="button" data-action="wizard-modules">Дальше</button>
      </div>`)
  }

  if (step === 'wizard' && sub === 'channels') {
    const tiles = INTEGRATIONS.map((i) => {
      const on = !!ui.create.channels[i.id]
      return `<button class="tile ${on ? 'is-on' : ''}" type="button" data-action="toggle-channel" data-channel="${i.id}">
        <div class="int-logo" style="background:${i.color}">${i.name.slice(0, 2)}</div>
        <div class="h5">${i.name}</div>
        <span class="check">${on ? 'подключим' : 'позже'}</span>
      </button>`
    }).join('')
    return createChrome(`${header('Каналы и CRM', 'integrations', '', 'create')}
      <div class="steps"><span>1. Имя</span><span>2. Что нужно</span><span class="is-on">3. Каналы</span></div>
      <p class="muted" style="margin-top:-8px">Не обязательно сейчас. Это только состав проекта, не настоящие ключи.</p>
      <div class="tile-grid mt-16">${tiles}</div>
      <div class="row gap-8 mt-24">
        <button class="btn btn-ghost" type="button" data-nav="#/projects/new/wizard/modules">Назад</button>
        <button class="btn" type="button" data-action="create-wizard">Создать проект</button>
      </div>`)
  }

  return screenCreate([])
}

function screenProjects(mode) {
  const list = mode === 'one' ? PROJECTS.slice(0, 1) : PROJECTS
  const empty = mode === 'empty'
  const body = empty
    ? `<div class="card"><div class="empty">
        <div class="illu">${icon('folder')}</div>
        <h2 class="h2">Пока нет проектов</h2>
        <p class="muted">После логина вы здесь. Создайте первый проект — агенты и звонки появятся внутри него, не на уровне компании.</p>
        <button class="btn mt-16" type="button" data-nav="#/projects/new">Новый проект</button>
      </div></div>`
    : `<div class="grid-cards">${list.map(projectCard).join('')}</div>`

  return `<div class="app"><div class="main">
    <div class="account-top">
      <div class="logo-word" style="margin:0;color:var(--superdark)">${logo(false)}</div>
      <div class="topbar-right">
        <div class="balance">${icon('wallet', 16)} 12 480 ₽</div>
        <div class="rel">
          <button class="avatar" type="button" data-action="menu" data-menu="avatar">АК</button>
          ${avatarMenu(ui.menu === 'avatar')}
        </div>
      </div>
    </div>
    <div class="page">
      ${header('Проекты', 'folder', `<button class="btn" type="button" data-nav="#/projects/new">${icon('plus', 16)} Новый проект</button>`, 'projects')}
      ${empty ? '' : `<div class="toolbar"><div class="search">${icon('search', 16)}<input placeholder="Найти проект" /></div></div>`}
      ${body}
    </div>
  </div></div>${modals()}${toast()}${guideChrome()}`
}

function recentRow(type, name, meta, href) {
  return `<tr>
    <td>${icon(type, 16)} ${name}</td>
    <td class="muted">${meta}</td>
    <td><button class="btn btn-ghost" type="button" data-nav="${href}">Открыть</button></td>
  </tr>`
}

function setupCta(s) {
  if (s.done) return ''
  if (s.action === 'edit-note') {
    return `<button class="btn btn-ghost" type="button" data-action="edit-note" data-pid="${s.pid}">Написать</button>`
  }
  if (s.action === 'open-menu') {
    return `<button class="btn btn-ghost" type="button" data-action="open-menu" data-pid="${s.pid}">Открыть меню</button>`
  }
  if (s.action === 'create-nlu') {
    return `<button class="btn btn-ghost" type="button" data-action="create-nlu">Создать</button>`
  }
  if (s.action === 'create-bot') {
    return `<button class="btn btn-ghost" type="button" data-action="create-bot">Создать</button>`
  }
  if (s.action === 'create-job') {
    return `<button class="btn btn-ghost" type="button" data-action="create-job">Создать</button>`
  }
  if (s.modal) {
    return `<button class="btn btn-ghost" type="button" data-action="modal" data-modal="${s.modal}">Создать</button>`
  }
  if (s.mark) {
    return `<button class="btn btn-ghost" type="button" data-action="setup-done" data-step="${s.id}" data-pid="${s.pid}">Готово</button>`
  }
  if (s.href) {
    return `<button class="btn btn-ghost" type="button" data-nav="${s.href}">Открыть</button>`
  }
  return ''
}

function setupCard(pid) {
  const steps = setupSteps(pid)
  const done = steps.filter((s) => s.done).length
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0
  const rows = steps
    .map(
      (s, i) => `<div class="setup-step ${s.done ? 'is-done' : ''}">
        <div class="setup-num">${s.done ? icon('check', 16) : i + 1}</div>
        <div class="setup-body">
          <div class="h5">${s.title}</div>
          <div class="small muted">${s.hint}</div>
        </div>
        ${setupCta(s)}
      </div>`,
    )
    .join('')
  return `<div class="setup-card">
    <div class="between" style="align-items:flex-start;gap:16px">
      <div>
        <h2 class="h3">Проект только создали</h2>
        <p class="muted" style="margin:8px 0 0">Пройдите шаги — обзор станет рабочим, этот список пропадёт.</p>
      </div>
      <div class="h4">${done} / ${steps.length}</div>
    </div>
    <div class="setup-bar"><span style="width:${pct}%"></span></div>
    <div class="verysmall muted">${pct}%</div>
    ${rows}
  </div>`
}

function screenOverview(pid) {
  maybePromote(pid)
  const p = project(pid)
  if (p.phase !== 'live') {
    return shell(pid, 'overview', `${header(p.name, 'overview', '<span class="chip chip-running">запуск</span>')}${setupCard(pid)}`)
  }
  const stats = [
    hasModule(pid, 'agents') && `<div class="stat"><div class="label">AI-агенты</div><div class="value">${p.agents}</div></div>`,
    hasModule(pid, 'bots') && `<div class="stat"><div class="label">Сценарии</div><div class="value">${p.bots}</div></div>`,
    hasModule(pid, 'nlu') && `<div class="stat"><div class="label">NLU</div><div class="value">${p.nlu || 0}</div></div>`,
    hasModule(pid, 'knowledge') && `<div class="stat"><div class="label">База знаний</div><div class="value">${(DOCS[pid] || []).length}</div></div>`,
    hasModule(pid, 'calls') && `<div class="stat"><div class="label">Активные обзвоны</div><div class="value">${Math.min(p.calls, 2)}</div></div>`,
    hasModule(pid, 'numbers') && `<div class="stat"><div class="label">Номера</div><div class="value">${(PHONES[pid] || []).length}</div></div>`,
    hasModule(pid, 'chats') && `<div class="stat"><div class="label">Чаты за сутки</div><div class="value">${p.chats}</div></div>`,
    hasModule(pid, 'integrations') && `<div class="stat"><div class="label">Интеграции</div><div class="value">${Array.isArray(p.channels) ? p.channels.length : 4}</div></div>`,
    hasModule(pid, 'campaigns') && `<div class="stat"><div class="label">Рассылки</div><div class="value">${p.campaigns || 0}</div></div>`,
  ].filter(Boolean)
  const recentCards = [
    hasModule(pid, 'agents') && AGENTS[pid] && agentCard(pid, AGENTS[pid][0], true),
    hasModule(pid, 'calls') && JOBS[pid] && jobCard(pid, JOBS[pid][0], true),
    hasModule(pid, 'bots') && BOTS[pid] && botCard(pid, BOTS[pid][0], true),
    hasModule(pid, 'nlu') && NLU[pid] && nluCard(pid, NLU[pid][0], true),
  ].filter(Boolean)
  const names = pinsOf(pid)
    .filter((id) => id !== 'analytics')
    .map((id) => (NAV.find((n) => n.id === id) || {}).label)
    .filter(Boolean)
  const pills = names.length
    ? `<div class="module-pills">${names.map((n) => `<span class="chip">${n}</span>`).join('')}</div>`
    : `<div class="module-pills"><span class="chip">нет закреплений</span></div>`
  const statsGrid = stats.length
    ? `<div class="grid-stats" style="grid-template-columns:repeat(${Math.min(stats.length, 5)},1fr)">${stats.join('')}</div>`
    : ''
  const note = noteText(pid)
  const noteBody = note
    ? `<p class="normal" style="white-space:pre-wrap;margin:0">${note}</p>`
    : `<p class="muted" style="margin:0">Зачем проект, какие правила, кого не беспокоить. Команда увидит это сразу, без чата в Telegram.</p>`
  const notesCard = `<div class="card card-pad note-card">
      <div class="between">
        <h2 class="h4">Заметка</h2>
        <button class="btn btn-ghost" type="button" data-action="edit-note" data-pid="${pid}">Изменить</button>
      </div>
      <div class="mt-8">${noteBody}</div>
      <div class="verysmall muted mt-16">${note ? 'Анна · сегодня' : 'Пока пусто'}</div>
    </div>`
  const attn = attentionFor(pid)
  const attnCard = `<div class="card card-pad">
      <h2 class="h4">На контроле</h2>
      ${
        attn.length
          ? attn
              .map(
                (a) => `<div class="attn-item">
            <span class="chip chip-${a.tone === 'error' ? 'error' : a.tone === 'paused' ? 'paused' : 'draft'}">${a.tone === 'error' ? 'сбой' : a.tone === 'paused' ? 'пауза' : 'черновик'}</span>
            <div>
              <div class="h6">${a.text}</div>
              <button class="btn btn-ghost" style="min-height:auto;padding:0" data-nav="${a.href}">Открыть</button>
            </div>
          </div>`,
              )
              .join('')
          : `<p class="muted mt-8" style="margin-bottom:0">Сбоев и пауз нет. Когда агент упадёт или обзвон встанет — будет здесь, не в отдельном разделе.</p>`
      }
    </div>`
  const recentBlock = recentCards.length
    ? `<div class="mt-16">
      <h2 class="h4" style="margin-bottom:12px">Недавно</h2>
      <div class="entity-grid">${recentCards.join('')}</div>
    </div>`
    : `<div class="card mt-16"><div class="empty" style="padding:40px 24px">
        <h2 class="h4">Пока нечего показывать</h2>
        <p class="muted">Заметка сверху — чтобы команда не потеряла смысл проекта. Сущности появятся в «Недавно», когда создадите первую.</p>
      </div></div>`
  return shell(
    pid,
    'overview',
    `${header(p.name, 'overview')}${pills}${statsGrid}
    <div class="overview-split">${notesCard}${attnCard}</div>
    ${recentBlock}`,
  )
}
