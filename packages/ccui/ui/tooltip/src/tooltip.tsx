import type { TooltipProps } from './tooltip-types'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { tooltipProps } from './tooltip-types'
import './tooltip.scss'

export default defineComponent({
  name: 'CTooltip',
  props: tooltipProps,
  emits: ['before-show', 'show', 'before-hide', 'hide', 'update:visible'],
  setup(props: TooltipProps, { emit, slots }) {
    const ns = useNamespace('tooltip')

    // 状态管理
    const visible = ref(false)
    const triggerRef = ref<HTMLElement>()
    const popperRef = ref<HTMLElement>()
    const arrowRef = ref<HTMLElement>()
    const showTimer = ref<number>()
    const hideTimer = ref<number>()

    // 计算属性
    const isControlled = computed(() => props.visible !== undefined)
    const actualVisible = computed(() => isControlled.value ? props.visible : visible.value)

    const popperClass = computed(() => {
      return [
        ns.e('popper'),
        ns.em('popper', props.effect),
        ns.em('popper', props.placement.split('-')[0]),
        props.popperClass,
      ].filter(Boolean).join(' ')
    })

    // 使用 floating-ui 进行位置计算
    const { floatingStyles, middlewareData, update } = useFloating(triggerRef, popperRef, {
      placement: props.placement as any,
      middleware: [
        offset(props.offset),
        flip(),
        shift({ padding: 8 }),
        ...(props.showArrow ? [arrow({ element: arrowRef })] : []),
      ],
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
      }[props.placement.split('-')[0]]

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
      if (props.disabled)
        return

      clearTimers()

      const showTooltip = () => {
        emit('before-show')
        if (!isControlled.value) {
          visible.value = true
        }
        emit('update:visible', true)
        nextTick(() => {
          update()
          emit('show')
        })
      }

      if (props.showAfter > 0) {
        showTimer.value = window.setTimeout(showTooltip, props.showAfter)
      }
      else {
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
      }
      else {
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
        }
        else {
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

    // 监听 visible prop 变化
    watch(() => props.visible, (newVal) => {
      if (newVal !== undefined) {
        if (newVal) {
          nextTick(() => {
            update()
          })
        }
      }
    })

    // 监听显示状态变化，设置自动更新
    watch(actualVisible, (newVal) => {
      if (newVal && triggerRef.value && popperRef.value) {
        cleanup?.()
        cleanup = autoUpdate(triggerRef.value, popperRef.value, update)
      }
      else {
        cleanup?.()
      }
    })

    // 渲染箭头
    const renderArrow = () => {
      if (!props.showArrow)
        return null

      const arrowClass = [
        ns.e('arrow'),
        ns.em('arrow', props.placement.split('-')[0]),
      ].join(' ')

      return <div ref={arrowRef} class={arrowClass} style={arrowStyles.value}></div>
    }

    // 渲染弹出层内容
    const renderContent = () => {
      if (props.rawContent) {
        return <div innerHTML={props.content}></div>
      }

      if (slots.content) {
        return slots.content()
      }

      return props.content
    }

    return () => {
      const triggerEvents: Record<string, any> = {}

      if (props.trigger === 'hover') {
        triggerEvents.onMouseenter = handleMouseEnter
        triggerEvents.onMouseleave = handleMouseLeave
      }
      else if (props.trigger === 'click') {
        triggerEvents.onClick = handleClick
      }
      else if (props.trigger === 'focus') {
        triggerEvents.onFocus = handleFocus
        triggerEvents.onBlur = handleBlur
      }

      return (
        <div class={ns.b()}>
          {/* 触发器 */}
          <div
            ref={triggerRef}
            class={ns.e('trigger')}
            aria-describedby={actualVisible.value ? ns.e('popper') : undefined}
            aria-label={props.ariaLabel}
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
              id={ns.e('popper')}
              style={{
                ...floatingStyles.value,
                zIndex: 2000,
                pointerEvents: props.enterable ? 'auto' : 'none',
              }}
              onMouseenter={handlePopperMouseEnter}
              onMouseleave={handlePopperMouseLeave}
            >
              {renderArrow()}
              <div class={ns.e('content')}>
                {renderContent()}
              </div>
            </div>
          )}
        </div>
      )
    }
  },
})
