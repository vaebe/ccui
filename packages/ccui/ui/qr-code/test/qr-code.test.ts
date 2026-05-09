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

describe('qr-code edge cases', () => {
  it('renders empty svg when value is empty string', () => {
    const wrapper = mountQR({ value: '' })
    const svg = wrapper.find(ns.e('svg'))
    expect(svg.exists()).toBe(true)
    // 空 value 时 viewBox 是占位的 0 0 1 1，没有 path
    expect(svg.attributes('viewBox')).toBe('0 0 1 1')
    expect(svg.find('path').exists()).toBe(false)
  })
})
