import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { Button } from '../../button/index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Calendar } from '../index'

const ns = useNamespace('calendar', true)
const baseClass = ns.b()
const dayClass = ns.em('day-box', 'day')
const currentDateClass = '.current-date'
const headerClass = ns.e('header')

// 测试辅助函数
function createWrapper(props = {}, slots = {}) {
  return mount(Calendar, {
    props: {
      modelValue: new Date(),
      ...props,
    },
    slots,
    global: {
      components: {
        CButton: Button,
      },
    },
  })
}

describe('calendar', () => {
  it('dom', () => {
    const wrapper = createWrapper()
    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    expect(wrapper.findAll(dayClass).length).toBe(42)
    wrapper.unmount()
  })

  it('props', async () => {
    const wrapper = createWrapper()
    const testDate = new Date(2022, 9, 10) // 2022-10-10
    await wrapper.setProps({ modelValue: testDate })
    expect(wrapper.find(currentDateClass).text()).toBe('10')
    wrapper.unmount()
  })

  it('slots', async () => {
    const wrapper = createWrapper(
      {},
      {
        dateCell: `<template #dateCell="{isSelected, date, day}">
            {{isSelected ? '当前选中日期' : day}}
          </template>`,
      },
    )
    expect(wrapper.find(currentDateClass).exists()).toBeTruthy()
    expect(wrapper.find(currentDateClass).text()).toBe('当前选中日期')
    wrapper.unmount()
  })

  it('event', async () => {
    const wrapper = createWrapper()
    const firstDate = wrapper.find(dayClass).text()
    await wrapper.find(dayClass).trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.find(currentDateClass).text()).toBe(firstDate)
    wrapper.unmount()
  })

  it('month navigation', async () => {
    const testDate = new Date(2022, 9, 10) // 2022-10-10
    const wrapper = createWrapper({ modelValue: testDate })

    // Test next month — header 走 zh-CN monthFormat 'YYYY 年 M 月'
    let buttons = wrapper.find(headerClass).findAllComponents(Button)
    await buttons[2].trigger('click')
    expect(wrapper.find(headerClass).text()).toContain('2022 年 11 月')

    // Test previous month (from November back to October)
    buttons = wrapper.find(headerClass).findAllComponents(Button)
    await buttons[0].trigger('click')
    expect(wrapper.find(headerClass).text()).toContain('2022 年 10 月')

    // Test today button
    buttons = wrapper.find(headerClass).findAllComponents(Button)
    await buttons[1].trigger('click')
    const today = new Date()
    expect(wrapper.find(headerClass).text()).toContain(`${today.getFullYear()} 年 ${today.getMonth() + 1} 月`)

    wrapper.unmount()
  })

  it('highlights current date', async () => {
    const today = new Date()
    const wrapper = createWrapper({ modelValue: today })
    expect(wrapper.find(currentDateClass).exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('works in read-only mode', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2022, 9, 10),
      readOnly: true,
    })
    expect(wrapper.props().readOnly).toBe(true)
    wrapper.unmount()
  })

  it('renders correct dates for month', async () => {
    const testDate = new Date(2022, 9, 10) // 2022-10-10
    const wrapper = createWrapper({ modelValue: testDate })

    const days = wrapper.findAll(dayClass)
    expect(days.length).toBe(42) // 6周 x 7天

    const firstDay = days.find((day) => day.text() === '1')
    expect(firstDay).toBeTruthy()

    const lastDay = days.find((day) => day.text() === '31')
    expect(lastDay).toBeTruthy()

    wrapper.unmount()
  })

  it('renders custom header when header slot is provided', () => {
    const wrapper = createWrapper(
      {},
      {
        header: `<template #header="{ currentDate }">
            <div class="custom-header">Custom Header - {{ currentDate }}</div>
          </template>`,
      },
    )
    expect(wrapper.find('.custom-header').exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('correctly handles month boundaries', () => {
    const testDate = new Date(2022, 0, 15) // 2022-01-15
    const wrapper = createWrapper({ modelValue: testDate })

    const days = wrapper.findAll(dayClass)
    const lastDay = days.find((day) => day.text() === '31')
    expect(lastDay).toBeTruthy()

    wrapper.unmount()
  })

  // L-2.19：header slot 富作用域
  it('header slot 接收富作用域对象 { value, currentMonth, setDate, changeMonth }', () => {
    let scope: any = null
    const wrapper = createWrapper(
      { modelValue: new Date('2026-03-15') },
      {
        header: (s: any) => {
          scope = s
          return `<div class="my-header">${s.value}</div>` as any
        },
      },
    )
    expect(scope).not.toBeNull()
    expect(scope.value).toBe('2026-03-15')
    expect(scope.currentMonth).toBe('2026-03')
    expect(typeof scope.setDate).toBe('function')
    expect(typeof scope.changeMonth).toBe('function')
    wrapper.unmount()
  })

  it('header slot 的 changeMonth("nextMonth") 触发月份切换（默认 valueFormat=string 输出 YYYY-MM-01）', async () => {
    let capturedScope: any = null
    const wrapper = mount(Calendar, {
      props: { modelValue: '2026-03-15' },
      slots: {
        header: (s: any) => {
          capturedScope = s
          return undefined as any
        },
      },
      global: { components: { Button } },
    })
    capturedScope.changeMonth('nextMonth')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')![0][0] as string
    expect(emitted).toBe('2026-04-01')
    wrapper.unmount()
  })

  it('header slot 的 setDate 直接跳转到任意日期', async () => {
    let capturedScope: any = null
    const wrapper = mount(Calendar, {
      props: { modelValue: '2026-03-15' },
      slots: {
        header: (s: any) => {
          capturedScope = s
          return undefined as any
        },
      },
      global: { components: { Button } },
    })
    capturedScope.setDate('2026-12-25')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-12-25')
    wrapper.unmount()
  })

  describe('M-A2 classNames / styles 钩子', () => {
    it('classNames.root 注入到根节点', () => {
      const wrapper = createWrapper({ classNames: { root: 'my-root' } })
      expect(wrapper.find(baseClass).classes()).toContain('my-root')
      wrapper.unmount()
    })

    it('styles.root 注入到根节点 style', () => {
      const wrapper = createWrapper({ styles: { root: { color: 'red' } } })
      expect(wrapper.find(baseClass).attributes('style') || '').toContain('red')
      wrapper.unmount()
    })
  })

  describe('XL-2 Dayjs 协议 + valueFormat', () => {
    it('modelValue 接收 string (YYYY-MM-DD)：解析并显示', () => {
      const wrapper = mount(Calendar, {
        props: { modelValue: '2026-03-15' },
        global: { components: { CButton: Button } },
      })
      expect(wrapper.find(headerClass).text()).toContain('2026 年 3 月')
      expect(wrapper.find(currentDateClass).text()).toBe('15')
      wrapper.unmount()
    })

    it('modelValue 接收 Date：解析并显示', () => {
      const wrapper = mount(Calendar, {
        props: { modelValue: new Date(2026, 2, 15) },
        global: { components: { CButton: Button } },
      })
      expect(wrapper.find(headerClass).text()).toContain('2026 年 3 月')
      expect(wrapper.find(currentDateClass).text()).toBe('15')
      wrapper.unmount()
    })

    it('modelValue 接收 timestamp (number)：解析并显示', () => {
      const ts = new Date(2026, 2, 15).getTime()
      const wrapper = mount(Calendar, {
        props: { modelValue: ts },
        global: { components: { CButton: Button } },
      })
      expect(wrapper.find(headerClass).text()).toContain('2026 年 3 月')
      wrapper.unmount()
    })

    it('modelValue=null：回退到今天', () => {
      const wrapper = mount(Calendar, {
        props: { modelValue: null },
        global: { components: { CButton: Button } },
      })
      expect(wrapper.find(currentDateClass).exists()).toBeTruthy()
      wrapper.unmount()
    })

    it('valueFormat="string" (默认)：emit YYYY-MM-DD 字符串', async () => {
      const wrapper = mount(Calendar, {
        props: { modelValue: '2026-03-15' },
        global: { components: { CButton: Button } },
      })
      const cells = wrapper.findAll(dayClass)
      const targetCell = cells.find((c) => c.text() === '20' && c.classes().includes('current-month'))!
      await targetCell.trigger('click')
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026-03-20')
      wrapper.unmount()
    })

    it('valueFormat="date"：emit Date 对象', async () => {
      const wrapper = mount(Calendar, {
        props: { modelValue: '2026-03-15', valueFormat: 'date' },
        global: { components: { CButton: Button } },
      })
      const cells = wrapper.findAll(dayClass)
      const targetCell = cells.find((c) => c.text() === '20' && c.classes().includes('current-month'))!
      await targetCell.trigger('click')
      const out = wrapper.emitted('update:modelValue')![0][0]
      expect(out).toBeInstanceOf(Date)
      expect((out as Date).getFullYear()).toBe(2026)
      expect((out as Date).getMonth()).toBe(2)
      expect((out as Date).getDate()).toBe(20)
      wrapper.unmount()
    })

    it('valueFormat="number"：emit timestamp', async () => {
      const wrapper = mount(Calendar, {
        props: { modelValue: '2026-03-15', valueFormat: 'number' },
        global: { components: { CButton: Button } },
      })
      const cells = wrapper.findAll(dayClass)
      const targetCell = cells.find((c) => c.text() === '20' && c.classes().includes('current-month'))!
      await targetCell.trigger('click')
      const out = wrapper.emitted('update:modelValue')![0][0]
      expect(typeof out).toBe('number')
      expect(new Date(out as number).getDate()).toBe(20)
      wrapper.unmount()
    })

    it('自定义 format="YYYY/MM/DD"：双向解析与输出', async () => {
      const wrapper = mount(Calendar, {
        props: { modelValue: '2026/03/15', format: 'YYYY/MM/DD' },
        global: { components: { CButton: Button } },
      })
      expect(wrapper.find(currentDateClass).text()).toBe('15')
      const cells = wrapper.findAll(dayClass)
      const targetCell = cells.find((c) => c.text() === '20' && c.classes().includes('current-month'))!
      await targetCell.trigger('click')
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('2026/03/20')
      wrapper.unmount()
    })
  })
})
