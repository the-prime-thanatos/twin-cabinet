/* js/cards.js — Entity cards. Shared skeleton + unique signature. */
function cardMain(href, inner) {
  return `<button class="entity-card-main" type="button" ${href ? `data-nav="${href}"` : ''}>${inner}</button>`
}

function cardActions(opts) {
  if (!opts || opts.mini || !opts.id) return ''
  const key = `card-${opts.type}-${opts.id}`
  const open = ui.menu === key
  const edit = opts.edit || (opts.view ? `${opts.view}/edit` : '')
  return `<div class="entity-more ${open ? 'is-on' : ''}">
    <button class="entity-more-btn" type="button" data-action="menu" data-menu="${key}" title="Действия" aria-label="Действия">${icon('more', 16)}</button>
    <div class="popper right is-card ${open ? '' : 'hidden'}">
      ${edit ? `<button class="popper-item" type="button" data-nav="${edit}">${icon('edit', 16)} Изменить</button>` : ''}
      <button class="popper-item is-danger" type="button" data-action="ent-delete-ask" data-ent="${opts.type}" data-pid="${opts.pid}" data-id="${opts.id}" data-title="${attrEsc(opts.title || '')}">${icon('trash', 16)} Удалить</button>
    </div>
  </div>`
}

function entityCard(skin, extraClass, href, inner, actions) {
  return `<article class="entity-card ${skin} ${extraClass || ''}">
    ${cardMain(href, inner)}
    ${actions || ''}
  </article>`
}

function agentCard(pid, a, mini) {
  const href = `#/p/${pid}/agents/${a.id}`
  return entityCard(
    'is-ai',
    mini ? 'is-mini' : '',
    href,
    `${entityHead('ai', chip(a.status))}
    <div class="h5 entity-title">${a.name}</div>
    <div class="entity-sig" aria-hidden="true"><div class="agent-wave">${waveBars(a.id)}</div></div>
    ${entityFoot([
      `<div class="chips">${mediumChip(a.medium || 'voice')}</div>`,
      mini ? '' : `<div class="small muted">${a.lang}</div>`,
      entityDates(a),
    ])}`,
    cardActions({ mini, pid, type: 'agent', id: a.id, title: a.name, view: href }),
  )
}

function botCard(pid, b, mini) {
  const nlu = b.nluId && findNlu(pid, b.nluId)
  const ai = b.aiId && findAgent(pid, b.aiId)
  const inside = [nlu && entityRef('nlu', nlu.name), ai && entityRef('ai', ai.name)].filter(Boolean)
  const href = `#/p/${pid}/bots/${b.id}`
  return entityCard(
    'is-graph',
    mini ? 'is-mini' : '',
    href,
    `${entityHead('graph', chip(b.status))}
    <div class="h5 entity-title">${b.name}</div>
    <div class="entity-sig" aria-hidden="true"><div class="flow-sig"><i></i><span></span><i></i><span></span><i></i></div></div>
    ${entityFoot([
      `<div class="chips">${mediumChip(b.medium || 'text')}</div>`,
      !mini && inside.length ? `<div class="rel-line">${inside.join('')}</div>` : '',
      entityDates(b),
    ])}`,
    cardActions({ mini, pid, type: 'bot', id: b.id, title: b.name, view: href }),
  )
}

function nluCard(pid, n, mini) {
  const host = n.usedIn && findBot(pid, n.usedIn)
  const href = `#/p/${pid}/nlu/${n.id}`
  return entityCard(
    'is-nlu',
    mini ? 'is-mini' : '',
    href,
    `${entityHead('nlu', chip(n.status))}
    <div class="h5 entity-title">${n.name}</div>
    <div class="entity-sig"><span class="sig-num">${n.intents || 0}</span><span class="small muted">намерений</span></div>
    ${entityFoot([
      `<div class="small muted">${n.entities || 0} сущностей</div>`,
      mini ? '' : (host ? entityRef('graph', host.name) : '<div class="rel-line">С клиентом не говорит</div>'),
      entityDates(n),
    ])}`,
    cardActions({ mini, pid, type: 'nlu', id: n.id, title: n.name, view: href }),
  )
}

function jobCard(pid, j, mini) {
  const href = `#/p/${pid}/calls/${j.id}`
  return entityCard(
    'is-job',
    mini ? 'is-mini' : '',
    href,
    `${entityHead('job', chip(j.status))}
    <div class="h5 entity-title">${j.name}</div>
    <div class="entity-sig">
      <span class="sig-num">${j.progress}%</span>
      <div class="progress"><span style="width:${j.progress}%"></span></div>
    </div>
    ${entityFoot([
      j.brain ? brainMark(j.brain) : '',
      `<div class="verysmall muted">${j.from} → ${j.to}</div>`,
      entityDates(j),
    ])}`,
    cardActions({ mini, pid, type: 'job', id: j.id, title: j.name, view: href }),
  )
}

