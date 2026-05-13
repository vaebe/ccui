import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { ConfigProvider } from '../../config-provider'
import enUS from '../../locale/en-US'
import { RangePicker } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Form, FormItem } from '../../form'

const ns = useNamespace('range-picker', true)
const wrappers: VueWrapper[] = []

function mountRP(props: Record<string, unknown> = {}) {
  const wrapper = mount(RangePicker, { props, attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}

async function openPanel(wrapper: VueWrapper, side: 'start' | 'end' = 'start') {
  const selector = side === 'start' ? `${ns.em('input', 'start')}` : `${ns.em('input', 'end')}`
  await wrapper.find(selector).trigger('click')
  await nextTick()
  await nextTick()
}

function findCells(wrapper: VueWrapper, side: 'left' | 'right') {
  return wrapper.findAll(`${ns.em('panel-side', side)} ${ns.e('cell')}`)
}

function findCellByDay(wrapper: VueWrapper, side: 'left' | 'right', day: string) {
  return findCells(wrapper, side).find(
    (c) => !c.classes().some((cls) => cls.endsWith('cell--outside')) && c.text() === day,
  )
}

beforeEach(() => {
  vi.setSystemTime(new Date('2026-05-09T08:00:00.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
})

describe('range-picker rendering', () => {
  it('renders two inputs with default placeholders and separator', () => {
    const wrapper = mountRP()
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBe(2)
    expect(inputs[0].attributes('placeholder')).toBe('开始日期')
    expect(inputs[1].attributes('placeholder')).toBe('结束日期')
    expect(wrapper.find(ns.e('separator')).text()).toBe('~')
  })

  it('renders custom placeholders and separator', () => {
    const wrapper = mountRP({ placeholder: ['Start', 'End'], separator: '→' })
    const inputs = wrapper.findAll('input')
    expect(inputs[0].attributes('placeholder')).toBe('Start')
    expect(inputs[1].attributes('placeholder')).toBe('End')
    expect(wrapper.find(ns.e('separator')).text()).toBe('→')
  })

  it('formats string range modelValue', () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('2026-05-01')
    expect((inputs[1].element as HTMLInputElement).value).toBe('2026-05-15')
  })

  it('formats Date range modelValue', () => {
    const wrapper = mountRP({
      modelValue: [new Date('2026-03-10T00:00:00'), new Date('2026-03-20T00:00:00')],
    })
    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('2026-03-10')
    expect((inputs[1].element as HTMLInputElement).value).toBe('2026-03-20')
  })

  it('respects custom format', () => {
    const wrapper = mountRP({ modelValue: ['2026/01/01', '2026/01/05'], format: 'YYYY/MM/DD' })
    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('2026/01/01')
    expect((inputs[1].element as HTMLInputElement).value).toBe('2026/01/05')
  })

  it('renders empty when modelValue is null', () => {
    const wrapper = mountRP({ modelValue: null })
    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('')
    expect((inputs[1].element as HTMLInputElement).value).toBe('')
  })
})

describe('range-picker popup open/close', () => {
  it('opens via start input and emits open-change', async () => {
    const wrapper = mountRP()
    await openPanel(wrapper, 'start')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    expect(wrapper.emitted('open-change')?.[0]).toEqual([true])
  })

  it('opens via end input', async () => {
    const wrapper = mountRP()
    await openPanel(wrapper, 'end')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('closes on outside mousedown', async () => {
    const wrapper = mountRP()
    await openPanel(wrapper)
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('does not open when disabled', async () => {
    const wrapper = mountRP({ disabled: true })
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('renders two side panels with adjacent months', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await openPanel(wrapper)
    const sides = wrapper.findAll(ns.e('panel-side'))
    expect(sides.length).toBe(2)
    const labels = wrapper.findAll(ns.e('panel-label')).map((l) => l.text())
    expect(labels[0]).toContain('5 月')
    expect(labels[1]).toContain('6 月')
  })

  it('focuses start input on autoFocus', async () => {
    const wrapper = mountRP({ autoFocus: true })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.findAll('input')[0].element)
  })
})

describe('range-picker selection flow', () => {
  it('first click sets pending start and stays open', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await openPanel(wrapper)
    await findCellByDay(wrapper, 'left', '5')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    // start 在 input 显示
    const startInput = wrapper.findAll('input')[0].element as HTMLInputElement
    expect(startInput.value).toBe('2026-05-05')
  })

  it('second click commits and closes', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await openPanel(wrapper)
    await findCellByDay(wrapper, 'left', '8')!.trigger('click')
    await findCellByDay(wrapper, 'left', '20')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-05-08', '2026-05-20']])
    expect(wrapper.emitted('change')?.[0]).toEqual([
      ['2026-05-08', '2026-05-20'],
      ['2026-05-08', '2026-05-20'],
    ])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('auto-swaps when end < start', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await openPanel(wrapper)
    // 先点 20，然后点 5 → 应输出 [05, 20]
    await findCellByDay(wrapper, 'left', '20')!.trigger('click')
    await findCellByDay(wrapper, 'left', '5')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-05-05', '2026-05-20']])
  })

  it('start can be in left month and end in right month', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await openPanel(wrapper)
    await findCellByDay(wrapper, 'left', '25')!.trigger('click')
    await findCellByDay(wrapper, 'right', '10')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-05-25', '2026-06-10']])
  })

  it('emits Date pair when valueFormat=date', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'], valueFormat: 'date' })
    await openPanel(wrapper)
    await findCellByDay(wrapper, 'left', '7')!.trigger('click')
    await findCellByDay(wrapper, 'left', '17')!.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')![0][0] as [Date, Date]
    expect(emitted[0]).toBeInstanceOf(Date)
    expect(emitted[1]).toBeInstanceOf(Date)
    expect(dayjs(emitted[0]).format('YYYY-MM-DD')).toBe('2026-05-07')
    expect(dayjs(emitted[1]).format('YYYY-MM-DD')).toBe('2026-05-17')
  })

  it('emits ms pair when valueFormat=number', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'], valueFormat: 'number' })
    await openPanel(wrapper)
    await findCellByDay(wrapper, 'left', '3')!.trigger('click')
    await findCellByDay(wrapper, 'left', '13')!.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')![0][0] as [number, number]
    expect(typeof emitted[0]).toBe('number')
    expect(dayjs(emitted[0]).format('YYYY-MM-DD')).toBe('2026-05-03')
    expect(dayjs(emitted[1]).format('YYYY-MM-DD')).toBe('2026-05-13')
  })
})

describe('range-picker hover preview', () => {
  it('marks in-hover-range cells while waiting for end', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await openPanel(wrapper)
    await findCellByDay(wrapper, 'left', '8')!.trigger('click')
    // 鼠标 hover 到 12 → 8 和 12 之间应该有 in-hover-range
    await findCellByDay(wrapper, 'left', '12')!.trigger('mouseenter')
    const inHover = wrapper
      .findAll(`${ns.em('panel-side', 'left')} ${ns.e('cell')}`)
      .filter((c) => c.classes().some((cls) => cls.endsWith('cell--in-hover-range')))
    // 9, 10, 11 三个之间日 (8 和 12 不算 in-hover-range，他们是 start 与 hover 的边界)
    expect(inHover.length).toBe(3)
  })

  it('does not show hover range before start picked', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await openPanel(wrapper)
    // phase=start 阶段 hover
    await findCellByDay(wrapper, 'left', '12')!.trigger('mouseenter')
    const inHover = wrapper
      .findAll(`${ns.em('panel-side', 'left')} ${ns.e('cell')}`)
      .filter((c) => c.classes().some((cls) => cls.endsWith('cell--in-hover-range')))
    expect(inHover.length).toBe(0)
  })

  it('marks confirmed in-range from existing modelValue once both pending set', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-05', '2026-05-10'] })
    await openPanel(wrapper)
    // 已经 pending start=05 end=10，5 与 10 之间 4 天应该 in-range
    const inRange = wrapper
      .findAll(`${ns.em('panel-side', 'left')} ${ns.e('cell')}`)
      .filter((c) => c.classes().some((cls) => cls.endsWith('cell--in-range')))
    expect(inRange.length).toBe(4)
  })

  it('marks range-start and range-end modifiers', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-05', '2026-05-10'] })
    await openPanel(wrapper)
    const startCell = wrapper.find(`${ns.em('panel-side', 'left')} ${ns.em('cell', 'range-start')}`)
    const endCell = wrapper.find(`${ns.em('panel-side', 'left')} ${ns.em('cell', 'range-end')}`)
    expect(startCell.text()).toBe('5')
    expect(endCell.text()).toBe('10')
  })
})

