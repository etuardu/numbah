import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import GameHeader from '../components/GameHeader.vue'

function createWrapper() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(GameHeader, {
    global: {
      plugins: [pinia],
    },
  })
}

describe('GameHeader', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders back button', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="back-btn"]').exists()).toBe(true)
  })

  it('renders score display', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('0')
  })

  it('renders end game button', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="end-game-btn"]').exists()).toBe(true)
  })

  it('emits back event', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-testid="back-btn"]').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('emits end-game event', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-testid="end-game-btn"]').trigger('click')
    expect(wrapper.emitted('end-game')).toBeTruthy()
  })
})
