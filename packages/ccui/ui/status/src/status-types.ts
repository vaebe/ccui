import type { PropType, ExtractPropTypes } from 'vue';

type IStatusType =
  | 'success'
  | 'error'
  | 'initial'
  | 'warning'
  | 'waiting'
  | 'running'
  | 'invalid';

export const statusProps = {
  type: {
    type: String as PropType<IStatusType>,
    default: 'initial'
  }
} as const;

export type StatusProps = ExtractPropTypes<typeof statusProps>;
