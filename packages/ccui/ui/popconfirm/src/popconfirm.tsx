import type { PopconfirmProps } from './popconfirm-types'
import { computed, defineComponent, ref, watch } from 'vue'
import Popover from '../../popover/src/popover'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { popconfirmProps } from './popconfirm-types'
import './popconfirm.scss'

export default defineComponent({
  name: 'CPopconfirm',
  props: popconfirmProps,
  emits: ['confirm', 'cancel', 'update:visible'],
  setup(props: PopconfirmProps, { emit, slots }) {
    const ns = useNamespace('popconfirm')

    const popoverRef = ref<{ hide?: () => void } | null>(null)
    const innerVisible = ref(false)

    const isControlled = computed(() => props.visible !== undefined)
    const popoverVisible = computed(() => (isControlled.value ? props.visible : innerVisible.value))

    watch(
      () => props.visible,
      (val) => {
        if (val !== undefined) {
          innerVisible.value = !!val
        }
      },
    )

    const close = () => {
      if (!isControlled.value) {
        innerVisible.value = false
      }
      emit('update:visible', false)
      popoverRef.value?.hide?.()
    }

    const onConfirm = (e: MouseEvent) => {
      emit('confirm', e)
      close()
    }
    const onCancel = (e: MouseEvent) => {
      emit('cancel', e)
      close()
    }

    return () => (
      <Popover
        ref={popoverRef}
        trigger={props.trigger}
        placement={props.placement}
        disabled={props.disabled}
        visible={popoverVisible.value}
        width={props.width}
        popperClass={ns.b()}
        showArrow={true}
        onUpdate:visible={(val: boolean) => {
          if (!isControlled.value) {
            innerVisible.value = val
          }
          emit('update:visible', val)
        }}
        v-slots={{
          default: () => slots.default?.(),
          content: () => (
            <div class={ns.e('inner')}>
              <div class={ns.e('header')}>
                {!props.hideIcon && (
                  <span class={ns.e('icon')} style={{ color: props.iconColor }}>
                    {props.icon ? <i class={props.icon} /> : <span class={ns.e('warning')}>!</span>}
                  </span>
                )}
                <div class={ns.e('text')}>
                  <div class={ns.e('title')}>{slots.title ? slots.title() : props.title}</div>
                  {(props.description || slots.description) && (
                    <div class={ns.e('description')}>{slots.description ? slots.description() : props.description}</div>
                  )}
                </div>
              </div>
              <div class={ns.e('actions')}>
                {slots.actions ? (
                  slots.actions({ confirm: onConfirm, cancel: onCancel })
                ) : (
                  <>
                    <button class={[ns.e('btn'), ns.em('btn', 'cancel')]} onClick={onCancel}>
                      {props.cancelText}
                    </button>
                    <button class={[ns.e('btn'), ns.em('btn', props.confirmType)]} onClick={onConfirm}>
                      {props.confirmText}
                    </button>
                  </>
                )}
              </div>
            </div>
          ),
        }}
      />
    )
  },
})
