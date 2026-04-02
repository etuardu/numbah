import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '../stores/gameStore'

describe('gameStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('initial state', () => {
    it('has default settings', () => {
      const store = useGameStore()
      expect(store.range).toBe(10)
      expect(store.mode).toBe('speak')
      expect(store.useWeakNumbers).toBe(false)
    })

    it('has zeroed game state', () => {
      const store = useGameStore()
      expect(store.currentNumber).toBe(0)
      expect(store.correct).toBe(0)
      expect(store.incorrect).toBe(0)
      expect(store.streak).toBe(0)
      expect(store.bestStreak).toBe(0)
      expect(store.isPlaying).toBe(false)
    })

    it('has empty weak numbers', () => {
      const store = useGameStore()
      expect(store.weakNumbers).toEqual([])
      expect(store.hasWeakNumbers).toBe(false)
    })
  })

  describe('startGame', () => {
    it('sets settings and marks playing', () => {
      const store = useGameStore()
      store.startGame(50, 'numpad', false)
      expect(store.range).toBe(50)
      expect(store.mode).toBe('numpad')
      expect(store.useWeakNumbers).toBe(false)
      expect(store.isPlaying).toBe(true)
    })

    it('resets score when starting', () => {
      const store = useGameStore()
      store.correct = 5
      store.incorrect = 3
      store.streak = 2
      store.bestStreak = 10
      store.startGame(20, 'speak', false)
      expect(store.correct).toBe(0)
      expect(store.incorrect).toBe(0)
      expect(store.streak).toBe(0)
      expect(store.bestStreak).toBe(0)
    })

    it('generates a first number', () => {
      const store = useGameStore()
      store.startGame(10, 'speak', false)
      expect(store.currentNumber).toBeGreaterThanOrEqual(0)
      expect(store.currentNumber).toBeLessThanOrEqual(10)
    })
  })

  describe('generateNumber', () => {
    it('generates number within range', () => {
      const store = useGameStore()
      store.range = 5
      store.useWeakNumbers = false
      store.generateNumber()
      expect(store.currentNumber).toBeGreaterThanOrEqual(0)
      expect(store.currentNumber).toBeLessThanOrEqual(5)
    })

    it('generates from weak numbers when enabled', () => {
      const store = useGameStore()
      store.weakNumbers = [7, 42, 100]
      store.useWeakNumbers = true
      store.generateNumber()
      expect([7, 42, 100]).toContain(store.currentNumber)
    })
  })

  describe('submitAnswer', () => {
    it('increments correct count and streak on correct answer', () => {
      const store = useGameStore()
      store.currentNumber = 5
      store.submitAnswer(5)
      expect(store.correct).toBe(1)
      expect(store.streak).toBe(1)
      expect(store.bestStreak).toBe(1)
      expect(store.incorrect).toBe(0)
    })

    it('increments incorrect count and resets streak on wrong answer', () => {
      const store = useGameStore()
      store.currentNumber = 5
      store.submitAnswer(3)
      expect(store.incorrect).toBe(1)
      expect(store.streak).toBe(0)
      expect(store.correct).toBe(0)
    })

    it('adds wrong number to weak numbers', () => {
      const store = useGameStore()
      store.currentNumber = 42
      store.submitAnswer(7)
      expect(store.weakNumbers).toContain(42)
    })

    it('deduplicates weak numbers', () => {
      const store = useGameStore()
      store.currentNumber = 42
      store.submitAnswer(7)
      store.currentNumber = 42
      store.submitAnswer(7)
      expect(store.weakNumbers.filter((n) => n === 42).length).toBe(1)
    })

    it('keeps weak numbers sorted', () => {
      const store = useGameStore()
      store.currentNumber = 100
      store.submitAnswer(0)
      store.currentNumber = 7
      store.submitAnswer(0)
      store.currentNumber = 42
      store.submitAnswer(0)
      expect(store.weakNumbers).toEqual([7, 42, 100])
    })

    it('updates bestStreak', () => {
      const store = useGameStore()
      store.currentNumber = 1
      store.submitAnswer(1)
      store.currentNumber = 2
      store.submitAnswer(2)
      store.currentNumber = 3
      store.submitAnswer(3)
      expect(store.bestStreak).toBe(3)
    })
  })

  describe('skip', () => {
    it('counts as incorrect and adds to weak numbers', () => {
      const store = useGameStore()
      store.currentNumber = 15
      store.skip()
      expect(store.incorrect).toBe(1)
      expect(store.streak).toBe(0)
      expect(store.weakNumbers).toContain(15)
    })
  })

  describe('endGame', () => {
    it('sets isPlaying to false', () => {
      const store = useGameStore()
      store.isPlaying = true
      store.endGame()
      expect(store.isPlaying).toBe(false)
    })
  })

  describe('reset', () => {
    it('resets all game state', () => {
      const store = useGameStore()
      store.correct = 5
      store.incorrect = 3
      store.streak = 2
      store.bestStreak = 10
      store.currentNumber = 42
      store.isPlaying = true
      store.reset()
      expect(store.correct).toBe(0)
      expect(store.incorrect).toBe(0)
      expect(store.streak).toBe(0)
      expect(store.bestStreak).toBe(0)
      expect(store.currentNumber).toBe(0)
      expect(store.isPlaying).toBe(false)
    })
  })

  describe('weak numbers persistence', () => {
    it('loads weak numbers from localStorage on init', () => {
      localStorage.setItem('numbah_weak_numbers', JSON.stringify([7, 42]))
      const store = useGameStore()
      store.loadWeakNumbers()
      expect(store.weakNumbers).toEqual([7, 42])
      expect(store.hasWeakNumbers).toBe(true)
    })

    it('removes a weak number', () => {
      const store = useGameStore()
      store.weakNumbers = [7, 42, 100]
      store.removeWeakNumber(42)
      expect(store.weakNumbers).toEqual([7, 100])
    })

    it('clears all weak numbers', () => {
      const store = useGameStore()
      store.weakNumbers = [7, 42, 100]
      store.clearWeakNumbers()
      expect(store.weakNumbers).toEqual([])
      expect(store.hasWeakNumbers).toBe(false)
    })

    it('persists weak numbers to localStorage', () => {
      const store = useGameStore()
      store.addWeakNumber(42)
      const stored = JSON.parse(localStorage.getItem('numbah_weak_numbers'))
      expect(stored).toEqual([42])
    })
  })

  describe('computed values', () => {
    it('calculates accuracy', () => {
      const store = useGameStore()
      store.correct = 3
      store.incorrect = 1
      expect(store.accuracy).toBe(75)
    })

    it('returns 0 accuracy when no attempts', () => {
      const store = useGameStore()
      expect(store.accuracy).toBe(0)
    })

    it('calculates totalAttempts', () => {
      const store = useGameStore()
      store.correct = 3
      store.incorrect = 2
      expect(store.totalAttempts).toBe(5)
    })
  })
})
