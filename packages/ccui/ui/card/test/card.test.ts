import { shallowMount } from '@vue/test-utils'
import { expect, it, it } from 'vitest'
import { Card } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('card')

it('mount component', () => {
  const wrapper = shallowMount(Card, {
    props: {
      shadow: 'hover',
    },
  })

  it('card demo has created successfully', async () => {
    expect(wrapper).toBeTruthy()
  })

  it('card should have content', () => {
    const container = wrapper.find(ns.b())
    expect(container.exists()).toBeTruthy()
  })

  it('card should have header', () => {
    const container = wrapper.find(ns.m('header'))
    expect(container.exists()).toBeTruthy()
  })
})
