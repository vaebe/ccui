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
})
