import { defineComponent, toRef, provide, computed } from 'vue';
import {
  RadioGroupProps,
  radioGroupProps,
  radioGroupInjectionKey
} from './radio-types';
import './radio-group.scss';

export default defineComponent({
  name: 'KRadioGroup',
  props: radioGroupProps,
  emits: ['change', 'update:modelValue'],
  setup(props: RadioGroupProps, { emit, slots }) {
    const emitChangeValue = (val: string) => {
      emit('update:modelValue', val);
      emit('change', val);
    };

    provide(radioGroupInjectionKey, {
      modelValue: toRef(props, 'modelValue'),
      disabled: toRef(props, 'disabled'),
      beforeChange: props.beforeChange,
      emitChangeValue
    });

    const directionType = {
      row: 'is-row',
      column: 'is-column'
    };

    const radioGroupClass = computed(() => {
      return `okUi-radio-group ${directionType[props.direction]}`;
    });

    return () => {
      return (
        <div class={radioGroupClass.value}>
          {slots.default && slots.default()}
        </div>
      );
    };
  }
});
