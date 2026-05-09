import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { Carousel } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('carousel', true)
const wrappers: VueWrapper[] = []

interface MountOptions {
  props?: Record<string, unknown>
  slides?: number
}

function mountCarousel(opts: MountOptions = {}) {
  const slides = opts.slides ?? 3
  const Host = defineComponent({
    components: { Carousel },
    props: ['outer'],
    setup(_, { attrs }) {
      return () =>
        h(
          Carousel,
          { ...(attrs as Record<string, unknown>) },
          {
            default: () =>
              Array.from({ length: slides }).map((_, i) => h('div', { class: `slide-${i}`, key: i }, `slide ${i}`)),
          },
        )
    },
  })
  const wrapper = mount(Host, { props: opts.props ?? {}, attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('carousel rendering', () => {
  it('renders all slides into a single track', () => {
    const wrapper = mountCarousel({ slides: 4 })
    expect(wrapper.findAll(ns.e('slide'))).toHaveLength(4)
  })

  it('marks the default first slide as active', () => {
    const wrapper = mountCarousel()
    const slides = wrapper.findAll(ns.e('slide'))
    expect(slides[0].classes()).toContain('is-active')
    expect(slides[1].classes()).not.toContain('is-active')
  })

  it('respects defaultActive', () => {
    const wrapper = mountCarousel({ props: { defaultActive: 2 } })
    const slides = wrapper.findAll(ns.e('slide'))
    expect(slides[2].classes()).toContain('is-active')
  })

  it('renders dots by default and hides them when dots=false', async () => {
    const wrapper = mountCarousel()
    expect(wrapper.find(ns.e('dots')).exists()).toBe(true)
    expect(wrapper.findAll(ns.e('dot'))).toHaveLength(3)

    const wrapper2 = mountCarousel({ props: { dots: false } })
    expect(wrapper2.find(ns.e('dots')).exists()).toBe(false)
  })

  it('applies dotPosition modifier to dots wrapper', () => {
    const wrapper = mountCarousel({ props: { dotPosition: 'left' } })
    expect(wrapper.find(ns.e('dots')).classes()).toContain('ccui-carousel__dots--left')
  })

  it('omits arrows by default and renders prev/next when arrows=true', () => {
    const wrapper = mountCarousel()
    expect(wrapper.findAll(ns.e('arrow'))).toHaveLength(0)
    const wrapper2 = mountCarousel({ props: { arrows: true } })
    const arrows = wrapper2.findAll(ns.e('arrow'))
    expect(arrows).toHaveLength(2)
    expect(arrows[0].classes()).toContain('ccui-carousel__arrow--prev')
    expect(arrows[1].classes()).toContain('ccui-carousel__arrow--next')
  })

  it('renders fade effect with opacity styles', () => {
    const wrapper = mountCarousel({ props: { effect: 'fade' } })
    const slides = wrapper.findAll(ns.e('slide'))
    expect((slides[0].element as HTMLElement).style.opacity).toBe('1')
    expect((slides[1].element as HTMLElement).style.opacity).toBe('0')
    expect(wrapper.find(`${ns.e('track')}--fade`).exists()).toBe(true)
  })
})

describe('carousel dot click and emits', () => {
  it('clicking a dot emits update:modelValue and switches active slide (uncontrolled)', async () => {
    const wrapper = mountCarousel()
    await wrapper.findAll(`${ns.e('dot')} button`)[2].trigger('click')
    await nextTick()
    expect(wrapper.findComponent(Carousel).emitted('update:modelValue')?.[0]).toEqual([2])
    const change = wrapper.findComponent(Carousel).emitted('change')?.[0]
    expect(change).toEqual([2, 0])
    const slides = wrapper.findAll(ns.e('slide'))
    expect(slides[2].classes()).toContain('is-active')
  })

  it('does not emit when target equals current', async () => {
    const wrapper = mountCarousel()
    await wrapper.findAll(`${ns.e('dot')} button`)[0].trigger('click')
    await nextTick()
    expect(wrapper.findComponent(Carousel).emitted('change')).toBeUndefined()
  })

  it('respects controlled modelValue and does not change inner state', async () => {
    const value = ref(1)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Carousel,
            {
              modelValue: value.value,
              'onUpdate:modelValue': (_next: number) => {
                // 故意不更新 value，验证父级未同步时组件保持 props.modelValue
              },
            },
            {
              default: () => [0, 1, 2].map((i) => h('div', { key: i }, String(i))),
            },
          )
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')

    await wrapper.findAll(`${ns.e('dot')} button`)[2].trigger('click')
    await nextTick()
    // 父级未提交，仍停留在 modelValue=1
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).not.toContain('is-active')
  })
})

describe('carousel arrows', () => {
  it('next button advances active index by 1', async () => {
    const wrapper = mountCarousel({ props: { arrows: true } })
    await wrapper.findAll(ns.e('arrow'))[1].trigger('click')
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')
  })

  it('prev button on first slide wraps to last when infinite=true', async () => {
    const wrapper = mountCarousel({ props: { arrows: true } })
    await wrapper.findAll(ns.e('arrow'))[0].trigger('click')
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).toContain('is-active')
  })

  it('prev button on first slide stays put when infinite=false', async () => {
    const wrapper = mountCarousel({ props: { arrows: true, infinite: false } })
    await wrapper.findAll(ns.e('arrow'))[0].trigger('click')
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
    expect(wrapper.findComponent(Carousel).emitted('change')).toBeUndefined()
  })

  it('next button on last slide stays put when infinite=false', async () => {
    const wrapper = mountCarousel({ props: { arrows: true, infinite: false, defaultActive: 2 } })
    await wrapper.findAll(ns.e('arrow'))[1].trigger('click')
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).toContain('is-active')
    expect(wrapper.findComponent(Carousel).emitted('change')).toBeUndefined()
  })
})

