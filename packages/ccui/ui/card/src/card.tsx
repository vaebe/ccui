import { defineComponent, computed } from 'vue';
import { cardProps, CardProps } from './card-types';
import './card.scss';

export default defineComponent({
  name: 'KCard',
  props: cardProps,
  setup(props: CardProps, { slots }) {
    const boxClass = `okUi-card okUi-card-${props.shadow}-shadow`;

    const isHeader = computed(() => {
      return props.header || slots.header;
    });

    return () => (
      <div class={boxClass}>
        <div class='card-header' v-show={isHeader}>
          {(slots.header && slots.header()) || props.header /* title 具名插槽 */}
        </div>
        <div class='card-body' style={props.bodyStyle}>
          {slots.default && slots.default() /* 默认插槽 */}
        </div>
      </div>
    );
  }
});
