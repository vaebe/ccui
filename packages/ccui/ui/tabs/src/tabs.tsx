import type {
  TabsProps,
  TabsState,
} from './tabs-types'
import { defineAsyncComponent, defineComponent, provide, reactive } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import TabsNav from './components/tabs-nav'
import {
  tabsInjectionKey,
  tabsProps,
} from './tabs-types'
import './tabs.scss'

export default defineComponent({
  name: 'CTabs',
  props: tabsProps,
  emits: ['change', 'update:modelValue'],
  components: {
    TabsNav: defineAsyncComponent(() => import('./components/tabs-nav')),
  },
  setup(props: TabsProps, { slots, emit }) {
    const ns = useNamespace('tabs')

    const state: TabsState = reactive({
      data: [],
      active: props.modelValue,
      slots: [],
    })

    provide<TabsState>(tabsInjectionKey, state)

    const setActiveTab = (name: string | number) => {
      state.active = name

      // 更新 v-model 触发change事件
      emit('update:modelValue', name)
      emit('change', name)
    }

    const tabsContent = () => {
      const tabsNav = (
        <TabsNav {...props} onActive-tab-change={setActiveTab}></TabsNav>
      )
      const content = slots.default && slots.default()

      if (['bottom'].includes(props.tabPosition)) {
        return [content, tabsNav]
      }
      else {
        return [tabsNav, content]
      }
    }

    return () => {
      return <div class={ns.b()}>{tabsContent()}</div>
    }
  },
})
