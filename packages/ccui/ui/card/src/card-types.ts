import type { ExtractPropTypes } from 'vue';

export const cardProps = {
  shadow: {
    type: String,
    default: 'always'
  },
  header: {
    type: String,
    default: ''
  },
  bodyStyle: {
    type: Object,
    default: () => {
      return { padding: '20px' };
    }
  }
} as const;

export type CardProps = ExtractPropTypes<typeof cardProps>;
