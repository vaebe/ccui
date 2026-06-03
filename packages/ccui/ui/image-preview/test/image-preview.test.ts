import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { ImagePreview } from '../index'

const ns = useNamespace('image-preview', true)
const cls = useNamespace('image-preview')

const items = [
  { src: 'a.jpg', alt: 'A' },
  { src: 'b.jpg', alt: 'B' },
  { src: 'c.jpg', alt: 'C' },
]

describe('image-preview', () => {
  describe('items 模式', () => {
    it('挂载基础 DOM + N 个缩略图', () => {
      const wrapper = mount(ImagePreview, { props: { items } })
      expect(wrapper.find(ns.b()).exists()).toBe(true)
      expect(wrapper.findAll(ns.e('thumb')).length).toBe(3)
    })

    it('items 接 string[]', () => {
      const wrapper = mount(ImagePreview, { props: { items: ['x.jpg', 'y.jpg'] } })
      expect(wrapper.findAll(ns.e('thumb')).length).toBe(2)
      expect((wrapper.findAll(ns.e('thumb'))[0].element as HTMLImageElement).src).toContain('x.jpg')
    })

    it('点击缩略图打开 mask + 显示当前图', async () => {
      const wrapper = mount(ImagePreview, { props: { items }, attachTo: document.body })
      await wrapper.findAll(ns.e('thumb'))[1].trigger('click')
      await nextTick()
      const mask = document.querySelector(`.${cls.b().replace('.', '')}__mask`)
      expect(mask).toBeTruthy()
      const img = mask?.querySelector(`.${cls.b().replace('.', '')}__img`) as HTMLImageElement | null
      expect(img?.src).toContain('b.jpg')
      wrapper.unmount()
    })

    it('点击 mask 关闭预览', async () => {
      const wrapper = mount(ImagePreview, { props: { items }, attachTo: document.body })
      await wrapper.findAll(ns.e('thumb'))[0].trigger('click')
      await nextTick()
      const mask = document.querySelector(`.${cls.b().replace('.', '')}__mask`) as HTMLElement | null
      mask?.click()
      await nextTick()
      const stillThere = document.querySelector(`.${cls.b().replace('.', '')}__img`)
      expect(stillThere).toBeNull()
      wrapper.unmount()
    })

    it('toolbar 的 prev / next 切换当前图', async () => {
      const wrapper = mount(ImagePreview, { props: { items }, attachTo: document.body })
      await wrapper.findAll(ns.e('thumb'))[0].trigger('click')
      await nextTick()
      const prefix = cls.b().replace('.', '')
      const nextBtn = document.querySelector(`.${prefix}__toolbar [aria-label="next"]`) as HTMLButtonElement
      nextBtn.click()
      await nextTick()
      let img = document.querySelector(`.${prefix}__img`) as HTMLImageElement
      expect(img.src).toContain('b.jpg')
      const prevBtn = document.querySelector(`.${prefix}__toolbar [aria-label="prev"]`) as HTMLButtonElement
      prevBtn.click()
      await nextTick()
      img = document.querySelector(`.${prefix}__img`) as HTMLImageElement
      expect(img.src).toContain('a.jpg')
      wrapper.unmount()
    })

    it('next 在末尾时循环到首张', async () => {
      const wrapper = mount(ImagePreview, { props: { items }, attachTo: document.body })
      await wrapper.findAll(ns.e('thumb'))[2].trigger('click')
      await nextTick()
      const prefix = cls.b().replace('.', '')
      const nextBtn = document.querySelector(`.${prefix}__toolbar [aria-label="next"]`) as HTMLButtonElement
      nextBtn.click()
      await nextTick()
      const img = document.querySelector(`.${prefix}__img`) as HTMLImageElement
      expect(img.src).toContain('a.jpg')
      wrapper.unmount()
    })

    it('counter 显示 current / total', async () => {
      const wrapper = mount(ImagePreview, { props: { items }, attachTo: document.body })
      await wrapper.findAll(ns.e('thumb'))[1].trigger('click')
      await nextTick()
      const prefix = cls.b().replace('.', '')
      const counter = document.querySelector(`.${prefix}__counter`)
      expect(counter?.textContent).toBe('2 / 3')
      wrapper.unmount()
    })

    it('单张时不渲染 counter', async () => {
      const wrapper = mount(ImagePreview, { props: { items: ['solo.jpg'] }, attachTo: document.body })
      await wrapper.findAll(ns.e('thumb'))[0].trigger('click')
      await nextTick()
      const prefix = cls.b().replace('.', '')
      const counter = document.querySelector(`.${prefix}__counter`)
      expect(counter).toBeNull()
      wrapper.unmount()
    })

    it('keyboard ArrowRight / ArrowLeft / Escape', async () => {
      const wrapper = mount(ImagePreview, { props: { items }, attachTo: document.body })
      await wrapper.findAll(ns.e('thumb'))[0].trigger('click')
      await nextTick()
      const prefix = cls.b().replace('.', '')

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await nextTick()
      let img = document.querySelector(`.${prefix}__img`) as HTMLImageElement
      expect(img.src).toContain('b.jpg')

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await nextTick()
      img = document.querySelector(`.${prefix}__img`) as HTMLImageElement
      expect(img.src).toContain('a.jpg')

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await nextTick()
      const stillThere = document.querySelector(`.${prefix}__img`)
      expect(stillThere).toBeNull()
      wrapper.unmount()
    })

    it('zoom 按钮改变 scale transform', async () => {
      const wrapper = mount(ImagePreview, { props: { items }, attachTo: document.body })
      await wrapper.findAll(ns.e('thumb'))[0].trigger('click')
      await nextTick()
      const prefix = cls.b().replace('.', '')
      const zoomIn = document.querySelector(`.${prefix}__toolbar [aria-label="zoom in"]`) as HTMLButtonElement
      zoomIn.click()
      await nextTick()
      let img = document.querySelector(`.${prefix}__img`) as HTMLImageElement
      expect(img.style.transform).toContain('scale(1.25')
      const reset = document.querySelector(`.${prefix}__toolbar [aria-label="reset"]`) as HTMLButtonElement
      reset.click()
      await nextTick()
      img = document.querySelector(`.${prefix}__img`) as HTMLImageElement
      expect(img.style.transform).toBe('scale(1)')
      wrapper.unmount()
    })
  })

  describe('受控 preview', () => {
    it('preview.visible=true 立即显示当前图', async () => {
      const wrapper = mount(ImagePreview, {
        props: { items, preview: { visible: true, current: 1 } },
        attachTo: document.body,
      })
      await nextTick()
      const prefix = cls.b().replace('.', '')
      const img = document.querySelector(`.${prefix}__img`) as HTMLImageElement
      expect(img.src).toContain('b.jpg')
      wrapper.unmount()
    })

    it('next 触发 update:preview 与 change 事件', async () => {
      const wrapper = mount(ImagePreview, {
        props: { items, preview: { visible: true, current: 0 } },
        attachTo: document.body,
      })
      await nextTick()
      const prefix = cls.b().replace('.', '')
      const nextBtn = document.querySelector(`.${prefix}__toolbar [aria-label="next"]`) as HTMLButtonElement
      nextBtn.click()
      await nextTick()
      expect(wrapper.emitted('change')?.[0]).toEqual([1])
      const updates = wrapper.emitted('update:preview')
      expect(updates).toBeTruthy()
      const lastUpdate = updates![updates!.length - 1][0] as { visible: boolean; current: number }
      expect(lastUpdate.current).toBe(1)
      wrapper.unmount()
    })

    it('close 触发 visible-change(false)', async () => {
      const wrapper = mount(ImagePreview, {
        props: { items, preview: { visible: true, current: 0 } },
        attachTo: document.body,
      })
      await nextTick()
      const prefix = cls.b().replace('.', '')
      const closeBtn = document.querySelector(`.${prefix}__toolbar [aria-label="close"]`) as HTMLButtonElement
      closeBtn.click()
      await nextTick()
      expect(wrapper.emitted('visible-change')?.[0]).toEqual([false])
      wrapper.unmount()
    })
  })

  describe('默认 slot 模式', () => {
    it('未传 items 时不渲染缩略图，但渲染默认 slot', () => {
      const wrapper = mount(ImagePreview, {
        slots: { default: '<div class="my-content">自定义</div>' },
      })
      expect(wrapper.find('.my-content').exists()).toBe(true)
      expect(wrapper.findAll(ns.e('thumb')).length).toBe(0)
    })
  })
})
