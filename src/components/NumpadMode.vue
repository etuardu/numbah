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
  font-size: 0.7rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  min-height: 3rem;
  color: #fabd2f;
  line-height: 1.8;
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

.replay-btn {
  padding: 0.5rem 0.75rem;
  border: 2px solid #665c54;
  border-radius: 0;
  background: #282828;
  color: #ebdbb2;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.5rem;
  margin-bottom: 1rem;
}

.replay-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
</style>
