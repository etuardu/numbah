<script setup>
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { numberToRussian } from '../utils/russianNumbers'
import { speakRussian } from '../utils/tts'
import Numpad from './Numpad.vue'

const store = useGameStore()
const numpadRef = ref(null)

const feedback = ref(null)
const lastAnswer = ref(null)
const audioUrl = ref(null)
const audioEl = ref(null)

const expectedText = computed(() => numberToRussian(store.currentNumber))
const targetDigits = computed(() => String(store.currentNumber).length)

watch(
  () => store.currentNumber,
  async (num) => {
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
      audioUrl.value = null
    }
    const url = await speakRussian(numberToRussian(num))
    audioUrl.value = url
    await nextTick()
    playAudio()
  },
  { immediate: true },
)

function playAudio() {
  if (audioEl.value && audioUrl.value) {
    audioEl.value.currentTime = 0
    audioEl.value.play()
  }
}

onBeforeUnmount(() => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
})

function handleSubmit(userAnswer) {
  lastAnswer.value = userAnswer
  if (userAnswer === store.currentNumber) {
    feedback.value = 'correct'
    store.submitAnswer(userAnswer)
    setTimeout(() => {
      feedback.value = null
      lastAnswer.value = null
      numpadRef.value?.reset()
      store.generateNumber()
    }, 1500)
  } else {
    feedback.value = 'incorrect'
    store.submitAnswer(userAnswer)
  }
}

function nextGuess() {
  feedback.value = null
  lastAnswer.value = null
  numpadRef.value?.reset()
  store.generateNumber()
}
</script>

<template>
  <div class="numpad-mode">
    <div class="text-display">{{ expectedText }}</div>

    <button class="replay-btn" @click="playAudio">&#128266;</button>

    <audio v-if="audioUrl" ref="audioEl" :src="audioUrl" />

    <div v-if="feedback === 'correct'" class="feedback correct">Correct!</div>

    <div v-if="feedback === 'incorrect'" class="feedback incorrect">
      <div class="comparison">
        <div class="comparison-row">
          <span class="comparison-label">Your answer:</span>
          <span class="comparison-value">{{ lastAnswer }}</span>
        </div>
        <div class="comparison-row">
          <span class="comparison-label">Correct:</span>
          <span class="comparison-value">{{ store.currentNumber }}</span>
        </div>
      </div>
      <button class="next-btn" @click="nextGuess">Next &rarr;</button>
    </div>

    <Numpad v-if="!feedback" ref="numpadRef" :target-digits="targetDigits" @submit="handleSubmit" />
  </div>
</template>

<style scoped>
.numpad-mode {
  text-align: center;
  padding: 2rem 1rem;
}

.text-display {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  min-height: 3rem;
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

.replay-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
</style>
