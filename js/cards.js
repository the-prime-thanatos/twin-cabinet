/* js/cards.js — Entity cards. Shared skeleton + unique signature. */
function agentCard(pid, a, mini) {
  return `<button class="entity-card is-ai ${mini ? 'is-mini' : ''}" type="button" data-nav="#/p/${pid}/agents/${a.id}">
    ${entityHead('ai', chip(a.status))}
    <div class="h5 entity-title">${a.name}</div>
    <div class="entity-sig" aria-hidden="true"><div class="agent-wave">${waveBars(a.id)}</div></div>
    ${entityFoot([
      `<div class="chips">${mediumChip(a.medium || 'voice')}</div>`,
      mini ? '' : `<div class="small muted">${a.lang}</div>`,
      `<div class="verysmall muted">${a.updated}</div>`,
    ])}
  </button>`
}

function botCard(pid, b, mini) {
  const nlu = b.nluId && findNlu(pid, b.nluId)
  const ai = b.aiId && findAgent(pid, b.aiId)
  const inside = [nlu && `NLU-модель · ${nlu.name}`, ai && `AI-агент · ${ai.name}`].filter(Boolean)
  return `<button class="entity-card is-graph ${mini ? 'is-mini' : ''}" type="button" data-nav="#/p/${pid}/bots/${b.id}">
    ${entityHead('graph', chip(b.status))}
    <div class="h5 entity-title">${b.name}</div>
    <div class="entity-sig" aria-hidden="true"><div class="flow-sig"><i></i><span></span><i></i><span></span><i></i></div></div>
    ${entityFoot([
      `<div class="chips">${mediumChip(b.medium || 'text')}</div>`,
      !mini && inside.length ? `<div class="rel-line">Внутри: ${inside.join(', ')}</div>` : '',
      `<div class="verysmall muted">${b.updated}</div>`,
    ])}
  </button>`
}

function nluCard(pid, n, mini) {
  const host = n.usedIn && findBot(pid, n.usedIn)
  return `<button class="entity-card is-nlu ${mini ? 'is-mini' : ''}" type="button" data-nav="#/p/${pid}/nlu/${n.id}">
    ${entityHead('nlu', chip(n.status))}
    <div class="h5 entity-title">${n.name}</div>
    <div class="entity-sig"><span class="sig-num">${n.intents || 0}</span><span class="small muted">намерений</span></div>
    ${entityFoot([
      `<div class="small muted">${n.entities || 0} сущностей</div>`,
      mini ? '' : (host ? `<div class="rel-line">В сценарии · ${host.name}</div>` : '<div class="rel-line">С клиентом не говорит</div>'),
      `<div class="verysmall muted">${n.updated}</div>`,
    ])}
  </button>`
}

function jobCard(pid, j, mini) {
  return `<button class="entity-card is-job ${mini ? 'is-mini' : ''}" type="button" data-nav="#/p/${pid}/calls/${j.id}">
    ${entityHead('job', chip(j.status))}
    <div class="h5 entity-title">${j.name}</div>
    <div class="entity-sig">
      <span class="sig-num">${j.progress}%</span>
      <div class="progress"><span style="width:${j.progress}%"></span></div>
    </div>
    ${entityFoot([
      j.brain ? brainMark(j.brain) : '',
      `<div class="verysmall muted">${j.from} → ${j.to}</div>`,
    ])}
  </button>`
}

function chatCard(c) {
  const unread = c.unread ? `<span class="chat-unread">${c.unread}</span>` : ''
  return `<button class="entity-card is-chat" type="button" data-action="toast" data-toast="Диалог в v1 только список">
    ${entityHead('chat', unread || chip(c.status || 'active'))}
    <div class="h5 entity-title">${c.title}</div>
    <div class="entity-sig"><p class="chat-preview">${c.preview}</p></div>
    ${entityFoot([
      `<div class="chips">${c.brain ? kindChip(c.brain.kind) : ''}<span class="chip">${c.channel}</span></div>`,
      c.brain ? `<div class="rel-line">${c.brain.name}</div>` : '',
      `<div class="verysmall muted">${c.time}</div>`,
    ])}
  </button>`
}

function campaignCard(c) {
  const pct = c.total ? Math.round((c.sent / c.total) * 100) : 0
  return `<button class="entity-card is-campaign" type="button" data-action="toast" data-toast="Кампания в v1 без отдельной страницы">
    ${entityHead('campaign', chip(c.status))}
    <div class="h5 entity-title">${c.name}</div>
    <div class="entity-sig">
      <span class="sig-num">${c.sent.toLocaleString('ru-RU')}<span class="sig-den"> / ${c.total.toLocaleString('ru-RU')}</span></span>
      <div class="progress"><span style="width:${pct}%"></span></div>
    </div>
    ${entityFoot([
      `<div class="small muted">${c.channel}</div>`,
    ])}
  </button>`
}

