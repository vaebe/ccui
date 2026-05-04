import type { ExtractPropTypes, PropType } from 'vue'
import type { PopoverPlacement } from '../../popover/src/popover-types'

export type PopconfirmType = 'primary' | 'danger' | 'default'

export const popconfirmProps = {
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  placement: {
    type: String as PropType<PopoverPlacement>,
    default: 'top' as PopoverPlacement,
  },
  confirmText: {
    type: String,
    default: '确 定',
  },
  cancelText: {
    type: String,
    default: '取 消',
  },
  confirmType: {
    type: String as PropType<PopconfirmType>,
    default: 'primary' as PopconfirmType,
  },
  icon: {
    type: String,
    default: '',
  },
  iconColor: {
    type: String,
    default: '#faad14',
  },
  hideIcon: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: undefined,
  },
  trigger: {
    type: String as PropType<'click' | 'hover' | 'focus' | 'manual'>,
    default: 'click' as const,
  },
} as const

export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>
