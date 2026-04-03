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
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #fabd2f;
}

.feedback {
  padding: 1rem;
  border-radius: 0;
  margin-bottom: 1rem;
  font-size: 0.55rem;
  line-height: 1.8;
}

.feedback.correct {
  background: #282828;
  border: 2px solid #b8bb26;
  color: #b8bb26;
}

.feedback.incorrect {
  background: #282828;
  border: 2px solid #fb4934;
  color: #fb4934;
}

.comparison {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.55rem;
}

.comparison-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comparison-label {
  font-weight: 400;
  color: #928374;
}

.comparison-value {
  font-weight: bold;
  font-size: 0.65rem;
}

.audio-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.audio-btn {
  padding: 0.4rem 0.6rem;
  border: 2px solid #665c54;
  border-radius: 0;
  background: #282828;
  color: #ebdbb2;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.45rem;
}

.audio-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.audio-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.next-btn {
  padding: 0.6rem 1.25rem;
  border: 2px solid #83a598;
  border-radius: 0;
  background: #83a598;
  color: #1d2021;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.55rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.next-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.listening-area {
  margin-bottom: 1rem;
}

.instruction {
  color: #928374;
  margin-bottom: 0.5rem;
  font-size: 0.55rem;
}

.interim {
  color: #665c54;
  font-style: italic;
  min-height: 1.5rem;
  font-size: 0.5rem;
}

.listen-btn {
  padding: 0.75rem 1.25rem;
  border: 2px solid #83a598;
  border-radius: 0;
  background: #83a598;
  color: #1d2021;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.55rem;
  cursor: pointer;
}

.listen-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.listen-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.skip-btn {
  display: block;
  margin: 0.5rem auto 1rem;
  background: none;
  border: none;
  color: #928374;
  text-decoration: underline;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.5rem;
}
</style>