describe('range-picker disabledDate', () => {
  it('marks disabled cells', async () => {
    const wrapper = mountRP({
      disabledDate: (d: dayjs.Dayjs) => d.date() < 10,
    })
    await openPanel(wrapper)
    const cell = findCellByDay(wrapper, 'left', '5')
    expect(cell!.classes().some((c) => c.endsWith('cell--disabled'))).toBe(true)
  })

  it('ignores click on disabled date', async () => {
    const wrapper = mountRP({
      disabledDate: (d: dayjs.Dayjs) => d.date() < 10,
    })
    await openPanel(wrapper)
    const cell = findCellByDay(wrapper, 'left', '5')
    await cell!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('disabledStartDate 仅对起始侧（phase=start）生效', async () => {
    // 起始侧禁掉 < 10 的天；点 5 应被禁
    const wrapper = mountRP({
      disabledStartDate: (d: dayjs.Dayjs) => d.date() < 10,
    })
    await openPanel(wrapper)
    const day5 = findCellByDay(wrapper, 'left', '5')
    expect(day5!.classes().some((c) => c.endsWith('cell--disabled'))).toBe(true)
    await day5!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('disabledEndDate 仅对结束侧（phase=end）生效；起始侧点 5 仍可点', async () => {
    const wrapper = mountRP({
      disabledEndDate: (d: dayjs.Dayjs) => d.date() < 10,
    })
    await openPanel(wrapper)
    const day5 = findCellByDay(wrapper, 'left', '5')
    // 起始侧未限制，5 可点
    expect(day5!.classes().some((c) => c.endsWith('cell--disabled'))).toBe(false)
    await day5!.trigger('click') // phase 切到 end
    // 现在面板显示 end-side disabled：< 10 全标红
    const day8 = findCellByDay(wrapper, 'left', '8')
    expect(day8!.classes().some((c) => c.endsWith('cell--disabled'))).toBe(true)
  })

  it('disabledStartDate 优先级高于 disabledDate', async () => {
    const wrapper = mountRP({
      disabledDate: (d: dayjs.Dayjs) => d.date() < 10,
      // 起始侧用更严格的：< 15
      disabledStartDate: (d: dayjs.Dayjs) => d.date() < 15,
    })
    await openPanel(wrapper)
    // 起始侧 13 应该被禁（按 startDate 规则），而非按 disabledDate（< 10）
    const day13 = findCellByDay(wrapper, 'left', '13')
    expect(day13!.classes().some((c) => c.endsWith('cell--disabled'))).toBe(true)
  })
})

describe('range-picker month navigation', () => {
  it('left panel prev/next-month adjusts both panels in sync', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await openPanel(wrapper)
    const labels = () => wrapper.findAll(ns.e('panel-label')).map((l) => l.text())
    expect(labels()[0]).toContain('5 月')
    expect(labels()[1]).toContain('6 月')
    // 左 prev-month
    await wrapper.find('.' + ns.em('arrow', 'prev-month').slice(1)).trigger('click')
    expect(labels()[0]).toContain('4 月')
    expect(labels()[1]).toContain('5 月')
  })

  it('right panel next-month / next-year', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await openPanel(wrapper)
    const labels = () => wrapper.findAll(ns.e('panel-label')).map((l) => l.text())
    await wrapper.find('.' + ns.em('arrow', 'next-month').slice(1)).trigger('click')
    expect(labels()[0]).toContain('6 月')
    await wrapper.find('.' + ns.em('arrow', 'next-year').slice(1)).trigger('click')
    expect(labels()[0]).toContain('2027')
  })
})

describe('range-picker clearable', () => {
  it('shows clear button when range present', () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
  })

  it('hides clear when null', () => {
    const wrapper = mountRP()
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('hides clear when clearable=false', () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'], clearable: false })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('clear emits null and stops propagation', async () => {
    const wrapper = mountRP({ modelValue: ['2026-05-01', '2026-05-15'] })
    await wrapper.find(ns.e('clear')).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('change')?.[0]).toEqual([null, ['', '']])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})

describe('range-picker size and status', () => {
  it.each([['small'], ['default'], ['large']])('applies size modifier %s', (size) => {
    const wrapper = mountRP({ size })
    expect(wrapper.classes()).toContain(`ccui-range-picker--${size}`)
  })

  it('applies status modifier', () => {
    const wrapper = mountRP({ status: 'error' })
    expect(wrapper.classes()).toContain('ccui-range-picker--status-error')
  })
})

describe('range-picker integrations', () => {
  it('inherits validate status from FormItem', async () => {
    const Wrapper = defineComponent({
      setup() {
        const model = ref<{ range: [string, string] | null }>({ range: null })
        const rules = { range: [{ required: true, message: '必填' }] }
        return () =>
          h(
            Form,
            { model: model.value, rules },
            {
              default: () =>
                h(
                  FormItem,
                  { name: 'range', prop: 'range' },
                  { default: () => h(RangePicker, { modelValue: model.value.range }) },
                ),
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
    const wrapper = mountRP({ popupAppendToBody: true })
    await openPanel(wrapper)
    expect(document.body.querySelector(ns.e('panel'))).toBeTruthy()
  })

  it('uses custom getPopupContainer', async () => {
    const container = document.createElement('div')
    container.id = 'custom-rp-host'
    document.body.appendChild(container)
    const wrapper = mountRP({ getPopupContainer: () => container })
    await openPanel(wrapper)
    expect(container.querySelector(ns.e('panel'))).toBeTruthy()
    container.remove()
  })

  it('reflects external v-model echo back into inputs', async () => {
    const Wrapper = defineComponent({
      setup() {
        const value = ref<[string, string] | null>(null)
        return () =>
          h(RangePicker, {
            modelValue: value.value,
            'onUpdate:modelValue': (v: [string, string] | null) => (value.value = v),
          })
      },
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper as unknown as VueWrapper)
    await wrapper.find(ns.em('input', 'start')).trigger('click')
    await nextTick()
    await findCellByDay(wrapper as unknown as VueWrapper, 'left', '8')!.trigger('click')
    await findCellByDay(wrapper as unknown as VueWrapper, 'left', '20')!.trigger('click')
    await nextTick()
    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('2026-05-08')
    expect((inputs[1].element as HTMLInputElement).value).toBe('2026-05-20')
  })
})

describe('range-picker locale', () => {
  it('switches placeholders / weekdays / panel labels to enUS via ConfigProvider', async () => {
    const wrapper = mount(
      defineComponent({
        components: { ConfigProvider, RangePicker },
        setup() {
          return { enUS }
        },
        template: `
          <ConfigProvider :locale="enUS">
            <RangePicker />
          </ConfigProvider>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper as unknown as VueWrapper)

    const inputs = wrapper.findAll('input')
    expect(inputs[0].attributes('placeholder')).toBe('Start date')
    expect(inputs[1].attributes('placeholder')).toBe('End date')

    await wrapper.find(ns.em('input', 'start')).trigger('click')
    await nextTick()
    await nextTick()

    const labels = wrapper.findAll(ns.e('panel-label')).map((l) => l.text())
    expect(labels[0]).toBe('May 2026')
    expect(labels[1]).toBe('Jun 2026')

    const weekCells = wrapper.findAll(`${ns.em('panel-side', 'left')} ${ns.e('week-cell')}`).map((c) => c.text())
    expect(weekCells).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
  })
})

describe('range-picker presets', () => {
  const samplePresets = [
    { label: '本周', value: ['2026-05-04', '2026-05-10'] },
    { label: '本月', value: () => ['2026-05-01', '2026-05-31'] as [string, string] },
    { label: () => '动态', value: ['2026-06-01', '2026-06-07'] },
  ]

  it('非空 presets 渲染 rail，每项一个 li', async () => {
    const wrapper = mountRP({ presets: samplePresets })
    await openPanel(wrapper)
    const rail = wrapper.find(ns.e('presets'))
    expect(rail.exists()).toBe(true)
    const items = rail.findAll(ns.e('preset-item'))
    expect(items).toHaveLength(3)
    expect(items.map((i) => i.text())).toEqual(['本周', '本月', '动态'])
  })

  it('空 presets 不渲染 rail', async () => {
    const wrapper = mountRP()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('presets')).exists()).toBe(false)
  })

  it('点击预设直接 emit 元组 + 关闭', async () => {
    const wrapper = mountRP({ presets: samplePresets })
    await openPanel(wrapper)
    await wrapper.findAll(ns.e('preset-item'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['2026-05-04', '2026-05-10'])
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('value 函数延迟求值', async () => {
    let counter = 0
    const wrapper = mountRP({
      presets: [
        {
          label: '惰',
          value: () => {
            counter += 1
            return ['2026-07-01', '2026-07-07'] as [string, string]
          },
        },
      ],
    })
    expect(counter).toBe(0)
    await openPanel(wrapper)
    expect(counter).toBe(0)
    await wrapper.find(ns.e('preset-item')).trigger('click')
    expect(counter).toBe(1)
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['2026-07-01', '2026-07-07'])
  })

  it('预设 end < start 时自动调换', async () => {
    const wrapper = mountRP({
      presets: [{ label: '倒序', value: ['2026-06-10', '2026-06-01'] }],
    })
    await openPanel(wrapper)
    await wrapper.find(ns.e('preset-item')).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['2026-06-01', '2026-06-10'])
  })

  it('panel 加 --with-presets modifier', async () => {
    const wrapper = mountRP({ presets: samplePresets })
    await openPanel(wrapper)
    expect(wrapper.find(ns.em('panel', 'with-presets')).exists()).toBe(true)
  })
})

describe('range-picker showTime', () => {
  it('showTime=true 时面板每侧渲染时间三列 + footer', async () => {
    const wrapper = mountRP({ showTime: true })
    await openPanel(wrapper)
    // 两侧各 3 列 = 6
    expect(wrapper.findAll(ns.e('time-column'))).toHaveLength(6)
    expect(wrapper.find(ns.em('time-columns', 'start')).exists()).toBe(true)
    expect(wrapper.find(ns.em('time-columns', 'end')).exists()).toBe(true)
    expect(wrapper.find(ns.e('footer')).exists()).toBe(true)
    expect(wrapper.find(ns.em('panel', 'with-time')).exists()).toBe(true)
  })

  it('showTime.format=HH:mm 时每侧 2 列', async () => {
    const wrapper = mountRP({ showTime: { format: 'HH:mm' } })
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('time-column'))).toHaveLength(4)
  })

  it('点击日期不立即 emit、面板不关，进入下一 phase', async () => {
    const wrapper = mountRP({ showTime: true })
    await openPanel(wrapper)
    const day10 = findCellByDay(wrapper, 'left', '10')
    await day10!.trigger('click') // start
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const day20 = findCellByDay(wrapper, 'left', '20')
    await day20!.trigger('click') // end，但仍不关
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('未选完 start+end 时 ok 按钮禁用，选完后可点并 emit 含时分秒', async () => {
    const wrapper = mountRP({ showTime: true })
    await openPanel(wrapper)
    const ok = () => wrapper.find(ns.em('footer-btn', 'ok'))
    expect(ok().attributes('disabled')).toBeDefined()
    const day10 = findCellByDay(wrapper, 'left', '10')
    await day10!.trigger('click')
    expect(ok().attributes('disabled')).toBeDefined()
    const day20 = findCellByDay(wrapper, 'left', '20')
    await day20!.trigger('click')
    expect(ok().attributes('disabled')).toBeUndefined()
    // start 时间默认 00:00:00 / end 默认 23:59:59
    await ok().trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['2026-05-10 00:00:00', '2026-05-20 23:59:59'])
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('点击时间格更新对应侧的 pending', async () => {
    const wrapper = mountRP({ showTime: true })
    await openPanel(wrapper)
    const day10 = findCellByDay(wrapper, 'left', '10')
    await day10!.trigger('click')
    const day15 = findCellByDay(wrapper, 'left', '15')
    await day15!.trigger('click')
    // start 侧 hour=9
    const startHourCol = wrapper.findAll(`${ns.em('time-columns', 'start')} ${ns.em('time-column', 'hour')}`)[0]
    await startHourCol.findAll(ns.e('time-cell'))[9].trigger('click')
    // end 侧 hour=18
    const endHourCol = wrapper.findAll(`${ns.em('time-columns', 'end')} ${ns.em('time-column', 'hour')}`)[0]
    await endHourCol.findAll(ns.e('time-cell'))[18].trigger('click')
    await wrapper.find(ns.em('footer-btn', 'ok')).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['2026-05-10 09:00:00', '2026-05-15 18:59:59'])
  })

  it('默认时间用 defaultStartTime / defaultEndTime', async () => {
    const wrapper = mountRP({
      showTime: { defaultStartTime: '2026-01-01 09:00:00', defaultEndTime: '2026-01-01 17:30:00' },
    })
    await openPanel(wrapper)
    const day10 = findCellByDay(wrapper, 'left', '10')
    await day10!.trigger('click')
    const day20 = findCellByDay(wrapper, 'left', '20')
    await day20!.trigger('click')
    await wrapper.find(ns.em('footer-btn', 'ok')).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['2026-05-10 09:00:00', '2026-05-20 17:30:00'])
  })

  it('hourStep=6 时每侧时间小时列 4 项', async () => {
    const wrapper = mountRP({ showTime: { hourStep: 6 } })
    await openPanel(wrapper)
    const startHourCol = wrapper.findAll(`${ns.em('time-columns', 'start')} ${ns.em('time-column', 'hour')}`)[0]
    const cells = startHourCol.findAll(ns.e('time-cell'))
    expect(cells.map((c) => c.text())).toEqual(['00', '06', '12', '18'])
  })

  it('已有 modelValue 含时分秒时正确解析回显', () => {
    const wrapper = mountRP({
      showTime: true,
      modelValue: ['2026-05-10 09:30:45', '2026-05-20 17:45:30'],
    })
    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('2026-05-10 09:30:45')
    expect((inputs[1].element as HTMLInputElement).value).toBe('2026-05-20 17:45:30')
  })

  it('user 显式 format=YYYY/MM/DD HH:mm 覆盖默认拼接', async () => {
    const wrapper = mountRP({ showTime: { format: 'HH:mm' }, format: 'YYYY/MM/DD HH:mm' })
    await openPanel(wrapper)
    await findCellByDay(wrapper, 'left', '10')!.trigger('click')
    await findCellByDay(wrapper, 'left', '20')!.trigger('click')
    await wrapper.find(ns.em('footer-btn', 'ok')).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['2026/05/10 00:00', '2026/05/20 23:59'])
  })

  it('presets + showTime 共存：点击预设设 pending 不关，ok 提交', async () => {
    const wrapper = mountRP({
      showTime: true,
      presets: [{ label: '本周', value: ['2026-05-04', '2026-05-10'] }],
    })
    await openPanel(wrapper)
    await wrapper.find(ns.e('preset-item')).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    await wrapper.find(ns.em('footer-btn', 'ok')).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['2026-05-04 00:00:00', '2026-05-10 00:00:00'])
  })
})
