import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export type CheckableTagValue = string | number

export type CheckableTagSize = 'large' | 'default' | 'small'

export interface CheckableTagOption {
  label: string
  value: CheckableTagValue
  disabled?: boolean
}

/**
 * 单个可勾选标签（对标 ant `Tag.CheckableTag`）：
 *
 * - 独立使用：`v-model:checked` 受控；点击切换。
 * - 在 `CheckableTagGroup` 内：由 group 注入受控值，本地 `checked` 与 `v-model:checked` 仍可用作初值与同步。
 */
export const checkableTagProps = {
  /**
   * 受控勾选状态。group 模式下由 group 注入决定，prop 仅作初值。
   */
  checked: {
    type: Boolean,
    default: undefined,
  },
  /**
   * group 模式下用于匹配 group 的 `modelValue`。独立使用时可不传。
   */
  value: {
    type: [String, Number] as PropType<CheckableTagValue>,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
} as const

export type CheckableTagProps = ExtractPropTypes<typeof checkableTagProps>

export const checkableTagGroupProps = {
  /**
   * 已勾选的值列表（v-model）。
   */
  modelValue: {
    type: Array as PropType<CheckableTagValue[]>,
    default: () => [],
  },
  /**
   * 声明式渲染选项（与默认 slot 互斥；都传时 options 胜出）。
   */
  options: {
    type: Array as PropType<CheckableTagOption[]>,
    default: undefined,
  },
  /**
   * 是否禁用整个 group。
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 最大允许勾选数量。达到上限后未勾选项的点击会被忽略。
   */
  maxCount: {
    type: Number,
    default: undefined,
  },
  /**
   * 子标签尺寸（透传到 Tag scss size modifier）。
   */
  size: {
    type: String as PropType<CheckableTagSize>,
    default: 'default',
  },
} as const

export type CheckableTagGroupProps = ExtractPropTypes<typeof checkableTagGroupProps>

export interface CheckableTagGroupContext {
  modelValue: Ref<CheckableTagValue[]>
  disabled: Ref<boolean>
  size: Ref<CheckableTagSize>
  maxCount: Ref<number | undefined>
  toggle: (value: CheckableTagValue) => void
  isChecked: (value: CheckableTagValue) => boolean
  canCheck: (value: CheckableTagValue) => boolean
}

export const checkableTagGroupInjectionKey = Symbol('CheckableTagGroup') as InjectionKey<CheckableTagGroupContext>
