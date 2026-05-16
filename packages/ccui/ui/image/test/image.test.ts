import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ConfigProvider } from '../../config-provider'
import enUS from '../../locale/en-US'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Image } from '../index'

const ns = useNamespace('image', true)

describe('image', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('renders placeholder while loading', () => {
    const wrapper = mount(Image, {
      props: { src: '/foo.png' },
    })
    expect(wrapper.find(ns.e('placeholder')).exists()).toBe(true)
  })

  it('emits load event when image loads', async () => {
    const wrapper = mount(Image, {
      props: { src: '/foo.png' },
    })
    const img = wrapper.find('img')
    await img.trigger('load')
    expect(wrapper.emitted('load')).toBeTruthy()
  })

  it('shows error fallback on error', async () => {
    const wrapper = mount(Image, {
      props: { src: '/bad.png', fallback: '/fallback.png' },
    })
    await wrapper.find('img').trigger('error')
    await nextTick()
    expect(wrapper.find(ns.e('error')).exists()).toBe(true)
    const fallbackImg = wrapper.find(ns.e('error')).find('img')
    expect(fallbackImg.attributes('src')).toBe('/fallback.png')
  })

  it('applies width and height styles', () => {
    const wrapper = mount(Image, {
      props: { src: '/foo.png', width: 100, height: '50px' },
    })
    const style = wrapper.find(ns.b()).attributes('style') ?? ''
    expect(style).toContain('width: 100px')
    expect(style).toContain('height: 50px')
  })

  it('emits click on image click', async () => {
    const wrapper = mount(Image, {
      props: { src: '/foo.png' },
    })
    const img = wrapper.find('img')
    await img.trigger('load')
    await img.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('opens preview after loaded image click and supports toolbar actions', async () => {
    const wrapper = mount(Image, {
      props: { src: '/foo.png', preview: true, alt: 'preview image' },
      attachTo: document.body,
    })

    const img = wrapper.find('img')
    await img.trigger('load')
    await img.trigger('click')
    await nextTick()

    const mask = document.body.querySelector(ns.e('preview-mask')) as HTMLElement | null
    const previewImg = document.body.querySelector(ns.e('preview-img')) as HTMLElement | null
    expect(mask).not.toBeNull()
    expect(previewImg?.getAttribute('src')).toBe('/foo.png')
    expect(previewImg?.getAttribute('style')).toContain('scale(1)')

    const zoomIn = document.body.querySelector('button[aria-label="zoom in"]') as HTMLButtonElement
    zoomIn.click()
    await nextTick()
    expect(previewImg?.getAttribute('style')).toContain('scale(1.25)')

    const reset = document.body.querySelector('button[aria-label="reset"]') as HTMLButtonElement
    reset.click()
    await nextTick()
    expect(previewImg?.getAttribute('style')).toContain('scale(1)')

    mask?.click()
    await nextTick()
    expect(document.body.querySelector(ns.e('preview-mask'))).toBeNull()
  })

  it('renders custom placeholder and error slots', async () => {
    const wrapper = mount(Image, {
      props: { src: '/bad.png' },
      slots: {
        placeholder: '<span class="custom-placeholder">loading</span>',
        error: '<span class="custom-error">failed</span>',
      },
    })

    expect(wrapper.find('.custom-placeholder').text()).toBe('loading')
    await wrapper.find('img').trigger('error')
    await nextTick()
    expect(wrapper.find('.custom-error').text()).toBe('failed')
  })

  it('loads lazy image when it intersects', async () => {
    let callback: IntersectionObserverCallback | null = null
    const observe = vi.fn()
    const disconnect = vi.fn()
    class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb
      }

      observe = observe
      disconnect = disconnect
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

    const wrapper = mount(Image, {
      props: { src: '/lazy.png', lazy: true, rootMargin: '20px' },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(observe).toHaveBeenCalled()

    ;(callback as unknown as IntersectionObserverCallback)(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    await nextTick()

    expect(wrapper.find('img').attributes('src')).toBe('/lazy.png')
    expect(disconnect).toHaveBeenCalled()
  })

  it('loads lazy image immediately when IntersectionObserver is unavailable', async () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const wrapper = mount(Image, {
      props: { src: '/fallback-lazy.png', lazy: true },
    })
    await nextTick()

    expect(wrapper.find('img').attributes('src')).toBe('/fallback-lazy.png')
  })

  it('resets loading state and src when src prop changes', async () => {
    const wrapper = mount(Image, {
      props: { src: '/first.png' },
    })

    await wrapper.find('img').trigger('load')
    expect(wrapper.find(ns.e('placeholder')).exists()).toBe(false)

    await wrapper.setProps({ src: '/second.png' })
    await nextTick()

    expect(wrapper.find(ns.e('placeholder')).exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('/second.png')
  })

  it('does not open preview before image is loaded', async () => {
    const wrapper = mount(Image, {
      props: { src: '/foo.png', preview: true },
      attachTo: document.body,
    })

    await wrapper.find('img').trigger('click')
    await nextTick()

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(document.body.querySelector(ns.e('preview-mask'))).toBeNull()
  })

  it('renders zhCN loading/error text by default', async () => {
    const wrapper = mount(Image, {
      props: { src: '/foo.png' },
    })
    expect(wrapper.find(ns.e('loading')).text()).toBe('加载中')

    await wrapper.find('img').trigger('error')
    await nextTick()
    expect(wrapper.find(ns.e('error')).text()).toBe('加载失败')
  })

  it('switches to enUS loading/error text via ConfigProvider', async () => {
    const wrapper = mount({
      components: { ConfigProvider, Image },
      data() {
        return { enUS }
      },
      template: `
        <ConfigProvider :locale="enUS">
          <Image src="/foo.png" />
        </ConfigProvider>
      `,
    })
    expect(wrapper.find(ns.e('loading')).text()).toBe('Loading')

    await wrapper.find('img').trigger('error')
    await nextTick()
    expect(wrapper.find(ns.e('error')).text()).toBe('Failed to load')
  })

  it('clamps preview zoom out and closes from toolbar button', async () => {
    const wrapper = mount(Image, {
      props: { src: '/foo.png', preview: true },
      attachTo: document.body,
    })

    await wrapper.find('img').trigger('load')
    await wrapper.find('img').trigger('click')
    await nextTick()

    const zoomOut = document.body.querySelector('button[aria-label="zoom out"]') as HTMLButtonElement
    const close = document.body.querySelector('button[aria-label="close"]') as HTMLButtonElement
    const previewImg = document.body.querySelector(ns.e('preview-img')) as HTMLElement

    for (let i = 0; i < 10; i++) {
      zoomOut.click()
      await nextTick()
    }
    expect(previewImg.getAttribute('style')).toContain('scale(0.25)')

    close.click()
    await nextTick()
    expect(document.body.querySelector(ns.e('preview-mask'))).toBeNull()
  })

  describe('M-A2 classNames / styles 钩子', () => {
    it('classNames.root 注入到根节点', () => {
      const wrapper = mount(Image, {
        props: { src: '/foo.png', classNames: { root: 'my-root' } },
      })
      expect(wrapper.find('.ccui-image').classes()).toContain('my-root')
    })

    it('styles.root 注入到根节点 style', () => {
      const wrapper = mount(Image, {
        props: { src: '/foo.png', styles: { root: { color: 'red' } } },
      })
      expect(wrapper.find('.ccui-image').attributes('style') || '').toContain('red')
    })
  })
})
