<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { numberToRussian, normalizeRussian } from '../utils/russianNumbers'
import { speakRussian } from '../utils/tts'
import TextInputFallback from './TextInputFallback.vue'

const store = useGameStore()

const feedback = ref(null)
const lastAnswer = ref('')
const listening = ref(false)
const interimText = ref('')
const userAudioLoading = ref(false)
const correctAudioLoading = ref(false)

const expectedText = computed(() => numberToRussian(store.currentNumber))

let recognition = null

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    listening.value = false
    return
  }

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

  recognition.onerror = () => {
    listening.value = false
  }

  recognition.start()
}

async function checkAnswer(text) {
  lastAnswer.value = text

  const numericInput = parseInt(text.replace(/\s/g, ''), 10)
  if (!isNaN(numericInput) && numericInput === store.currentNumber) {
    feedback.value = 'correct'
    store.submitAnswer(store.currentNumber)
    setTimeout(() => {
      feedback.value = null
      lastAnswer.value = ''
      interimText.value = ''
      store.generateNumber()
    }, 1500)
    return
  }

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

async function playUserAudio() {
  if (!lastAnswer.value) return
  userAudioLoading.value = true
  const url = await speakRussian(lastAnswer.value)
  userAudioLoading.value = false
  if (url) {
    const audio = new Audio(url)
    audio.onended = () => URL.revokeObjectURL(url)
    audio.play()
  }
}

async function playCorrectAudio() {
  correctAudioLoading.value = true
  const url = await speakRussian(expectedText.value)
  correctAudioLoading.value = false
  if (url) {
    const audio = new Audio(url)
    audio.onended = () => URL.revokeObjectURL(url)
    audio.play()
  }
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
      <div class="audio-buttons">
        <button
          class="audio-btn"
          :disabled="!lastAnswer || userAudioLoading"
          @click="playUserAudio"
        >
          {{ userAudioLoading ? '🔊 Loading...' : '🔊 Your answer' }}
        </button>
        <button class="audio-btn" :disabled="correctAudioLoading" @click="playCorrectAudio">
          {{ correctAudioLoading ? '🔊 Loading...' : '🔊 Correct answer' }}
        </button>
      </div>
      <button class="next-btn" @click="nextGuess">Next &rarr;</button>
    </div>

    <div v-if="!feedback" class="listening-area">
      <p class="instruction">Say the number in Russian</p>
      <p v-if="interimText" class="interim">{{ interimText }}</p>
      <button class="listen-btn" :disabled="listening" @click="startListening">
        {{ listening ? 'Listening...' : 'Start Listening' }}
      </button>
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

.audio-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.audio-btn {
  padding: 0.4rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.85rem;
}

.audio-btn:hover {
  background: #f0f0f0;
}

.audio-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
</style>
