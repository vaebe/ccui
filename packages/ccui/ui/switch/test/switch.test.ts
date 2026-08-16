import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Switch } from '../index'

const ns = useNamespace('switch', true)

describe('switch', () => {
  it('toggles modelValue on click', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('reflects checked modifier', () => {
    const wrapper = mount(Switch, { props: { modelValue: true } })
    expect(wrapper.find(ns.m('checked')).exists()).toBe(true)
  })

  it('does not trigger when disabled', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders checked children slot', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true },
      slots: { checkedChildren: 'ON' },
    })
    expect(wrapper.text()).toContain('ON')
  })

  it('supports custom checked/unchecked values', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: 'no', checkedValue: 'yes', uncheckedValue: 'no' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yes'])
  })

  it('accepts a synchronous beforeChange decision before emitting once', async () => {
    const beforeChange = vi.fn().mockReturnValue(true)
    const wrapper = mount(Switch, {
      props: { modelValue: 'off', checkedValue: 'on', uncheckedValue: 'off', beforeChange },
    })

    await wrapper.trigger('click')

    expect(beforeChange).toHaveBeenCalledWith('on')
    expect(wrapper.emitted('update:modelValue')).toEqual([['on']])
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit when beforeChange directly returns false', async () => {
    const beforeChange = vi.fn().mockReturnValue(false)
    const wrapper = mount(Switch, { props: { modelValue: false, beforeChange } })

    await wrapper.trigger('click')

    expect(beforeChange).toHaveBeenCalledWith(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-checked')).toBe('false')
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('blocks thrown and rejected beforeChange decisions without unhandled state changes', async () => {
    for (const beforeChange of [
      () => {
        throw new Error('blocked')
      },
      () => Promise.reject(new Error('blocked')),
    ]) {
      const wrapper = mount(Switch, { props: { modelValue: false, beforeChange } })
      await wrapper.trigger('click')
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.attributes('aria-busy')).toBeUndefined()
      wrapper.unmount()
    }
  })

  it('invalidates a pending decision when model or dynamic guards change', async () => {
    let resolveDecision!: (accepted: boolean) => void
    const beforeChange = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveDecision = resolve
        }),
    )
    const wrapper = mount(Switch, { props: { modelValue: false, beforeChange } })

    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    await wrapper.trigger('click')
    expect(beforeChange).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ modelValue: true, disabled: true })
    resolveDecision(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('invalidates a pending decision after a real modelValue ABA transition', async () => {
    let resolveDecision!: (accepted: boolean) => void
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveDecision = resolve
          }),
      },
    })

    await wrapper.trigger('click')
    // 旧实现若只比较最终快照，会把 false -> true -> false 误判为请求期间未变化。
    await wrapper.setProps({ modelValue: true })
    await wrapper.setProps({ modelValue: false })
    resolveDecision(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })

  it.each(['checkedValue', 'uncheckedValue'] as const)(
    'invalidates a pending decision when only %s changes',
    async (changedProp) => {
      let resolveDecision!: (accepted: boolean) => void
      const wrapper = mount(Switch, {
        props: {
          modelValue: 'off',
          checkedValue: 'on',
          uncheckedValue: 'off',
          beforeChange: () =>
            new Promise<boolean>((resolve) => {
              resolveDecision = resolve
            }),
        },
      })

      await wrapper.trigger('click')
      // 每轮只改变一个状态值，避免另一个 watcher 掩盖当前 watcher 的失效能力。
      if (changedProp === 'checkedValue') await wrapper.setProps({ checkedValue: 'enabled' })
      else await wrapper.setProps({ uncheckedValue: 'disabled' })
      resolveDecision(true)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.attributes('aria-checked')).toBe('false')
    },
  )

  it('rolls the visual state back when a controlled parent does not write the emitted value', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })

    await wrapper.trigger('click')
    await nextTick()

    // 受控父组件不写回时，视觉状态必须继续服从 modelValue，不能保留乐观选中状态。
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.attributes('aria-checked')).toBe('false')
    expect(wrapper.find(ns.m('checked')).exists()).toBe(false)
  })

  it('invalidates a pending decision when beforeChange is replaced', async () => {
    let resolveDecision!: (accepted: boolean) => void
    const oldGuard = () =>
      new Promise<boolean>((resolve) => {
        resolveDecision = resolve
      })
    const wrapper = mount(Switch, { props: { modelValue: false, beforeChange: oldGuard } })

    await wrapper.trigger('click')
    await wrapper.setProps({ beforeChange: () => true })
    resolveDecision(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('ignores async completion after unmount', async () => {
    let resolveDecision!: (accepted: boolean) => void
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        beforeChange: () =>
          new Promise<boolean>((resolve) => {
            resolveDecision = resolve
          }),
      },
    })

    await wrapper.trigger('click')
    wrapper.unmount()
    resolveDecision(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('keeps native button keyboard semantics and blocks interaction while loading', async () => {
    const wrapper = mount(Switch, { attachTo: document.body, props: { modelValue: false } })
    const button = wrapper.element as HTMLButtonElement
    expect(button.tagName).toBe('BUTTON')
    expect(button.type).toBe('button')
    button.focus()
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])

    await wrapper.setProps({ loading: true })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    wrapper.unmount()
  })

  it('integrates FormItem change, blur and error description', async () => {
    const validate = vi.fn()
    const onBlur = vi.fn()
    const wrapper = mount(Switch, {
      props: { modelValue: false },
      attrs: { class: 'custom-switch', 'aria-describedby': 'hint switch-error', onBlur },
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validateStatus: ref('error'),
            messageId: ref('switch-error'),
            validate,
          },
        },
      },
    })

    expect(wrapper.attributes('aria-invalid')).toBe('true')
    expect(wrapper.classes()).toContain('custom-switch')
    expect(wrapper.attributes('aria-describedby')).toBe('hint switch-error')
    await wrapper.trigger('click')
    await wrapper.trigger('blur')
    expect(validate.mock.calls).toEqual([['change'], ['blur']])
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  describe('XL-4 ARIA', () => {
    it('未勾选 / 已勾选时 aria-checked 跟随', async () => {
      const w1 = mount(Switch, { props: { modelValue: false } })
      expect(w1.attributes('role')).toBe('switch')
      expect(w1.attributes('aria-checked')).toBe('false')
      const w2 = mount(Switch, { props: { modelValue: true } })
      expect(w2.attributes('aria-checked')).toBe('true')
    })

    it('disabled / loading 时补 aria-disabled / aria-busy', () => {
      const wrapper = mount(Switch, { props: { modelValue: false, disabled: true, loading: true } })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
      expect(wrapper.attributes('aria-busy')).toBe('true')
    })
  })
})
