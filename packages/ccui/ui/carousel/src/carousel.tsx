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
  emits: ['update:modelValue', 'change', 'afterChange'],
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
      if (total.value <= 0) return 0
      // 多帧并排时，active 不应超过 maxActive（保证最后一页填满）
      const showCount = props.effect === 'scrollx' && props.slidesToShow > 1 ? Math.max(1, props.slidesToShow) : 1
      const max = Math.max(0, total.value - showCount)
      return clamp(Math.floor(value || 0), 0, max)
    })

    const isVertical = computed(() => props.dotPosition === 'left' || props.dotPosition === 'right')

    // 多帧并排（仅 scrollx 生效）
    const isMulti = computed(() => props.effect === 'scrollx' && props.slidesToShow > 1)
    const slidesToShow = computed(() => (isMulti.value ? Math.max(1, props.slidesToShow) : 1))
    const slidesToScroll = computed(() => (isMulti.value ? Math.max(1, props.slidesToScroll) : 1))
    // 多帧并排时 active 表示「视窗最左侧 slide 的索引」；
    // 受 slidesToShow 限制：active 最大值是 total - slidesToShow（保证最后一页填满）
    const maxActive = computed(() => Math.max(0, total.value - slidesToShow.value))
    // 总页数（用于指示器与 step 边界）
    const pageCount = computed(() => {
      if (total.value <= 0) return 0
      if (!isMulti.value) return total.value
      if (total.value <= slidesToShow.value) return 1
      return Math.ceil((total.value - slidesToShow.value) / slidesToScroll.value) + 1
    })
    // 当前页码（active 对应的页）
    const currentPage = computed(() => {
      if (!isMulti.value) return active.value
      return Math.min(pageCount.value - 1, Math.round(active.value / slidesToScroll.value))
    })

    function setActive(next: number, dontAnimate = false): void {
      const max = isMulti.value ? maxActive.value : total.value - 1
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
          emit('afterChange', target)
        }, props.duration)
      } else {
        emit('afterChange', target)
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
      const step = slidesToScroll.value
      const max = isMulti.value ? maxActive.value : total.value - 1
      let target = active.value + step
      // 多帧并排时，最后一页要对齐到 maxActive（不能越过；但 infinite 时仍可绕到 0）
      if (isMulti.value && !props.infinite && target > max) target = max
      // 多帧并排时，跨过 max 但 infinite=true → 回到 0
      if (isMulti.value && props.infinite && active.value >= max) target = 0
      setActive(target)
    }
    function prev(): void {
      const step = slidesToScroll.value
      const max = isMulti.value ? maxActive.value : total.value - 1
      let target = active.value - step
      // 多帧并排 + infinite：从 0 倒退应回到末页（active = maxActive）
      if (isMulti.value && props.infinite && active.value <= 0) target = max
      setActive(target)
    }
    function getCurrentIndex(): number {
      return active.value
    }

    expose<CarouselExpose>({ goTo, next, prev, getCurrentIndex })

    // ─── Autoplay ────────────────────────────────────────
    function startAutoplay(): void {
      stopAutoplay()
      if (!props.autoplay) return
      if (props.autoplaySpeed <= 0) return
      timer = setInterval(() => {
        if (props.pauseOnHover && isHover.value) return
        // 多帧并排时，只有 1 页（total <= slidesToShow）则无需切换
        if (pageCount.value <= 1) return
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

    // ─── Mouse hover ─────────────────────────────────────
    function handleMouseEnter(): void {
      isHover.value = true
    }
    function handleMouseLeave(): void {
      isHover.value = false
    }

    // ─── Keyboard ────────────────────────────────────────
    function handleKeydown(e: KeyboardEvent): void {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          prev()
          break
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          next()
          break
        case 'Home':
          e.preventDefault()
          goTo(0)
          break
        case 'End':
          e.preventDefault()
          goTo(isMulti.value ? maxActive.value : total.value - 1)
          break
      }
    }

    // ─── Swipe gesture ───────────────────────────────────
    let pointerStartX = 0
    let pointerStartY = 0
    let swiping = false

    function handlePointerDown(e: PointerEvent): void {
      if (!props.swipeable) return
      swiping = true
      pointerStartX = e.clientX
      pointerStartY = e.clientY
    }

    function handlePointerUp(e: PointerEvent): void {
      if (!swiping) return
      swiping = false
      const dx = e.clientX - pointerStartX
      const dy = e.clientY - pointerStartY
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      // 只在主轴方向超过阈值时触发
      if (isVertical.value) {
        if (absDy < props.swipeThreshold || absDy < absDx) return
        if (dy < 0) next()
        else prev()
      } else {
        if (absDx < props.swipeThreshold || absDx < absDy) return
        if (dx < 0) next()
        else prev()
      }
    }

    // 点击 page index → 对应的 leading slide index
    function pageToIndex(page: number): number {
      if (!isMulti.value) return page
      return Math.min(maxActive.value, page * slidesToScroll.value)
    }

    // ─── Render ──────────────────────────────────────────
    function renderSlides(): VNode[] {
      const list = slides.value
      const current = active.value
      const multi = isMulti.value
      const slideBasis = multi ? `${100 / slidesToShow.value}%` : '100%'
      return list.map((node, index) => {
        // 多帧并排时，在视窗内的所有 slide 都标记 active
        const isActive = multi ? index >= current && index < current + slidesToShow.value : index === current
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
              role: 'tabpanel',
            },
            [cloneVNode(node)],
          )
        }
        const slideStyle: CSSProperties | undefined = multi
          ? { flex: `0 0 ${slideBasis}`, width: slideBasis }
          : undefined
        return h(
          'div',
          {
            class: cls,
            style: slideStyle,
            'aria-hidden': isActive ? 'false' : 'true',
            role: 'tabpanel',
          },
          [cloneVNode(node)],
        )
      })
    }

    function renderDots(): VNode | null {
      if (!props.dots) return null
      const count = pageCount.value
      if (count <= 0) return null
      const cur = currentPage.value
      const items: VNode[] = []
      for (let i = 0; i < count; i++) {
        const isActive = i === cur
        const dotContent = slots.customDot
          ? slots.customDot({ index: i, isActive })
          : h('button', {
              type: 'button',
              'aria-label': `Go to slide ${i + 1}`,
              'aria-current': isActive ? 'true' : 'false',
              onClick: () => goTo(pageToIndex(i)),
            })
        items.push(
          h(
            'li',
            {
              key: i,
              class: [ns.e('dot'), isActive ? ns.is('active') : ''],
              onClick: slots.customDot ? () => goTo(pageToIndex(i)) : undefined,
            },
            [dotContent],
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
        // 单帧：每步 100%；多帧并排：每帧宽度 = 100/slidesToShow %
        const stepPercent = isMulti.value ? 100 / slidesToShow.value : 100
        trackStyle.transform = `translateX(-${active.value * stepPercent}%)`
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
          tabindex: 0,
          role: 'region',
          'aria-roledescription': 'carousel',
          'aria-label': 'Carousel',
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onKeydown: handleKeydown,
          onPointerdown: handlePointerDown,
          onPointerup: handlePointerUp,
        },
        [
          h('div', { class: ns.e('viewport'), 'aria-live': 'polite' }, [
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
