import type {} from 'csstype'
import type { CSSProperties } from 'vue'
import type { FlexProps } from './flex-types'
import { computed, defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { flexProps, PRESET_GAP } from './flex-types'
import './flex.scss'

export default defineComponent({
  name: 'CFlex',
  props: flexProps,
  setup(props: FlexProps, { slots }) {
    const ns = useNamespace('flex')

    const style = computed<CSSProperties>(() => {
      const wrapValue = props.wrap === true ? 'wrap' : props.wrap === false ? 'nowrap' : props.wrap
      let gapValue: string | undefined
      if (props.gap !== undefined && props.gap !== null) {
        if (typeof props.gap === 'number') {
          gapValue = `${props.gap}px`
        } else {
          gapValue = PRESET_GAP[props.gap] ?? props.gap
        }
      }
      return {
        flexDirection: props.vertical ? 'column' : 'row',
        flexWrap: wrapValue,
        justifyContent: props.justify,
        alignItems: props.align,
        flex: props.flex,
        gap: gapValue,
      }
    })

    return () => h(props.component || 'div', { class: ns.b(), style: style.value }, slots.default?.())
  },
})
