<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { numberToRussian } from '../utils/russianNumbers'
import { speakRussian } from '../utils/tts'
import Numpad from './Numpad.vue'

const store = useGameStore()
const numpadRef = ref(null)

const feedback = ref(null)
const audioUrl = ref(null)
const audioEl = ref(null)

const expectedText = computed(() => numberToRussian(store.currentNumber))

watch(
  () => store.currentNumber,
  async (num) => {
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
      audioUrl.value = null
    }
    const url = await speakRussian(numberToRussian(num))
    audioUrl.value = url
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
  if (userAnswer === store.currentNumber) {
    feedback.value = 'correct'
    store.submitAnswer(userAnswer)
  } else {
    feedback.value = 'incorrect'
    store.submitAnswer(userAnswer)
  }
  setTimeout(() => {
    feedback.value = null
    numpadRef.value?.reset()
    store.generateNumber()
  }, 1500)
}
</script>

<template>
  <div class="numpad-mode">
    <div class="text-display">{{ expectedText }}</div>

    <button v-if="audioUrl" class="replay-btn" @click="playAudio">&#128266; Replay</button>

    <audio v-if="audioUrl" ref="audioEl" :src="audioUrl" />

    <div v-if="feedback === 'correct'" class="feedback correct">Correct!</div>
    <div v-else-if="feedback === 'incorrect'" class="feedback incorrect">
      Incorrect! The answer was: {{ store.currentNumber }}
    </div>

    <Numpad v-if="!feedback" ref="numpadRef" @submit="handleSubmit" />
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
