const ones = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']

const onesFeminine = [
  '',
  'одна',
  'две',
  'три',
  'четыре',
  'пять',
  'шесть',
  'семь',
  'восемь',
  'девять',
]

const teens = [
  'десять',
  'одиннадцать',
  'двенадцать',
  'тринадцать',
  'четырнадцать',
  'пятнадцать',
  'шестнадцать',
  'семнадцать',
  'восемнадцать',
  'девятнадцать',
]

const tens = [
  '',
  '',
  'двадцать',
  'тридцать',
  'сорок',
  'пятьдесят',
  'шестьдесят',
  'семьдесят',
  'восемьдесят',
  'девяносто',
]

const hundreds = [
  '',
  'сто',
  'двести',
  'триста',
  'четыреста',
  'пятьсот',
  'шестьсот',
  'семьсот',
  'восемьсот',
  'девятьсот',
]

function pluralizeThousands(n) {
  const mod100 = n % 100
  const mod10 = n % 10
  if (mod100 >= 11 && mod100 <= 14) return 'тысяч'
  if (mod10 === 1) return 'тысяча'
  if (mod10 >= 2 && mod10 <= 4) return 'тысячи'
  return 'тысяч'
}

function underThousand(n, feminine) {
  const parts = []
  const h = Math.floor(n / 100)
  const remainder = n % 100
  if (h > 0) parts.push(hundreds[h])
  if (remainder >= 10 && remainder <= 19) {
    parts.push(teens[remainder - 10])
  } else {
    const t = Math.floor(remainder / 10)
    const o = remainder % 10
    if (t > 0) parts.push(tens[t])
    if (o > 0) parts.push(feminine ? onesFeminine[o] : ones[o])
  }
  return parts.join(' ')
}

export function numberToRussian(n) {
  if (n === 0) return 'ноль'
  if (n < 0 || n > 999999) throw new Error('Number out of range (0-999999)')

  const parts = []
  const thousands = Math.floor(n / 1000)
  const remainder = n % 1000

  if (thousands > 0) {
    parts.push(underThousand(thousands, true))
    parts.push(pluralizeThousands(thousands))
  }
  if (remainder > 0) {
    parts.push(underThousand(remainder, false))
  }

  return parts.join(' ')
}

export function normalizeRussian(str) {
  return str
    .toLowerCase()
    .replace(/\u0451/g, '\u0435')
    .replace(/\s+/g, ' ')
    .trim()
}
