<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { numberToRussian, normalizeRussian } from '../utils/russianNumbers'
import TextInputFallback from './TextInputFallback.vue'

const store = useGameStore()

const feedback = ref(null)
const listening = ref(false)
const interimText = ref('')

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

function checkAnswer(text) {
  const normalized = normalizeRussian(text)
  const expected = normalizeRussian(expectedText.value)
  if (normalized === expected) {
    feedback.value = 'correct'
    store.submitAnswer(store.currentNumber)
  } else {
    feedback.value = 'incorrect'
    store.submitAnswer(-1)
  }
  setTimeout(() => {
    feedback.value = null
    interimText.value = ''
    store.generateNumber()
  }, 1500)
}

function handleFallbackSubmit(text) {
  checkAnswer(text)
}

function handleSkip() {
  feedback.value = 'incorrect'
  store.skip()
  setTimeout(() => {
    feedback.value = null
    store.generateNumber()
  }, 1500)
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
    <div v-else-if="feedback === 'incorrect'" class="feedback incorrect">
      Incorrect! The answer is: {{ expectedText }}
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
