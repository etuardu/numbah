<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const text = ref('')

function handleSubmit() {
  if (text.value.trim()) {
    emit('submit', text.value.trim())
    text.value = ''
  }
}
</script>

<template>
  <div class="text-input">
    <input
      v-model="text"
      type="text"
      placeholder="Type the number in Russian..."
      class="input-field"
      @keyup.enter="handleSubmit"
    />
    <button class="submit-btn" @click="handleSubmit">Check</button>
  </div>
</template>

<style scoped>
.text-input {
  display: flex;
  gap: 0.5rem;
  max-width: 320px;
  margin: 0 auto;
}

.input-field {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #665c54;
  border-radius: 0;
  background: #1d2021;
  color: #ebdbb2;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.65rem;
}

.submit-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #b8bb26;
  border-radius: 0;
  background: #b8bb26;
  color: #1d2021;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.65rem;
  cursor: pointer;
}

.submit-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
</style>
