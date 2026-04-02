<script setup>
import { useGameStore } from '../stores/gameStore'

const emit = defineEmits(['play-again', 'change-settings'])

const store = useGameStore()
</script>

<template>
  <div class="modal-overlay" @click.self="emit('change-settings')">
    <div class="modal">
      <h2>Game Over</h2>
      <div class="stats">
        <div class="stat">
          <span class="stat-value">{{ store.correct }}</span>
          <span class="stat-label">Correct</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ store.incorrect }}</span>
          <span class="stat-label">Incorrect</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ store.accuracy }}%</span>
          <span class="stat-label">Accuracy</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ store.bestStreak }}</span>
          <span class="stat-label">Best Streak</span>
        </div>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="emit('play-again')">Play Again</button>
        <button class="secondary-btn" @click="emit('change-settings')">Change Settings</button>
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
  padding: 2rem;
  text-align: center;
  max-width: 360px;
  width: 90%;
}

.modal h2 {
  margin-bottom: 1.5rem;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.85rem;
  color: #888;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.primary-btn,
.secondary-btn {
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
}

.primary-btn {
  background: #27ae60;
  color: #fff;
}

.secondary-btn {
  background: #eee;
  color: #333;
}
</style>
