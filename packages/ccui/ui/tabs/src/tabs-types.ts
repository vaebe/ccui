import type {
  ComputedRef,
  ExtractPropTypes,
  PropType,
  InjectionKey
} from 'vue';
import { TabProps } from './components/tab/tab-types';

export type Active = string | number | null;

export type ITabsType = '' | 'card' | 'border-card';

export type ITabPositionType = 'top' | 'right' | 'bottom' | 'left';

export interface TabsState {
  data?: TabProps[];
  active: string | number;
  slots: any[];
}

export const tabsProps = {
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: null
  },
  type: {
    type: String as () => ITabsType,
    default: ''
  },
  customWidth: {
    type: String,
    default: ''
  },
  cssClass: {
    type: String,
    default: ''
  },
  beforeChange: {
    type: Function as PropType<(id: Active) => boolean>,
    default: null
  },
  tabPosition: {
    type: String as () => ITabPositionType,
    default: 'top'
  }
} as const;

export type TabsProps = ExtractPropTypes<typeof tabsProps>;

export interface UseTabsEvent {
  onUpdateModelValue: (value: string | number) => void;
  onActiveTabChange: (value: string) => void;
  onTabChange: (id: string | undefined, type: string) => void;
}

/** KTabs 注入 tab 的 key 值 */
export const tabsInjectionKey: InjectionKey<TabsState> = Symbol('KTabs');

export interface UseTabsRender {
  tabsClasses: ComputedRef<Record<string, boolean>>;
}
