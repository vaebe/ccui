import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vite-plus/test'
import { clearIconRegistry, Icon, registerIcon } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('icon', true)

const SearchIcon = defineComponent({
  name: 'SearchIcon',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, [
        h('path', { d: 'M10 4a6 6 0 1 0 3.87 10.59L20 20.7 20.7 20 14.59 13.87A6 6 0 0 0 10 4z' }),
      ])
  },
})

beforeEach(() => {
  clearIconRegistry()
})

describe('icon', () => {
  it('renders registered component icon by name', () => {
    registerIcon('search', SearchIcon)

    const wrapper = mount(Icon, {
      props: { name: 'search' },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find(ns.b()).exists()).toBe(true)
  })

  it('applies size, color and rotate styles', () => {
    const wrapper = mount(Icon, {
      props: {
        size: 20,
        color: '#1677ff',
        rotate: 90,
      },
      slots: {
        default: '<svg viewBox="0 0 24 24" />',
      },
    })

    expect(wrapper.attributes('style')).toContain('font-size: 20px')
    expect(wrapper.attributes('style')).toContain('color: rgb(22, 119, 255)')
    expect(wrapper.attributes('style')).toContain('--ccui-icon-rotate: 90deg')
  })

  it('renders font icon class when a named icon is missing from registry', () => {
    const wrapper = mount(Icon, {
      props: { name: 'edit' },
    })

    expect(wrapper.find('i').classes()).toContain('ccui-icon-edit')
  })

  it('supports spin class', () => {
    const wrapper = mount(Icon, {
      props: { spin: true },
      slots: {
        default: '<svg viewBox="0 0 24 24" />',
      },
    })

    expect(wrapper.classes()).toContain(ns.m('spin').substring(1))
  })
})
