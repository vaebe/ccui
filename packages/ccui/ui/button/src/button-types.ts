import type { ExtractPropTypes, InjectionKey, PropType, Ref, VNode } from 'vue'

/**
 * Button 取值集合（联合）：
 *
 * - 标准取值：`'primary' | 'default' | 'dashed' | 'link' | 'text'`
 * - 语义色快捷：`'success' | 'warning' | 'danger' | 'info'`
 *   （等价于 `danger=true` / `color='success'` 等组合，二选一即可）
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
export type ButtonIconPosition = 'start' | 'end'

/**
 * `loading` 复合配置：
 *
 * - `boolean`：立刻进入 loading
 * - `{ delay, icon }`：延迟 `delay` ms 后再进入 loading；自定义 loading 图标
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
   * 朴素按钮：背景透明，文字与边框跟主色。
   */
  plain: {
    type: Boolean,
    default: false,
  },
  /**
   * 圆角按钮。
   */
  round: {
    type: Boolean,
    default: false,
  },
  /**
   * 圆形按钮（常用于纯图标场景）。
   */
  circle: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  /**
   * 原生 `<button>` 的 type 属性。
   */
  nativeType: {
    type: String as PropType<ButtonNativeType>,
    default: 'button',
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
   * 图标位置。
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
   * 自动在两个 CJK 字符间插入空格。
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
   * 自定义按钮颜色。接受任意 CSS color 字符串（含 `#hex` / `rgb()` / `hsl()` / 命名色 / 渐变非法 — 仅纯色）。
   * 实心型 type（`primary`/`success`/`warning`/`danger`/`info`）注入 background-color + border-color；
   * 描边型 type（`''` / `default` / `dashed`）注入 color + border-color；
   * `text` / `link` 仅注入 color。hover / active 联动由用户用 CSS class 自兜底。
   */
  color: {
    type: String,
    default: '',
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
