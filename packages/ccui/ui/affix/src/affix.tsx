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

function getRect(el: HTMLElement, container: HTMLElement | Window) {
  const rect = el.getBoundingClientRect()
  if (isWindow(container)) {
    return { top: rect.top, bottom: window.innerHeight - rect.bottom, height: rect.height, width: rect.width }
  }
  const containerEl = container as HTMLElement
  if (typeof containerEl.getBoundingClientRect !== 'function') {
    return { top: rect.top, bottom: window.innerHeight - rect.bottom, height: rect.height, width: rect.width }
  }
  const containerRect = containerEl.getBoundingClientRect()
  return {
    top: rect.top - containerRect.top,
    bottom: containerRect.bottom - rect.bottom,
    height: rect.height,
    width: rect.width,
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

    const isTopMode = computed(() => props.offsetBottom === undefined)
    const offsetTop = computed(() => props.offsetTop ?? 0)

    const update = () => {
      if (!wrapperRef.value || !container) {
        return
      }
      const rect = getRect(wrapperRef.value, container)
      const shouldFix = isTopMode.value ? rect.top <= offsetTop.value : rect.bottom <= (props.offsetBottom ?? 0)

      if (shouldFix !== fixed.value) {
        fixed.value = shouldFix
        emit('change', shouldFix)
      }

      if (shouldFix) {
        placeholderStyle.value = {
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        }
        const targetIsWindow = isWindow(container)
        const containerEl = targetIsWindow ? null : (container as HTMLElement)
        const baseRect =
          containerEl && typeof containerEl.getBoundingClientRect === 'function'
            ? containerEl.getBoundingClientRect()
            : null
        const wrapperRect = wrapperRef.value.getBoundingClientRect()
        const left = targetIsWindow ? wrapperRect.left : wrapperRect.left
        const style: CSSProperties = {
          position: 'fixed',
          width: `${rect.width}px`,
          zIndex: props.zIndex,
          left: `${left}px`,
        }
        if (isTopMode.value) {
          style.top = targetIsWindow ? `${offsetTop.value}px` : `${(baseRect?.top ?? 0) + offsetTop.value}px`
        } else {
          style.bottom = targetIsWindow
            ? `${props.offsetBottom ?? 0}px`
            : `${window.innerHeight - (baseRect?.bottom ?? 0) + (props.offsetBottom ?? 0)}px`
        }
        fixedStyle.value = style
      } else {
        placeholderStyle.value = {}
        fixedStyle.value = {}
      }
    }

    onMounted(() => {
      container = resolveTarget(props.target)
      container.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', update)
      update()
    })
    onBeforeUnmount(() => {
      container?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    })
    watch(
      () => props.target,
      () => {
        container?.removeEventListener('scroll', update)
        container = resolveTarget(props.target)
        container.addEventListener('scroll', update, { passive: true })
        update()
      },
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
