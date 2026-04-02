import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Numpad from '../components/Numpad.vue'

function createWrapper(props = { targetDigits: 2 }) {
  return mount(Numpad, { props })
}

describe('Numpad', () => {
  it.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])('renders digit button %d', (d) => {
    const wrapper = createWrapper()
    expect(wrapper.find(`[data-testid="digit-${d}"]`).exists()).toBe(true)
  })

  it('renders clear button and no submit button', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="clear-btn"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="submit-btn"]').exists()).toBe(false)
  })

  it('displays typed digits', async () => {
    const wrapper = createWrapper({ targetDigits: 4 })
    await wrapper.find('[data-testid="digit-1"]').trigger('click')
    await wrapper.find('[data-testid="digit-2"]').trigger('click')
    await wrapper.find('[data-testid="digit-3"]').trigger('click')
    expect(wrapper.find('[data-testid="display"]').text()).toBe('123')
  })

  it('clears last digit on clear click', async () => {
    const wrapper = createWrapper({ targetDigits: 3 })
    await wrapper.find('[data-testid="digit-1"]').trigger('click')
    await wrapper.find('[data-testid="digit-2"]').trigger('click')
    await wrapper.find('[data-testid="clear-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="display"]').text()).toBe('1')
  })

  it('auto-submits when digit count matches target', async () => {
    const wrapper = createWrapper({ targetDigits: 2 })
    await wrapper.find('[data-testid="digit-4"]').trigger('click')
    await wrapper.find('[data-testid="digit-2"]').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0][0]).toBe(42)
  })

  it('auto-submits single digit when target is 1', async () => {
    const wrapper = createWrapper({ targetDigits: 1 })
    await wrapper.find('[data-testid="digit-7"]').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0][0]).toBe(7)
  })

  it('does not submit before reaching target digits', async () => {
    const wrapper = createWrapper({ targetDigits: 3 })
    await wrapper.find('[data-testid="digit-1"]').trigger('click')
    await wrapper.find('[data-testid="digit-2"]').trigger('click')
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('clears display after auto-submit', async () => {
    const wrapper = createWrapper({ targetDigits: 2 })
    await wrapper.find('[data-testid="digit-4"]').trigger('click')
    await wrapper.find('[data-testid="digit-2"]').trigger('click')
    expect(wrapper.find('[data-testid="display"]').text()).toBe('')
  })
})