function chatCard(pid, c) {
  const unread = c.unread ? `<span class="chat-unread">${c.unread}</span>` : ''
  const href = `#/p/${pid}/chats/${c.id}`
  return entityCard(
    'is-chat',
    'is-thread',
    href,
    `${entityHead('chat', unread || chip(c.status || 'active'))}
    <div class="h5 entity-title">${c.title}</div>
    <div class="entity-sig"><p class="chat-preview">${c.preview}</p></div>
    ${entityFoot([
      `<div class="chat-meta">
        ${c.brain ? brainMark(c.brain) : ''}
        <span class="chip">${c.channel}</span>
      </div>`,
      entityDates(c),
    ])}`,
    cardActions({ pid, type: 'chat', id: c.id, title: c.title, view: href }),
  )
}

function campaignCard(pid, c) {
  const pct = c.total ? Math.round((c.sent / c.total) * 100) : 0
  const href = `#/p/${pid}/campaigns/${c.id}`
  return entityCard(
    'is-campaign',
    '',
    href,
    `${entityHead('campaign', chip(c.status))}
    <div class="h5 entity-title">${c.name}</div>
    <div class="entity-sig">
      <span class="sig-num">${c.sent.toLocaleString('ru-RU')}<span class="sig-den"> / ${c.total.toLocaleString('ru-RU')}</span></span>
      <div class="progress"><span style="width:${pct}%"></span></div>
    </div>
    ${entityFoot([
      `<div class="small muted">${c.channel}</div>`,
      entityDates(c),
    ])}`,
    cardActions({ pid, type: 'campaign', id: c.id, title: c.name, view: href }),
  )
}

function docCard(pid, d) {
  const href = `#/p/${pid}/knowledge/${d.id}`
  return entityCard(
    'is-doc',
    '',
    href,
    `${entityHead('doc', `<span class="chip">${d.type}</span>`)}
    <div class="h5 entity-title">${d.name}</div>
    <div class="entity-sig">${icon('file')}<span class="small muted">${d.size}</span></div>
    ${entityFoot([
      d.agent ? entityRef('ai', d.agent) : '',
      entityDates(d),
    ])}`,
    cardActions({ pid, type: 'doc', id: d.id, title: d.name, view: href }),
  )
}

function phoneCard(pid, ph) {
  const href = `#/p/${pid}/numbers/${ph.id}`
  return entityCard(
    'is-phone',
    '',
    href,
    `${entityHead('phone', chip(ph.status))}
    <div class="h5 entity-title">${ph.city}</div>
    <div class="entity-sig"><span class="phone-sig">${ph.number}</span></div>
    ${entityFoot([
      `<div class="verysmall muted">${ph.until}</div>`,
      entityDates(ph),
    ])}`,
    cardActions({ pid, type: 'phone', id: ph.id, title: ph.city, view: href }),
  )
}

function offerCard(pid, ph) {
  const href = `#/p/${pid}/numbers/shop/${ph.id}`
  return entityCard(
    'is-phone',
    '',
    href,
    `${entityHead('offer', `<span class="chip">${ph.city}</span>`)}
    <div class="h5 entity-title">${ph.city}</div>
    <div class="entity-sig"><span class="phone-sig">${ph.number}</span></div>
    ${entityFoot([
      `<div class="small muted">${ph.price}</div>`,
      entityDates(ph),
    ])}`,
    cardActions({ pid, type: 'offer', id: ph.id, title: ph.city, view: href }),
  )
}

function tplCard(kind, skin, t, pid) {
  const href = pid ? entPath(pid, kind, t.id) : ''
  return entityCard(
    skin,
    '',
    href,
    `${entityHead(kind, t.status ? chip(t.status) : `<span class="chip">${t.channel || ''}</span>`)}
    <div class="h5 entity-title">${t.name}</div>
    <div class="entity-sig"><p class="chat-preview">${t.body || (t.brain ? t.brain.name : '')}</p></div>
    ${entityFoot([
      t.brain ? brainMark(t.brain) : '',
      t.medium ? `<div class="chips">${mediumChip(t.medium)}</div>` : '',
      entityDates(t),
    ])}`,
    pid ? cardActions({ pid, type: kind, id: t.id, title: t.name, view: href }) : '',
  )
}

function reportCard(pid, r) {
  const href = `#/p/${pid}/analytics/reports/${r.id}`
  return entityCard(
    'is-report',
    '',
    href,
    `${entityHead('report', `<span class="chip">${r.type}</span>`)}
    <div class="h5 entity-title">${r.name}</div>
    <div class="entity-sig"><div class="mini-bars"><i></i><i></i><i></i><i></i><i></i></div></div>
    ${entityFoot([
      r.status === 'GENERATING'
        ? '<span class="chip chip-running"><span class="dot"></span>собирается</span>'
        : r.service
          ? `<div class="small muted">${r.service}</div>`
          : '',
      entityDates(r),
    ])}`,
    cardActions({ pid, type: 'report', id: r.id, title: r.name, view: href }),
  )
}

function marketCard(pid, m) {
  const href = `#/p/${pid}/market/${m.id}`
  return entityCard(
    'is-market',
    '',
    href,
    `${entityHead('market', kindChip(m.kind))}
    <div class="h5 entity-title">${m.name}</div>
    <div class="entity-sig"><span class="sig-num sig-price">${m.price}</span></div>
    ${entityFoot([
      `<div class="small muted">Готовый объект в магазин компании</div>`,
      entityDates(m),
    ])}`,
    cardActions({ pid, type: 'market', id: m.id, title: m.name, view: href }),
  )
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
    <div class="popper-item is-head">
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
