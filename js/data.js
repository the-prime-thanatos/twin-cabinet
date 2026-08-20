/* js/data.js — Mock data, modules, presets, NAV. */
const ALL_MODULES = ['agents', 'knowledge', 'bots', 'nlu', 'calls', 'numbers', 'chats', 'campaigns', 'integrations', 'market', 'analytics']

const MODULES = [
  { id: 'agents', label: 'AI-агент', hint: 'Отвечает моделью. Голос, чат или оба' },
  { id: 'knowledge', label: 'База знаний', hint: 'Документы для AI-агентов проекта' },
  { id: 'bots', label: 'Сценарий', hint: 'Флоу на блоках. Голос или чат' },
  { id: 'nlu', label: 'NLU-модель', hint: 'Намерения. Сама с клиентом не говорит' },
  { id: 'calls', label: 'Обзвоны', hint: 'Задания. Кто отвечает — AI-агент или сценарий' },
  { id: 'numbers', label: 'Номера', hint: 'Номера проекта и витрина' },
  { id: 'chats', label: 'Чаты', hint: 'Диалоги. Кто отвечает — AI-агент или сценарий' },
  { id: 'campaigns', label: 'Рассылки', hint: 'SMS, WhatsApp, email' },
  { id: 'integrations', label: 'Интеграции', hint: 'CRM и мессенджеры' },
]

const PRESETS = [
  {
    id: 'outbound',
    name: 'Обзвон и найм',
    desc: 'Скрининг AI-агентом и задания на обзвон',
    modules: ['agents', 'knowledge', 'calls', 'numbers', 'analytics'],
  },
  {
    id: 'inbox',
    name: 'Входящая линия',
    desc: 'Голосовой сценарий и NLU-модель',
    modules: ['bots', 'nlu', 'calls', 'numbers', 'analytics'],
  },
  {
    id: 'support',
    name: 'Поддержка в мессенджерах',
    desc: 'Сценарий, NLU-модель, чаты',
    modules: ['bots', 'nlu', 'knowledge', 'chats', 'integrations', 'analytics'],
  },
  {
    id: 'broadcast',
    name: 'Рассылки',
    desc: 'Кампании и каналы доставки',
    modules: ['campaigns', 'integrations', 'analytics'],
  },
  {
    id: 'voice-text',
    name: 'Голос + текст',
    desc: 'AI-агент, сценарий, NLU-модель, обзвон и чаты',
    modules: ['agents', 'knowledge', 'bots', 'nlu', 'calls', 'numbers', 'chats', 'integrations', 'analytics'],
  },
]

const PROJECTS = [
  { id: 'courier', name: 'Подбор курьеров', desc: 'Исходящие звонки и WhatsApp по заявкам', updated: 'сегодня, 11:20', agents: 4, bots: 2, nlu: 1, calls: 3, chats: 186, phase: 'live', modules: ['agents', 'knowledge', 'bots', 'nlu', 'calls', 'numbers', 'chats', 'integrations', 'analytics'] },
  { id: 'omsk', name: 'Омск · входящая линия', desc: 'Городская линия 3812, запись в слот', updated: 'вчера', agents: 1, bots: 1, nlu: 1, calls: 1, chats: 42, phase: 'live', modules: ['agents', 'bots', 'nlu', 'calls', 'numbers', 'analytics'] },
  { id: 'wa', name: 'WhatsApp поддержка', desc: 'Первая линия магазина', updated: '18 авг', agents: 1, bots: 2, nlu: 1, calls: 0, chats: 904, phase: 'live', modules: ['agents', 'knowledge', 'bots', 'nlu', 'chats', 'integrations', 'analytics'] },
  { id: 'clinic', name: 'Клиника «Север» · запись', desc: 'Голос + SMS-напоминания', updated: '17 авг', agents: 3, bots: 2, nlu: 0, calls: 2, chats: 51, phase: 'live', modules: ['agents', 'knowledge', 'calls', 'numbers', 'campaigns', 'analytics'] },
  { id: 'hr', name: 'HR-скрининг Москва', desc: 'Скрининг кандидатов на склад', updated: '15 авг', agents: 2, bots: 1, nlu: 0, calls: 4, chats: 12, phase: 'live', modules: ['agents', 'calls', 'analytics'] },
  { id: 'shop', name: 'Брошенная корзина', desc: 'Дожим заказа за 2 часа', updated: '12 авг', agents: 1, bots: 2, nlu: 0, calls: 2, chats: 220, phase: 'live', modules: ['bots', 'campaigns', 'chats', 'integrations', 'analytics'] },
  { id: 'taxi', name: 'Такси · подтверждение', desc: 'Подтверждение подачи машины', updated: '10 авг', agents: 1, bots: 1, nlu: 0, calls: 5, chats: 0, phase: 'live', modules: ['agents', 'calls', 'analytics'] },
  { id: 'school', name: 'Онлайн-школа · прогрев', desc: 'Прогрев лида до менеджера', updated: '8 авг', agents: 2, bots: 4, nlu: 0, calls: 1, chats: 77, phase: 'live', modules: ['bots', 'campaigns', 'chats', 'integrations', 'analytics'] },
]

