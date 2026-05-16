import type { ExtractPropTypes, InjectionKey, PropType, Ref, VNode } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

/**
 * `closable` 复合配置（与 Modal 对齐）。
 */
export interface DrawerClosableObject {
  closeIcon?: VNode | string
  disabled?: boolean
  ariaLabel?: string
}
export type DrawerClosable = boolean | DrawerClosableObject

/**
 * `getContainer` 函数签名（Ant Design）。
 */
export type DrawerGetContainer = (trigger: HTMLElement | null) => HTMLElement | null

/**
 * `push` 嵌套抽屉配置：
 *
 * - `boolean`：开启 / 关闭嵌套让位（默认 true）
 * - `{ distance }`：自定义子抽屉打开时，父抽屉沿主轴让位的距离（px，默认 180）
 */
export interface DrawerPushObject {
  distance?: number
}
export type DrawerPush = boolean | DrawerPushObject

export const drawerProps = {
  /**
   * @deprecated 请改用 `open`（Ant Design 主名 + `v-model:open`）。下一大版本移除。
   */
  visible: {
    type: Boolean,
    default: false,
  },
  /**
   * Ant Design 主名：显示抽屉。支持 `v-model:open`。显式 `open` 优先于 `visible`。
   */
  open: {
    type: Boolean,
    default: undefined,
  },
  title: {
    type: String,
    default: '',
  },
  placement: {
    type: String as PropType<DrawerPlacement>,
    default: 'right' as DrawerPlacement,
  },
  size: {
    type: [Number, String] as PropType<number | string>,
    default: 378,
  },
  /**
   * 关闭按钮配置。`boolean` 或 `{ closeIcon, disabled, ariaLabel }`（与 Modal 对齐）。
   */
  closable: {
    type: [Boolean, Object] as PropType<DrawerClosable>,
    default: true,
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  /**
   * @deprecated 请改用 `keyboard`。
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
  mask: {
    type: Boolean,
    default: true,
  },
  /**
   * @deprecated 请改用 `footer` slot 或 `footer` prop。
   */
  showFooter: {
    type: Boolean,
    default: false,
  },
  /**
   * footer 内容。
   *
   * - `null`：隐藏 footer（等价旧 `showFooter=false` 默认）
   * - `string` / `VNode`：直接渲染
   * - `undefined`：仅 footer slot 决定是否显示（与旧 `showFooter` 行为兼容）
   *
   * `footer` slot 优先级最高。
   */
  footer: {
    type: [String, Object, null] as PropType<string | VNode | null>,
    default: undefined,
  },
  /**
   * 加载态。`true` 时 body 区显示骨架占位，对齐 Ant Design v5.17+。
   */
  loading: {
    type: Boolean,
    default: false,
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  /**
   * Vue 化等价 ant `forceRender`：true 时即使未打开也渲染外层 DOM。
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
   * @deprecated 请改用 `getContainer` 函数形。
   */
  appendToBody: {
    type: Boolean,
    default: true,
  },
  /**
   * 浮层容器函数。返回 `null` 等价 `appendToBody=false`。
   */
  getContainer: {
    type: Function as PropType<DrawerGetContainer>,
    default: undefined,
  },
  /**
   * 嵌套抽屉时父抽屉是否让位（Ant Design `push`）。
   *
   * - `true`（默认）：让位 180px
   * - `false`：不让位
   * - `{ distance }`：自定义让位距离 px
   */
  push: {
    type: [Boolean, Object] as PropType<DrawerPush>,
    default: true,
  },
  /**
   * 关闭后是否把焦点还给触发节点。默认 true（与 Modal 对齐）。
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

export type DrawerProps = ExtractPropTypes<typeof drawerProps>

// ──────────────────────────────────────────────────────────────────────────────
// 嵌套抽屉 push：父抽屉通过 provide 暴露注册接口，子抽屉 inject 后注册自己
// ──────────────────────────────────────────────────────────────────────────────

export interface DrawerParentContext {
  /** 父抽屉的 placement，子抽屉用来决定让位方向 */
  placement: Ref<DrawerPlacement>
  /** 子抽屉调用 register/unregister 通知父抽屉自己的开关状态 */
  register: () => void
  unregister: () => void
}

export const drawerParentInjectionKey: InjectionKey<DrawerParentContext> = Symbol('CDrawerParent')
