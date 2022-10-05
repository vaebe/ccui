import type {
  ComputedRef,
  ExtractPropTypes,
  PropType,
  InjectionKey
} from 'vue';
import { TabProps } from './components/tab/tab-types';

export type ModelValueType = string | number;

export type ITabsType = '' | 'card' | 'border-card';

export type ITabPositionType = 'top' | 'right' | 'bottom' | 'left';

export type Active = string | number | null;
export type BeforeChangeType = (id: Active) => boolean;

export interface TabsState {
  data?: TabProps[];
  active: string | number;
  slots: any[];
}

export const tabsProps = {
  modelValue: {
    type: [String, Number] as PropType<ModelValueType>,
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
    type: Function as PropType<BeforeChangeType>,
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
export const tabsInjectionKey: InjectionKey<TabsState> = Symbol('CTabs');

export interface UseTabsRender {
  tabsClasses: ComputedRef<Record<string, boolean>>;
}
