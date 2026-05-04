import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Image } from '../index'

const ns = useNamespace('image', true)

describe('image', () => {
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
})
