import type { CSSProperties } from 'vue'
import type { CardGridProps } from './card-grid-types'
import { computed, defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { cardGridProps } from './card-grid-types'
import './card-grid.scss'

export default defineComponent({
  name: 'CCardGrid',
  props: cardGridProps,
  setup(props: CardGridProps, { slots }) {
    const ns = useNamespace('card-grid')

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('hoverable')]: props.hoverable,
    }))

    const style = computed<CSSProperties>(() => {
      const out: CSSProperties = {}
      if (props.colSpan !== undefined) {
        const span = Math.max(1, Math.min(24, props.colSpan))
        out.width = `${(span / 24) * 100}%`
      }
      return { ...out, ...props.bodyStyle }
    })

    return () => h('div', { class: cls.value, style: style.value }, slots.default?.())
  },
})
