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
  /**
   * 确认按钮文案。未传时取 ConfigProvider.locale.Popconfirm.confirmText。
   */
  confirmText: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '',
  },
  /**
   * 确认按钮 type。
   */
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
    default: '',
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
  /**
   * 受控显示。支持 `v-model:visible`。
   */
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
