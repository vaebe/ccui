import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { DatePicker } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Form, FormItem } from '../../form'

const ns = useNamespace('date-picker', true)
const wrappers: VueWrapper[] = []

function mountDP(props: Record<string, unknown> = {}) {
  const wrapper = mount(DatePicker, { props, attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}

async function openPanel(wrapper: VueWrapper) {
  await wrapper.find(ns.e('input-wrap')).trigger('click')
  await nextTick()
  await nextTick()
}

beforeEach(() => {
  // 把"今天"固定在 2026-05-09，避免基于真实日期的快照漂移
  vi.setSystemTime(new Date('2026-05-09T08:00:00.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
})

describe('date-picker rendering', () => {
  it('renders input with default placeholder', () => {
    const wrapper = mountDP()
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('请选择日期')
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('renders custom placeholder', () => {
    const wrapper = mountDP({ placeholder: '请挑一个日子' })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请挑一个日子')
  })

  it('formats string modelValue with default format', () => {
    const wrapper = mountDP({ modelValue: '2026-03-15' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2026-03-15')
  })

  it('formats Date modelValue', () => {
    const wrapper = mountDP({ modelValue: new Date('2026-07-04T00:00:00') })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2026-07-04')
  })

  it('formats number (ms timestamp) modelValue', () => {
    const ts = dayjs('2026-08-20').valueOf()
    const wrapper = mountDP({ modelValue: ts })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2026-08-20')
  })

  it('respects custom format', () => {
    const wrapper = mountDP({ modelValue: '2026/03/15', format: 'YYYY/MM/DD' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2026/03/15')
  })

  it('renders empty string when modelValue is invalid', () => {
    const wrapper = mountDP({ modelValue: 'not-a-date' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })
})

describe('date-picker popup open/close', () => {
  it('opens panel on input click and emits open-change(true)', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    expect(wrapper.emitted('open-change')?.[0]).toEqual([true])
  })

  it('closes panel on second click', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
    expect(wrapper.emitted('open-change')?.[1]).toEqual([false])
  })

  it('closes panel on outside click', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('does not open when disabled', async () => {
    const wrapper = mountDP({ disabled: true })
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('focuses input on autoFocus', async () => {
    const wrapper = mountDP({ autoFocus: true })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.find('input').element)
  })
})

describe('date-picker selection', () => {
  it('selects a date and emits string value (default valueFormat)', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    // grid 里点 2026-05-15
    const cells = wrapper.findAll(ns.e('cell'))
    const target = cells.find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '15')
    expect(target).toBeTruthy()
    await target!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-05-15'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-05-15', '2026-05-15'])
  })

  it('emits Date when valueFormat is date', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09', valueFormat: 'date' })
    await openPanel(wrapper)
    const target = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '20')
    await target!.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')![0][0] as Date
    expect(emitted).toBeInstanceOf(Date)
    expect(dayjs(emitted).format('YYYY-MM-DD')).toBe('2026-05-20')
  })

  it('emits number (ms timestamp) when valueFormat is number', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09', valueFormat: 'number' })
    await openPanel(wrapper)
    const target = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '11')
    await target!.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')![0][0] as number
    expect(typeof emitted).toBe('number')
    expect(dayjs(emitted).format('YYYY-MM-DD')).toBe('2026-05-11')
  })

  it('closes panel after selecting a date', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    const target = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '12')
    await target!.trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('does not re-emit change when clicking the same selected day', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    const target = wrapper
      .findAll(ns.e('cell'))
      .find((c) => c.classes().some((cls) => cls.endsWith('cell--selected')) && c.text() === '9')
    await target!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    // 但面板会关闭
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('updates input display after v-model echo', async () => {
    const Wrapper = defineComponent({
      setup() {
        const value = ref('2026-05-09')
        return () => h(DatePicker, { modelValue: value.value, 'onUpdate:modelValue': (v: string) => (value.value = v) })
      },
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper as unknown as VueWrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    const target = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '22')
    await target!.trigger('click')
    await nextTick()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2026-05-22')
  })
})

describe('date-picker disabledDate', () => {
  it('marks date cells as disabled', async () => {
    const wrapper = mountDP({
      modelValue: '2026-05-09',
      disabledDate: (d: dayjs.Dayjs) => d.date() < 10,
    })
    await openPanel(wrapper)
    const cell = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '5')
    expect(cell!.classes().some((cls) => cls.endsWith('cell--disabled'))).toBe(true)
  })

  it('ignores click on disabled date', async () => {
    const wrapper = mountDP({
      modelValue: '2026-05-09',
      disabledDate: (d: dayjs.Dayjs) => d.date() < 10,
    })
    await openPanel(wrapper)
    const cell = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '5')
    await cell!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })
})

describe('date-picker clearable', () => {
  it('shows clear button when value present and clearable', () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
  })

  it('hides clear button when no value', () => {
    const wrapper = mountDP()
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('hides clear when clearable=false', () => {
    const wrapper = mountDP({ modelValue: '2026-05-09', clearable: false })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('hides clear when disabled', () => {
    const wrapper = mountDP({ modelValue: '2026-05-09', disabled: true })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('emits null on clear click and stops propagation', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await wrapper.find(ns.e('clear')).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('change')?.[0]).toEqual([null, ''])
    // panel 没被打开（stopPropagation 生效）
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})

describe('date-picker month / year navigation', () => {
  it('navigates to previous month without emitting change', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    const label = () => wrapper.find(ns.e('panel-label')).text()
    expect(label()).toContain('5 月')
    await wrapper.find('.' + ns.em('arrow', 'prev-month').slice(1)).trigger('click')
    expect(label()).toContain('4 月')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('navigates next month / year', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    await wrapper.find('.' + ns.em('arrow', 'next-month').slice(1)).trigger('click')
    expect(wrapper.find(ns.e('panel-label')).text()).toContain('6 月')
    await wrapper.find('.' + ns.em('arrow', 'next-year').slice(1)).trigger('click')
    expect(wrapper.find(ns.e('panel-label')).text()).toContain('2027')
    await wrapper.find('.' + ns.em('arrow', 'prev-year').slice(1)).trigger('click')
    expect(wrapper.find(ns.e('panel-label')).text()).toContain('2026')
  })

  it('jumps panel back to selected month on reopen', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    await wrapper.find('.' + ns.em('arrow', 'next-month').slice(1)).trigger('click')
    expect(wrapper.find(ns.e('panel-label')).text()).toContain('6 月')
    // 关闭再打开
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel-label')).text()).toContain('5 月')
  })
})

describe('date-picker grid structure', () => {
  it('renders 42 cells', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('cell')).length).toBe(42)
  })

  it('marks today with today modifier', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-01' })
    await openPanel(wrapper)
    const todayCells = wrapper
      .findAll(ns.e('cell'))
      .filter((c) => c.classes().some((cls) => cls.endsWith('cell--today')))
    expect(todayCells.length).toBe(1)
    expect(todayCells[0].text()).toBe('9')
  })

  it('uses Sunday-first labels by default', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    const labels = wrapper.findAll(ns.e('week-cell')).map((c) => c.text())
    expect(labels).toEqual(['日', '一', '二', '三', '四', '五', '六'])
  })

  it('switches to Monday-first labels when weekStart=1', async () => {
    const wrapper = mountDP({ weekStart: 1 })
    await openPanel(wrapper)
    const labels = wrapper.findAll(ns.e('week-cell')).map((c) => c.text())
    expect(labels).toEqual(['一', '二', '三', '四', '五', '六', '日'])
  })

  it('marks outside-month cells', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    const outsideCells = wrapper
      .findAll(ns.e('cell'))
      .filter((c) => c.classes().some((cls) => cls.endsWith('cell--outside')))
    // 2026-05 是 5 月，前后会有一些 4 月末和 6 月初的格子
    expect(outsideCells.length).toBeGreaterThan(0)
  })
})

describe('date-picker size and status', () => {
  it.each([['small'], ['default'], ['large']])('applies size modifier %s', (size) => {
    const wrapper = mountDP({ size })
    expect(wrapper.classes()).toContain(`ccui-date-picker--${size}`)
  })

  it('applies status modifier when status prop set', () => {
    const wrapper = mountDP({ status: 'error' })
    expect(wrapper.classes()).toContain('ccui-date-picker--status-error')
  })
})

describe('date-picker Form integration', () => {
  it('inherits validate status from FormItem', async () => {
    const Wrapper = defineComponent({
      setup() {
        const model = ref<{ d: string }>({ d: '' })
        const rules = { d: [{ required: true, message: '必填' }] }
        return () =>
          h(
            Form,
            { model: model.value, rules },
            {
              default: () =>
                h(FormItem, { name: 'd', prop: 'd' }, { default: () => h(DatePicker, { modelValue: model.value.d }) }),
            },
          )
      },
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper as unknown as VueWrapper)
    await nextTick()
    // 触发校验
    const form = wrapper.findComponent(Form).vm.$.exposed as { validate: () => Promise<boolean> }
    await form.validate().catch(() => false)
    await nextTick()
    expect(
      wrapper
        .find(ns.b())
        .classes()
        .some((c) => c.includes('status-error')),
    ).toBe(true)
  })
})

describe('date-picker popup teleport', () => {
  it('teleports panel to body when popupAppendToBody', async () => {
    const wrapper = mountDP({ popupAppendToBody: true })
    await openPanel(wrapper)
    // panel 不在 wrapper.element 子树里，但应该挂在 body 上
    const panelInBody = document.body.querySelector(ns.e('panel'))
    expect(panelInBody).toBeTruthy()
  })

  it('uses custom getPopupContainer', async () => {
    const container = document.createElement('div')
    container.id = 'custom-popup-host'
    document.body.appendChild(container)
    const wrapper = mountDP({ getPopupContainer: () => container })
    await openPanel(wrapper)
    expect(container.querySelector(ns.e('panel'))).toBeTruthy()
    container.remove()
  })
})
