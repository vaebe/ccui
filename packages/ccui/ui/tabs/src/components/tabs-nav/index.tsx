import { defineComponent, inject, computed } from 'vue';
import {
  tabsInjectionKey,
  tabsProps,
  TabsProps,
  TabsState
} from '../../tabs-types';
import { TabProps } from '../tab/tab-types';
import './tabs-nav.scss';
import { useNamespace } from '../../../../shared/hooks/use-namespace';

export default defineComponent({
  name: 'CTabs-nav',
  props: tabsProps,
  emits: ['active-tab-change'],
  setup(props: TabsProps, { emit }) {
    const ns = useNamespace('tabs-nav');

    const tabsState = inject<TabsState>(tabsInjectionKey);

    const navList = computed(() => tabsState?.data || []);
    const slotsList = computed(() => tabsState?.slots || []);

    const containerClass = computed(() => {
      let cls = ns.b();
      if (props.type) {
        cls += `-${props.type}`;
      }
      return `${cls}--${props.tabPosition}`;
    });

    const getNavItemClass = (item: TabProps) => {
      const itemClass = `${containerClass.value}-item`;
      const itemActiveClass =
        tabsState?.active === item.name ? `${itemClass}-active` : '';

      return `${itemClass} ${itemActiveClass}`;
    };

    const navItemClick = (item: TabProps) => {
      if (tabsState) {
        // 相同不进行切换
        if (tabsState.active === item.name) {
          return;
        }

        emit('active-tab-change', item.name);
      }
    };

    const navItemDom = computed(() => {
      return navList.value.map((item, index) => {
        const curSlotTitle = slotsList.value[index];

        return (
          <p
            class={getNavItemClass(item)}
            onClick={() => {
              navItemClick(item);
            }}
          >
            {curSlotTitle.title ? curSlotTitle.title() : item.label}
          </p>
        );
      });
    });

    return () => {
      return <div class={containerClass.value}>{navItemDom.value}</div>;
    };
  }
});
