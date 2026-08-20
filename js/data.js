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
  { id: 'courier', name: 'Подбор курьеров', desc: 'Исходящие звонки и WhatsApp по заявкам', created: '1 авг', updated: 'сегодня, 11:20', agents: 4, bots: 2, nlu: 1, calls: 3, chats: 186, phase: 'live', modules: ['agents', 'knowledge', 'bots', 'nlu', 'calls', 'numbers', 'chats', 'integrations', 'analytics'] },
  { id: 'omsk', name: 'Омск · входящая линия', desc: 'Городская линия 3812, запись в слот', created: '28 июл', updated: 'вчера', agents: 1, bots: 1, nlu: 1, calls: 1, chats: 42, phase: 'live', modules: ['agents', 'bots', 'nlu', 'calls', 'numbers', 'analytics'] },
  { id: 'wa', name: 'WhatsApp поддержка', desc: 'Первая линия магазина', created: '10 авг', updated: '18 авг', agents: 1, bots: 2, nlu: 1, calls: 0, chats: 904, phase: 'live', modules: ['agents', 'knowledge', 'bots', 'nlu', 'chats', 'integrations', 'analytics'] },
  { id: 'clinic', name: 'Клиника «Север» · запись', desc: 'Голос + SMS-напоминания', created: '5 авг', updated: '17 авг', agents: 3, bots: 2, nlu: 0, calls: 2, chats: 51, phase: 'live', modules: ['agents', 'knowledge', 'calls', 'numbers', 'campaigns', 'analytics'] },
  { id: 'hr', name: 'HR-скрининг Москва', desc: 'Скрининг кандидатов на склад', created: '2 авг', updated: '15 авг', agents: 2, bots: 1, nlu: 0, calls: 4, chats: 12, phase: 'live', modules: ['agents', 'calls', 'analytics'] },
  { id: 'shop', name: 'Брошенная корзина', desc: 'Дожим заказа за 2 часа', created: '1 авг', updated: '12 авг', agents: 1, bots: 2, nlu: 0, calls: 2, chats: 220, phase: 'live', modules: ['bots', 'campaigns', 'chats', 'integrations', 'analytics'] },
  { id: 'taxi', name: 'Такси · подтверждение', desc: 'Подтверждение подачи машины', created: '22 июл', updated: '10 авг', agents: 1, bots: 1, nlu: 0, calls: 5, chats: 0, phase: 'live', modules: ['agents', 'calls', 'analytics'] },
  { id: 'school', name: 'Онлайн-школа · прогрев', desc: 'Прогрев лида до менеджера', created: '20 июл', updated: '8 авг', agents: 2, bots: 4, nlu: 0, calls: 1, chats: 77, phase: 'live', modules: ['bots', 'campaigns', 'chats', 'integrations', 'analytics'] },
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
    { id: 'agt_7K2m', name: 'Скрининг курьера', lang: 'Русский', status: 'active', created: '4 авг', updated: 'сегодня, 10:12', kind: 'ai', medium: 'voice' },
    { id: 'agt_91qx', name: 'Уточнение слота доставки', lang: 'Русский', status: 'active', created: '2 авг', updated: 'вчера', kind: 'ai', medium: 'voice' },
    { id: 'agt_b2Nw', name: 'English · city couriers', lang: 'English', status: 'paused', created: '1 авг', updated: '16 авг', kind: 'ai', medium: 'voice' },
    { id: 'agt_cL04', name: 'Черновик · ночная смена', lang: 'Русский', status: 'draft', created: '14 авг', updated: '14 авг', kind: 'ai', medium: 'voice' },
  ],
  omsk: [
    { id: 'agt_om2', name: 'Перезвон не дозвонились', lang: 'Русский', status: 'paused', created: '10 авг', updated: '18 авг', kind: 'ai', medium: 'voice' },
  ],
  wa: [
    { id: 'agt_wa1', name: 'FAQ магазина', lang: 'Русский', status: 'active', created: '10 авг', updated: '18 авг', kind: 'ai', medium: 'text' },
  ],
}

