import type { ExtractPropTypes, PropType } from 'vue'
import type { PopoverPlacement } from '../../popover/src/popover-types'

export interface DropdownItem {
  key: string | number
  label?: string
  icon?: string
  disabled?: boolean
  divided?: boolean
  danger?: boolean
}

export const dropdownProps = {
  items: {
    type: Array as PropType<DropdownItem[]>,
    default: () => [],
  },
  trigger: {
    type: String as PropType<'hover' | 'click' | 'contextmenu'>,
    default: 'hover' as const,
  },
  placement: {
    type: String as PropType<PopoverPlacement>,
    default: 'bottom-start' as PopoverPlacement,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: undefined,
  },
  hideOnClick: {
    type: Boolean,
    default: true,
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: '',
  },
} as const

export type DropdownProps = ExtractPropTypes<typeof dropdownProps>
