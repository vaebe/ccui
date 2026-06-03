import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { __resetDeprecatedWarningsForTest, isPropExplicit, warnDeprecated } from './deprecated'

describe('shared/utils/deprecated', () => {
  beforeEach(() => {
    __resetDeprecatedWarningsForTest()
  })

  describe('warnDeprecated', () => {
    it('首次调用输出 console.warn 含 scope / key / replacement', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warnDeprecated('visible', 'open（v-model:open）', 'Modal')
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith('[ccui][Modal] visible 已 deprecated，请改用 open（v-model:open）。')
      warn.mockRestore()
    })

    it('同 scope + 同 key 第二次调用不重复输出（全局 Set 缓存）', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warnDeprecated('visible', 'open', 'Modal')
      warnDeprecated('visible', 'open', 'Modal')
      warnDeprecated('visible', 'open', 'Modal')
      expect(warn).toHaveBeenCalledTimes(1)
      warn.mockRestore()
    })

    it('不同 scope 同 key 各自 warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warnDeprecated('visible', 'open', 'Modal')
      warnDeprecated('visible', 'open', 'Drawer')
      expect(warn).toHaveBeenCalledTimes(2)
      warn.mockRestore()
    })

    it('省略 replacement：仅提示已 deprecated', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warnDeprecated('shouldUpdate', undefined, 'Form')
      expect(warn).toHaveBeenCalledWith('[ccui][Form] shouldUpdate 已 deprecated。')
      warn.mockRestore()
    })

    it('省略 scope：tag 退化为 [ccui]', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warnDeprecated('legacyExport', 'new export')
      expect(warn).toHaveBeenCalledWith('[ccui] legacyExport 已 deprecated，请改用 new export。')
      warn.mockRestore()
    })

    it('NODE_ENV=production：no-op', () => {
      const env = (globalThis as unknown as { process: { env: Record<string, string | undefined> } }).process.env
      const original = env.NODE_ENV
      env.NODE_ENV = 'production'
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warnDeprecated('visible', 'open', 'Modal')
      expect(warn).not.toHaveBeenCalled()
      env.NODE_ENV = original
      warn.mockRestore()
    })
  })

  describe('isPropExplicit', () => {
    it('camelCase key 命中', () => {
      expect(isPropExplicit({ nativeType: 'submit' }, 'nativeType', 'native-type')).toBe(true)
    })

    it('kebab-case key 命中', () => {
      expect(isPropExplicit({ 'native-type': 'submit' }, 'nativeType', 'native-type')).toBe(true)
    })

    it('两种 key 都没传：false', () => {
      expect(isPropExplicit({ otherProp: true }, 'nativeType', 'native-type')).toBe(false)
    })

    it('rawProps 为 null / undefined：false', () => {
      expect(isPropExplicit(null, 'x', 'x')).toBe(false)
      expect(isPropExplicit(undefined, 'x', 'x')).toBe(false)
    })

    it('值为 undefined 但 key 存在：仍视为显式传入', () => {
      expect(isPropExplicit({ visible: undefined }, 'visible', 'visible')).toBe(true)
    })
  })

  afterEach(() => {
    __resetDeprecatedWarningsForTest()
  })
})
