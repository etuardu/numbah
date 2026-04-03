<script setup>
import { useGameStore } from '../stores/gameStore'

const emit = defineEmits(['back', 'end-game'])

const store = useGameStore()
</script>

<template>
  <header class="game-header">
    <button data-testid="back-btn" class="back-btn" @click="emit('back')">&larr; Back</button>
    <div class="score">
      <span class="score-correct">{{ store.correct }}</span>
      <span class="score-incorrect">{{ store.incorrect }}</span>
      <span class="score-streak">{{ store.streak }}</span>
    </div>
    <button data-testid="end-game-btn" class="end-btn" @click="emit('end-game')">End</button>
  </header>
</template>

<style scoped>
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid #504945;
}

.back-btn,
.end-btn {
  padding: 0.4rem 0.6rem;
  border: 2px solid #665c54;
  border-radius: 0;
  background: #282828;
  color: #ebdbb2;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.65rem;
}

.back-btn:active,
.end-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.score {
  display: flex;
  gap: 0.75rem;
  font-size: 0.7rem;
}

.score-correct {
  color: #b8bb26;
}

.score-incorrect {
  color: #fb4934;
}

.score-streak {
  color: #fabd2f;
}
</style>
