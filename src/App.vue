<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import ConfigScreen from './components/ConfigScreen.vue'
import GameHeader from './components/GameHeader.vue'
import SpeakMode from './components/SpeakMode.vue'
import NumpadMode from './components/NumpadMode.vue'
import SummaryModal from './components/SummaryModal.vue'
import WeakNumbersModal from './components/WeakNumbersModal.vue'

const store = useGameStore()

const showSummary = ref(false)
const showWeakModal = ref(false)
const speakModeRef = ref(null)

onMounted(() => {
  store.loadWeakNumbers()
})

function handleStart(settings) {
  store.startGame(settings.range, settings.mode, settings.useWeakNumbers)
  showSummary.value = false
}

function handleBack() {
  store.reset()
  if (speakModeRef.value) {
    speakModeRef.value.stopListening()
  }
}

function handleEndGame() {
  store.endGame()
  showSummary.value = true
}

function handlePlayAgain() {
  store.startGame(store.range, store.mode, store.useWeakNumbers)
  showSummary.value = false
}

function handleChangeSettings() {
  store.reset()
  showSummary.value = false
}

function handleRemoveWeakNumber(n) {
  store.removeWeakNumber(n)
}

function handleClearAllWeak() {
  store.clearWeakNumbers()
}
</script>

<template>
  <div class="app">
    <template v-if="!store.isPlaying">
      <ConfigScreen @start="handleStart" @open-weak-modal="showWeakModal = true" />
    </template>

    <template v-else>
      <GameHeader @back="handleBack" @end-game="handleEndGame" />

      <SpeakMode v-if="store.mode === 'speak'" ref="speakModeRef" />
      <NumpadMode v-else />
    </template>

    <SummaryModal
      v-if="showSummary"
      @play-again="handlePlayAgain"
      @change-settings="handleChangeSettings"
    />

    <WeakNumbersModal
      v-if="showWeakModal"
      @close="showWeakModal = false"
      @remove-weak-number="handleRemoveWeakNumber"
      @clear-all="handleClearAllWeak"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  background: #f5f5f5;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  background: #fff;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}
</style>
