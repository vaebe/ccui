import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Divider } from '../index'

const ns = useNamespace('divider', true)
const baseClass = ns.b()
const verticalClass = ns.m('vertical')

describe('divider', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Divider)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('props', async () => {
    const wrapper = shallowMount(Divider, {
      props: {
        direction: 'vertical',
      },
    })

    expect(wrapper.find(verticalClass).exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('slots', async () => {
    const wrapper = shallowMount(Divider, {
      slots: {
        default: '上海',
      },
    })

    expect(wrapper.find(baseClass).text()).toBe('上海')

    wrapper.unmount()
  })
})
