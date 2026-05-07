import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Watermark } from '../index'

const ns = useNamespace('watermark', true)

async function waitWatermarkRender() {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
}

describe('watermark', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders default container with slot content', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'demo' },
      slots: { default: '<p class="inside">Hello</p>' },
    })
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.find('.inside').text()).toBe('Hello')
  })

  it('appends a watermark layer node', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'mark' },
    })
    await waitWatermarkRender()
    const wm = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement | null
    expect(wm).not.toBeNull()
    // canvas may not be available in jsdom — fallback style still has pointer-events
    expect(wm?.getAttribute('style')).toContain('pointer-events')
  })

  it('keeps watermark when content prop changes', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'first' },
    })
    await waitWatermarkRender()
    await wrapper.setProps({ content: 'second' })
    await waitWatermarkRender()
    const wm = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement | null
    expect(wm).not.toBeNull()
  })

  it('accepts content as string array', async () => {
    const wrapper = mount(Watermark, {
      props: { content: ['line1', 'line2'] },
    })
    await waitWatermarkRender()
    expect(wrapper.element.querySelector('[data-ccui-watermark]')).not.toBeNull()
  })

  it('respects custom rotate / zIndex / gap props', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'demo', rotate: 0, zIndex: 100, gap: [50, 50] },
    })
    await waitWatermarkRender()
    const wm = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement | null
    expect(wm?.getAttribute('style')).toContain('z-index: 100')
  })

  it('rebuilds watermark when its node is removed (MutationObserver)', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'guard' },
      attachTo: document.body,
    })
    await waitWatermarkRender()
    const first = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement
    expect(first).not.toBeNull()
    first.remove()
    await new Promise((r) => setTimeout(r, 0))
    await waitWatermarkRender()
    const after = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement | null
    expect(after).not.toBeNull()
    wrapper.unmount()
  })

  it('cleans up watermark node on unmount', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'bye' },
      attachTo: document.body,
    })
    await waitWatermarkRender()
    expect(document.body.querySelector('[data-ccui-watermark]')).not.toBeNull()
    wrapper.unmount()
    expect(document.body.querySelector('[data-ccui-watermark]')).toBeNull()
  })

  it('draws text watermark on canvas with resolved font options', async () => {
    const translate = vi.fn()
    const rotate = vi.fn()
    const scale = vi.fn()
    const fillText = vi.fn()
    const drawImage = vi.fn()
    const ctx = {
      translate,
      rotate,
      scale,
      fillText,
      drawImage,
    } as unknown as CanvasRenderingContext2D
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,watermark')

    const wrapper = mount(Watermark, {
      props: {
        content: ['first', 'second'],
        font: { color: 'red', fontSize: 20, fontWeight: 700 },
        width: 120,
        height: 80,
        rotate: 15,
        offset: [4, 8],
      },
    })
    await waitWatermarkRender()

    const wm = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement | null
    expect(fillText).toHaveBeenCalledTimes(2)
    expect(wm?.getAttribute('style')).toContain("background-image: url('data:image/png;base64,watermark')")
    expect(wm?.getAttribute('style')).toContain('background-position: 4px 8px')
  })

  it('falls back to text when watermark image fails to load', async () => {
    const translate = vi.fn()
    const rotate = vi.fn()
    const scale = vi.fn()
    const fillText = vi.fn()
    const drawImage = vi.fn()
    const ctx = {
      translate,
      rotate,
      scale,
      fillText,
      drawImage,
    } as unknown as CanvasRenderingContext2D
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,error')

    class ErrorImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      crossOrigin = ''

      set src(_value: string) {
        this.onerror?.()
      }
    }
    vi.stubGlobal('Image', ErrorImage)

    mount(Watermark, {
      props: { image: '/bad.png', content: 'fallback text' },
    })
    await waitWatermarkRender()

    expect(drawImage).not.toHaveBeenCalled()
    expect(fillText).toHaveBeenCalledWith('fallback text', 60, 32)
  })
})
