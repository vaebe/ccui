import type { PopconfirmProps } from './popconfirm-types'
import { computed, defineComponent, getCurrentInstance, ref, watch } from 'vue'
import { useConfig } from '../../config-provider/src/config-provider'
import Popover from '../../popover/src/popover'
import { isPropExplicit, warnDeprecated } from '../../shared/utils/deprecated'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { popconfirmProps } from './popconfirm-types'
import './popconfirm.scss'

export default defineComponent({
  name: 'CPopconfirm',
  props: popconfirmProps,
  emits: ['confirm', 'cancel', 'update:visible', 'update:open'],
  setup(props: PopconfirmProps, { emit, slots }) {
    const ns = useNamespace('popconfirm')
    const cfg = useConfig()

    // M-A5：旧 prop 一次性 deprecation warn（全局 per-key 一次）
    const rawProps = getCurrentInstance()?.vnode.props as Record<string, unknown> | undefined
    if (isPropExplicit(rawProps, 'visible', 'visible')) {
      warnDeprecated('visible', 'open（v-model:open）', 'Popconfirm')
    }
    if (isPropExplicit(rawProps, 'confirmText', 'confirm-text')) {
      warnDeprecated('confirmText', 'okText', 'Popconfirm')
    }
    if (isPropExplicit(rawProps, 'confirmType', 'confirm-type')) {
      warnDeprecated('confirmType', 'okType', 'Popconfirm')
    }

    // 同义 prop 解析：okText > confirmText、okType > confirmType、open > visible
    const confirmTextResolved = computed(() => props.okText || props.confirmText)
    const confirmTextLocal = computed(() => confirmTextResolved.value || cfg.locale?.Popconfirm?.okText || '确 定')
    const cancelTextLocal = computed(() => props.cancelText || cfg.locale?.Popconfirm?.cancelText || '取 消')
    const confirmTypeResolved = computed(() => props.okType || props.confirmType)

    const externalOpen = computed(() => (props.open !== undefined ? props.open : props.visible))

    const popoverRef = ref<{ hide?: () => void } | null>(null)
    const innerVisible = ref(false)

    const isControlled = computed(() => externalOpen.value !== undefined)
    const popoverVisible = computed(() => (isControlled.value ? externalOpen.value : innerVisible.value))

    watch(externalOpen, (val) => {
      if (val !== undefined) {
        innerVisible.value = !!val
      }
    })

    const close = () => {
      if (!isControlled.value) {
        innerVisible.value = false
      }
      emit('update:visible', false)
      emit('update:open', false)
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
        open={popoverVisible.value}
        width={props.width}
        overlayClassName={ns.b()}
        arrow={true}
        onUpdate:open={(val: boolean) => {
          if (!isControlled.value) {
            innerVisible.value = val
          }
          emit('update:visible', val)
          emit('update:open', val)
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
                      {cancelTextLocal.value}
                    </button>
                    <button class={[ns.e('btn'), ns.em('btn', confirmTypeResolved.value)]} onClick={onConfirm}>
                      {confirmTextLocal.value}
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
