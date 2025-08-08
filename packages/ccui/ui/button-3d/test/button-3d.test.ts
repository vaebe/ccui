import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button3d from '../src/button-3d'

describe('button3d', () => {
  it('should render correctly', () => {
    const wrapper = mount(Button3d, {
      slots: {
        default: 'Click me',
      },
    })
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('cc-button-3d')
  })

  it('should handle click events', async () => {
    const wrapper = mount(Button3d)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should be disabled', async () => {
    const wrapper = mount(Button3d, {
      props: {
        disabled: true,
      },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('should be in loading state', () => {
    const wrapper = mount(Button3d, {
      props: {
        loading: true,
      },
    })
    expect(wrapper.text()).toBe('Loading...')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('should apply size classes', () => {
    const wrapper = mount(Button3d, {
      props: {
        size: 'large',
      },
    })
    expect(wrapper.classes()).toContain('cc-button-3d--large')
  })

  it('should apply type classes', () => {
    const wrapper = mount(Button3d, {
      props: {
        type: 'secondary',
      },
    })
    expect(wrapper.classes()).toContain('cc-button-3d--secondary')
  })
})