const BOTS = {
  courier: [
    { id: 'bot_91qx', name: 'WhatsApp · квалификация', channel: 'WhatsApp', status: 'active', created: '3 авг', updated: 'сегодня', kind: 'graph', medium: 'text', nluId: 'nlu_hr1' },
    { id: 'bot_2kL1', name: 'Telegram · статус заявки', channel: 'Telegram', status: 'active', created: '8 авг', updated: '17 авг', kind: 'graph', medium: 'text', aiId: 'agt_91qx' },
  ],
  omsk: [
    { id: 'bot_om1', name: 'Входящая запись', channel: 'Голос', status: 'active', created: '28 июл', updated: 'вчера', kind: 'graph', medium: 'voice', nluId: 'nlu_om1' },
  ],
  wa: [
    { id: 'bot_wa2', name: 'Возврат заказа', channel: 'WhatsApp', status: 'paused', created: '10 авг', updated: '12 авг', kind: 'graph', medium: 'text', nluId: 'nlu_wa1' },
    { id: 'bot_wa3', name: 'Черновик · акции', channel: 'WhatsApp', status: 'draft', created: '9 авг', updated: '9 авг', kind: 'graph', medium: 'text' },
  ],
}

const NLU = {
  courier: [
    { id: 'nlu_hr1', name: 'Квалификация курьера', status: 'active', created: '3 авг', updated: 'сегодня', intents: 18, entities: 6, usedIn: 'bot_91qx' },
  ],
  omsk: [
    { id: 'nlu_om1', name: 'Запись в слот', status: 'active', created: '28 июл', updated: 'вчера', intents: 12, entities: 4, usedIn: 'bot_om1' },
  ],
  wa: [
    { id: 'nlu_wa1', name: 'Возвраты · намерения', status: 'active', created: '10 авг', updated: '12 авг', intents: 9, entities: 3, usedIn: 'bot_wa2' },
  ],
}

const JOBS = {
  courier: [
    { id: 'job_44a', name: 'Обзвон заявок 20.08', status: 'running', progress: 62, from: '20 авг, 09:00', to: '20 авг, 18:00', created: '19 авг', updated: 'сегодня, 11:00', brain: { kind: 'ai', id: 'agt_7K2m', name: 'Скрининг курьера' } },
    { id: 'job_44b', name: 'Дозвон «не взяли трубку»', status: 'paused', progress: 28, from: '19 авг', to: '21 авг', created: '18 авг', updated: 'вчера', brain: { kind: 'ai', id: 'agt_7K2m', name: 'Скрининг курьера' } },
    { id: 'job_44c', name: 'Ночной слот курьеров', status: 'draft', progress: 0, from: '21 авг', to: '21 авг', created: '20 авг', updated: '20 авг', brain: { kind: 'ai', id: 'agt_cL04', name: 'Черновик · ночная смена' } },
  ],
  taxi: [
    { id: 'job_tx1', name: 'Подтверждение заказа', status: 'running', progress: 81, from: 'сегодня', to: 'сегодня', created: '10 авг', updated: 'сегодня', brain: { kind: 'ai', id: 'agt_7K2m', name: 'Скрининг курьера' } },
  ],
  omsk: [
    { id: 'job_om1', name: 'Входящая 3812', status: 'running', progress: 44, from: 'сегодня', to: 'сегодня', created: '28 июл', updated: 'сегодня', brain: { kind: 'graph', id: 'bot_om1', name: 'Входящая запись' } },
  ],
}

const CHATS = {
  courier: [
    { id: 'cht_1', title: 'Заявка 2041', channel: 'WhatsApp', preview: 'Готов выйти на смену с понедельника', time: '5 мин', created: '18 авг', updated: '5 мин', unread: 2, status: 'active', brain: { kind: 'graph', id: 'bot_91qx', name: 'WhatsApp · квалификация' } },
    { id: 'cht_2', title: 'Слот на вечер', channel: 'Telegram', preview: 'Подтвердите адрес склада', time: '09:40', created: '19 авг', updated: '09:40', unread: 0, status: 'paused', brain: { kind: 'graph', id: 'bot_2kL1', name: 'Telegram · статус заявки' } },
    { id: 'cht_3', title: 'Курьер · Астана', channel: 'WhatsApp', preview: 'Документы отправил', time: 'вчера', created: '12 авг', updated: 'вчера', unread: 0, status: 'active', brain: { kind: 'graph', id: 'bot_91qx', name: 'WhatsApp · квалификация' } },
  ],
  wa: [
    { id: 'cht_w1', title: 'Возврат 8812', channel: 'WhatsApp', preview: 'Когда вернут деньги на карту?', time: '2 мин', created: '18 авг', updated: '2 мин', unread: 4, status: 'active', brain: { kind: 'graph', id: 'bot_wa2', name: 'Возврат заказа' } },
    { id: 'cht_w2', title: 'FAQ · размер', channel: 'WhatsApp', preview: 'AI-агент ответил, ждём человека', time: '18 мин', created: '19 авг', updated: '18 мин', unread: 1, status: 'active', brain: { kind: 'ai', id: 'agt_wa1', name: 'FAQ магазина' } },
    { id: 'cht_w3', title: 'Самовывоз', channel: 'Telegram', preview: 'Точка на Ленина до 21:00', time: 'час назад', created: '17 авг', updated: 'час назад', unread: 0, status: 'active', brain: { kind: 'ai', id: 'agt_wa1', name: 'FAQ магазина' } },
  ],
}

