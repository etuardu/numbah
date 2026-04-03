# numbah

A web app for practicing Russian number words. Test your ability to read and recognize numbers in Russian with two game modes: **Speak** (see a number, say it aloud) and **Numpad** (hear a number, type it).

## Features

- **Speak Mode** — A number is displayed in numeric form; use the Web Speech API to speak the Russian word aloud. Instant feedback with correct/incorrect results.
- **Numpad Mode** — A number is displayed in Russian text and spoken via TTS (11Labs API through a server-side PHP proxy); type the numeric answer using an on-screen numpad or keyboard.
- **Weak Numbers** — Incorrect answers are tracked and persisted in `localStorage`. Review your weak numbers or train exclusively on them.
- **Configurable Range** — Choose your practice range from presets (10, 20, 50, 100, 1000) or set a custom value up to 999,999.
- **Score Tracking** — Correct count, incorrect count, current streak, and best streak displayed during gameplay.

## Tech Stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/) — State management
- [Vue Router](https://router.vuejs.org/)
- [Vitest](https://vitest.dev/) — Testing
- [Oxlint](https://oxc.rs/) + [ESLint](https://eslint.org/) — Linting
- [Prettier](https://prettier.io/) — Formatting

## Prerequisites

- Node.js >= 20

## Getting Started

```sh
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command                      | Description                                |
| ---------------------------- | ------------------------------------------ |
| `npm run dev`                | Start dev server with hot reload           |
| `npm run build`              | Build for production                       |
| `npm run preview`            | Preview production build locally           |
| `npm run test:unit`          | Run tests in watch mode                    |
| `npm run test:unit -- --run` | Run tests once (CI mode)                   |
| `npm run lint`               | Run all linters (oxlint + eslint)          |
| `npm run format`             | Format code with Prettier                  |
| `npm run deploy`             | Build and upload to remote server via lftp |

## How to Use

### Configuration Screen

When the app loads, you'll see the configuration screen:

1. **Select a range** — Choose a preset (10, 20, 50, 100, 1000) or enter a custom value (1–999,999).
2. **Choose a mode** — Toggle between **Speak Mode** and **Numpad Mode**.
3. **Weak Numbers** — If you have saved weak numbers, a `Weak (N)` button appears to train only on those. Use **Manage Weak Numbers** to view, delete, or clear them.
4. Press **Start** to begin.

### Speak Mode

- A number is displayed numerically (e.g., `42`).
- Speak the Russian word aloud — the app listens via the Web Speech API (`ru-RU`).
- A text input fallback is always available if speech recognition is unavailable or fails.
- Use **Skip** to reveal the answer and move on.

### Numpad Mode

- A number is displayed in Russian text (e.g., `сорок два`) and spoken aloud via TTS.
- Type the numeric answer using the on-screen numpad or your keyboard.
- Press **Submit** or **Enter** to check your answer.

### Ending a Session

Press **End Game** at any time to see a summary with your score, accuracy, and best streak.

## Deployment

The app is deployed to a PHP-capable host (Altervista) via `lftp`. The build output is mirrored to the remote server:

```sh
npm run deploy
```

### TTS Proxy

Text-to-speech in Numpad Mode is handled by a PHP proxy (`public/api/tts.php`) that forwards requests to the 11Labs API server-side. The 11Labs API key is read from a file on the server — **never exposed in the client**.

When deploying, ensure `public/api/tts.php` and the API key file are present on the remote server.

## Project Structure

```
src/
├── App.vue
├── main.js
├── router/
│   └── index.js
├── stores/
│   └── gameStore.js
├── utils/
│   ├── russianNumbers.js
│   └── tts.js
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
└── assets/
```

## Testing

```sh
npm run test:unit           # Watch mode
npm run test:unit -- --run  # Run once
```

Tests use Vitest with jsdom and `@vue/test-utils`. Test files are named `*.spec.js` and live in `src/__tests__/`.
