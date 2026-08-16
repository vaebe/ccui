import type { CSSProperties } from 'vue'
import type { AffixProps } from './affix-types'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { affixProps } from './affix-types'
import './affix.scss'

function resolveTarget(target: AffixProps['target']): HTMLElement | Window {
  if (!target) {
    return window
  }
  if (typeof target === 'string') {
    const el = document.querySelector(target)
    return (el as HTMLElement) ?? window
  }
  if (typeof target === 'function') {
    const result = target()
    return (result as HTMLElement | Window) ?? window
  }
  return target as HTMLElement | Window
}

function isWindow(target: HTMLElement | Window): target is Window {
  return target === window
}

function getContainerViewportRect(container: HTMLElement) {
  const rect = container.getBoundingClientRect()
  const bottomBorder = Math.max(0, container.offsetHeight - container.clientHeight - container.clientTop)
  return {
    top: rect.top + container.clientTop,
    bottom: rect.bottom - bottomBorder,
    left: rect.left + container.clientLeft,
  }
}

function getOffsetRect(el: HTMLElement, container: HTMLElement | Window) {
  const rect = el.getBoundingClientRect()
  if (isWindow(container)) {
    return {
      top: rect.top,
      bottom: window.innerHeight - rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
  }
  const containerEl = container as HTMLElement
  if (typeof containerEl.getBoundingClientRect !== 'function') {
    return {
      top: rect.top,
      bottom: window.innerHeight - rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
  }
  const containerRect = getContainerViewportRect(containerEl)
  return {
    top: rect.top - containerRect.top,
    bottom: containerRect.bottom - rect.bottom,
    left: rect.left - containerRect.left,
    width: rect.width,
    height: rect.height,
  }
}

export default defineComponent({
  name: 'CAffix',
  props: affixProps,
  emits: ['change'],
  setup(props: AffixProps, { emit, slots }) {
    const ns = useNamespace('affix')
    const wrapperRef = ref<HTMLElement>()
    const innerRef = ref<HTMLElement>()
    const fixed = ref(false)
    const placeholderStyle = ref<CSSProperties>({})
    const fixedStyle = ref<CSSProperties>({})

    let container: HTMLElement | Window | null = null
    let resizeObserver: ResizeObserver | null = null
    let rafId: number | null = null
    let stopTargetWatch: (() => void) | null = null

    const isTopMode = computed(() => props.offsetBottom === undefined)
    const offsetTop = computed(() => props.offsetTop ?? 0)

    const update = () => {
      if (!wrapperRef.value || !container) {
        return
      }
      const offset = getOffsetRect(wrapperRef.value, container)
      const shouldFix = isTopMode.value ? offset.top <= offsetTop.value : offset.bottom <= (props.offsetBottom ?? 0)

      if (shouldFix) {
        const targetIsWindow = isWindow(container)
        const containerEl = targetIsWindow ? null : (container as HTMLElement)
        const baseRect =
          containerEl && typeof containerEl.getBoundingClientRect === 'function'
            ? getContainerViewportRect(containerEl)
            : null
        const wrapperRect = wrapperRef.value.getBoundingClientRect()
        const innerRect = innerRef.value?.getBoundingClientRect()

        const style: CSSProperties = {
          position: 'fixed',
          width: `${offset.width}px`,
          zIndex: props.zIndex,
          left: `${wrapperRect.left}px`,
        }
        if (isTopMode.value) {
          style.top = targetIsWindow ? `${offsetTop.value}px` : `${(baseRect?.top ?? 0) + offsetTop.value}px`
        } else {
          style.bottom = targetIsWindow
            ? `${props.offsetBottom ?? 0}px`
            : `${window.innerHeight - (baseRect?.bottom ?? 0) + (props.offsetBottom ?? 0)}px`
        }
        fixedStyle.value = style
        placeholderStyle.value = {
          width: `${offset.width}px`,
          height: `${innerRect?.height ?? offset.height}px`,
        }
      } else {
        fixedStyle.value = {}
        placeholderStyle.value = {}
      }

      if (shouldFix !== fixed.value) {
        fixed.value = shouldFix
        emit('change', shouldFix)
      }
    }

    const observeSizeChanges = () => {
      resizeObserver?.disconnect()
      if (typeof ResizeObserver === 'undefined') {
        return
      }
      resizeObserver = new ResizeObserver(() => update())
      if (wrapperRef.value) {
        resizeObserver.observe(wrapperRef.value)
      }
      if (innerRef.value) {
        resizeObserver.observe(innerRef.value)
      }
      if (container && !isWindow(container)) {
        resizeObserver.observe(container)
      }
    }

    const bindContainer = (nextContainer = resolveTarget(props.target)) => {
      container = nextContainer
      container.addEventListener('scroll', update, { passive: true })
      // 当滚动容器不是 window 时，仍需监听窗口滚动以处理嵌套滚动场景
      if (!isWindow(container)) {
        window.addEventListener('scroll', update, { passive: true })
      }
      observeSizeChanges()
    }

    const unbindContainer = () => {
      container?.removeEventListener('scroll', update)
      window.removeEventListener('scroll', update)
    }

    const rebindContainer = (nextContainer: HTMLElement | Window) => {
      if (nextContainer === container) {
        return
      }
      unbindContainer()
      bindContainer(nextContainer)
      update()
    }

    onMounted(() => {
      bindContainer()
      window.addEventListener('resize', update)
      // Start resolving function targets only on the client. Calling user target
      // functions during setup would make SSR unsafe, while watching the resolved
      // value here also tracks refs read by a stable target function.
      stopTargetWatch = watch(() => resolveTarget(props.target), rebindContainer, { flush: 'post' })
      // 等下一帧再计算，避免初次布局未完成
      rafId = requestAnimationFrame(() => update())
    })

    onBeforeUnmount(() => {
      unbindContainer()
      window.removeEventListener('resize', update)
      resizeObserver?.disconnect()
      resizeObserver = null
      stopTargetWatch?.()
      stopTargetWatch = null
      // 卸载时取消未执行的下一帧回调，避免卸载后再触发一次 update()
      if (rafId !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    })

    watch(
      () => [props.offsetTop, props.offsetBottom, props.zIndex],
      () => update(),
    )

    return () => (
      <div ref={wrapperRef} class={ns.b()} style={fixed.value ? placeholderStyle.value : undefined}>
        <div
          ref={innerRef}
          class={[ns.e('inner'), fixed.value && ns.em('inner', 'fixed')]}
          style={fixed.value ? fixedStyle.value : undefined}
        >
          {slots.default?.()}
        </div>
      </div>
    )
  },
})
