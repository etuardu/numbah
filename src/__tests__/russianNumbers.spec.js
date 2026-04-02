import { describe, it, expect } from 'vitest'
import { numberToRussian, normalizeRussian } from '../utils/russianNumbers'

describe('numberToRussian', () => {
  describe('single digits', () => {
    const cases = [
      [0, 'ноль'],
      [1, 'один'],
      [2, 'два'],
      [3, 'три'],
      [4, 'четыре'],
      [5, 'пять'],
      [6, 'шесть'],
      [7, 'семь'],
      [8, 'восемь'],
      [9, 'девять'],
    ]
    it.each(cases)('%d -> %s', (num, expected) => {
      expect(numberToRussian(num)).toBe(expected)
    })
  })

  describe('teens (10-19)', () => {
    const cases = [
      [10, 'десять'],
      [11, 'одиннадцать'],
      [12, 'двенадцать'],
      [13, 'тринадцать'],
      [14, 'четырнадцать'],
      [15, 'пятнадцать'],
      [16, 'шестнадцать'],
      [17, 'семнадцать'],
      [18, 'восемнадцать'],
      [19, 'девятнадцать'],
    ]
    it.each(cases)('%d -> %s', (num, expected) => {
      expect(numberToRussian(num)).toBe(expected)
    })
  })

  describe('tens', () => {
    const cases = [
      [20, 'двадцать'],
      [30, 'тридцать'],
      [40, 'сорок'],
      [50, 'пятьдесят'],
      [60, 'шестьдесят'],
      [70, 'семьдесят'],
      [80, 'восемьдесят'],
      [90, 'девяносто'],
    ]
    it.each(cases)('%d -> %s', (num, expected) => {
      expect(numberToRussian(num)).toBe(expected)
    })
  })

  describe('compound numbers (21-99)', () => {
    const cases = [
      [21, 'двадцать один'],
      [22, 'двадцать два'],
      [42, 'сорок два'],
      [55, 'пятьдесят пять'],
      [99, 'девяносто девять'],
    ]
    it.each(cases)('%d -> %s', (num, expected) => {
      expect(numberToRussian(num)).toBe(expected)
    })
  })

  describe('hundreds', () => {
    const cases = [
      [100, 'сто'],
      [200, 'двести'],
      [300, 'триста'],
      [400, 'четыреста'],
      [500, 'пятьсот'],
      [600, 'шестьсот'],
      [700, 'семьсот'],
      [800, 'восемьсот'],
      [900, 'девятьсот'],
    ]
    it.each(cases)('%d -> %s', (num, expected) => {
      expect(numberToRussian(num)).toBe(expected)
    })
  })

  describe('compound hundreds', () => {
    const cases = [
      [101, 'сто один'],
      [120, 'сто двадцать'],
      [256, 'двести пятьдесят шесть'],
      [999, 'девятьсот девяносто девять'],
    ]
    it.each(cases)('%d -> %s', (num, expected) => {
      expect(numberToRussian(num)).toBe(expected)
    })
  })

  describe('thousands', () => {
    const cases = [
      [1000, 'одна тысяча'],
      [2000, 'две тысячи'],
      [5000, 'пять тысяч'],
      [11000, 'одиннадцать тысяч'],
      [21000, 'двадцать одна тысяча'],
      [100000, 'сто тысяч'],
      [999999, 'девятьсот девяносто девять тысяч девятьсот девяносто девять'],
    ]
    it.each(cases)('%d -> %s', (num, expected) => {
      expect(numberToRussian(num)).toBe(expected)
    })
  })
})

describe('normalizeRussian', () => {
  it('lowercases input', () => {
    expect(normalizeRussian('ДваДцать ОдиН')).toBe('двадцать один')
  })

  it('trims whitespace', () => {
    expect(normalizeRussian('  двадцать один  ')).toBe('двадцать один')
  })

  it('collapses multiple spaces', () => {
    expect(normalizeRussian('двадцать    один')).toBe('двадцать один')
  })

  it('replaces ё with е', () => {
    expect(normalizeRussian('шёст')).toBe('шест')
  })

  it('handles combined variants', () => {
    expect(normalizeRussian('  ДЁВЯНОСТО   ДЁВЯТЬ  ')).toBe('девяносто девять')
  })
})
