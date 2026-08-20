/* js/shell.js — Sidebar, topbar, modals, auth wrap. */
function formCard(inner) {
  return `<div class="card card-pad stack form-narrow">${inner}</div>`
}

function statsGrid(cells) {
  const list = (cells || []).filter(Boolean)
  if (!list.length) return ''
  const n = list.length
  const cols = n >= 5 ? 5 : n === 4 ? 4 : 3
  return `<div class="grid-stats cols-${cols}">${list.join('')}</div>`
}

function copyField(id) {
  return `<div class="copy-field"><span class="mono">${id}</span><button class="icon-btn" type="button" data-action="toast" data-toast="Скопировали">${icon('copy', 16)}</button></div>`
}

function go(hash) {
  location.hash = hash
}

function header(title, iconName, right = '', guideKey) {
  return `<div class="page-header">
    <div class="page-header-left">
      <div class="page-icon">${icon(iconName)}</div>
      <div>
        <h1 class="h1">${title}</h1>
      </div>
    </div>
    <div>${right}</div>
  </div>${pageLead(guideKey || iconName)}${aiInsight(guideKey || iconName)}`
}

function logo(compact) {
  return `<a class="brand" data-nav="#/projects" title="Все проекты">
    <span class="brand-mark">T</span>
    ${compact ? '' : '<span class="brand-text h5">TWIN</span>'}
  </a>`
}

function navLink(pid, n, active) {
  const href = `#/p/${pid}/${n.id}`
  return `<a class="nav-item ${active === n.id ? 'is-active' : ''}" data-nav="${href}">${icon(n.icon)}<span class="nav-label">${n.label}</span></a>`
}

function navRow(pid, n, active, pinned) {
  return `<div class="nav-row">
    ${navLink(pid, n, active)}
    <button class="pin-btn ${pinned ? 'is-on' : ''}" type="button" data-action="toggle-pin" data-pid="${pid}" data-id="${n.id}" title="${pinned ? 'Открепить' : 'Закрепить'}">${icon('pin', 16)}</button>
  </div>`
}

function sidebar(pid, active) {
  const pinSet = new Set(pinsOf(pid))
  const full = !!ui.navFull[pid]
  const ops = navOps()
  const overview = NAV.find((n) => n.id === 'overview')
  const settings = NAV.find((n) => n.id === 'settings')
  const pinnedItems = ops.filter((n) => pinSet.has(n.id))
  const rest = ops.filter((n) => !pinSet.has(n.id))
  const pinnedBlock = pinnedItems.length
    ? `<div class="nav-sec">Закреплено</div>${pinnedItems.map((n) => navRow(pid, n, active, true)).join('')}`
    : ''
  const current = ops.find((n) => n.id === active)
  const currentUnpinned =
    current && !pinSet.has(active) && !full
      ? navRow(pid, current, active, false)
      : ''
  const restBlock = full
    ? `<div class="nav-sec">Все разделы</div>${
        rest.length
          ? rest.map((n) => navRow(pid, n, active, false)).join('')
          : '<div class="nav-empty">Всё уже закреплено</div>'
      }`
    : currentUnpinned
  return `<aside class="sidebar">
    ${logo(ui.collapsed)}
    <nav class="nav">
      ${navLink(pid, overview, active)}
      ${pinnedBlock}
      <button class="nav-more ${full ? 'is-on' : ''}" type="button" data-action="nav-full" data-pid="${pid}">
        ${icon('plus')}<span class="nav-label">${full ? 'Скрыть меню' : 'Меню'}</span>
      </button>
      ${restBlock}
      <div class="nav-divider"></div>
      ${navLink(pid, settings, active)}
    </nav>
    <div class="sidebar-foot">
      <button class="icon-btn on-dark" type="button" data-action="collapse" title="Свернуть">${icon('back')}</button>
    </div>
  </aside>`
}