const NOTES = {
  courier: 'Не смешивать с входящей Омска. Ночная смена — только черновик agt_cL04. WhatsApp-квалификация идёт после голоса, не параллельно.',
  omsk: 'Городская 3812. Стоп-слова не трогаем без Кирилла. Пик с 18:00 — не запускать второй обзвон.',
  wa: 'Первая линия магазина. bot_wa2 (возвраты) на паузе специально: акция до пятницы.',
  clinic: 'Напоминания за 24 часа и за 2 часа. Не звонить в воскресенье.',
  hr: 'Скрининг склада. Если кандидат не берёт трубку дважды — в паузу, не в повтор.',
}

const AGENTS = {
  courier: [
    { id: 'agt_7K2m', name: 'Скрининг курьера', lang: 'Русский', status: 'active', updated: 'сегодня, 10:12', kind: 'ai', medium: 'voice' },
    { id: 'agt_91qx', name: 'Уточнение слота доставки', lang: 'Русский', status: 'active', updated: 'вчера', kind: 'ai', medium: 'voice' },
    { id: 'agt_b2Nw', name: 'English · city couriers', lang: 'English', status: 'paused', updated: '16 авг', kind: 'ai', medium: 'voice' },
    { id: 'agt_cL04', name: 'Черновик · ночная смена', lang: 'Русский', status: 'draft', updated: '14 авг', kind: 'ai', medium: 'voice' },
  ],
  omsk: [
    { id: 'agt_om2', name: 'Перезвон не дозвонились', lang: 'Русский', status: 'paused', updated: '18 авг', kind: 'ai', medium: 'voice' },
  ],
  wa: [
    { id: 'agt_wa1', name: 'FAQ магазина', lang: 'Русский', status: 'active', updated: '18 авг', kind: 'ai', medium: 'text' },
  ],
}

const BOTS = {
  courier: [
    { id: 'bot_91qx', name: 'WhatsApp · квалификация', channel: 'WhatsApp', status: 'active', updated: 'сегодня', kind: 'graph', medium: 'text', nluId: 'nlu_hr1' },
    { id: 'bot_2kL1', name: 'Telegram · статус заявки', channel: 'Telegram', status: 'active', updated: '17 авг', kind: 'graph', medium: 'text', aiId: 'agt_91qx' },
  ],
  omsk: [
    { id: 'bot_om1', name: 'Входящая запись', channel: 'Голос', status: 'active', updated: 'вчера', kind: 'graph', medium: 'voice', nluId: 'nlu_om1' },
  ],
  wa: [
    { id: 'bot_wa2', name: 'Возврат заказа', channel: 'WhatsApp', status: 'paused', updated: '12 авг', kind: 'graph', medium: 'text', nluId: 'nlu_wa1' },
    { id: 'bot_wa3', name: 'Черновик · акции', channel: 'WhatsApp', status: 'draft', updated: '9 авг', kind: 'graph', medium: 'text' },
  ],
}

