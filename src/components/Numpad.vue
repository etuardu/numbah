<script setup>
import { ref } from 'vue'

defineOptions({ name: 'NumpadInput' })

const emit = defineEmits(['submit'])

const display = ref('')

function pressDigit(d) {
  display.value += d
}

function clearDigit() {
  display.value = display.value.slice(0, -1)
}

function handleSubmit() {
  if (display.value.length > 0) {
    emit('submit', parseInt(display.value, 10))
    display.value = ''
  }
}

function reset() {
  display.value = ''
}

defineExpose({ reset })
</script>

<template>
  <div class="numpad">
    <div data-testid="display" class="display">{{ display || '' }}</div>
    <div class="grid">
      <button
        v-for="d in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]"
        :key="d"
        :data-testid="`digit-${d}`"
        class="digit-btn"
        @click="pressDigit(d)"
      >
        {{ d }}
      </button>
      <button data-testid="clear-btn" class="action-btn" @click="clearDigit">Clear</button>
      <button data-testid="submit-btn" class="submit-btn" @click="handleSubmit">Submit</button>
    </div>
  </div>
</template>

<style scoped>
.numpad {
  max-width: 280px;
  margin: 0 auto;
}

.display {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  padding: 1rem;
  min-height: 3.5rem;
  border: 2px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.digit-btn {
  padding: 1rem;
  font-size: 1.25rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}

.digit-btn:active {
  background: #eee;
}

.action-btn,
.submit-btn {
  padding: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}

.action-btn {
  background: #eee;
}

.submit-btn {
  background: #4a90d9;
  color: #fff;
}

.submit-btn:active {
  background: #3a7bc8;
}
</style>
