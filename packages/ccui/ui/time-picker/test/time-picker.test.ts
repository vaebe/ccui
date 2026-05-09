import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { TimePicker } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Form, FormItem } from '../../form'

const ns = useNamespace('time-picker', true)
const wrappers: VueWrapper[] = []

function mountTP(props: Record<string, unknown> = {}) {
  const wrapper = mount(TimePicker, { props, attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}

async function openPanel(wrapper: VueWrapper) {
  await wrapper.find(ns.e('input-wrap')).trigger('click')
  await nextTick()
  await nextTick()
}

function findCells(wrapper: VueWrapper, columnType: 'hour' | 'minute' | 'second') {
  return wrapper.findAll(`${ns.em('column', columnType)} ${ns.e('cell')}`)
}

beforeEach(() => {
  vi.setSystemTime(new Date('2026-05-09T10:30:45.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
})

describe('time-picker rendering', () => {
  it('renders input with default placeholder', () => {
    const wrapper = mountTP()
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('请选择时间')
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('renders custom placeholder', () => {
    const wrapper = mountTP({ placeholder: '挑个时间' })
    expect(wrapper.find('input').attributes('placeholder')).toBe('挑个时间')
  })

  it('formats string modelValue with default HH:mm:ss', () => {
    const wrapper = mountTP({ modelValue: '08:15:30' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('08:15:30')
  })

  it('formats Date modelValue', () => {
    const date = new Date()
    date.setHours(13, 7, 9, 0)
    const wrapper = mountTP({ modelValue: date })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('13:07:09')
  })

  it('respects custom format', () => {
    const wrapper = mountTP({ modelValue: '14:25', format: 'HH:mm' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('14:25')
  })

  it('renders empty for invalid input', () => {
    const wrapper = mountTP({ modelValue: 'not-a-time' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })
})

describe('time-picker popup open/close', () => {
  it('opens panel on click and emits open-change(true)', async () => {
    const wrapper = mountTP()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    expect(wrapper.emitted('open-change')?.[0]).toEqual([true])
  })

  it('closes on second click', async () => {
    const wrapper = mountTP()
    await openPanel(wrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('closes on outside mousedown', async () => {
    const wrapper = mountTP()
    await openPanel(wrapper)
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('does not open when disabled', async () => {
    const wrapper = mountTP({ disabled: true })
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('focuses input on autoFocus', async () => {
    const wrapper = mountTP({ autoFocus: true })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.find('input').element)
  })
})

describe('time-picker columns', () => {
  it('renders three columns by default', async () => {
    const wrapper = mountTP()
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('column')).length).toBe(3)
  })

  it('hides hour column when showHour=false', async () => {
    const wrapper = mountTP({ showHour: false })
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('column')).length).toBe(2)
    expect(wrapper.find(ns.em('column', 'hour')).exists()).toBe(false)
  })

  it('hides minute column when showMinute=false', async () => {
    const wrapper = mountTP({ showMinute: false })
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('column')).length).toBe(2)
    expect(wrapper.find(ns.em('column', 'minute')).exists()).toBe(false)
  })

  it('hides second column when showSecond=false', async () => {
    const wrapper = mountTP({ showSecond: false })
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('column')).length).toBe(2)
    expect(wrapper.find(ns.em('column', 'second')).exists()).toBe(false)
  })

  it('hour column has 24 cells with default step', async () => {
    const wrapper = mountTP()
    await openPanel(wrapper)
    expect(findCells(wrapper, 'hour').length).toBe(24)
  })

  it('applies hourStep correctly (step=4 → 6 cells: 0,4,8,12,16,20)', async () => {
    const wrapper = mountTP({ hourStep: 4 })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'hour')
    expect(cells.length).toBe(6)
    expect(cells.map((c) => c.text())).toEqual(['00', '04', '08', '12', '16', '20'])
  })

  it('applies minuteStep correctly (step=15 → 4 cells)', async () => {
    const wrapper = mountTP({ minuteStep: 15 })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'minute')
    expect(cells.length).toBe(4)
    expect(cells.map((c) => c.text())).toEqual(['00', '15', '30', '45'])
  })

  it('applies secondStep correctly (step=30 → 2 cells)', async () => {
    const wrapper = mountTP({ secondStep: 30 })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'second')
    expect(cells.length).toBe(2)
    expect(cells.map((c) => c.text())).toEqual(['00', '30'])
  })

  it('marks selected cells from modelValue', async () => {
    const wrapper = mountTP({ modelValue: '13:25:50' })
    await openPanel(wrapper)
    const selectedHour = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.em('cell', 'selected')}`)
    const selectedMin = wrapper.findAll(`${ns.em('column', 'minute')} ${ns.em('cell', 'selected')}`)
    const selectedSec = wrapper.findAll(`${ns.em('column', 'second')} ${ns.em('cell', 'selected')}`)
    expect(selectedHour.length).toBe(1)
    expect(selectedHour[0].text()).toBe('13')
    expect(selectedMin[0].text()).toBe('25')
    expect(selectedSec[0].text()).toBe('50')
  })
})

describe('time-picker disabled values', () => {
  it('marks hours as disabled via disabledHours', async () => {
    const wrapper = mountTP({ disabledHours: () => [0, 1, 2] })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'hour')
    expect(cells[0].classes().some((c) => c.endsWith('cell--disabled'))).toBe(true)
    expect(cells[1].classes().some((c) => c.endsWith('cell--disabled'))).toBe(true)
    expect(cells[3].classes().some((c) => c.endsWith('cell--disabled'))).toBe(false)
  })

  it('marks minutes as disabled via disabledMinutes', async () => {
    const wrapper = mountTP({
      modelValue: '12:00:00',
      disabledMinutes: (h: number) => (h === 12 ? [0, 1, 2] : []),
    })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'minute')
    expect(cells[0].classes().some((c) => c.endsWith('cell--disabled'))).toBe(true)
  })

  it('disabled cell click does not change pending', async () => {
    const wrapper = mountTP({ disabledHours: () => [5], showOk: false })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'hour')
    await cells[5].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('time-picker selection (showOk=false → eager emit)', () => {
  it('emits string value on hour click', async () => {
    const wrapper = mountTP({ modelValue: '00:00:00', showOk: false, showNow: false })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'hour')
    await cells[14].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['14:00:00'])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('emits Date when valueFormat=date', async () => {
    const wrapper = mountTP({
      modelValue: '00:00:00',
      valueFormat: 'date',
      showOk: false,
      showNow: false,
    })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'minute')
    await cells[5].trigger('click')
    const emitted = wrapper.emitted('update:modelValue')![0][0] as Date
    expect(emitted).toBeInstanceOf(Date)
    expect(dayjs(emitted).format('mm')).toBe('05')
  })

  it('emits number when valueFormat=number', async () => {
    const wrapper = mountTP({
      modelValue: '00:00:00',
      valueFormat: 'number',
      showOk: false,
      showNow: false,
    })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'second')
    await cells[7].trigger('click')
    const emitted = wrapper.emitted('update:modelValue')![0][0] as number
    expect(typeof emitted).toBe('number')
    expect(dayjs(emitted).format('ss')).toBe('07')
  })
})

describe('time-picker footer (showOk=true → confirm)', () => {
  it('hour click only updates pending, no emit yet', async () => {
    const wrapper = mountTP({ modelValue: '00:00:00' })
    await openPanel(wrapper)
    const cells = findCells(wrapper, 'hour')
    await cells[10].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    // 面板还在
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    // pending 选中视觉切到 10
    const newSelected = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.em('cell', 'selected')}`)[0]
    expect(newSelected.text()).toBe('10')
  })

  it('clicks ok button to commit pending and close', async () => {
    const wrapper = mountTP({ modelValue: '00:00:00' })
    await openPanel(wrapper)
    await findCells(wrapper, 'hour')[8].trigger('click')
    await findCells(wrapper, 'minute')[15].trigger('click')
    await findCells(wrapper, 'second')[30].trigger('click')
    await wrapper.find(`${ns.em('footer-btn', 'ok')}`).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['08:15:30'])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('clicks now button to set pending to current time and stays open when showOk=true', async () => {
    const wrapper = mountTP()
    await openPanel(wrapper)
    await wrapper.find(`${ns.em('footer-btn', 'now')}`).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('now+ok commits current time', async () => {
    const wrapper = mountTP()
    await openPanel(wrapper)
    await wrapper.find(`${ns.em('footer-btn', 'now')}`).trigger('click')
    await wrapper.find(`${ns.em('footer-btn', 'ok')}`).trigger('click')
    const v = wrapper.emitted('update:modelValue')![0][0] as string
    // 期望接近 fakeNow 10:30:45 — 但本地时区会调整 hour，只验证 mm:ss
    expect(v.endsWith(':30:45') || /:30:4\d$/.test(v)).toBe(true)
  })

  it('now button emits immediately when showOk=false', async () => {
    const wrapper = mountTP({ showOk: false })
    await openPanel(wrapper)
    await wrapper.find(`${ns.em('footer-btn', 'now')}`).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.length).toBe(1)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('hides footer entirely when both showNow and showOk are false', async () => {
    const wrapper = mountTP({ showNow: false, showOk: false })
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('footer')).exists()).toBe(false)
  })

  it('renders custom footer texts', async () => {
    const wrapper = mountTP({ nowText: 'Now', okText: 'Confirm' })
    await openPanel(wrapper)
    expect(wrapper.find(`${ns.em('footer-btn', 'now')}`).text()).toBe('Now')
    expect(wrapper.find(`${ns.em('footer-btn', 'ok')}`).text()).toBe('Confirm')
  })
})

describe('time-picker clearable', () => {
  it('shows clear when value present', () => {
    const wrapper = mountTP({ modelValue: '08:15:30' })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
  })

  it('hides clear without value', () => {
    const wrapper = mountTP()
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('hides clear when clearable=false', () => {
    const wrapper = mountTP({ modelValue: '08:15:30', clearable: false })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('emits null and stops propagation on clear click', async () => {
    const wrapper = mountTP({ modelValue: '08:15:30' })
    await wrapper.find(ns.e('clear')).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('change')?.[0]).toEqual([null, ''])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})

describe('time-picker size and status', () => {
  it.each([['small'], ['default'], ['large']])('applies size modifier %s', (size) => {
    const wrapper = mountTP({ size })
    expect(wrapper.classes()).toContain(`ccui-time-picker--${size}`)
  })

  it('applies status modifier when set', () => {
    const wrapper = mountTP({ status: 'error' })
    expect(wrapper.classes()).toContain('ccui-time-picker--status-error')
  })
})

describe('time-picker integrations', () => {
  it('inherits validate status from FormItem', async () => {
    const Wrapper = defineComponent({
      setup() {
        const model = ref<{ t: string }>({ t: '' })
        const rules = { t: [{ required: true, message: '必填' }] }
        return () =>
          h(
            Form,
            { model: model.value, rules },
            {
              default: () =>
                h(FormItem, { name: 't', prop: 't' }, { default: () => h(TimePicker, { modelValue: model.value.t }) }),
            },
          )
      },
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper as unknown as VueWrapper)
    await nextTick()
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

  it('teleports panel to body when popupAppendToBody', async () => {
    const wrapper = mountTP({ popupAppendToBody: true })
    await openPanel(wrapper)
    const panelInBody = document.body.querySelector(ns.e('panel'))
    expect(panelInBody).toBeTruthy()
  })

  it('uses custom getPopupContainer', async () => {
    const container = document.createElement('div')
    container.id = 'custom-tp-host'
    document.body.appendChild(container)
    const wrapper = mountTP({ getPopupContainer: () => container })
    await openPanel(wrapper)
    expect(container.querySelector(ns.e('panel'))).toBeTruthy()
    container.remove()
  })

  it('reflects external v-model echo back into pending after open', async () => {
    const Wrapper = defineComponent({
      setup() {
        const value = ref('00:00:00')
        return () =>
          h(TimePicker, {
            modelValue: value.value,
            'onUpdate:modelValue': (v: string) => (value.value = v),
            showOk: false,
            showNow: false,
          })
      },
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper as unknown as VueWrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    await findCells(wrapper as unknown as VueWrapper, 'hour')[20].trigger('click')
    await nextTick()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('20:00:00')
  })
})
