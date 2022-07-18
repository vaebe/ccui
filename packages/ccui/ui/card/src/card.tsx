import { defineComponent, computed } from 'vue';
import { cardProps, CardProps } from './card-types';
import './card.scss';
import { useNamespace } from '../../shared/hooks/use-namespace';

export default defineComponent({
  name: 'CCard',
  props: cardProps,
  setup(props: CardProps, { slots }) {
    const ns = useNamespace('card');

    // ccui-card ccui-card__nse ccui-card--nsm ccui-card__em--open
    console.log(ns.b(), ns.e('nse'), ns.m('nsm'), ns.em('em', 'open'));

    const boxClass = `${ns.b()} ${ns.m(props.shadow)}-shadow`;

    const isHeader = computed(() => {
      return props.header || slots.header;
    });

    return () => (
      <div class={boxClass}>
        <div class={ns.m('header')} v-show={isHeader}>
          {(slots.header && slots.header()) || props.header}
        </div>
        <div class={ns.m('body')} style={props.bodyStyle}>
          {slots.default && slots.default()}
        </div>
      </div>
    );
  }
});
