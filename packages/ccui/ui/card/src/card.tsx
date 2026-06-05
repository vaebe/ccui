import type { CardProps } from './card-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { cardProps } from './card-types'
import './card.scss'

export default defineComponent({
  name: 'CCard',
  props: cardProps,
  setup(props: CardProps, { slots }) {
    const ns = useNamespace('card')

    const boxClass = computed(() => `${ns.b()} ${ns.m(`${props.shadow}-shadow`)}`)

    const isHeader = computed(() => {
      return props.header || slots.header
    })

    return () => (
      <div class={[boxClass.value, props.classNames?.root]} style={props.styles?.root}>
        {slots.cover && (
          <div class={[ns.e('cover'), props.classNames?.cover]} style={props.styles?.cover}>
            {slots.cover()}
          </div>
        )}
        <div class={[ns.e('header'), props.classNames?.header]} style={props.styles?.header} v-show={isHeader.value}>
          {(slots.header && slots.header()) || props.header}
        </div>
        <div class={[ns.e('body'), props.classNames?.body]} style={[props.bodyStyle, props.styles?.body] as any}>
          {slots.default && slots.default()}
        </div>
      </div>
    )
  },
})
