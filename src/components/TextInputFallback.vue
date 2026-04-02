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
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.submit-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #27ae60;
  color: #fff;
  cursor: pointer;
}
</style>
