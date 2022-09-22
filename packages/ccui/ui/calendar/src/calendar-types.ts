import type { ExtractPropTypes } from 'vue';

export const calendarProps = {
  modelValue: {
    type: Date,
    default: new Date()
  },
  readOnly: {
    type: Boolean,
    default: false
  }
} as const;

export type CalendarProps = ExtractPropTypes<typeof calendarProps>;

export interface dateItem {
  index: number;
  date: string;
  day: string;
  week: string;
}