const CAMPAIGNS = {
  courier: [
    { id: 'cmp_c1', name: 'Напоминание о слоте', channel: 'SMS', status: 'running', sent: 1204, total: 2000, created: '18 авг', updated: 'сегодня' },
    { id: 'cmp_c2', name: 'Прогрев WhatsApp', channel: 'WhatsApp', status: 'paused', sent: 310, total: 800, created: '12 авг', updated: 'вчера' },
  ],
  clinic: [
    { id: 'cmp_1', name: 'Напоминание за 24 часа', channel: 'SMS', status: 'running', sent: 1204, total: 2000, created: '10 авг', updated: 'сегодня' },
    { id: 'cmp_2', name: 'Напоминание за 2 часа', channel: 'WhatsApp', status: 'paused', sent: 310, total: 800, created: '10 авг', updated: '17 авг' },
  ],
  shop: [
    { id: 'cmp_s1', name: 'Брошенная корзина 2ч', channel: 'WhatsApp', status: 'running', sent: 640, total: 900, created: '1 авг', updated: 'сегодня' },
  ],
  school: [
    { id: 'cmp_sc1', name: 'Прогрев лида', channel: 'Email', status: 'running', sent: 412, total: 1200, created: '20 июл', updated: '8 авг' },
  ],
}

const DOCS = {
  courier: [
    { id: 'doc_1', name: 'Скрипт скрининга.pdf', type: 'PDF', size: '240 КБ', created: '4 авг', updated: '18 авг', agent: 'Скрининг курьера' },
    { id: 'doc_2', name: 'FAQ по слотам.docx', type: 'DOCX', size: '88 КБ', created: '2 авг', updated: '12 авг', agent: 'Уточнение слота доставки' },
  ],
  wa: [
    { id: 'doc_w1', name: 'Правила возврата.pdf', type: 'PDF', size: '120 КБ', created: '10 авг', updated: '12 авг', agent: 'FAQ магазина' },
  ],
  clinic: [
    { id: 'doc_cl1', name: 'Скрипт записи.mp3', type: 'AUDIO', size: '1.2 МБ', created: '5 авг', updated: '17 авг', agent: 'Запись на приём' },
  ],
}

const PHONES = {
  courier: [
    { id: 'ph_1', number: '+7 495 120-44-11', city: 'Москва', status: 'active', until: 'до 20 сен', created: '1 авг', updated: '12 авг' },
    { id: 'ph_2', number: '+7 812 441-02-90', city: 'Санкт-Петербург', status: 'active', until: 'до 1 окт', created: '4 авг', updated: '4 авг' },
  ],
  omsk: [
    { id: 'ph_om', number: '+7 3812 55-12-00', city: 'Омск', status: 'active', until: 'городская линия', created: '28 июл', updated: 'вчера' },
  ],
  clinic: [
    { id: 'ph_cl', number: '+7 383 200-11-08', city: 'Новосибирск', status: 'active', until: 'до 12 ноя', created: '5 авг', updated: '5 авг' },
  ],
}

const MARKET_PHONES = [
  { id: 'mp_1', number: '+7 495 •• ••-18', city: 'Москва', price: '1 200 ₽ / мес', created: '1 авг', updated: '18 авг' },
  { id: 'mp_2', number: '+7 812 •• ••-44', city: 'Санкт-Петербург', price: '980 ₽ / мес', created: '1 авг', updated: '12 авг' },
  { id: 'mp_3', number: '+7 383 •• ••-02', city: 'Новосибирск', price: '640 ₽ / мес', created: '8 авг', updated: '8 авг' },
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
    { id: 'jt_1', name: 'Скрининг слота', status: 'active', created: '4 авг', updated: 'вчера', brain: { kind: 'ai', name: 'Скрининг курьера' }, medium: 'voice' },
    { id: 'jt_2', name: 'Дозвон «не взяли»', status: 'paused', created: '8 авг', updated: '18 авг', brain: { kind: 'ai', name: 'Скрининг курьера' }, medium: 'voice' },
  ],
  omsk: [
    { id: 'jt_om', name: 'Входящая 3812', status: 'active', created: '28 июл', updated: 'вчера', brain: { kind: 'graph', name: 'Входящая запись' }, medium: 'voice' },
  ],
}

