import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export type CollapseModelValue = string | number | (string | number)[]
export type CollapseExpandIconPosition = 'start' | 'end'

export const collapseProps = {
  modelValue: {
    type: [String, Number, Array] as PropType<CollapseModelValue>,
    default: () => [],
  },
  accordion: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  ghost: {
    type: Boolean,
    default: false,
  },
  expandIconPosition: {
    type: String as PropType<CollapseExpandIconPosition>,
    default: 'start',
  },
} as const

export type CollapseProps = ExtractPropTypes<typeof collapseProps>

export const collapseItemProps = {
  name: {
    type: [String, Number] as PropType<string | number>,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showArrow: {
    type: Boolean,
    default: true,
  },
} as const

export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>

export interface CollapseContext {
  activeNames: Ref<(string | number)[]>
  accordion: Ref<boolean>
  expandIconPosition: Ref<CollapseExpandIconPosition>
  toggle: (name: string | number) => void
}

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('CollapseContext')
