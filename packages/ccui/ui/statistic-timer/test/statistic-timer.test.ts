import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StatisticTimer } from '../index'

describe('statistic-timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
  })

  it('countdown 默认模式：剩余时间正确显示', async () => {
    // 目标时间：当前 +1h2m3s
    const target = Date.now() + (1 * 3600 + 2 * 60 + 3) * 1000
    const wrapper = mount(StatisticTimer, { props: { value: target } })
    await nextTick()
    expect(wrapper.find('.ccui-statistic__value').text()).toBe('01:02:03')
  })

  it('countup 模式：从起点开始正数', async () => {
    // 起点：当前 -65 秒
    const start = Date.now() - 65 * 1000
    const wrapper = mount(StatisticTimer, { props: { type: 'countup', value: start, format: 'mm:ss' } })
    await nextTick()
    expect(wrapper.find('.ccui-statistic__value').text()).toBe('01:05')
  })

  it('title / prefix / suffix props 渲染', async () => {
    const wrapper = mount(StatisticTimer, {
      props: {
        title: '剩余时间',
        prefix: '+',
        suffix: 'left',
        value: Date.now() + 3600_000,
      },
    })
    await nextTick()
    expect(wrapper.find('.ccui-statistic__title').text()).toBe('剩余时间')
    expect(wrapper.find('.ccui-statistic__prefix').text()).toBe('+')
    expect(wrapper.find('.ccui-statistic__suffix').text()).toBe('left')
  })

  it('title / prefix / suffix slot 优先于 prop', async () => {
    const wrapper = mount(StatisticTimer, {
      props: { value: Date.now() + 3600_000, title: 'fallback' },
      slots: {
        title: '<b class="my-title">真实标题</b>',
        prefix: '<i class="my-pfx">★</i>',
        suffix: '<i class="my-sfx">→</i>',
      },
    })
    await nextTick()
    expect(wrapper.find('.my-title').exists()).toBe(true)
    expect(wrapper.find('.my-pfx').exists()).toBe(true)
    expect(wrapper.find('.my-sfx').exists()).toBe(true)
    expect(wrapper.find('.ccui-statistic__title').text()).not.toContain('fallback')
  })

  it('value 接受 Date 实例', async () => {
    const target = new Date(Date.now() + 30_000)
    const wrapper = mount(StatisticTimer, {
      props: { value: target, format: 'ss' },
    })
    await nextTick()
    expect(wrapper.find('.ccui-statistic__value').text()).toBe('30')
  })

  it('value 接受 ISO 字符串', async () => {
    const wrapper = mount(StatisticTimer, {
      props: { value: '2026-01-01T00:01:00.000Z', format: 'mm:ss' },
    })
    await nextTick()
    expect(wrapper.find('.ccui-statistic__value').text()).toBe('01:00')
  })

  it('countdown 归 0 时触发 finish 事件', async () => {
    const target = Date.now() + 100
    const wrapper = mount(StatisticTimer, { props: { value: target } })
    await nextTick()
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(wrapper.emitted('finish')).toBeTruthy()
  })

  it('countup 模式永不触发 finish 事件（即使时间过去很多）', async () => {
    const start = Date.now() - 1000
    const wrapper = mount(StatisticTimer, { props: { type: 'countup', value: start } })
    await nextTick()
    vi.advanceTimersByTime(60_000)
    await nextTick()
    expect(wrapper.emitted('finish')).toBeFalsy()
  })

  it('change 事件随 tick 持续触发', async () => {
    const target = Date.now() + 5000
    const wrapper = mount(StatisticTimer, { props: { value: target } })
    await nextTick()
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(wrapper.emitted('change')?.length).toBeGreaterThan(0)
  })

  it('valueStyle 透传到 value 元素 inline style', async () => {
    const wrapper = mount(StatisticTimer, {
      props: { value: Date.now() + 60_000, valueStyle: { color: 'red', fontSize: '24px' } },
    })
    await nextTick()
    const style = wrapper.find('.ccui-statistic__value').attributes('style') ?? ''
    expect(style).toContain('color: red')
    expect(style).toContain('font-size: 24px')
  })

  it('支持自定义 format token（带天数）', async () => {
    const target = Date.now() + (2 * 86_400 + 3 * 3600) * 1000
    const wrapper = mount(StatisticTimer, {
      props: { value: target, format: 'D 天 HH 时' },
    })
    await nextTick()
    expect(wrapper.find('.ccui-statistic__value').text()).toBe('2 天 03 时')
  })

  it('切换 type 时重新启动定时器', async () => {
    const wrapper = mount(StatisticTimer, {
      props: { value: Date.now() + 5000, type: 'countdown' },
    })
    await nextTick()
    await wrapper.setProps({ type: 'countup', value: Date.now() })
    await nextTick()
    vi.advanceTimersByTime(2000)
    await nextTick()
    // countup 走起来后 change 应该被多次触发
    expect((wrapper.emitted('change') ?? []).length).toBeGreaterThan(0)
  })

  it('卸载组件时清理定时器（不报错）', async () => {
    const wrapper = mount(StatisticTimer, { props: { value: Date.now() + 60_000 } })
    await nextTick()
    expect(() => wrapper.unmount()).not.toThrow()
  })
})