const CHAT_TEMPLATES = {
  courier: [
    { id: 'ct_1', name: 'Приветствие', channel: 'WhatsApp', body: 'Здравствуйте! Это подбор курьеров. Напишите город и удобную смену.', created: '3 авг', updated: 'сегодня' },
    { id: 'ct_2', name: 'Слот подтверждён', channel: 'Telegram', body: 'Слот {{time}} подтверждён. Адрес склада пришлём за час.', created: '8 авг', updated: '17 авг' },
  ],
  wa: [
    { id: 'ct_w1', name: 'Возврат принят', channel: 'WhatsApp', body: 'Заявку на возврат приняли. Деньги на карту — до 5 дней.', created: '10 авг', updated: '12 авг' },
  ],
}

const CAMP_TEMPLATES = {
  clinic: [
    { id: 'mt_1', name: 'Напоминание 24ч', channel: 'SMS', body: 'Напоминаем о визите завтра в {{time}}. Отмена — ответьте НЕТ.', created: '10 авг', updated: '17 авг' },
    { id: 'mt_2', name: 'Напоминание 2ч', channel: 'WhatsApp', body: 'Через 2 часа приём в клинике «Север». Ждём вас.', created: '10 авг', updated: '17 авг' },
  ],
  courier: [
    { id: 'mt_c1', name: 'Слот завтра', channel: 'SMS', body: 'Завтра смена с {{time}}. Напишите +, если выходите.', created: '12 авг', updated: 'сегодня' },
  ],
}

const REPORTS = {
  courier: [
    { id: 'rep_1', name: 'Дозвон по дням', type: 'Звонки', service: 'CIS · cis_call_aggregated', status: 'GENERATED', created: '12 авг', updated: 'сегодня' },
    { id: 'rep_2', name: 'WhatsApp квалификация', type: 'Чаты', service: 'CHAT · chat_sessions', status: 'GENERATED', created: '10 авг', updated: 'вчера' },
    { id: 'rep_3', name: 'Фразы кандидатов', type: 'Чаты', service: 'CHAT · chat_clientPositionalPhrases', status: 'GENERATED', created: '8 авг', updated: '19 авг' },
    { id: 'rep_4', name: 'Расход по сервисам', type: 'Расход', service: 'platform_total_cost', status: 'GENERATING', created: 'сегодня', updated: 'собирается' },
  ],
  wa: [
    { id: 'rep_w1', name: 'Первая линия магазина', type: 'Чаты', service: 'CHAT · chat_metrics', status: 'GENERATED', created: '10 авг', updated: '18 авг' },
    { id: 'rep_w2', name: 'Продуктивность операторов', type: 'Чаты', service: 'CHAT · chat_productivity', status: 'GENERATED', created: '10 авг', updated: '17 авг' },
  ],
  clinic: [
    { id: 'rep_cl1', name: 'Явка после SMS', type: 'Рассылки', service: 'MESSAGING · messaging_messages', status: 'GENERATED', created: '10 авг', updated: '17 авг' },
    { id: 'rep_cl2', name: 'Входящие к слоту', type: 'Звонки', service: 'CIS · call_incoming', status: 'GENERATED', created: '8 авг', updated: '16 авг' },
  ],
  omsk: [
    { id: 'rep_om1', name: 'Линия 3812 за неделю', type: 'Звонки', service: 'CIS · billing_incoming_call', status: 'GENERATED', created: '28 июл', updated: 'вчера' },
  ],
  shop: [
    { id: 'rep_s1', name: 'Доставка WhatsApp', type: 'Рассылки', service: 'MESSAGING · messaging_task_message_processing', status: 'GENERATED', created: '1 авг', updated: '12 авг' },
  ],
}

const AN_DAYS = ['Чт', 'Пт', 'Сб', 'Вс', 'Пн', 'Вт', 'Ср']

