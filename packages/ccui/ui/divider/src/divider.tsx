import { defineComponent, computed } from 'vue';
import { dividerProps, DividerProps } from './divider-types';
import './divider.scss';

export default defineComponent({
  name: 'KDivider',
  props: dividerProps,
  setup(props: DividerProps, { slots }) {
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
      return props.direction === 'horizontal'
        ? 'okUi-divider'
        : 'okUi-divider-vertical';
    });

    const dividerTextStyle = computed(() => {
      return {
        color: props.contentColor,
        'background-color': props.contentBackgroundColor
      };
    });

    const dividerTextCls = computed(() => {
      return `okUi-divider_text is-${props.contentPosition}`;
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