describe('carousel autoplay', () => {
  it('advances to the next slide every autoplaySpeed ms', async () => {
    const wrapper = mountCarousel({ props: { autoplay: true, autoplaySpeed: 1000 } })
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).toContain('is-active')
    vi.advanceTimersByTime(1000)
    await nextTick()
    // infinite=true：从最后一帧 wrap 回 0
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
  })

  it('does not advance when autoplay=false', async () => {
    const wrapper = mountCarousel({ props: { autoplay: false, autoplaySpeed: 1000 } })
    vi.advanceTimersByTime(3000)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
  })

  it('pauses on hover when pauseOnHover=true', async () => {
    const wrapper = mountCarousel({ props: { autoplay: true, autoplaySpeed: 1000 } })
    await wrapper.find(ns.b()).trigger('mouseenter')
    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')

    await wrapper.find(ns.b()).trigger('mouseleave')
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')
  })

  it('keeps autoplay running on hover when pauseOnHover=false', async () => {
    const wrapper = mountCarousel({
      props: { autoplay: true, autoplaySpeed: 1000, pauseOnHover: false },
    })
    await wrapper.find(ns.b()).trigger('mouseenter')
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')
  })

  it('restarts autoplay when speed changes', async () => {
    const speed = ref(1000)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Carousel,
            { autoplay: true, autoplaySpeed: speed.value },
            { default: () => [0, 1, 2].map((i) => h('div', { key: i }, String(i))) },
          )
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    speed.value = 200
    await nextTick()
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')
  })
})

describe('carousel exposed methods', () => {
  function mountWithRef(props: Record<string, unknown> = {}) {
    const carouselRef = ref<{
      goTo: (i: number, dontAnimate?: boolean) => void
      next: () => void
      prev: () => void
    } | null>(null)
    const Host = defineComponent({
      setup() {
        return { carouselRef }
      },
      render() {
        return h(
          Carousel,
          { ref: 'carouselRef', ...props },
          {
            default: () => [0, 1, 2].map((i) => h('div', { key: i }, String(i))),
          },
        )
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    return { wrapper, getRef: () => carouselRef.value! }
  }

  it('goTo / next / prev are exposed and work', async () => {
    const { wrapper, getRef } = mountWithRef()
    getRef().goTo(2)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).toContain('is-active')

    getRef().prev()
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')

    getRef().next()
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).toContain('is-active')
  })

  it('goTo with out-of-range index clamps when infinite=false', async () => {
    const { wrapper, getRef } = mountWithRef({ infinite: false })
    getRef().goTo(99)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).toContain('is-active')
    getRef().goTo(-5)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
  })
})

describe('carousel keyboard navigation', () => {
  it('ArrowRight advances to next slide', async () => {
    const wrapper = mountCarousel()
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')
  })

  it('ArrowLeft goes to previous slide (infinite wraps)', async () => {
    const wrapper = mountCarousel()
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).toContain('is-active')
  })

  it('Home goes to first slide, End goes to last', async () => {
    const wrapper = mountCarousel({ props: { defaultActive: 1 } })
    await wrapper.find(ns.b()).trigger('keydown', { key: 'End' })
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).toContain('is-active')

    await wrapper.find(ns.b()).trigger('keydown', { key: 'Home' })
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
  })

  it('ArrowDown/ArrowUp also navigate', async () => {
    const wrapper = mountCarousel()
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')

    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
  })
})

describe('carousel ARIA attributes', () => {
  it('root has role=region, aria-roledescription=carousel, tabindex=0', () => {
    const wrapper = mountCarousel()
    const root = wrapper.find(ns.b())
    expect(root.attributes('role')).toBe('region')
    expect(root.attributes('aria-roledescription')).toBe('carousel')
    expect(root.attributes('tabindex')).toBe('0')
  })

  it('viewport has aria-live=polite', () => {
    const wrapper = mountCarousel()
    expect(wrapper.find(ns.e('viewport')).attributes('aria-live')).toBe('polite')
  })

  it('slides have role=tabpanel', () => {
    const wrapper = mountCarousel()
    const slides = wrapper.findAll(ns.e('slide'))
    expect(slides[0].attributes('role')).toBe('tabpanel')
  })
})

