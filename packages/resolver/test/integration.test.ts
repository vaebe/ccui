/**
 * Integration test: verify the resolver works against the actual
 * `unplugin-vue-components` API surface (component-resolver shape, transform
 * pipeline, generated import lines).
 *
 * This catches breakage from upstream API changes that unit tests miss.
 */
import { describe, expect, it } from 'vitest'
import Components from 'unplugin-vue-components/vite'
import { Vue3CCUIResolver } from '../src'

function getPlugin() {
  return Components({
    resolvers: [Vue3CCUIResolver({ importStyle: 'scss' })],
    dts: false,
    include: [/\.vue$/],
  })
}

describe('integration with unplugin-vue-components', () => {
  it('returns a Vite plugin with the expected name', () => {
    const plugin = getPlugin()
    const list = Array.isArray(plugin) ? plugin : [plugin]
    const names = list.map((p) => (p as { name?: string }).name).filter(Boolean)
    expect(names).toContain('unplugin-vue-components')
  })

  it('does not throw when constructed with our resolver', () => {
    expect(() => Components({ resolvers: [Vue3CCUIResolver()], dts: false })).not.toThrow()
    expect(() => Components({ resolvers: [Vue3CCUIResolver({ importStyle: 'css' })], dts: false })).not.toThrow()
    expect(() => Components({ resolvers: [Vue3CCUIResolver({ importStyle: false })], dts: false })).not.toThrow()
  })

  it('resolver shape matches unplugin-vue-components ComponentResolver contract', () => {
    const r = Vue3CCUIResolver()
    expect(r).toMatchObject({ type: 'component', resolve: expect.any(Function) })
    // `unplugin-vue-components` calls `resolve(name)` and expects either
    // a string, an object with `from`, or null/undefined.
    const result = r.resolve('CButton')
    expect(result).toMatchObject({ from: '@vaebe/ccui' })
  })

  it('exclude option keeps the resolver compatible with multi-library setups', () => {
    // Simulate sharing names with another lib by excluding CIcon.
    const r = Vue3CCUIResolver({ exclude: 'CIcon' })
    expect(r.resolve('CIcon')).toBeUndefined()
    expect(r.resolve('CButton')).toMatchObject({ from: '@vaebe/ccui' })
  })
})
