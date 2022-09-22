import type { PropType, ExtractPropTypes } from 'vue';

export interface TreeItem {
  id?: string;
  label: string;
  isParent?: boolean;
  level?: number;
  open?: boolean;
  addable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  children?: Array<TreeItem>;
  [key: string]: unknown;
}
export type TreeData = Array<TreeItem>;

export const treeProps = {
  data: {
    type: Array as PropType<TreeData>,
    required: true,
    default: () => []
  }
} as const;

export type TreeProps = ExtractPropTypes<typeof treeProps>;
