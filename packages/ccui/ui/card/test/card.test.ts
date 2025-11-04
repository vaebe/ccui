import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Card } from '../index'

const ns = useNamespace('card', true)

describe('card', () => {
  it('mount component', () => {
    const wrapper = mount(Card, {
      props: {
        shadow: 'hover',
      },
    })

    expect(wrapper).toBeTruthy()
  })

  it('card should have content', () => {
    const wrapper = mount(Card, {
      props: {
        shadow: 'hover',
      },
    })
    const container = wrapper.find(ns.b())
    expect(container.exists()).toBeTruthy()
  })

  it('card should have header', () => {
    const wrapper = mount(Card, {
      props: {
        shadow: 'hover',
        header: 'Test Header',
      },
    })
    const container = wrapper.find(ns.e('header'))
    expect(container.exists()).toBeTruthy()
  })

  it('renders default slot content', () => {
    const wrapper = mount(Card, {
      slots: {
        default: '<div class="content">Card Content</div>',
      },
    })

    expect(wrapper.find('.content').exists()).toBeTruthy()
    expect(wrapper.find('.content').text()).toBe('Card Content')
  })

  it('renders header slot content', () => {
    const wrapper = mount(Card, {
      slots: {
        header: '<div class="header">Card Header</div>',
      },
    })

    expect(wrapper.find('.header').exists()).toBeTruthy()
    expect(wrapper.find('.header').text()).toBe('Card Header')
  })

  it('applies correct shadow class based on props', () => {
    const wrapper = mount(Card, {
      props: {
        shadow: 'always',
      },
    })

    expect(wrapper.classes()).toContain('ccui-card')
    expect(wrapper.classes()).toContain('ccui-card--always-shadow')
  })

  it('applies body style when provided', () => {
    const wrapper = mount(Card, {
      props: {
        bodyStyle: {
          padding: '20px',
          backgroundColor: 'red',
        },
      },
      slots: {
        default: '<div>Content</div>',
      },
    })

    const body = wrapper.find(ns.e('body'))
    expect(body.attributes('style')).toContain('padding: 20px')
    expect(body.attributes('style')).toContain('background-color: red')
  })

  it('shows header when header prop is provided', () => {
    const wrapper = mount(Card, {
      props: {
        header: 'Header Text',
      },
    })

    expect(wrapper.find(ns.e('header')).exists()).toBeTruthy()
    expect(wrapper.find(ns.e('header')).text()).toBe('Header Text')
  })

  it('shows header when header slot is provided', () => {
    const wrapper = mount(Card, {
      slots: {
        header: '<div>Header Slot</div>',
      },
    })

    expect(wrapper.find(ns.e('header')).exists()).toBeTruthy()
    expect(wrapper.find(ns.e('header')).text()).toBe('Header Slot')
  })
})
