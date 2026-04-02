import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import WeakNumbersModal from '../components/WeakNumbersModal.vue'

function createWrapper(options = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  if (options.weakNumbers) {
    localStorage.setItem('numbah_weak_numbers', JSON.stringify(options.weakNumbers))
  }
  return mount(WeakNumbersModal, {
    global: {
      plugins: [pinia],
    },
  })
}

describe('WeakNumbersModal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders title', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Weak Numbers')
  })

  it('renders empty state when no weak numbers', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('No weak numbers yet')
  })

  it('renders weak numbers list', () => {
    const wrapper = createWrapper({ weakNumbers: [7, 42, 100] })
    expect(wrapper.text()).toContain('7')
    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('100')
  })

  it('renders delete button for each number', () => {
    const wrapper = createWrapper({ weakNumbers: [7, 42] })
    const deleteBtns = wrapper.findAll('[data-testid="delete-weak"]')
    expect(deleteBtns.length).toBe(2)
  })

  it('emits close on close button click', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-testid="close-modal"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits remove-weak-number on delete click', async () => {
    const wrapper = createWrapper({ weakNumbers: [7, 42] })
    const deleteBtn = wrapper.find('[data-testid="delete-weak"]')
    await deleteBtn.trigger('click')
    expect(wrapper.emitted('remove-weak-number')).toBeTruthy()
    expect(wrapper.emitted('remove-weak-number')[0][0]).toBe(7)
  })

  it('shows clear all button when weak numbers exist', () => {
    const wrapper = createWrapper({ weakNumbers: [7, 42] })
    expect(wrapper.find('[data-testid="clear-all"]').exists()).toBe(true)
  })

  it('hides clear all button when no weak numbers', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="clear-all"]').exists()).toBe(false)
  })
})
