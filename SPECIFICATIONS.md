# Russian Numbers Trainer — Development Specifications

## 1. Overview

A single-page Vue 3 webapp that helps users practice recognizing and producing Russian number words. Two modes: **Speak** (see number → say it aloud) and **Numpad** (hear/see number → type it). Infinite practice until the user ends the session. Incorrect answers are tracked as "weak numbers" for targeted review.

---

## 2. Configuration Screen (Start)

Displayed on app load before any game begins.

### Controls

- **Range selector**
  - Preset buttons: `10`, `20`, `50`, `100`, `1000`
  - Custom numeric input (min: 1, max: 999999)
  - Selected preset highlighted; custom input overrides preset
- **Weak Numbers preset**: `Weak (N)` button
  - Shows count of stored weak numbers
  - Disabled when count is 0
  - When selected, game draws only from the weak numbers set
- **Mode selector**
  - Toggle or radio: **Speak Mode** | **Numpad Mode**
- **Manage Weak Numbers** button — opens modal
- **Start button** — transitions to game screen

### State

- `range: number` (default: 10)
- `mode: 'speak' | 'numpad'` (default: 'speak')
- `useWeakNumbers: boolean` (default: false)

---

## 3. Speak Mode

### Flow

1. App generates a random number from the active pool (`[0, range]` or weak set)
2. Displays the number in **numeric form** (e.g., `42`)
3. User speaks the Russian word aloud
4. Web Speech API (`SpeechRecognition`) listens and transcribes
5. Transcription is compared against the correct Russian spelling
6. Feedback shown: correct / incorrect + correct answer
7. Score updated, short delay (~1.5s), next number auto-generated

### Speech Recognition

- Uses `window.SpeechRecognition` or `window.webkitSpeechRecognition`
- Language set to `ru-RU`
- `continuous: false`, `interimResults: true` (for live feedback)
- If API unavailable or fails: show text input fallback as primary input

### Text Input Fallback

- Always visible as a secondary option (small text field below the number)
- User can type the Russian word and press Enter to submit
- If speech API fails entirely, the text input becomes the primary input

### Skip / Show Answer

- **Skip button**: reveals the correct Russian word, counts as incorrect, moves to next number
- Available at all times during the listening phase

---

## 4. Numpad Mode

### Flow

1. App generates a random number from the active pool
2. Displays the number in **textual Russian form** (e.g., `сорок два`)
3. Plays TTS audio of the number via **11Labs API** (voice: Russian-capable)
4. User sees an on-screen **numpad** (digits 0–9, Clear, Submit)
5. User types the numeric answer and presses Submit (or Enter)
6. Feedback shown: correct / incorrect + correct numeric answer
7. Score updated, short delay (~1.5s), next number auto-generated

### Numpad Component

- Grid layout: 3x4 grid (1-9, 0, Clear, Submit)
- Display area above numpad showing typed digits
- Backspace functionality (Clear removes last digit; double-tap clears all)
- Keyboard support: physical numpad and number keys also work

### TTS (11Labs)

- API key stored in `import.meta.env.VITE_11LABS_API_KEY`
- Lazy-load audio per question
- Fallback: if API fails or key missing, skip audio (text still displayed)
- Re-play button to hear the number again

---

## 5. Game Screen (Shared)

### Header

- **Back button** - returns to configuration screen
- **Score display**: `correct: X  incorrect: Y  streak: Z`
- **End Game button** - shows summary modal

### Summary Modal (on End Game)

- Total correct / incorrect
- Accuracy percentage
- Best streak
- **Play Again** button - returns to config with same settings
- **Change Settings** button - returns to config screen

---

## 6. Weak Numbers

### Concept

Numbers the user answered incorrectly are collected into a "weak numbers" set, persisted via `localStorage`. This set can be used as a dedicated training pool.

### Configuration Screen Integration

- **Preset button**: `Weak (N)` where N = count of weak numbers
  - Disabled if set is empty
  - When selected, game draws only from the weak set
- **"Manage Weak Numbers"** button opens modal

### Weak Numbers Modal

- Title: "Weak Numbers"
- Scrollable list, each row showing:
  - Numeric form (e.g., `42`)
  - Russian text (e.g., `сорок два`)
  - Delete button to remove that number
- **Clear All** button — removes every number after confirmation
- **Close** button
- Numbers displayed in ascending order

### Persistence

- Stored in `localStorage` under key `numbah_weak_numbers` as JSON array: `[7, 42, 100]`
- Loaded into Pinia store on app init
- Synced back to `localStorage` on every add/delete

### Pinia Store Additions

```js
// State
const weakNumbers = ref([])

// Actions
function addWeakNumber(n) {
  if (!weakNumbers.value.includes(n)) {
    weakNumbers.value.push(n)
    weakNumbers.value.sort((a, b) => a - b)
    persistWeakNumbers()
  }
}

function removeWeakNumber(n) {
  weakNumbers.value = weakNumbers.value.filter((x) => x !== n)
  persistWeakNumbers()
}

function clearWeakNumbers() {
  weakNumbers.value = []
  persistWeakNumbers()
}

function loadWeakNumbers() {
  const stored = localStorage.getItem('numbah_weak_numbers')
  if (stored) weakNumbers.value = JSON.parse(stored)
}

function persistWeakNumbers() {
  localStorage.setItem('numbah_weak_numbers', JSON.stringify(weakNumbers.value))
}

// Computed
const hasWeakNumbers = computed(() => weakNumbers.value.length > 0)
```

