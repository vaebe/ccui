import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
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

  it('exposes separator semantics and forwards root attrs', () => {
    const wrapper = shallowMount(Divider, {
      attrs: {
        id: 'section-divider',
        'aria-label': '内容分隔线',
      },
      props: {
        direction: 'vertical',
      },
    })

    const root = wrapper.find(verticalClass)
    expect(root.attributes('id')).toBe('section-divider')
    expect(root.attributes('aria-label')).toBe('内容分隔线')
    expect(root.attributes('role')).toBe('separator')
    expect(root.attributes('aria-orientation')).toBe('vertical')

    wrapper.unmount()
  })
})
