import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import type { CardProps } from './card-types'
import { cardProps } from './card-types'
import './card.scss'

export default defineComponent({
  name: 'CCard',
  props: cardProps,
  setup(props: CardProps, { slots }) {
    const ns = useNamespace('card')

    const boxClass = `${ns.b()} ${ns.m(props.shadow)}-shadow`

    const isHeader = computed(() => {
      return props.header || slots.header
    })

    return () => (
      <div class={boxClass}>
        <div class={ns.m('header')} v-show={isHeader}>
          {(slots.header && slots.header()) || props.header}
        </div>
        <div class={ns.m('body')} style={props.bodyStyle}>
          {slots.default && slots.default()}
        </div>
      </div>
    )
  },
})