function topbar(pid) {
  const p = project(pid)
  const switcherOpen = ui.menu === 'switcher'
  const avatarOpen = ui.menu === 'avatar'
  const list = PROJECTS.slice(0, 8)
    .map(
      (x) =>
        `<button class="popper-item" type="button" data-nav="#/p/${x.id}/overview"><strong>${x.name}</strong></button>`,
    )
    .join('')
  return `<header class="topbar">
    <div class="topbar-left">
      <div class="rel">
        <button class="switcher" type="button" data-action="menu" data-menu="switcher">${p.name}${icon('chevron')}</button>
        <div class="popper ${switcherOpen ? '' : 'hidden'}">
          <div class="search popper-search">${icon('search', 16)}<input placeholder="Найти проект" /></div>
          ${list}
          <button class="popper-item" type="button" data-nav="#/projects">${icon('folder', 16)} Все проекты</button>
        </div>
      </div>
    </div>
    <div class="topbar-right">
      <div class="balance" title="Баланс компании, только просмотр">${icon('wallet', 16)} 12 480 ₽</div>
      <button class="icon-btn" type="button">${icon('bell')}</button>
      <div class="rel">
          <button class="avatar" type="button" data-action="menu" data-menu="avatar">АК</button>
          ${avatarMenu(avatarOpen)}
      </div>
    </div>
  </header>`
}

function shell(pid, active, inner) {
  ui.currentPid = pid
  return `<div class="app ${ui.collapsed ? 'collapsed' : ''}">
    ${sidebar(pid, active)}
    <div class="main">${topbar(pid)}<div class="page">${inner}</div></div>
  </div>${modals()}${toast()}${guideChrome()}`
}

function accountShell(inner) {
  return `<div class="app">
    <div class="main">
      <div class="account-top">
        <button class="btn btn-ghost" type="button" data-nav="#/projects">${icon('back', 16)} К проектам</button>
        <div class="topbar-right">
          <div class="balance">${icon('wallet', 16)} 12 480 ₽</div>
          <button class="avatar" type="button" data-nav="#/account/team">АК</button>
        </div>
      </div>
      <div class="page">${inner}</div>
    </div>
  </div>${modals()}${toast()}${guideChrome()}`
}

function toast() {
  if (!ui.toast) return ''
  return `<div class="toast">${ui.toast}</div>`
}

function modals() {
  if (ui.modal === 'edit-note') {
    const pid = ui.notePid
    const text = noteText(pid)
    return `<div class="modal-backdrop" data-action="close-modal">
      <div class="modal" onclick="event.stopPropagation()">
        <h2 class="h2">Заметка проекта</h2>
        <p class="muted">Видно команде этого проекта. Это не база знаний агента и не тикет.</p>
        <textarea class="textarea" id="note-text">${text}</textarea>
        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" data-action="close-modal">Отмена</button>
          <button class="btn" type="button" data-action="save-note">Сохранить</button>
        </div>
      </div>
    </div>`
  }
  if (ui.modal === 'create-agent') {
    return `<div class="modal-backdrop" data-action="close-modal">
      <div class="modal" onclick="event.stopPropagation()">
        <h2 class="h2">Создать AI-агента</h2>
        <p class="muted">Отвечает моделью. Это не сценарий и не NLU-модель.</p>
        <div class="field"><label>Имя</label><input class="input" id="agent-name" placeholder="Скрининг курьера" /></div>
        <div class="field"><label>Язык</label>
          <select class="select" id="agent-lang"><option>Русский</option><option>English</option><option>Қазақша</option></select>
        </div>
        <div class="field"><label>Канал</label>
          <select class="select" id="agent-medium"><option value="voice">Голос</option><option value="text">Чат</option><option value="both">Голос и чат</option></select>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" data-action="close-modal">Отмена</button>
          <button class="btn" type="button" data-action="create-agent-save">Создать</button>
        </div>
      </div>
    </div>`
  }
  if (ui.modal === 'confirm-delete') {
    return `<div class="modal-backdrop" data-action="close-modal">
      <div class="modal" onclick="event.stopPropagation()">
        <h2 class="h2">Удалить проект?</h2>
        <p class="muted">Пропадут AI-агенты, сценарии, NLU-модели и задания внутри проекта. Биллинг компании не тронется.</p>
        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" data-action="close-modal">Оставить</button>
          <button class="btn btn-danger" type="button" data-nav="#/projects">Удалить проект</button>
        </div>
      </div>
    </div>`
  }
  return ''
}

function authWrap(inner) {
  return `<div class="auth">
    <div class="auth-lang">
      <button type="button" class="is-on">RU</button> · <button type="button">EN</button>
    </div>
    <div class="logo-word"><span class="brand-mark">T</span><span class="h2">TWIN</span></div>
    <div class="auth-card">${inner}</div>
  </div>${guideChrome()}`
}
