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
      from: '@vaebe/ccui',
    })
  })

  it('resolves a sub-component (CFormItem → FormItem) with parent style dir', () => {
    const result = call(Vue3CCUIResolver({ importStyle: 'scss' }), 'CFormItem')
    expect(result).toMatchObject({
      name: 'FormItem',
      from: '@vaebe/ccui',
      sideEffects: '@vaebe/ccui/ui/form/src/form.scss',
    })
  })

  it('resolves Layout sub-components to their named exports', () => {
    const r = Vue3CCUIResolver({ importStyle: false })
    expect(call(r, 'CLayoutHeader')).toMatchObject({ name: 'Header', from: '@vaebe/ccui' })
    expect(call(r, 'CLayoutFooter')).toMatchObject({ name: 'Footer', from: '@vaebe/ccui' })
    expect(call(r, 'CLayoutSider')).toMatchObject({ name: 'Sider', from: '@vaebe/ccui' })
    expect(call(r, 'CLayoutContent')).toMatchObject({ name: 'Content', from: '@vaebe/ccui' })
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
    expect(result?.sideEffects).toBe('@vaebe/ccui/style.css')
  })

  it("'css' returns the same bundle for every component (so it dedupes)", () => {
    const r = Vue3CCUIResolver({ importStyle: 'css' })
    expect(call(r, 'CButton')?.sideEffects).toBe('@vaebe/ccui/style.css')
    expect(call(r, 'CTable')?.sideEffects).toBe('@vaebe/ccui/style.css')
    expect(call(r, 'CForm')?.sideEffects).toBe('@vaebe/ccui/style.css')
  })

  it("'scss' imports the per-component source file", () => {
    const r = Vue3CCUIResolver({ importStyle: 'scss' })
    expect(call(r, 'CButton')?.sideEffects).toBe('@vaebe/ccui/ui/button/src/button.scss')
    expect(call(r, 'CAutoComplete')?.sideEffects).toBe('@vaebe/ccui/ui/auto-complete/src/auto-complete.scss')
  })

  it("'scss' shares the parent dir for sub-components", () => {
    const r = Vue3CCUIResolver({ importStyle: 'scss' })
    expect(call(r, 'CCol')?.sideEffects).toBe('@vaebe/ccui/ui/grid/src/grid.scss')
    expect(call(r, 'CRow')?.sideEffects).toBe('@vaebe/ccui/ui/grid/src/grid.scss')
    expect(call(r, 'CTypographyText')?.sideEffects).toBe('@vaebe/ccui/ui/typography/src/typography.scss')
    // Table sub-components share the table dir (their own dirs ship no .scss).
    expect(call(r, 'CTableColumn')?.sideEffects).toBe('@vaebe/ccui/ui/table/src/table.scss')
    expect(call(r, 'CTableColumnGroup')?.sideEffects).toBe('@vaebe/ccui/ui/table/src/table.scss')
    expect(call(r, 'CTableSummary')?.sideEffects).toBe('@vaebe/ccui/ui/table/src/table.scss')
    // ButtonGroup falls back to the button dir (sibling button-group.scss is
    // not addressable by the `<dir>/src/<dir>.scss` resolver template).
    expect(call(r, 'CButtonGroup')?.sideEffects).toBe('@vaebe/ccui/ui/button/src/button.scss')
    // CheckableTagGroup shares the checkable-tag dir with CheckableTag.
    expect(call(r, 'CCheckableTagGroup')?.sideEffects).toBe('@vaebe/ccui/ui/checkable-tag/src/checkable-tag.scss')
  })

  it("'scss' resolves stand-alone sub-component dirs to their own .scss", () => {
    const r = Vue3CCUIResolver({ importStyle: 'scss' })
    // These sub-components live in their own directory which ships its own
    // <dir>.scss — so they resolve to that file, not the parent's.
    expect(call(r, 'CBadgeRibbon')?.sideEffects).toBe('@vaebe/ccui/ui/badge-ribbon/src/badge-ribbon.scss')
    expect(call(r, 'CCardMeta')?.sideEffects).toBe('@vaebe/ccui/ui/card-meta/src/card-meta.scss')
    expect(call(r, 'CImagePreview')?.sideEffects).toBe('@vaebe/ccui/ui/image-preview/src/image-preview.scss')
    expect(call(r, 'CInputOtp')?.sideEffects).toBe('@vaebe/ccui/ui/input-otp/src/input-otp.scss')
    expect(call(r, 'CInputSearch')?.sideEffects).toBe('@vaebe/ccui/ui/input-search/src/input-search.scss')
    expect(call(r, 'CSkeletonNode')?.sideEffects).toBe('@vaebe/ccui/ui/skeleton-node/src/skeleton-node.scss')
    expect(call(r, 'CSpaceCompact')?.sideEffects).toBe('@vaebe/ccui/ui/space-compact/src/space-compact.scss')
    expect(call(r, 'CTextarea')?.sideEffects).toBe('@vaebe/ccui/ui/textarea/src/textarea.scss')
  })

  it('false omits sideEffects entirely', () => {
    const result = call(Vue3CCUIResolver({ importStyle: false }), 'CButton')
    expect(result).toMatchObject({ name: 'Button', from: '@vaebe/ccui' })
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
      cssBundlePath: '@vaebe/ccui/dist/custom-style.css',
    })
    expect(call(r, 'CButton')?.sideEffects).toBe('@vaebe/ccui/dist/custom-style.css')
  })

  it('cssBundlePath override (relative path is prefixed with package name)', () => {
    const r = Vue3CCUIResolver({ cssBundlePath: 'theme/full.css' })
    expect(call(r, 'CButton')?.sideEffects).toBe('@vaebe/ccui/theme/full.css')
  })
})

describe('Vue3CCUIResolver — coverage of the component map', () => {
  it('component map and exported names stay in sync', () => {
    // 数字硬编码每次新增/删除 sub-component 都要同步改，太脆。改成做自一致性
    // 校验 + 维护一个上下限，发现明显漂移再人工对账。
    expect(componentNames.length).toBe(Object.keys(componentMap).length)
    expect(componentNames.length).toBeGreaterThanOrEqual(80)
    expect(componentNames.length).toBeLessThanOrEqual(120)
  })

  it('every entry resolves with default options', () => {
    const r = Vue3CCUIResolver()
    for (const name of componentNames) {
      const result = call(r, name)
      expect(result, `failed to resolve ${name}`).toBeDefined()
      expect(result?.from).toBe('@vaebe/ccui')
      expect(result?.name).toBe(componentMap[name]!.exportName)
    }
  })

  it('every styleDir maps to a non-empty kebab-case string', () => {
    for (const [name, entry] of Object.entries(componentMap)) {
      expect(entry.styleDir, `${name} styleDir`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})
