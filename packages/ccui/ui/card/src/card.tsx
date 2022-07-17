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
        <div class='okUi-card-header' v-show={isHeader}>
          {(slots.header && slots.header()) || props.header}
        </div>
        <div class='okUi-card-body' style={props.bodyStyle}>
          {slots.default && slots.default()}
        </div>
      </div>
    );
  }
});
