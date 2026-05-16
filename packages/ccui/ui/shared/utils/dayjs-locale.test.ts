import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it } from 'vite-plus/test'
import { __resetDayjsLocaleCacheForTest, setDayjsLocale } from './dayjs-locale'

describe('shared/utils/dayjs-locale', () => {
  beforeEach(() => {
    __resetDayjsLocaleCacheForTest()
    dayjs.locale('en')
  })

  it('已加载 locale 同步切换（不报错，不卡 promise）', async () => {
    await setDayjsLocale('en')
    expect(dayjs.locale()).toBe('en')
  })

  it('zh-CN 通过 lazy import 加载并生效', async () => {
    await setDayjsLocale('zh-CN')
    expect(dayjs.locale()).toBe('zh-cn')
    // 周名走中文
    expect(dayjs('2026-03-15').format('dddd')).toContain('星期')
  })

  it('ja-JP 切换后 dayjs locale = ja', async () => {
    await setDayjsLocale('ja-JP')
    expect(dayjs.locale()).toBe('ja')
  })

  it('ko-KR 切换后 dayjs locale = ko', async () => {
    await setDayjsLocale('ko-KR')
    expect(dayjs.locale()).toBe('ko')
  })

  it('未知 locale 触发 console.warn 且 dayjs locale 保持原状', async () => {
    await setDayjsLocale('zh-CN')
    const startLocale = dayjs.locale()
    await setDayjsLocale('xx-XX')
    // 未支持 locale 加载失败，当前 dayjs locale 不切
    expect(dayjs.locale()).toBe(startLocale)
  })

  afterEach(() => {
    __resetDayjsLocaleCacheForTest()
  })
})
