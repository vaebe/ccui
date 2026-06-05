import type { TabsState } from '../../tabs-types'
import type { TabProps } from './tab-types'
import { defineComponent, inject, onUnmounted } from 'vue'
import { useNamespace } from '../../../../shared/hooks/use-namespace'
import { tabsInjectionKey } from '../../tabs-types'
import { tabProps } from './tab-types'
import './tab.scss'

export default defineComponent({
  name: 'CTab',
  props: tabProps,
  emits: [],
  setup(props: TabProps, { slots }) {
    const ns = useNamespace('tab')

    const tabsState = inject<TabsState>(tabsInjectionKey)
    tabsState?.data?.push(props)
    tabsState?.slots?.push(slots)

    //  组件卸载移除 组件props数据缓存
    onUnmounted(() => {
      if (tabsState && tabsState.data) {
        const idx = tabsState.data.findIndex((item) => item.name === props.name)
        if (idx !== -1) {
          tabsState.data.splice(idx, 1)
          tabsState.slots?.splice(idx, 1)
        }
      }
    })

    return () => {
      return props.name === tabsState?.active ? (
        <div
          class={ns.b()}
          role="tabpanel"
          id={`c-tabpanel-${String(props.name)}`}
          aria-labelledby={`c-tab-${String(props.name)}`}
          tabindex={0}
        >
          {slots.default && slots.default()}
        </div>
      ) : null
    }
  },
})
