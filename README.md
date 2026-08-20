# TWIN Cabinet · Project-first v1

Кликабельный HTML-прототип нового кабинета TWIN. Это не front-office и не Figma — отдельный статичный сайт.

**Флоу:** логин → список проектов → операционка внутри проекта. Компания (биллинг, команда, настройки) — из аватара.

Сборки нет: GitHub Pages отдаёт `index.html`, `css/`, `js/` как есть. Порядок `<script>` в `index.html` обязателен. Роутер на hash (`#/projects`).

Внизу справа кнопка **Все экраны**.

## Локально

Из этой папки (не `twin-frontend`):

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Открыть [http://127.0.0.1:4173/](http://127.0.0.1:4173/)

`--bind 127.0.0.1` обязателен на Windows: без него сервер часто слушает порт, но не отвечает. Если 4173 занят — другой порт, например `4175`.

## Публикация на GitHub Pages

После пуша в `main` workflow **Deploy GitHub Pages** собирает сайт из `index.html` + `css/` + `js/` и выкладывает его. URL:

`https://<github-username>.github.io/<repo>/`

### 1. Создать репозиторий

На [github.com/new](https://github.com/new):

- **Repository name:** например `twin-cabinet`
- **Public** (на бесплатном плане Pages для приватного репозитория недоступен)
- **не** ставить галочки Add README / .gitignore / license — файлы уже есть локально

### 2. Запушить эту папку

В PowerShell из `D:\work\twin-cabinet` (подставь свой логин и имя репо):

```powershell
git branch -M main
git add .
git commit -m "Publish TWIN Cabinet prototype for GitHub Pages"
git remote add origin https://github.com/<username>/twin-cabinet.git
git push -u origin main
```

Если `origin` уже есть — `git remote set-url origin …`, затем `git push -u origin main`.

### 3. Включить Pages

Один раз в репозитории:

1. **Settings → Pages**
2. **Build and deployment → Source:** `GitHub Actions` (не «Deploy from a branch»)
3. Сохранить

Если Actions в организации выключены: **Settings → Actions → General → Allow all actions**.

### 4. Проверить деплой

**Actions** → workflow **Deploy GitHub Pages** → зелёный run. Сайт:

`https://<username>.github.io/twin-cabinet/`

Первый заход: `https://<username>.github.io/twin-cabinet/#/`

Дальше каждый `git push` в `main` публикует заново. Ручной прогон: **Actions → Deploy GitHub Pages → Run workflow**.

### Если сайт не открылся

| Симптом | Что сделать |
|---|---|
| Workflow жёлтый / Environment | **Settings → Environments → github-pages** — снять required reviewers или Approve |
| `Get Pages site failed` / 404 на Pages | Source ещё не `GitHub Actions` — шаг 3, затем **Re-run jobs** |
| 404 на `…/twin-cabinet` | Подождать 1–2 минуты, открыть URL **со слэшем в конце** |
| Actions disabled | **Settings → Actions → General** — разрешить workflows |
| Приватный репозиторий | Сделать Public или нужен GitHub Pro |

Кастомный домен: **Settings → Pages → Custom domain**, DNS CNAME на `<username>.github.io`. Файл `CNAME` в корне репо класть не обязательно, GitHub создаст его сам.

## Где что править

| Файл | Зачем |
|---|---|
| `js/data.js` | Моки, пресеты, пункты меню |
| `js/cards.js` | Карточки сущностей |
| `js/state.js` | Закрепления, чеклист запуска |
| `js/screens-*.js` | Экраны |
| `js/boot.js` | Hash-роутер |
| `css/app.css` | Токены Twin + UI |
| `.github/workflows/pages.yml` | Сборка и деплой Pages |
| `.cursor/rules/` | Правила для агента |
