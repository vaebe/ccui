import type { CSSProperties, VNode } from 'vue'
import type { CarouselExpose, CarouselProps } from './carousel-types'
import {
  cloneVNode,
  Comment,
  computed,
  defineComponent,
  Fragment,
  h,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  Text,
  watch,
} from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { carouselProps } from './carousel-types'
import './carousel.scss'

function flattenSlides(nodes: VNode[] | undefined): VNode[] {
  if (!nodes) return []
  const out: VNode[] = []
  for (const node of nodes) {
    if (node.type === Fragment) {
      out.push(...flattenSlides(node.children as VNode[] | undefined))
    } else if (node.type === Text || node.type === Comment) {
      // 跳过纯文本/注释节点，避免被当成一帧
      continue
    } else {
      out.push(node)
    }
  }
  return out
}

function clamp(n: number, min: number, max: number): number {
  if (n < min) return min
  if (n > max) return max
  return n
}

export default defineComponent({
  name: 'CCarousel',
  props: carouselProps,
  emits: ['update:modelValue', 'change'],
  setup(props: CarouselProps, { slots, emit, expose }) {
    const ns = useNamespace('carousel')
    const rootRef = shallowRef<HTMLElement | null>(null)
    const innerActive = shallowRef(props.defaultActive ?? 0)
    const isHover = shallowRef(false)
    const animating = shallowRef(false)
    let timer: ReturnType<typeof setInterval> | null = null
    let animationTimer: ReturnType<typeof setTimeout> | null = null

    const isControlled = computed(() => props.modelValue !== undefined)
    const slides = computed(() => flattenSlides(slots.default?.()))
    const total = computed(() => slides.value.length)

    const active = computed(() => {
      const value = isControlled.value ? (props.modelValue as number) : innerActive.value
      const max = total.value - 1
      if (max < 0) return 0
      return clamp(Math.floor(value || 0), 0, max)
    })

    const isVertical = computed(() => props.dotPosition === 'left' || props.dotPosition === 'right')

    function setActive(next: number, dontAnimate = false): void {
      const max = total.value - 1
      if (max < 0) return
      let target = next
      if (props.infinite) {
        if (target < 0) target = max
        if (target > max) target = 0
      } else {
        target = clamp(target, 0, max)
      }
      const prev = active.value
      if (target === prev) return

      if (!dontAnimate) {
        animating.value = true
        if (animationTimer) clearTimeout(animationTimer)
        animationTimer = setTimeout(() => {
          animating.value = false
          animationTimer = null
        }, props.duration)
      }

      if (!isControlled.value) {
        innerActive.value = target
      }
      emit('update:modelValue', target)
      emit('change', target, prev)
    }

    function goTo(index: number, dontAnimate = false): void {
      setActive(index, dontAnimate)
    }
    function next(): void {
      setActive(active.value + 1)
    }
    function prev(): void {
      setActive(active.value - 1)
    }

    expose<CarouselExpose>({ goTo, next, prev })

    function startAutoplay(): void {
      stopAutoplay()
      if (!props.autoplay) return
      if (props.autoplaySpeed <= 0) return
      timer = setInterval(() => {
        if (props.pauseOnHover && isHover.value) return
        if (total.value <= 1) return
        next()
      }, props.autoplaySpeed)
    }
    function stopAutoplay(): void {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }

    watch(
      () => [props.autoplay, props.autoplaySpeed],
      () => startAutoplay(),
    )

    onMounted(() => startAutoplay())
    onBeforeUnmount(() => {
      stopAutoplay()
      if (animationTimer) clearTimeout(animationTimer)
    })

    function handleMouseEnter(): void {
      isHover.value = true
    }
    function handleMouseLeave(): void {
      isHover.value = false
    }

    function renderSlides(): VNode[] {
      const list = slides.value
      const current = active.value
      return list.map((node, index) => {
        const isActive = index === current
        const cls = [ns.e('slide'), isActive ? ns.is('active') : '']
        if (props.effect === 'fade') {
          const fadeStyle: CSSProperties = {
            opacity: isActive ? 1 : 0,
            transitionDuration: `${props.duration}ms`,
          }
          return h(
            'div',
            {
              class: cls,
              style: fadeStyle,
              'aria-hidden': isActive ? 'false' : 'true',
            },
            [cloneVNode(node)],
          )
        }
        return h(
          'div',
          {
            class: cls,
            'aria-hidden': isActive ? 'false' : 'true',
          },
          [cloneVNode(node)],
        )
      })
    }

    function renderDots(): VNode | null {
      if (!props.dots) return null
      const count = total.value
      if (count <= 0) return null
      const items: VNode[] = []
      for (let i = 0; i < count; i++) {
        const isActive = i === active.value
        items.push(
          h(
            'li',
            {
              key: i,
              class: [ns.e('dot'), isActive ? ns.is('active') : ''],
            },
            [
              h('button', {
                type: 'button',
                'aria-label': `Go to slide ${i + 1}`,
                'aria-current': isActive ? 'true' : 'false',
                onClick: () => goTo(i),
              }),
            ],
          ),
        )
      }
      return h(
        'ul',
        {
          class: [ns.e('dots'), ns.em('dots', props.dotPosition)],
          role: 'tablist',
        },
        items,
      )
    }

    function renderArrows(): VNode[] {
      if (!props.arrows) return []
      return [
        h(
          'button',
          {
            type: 'button',
            class: [ns.e('arrow'), ns.em('arrow', 'prev')],
            'aria-label': 'Previous slide',
            onClick: prev,
          },
          '‹',
        ),
        h(
          'button',
          {
            type: 'button',
            class: [ns.e('arrow'), ns.em('arrow', 'next')],
            'aria-label': 'Next slide',
            onClick: next,
          },
          '›',
        ),
      ]
    }

    return () => {
      const trackStyle: CSSProperties = {}
      if (props.effect === 'scrollx' && !isVertical.value) {
        trackStyle.transform = `translateX(-${active.value * 100}%)`
        trackStyle.transitionDuration = `${props.duration}ms`
      }

      const rootClass = [
        ns.b(),
        ns.em('position', props.dotPosition),
        ns.em('effect', props.effect),
        animating.value ? ns.is('animating') : '',
      ]

      return h(
        'div',
        {
          ref: rootRef,
          class: rootClass,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
        },
        [
          h('div', { class: ns.e('viewport') }, [
            h(
              'div',
              {
                class: [ns.e('track'), ns.em('track', props.effect)],
                style: trackStyle,
              },
              renderSlides(),
            ),
          ]),
          ...renderArrows(),
          renderDots(),
        ],
      )
    }
  },
})
