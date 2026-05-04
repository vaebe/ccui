import type { DescriptionsItemProps } from './descriptions-types'
import { defineComponent } from 'vue'
import { descriptionsItemProps } from './descriptions-types'

export default defineComponent({
  name: 'CDescriptionsItem',
  props: descriptionsItemProps,
  setup(_props: DescriptionsItemProps, { slots }) {
    // 子组件不直接渲染，由父级 Descriptions 通过 slots/items 收集后渲染
    return () => slots.default?.()
  },
})
