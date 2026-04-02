<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { numberToRussian } from '../utils/russianNumbers'

const emit = defineEmits(['close', 'remove-weak-number', 'clear-all'])

const store = useGameStore()

const sortedWeakNumbers = computed(() => store.weakNumbers.slice().sort((a, b) => a - b))
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>Weak Numbers</h2>
        <button data-testid="close-modal" class="close-btn" @click="emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <p v-if="sortedWeakNumbers.length === 0" class="empty-state">
          No weak numbers yet. Incorrect answers will appear here.
        </p>
        <ul v-else class="weak-list">
          <li v-for="n in sortedWeakNumbers" :key="n" class="weak-item">
            <span class="weak-num">{{ n }}</span>
            <span class="weak-text">{{ numberToRussian(n) }}</span>
            <button
              data-testid="delete-weak"
              class="delete-btn"
              @click="emit('remove-weak-number', n)"
            >
              &times;
            </button>
          </li>
        </ul>
      </div>

      <div class="modal-footer">
        <button
          v-if="sortedWeakNumbers.length > 0"
          data-testid="clear-all"
          class="clear-all-btn"
          @click="emit('clear-all')"
        >
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
}

.modal-body {
  padding: 1rem 1.25rem;
  overflow-y: auto;
  flex: 1;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 2rem 0;
}

.weak-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.weak-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.weak-num {
  font-weight: bold;
  min-width: 3rem;
}

.weak-text {
  flex: 1;
  color: #555;
}

.delete-btn {
  background: none;
  border: none;
  color: #c0392b;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #eee;
  text-align: center;
}

.clear-all-btn {
  padding: 0.5rem 1.5rem;
  border: 2px solid #c0392b;
  border-radius: 6px;
  background: #fff;
  color: #c0392b;
  cursor: pointer;
  font-size: 0.9rem;
}

.clear-all-btn:hover {
  background: #c0392b;
  color: #fff;
}
</style>
