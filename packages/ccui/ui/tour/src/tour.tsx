import type { Placement } from '@floating-ui/vue'
import type { CSSProperties, VNode } from 'vue'
import type { TourPlacement, TourProps } from './tour-types'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { computed, defineComponent, h, onBeforeUnmount, ref, shallowRef, Teleport, Transition, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { resolveTarget, tourProps } from './tour-types'

import './tour.scss'

const PLACEMENT_TO_FLOATING: Record<TourPlacement, Placement> = {
  top: 'top',
  topLeft: 'top-start',
  topRight: 'top-end',
  bottom: 'bottom',
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  left: 'left',
  leftTop: 'left-start',
  leftBottom: 'left-end',
  right: 'right',
  rightTop: 'right-start',
  rightBottom: 'right-end',
}

interface TargetRect {
  top: number
  left: number
  width: number
  height: number
}

export default defineComponent({
  name: 'CTour',
  props: tourProps,
  emits: ['update:open', 'update:current', 'change', 'close', 'finish'],
  setup(props: TourProps, { emit }) {
    const ns = useNamespace('tour')
    const targetRef = shallowRef<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const targetRect = shallowRef<TargetRect | null>(null)

    const total = computed(() => props.steps.length)
    const currentStep = computed(() => props.steps[props.current] ?? null)
    const isLastStep = computed(() => props.current >= total.value - 1)
    const isFirstStep = computed(() => props.current <= 0)

    const stepPlacement = computed<TourPlacement>(() => currentStep.value?.placement ?? props.placement)
    const floatingPlacement = computed(() => PLACEMENT_TO_FLOATING[stepPlacement.value])

    const showMask = computed(() => {
      const stepMask = currentStep.value?.mask
      return stepMask !== undefined ? stepMask : props.mask
    })

    function refreshTarget() {
      if (!props.open || !currentStep.value) {
        targetRef.value = null
        targetRect.value = null
        return
      }
      const el = resolveTarget(currentStep.value.target)
      targetRef.value = el
      if (el) {
        // scrollIntoView if needed
        if (props.scrollIntoViewIfNeeded) {
          const rect = el.getBoundingClientRect()
          const inViewport = rect.top >= 0 && rect.bottom <= window.innerHeight
          if (!inViewport && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
        const r = el.getBoundingClientRect()
        targetRect.value = { top: r.top, left: r.left, width: r.width, height: r.height }
      } else {
        targetRect.value = null
      }
    }

    watch(
      () => [props.open, props.current, props.steps],
      () => refreshTarget(),
      { immediate: true, deep: true },
    )

    const { floatingStyles } = useFloating(targetRef, popupRef, {
      placement: floatingPlacement as never,
      whileElementsMounted: autoUpdate,
      middleware: [offset(12), flip(), shift({ padding: 8 })],
      strategy: 'fixed',
    })

    function setOpen(open: boolean) {
      emit('update:open', open)
    }
    function setCurrent(next: number) {
      emit('update:current', next)
      emit('change', next)
    }

    function next() {
      if (isLastStep.value) {
        emit('finish')
        setOpen(false)
        return
      }
      setCurrent(props.current + 1)
    }
    function prev() {
      if (isFirstStep.value) return
      setCurrent(props.current - 1)
    }
    function close() {
      emit('close')
      setOpen(false)
    }

    function onKeydown(e: KeyboardEvent) {
      if (!props.open) return
      if (props.closeOnEsc && e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', onKeydown)
    }
    onBeforeUnmount(() => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', onKeydown)
      }
    })

    function renderMask(): VNode | null {
      if (!showMask.value) return null
      const rect = targetRect.value
      if (!rect || rect.width === 0 || rect.height === 0) {
        return <div class={[ns.e('mask'), ns.em('mask', 'full')]} onClick={close} />
      }
      // 4 块 mask 围出 target 的镂空区域
      const top: CSSProperties = { top: 0, left: 0, right: 0, height: `${Math.max(0, rect.top)}px` }
      const bottom: CSSProperties = {
        top: `${rect.top + rect.height}px`,
        left: 0,
        right: 0,
        bottom: 0,
      }
      const left: CSSProperties = {
        top: `${rect.top}px`,
        left: 0,
        width: `${Math.max(0, rect.left)}px`,
        height: `${rect.height}px`,
      }
      const right: CSSProperties = {
        top: `${rect.top}px`,
        left: `${rect.left + rect.width}px`,
        right: 0,
        height: `${rect.height}px`,
      }
      const highlight: CSSProperties = {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }
      return (
        <>
          <div class={[ns.e('mask'), ns.em('mask', 'panel')]} style={top} onClick={close} />
          <div class={[ns.e('mask'), ns.em('mask', 'panel')]} style={bottom} onClick={close} />
          <div class={[ns.e('mask'), ns.em('mask', 'panel')]} style={left} onClick={close} />
          <div class={[ns.e('mask'), ns.em('mask', 'panel')]} style={right} onClick={close} />
          <div class={ns.e('highlight')} style={highlight} aria-hidden="true" />
        </>
      )
    }

    function renderPopup(): VNode {
      const step = currentStep.value!
      const hasTarget = !!targetRef.value
      const styles: CSSProperties = hasTarget
        ? (floatingStyles.value as CSSProperties)
        : {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }
      styles.maxWidth = `${props.panelWidth}px`
      const panelCls = [ns.e('panel'), props.type === 'primary' ? ns.em('panel', 'primary') : '']
      const coverContent = step.cover ? (
        typeof step.cover === 'string' ? (
          <div class={ns.e('cover')}>
            <img src={step.cover} alt="" />
          </div>
        ) : (
          <div class={ns.e('cover')}>{step.cover}</div>
        )
      ) : null
      return (
        <div ref={popupRef} class={panelCls} style={styles} role="dialog" aria-modal="true">
          {props.arrow && hasTarget && <div class={[ns.e('arrow'), ns.em('arrow', stepPlacement.value)]} />}
          <button type="button" class={ns.e('close')} aria-label="close" onClick={close}>
            ✕
          </button>
          {coverContent}
          <div class={ns.e('title')}>{step.title}</div>
          {step.description && <div class={ns.e('description')}>{step.description}</div>}
          <div class={ns.e('footer')}>
            <span class={ns.e('indicator')}>
              {props.current + 1} / {total.value}
            </span>
            <div class={ns.e('actions')}>
              {!isFirstStep.value && (
                <button type="button" class={[ns.e('btn'), ns.em('btn', 'prev')]} onClick={prev}>
                  {props.prevText}
                </button>
              )}
              <button type="button" class={[ns.e('btn'), ns.em('btn', 'next')]} onClick={next}>
                {isLastStep.value ? props.finishText : props.nextText}
              </button>
            </div>
          </div>
        </div>
      )
    }

    return () => {
      if (!props.open || !currentStep.value) return null
      return (
        <Teleport to="body">
          <Transition name="ccui-tour-fade" appear>
            <div class={[ns.b(), ns.em('type', props.type)]} role="presentation">
              {renderMask()}
              {renderPopup()}
            </div>
          </Transition>
        </Teleport>
      )
    }
  },
})
