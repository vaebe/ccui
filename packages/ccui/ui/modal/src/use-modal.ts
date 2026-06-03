import type { Component } from 'vue'
import type { ModalFuncOptions, ModalFuncReturn } from './confirm-types'
import { defineComponent, getCurrentInstance } from 'vue'
import { modalFunc } from './confirm'

export interface UseModalReturn {
  modal: {
    confirm: (options?: ModalFuncOptions) => ModalFuncReturn
    info: (options?: ModalFuncOptions) => ModalFuncReturn
    success: (options?: ModalFuncOptions) => ModalFuncReturn
    error: (options?: ModalFuncOptions) => ModalFuncReturn
    warning: (options?: ModalFuncOptions) => ModalFuncReturn
  }
  holder: Component
}

/**
 * `useModal()`：返回 `{ modal, holder }` 对象（**不是** React `[modal, contextHolder]` 元组）。
 *
 * - `holder` 是 Vue 组件，必须挂到模板中：`<component :is="holder" />`
 * - `modal.confirm({...})` 等命令式调用会继承调用组件树的 provide / ConfigProvider / 主题 / locale 等 inject
 * - 与全局 `Modal.confirm` 的最大差异：全局版走独立 `createApp`，拿不到调用方 app 的 inject 链
 *
 * @example
 * ```vue
 * <script setup>
 * const { modal, holder } = useModal()
 * function ask() {
 *   modal.confirm({ title: '?', content: '确定要这么做？', onOk: () => fetch('/delete') })
 * }
 * </script>
 * <template>
 *   <component :is="holder" />
 *   <button @click="ask">删除</button>
 * </template>
 * ```
 */
export function useModal(): UseModalReturn {
  // 捕获 setup 时的调用组件 instance；后续 confirm() 调用时**懒读** inst.provides。
  // 关键：Vue 的 provide() 走 copy-on-write—— Options API `provide()` 会把 instance.provides 替换为
  // 一个新对象（parent.provides 作 prototype）。如果在 setup 阶段就把 instance.provides 缓存下来，
  // 拿到的是旧引用，看不到 Options API 后注入的 key。改在 confirm() 调用时读才能拿到最终态。
  // 类型上 ComponentInternalInstance 不暴露 provides；用结构化抽取 + 内部断言一次
  const inst = getCurrentInstance() as
    | (NonNullable<ReturnType<typeof getCurrentInstance>> & { provides?: Record<string | symbol, unknown> })
    | null

  const callWithCtx = (options: ModalFuncOptions, type?: ModalFuncOptions['type']) =>
    modalFunc(
      { ...(type ? { type } : {}), ...options },
      {
        provides: inst?.provides,
        appContext: inst?.appContext,
      },
    )

  const modal = {
    confirm: (options: ModalFuncOptions = {}) => callWithCtx(options, 'confirm'),
    info: (options: ModalFuncOptions = {}) => callWithCtx(options, 'info'),
    success: (options: ModalFuncOptions = {}) => callWithCtx(options, 'success'),
    error: (options: ModalFuncOptions = {}) => callWithCtx(options, 'error'),
    warning: (options: ModalFuncOptions = {}) => callWithCtx(options, 'warning'),
  }

  // holder 本身不渲染任何 DOM。useModal 在 setup 阶段已经通过 getCurrentInstance 捕获了父链 provides，
  // 后续 confirm 调用都共享该闭包；按 API 形状统一仍要求用户挂 <component :is="holder" />（与 useMessage / useNotification 一致）。
  const holder = defineComponent({
    name: 'CModalHolder',
    setup() {
      return () => null
    },
  })

  return { modal, holder }
}
