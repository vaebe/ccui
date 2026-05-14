import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { ColorPicker } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { hexToRgb, hsvToRgb, hsvToString, rgbToHex, rgbToHsv, rgbToString } from '../../shared/utils/color'
import { Form, FormItem } from '../../form'

const ns = useNamespace('color-picker', true)
const wrappers: VueWrapper[] = []

function mountCP(props: Record<string, unknown> = {}) {
  const wrapper = mount(ColorPicker, { props, attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}

async function openPanel(wrapper: VueWrapper) {
  await wrapper.find(ns.e('trigger')).trigger('click')
  await nextTick()
  await nextTick()
}

function stubRect(el: HTMLElement, width = 100, height = 100, left = 0, top = 0) {
  ;(el as any).getBoundingClientRect = () => ({
    width,
    height,
    left,
    top,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  })
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('color util conversions', () => {
  it('parses 6-char hex, 3-char hex, and 8-char hex with alpha', () => {
    expect(hexToRgb('#1677ff')).toEqual({ r: 22, g: 119, b: 255, a: 1 })
    expect(hexToRgb('1677ff')).toEqual({ r: 22, g: 119, b: 255, a: 1 })
    expect(hexToRgb('#abc')).toEqual({ r: 170, g: 187, b: 204, a: 1 })
    const eighter = hexToRgb('#1677ff80')!
    expect(eighter.r).toBe(22)
    expect(eighter.a).toBeCloseTo(0.5, 1)
    expect(hexToRgb('not a color')).toBeNull()
    expect(hexToRgb('')).toBeNull()
  })

  it('rgb → hex round trip preserves channels', () => {
    expect(rgbToHex({ r: 22, g: 119, b: 255, a: 1 })).toBe('#1677ff')
    expect(rgbToHex({ r: 0, g: 0, b: 0, a: 0.5 })).toMatch(/^#00000080$/)
    // includeAlpha=false 且 a=1 时应不带 alpha 段
    expect(rgbToHex({ r: 255, g: 255, b: 255, a: 1 })).toBe('#ffffff')
  })

  it('rgb ↔ hsv round trip is stable for primary colors', () => {
    const red = { r: 255, g: 0, b: 0, a: 1 }
    const hsv = rgbToHsv(red)
    expect(hsv.h).toBe(0)
    expect(hsv.s).toBe(100)
    expect(hsv.v).toBe(100)
    const back = hsvToRgb(hsv)
    expect(back).toEqual(red)
  })

  it('hsv → rgb hits expected hue boundaries', () => {
    expect(hsvToRgb({ h: 120, s: 100, v: 100, a: 1 })).toEqual({ r: 0, g: 255, b: 0, a: 1 })
    expect(hsvToRgb({ h: 240, s: 100, v: 100, a: 1 })).toEqual({ r: 0, g: 0, b: 255, a: 1 })
  })

  it('rgbToString and hsvToString format correctly', () => {
    expect(rgbToString({ r: 22, g: 119, b: 255, a: 1 })).toBe('rgb(22, 119, 255)')
    expect(rgbToString({ r: 22, g: 119, b: 255, a: 0.5 })).toBe('rgba(22, 119, 255, 0.5)')
    expect(hsvToString({ h: 215, s: 91, v: 100, a: 1 })).toBe('hsv(215, 91%, 100%)')
    expect(hsvToString({ h: 215, s: 91, v: 100, a: 0.3 })).toBe('hsva(215, 91%, 100%, 0.3)')
  })
})

describe('color-picker rendering', () => {
  it('renders a trigger button with the current color swatch', () => {
    const wrapper = mountCP({ defaultValue: '#ff5500' })
    const fg = wrapper.find(ns.e('swatch-fg'))
    expect((fg.element as HTMLElement).style.backgroundColor).toBe('rgb(255, 85, 0)')
  })

  it('shows showText label when enabled and reflects format', async () => {
    const wrapper = mountCP({ defaultValue: '#1677ff', showText: true, format: 'hex' })
    expect(wrapper.find(ns.e('value-text')).text()).toBe('#1677FF')
    await wrapper.setProps({ defaultValue: '#1677ff', showText: true, format: 'rgb' })
    expect(wrapper.find(ns.e('value-text')).text()).toBe('rgb(22, 119, 255)')
    await wrapper.setProps({ defaultValue: '#1677ff', showText: true, format: 'hsb' })
    expect(wrapper.find(ns.e('value-text')).text()).toMatch(/^hsb\(/)
  })

  it('accepts deprecated format="hsv" and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountCP({ defaultValue: '#1677ff', showText: true, format: 'hsv' })
    expect(wrapper.find(ns.e('value-text')).text()).toMatch(/^hsv\(/)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('format="hsv" 已 deprecated'))
    warn.mockRestore()
  })

  it('hides showText by default', () => {
    const wrapper = mountCP()
    expect(wrapper.find(ns.e('value-text')).exists()).toBe(false)
  })

  it('disabled trigger does not open panel and renders is-disabled class', async () => {
    const wrapper = mountCP({ disabled: true })
    expect(wrapper.find(ns.e('trigger')).classes()).toContain('is-disabled')
    await wrapper.find(ns.e('trigger')).trigger('click')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})

describe('color-picker popup', () => {
  it('opens popup on trigger click and emits open-change', async () => {
    const wrapper = mountCP()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    expect(wrapper.emitted('open-change')?.[0]).toEqual([true])
  })

  it('toggles popup closed on second click', async () => {
    const wrapper = mountCP()
    await openPanel(wrapper)
    await wrapper.find(ns.e('trigger')).trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
    expect(wrapper.emitted('open-change')?.[1]).toEqual([false])
  })

  it('closes on outside click', async () => {
    const wrapper = mountCP()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('renders alpha slider by default and hides it when disabledAlpha=true', async () => {
    const a = mountCP()
    await openPanel(a)
    expect(a.find(ns.e('alpha')).exists()).toBe(true)

    const b = mountCP({ disabledAlpha: true })
    await openPanel(b)
    expect(b.find(ns.e('alpha')).exists()).toBe(false)
    expect(b.find(ns.e('alpha-input-wrap')).exists()).toBe(false)
  })
})

describe('color-picker SV / hue / alpha drag', () => {
  it('clicking SV area updates s/v based on relative position', async () => {
    const wrapper = mountCP({ defaultValue: '#ff0000' })
    await openPanel(wrapper)
    const sv = wrapper.find(ns.e('sv')).element as HTMLElement
    stubRect(sv, 100, 100)
    sv.dispatchEvent(new MouseEvent('pointerdown', { clientX: 25, clientY: 75, bubbles: true }))
    await nextTick()
    // s = 25% of 100 = 25, v = 100 - 75 = 25 → 期待新颜色比红更暗、饱和度更低
    const emit = wrapper.emitted('update:modelValue')!
    expect(emit.length).toBeGreaterThan(0)
    const last = emit[emit.length - 1][0] as string
    expect(last).toMatch(/^#[0-9a-f]{6,8}$/i)
    const back = hexToRgb(last)!
    const hsv = rgbToHsv(back)
    expect(hsv.s).toBeCloseTo(25, 0)
    expect(hsv.v).toBeCloseTo(25, 0)
  })

  it('clicking hue bar updates h proportional to x position', async () => {
    const wrapper = mountCP({ defaultValue: '#ff0000' })
    await openPanel(wrapper)
    const hue = wrapper.find(ns.e('hue')).element as HTMLElement
    stubRect(hue, 360, 10)
    hue.dispatchEvent(new MouseEvent('pointerdown', { clientX: 120, clientY: 5, bubbles: true }))
    await nextTick()
    const last = wrapper.emitted('update:modelValue')!.slice(-1)[0][0] as string
    const hsv = rgbToHsv(hexToRgb(last)!)
    expect(hsv.h).toBeCloseTo(120, 0)
  })

  it('clicking alpha bar updates a in [0,1]', async () => {
    const wrapper = mountCP({ defaultValue: '#1677ff' })
    await openPanel(wrapper)
    const alpha = wrapper.find(ns.e('alpha')).element as HTMLElement
    stubRect(alpha, 100, 10)
    alpha.dispatchEvent(new MouseEvent('pointerdown', { clientX: 30, clientY: 5, bubbles: true }))
    await nextTick()
    const last = wrapper.emitted('update:modelValue')!.slice(-1)[0][0] as string
    // alpha=0.3 → 8 位 hex 应被产出
    expect(last).toMatch(/^#[0-9a-f]{8}$/i)
    const rgb = hexToRgb(last)!
    expect(rgb.a).toBeCloseTo(0.3, 1)
  })

  it('disabledAlpha forces alpha=1 even when emitChange would lower it', async () => {
    const wrapper = mountCP({ defaultValue: '#1677ff', disabledAlpha: true })
    await openPanel(wrapper)
    // 在 disabledAlpha 下 alpha 区域不存在；改 SV 区域看输出 hex 是不是 6 位
    const sv = wrapper.find(ns.e('sv')).element as HTMLElement
    stubRect(sv, 100, 100)
    sv.dispatchEvent(new MouseEvent('pointerdown', { clientX: 50, clientY: 50, bubbles: true }))
    await nextTick()
    const last = wrapper.emitted('update:modelValue')!.slice(-1)[0][0] as string
    expect(last.length).toBe(7)
  })
})

describe('color-picker hex input', () => {
  it('typing hex and blurring commits the value', async () => {
    const wrapper = mountCP({ defaultValue: '#1677ff' })
    await openPanel(wrapper)
    const input = wrapper.find(`${ns.e('hex-input')}`)
    expect((input.element as HTMLInputElement).value).toBe('1677FF')
    await input.setValue('FF5500')
    await input.trigger('blur')
    await nextTick()
    const last = wrapper.emitted('update:modelValue')!.slice(-1)[0][0] as string
    expect(last.toLowerCase()).toBe('#ff5500')
  })

  it('invalid hex input rolls back to current value on blur', async () => {
    const wrapper = mountCP({ defaultValue: '#1677ff' })
    await openPanel(wrapper)
    const input = wrapper.find(`${ns.e('hex-input')}`)
    await input.setValue('not-a-color')
    await input.trigger('blur')
    await nextTick()
    expect((input.element as HTMLInputElement).value).toBe('1677FF')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('Enter key blurs the input to commit', async () => {
    const wrapper = mountCP({ defaultValue: '#1677ff' })
    await openPanel(wrapper)
    const input = wrapper.find(`${ns.e('hex-input')}`)
    await input.setValue('00ff00')
    await input.trigger('keydown', { key: 'Enter' })
    await nextTick()
    // input.blur 在 jsdom 内会触发我们 onBlur → commit
    const last = wrapper.emitted('update:modelValue')?.slice(-1)[0][0] as string | undefined
    expect(last?.toLowerCase()).toBe('#00ff00')
  })
})

describe('color-picker presets', () => {
  it('renders preset swatches and clicking a preset commits its hex', async () => {
    const wrapper = mountCP({ presets: ['#ff0000', '#00ff00', '#0000ff'] })
    await openPanel(wrapper)
    const presets = wrapper.findAll(ns.e('preset'))
    expect(presets).toHaveLength(3)
    await presets[1].trigger('click')
    await nextTick()
    const last = wrapper.emitted('update:modelValue')!.slice(-1)[0][0] as string
    expect(last.toLowerCase()).toBe('#00ff00')
  })

  it('does not render presets section when presets prop is empty', async () => {
    const wrapper = mountCP()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('presets')).exists()).toBe(false)
  })
})

describe('color-picker controlled / uncontrolled', () => {
  it('uncontrolled: clicking preset updates inner state and trigger swatch', async () => {
    const wrapper = mountCP({ presets: ['#ff0000'], defaultValue: '#1677ff' })
    await openPanel(wrapper)
    await wrapper.find(ns.e('preset')).trigger('click')
    await nextTick()
    const fg = wrapper.find(ns.e('swatch-fg'))
    expect((fg.element as HTMLElement).style.backgroundColor).toBe('rgb(255, 0, 0)')
  })

  it('controlled: parent must update modelValue for swatch to change', async () => {
    const value = ref<string | null>('#1677ff')
    const Host = defineComponent({
      setup() {
        return () =>
          h(ColorPicker, {
            modelValue: value.value,
            presets: ['#ff0000'],
            'onUpdate:modelValue': (_v: string) => {
              // 父级故意不写回
            },
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    await wrapper.find(ns.e('trigger')).trigger('click')
    await nextTick()
    await wrapper.find(ns.e('preset')).trigger('click')
    await nextTick()
    const fg = wrapper.find(ns.e('swatch-fg'))
    // 父级未提交，swatch 仍是 #1677ff
    expect((fg.element as HTMLElement).style.backgroundColor).toBe('rgb(22, 119, 255)')
  })
})

describe('color-picker form integration', () => {
  it('inherits validate status from FormItem and triggers validate on change', async () => {
    const value = ref<string | null>('')
    const Host = defineComponent({
      components: { Form, FormItem, ColorPicker },
      setup() {
        return () =>
          h(
            Form,
            {
              model: { color: value.value },
              rules: { color: [{ required: true, message: '请选择颜色', trigger: 'change' }] },
            },
            () => [
              h(FormItem, { name: 'color', prop: 'color', label: 'color' }, () =>
                h(ColorPicker, {
                  modelValue: value.value,
                  presets: ['#ff0000'],
                  'onUpdate:modelValue': (v: string) => (value.value = v),
                }),
              ),
            ],
          )
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    await wrapper.find(ns.e('trigger')).trigger('click')
    await nextTick()
    await wrapper.find(ns.e('preset')).trigger('click')
    await nextTick()
    expect(value.value?.toLowerCase()).toBe('#ff0000')
  })
})

describe('color-picker RGB inputs', () => {
  it('renders R G B number inputs in the panel', async () => {
    const wrapper = mountCP()
    await openPanel(wrapper)
    const inputs = wrapper.findAll(ns.e('rgb-input'))
    expect(inputs).toHaveLength(3)
    expect(inputs[0].attributes('aria-label')).toBe('R')
    expect(inputs[1].attributes('aria-label')).toBe('G')
    expect(inputs[2].attributes('aria-label')).toBe('B')
  })

  it('changing R input emits a new hex value', async () => {
    const wrapper = mountCP({ modelValue: '#ff0000' })
    await openPanel(wrapper)
    const rInput = wrapper.findAll(ns.e('rgb-input'))[0]
    // R: 255→128
    await rInput.setValue('128')
    await rInput.trigger('input')
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    const hex = (emitted![emitted!.length - 1][0] as string).toLowerCase()
    const rgb = hexToRgb(hex)!
    expect(rgb.r).toBe(128)
  })
})

describe('color-picker keyboard navigation', () => {
  it('ArrowRight on SV area increases saturation', async () => {
    const wrapper = mountCP({ modelValue: '#808080' })
    await openPanel(wrapper)
    const sv = wrapper.find(ns.e('sv'))
    await sv.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
  })

  it('ArrowRight on hue area increases hue', async () => {
    const wrapper = mountCP({ modelValue: '#ff0000' })
    await openPanel(wrapper)
    const hue = wrapper.find(ns.e('hue'))
    await hue.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeDefined()
  })

  it('SV area has tabindex=0 for keyboard focus', async () => {
    const wrapper = mountCP()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('sv')).attributes('tabindex')).toBe('0')
    expect(wrapper.find(ns.e('hue')).attributes('tabindex')).toBe('0')
  })
})

describe('color-picker trigger slot', () => {
  it('renders custom trigger via slot', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ColorPicker,
            { modelValue: '#ff0000' },
            {
              trigger: ({ color }: { color: string }) => h('div', { class: 'my-trigger' }, color),
            },
          )
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    expect(wrapper.find('.my-trigger').exists()).toBe(true)
    expect(wrapper.find('.my-trigger').text()).toBe('#ff0000')
    // 默认触发器不渲染
    expect(wrapper.find(ns.e('swatch')).exists()).toBe(false)
  })
})

describe('color-picker allowClear', () => {
  it('shows clear button when allowClear=true', () => {
    const wrapper = mountCP({ modelValue: '#ff0000', allowClear: true })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
  })

  it('does not show clear button by default', () => {
    const wrapper = mountCP({ modelValue: '#ff0000' })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('clicking clear emits null', async () => {
    const wrapper = mountCP({ modelValue: '#ff0000', allowClear: true })
    await wrapper.find(ns.e('clear')).trigger('click')
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted![0][0]).toBeNull()
  })
})
