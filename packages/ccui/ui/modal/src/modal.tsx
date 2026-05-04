import type { ModalProps } from './modal-types'
import { computed, defineComponent, onBeforeUnmount, ref, Teleport, Transition, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { modalProps } from './modal-types'
import './modal.scss'

export default defineComponent({
  name: 'CModal',
  props: modalProps,
  emits: ['update:visible', 'ok', 'cancel', 'close', 'open', 'opened', 'closed'],
  setup(props: ModalProps, { emit, slots }) {
    const ns = useNamespace('modal')
    const rendered = ref(props.visible)

    const widthStyle = computed(() => {
      const w = props.width
      return typeof w === 'number' ? `${w}px` : String(w)
    })

    const close = () => {
      emit('update:visible', false)
      emit('close')
    }

    const onOk = (e: MouseEvent) => {
      emit('ok', e)
    }

    const onCancel = (e: MouseEvent) => {
      emit('cancel', e)
      close()
    }

    const onMaskClick = () => {
      if (props.maskClosable) {
        close()
      }
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.closeOnEsc && props.visible) {
        close()
      }
    }

    const lockScroll = () => {
      const body = document.body
      if (body.dataset.ccuiModalCount) {
        body.dataset.ccuiModalCount = String(Number(body.dataset.ccuiModalCount) + 1)
        return
      }
      body.dataset.ccuiModalCount = '1'
      body.dataset.ccuiOriginalOverflow = body.style.overflow
      body.style.overflow = 'hidden'
    }
    const unlockScroll = () => {
      const body = document.body
      const count = Number(body.dataset.ccuiModalCount ?? 0) - 1
      if (count <= 0) {
        body.style.overflow = body.dataset.ccuiOriginalOverflow ?? ''
        delete body.dataset.ccuiModalCount
        delete body.dataset.ccuiOriginalOverflow
      } else {
        body.dataset.ccuiModalCount = String(count)
      }
    }

    watch(
      () => props.visible,
      (val) => {
        if (val) {
          rendered.value = true
          lockScroll()
          document.addEventListener('keydown', onKeydown)
          emit('open')
        } else {
          document.removeEventListener('keydown', onKeydown)
          unlockScroll()
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeydown)
      if (props.visible) {
        unlockScroll()
      }
    })

    const onAfterEnter = () => emit('opened')
    const onAfterLeave = () => {
      if (props.destroyOnClose) {
        rendered.value = false
      }
      emit('closed')
    }

    return () => {
      const wrapStyle = { zIndex: props.zIndex }
      const dialogStyle = { width: widthStyle.value }

      const dialog = (
        <div class={[ns.b(), props.centered && ns.m('centered')]} style={wrapStyle} aria-modal="true" role="dialog">
          <Transition name={`${ns.b()}-mask-fade`}>
            {props.mask && props.visible && <div class={ns.e('mask')} onClick={onMaskClick} />}
          </Transition>
          <Transition name={`${ns.b()}-zoom`} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
            {props.visible && (
              <div
                class={ns.e('wrap')}
                onClick={(e: MouseEvent) => {
                  if (e.target === e.currentTarget && props.maskClosable && !props.mask) {
                    close()
                  }
                }}
              >
                <div class={ns.e('content')} style={dialogStyle}>
                  {props.closable && (
                    <button class={ns.e('close')} aria-label="Close" onClick={close}>
                      <span>×</span>
                    </button>
                  )}
                  {(props.title || slots.title) && (
                    <div class={ns.e('header')}>
                      <div class={ns.e('title')}>{slots.title ? slots.title() : props.title}</div>
                    </div>
                  )}
                  <div class={ns.e('body')}>{slots.default?.()}</div>
                  {!props.hideFooter && (
                    <div class={ns.e('footer')}>
                      {slots.footer ? (
                        slots.footer({ ok: onOk, cancel: onCancel })
                      ) : (
                        <>
                          <button class={[ns.e('btn'), ns.em('btn', 'cancel')]} onClick={onCancel}>
                            {props.cancelText}
                          </button>
                          <button
                            class={[ns.e('btn'), ns.em('btn', props.okType), props.okLoading && ns.is('loading')]}
                            disabled={props.okLoading}
                            onClick={onOk}
                          >
                            {props.okLoading && <span class={ns.e('spinner')} />}
                            {props.okText}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Transition>
        </div>
      )

      if (props.destroyOnClose && !rendered.value) {
        return null
      }

      return props.appendToBody ? <Teleport to="body">{dialog}</Teleport> : dialog
    }
  },
})
