import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, expect, it, vi } from 'vite-plus/test'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import type { InputSearchProps } from '../index'
import { InputSearch } from '../index'

const ns = useNamespace('input-search', true)
const legacyPropsTypeCompatibility = {
  showPassword: true,
  prepend: 'before',
  append: 'after',
  showCount: true,
  variant: 'filled',
} satisfies Partial<InputSearchProps>
const focusRemovalCases: Array<{
  name: string
  props: Partial<InputSearchProps>
  selector: string
  removeProps: Partial<InputSearchProps>
  restoreProps: Partial<InputSearchProps>
}> = [
  {
    name: 'loading 卸载 inline search',
    props: {},
    selector: ns.e('inline-icon'),
    removeProps: { loading: true },
    restoreProps: { loading: false },
  },
  {
    name: 'modelValue 清空卸载 clear',
    props: { clearable: true, modelValue: 'query' },
    selector: ns.e('clear'),
    removeProps: { modelValue: '' },
    restoreProps: { modelValue: 'query' },
  },
  {
    name: 'disabled 卸载 clear',
    props: { clearable: true, modelValue: 'query' },
    selector: ns.e('clear'),
    removeProps: { disabled: true },
    restoreProps: { disabled: false },
  },
]

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

    it('保留历史 Input props 的类型和运行时识别兼容', () => {
      const wrapper = mount(InputSearch, { props: legacyPropsTypeCompatibility })
      expect(wrapper.props()).toMatchObject(legacyPropsTypeCompatibility)
      expect(wrapper.find('input').attributes('showpassword')).toBeUndefined()
      expect(wrapper.find('input').attributes('prepend')).toBeUndefined()
      expect(wrapper.find('input').attributes('append')).toBeUndefined()
      expect(wrapper.find('input').attributes('showcount')).toBeUndefined()
      expect(wrapper.find('input').attributes('variant')).toBeUndefined()
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

    it('显式空 modelValue 优先于 defaultValue', () => {
      const wrapper = mount(InputSearch, { props: { modelValue: '', defaultValue: 'preset' } })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
    })

    it('从缺省 modelValue 切换为显式空值时同步受控值', async () => {
      const wrapper = mount(InputSearch, { props: { defaultValue: 'preset' } })
      await wrapper.setProps({ modelValue: '' })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
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
      expect(btn.attributes('aria-label')).toBe('搜索')
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

    it('loading 时清除仍更新值但不触发 search', async () => {
      const wrapper = mount(InputSearch, { props: { clearable: true, modelValue: 'kw', loading: true } })
      await wrapper.find(ns.e('clear')).trigger('click')
      expect(wrapper.emitted('update:modelValue')).toEqual([['']])
      expect(wrapper.emitted('clear')).toEqual([[]])
      expect(wrapper.emitted('search')).toBeUndefined()
    })

    it('清除按钮也会触发 search("")', async () => {
      const wrapper = mount(InputSearch, { props: { clearable: true, modelValue: 'kw' } })
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
      expect(btn.attributes('aria-busy')).toBe('true')
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

  describe('clearable', () => {
    it('clearable=true 有内容时显示清除按钮', () => {
      const wrapper = mount(InputSearch, { props: { clearable: true, modelValue: 'x' } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
    })

    it('clearable=true 无内容时不显示', () => {
      const wrapper = mount(InputSearch, { props: { clearable: true, modelValue: '' } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
    })

    it('disabled 时不显示清除按钮', () => {
      const wrapper = mount(InputSearch, { props: { clearable: true, modelValue: 'x', disabled: true } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
    })

    it('点击清除按钮清空内容', async () => {
      const wrapper = mount(InputSearch, { props: { clearable: true, modelValue: 'x' } })
      await wrapper.find(ns.e('clear')).trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    })

    it('清除后把焦点恢复到输入框', async () => {
      const wrapper = mount(InputSearch, { attachTo: document.body, props: { clearable: true, modelValue: 'x' } })
      const input = wrapper.find('input')
      ;(input.element as HTMLInputElement).focus()
      await wrapper.find(ns.e('clear')).trigger('click')
      expect(document.activeElement).toBe(input.element)
      wrapper.unmount()
    })
  })

  describe('IME、原生属性与 FormItem', () => {
    it('IME 组合期间不提交中间值，compositionend 最终值只提交一次', async () => {
      const wrapper = mount(InputSearch)
      const input = wrapper.find('input')
      const element = input.element as HTMLInputElement

      element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
      element.value = 'h'
      await input.trigger('input')
      await input.trigger('keydown', { key: 'Enter', isComposing: true })
      expect(wrapper.emitted('input')).toBeUndefined()
      expect(wrapper.emitted('search')).toBeUndefined()

      element.value = '汉'
      element.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '汉' }))
      await input.trigger('input')
      expect(wrapper.emitted('input')).toEqual([['汉']])
      expect(wrapper.emitted('update:modelValue')).toEqual([['汉']])
    })

    it('把原生属性透传给 input，并将 class/style 保留在根节点', () => {
      const wrapper = mount(InputSearch, {
        attrs: {
          class: 'consumer-root',
          style: 'width: 240px',
          name: 'query',
          autocomplete: 'off',
          'aria-label': '站内搜索',
        },
      })
      const input = wrapper.find('input')
      expect(input.attributes('name')).toBe('query')
      expect(input.attributes('autocomplete')).toBe('off')
      expect(input.attributes('aria-label')).toBe('站内搜索')
      expect(input.classes()).not.toContain('consumer-root')
      expect(wrapper.classes()).toContain('consumer-root')
    })

    it('继承 FormItem 状态、描述，并在 change/blur 时触发校验', async () => {
      const validate = vi.fn(async () => true)
      const wrapper = mount(InputSearch, {
        attachTo: document.body,
        attrs: { 'aria-describedby': 'hint' },
        global: {
          provide: {
            [formItemInjectionKey as symbol]: {
              validateStatus: ref('error'),
              messageId: ref('field-error'),
              isInsideForm: true,
              validate,
            },
          },
        },
      })
      const input = wrapper.find('input')
      expect(wrapper.find(ns.m('status-error')).exists()).toBe(true)
      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toBe('hint field-error')

      await input.setValue('query')
      expect(validate).toHaveBeenCalledWith('change')
      ;(input.element as HTMLInputElement).focus()
      ;(input.element as HTMLInputElement).blur()
      await wrapper.vm.$nextTick()
      expect(validate).toHaveBeenCalledWith('blur')
      wrapper.unmount()
    })

    it('disabled 的内联搜索控件退出 Tab 顺序并暴露禁用状态', () => {
      const wrapper = mount(InputSearch, { props: { disabled: true } })
      const icon = wrapper.find(ns.e('inline-icon'))
      expect(icon.attributes('tabindex')).toBe('-1')
      expect(icon.attributes('aria-disabled')).toBe('true')
    })

    it.each(focusRemovalCases)(
      '$name 时恰好结算一次 blur，恢复后可再次 focus',
      async ({ props, selector, removeProps, restoreProps }) => {
        const validate = vi.fn(async (_trigger?: string) => true)
        const wrapper = mount(InputSearch, {
          attachTo: document.body,
          props,
          global: {
            provide: {
              [formItemInjectionKey as symbol]: {
                validateStatus: ref(''),
                isInsideForm: true,
                validate,
              },
            },
          },
        })

        ;(wrapper.find(selector).element as HTMLElement).focus()
        expect(wrapper.emitted('focus')).toHaveLength(1)
        await wrapper.setProps(removeProps)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('blur')).toHaveLength(1)
        expect(validate.mock.calls.filter(([trigger]) => trigger === 'blur')).toHaveLength(1)

        await wrapper.setProps(restoreProps)
        ;(wrapper.find('input').element as HTMLInputElement).focus()
        expect(wrapper.emitted('focus')).toHaveLength(2)
        expect(wrapper.emitted('blur')).toHaveLength(1)
        wrapper.unmount()
      },
    )
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
