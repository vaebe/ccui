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
  return target as HTMLElement
}

function isWindow(target: HTMLElement | Window): target is Window {
  return target === window
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
  const containerRect = containerEl.getBoundingClientRect()
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
    const fixed = ref(false)
    const placeholderStyle = ref<CSSProperties>({})
    const fixedStyle = ref<CSSProperties>({})

    let container: HTMLElement | Window | null = null
    let resizeObserver: ResizeObserver | null = null
    let rafId: number | null = null

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
            ? containerEl.getBoundingClientRect()
            : null
        const wrapperRect = wrapperRef.value.getBoundingClientRect()

        const style: CSSProperties = {
          position: 'fixed',
          width: `${offset.width}px`,
          height: `${offset.height}px`,
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
          height: `${offset.height}px`,
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

    const bindContainer = () => {
      container = resolveTarget(props.target)
      container.addEventListener('scroll', update, { passive: true })
      // 当滚动容器不是 window 时，仍需监听窗口滚动以处理嵌套滚动场景
      if (!isWindow(container)) {
        window.addEventListener('scroll', update, { passive: true })
      }
    }

    const unbindContainer = () => {
      container?.removeEventListener('scroll', update)
      window.removeEventListener('scroll', update)
    }

    onMounted(() => {
      bindContainer()
      window.addEventListener('resize', update)
      if (typeof ResizeObserver !== 'undefined' && wrapperRef.value) {
        resizeObserver = new ResizeObserver(() => update())
        resizeObserver.observe(wrapperRef.value)
      }
      // 等下一帧再计算，避免初次布局未完成
      rafId = requestAnimationFrame(() => update())
    })

    onBeforeUnmount(() => {
      unbindContainer()
      window.removeEventListener('resize', update)
      resizeObserver?.disconnect()
      resizeObserver = null
      // 卸载时取消未执行的下一帧回调，避免卸载后再触发一次 update()
      if (rafId !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    })

    watch(
      () => props.target,
      () => {
        unbindContainer()
        bindContainer()
        update()
      },
    )

    watch(
      () => [props.offsetTop, props.offsetBottom],
      () => update(),
    )

    return () => (
      <div ref={wrapperRef} class={ns.b()} style={fixed.value ? placeholderStyle.value : undefined}>
        <div
          class={[ns.e('inner'), fixed.value && ns.em('inner', 'fixed')]}
          style={fixed.value ? fixedStyle.value : undefined}
        >
          {slots.default?.()}
        </div>
      </div>
    )
  },
})