const NLU = {
  courier: [
    { id: 'nlu_hr1', name: 'Квалификация курьера', status: 'active', updated: 'сегодня', intents: 18, entities: 6, usedIn: 'bot_91qx' },
  ],
  omsk: [
    { id: 'nlu_om1', name: 'Запись в слот', status: 'active', updated: 'вчера', intents: 12, entities: 4, usedIn: 'bot_om1' },
  ],
  wa: [
    { id: 'nlu_wa1', name: 'Возвраты · намерения', status: 'active', updated: '12 авг', intents: 9, entities: 3, usedIn: 'bot_wa2' },
  ],
}

const JOBS = {
  courier: [
    { id: 'job_44a', name: 'Обзвон заявок 20.08', status: 'running', progress: 62, from: '20 авг, 09:00', to: '20 авг, 18:00', brain: { kind: 'ai', id: 'agt_7K2m', name: 'Скрининг курьера' } },
    { id: 'job_44b', name: 'Дозвон «не взяли трубку»', status: 'paused', progress: 28, from: '19 авг', to: '21 авг', brain: { kind: 'ai', id: 'agt_7K2m', name: 'Скрининг курьера' } },
    { id: 'job_44c', name: 'Ночной слот курьеров', status: 'draft', progress: 0, from: '21 авг', to: '21 авг', brain: { kind: 'ai', id: 'agt_cL04', name: 'Черновик · ночная смена' } },
  ],
  taxi: [
    { id: 'job_tx1', name: 'Подтверждение заказа', status: 'running', progress: 81, from: 'сегодня', to: 'сегодня', brain: { kind: 'ai', id: 'agt_7K2m', name: 'Скрининг курьера' } },
  ],
  omsk: [
    { id: 'job_om1', name: 'Входящая 3812', status: 'running', progress: 44, from: 'сегодня', to: 'сегодня', brain: { kind: 'graph', id: 'bot_om1', name: 'Входящая запись' } },
  ],
}

const CHATS = {
  courier: [
    { id: 'cht_1', title: 'Заявка 2041', channel: 'WhatsApp', preview: 'Готов выйти на смену с понедельника', time: '5 мин', unread: 2, status: 'active', brain: { kind: 'graph', id: 'bot_91qx', name: 'WhatsApp · квалификация' } },
    { id: 'cht_2', title: 'Слот на вечер', channel: 'Telegram', preview: 'Подтвердите адрес склада', time: '09:40', unread: 0, status: 'paused', brain: { kind: 'graph', id: 'bot_2kL1', name: 'Telegram · статус заявки' } },
    { id: 'cht_3', title: 'Курьер · Астана', channel: 'WhatsApp', preview: 'Документы отправил', time: 'вчера', unread: 0, status: 'active', brain: { kind: 'graph', id: 'bot_91qx', name: 'WhatsApp · квалификация' } },
  ],
  wa: [
    { id: 'cht_w1', title: 'Возврат 8812', channel: 'WhatsApp', preview: 'Когда вернут деньги на карту?', time: '2 мин', unread: 4, status: 'active', brain: { kind: 'graph', id: 'bot_wa2', name: 'Возврат заказа' } },
    { id: 'cht_w2', title: 'FAQ · размер', channel: 'WhatsApp', preview: 'AI-агент ответил, ждём человека', time: '18 мин', unread: 1, status: 'active', brain: { kind: 'ai', id: 'agt_wa1', name: 'FAQ магазина' } },
    { id: 'cht_w3', title: 'Самовывоз', channel: 'Telegram', preview: 'Точка на Ленина до 21:00', time: 'час назад', unread: 0, status: 'active', brain: { kind: 'ai', id: 'agt_wa1', name: 'FAQ магазина' } },
  ],
}

const CAMPAIGNS = {
  courier: [
    { id: 'cmp_c1', name: 'Напоминание о слоте', channel: 'SMS', status: 'running', sent: 1204, total: 2000 },
    { id: 'cmp_c2', name: 'Прогрев WhatsApp', channel: 'WhatsApp', status: 'paused', sent: 310, total: 800 },
  ],
  clinic: [
    { id: 'cmp_1', name: 'Напоминание за 24 часа', channel: 'SMS', status: 'running', sent: 1204, total: 2000 },
    { id: 'cmp_2', name: 'Напоминание за 2 часа', channel: 'WhatsApp', status: 'paused', sent: 310, total: 800 },
  ],
  shop: [
    { id: 'cmp_s1', name: 'Брошенная корзина 2ч', channel: 'WhatsApp', status: 'running', sent: 640, total: 900 },
  ],
  school: [
    { id: 'cmp_sc1', name: 'Прогрев лида', channel: 'Email', status: 'running', sent: 412, total: 1200 },
  ],
}

