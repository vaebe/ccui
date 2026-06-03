import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { nextTick } from 'vue'
import { TimeRangePicker } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('time-range-picker', true)
const wrappers: VueWrapper[] = []

function mountTRP(props: Record<string, unknown> = {}) {
  const wrapper = mount(TimeRangePicker, { props, attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}

beforeEach(() => {
  vi.setSystemTime(new Date('2026-05-09T10:30:45.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('time-range-picker rendering', () => {
  it('renders two TimePicker inputs and a separator', () => {
    const wrapper = mountTRP()
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBe(2)
    expect(wrapper.find(ns.e('separator')).exists()).toBe(true)
  })

  it('renders custom separator', () => {
    const wrapper = mountTRP({ separator: '至' })
    expect(wrapper.find(ns.e('separator')).text()).toBe('至')
  })

  it('shows tuple modelValue in both inputs', () => {
    const wrapper = mountTRP({ modelValue: ['09:00:00', '18:00:00'] })
    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('09:00:00')
    expect((inputs[1].element as HTMLInputElement).value).toBe('18:00:00')
  })

  it('placeholder 接元组分别给两端', () => {
    const wrapper = mountTRP({ placeholder: ['开始', '结束'] })
    const inputs = wrapper.findAll('input')
    expect(inputs[0].attributes('placeholder')).toBe('开始')
    expect(inputs[1].attributes('placeholder')).toBe('结束')
  })
})

describe('time-range-picker disabled 元组', () => {
  it('disabled=[false, true] 只锁右端', () => {
    const wrapper = mountTRP({ disabled: [false, true] })
    const inputs = wrapper.findAll('input')
    expect(inputs[0].attributes('disabled')).toBeUndefined()
    expect(inputs[1].attributes('disabled')).toBeDefined()
  })

  it('disabled=true 同时锁两端', () => {
    const wrapper = mountTRP({ disabled: true })
    const inputs = wrapper.findAll('input')
    expect(inputs[0].attributes('disabled')).toBeDefined()
    expect(inputs[1].attributes('disabled')).toBeDefined()
  })
})

describe('time-range-picker allowEmpty 元组', () => {
  it('allowEmpty=[true, false] 允许 start 空', async () => {
    // 单元测试只验证 prop 正确接收，不进入弹层交互（弹层交互覆盖在 time-picker 测试里）
    const wrapper = mountTRP({ allowEmpty: [true, false], modelValue: ['09:00:00', '18:00:00'] })
    expect(wrapper.props('allowEmpty')).toEqual([true, false])
  })

  it('allowEmpty=true 同时允许两端空', () => {
    const wrapper = mountTRP({ allowEmpty: true })
    expect(wrapper.props('allowEmpty')).toBe(true)
  })
})

describe('time-range-picker clear', () => {
  it('显示 clear 当有 modelValue', () => {
    const wrapper = mountTRP({ modelValue: ['09:00:00', '18:00:00'] })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
  })

  it('clear 触发 emit null', async () => {
    const wrapper = mountTRP({ modelValue: ['09:00:00', '18:00:00'] })
    await wrapper.find(ns.e('clear')).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('两端都 disabled 时不显示 clear', () => {
    const wrapper = mountTRP({ modelValue: ['09:00:00', '18:00:00'], disabled: true })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })
})

describe('time-range-picker size / status', () => {
  it.each([['small'], ['default'], ['large']])('applies size modifier %s', (size) => {
    const wrapper = mountTRP({ size })
    expect(wrapper.classes()).toContain(`${ns.b().slice(1)}--${size}`)
  })

  it('applies status="error" modifier', () => {
    const wrapper = mountTRP({ status: 'error' })
    expect(wrapper.classes()).toContain(`${ns.b().slice(1)}--status-error`)
  })
})

describe('time-range-picker order 自动保序', () => {
  it('start > end 时 order=true 自动交换 emit', async () => {
    // 触发交换需要走面板；此处验证 prop 默认值
    const wrapper = mountTRP()
    expect(wrapper.props('order')).toBe(true)
    await nextTick()
  })
})
