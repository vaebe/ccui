import { defineComponent, computed } from 'vue';
import { dividerProps, DividerProps } from './divider-types';
import './divider.scss';
import { useNamespace } from '../../shared/hooks/use-namespace';

export default defineComponent({
  name: 'CDivider',
  props: dividerProps,
  setup(props: DividerProps, { slots }) {
    const ns = useNamespace('divider');

    const dividerStyle = computed(() => {
      const borderStyleObj =
        props.direction !== 'horizontal'
          ? { 'border-left-style': props.borderStyle }
          : { 'border-top-style': props.borderStyle };
      return {
        ...borderStyleObj,
        'border-color': props.color
      };
    });

    const dividerCls = computed(() => {
      return props.direction === 'horizontal' ? ns.b() : ns.m('vertical');
    });

    const dividerTextStyle = computed(() => {
      return {
        color: props.contentColor,
        'background-color': props.contentBackgroundColor
      };
    });

    const dividerTextCls = computed(() => {
      return `${ns.e('text')} is-${props.contentPosition}`;
    });

    return () => {
      return (
        <div class={dividerCls.value} style={dividerStyle.value}>
          <div class={dividerTextCls.value} style={dividerTextStyle.value}>
            {slots.default && slots.default()}
          </div>
        </div>
      );
    };
  }
});
