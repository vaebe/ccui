import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { computed, h, nextTick, ref } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Radio, RadioGroup } from '../index'

const ns = useNamespace('radio', true)
const groupNs = useNamespace('radio-group', true)
const baseClass = ns.b()

describe('radio', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Radio)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('renders correctly with label prop', () => {
    const wrapper = mount(Radio, {
      props: {
        label: 'Test Label',
      },
    })

    expect(wrapper.text()).toContain('Test Label')
  })

  it('renders correctly with default slot', () => {
    const wrapper = mount(Radio, {
      slots: {
        default: 'Slot Content',
      },
    })

    expect(wrapper.text()).toContain('Slot Content')
  })

  it('applies active class when checked', async () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'test',
        label: 'test',
      },
    })

    expect(wrapper.find('label').classes()).toContain('active')
  })

  it('applies disabled class when disabled', async () => {
    const wrapper = mount(Radio, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.find('label').classes()).toContain('disabled')
  })

  it('emits change and update:modelValue events when clicked', async () => {
    const wrapper = mount(Radio, {
      props: {
        label: 'Test',
      },
    })

    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('does not emit events when disabled', async () => {
    const wrapper = mount(Radio, {
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
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'test',
        label: 'test',
      },
    })

    expect(wrapper.findComponent({ name: 'IconActive' }).exists()).toBe(true)
  })

  it('shows IconCircle when not checked', () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'other',
        label: 'test',
      },
    })

    expect(wrapper.findComponent({ name: 'IconCircle' }).exists()).toBe(true)
  })

  it('calls beforeChange function when provided', async () => {
    const beforeChange = vi.fn().mockResolvedValue(true)
    const wrapper = mount(Radio, {
      props: {
        label: 'Test',
        beforeChange,
      },
    })

    await wrapper.find('input').trigger('change')

    expect(beforeChange).toHaveBeenCalledWith('Test')
  })

  it('renders radio group direction and active child', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'a',
        direction: 'row',
      },
      slots: {
        default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })],
      },
    })

    expect(wrapper.find(groupNs.b()).classes()).toContain('is-row')
    expect(wrapper.findAll(ns.b()).length).toBe(2)
    expect(wrapper.findAll('label')[0].classes()).toContain('active')
  })

  it('emits selected value from radio group', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'a',
      },
      slots: {
        default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })],
      },
    })

    await wrapper.findAll('input')[1].trigger('change')
    await nextTick()

    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('passes disabled and beforeChange through radio group', async () => {
    const beforeChange = vi.fn().mockReturnValue(false)
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: '',
        disabled: true,
        beforeChange,
      },
      slots: {
        default: () => h(Radio, { label: 'a' }),
      },
    })

    expect(wrapper.find('label').classes()).toContain('disabled')

    await wrapper.find('input').trigger('change')
    expect(beforeChange).not.toHaveBeenCalled()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('preserves boolean values in standalone and grouped radios', async () => {
    const standalone = mount(Radio, { props: { modelValue: false, label: false } })
    expect(standalone.find('input').element.checked).toBe(true)

    const group = mount(RadioGroup, {
      props: { modelValue: false },
      slots: {
        default: () => [h(Radio, { label: false }), h(Radio, { label: true })],
      },
    })
    expect(group.findAll('input').map((input) => input.element.checked)).toEqual([true, false])
    await group.findAll('input')[1].trigger('change')
    await flushPromises()
    expect(group.emitted('change')?.[0]).toEqual([true])
  })

  it('uses one reactive name for native grouping and form submission', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(RadioGroup, {
      attachTo: form,
      props: { modelValue: true, name: 'enabled' },
      slots: {
        default: () => [h(Radio, { label: false, name: 'ignored' }), h(Radio, { label: true })],
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs.map((input) => input.attributes('name'))).toEqual(['enabled', 'enabled'])
    expect(new FormData(form).get('enabled')).toBe('true')

    await wrapper.setProps({ name: 'active' })
    expect(wrapper.findAll('input').map((input) => input.attributes('name'))).toEqual(['active', 'active'])
    expect(new FormData(form).get('active')).toBe('true')
    wrapper.unmount()
    form.remove()
  })

  it('generates a shared native group name when name is omitted', () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a' },
      slots: { default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })] },
    })
    const names = wrapper.findAll('input').map((input) => input.attributes('name'))
    expect(names[0]).toMatch(/^ccui-radio-/)
    expect(names[1]).toBe(names[0])
  })

  it('reacts to a dynamically replaced group beforeChange', async () => {
    const blocked = vi.fn().mockReturnValue(false)
    const allowed = vi.fn().mockReturnValue(true)
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a', beforeChange: blocked },
      slots: { default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })] },
    })
    await wrapper.setProps({ beforeChange: allowed })
    await wrapper.findAll('input')[1].trigger('change')
    await flushPromises()
    expect(blocked).not.toHaveBeenCalled()
    expect(allowed).toHaveBeenCalledWith('b')
    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
  })

  it('cancels a pending group hook when beforeChange is replaced', async () => {
    let resolveOld!: (value: boolean) => void
    const oldGuard = () =>
      new Promise<boolean>((resolve) => {
        resolveOld = resolve
      })
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a', beforeChange: oldGuard },
      slots: { default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })] },
    })
    await wrapper.findAll('input')[1].trigger('change')
    await wrapper.setProps({ beforeChange: () => true })
    await wrapper.findAll('input')[1].trigger('change')
    await flushPromises()
    resolveOld(true)
    await flushPromises()
    expect(wrapper.emitted('change')).toEqual([['b']])
  })

  it('treats thrown and rejected beforeChange hooks as blocked changes', async () => {
    for (const beforeChange of [
      () => {
        throw new Error('blocked')
      },
      () => Promise.reject(new Error('blocked')),
    ]) {
      const wrapper = mount(Radio, { props: { modelValue: 'a', label: 'b', beforeChange } })
      await wrapper.find('input').trigger('change')
      await flushPromises()
      expect(wrapper.emitted('change')).toBeUndefined()
      expect(wrapper.find('input').element.checked).toBe(false)
    }
  })

  it('only commits the latest async group request', async () => {
    const resolvers = new Map<string, (value: boolean) => void>()
    const beforeChange = vi.fn(
      (value: string | number | boolean) =>
        new Promise<boolean>((resolve) => {
          resolvers.set(String(value), resolve)
        }),
    )
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a', beforeChange },
      slots: {
        default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' }), h(Radio, { label: 'c' })],
      },
    })
    const inputs = wrapper.findAll('input')
    inputs[1].element.checked = true
    expect(inputs[0].element.checked).toBe(false)
    await inputs[1].trigger('change')
    expect(inputs.map((input) => input.element.checked)).toEqual([true, false, false])
    inputs[2].element.checked = true
    await inputs[2].trigger('change')
    expect(inputs.map((input) => input.element.checked)).toEqual([true, false, false])

    resolvers.get('c')?.(true)
    await flushPromises()
    resolvers.get('b')?.(true)
    await flushPromises()
    expect(wrapper.emitted('change')).toEqual([['c']])
  })

  it('invalidates pending changes across controlled ABA and dynamic disabled transitions', async () => {
    let resolveModelGuard!: (value: boolean) => void
    const modelWrapper = mount(RadioGroup, {
      props: {
        modelValue: 'a',
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveModelGuard = resolve
          }),
      },
      slots: { default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })] },
    })
    await modelWrapper.findAll('input')[1].trigger('change')
    await modelWrapper.setProps({ modelValue: 'b' })
    await modelWrapper.setProps({ modelValue: 'a' })
    resolveModelGuard(true)
    await flushPromises()
    expect(modelWrapper.emitted('change')).toBeUndefined()

    let resolveDisabledGuard!: (value: boolean) => void
    const disabledWrapper = mount(RadioGroup, {
      props: {
        modelValue: 'a',
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveDisabledGuard = resolve
          }),
      },
      slots: { default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })] },
    })
    await disabledWrapper.findAll('input')[1].trigger('change')
    await disabledWrapper.setProps({ disabled: true })
    await disabledWrapper.setProps({ disabled: false })
    resolveDisabledGuard(true)
    await flushPromises()
    expect(disabledWrapper.emitted('change')).toBeUndefined()
  })

  it('does not commit an async decision after unmount', async () => {
    let resolveGuard!: (value: boolean) => void
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'a',
        label: 'b',
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveGuard = resolve
          }),
      },
    })
    await wrapper.find('input').trigger('change')
    wrapper.unmount()
    resolveGuard(true)
    await flushPromises()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('does not emit when a selected radio receives a duplicate native change', async () => {
    const beforeChange = vi.fn().mockReturnValue(true)
    const wrapper = mount(Radio, { props: { modelValue: 'a', label: 'a', beforeChange } })
    await wrapper.find('input').trigger('change')
    await flushPromises()
    expect(beforeChange).not.toHaveBeenCalled()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('keeps the native label click path and emits exactly once', async () => {
    const wrapper = mount(Radio, { props: { modelValue: 'a', label: 'b' }, attachTo: document.body })
    wrapper.find('label').element.click()
    await flushPromises()
    expect(wrapper.emitted('change')).toEqual([['b']])
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
    wrapper.unmount()
  })

  it('invalidates a standalone pending request after label and disabled ABA changes', async () => {
    let resolveGuard!: (value: boolean) => void
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'a',
        label: 'b',
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveGuard = resolve
          }),
      },
    })
    await wrapper.find('input').trigger('change')
    await wrapper.setProps({ label: 'c', disabled: true })
    await wrapper.setProps({ label: 'b', disabled: false })
    resolveGuard(true)
    await flushPromises()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('invalidates a standalone pending request after controlled model ABA changes', async () => {
    let resolveGuard!: (value: boolean) => void
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'a',
        label: 'b',
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveGuard = resolve
          }),
      },
    })
    await wrapper.find('input').trigger('change')
    await wrapper.setProps({ modelValue: 'c' })
    await wrapper.setProps({ modelValue: 'a' })
    resolveGuard(true)
    await flushPromises()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('validates standalone and grouped radios at FormItem boundaries', async () => {
    const standaloneValidate = vi.fn().mockResolvedValue(true)
    const standalone = mount(Radio, {
      props: { modelValue: 'a', label: 'b' },
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validateStatus: ref('error'),
            messageId: computed(() => 'standalone-error'),
            isInsideForm: true,
            validate: standaloneValidate,
          },
        },
      },
    })
    await standalone.find('input').trigger('change')
    await flushPromises()
    await standalone.find('input').trigger('blur')
    expect(standalone.find('input').attributes('aria-invalid')).toBe('true')
    expect(standalone.find('input').attributes('aria-describedby')).toBe('standalone-error')
    expect(standaloneValidate).toHaveBeenNthCalledWith(1, 'change')
    expect(standaloneValidate).toHaveBeenNthCalledWith(2, 'blur')

    const groupValidate = vi.fn().mockResolvedValue(true)
    const group = mount(RadioGroup, {
      props: { modelValue: 'a' },
      slots: { default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })] },
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validateStatus: ref('error'),
            messageId: computed(() => 'group-error'),
            isInsideForm: true,
            validate: groupValidate,
          },
        },
      },
    })
    const inputs = group.findAll('input')
    expect(group.attributes('aria-invalid')).toBe('true')
    expect(group.attributes('aria-describedby')).toBe('group-error')
    expect(inputs[0].attributes('aria-describedby')).toBeUndefined()
    await inputs[1].trigger('change')
    await flushPromises()
    await group.trigger('focusout', { relatedTarget: inputs[0].element })
    expect(groupValidate).toHaveBeenCalledTimes(1)
    await group.trigger('focusout', { relatedTarget: null })
    expect(groupValidate).toHaveBeenNthCalledWith(2, 'blur')
  })

  describe('XL-4 ARIA', () => {
    it('RadioGroup 根加 role="radiogroup"', () => {
      const wrapper = mount(RadioGroup, {
        props: { modelValue: 'a' },
        slots: { default: () => h(Radio, { label: 'a' }) },
      })
      expect(wrapper.attributes('role')).toBe('radiogroup')
    })

    it('Radio input 加 aria-checked / aria-disabled', () => {
      const wrapper = mount(Radio, { props: { modelValue: 'a', label: 'a', disabled: true } })
      const inp = wrapper.find('input')
      expect(inp.attributes('aria-checked')).toBe('true')
      expect(inp.attributes('aria-disabled')).toBe('true')
    })
  })
})
