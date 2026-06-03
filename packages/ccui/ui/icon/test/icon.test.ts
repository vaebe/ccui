import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import {
  addCollection,
  addIcon,
  clearIconRegistry,
  Icon,
  loadIcon,
  registerIcon,
  resolveIcon,
  unregisterIcon,
} from '../index'
import { CONFIG_INJECT_KEY } from '../../config-provider/src/config-provider-types'
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

  it('clickable adds button semantics, tabindex, and emits click', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Icon, {
      props: { name: 'mdi:home', clickable: true, onClick },
    })

    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')
    expect(wrapper.classes()).toContain(ns.m('clickable').substring(1))

    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('clickable activates on Enter and Space via keyboard', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Icon, {
      props: { name: 'mdi:home', clickable: true, onClick },
      attachTo: document.body,
    })

    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(1)

    await wrapper.trigger('keydown', { key: ' ' })
    expect(onClick).toHaveBeenCalledTimes(2)

    await wrapper.trigger('keydown', { key: 'Tab' })
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('non-clickable icon does not pick up button role or tabindex', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mdi:home' },
    })
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
  })

  it('spinDirection="ccw" applies the spin-ccw modifier class', () => {
    const wrapper = mount(Icon, {
      props: { spin: true, spinDirection: 'ccw' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })
    expect(wrapper.classes()).toContain(ns.m('spin').substring(1))
    expect(wrapper.classes()).toContain(ns.m('spin-ccw').substring(1))
  })

  it('spinDirection="cw" (default) does not apply the spin-ccw class', () => {
    const wrapper = mount(Icon, {
      props: { spin: true },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })
    expect(wrapper.classes()).not.toContain(ns.m('spin-ccw').substring(1))
  })

  it('iconifyPrefix prepends bare names with the prefix', () => {
    const wrapper = mount(Icon, {
      props: { name: 'home', iconifyPrefix: 'mdi' },
    })
    expect(wrapper.classes()).toContain(ns.m('iconify').substring(1))
  })

  it('iconifyPrefix is ignored when name already contains a colon', () => {
    const wrapper = mount(Icon, {
      props: { name: 'material-symbols:home-outline', iconifyPrefix: 'mdi' },
    })
    expect(wrapper.classes()).toContain(ns.m('iconify').substring(1))
  })

  it('reads default componentSize from ConfigProvider context', () => {
    const wrapper = mount(Icon, {
      props: {},
      slots: { default: '<svg viewBox="0 0 24 24" />' },
      global: {
        provide: {
          [CONFIG_INJECT_KEY as symbol]: {
            prefixCls: 'ccui',
            componentSize: 'small',
            locale: undefined,
            direction: 'ltr',
            theme: undefined,
            iconPrefixCls: 'ccui-icon',
          },
        },
      },
    })
    expect(wrapper.attributes('style')).toContain('font-size: 14px')
  })

  it('explicit size prop overrides ConfigProvider componentSize', () => {
    const wrapper = mount(Icon, {
      props: { size: 24 },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
      global: {
        provide: {
          [CONFIG_INJECT_KEY as symbol]: {
            prefixCls: 'ccui',
            componentSize: 'small',
            locale: undefined,
            direction: 'ltr',
            theme: undefined,
            iconPrefixCls: 'ccui-icon',
          },
        },
      },
    })
    expect(wrapper.attributes('style')).toContain('font-size: 24px')
  })

  it('reads iconPrefixCls from ConfigProvider for font-icon fallback', () => {
    const wrapper = mount(Icon, {
      props: { name: 'edit' },
      global: {
        provide: {
          [CONFIG_INJECT_KEY as symbol]: {
            prefixCls: 'ccui',
            componentSize: 'middle',
            locale: undefined,
            direction: 'ltr',
            theme: undefined,
            iconPrefixCls: 'my-iconfont',
          },
        },
      },
    })
    const fontIcon = wrapper.find('i')
    expect(fontIcon.classes()).toContain('my-iconfont')
    expect(fontIcon.classes()).toContain('my-iconfont-edit')
  })

  it('explicit prefixCls prop wins over ConfigProvider iconPrefixCls', () => {
    const wrapper = mount(Icon, {
      props: { name: 'edit', prefixCls: 'explicit-prefix' },
      global: {
        provide: {
          [CONFIG_INJECT_KEY as symbol]: {
            prefixCls: 'ccui',
            componentSize: 'middle',
            locale: undefined,
            direction: 'ltr',
            theme: undefined,
            iconPrefixCls: 'config-prefix',
          },
        },
      },
    })
    expect(wrapper.find('i').classes()).toContain('explicit-prefix')
  })

  it('re-exports Iconify offline API addCollection / addIcon / loadIcon', () => {
    expect(typeof addCollection).toBe('function')
    expect(typeof addIcon).toBe('function')
    expect(typeof loadIcon).toBe('function')
  })

  it('loading state replaces content with spinner SVG and sets aria-busy', () => {
    registerIcon('search', SearchIcon)
    const wrapper = mount(Icon, {
      props: { name: 'search', loading: true },
    })

    expect(wrapper.classes()).toContain(ns.m('loading').substring(1))
    expect(wrapper.classes()).toContain(ns.m('spin').substring(1))
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find(ns.e('loading-spinner')).exists()).toBe(true)
  })

  it('disabled clickable icon blocks click and keyboard activation', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Icon, {
      props: { name: 'mdi:home', clickable: true, disabled: true, onClick },
    })

    expect(wrapper.classes()).toContain(ns.m('disabled').substring(1))
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')

    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()

    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(onClick).not.toHaveBeenCalled()
  })

  it('disabled does not apply when not clickable', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mdi:home', disabled: true },
    })
    expect(wrapper.classes()).not.toContain(ns.m('disabled').substring(1))
    expect(wrapper.attributes('aria-disabled')).toBeUndefined()
  })

  it('themePrefixMap auto-prefixes bare names with theme-mapped Iconify prefix', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'home',
        theme: 'outlined',
        themePrefixMap: { outlined: 'material-symbols', filled: 'mdi', 'two-tone': 'twemoji' },
      },
    })
    expect(wrapper.classes()).toContain(ns.m('iconify').substring(1))
  })

  it('themePrefixMap defers to iconifyPrefix when no entry for current theme', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'home',
        theme: 'outlined',
        themePrefixMap: { filled: 'mdi' },
        iconifyPrefix: 'fluent',
      },
    })
    expect(wrapper.classes()).toContain(ns.m('iconify').substring(1))
  })

  it('explicit Iconify name (with colon) ignores both themePrefixMap and iconifyPrefix', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'mdi:custom-icon',
        theme: 'outlined',
        themePrefixMap: { outlined: 'should-be-ignored' },
        iconifyPrefix: 'also-ignored',
      },
    })
    expect(wrapper.classes()).toContain(ns.m('iconify').substring(1))
  })

  it('loading state still spins counter-clockwise when spinDirection=ccw', () => {
    const wrapper = mount(Icon, {
      props: { loading: true, spinDirection: 'ccw' },
      slots: { default: '<svg viewBox="0 0 24 24" />' },
    })
    expect(wrapper.classes()).toContain(ns.m('spin-ccw').substring(1))
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
