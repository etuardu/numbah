# AGENTS.md - Development Guidelines

## Project Overview

Vue 3 + Vite + Pinia + Vue Router application. Uses `<script setup>` Composition API syntax.

## Build / Lint / Test Commands

```bash
npm run dev                  # Start dev server
npm run build                # Production build via Vite
npm run preview              # Preview production build
npm run lint                 # Run all linters (oxlint + eslint, sequentially via npm-run-all)
npm run lint:oxlint          # Run oxlint with auto-fix
npm run lint:eslint          # Run ESLint with auto-fix and cache
npm run format               # Format src/ with Prettier
npm run test:unit            # Run all Vitest tests (watch mode)
npm run test:unit -- --run   # Run all tests once (CI mode)
```

**Run a single test file:**

```bash
npm run test:unit -- src/__tests__/App.spec.js --run
```

**Run tests matching a pattern:**

```bash
npm run test:unit -- -t "test name" --run
```

## Code Style

### Formatting (Prettier)

- No semicolons
- Single quotes
- Max line length: 100
- 2-space indentation
- LF line endings, final newline, trimmed trailing whitespace

### Imports

- Order: node builtins → externals → internals (relative paths)
- Use `@/` alias for `src/` (configured in `vite.config.js` and `jsconfig.json`)
- Default exports for router config and App.vue; named exports for Pinia stores
- Never guess that a library is available — check `package.json` first

### Naming Conventions

- Components: PascalCase filenames and SFC names (e.g., `UserProfile.vue`)
- Stores: `use<Name>Store` with `defineStore` setup-style (e.g., `useCounterStore`)
- Test files: `*.spec.js` in `src/__tests__/`
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE

### Vue Components

- Always use `<script setup>` syntax (Composition API)
- SFC block order: `<script setup>` → `<template>` → `<style scoped>`
- Use `scoped` styles unless global styling is intentional
- Props: define with `defineProps()` and use type-based declarations
- Emits: define with `defineEmits()` and use type-based declarations

### Pinia Stores

- Use setup-style stores (factory function with `ref`/`computed`), not Options API
- Import `ref` and `computed` from `'vue'`
- Named export with `use` prefix: `export const useXxxStore = defineStore('id', () => { ... })`
- Return an object with state, computed values, and actions

### Error Handling

- No global error handler configured yet; add as needed
- Prefer try/catch around async operations in stores and components
- Surface errors to the UI rather than silently swallowing them

### Linting

- ESLint flat config (`eslint.config.js`): `@eslint/js`, `eslint-plugin-vue` (essential), `eslint-plugin-oxlint`, `@vitest/eslint-plugin`, `eslint-config-prettier`
- Oxlint config (`.oxlintrc.json`): plugins for eslint, unicorn, oxc, vue, vitest; `correctness: error`
- Lint target files: `**/*.{vue,js,mjs,jsx}`
- Ignored: `dist/`, `dist-ssr/`, `coverage/`
- Run `npm run lint` before committing

### Testing

- Vitest with jsdom environment
- `@vue/test-utils` — use `mount()` (not `shallowMount`)
- Import `describe`, `it`, `expect` from `'vitest'`
- Use relative imports for components under test
- Test files live in `src/__tests__/` with `*.spec.js` naming
- Wrap component mounts with needed plugins (e.g., `router`, `pinia`) when testing

### No Cursor/Copilot Rules

- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` exist in this repo
