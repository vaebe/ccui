import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { __resetDeprecationWarningsForTest, isPropExplicit, warnDeprecatedProp } from './use-deprecation-warning'

describe('use-deprecation-warning', () => {
  beforeEach(() => {
    __resetDeprecationWarningsForTest()
  })

  describe('warnDeprecatedProp', () => {
    it('首次调用输出 console.warn 含组件名 / 旧名 / 建议', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warnDeprecatedProp('Modal', 'visible', 'open（v-model:open）')
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith('[ccui][Modal] visible 已 deprecated，请改用 open（v-model:open）。')
      warn.mockRestore()
    })

    it('同 component + 同 key 第二次调用不重复输出（全局 Set 缓存）', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warnDeprecatedProp('Modal', 'visible', 'open')
      warnDeprecatedProp('Modal', 'visible', 'open')
      warnDeprecatedProp('Modal', 'visible', 'open')
      expect(warn).toHaveBeenCalledTimes(1)
      warn.mockRestore()
    })

    it('不同 component 同 key 各自 warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warnDeprecatedProp('Modal', 'visible', 'open')
      warnDeprecatedProp('Drawer', 'visible', 'open')
      expect(warn).toHaveBeenCalledTimes(2)
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
})
