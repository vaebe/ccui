import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { BadgeRibbon } from '../index'

const ns = useNamespace('badge-ribbon', true)
const cls = useNamespace('badge-ribbon')

describe('badge-ribbon', () => {
  describe('基本渲染', () => {
    it('挂载基础 wrapper + ribbon DOM', () => {
      const wrapper = mount(BadgeRibbon, {
        props: { text: '新' },
        slots: { default: '<div class="box">内容</div>' },
      })
      expect(wrapper.find(ns.e('wrapper')).exists()).toBe(true)
      expect(wrapper.find(ns.b()).exists()).toBe(true)
      expect(wrapper.find('.box').exists()).toBe(true)
    })

    it('text prop 显示为缎带文字', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: 'HOT' } })
      expect(wrapper.find(ns.e('text')).text()).toBe('HOT')
    })

    it('text slot 优先于 text prop', () => {
      const wrapper = mount(BadgeRibbon, {
        props: { text: 'fallback' },
        slots: { text: '<b class="ant-text">自定义</b>' },
      })
      expect(wrapper.find(ns.e('text')).find('.ant-text').exists()).toBe(true)
      expect(wrapper.find(ns.e('text')).text()).toBe('自定义')
    })

    it('default slot 渲染', () => {
      const wrapper = mount(BadgeRibbon, {
        slots: { default: '<div class="content">被包裹</div>' },
      })
      expect(wrapper.find('.content').exists()).toBe(true)
    })

    it('corner 三角节点存在', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: 'X' } })
      expect(wrapper.find(ns.e('corner')).exists()).toBe(true)
    })
  })

  describe('placement', () => {
    it('默认 placement=end 加 --end modifier', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: '默认' } })
      expect(wrapper.find(ns.b()).classes()).toContain(cls.m('end'))
    })

    it('placement=start 加 --start modifier', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: '左', placement: 'start' } })
      expect(wrapper.find(ns.b()).classes()).toContain(cls.m('start'))
    })
  })

  describe('color', () => {
    it('color 不传时无 --color-* 也无 inline style', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: '默认' } })
      const ribbon = wrapper.find(ns.b())
      const hasPreset = ribbon.classes().some((c) => c.startsWith(cls.m('color-')))
      expect(hasPreset).toBe(false)
      expect(ribbon.attributes('style')).toBeUndefined()
    })

    it('预设色 red 加 --color-red modifier', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: 'X', color: 'red' } })
      expect(wrapper.find(ns.b()).classes()).toContain(cls.m('color-red'))
      // 预设色不挂 inline style
      expect(wrapper.find(ns.b()).attributes('style')).toBeUndefined()
    })

    it('预设色 blue 加 --color-blue modifier', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: 'X', color: 'blue' } })
      expect(wrapper.find(ns.b()).classes()).toContain(cls.m('color-blue'))
    })

    it('自定义色（#hex）写入 inline background-color', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: 'X', color: '#ff5500' } })
      const ribbon = wrapper.find(ns.b())
      const style = ribbon.attributes('style') ?? ''
      expect(style).toContain('background-color')
      expect(style).toContain('rgb(255, 85, 0)')
    })

    it('自定义色同时写入 corner inline color', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: 'X', color: '#ff5500' } })
      const corner = wrapper.find(ns.e('corner'))
      const style = corner.attributes('style') ?? ''
      expect(style).toContain('color')
    })

    it('自定义色不挂 --color-* modifier', () => {
      const wrapper = mount(BadgeRibbon, { props: { text: 'X', color: '#ff5500' } })
      const hasPreset = wrapper
        .find(ns.b())
        .classes()
        .some((c) => c.startsWith(cls.m('color-')))
      expect(hasPreset).toBe(false)
    })

    it('未知字符串（非预设、非看似颜色）作为 inline color 透传', () => {
      // 与 ant 行为一致：非预设名都当 CSS color 字面量
      const wrapper = mount(BadgeRibbon, { props: { text: 'X', color: 'hotpink' } })
      const style = wrapper.find(ns.b()).attributes('style') ?? ''
      expect(style).toContain('background-color')
    })
  })
})
