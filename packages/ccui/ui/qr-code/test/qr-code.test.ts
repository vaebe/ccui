import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { nextTick } from 'vue'
import { QRCode } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('qr-code', true)
const wrappers: VueWrapper[] = []

type MountSlots = NonNullable<Parameters<typeof mount>[1]>['slots']

function mountQR(props: Record<string, unknown> = {}, slots?: MountSlots) {
  const wrapper = mount(QRCode, {
    props: { value: 'https://example.com', ...props },
    slots,
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('qr-code rendering', () => {
  it('renders an svg with a path child for the dark modules', () => {
    const wrapper = mountQR()
    const svg = wrapper.find(ns.e('svg'))
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toMatch(/^0 0 \d+ \d+$/)
    const path = svg.find('path')
    expect(path.exists()).toBe(true)
    // path data 必须非空（否则二维码没渲染出来）
    expect(path.attributes('d')!.length).toBeGreaterThan(10)
  })

  it('viewBox modules count matches the requested error level', async () => {
    // 同一段较短的内容，errorLevel 越高，模块数越多（因为容错码字增多）
    const lo = mountQR({ value: 'hi', errorLevel: 'L' })
    const hi = mountQR({ value: 'hi', errorLevel: 'H' })
    const loCount = Number(lo.find(ns.e('svg')).attributes('viewBox')!.split(' ')[2])
    const hiCount = Number(hi.find(ns.e('svg')).attributes('viewBox')!.split(' ')[2])
    expect(loCount).toBeLessThanOrEqual(hiCount)
    // 都至少是 21（version 1）
    expect(loCount).toBeGreaterThanOrEqual(21)
  })

  it('respects size, color, bgColor', () => {
    const wrapper = mountQR({ size: 200, color: '#ff5500', bgColor: '#fafafa' })
    const root = wrapper.find(ns.b())
    expect((root.element as HTMLElement).style.width).toBe('200px')
    expect((root.element as HTMLElement).style.height).toBe('200px')
    expect((root.element as HTMLElement).style.backgroundColor).toBe('rgb(250, 250, 250)')
    const svg = wrapper.find(ns.e('svg'))
    expect(svg.attributes('width')).toBe('200')
    const path = svg.find('path')
    expect(path.attributes('fill')).toBe('#ff5500')
  })

  it('toggles bordered modifier class', async () => {
    const wrapper = mountQR()
    expect(wrapper.find(ns.b()).classes()).toContain('is-bordered')
    await wrapper.setProps({ value: 'https://example.com', bordered: false })
    expect(wrapper.find(ns.b()).classes()).not.toContain('is-bordered')
  })

  it('exposes value via aria-label and role=img', () => {
    const wrapper = mountQR({ value: 'https://example.com/path?q=1' })
    const root = wrapper.find(ns.b())
    expect(root.attributes('role')).toBe('img')
    expect(root.attributes('aria-label')).toBe('https://example.com/path?q=1')
  })
})

describe('qr-code icon embedding', () => {
  it('renders nothing in icon slot when no icon prop given', () => {
    const wrapper = mountQR()
    expect(wrapper.find(ns.e('icon')).exists()).toBe(false)
  })

  it('renders centered icon img with given src and clamps to 30% of size', () => {
    const wrapper = mountQR({ icon: 'data:image/png;base64,XYZ', iconSize: 80, size: 200 })
    const icon = wrapper.find(ns.e('icon'))
    expect(icon.exists()).toBe(true)
    const img = wrapper.find(ns.e('icon-img'))
    expect(img.attributes('src')).toBe('data:image/png;base64,XYZ')
    // size=200 → max 30% = 60，requested 80 → 应被截到 60
    expect((icon.element as HTMLElement).style.width).toBe('60px')
    expect((icon.element as HTMLElement).style.height).toBe('60px')
  })

  it('uses iconSize directly when below 30% cap', () => {
    const wrapper = mountQR({ icon: '/logo.png', iconSize: 30, size: 200 })
    const icon = wrapper.find(ns.e('icon'))
    expect((icon.element as HTMLElement).style.width).toBe('30px')
  })
})

describe('qr-code status overlay', () => {
  it('does not render mask when status=active', () => {
    const wrapper = mountQR()
    expect(wrapper.find(ns.e('mask')).exists()).toBe(false)
  })

  it('renders loading spinner for status=loading', () => {
    const wrapper = mountQR({ status: 'loading' })
    expect(wrapper.find(ns.e('mask')).exists()).toBe(true)
    expect(wrapper.find(ns.e('spinner')).exists()).toBe(true)
    expect(wrapper.find(ns.b()).classes()).toContain('ccui-qr-code__status--loading')
  })

  it('renders 已扫描 text for status=scanned', () => {
    const wrapper = mountQR({ status: 'scanned' })
    const mask = wrapper.find(ns.e('mask'))
    expect(mask.exists()).toBe(true)
    expect(mask.text()).toContain('已扫描')
    expect(wrapper.find(ns.e('refresh')).exists()).toBe(false)
  })

  it('renders refresh button for status=expired and emits refresh on click', async () => {
    const wrapper = mountQR({ status: 'expired' })
    const mask = wrapper.find(ns.e('mask'))
    expect(mask.text()).toContain('二维码已过期')
    const refresh = wrapper.find(ns.e('refresh'))
    expect(refresh.exists()).toBe(true)
    expect(refresh.text()).toBe('点击刷新')
    await refresh.trigger('click')
    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })

  it('respects custom refreshText', () => {
    const wrapper = mountQR({ status: 'expired', refreshText: '重新生成' })
    expect(wrapper.find(ns.e('refresh')).text()).toBe('重新生成')
  })

  it('renders custom statusRender slot when provided', () => {
    const wrapper = mountQR(
      { status: 'loading' },
      {
        statusRender: ({ status }: { status: string }) => `slot:${status}`,
      },
    )
    const mask = wrapper.find(ns.e('mask'))
    expect(mask.text()).toBe('slot:loading')
    // 自定义 slot 时不再渲染默认 spinner
    expect(wrapper.find(ns.e('spinner')).exists()).toBe(false)
  })
})

describe('qr-code reactivity', () => {
  it('rebuilds matrix when value changes', async () => {
    const wrapper = mountQR({ value: 'a' })
    const before = wrapper.find('path').attributes('d')!
    await wrapper.setProps({ value: 'a much longer string for QR encoding' })
    await nextTick()
    const after = wrapper.find('path').attributes('d')!
    expect(after).not.toBe(before)
    expect(after.length).toBeGreaterThan(before.length)
  })

  it('rebuilds matrix when errorLevel changes', async () => {
    const wrapper = mountQR({ value: 'hi', errorLevel: 'L' })
    const before = wrapper.find('path').attributes('d')!
    await wrapper.setProps({ value: 'hi', errorLevel: 'H' })
    await nextTick()
    const after = wrapper.find('path').attributes('d')!
    expect(after).not.toBe(before)
  })
})

describe('qr-code dotRadius', () => {
  it('uses geometricPrecision shapeRendering for dotRadius>0', () => {
    const w0 = mountQR({ value: 'test', dotRadius: 0 })
    // dotRadius=0 默认 crispEdges
    const sr0 =
      w0.find(ns.e('svg')).element.getAttribute('shape-rendering') ??
      (w0.find(ns.e('svg')).element as any).getAttribute('shapeRendering')
    expect(sr0).toBe('crispEdges')

    const w1 = mountQR({ value: 'test', dotRadius: 0.3 })
    const sr1 =
      w1.find(ns.e('svg')).element.getAttribute('shape-rendering') ??
      (w1.find(ns.e('svg')).element as any).getAttribute('shapeRendering')
    expect(sr1).toBe('geometricPrecision')
  })

  it('renders arc commands in path when dotRadius > 0', () => {
    const wrapper = mountQR({ value: 'A', dotRadius: 0.25 })
    const d = wrapper.find('path').attributes('d')!
    // 圆角路径包含 arc 'a' 命令
    expect(d).toContain('a')
  })

  it('renders only straight lines when dotRadius=0', () => {
    const wrapper = mountQR({ value: 'A', dotRadius: 0 })
    const d = wrapper.find('path').attributes('d')!
    // 方形路径不含 arc 'a' 命令
    expect(d).not.toMatch(/a\d/)
  })
})

describe('qr-code gradient', () => {
  it('renders linearGradient defs when gradient prop is set', () => {
    const wrapper = mountQR({
      value: 'test',
      gradient: { from: '#ff0000', to: '#0000ff' },
    })
    expect(wrapper.find('defs').exists()).toBe(true)
    expect(wrapper.find('linearGradient').exists()).toBe(true)
    const stops = wrapper.findAll('stop')
    expect(stops).toHaveLength(2)
    expect(stops[0].attributes('stop-color')).toBe('#ff0000')
    expect(stops[1].attributes('stop-color')).toBe('#0000ff')
  })

  it('applies gradient url as path fill', () => {
    const wrapper = mountQR({
      value: 'test',
      gradient: { from: '#ff0000', to: '#0000ff' },
    })
    expect(wrapper.find('path').attributes('fill')).toContain('url(#')
  })

  it('does not render defs when gradient is not set', () => {
    const wrapper = mountQR({ value: 'test' })
    expect(wrapper.find('defs').exists()).toBe(false)
  })

  it('supports direction prop', () => {
    const wrapper = mountQR({
      value: 'test',
      gradient: { from: '#ff0000', to: '#0000ff', direction: 'to bottom' },
    })
    const lg = wrapper.find('linearGradient')
    expect(lg.attributes('y2')).toBe('100%')
    expect(lg.attributes('x2')).toBe('0%')
  })
})

describe('qr-code toDataURL expose', () => {
  it('exposes toDataURL method', () => {
    const wrapper = mount(QRCode, { props: { value: 'test' } })
    wrappers.push(wrapper)
    const exposed = (wrapper.vm as any).$.exposed
    expect(typeof exposed.toDataURL).toBe('function')
  })
})

describe('qr-code edge cases', () => {
  it('renders empty svg when value is empty string', () => {
    const wrapper = mountQR({ value: '' })
    const svg = wrapper.find(ns.e('svg'))
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 1 1')
    expect(svg.find('path').exists()).toBe(false)
  })
})
