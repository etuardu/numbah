import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const WEAK_NUMBERS_KEY = 'numbah_weak_numbers'

export const useGameStore = defineStore('game', () => {
  const range = ref(10)
  const mode = ref('speak')
  const useWeakNumbers = ref(false)

  const currentNumber = ref(0)
  const correct = ref(0)
  const incorrect = ref(0)
  const streak = ref(0)
  const bestStreak = ref(0)
  const isPlaying = ref(false)

  const weakNumbers = ref([])

  // Auto-load on init
  try {
    const stored = localStorage.getItem(WEAK_NUMBERS_KEY)
    if (stored) weakNumbers.value = JSON.parse(stored)
  } catch {
    // localStorage unavailable
  }

  function persistWeakNumbers() {
    try {
      localStorage.setItem(WEAK_NUMBERS_KEY, JSON.stringify(weakNumbers.value))
    } catch {
      // localStorage unavailable - in-session only
    }
  }

  function loadWeakNumbers() {
    try {
      const stored = localStorage.getItem(WEAK_NUMBERS_KEY)
      if (stored) weakNumbers.value = JSON.parse(stored)
    } catch {
      weakNumbers.value = []
    }
  }

  function addWeakNumber(n) {
    if (!weakNumbers.value.includes(n)) {
      weakNumbers.value.push(n)
      weakNumbers.value.sort((a, b) => a - b)
      persistWeakNumbers()
    }
  }

  function removeWeakNumber(n) {
    weakNumbers.value = weakNumbers.value.filter((x) => x !== n)
    persistWeakNumbers()
  }

  function clearWeakNumbers() {
    weakNumbers.value = []
    persistWeakNumbers()
  }

  function generateNumber() {
    if (useWeakNumbers.value && weakNumbers.value.length > 0) {
      const idx = Math.floor(Math.random() * weakNumbers.value.length)
      currentNumber.value = weakNumbers.value[idx]
    } else {
      currentNumber.value = Math.floor(Math.random() * (range.value + 1))
    }
  }

  function startGame(newRange, newMode, newUseWeak) {
    range.value = newRange
    mode.value = newMode
    useWeakNumbers.value = newUseWeak
    correct.value = 0
    incorrect.value = 0
    streak.value = 0
    bestStreak.value = 0
    isPlaying.value = true
    generateNumber()
  }

  function submitAnswer(userAnswer) {
    if (userAnswer === currentNumber.value) {
      correct.value++
      streak.value++
      if (streak.value > bestStreak.value) {
        bestStreak.value = streak.value
      }
    } else {
      incorrect.value++
      streak.value = 0
      addWeakNumber(currentNumber.value)
    }
  }

  function skip() {
    incorrect.value++
    streak.value = 0
    addWeakNumber(currentNumber.value)
  }

  function endGame() {
    isPlaying.value = false
  }

  function reset() {
    currentNumber.value = 0
    correct.value = 0
    incorrect.value = 0
    streak.value = 0
    bestStreak.value = 0
    isPlaying.value = false
  }

  const accuracy = computed(() => {
    const total = correct.value + incorrect.value
    if (total === 0) return 0
    return Math.round((correct.value / total) * 100)
  })

  const totalAttempts = computed(() => correct.value + incorrect.value)

  const hasWeakNumbers = computed(() => weakNumbers.value.length > 0)

  return {
    range,
    mode,
    useWeakNumbers,
    currentNumber,
    correct,
    incorrect,
    streak,
    bestStreak,
    isPlaying,
    weakNumbers,
    accuracy,
    totalAttempts,
    hasWeakNumbers,
    startGame,
    generateNumber,
    submitAnswer,
    skip,
    endGame,
    reset,
    addWeakNumber,
    removeWeakNumber,
    clearWeakNumbers,
    loadWeakNumbers,
  }
})
