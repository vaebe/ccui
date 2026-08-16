import type { BackTopProps, FloatButtonProps, FloatButtonShape, FloatButtonType } from '../index'
import { mount } from '@vue/test-utils'
import { resolve } from 'node:path'
import { compile } from 'sass'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { BackTop, FloatButton } from '../index'

const ns = useNamespace('float-button', true)
// 编译真实 SCSS 后检查最终选择器，避免只比较源码片段而漏掉 Sass 嵌套展开结果。
const floatButtonCss = compile(resolve(process.cwd(), 'ui/float-button/src/float-button.scss'), {
  loadPaths: [resolve(process.cwd(), 'node_modules')],
  quietDeps: true,
  logger: { debug: () => {}, warn: () => {} },
}).css

function rafNow(callback: FrameRequestCallback) {
  callback(0)
  return 1
}

describe('floatButton', () => {
  it('从入口导出 FloatButton 与 BackTop 公开类型', () => {
    expectTypeOf<FloatButtonProps['shape']>().toEqualTypeOf<FloatButtonShape>()
    expectTypeOf<FloatButtonProps['type']>().toEqualTypeOf<FloatButtonType>()
    expectTypeOf<Window>().toMatchTypeOf<Exclude<BackTopProps['target'], undefined>>()
  })

  it('renders as button by default', () => {
    const wrapper = mount(FloatButton, {
      props: { description: 'Help' },
    })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.find(ns.e('description')).text()).toBe('Help')
  })

  it('renders as anchor when href is set', () => {
    const wrapper = mount(FloatButton, {
      props: { href: 'https://example.com', target: '_blank' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.attributes('target')).toBe('_blank')
  })

  it('emits click event', async () => {
    const wrapper = mount(FloatButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders badge when set', () => {
    const wrapper = mount(FloatButton, {
      props: { badge: 9 },
    })
    expect(wrapper.find(ns.e('badge')).text()).toBe('9')
    expect(wrapper.find(ns.e('badge')).attributes('aria-hidden')).toBe('true')
  })

  it('applies shape and type modifiers', () => {
    const wrapper = mount(FloatButton, {
      props: { shape: 'square', type: 'primary' },
    })
    expect(wrapper.find(ns.m('square')).exists()).toBe(true)
    expect(wrapper.find(ns.m('primary')).exists()).toBe(true)
  })

  it('description、icon、badge 与样式 props 动态更新', async () => {
    const wrapper = mount(FloatButton, {
      props: { description: 'Help', icon: 'icon-help', badge: 1, shape: 'circle', type: 'default' },
    })
    expect(wrapper.find(ns.e('description')).text()).toBe('Help')
    expect(wrapper.find('.icon-help').exists()).toBe(true)
    expect(wrapper.find(ns.e('badge')).text()).toBe('1')

    await wrapper.setProps({ description: 'Support', icon: 'icon-support', badge: 2, shape: 'square', type: 'primary' })

    expect(wrapper.find(ns.e('description')).text()).toBe('Support')
    expect(wrapper.find('.icon-help').exists()).toBe(false)
    expect(wrapper.find('.icon-support').exists()).toBe(true)
    expect(wrapper.find(ns.e('badge')).text()).toBe('2')
    expect(wrapper.classes()).toContain('ccui-float-button--square')
    expect(wrapper.classes()).toContain('ccui-float-button--primary')
  })

  it('description 与 icon slot 使用最新响应式内容', async () => {
    const description = ref('Help')
    const iconClass = ref('icon-help')
    const wrapper = mount(FloatButton, {
      slots: {
        description: () => description.value,
        icon: () => h('i', { class: iconClass.value }),
      },
    })
    expect(wrapper.find(ns.e('description')).text()).toBe('Help')
    expect(wrapper.find('.icon-help').exists()).toBe(true)

    description.value = 'Support'
    iconClass.value = 'icon-support'
    await nextTick()

    expect(wrapper.find(ns.e('description')).text()).toBe('Support')
    expect(wrapper.find('.icon-help').exists()).toBe(false)
    expect(wrapper.find('.icon-support').exists()).toBe(true)
  })

  it('透传纯图标按钮的可访问名称与原生 attrs', () => {
    const wrapper = mount(FloatButton, {
      props: { icon: 'icon-help' },
      attrs: { 'aria-label': '帮助', 'data-track': 'help' },
    })

    expect(wrapper.attributes('aria-label')).toBe('帮助')
    expect(wrapper.attributes('data-track')).toBe('help')
  })

  it('编译样式提供键盘焦点环、逻辑定位与减弱动画覆盖', () => {
    const reducedStart = floatButtonCss.indexOf('@media (prefers-reduced-motion: reduce)')
    const reducedCss = floatButtonCss.slice(reducedStart)

    expect(floatButtonCss).toContain('.ccui-float-button:focus-visible')
    expect(floatButtonCss).toContain('inset-inline-end: 24px')
    expect(floatButtonCss).toContain('inset-block-end: 48px')
    expect(reducedStart).toBeGreaterThan(-1)
    expect(reducedCss).toContain('.ccui-float-button:hover')
    expect(reducedCss).toContain('transform: none')
    expect(reducedCss).toContain('.ccui-float-button-fade-enter-active')
    expect(reducedCss).toContain('transition: none')
  })

  it('编译样式在 RTL 下反转徽标水平位移', () => {
    const rtlBadgeSelector = '.ccui-float-button__badge:dir(rtl)'
    const rtlStart = floatButtonCss.indexOf(rtlBadgeSelector)
    const rtlBlock = floatButtonCss.slice(rtlStart, floatButtonCss.indexOf('}', rtlStart))

    expect(rtlStart).toBeGreaterThan(-1)
    expect(rtlBlock).toContain('transform: translate(-50%, -50%)')
  })
})

describe('backTop', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('hidden initially when scroll is below threshold', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 400 },
    })
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  it('shows when element target scrolls past threshold and scrolls back to top', async () => {
    const target = document.createElement('div')
    target.className = 'scroll-target'
    document.body.appendChild(target)
    target.scrollTop = 120
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(rafNow)

    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 100, duration: 0, target },
      attachTo: document.body,
    })
    await nextTick()

    expect(wrapper.find(ns.b()).exists()).toBe(true)
    await wrapper.find(ns.b()).trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(target.scrollTop).toBe(0)
  })

  it('resolves string target and updates visibility on scroll', async () => {
    const target = document.createElement('div')
    target.id = 'scroll-root'
    document.body.appendChild(target)

    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 10, target: '#scroll-root' },
      attachTo: document.body,
    })

    target.scrollTop = 11
    target.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find(ns.b()).exists()).toBe(true)

    target.scrollTop = 0
    target.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  it('resolves function target and scrolls it back to top', async () => {
    const target = document.createElement('div')
    target.scrollTop = 160
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(rafNow)

    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 100, duration: 0, target: () => target },
    })
    await nextTick()

    expect(wrapper.find(ns.b()).exists()).toBe(true)
    await wrapper.find(ns.b()).trigger('click')
    expect(target.scrollTop).toBe(0)
  })

  it('visibilityHeight 动态变化时立即重算显隐', async () => {
    const target = document.createElement('div')
    target.scrollTop = 50
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 100, target },
    })
    await nextTick()
    expect(wrapper.find(ns.b()).exists()).toBe(false)

    await wrapper.setProps({ visibilityHeight: 40 })
    await nextTick()
    expect(wrapper.find(ns.b()).exists()).toBe(true)

    await wrapper.setProps({ visibilityHeight: 60 })
    await nextTick()
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  it('target 迁移与卸载时取消旧 rAF 并迁移 listener', async () => {
    const first = document.createElement('div')
    const second = document.createElement('div')
    first.scrollTop = 120
    second.scrollTop = 0
    let rafId = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => ++rafId)
    const cancelRaf = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    const firstRemove = vi.spyOn(first, 'removeEventListener')
    const secondRemove = vi.spyOn(second, 'removeEventListener')
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 100, duration: 450, target: first },
    })
    await nextTick()

    await wrapper.find(ns.b()).trigger('click')
    expect(rafId).toBe(1)

    await wrapper.setProps({ target: second })
    expect(cancelRaf).toHaveBeenCalledWith(1)
    expect(firstRemove).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(wrapper.find(ns.b()).exists()).toBe(false)

    second.scrollTop = 120
    second.dispatchEvent(new Event('scroll'))
    await nextTick()
    await wrapper.find(ns.b()).trigger('click')
    expect(rafId).toBe(2)

    wrapper.unmount()
    expect(cancelRaf).toHaveBeenCalledWith(2)
    expect(secondRemove).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('BackTop attrs 可本地化名称，减少动态效果时立即滚回', async () => {
    const target = document.createElement('div')
    target.scrollTop = 120
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }) as MediaQueryList),
    )
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(rafNow)
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 100, duration: 450, target },
      attrs: { 'aria-label': '返回顶部', 'data-track': 'back-top' },
    })
    await nextTick()

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('返回顶部')
    expect(button.attributes('data-track')).toBe('back-top')
    await button.trigger('click')
    expect(target.scrollTop).toBe(0)
  })

  it.each([
    ['字符串', 'external-string', ['external-string']],
    ['数组', ['external-array-a', 'external-array-b'], ['external-array-a', 'external-array-b']],
    ['对象', { 'external-object': true, 'external-object-off': false }, ['external-object']],
  ])('BackTop 规范化%s class 且每个 token 只渲染一次', async (_kind, externalClass, expectedTokens) => {
    const target = document.createElement('div')
    target.scrollTop = 120
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 100, target },
      attrs: { class: externalClass },
    })
    await nextTick()

    const tokens = (wrapper.find('button').attributes('class') ?? '').split(/\s+/)
    for (const token of ['ccui-float-button', ...expectedTokens]) {
      expect(tokens.filter((candidate) => candidate === token)).toHaveLength(1)
    }
    expect(tokens).not.toContain('external-object-off')
  })

  it('uses window as the default target when scroll APIs are mocked', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(rafNow)
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    // jsdom 的 scrollY 在 window 自身或原型上，用 defineProperty 覆盖
    Object.defineProperty(window, 'scrollY', { get: () => 160, configurable: true })

    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 100, duration: 0 },
      attachTo: document.body,
    })

    // onMounted 已调用 onScroll()，但 <Transition> 需要额外 tick
    await nextTick()
    await nextTick()

    expect(wrapper.find(ns.b()).exists()).toBe(true)
    await wrapper.find(ns.b()).trigger('click')
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0)

    // 恢复
    Object.defineProperty(window, 'scrollY', { get: () => 0, configurable: true })
  })
})
