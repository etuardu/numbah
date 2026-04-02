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
  border-bottom: 1px solid #eee;
}

.back-btn,
.end-btn {
  padding: 0.4rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.score {
  display: flex;
  gap: 1rem;
  font-size: 0.95rem;
}

.score-correct {
  color: #27ae60;
}

.score-incorrect {
  color: #c0392b;
}

.score-streak {
  color: #f39c12;
}
</style>
