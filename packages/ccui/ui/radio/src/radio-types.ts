import type { PropType, ExtractPropTypes, InjectionKey, Ref } from 'vue';

export type BeforeChangeType = (value: string) => boolean | Promise<boolean>;
export type DirectionType = 'row' | 'column';

export const radioProps = {
  modelValue: {
    type: String,
    default: null
  },
  label: {
    type: String || Number,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  beforeChange: {
    type: Function as PropType<BeforeChangeType>,
    default: null
  }
} as const;

export type RadioProps = ExtractPropTypes<typeof radioProps>;

// 单选框组
export const radioGroupProps = {
  modelValue: {
    type: String || Number,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  beforeChange: {
    type: Function as PropType<BeforeChangeType>,
    default: null
  },
  direction: {
    type: String as PropType<DirectionType>,
    default: 'column'
  }
} as const;

export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>;

/** radio-group 注入字段的接口 */
interface RadioGroupInjection {
  modelValue: Ref<string>;
  disabled: Ref<boolean>;
  beforeChange: BeforeChangeType;
  emitChangeValue: (value: string) => void;
}

/** radio-group 注入 radio 的 key 值 */
export const radioGroupInjectionKey: InjectionKey<RadioGroupInjection> =
  Symbol('CRadioGroup');
