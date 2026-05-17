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
   * @deprecated 请改用 `okText`。
   * 运行时从 ConfigProvider.locale.Popconfirm 取值；用户显式传 ok-text 仍优先。
   */
  confirmText: {
    type: String,
    default: '',
  },
  /**
   * 确认按钮文案。显式 `okText` 优先于 `confirmText`。
   */
  okText: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '',
  },
  /**
   * @deprecated 请改用 `okType`。
   */
  confirmType: {
    type: String as PropType<PopconfirmType>,
    default: 'primary' as PopconfirmType,
  },
  /**
   * 确认按钮 type。
   */
  okType: {
    type: String as PropType<PopconfirmType>,
    default: undefined,
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
