import type { PropType, ExtractPropTypes } from 'vue';
import { InjectionKey, Ref } from 'vue';

export type LabelType = string | number | boolean;

export type BeforeChangeType = (
  isChecked: boolean,
  v: string
) => boolean | Promise<boolean>;

export type DirectionType = 'row' | 'column';

export const checkBoxProps = {
  modelValue: {
    type: Boolean,
    default: null
  },
  label: {
    type: String as PropType<LabelType>,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  beforeChange: {
    type: Function as PropType<BeforeChangeType>,
    default: undefined
  }
} as const;

export type CheckBoxProps = ExtractPropTypes<typeof checkBoxProps>;

// 多选框组
export const checkBoxGroupProps = {
  ...checkBoxProps,
  modelValue: {
    type: Array,
    default: [],
    required: true
  },
  direction: {
    type: String as PropType<DirectionType>,
    default: 'column'
  }
} as const;

export type CheckBoxGroupProps = ExtractPropTypes<typeof checkBoxGroupProps>;

/** checkBox-group 注入字段的接口 */
interface CheckBoxGroupInjection {
  disabled: Ref<boolean>;
  color: Ref<string | undefined>;
  beforeChange: undefined | BeforeChangeType;
  toggleGroupVal: (v: string) => void;
  isItemChecked: (v: string) => boolean;
}

/** check-box-group 注入 checkBox 的 key 值 */
export const checkBoxGroupInjectionKey: InjectionKey<CheckBoxGroupInjection> =
  Symbol('CCheckBoxGroup');