describe('carousel swipe gesture', () => {
  function swipe(el: Element, startX: number, startY: number, endX: number, endY: number) {
    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true }))
    el.dispatchEvent(new PointerEvent('pointerup', { clientX: endX, clientY: endY, bubbles: true }))
  }

  it('swipe left (dx < -threshold) goes to next', async () => {
    const wrapper = mountCarousel()
    swipe(wrapper.find(ns.b()).element, 200, 100, 100, 100)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')
  })

  it('swipe right (dx > threshold) goes to prev', async () => {
    const wrapper = mountCarousel({ props: { defaultActive: 1 } })
    swipe(wrapper.find(ns.b()).element, 100, 100, 200, 100)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
  })

  it('does not trigger when distance below threshold', async () => {
    const wrapper = mountCarousel()
    swipe(wrapper.find(ns.b()).element, 100, 100, 120, 100)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
  })

  it('swipeable=false disables gesture', async () => {
    const wrapper = mountCarousel({ props: { swipeable: false } })
    swipe(wrapper.find(ns.b()).element, 200, 100, 100, 100)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[0].classes()).toContain('is-active')
  })

  it('vertical layout uses dy instead of dx', async () => {
    const wrapper = mountCarousel({ props: { dotPosition: 'left' } })
    // swipe up (dy < -threshold) → next
    swipe(wrapper.find(ns.b()).element, 100, 200, 100, 100)
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[1].classes()).toContain('is-active')
  })
})

describe('carousel afterChange event', () => {
  it('emits afterChange after duration timeout', async () => {
    const wrapper = mountCarousel({ props: { duration: 300 } })
    await wrapper.findAll(`${ns.e('dot')} button`)[1].trigger('click')
    await nextTick()

    // change fires immediately
    expect(wrapper.findComponent(Carousel).emitted('change')).toBeDefined()
    // afterChange has NOT fired yet
    expect(wrapper.findComponent(Carousel).emitted('afterChange')).toBeUndefined()

    // advance past duration
    vi.advanceTimersByTime(300)
    await nextTick()
    const afterChange = wrapper.findComponent(Carousel).emitted('afterChange')
    expect(afterChange).toBeDefined()
    expect(afterChange![0]).toEqual([1])
  })

  it('afterChange fires immediately for dontAnimate=true', async () => {
    const carouselRef = ref<any>(null)
    const Host = defineComponent({
      setup() {
        return { carouselRef }
      },
      render() {
        return h(
          Carousel,
          { ref: 'carouselRef' },
          { default: () => [0, 1, 2].map((i) => h('div', { key: i }, String(i))) },
        )
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)

    carouselRef.value.goTo(2, true)
    await nextTick()
    expect(wrapper.findComponent(Carousel).emitted('afterChange')?.[0]).toEqual([2])
  })
})

describe('carousel customDot slot', () => {
  it('renders custom dot content via customDot slot', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Carousel,
            {},
            {
              default: () => [0, 1, 2].map((i) => h('div', { key: i }, String(i))),
              customDot: ({ index, isActive }: { index: number; isActive: boolean }) =>
                h('span', { class: ['my-dot', isActive ? 'my-active' : ''] }, String(index + 1)),
            },
          )
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)

    const dots = wrapper.findAll('.my-dot')
    expect(dots).toHaveLength(3)
    expect(dots[0].text()).toBe('1')
    expect(dots[0].classes()).toContain('my-active')
    expect(dots[1].classes()).not.toContain('my-active')
  })

  it('clicking custom dot switches slide', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Carousel,
            {},
            {
              default: () => [0, 1, 2].map((i) => h('div', { key: i }, String(i))),
              customDot: ({ index }: { index: number }) => h('span', { class: 'my-dot' }, String(index + 1)),
            },
          )
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)

    await wrapper.findAll(ns.e('dot'))[2].trigger('click')
    await nextTick()
    expect(wrapper.findAll(ns.e('slide'))[2].classes()).toContain('is-active')
  })
})

describe('carousel edge cases', () => {
  it('renders nothing breaking with zero slides', () => {
    const wrapper = mountCarousel({ slides: 0 })
    expect(wrapper.findAll(ns.e('slide'))).toHaveLength(0)
    expect(wrapper.find(ns.e('dots')).exists()).toBe(false)
  })

  it('autoplay no-op when only one slide', async () => {
    const wrapper = mountCarousel({ slides: 1, props: { autoplay: true, autoplaySpeed: 100 } })
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(wrapper.findComponent(Carousel).emitted('change')).toBeUndefined()
  })
})