function docCard(d) {
  return `<button class="entity-card is-doc" type="button" data-action="toast" data-toast="Просмотр файла в v1 не рисуем">
    ${entityHead('doc', `<span class="chip">${d.type}</span>`)}
    <div class="h5 entity-title">${d.name}</div>
    <div class="entity-sig">${icon('file')}<span class="small muted">${d.size}</span></div>
    ${entityFoot([
      d.agent ? `<div class="rel-line">Для AI-агента · ${d.agent}</div>` : '',
      `<div class="verysmall muted">${d.updated}</div>`,
    ])}
  </button>`
}

function phoneCard(ph) {
  return `<button class="entity-card is-phone" type="button" data-action="toast" data-toast="Карточка номера: маршрутизация в настройках проекта">
    ${entityHead('phone', chip(ph.status))}
    <div class="h5 entity-title">${ph.city}</div>
    <div class="entity-sig"><span class="phone-sig">${ph.number}</span></div>
    ${entityFoot([`<div class="verysmall muted">${ph.until}</div>`])}
  </button>`
}

function offerCard(ph) {
  return `<button class="entity-card is-phone" type="button" data-action="toast" data-toast="В v1 номер не покупаем — только карточка витрины">
    ${entityHead('offer', `<span class="chip">${ph.city}</span>`)}
    <div class="h5 entity-title">${ph.city}</div>
    <div class="entity-sig"><span class="phone-sig">${ph.number}</span></div>
    ${entityFoot([`<div class="small muted">${ph.price}</div>`])}
  </button>`
}

function tplCard(kind, skin, t) {
  return `<button class="entity-card ${skin}" type="button" data-action="toast" data-toast="Редактор шаблона в v1 не рисуем">
    ${entityHead(kind, t.status ? chip(t.status) : `<span class="chip">${t.channel || ''}</span>`)}
    <div class="h5 entity-title">${t.name}</div>
    <div class="entity-sig"><p class="chat-preview">${t.body || (t.brain ? t.brain.name : '')}</p></div>
    ${entityFoot([
      t.brain ? brainMark(t.brain) : '',
      t.medium ? `<div class="chips">${mediumChip(t.medium)}</div>` : '',
    ])}
  </button>`
}

function reportCard(r) {
  return `<button class="entity-card is-report" type="button" data-action="toast" data-toast="Файл отчёта в v1 не скачиваем">
    ${entityHead('report', `<span class="chip">${r.type}</span>`)}
    <div class="h5 entity-title">${r.name}</div>
    <div class="entity-sig"><div class="mini-bars"><i></i><i></i><i></i><i></i><i></i></div></div>
    ${entityFoot([
      r.status === 'GENERATING'
        ? '<span class="chip chip-running"><span class="dot"></span>собирается</span>'
        : r.service
          ? `<div class="small muted">${r.service}</div>`
          : '',
      `<div class="verysmall muted">${r.updated}</div>`,
    ])}
  </button>`
}

function marketCard(m) {
  return `<button class="entity-card is-market" type="button" data-action="toast" data-toast="Добавим в проект. В v1 без установки">
    ${entityHead('market', kindChip(m.kind))}
    <div class="h5 entity-title">${m.name}</div>
    <div class="entity-sig"><span class="sig-num" style="font-size:22px;line-height:28px">${m.price}</span></div>
    ${entityFoot([`<div class="small muted">Готовый объект в магазин компании</div>`])}
  </button>`
}

function sectionTabs(pid, base, tabs, active) {
  return `<div class="tabs">${tabs
    .map((t) => {
      const href = t.id ? `#/p/${pid}/${base}/${t.id}` : `#/p/${pid}/${base}`
      return `<a class="tab ${active === t.id ? 'is-active' : ''}" data-nav="${href}">${t.label}</a>`
    })
    .join('')}</div>`
}

function avatarMenu(open) {
  return `<div class="popper right ${open ? '' : 'hidden'}">
    <div class="popper-item" style="pointer-events:none">
      <div><div class="h6">Анна Козлова</div><div class="verysmall muted">Северная логистика</div></div>
    </div>
    <button class="popper-item" type="button" data-nav="#/account/company">${icon('company', 16)} Компания</button>
    <button class="popper-item" type="button" data-nav="#/account/team">${icon('team', 16)} Команда</button>
    <button class="popper-item" type="button" data-nav="#/account/billing">${icon('wallet', 16)} Биллинг</button>
    <button class="popper-item" type="button" data-nav="#/login">${icon('logout', 16)} Выйти</button>
  </div>`
}

function ofList(map, pid) {
  if (map[pid]) return map[pid]
  return []
}

function chatsOf(pid) {
  if (CHATS[pid]) return CHATS[pid]
  return project(pid).chats > 0 ? CHATS.courier : []
}

function campaignsOf(pid) {
  if (CAMPAIGNS[pid]) return CAMPAIGNS[pid]
  return project(pid).phase === 'setup' ? [] : CAMPAIGNS.courier
}
