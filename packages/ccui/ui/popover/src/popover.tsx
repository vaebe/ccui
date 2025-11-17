import type { PopoverProps } from './popover-types'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, Teleport, Transition, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { popoverProps } from './popover-types'
import './popover.scss'

let popoverIdCounter = 0

export default defineComponent({
  name: 'CPopover',
  props: popoverProps,
  emits: ['before-show', 'show', 'before-hide', 'hide', 'update:visible', 'before-enter', 'after-enter', 'before-leave', 'after-leave'],
  setup(props: PopoverProps, { emit, slots, expose }) {
    const ns = useNamespace('popover')
    const popperId = `${ns.e('popper')}-${++popoverIdCounter}`

    const visible = ref(false)
    const triggerRef = ref<HTMLElement>()
    const popperRef = ref<HTMLElement>()
    const arrowRef = ref<HTMLElement>()
    const showTimer = ref<number>()
    const hideTimer = ref<number>()
    const autoCloseTimer = ref<number>()

    const isControlled = computed(() => props.visible !== undefined)
    const actualVisible = computed(() => {
      const val = isControlled.value ? props.visible : visible.value
      return Boolean(val)
    })

    // 虚拟触发支持
    const actualTriggerRef = computed(() => {
      if (props.virtualTriggering && props.virtualRef) {
        return props.virtualRef
      }
      return triggerRef.value
    })

    const popperClass = computed(() => {
      return [
        ns.e('popper'),
        ns.em('popper', props.effect),
        ns.em('popper', props.placement.split('-')[0]),
        props.popperClass,
      ].filter(Boolean).join(' ')
    })

    const { floatingStyles, middlewareData, update } = useFloating(
      computed(() => actualTriggerRef.value),
      popperRef,
      {
        placement: props.placement as any,
        middleware: [
          offset(props.offset),
          flip(),
          shift({ padding: 8 }),
          ...(props.showArrow ? [arrow({ element: arrowRef })] : []),
        ],
      },
    )

    const arrowStyles = computed(() => {
      if (!props.showArrow || !middlewareData.value.arrow)
        return {}
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

    const clearTimers = () => {
      if (showTimer.value) {
        clearTimeout(showTimer.value)
        showTimer.value = undefined
      }
      if (hideTimer.value) {
        clearTimeout(hideTimer.value)
        hideTimer.value = undefined
      }
      if (autoCloseTimer.value) {
        clearTimeout(autoCloseTimer.value)
        autoCloseTimer.value = undefined
      }
    }

    const doHide = () => {
      clearTimers()
      const hidePopover = () => {
        emit('before-hide')
        if (!isControlled.value) {
          visible.value = false
        }
        emit('update:visible', false)
        emit('hide')
      }
      if (props.hideAfter > 0 && props.trigger !== 'click') {
        hideTimer.value = window.setTimeout(hidePopover, props.hideAfter)
      }
      else {
        hidePopover()
      }
    }

    const doShow = () => {
      if (props.disabled)
        return
      clearTimers()
      const showPopover = () => {
        emit('before-show')
        if (!isControlled.value) {
          visible.value = true
        }
        emit('update:visible', true)
        nextTick(() => {
          update()
          emit('show')
          // 设置自动关闭定时器
          if (props.autoClose > 0) {
            autoCloseTimer.value = window.setTimeout(() => {
              doHide()
            }, props.autoClose)
          }
        })
      }
      if (props.showAfter > 0) {
        showTimer.value = window.setTimeout(showPopover, props.showAfter)
      }
      else {
        showPopover()
      }
    }

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
    const handleContextMenu = (e: MouseEvent) => {
      if (props.trigger === 'contextmenu') {
        e.preventDefault()
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
    const normalizeTriggerKey = (value: string) => {
      if (!value)
        return value
      const lower = value.toLowerCase()
      if (value === ' ' || lower === 'space' || lower === 'spacebar')
        return 'Space'
      return value
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (props.trigger !== 'focus')
        return

      const normalizedEventKey = normalizeTriggerKey(e.key)
      const matches = props.triggerKeys
        .map(normalizeTriggerKey)
        .includes(normalizedEventKey)

      if (!matches)
        return

      e.preventDefault()
      if (actualVisible.value) {
        doHide()
      }
      else {
        doShow()
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

    let cleanup: (() => void) | undefined

    onMounted(() => {
    // 初始化时如果 visible 为 true，确保显示
      if (props.visible) {
        nextTick(() => {
          const triggerElement = actualTriggerRef.value
          if (triggerElement && popperRef.value) {
            cleanup = autoUpdate(triggerElement, popperRef.value, update)
          }
        })
      }
    })
    const rootClass = computed(() => {
      return [ns.b(), props.disabled ? ns.m('disabled') : ''].filter(Boolean).join(' ')
    })
    const onDocumentMouseDown = (e: MouseEvent) => {
      if (!actualVisible.value)
        return
      if (props.trigger === 'manual')
        return
      if (!props.hideOnClickOutside)
        return
      const rawTarget = e.target as any
      const target: Node | null = rawTarget instanceof Node ? rawTarget : null
      const triggerElement = props.virtualTriggering && props.virtualRef ? props.virtualRef : triggerRef.value
      const inTrigger = !!(target && triggerElement && triggerElement.contains(target))
      const inPopper = !!(target && popperRef.value && popperRef.value.contains(target))
      if (!inTrigger && !inPopper) {
        doHide()
      }
    }
    const onDocumentKeydown = (e: KeyboardEvent) => {
      if (!actualVisible.value)
        return
      if (props.trigger === 'manual')
        return
      if (!props.closeOnEsc)
        return
      if (e.key === 'Escape') {
        doHide()
      }
    }
    onUnmounted(() => {
      clearTimers()
      cleanup?.()
      window.removeEventListener('mousedown', onDocumentMouseDown, true)
      window.removeEventListener('keydown', onDocumentKeydown, true)

      // 清理虚拟触发元素的事件监听
      if (props.virtualTriggering && props.virtualRef) {
        const virtualEl = props.virtualRef
        virtualEl.removeEventListener('mouseenter', handleMouseEnter)
        virtualEl.removeEventListener('mouseleave', handleMouseLeave)
        virtualEl.removeEventListener('click', handleClick)
        virtualEl.removeEventListener('focus', handleFocus)
        virtualEl.removeEventListener('blur', handleBlur)
        virtualEl.removeEventListener('keydown', handleKeydown)
        virtualEl.removeEventListener('contextmenu', handleContextMenu)
      }
    })
    watch(() => props.visible, (newVal) => {
      if (isControlled.value) {
        const boolVal = Boolean(newVal)
        if (boolVal !== visible.value) {
          visible.value = boolVal
          if (boolVal) {
            nextTick(() => {
              update()
            })
          }
        }
      }
    })
    watch(actualVisible, (newVal) => {
      if (newVal) {
        const triggerElement = actualTriggerRef.value
        if (triggerElement && popperRef.value) {
          cleanup?.()
          cleanup = autoUpdate(triggerElement, popperRef.value, update)
        }
        window.addEventListener('mousedown', onDocumentMouseDown, true)
        window.addEventListener('keydown', onDocumentKeydown, true)
      }
      else {
        cleanup?.()
        window.removeEventListener('mousedown', onDocumentMouseDown, true)
        window.removeEventListener('keydown', onDocumentKeydown, true)
      }
    })

    const renderArrow = () => {
      if (!props.showArrow)
        return null
      const arrowClass = [ns.e('arrow'), ns.em('arrow', props.placement.split('-')[0])].join(' ')
      return <div ref={arrowRef} class={arrowClass} style={arrowStyles.value}></div>
    }

    const renderHeader = () => {
      const hasTitleSlot = !!slots.title
      const hasTitleProp = !!props.title
      if (!hasTitleSlot && !hasTitleProp)
        return null
      return (
        <div class={ns.e('header')}>
          {slots.title ? slots.title() : props.title}
        </div>
      )
    }

    const renderContent = () => {
      if (props.rawContent) {
        return <div innerHTML={props.content}></div>
      }
      if (slots.content) {
        return slots.content()
      }
      return props.content
    }

    // 暴露方法
    expose({
      hide: doHide,
    })

    return () => {
      const triggerEvents: Record<string, any> = {}
      if (!props.virtualTriggering) {
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
          triggerEvents.onKeydown = handleKeydown
        }
        else if (props.trigger === 'contextmenu') {
          triggerEvents.onContextmenu = handleContextMenu
        }
      }

      const popperContent = (
        <div
          ref={popperRef}
          class={popperClass.value}
          role="dialog"
          id={popperId}
          style={{
            ...floatingStyles.value,
            zIndex: 2000,
            pointerEvents: props.enterable ? 'auto' : 'none',
            width: props.width || undefined,
          }}
          onMouseenter={handlePopperMouseEnter}
          onMouseleave={handlePopperMouseLeave}
        >
          {renderArrow()}
          {renderHeader()}
          <div class={ns.e('content')}>
            {renderContent()}
          </div>
        </div>
      )

      return (
        <div class={rootClass.value}>
          {!props.virtualTriggering && (
            <div
              ref={triggerRef}
              class={ns.e('trigger')}
              aria-describedby={actualVisible.value ? popperId : undefined}
              aria-label={props.ariaLabel}
              tabindex={props.trigger === 'focus' ? props.tabindex : undefined}
              {...triggerEvents}
            >
              {slots.default?.()}
            </div>
          )}

          {props.virtualTriggering && slots.default?.()}

          <Transition
            name={props.transition}
            onBeforeEnter={() => emit('before-enter')}
            onAfterEnter={() => emit('after-enter')}
            onBeforeLeave={() => emit('before-leave')}
            onAfterLeave={() => emit('after-leave')}
          >
            {actualVisible.value && (props.teleported
              ? <Teleport to="body">{popperContent}</Teleport>
              : popperContent
            )}
          </Transition>
        </div>
      )
    }
  },
})
