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
