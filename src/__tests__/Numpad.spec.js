import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Numpad from '../components/Numpad.vue'

describe('Numpad', () => {
  it.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])('renders digit button %d', (d) => {
    const wrapper = mount(Numpad)
    expect(wrapper.find(`[data-testid="digit-${d}"]`).exists()).toBe(true)
  })

  it('renders clear and submit buttons', () => {
    const wrapper = mount(Numpad)
    expect(wrapper.find('[data-testid="clear-btn"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="submit-btn"]').exists()).toBe(true)
  })

  it('displays typed digits', async () => {
    const wrapper = mount(Numpad)
    await wrapper.find('[data-testid="digit-1"]').trigger('click')
    await wrapper.find('[data-testid="digit-2"]').trigger('click')
    await wrapper.find('[data-testid="digit-3"]').trigger('click')
    expect(wrapper.find('[data-testid="display"]').text()).toBe('123')
  })

  it('clears last digit on clear click', async () => {
    const wrapper = mount(Numpad)
    await wrapper.find('[data-testid="digit-1"]').trigger('click')
    await wrapper.find('[data-testid="digit-2"]').trigger('click')
    await wrapper.find('[data-testid="clear-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="display"]').text()).toBe('1')
  })

  it('emits submit with parsed number', async () => {
    const wrapper = mount(Numpad)
    await wrapper.find('[data-testid="digit-4"]').trigger('click')
    await wrapper.find('[data-testid="digit-2"]').trigger('click')
    await wrapper.find('[data-testid="submit-btn"]').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0][0]).toBe(42)
  })

  it('does not emit submit when display is empty', async () => {
    const wrapper = mount(Numpad)
    await wrapper.find('[data-testid="submit-btn"]').trigger('click')
    expect(wrapper.emitted('submit')).toBeFalsy()
  })
})
