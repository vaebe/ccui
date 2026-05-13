import dayjs from 'dayjs'
import { describe, expect, it } from 'vite-plus/test'
import { generateDecadeYearGrid, generateQuarterGrid, generateYearMonthGrid, getWeekInfo } from './date'

describe('generateYearMonthGrid', () => {
  it('返回 12 个月，按 0..11 排列', () => {
    const cells = generateYearMonthGrid(dayjs('2026-05-12'))
    expect(cells).toHaveLength(12)
    expect(cells.map((c) => c.month)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    cells.forEach((c) => expect(c.date.year()).toBe(2026))
    expect(cells[0].date.month()).toBe(0)
    expect(cells[0].date.date()).toBe(1)
  })

  it('当前月命中 isToday，且 viewYear 不同年时全部 false', () => {
    const today = dayjs()
    const cur = generateYearMonthGrid(today)
    expect(cur.filter((c) => c.isToday)).toHaveLength(1)
    expect(cur[today.month()].isToday).toBe(true)

    const other = generateYearMonthGrid(today.subtract(2, 'year'))
    expect(other.filter((c) => c.isToday)).toHaveLength(0)
  })
})

describe('generateDecadeYearGrid', () => {
  it('返回 12 个年份：decadeStart-1 .. decadeStart+10', () => {
    const cells = generateDecadeYearGrid(dayjs('2026-05-12'))
    expect(cells).toHaveLength(12)
    expect(cells[0].year).toBe(2019)
    expect(cells[11].year).toBe(2030)
    expect(cells.map((c) => c.isInDecade)).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
    ])
  })

  it('decadeStart 按 floor(year/10)*10 取整：1995 → 1989..2000', () => {
    const cells = generateDecadeYearGrid(dayjs('1995-06-15'))
    expect(cells[0].year).toBe(1989)
    expect(cells[1].year).toBe(1990)
    expect(cells[10].year).toBe(1999)
    expect(cells[11].year).toBe(2000)
    expect(cells.filter((c) => c.isInDecade).map((c) => c.year)).toEqual([
      1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
    ])
  })

  it('每格 date 为该年 1 月 1 日', () => {
    const cells = generateDecadeYearGrid(dayjs('2026-05-12'))
    cells.forEach((c) => {
      expect(c.date.month()).toBe(0)
      expect(c.date.date()).toBe(1)
      expect(c.date.year()).toBe(c.year)
    })
  })
})

describe('generateQuarterGrid', () => {
  it('返回 Q1..Q4，每季首月分别为 1 / 4 / 7 / 10 月', () => {
    const cells = generateQuarterGrid(dayjs('2026-05-12'))
    expect(cells.map((c) => c.quarter)).toEqual([1, 2, 3, 4])
    expect(cells.map((c) => c.date.month())).toEqual([0, 3, 6, 9])
    cells.forEach((c) => {
      expect(c.date.year()).toBe(2026)
      expect(c.date.date()).toBe(1)
    })
  })

  it('isCurrentQuarter 仅在当前年命中当前季度', () => {
    const today = dayjs()
    const currentQ = Math.floor(today.month() / 3) + 1
    const cur = generateQuarterGrid(today)
    expect(cur.filter((c) => c.isCurrentQuarter).map((c) => c.quarter)).toEqual([currentQ])

    const other = generateQuarterGrid(today.subtract(3, 'year'))
    expect(other.filter((c) => c.isCurrentQuarter)).toHaveLength(0)
  })
})

describe('getWeekInfo ISO（weekStart=1）', () => {
  it('2026-01-01（周四）→ 2026 W1', () => {
    expect(getWeekInfo(dayjs('2026-01-01'), 1)).toEqual({ weekYear: 2026, weekNumber: 1 })
  })

  it('2023-01-01（周日）属于 2022 W52（跨年）', () => {
    expect(getWeekInfo(dayjs('2023-01-01'), 1)).toEqual({ weekYear: 2022, weekNumber: 52 })
  })

  it('2023-12-31（周日）属于 2023 W52', () => {
    expect(getWeekInfo(dayjs('2023-12-31'), 1)).toEqual({ weekYear: 2023, weekNumber: 52 })
  })

  it('2020-12-31（周四）属于 2020 W53（ISO 长年）', () => {
    expect(getWeekInfo(dayjs('2020-12-31'), 1)).toEqual({ weekYear: 2020, weekNumber: 53 })
  })
})

describe('getWeekInfo 美式（weekStart=0）', () => {
  it('weekYear 始终等于日历年', () => {
    expect(getWeekInfo(dayjs('2026-12-31'), 0).weekYear).toBe(2026)
    expect(getWeekInfo(dayjs('2026-01-01'), 0).weekYear).toBe(2026)
    expect(getWeekInfo(dayjs('2023-01-01'), 0).weekYear).toBe(2023)
  })

  it('Jan 1 总是 W1', () => {
    expect(getWeekInfo(dayjs('2026-01-01'), 0).weekNumber).toBe(1)
    expect(getWeekInfo(dayjs('2024-01-01'), 0).weekNumber).toBe(1)
  })

  it('2024-01-07（周日）是 W2 起始日', () => {
    // 2024-01-01 周一，US week 起周日 → W1 含 12/31..1/6，W2 自 1/7 起
    expect(getWeekInfo(dayjs('2024-01-07'), 0).weekNumber).toBe(2)
    expect(getWeekInfo(dayjs('2024-01-06'), 0).weekNumber).toBe(1)
  })
})
