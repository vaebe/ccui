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
    const wrapper = createWrapper({}, {
      dateCell: `<template #dateCell="{isSelected, date, day}">
            {{isSelected ? '当前选中日期' : day}}
          </template>`,
    })
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

    // Test next month
    let buttons = wrapper.find(headerClass).findAllComponents(Button)
    await buttons[2].trigger('click')
    expect(wrapper.find(headerClass).text()).toContain('2022-11')

    // Test previous month (from November back to October)
    buttons = wrapper.find(headerClass).findAllComponents(Button)
    await buttons[0].trigger('click')
    expect(wrapper.find(headerClass).text()).toContain('2022-10')

    // Test today button
    buttons = wrapper.find(headerClass).findAllComponents(Button)
    await buttons[1].trigger('click')
    const today = new Date()
    const todayMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
    expect(wrapper.find(headerClass).text()).toContain(todayMonth)

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

    const firstDay = days.find(day => day.text() === '1')
    expect(firstDay).toBeTruthy()

    const lastDay = days.find(day => day.text() === '31')
    expect(lastDay).toBeTruthy()

    wrapper.unmount()
  })

  it('renders custom header when header slot is provided', () => {
    const wrapper = createWrapper({}, {
      header: `<template #header="{ currentDate }">
            <div class="custom-header">Custom Header - {{ currentDate }}</div>
          </template>`,
    })
    expect(wrapper.find('.custom-header').exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('correctly handles month boundaries', () => {
    const testDate = new Date(2022, 0, 15) // 2022-01-15
    const wrapper = createWrapper({ modelValue: testDate })

    const days = wrapper.findAll(dayClass)
    const lastDay = days.find(day => day.text() === '31')
    expect(lastDay).toBeTruthy()

    wrapper.unmount()
  })
})
