import type { PopoverProps } from './popover-types'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { popoverProps } from './popover-types'
import './popover.scss'

export default defineComponent({
  name: 'CPopover',
  props: popoverProps,
  emits: ['before-show', 'show', 'before-hide', 'hide', 'update:visible'],
  setup(props: PopoverProps, { emit, slots }) {
    const ns = useNamespace('popover')

    const visible = ref(false)
    const triggerRef = ref<HTMLElement>()
    const popperRef = ref<HTMLElement>()
    const arrowRef = ref<HTMLElement>()
    const showTimer = ref<number>()
    const hideTimer = ref<number>()

    const isControlled = computed(() => props.visible !== undefined)
    const actualVisible = computed(() => (isControlled.value ? props.visible : visible.value))

    const popperClass = computed(() => {
      return [
        ns.e('popper'),
        ns.em('popper', props.effect),
        ns.em('popper', props.placement.split('-')[0]),
        props.popperClass,
      ].filter(Boolean).join(' ')
    })

    const { floatingStyles, middlewareData, update } = useFloating(triggerRef, popperRef, {
      placement: props.placement as any,
      middleware: [
        offset(props.offset),
        flip(),
        shift({ padding: 8 }),
        ...(props.showArrow ? [arrow({ element: arrowRef })] : []),
      ],
    })

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
        })
      }
      if (props.showAfter > 0) {
        showTimer.value = window.setTimeout(showPopover, props.showAfter)
      }
      else {
        showPopover()
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

    let cleanup: (() => void) | undefined

    onMounted(() => {
      if (actualVisible.value && triggerRef.value && popperRef.value) {
        cleanup = autoUpdate(triggerRef.value, popperRef.value, update)
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
      const inTrigger = !!(target && triggerRef.value && triggerRef.value.contains(target))
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
    })
    watch(() => props.visible, (newVal) => {
      if (newVal !== undefined && newVal) {
        nextTick(() => {
          update()
        })
      }
    })
    watch(actualVisible, (newVal) => {
      if (newVal) {
        if (triggerRef.value && popperRef.value) {
          cleanup?.()
          cleanup = autoUpdate(triggerRef.value, popperRef.value, update)
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
        <div class={rootClass.value}>
          <div
            ref={triggerRef}
            class={ns.e('trigger')}
            aria-describedby={actualVisible.value ? ns.e('popper') : undefined}
            aria-label={props.ariaLabel}
            tabindex={props.trigger === 'focus' ? 0 : undefined}
            {...triggerEvents}
          >
            {slots.default?.()}
          </div>

          {actualVisible.value && (
            <div
              ref={popperRef}
              class={popperClass.value}
              role="dialog"
              id={ns.e('popper')}
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
          )}
        </div>
      )
    }
  },
})
