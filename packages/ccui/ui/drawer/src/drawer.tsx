import type { CSSProperties } from 'vue'
import type { DrawerProps } from './drawer-types'
import { computed, defineComponent, onBeforeUnmount, ref, Teleport, Transition, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { drawerProps } from './drawer-types'
import './drawer.scss'

export default defineComponent({
  name: 'CDrawer',
  props: drawerProps,
  emits: ['update:visible', 'open', 'opened', 'close', 'closed'],
  setup(props: DrawerProps, { emit, slots }) {
    const ns = useNamespace('drawer')
    const rendered = ref(props.visible)

    const isHorizontal = computed(() => props.placement === 'left' || props.placement === 'right')

    const sizeStyle = computed<CSSProperties>(() => {
      const size = typeof props.size === 'number' ? `${props.size}px` : String(props.size)
      return isHorizontal.value ? { width: size } : { height: size }
    })

    const close = () => {
      emit('update:visible', false)
      emit('close')
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
      if (body.dataset.ccuiDrawerCount) {
        body.dataset.ccuiDrawerCount = String(Number(body.dataset.ccuiDrawerCount) + 1)
        return
      }
      body.dataset.ccuiDrawerCount = '1'
      body.dataset.ccuiDrawerOverflow = body.style.overflow
      body.style.overflow = 'hidden'
    }
    const unlockScroll = () => {
      const body = document.body
      const count = Number(body.dataset.ccuiDrawerCount ?? 0) - 1
      if (count <= 0) {
        body.style.overflow = body.dataset.ccuiDrawerOverflow ?? ''
        delete body.dataset.ccuiDrawerCount
        delete body.dataset.ccuiDrawerOverflow
      } else {
        body.dataset.ccuiDrawerCount = String(count)
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
      const wrap = (
        <div class={[ns.b(), ns.m(props.placement)]} style={{ zIndex: props.zIndex }} aria-modal="true" role="dialog">
          <Transition name={`${ns.b()}-fade`}>
            {props.mask && props.visible && <div class={ns.e('mask')} onClick={onMaskClick} />}
          </Transition>
          <Transition name={`${ns.b()}-${props.placement}`} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
            {props.visible && (
              <div class={ns.e('content')} style={sizeStyle.value}>
                <div class={ns.e('inner')}>
                  {(props.title || slots.title || props.closable) && (
                    <div class={ns.e('header')}>
                      <div class={ns.e('title')}>{slots.title ? slots.title() : props.title}</div>
                      {props.closable && (
                        <button class={ns.e('close')} onClick={close} aria-label="Close">
                          <span>×</span>
                        </button>
                      )}
                    </div>
                  )}
                  <div class={ns.e('body')}>{slots.default?.()}</div>
                  {(props.showFooter || slots.footer) && <div class={ns.e('footer')}>{slots.footer?.()}</div>}
                </div>
              </div>
            )}
          </Transition>
        </div>
      )

      if (props.destroyOnClose && !rendered.value) {
        return null
      }

      return props.appendToBody ? <Teleport to="body">{wrap}</Teleport> : wrap
    }
  },
})