const DOCS = {
  courier: [
    { id: 'doc_1', name: 'Скрипт скрининга.pdf', type: 'PDF', size: '240 КБ', updated: '18 авг', agent: 'Скрининг курьера' },
    { id: 'doc_2', name: 'FAQ по слотам.docx', type: 'DOCX', size: '88 КБ', updated: '12 авг', agent: 'Уточнение слота доставки' },
  ],
  wa: [
    { id: 'doc_w1', name: 'Правила возврата.pdf', type: 'PDF', size: '120 КБ', updated: '12 авг', agent: 'FAQ магазина' },
  ],
  clinic: [
    { id: 'doc_cl1', name: 'Скрипт записи.mp3', type: 'AUDIO', size: '1.2 МБ', updated: '17 авг', agent: 'Запись на приём' },
  ],
}

const PHONES = {
  courier: [
    { id: 'ph_1', number: '+7 495 120-44-11', city: 'Москва', status: 'active', until: 'до 20 сен' },
    { id: 'ph_2', number: '+7 812 441-02-90', city: 'Санкт-Петербург', status: 'active', until: 'до 1 окт' },
  ],
  omsk: [
    { id: 'ph_om', number: '+7 3812 55-12-00', city: 'Омск', status: 'active', until: 'городская линия' },
  ],
  clinic: [
    { id: 'ph_cl', number: '+7 383 200-11-08', city: 'Новосибирск', status: 'active', until: 'до 12 ноя' },
  ],
}

const MARKET_PHONES = [
  { id: 'mp_1', number: '+7 495 •• ••-18', city: 'Москва', price: '1 200 ₽ / мес' },
  { id: 'mp_2', number: '+7 812 •• ••-44', city: 'Санкт-Петербург', price: '980 ₽ / мес' },
  { id: 'mp_3', number: '+7 383 •• ••-02', city: 'Новосибирск', price: '640 ₽ / мес' },
]

const CALL_HISTORY = {
  courier: [
    { time: 'сегодня, 11:02', who: '+7 999 120-44-11', dur: '0:42', result: 'ответил', brain: { kind: 'ai', name: 'Скрининг курьера' } },
    { time: 'сегодня, 10:48', who: '+7 913 220-11-04', dur: '—', result: 'нет ответа', brain: { kind: 'ai', name: 'Скрининг курьера' } },
    { time: 'сегодня, 10:21', who: '+7 905 441-90-12', dur: '0:11', result: 'перезвон', brain: { kind: 'graph', name: 'WhatsApp · квалификация' } },
    { time: 'вчера, 19:04', who: '3812 → +7 3812 22-10-01', dur: '1:18', result: 'входящий', brain: { kind: 'graph', name: 'Входящая запись' } },
  ],
  omsk: [
    { time: 'сегодня, 09:12', who: '3812 → +7 3812 55-90-11', dur: '2:04', result: 'входящий', brain: { kind: 'graph', name: 'Входящая запись' } },
  ],
}

const JOB_TEMPLATES = {
  courier: [
    { id: 'jt_1', name: 'Скрининг слота', status: 'active', brain: { kind: 'ai', name: 'Скрининг курьера' }, medium: 'voice' },
    { id: 'jt_2', name: 'Дозвон «не взяли»', status: 'paused', brain: { kind: 'ai', name: 'Скрининг курьера' }, medium: 'voice' },
  ],
  omsk: [
    { id: 'jt_om', name: 'Входящая 3812', status: 'active', brain: { kind: 'graph', name: 'Входящая запись' }, medium: 'voice' },
  ],
}

