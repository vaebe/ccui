import type { ExtractPropTypes, InjectionKey, PropType, Ref, VNode } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

/**
 * `closable` 复合配置（与 Modal 同构）。
 */
export interface DrawerClosableObject {
  closeIcon?: VNode | string
  disabled?: boolean
  ariaLabel?: string
}
export type DrawerClosable = boolean | DrawerClosableObject

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
   * 显示抽屉。支持 `v-model:visible`。
   */
  visible: {
    type: Boolean,
    default: false,
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
   * 关闭按钮配置。`boolean` 或 `{ closeIcon, disabled, ariaLabel }`（与 Modal 同构）。
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
   * 是否支持键盘 Esc 关闭。
   */
  closeOnEsc: {
    type: Boolean,
    default: true,
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
   * - `null`：隐藏 footer
   * - `string` / `VNode`：直接渲染
   * - `undefined`：仅 footer slot 决定是否显示
   *
   * `footer` slot 优先级最高。
   */
  footer: {
    type: [String, Object, null] as PropType<string | VNode | null>,
    default: undefined,
  },
  /**
   * 加载态。`true` 时 body 区显示骨架占位。
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
   * true 时即使未打开也渲染外层 DOM（不延迟到首次打开）。
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
   * 是否把浮层 Teleport 到 `document.body`。
   */
  appendToBody: {
    type: Boolean,
    default: true,
  },
  /**
   * 嵌套抽屉时父抽屉是否让位。
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
   * 语义化 DOM className 注入。可用 key：`root` / `wrap` / `mask` / `header` / `body` / `footer`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * 语义化 DOM style 注入。可用 key 与 classNames 一致。
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
