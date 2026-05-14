import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Textarea } from '../index'

const ns = useNamespace('textarea', true)

describe('textarea', () => {
  describe('基本渲染', () => {
    it('挂载基础 DOM', () => {
      const wrapper = mount(Textarea)
      expect(wrapper.find(ns.b()).exists()).toBe(true)
      expect(wrapper.find('textarea').exists()).toBe(true)
    })

    it('placeholder 透传', () => {
      const wrapper = mount(Textarea, { props: { placeholder: '请输入' } })
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('请输入')
    })

    it('disabled 渲染禁用 + 类', () => {
      const wrapper = mount(Textarea, { props: { disabled: true } })
      expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
      expect(wrapper.find(ns.m('disabled')).exists()).toBe(true)
    })

    it('readonly 渲染只读 + 类', () => {
      const wrapper = mount(Textarea, { props: { readonly: true } })
      expect(wrapper.find('textarea').attributes('readonly')).toBeDefined()
      expect(wrapper.find(ns.m('readonly')).exists()).toBe(true)
    })

    it('rows 透传 native rows', () => {
      const wrapper = mount(Textarea, { props: { rows: 5 } })
      expect(wrapper.find('textarea').attributes('rows')).toBe('5')
    })

    it('autoSize=true 时不传 rows（让 inline height 接管）', () => {
      const wrapper = mount(Textarea, { props: { autoSize: true, rows: 5 } })
      expect(wrapper.find('textarea').attributes('rows')).toBeUndefined()
    })
  })

  describe('v-model + defaultValue', () => {
    it('modelValue 初始值显示', () => {
      const wrapper = mount(Textarea, { props: { modelValue: 'hello' } })
      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('hello')
    })

    it('未传 modelValue 时 defaultValue 作为初值', () => {
      const wrapper = mount(Textarea, { props: { defaultValue: 'preset' } })
      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('preset')
    })

    it('显式 modelValue 优先于 defaultValue', () => {
      const wrapper = mount(Textarea, { props: { modelValue: 'real', defaultValue: 'preset' } })
      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('real')
    })

    it('input 触发 update:modelValue + input 双事件', async () => {
      const wrapper = mount(Textarea)
      const ta = wrapper.find('textarea').element as HTMLTextAreaElement
      ta.value = 'typed'
      await wrapper.find('textarea').trigger('input')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['typed'])
      expect(wrapper.emitted('input')?.[0]).toEqual(['typed'])
    })

    it('change 事件透传', async () => {
      const wrapper = mount(Textarea, { props: { modelValue: 'x' } })
      await wrapper.find('textarea').trigger('change')
      expect(wrapper.emitted('change')).toBeTruthy()
    })

    it('父 modelValue 变化时内部值同步', async () => {
      const wrapper = mount(Textarea, { props: { modelValue: 'a' } })
      await wrapper.setProps({ modelValue: 'b' })
      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('b')
    })
  })

  describe('focus / blur', () => {
    it('focus / blur 事件透传', async () => {
      const wrapper = mount(Textarea)
      await wrapper.find('textarea').trigger('focus')
      await wrapper.find('textarea').trigger('blur')
      expect(wrapper.emitted('focus')).toBeTruthy()
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('press-enter', () => {
    it('Enter 触发 press-enter', async () => {
      const wrapper = mount(Textarea)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('press-enter')).toBeTruthy()
    })

    it('Shift+Enter 不触发 press-enter（保留换行行为）', async () => {
      const wrapper = mount(Textarea)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter', shiftKey: true })
      expect(wrapper.emitted('press-enter')).toBeUndefined()
    })

    it('非 Enter 键不触发', async () => {
      const wrapper = mount(Textarea)
      await wrapper.find('textarea').trigger('keydown', { key: 'a' })
      expect(wrapper.emitted('press-enter')).toBeUndefined()
    })
  })

  describe('allowClear', () => {
    it('allowClear=true 且有内容时显示清除按钮', () => {
      const wrapper = mount(Textarea, { props: { allowClear: true, modelValue: 'x' } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
    })

    it('allowClear=true 但内容为空时不显示', () => {
      const wrapper = mount(Textarea, { props: { allowClear: true, modelValue: '' } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
    })

    it('点击清除按钮清空 + emit clear', async () => {
      const wrapper = mount(Textarea, { props: { allowClear: true, modelValue: 'x' } })
      await wrapper.find(ns.e('clear')).trigger('click')
      expect(wrapper.emitted('clear')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    })

    it('allowClear={ clearIcon } 用 Iconify name', () => {
      const wrapper = mount(Textarea, {
        props: { allowClear: { clearIcon: 'mdi:close-circle' }, modelValue: 'x' },
      })
      const clearWrap = wrapper.find(ns.e('clear'))
      expect(clearWrap.exists()).toBe(true)
      expect(clearWrap.html()).toContain('svg')
    })

    it('disabled 时不显示清除按钮', () => {
      const wrapper = mount(Textarea, { props: { allowClear: true, modelValue: 'x', disabled: true } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
    })

    it('readonly 时不显示清除按钮', () => {
      const wrapper = mount(Textarea, { props: { allowClear: true, modelValue: 'x', readonly: true } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
    })
  })

  describe('showCount / maxLength', () => {
    it('showCount=true 显示字符计数', () => {
      const wrapper = mount(Textarea, { props: { showCount: true, modelValue: 'hello' } })
      expect(wrapper.find(ns.e('count')).text()).toBe('5')
    })

    it('showCount=true 配合 maxLength 显示 n / max', () => {
      const wrapper = mount(Textarea, { props: { showCount: true, maxLength: 20, modelValue: 'hi' } })
      expect(wrapper.find(ns.e('count')).text()).toBe('2 / 20')
    })

    it('showCount={ formatter } 自定义格式', () => {
      const wrapper = mount(Textarea, {
        props: {
          showCount: { formatter: ({ count, maxLength }) => `${count}字 / ${maxLength}` },
          maxLength: 100,
          modelValue: 'abc',
        },
      })
      expect(wrapper.find(ns.e('count')).text()).toBe('3字 / 100')
    })

    it('maxLength 透传原生 maxlength', () => {
      const wrapper = mount(Textarea, { props: { maxLength: 10 } })
      expect(wrapper.find('textarea').attributes('maxlength')).toBe('10')
    })
  })

  describe('status', () => {
    it('status="error" 加 --status-error', () => {
      const wrapper = mount(Textarea, { props: { status: 'error' } })
      expect(wrapper.find(ns.m('status-error')).exists()).toBe(true)
    })

    it('status="warning" 加 --status-warning', () => {
      const wrapper = mount(Textarea, { props: { status: 'warning' } })
      expect(wrapper.find(ns.m('status-warning')).exists()).toBe(true)
    })
  })

  describe('autoSize', () => {
    // jsdom 的 scrollHeight 总是 0，没法测出实际高度变化；这里只测 enabled 时关闭 resize、关闭时恢复
    it('autoSize=true 强制 resize:none', () => {
      const wrapper = mount(Textarea, { props: { autoSize: true } })
      expect(wrapper.find('textarea').attributes('style')).toContain('resize: none')
    })

    it('autoSize=false（默认）用 resize prop', () => {
      const wrapper = mount(Textarea, { props: { resize: 'horizontal' } })
      expect(wrapper.find('textarea').attributes('style')).toContain('resize: horizontal')
    })

    it('autoSize 切换时不破坏渲染', async () => {
      const wrapper = mount(Textarea, { props: { autoSize: false } })
      await wrapper.setProps({ autoSize: { minRows: 2, maxRows: 6 } })
      await nextTick()
      expect(wrapper.find('textarea').exists()).toBe(true)
    })
  })

  describe('size', () => {
    it('size=large 加 --large', () => {
      const wrapper = mount(Textarea, { props: { size: 'large' } })
      expect(wrapper.find(ns.m('large')).exists()).toBe(true)
    })

    it('size=small 加 --small', () => {
      const wrapper = mount(Textarea, { props: { size: 'small' } })
      expect(wrapper.find(ns.m('small')).exists()).toBe(true)
    })
  })

  describe('suffix slot', () => {
    it('suffix slot 渲染', () => {
      const wrapper = mount(Textarea, {
        slots: { suffix: '<span class="my-suffix">.txt</span>' },
      })
      expect(wrapper.find('.my-suffix').exists()).toBe(true)
    })
  })
})
