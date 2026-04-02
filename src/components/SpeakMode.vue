<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { numberToRussian, normalizeRussian } from '../utils/russianNumbers'
import TextInputFallback from './TextInputFallback.vue'

const store = useGameStore()

const feedback = ref(null)
const lastAnswer = ref('')
const listening = ref(false)
const interimText = ref('')
const speechStatus = ref('unknown')
const speechError = ref('')

const expectedText = computed(() => numberToRussian(store.currentNumber))

let recognition = null

async function checkSpeechAvailability() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    speechStatus.value = 'unavailable'
    return false
  }

  if (typeof SpeechRecognition.available === 'function') {
    speechStatus.value = 'checking'
    try {
      const result = await SpeechRecognition.available({ langs: ['ru-RU'], processLocally: true })

      if (result === 'available') {
        speechStatus.value = 'available'
        return true
      }

      if (result === 'unavailable') {
        speechStatus.value = 'unavailable'
        return false
      }

      if (result === 'downloading') {
        speechStatus.value = 'installing'
        const installed = await SpeechRecognition.install({
          langs: ['ru-RU'],
          processLocally: true,
        })
        if (installed) {
          speechStatus.value = 'available'
          return true
        }
        speechStatus.value = 'unavailable'
        return false
      }
    } catch {
      speechStatus.value = 'unavailable'
      return false
    }
  }

  speechStatus.value = 'available'
  return true
}

async function startListening() {
  speechError.value = ''

  if (speechStatus.value === 'unknown') {
    const ok = await checkSpeechAvailability()
    if (!ok) return
  }

  if (speechStatus.value === 'unavailable') return
  if (speechStatus.value === 'checking' || speechStatus.value === 'installing') return

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) return

  recognition = new SpeechRecognition()
  recognition.lang = 'ru-RU'
  recognition.continuous = false
  recognition.interimResults = true

  recognition.onstart = () => {
    listening.value = true
    interimText.value = ''
  }

  recognition.onresult = (event) => {
    let interim = ''
    let final = ''
    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        final += transcript
      } else {
        interim += transcript
      }
    }
    interimText.value = interim
    if (final) {
      checkAnswer(final.trim())
    }
  }

  recognition.onend = () => {
    listening.value = false
  }

  recognition.onerror = (event) => {
    listening.value = false
    if (event.error === 'not-allowed') {
      speechError.value = 'Microphone access denied. Please allow microphone access.'
    } else if (event.error === 'no-speech') {
      speechError.value = 'No speech detected. Please try again.'
    } else if (event.error === 'network') {
      speechError.value = 'Network error. Please check your connection.'
    } else {
      speechError.value = 'Speech recognition error. Please try typing your answer.'
    }
  }

  recognition.start()
}

function checkAnswer(text) {
  lastAnswer.value = text
  const normalized = normalizeRussian(text)
  const expected = normalizeRussian(expectedText.value)
  if (normalized === expected) {
    feedback.value = 'correct'
    store.submitAnswer(store.currentNumber)
    setTimeout(() => {
      feedback.value = null
      lastAnswer.value = ''
      interimText.value = ''
      store.generateNumber()
    }, 1500)
  } else {
    feedback.value = 'incorrect'
    store.submitAnswer(-1)
  }
}

function handleFallbackSubmit(text) {
  checkAnswer(text)
}

function handleSkip() {
  lastAnswer.value = ''
  feedback.value = 'incorrect'
  store.skip()
}

function nextGuess() {
  feedback.value = null
  lastAnswer.value = ''
  interimText.value = ''
  store.generateNumber()
}

function stopListening() {
  if (recognition) {
    recognition.stop()
    listening.value = false
  }
}

defineExpose({ stopListening })
</script>

<template>
  <div class="speak-mode">
    <div class="number-display">{{ store.currentNumber }}</div>

    <div v-if="feedback === 'correct'" class="feedback correct">Correct!</div>

    <div v-if="feedback === 'incorrect'" class="feedback incorrect">
      <div class="comparison">
        <div class="comparison-row">
          <span class="comparison-label">Your answer:</span>
          <span class="comparison-value">{{ lastAnswer || '(skipped)' }}</span>
        </div>
        <div class="comparison-row">
          <span class="comparison-label">Correct:</span>
          <span class="comparison-value">{{ expectedText }}</span>
        </div>
      </div>
      <button class="next-btn" @click="nextGuess">Next &rarr;</button>
    </div>

    <div v-if="!feedback" class="listening-area">
      <p class="instruction">Say the number in Russian</p>
      <p v-if="interimText" class="interim">{{ interimText }}</p>
      <button
        class="listen-btn"
        :disabled="
          listening ||
          speechStatus === 'checking' ||
          speechStatus === 'installing' ||
          speechStatus === 'unavailable'
        "
        @click="startListening"
      >
        <template v-if="speechStatus === 'checking'">Checking speech support...</template>
        <template v-else-if="speechStatus === 'installing'"
          >Downloading Russian language pack...</template
        >
        <template v-else-if="speechStatus === 'unavailable'"
          >Speech recognition unavailable</template
        >
        <template v-else>{{ listening ? 'Listening...' : 'Start Listening' }}</template>
      </button>
      <p v-if="speechError" class="speech-error">{{ speechError }}</p>
    </div>

    <button v-if="!feedback" class="skip-btn" @click="handleSkip">Skip / Show Answer</button>

    <TextInputFallback v-if="!feedback" @submit="handleFallbackSubmit" />
  </div>
</template>

<style scoped>
.speak-mode {
  text-align: center;
  padding: 2rem 1rem;
}

.number-display {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.feedback {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.feedback.correct {
  background: #d4edda;
  color: #155724;
}

.feedback.incorrect {
  background: #f8d7da;
  color: #721c24;
}

.comparison {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.comparison-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comparison-label {
  font-weight: 500;
  color: #555;
}

.comparison-value {
  font-weight: bold;
  font-size: 1.3rem;
}

.next-btn {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #4a90d9;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.next-btn:hover {
  background: #3a7bc8;
}

.listening-area {
  margin-bottom: 1rem;
}

.instruction {
  color: #666;
  margin-bottom: 0.5rem;
}

.interim {
  color: #999;
  font-style: italic;
  min-height: 1.5rem;
}

.listen-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #4a90d9;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.listen-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.skip-btn {
  display: block;
  margin: 0.5rem auto 1rem;
  background: none;
  border: none;
  color: #888;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
}

.speech-error {
  color: #c0392b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>
