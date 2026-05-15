import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { CardGrid } from '../index'

const ns = useNamespace('card-grid', true)
const cls = useNamespace('card-grid')

describe('card-grid', () => {
  it('挂载基础 DOM', () => {
    const wrapper = mount(CardGrid, { slots: { default: '内容' } })
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.text()).toBe('内容')
  })

  it('默认 hoverable=true 加 --hoverable modifier', () => {
    const wrapper = mount(CardGrid)
    expect(wrapper.find(ns.b()).classes()).toContain(cls.m('hoverable'))
  })

  it('hoverable=false 不加 modifier', () => {
    const wrapper = mount(CardGrid, { props: { hoverable: false } })
    expect(wrapper.find(ns.b()).classes()).not.toContain(cls.m('hoverable'))
  })

  it('colSpan=12 写入 width 50%', () => {
    const wrapper = mount(CardGrid, { props: { colSpan: 12 } })
    const style = wrapper.find(ns.b()).attributes('style') ?? ''
    expect(style).toContain('width: 50%')
  })

  it('colSpan=24 写入 width 100%', () => {
    const wrapper = mount(CardGrid, { props: { colSpan: 24 } })
    expect(wrapper.find(ns.b()).attributes('style')).toContain('width: 100%')
  })

  it('colSpan 越界（>24）夹紧到 24', () => {
    const wrapper = mount(CardGrid, { props: { colSpan: 99 } })
    expect(wrapper.find(ns.b()).attributes('style')).toContain('width: 100%')
  })

  it('colSpan 越界（<1）夹紧到 1', () => {
    const wrapper = mount(CardGrid, { props: { colSpan: 0 } })
    const style = wrapper.find(ns.b()).attributes('style') ?? ''
    // 1/24 ≈ 4.1666...%
    expect(style).toMatch(/width:\s*4\.166.*%/)
  })

  it('bodyStyle 透传 inline style', () => {
    const wrapper = mount(CardGrid, { props: { bodyStyle: { padding: '8px', color: 'red' } } })
    const style = wrapper.find(ns.b()).attributes('style') ?? ''
    expect(style).toContain('padding: 8px')
    expect(style).toContain('color: red')
  })

  it('未传 colSpan 时不挂 width inline', () => {
    const wrapper = mount(CardGrid)
    const style = wrapper.find(ns.b()).attributes('style') ?? ''
    expect(style).not.toContain('width:')
  })
})