const ANALYTICS = {
  courier: {
    kpis: {
      calls: { value: '1 284', delta: '+12%', good: true, sub: 'исх. 1 102 · вх. 182' },
      chats: { value: '3 041', delta: '+28%', good: true, sub: 'WhatsApp 2 410' },
      answered: { value: '54%', delta: '−3 п.п.', good: false, sub: 'человек взял трубку' },
      csi: { value: '86%', delta: '+2 п.п.', good: true, sub: 'NPS 42 · FCR 71%' },
      spend: { value: '8 120 ₽', delta: '+9%', good: false, sub: 'не счёт компании' },
    },
    series: { days: AN_DAYS, calls: [148, 176, 62, 48, 210, 268, 372], chats: [310, 348, 190, 164, 520, 610, 899], spend: [920, 1040, 410, 330, 1480, 1860, 2080] },
    calls: {
      incoming: { count: '182', cost: '640 ₽', avgDur: '1:48' },
      outgoing: { count: '1 102', cost: '4 120 ₽', avgDur: '0:54' },
      answered: '54%',
      avgDur: '0:58',
      cost: '4 760 ₽',
      statuses: [
        { label: 'Ответил человек', count: 694, color: 'var(--malachite)' },
        { label: 'Нет ответа', count: 318, color: 'var(--tulip)' },
        { label: 'Занято', count: 142, color: 'var(--darkgrey)' },
        { label: 'Автоответчик', count: 86, color: 'var(--pumpkin)' },
        { label: 'Сбой', count: 44, color: 'var(--coralred)' },
      ],
      jobs: [
        { id: 'job_44a', name: 'Обзвон заявок 20.08', candidates: '2 100', calls: '1 102', answered: '612', human: '54%', effective: '418', cost: '3 410 ₽', avgDur: '0:54' },
        { id: 'job_44b', name: 'Дозвон «не взяли трубку»', candidates: '480', calls: '182', answered: '82', human: '41%', effective: '28', cost: '710 ₽', avgDur: '0:41' },
      ],
      costSplit: [
        { label: 'Транк', value: 2860, right: '2 860 ₽' },
        { label: 'STT', value: 980, right: '980 ₽' },
        { label: 'TTS', value: 640, right: '640 ₽' },
        { label: 'LLM', value: 1120, right: '1 120 ₽' },
        { label: 'AMD', value: 160, right: '160 ₽' },
      ],
      recent: [
        { time: '11:18', phone: '+7 999 120-44-11', dir: 'исх.', status: 'FINISHED', dur: '0:42', price: '6,40 ₽', brain: 'Скрининг курьера' },
        { time: '11:12', phone: '+7 913 220-11-04', dir: 'исх.', status: 'NO_ANSWER', dur: '—', price: '1,10 ₽', brain: 'Скрининг курьера' },
        { time: '11:04', phone: '+7 905 441-90-12', dir: 'исх.', status: 'FINISHED', dur: '1:08', price: '8,20 ₽', brain: 'Уточнение слота' },
        { time: '10:51', phone: '+7 3812 00-12', dir: 'вх.', status: 'FINISHED', dur: '2:14', price: '4,80 ₽', brain: 'WhatsApp · квалификация' },
        { time: '10:40', phone: '+7 777 102-33-90', dir: 'исх.', status: 'AMD', dur: '0:09', price: '1,40 ₽', brain: 'Скрининг курьера' },
      ],
    },
    chats: {
      sessions: '3 041',
      messages: { bot: '8 120', operator: '940', client: '6 410' },
      quality: { csi: '86%', nps: '42', fcr: '71%', firstAnswer: '12 с' },
      sources: [
        { label: 'WhatsApp', value: 2410, right: '2 410' },
        { label: 'Telegram', value: 631, right: '631' },
      ],
      operators: [
        { name: 'Анна Козлова', handled: 86, answered: 81, wait: '9 с', csi: '91%' },
        { name: 'Кирилл Новиков', handled: 54, answered: 47, wait: '18 с', csi: '78%' },
      ],
      phrases: [
        { label: 'когда смена', value: 214, right: '214' },
        { label: 'какой адрес склада', value: 168, right: '168' },
        { label: 'документы отправил', value: 121, right: '121' },
        { label: 'не выйду', value: 86, right: '86' },
        { label: 'слот на вечер', value: 64, right: '64' },
      ],
      funnel: [
        { label: 'Приветствие', value: 2410, right: '2 410' },
        { label: 'Слоты', value: 1820, right: '1 820' },
        { label: 'Документы', value: 1240, right: '1 240' },
        { label: 'Квалифицирован', value: 418, right: '418' },
      ],
    },
    spend: {
      total: '8 120 ₽',
      items: [
        { label: 'Телефония', value: 4760, right: '4 760 ₽' },
        { label: 'AI-агент · LLM / TTS / STT', value: 1910, right: '1 910 ₽' },
        { label: 'Чаты', value: 840, right: '840 ₽' },
        { label: 'GPT в сценариях', value: 420, right: '420 ₽' },
        { label: 'Рассылки', value: 190, right: '190 ₽' },
      ],
      gpt: [
        { label: 'gpt-4o-mini', value: 310, right: '1 860 вызовов · 310 ₽' },
        { label: 'gpt-4o', value: 110, right: '94 вызова · 110 ₽' },
      ],
      tts: [
        { label: 'yandex-grpc-v2', value: 380, right: '380 ₽' },
        { label: 'eleven-labs', value: 260, right: '260 ₽' },
      ],
    },
  },
  omsk: {
    kpis: {
      calls: { value: '864', delta: '+4%', good: true, sub: 'вх. 791 · исх. 73' },
      answered: { value: '71%', delta: '+1 п.п.', good: true, sub: 'городская 3812' },
      avgDur: { value: '2:06', delta: '−12 с', good: true, sub: 'средняя длина' },
      spend: { value: '3 240 ₽', delta: '+6%', good: false, sub: 'не счёт компании' },
    },
    series: { days: AN_DAYS, calls: [96, 118, 54, 41, 142, 186, 227], chats: [0, 0, 0, 0, 0, 0, 0], spend: [310, 380, 160, 120, 540, 720, 1010] },
    calls: {
      incoming: { count: '791', cost: '2 680 ₽', avgDur: '2:14' },
      outgoing: { count: '73', cost: '210 ₽', avgDur: '0:48' },
      answered: '71%',
      avgDur: '2:06',
      cost: '2 890 ₽',
      statuses: [
        { label: 'Запись в слот', count: 412, color: 'var(--malachite)' },
        { label: 'Ответил человек', count: 614, color: 'var(--sky)' },
        { label: 'Нет ответа', count: 96, color: 'var(--tulip)' },
        { label: 'Вне окна', count: 88, color: 'var(--pumpkin)' },
        { label: 'Сбой', count: 18, color: 'var(--coralred)' },
      ],
      jobs: [
        { id: 'job_om1', name: 'Входящая 3812', candidates: '—', calls: '791', answered: '614', human: '71%', effective: '412', cost: '2 680 ₽', avgDur: '2:14' },
      ],
      costSplit: [
        { label: 'Транк', value: 1840, right: '1 840 ₽' },
        { label: 'STT', value: 520, right: '520 ₽' },
        { label: 'TTS', value: 310, right: '310 ₽' },
        { label: 'LLM', value: 220, right: '220 ₽' },
      ],
      recent: [
        { time: '18:22', phone: '+7 3812 44-10', dir: 'вх.', status: 'FINISHED', dur: '2:40', price: '5,10 ₽', brain: 'Входящая запись' },
        { time: '18:11', phone: '+7 913 200-11-08', dir: 'вх.', status: 'FINISHED', dur: '1:12', price: '3,40 ₽', brain: 'Входящая запись' },
        { time: '17:58', phone: '+7 3812 00-04', dir: 'вх.', status: 'NO_ANSWER', dur: '—', price: '0,80 ₽', brain: 'Входящая запись' },
      ],
    },
    spend: {
      total: '3 240 ₽',
      items: [
        { label: 'Телефония', value: 2890, right: '2 890 ₽' },
        { label: 'AI-агент · LLM / TTS / STT', value: 350, right: '350 ₽' },
      ],
      gpt: [{ label: 'gpt-4o-mini', value: 90, right: '210 вызовов · 90 ₽' }],
      tts: [{ label: 'yandex-grpc-v2', value: 310, right: '310 ₽' }],
    },
  },
  wa: {
    kpis: {
      chats: { value: '4 812', delta: '+16%', good: true, sub: 'WhatsApp 4 102' },
      csi: { value: '81%', delta: '−4 п.п.', good: false, sub: 'NPS 28 · FCR 64%' },
      first: { value: '22 с', delta: '+6 с', good: false, sub: 'первый ответ оператора' },
      spend: { value: '2 640 ₽', delta: '+11%', good: false, sub: 'не счёт компании' },
    },
    series: { days: AN_DAYS, calls: [0, 0, 0, 0, 0, 0, 0], chats: [520, 610, 380, 290, 840, 980, 1192], spend: [280, 310, 190, 140, 460, 540, 720] },
    chats: {
      sessions: '4 812',
      messages: { bot: '11 240', operator: '2 180', client: '9 860' },
      quality: { csi: '81%', nps: '28', fcr: '64%', firstAnswer: '22 с' },
      sources: [
        { label: 'WhatsApp', value: 4102, right: '4 102' },
        { label: 'Telegram', value: 710, right: '710' },
      ],
      operators: [
        { name: 'Анна Козлова', handled: 210, answered: 198, wait: '14 с', csi: '88%' },
        { name: 'Кирилл Новиков', handled: 164, answered: 142, wait: '31 с', csi: '74%' },
      ],
      phrases: [
        { label: 'когда вернут деньги', value: 412, right: '412' },
        { label: 'где заказ', value: 368, right: '368' },
        { label: 'размер не тот', value: 190, right: '190' },
        { label: 'самовывоз', value: 124, right: '124' },
      ],
      funnel: [
        { label: 'Приветствие', value: 4102, right: '4 102' },
        { label: 'FAQ', value: 2860, right: '2 860' },
        { label: 'Возврат', value: 940, right: '940' },
        { label: 'К оператору', value: 374, right: '374' },
      ],
    },
    spend: {
      total: '2 640 ₽',
      items: [
        { label: 'Чаты', value: 1480, right: '1 480 ₽' },
        { label: 'AI-агент · LLM / TTS / STT', value: 720, right: '720 ₽' },
        { label: 'GPT в сценариях', value: 440, right: '440 ₽' },
      ],
      gpt: [
        { label: 'gpt-4o-mini', value: 280, right: '2 140 вызовов · 280 ₽' },
        { label: 'gpt-4o', value: 160, right: '48 вызовов · 160 ₽' },
      ],
      tts: [],
    },
  },
  clinic: {
    kpis: {
      calls: { value: '412', delta: '+3%', good: true, sub: 'вх. 318 · исх. 94' },
      answered: { value: '68%', delta: '+2 п.п.', good: true, sub: 'запись к врачу' },
      sent: { value: '1 514', delta: '+8%', good: true, sub: 'SMS 1 204 · WhatsApp 310' },
      delivered: { value: '96%', delta: '0 п.п.', good: true, sub: 'дошло до клиента' },
      spend: { value: '4 180 ₽', delta: '+5%', good: false, sub: 'не счёт компании' },
    },
    series: { days: AN_DAYS, calls: [48, 52, 22, 18, 74, 90, 108], chats: [0, 0, 0, 0, 0, 0, 0], spend: [420, 480, 210, 160, 740, 980, 1190] },
    calls: {
      incoming: { count: '318', cost: '1 120 ₽', avgDur: '1:36' },
      outgoing: { count: '94', cost: '280 ₽', avgDur: '0:44' },
      answered: '68%',
      avgDur: '1:22',
      cost: '1 400 ₽',
      statuses: [
        { label: 'Запись', count: 214, color: 'var(--malachite)' },
        { label: 'Нет ответа', count: 86, color: 'var(--tulip)' },
        { label: 'Перенос', count: 48, color: 'var(--sky)' },
        { label: 'Сбой', count: 12, color: 'var(--coralred)' },
      ],
      jobs: [
        { id: 'job_cl1', name: 'Напоминание голосом', candidates: '180', calls: '94', answered: '62', human: '66%', effective: '54', cost: '280 ₽', avgDur: '0:44' },
      ],
      costSplit: [
        { label: 'Транк', value: 840, right: '840 ₽' },
        { label: 'STT', value: 260, right: '260 ₽' },
        { label: 'TTS', value: 210, right: '210 ₽' },
        { label: 'LLM', value: 90, right: '90 ₽' },
      ],
      recent: [
        { time: '09:40', phone: '+7 900 114-22-01', dir: 'вх.', status: 'FINISHED', dur: '1:50', price: '4,20 ₽', brain: 'Запись в клинику' },
        { time: '09:22', phone: '+7 913 008-11-40', dir: 'исх.', status: 'FINISHED', dur: '0:38', price: '2,10 ₽', brain: 'Напоминание голосом' },
      ],
    },
    messaging: {
      sent: '1 514',
      delivered: '1 452',
      cost: '1 860 ₽',
      channels: [
        { channel: 'SMS', sent: '1 204', delivered: '1 168', rate: '97%', price: '1 420 ₽' },
        { channel: 'WhatsApp', sent: '310', delivered: '284', rate: '92%', price: '440 ₽' },
      ],
      statuses: [
        { label: 'Доставлено', value: 1452, right: '1 452' },
        { label: 'Отправлено', value: 38, right: '38' },
        { label: 'Ошибка', value: 24, right: '24' },
      ],
      series: [180, 210, 90, 70, 280, 340, 344],
    },
    spend: {
      total: '4 180 ₽',
      items: [
        { label: 'Рассылки', value: 1860, right: '1 860 ₽' },
        { label: 'Телефония', value: 1400, right: '1 400 ₽' },
        { label: 'AI-агент · LLM / TTS / STT', value: 920, right: '920 ₽' },
      ],
      gpt: [{ label: 'gpt-4o-mini', value: 140, right: '420 вызовов · 140 ₽' }],
      tts: [{ label: 'yandex-grpc-v2', value: 210, right: '210 ₽' }],
    },
  },
  shop: {
    kpis: {
      chats: { value: '1 640', delta: '+21%', good: true, sub: 'после брошенной корзины' },
      sent: { value: '640', delta: '+14%', good: true, sub: 'WhatsApp дожим' },
      delivered: { value: '91%', delta: '−2 п.п.', good: false, sub: 'дошло до клиента' },
      spend: { value: '1 980 ₽', delta: '+18%', good: false, sub: 'не счёт компании' },
    },
    series: { days: AN_DAYS, calls: [0, 0, 0, 0, 0, 0, 0], chats: [160, 190, 120, 90, 280, 340, 460], spend: [180, 210, 120, 90, 360, 440, 580] },
    chats: {
      sessions: '1 640',
      messages: { bot: '4 210', operator: '180', client: '2 860' },
      quality: { csi: '74%', nps: '19', fcr: '58%', firstAnswer: '8 с' },
      sources: [{ label: 'WhatsApp', value: 1640, right: '1 640' }],
      operators: [{ name: 'Анна Козлова', handled: 22, answered: 20, wait: '11 с', csi: '80%' }],
      phrases: [
        { label: 'промокод', value: 186, right: '186' },
        { label: 'ещё актуально', value: 142, right: '142' },
        { label: 'другой адрес', value: 64, right: '64' },
      ],
      funnel: [
        { label: 'Напоминание', value: 640, right: '640' },
        { label: 'Ответ клиента', value: 310, right: '310' },
        { label: 'Оформил', value: 94, right: '94' },
      ],
    },
    messaging: {
      sent: '640',
      delivered: '582',
      cost: '890 ₽',
      channels: [{ channel: 'WhatsApp', sent: '640', delivered: '582', rate: '91%', price: '890 ₽' }],
      statuses: [
        { label: 'Доставлено', value: 582, right: '582' },
        { label: 'Прочитано', value: 410, right: '410' },
        { label: 'Ошибка', value: 58, right: '58' },
      ],
      series: [70, 82, 48, 36, 110, 140, 154],
    },
    spend: {
      total: '1 980 ₽',
      items: [
        { label: 'Рассылки', value: 890, right: '890 ₽' },
        { label: 'Чаты', value: 640, right: '640 ₽' },
        { label: 'GPT в сценариях', value: 450, right: '450 ₽' },
      ],
      gpt: [{ label: 'gpt-4o-mini', value: 450, right: '980 вызовов · 450 ₽' }],
      tts: [],
    },
  },
}

