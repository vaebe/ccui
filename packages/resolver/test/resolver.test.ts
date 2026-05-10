import { describe, expect, it } from 'vitest'
import { componentMap, componentNames, Vue3CCUIResolver } from '../src'

function call(resolver: ReturnType<typeof Vue3CCUIResolver>, name: string) {
  return resolver.resolve(name) as { name?: string; from: string; sideEffects?: string } | undefined
}

describe('Vue3CCUIResolver — basics', () => {
  it('returns type=component', () => {
    expect(Vue3CCUIResolver().type).toBe('component')
  })

  it('resolves a top-level component (CButton → Button)', () => {
    const result = call(Vue3CCUIResolver(), 'CButton')
    expect(result).toMatchObject({
      name: 'Button',
      from: 'vue3-ccui',
    })
  })

  it('resolves a sub-component (CFormItem → FormItem) with parent style dir', () => {
    const result = call(Vue3CCUIResolver({ importStyle: 'scss' }), 'CFormItem')
    expect(result).toMatchObject({
      name: 'FormItem',
      from: 'vue3-ccui',
      sideEffects: 'vue3-ccui/ui/form/src/form.scss',
    })
  })

  it('resolves Layout sub-components to their named exports', () => {
    const r = Vue3CCUIResolver({ importStyle: false })
    expect(call(r, 'CLayoutHeader')).toMatchObject({ name: 'Header', from: 'vue3-ccui' })
    expect(call(r, 'CLayoutFooter')).toMatchObject({ name: 'Footer', from: 'vue3-ccui' })
    expect(call(r, 'CLayoutSider')).toMatchObject({ name: 'Sider', from: 'vue3-ccui' })
    expect(call(r, 'CLayoutContent')).toMatchObject({ name: 'Content', from: 'vue3-ccui' })
  })

  it('returns undefined for unknown names', () => {
    expect(call(Vue3CCUIResolver(), 'CUnknownComponent')).toBeUndefined()
  })

  it('returns undefined for names without the prefix', () => {
    expect(call(Vue3CCUIResolver(), 'Button')).toBeUndefined()
    expect(call(Vue3CCUIResolver(), 'AButton')).toBeUndefined()
  })
})

describe('Vue3CCUIResolver — importStyle', () => {
  it("'css' imports the global bundle (default)", () => {
    const result = call(Vue3CCUIResolver(), 'CButton')
    expect(result?.sideEffects).toBe('vue3-ccui/dist/vue3-ccui.css')
  })

  it("'css' returns the same bundle for every component (so it dedupes)", () => {
    const r = Vue3CCUIResolver({ importStyle: 'css' })
    expect(call(r, 'CButton')?.sideEffects).toBe('vue3-ccui/dist/vue3-ccui.css')
    expect(call(r, 'CTable')?.sideEffects).toBe('vue3-ccui/dist/vue3-ccui.css')
    expect(call(r, 'CForm')?.sideEffects).toBe('vue3-ccui/dist/vue3-ccui.css')
  })

  it("'scss' imports the per-component source file", () => {
    const r = Vue3CCUIResolver({ importStyle: 'scss' })
    expect(call(r, 'CButton')?.sideEffects).toBe('vue3-ccui/ui/button/src/button.scss')
    expect(call(r, 'CAutoComplete')?.sideEffects).toBe('vue3-ccui/ui/auto-complete/src/auto-complete.scss')
    expect(call(r, 'CQRCode')?.sideEffects).toBe('vue3-ccui/ui/qr-code/src/qr-code.scss')
  })

  it("'scss' shares the parent dir for sub-components", () => {
    const r = Vue3CCUIResolver({ importStyle: 'scss' })
    expect(call(r, 'CCol')?.sideEffects).toBe('vue3-ccui/ui/grid/src/grid.scss')
    expect(call(r, 'CRow')?.sideEffects).toBe('vue3-ccui/ui/grid/src/grid.scss')
    expect(call(r, 'CTypographyText')?.sideEffects).toBe('vue3-ccui/ui/typography/src/typography.scss')
  })

  it('false omits sideEffects entirely', () => {
    const result = call(Vue3CCUIResolver({ importStyle: false }), 'CButton')
    expect(result).toMatchObject({ name: 'Button', from: 'vue3-ccui' })
    expect(result?.sideEffects).toBeUndefined()
  })
})

describe('Vue3CCUIResolver — options', () => {
  it('exclude string skips matching names', () => {
    const r = Vue3CCUIResolver({ exclude: 'CButton' })
    expect(call(r, 'CButton')).toBeUndefined()
    expect(call(r, 'CInput')).toMatchObject({ name: 'Input' })
  })

  it('exclude regex skips matching names', () => {
    const r = Vue3CCUIResolver({ exclude: /^CButton/ })
    expect(call(r, 'CButton')).toBeUndefined()
    expect(call(r, 'CButton3d')).toBeUndefined()
    expect(call(r, 'CInput')).toMatchObject({ name: 'Input' })
  })

  it('exclude array combines string and regex', () => {
    const r = Vue3CCUIResolver({ exclude: ['CInput', /^CForm/] })
    expect(call(r, 'CInput')).toBeUndefined()
    expect(call(r, 'CForm')).toBeUndefined()
    expect(call(r, 'CFormItem')).toBeUndefined()
    expect(call(r, 'CButton')).toMatchObject({ name: 'Button' })
  })

  it('custom prefix', () => {
    const r = Vue3CCUIResolver({ prefix: 'X' })
    expect(call(r, 'CButton')).toBeUndefined() // wrong prefix now
    // No XButton entry exists in the map → still undefined.
    expect(call(r, 'XButton')).toBeUndefined()
  })

  it('importFrom rewires the package name', () => {
    const r = Vue3CCUIResolver({ importFrom: 'my-vendored-ccui', importStyle: 'scss' })
    const result = call(r, 'CButton')
    expect(result?.from).toBe('my-vendored-ccui')
    expect(result?.sideEffects).toBe('my-vendored-ccui/ui/button/src/button.scss')
  })

  it('cssBundlePath override (absolute-style path)', () => {
    const r = Vue3CCUIResolver({
      cssBundlePath: 'vue3-ccui/dist/custom-style.css',
    })
    expect(call(r, 'CButton')?.sideEffects).toBe('vue3-ccui/dist/custom-style.css')
  })

  it('cssBundlePath override (relative path is prefixed with package name)', () => {
    const r = Vue3CCUIResolver({ cssBundlePath: 'theme/full.css' })
    expect(call(r, 'CButton')?.sideEffects).toBe('vue3-ccui/theme/full.css')
  })
})

describe('Vue3CCUIResolver — coverage of the component map', () => {
  it('has 92 entries covering top-level + sub-components', () => {
    // 70 component dirs in template-resolvable scope (73 dirs minus message/
    // notification/util) and 23 named sub-components. Grid only contributes
    // CCol + CRow (no top-level CGrid), so the total is 69 + 23 = 92.
    expect(componentNames.length).toBe(92)
  })

  it('every entry resolves with default options', () => {
    const r = Vue3CCUIResolver()
    for (const name of componentNames) {
      const result = call(r, name)
      expect(result, `failed to resolve ${name}`).toBeDefined()
      expect(result?.from).toBe('vue3-ccui')
      expect(result?.name).toBe(componentMap[name]!.exportName)
    }
  })

  it('every styleDir maps to a non-empty kebab-case string', () => {
    for (const [name, entry] of Object.entries(componentMap)) {
      expect(entry.styleDir, `${name} styleDir`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})
