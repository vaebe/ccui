import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { h, nextTick, ref } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { CheckBox } from '../index'
import CheckBoxGroup from '../src/check-box-group'

const ns = useNamespace('check-box', true)
const groupNs = useNamespace('check-box-group', true)
const baseClass = ns.b()

describe('checkBox', () => {
  it('dom', async () => {
    const wrapper = shallowMount(CheckBox)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('renders correctly with label prop', () => {
    const wrapper = mount(CheckBox, {
      props: {
        label: 'Test Label',
      },
    })

    expect(wrapper.text()).toContain('Test Label')
  })

  it('renders correctly with default slot', () => {
    const wrapper = mount(CheckBox, {
      slots: {
        default: 'Slot Content',
      },
    })

    expect(wrapper.text()).toContain('Slot Content')
  })

  it('applies active class when checked', async () => {
    const wrapper = mount(CheckBox, {
      props: {
        modelValue: true,
      },
    })

    expect(wrapper.find('label').classes()).toContain('active')
  })

  it('applies disabled class when disabled', async () => {
    const wrapper = mount(CheckBox, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.find('label').classes()).toContain('disabled')
  })

  it('emits change and update:modelValue events when clicked', async () => {
    const wrapper = mount(CheckBox, {
      props: {
        label: 'Test',
      },
    })

    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('does not emit events when disabled', async () => {
    const wrapper = mount(CheckBox, {
      props: {
        disabled: true,
        label: 'Test',
      },
    })

    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('change')).toBeFalsy()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('shows IconActive when checked', () => {
    const wrapper = mount(CheckBox, {
      props: {
        modelValue: true,
      },
    })

    expect(wrapper.findComponent({ name: 'IconActive' }).exists()).toBe(true)
  })

  it('shows IconDefault when not checked', () => {
    const wrapper = mount(CheckBox, {
      props: {
        modelValue: false,
      },
    })

    expect(wrapper.findComponent({ name: 'IconDefault' }).exists()).toBe(true)
  })

  it('applies custom color when provided', () => {
    const wrapper = mount(CheckBox, {
      props: {
        color: '#ff0000',
        modelValue: true,
      },
    })

    const icon = wrapper.find(ns.e('icon'))
    expect(icon.attributes('style')).toContain('fill: #ff0000')
  })

  it('reflects indeterminate through the DOM property and mixed ARIA state', async () => {
    const wrapper = mount(CheckBox, {
      props: { label: 'partial', indeterminate: true },
    })
    const input = wrapper.find('input')

    expect((input.element as HTMLInputElement).indeterminate).toBe(true)
    expect(input.attributes('aria-checked')).toBe('mixed')
    expect(wrapper.find('label').classes()).toContain('indeterminate')

    await wrapper.setProps({ indeterminate: false, modelValue: true })
    expect((input.element as HTMLInputElement).indeterminate).toBe(false)
    expect(input.attributes('aria-checked')).toBe('true')
  })

  it('uses theme-aware contrast tokens for disabled indeterminate marks', () => {
    const wrapper = mount(CheckBox, {
      props: { disabled: true, indeterminate: true },
    })
    const iconStyle = wrapper.find(ns.e('icon')).attributes('style')

    expect(wrapper.find('label').classes()).toEqual(expect.arrayContaining(['disabled', 'indeterminate']))
    expect(iconStyle).toContain('--ccui-check-box-indeterminate-background: var(--ccui-color-fill)')
    expect(iconStyle).toContain('--ccui-check-box-indeterminate-mark-color: var(--ccui-color-text-secondary)')
  })

  it('preserves number and boolean label values at runtime', async () => {
    const wrapper = mount(CheckBoxGroup, {
      props: { modelValue: [] },
      slots: {
        default: () => [h(CheckBox, { label: 1 }), h(CheckBox, { label: false })],
      },
    })

    await wrapper.findAll('input')[0].trigger('change')
    await wrapper.findAll('input')[1].trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[1]])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[false]])
  })

  it('calls beforeChange function when provided', async () => {
    const beforeChange = vi.fn().mockResolvedValue(true)
    const wrapper = mount(CheckBox, {
      props: {
        label: 'Test',
        beforeChange,
      },
    })

    await wrapper.find('input').trigger('change')

    // 验证beforeChange是否被调用
    expect(beforeChange).toHaveBeenCalled()
  })

  it('renders checkbox group direction and slot items', () => {
    const wrapper = mount(CheckBoxGroup, {
      props: {
        modelValue: ['a'],
        direction: 'row',
      },
      slots: {
        default: () => [h(CheckBox, { label: 'a' }), h(CheckBox, { label: 'b' })],
      },
    })

    expect(wrapper.find(groupNs.b()).classes()).toContain('is-row')
    expect(wrapper.findAll(ns.b()).length).toBe(2)
    expect(wrapper.findAll('label')[0].classes()).toContain('active')
  })

  it('emits added values from checkbox group', async () => {
    const wrapper = mount(CheckBoxGroup, {
      props: {
        modelValue: ['a'],
      },
      slots: {
        default: () => [h(CheckBox, { label: 'a' }), h(CheckBox, { label: 'b' })],
      },
    })

    await wrapper.findAll('input')[1].trigger('change')
    await nextTick()

    expect(wrapper.emitted('change')?.[0]).toEqual([['a', 'b']])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
  })

  it('emits removed values from checkbox group', async () => {
    const wrapper = mount(CheckBoxGroup, {
      props: {
        modelValue: ['a', 'b'],
      },
      slots: {
        default: () => [h(CheckBox, { label: 'a' }), h(CheckBox, { label: 'b' })],
      },
    })

    await wrapper.findAll('input')[0].trigger('change')
    await nextTick()

    expect(wrapper.emitted('change')?.[0]).toEqual([['b']])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b']])
  })

  it('passes disabled color and beforeChange through checkbox group', async () => {
    const beforeChange = vi.fn().mockReturnValue(false)
    const wrapper = mount(CheckBoxGroup, {
      props: {
        modelValue: [],
        disabled: true,
        color: '#00ff00',
        beforeChange,
      },
      slots: {
        default: () => h(CheckBox, { label: 'a' }),
      },
    })

    expect(wrapper.find('label').classes()).toContain('disabled')
    expect(wrapper.find(ns.e('icon')).attributes('style')).toContain('fill: #00ff00')

    await wrapper.find('input').trigger('change')
    expect(beforeChange).not.toHaveBeenCalled()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('reacts to a changed group beforeChange and cascades a dynamic group name', async () => {
    const firstGuard = vi.fn().mockReturnValue(false)
    const secondGuard = vi.fn().mockReturnValue(true)
    const wrapper = mount(CheckBoxGroup, {
      props: { modelValue: [], name: 'first', beforeChange: firstGuard },
      slots: { default: () => h(CheckBox, { label: 'a' }) },
    })

    expect(wrapper.find('input').attributes('name')).toBe('first')
    await wrapper.find('input').trigger('change')
    await nextTick()
    expect(wrapper.emitted('change')).toBeUndefined()

    await wrapper.setProps({ name: 'second', beforeChange: secondGuard })
    await wrapper.find('input').trigger('change')
    await nextTick()
    expect(firstGuard).toHaveBeenCalledTimes(1)
    expect(secondGuard).toHaveBeenCalledWith(true, 'a')
    expect(wrapper.find('input').attributes('name')).toBe('second')
    expect(wrapper.emitted('change')?.[0]).toEqual([['a']])
  })

  it('blocks rejected guards and commits neither after disable nor after unmount', async () => {
    let resolveGuard!: (value: boolean) => void
    const guard = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveGuard = resolve
        }),
    )
    const wrapper = mount(CheckBox, { props: { label: 'a', beforeChange: guard } })

    await wrapper.find('input').trigger('change')
    await wrapper.setProps({ disabled: true })
    resolveGuard(true)
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('change')).toBeUndefined()

    const rejected = mount(CheckBox, {
      props: { label: 'b', beforeChange: () => Promise.reject(new Error('blocked')) },
    })
    await rejected.find('input').trigger('change')
    await nextTick()
    await nextTick()
    expect(rejected.emitted('change')).toBeUndefined()

    let resolveAfterUnmount!: (value: boolean) => void
    const unmounted = mount(CheckBox, {
      props: {
        label: 'c',
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveAfterUnmount = resolve
          }),
      },
    })
    await unmounted.find('input').trigger('change')
    unmounted.unmount()
    resolveAfterUnmount(true)
    await nextTick()
    expect(unmounted.emitted('change')).toBeUndefined()
  })

  it('keeps the native checked state stable while an async guard is pending', async () => {
    let resolveGuard!: (value: boolean) => void
    const wrapper = mount(CheckBox, {
      props: {
        modelValue: false,
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveGuard = resolve
          }),
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input')

    ;(input.element as HTMLInputElement).checked = true
    await input.trigger('change')
    expect((input.element as HTMLInputElement).checked).toBe(false)

    resolveGuard(false)
    await nextTick()
    wrapper.unmount()
  })

  it('does not apply an async decision to a newer controlled state or label', async () => {
    let resolveGuard!: (value: boolean) => void
    const wrapper = mount(CheckBox, {
      props: {
        modelValue: false,
        label: 'old',
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveGuard = resolve
          }),
      },
    })

    await wrapper.find('input').trigger('change')
    await wrapper.setProps({ modelValue: true, label: 'new' })
    resolveGuard(true)
    await nextTick()
    await nextTick()

    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('invalidates an async decision after controlled and disabled ABA transitions', async () => {
    let resolveModelGuard!: (value: boolean) => void
    const modelWrapper = mount(CheckBox, {
      props: {
        modelValue: false,
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveModelGuard = resolve
          }),
      },
    })
    await modelWrapper.find('input').trigger('change')
    await modelWrapper.setProps({ modelValue: true })
    await modelWrapper.setProps({ modelValue: false })
    resolveModelGuard(true)
    await nextTick()
    await nextTick()
    expect(modelWrapper.emitted('change')).toBeUndefined()

    let resolveDisabledGuard!: (value: boolean) => void
    const disabledWrapper = mount(CheckBox, {
      props: {
        disabled: false,
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveDisabledGuard = resolve
          }),
      },
    })
    await disabledWrapper.find('input').trigger('change')
    await disabledWrapper.setProps({ disabled: true })
    await disabledWrapper.setProps({ disabled: false })
    resolveDisabledGuard(true)
    await nextTick()
    await nextTick()
    expect(disabledWrapper.emitted('change')).toBeUndefined()
  })

  it('validates standalone and grouped checkboxes at FormItem boundaries', async () => {
    const standaloneValidate = vi.fn().mockResolvedValue(true)
    const standalone = mount(CheckBox, {
      props: { label: 'a' },
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validateStatus: ref(''),
            isInsideForm: true,
            validate: standaloneValidate,
          },
        },
      },
    })
    await standalone.find('input').trigger('change')
    await nextTick()
    await standalone.find('input').trigger('blur')
    expect(standaloneValidate).toHaveBeenNthCalledWith(1, 'change')
    expect(standaloneValidate).toHaveBeenNthCalledWith(2, 'blur')

    const groupValidate = vi.fn().mockResolvedValue(true)
    const group = mount(CheckBoxGroup, {
      props: { modelValue: [] },
      slots: {
        default: () => [h(CheckBox, { label: 'a' }), h(CheckBox, { label: 'b' })],
      },
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validateStatus: ref(''),
            isInsideForm: true,
            validate: groupValidate,
          },
        },
      },
    })
    const inputs = group.findAll('input')
    await inputs[0].trigger('change')
    await nextTick()
    await group.trigger('focusout', { relatedTarget: inputs[1].element })
    expect(groupValidate).toHaveBeenCalledTimes(1)
    await group.trigger('focusout', { relatedTarget: null })
    expect(groupValidate).toHaveBeenNthCalledWith(2, 'blur')
  })

  describe('XL-4 ARIA', () => {
    it('CheckBoxGroup 根加 role="group"', () => {
      const wrapper = mount(CheckBoxGroup, {
        props: { modelValue: [] },
        slots: { default: () => h(CheckBox, { label: 'a' }) },
      })
      expect(wrapper.attributes('role')).toBe('group')
    })

    it('CheckBox input 加 aria-checked / aria-disabled', () => {
      const wrapper = mount(CheckBox, { props: { modelValue: true, label: 'a', disabled: true } })
      const inp = wrapper.find('input')
      expect(inp.attributes('aria-checked')).toBe('true')
      expect(inp.attributes('aria-disabled')).toBe('true')
    })
  })
})
