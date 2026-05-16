import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { AutoComplete } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Form, FormItem } from '../../form'
import { formItemInjectionKey } from '../../form/src/form-types'

const ns = useNamespace('auto-complete', true)
const wrappers: VueWrapper[] = []

const SAMPLE: Array<string | { value: string; label?: string; disabled?: boolean }> = [
  'Apple',
  'Banana',
  { value: 'Cherry' },
  { value: 'durian', label: 'Durian (smelly)' },
  { value: 'Elderberry', disabled: true },
]

function mountAC(props: Record<string, unknown> = {}) {
  const wrapper = mount(AutoComplete, {
    props: { options: SAMPLE, ...props },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

async function focus(wrapper: VueWrapper) {
  await wrapper.find('input').trigger('focus')
  await nextTick()
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('auto-complete rendering', () => {
  it('renders an input with placeholder and no popup initially', () => {
    const wrapper = mountAC({ placeholder: 'type to search' })
    expect(wrapper.find('input').attributes('placeholder')).toBe('type to search')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('renders the current modelValue as input value', () => {
    const wrapper = mountAC({ modelValue: 'Banana' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Banana')
  })

  it('disabled wrap class and prevents focus from opening popup', async () => {
    const wrapper = mountAC({ disabled: true })
    expect(wrapper.find(ns.e('wrap')).classes()).toContain('is-disabled')
    await focus(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})

describe('auto-complete popup open / close', () => {
  it('opens popup on focus and emits open-change(true)', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    expect(wrapper.emitted('open-change')?.[0]).toEqual([true])
  })

  it('closes on outside mousedown', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('Escape key closes popup', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})

describe('auto-complete option filtering', () => {
  it('filters options by includes when filterOption=true (default)', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    expect(wrapper.findAll(ns.e('option'))).toHaveLength(5)
    await wrapper.find('input').setValue('an')
    await nextTick()
    // Banana matches; durian (label=Durian (smelly)) doesn't include 'an'
    const labels = wrapper.findAll(ns.e('option')).map((n) => n.text())
    expect(labels).toContain('Banana')
    expect(labels).not.toContain('Apple')
  })

  it('does not filter when filterOption=false', async () => {
    const wrapper = mountAC({ filterOption: false })
    await focus(wrapper)
    await wrapper.find('input').setValue('xx-no-match')
    await nextTick()
    expect(wrapper.findAll(ns.e('option'))).toHaveLength(5)
  })

  it('uses custom filterOption when given as function', async () => {
    const wrapper = mountAC({
      filterOption: (input: string, option: { value: string }) => String(option.value).startsWith(input),
    })
    await focus(wrapper)
    await wrapper.find('input').setValue('A')
    await nextTick()
    const labels = wrapper.findAll(ns.e('option')).map((n) => n.text())
    expect(labels).toEqual(['Apple'])
  })

  it('caseSensitive toggles case-aware matching', async () => {
    const wrapper = mountAC({ caseSensitive: true })
    await focus(wrapper)
    await wrapper.find('input').setValue('apple')
    await nextTick()
    expect(wrapper.findAll(ns.e('option'))).toHaveLength(0)
    expect(wrapper.find(ns.e('empty')).exists()).toBe(true)
  })

  it('renders notFoundContent when filtered list is empty', async () => {
    const wrapper = mountAC({ notFoundContent: '没有匹配项' })
    await focus(wrapper)
    await wrapper.find('input').setValue('zzzzzzz')
    await nextTick()
    expect(wrapper.find(ns.e('empty')).text()).toBe('没有匹配项')
  })
})

describe('auto-complete selection', () => {
  it('clicking an option emits update:modelValue + select and closes popup', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    const banana = wrapper.findAll(ns.e('option'))[1]
    await banana.trigger('mousedown')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['Banana'])
    expect(wrapper.emitted('select')?.[0][0]).toBe('Banana')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('does not select disabled options', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    const elderberry = wrapper.findAll(ns.e('option')).find((n) => n.text() === 'Elderberry')!
    expect(elderberry.classes()).toContain('is-disabled')
    await elderberry.trigger('mousedown')
    await nextTick()
    expect(wrapper.emitted('select')).toBeUndefined()
    // popup 仍开
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('select uses option.value not option.label when they differ', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    const durian = wrapper.findAll(ns.e('option')).find((n) => n.text().includes('Durian'))!
    await durian.trigger('mousedown')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['durian'])
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('durian')
  })
})

describe('auto-complete keyboard navigation', () => {
  it('ArrowDown moves active to next enabled, skipping disabled', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    // start: activeIndex=-1
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    let active = wrapper.findAll(ns.e('option')).findIndex((n) => n.classes().includes('is-active'))
    expect(active).toBe(0) // Apple

    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    active = wrapper.findAll(ns.e('option')).findIndex((n) => n.classes().includes('is-active'))
    expect(active).toBe(1) // Banana

    // 跳到末尾后再 Down 应循环回到 0；而 Elderberry (idx 4) 是 disabled，应被跳过
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    active = wrapper.findAll(ns.e('option')).findIndex((n) => n.classes().includes('is-active'))
    expect(active).toBe(3) // Durian (last enabled)
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    active = wrapper.findAll(ns.e('option')).findIndex((n) => n.classes().includes('is-active'))
    expect(active).toBe(0) // wrap around
  })

  it('ArrowUp from start wraps to last enabled', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    const active = wrapper.findAll(ns.e('option')).findIndex((n) => n.classes().includes('is-active'))
    expect(active).toBe(3) // Durian (last enabled)
  })

  it('Enter selects the active option', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['Banana'])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('Enter with no active option does not select', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})

describe('auto-complete clear', () => {
  it('renders clear button when allowClear and value is non-empty', async () => {
    const wrapper = mountAC({ allowClear: true, defaultValue: 'Banana' })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
    await wrapper.find(ns.e('clear')).trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([''])
  })

  it('hides clear when value is empty even if allowClear=true', () => {
    const wrapper = mountAC({ allowClear: true })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('hides clear when disabled', () => {
    const wrapper = mountAC({ allowClear: true, defaultValue: 'Banana', disabled: true })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })
})

describe('auto-complete controlled / uncontrolled', () => {
  it('uncontrolled: typing updates inner state and reflects in input', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    await wrapper.find('input').setValue('hello')
    await nextTick()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('hello')
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['hello'])
  })

  it('controlled: typing emits update:modelValue but inner state does not write back', async () => {
    const value = ref<string | null>('init')
    let lastEmit: string | null = null
    const Host = defineComponent({
      setup() {
        return () =>
          h(AutoComplete, {
            modelValue: value.value,
            options: SAMPLE,
            'onUpdate:modelValue': (v: string) => {
              lastEmit = v
              // 父级故意不写回 value，验证组件不会自己写 inner state
            },
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').setValue('changed')
    await nextTick()
    // emit 触发了，且父级拿到了新值；组件本身不会私自改 modelValue
    expect(lastEmit).toBe('changed')
    expect(value.value).toBe('init')
  })
})

describe('auto-complete form integration', () => {
  it('inherits validate status from FormItem and triggers validate on change', async () => {
    const value = ref<string | null>('')
    const Host = defineComponent({
      components: { Form, FormItem, AutoComplete },
      setup() {
        return () =>
          h(
            Form,
            {
              model: { brand: value.value },
              rules: { brand: [{ required: true, message: '请输入品牌', trigger: 'change' }] },
            },
            () => [
              h(FormItem, { name: 'brand', prop: 'brand', label: 'brand' }, () =>
                h(AutoComplete, {
                  modelValue: value.value,
                  options: SAMPLE,
                  'onUpdate:modelValue': (v: string) => (value.value = v),
                }),
              ),
            ],
          )
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').setValue('Apple')
    await nextTick()
    expect(value.value).toBe('Apple')
  })
})

describe('auto-complete defaultActiveFirstOption', () => {
  it('highlights first enabled option when popup opens', async () => {
    const wrapper = mountAC({ defaultActiveFirstOption: true })
    await focus(wrapper)
    const options = wrapper.findAll(ns.e('option'))
    expect(options[0].classes()).toContain('is-active')
  })

  it('does not highlight first option by default', async () => {
    const wrapper = mountAC()
    await focus(wrapper)
    const activeOptions = wrapper.findAll(`${ns.e('option')}.is-active`)
    expect(activeOptions).toHaveLength(0)
  })
})

describe('auto-complete backfill', () => {
  it('writes active option label to input on ArrowDown when backfill=true', async () => {
    const wrapper = mountAC({ backfill: true })
    await focus(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('Apple')
  })

  it('clears backfill display on close', async () => {
    const wrapper = mountAC({ backfill: true, defaultValue: '' })
    await focus(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('Apple')
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    await nextTick()
    // backfill 清除后恢复为 defaultValue
    expect(wrapper.find('input').element.value).toBe('')
  })
})

describe('auto-complete trigger slot', () => {
  it('renders custom trigger via slot', async () => {
    const wrapper = mount(AutoComplete, {
      props: { options: SAMPLE },
      slots: {
        trigger: (props: any) =>
          h('textarea', {
            class: 'my-textarea',
            value: props.value,
            onInput: props.onInput,
            onFocus: props.onFocus,
            onKeydown: props.onKeydown,
          }),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    expect(wrapper.find('.my-textarea').exists()).toBe(true)
    expect(wrapper.find(ns.e('input')).exists()).toBe(false)
  })

  describe('variant', () => {
    it('默认 variant 为 outlined', () => {
      const wrapper = mountAC()
      expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
    })

    it('variant="filled"', () => {
      const wrapper = mountAC({ variant: 'filled' })
      expect(wrapper.find(ns.m('variant-filled')).exists()).toBe(true)
    })

    it('variant="borderless"', () => {
      const wrapper = mountAC({ variant: 'borderless' })
      expect(wrapper.find(ns.m('variant-borderless')).exists()).toBe(true)
    })

    it('variant="underlined"', () => {
      const wrapper = mountAC({ variant: 'underlined' })
      expect(wrapper.find(ns.m('variant-underlined')).exists()).toBe(true)
    })
  })

  describe('status（M-A3：Ant 风格校验状态 + Form 联动）', () => {
    it('status="error" 加 __wrap--status-error 类', () => {
      const wrapper = mountAC({ status: 'error' })
      expect(wrapper.find(ns.em('wrap', 'status-error')).exists()).toBe(true)
    })

    it('status="warning" 加 __wrap--status-warning 类', () => {
      const wrapper = mountAC({ status: 'warning' })
      expect(wrapper.find(ns.em('wrap', 'status-warning')).exists()).toBe(true)
    })

    it('inherits validateStatus from injected FormItem context', () => {
      const validateStatus = ref<'' | 'error'>('error')
      const wrapper = mount(AutoComplete, {
        props: { options: SAMPLE },
        attachTo: document.body,
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
      wrappers.push(wrapper)
      expect(wrapper.find(ns.em('wrap', 'status-error')).exists()).toBe(true)
    })
  })

  describe('M-A4 clearIcon 钩子', () => {
    it('clearIcon prop（CSS 类名）渲染 <i> 替代默认 ✕', () => {
      const wrapper = mount(AutoComplete, {
        props: { modelValue: 'hello', allowClear: true, clearIcon: 'my-clear' },
        global: { provide: { [formItemInjectionKey as any]: null } },
      })
      wrappers.push(wrapper)
      expect(wrapper.find(`${ns.e('clear')} i.my-clear`).exists()).toBe(true)
      expect(wrapper.find(ns.e('clear')).text()).not.toContain('✕')
    })

    it('clearIcon slot 优先级高于 prop', () => {
      const wrapper = mount(AutoComplete, {
        props: { modelValue: 'hello', allowClear: true, clearIcon: 'my-clear' },
        slots: { clearIcon: () => h('span', { class: 'slot-clear' }, 'X') },
        global: { provide: { [formItemInjectionKey as any]: null } },
      })
      wrappers.push(wrapper)
      expect(wrapper.find('.slot-clear').exists()).toBe(true)
      expect(wrapper.find('i.my-clear').exists()).toBe(false)
    })
  })
})

describe('auto-complete M-A2 classNames / styles 钩子', () => {
  it('classNames.root 注入到根节点', () => {
    const wrapper = mountAC({ classNames: { root: 'my-root' } })
    expect(wrapper.find(ns.b()).classes()).toContain('my-root')
  })

  it('styles.root 注入到根节点 style', () => {
    const wrapper = mountAC({ styles: { root: { color: 'red' } } })
    expect(wrapper.find(ns.b()).attributes('style') || '').toContain('color: red')
  })
})
