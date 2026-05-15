import type { ButtonSizeType, ButtonType } from '../src/button-types'
import { mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { __resetDeprecationWarningsForTest } from '../../shared/hooks/use-deprecation-warning'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Button } from '../index'

const ns = useNamespace('button', true)
const baseClass = ns.b()
function getTypeClass(type: ButtonType) {
  return ns.m(type)
}

function getSizeClass(type: ButtonSizeType) {
  return ns.m(type)
}

const roundClass = ns.m('round')
const circleClass = ns.m('circle')
const loadingClass = ns.m('loading')

// 测试辅助函数
function createWrapper(props = {}, slots = {}) {
  return mount(Button, {
    props,
    slots: {
      default: 'Button',
      ...slots,
    },
  })
}

function createShallowWrapper(props = {}, slots = {}) {
  return shallowMount(Button, {
    props,
    slots: {
      default: 'Button',
      ...slots,
    },
  })
}

describe('button', () => {
  it('dom', () => {
    const wrapper = createShallowWrapper({}, { default: '确定' })
    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    // 注意：autoInsertSpace 默认 true（v5.17 起 Ant 默认），2 字 CJK 自动插空格
    expect(wrapper.find(baseClass).text()).toBe('确 定')
    wrapper.unmount()
  })

  it('type', async () => {
    const wrapper = createShallowWrapper({ type: 'primary' })
    expect(wrapper.find(getTypeClass('primary')).exists()).toBeTruthy()

    await wrapper.setProps({ type: 'success' })
    expect(wrapper.find(getTypeClass('success')).exists()).toBeTruthy()

    await wrapper.setProps({ type: 'warning' })
    expect(wrapper.find(getTypeClass('warning')).exists()).toBeTruthy()

    await wrapper.setProps({ type: 'danger' })
    expect(wrapper.find(getTypeClass('danger')).exists()).toBeTruthy()

    await wrapper.setProps({ type: 'info' })
    expect(wrapper.find(getTypeClass('info')).exists()).toBeTruthy()
  })

  it('size', async () => {
    const wrapper = createShallowWrapper({ size: 'small' })
    expect(wrapper.find(getSizeClass('small')).exists()).toBeTruthy()

    await wrapper.setProps({ size: 'large' })
    expect(wrapper.find(getSizeClass('large')).exists()).toBeTruthy()
  })

  it('round', async () => {
    const wrapper = createShallowWrapper({ round: true })
    expect(wrapper.find(roundClass).exists()).toBeTruthy()
  })

  it('circle', async () => {
    const wrapper = createShallowWrapper({ circle: true })
    expect(wrapper.find(circleClass).exists()).toBeTruthy()
  })

  it('click events', async () => {
    const handleClick = vi.fn()

    // Test normal click
    const wrapper = createWrapper({}, { default: 'Click me' })
    wrapper.element.addEventListener('click', handleClick)
    await wrapper.trigger('click')
    expect(handleClick).toBeCalled()
    wrapper.unmount()

    // Test disabled - no click
    handleClick.mockClear()
    const disabledWrapper = createWrapper({ disabled: true })
    const disabledClass = ns.m('disabled').substring(1)
    expect(disabledWrapper.find('button').classes()).toContain(disabledClass)
    disabledWrapper.element.addEventListener('click', handleClick)
    await disabledWrapper.trigger('click')
    expect(handleClick).not.toBeCalled()
    disabledWrapper.unmount()

    // Test loading - no click
    handleClick.mockClear()
    const loadingWrapper = createWrapper({ loading: true })
    expect(loadingWrapper.find(loadingClass).exists()).toBeTruthy()
    expect(loadingWrapper.find('button').attributes('disabled')).toBe('')
    expect(loadingWrapper.find('button').classes()).toContain(disabledClass)
    loadingWrapper.element.addEventListener('click', handleClick)
    await loadingWrapper.trigger('click')
    expect(handleClick).not.toBeCalled()
    loadingWrapper.unmount()
  })

  it('renders icon slot when provided', () => {
    const wrapper = createWrapper(
      {},
      {
        icon: '<i class="cc-icon-heart"></i>',
        default: 'Like',
      },
    )
    expect(wrapper.find('.cc-icon-heart').exists()).toBe(true)
    wrapper.unmount()
  })

  it('applies plain style when plain prop is true', async () => {
    const wrapper = createShallowWrapper({ type: 'primary', plain: true })
    expect(wrapper.find(ns.m('plain-primary')).exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('sets nativeType attribute correctly', () => {
    const wrapper = createWrapper({ nativeType: 'submit' }, { default: 'Submit' })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
    wrapper.unmount()
  })

  it('sets autofocus attribute when autofocus is true', () => {
    const wrapper = createWrapper({ autofocus: true }, { default: 'Focus' })
    expect(wrapper.find('button').attributes('autofocus')).toBe('')
    wrapper.unmount()
  })

  it('renders icon when icon prop is provided', () => {
    const wrapper = createWrapper({ icon: 'cc-icon-star' }, { default: 'Star' })
    expect(wrapper.find('.cc-icon-star').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders loading icon when loading is true', () => {
    const wrapper = createWrapper({ loading: true }, { default: 'Loading' })
    expect(wrapper.find(ns.e('loading-icon')).exists()).toBe(true)
    expect(wrapper.find(ns.e('loading-icon')).text()).toBe('')
    wrapper.unmount()
  })

  it('emits component click event when enabled', async () => {
    const wrapper = createWrapper()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')?.length).toBe(1)
  })

  it('does not emit component click event when disabled or loading', async () => {
    const disabled = createWrapper({ disabled: true })
    await disabled.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()

    const loading = createWrapper({ loading: true })
    await loading.trigger('click')
    expect(loading.emitted('click')).toBeUndefined()
  })

  it('renders button without default content', () => {
    const wrapper = mount(Button)
    expect(wrapper.find(ns.e('content')).exists()).toBe(false)
  })

  // ───────────────────────────────────────────────────────────
  // L-1.1: Ant Design API alignment
  // ───────────────────────────────────────────────────────────

  describe('shape', () => {
    it('shape="round" 渲染 --round（与旧 round=true 等价）', () => {
      const wrapper = createShallowWrapper({ shape: 'round' })
      expect(wrapper.find(roundClass).exists()).toBe(true)
    })

    it('shape="circle" 渲染 --circle（与旧 circle=true 等价）', () => {
      const wrapper = createShallowWrapper({ shape: 'circle' })
      expect(wrapper.find(circleClass).exists()).toBe(true)
    })

    it('显式 shape 优先于 round / circle boolean', () => {
      const wrapper = createShallowWrapper({ shape: 'round', circle: true })
      expect(wrapper.find(roundClass).exists()).toBe(true)
      expect(wrapper.find(circleClass).exists()).toBe(false)
    })
  })

  describe('htmlType / nativeType', () => {
    it('htmlType 主名生效', () => {
      const wrapper = createShallowWrapper({ htmlType: 'submit' })
      expect(wrapper.find('button').attributes('type')).toBe('submit')
    })

    it('htmlType 优先于旧 nativeType', () => {
      const wrapper = createShallowWrapper({ htmlType: 'submit', nativeType: 'reset' })
      expect(wrapper.find('button').attributes('type')).toBe('submit')
    })

    it('nativeType 仍可工作（兼容）', () => {
      const wrapper = createShallowWrapper({ nativeType: 'reset' })
      expect(wrapper.find('button').attributes('type')).toBe('reset')
    })
  })

  describe('danger / ghost / block', () => {
    it('danger=true 加 --dangerous 类（与 Ant `.ant-btn-dangerous` 对齐）', () => {
      const wrapper = createShallowWrapper({ danger: true })
      expect(wrapper.find(ns.m('dangerous')).exists()).toBe(true)
    })

    it('danger=true 与 type="danger" 互不冲突（两类同时存在）', () => {
      const wrapper = createShallowWrapper({ type: 'danger', danger: true })
      expect(wrapper.find(ns.m('danger')).exists()).toBe(true) // 旧 type 行为保留
      expect(wrapper.find(ns.m('dangerous')).exists()).toBe(true) // 新 boolean 也生效
    })

    it('ghost=true 加 --ghost 类', () => {
      const wrapper = createShallowWrapper({ ghost: true })
      expect(wrapper.find(ns.m('ghost')).exists()).toBe(true)
    })

    it('block=true 加 --block 类', () => {
      const wrapper = createShallowWrapper({ block: true })
      expect(wrapper.find(ns.m('block')).exists()).toBe(true)
    })
  })

  describe('href 渲染为 <a>', () => {
    it('设置 href 渲染 <a> 而非 <button>', () => {
      const wrapper = createShallowWrapper({ href: 'https://example.com' })
      expect(wrapper.find('a').exists()).toBe(true)
      expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
      expect(wrapper.find('a').attributes('role')).toBe('button')
    })

    it('disabled <a> 不渲染 href 且 aria-disabled=true', () => {
      const wrapper = createShallowWrapper({ href: 'https://example.com', disabled: true })
      const link = wrapper.find('a')
      expect(link.attributes('href')).toBeUndefined()
      expect(link.attributes('aria-disabled')).toBe('true')
      expect(link.attributes('tabindex')).toBe('-1')
    })

    it('target 透传到 <a>', () => {
      const wrapper = createShallowWrapper({ href: 'https://example.com', target: '_blank' })
      expect(wrapper.find('a').attributes('target')).toBe('_blank')
    })
  })

  describe('iconPosition', () => {
    it('iconPosition="end" 加 --icon-end 类', () => {
      const wrapper = createShallowWrapper({ iconPosition: 'end', icon: 'mdi:home' })
      expect(wrapper.find(ns.m('icon-end')).exists()).toBe(true)
    })

    it('默认 iconPosition 不加 --icon-end 类', () => {
      const wrapper = createShallowWrapper({ icon: 'mdi:home' })
      expect(wrapper.find(ns.m('icon-end')).exists()).toBe(false)
    })
  })

  describe('autoInsertSpace', () => {
    it('两个 CJK 字符之间自动插空格', () => {
      const wrapper = createWrapper({}, { default: '按钮' })
      expect(wrapper.find(ns.e('content')).text()).toBe('按 钮')
    })

    it('autoInsertSpace=false 时保留原文', () => {
      const wrapper = createWrapper({ autoInsertSpace: false }, { default: '按钮' })
      expect(wrapper.find(ns.e('content')).text()).toBe('按钮')
    })

    it('非 2 字 CJK 不处理', () => {
      const w3 = createWrapper({}, { default: '三个字' })
      expect(w3.find(ns.e('content')).text()).toBe('三个字')

      const w1 = createWrapper({}, { default: '点' })
      expect(w1.find(ns.e('content')).text()).toBe('点')

      const wEn = createWrapper({}, { default: 'OK' })
      expect(wEn.find(ns.e('content')).text()).toBe('OK')
    })
  })

  describe('loading 对象形（delay / icon）', () => {
    it('loading={ delay: 50 } 延迟后才进入 loading', async () => {
      vi.useFakeTimers()
      const wrapper = createWrapper({ loading: { delay: 50 } }, { default: 'Save' })
      // 立即检查：未进入 loading
      expect(wrapper.find(loadingClass).exists()).toBe(false)
      // 推进 50ms 后进入 loading
      vi.advanceTimersByTime(60)
      await wrapper.vm.$nextTick()
      expect(wrapper.find(loadingClass).exists()).toBe(true)
      vi.useRealTimers()
      wrapper.unmount()
    })

    it('loading={} 无 delay 立即进入 loading', () => {
      const wrapper = createWrapper({ loading: {} }, { default: 'Save' })
      expect(wrapper.find(loadingClass).exists()).toBe(true)
      wrapper.unmount()
    })

    it('loading 切换：true → false 取消 delay 定时器', async () => {
      vi.useFakeTimers()
      const wrapper = createWrapper({ loading: { delay: 100 } }, { default: 'Save' })
      // 在 delay 期间撤回 loading
      await wrapper.setProps({ loading: false })
      vi.advanceTimersByTime(200)
      await wrapper.vm.$nextTick()
      expect(wrapper.find(loadingClass).exists()).toBe(false)
      vi.useRealTimers()
      wrapper.unmount()
    })
  })

  describe('Button.Group 注入', () => {
    it('Group 的 size 注入子按钮', async () => {
      const { ButtonGroup } = await import('../index')
      const wrapper = mount({
        components: { Button, ButtonGroup },
        template: `<ButtonGroup size="large"><Button>A</Button><Button>B</Button></ButtonGroup>`,
      })
      const btns = wrapper.findAll(baseClass)
      expect(btns.length).toBe(2)
      btns.forEach((btn) => {
        expect(btn.classes()).toContain('ccui-button--large')
      })
    })

    it('Group 的 disabled 注入子按钮', async () => {
      const { ButtonGroup } = await import('../index')
      const wrapper = mount({
        components: { Button, ButtonGroup },
        template: `<ButtonGroup disabled><Button>A</Button></ButtonGroup>`,
      })
      const btn = wrapper.find('button')
      expect(btn.attributes('disabled')).toBe('')
    })

    it('子按钮显式 size 优先于 Group', async () => {
      const { ButtonGroup } = await import('../index')
      const wrapper = mount({
        components: { Button, ButtonGroup },
        template: `<ButtonGroup size="large"><Button size="small">A</Button></ButtonGroup>`,
      })
      const btn = wrapper.find(baseClass)
      expect(btn.classes()).toContain('ccui-button--small')
      expect(btn.classes()).not.toContain('ccui-button--large')
    })
  })

  describe('新 type 取值', () => {
    it('type="default" 仍渲染基类（无额外 modifier 误伤）', () => {
      const wrapper = createShallowWrapper({ type: 'default' })
      expect(wrapper.find(baseClass).exists()).toBe(true)
      expect(wrapper.find(ns.m('default')).exists()).toBe(true)
    })

    it('type="dashed" 渲染 --dashed', () => {
      const wrapper = createShallowWrapper({ type: 'dashed' })
      expect(wrapper.find(ns.m('dashed')).exists()).toBe(true)
    })

    it('type="link" 渲染 --link', () => {
      const wrapper = createShallowWrapper({ type: 'link' })
      expect(wrapper.find(ns.m('link')).exists()).toBe(true)
    })
  })

  describe('color / variant (forward-compat)', () => {
    it('color="primary" 加 --color-primary 类（SCSS 矩阵留 v2.x）', () => {
      const wrapper = createShallowWrapper({ color: 'primary' })
      expect(wrapper.find(ns.m('color-primary')).exists()).toBe(true)
    })

    it('variant="solid" 加 --variant-solid 类', () => {
      const wrapper = createShallowWrapper({ variant: 'solid' })
      expect(wrapper.find(ns.m('variant-solid')).exists()).toBe(true)
    })
  })

  describe('deprecation warn (M-A5)', () => {
    beforeEach(() => {
      __resetDeprecationWarningsForTest()
    })

    it('nativeType 显式传入触发 deprecation warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      createShallowWrapper({ nativeType: 'submit' })
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('nativeType 已 deprecated'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('htmlType'))
      // 第二次 mount 同 prop：全局 Set 缓存，仍只 warn 1 次
      createShallowWrapper({ nativeType: 'submit' })
      expect(warn).toHaveBeenCalledTimes(1)
      warn.mockRestore()
    })

    it('round=true 显式传入触发 deprecation warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      createShallowWrapper({ round: true })
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('round 已 deprecated'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('shape="round"'))
      warn.mockRestore()
    })

    it('circle=true 显式传入触发 deprecation warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      createShallowWrapper({ circle: true })
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('circle 已 deprecated'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('shape="circle"'))
      warn.mockRestore()
    })
  })
})
