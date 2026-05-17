import type { VNode } from 'vue'
import type { ModalClosableObject, ModalProps } from './modal-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, ref, Teleport, Transition, watch } from 'vue'
import { useConfig } from '../../config-provider/src/config-provider'
import { isPropExplicit, warnDeprecated } from '../../shared/utils/deprecated'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { modalProps } from './modal-types'
import './modal.scss'

function isIconifyName(name: string): boolean {
  return name.includes(':')
}

function isClosableObject(value: unknown): value is ModalClosableObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

let modalIdCounter = 0

export default defineComponent({
  name: 'CModal',
  props: modalProps,
  emits: ['update:visible', 'ok', 'cancel', 'close', 'open', 'opened', 'closed', 'after-open-change'],
  setup(props: ModalProps, { emit, slots }) {
    const ns = useNamespace('modal')
    const cfg = useConfig()
    const modalUid = ++modalIdCounter
    const titleId = `${ns.b()}-title-${modalUid}`
    const bodyId = `${ns.b()}-body-${modalUid}`

    // 旧 prop 一次性 deprecation warn（全局 per-key 一次）
    const rawProps = getCurrentInstance()?.vnode.props as Record<string, unknown> | undefined
    if (isPropExplicit(rawProps, 'okLoading', 'ok-loading')) {
      warnDeprecated('okLoading', 'confirmLoading', 'Modal')
    }
    if (isPropExplicit(rawProps, 'hideFooter', 'hide-footer')) {
      warnDeprecated('hideFooter', 'footer={null}', 'Modal')
    }

    const isOpen = computed(() => props.visible)

    // 触发节点：用于 focusTriggerAfterClose
    const trigger = ref<HTMLElement | null>(null)
    const rendered = ref(isOpen.value || props.keepAlive)

    // ── 解析 closable 复合对象 ────────────────────────────
    const closableObj = computed<ModalClosableObject | null>(() =>
      isClosableObject(props.closable) ? props.closable : null,
    )
    const closableEnabled = computed(() => {
      const v = props.closable
      return typeof v === 'boolean' ? v : v !== null && v !== undefined
    })
    const closeDisabled = computed(() => !!closableObj.value?.disabled)
    const closeAriaLabel = computed(() => closableObj.value?.ariaLabel || 'Close')

    const confirmLoadingEffective = computed(() =>
      props.confirmLoading !== undefined ? props.confirmLoading : props.okLoading,
    )

    // hideFooter（旧）+ footer=null（新）都视为隐藏
    const footerIsHidden = computed(() => {
      if (slots.footer) return false
      if (props.footer === null) return true
      return props.hideFooter
    })

    // ── 主题 / locale 文案 ───────────────────────────────
    const okTextLocal = computed(() => props.okText || cfg.locale?.Modal?.okText || '确 定')
    const cancelTextLocal = computed(() => props.cancelText || cfg.locale?.Modal?.cancelText || '取 消')

    const widthStyle = computed(() => {
      const w = props.width
      return typeof w === 'number' ? `${w}px` : String(w)
    })

    // ── 关闭流程 ────────────────────────────────────────
    const close = () => {
      if (closeDisabled.value) return
      emit('update:visible', false)
      emit('close')
    }

    const onOk = (e: MouseEvent) => emit('ok', e)
    const onCancel = (e: MouseEvent) => {
      emit('cancel', e)
      close()
    }

    const onMaskClick = () => {
      if (props.maskClosable) close()
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.closeOnEsc && isOpen.value) {
        close()
      }
    }

    // ── body scroll lock ────────────────────────────────
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
      isOpen,
      (val) => {
        if (val) {
          // 捕获触发节点
          if (typeof document !== 'undefined') {
            const active = document.activeElement
            if (active instanceof HTMLElement) trigger.value = active
          }
          rendered.value = true
          lockScroll()
          document.addEventListener('keydown', onKeydown)
          emit('open')
        } else {
          document.removeEventListener('keydown', onKeydown)
          unlockScroll()
        }
        emit('after-open-change', val)
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeydown)
      if (isOpen.value) unlockScroll()
    })

    const onAfterEnter = () => emit('opened')
    const onAfterLeave = () => {
      if (props.destroyOnClose && !props.keepAlive) {
        rendered.value = false
      }
      // 焦点还给触发节点
      if (props.focusTriggerAfterClose && trigger.value && document.body.contains(trigger.value)) {
        try {
          trigger.value.focus({ preventScroll: true })
        } catch {}
      }
      emit('closed')
    }

    // ── 渲染辅助 ─────────────────────────────────────────
    const renderCloseIcon = (): VNode => {
      if (slots['close-icon']) return <>{slots['close-icon']()}</>
      const icon = closableObj.value?.closeIcon
      if (!icon) return <span>×</span>
      if (typeof icon === 'string') {
        return isIconifyName(icon) ? <IconifyIcon icon={icon} /> : <i class={icon}></i>
      }
      return icon as VNode
    }

    const renderFooter = (): VNode | null => {
      if (footerIsHidden.value) return null

      const footerClass = [ns.e('footer'), props.classNames?.footer]
      const footerStyle = props.styles?.footer

      if (slots.footer) {
        return (
          <div class={footerClass} style={footerStyle}>
            {slots.footer({ ok: onOk, cancel: onCancel })}
          </div>
        )
      }

      if (typeof props.footer === 'string') {
        return (
          <div class={footerClass} style={footerStyle}>
            {props.footer}
          </div>
        )
      }
      if (props.footer && typeof props.footer === 'object') {
        return (
          <div class={footerClass} style={footerStyle}>
            {props.footer as VNode}
          </div>
        )
      }

      // 默认 ok / cancel 按钮
      return (
        <div class={footerClass} style={footerStyle}>
          <button class={[ns.e('btn'), ns.em('btn', 'cancel')]} onClick={onCancel}>
            {cancelTextLocal.value}
          </button>
          <button
            class={[ns.e('btn'), ns.em('btn', props.okType), confirmLoadingEffective.value && ns.is('loading')]}
            disabled={confirmLoadingEffective.value}
            onClick={onOk}
          >
            {confirmLoadingEffective.value && <span class={ns.e('spinner')} />}
            {okTextLocal.value}
          </button>
        </div>
      )
    }

    // ── 渲染容器决策 ─────────────────────────────────────
    const renderContainer = (dialog: VNode): VNode | null => {
      return props.appendToBody ? <Teleport to="body">{dialog}</Teleport> : dialog
    }

    return () => {
      const wrapStyle = { zIndex: props.zIndex }
      const dialogStyle = { width: widthStyle.value }

      const maskTransition = props.maskTransitionName || `${ns.b()}-mask-fade`
      const zoomTransition = props.transitionName || `${ns.b()}-zoom`

      const hasTitle = !!(props.title || slots.title)

      const dialog = (
        <div
          class={[ns.b(), props.centered && ns.m('centered'), props.wrapClassName, props.classNames?.root]}
          style={[wrapStyle, props.styles?.root] as any}
          aria-modal="true"
          role="dialog"
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={bodyId}
        >
          <Transition name={maskTransition}>
            {props.mask && isOpen.value && (
              <div class={[ns.e('mask'), props.classNames?.mask]} style={props.styles?.mask} onClick={onMaskClick} />
            )}
          </Transition>
          <Transition name={zoomTransition} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
            {isOpen.value && (
              <div
                class={[ns.e('wrap'), props.classNames?.wrap]}
                style={props.styles?.wrap}
                onClick={(e: MouseEvent) => {
                  if (e.target === e.currentTarget && props.maskClosable && !props.mask) {
                    close()
                  }
                }}
              >
                <div class={ns.e('content')} style={dialogStyle}>
                  {closableEnabled.value && (
                    <button
                      class={[ns.e('close'), closeDisabled.value && ns.is('disabled')]}
                      aria-label={closeAriaLabel.value}
                      disabled={closeDisabled.value}
                      onClick={close}
                    >
                      {renderCloseIcon()}
                    </button>
                  )}
                  {(props.title || slots.title) && (
                    <div class={[ns.e('header'), props.classNames?.header]} style={props.styles?.header}>
                      <div class={ns.e('title')} id={titleId}>
                        {slots.title ? slots.title() : props.title}
                      </div>
                    </div>
                  )}
                  <div class={[ns.e('body'), props.classNames?.body]} id={bodyId} style={props.styles?.body}>
                    {slots.default?.()}
                  </div>
                  {renderFooter()}
                </div>
              </div>
            )}
          </Transition>
        </div>
      )

      // destroyOnClose 与 keepAlive 互斥：keepAlive 始终保留 DOM
      if (props.destroyOnClose && !props.keepAlive && !rendered.value) {
        return null
      }

      return renderContainer(dialog)
    }
  },
})
