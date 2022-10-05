import { defineComponent, inject, onUnmounted } from 'vue';
import { tabsInjectionKey, TabsState } from '../../tabs-types';
import { tabProps, TabProps } from './tab-types';
import './tab.scss';
import { useNamespace } from '../../../../shared/hooks/use-namespace';

export default defineComponent({
  name: 'CTab',
  props: tabProps,
  emits: [],
  setup(props: TabProps, { slots }) {
    const ns = useNamespace('tab');

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
        <div class={ns.b()}>{slots.default && slots.default()}</div>
      ) : null;
    };
  }
});
