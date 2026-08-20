/* js/proto.js — Cover + screen map FAB. */
function screenCover() {
  return `<div class="cover">
    <div>
      <div class="small muted-dark">TWIN · Product design</div>
      <h1 class="h1" style="font-size:48px;line-height:56px;margin-top:16px">TWIN Cabinet · Project-first v1</h1>
      <p class="h4" style="color:var(--darkgrey);font-weight:400;margin-top:16px">Login → проекты → операционка внутри проекта. Компания — аккаунт: биллинг и команда.</p>
      <div class="scope">Карточки и связи сущностей. Редактор сценария и обучение NLU в v1 не рисуем.</div>
      ${pageLead('cover', 'dark')}
      <div class="mt-24"><button class="btn btn-auth" data-nav="#/login">Пройти флоу</button></div>
      <p class="verysmall muted-dark mt-24">20 августа 2026 · 1440×900 · HTML-прототип вместо Figma</p>
    </div>
    <div>
      <h3 class="h3">Экраны</h3>
      <p><a href="#/login">A Auth</a></p>
      <p><a href="#/projects">B Проекты</a> · <a href="#/projects/new">создание</a> · <a href="#/projects/empty">empty</a></p>
      <p><a href="#/p/courier/overview">C Обзор</a></p>
      <p><a href="#/p/courier/agents">D AI-агенты</a> · <a href="#/p/courier/agents/empty">empty</a></p>
      <p><a href="#/p/courier/bots">E Сценарии</a> · <a href="#/p/courier/nlu">NLU-модели</a></p>
      <p><a href="#/p/courier/calls">F Звонки</a> · <a href="#/p/courier/calls/history">детализация</a> · <a href="#/p/courier/numbers">номера</a></p>
      <p><a href="#/p/courier/knowledge">База знаний</a> · <a href="#/p/courier/market">маркетплейс</a> · <a href="#/p/courier/analytics/reports">отчёты</a></p>
      <p><a href="#/p/courier/integrations">G Интеграции</a></p>
      <p><a href="#/p/courier/analytics">H Аналитика</a></p>
      <p><a href="#/p/courier/settings">I Настройки</a> · <a href="#/p/courier/settings/telephony">телефония</a></p>
      <p><a href="#/account/company">J Аккаунт</a></p>
    </div>
  </div>${guideChrome()}`
}

function protoHTML() {
  return `<p class="proto-note">v1. Меню как в GitLab: закрепления + «Меню». Новый проект — чеклист запуска, потом статус «в работе».</p>
  <h4 class="h6">Дизайн</h4>
  <a href="#/lab/cards">Канон карточек</a>
  <a href="#/lab/page">Анатомия экрана</a>
  <h4 class="h6">Флоу</h4>
  <a href="#/">Cover</a>
  <a href="#/login">Логин → проекты</a>
  <a href="#/projects/empty">Логин без проектов</a>
  <a href="#/p/omsk/overview">Другой проект через switcher (Омск)</a>
  <h4 class="h6">Auth</h4>
  <a href="#/login">Login</a>
  <a href="#/login/tfa">TFA</a>
  <a href="#/signup">Signup</a>
  <a href="#/password-reset">Сброс пароля</a>
  <a href="#/operator-blocked">Кабинет / оператор</a>
  <h4 class="h6">Projects</h4>
  <a href="#/projects">Сетка 8</a>
  <a href="#/projects/one">1 проект</a>
  <a href="#/projects/empty">Empty</a>
  <a href="#/projects/new">Новый проект · 3 пути</a>
  <a href="#/projects/new/preset">Пресеты</a>
  <a href="#/projects/new/wizard">Мастер</a>
  <a href="#/p/omsk/overview">Омск · сценарий на входе + AI на перезвон</a>
  <a href="#/p/wa/overview">WhatsApp · AI FAQ и сценарий возвратов</a>
  <h4 class="h6">Проект</h4>
  <a href="#/p/courier/overview">Обзор</a>
  <a href="#/p/courier/agents">AI-агенты</a>
  <a href="#/p/courier/agents/empty">AI-агенты empty</a>
  <a href="#/p/courier/agents/agt_7K2m">Карточка AI-агента</a>
  <a href="#/p/courier/bots">Сценарии</a>
  <a href="#/p/courier/bots/empty">Сценарии empty</a>
  <a href="#/p/courier/bots/bot_91qx">Карточка сценария</a>
  <a href="#/p/courier/nlu">NLU-модели</a>
  <a href="#/p/courier/nlu/nlu_hr1">Карточка NLU-модели</a>
  <a href="#/p/courier/calls">Звонки</a>
  <a href="#/p/courier/calls/empty">Звонки empty</a>
  <a href="#/p/courier/calls/job_44a">Задание</a>
  <a href="#/p/courier/calls/templates">Шаблоны заданий</a>
  <a href="#/p/courier/calls/history">Детализация</a>
  <a href="#/p/courier/calls/schedule">Расписание</a>
  <a href="#/p/courier/calls/blacklist">Чёрный список</a>
  <a href="#/p/courier/numbers">Номера</a>
  <a href="#/p/courier/numbers/shop">Витрина номеров</a>
  <a href="#/p/courier/knowledge">База знаний</a>
  <a href="#/p/courier/chats">Чаты</a>
  <a href="#/p/courier/chats/templates">Шаблоны чатов</a>
  <a href="#/p/courier/campaigns">Рассылки</a>
  <a href="#/p/courier/campaigns/templates">Шаблоны рассылок</a>
  <a href="#/p/courier/market">Маркетплейс</a>
  <a href="#/p/courier/integrations">Интеграции</a>
  <a href="#/p/courier/integrations/none">Интеграции empty</a>
  <a href="#/p/courier/integrations/telegram">Подключение</a>
  <a href="#/p/courier/analytics">Аналитика</a>
  <a href="#/p/courier/analytics/reports">Отчёты</a>
  <a href="#/p/courier/settings">Настройки</a>
  <a href="#/p/courier/settings/members">Участники</a>
  <a href="#/p/courier/settings/telephony">Телефония проекта</a>
  <h4 class="h6">Аккаунт</h4>
  <a href="#/account/company">Компания</a>
  <a href="#/account/billing">Биллинг</a>
  <a href="#/account/team">Команда</a>
  <h4 class="h6">States</h4>
  <a href="#/p/courier/loading">Skeleton</a>
  <a href="#/error">Ошибка</a>
  <a href="#/p/courier/404">Не найдено в проекте</a>
  <a href="#/p/courier/no-access">Нет доступа</a>`
}
