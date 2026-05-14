import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { InputSearch } from '../index'

const ns = useNamespace('input-search', true)

describe('input-search', () => {
  describe('基本渲染', () => {
    it('挂载基础 DOM', () => {
      const wrapper = mount(InputSearch)
      expect(wrapper.find(ns.b()).exists()).toBe(true)
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('placeholder 透传', () => {
      const wrapper = mount(InputSearch, { props: { placeholder: '请搜索' } })
      expect(wrapper.find('input').attributes('placeholder')).toBe('请搜索')
    })

    it('disabled 渲染 + 类', () => {
      const wrapper = mount(InputSearch, { props: { disabled: true } })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.find(ns.m('disabled')).exists()).toBe(true)
    })

    it('readonly 渲染 + 类', () => {
      const wrapper = mount(InputSearch, { props: { readonly: true } })
      expect(wrapper.find('input').attributes('readonly')).toBeDefined()
      expect(wrapper.find(ns.m('readonly')).exists()).toBe(true)
    })

    it('size=large 加 --large', () => {
      const wrapper = mount(InputSearch, { props: { size: 'large' } })
      expect(wrapper.find(ns.m('large')).exists()).toBe(true)
    })
  })

  describe('v-model + defaultValue', () => {
    it('modelValue 初始值', () => {
      const wrapper = mount(InputSearch, { props: { modelValue: 'hello' } })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('hello')
    })

    it('defaultValue 在未传 modelValue 时生效', () => {
      const wrapper = mount(InputSearch, { props: { defaultValue: 'preset' } })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('preset')
    })

    it('输入触发 update:modelValue + input', async () => {
      const wrapper = mount(InputSearch)
      const input = wrapper.find('input')
      ;(input.element as HTMLInputElement).value = 'typed'
      await input.trigger('input')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['typed'])
      expect(wrapper.emitted('input')?.[0]).toEqual(['typed'])
    })

    it('父 modelValue 变化时内部值同步', async () => {
      const wrapper = mount(InputSearch, { props: { modelValue: 'a' } })
      await wrapper.setProps({ modelValue: 'b' })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('b')
    })
  })

  describe('enterButton', () => {
    it('enterButton=false（默认）不渲染按钮，只在 suffix 显示放大镜', () => {
      const wrapper = mount(InputSearch)
      expect(wrapper.find(ns.e('button')).exists()).toBe(false)
      expect(wrapper.find(ns.e('inline-icon')).exists()).toBe(true)
    })

    it('enterButton=true 渲染按钮（图标态）', () => {
      const wrapper = mount(InputSearch, { props: { enterButton: true } })
      const btn = wrapper.find(ns.e('button'))
      expect(btn.exists()).toBe(true)
      expect(wrapper.find(ns.em('button', 'icon-only')).exists()).toBe(true)
    })

    it('enterButton="搜索" 渲染文字按钮', () => {
      const wrapper = mount(InputSearch, { props: { enterButton: '搜索' } })
      const btn = wrapper.find(ns.e('button'))
      expect(btn.exists()).toBe(true)
      expect(btn.text()).toBe('搜索')
    })

    it('enter-button slot 优先于 enterButton 字符串', () => {
      const wrapper = mount(InputSearch, {
        props: { enterButton: '默认' },
        slots: { 'enter-button': '<span class="my-btn">自定义</span>' },
      })
      const btn = wrapper.find(ns.e('button'))
      expect(btn.find('.my-btn').exists()).toBe(true)
    })

    it('有 enterButton 时 wrap 加 --with-button 类', () => {
      const wrapper = mount(InputSearch, { props: { enterButton: true } })
      expect(wrapper.find(ns.m('with-button')).exists()).toBe(true)
    })
  })

  describe('@search 事件', () => {
    it('点击 enterButton 触发 search', async () => {
      const wrapper = mount(InputSearch, { props: { enterButton: true, modelValue: 'kw' } })
      await wrapper.find(ns.e('button')).trigger('click')
      const emitted = wrapper.emitted('search')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toBe('kw')
    })

    it('按 Enter 触发 search + press-enter', async () => {
      const wrapper = mount(InputSearch, { props: { modelValue: 'kw' } })
      await wrapper.find('input').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('press-enter')).toBeTruthy()
      const emitted = wrapper.emitted('search')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toBe('kw')
    })

    it('点击 suffix 的放大镜（无按钮时）触发 search', async () => {
      const wrapper = mount(InputSearch, { props: { modelValue: 'kw' } })
      await wrapper.find(ns.e('inline-icon')).trigger('click')
      const emitted = wrapper.emitted('search')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toBe('kw')
    })

    it('disabled 时点击按钮不触发 search', async () => {
      const wrapper = mount(InputSearch, { props: { enterButton: true, modelValue: 'kw', disabled: true } })
      await wrapper.find(ns.e('button')).trigger('click')
      expect(wrapper.emitted('search')).toBeUndefined()
    })

    it('loading 时点击按钮不触发 search', async () => {
      const wrapper = mount(InputSearch, { props: { enterButton: true, modelValue: 'kw', loading: true } })
      await wrapper.find(ns.e('button')).trigger('click')
      expect(wrapper.emitted('search')).toBeUndefined()
    })

    it('清除按钮也会触发 search("")', async () => {
      const wrapper = mount(InputSearch, { props: { allowClear: true, modelValue: 'kw' } })
      await wrapper.find(ns.e('clear')).trigger('click')
      expect(wrapper.emitted('clear')).toBeTruthy()
      const emitted = wrapper.emitted('search')
      expect(emitted).toBeTruthy()
      expect(emitted![emitted!.length - 1][0]).toBe('')
    })
  })

  describe('loading', () => {
    it('loading=true 时按钮渲染 loading 图标', () => {
      const wrapper = mount(InputSearch, { props: { enterButton: true, loading: true } })
      const btn = wrapper.find(ns.e('button'))
      expect(btn.find(ns.e('loading-icon')).exists()).toBe(true)
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('loading=true 且无按钮时 suffix 渲染 loading 图标', () => {
      const wrapper = mount(InputSearch, { props: { loading: true } })
      expect(wrapper.find(ns.e('loading-icon')).exists()).toBe(true)
    })
  })

  describe('status', () => {
    it('status="error" 加 --status-error', () => {
      const wrapper = mount(InputSearch, { props: { status: 'error' } })
      expect(wrapper.find(ns.m('status-error')).exists()).toBe(true)
    })

    it('status="warning" 加 --status-warning', () => {
      const wrapper = mount(InputSearch, { props: { status: 'warning' } })
      expect(wrapper.find(ns.m('status-warning')).exists()).toBe(true)
    })
  })

  describe('allowClear', () => {
    it('allowClear=true 有内容时显示清除按钮', () => {
      const wrapper = mount(InputSearch, { props: { allowClear: true, modelValue: 'x' } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
    })

    it('allowClear=true 无内容时不显示', () => {
      const wrapper = mount(InputSearch, { props: { allowClear: true, modelValue: '' } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
    })

    it('disabled 时不显示清除按钮', () => {
      const wrapper = mount(InputSearch, { props: { allowClear: true, modelValue: 'x', disabled: true } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
    })

    it('点击清除按钮清空内容', async () => {
      const wrapper = mount(InputSearch, { props: { allowClear: true, modelValue: 'x' } })
      await wrapper.find(ns.e('clear')).trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    })
  })

  describe('prefix / suffix slot', () => {
    it('prefix slot 渲染', () => {
      const wrapper = mount(InputSearch, {
        slots: { prefix: '<span class="my-prefix">@</span>' },
      })
      expect(wrapper.find('.my-prefix').exists()).toBe(true)
    })

    it('suffix slot 在无按钮时与放大镜共存', () => {
      const wrapper = mount(InputSearch, {
        slots: { suffix: '<span class="my-suffix">.com</span>' },
      })
      expect(wrapper.find('.my-suffix').exists()).toBe(true)
      expect(wrapper.find(ns.e('inline-icon')).exists()).toBe(true)
    })
  })
})
