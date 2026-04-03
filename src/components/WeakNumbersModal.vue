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
  background: rgba(29, 32, 33, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #282828;
  border: 3px solid #665c54;
  border-radius: 0;
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
  border-bottom: 2px solid #504945;
}

.modal-header h2 {
  margin: 0;
  font-size: 0.85rem;
  color: #fabd2f;
  line-height: 1.6;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
  color: #928374;
}

.modal-body {
  padding: 1rem 1.25rem;
  overflow-y: auto;
  flex: 1;
}

.empty-state {
  text-align: center;
  color: #928374;
  padding: 2rem 0;
  font-size: 0.65rem;
  line-height: 1.8;
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
  border-bottom: 1px solid #504945;
  font-size: 0.65rem;
}

.weak-num {
  font-weight: bold;
  min-width: 3rem;
  color: #fabd2f;
}

.weak-text {
  flex: 1;
  color: #928374;
}

.delete-btn {
  background: none;
  border: none;
  color: #fb4934;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-footer {
  padding: 1rem 1.25rem;
  border-top: 2px solid #504945;
  text-align: center;
}

.clear-all-btn {
  padding: 0.5rem 1.5rem;
  border: 2px solid #fb4934;
  border-radius: 0;
  background: #282828;
  color: #fb4934;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.65rem;
}

.clear-all-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
  background: #fb4934;
  color: #1d2021;
}
</style>