### When Numbers Are Added

- On every incorrect guess in either mode, the current number is added to the weak set (deduplicated)
- Numbers are **never** auto-removed on correct guesses — manual deletion only

---

## 7. Russian Number Words — Data

### Source

A utility module `src/utils/russianNumbers.js` exports:

- `numberToRussian(n: number): string` — converts 0-999999 to Russian text
- `normalizeRussian(str: string): string` — normalizes for comparison

### Coverage

- 0-19: ноль, один, два, ..., девятнадцать
- Tens: двадцать, тридцать, ..., девяносто
- Hundreds: сто, двести, ..., девятьсот
- Thousands: тысяча, две тысячи, ... (up to 999999)

### Comparison Logic

- Normalize both expected and user input before comparing
- Handle common variants: ё/e, extra spaces, case-insensitive

---

## 8. Architecture

```
src/
├── App.vue
├── main.js
├── router/
│   └── index.js
├── stores/
│   └── gameStore.js
├── utils/
│   └── russianNumbers.js
├── components/
│   ├── ConfigScreen.vue
│   ├── GameHeader.vue
│   ├── SpeakMode.vue
│   ├── NumpadMode.vue
│   ├── Numpad.vue
│   ├── TextInputFallback.vue
│   ├── SummaryModal.vue
│   └── WeakNumbersModal.vue
├── __tests__/
│   ├── russianNumbers.spec.js
│   ├── gameStore.spec.js
│   ├── SpeakMode.spec.js
│   ├── NumpadMode.spec.js
│   └── WeakNumbersModal.spec.js
└── assets/
```

### Pinia Store (`gameStore.js`)

```js
export const useGameStore = defineStore('game', () => {
  // Settings
  const range = ref(10)
  const mode = ref('speak')
  const useWeakNumbers = ref(false)

  // Game state
  const currentNumber = ref(0)
  const correct = ref(0)
  const incorrect = ref(0)
  const streak = ref(0)
  const bestStreak = ref(0)
  const isPlaying = ref(false)

  // Weak numbers
  const weakNumbers = ref([])

  // Actions
  function startGame(newRange, newMode, newUseWeak) { ... }
  function generateNumber() { ... }
  function submitAnswer(userAnswer) { ... }
  function skip() { ... }
  function endGame() { ... }
  function reset() { ... }

  // Weak numbers actions
  function addWeakNumber(n) { ... }
  function removeWeakNumber(n) { ... }
  function clearWeakNumbers() { ... }
  function loadWeakNumbers() { ... }

  // Computed
  const accuracy = computed(() => ...)
  const totalAttempts = computed(() => ...)
  const hasWeakNumbers = computed(() => weakNumbers.value.length > 0)

  return { ... }
})
```

---

## 9. Environment Variables

```
VITE_11LABS_API_KEY=sk_xxxxxxxx
```

---

## 10. Edge Cases & Error Handling

| Scenario                                | Handling                                                           |
| --------------------------------------- | ------------------------------------------------------------------ |
| Speech API unavailable                  | Show text input as primary; display notice                         |
| Speech API permission denied            | Show text input; prompt user to allow mic                          |
| 11Labs API fails / no key               | Skip audio in Numpad mode; text still shown                        |
| User enters empty answer                | Ignore submission, no penalty                                      |
| Network error during TTS                | Retry once, then show replay button disabled                       |
| Range set to 0                          | Treat as range 1 (numbers 0-1)                                     |
| Weak set empty mid-game                 | Show notice, return to config                                      |
| localStorage unavailable (private mode) | Graceful fallback: weak numbers work in-session only, show warning |
| Duplicate number added to weak set      | Deduplicated - no-op if already present                            |

---

## 11. Testing Strategy

- **Unit tests**: `russianNumbers.js` — cover 0, boundary values (10, 20, 100, 1000, 999999), and random samples
- **Unit tests**: `gameStore.js` — addWeakNumber (dedup), removeWeakNumber, clearWeakNumbers, loadWeakNumbers, score tracking
- **Component tests**: `SpeakMode` and `NumpadMode` — mount with mock store, simulate interactions, verify score updates
- **Component tests**: `WeakNumbersModal` — renders list, delete single, clear all, empty state
- **Integration**: test full game flow from config to game to end to summary

---

## 12. Implementation Order

1. `russianNumbers.js` utility + tests
2. `gameStore.js` Pinia store (including weak numbers logic)
3. `ConfigScreen.vue` (including weak numbers preset)
4. `WeakNumbersModal.vue`
5. `GameHeader.vue` + `SummaryModal.vue`
6. `SpeakMode.vue` + `TextInputFallback.vue`
7. `Numpad.vue` + `NumpadMode.vue`
8. Router wiring + `App.vue` updates
9. TTS integration (11Labs)
10. Polish: animations, keyboard support, responsive design
11. Full test coverage + lint pass
