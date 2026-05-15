import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { h, nextTick } from 'vue'
import { Avatar } from '../../avatar'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { AvatarGroup } from '../index'

const ns = useNamespace('avatar-group', true)
const cls = useNamespace('avatar-group')

function makeAvatars(n: number) {
  return Array.from({ length: n }, (_, i) => h(Avatar, { name: `U${i + 1}`, width: 32, height: 32, key: i }))
}

describe('avatar-group', () => {
  describe('基本渲染', () => {
    it('挂载基础 DOM', () => {
      const wrapper = mount(AvatarGroup, {
        slots: { default: () => makeAvatars(3) },
      })
      expect(wrapper.find(ns.b()).exists()).toBe(true)
    })

    it('不设 maxCount 时全部展示，无 +N', () => {
      const wrapper = mount(AvatarGroup, {
        slots: { default: () => makeAvatars(4) },
      })
      expect(wrapper.find(ns.e('overflow')).exists()).toBe(false)
    })

    it('role=group', () => {
      const wrapper = mount(AvatarGroup)
      expect(wrapper.find(ns.b()).attributes('role')).toBe('group')
    })
  })

  describe('maxCount', () => {
    it('总数 ≤ maxCount 时不渲染 +N', () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 5 },
        slots: { default: () => makeAvatars(3) },
      })
      expect(wrapper.find(ns.e('overflow')).exists()).toBe(false)
    })

    it('超出时显示 +N，N=剩余数', () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 3 },
        slots: { default: () => makeAvatars(7) },
      })
      const overflow = wrapper.find(ns.e('overflow'))
      expect(overflow.exists()).toBe(true)
      expect(overflow.text()).toBe('+4')
    })

    it('maxCount=0 时全部移入 +N（边界）', () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 0 },
        slots: { default: () => makeAvatars(3) },
      })
      const overflow = wrapper.find(ns.e('overflow'))
      expect(overflow.exists()).toBe(true)
      expect(overflow.text()).toBe('+3')
    })

    it('maxStyle 应用到 +N 节点', () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 2, maxStyle: { backgroundColor: '#f56a00', color: '#fff' } },
        slots: { default: () => makeAvatars(5) },
      })
      const overflow = wrapper.find(ns.e('overflow'))
      const style = overflow.attributes('style') ?? ''
      expect(style).toContain('background-color')
    })

    it('shape=square 时 +N 用方形圆角', () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 2, shape: 'square' },
        slots: { default: () => makeAvatars(5) },
      })
      const overflow = wrapper.find(ns.e('overflow'))
      const style = overflow.attributes('style') ?? ''
      expect(style).toContain('border-radius: 4px')
    })

    it('size=number 透传到 +N 尺寸', () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 2, size: 48 },
        slots: { default: () => makeAvatars(5) },
      })
      const overflow = wrapper.find(ns.e('overflow'))
      const style = overflow.attributes('style') ?? ''
      expect(style).toContain('width: 48px')
      expect(style).toContain('height: 48px')
    })
  })

  describe('maxPopoverTrigger=hover', () => {
    it('mouseenter 显示 popover，mouseleave 隐藏', async () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 2 },
        slots: { default: () => makeAvatars(5) },
      })
      const overflow = wrapper.find(ns.e('overflow'))
      await overflow.trigger('mouseenter')
      await nextTick()
      expect(wrapper.find(ns.e('popover')).exists()).toBe(true)
      await overflow.trigger('mouseleave')
      await nextTick()
      expect(wrapper.find(ns.e('popover')).exists()).toBe(false)
    })

    it('popover 内显示隐藏的 avatar 数量', async () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 2 },
        slots: { default: () => makeAvatars(5) },
      })
      await wrapper.find(ns.e('overflow')).trigger('mouseenter')
      await nextTick()
      const popover = wrapper.find(ns.e('popover'))
      // popover 内有 3 个隐藏 avatar
      const avatars = popover.findAll(`.${useNamespace('avatar').b()}`)
      expect(avatars.length).toBe(3)
    })
  })

  describe('maxPopoverTrigger=click', () => {
    it('click 切换 popover 显示', async () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 2, maxPopoverTrigger: 'click' },
        slots: { default: () => makeAvatars(5) },
      })
      const overflow = wrapper.find(ns.e('overflow'))
      await overflow.trigger('click')
      expect(wrapper.find(ns.e('popover')).exists()).toBe(true)
      await overflow.trigger('click')
      expect(wrapper.find(ns.e('popover')).exists()).toBe(false)
    })
  })

  describe('maxPopoverTrigger=focus', () => {
    it('focus / blur 切换 popover + tabindex=0', async () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 2, maxPopoverTrigger: 'focus' },
        slots: { default: () => makeAvatars(5) },
      })
      const overflow = wrapper.find(ns.e('overflow'))
      expect(overflow.attributes('tabindex')).toBe('0')
      await overflow.trigger('focus')
      expect(wrapper.find(ns.e('popover')).exists()).toBe(true)
      await overflow.trigger('blur')
      expect(wrapper.find(ns.e('popover')).exists()).toBe(false)
    })
  })

  describe('maxPopoverPlacement', () => {
    it('placement=bottom 加 --bottom modifier', async () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 2, maxPopoverPlacement: 'bottom' },
        slots: { default: () => makeAvatars(5) },
      })
      await wrapper.find(ns.e('overflow')).trigger('mouseenter')
      await nextTick()
      const popover = wrapper.find(ns.e('popover'))
      expect(popover.classes()).toContain(cls.em('popover', 'bottom'))
    })

    it('placement=right-start 加 --right-start modifier', async () => {
      const wrapper = mount(AvatarGroup, {
        props: { maxCount: 2, maxPopoverPlacement: 'right-start' },
        slots: { default: () => makeAvatars(5) },
      })
      await wrapper.find(ns.e('overflow')).trigger('mouseenter')
      await nextTick()
      expect(wrapper.find(ns.e('popover')).classes()).toContain(cls.em('popover', 'right-start'))
    })
  })
})
