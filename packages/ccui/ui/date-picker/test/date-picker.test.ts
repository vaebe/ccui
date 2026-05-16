import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { ConfigProvider } from '../../config-provider'
import enUS from '../../locale/en-US'
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

  it('applies status="warning" modifier', () => {
    const wrapper = mountDP({ status: 'warning' })
    expect(wrapper.classes()).toContain('ccui-date-picker--status-warning')
  })
})

describe('date-picker Form integration', () => {
  it('triggers FormItem.validate on blur', async () => {
    const onValidate = vi.fn(async () => true)
    const { formItemInjectionKey } = await import('../../form/src/form-types')
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
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
    wrappers.push(wrapper)
    await wrapper.find('input').trigger('blur')
    expect(onValidate).toHaveBeenCalledWith('blur')
  })

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

describe('date-picker locale', () => {
  it('switches placeholder / weekdays / panel label / aria-labels to enUS via ConfigProvider', async () => {
    const wrapper = mount(
      defineComponent({
        components: { ConfigProvider, DatePicker },
        setup() {
          return { enUS }
        },
        template: `
          <ConfigProvider :locale="enUS">
            <DatePicker model-value="2026-05-09" />
          </ConfigProvider>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper as unknown as VueWrapper)

    expect(wrapper.find('input').attributes('placeholder')).toBe('Select date')

    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    await nextTick()

    const weekCells = wrapper.findAll(ns.e('week-cell')).map((w) => w.text())
    expect(weekCells).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('May 2026')
    expect(wrapper.find(ns.em('arrow', 'prev-year')).attributes('aria-label')).toBe('Previous year')
    expect(wrapper.find(ns.em('arrow', 'next-month')).attributes('aria-label')).toBe('Next month')

    const clear = wrapper.find(ns.e('clear'))
    expect(clear.attributes('aria-label')).toBe('Clear')
  })
})

describe('date-picker picker=month 模式', () => {
  it('打开直接进入 month 面板，渲染 12 个月格', async () => {
    const wrapper = mountDP({ picker: 'month', modelValue: '2026-05' })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.em('cell', 'month'))
    expect(cells).toHaveLength(12)
    expect(cells[0].text()).toBe('1 月')
    expect(cells[11].text()).toBe('12 月')
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2026')
  })

  it('点击月格 emit YYYY-MM 字符串并关闭', async () => {
    const wrapper = mountDP({ picker: 'month' })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.em('cell', 'month'))
    await cells[6].trigger('click') // 7 月
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0][0]).toBe('2026-07')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('面板 label 点击下钻到 year 模式', async () => {
    const wrapper = mountDP({ picker: 'month' })
    await openPanel(wrapper)
    await wrapper.find(ns.e('panel-label')).trigger('click')
    expect(wrapper.findAll(ns.em('cell', 'year'))).toHaveLength(12)
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2020-2029')
  })

  it('箭头 prev/next 按年步进', async () => {
    const wrapper = mountDP({ picker: 'month' })
    await openPanel(wrapper)
    await wrapper.find(ns.em('arrow', 'next-year')).trigger('click')
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2027')
    await wrapper.find(ns.em('arrow', 'prev-decade')).trigger('click')
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2017')
  })

  it('选中月在面板上有 selected 样式', async () => {
    const wrapper = mountDP({ picker: 'month', modelValue: '2026-03' })
    await openPanel(wrapper)
    const selected = wrapper.findAll(`${ns.e('cell')}.${ns.em('cell', 'selected').slice(1)}`)
    expect(selected).toHaveLength(1)
    expect(selected[0].text()).toBe('3 月')
  })
})

describe('date-picker picker=year 模式', () => {
  it('打开直接进入 decade 面板，渲染 12 年格（10 内 + 2 外）', async () => {
    const wrapper = mountDP({ picker: 'year', modelValue: '2026' })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.em('cell', 'year'))
    expect(cells).toHaveLength(12)
    expect(cells[0].text()).toBe('2019')
    expect(cells[11].text()).toBe('2030')
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2020-2029')
    // 边界两年应带 outside 类
    expect(cells[0].classes().some((c) => c.endsWith('--outside'))).toBe(true)
    expect(cells[11].classes().some((c) => c.endsWith('--outside'))).toBe(true)
  })

  it('点击年格 emit YYYY 字符串并关闭', async () => {
    const wrapper = mountDP({ picker: 'year' })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.em('cell', 'year'))
    await cells[5].trigger('click') // 2024
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2024')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('year 面板隐藏 super 箭头（无世纪步进）', async () => {
    const wrapper = mountDP({ picker: 'year' })
    await openPanel(wrapper)
    expect(wrapper.find(ns.em('arrow', 'prev-decade')).exists()).toBe(true)
    expect(wrapper.find(ns.em('arrow', 'next-decade')).exists()).toBe(true)
    // 没有 super 类型的箭头（year 模式下唯一的箭头就是 decade 级，仅 2 个）
    expect(wrapper.findAll(ns.e('arrow'))).toHaveLength(2)
  })

  it('箭头按十年步进', async () => {
    const wrapper = mountDP({ picker: 'year' })
    await openPanel(wrapper)
    await wrapper.find(ns.em('arrow', 'next-decade')).trigger('click')
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2030-2039')
    await wrapper.find(ns.em('arrow', 'prev-decade')).trigger('click')
    await wrapper.find(ns.em('arrow', 'prev-decade')).trigger('click')
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2010-2019')
  })

  it('year 面板 panel-label 不可点击（无 super 上钻）', async () => {
    const wrapper = mountDP({ picker: 'year' })
    await openPanel(wrapper)
    const label = wrapper.find(ns.e('panel-label'))
    expect(label.classes().some((c) => c.endsWith('--clickable'))).toBe(false)
  })
})

describe('date-picker picker=quarter 模式', () => {
  it('渲染 4 个季度格，label 为年份', async () => {
    const wrapper = mountDP({ picker: 'quarter', modelValue: '2026-Q2' })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.em('cell', 'quarter'))
    expect(cells).toHaveLength(4)
    expect(cells.map((c) => c.text())).toEqual(['一季度', '二季度', '三季度', '四季度'])
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2026')
  })

  it('点击季度 emit YYYY-[Q]Q 字符串并关闭', async () => {
    const wrapper = mountDP({ picker: 'quarter' })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.em('cell', 'quarter'))
    await cells[2].trigger('click') // Q3
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-Q3')
  })

  it('从 year 面板选年后回到 quarter 面板（不直接 emit）', async () => {
    const wrapper = mountDP({ picker: 'quarter' })
    await openPanel(wrapper)
    await wrapper.find(ns.e('panel-label')).trigger('click')
    expect(wrapper.findAll(ns.em('cell', 'year'))).toHaveLength(12)
    const yearCells = wrapper.findAll(ns.em('cell', 'year'))
    await yearCells[4].trigger('click') // 2023
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll(ns.em('cell', 'quarter'))).toHaveLength(4)
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2023')
  })
})

describe('date-picker picker=week 模式', () => {
  it('显示 week-number 列与 week 表头', async () => {
    const wrapper = mountDP({ picker: 'week', modelValue: '2026-05-09' })
    await openPanel(wrapper)
    expect(wrapper.find(ns.em('week-row', 'with-week')).exists()).toBe(true)
    expect(wrapper.find(ns.em('grid', 'with-week')).exists()).toBe(true)
    // 表头第一个是 weekHeader（中文 "周"），后面是日一二三四五六
    const headers = wrapper.findAll(ns.e('week-cell')).map((w) => w.text())
    expect(headers[0]).toBe('周')
    expect(headers.slice(1)).toEqual(['日', '一', '二', '三', '四', '五', '六'])
    // 6 行 → 6 个 week-number 单元
    expect(wrapper.findAll(ns.e('week-number'))).toHaveLength(6)
  })

  it('点击日期 emit 该周起始日（weekStart=0 → 周日）', async () => {
    const wrapper = mountDP({ picker: 'week' })
    await openPanel(wrapper)
    // 找日期 12（在 2026-05 视图中是周二）
    const cells = wrapper.findAll(ns.e('cell'))
    const day12 = cells.find((c) => c.text() === '12' && !c.classes().some((cl) => cl.endsWith('--outside')))
    await day12!.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')!
    // 2026-05-12 是周二，weekStart=0 时该周起始 = 2026-05-10（周日）
    expect(emitted[0][0]).toBe('2026-05-10')
  })

  it('input 显示 weekFormat 模板（默认中文：YYYY 年第 WW 周）', async () => {
    const wrapper = mountDP({ picker: 'week', modelValue: '2026-05-09' })
    const input = wrapper.find('input').element as HTMLInputElement
    // 2026-05-09 周六，weekStart=0 → US-style，week number = 19
    expect(input.value).toBe('2026 年第 19 周')
  })

  it('选中周内所有日期带 in-week class，week-number 高亮', async () => {
    const wrapper = mountDP({ picker: 'week', modelValue: '2026-05-09' })
    await openPanel(wrapper)
    const inWeekCells = wrapper.findAll(`${ns.e('cell')}.${ns.em('cell', 'in-week').slice(1)}`)
    expect(inWeekCells).toHaveLength(7)
    const selectedWeekNum = wrapper.find(`${ns.e('week-number')}.${ns.em('week-number', 'selected').slice(1)}`)
    expect(selectedWeekNum.exists()).toBe(true)
  })

  it('weekStart=1 时起始切到周一', async () => {
    const wrapper = mountDP({ picker: 'week', weekStart: 1 })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.e('cell'))
    const day12 = cells.find((c) => c.text() === '12' && !c.classes().some((cl) => cl.endsWith('--outside')))
    await day12!.trigger('click')
    // 2026-05-12 周二，weekStart=1 → 起始 = 2026-05-11（周一）
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-05-11')
  })
})

describe('date-picker picker=date 面板逐级展开（date → month → year）', () => {
  it('panel-label 点击：date 模式 → month 模式', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel-label')).text()).toContain('5 月')
    await wrapper.find(ns.e('panel-label')).trigger('click')
    expect(wrapper.findAll(ns.em('cell', 'month'))).toHaveLength(12)
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2026')
  })

  it('panel-label 再点击：month 模式 → year 模式', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    await wrapper.find(ns.e('panel-label')).trigger('click')
    await wrapper.find(ns.e('panel-label')).trigger('click')
    expect(wrapper.findAll(ns.em('cell', 'year'))).toHaveLength(12)
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2020-2029')
  })

  it('year 模式选年后回 month 模式（不 emit）', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    await wrapper.find(ns.e('panel-label')).trigger('click')
    await wrapper.find(ns.e('panel-label')).trigger('click')
    const yearCells = wrapper.findAll(ns.em('cell', 'year'))
    await yearCells[6].trigger('click') // 2025（decadeStart 2020 + 5）
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll(ns.em('cell', 'month'))).toHaveLength(12)
    expect(wrapper.find(ns.e('panel-label')).text()).toBe('2025')
  })

  it('month 模式选月后回 date 模式（不 emit），viewMonth 跳到所选月', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    await wrapper.find(ns.e('panel-label')).trigger('click')
    const monthCells = wrapper.findAll(ns.em('cell', 'month'))
    await monthCells[8].trigger('click') // 9 月
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    // 回到 date 视图
    expect(wrapper.find(ns.e('week-row')).exists()).toBe(true)
    expect(wrapper.find(ns.e('panel-label')).text()).toContain('9 月')
  })

  it('再次打开面板时面板模式重置为 picker 默认', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    await wrapper.find(ns.e('panel-label')).trigger('click')
    expect(wrapper.findAll(ns.em('cell', 'month'))).toHaveLength(12)
    // 外部点击关闭
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    await openPanel(wrapper)
    // 应该回到 date 视图
    expect(wrapper.find(ns.e('week-row')).exists()).toBe(true)
    expect(wrapper.findAll(ns.em('cell', 'month'))).toHaveLength(0)
  })

  it('emit panel-change 事件携带新模式', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    await wrapper.find(ns.e('panel-label')).trigger('click')
    const pc = wrapper.emitted('panel-change')!
    expect(pc[0][0]).toBe('month')
  })
})

describe('date-picker effectiveFormat / picker 切换', () => {
  it('picker=month 时默认 format 为 YYYY-MM，能解析字符串 modelValue', () => {
    const wrapper = mountDP({ picker: 'month', modelValue: '2024-09' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2024-09')
  })

  it('picker=year 时默认 format 为 YYYY', () => {
    const wrapper = mountDP({ picker: 'year', modelValue: '2024' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2024')
  })

  it('picker=quarter 时默认 format 为 YYYY-[Q]Q', () => {
    const wrapper = mountDP({ picker: 'quarter', modelValue: '2024-Q3' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2024-Q3')
  })

  it('用户显式 format 覆盖 picker 默认', () => {
    const wrapper = mountDP({ picker: 'month', format: 'YYYY/MM', modelValue: '2024/09' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2024/09')
  })
})

describe('date-picker showTime', () => {
  it('showTime=true 时面板渲染 time-columns 和 footer', async () => {
    const wrapper = mountDP({ showTime: true })
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('time-columns')).exists()).toBe(true)
    expect(wrapper.find(ns.e('footer')).exists()).toBe(true)
    // 默认 HH:mm:ss → 3 列
    expect(wrapper.findAll(ns.e('time-column'))).toHaveLength(3)
  })

  it('showTime.format=HH:mm 时只渲染 2 列（无秒）', async () => {
    const wrapper = mountDP({ showTime: { format: 'HH:mm' } })
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('time-column'))).toHaveLength(2)
  })

  it('showTime 启用时点击日期不立即 emit、面板不关', async () => {
    const wrapper = mountDP({ showTime: true })
    await openPanel(wrapper)
    const cell = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '15')
    await cell!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('点时间格更新 pending，点 ok 才 emit（含时分秒）', async () => {
    const wrapper = mountDP({ showTime: true })
    await openPanel(wrapper)
    // 选 15 号
    const dateCell = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '15')
    await dateCell!.trigger('click')
    // 时列：点击 hour=9
    const hourCol = wrapper.findAll(ns.em('time-column', 'hour'))[0]
    const hourCells = hourCol.findAll(ns.e('time-cell'))
    await hourCells[9].trigger('click')
    // 分列：点击 minute=30
    const minCol = wrapper.findAll(ns.em('time-column', 'minute'))[0]
    await minCol.findAll(ns.e('time-cell'))[30].trigger('click')
    // 秒列：点击 second=45
    const secCol = wrapper.findAll(ns.em('time-column', 'second'))[0]
    await secCol.findAll(ns.e('time-cell'))[45].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    // 点 ok
    await wrapper.find(ns.em('footer-btn', 'ok')).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-05-15 09:30:45')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('未选日期时 ok 按钮 disabled', async () => {
    const wrapper = mountDP({ showTime: true })
    await openPanel(wrapper)
    const ok = wrapper.find(ns.em('footer-btn', 'ok'))
    expect(ok.attributes('disabled')).toBeDefined()
  })

  it('已有 modelValue 时 ok 不 disabled，并显示已有时间', async () => {
    const wrapper = mountDP({ showTime: true, modelValue: '2026-05-09 09:30:45' })
    await openPanel(wrapper)
    expect(wrapper.find(ns.em('footer-btn', 'ok')).attributes('disabled')).toBeUndefined()
    // hour=9 cell 应该 selected
    const hourSel = wrapper
      .findAll(ns.em('time-column', 'hour'))[0]
      .findAll(`${ns.e('time-cell')}.${ns.em('time-cell', 'selected').slice(1)}`)
    expect(hourSel).toHaveLength(1)
    expect(hourSel[0].text()).toBe('09')
  })

  it('now 按钮直接 emit 当前时刻并关闭', async () => {
    const wrapper = mountDP({ showTime: true })
    await openPanel(wrapper)
    await wrapper.find(ns.em('footer-btn', 'now')).trigger('click')
    // fake time 锁在 2026-05-09T08:00:00.000Z
    const emitted = wrapper.emitted('update:modelValue')![0][0] as string
    expect(emitted).toMatch(/^2026-05-09 \d{2}:\d{2}:\d{2}$/)
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('showNow=false 时 footer 不显示 now 按钮', async () => {
    const wrapper = mountDP({ showTime: true, showNow: false })
    await openPanel(wrapper)
    expect(wrapper.find(ns.em('footer-btn', 'now')).exists()).toBe(false)
    expect(wrapper.find(ns.em('footer-btn', 'ok')).exists()).toBe(true)
  })

  it('hourStep=2 时小时列每隔 2 跳一格（12 项 0,2,4,...,22）', async () => {
    const wrapper = mountDP({ showTime: { hourStep: 2 } })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.em('time-column', 'hour'))[0].findAll(ns.e('time-cell'))
    expect(cells).toHaveLength(12)
    expect(cells.map((c) => c.text())).toEqual(['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'])
  })

  it('disabledHours 把 0..5 标 disabled 类', async () => {
    const wrapper = mountDP({
      showTime: { disabledHours: () => [0, 1, 2, 3, 4, 5] },
    })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.em('time-column', 'hour'))[0].findAll(ns.e('time-cell'))
    const disabledCells = cells.filter((c) => c.classes().some((cl) => cl.endsWith('time-cell--disabled')))
    expect(disabledCells.map((c) => c.text())).toEqual(['00', '01', '02', '03', '04', '05'])
  })

  it('hideDisabledOptions 把 disabled 项从列表里剔除', async () => {
    const wrapper = mountDP({
      showTime: {
        disabledHours: () => [0, 1, 2, 3, 4, 5],
        hideDisabledOptions: true,
      },
    })
    await openPanel(wrapper)
    const cells = wrapper.findAll(ns.em('time-column', 'hour'))[0].findAll(ns.e('time-cell'))
    expect(cells).toHaveLength(18)
    expect(cells[0].text()).toBe('06')
  })

  it('showTime 仅在 picker=date 时生效；picker=month 不渲染 time-columns', async () => {
    const wrapper = mountDP({ showTime: true, picker: 'month' })
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('time-columns')).exists()).toBe(false)
    expect(wrapper.find(ns.e('footer')).exists()).toBe(false)
    // month 面板按原逻辑：点月直接 emit + 关
    const monthCells = wrapper.findAll(ns.em('cell', 'month'))
    await monthCells[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-03')
  })

  it('format 显式覆盖 showTime 的兜底（YYYY/MM/DD HH:mm）', async () => {
    const wrapper = mountDP({ showTime: { format: 'HH:mm' }, format: 'YYYY/MM/DD HH:mm' })
    await openPanel(wrapper)
    const dateCell = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '20')
    await dateCell!.trigger('click')
    await wrapper.find(ns.em('footer-btn', 'ok')).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026/05/20 00:00')
  })
})

describe('date-picker presets', () => {
  const samplePresets = [
    { label: '今天', value: '2026-05-09' },
    { label: '一周后', value: () => '2026-05-16' },
    { label: () => '动态标签', value: '2026-05-22' },
  ]

  it('非空 presets 渲染侧边 rail，每项一个 li', async () => {
    const wrapper = mountDP({ presets: samplePresets })
    await openPanel(wrapper)
    const rail = wrapper.find(ns.e('presets'))
    expect(rail.exists()).toBe(true)
    const items = rail.findAll(ns.e('preset-item'))
    expect(items).toHaveLength(3)
    expect(items[0].text()).toBe('今天')
    expect(items[1].text()).toBe('一周后')
    expect(items[2].text()).toBe('动态标签')
  })

  it('空 presets 不渲染 rail', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('presets')).exists()).toBe(false)
  })

  it('点击预设：非 showTime 立即 emit + 关闭', async () => {
    const wrapper = mountDP({ presets: samplePresets })
    await openPanel(wrapper)
    const items = wrapper.findAll(ns.e('preset-item'))
    await items[1].trigger('click') // 一周后 → '2026-05-16'
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-05-16')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('value 函数延迟求值', async () => {
    let counter = 0
    const wrapper = mountDP({
      presets: [
        {
          label: '惰性',
          value: () => {
            counter += 1
            return '2026-06-01'
          },
        },
      ],
    })
    expect(counter).toBe(0)
    await openPanel(wrapper)
    expect(counter).toBe(0) // 渲染时不调用
    await wrapper.find(ns.e('preset-item')).trigger('click')
    expect(counter).toBe(1)
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-06-01')
  })

  it('与 showTime 共存：点击预设只更新 pending，不关闭面板', async () => {
    const wrapper = mountDP({ presets: samplePresets, showTime: true })
    await openPanel(wrapper)
    await wrapper.findAll(ns.e('preset-item'))[0].trigger('click') // 今天 '2026-05-09'
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    // 此时 pending 已经赋值，ok 按钮可点
    expect(wrapper.find(ns.em('footer-btn', 'ok')).attributes('disabled')).toBeUndefined()
    await wrapper.find(ns.em('footer-btn', 'ok')).trigger('click')
    // 时分秒默认 0
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-05-09 00:00:00')
  })

  it('picker=week 时点击预设 emit 该周起始日', async () => {
    const wrapper = mountDP({
      picker: 'week',
      presets: [{ label: '本周', value: '2026-05-12' }], // 2026-05-12 周二
    })
    await openPanel(wrapper)
    await wrapper.find(ns.e('preset-item')).trigger('click')
    // weekStart=0 → 周日起始 2026-05-10
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-05-10')
  })

  it('picker=month 时预设值按月格式 emit', async () => {
    const wrapper = mountDP({
      picker: 'month',
      presets: [{ label: '六月', value: '2026-06' }],
    })
    await openPanel(wrapper)
    await wrapper.find(ns.e('preset-item')).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-06')
  })

  it('panel 加 with-presets modifier', async () => {
    const wrapper = mountDP({ presets: samplePresets })
    await openPanel(wrapper)
    expect(wrapper.find(ns.em('panel', 'with-presets')).exists()).toBe(true)
  })

  describe('variant', () => {
    it('默认 variant 为 outlined', () => {
      const wrapper = mountDP()
      expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
    })

    it('variant="filled"', () => {
      const wrapper = mountDP({ variant: 'filled' })
      expect(wrapper.find(ns.m('variant-filled')).exists()).toBe(true)
    })

    it('variant="borderless"', () => {
      const wrapper = mountDP({ variant: 'borderless' })
      expect(wrapper.find(ns.m('variant-borderless')).exists()).toBe(true)
    })

    it('variant="underlined"', () => {
      const wrapper = mountDP({ variant: 'underlined' })
      expect(wrapper.find(ns.m('variant-underlined')).exists()).toBe(true)
    })
  })

  describe('M-A4 图标钩子', () => {
    it('suffixIcon prop（无值时显示日历位）渲染 <i>', () => {
      const wrapper = mountDP({ suffixIcon: 'my-calendar' })
      expect(wrapper.find(`${ns.e('suffix')} i.my-calendar`).exists()).toBe(true)
    })

    it('suffixIcon slot 优先级高于 prop', () => {
      const wrapper = mount(DatePicker, {
        props: { suffixIcon: 'my-calendar' },
        slots: { suffixIcon: () => h('span', { class: 'slot-suffix' }) },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      expect(wrapper.find('.slot-suffix').exists()).toBe(true)
      expect(wrapper.find('i.my-calendar').exists()).toBe(false)
    })

    it('clearIcon prop（有值时渲染清除位）', () => {
      const wrapper = mountDP({ modelValue: dayjs('2026-05-01').valueOf(), clearable: true, clearIcon: 'my-clear' })
      expect(wrapper.find(`${ns.e('clear')} i.my-clear`).exists()).toBe(true)
    })
  })
})

describe('date-picker M-A2 classNames / styles 钩子', () => {
  it('classNames.root 注入到根节点', () => {
    const wrapper = mountDP({ classNames: { root: 'my-root' } })
    expect(wrapper.find(ns.b()).classes()).toContain('my-root')
  })

  it('styles.root 注入到根节点 style', () => {
    const wrapper = mountDP({ styles: { root: { color: 'red' } } })
    expect(wrapper.find(ns.b()).attributes('style') || '').toContain('color: red')
  })
})

describe('date-picker M-B1 minDate / maxDate', () => {
  it('marks dates before minDate as disabled', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09', minDate: '2026-05-10' })
    await openPanel(wrapper)
    const cell = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '5')
    expect(cell!.classes().some((cls) => cls.endsWith('cell--disabled'))).toBe(true)
  })

  it('marks dates after maxDate as disabled', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09', maxDate: '2026-05-15' })
    await openPanel(wrapper)
    const cell = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '20')
    expect(cell!.classes().some((cls) => cls.endsWith('cell--disabled'))).toBe(true)
  })

  it('ignores click on minDate-disabled cell', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09', minDate: '2026-05-10' })
    await openPanel(wrapper)
    const cell = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '5')
    await cell!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('month picker：minDate=2026-04-15 时 4 月仍可选（粒度=month）', async () => {
    const wrapper = mountDP({ picker: 'month', modelValue: '2026-05', minDate: '2026-04-15' })
    await openPanel(wrapper)
    // 4 月 cell（locale 默认中文 '4 月'）
    const cells = wrapper.findAll(ns.em('cell', 'month'))
    const april = cells[3]
    expect(april.text()).toBe('4 月')
    expect(april.classes().some((cls) => cls.endsWith('cell--disabled'))).toBe(false)
    // 3 月应该禁用（整月在 minDate 之前）
    const march = cells[2]
    expect(march.text()).toBe('3 月')
    expect(march.classes().some((cls) => cls.endsWith('cell--disabled'))).toBe(true)
  })
})

describe('date-picker M-B1 disabledTime 动态时间禁用', () => {
  it('disabledTime hours 进入时间列 disabled 状态', async () => {
    const wrapper = mountDP({
      modelValue: '2026-05-09 12:00:00',
      showTime: true,
      disabledTime: () => ({
        disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8],
      }),
    })
    await openPanel(wrapper)
    // hour 列：0 ~ 8 应该 disabled
    const hourCol = wrapper.find('.' + ns.em('time-column', 'hour').slice(1))
    const cells = hourCol.findAll(ns.e('time-cell'))
    expect(cells[0].classes().some((cls) => cls.endsWith('time-cell--disabled'))).toBe(true)
    expect(cells[8].classes().some((cls) => cls.endsWith('time-cell--disabled'))).toBe(true)
    expect(cells[9].classes().some((cls) => cls.endsWith('time-cell--disabled'))).toBe(false)
  })

  it('disabledTime 与 showTime.disabledHours 合并取并集', async () => {
    const wrapper = mountDP({
      modelValue: '2026-05-09 12:00:00',
      showTime: { disabledHours: () => [0] },
      disabledTime: () => ({ disabledHours: () => [23] }),
    })
    await openPanel(wrapper)
    const hourCol = wrapper.find('.' + ns.em('time-column', 'hour').slice(1))
    const cells = hourCol.findAll(ns.e('time-cell'))
    expect(cells[0].classes().some((cls) => cls.endsWith('time-cell--disabled'))).toBe(true)
    expect(cells[23].classes().some((cls) => cls.endsWith('time-cell--disabled'))).toBe(true)
    expect(cells[12].classes().some((cls) => cls.endsWith('time-cell--disabled'))).toBe(false)
  })
})

describe('date-picker M-B1 键盘导航', () => {
  it('Enter 打开面板', async () => {
    const wrapper = mountDP()
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('ArrowDown 在关闭态打开面板', async () => {
    const wrapper = mountDP()
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('Escape 关闭面板', async () => {
    const wrapper = mountDP()
    await openPanel(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('Arrow 方向键给 cell 添加 focused 修饰', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    // 2026-05-10 应该 focused
    const cell10 = wrapper
      .findAll(ns.e('cell'))
      .find((c) => !c.classes(ns.em('cell', 'outside').slice(1)) && c.text() === '10')
    expect(cell10!.classes().some((cls) => cls.endsWith('cell--focused'))).toBe(true)
  })

  it('ArrowDown 移动 7 天后 Enter 选中', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-09' })
    await openPanel(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-05-16'])
  })

  it('Arrow 跨月时自动翻 viewMonth', async () => {
    const wrapper = mountDP({ modelValue: '2026-05-01' })
    await openPanel(wrapper)
    // 5-1 → ArrowLeft → 4-30 应跳到 4 月面板
    await wrapper.find('input').trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(wrapper.find(ns.e('panel-label')).text()).toContain('4 月')
  })
})

describe('date-picker M-B1 cell slot', () => {
  it('cell slot 替换 cell 内容（date 面板）', async () => {
    const wrapper = mount(DatePicker, {
      props: { modelValue: '2026-05-09' },
      slots: {
        cell: `<template #cell="{ current, type }"><span class="my-cell">{{ type }}:{{ current.date() }}</span></template>`,
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await openPanel(wrapper)
    const myCells = wrapper.findAll('.my-cell')
    expect(myCells.length).toBeGreaterThan(20)
    expect(myCells[0].text()).toMatch(/^date:\d+$/)
  })

  it('cell slot 同时传递 type=month（month 面板）', async () => {
    const wrapper = mount(DatePicker, {
      props: { picker: 'month', modelValue: '2026-05' },
      slots: {
        cell: `<template #cell="{ current, type }"><span class="my-cell">{{ type }}-{{ current.month() + 1 }}</span></template>`,
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await openPanel(wrapper)
    const myCells = wrapper.findAll('.my-cell')
    expect(myCells.length).toBe(12)
    expect(myCells[0].text()).toBe('month-1')
    expect(myCells[11].text()).toBe('month-12')
  })
})

describe('date-picker M-B1 extra-footer slot', () => {
  it('extra-footer slot 渲染 footer 容器（即使未启用 showTime）', async () => {
    const wrapper = mount(DatePicker, {
      props: { modelValue: '2026-05-09' },
      slots: {
        'extra-footer': `<span class="my-extra">以下单时间为准</span>`,
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('footer')).exists()).toBe(true)
    expect(wrapper.find('.my-extra').exists()).toBe(true)
    expect(wrapper.find('.my-extra').text()).toBe('以下单时间为准')
    // 没启用 showTime 时不应渲染 now/ok 按钮
    expect(wrapper.find(ns.e('footer-actions')).exists()).toBe(false)
  })

  it('extra-footer + showTime 同时渲染（extra-footer 上、actions 下）', async () => {
    const wrapper = mount(DatePicker, {
      props: { modelValue: '2026-05-09 12:00:00', showTime: true },
      slots: {
        'extra-footer': `<span class="my-extra">提示文案</span>`,
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await openPanel(wrapper)
    expect(wrapper.find('.my-extra').exists()).toBe(true)
    expect(wrapper.find(ns.e('footer-actions')).exists()).toBe(true)
  })
})
