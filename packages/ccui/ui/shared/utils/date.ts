import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayjs.extend(customParseFormat)
dayjs.extend(quarterOfYear)
dayjs.extend(advancedFormat)

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

export interface TimeColumnCell {
  value: number
  disabled: boolean
}

// 生成 0..range-1 的时间列（小时 0-23 / 分钟 0-59 / 秒 0-59），按 step 过滤，传入的 disabledValues
// 决定哪些值被标记 disabled。step <= 1 时输出全集，step >= range 时输出仅起始值 0。
export function buildTimeColumnValues(
  range: number,
  step: number,
  disabledValues?: readonly number[],
): TimeColumnCell[] {
  const safeStep = step > 0 ? step : 1
  const disabledSet = disabledValues ? new Set(disabledValues) : null
  const cells: TimeColumnCell[] = []
  for (let v = 0; v < range; v += safeStep) {
    cells.push({ value: v, disabled: disabledSet ? disabledSet.has(v) : false })
  }
  return cells
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

export interface YearMonthCell {
  date: Dayjs // 该月 1 号
  month: number // 0-11
  isToday: boolean
}

// 月选择面板：viewYear 所在年的 12 个月。
export function generateYearMonthGrid(viewYear: Dayjs): YearMonthCell[] {
  const yr = viewYear.year()
  const today = dayjs()
  const cells: YearMonthCell[] = []
  for (let m = 0; m < 12; m += 1) {
    cells.push({
      date: viewYear.year(yr).month(m).date(1),
      month: m,
      isToday: today.year() === yr && today.month() === m,
    })
  }
  return cells
}

export interface DecadeYearCell {
  date: Dayjs // 该年 1 月 1 日
  year: number
  isInDecade: boolean
  isToday: boolean
}

// 年选择面板：以 viewYear 所在 10 年为主，左右各贴一年作为出界占位。
// 例如 viewYear=2026 → cells 覆盖 2019..2030，其中 2020..2029 标 isInDecade=true。
export function generateDecadeYearGrid(viewYear: Dayjs): DecadeYearCell[] {
  const yr = viewYear.year()
  const decadeStart = Math.floor(yr / 10) * 10
  const today = dayjs().year()
  const cells: DecadeYearCell[] = []
  for (let i = -1; i <= 10; i += 1) {
    const y = decadeStart + i
    cells.push({
      date: viewYear.year(y).month(0).date(1),
      year: y,
      isInDecade: i >= 0 && i <= 9,
      isToday: today === y,
    })
  }
  return cells
}

export interface QuarterCell {
  date: Dayjs // 该季度首日
  quarter: number // 1-4
  isCurrentQuarter: boolean
}

// 季度面板：viewYear 所在年的 4 个季度。
export function generateQuarterGrid(viewYear: Dayjs): QuarterCell[] {
  const yr = viewYear.year()
  const today = dayjs()
  const currentQ = Math.floor(today.month() / 3) + 1
  const cells: QuarterCell[] = []
  for (let q = 1; q <= 4; q += 1) {
    const startMonth = (q - 1) * 3
    cells.push({
      date: viewYear.year(yr).month(startMonth).date(1),
      quarter: q,
      isCurrentQuarter: today.year() === yr && currentQ === q,
    })
  }
  return cells
}

export interface WeekInfo {
  weekYear: number
  weekNumber: number
}

// 周计数。weekStart=1 走 ISO 8601（含首个周四的那周为 W1，可能跨年）；
// weekStart=0 走美式（含 Jan 1 的那周为 W1，weekYear 不跨年）。
export function getWeekInfo(date: Dayjs, weekStart: 0 | 1 = 0): WeekInfo {
  const target = date.startOf('day')
  if (weekStart === 1) {
    // Mon=0..Sun=6
    const dow = (target.day() + 6) % 7
    const thursday = target.add(3 - dow, 'day')
    const weekYear = thursday.year()
    const jan4 = dayjs(new Date(weekYear, 0, 4))
    const jan4Dow = (jan4.day() + 6) % 7
    const week1Monday = jan4.subtract(jan4Dow, 'day').startOf('day')
    const weekNumber = Math.floor(thursday.diff(week1Monday, 'day') / 7) + 1
    return { weekYear, weekNumber }
  }
  const yr = target.year()
  const jan1 = dayjs(new Date(yr, 0, 1)).startOf('day')
  const week1Sunday = jan1.subtract(jan1.day(), 'day')
  const weekNumber = Math.floor(target.diff(week1Sunday, 'day') / 7) + 1
  return { weekYear: yr, weekNumber }
}
