import type { DividerProps } from './divider-types'
import { computed, defineComponent, mergeProps, useAttrs } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { dividerProps } from './divider-types'
import './divider.scss'

export default defineComponent({
  name: 'CDivider',
  inheritAttrs: false,
  props: dividerProps,
  setup(props: DividerProps, { slots }) {
    const ns = useNamespace('divider')
    const attrs = useAttrs()

    const dividerStyle = computed(() => {
      const borderStyleObj =
        props.direction !== 'horizontal'
          ? { 'border-left-style': props.borderStyle }
          : { 'border-top-style': props.borderStyle }
      return {
        ...borderStyleObj,
        'border-color': props.color,
      }
    })

    const dividerCls = computed(() => {
      return props.direction === 'horizontal' ? ns.b() : ns.m('vertical')
    })

    const dividerTextStyle = computed(() => {
      return {
        color: props.contentColor,
        'background-color': props.contentBackgroundColor,
      }
    })

    const dividerTextCls = computed(() => {
      return `${ns.e('text')} ${ns.is(props.contentPosition)}`
    })

    return () => (
      <div
        {...mergeProps(attrs, {
          class: dividerCls.value,
          style: dividerStyle.value,
          role: 'separator',
          'aria-orientation': props.direction,
        })}
      >
        {props.direction === 'horizontal' && slots.default ? (
          <div class={dividerTextCls.value} style={dividerTextStyle.value}>
            {slots.default()}
          </div>
        ) : null}
      </div>
    )
  },
})