function analyticsOf(pid) {
  const map = { courier: 'courier', omsk: 'omsk', wa: 'wa', clinic: 'clinic', shop: 'shop', school: 'shop', hr: 'courier', taxi: 'courier' }
  return ANALYTICS[map[pid] || 'courier']
}

function projectHas(pid, id) {
  return (((project(pid) || {}).modules) || []).includes(id)
}

const MARKET = [
  { id: 'mk_1', name: 'Скрининг курьера', kind: 'ai', price: 'бесплатно', created: '1 авг', updated: '18 авг' },
  { id: 'mk_2', name: 'Запись в слот', kind: 'graph', price: '4 900 ₽', created: '28 июл', updated: '12 авг' },
  { id: 'mk_3', name: 'NLU · возвраты', kind: 'nlu', price: '1 200 ₽', created: '10 авг', updated: '10 авг' },
  { id: 'mk_4', name: 'Напоминание клиники', kind: 'campaign', price: 'бесплатно', created: '5 авг', updated: '17 авг' },
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
  { id: 'telegram', name: 'Telegram', connected: true, color: '#32B5EE', group: 'Мессенджер' },
  { id: 'whatsapp', name: 'WhatsApp', connected: true, color: '#1DCA66', group: 'Мессенджер' },
  { id: 'vk', name: 'VK', connected: false, color: '#466FFF', group: 'Мессенджер' },
  { id: 'amo', name: 'AmoCRM', connected: true, color: '#F66020', group: 'CRM' },
  { id: 'bitrix', name: 'Bitrix24', connected: false, color: '#26CFBB', group: 'CRM' },
  { id: 'yclients', name: 'YClients', connected: false, color: '#A156FF', group: 'CRM' },
  { id: 'email', name: 'Email SMTP', connected: false, color: '#E5A831', group: 'Канал' },
  { id: 'webhook', name: 'Webhook', connected: true, color: '#58546E', group: 'API' },
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
