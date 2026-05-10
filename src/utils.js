// Иконка по названию подписки (ключевые слова)
const ICON_MAP = [
  { keys: ['netflix', 'нетфликс'], icon: '🎬' },
  { keys: ['spotify', 'спотифай'], icon: '🎵' },
  { keys: ['youtube', 'ютуб', 'premium'], icon: '▶️' },
  { keys: ['telegram', 'телеграм'], icon: '✈️' },
  { keys: ['apple', 'эппл', 'icloud'], icon: '🍎' },
  { keys: ['google', 'гугл', 'one', 'drive'], icon: '🔵' },
  { keys: ['yandex', 'яндекс', 'плюс'], icon: '🟡' },
  { keys: ['tinkoff', 'тинькофф', 'т-банк', 't-bank'], icon: '💳' },
  { keys: ['sber', 'сбер', 'спб'], icon: '🟢' },
  { keys: ['vk', 'вк', 'вконтакте'], icon: '💬' },
  { keys: ['playstation', 'плейстейшн', 'ps plus'], icon: '🎮' },
  { keys: ['xbox', 'иксбокс'], icon: '🎮' },
  { keys: ['steam'], icon: '🎮' },
  { keys: ['music', 'музыка'], icon: '🎧' },
  { keys: ['облак', 'cloud', 'storage'], icon: '☁️' },
  { keys: ['связь', 'mobile', 'мобайл', 'телефон'], icon: '📱' },
]

export function getSubIcon(name) {
  if (!name) return '📋'
  const lower = name.toLowerCase()
  const found = ICON_MAP.find(({ keys }) => keys.some((k) => lower.includes(k)))
  return found ? found.icon : '📋'
}

// Категории для подстановки по названию (при ручном вводе)
const CATEGORY_KEYS = {
  Кино: ['netflix', 'youtube', 'кинопоиск', 'okko', 'ivi', 'premier', 'wink', 'kion', 'start', 'нетфликс'],
  Музыка: ['spotify', 'music', 'яндекс.музыка', 'apple music', 'спотифай', 'музыка', 'звук', 'zvuk'],
  Книги: ['storytel', 'litres', 'mybook', 'bookmate', 'литрес', 'букмейт'],
  Облака: ['google', 'yandex', 'icloud', 'drive', 'disk', 'облак', 'one', 'mail.ru', 'onedrive', 'dropbox'],
  Связь: ['мтс', 'билайн', 'мегафон', 'tele2', 'yota', 'beeline', 'megafon'],
  Интернет: ['дом.ru', 'ростелеком', 'мгтс', 'акадо', 'rt.ru'],
  ЖКХ: ['электроэнергия', 'водоснабжение', 'отопление', 'газ', 'мусор', 'капремонт', 'домофон', 'охрана'],
  Банки: ['тинькофф', 'сбер', 'альфа', 'втб', 'tinkoff', 'sber', 'vtb'],
  Еда: ['яндекс.еда', 'delivery', 'самокат', 'сбермаркет', 'лавка', 'ozon fresh'],
  Игры: ['playstation', 'xbox', 'steam', 'vk play', 'geforce', 'origin', 'ubisoft'],
  Софт: ['microsoft', 'adobe', 'kaspersky', 'dr.web', 'notion', 'canva', 'figma'],
  Образование: ['skyeng', 'puzzle', 'lingualeo', 'duolingo', 'skillbox', 'нетология', 'практикум'],
  Спорт: ['fitstars', 'nike', 'headspace', 'calm'],
  'Тренажёрные залы': ['world class', 'alex fitness', 'фитнес', 'планета фитнес', 'x-fit', 'физкульт', 'зебра'],
  Покупки: ['ozon', 'wildberries', 'aliexpress', 'lamoda', 'маркет'],
  Транспорт: ['драйв', 'делимобиль', 'belkacar', 'aviasales'],
  Соцсети: ['telegram', 'vk premium', 'discord', 'телеграм'],
  ИИ: ['chatgpt', 'claude', 'midjourney', 'copilot'],
  Новости: ['рбк', 'коммерсант', 'ведомости'],
  ТВ: ['ростелеком тв', 'мтс тв', 'триколор', 'нтв'],
  Авто: ['автокод', 'автотека', 'парковк', 'гибдд'],
  Красота: ['gold apple', 'массаж', 'эпиляция'],
  Питомцы: ['лапы', 'petshop', 'ветеринар'],
  Безопасность: ['ivideon', 'xiaomi', 'охрана', 'гольфстрим'],
  Знакомства: ['mamba', 'tabor', 'loveplanet', 'pure'],
  Экосистемы: ['яндекс плюс', 'сберпрайм', 'мтс premium', 'vk combo', 'т-банк', 'газпром'],
}

