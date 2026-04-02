import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ConfigScreen from '../components/ConfigScreen.vue'

function createWrapper() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(ConfigScreen, {
    global: {
      plugins: [pinia],
    },
  })
}

describe('ConfigScreen', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders range presets', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('20')
    expect(wrapper.text()).toContain('50')
    expect(wrapper.text()).toContain('100')
    expect(wrapper.text()).toContain('1000')
  })

  it('renders mode toggle', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Speak')
    expect(wrapper.text()).toContain('Numpad')
  })

  it('renders start button', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('button.start-btn').exists()).toBe(true)
  })

  it('selects a range preset', async () => {
    const wrapper = createWrapper()
    const btn = wrapper.find('[data-testid="preset-50"]')
    await btn.trigger('click')
    expect(wrapper.find('[data-testid="preset-50"]').classes()).toContain('active')
  })

  it('accepts custom range input', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="number"]')
    await input.setValue(250)
    expect(wrapper.vm.localRange).toBe(250)
  })

  it('shows weak numbers preset disabled when empty', () => {
    const wrapper = createWrapper()
    const weakBtn = wrapper.find('[data-testid="preset-weak"]')
    expect(weakBtn.attributes('disabled')).toBeDefined()
  })

  it('shows weak numbers preset enabled when weak numbers exist', () => {
    localStorage.setItem('numbah_weak_numbers', JSON.stringify([7, 42]))
    const wrapper = createWrapper()
    const weakBtn = wrapper.find('[data-testid="preset-weak"]')
    expect(weakBtn.attributes('disabled')).toBeUndefined()
    expect(weakBtn.text()).toContain('2')
  })

  it('emits start event with settings', async () => {
    const wrapper = createWrapper()
    const startBtn = wrapper.find('button.start-btn')
    await startBtn.trigger('click')
    const emitted = wrapper.emitted('start')
    expect(emitted).toBeTruthy()
    const [settings] = emitted[0]
    expect(settings.mode).toBe('speak')
    expect(settings.range).toBe(10)
    expect(settings.useWeakNumbers).toBe(false)
  })

  it('emits start with weak numbers mode when selected', async () => {
    localStorage.setItem('numbah_weak_numbers', JSON.stringify([7, 42]))
    const wrapper = createWrapper()
    const weakBtn = wrapper.find('[data-testid="preset-weak"]')
    await weakBtn.trigger('click')
    const startBtn = wrapper.find('button.start-btn')
    await startBtn.trigger('click')
    const [settings] = wrapper.emitted('start')[0]
    expect(settings.useWeakNumbers).toBe(true)
  })

  it('emits open-weak-modal event', async () => {
    const wrapper = createWrapper()
    const manageBtn = wrapper.find('[data-testid="manage-weak-btn"]')
    await manageBtn.trigger('click')
    expect(wrapper.emitted('open-weak-modal')).toBeTruthy()
  })
})
