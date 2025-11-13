import type { TooltipProps } from './tooltip-types'
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

    // 位置计算
    const calculatePosition = () => {
      if (!triggerRef.value || !popperRef.value)
        return

      const triggerRect = triggerRef.value.getBoundingClientRect()
      const popperRect = popperRef.value.getBoundingClientRect()
      const [placement, alignment] = props.placement.split('-')

      let top = 0
      let left = 0

      // 基础位置计算
      switch (placement) {
        case 'top':
          top = triggerRect.top - popperRect.height - props.offset
          left = triggerRect.left + triggerRect.width / 2 - popperRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + props.offset
          left = triggerRect.left + triggerRect.width / 2 - popperRect.width / 2
          break
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - popperRect.height / 2
          left = triggerRect.left - popperRect.width - props.offset
          break
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - popperRect.height / 2
          left = triggerRect.right + props.offset
          break
      }

      // 对齐方式调整
      if (alignment) {
        if (placement === 'top' || placement === 'bottom') {
          if (alignment === 'start') {
            left = triggerRect.left
          }
          else if (alignment === 'end') {
            left = triggerRect.right - popperRect.width
          }
        }
        else {
          if (alignment === 'start') {
            top = triggerRect.top
          }
          else if (alignment === 'end') {
            top = triggerRect.bottom - popperRect.height
          }
        }
      }

      // 边界检测和调整
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      if (left < 0)
        left = 8
      if (left + popperRect.width > viewport.width) {
        left = viewport.width - popperRect.width - 8
      }
      if (top < 0)
        top = 8
      if (top + popperRect.height > viewport.height) {
        top = viewport.height - popperRect.height - 8
      }

      popperRef.value.style.top = `${top}px`
      popperRef.value.style.left = `${left}px`
    }

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

      if (props.showAfter > 0) {
        showTimer.value = window.setTimeout(() => {
          emit('before-show')
          if (!isControlled.value) {
            visible.value = true
          }
          emit('update:visible', true)
          nextTick(() => {
            calculatePosition()
            emit('show')
          })
        }, props.showAfter)
      }
      else {
        emit('before-show')
        if (!isControlled.value) {
          visible.value = true
        }
        emit('update:visible', true)
        nextTick(() => {
          calculatePosition()
          emit('show')
        })
      }
    }

    const doHide = () => {
      clearTimers()

      if (props.hideAfter > 0 && props.trigger !== 'click') {
        hideTimer.value = window.setTimeout(() => {
          emit('before-hide')
          if (!isControlled.value) {
            visible.value = false
          }
          emit('update:visible', false)
          emit('hide')
        }, props.hideAfter)
      }
      else {
        emit('before-hide')
        if (!isControlled.value) {
          visible.value = false
        }
        emit('update:visible', false)
        emit('hide')
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

    // 监听窗口大小变化
    const handleResize = () => {
      if (actualVisible.value) {
        calculatePosition()
      }
    }

    // 生命周期
    onMounted(() => {
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize)
    })

    onUnmounted(() => {
      clearTimers()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    })

    // 监听 visible prop 变化
    watch(() => props.visible, (newVal) => {
      if (newVal !== undefined) {
        if (newVal) {
          nextTick(() => {
            calculatePosition()
          })
        }
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

      return <div class={arrowClass}></div>
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
                position: 'fixed',
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
