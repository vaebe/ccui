import { defineComponent, computed } from 'vue';
import { buttonProps, ButtonProps } from './button-types';
import './button.scss';
import { useNamespace } from '../../shared/hooks/use-namespace';
import tree from '../../tree';

export default defineComponent({
  name: 'CButton',
  props: buttonProps,
  emits: ['click'],
  setup(props: ButtonProps, { slots, emit }) {
    const ns = useNamespace('button');
    const butCls = computed(() => {
      return {
        [ns.b()]: true,
        [ns.m(props.type)]: !!props.type,
        [ns.m(`plain-${props.type}`)]: !!props.plain,
        [ns.m(props.size)]: !!props.size,
        [ns.m('round')]: props.round,
        [ns.m('circle')]: props.circle
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
