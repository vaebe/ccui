import type { InputSize } from '../src/input-types'
import { mount, shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, expect, it, vi } from 'vite-plus/test'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Input } from '../index'

const ns = useNamespace('input', true)
const baseClass = ns.b()
const _wrapperClass = ns.e('wrapper')
function getSizeClass(type: InputSize) {
  return ns.em('wrapper', type)
}

// 测试辅助函数
function createWrapper(props = {}) {
  return mount(Input, { props })
}

function createShallowWrapper(props = {}) {
  return shallowMount(Input, { props })
}

describe('input', () => {
  it('dom', () => {
    const wrapper = createShallowWrapper({ modelValue: 'test' })
    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    expect(wrapper.find('input').exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('type', async () => {
    const wrapper = createShallowWrapper({ type: 'text' })
    expect(wrapper.find('input').attributes('type')).toBe('text')

    await wrapper.setProps({ type: 'password' })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('size', async () => {
    const wrapper = createShallowWrapper({ size: 'small' })
    expect(wrapper.find(getSizeClass('small')).exists()).toBeTruthy()

    await wrapper.setProps({ size: 'large' })
    expect(wrapper.find(getSizeClass('large')).exists()).toBeTruthy()
  })

  it('placeholder', async () => {
    const wrapper = createShallowWrapper({ placeholder: '请输入内容' })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入内容')
  })

  it('disabled', async () => {
    const wrapper = createShallowWrapper({ disabled: true })
    const disabledClass = ns.m('disabled').substring(1)
    expect(wrapper.find('input').classes()).toContain(disabledClass)
    expect(wrapper.find('input').attributes('disabled')).toBe('')
  })

  it('readonly', async () => {
    const wrapper = createShallowWrapper({ readonly: true })
    expect(wrapper.find('input').attributes('readonly')).toBe('')
  })

  it('clearable', async () => {
    const wrapper = createShallowWrapper({ clearable: true, modelValue: 'test' })
    expect(wrapper.find(ns.e('clear')).exists()).toBeTruthy()
  })

  it('prepend', async () => {
    const wrapper = createShallowWrapper({ prepend: 'http://' })
    expect(wrapper.find(ns.e('prepend')).exists()).toBeTruthy()
    expect(wrapper.find(ns.e('prepend')).text()).toBe('http://')
  })

  it('append', async () => {
    const wrapper = createShallowWrapper({ append: '.com' })
    expect(wrapper.find(ns.e('append')).exists()).toBeTruthy()
    expect(wrapper.find(ns.e('append')).text()).toBe('.com')
  })

  it('emits input event when input value changes', async () => {
    const handleInput = vi.fn()
    const wrapper = createWrapper({ onInput: handleInput })
    const input = wrapper.find('input')
    await input.setValue('test')
    expect(handleInput).toBeCalled()
    wrapper.unmount()
  })

  it('emits change event when input value changes and loses focus', async () => {
    const handleChange = vi.fn()
    const wrapper = createWrapper({ onChange: handleChange })
    const input = wrapper.find('input')
    await input.setValue('test')
    await input.trigger('change')
    expect(handleChange).toBeCalled()
    wrapper.unmount()
  })

  it('emits focus and blur events', async () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    const wrapper = createWrapper({ onFocus: handleFocus, onBlur: handleBlur })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(handleFocus).toBeCalled()
    await input.trigger('blur')
    expect(handleBlur).toBeCalled()
    wrapper.unmount()
  })

  it('clears input value when clear icon is clicked', async () => {
    const handleClear = vi.fn()
    const wrapper = createWrapper({
      clearable: true,
      modelValue: 'test',
      onClear: handleClear,
    })
    const clearIcon = wrapper.find(ns.e('clear'))
    await clearIcon.trigger('click')
    expect(handleClear).toBeCalled()
    expect(wrapper.find('input').element.value).toBe('')
    wrapper.unmount()
  })

  it('toggles password visibility when showPassword is true', async () => {
    const wrapper = createWrapper({
      type: 'password',
      showPassword: true,
      modelValue: 'test',
    })

    expect(wrapper.find(ns.e('password-hidden')).exists()).toBeTruthy()

    const passwordIcon = wrapper.find(ns.e('password-hidden'))
    await passwordIcon.trigger('click')
    expect(wrapper.find(ns.e('password-visible')).exists()).toBeTruthy()

    const passwordIcon2 = wrapper.find(ns.e('password-visible'))
    await passwordIcon2.trigger('click')
    expect(wrapper.find(ns.e('password-hidden')).exists()).toBeTruthy()

    wrapper.unmount()
  })

  // ─────────────────────────────────────────────────────────────
  // L-1.2: Ant Design API alignment
  // ─────────────────────────────────────────────────────────────

  describe('allowClear（Ant 主名）', () => {
    it('allowClear=true 等价于旧 clearable=true', async () => {
      const wrapper = mount(Input, { props: { allowClear: true, modelValue: 'hello' } })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
      wrapper.unmount()
    })

    it('allowClear={ clearIcon: "mdi:close-circle" } 用 Iconify 自定义图标', () => {
      const wrapper = mount(Input, {
        props: { allowClear: { clearIcon: 'mdi:close-circle' }, modelValue: 'x' },
      })
      const clearWrap = wrapper.find(ns.e('clear'))
      expect(clearWrap.exists()).toBe(true)
      // Iconify 渲染会注入 svg
      expect(clearWrap.html()).toContain('svg')
      wrapper.unmount()
    })

    it('显式 allowClear 优先于旧 clearable', () => {
      // allowClear=false 显式关 → 旧 clearable=true 也不生效
      const wrapper = mount(Input, {
        props: { allowClear: false, clearable: true, modelValue: 'x' },
      })
      expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('addonBefore / addonAfter（Ant 主名）', () => {
    it('addonBefore prop 渲染左侧 addon', () => {
      const wrapper = mount(Input, { props: { addonBefore: 'Http://' } })
      expect(wrapper.find(ns.e('prepend')).text()).toBe('Http://')
      wrapper.unmount()
    })

    it('addon-before slot 优先于 prop', () => {
      const wrapper = mount(Input, {
        props: { addonBefore: 'fallback' },
        slots: { 'addon-before': '<i class="custom-icon">@</i>' },
      })
      const prepend = wrapper.find(ns.e('prepend'))
      expect(prepend.find('.custom-icon').exists()).toBe(true)
      expect(prepend.text()).not.toContain('fallback')
      wrapper.unmount()
    })

    it('旧 prepend prop 仍兼容', () => {
      const wrapper = mount(Input, { props: { prepend: 'old' } })
      expect(wrapper.find(ns.e('prepend')).text()).toBe('old')
      wrapper.unmount()
    })

    it('addonAfter prop + addon-after slot 行为对称', () => {
      const w1 = mount(Input, { props: { addonAfter: '.com' } })
      expect(w1.find(ns.e('append')).text()).toBe('.com')

      const w2 = mount(Input, {
        slots: { 'addon-after': '<i class="suffix-icon">$</i>' },
      })
      expect(w2.find(ns.e('append')).find('.suffix-icon').exists()).toBe(true)
    })
  })

  describe('prefix / suffix slot', () => {
    it('prefix slot 渲染', () => {
      const wrapper = mount(Input, {
        slots: { prefix: '<i class="user-icon"></i>' },
      })
      expect(wrapper.find(ns.e('prefix')).find('.user-icon').exists()).toBe(true)
      wrapper.unmount()
    })

    it('suffix slot 渲染', () => {
      const wrapper = mount(Input, {
        slots: { suffix: '<i class="eye-icon"></i>' },
      })
      expect(wrapper.find(ns.e('suffix')).find('.eye-icon').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('showCount / maxLength', () => {
    it('showCount=true 显示字符计数', () => {
      const wrapper = mount(Input, { props: { showCount: true, modelValue: 'hello' } })
      expect(wrapper.find(ns.e('count')).text()).toBe('5')
      wrapper.unmount()
    })

    it('showCount=true 配合 maxLength 显示 x / max', () => {
      const wrapper = mount(Input, {
        props: { showCount: true, maxLength: 10, modelValue: 'hi' },
      })
      expect(wrapper.find(ns.e('count')).text()).toBe('2 / 10')
      wrapper.unmount()
    })

    it('showCount={ formatter } 自定义格式', () => {
      const wrapper = mount(Input, {
        props: {
          showCount: { formatter: ({ count, maxLength }) => `${count}字 / 上限 ${maxLength}` },
          maxLength: 50,
          modelValue: 'abc',
        },
      })
      expect(wrapper.find(ns.e('count')).text()).toBe('3字 / 上限 50')
      wrapper.unmount()
    })

    it('maxLength 透传到原生 maxlength', () => {
      const wrapper = mount(Input, { props: { maxLength: 8 } })
      expect(wrapper.find('input').attributes('maxlength')).toBe('8')
      wrapper.unmount()
    })
  })

  describe('status', () => {
    it('status="error" 加 --status-error 类', () => {
      const wrapper = mount(Input, { props: { status: 'error' } })
      expect(wrapper.find(ns.m('status-error')).exists()).toBe(true)
      wrapper.unmount()
    })

    it('status="warning" 加 --status-warning 类', () => {
      const wrapper = mount(Input, { props: { status: 'warning' } })
      expect(wrapper.find(ns.m('status-warning')).exists()).toBe(true)
      wrapper.unmount()
    })

    it('inherits validateStatus from injected FormItem context', () => {
      const validateStatus = ref<'' | 'error'>('error')
      const wrapper = mount(Input, {
        global: {
          provide: {
            [formItemInjectionKey as symbol]: {
              validateStatus,
              isInsideForm: true,
              validate: vi.fn(async () => true),
            },
          },
        },
      })
      expect(wrapper.find(ns.m('status-error')).exists()).toBe(true)
      wrapper.unmount()
    })

    it('显式 status prop 优先于 Form 注入的 validateStatus', () => {
      const validateStatus = ref<'' | 'error'>('error')
      const wrapper = mount(Input, {
        props: { status: 'warning' },
        global: {
          provide: {
            [formItemInjectionKey as symbol]: {
              validateStatus,
              isInsideForm: true,
              validate: vi.fn(async () => true),
            },
          },
        },
      })
      expect(wrapper.find(ns.m('status-warning')).exists()).toBe(true)
      expect(wrapper.find(ns.m('status-error')).exists()).toBe(false)
      wrapper.unmount()
    })

    it('triggers FormItem.validate on input change and on blur', async () => {
      const onValidate = vi.fn(async () => true)
      const wrapper = mount(Input, {
        global: {
          provide: {
            [formItemInjectionKey as symbol]: {
              validateStatus: ref(''),
              isInsideForm: true,
              validate: onValidate,
            },
          },
        },
      })
      await wrapper.find('input').setValue('hello')
      expect(onValidate).toHaveBeenCalledWith('change')
      await wrapper.find('input').trigger('blur')
      expect(onValidate).toHaveBeenCalledWith('blur')
      wrapper.unmount()
    })
  })

  describe('variant（v5.13+：outlined / filled / borderless / underlined）', () => {
    it('默认 variant 为 outlined', () => {
      const wrapper = mount(Input)
      expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
      wrapper.unmount()
    })

    it('variant="filled" 加 --variant-filled 类', () => {
      const wrapper = mount(Input, { props: { variant: 'filled' } })
      expect(wrapper.find(ns.m('variant-filled')).exists()).toBe(true)
      wrapper.unmount()
    })

    it('variant="borderless" 加 --variant-borderless 类', () => {
      const wrapper = mount(Input, { props: { variant: 'borderless' } })
      expect(wrapper.find(ns.m('variant-borderless')).exists()).toBe(true)
      wrapper.unmount()
    })

    it('variant="underlined" 加 --variant-underlined 类', () => {
      const wrapper = mount(Input, { props: { variant: 'underlined' } })
      expect(wrapper.find(ns.m('variant-underlined')).exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('press-enter 事件', () => {
    it('回车键触发 press-enter', async () => {
      const wrapper = mount(Input)
      await wrapper.find('input').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('press-enter')).toBeTruthy()
      wrapper.unmount()
    })

    it('非回车键不触发 press-enter', async () => {
      const wrapper = mount(Input)
      await wrapper.find('input').trigger('keydown', { key: 'a' })
      expect(wrapper.emitted('press-enter')).toBeUndefined()
      wrapper.unmount()
    })
  })

  describe('defaultValue 非受控', () => {
    it('未传 modelValue 时 defaultValue 作为初值', () => {
      const wrapper = mount(Input, { props: { defaultValue: 'preset' } })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('preset')
      wrapper.unmount()
    })

    it('显式 modelValue 优先于 defaultValue', () => {
      const wrapper = mount(Input, { props: { modelValue: 'real', defaultValue: 'preset' } })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('real')
      wrapper.unmount()
    })
  })
})
