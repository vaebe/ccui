import { defineComponent, computed } from 'vue';
import { buttonProps, ButtonProps } from './button-types';
import './button.scss';

export default defineComponent({
  name: 'KButton',
  props: buttonProps,
  emits: ['click'],
  setup(props: ButtonProps, { slots, emit }) {
    const butCls = computed(() => {
      return {
        'okUi-button': true,
        [`okUi-button-${props.type}`]: !!props.type,
        [`okUi-button-plain-${props.type}`]: !!props.plain,
        [`okUi-button-size-${props.size}`]: !!props.size,
        [`okUi-button-is-round`]: props.round,
        [`okUi-button-is-circle`]: props.circle
      };
    });

    const onClick = (e: MouseEvent) => {
      emit('click', e);
    };

    return () => {
      return (
        <button
          class={butCls.value}
          type={props.nativeType}
          autofocus={props.autofocus}
          disabled={props.disabled}
          onClick={onClick}
        >
          {slots.icon && slots.icon()}
          {slots.default && slots.default()}
        </button>
      );
    };
  }
});
