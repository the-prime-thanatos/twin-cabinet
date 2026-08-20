/* js/boot.js — Hash router and events. Load last. */
function render() {
  const hash = location.hash || '#/'
  const parts = hash.replace(/^#\//, '').split('/').filter(Boolean)
  let html = screenCover()

  if (parts[0] === 'login' && parts[1] === 'tfa') html = screenTfa()
  else if (parts[0] === 'login') html = screenLogin()
  else if (parts[0] === 'signup') html = screenSignup()
  else if (parts[0] === 'password-reset') html = screenReset()
  else if (parts[0] === 'operator-blocked') html = screenOperator()
  else if (parts[0] === 'projects' && parts[1] === 'new') html = screenCreate(parts.slice(2))
  else if (parts[0] === 'projects' && parts[1] === 'empty') html = screenProjects('empty')
  else if (parts[0] === 'projects' && parts[1] === 'one') html = screenProjects('one')
  else if (parts[0] === 'projects') html = screenProjects('many')
  else if (parts[0] === 'account' && parts[1] === 'billing') html = screenBilling()
  else if (parts[0] === 'account' && parts[1] === 'team') html = screenTeam()
  else if (parts[0] === 'account' && parts[1] === 'company') html = screenCompany()
  else if (parts[0] === 'error') html = screenError()
  else if (parts[0] === 'lab' && parts[1] === 'page') html = screenPageCanon()
  else if (parts[0] === 'lab') html = screenCardCanon()
  else if (parts[0] === 'p') {
    const pid = parts[1]
    const sec = parts[2]
    const sub = parts[3]
    if (sec === 'overview' || !sec) html = screenOverview(pid)
    else if (sec === 'agents') html = !sub || sub === 'empty' ? screenAgents(pid, sub === 'empty') : routeEnt(pid, 'agent', parts.slice(3))
    else if (sec === 'bots') html = !sub || sub === 'empty' ? screenBots(pid, sub === 'empty') : routeEnt(pid, 'bot', parts.slice(3))
    else if (sec === 'nlu') html = !sub || sub === 'empty' ? screenNluList(pid, sub === 'empty') : routeEnt(pid, 'nlu', parts.slice(3))
    else if (sec === 'calls' && sub === 'templates') html = parts[4] ? routeEnt(pid, 'jobtpl', parts.slice(4)) : screenCallTemplates(pid)
    else if (sec === 'calls' && sub === 'history') html = screenCallHistory(pid)
    else if (sec === 'calls' && sub === 'schedule') html = screenSchedule(pid)
    else if (sec === 'calls' && sub === 'blacklist') html = screenBlacklist(pid)
    else if (sec === 'calls') html = !sub || sub === 'empty' ? screenCalls(pid, sub === 'empty') : routeEnt(pid, 'job', parts.slice(3))
    else if (sec === 'chats' && sub === 'templates') html = parts[4] ? routeEnt(pid, 'chattpl', parts.slice(4)) : screenChatTemplates(pid)
    else if (sec === 'chats') html = !sub ? screenChats(pid) : routeEnt(pid, 'chat', parts.slice(3))
    else if (sec === 'campaigns' && sub === 'templates') html = parts[4] ? routeEnt(pid, 'camptpl', parts.slice(4)) : screenCampTemplates(pid)
    else if (sec === 'campaigns') html = !sub ? screenCampaigns(pid) : routeEnt(pid, 'campaign', parts.slice(3))
    else if (sec === 'knowledge') {
      if (project(pid).phase === 'setup') { markSetup(pid, 'knowledge'); maybePromote(pid) }
      html = !sub ? screenKnowledge(pid) : routeEnt(pid, 'doc', parts.slice(3))
    }
    else if (sec === 'numbers' && sub === 'shop') html = parts[4] ? routeEnt(pid, 'offer', parts.slice(4)) : screenNumbers(pid, 'shop')
    else if (sec === 'numbers') {
      if (project(pid).phase === 'setup') { markSetup(pid, 'numbers'); maybePromote(pid) }
      html = !sub ? screenNumbers(pid) : routeEnt(pid, 'phone', parts.slice(3))
    }
    else if (sec === 'market') {
      if (project(pid).phase === 'setup') { markSetup(pid, 'market'); maybePromote(pid) }
      html = !sub ? screenMarket(pid) : routeEnt(pid, 'market', parts.slice(3))
    }
    else if (sec === 'integrations' && sub === 'none') html = screenIntegrations(pid, true)
    else if (sec === 'integrations' && sub) html = screenIntegration(pid, sub)
    else if (sec === 'integrations') html = screenIntegrations(pid, false)
    else if (sec === 'analytics') {
      if (project(pid).phase === 'setup') {
        markSetup(pid, 'analytics')
        maybePromote(pid)
      }
      html = sub === 'reports' && parts[4] ? routeEnt(pid, 'report', parts.slice(4)) : screenAnalytics(pid, ['reports', 'calls', 'chats', 'campaigns', 'spend'].includes(sub) ? sub : '')
    }
    else if (sec === 'settings' && sub === 'members') html = screenSettings(pid, 'members')
    else if (sec === 'settings' && sub === 'telephony') html = screenSettings(pid, 'telephony')
    else if (sec === 'settings') html = screenSettings(pid, 'general')
    else if (sec === 'loading') html = screenLoading(pid)
    else if (sec === '404') html = screen404(pid)
    else if (sec === 'no-access') html = screenNoAccess(pid)
    else html = screen404(pid)
  }

  document.getElementById('app').innerHTML = html
  document.getElementById('proto-panel').innerHTML = protoHTML()
  placeTour()
  const askLog = document.querySelector('.ask-log')
  if (askLog) askLog.scrollTop = askLog.scrollHeight
}

document.addEventListener('click', (e) => {
  const actionHit = e.target.closest('[data-action]')
  const nav = e.target.closest('[data-nav]')
  if (nav && !(actionHit && nav.contains(actionHit))) {
    e.preventDefault()
    captureCreateFields()
    captureEntFields()
    ui.menu = null
    ui.modal = null
    stopDeleteTimer()
    go(nav.getAttribute('data-nav'))
    return
  }
  const action = actionHit
  if (!action) {
      if (!e.target.closest('.popper') && !e.target.closest('.switcher') && !e.target.closest('.avatar') && !e.target.closest('.ask-panel') && !e.target.closest('.tour-card') && !e.target.closest('.entity-more')) {
      if (ui.menu) {
        ui.menu = null
        render()
      }
    }
    return
  }
  const type = action.getAttribute('data-action')
  captureCreateFields()
  captureEntFields()
  const askIn = document.getElementById('ask-input')
  if (askIn && ui.ask && type !== 'ask-close') ui.ask.input = askIn.value
  if (typeof handleEntAction === 'function' && handleEntAction(type, action)) return
  if (type === 'tour') startTour()
  if (type === 'tour-next' && ui.tour) ui.tour.i += 1
  if (type === 'tour-back' && ui.tour && ui.tour.i) ui.tour.i -= 1
  if (type === 'tour-close') ui.tour = null
  if (type === 'ask') startAsk()
  if (type === 'ask-close') ui.ask = null
  if (type === 'ask-suggest') pushAsk(action.getAttribute('data-q'))
  if (type === 'insight') ui.insight = !ui.insight
  if (type === 'collapse') ui.collapsed = !ui.collapsed
  if (type === 'menu') {
    const m = action.getAttribute('data-menu')
    ui.menu = ui.menu === m ? null : m
  }
  if (type === 'modal') ui.modal = action.getAttribute('data-modal')
  if (type === 'edit-note') {
    ui.notePid = action.getAttribute('data-pid')
    ui.modal = 'edit-note'
  }
  if (type === 'save-note') {
    const area = document.getElementById('note-text')
    if (area && ui.notePid) ui.notes[ui.notePid] = area.value
    ui.modal = null
    if (!maybePromote(ui.notePid)) {
      ui.toast = 'Заметку сохранили'
      setTimeout(() => {
        ui.toast = null
        render()
      }, 1600)
    }
  }
  if (type === 'close-modal') {
    ui.modal = null
    ui.json = null
    ui.diff = null
    ui.delete = null
    stopDeleteTimer()
  }
  if (type === 'tab') ui.tab = action.getAttribute('data-tab')
  if (type === 'nav-full') {
    const pid = action.getAttribute('data-pid')
    ui.navFull[pid] = !ui.navFull[pid]
  }
  if (type === 'open-menu') {
    const pid = action.getAttribute('data-pid') || ui.currentPid
    ui.navFull[pid] = true
  }
  if (type === 'toggle-pin') {
    const pid = action.getAttribute('data-pid')
    const id = action.getAttribute('data-id')
    const pins = pinsOf(pid)
    const i = pins.indexOf(id)
    if (i >= 0) pins.splice(i, 1)
    else pins.push(id)
    const p = project(pid)
    p.pins = pins
    ui.pins[pid] = pins
    if (!pins.length) ui.navFull[pid] = true
    maybePromote(pid)
  }
  if (type === 'setup-done') {
    const pid = action.getAttribute('data-pid') || ui.currentPid
    markSetup(pid, action.getAttribute('data-step'))
    maybePromote(pid)
  }
  if (type === 'connect-int') {
    const pid = ui.currentPid
    const id = action.getAttribute('data-id')
    const p = project(pid)
    p.channels = p.channels || []
    if (id && !p.channels.includes(id)) p.channels.push(id)
    markSetup(pid, 'integrations')
    if (!maybePromote(pid)) {
      ui.toast = 'Канал отметили'
      setTimeout(() => {
        ui.toast = null
        render()
      }, 1600)
    }
  }
  if (type === 'toggle-module') {
    captureCreateFields()
    const id = action.getAttribute('data-module')
    ui.create.modules[id] = !ui.create.modules[id]
  }
  if (type === 'toggle-channel') {
    const id = action.getAttribute('data-channel')
    ui.create.channels[id] = !ui.create.channels[id]
  }
  if (type === 'wizard-name') {
    captureCreateFields()
    if (!ui.create.name.trim()) {
      ui.toast = 'Нужно имя проекта'
      setTimeout(() => {
        ui.toast = null
        render()
      }, 1600)
    } else {
      go('#/projects/new/wizard/modules')
      return
    }
  }
  if (type === 'wizard-modules') {
    captureCreateFields()
    if (ui.create.modules.integrations) {
      go('#/projects/new/wizard/channels')
      return
    }
    finishCreate(selectedCreateModules())
    return
  }
  if (type === 'create-blank') {
    finishCreate([])
    return
  }
  if (type === 'create-preset') {
    const pr = PRESETS.find((x) => x.id === action.getAttribute('data-preset'))
    finishCreate(pr ? pr.modules : ['analytics'], pr && pr.desc)
    return
  }
  if (type === 'create-wizard') {
    finishCreate(selectedCreateModules())
    return
  }
  if (type === 'toast') {
    ui.toast = action.getAttribute('data-toast')
    setTimeout(() => {
      ui.toast = null
      render()
    }, 1800)
  }
  if (type === 'land-jump') {
    const el = document.getElementById(action.getAttribute('data-id'))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  render()
})

function captureCreateFields() {
  const nameInput = document.getElementById('create-name')
  const descInput = document.getElementById('create-desc')
  if (nameInput) ui.create.name = nameInput.value
  if (descInput) ui.create.desc = descInput.value
}

document.addEventListener('submit', (e) => {
  const askForm = e.target.closest('[data-ask-form]')
  if (askForm) {
    e.preventDefault()
    const input = document.getElementById('ask-input')
    pushAsk(input && input.value)
    render()
    return
  }
  const form = e.target.closest('[data-submit]')
  if (!form) return
  e.preventDefault()
  go(form.getAttribute('data-submit'))
})

window.addEventListener('hashchange', () => {
  ui.menu = null
  ui.tour = null
  ui.ask = null
  if (typeof stopDeleteTimer === 'function') stopDeleteTimer()
  render()
})

window.addEventListener('resize', () => placeTour())

document.getElementById('proto-toggle').addEventListener('click', () => {
  document.getElementById('proto-panel').classList.toggle('hidden')
})

render()
