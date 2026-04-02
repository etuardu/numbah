<script setup>
import { ref, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'

const emit = defineEmits(['start', 'open-weak-modal'])

const store = useGameStore()

const presets = [10, 20, 50, 100, 1000]

const localRange = ref(store.range)
const selectedPreset = ref(store.range)
const localMode = ref(store.mode)
const localUseWeak = ref(false)

watch(localRange, (val) => {
  if (!presets.includes(val)) {
    selectedPreset.value = null
  }
})

function selectPreset(val) {
  selectedPreset.value = val
  localRange.value = val
  localUseWeak.value = false
}

function selectWeak() {
  localUseWeak.value = true
  selectedPreset.value = 'weak'
}

function handleStart() {
  emit('start', {
    range: localRange.value,
    mode: localMode.value,
    useWeakNumbers: localUseWeak.value,
  })
}
</script>

<template>
  <div class="config-screen">
    <h1>Russian Numbers Trainer</h1>

    <section class="section">
      <h2>Range</h2>
      <div class="presets">
        <button
          v-for="p in presets"
          :key="p"
          :data-testid="`preset-${p}`"
          :class="{ active: selectedPreset === p }"
          class="preset-btn"
          @click="selectPreset(p)"
        >
          {{ p }}
        </button>
        <button
          data-testid="preset-weak"
          :class="{ active: localUseWeak }"
          :disabled="!store.hasWeakNumbers"
          class="preset-btn weak-btn"
          @click="selectWeak"
        >
          Weak ({{ store.weakNumbers.length }})
        </button>
      </div>
      <div class="custom-range">
        <label for="custom-range">Custom</label>
        <input
          id="custom-range"
          v-model.number="localRange"
          type="number"
          min="1"
          max="999999"
          class="range-input"
        />
      </div>
      <button data-testid="manage-weak-btn" class="manage-btn" @click="emit('open-weak-modal')">
        Manage Weak Numbers
      </button>
    </section>

    <section class="section">
      <h2>Mode</h2>
      <div class="mode-toggle">
        <button
          :class="{ active: localMode === 'speak' }"
          class="mode-btn"
          @click="localMode = 'speak'"
        >
          Speak
        </button>
        <button
          :class="{ active: localMode === 'numpad' }"
          class="mode-btn"
          @click="localMode = 'numpad'"
        >
          Numpad
        </button>
      </div>
    </section>

    <button class="start-btn" @click="handleStart">Start</button>
  </div>
</template>

<style scoped>
.config-screen {
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
}

.section {
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.preset-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.15s;
}

.preset-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.preset-btn.active {
  border-color: #4a90d9;
  background: #4a90d9;
  color: #fff;
}

.custom-range {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.range-input {
  width: 100px;
  padding: 0.4rem 0.5rem;
  border: 2px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.manage-btn {
  background: none;
  border: none;
  color: #4a90d9;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
}

.mode-toggle {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.mode-btn {
  padding: 0.5rem 1.5rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.15s;
}

.mode-btn.active {
  border-color: #4a90d9;
  background: #4a90d9;
  color: #fff;
}

.start-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  background: #27ae60;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.15s;
}

.start-btn:hover {
  background: #219a52;
}
</style>
