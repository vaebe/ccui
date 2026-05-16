import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { __resetDeprecatedWarningsForTest } from '../../shared/utils/deprecated'
import { Tag } from '../index'

const ns = useNamespace('tag', true)

describe('tag', () => {
  it('renders default content', () => {
    const wrapper = mount(Tag, { slots: { default: 'tag1' } })
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.text()).toContain('tag1')
  })

  it('applies preset color modifier', () => {
    const wrapper = mount(Tag, { props: { color: 'success' }, slots: { default: 'ok' } })
    expect(wrapper.find(ns.m('success')).exists()).toBe(true)
  })

  it('applies inline style for custom color', () => {
    const wrapper = mount(Tag, { props: { color: '#ff7875' }, slots: { default: 'x' } })
    const style = wrapper.find(ns.b()).attributes('style') ?? ''
    expect(style).toContain('background-color')
  })

  it('emits close event when closable', async () => {
    const wrapper = mount(Tag, { props: { closable: true }, slots: { default: 'x' } })
    await wrapper.find(ns.e('close')).trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('borderless modifier (legacy bordered=false 兼容)', () => {
    const wrapper = mount(Tag, { props: { bordered: false }, slots: { default: 'x' } })
    expect(wrapper.find(ns.m('borderless')).exists()).toBe(true)
    // 兼容路径：bordered=false 等价 variant='filled'
    expect(wrapper.find(ns.m('variant-filled')).exists()).toBe(true)
  })

  it('variant=outlined（默认）渲染 outlined class，无 borderless', () => {
    const wrapper = mount(Tag, { slots: { default: 'x' } })
    expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
    expect(wrapper.find(ns.m('borderless')).exists()).toBe(false)
  })

  it('variant=solid 渲染 solid class + borderless（无外边框）', () => {
    const wrapper = mount(Tag, { props: { variant: 'solid' }, slots: { default: 'x' } })
    expect(wrapper.find(ns.m('variant-solid')).exists()).toBe(true)
    expect(wrapper.find(ns.m('borderless')).exists()).toBe(true)
  })

  it('variant 显式传值优先于 bordered=false', () => {
    const wrapper = mount(Tag, {
      props: { variant: 'outlined', bordered: false },
      slots: { default: 'x' },
    })
    // variant 显式 outlined → 仍然渲染 outlined，不退回 filled
    expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
    expect(wrapper.find(ns.m('borderless')).exists()).toBe(false)
  })

  describe('deprecation warn', () => {
    beforeEach(() => {
      __resetDeprecatedWarningsForTest()
    })

    it('bordered 显式传入触发 deprecation warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(Tag, { props: { bordered: false }, slots: { default: 'x' } })
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('bordered 已 deprecated'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('variant'))
      // 第二次 mount 同 prop：全局 Set 缓存，仍只 warn 1 次
      mount(Tag, { props: { bordered: true }, slots: { default: 'y' } })
      expect(warn).toHaveBeenCalledTimes(1)
      warn.mockRestore()
    })

    it('不传 bordered 不 warn', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(Tag, { slots: { default: 'x' } })
      expect(warn).not.toHaveBeenCalled()
      warn.mockRestore()
    })
  })
})