const CHAT_TEMPLATES = {
  courier: [
    { id: 'ct_1', name: 'Приветствие', channel: 'WhatsApp', body: 'Здравствуйте! Это подбор курьеров. Напишите город и удобную смену.' },
    { id: 'ct_2', name: 'Слот подтверждён', channel: 'Telegram', body: 'Слот {{time}} подтверждён. Адрес склада пришлём за час.' },
  ],
  wa: [
    { id: 'ct_w1', name: 'Возврат принят', channel: 'WhatsApp', body: 'Заявку на возврат приняли. Деньги на карту — до 5 дней.' },
  ],
}

const CAMP_TEMPLATES = {
  clinic: [
    { id: 'mt_1', name: 'Напоминание 24ч', channel: 'SMS', body: 'Напоминаем о визите завтра в {{time}}. Отмена — ответьте НЕТ.' },
    { id: 'mt_2', name: 'Напоминание 2ч', channel: 'WhatsApp', body: 'Через 2 часа приём в клинике «Север». Ждём вас.' },
  ],
  courier: [
    { id: 'mt_c1', name: 'Слот завтра', channel: 'SMS', body: 'Завтра смена с {{time}}. Напишите +, если выходите.' },
  ],
}

const REPORTS = {
  courier: [
    { id: 'rep_1', name: 'Дозвон по дням', type: 'Звонки', updated: 'сегодня' },
    { id: 'rep_2', name: 'WhatsApp квалификация', type: 'Чаты', updated: 'вчера' },
  ],
  wa: [
    { id: 'rep_w1', name: 'Первая линия магазина', type: 'Чаты', updated: '18 авг' },
  ],
  clinic: [
    { id: 'rep_cl1', name: 'Явка после SMS', type: 'Рассылки', updated: '17 авг' },
  ],
}

const MARKET = [
  { id: 'mk_1', name: 'Скрининг курьера', kind: 'ai', price: 'бесплатно' },
  { id: 'mk_2', name: 'Запись в слот', kind: 'graph', price: '4 900 ₽' },
  { id: 'mk_3', name: 'NLU · возвраты', kind: 'nlu', price: '1 200 ₽' },
  { id: 'mk_4', name: 'Напоминание клиники', kind: 'campaign', price: 'бесплатно' },
]

const SCHEDULE = [
  ['Пн–Пт', '09:00 – 21:00'],
  ['Сб', '10:00 – 18:00'],
  ['Вс', 'выходной'],
]

const BLACKLIST = [
  { phone: '+7 900 111-22-33', reason: 'жалоба', added: '12 авг' },
  { phone: '+7 999 000-00-01', reason: 'стоп-слово', added: '3 авг' },
]

const INTEGRATIONS = [
  { id: 'telegram', name: 'Telegram', connected: true, color: '#32B5EE' },
  { id: 'whatsapp', name: 'WhatsApp', connected: true, color: '#1DCA66' },
  { id: 'vk', name: 'VK', connected: false, color: '#466FFF' },
  { id: 'amo', name: 'AmoCRM', connected: true, color: '#F66020' },
  { id: 'bitrix', name: 'Bitrix24', connected: false, color: '#26CFBB' },
  { id: 'yclients', name: 'YClients', connected: false, color: '#A156FF' },
  { id: 'email', name: 'Email SMTP', connected: false, color: '#E5A831' },
  { id: 'webhook', name: 'Webhook', connected: true, color: '#58546E' },
]

const NAV = [
  { id: 'overview', label: 'Обзор', icon: 'overview' },
  { id: 'agents', label: 'AI-агенты', icon: 'agents' },
  { id: 'knowledge', label: 'База знаний', icon: 'knowledge' },
  { id: 'bots', label: 'Сценарии', icon: 'bots' },
  { id: 'nlu', label: 'NLU-модели', icon: 'nlu' },
  { id: 'calls', label: 'Звонки', icon: 'calls' },
  { id: 'numbers', label: 'Номера', icon: 'numbers' },
  { id: 'chats', label: 'Чаты', icon: 'chats' },
  { id: 'campaigns', label: 'Рассылки', icon: 'campaigns' },
  { id: 'integrations', label: 'Интеграции', icon: 'integrations' },
  { id: 'market', label: 'Маркетплейс', icon: 'market' },
  { id: 'analytics', label: 'Аналитика', icon: 'analytics' },
  { divider: true },
  { id: 'settings', label: 'Настройки проекта', icon: 'settings' },
]
