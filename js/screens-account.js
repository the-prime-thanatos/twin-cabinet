/* js/screens-account.js — Company / billing / team / error states. */
function screenCompany() {
  return accountShell(`${header('Компания', 'company')}
    <div class="stack" style="max-width:560px">
      <div class="field"><label>Название</label><input class="input" value="Северная логистика" /></div>
      <div class="field"><label>Часовой пояс</label><select class="select"><option>Asia/Yekaterinburg</option><option>Europe/Moscow</option></select></div>
      <div class="field"><label>Язык кабинета</label><select class="select"><option>Русский</option><option>English</option></select></div>
      <button class="btn" type="button" data-action="toast" data-toast="Сохранили">Сохранить</button>
    </div>`)
}

function screenBilling() {
  return accountShell(`${header('Биллинг', 'wallet', '<button class="btn">Пополнить</button>')}
    <div class="stat" style="max-width:320px"><div class="label">Баланс компании</div><div class="value">12 480 ₽</div></div>
    <div class="card mt-24"><table class="table">
      <thead><tr><th>Счёт</th><th>Дата</th><th>Сумма</th><th>Статус</th></tr></thead>
      <tbody>
        <tr><td class="mono">inv_2041</td><td>12 авг</td><td>15 000 ₽</td><td>${chip('active')}</td></tr>
        <tr><td class="mono">inv_1988</td><td>1 авг</td><td>15 000 ₽</td><td>${chip('active')}</td></tr>
      </tbody>
    </table></div>`)
}

function screenTeam() {
  return accountShell(`${header('Команда', 'team', '<button class="btn">Пригласить в компанию</button>')}
    <div class="card"><table class="table">
      <thead><tr><th>Пользователь</th><th>Почта</th><th>Роль в компании</th></tr></thead>
      <tbody>
        <tr><td>Анна Козлова</td><td>anna@logistika.ru</td><td>владелец</td></tr>
        <tr><td>Кирилл Новиков</td><td>kirill@logistika.ru</td><td>админ</td></tr>
        <tr><td>Ольга Пак</td><td>olga@logistika.ru</td><td>участник</td></tr>
      </tbody>
    </table></div>`)
}

function screenLoading(pid) {
  return shell(
    pid,
    'overview',
    `${header(project(pid).name, 'overview')}
    <div class="grid-stats">${'<div class="stat"><div class="skel" style="height:16px;width:40%"></div><div class="skel mt-16" style="height:32px;width:50%"></div></div>'.repeat(5)}</div>
    <div class="card mt-24 card-pad"><div class="skel" style="height:16px;width:30%"></div><div class="skel mt-16" style="height:48px"></div><div class="skel mt-8" style="height:48px"></div></div>`,
  )
}

function screenError() {
  return `<div class="app"><div class="main"><div class="page">
    <div class="card"><div class="empty">
    <div class="illu" style="background:var(--coralred-08);color:var(--coralred)">${icon('alert')}</div>
    <h2 class="h2">Не загрузилось</h2>
    <p class="muted">Сеть или сервер. Данные проекта на месте, попробуйте ещё раз.</p>
    <button class="btn mt-16" data-nav="#/projects">К проектам</button>
  </div></div></div></div></div>${guideChrome()}`
}

function screen404(pid) {
  return shell(
    pid,
    'overview',
    `<div class="card"><div class="empty">
      <div class="illu">${icon('search')}</div>
      <h2 class="h2">Не найдено в этом проекте</h2>
      <p class="muted">Сущность есть в другом проекте или её уже нет. Это не глобальный 404.</p>
      <button class="btn mt-16" data-nav="#/p/${pid}/overview">В обзор проекта</button>
    </div></div>`,
  )
}

function screenNoAccess(pid) {
  return shell(
    pid,
    'settings',
    `<div class="card"><div class="empty">
      <div class="illu">${icon('alert')}</div>
      <h2 class="h2">Нет доступа</h2>
      <p class="muted">В этом проекте вы не admin и не member. Попросите приглашение у владельца.</p>
      <button class="btn mt-16" data-nav="#/projects">Все проекты</button>
    </div></div>`,
  )
}
