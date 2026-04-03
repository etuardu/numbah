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
  padding: 1.5rem;
  text-align: center;
  max-width: 360px;
  width: 90%;
}

.modal h2 {
  margin-bottom: 1.5rem;
  font-size: 0.7rem;
  color: #fabd2f;
  line-height: 1.6;
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
  font-size: 0.8rem;
  font-weight: bold;
  color: #fabd2f;
}

.stat-label {
  font-size: 0.45rem;
  color: #928374;
  margin-top: 0.25rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.primary-btn,
.secondary-btn {
  padding: 0.75rem;
  border-radius: 0;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.55rem;
  cursor: pointer;
  border: 2px solid;
}

.primary-btn {
  background: #b8bb26;
  color: #1d2021;
  border-color: #b8bb26;
}

.primary-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.secondary-btn {
  background: #504945;
  color: #ebdbb2;
  border-color: #665c54;
}

.secondary-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
</style>
