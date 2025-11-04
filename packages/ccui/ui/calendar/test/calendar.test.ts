import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Button } from '../../button/index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Calendar } from '../index'

const ns = useNamespace('calendar', true)
const baseClass = ns.b()
const dayClass = ns.em('day-box', 'day')
const currentDateClass = '.current-date'
const headerClass = ns.e('header')

describe('calendar', () => {
  it('dom', () => {
    const wrapper = mount(Calendar, {
      props: { modelValue: new Date() },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    // 元素是否存在
    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    // 日期生成是否正确
    expect(wrapper.findAll(dayClass).length).toBe(42)

    wrapper.unmount()
  })

  it('props', async () => {
    const wrapper = mount(Calendar, {
      props: { modelValue: new Date() },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    const testDate = new Date(2022, 9, 10) // 2022-10-10
    await wrapper.setProps({ modelValue: testDate })

    expect(wrapper.find(currentDateClass).text()).toBe('10')

    wrapper.unmount()
  })

  it('slots', async () => {
    const wrapper = mount(Calendar, {
      props: { modelValue: new Date() },
      slots: {
        dateCell: `<template #dateCell="{isSelected, date, day}">
            {{isSelected ? '当前选中日期' : day}}
          </template>`,
      },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    // slot 元素正确加载
    expect(wrapper.find(currentDateClass).exists()).toBeTruthy()

    // slot 内容正确渲染
    expect(wrapper.find(currentDateClass).text()).toBe('当前选中日期')

    wrapper.unmount()
  })

  it('event', async () => {
    const wrapper = mount(Calendar, {
      props: { modelValue: new Date() },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    // 断言 change 事件是否正确触发
    // 获取第一个日期
    const firstDate = wrapper.find(dayClass).text()

    // 以第一个 day 元素触发 click 事件更新选中数据
    await wrapper.find(dayClass).trigger('click')

    // 验证是否触发emit事件
    expect(wrapper.emitted('change')).toBeTruthy()

    // 获取当前选中数据进行比对
    expect(wrapper.find(currentDateClass).text()).toBe(firstDate)

    wrapper.unmount()
  })

  it('switches to next month', async () => {
    const testDate = new Date(2022, 9, 10) // 2022-10-10
    const expectedNextMonth = '2022-11'

    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    // 点击下个月按钮 (第三个按钮)
    const buttons = wrapper.find(headerClass).findAllComponents(Button)
    await buttons[2].trigger('click')

    // 验证月份是否正确更新
    expect(wrapper.find(headerClass).text()).toContain(expectedNextMonth)

    wrapper.unmount()
  })

  it('switches to previous month', async () => {
    const testDate = new Date(2022, 9, 10) // 2022-10-10
    const expectedPrevMonth = '2022-09'

    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    // 点击上个月按钮 (第一个按钮)
    const buttons = wrapper.find(headerClass).findAllComponents(Button)
    await buttons[0].trigger('click')

    // 验证月份是否正确更新
    expect(wrapper.find(headerClass).text()).toContain(expectedPrevMonth)

    wrapper.unmount()
  })

  it('navigates to today', async () => {
    const testDate = new Date(2022, 9, 10) // 2022-10-10
    const today = new Date()
    const todayMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    // 点击今天按钮 (第二个按钮)
    const buttons = wrapper.find(headerClass).findAllComponents(Button)
    await buttons[1].trigger('click')

    // 验证月份是否正确更新为当前月份
    expect(wrapper.find(headerClass).text()).toContain(todayMonth)

    wrapper.unmount()
  })

  it('highlights current date', async () => {
    const today = new Date()
    const wrapper = mount(Calendar, {
      props: { modelValue: today },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    // 验证当前日期是否有高亮类
    expect(wrapper.find(currentDateClass).exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('works in read-only mode', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: new Date(2022, 9, 10), // 2022-10-10
        readOnly: true,
      },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    // 验证是否应用了只读属性
    expect(wrapper.props().readOnly).toBe(true)

    wrapper.unmount()
  })

  it('renders correct dates for month', async () => {
    const testDate = new Date(2022, 9, 10) // 2022-10-10
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
      global: {
        components: {
          CButton: Button,
        },
      },
    })

    // 验证10月份有31天
    const days = wrapper.findAll(dayClass)
    expect(days.length).toBe(42) // 6周 x 7天

    // 验证10月1日存在
    const firstDay = days.find(day => day.text() === '1')
    expect(firstDay).toBeTruthy()

    // 验证10月31日存在
    const lastDay = days.find(day => day.text() === '31')
    expect(lastDay).toBeTruthy()

    wrapper.unmount()
  })
})
