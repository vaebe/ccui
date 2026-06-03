import type { CardMetaProps } from './card-meta-types'
import { defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { cardMetaProps } from './card-meta-types'
import './card-meta.scss'

export default defineComponent({
  name: 'CCardMeta',
  props: cardMetaProps,
  setup(props: CardMetaProps, { slots }) {
    const ns = useNamespace('card-meta')

    return () => {
      const avatar = slots.avatar ? h('div', { class: ns.e('avatar') }, slots.avatar()) : null

      const title = slots.title ? slots.title() : props.title
      const description = slots.description ? slots.description() : props.description

      const detail = h('div', { class: ns.e('detail') }, [
        title ? h('div', { class: ns.e('title') }, title) : null,
        description ? h('div', { class: ns.e('description') }, description) : null,
      ])

      return h('div', { class: ns.b() }, [avatar, detail])
    }
  },
})
