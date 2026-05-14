import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Slider } from '../index'

const ns = useNamespace('slider', true)

// Helper: mock getBoundingClientRect on wrapper element
function stubSliderRect(wrapper: any, width = 200, height = 32) {
  const el = wrapper.find(ns.e('wrapper')).element
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width,
    height,
    right: width,
    bottom: height,
    x: 0,
    y: 0,
    toJSON() {},
  } as DOMRect)
}

describe('slider', () => {
  // ─── 渲染 ─────────────────────────────────────────────

  it('renders track, bar, and button', () => {
    const wrapper = mount(Slider)
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.find(ns.e('wrapper')).exists()).toBe(true)
    expect(wrapper.find(ns.e('track')).exists()).toBe(true)
    expect(wrapper.find(ns.e('button')).exists()).toBe(true)
    wrapper.unmount()
  })

  it('positions bar width from modelValue', () => {
    const wrapper = mount(Slider, { props: { modelValue: 40 } })
    const bar = wrapper.find(ns.e('bar'))
    expect((bar.element as HTMLElement).style.width).toBe('40%')
    wrapper.unmount()
  })

  it('renders two buttons in range mode', () => {
    const wrapper = mount(Slider, { props: { range: true, modelValue: [20, 80] } })
    expect(wrapper.findAll(ns.e('button-wrapper')).length).toBe(2)
    wrapper.unmount()
  })

  it('applies disabled modifier and prevents interaction', async () => {
    const wrapper = mount(Slider, { props: { disabled: true, modelValue: 50 } })
    expect(wrapper.find(ns.m('disabled')).exists()).toBe(true)

    stubSliderRect(wrapper)
    await wrapper.find(ns.e('wrapper')).trigger('click', { clientX: 100 })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('applies vertical modifier', () => {
    const wrapper = mount(Slider, { props: { vertical: true } })
    expect(wrapper.find(ns.m('vertical')).exists()).toBe(true)
    wrapper.unmount()
  })

  it('applies size modifier', () => {
    const wrapper = mount(Slider, { props: { size: 'large' } })
    expect(wrapper.find(ns.m('large')).exists()).toBe(true)
    wrapper.unmount()
  })

  // ─── ARIA ──────────────────────────────────────────────

  it('sets aria attributes on button', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, min: 0, max: 100 } })
    const btn = wrapper.find(ns.e('button'))
    expect(btn.attributes('role')).toBe('slider')
    expect(btn.attributes('aria-valuemin')).toBe('0')
    expect(btn.attributes('aria-valuemax')).toBe('100')
    expect(btn.attributes('aria-valuenow')).toBe('30')
    wrapper.unmount()
  })

  it('applies ariaLabel and label props', () => {
    const w1 = mount(Slider, { props: { ariaLabel: 'Volume' } })
    expect(w1.find(ns.e('wrapper')).attributes('aria-label')).toBe('Volume')
    w1.unmount()

    const w2 = mount(Slider, { props: { label: 'Brightness' } })
    expect(w2.attributes('aria-label')).toBe('Brightness')
    w2.unmount()
  })

  it('range mode shows custom aria labels for start and end', () => {
    const wrapper = mount(Slider, {
      props: { range: true, modelValue: [20, 80], rangeStartLabel: 'Start', rangeEndLabel: 'End' },
    })
    const buttons = wrapper.findAll(ns.e('button'))
    expect(buttons[0].attributes('aria-label')).toBe('Start')
    expect(buttons[1].attributes('aria-label')).toBe('End')
    wrapper.unmount()
  })

  it('formatValueText customizes aria-valuetext', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50, formatValueText: (v: number) => `${v} degrees` },
    })
    expect(wrapper.find(ns.e('button')).attributes('aria-valuetext')).toBe('50 degrees')
    wrapper.unmount()
  })

  // ─── 点击交互 ─────────────────────────────────────────

  it('click on slider emits precise value aligned to step', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 0, step: 10, min: 0, max: 100 } })
    stubSliderRect(wrapper, 200)

    // clientX=50 → 25% of 200px → 25 → rounded to step 10 → 30
    await wrapper.find(ns.e('wrapper')).trigger('click', { clientX: 50 })

    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted).toBeDefined()
    expect(emitted[0][0]).toBe(30)

    // also emits change, change-complete (与 ant onChangeComplete 对齐), and input
    expect(wrapper.emitted('change')).toBeDefined()
    expect(wrapper.emitted('change-complete')).toBeDefined()
    // change 与 change-complete 触发次数与 payload 完全一致（alias 关系）
    expect(wrapper.emitted('change-complete')!.length).toBe(wrapper.emitted('change')!.length)
    expect(wrapper.emitted('input')).toBeDefined()
    wrapper.unmount()
  })

  // ─── 键盘交互 ─────────────────────────────────────────

  it('ArrowRight increments by step', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, step: 5 } })
    await wrapper.find(ns.e('button')).trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')![0][0]).toBe(55)
    expect(wrapper.emitted('change')).toBeDefined()
    // change-complete 与 change 同步触发，与 ant onChangeComplete 对齐
    expect(wrapper.emitted('change-complete')).toBeDefined()
    expect(wrapper.emitted('change-complete')!.length).toBe(wrapper.emitted('change')!.length)
    wrapper.unmount()
  })

  it('ArrowLeft decrements by step', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, step: 5 } })
    await wrapper.find(ns.e('button')).trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')![0][0]).toBe(45)
    expect(wrapper.emitted('change')).toBeDefined()
    wrapper.unmount()
  })

  it('Home goes to min, End goes to max', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, min: 10, max: 90 } })
    const btn = wrapper.find(ns.e('button'))

    await btn.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe(10)

    await btn.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')![1][0]).toBe(90)
    wrapper.unmount()
  })

  it('keyboard does not emit when disabled', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, disabled: true } })
    await wrapper.find(ns.e('button')).trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('ArrowRight clamps at max boundary', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 99, step: 5, max: 100 } })
    await wrapper.find(ns.e('button')).trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe(100)
    wrapper.unmount()
  })

  // ─── 拖拽 ─────────────────────────────────────────────

  it('mousedown starts drag and registers document listeners', async () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    const wrapper = mount(Slider, { props: { modelValue: 50 } })

    stubSliderRect(wrapper)
    await wrapper.find(ns.e('button')).trigger('mousedown', { clientX: 50, preventDefault: () => {} })

    expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
    addSpy.mockRestore()
    wrapper.unmount()
  })

  // ─── Tooltip ──────────────────────────────────────────

  it('shows tooltip on hover with value text', async () => {
    const wrapper = mount(Slider, { props: { showTooltip: true, modelValue: 50 } })
    await wrapper.find(ns.e('button')).trigger('mouseenter')

    const tooltip = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltip.exists()).toBe(true)
    expect(tooltip.props('visible')).toBe(true)
    expect(tooltip.props('content')).toBe('50')
    wrapper.unmount()
  })

  it('hides tooltip when showTooltip is false', () => {
    const wrapper = mount(Slider, { props: { showTooltip: false } })
    expect(wrapper.findComponent({ name: 'CTooltip' }).exists()).toBe(false)
    wrapper.unmount()
  })

  it('tipsRenderer customizes tooltip text', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 5, tipsRenderer: (v: number) => `${v} apples`, showTooltip: true },
    })
    await wrapper.find(ns.e('button')).trigger('mouseenter')
    expect(wrapper.findComponent({ name: 'CTooltip' }).props('content')).toBe('5 apples')
    wrapper.unmount()
  })

  it('tipsRenderer=null clears tooltip content', () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, tipsRenderer: null } })
    const tooltip = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltip.exists()).toBe(true)
    expect(tooltip.props('content')).toBe('')
    wrapper.unmount()
  })

  it('placement prop is forwarded to tooltip', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50, placement: 'bottom', showTooltip: true },
    })
    await wrapper.find(ns.e('button')).trigger('mouseenter')
    expect(wrapper.findComponent({ name: 'CTooltip' }).props('placement')).toBe('bottom')
    wrapper.unmount()
  })

  // ─── Input 联动 ────────────────────────────────────────

  it('shows input number when showInput is true', () => {
    const wrapper = mount(Slider, { props: { showInput: true, modelValue: 50 } })
    expect(wrapper.find(ns.e('input')).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CInputNumber' }).exists()).toBe(true)
    wrapper.unmount()
  })

  it('hides input in range mode even if showInput is true', () => {
    const wrapper = mount(Slider, { props: { showInput: true, range: true, modelValue: [20, 80] } })
    expect(wrapper.find(ns.e('input')).exists()).toBe(false)
    wrapper.unmount()
  })

  it('input change emits clamped value', async () => {
    const wrapper = mount(Slider, { props: { showInput: true, modelValue: 50, min: 0, max: 100 } })
    const input = wrapper.findComponent({ name: 'CInputNumber' })

    await input.vm.$emit('update:modelValue', 75)
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe(75)
    expect(wrapper.emitted('change')).toBeDefined()
    wrapper.unmount()
  })

  it('input value exceeding max is clamped to max', async () => {
    const wrapper = mount(Slider, { props: { showInput: true, modelValue: 50, min: 0, max: 100 } })
    await wrapper.findComponent({ name: 'CInputNumber' }).vm.$emit('update:modelValue', 150)
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe(100)
    wrapper.unmount()
  })

  it('input value below min is clamped to min', async () => {
    const wrapper = mount(Slider, { props: { showInput: true, modelValue: 50, min: 0, max: 100 } })
    await wrapper.findComponent({ name: 'CInputNumber' }).vm.$emit('update:modelValue', -10)
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe(0)
    wrapper.unmount()
  })

  it('inputSize prop is forwarded to InputNumber', () => {
    const wrapper = mount(Slider, { props: { showInput: true, inputSize: 'large', modelValue: 50 } })
    expect(wrapper.findComponent({ name: 'CInputNumber' }).props('size')).toBe('large')
    wrapper.unmount()
  })

  it('showInputControls=false hides controls', () => {
    const wrapper = mount(Slider, { props: { showInput: true, showInputControls: false, modelValue: 50 } })
    const input = wrapper.findComponent({ name: 'CInputNumber' })
    expect(input.props('controls')).toBe(false)
    wrapper.unmount()
  })

  // ─── Marks & Stops ────────────────────────────────────

  it('renders marks at correct positions', () => {
    const marks = { 0: '0°C', 25: '25°C', 50: '50°C', 75: '75°C', 100: '100°C' }
    const wrapper = mount(Slider, { props: { marks } })

    const markEls = wrapper.findAll(ns.e('mark'))
    expect(markEls.length).toBe(5)

    const labels = wrapper.findAll(ns.e('mark-label'))
    expect(labels[0].text()).toBe('0°C')
    expect(labels[4].text()).toBe('100°C')
    wrapper.unmount()
  })

  it('renders stops based on step', () => {
    const wrapper = mount(Slider, { props: { showStops: true, step: 10 } })
    expect(wrapper.find(ns.e('stops')).exists()).toBe(true)
    expect(wrapper.findAll(ns.e('stop')).length).toBe(11)
    wrapper.unmount()
  })

  // ─── showDefaultTooltip / persistent ───────────────────

  it('showDefaultTooltip overrides tipsRenderer=null', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50, tipsRenderer: null, showTooltip: true, showDefaultTooltip: true },
    })
    await wrapper.find(ns.e('button')).trigger('mouseenter')
    const tooltip = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltip.props('visible')).toBe(true)
    expect(tooltip.props('content')).toBe('50')
    wrapper.unmount()
  })
})
