import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { CheckableTag, CheckableTagGroup } from '../index'

const ns = useNamespace('checkable-tag', true)
const groupNs = useNamespace('checkable-tag-group', true)
const cls = useNamespace('checkable-tag')

describe('checkable-tag', () => {
  describe('单独使用', () => {
    it('挂载基础 DOM', () => {
      const wrapper = mount(CheckableTag, { slots: { default: '前端' } })
      expect(wrapper.find(ns.b()).exists()).toBe(true)
      expect(wrapper.text()).toBe('前端')
    })

    it('默认 checked=false 不加 --checked', () => {
      const wrapper = mount(CheckableTag, { slots: { default: '标签' } })
      expect(wrapper.find(ns.m('checked')).exists()).toBe(false)
    })

    it('checked=true 加 --checked + aria-checked=true', () => {
      const wrapper = mount(CheckableTag, { props: { checked: true }, slots: { default: '标签' } })
      expect(wrapper.find(ns.m('checked')).exists()).toBe(true)
      expect(wrapper.find(ns.b()).attributes('aria-checked')).toBe('true')
    })

    it('点击切换 + emit update:checked + change', async () => {
      const wrapper = mount(CheckableTag, { props: { checked: false }, slots: { default: '标签' } })
      await wrapper.find(ns.b()).trigger('click')
      expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
      expect(wrapper.emitted('change')?.[0]).toEqual([true])
    })

    it('父 checked 变化时同步内部状态', async () => {
      const wrapper = mount(CheckableTag, { props: { checked: false }, slots: { default: '标签' } })
      await wrapper.setProps({ checked: true })
      expect(wrapper.find(ns.m('checked')).exists()).toBe(true)
    })

    it('disabled 不响应 click', async () => {
      const wrapper = mount(CheckableTag, { props: { disabled: true }, slots: { default: '标签' } })
      await wrapper.find(ns.b()).trigger('click')
      expect(wrapper.emitted('update:checked')).toBeUndefined()
      expect(wrapper.find(ns.m('disabled')).exists()).toBe(true)
    })

    it('Space / Enter 切换 checked', async () => {
      const wrapper = mount(CheckableTag, { slots: { default: '标签' } })
      await wrapper.find(ns.b()).trigger('keydown', { key: ' ' })
      expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
      await wrapper.find(ns.b()).trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('update:checked')?.[1]).toEqual([false])
    })

    it('role=checkbox + tabindex=0', () => {
      const wrapper = mount(CheckableTag, { slots: { default: '标签' } })
      expect(wrapper.find(ns.b()).attributes('role')).toBe('checkbox')
      expect(wrapper.find(ns.b()).attributes('tabindex')).toBe('0')
    })
  })

  describe('CheckableTagGroup', () => {
    it('挂载基础 DOM', () => {
      const wrapper = mount(CheckableTagGroup, {
        props: { options: [{ label: 'A', value: 'a' }] },
      })
      expect(wrapper.find(groupNs.b()).exists()).toBe(true)
      expect(wrapper.findAll(ns.b()).length).toBe(1)
    })

    it('options 渲染并响应 click toggle', async () => {
      const wrapper = mount(CheckableTagGroup, {
        props: {
          modelValue: [],
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
            { label: 'C', value: 'c' },
          ],
        },
      })
      const tags = wrapper.findAll(ns.b())
      await tags[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b']])
      expect(wrapper.emitted('change')?.[0]).toEqual([['b']])
    })

    it('modelValue 受控渲染选中态', () => {
      const wrapper = mount(CheckableTagGroup, {
        props: {
          modelValue: ['b'],
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
          ],
        },
      })
      const tags = wrapper.findAll(ns.b())
      expect(tags[0].classes()).not.toContain(cls.m('checked'))
      expect(tags[1].classes()).toContain(cls.m('checked'))
    })

    it('再次点击已选项取消勾选', async () => {
      const wrapper = mount(CheckableTagGroup, {
        props: { modelValue: ['a'], options: [{ label: 'A', value: 'a' }] },
      })
      await wrapper.find(ns.b()).trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    })

    it('group disabled 时子标签全部 disabled 且不响应', async () => {
      const wrapper = mount(CheckableTagGroup, {
        props: {
          modelValue: [],
          disabled: true,
          options: [{ label: 'A', value: 'a' }],
        },
      })
      const tag = wrapper.find(ns.b())
      await tag.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(tag.classes()).toContain(cls.m('disabled'))
    })

    it('option.disabled 单独禁用子标签', async () => {
      const wrapper = mount(CheckableTagGroup, {
        props: {
          modelValue: [],
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b', disabled: true },
          ],
        },
      })
      const tags = wrapper.findAll(ns.b())
      await tags[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      // A 仍可点
      await tags[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']])
    })

    it('maxCount 达到上限后未勾选项不可勾', async () => {
      const wrapper = mount(CheckableTagGroup, {
        props: {
          modelValue: ['a'],
          maxCount: 1,
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
          ],
        },
      })
      const tags = wrapper.findAll(ns.b())
      // 点未勾的 B：被忽略
      await tags[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      // 点已勾的 A：可以取消
      await tags[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    })

    it('默认 slot 与 CheckableTag 子组件配合', async () => {
      const wrapper = mount(CheckableTagGroup, {
        props: { modelValue: [] },
        slots: {
          default: () => [
            h(CheckableTag, { value: 'x' }, { default: () => 'X' }),
            h(CheckableTag, { value: 'y' }, { default: () => 'Y' }),
          ],
        },
      })
      const tags = wrapper.findAll(ns.b())
      expect(tags.length).toBe(2)
      await tags[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['x']])
    })

    it('父 modelValue 变化时各子标签同步勾选态', async () => {
      const wrapper = mount(CheckableTagGroup, {
        props: {
          modelValue: ['a'],
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
          ],
        },
      })
      await wrapper.setProps({ modelValue: ['b'] })
      const tags = wrapper.findAll(ns.b())
      expect(tags[0].classes()).not.toContain(cls.m('checked'))
      expect(tags[1].classes()).toContain(cls.m('checked'))
    })

    it('size 透传到子标签', () => {
      const wrapper = mount(CheckableTagGroup, {
        props: { size: 'large', options: [{ label: 'A', value: 'a' }] },
      })
      expect(wrapper.find(ns.b()).classes()).toContain(cls.m('large'))
    })
  })
})