export function inferCategory(name) {
  if (!name) return 'Другое'
  const lower = name.toLowerCase()
  for (const [cat, keys] of Object.entries(CATEGORY_KEYS)) {
    if (keys.some((k) => lower.includes(k))) return cat
  }
  return 'Другое'
}

// Следующая дата списания (день месяца 1–31)
export function getNextBillingDate(billingDay) {
  const day = Math.min(Number(billingDay) || 1, 28)
  const now = new Date()
  let next = new Date(now.getFullYear(), now.getMonth(), day)
  if (next <= now) next = new Date(now.getFullYear(), now.getMonth() + 1, day)
  return next
}

export function daysUntilBilling(billingDay) {
  const next = getNextBillingDate(billingDay)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  next.setHours(0, 0, 0, 0)
  return Math.ceil((next - today) / (1000 * 60 * 60 * 24))
}

export function isSoonBilling(billingDay, withinDays = 3) {
  const days = daysUntilBilling(billingDay)
  return days >= 0 && days <= withinDays
}

// Парсинг цены: убираем пробелы, ₽, запятые; возвращаем число
export function parsePrice(priceStr) {
  if (priceStr == null) return 0
  const s = String(priceStr)
    .replace(/\s/g, '')
    .replace(/₽|р\.|руб\.?/gi, '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '')
  const n = Number(s)
  return isNaN(n) ? 0 : n
}

// Сколько месяцев между списаниями (1 = раз в месяц, 12 = раз в год, 2 = раз в 2 месяца)
function monthsPerPeriod(periodStr) {
  const p = (periodStr || '').toLowerCase()
  if (p.includes('год') || p.includes('year') || p === 'год') return 12
  if (p.includes('полгод') || p.includes('полгода') || p.includes('6 месяц')) return 6
  // "раз в 2 месяца", "каждые 3 месяца", "every 2 months", "2 месяца"
  const match = p.match(/(\d+)\s*месяц\w*|(\d+)\s*month\w*|раз\s*в\s*(\d+)|кажд[ыеой]\s*(\d+)/i)
  const n = match ? parseInt(match[1] || match[2] || match[3] || match[4], 10) : null
  if (n != null && n >= 1) return n
  return 1 // по умолчанию — раз в месяц
}

// Возвращает сумму в месяц (руб) для статистики
export function pricePerMonth(sub) {
  const price = parsePrice(sub.price)
  const months = monthsPerPeriod(sub.period)
  return price / months
}

export function totalPerMonth(subs) {
  return subs.reduce((sum, s) => sum + pricePerMonth(s), 0)
}

export function totalPerYear(subs) {
  return totalPerMonth(subs) * 12
}

// Группировка по категориям для статистики
export function byCategory(subs) {
  const map = {}
  subs.forEach((s) => {
    const cat = s.category || 'Другое'
    if (!map[cat]) map[cat] = { total: 0, items: [] }
    map[cat].total += pricePerMonth(s)
    map[cat].items.push(s)
  })
  return Object.entries(map).sort((a, b) => b[1].total - a[1].total)
}
