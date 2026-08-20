/* js/screens-auth.js — Login / signup / operator block. */
function screenLogin() {
  return authWrap(`
    <form class="stack" data-submit="#/projects">
      <input class="input auth-input" type="email" placeholder="Почта" value="anna@logistika.ru" />
      <input class="input auth-input" type="password" placeholder="Пароль" value="••••••••" />
      <button class="btn btn-auth" type="submit">Войти</button>
    </form>
    <div class="auth-links">
      <a href="#/password-reset">Не помню пароль</a>
      <a href="#/signup">Создать аккаунт</a>
      <a href="#/login/tfa">Войти с кодом</a>
      <a href="#/projects/empty">Войти без проектов</a>
    </div>`)
}

function screenTfa() {
  return authWrap(`
    <h1 class="h2" style="color:#fff;text-align:center">Код из приложения</h1>
    <p class="small" style="color:var(--darkgrey);text-align:center">Шесть цифр. Кабинет, не панель оператора.</p>
    <form class="stack" data-submit="#/projects">
      <input class="input auth-input" placeholder="000 000" style="text-align:center;letter-spacing:6px" />
      <button class="btn btn-auth" type="submit">Подтвердить</button>
    </form>
    <div class="auth-links"><a href="#/login">Назад к почте</a></div>`, 'tfa')
}

function screenSignup() {
  return authWrap(`
    <h1 class="h2" style="color:#fff;text-align:center">Аккаунт компании</h1>
    <form class="stack" data-submit="#/projects/empty">
      <input class="input auth-input" placeholder="Имя" />
      <input class="input auth-input" type="email" placeholder="Почта" />
      <input class="input auth-input" type="password" placeholder="Пароль" />
      <button class="btn btn-auth" type="submit">Создать и войти</button>
    </form>
    <div class="auth-links"><a href="#/login">Уже есть вход</a></div>`, 'signup')
}

function screenReset() {
  return authWrap(`
    <h1 class="h2" style="color:#fff;text-align:center">Сброс пароля</h1>
    <form class="stack" data-submit="#/login">
      <input class="input auth-input" type="email" placeholder="Почта" />
      <button class="btn btn-auth" type="submit">Отправить ссылку</button>
    </form>
    <div class="auth-links"><a href="#/login">К входу</a></div>`, 'reset')
}

function screenOperator() {
  return authWrap(`
    <h1 class="h2" style="color:#fff;text-align:center">Это кабинет</h1>
    <p class="normal" style="color:var(--darkgrey);text-align:center">У этого входа нет доступа сюда. Откройте панель оператора — диалоги там.</p>
    <a class="btn btn-auth secondary" data-nav="#/login" style="text-decoration:none">Понятно</a>`, 'operator')
}
