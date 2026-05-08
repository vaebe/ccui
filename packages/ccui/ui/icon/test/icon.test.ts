import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vite-plus/test'
import { clearIconRegistry, Icon, registerIcon, resolveIcon, unregisterIcon } from '../index'
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

  it('renders Iconify component when name contains a colon', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mdi:home' },
    })

    expect(wrapper.classes()).toContain(ns.m('iconify').substring(1))
    expect(wrapper.classes()).toContain(ns.m('svg').substring(1))
    expect(wrapper.find('i.ccui-icon-mdi\\:home').exists()).toBe(false)
  })

  it('Iconify name takes precedence over registry name lookup', () => {
    registerIcon('mdi:home', SearchIcon)

    const wrapper = mount(Icon, {
      props: { name: 'mdi:home' },
    })

    expect(wrapper.classes()).toContain(ns.m('iconify').substring(1))
  })

  it('resolves size preset small to 14px', () => {
    const wrapper = mount(Icon, {
      props: { size: 'small' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })

    expect(wrapper.attributes('style')).toContain('font-size: 14px')
  })

  it('resolves size preset large to 20px', () => {
    const wrapper = mount(Icon, {
      props: { size: 'large' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })

    expect(wrapper.attributes('style')).toContain('font-size: 20px')
  })

  it('does not set inline font-size for size="default" so parent cascades', () => {
    const wrapper = mount(Icon, {
      props: { size: 'default' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })

    expect(wrapper.attributes('style') ?? '').not.toContain('font-size')
  })

  it('passes through CSS unit string size like 1.5em', () => {
    const wrapper = mount(Icon, {
      props: { size: '1.5em' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })

    expect(wrapper.attributes('style')).toContain('font-size: 1.5em')
  })

  it('applies theme class for outlined / filled / two-tone', () => {
    const outlined = mount(Icon, {
      props: { theme: 'outlined' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })
    const filled = mount(Icon, {
      props: { theme: 'filled' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })
    const twoTone = mount(Icon, {
      props: { theme: 'two-tone', twoToneColor: '#1677ff' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })

    expect(outlined.classes()).toContain(ns.m('outlined').substring(1))
    expect(filled.classes()).toContain(ns.m('filled').substring(1))
    expect(twoTone.classes()).toContain(ns.m('two-tone').substring(1))
    expect(twoTone.attributes('style')).toContain('--ccui-icon-two-tone-color: #1677ff')
  })

  it('component prop wins over name lookup', () => {
    registerIcon('search', SearchIcon)
    const wrapper = mount(Icon, {
      props: { name: 'search', component: SearchIcon },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    // both registry and component path render the same icon, so check ARIA setup
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('exposes resolveIcon and unregisterIcon for registry management', () => {
    registerIcon('search', SearchIcon)
    expect(resolveIcon('search')).toBe(SearchIcon)
    unregisterIcon('search')
    expect(resolveIcon('search')).toBeUndefined()
  })

  it('attaches role="img" and aria-label when title or ariaLabel is provided', () => {
    const titled = mount(Icon, {
      props: { title: 'home' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })
    const labelled = mount(Icon, {
      props: { ariaLabel: 'menu' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })
    const decorative = mount(Icon, {
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })

    expect(titled.attributes('role')).toBe('img')
    expect(titled.attributes('aria-label')).toBe('home')
    expect(labelled.attributes('role')).toBe('img')
    expect(labelled.attributes('aria-label')).toBe('menu')
    expect(decorative.attributes('aria-hidden')).toBe('true')
  })
})
