import { defineComponent, inject, onUnmounted } from 'vue';
import { tabsInjectionKey, TabsState } from '../../tabs-types';
import { tabProps, TabProps } from './tab-types';
import './tab.scss';

export default defineComponent({
  name: 'KTab',
  props: tabProps,
  emits: [],
  setup(props: TabProps, { slots }) {
    const tabsState = inject<TabsState>(tabsInjectionKey);
    tabsState?.data?.push(props);
    tabsState?.slots?.push(slots);

    //  组件卸载移除 组件props数据缓存
    onUnmounted(() => {
      if (tabsState) {
        tabsState.data = tabsState.data?.filter(
          (item) => item.name !== props.name
        );
      }
    });

    return () => {
      return props.name === tabsState?.active ? (
        <div class='okUi-tab'>{slots.default && slots.default()}</div>
      ) : null;
    };
  }
});
