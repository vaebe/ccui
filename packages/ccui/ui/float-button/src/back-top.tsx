import type { BackTopProps } from './float-button-types'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, Transition, watch } from 'vue'
import { renderIconNode } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { backTopProps } from './float-button-types'
import './float-button.scss'

function resolveTarget(target: BackTopProps['target']): HTMLElement | Window {
  if (!target) {
    return window
  }
  if (typeof target === 'string') {
    const el = document.querySelector(target)
    return (el as HTMLElement) ?? window
  }
  if (typeof target === 'function') {
    return target() ?? window
  }
  return target as HTMLElement
}

function getScrollTop(t: HTMLElement | Window): number {
  return t === window || t instanceof Window ? (t as Window).scrollY : (t as HTMLElement).scrollTop
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function scrollTo(target: HTMLElement | Window, to: number, duration: number) {
  const start = getScrollTop(target)
  const startTime = Date.now()
  const frame = () => {
    const elapsed = Date.now() - startTime
    const progress = duration > 0 ? Math.min(1, elapsed / duration) : 1
    const value = start + (to - start) * easeInOutCubic(progress)
    if (target === window || target instanceof Window) {
      ;(target as Window).scrollTo(0, value)
    } else {
      ;(target as HTMLElement).scrollTop = value
    }
    if (progress < 1) {
      rafId = requestAnimationFrame(frame)
    }
  }
  let rafId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(rafId)
}

export default defineComponent({
  name: 'CBackTop',
  props: backTopProps,
  emits: ['click'],
  setup(props: BackTopProps, { emit, slots }) {
    const ns = useNamespace('float-button')
    const visible = ref(false)
    let container: HTMLElement | Window | null = null
    // 跟踪滚动动画的取消句柄，组件卸载时需取消，避免卸载后仍有 rAF 副作用
    let cancelScroll: (() => void) | null = null

    const onScroll = () => {
      if (!container) {
        return
      }
      visible.value = getScrollTop(container) >= props.visibilityHeight
    }

    const onClick = (e: MouseEvent) => {
      emit('click', e)
      if (container) {
        // 先取消上一次未结束的滚动动画，再开启新的
        cancelScroll?.()
        cancelScroll = scrollTo(container, 0, props.duration)
      }
    }

    // 绑定/解绑滚动监听；target 变更后需重新解析容器并重绑
    const bind = () => {
      container = resolveTarget(props.target)
      container.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }
    const unbind = () => {
      container?.removeEventListener('scroll', onScroll)
      // 解绑后必须置 null，避免重复绑定时旧容器引用残留
      container = null
    }

    onMounted(bind)
    onBeforeUnmount(() => {
      unbind()
      // 取消可能仍在进行的滚动动画，避免卸载后副作用
      cancelScroll?.()
    })
    // target 变更后重新绑定，使 visible 计算基于最新容器
    watch(
      () => props.target,
      () => {
        unbind()
        bind()
      },
    )

    // class 需随 shape/type 响应式变更，故用 computed 包裹
    const cls = computed(() => [ns.b(), ns.m(props.shape), ns.m(props.type), ns.m('back-top')])

    return () => (
      <Transition name={`${ns.b()}-fade`}>
        {visible.value && (
          <button class={cls.value} type="button" onClick={onClick} aria-label="Back to top">
            <span class={ns.e('body')}>
              <span class={ns.e('content')}>
                <span class={ns.e('icon')}>
                  {slots.default ? (
                    slots.default()
                  ) : props.icon ? (
                    <i class={props.icon} />
                  ) : (
                    renderIconNode('mdi:arrow-up')
                  )}
                </span>
              </span>
            </span>
          </button>
        )}
      </Transition>
    )
  },
})
