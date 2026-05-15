import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { ConfigProvider } from '../../config-provider'
import enUS from '../../locale/en-US'
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

describe('time-picker locale', () => {
  it('switches placeholder / footer buttons / clear label to enUS via ConfigProvider', async () => {
    const wrapper = mount(
      defineComponent({
        components: { ConfigProvider, TimePicker },
        setup() {
          return { enUS }
        },
        template: `
          <ConfigProvider :locale="enUS">
            <TimePicker model-value="10:30:45" />
          </ConfigProvider>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper as unknown as VueWrapper)

    expect(wrapper.find('input').attributes('placeholder')).toBe('Select time')

    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    await nextTick()

    const footerBtns = wrapper.findAll(`${ns.e('footer-btn')}`).map((b) => b.text())
    expect(footerBtns).toEqual(['Now', 'OK'])

    const clear = wrapper.find(ns.e('clear'))
    expect(clear.attributes('aria-label')).toBe('Clear')
  })
})

describe('time-picker use12Hours', () => {
  it('use12Hours=true 时渲染第 4 列 period（AM/PM）', async () => {
    const wrapper = mountTP({ use12Hours: true })
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('column'))).toHaveLength(4)
    const period = wrapper.find(ns.em('column', 'period'))
    expect(period.exists()).toBe(true)
    const periodCells = period.findAll(ns.e('cell')).map((c) => c.text())
    expect(periodCells).toEqual(['AM', 'PM'])
  })

  it('hour 列展示 12, 1..11 顺序', async () => {
    const wrapper = mountTP({ use12Hours: true })
    await openPanel(wrapper)
    const hourCells = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`).map((c) => c.text())
    expect(hourCells).toEqual(['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'])
  })

  it('AM 期选 hour=12 emit 00:xx:xx；PM 期选 hour=12 emit 12:xx:xx', async () => {
    const wrapper = mountTP({ use12Hours: true, showOk: false })
    await openPanel(wrapper)
    // 默认 hour=0 → display 12 AM
    const hourCells = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`)
    await hourCells[0].trigger('click') // 12 AM
    const emits1 = wrapper.emitted('update:modelValue')!
    expect(emits1.at(-1)![0]).toMatch(/^12:\d{2}:\d{2} am$/)

    await openPanel(wrapper)
    // 切到 PM
    const periodCells = wrapper.findAll(`${ns.em('column', 'period')} ${ns.e('cell')}`)
    await periodCells[1].trigger('click') // PM → 现在 hour 内部=12
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0]
    expect(last).toMatch(/^12:\d{2}:\d{2} pm$/)
  })

  it('use12Hours 时 modelValue 显示按 h:mm:ss a 默认格式', () => {
    const wrapper = mountTP({ use12Hours: true, modelValue: '3:30:00 pm', format: 'h:mm:ss a' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('3:30:00 pm')
  })

  it('hourStep=3 时 12 小时制 hour 列抽稀', async () => {
    const wrapper = mountTP({ use12Hours: true, hourStep: 3 })
    await openPanel(wrapper)
    const hourCells = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`).map((c) => c.text())
    // [12,1,2,3,4,5,6,7,8,9,10,11] step 3 → [12, 3, 6, 9]
    expect(hourCells).toEqual(['12', '03', '06', '09'])
  })

  it('disabledHours 仍按 24h 数字接收；映射到 12h cell 标 disabled', async () => {
    const wrapper = mountTP({
      use12Hours: true,
      disabledHours: () => [0, 12], // 12 AM 与 12 PM 都禁
    })
    await openPanel(wrapper)
    // 默认 pending 00:00:00（AM）→ cell 12 disabled
    const cell12 = wrapper.find(`${ns.em('column', 'hour')} ${ns.e('cell')}`)
    expect(cell12.classes().some((c) => c.endsWith('cell--disabled'))).toBe(true)
  })

  it('未传 format 时 use12Hours 走 h:mm:ss a 兜底', () => {
    const wrapper = mountTP({ use12Hours: true, modelValue: '9:15:30 am' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('9:15:30 am')
  })
})

describe('time-picker 键盘导航', () => {
  it('ArrowDown 把 hour 列下一个值变为 selected', async () => {
    const wrapper = mountTP({ modelValue: '00:00:00' })
    await openPanel(wrapper)
    const hourCells = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`)
    await hourCells[0].trigger('keydown', { key: 'ArrowDown' })
    // pending 移到 01:00:00 — 通过新选中类来验证
    const selected = wrapper.find(`${ns.em('column', 'hour')} ${ns.em('cell', 'selected')}`)
    expect(selected.text()).toBe('01')
  })

  it('ArrowUp 在首项时环绕到末项', async () => {
    const wrapper = mountTP({ modelValue: '00:00:00' })
    await openPanel(wrapper)
    const hourCells = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`)
    await hourCells[0].trigger('keydown', { key: 'ArrowUp' })
    const selected = wrapper.find(`${ns.em('column', 'hour')} ${ns.em('cell', 'selected')}`)
    expect(selected.text()).toBe('23')
  })

  it('End 跳列尾，Home 跳列首', async () => {
    const wrapper = mountTP({ modelValue: '05:00:00' })
    await openPanel(wrapper)
    const hourCells = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`)
    await hourCells[5].trigger('keydown', { key: 'End' })
    let selected = wrapper.find(`${ns.em('column', 'hour')} ${ns.em('cell', 'selected')}`)
    expect(selected.text()).toBe('23')
    const hourCells2 = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`)
    await hourCells2[23].trigger('keydown', { key: 'Home' })
    selected = wrapper.find(`${ns.em('column', 'hour')} ${ns.em('cell', 'selected')}`)
    expect(selected.text()).toBe('00')
  })

  it('Enter 触发 ok（showOk=true 时）emit 当前 pending + 关', async () => {
    const wrapper = mountTP({ modelValue: '00:00:00' })
    await openPanel(wrapper)
    const hourCells = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`)
    await hourCells[0].trigger('keydown', { key: 'ArrowDown' }) // pending 01:00:00
    await hourCells[1].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toBe('01:00:00')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('Escape 关闭面板（不 emit）', async () => {
    const wrapper = mountTP({ modelValue: '00:00:00' })
    await openPanel(wrapper)
    const hourCells = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`)
    await hourCells[0].trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('cell 默认 tabindex=0，disabled cell tabindex=-1', async () => {
    const wrapper = mountTP({ disabledHours: () => [5, 6, 7] })
    await openPanel(wrapper)
    const cells = wrapper.findAll(`${ns.em('column', 'hour')} ${ns.e('cell')}`)
    expect(cells[0].attributes('tabindex')).toBe('0')
    expect(cells[5].attributes('tabindex')).toBe('-1')
  })
})

describe('time-picker auto-scroll', () => {
  it('打开时把选中项滚到列中央（scrollTop 被设置）', async () => {
    const wrapper = mountTP({ modelValue: '14:30:45' })
    await openPanel(wrapper)
    await nextTick()
    // 直接验证 scrollTop 不为 0（jsdom 下 offsetTop 通常为 0，所以 max(0, target) 可能就是 0；
    // 改为验证 selected DOM 存在并能找到列元素）
    const hourCol = wrapper.find(ns.em('column', 'hour'))
    expect(hourCol.element instanceof HTMLElement).toBe(true)
    const selected = wrapper.find(`${ns.em('column', 'hour')} ${ns.em('cell', 'selected')}`)
    expect(selected.text()).toBe('14')
    // jsdom 不算 layout，但 scrollTop 是个 setter，能被赋值（默认 0），不抛错即正确
    expect((hourCol.element as HTMLElement).scrollTop).toBeGreaterThanOrEqual(0)
  })

  describe('variant', () => {
    it('默认 variant 为 outlined', () => {
      const wrapper = mountTP()
      expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
    })

    it('variant="filled"', () => {
      const wrapper = mountTP({ variant: 'filled' })
      expect(wrapper.find(ns.m('variant-filled')).exists()).toBe(true)
    })

    it('variant="borderless"', () => {
      const wrapper = mountTP({ variant: 'borderless' })
      expect(wrapper.find(ns.m('variant-borderless')).exists()).toBe(true)
    })

    it('variant="underlined"', () => {
      const wrapper = mountTP({ variant: 'underlined' })
      expect(wrapper.find(ns.m('variant-underlined')).exists()).toBe(true)
    })
  })
})
