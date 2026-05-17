import type { AppContext, VNode } from 'vue'
import type { ModalFuncOptions, ModalFuncReturn, ModalFuncType } from './confirm-types'
import { createApp, defineComponent, h, reactive, ref } from 'vue'
import { renderIconNode } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import Modal from './modal'

interface ParentContext {
  provides?: Record<string | symbol, unknown>
  appContext?: AppContext
}

const ICON_MAP: Record<ModalFuncType, string> = {
  confirm: '?',
  info: 'ⓘ',
  success: 'mdi:check-circle',
  error: 'mdi:close-circle',
  warning: '!',
}

function renderTypeIcon(type: ModalFuncType): VNode | string {
  const value = ICON_MAP[type]
  if (value.includes(':')) {
    return renderIconNode(value) ?? value
  }
  return value
}

const TYPE_OK_TYPE: Record<ModalFuncType, 'primary' | 'danger'> = {
  confirm: 'primary',
  info: 'primary',
  success: 'primary',
  error: 'danger',
  warning: 'primary',
}

// 模块级活跃实例集合，destroyAll 时统一收掉
const activeInstances = new Set<{ destroy: () => void }>()

/**
 * 渲染单个命令式 Modal。返回 destroy / update 句柄。
 *
 * - 默认 `type='confirm'` 显示 OK + Cancel；其他 type 单 OK 按钮
 * - `onOk` 返回 Promise 时按钮进入 loading，resolve 后关闭；reject 不关闭（错误传递给调用方）
 */
export function modalFunc(options: ModalFuncOptions = {}, parentCtx?: ParentContext): ModalFuncReturn {
  const state = reactive<ModalFuncOptions>({ type: 'confirm', ...options })
  const open = ref(true)
  const loading = ref(false)
  let appInstance: ReturnType<typeof createApp> | null = null
  let containerEl: HTMLElement | null = null

  const ns = useNamespace('modal-confirm')

  const handle: ModalFuncReturn = {
    destroy() {
      // 标记关闭；afterClose 钩子 + 卸载逻辑由 modal closed 事件触发
      open.value = false
    },
    update(updater) {
      const patch = typeof updater === 'function' ? updater({ ...state }) : updater
      Object.assign(state, patch)
    },
  }
  activeInstances.add(handle)

  const Inner = defineComponent({
    name: 'CModalConfirmInner',
    setup() {
      const onClosed = () => {
        // animation done → unmount + remove container
        try {
          state.afterClose?.()
        } catch {}
        if (appInstance) {
          appInstance.unmount()
          appInstance = null
        }
        if (containerEl && containerEl.parentNode) {
          containerEl.parentNode.removeChild(containerEl)
          containerEl = null
        }
        activeInstances.delete(handle)
      }

      const close = () => {
        open.value = false
      }

      const onOkClick = async () => {
        if (loading.value) return
        const result = state.onOk?.()
        if (result && typeof (result as Promise<unknown>).then === 'function') {
          loading.value = true
          try {
            await result
            close()
          } catch {
            // reject 不关闭，错误吞掉（由调用方自己处理）
          } finally {
            loading.value = false
          }
          return
        }
        close()
      }

      const onCancelClick = async () => {
        const result = state.onCancel?.()
        if (result && typeof (result as Promise<unknown>).then === 'function') {
          try {
            await result
            close()
          } catch {}
          return
        }
        close()
      }

      return () => {
        const type = state.type ?? 'confirm'
        const okType = state.okType ?? TYPE_OK_TYPE[type]
        const okText = state.okText ?? '确 定'
        const cancelText = state.cancelText ?? '取 消'

        const renderIcon = (): VNode => {
          if (state.icon === undefined) {
            return <span class={[ns.e('icon'), ns.em('icon', type)]}>{renderTypeIcon(type)}</span>
          }
          if (typeof state.icon === 'string') {
            return state.icon ? (
              <span class={[ns.e('icon'), ns.em('icon', type)]}>
                <i class={state.icon} />
              </span>
            ) : (
              <></>
            )
          }
          return <span class={[ns.e('icon'), ns.em('icon', type)]}>{state.icon as VNode}</span>
        }

        const body = (
          <div class={ns.b()}>
            {renderIcon()}
            <div class={ns.e('body')}>
              {state.title !== undefined && <div class={ns.e('title')}>{state.title as VNode | string}</div>}
              {state.content !== undefined && <div class={ns.e('content')}>{state.content as VNode | string}</div>}
            </div>
          </div>
        )

        const footer = (
          <div class={ns.e('footer')}>
            {type === 'confirm' && (
              <button class={['ccui-modal__btn', 'ccui-modal__btn--cancel']} onClick={onCancelClick}>
                {cancelText}
              </button>
            )}
            <button
              class={['ccui-modal__btn', `ccui-modal__btn--${okType}`, loading.value && 'is-loading']}
              disabled={loading.value}
              onClick={onOkClick}
            >
              {loading.value && <span class="ccui-modal__spinner" />}
              {okText}
            </button>
          </div>
        )

        return h(
          Modal,
          {
            visible: open.value,
            'onUpdate:visible': (v: boolean) => {
              open.value = v
            },
            width: state.width ?? 416,
            centered: state.centered ?? false,
            mask: state.mask ?? true,
            maskClosable: state.maskClosable ?? false,
            closeOnEsc: state.closeOnEsc ?? true,
            closable: state.closable ?? false,
            zIndex: state.zIndex,
            wrapClassName: state.wrapClassName,
            confirmLoading: loading.value,
            onClosed,
          },
          {
            default: () => body,
            footer: () => footer,
          },
        )
      }
    },
  })

  // 挂载到 body 上一个独立容器；继承 parentApp 的 context（如有）
  containerEl = document.createElement('div')
  containerEl.className = 'ccui-modal-confirm-host'
  document.body.appendChild(containerEl)
  appInstance = createApp(Inner)
  // 继承调用组件链 + 父 app 的 provides（让 inject 找得到 ConfigProvider / 主题 / locale 等）
  if (parentCtx?.provides) {
    appInstance._context.provides = { ...parentCtx.provides, ...appInstance._context.provides }
  }
  if (parentCtx?.appContext) {
    appInstance._context.components = {
      ...parentCtx.appContext.components,
      ...appInstance._context.components,
    }
    appInstance._context.directives = {
      ...parentCtx.appContext.directives,
      ...appInstance._context.directives,
    }
    // app-level provides 也合并一份（instance.provides 通常已包含，但显式 app.provide() 的部分这里兜底）
    appInstance._context.provides = {
      ...parentCtx.appContext.provides,
      ...appInstance._context.provides,
    }
  }
  appInstance.mount(containerEl)

  return handle
}

/** 销毁所有当前活跃的命令式 modal */
export function modalDestroyAll(): void {
  Array.from(activeInstances).forEach((it) => it.destroy())
}

export function createTypedFunc(type: ModalFuncType) {
  return (options: ModalFuncOptions = {}, parentCtx?: ParentContext): ModalFuncReturn =>
    modalFunc({ ...options, type }, parentCtx)
}
