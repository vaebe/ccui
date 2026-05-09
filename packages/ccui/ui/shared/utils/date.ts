import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export type DateValue = string | number | Date | Dayjs | null | undefined

// 把任意 DateValue 转成 dayjs 实例。format 仅在 value 是 string 时用作解析格式。
// 解析失败或为空返回 null。
export function toDayjs(value: DateValue, format?: string): Dayjs | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'string' && format) {
    const parsed = dayjs(value, format, true)
    return parsed.isValid() ? parsed : null
  }
  const d = dayjs(value as Date | string | number)
  return d.isValid() ? d : null
}

export function formatDate(value: DateValue, format: string): string {
  const d = toDayjs(value)
  return d ? d.format(format) : ''
}

// 把 dayjs 输出为 v-model 期望的形态：raw 为 'date' / 'string' / 'number'。
export function emitValue(value: Dayjs | null, output: 'date' | 'string' | 'number', format: string) {
  if (value === null) return null
  if (output === 'date') return value.toDate()
  if (output === 'number') return value.valueOf()
  return value.format(format)
}

export function isSameDay(a: Dayjs | null, b: Dayjs | null): boolean {
  if (!a || !b) return a === b
  return a.year() === b.year() && a.month() === b.month() && a.date() === b.date()
}

export function isSameMonth(a: Dayjs | null, b: Dayjs | null): boolean {
  if (!a || !b) return a === b
  return a.year() === b.year() && a.month() === b.month()
}

export function isToday(value: Dayjs | null): boolean {
  return isSameDay(value, dayjs())
}

export interface MonthGridCell {
  date: Dayjs
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

// 生成 6×7=42 格月视图。weekStart=0 表示周日开头（与 Calendar 现有约定一致），1 表示周一开头。
export function generateMonthGrid(viewMonth: Dayjs, weekStart: 0 | 1 = 0): MonthGridCell[] {
  const firstDayOfMonth = viewMonth.startOf('month')
  const offset = (firstDayOfMonth.day() - weekStart + 7) % 7
  const start = firstDayOfMonth.subtract(offset, 'day')
  const cells: MonthGridCell[] = []
  for (let i = 0; i < 42; i += 1) {
    const date = start.add(i, 'day')
    cells.push({
      date,
      day: date.date(),
      isCurrentMonth: date.month() === viewMonth.month() && date.year() === viewMonth.year(),
      isToday: isToday(date),
    })
  }
  return cells
}
