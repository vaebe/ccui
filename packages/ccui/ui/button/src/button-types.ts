import type { ExtractPropTypes, InjectionKey, PropType, Ref, VNode } from 'vue'

/**
 * Button 取值集合（联合）：
 *
 * - Ant Design 主名：`'primary' | 'default' | 'dashed' | 'link' | 'text'`
 * - ccui 旧名（兼容保留，建议改用 `danger=true` / `color='success'` 等组合）：
 *   `'success' | 'warning' | 'danger' | 'info'`
 */
export type ButtonType =
  | ''
  | 'primary'
  | 'default'
  | 'dashed'
  | 'link'
  | 'text'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type ButtonSizeType = '' | 'large' | 'default' | 'small'
export type ButtonNativeType = 'button' | 'submit' | 'reset'
export type ButtonShape = 'default' | 'circle' | 'round'
export type ButtonIconPosition = 'start' | 'end'

/**
 * Ant Design v5.21+ 的 color × variant 矩阵（forward-compat 接收）。
 *
 * - color：色板（v5.21+），决定 hover / active / focus 派生色。
 * - variant：视觉变体，与 Tag 的 variant 同名不同集。
 *
 * 当前 ccui 实现：prop 已接受，SCSS 仅按 `type` 维度上色，color + variant 的完整 SCSS 矩阵留 v2.x 后续 batch。
 */
export type ButtonColor = 'default' | 'primary' | 'danger'
export type ButtonVariant = 'outlined' | 'dashed' | 'solid' | 'filled' | 'text' | 'link'

/**
 * `loading` 复合配置：
 *
 * - `boolean`：等价 ccui 旧行为，立刻进入 loading
 * - `{ delay, icon }`：v5.23+，延迟 `delay` ms 后再进入 loading；自定义 loading 图标
 */
export interface ButtonLoadingObject {
  delay?: number
  icon?: VNode | string
}
export type ButtonLoading = boolean | ButtonLoadingObject

export const buttonProps = {
  type: {
    type: String as PropType<ButtonType>,
    default: '',
  },
  size: {
    type: String as PropType<ButtonSizeType>,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated 旧 ccui 朴素按钮风格。推荐改用 `variant='outlined'` / `'filled'` 组合（v2.x 接入 SCSS）。
   */
  plain: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated 请改用 `shape='round'`。下一大版本移除。
   */
  round: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated 请改用 `shape='circle'`。下一大版本移除。
   */
  circle: {
    type: Boolean,
    default: false,
  },
  /**
   * Ant 风格 shape：`'default' | 'circle' | 'round'`。显式 shape 优先于 round / circle boolean。
   */
  shape: {
    type: String as PropType<ButtonShape>,
    default: undefined,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated 请改用 `htmlType`。下一大版本移除。
   */
  nativeType: {
    type: String as PropType<ButtonNativeType>,
    default: undefined,
  },
  /**
   * Ant 风格原生 type：`'button' | 'submit' | 'reset'`。显式 htmlType 优先于 nativeType。
   */
  htmlType: {
    type: String as PropType<ButtonNativeType>,
    default: undefined,
  },
  loading: {
    type: [Boolean, Object] as PropType<ButtonLoading>,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  /**
   * 图标位置（v5.17+）。
   */
  iconPosition: {
    type: String as PropType<ButtonIconPosition>,
    default: 'start',
  },
  /**
   * 危险按钮，与 `type='primary'` 组合得到红色实色按钮。
   */
  danger: {
    type: Boolean,
    default: false,
  },
  /**
   * 幽灵按钮：背景透明，文字与边框跟主色。
   */
  ghost: {
    type: Boolean,
    default: false,
  },
  /**
   * 块级按钮：宽度撑满父容器。
   */
  block: {
    type: Boolean,
    default: false,
  },
  /**
   * 自动在两个 CJK 字符间插入空格（v5.17+），与 Ant Design 默认行为一致。
   */
  autoInsertSpace: {
    type: Boolean,
    default: true,
  },
  /**
   * 链接按钮 href。设置后渲染为 `<a>` 而非 `<button>`。
   */
  href: {
    type: String,
    default: undefined,
  },
  /**
   * `<a>` 的 target 属性，仅在 `href` 设置时生效。
   */
  target: {
    type: String,
    default: undefined,
  },
  /**
   * Ant Design v5.21+ 新增。当前 prop 已接受，SCSS 矩阵完整接入留 v2.x。
   */
  color: {
    type: String as PropType<ButtonColor>,
    default: undefined,
  },
  /**
   * Ant Design v5.21+ 新增。当前 prop 已接受，SCSS 矩阵完整接入留 v2.x。
   */
  variant: {
    type: String as PropType<ButtonVariant>,
    default: undefined,
  },
} as const

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

// ──────────────────────────────────────────────────────────────────────────────
// Button.Group
// ──────────────────────────────────────────────────────────────────────────────

export const buttonGroupProps = {
  size: {
    type: String as PropType<ButtonSizeType>,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
} as const

export type ButtonGroupProps = ExtractPropTypes<typeof buttonGroupProps>

export interface ButtonGroupInjection {
  size: Ref<ButtonSizeType>
  disabled: Ref<boolean>
}

export const buttonGroupInjectionKey: InjectionKey<ButtonGroupInjection> = Symbol('CButtonGroup')
