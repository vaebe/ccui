import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type ModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm'

/**
 * `closable` 复合配置（Ant Design v5+）：
 *
 * - `boolean`：显示/隐藏关闭按钮
 * - `{ closeIcon, disabled, ariaLabel }`：自定义关闭按钮
 *   - `closeIcon`：接 string（Iconify name）/ VNode；同时支持 `close-icon` slot 高优先级
 *   - `disabled`：禁用关闭按钮（仍渲染，但点击无效）
 *   - `ariaLabel`：自定义 aria-label
 */
export interface ModalClosableObject {
  closeIcon?: VNode | string
  disabled?: boolean
  ariaLabel?: string
}
export type ModalClosable = boolean | ModalClosableObject

/**
 * `getContainer` 函数签名（Ant Design）：返回浮层容器节点。
 * 优先级：显式 `getContainer` 函数 > 旧 `appendToBody` boolean。
 */
export type ModalGetContainer = (trigger: HTMLElement | null) => HTMLElement | null

export const modalProps = {
  /**
   * @deprecated 请改用 `open`（Ant Design 主名 + `v-model:open`）。下一大版本移除。
   */
  visible: {
    type: Boolean,
    default: false,
  },
  /**
   * Ant Design 主名：显示对话框。支持 `v-model:open`。
   * 显式 `open` 优先于 `visible`。
   */
  open: {
    type: Boolean,
    default: undefined,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 520,
  },
  /**
   * 关闭按钮配置。`boolean` 或 `{ closeIcon, disabled, ariaLabel }` 复合对象（Ant Design v5+）。
   */
  closable: {
    type: [Boolean, Object] as PropType<ModalClosable>,
    default: true,
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  /**
   * @deprecated 请改用 `keyboard`（Ant Design 主名）。下一大版本移除。
   */
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  /**
   * Ant Design 主名：是否支持键盘 Esc 关闭。显式 `keyboard` 优先于 `closeOnEsc`。
   */
  keyboard: {
    type: Boolean,
    default: undefined,
  },
  centered: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: Boolean,
    default: true,
  },
  // 不设字面量默认；运行时从 ConfigProvider.locale.Modal.okText / cancelText 取值。
  // 用户显式传 okText 仍按 explicit 值优先。
  okText: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '',
  },
  okType: {
    type: String as PropType<'primary' | 'danger' | 'default'>,
    default: 'primary' as const,
  },
  /**
   * @deprecated 请改用 `confirmLoading`（Ant Design 主名）。
   */
  okLoading: {
    type: Boolean,
    default: false,
  },
  /**
   * Ant Design 主名：确认按钮 loading 状态。显式优先于 `okLoading`。
   */
  confirmLoading: {
    type: Boolean,
    default: undefined,
  },
  /**
   * @deprecated 请改用 `footer` slot 或 `footer={null}`。
   */
  hideFooter: {
    type: Boolean,
    default: false,
  },
  /**
   * footer 内容。
   *
   * - `null`：隐藏 footer（等价于旧 `hideFooter=true`）
   * - `string`：纯文本 footer
   * - `VNode`：自定义内容
   * - 默认（`undefined`）：渲染内置 OK/Cancel 按钮
   *
   * `footer` slot 优先级高于此 prop。
   */
  footer: {
    type: [String, Object, null] as PropType<string | VNode | null>,
    default: undefined,
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  /**
   * Ant Design v5 `forceRender` 的 Vue 化等价：默认 false 时 destroyOnClose 控制；
   * 设为 true 时初次挂载即渲染内容（即使未打开），关闭后保留 DOM。
   * 与 `<KeepAlive>` 语义对齐，命名跟 Vue 习惯。
   */
  keepAlive: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: Number,
    default: 1000,
  },
  /**
   * @deprecated 请改用 `getContainer` 函数形（Ant Design 主名）。
   */
  appendToBody: {
    type: Boolean,
    default: true,
  },
  /**
   * 浮层容器函数：`(trigger) => HTMLElement | null`。
   * 返回 `null` 等价于 `appendToBody=false`（不 Teleport）。
   * 显式 `getContainer` 优先于 `appendToBody`。
   */
  getContainer: {
    type: Function as PropType<ModalGetContainer>,
    default: undefined,
  },
  /**
   * 对话框外层 wrap 节点的 className（Ant Design）。
   */
  wrapClassName: {
    type: String,
    default: '',
  },
  /**
   * 对话框 zoom transition 名（Ant Design `transitionName`）。
   */
  transitionName: {
    type: String,
    default: '',
  },
  /**
   * 遮罩 fade transition 名（Ant Design `maskTransitionName`）。
   */
  maskTransitionName: {
    type: String,
    default: '',
  },
  /**
   * 关闭后是否把焦点还给触发节点（Ant Design `focusTriggerAfterClose`）。默认 true。
   * 触发节点通过 `data-ccui-modal-trigger` 自动捕获；外部也可通过 `expose.restoreFocus(el)` 显式指定。
   */
  focusTriggerAfterClose: {
    type: Boolean,
    default: true,
  },
  /**
   * Ant Design v5.18+ 语义化 DOM className 注入（M-A2）。
   * 可用 key：`root` / `wrap` / `mask` / `header` / `body` / `footer`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * Ant Design v5.18+ 语义化 DOM style 注入（M-A2）。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type ModalProps = ExtractPropTypes<typeof modalProps>
