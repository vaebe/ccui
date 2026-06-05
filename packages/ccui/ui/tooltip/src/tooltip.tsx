import type { TooltipProps } from './tooltip-types'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { tooltipProps } from './tooltip-types'
import './tooltip.scss'

let tooltipIdCounter = 0

export default defineComponent({
  name: 'CTooltip',
  props: tooltipProps,
  emits: ['before-show', 'show', 'before-hide', 'hide', 'update:visible'],
  setup(props: TooltipProps, { emit, slots }) {
    const ns = useNamespace('tooltip')
    const popperId = `${ns.e('popper')}-${++tooltipIdCounter}`

    // visible 受控
    const externalOpen = computed(() => props.visible)
    const isControlled = computed(() => externalOpen.value !== undefined)

    // 状态管理
    const visible = ref(false)
    const triggerRef = ref<HTMLElement>()
    const popperRef = ref<HTMLElement>()
    const arrowRef = ref<HTMLElement>()
    const showTimer = ref<number>()
    const hideTimer = ref<number>()

    const actualVisible = computed(() => (isControlled.value ? externalOpen.value : visible.value))

    // color：覆盖 effect 的内置背景
    const inlineColorStyle = computed(() => {
      if (!props.color) return {}
      return { backgroundColor: props.color }
    })

    // 使用 floating-ui 进行位置计算
    // autoAdjustOverflow=true 时启用 flip middleware；否则不翻转
    const { floatingStyles, middlewareData, placement, update } = useFloating(triggerRef, popperRef, {
      // 传响应式 placement，保证 placement prop 变化与 flip 翻转都能被 floating-ui 跟踪
      placement: toRef(props, 'placement') as any,
      // middleware 用 computed 包裹，让 floating-ui 通过 toValue 重新求值，
      // 保证运行时切换 offset / autoAdjustOverflow / showArrow 能重建中间件链
      middleware: computed(() => [
        offset(props.offset),
        ...(props.autoAdjustOverflow ? [flip()] : []),
        shift({ padding: 8 }),
        ...(props.showArrow ? [arrow({ element: arrowRef })] : []),
      ]) as any,
    })

    // 实际生效的方位（flip 翻转后可能与 props.placement 不同），箭头/样式都以此为准
    const actualSide = computed(() => placement.value.split('-')[0])

    const popperClass = computed(() => {
      return [
        ns.e('popper'),
        ns.em('popper', props.effect),
        ns.em('popper', props.placement.split('-')[0]),
        props.popperClass,
      ]
        .filter(Boolean)
        .join(' ')
    })

    // 箭头位置计算
    const arrowStyles = computed(() => {
      if (!props.showArrow || !middlewareData.value.arrow) {
        return {}
      }

      const { x, y } = middlewareData.value.arrow
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[actualSide.value]

      return {
        left: x != null ? `${x}px` : '',
        top: y != null ? `${y}px` : '',
        right: '',
        bottom: '',
        [staticSide!]: '-4px',
      }
    })

    // 显示/隐藏逻辑
    const clearTimers = () => {
      if (showTimer.value) {
        clearTimeout(showTimer.value)
        showTimer.value = undefined
      }
      if (hideTimer.value) {
        clearTimeout(hideTimer.value)
        hideTimer.value = undefined
      }
    }

    const doShow = () => {
      if (props.disabled) return

      clearTimers()

      const showTooltip = () => {
        emit('before-show')
        if (!isControlled.value) {
          visible.value = true
        }
        emit('update:visible', true)
        void nextTick(() => {
          update()
          emit('show')
        })
      }

      if (props.showAfter > 0) {
        showTimer.value = window.setTimeout(showTooltip, props.showAfter)
      } else {
        showTooltip()
      }
    }

    const doHide = () => {
      clearTimers()

      const hideTooltip = () => {
        emit('before-hide')
        if (!isControlled.value) {
          visible.value = false
        }
        emit('update:visible', false)
        emit('hide')
      }

      if (props.hideAfter > 0 && props.trigger !== 'click') {
        hideTimer.value = window.setTimeout(hideTooltip, props.hideAfter)
      } else {
        hideTooltip()
      }
    }

    // 事件处理
    const handleMouseEnter = () => {
      if (props.trigger === 'hover') {
        doShow()
      }
    }

    const handleMouseLeave = () => {
      if (props.trigger === 'hover') {
        doHide()
      }
    }

    const handleClick = () => {
      if (props.trigger === 'click') {
        if (actualVisible.value) {
          doHide()
        } else {
          doShow()
        }
      }
    }

    const handleFocus = () => {
      if (props.trigger === 'focus') {
        doShow()
      }
    }

    const handleBlur = () => {
      if (props.trigger === 'focus') {
        doHide()
      }
    }

    const handlePopperMouseEnter = () => {
      if (props.trigger === 'hover' && props.enterable) {
        clearTimers()
      }
    }

    const handlePopperMouseLeave = () => {
      if (props.trigger === 'hover' && props.enterable) {
        doHide()
      }
    }

    // 自动更新位置
    let cleanup: (() => void) | undefined

    // 生命周期
    onMounted(() => {
      if (actualVisible.value && triggerRef.value && popperRef.value) {
        cleanup = autoUpdate(triggerRef.value, popperRef.value, update)
      }
    })

    onUnmounted(() => {
      clearTimers()
      cleanup?.()
    })

    // 监听 visible prop 变化（外部受控）
    watch(externalOpen, (newVal) => {
      if (newVal !== undefined && newVal) {
        void nextTick(() => update())
      }
    })

    // fresh：关闭后强制销毁缓存。fresh=true 时与 destroyTooltipOnHide 行为重叠，统一在 actualVisible 切 false 后清理 DOM
    // 当前实现：actualVisible 已经决定是否渲染浮层 DOM；fresh/destroyTooltipOnHide 不需要额外清理（每次都重新渲染）

    // 监听显示状态变化，设置自动更新
    watch(actualVisible, (newVal) => {
      if (newVal && triggerRef.value && popperRef.value) {
        cleanup?.()
        cleanup = autoUpdate(triggerRef.value, popperRef.value, update)
      } else {
        cleanup?.()
      }
    })

    // 渲染箭头
    const renderArrow = () => {
      if (!props.showArrow) return null

      const arrowClass = [ns.e('arrow'), ns.em('arrow', actualSide.value)].join(' ')

      return <div ref={arrowRef} class={arrowClass} style={arrowStyles.value}></div>
    }

    // 渲染弹出层内容：content slot > content prop（rawContent 时按 HTML 渲染）
    const renderContent = () => {
      if (slots.content) return slots.content()
      if (props.rawContent) {
        return <div innerHTML={props.content}></div>
      }
      return props.content
    }

    return () => {
      const triggerEvents: Record<string, any> = {}

      if (props.trigger === 'hover') {
        triggerEvents.onMouseenter = handleMouseEnter
        triggerEvents.onMouseleave = handleMouseLeave
      } else if (props.trigger === 'click') {
        triggerEvents.onClick = handleClick
      } else if (props.trigger === 'focus') {
        triggerEvents.onFocus = handleFocus
        triggerEvents.onBlur = handleBlur
      }

      return (
        <div class={ns.b()}>
          {/* 触发器 */}
          <div
            ref={triggerRef}
            class={ns.e('trigger')}
            aria-describedby={actualVisible.value ? popperId : undefined}
            aria-label={props.ariaLabel}
            tabindex={props.trigger === 'focus' ? 0 : undefined}
            {...triggerEvents}
          >
            {slots.default?.()}
          </div>

          {/* 弹出层 */}
          {actualVisible.value && (
            <div
              ref={popperRef}
              class={popperClass.value}
              role="tooltip"
              id={popperId}
              style={{
                ...floatingStyles.value,
                ...inlineColorStyle.value,
                zIndex: 2000,
                pointerEvents: props.enterable ? 'auto' : 'none',
              }}
              onMouseenter={handlePopperMouseEnter}
              onMouseleave={handlePopperMouseLeave}
            >
              {renderArrow()}
              <div class={ns.e('content')}>{renderContent()}</div>
            </div>
          )}
        </div>
      )
    }
  },
})
