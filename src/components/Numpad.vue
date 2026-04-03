<script setup>
import { ref, watch } from 'vue'

defineOptions({ name: 'NumpadInput' })

const props = defineProps({
  targetDigits: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['submit'])

const display = ref('')

watch(
  () => props.targetDigits,
  () => {
    display.value = ''
  },
)

function pressDigit(d) {
  display.value += d
  if (display.value.length === props.targetDigits) {
    emit('submit', parseInt(display.value, 10))
    display.value = ''
  }
}

function clearDigit() {
  display.value = display.value.slice(0, -1)
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
      <button data-testid="clear-btn" class="action-btn clear-wide" @click="clearDigit">
        Clear
      </button>
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
  font-size: 1.2rem;
  font-weight: bold;
  padding: 1rem;
  height: 4.5rem;
  border: 3px solid #665c54;
  border-radius: 0;
  background: #1d2021;
  color: #ebdbb2;
  font-family: 'Press Start 2P', monospace;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.digit-btn {
  padding: 1rem;
  font-size: 0.75rem;
  border: 2px solid #665c54;
  border-radius: 0;
  background: #282828;
  color: #ebdbb2;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
}

.digit-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
  background: #504945;
}

.action-btn {
  padding: 1rem;
  font-size: 0.55rem;
  border-radius: 0;
  cursor: pointer;
  border: 2px solid #665c54;
  background: #504945;
  color: #ebdbb2;
  font-family: 'Press Start 2P', monospace;
}

.action-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.clear-wide {
  grid-column: span 2;
}
</style>
