import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Col, Row } from '../index'

const rowNs = useNamespace('row', true)
const colNs = useNamespace('col', true)

describe('grid', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders Row with default classes', () => {
    const wrapper = mount(Row, {
      slots: { default: '<div>x</div>' },
    })
    expect(wrapper.find(rowNs.b()).exists()).toBe(true)
    expect(wrapper.find(rowNs.m('justify-start')).exists()).toBe(true)
    expect(wrapper.find(rowNs.m('align-top')).exists()).toBe(true)
  })

  it('row applies justify and align modifiers', () => {
    const wrapper = mount(Row, {
      props: { justify: 'space-between', align: 'middle' },
      slots: { default: '<div>x</div>' },
    })
    expect(wrapper.find(rowNs.m('justify-space-between')).exists()).toBe(true)
    expect(wrapper.find(rowNs.m('align-middle')).exists()).toBe(true)
  })

  it('col applies span modifier', () => {
    const wrapper = mount({
      components: { Row, Col },
      template: `<Row><Col :span="12">A</Col></Row>`,
    })
    expect(wrapper.find(colNs.m('span-12')).exists()).toBe(true)
  })

  it('col applies responsive size as object', () => {
    const wrapper = mount({
      components: { Row, Col },
      template: `<Row><Col :md="{ span: 8, offset: 2 }">A</Col></Row>`,
    })
    expect(wrapper.find(colNs.m('md-8')).exists()).toBe(true)
    expect(wrapper.find(colNs.m('md-offset-2')).exists()).toBe(true)
  })

  it('row gutter sets negative margin and Col padding', () => {
    const wrapper = mount({
      components: { Row, Col },
      template: `<Row :gutter="16"><Col :span="12">A</Col></Row>`,
    })
    const rowStyle = wrapper.find(rowNs.b()).attributes('style') ?? ''
    expect(rowStyle).toContain('margin-inline-start: -8px')
  })

  it('supports vertical gutter and no-wrap modifier', () => {
    const wrapper = mount({
      components: { Row, Col },
      template: `<Row :gutter="[24, 12]" :wrap="false"><Col :span="12">A</Col></Row>`,
    })

    const rowStyle = wrapper.find(rowNs.b()).attributes('style') ?? ''
    const colStyle = wrapper.find(colNs.b()).attributes('style') ?? ''
    expect(wrapper.find(rowNs.m('no-wrap')).exists()).toBe(true)
    expect(rowStyle).toContain('margin-inline-start: -12px')
    expect(rowStyle).toContain('row-gap: 12px')
    expect(colStyle).toContain('padding-inline-start: 12px')
    expect(colStyle).toContain('padding-inline-end: 12px')
  })

  it('resolves responsive gutter from current breakpoint and updates on resize', async () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800)
    const wrapper = mount({
      components: { Row, Col },
      template: `<Row :gutter="{ xs: 8, md: [32, 20] }"><Col>A</Col></Row>`,
    })
    await nextTick()

    expect(wrapper.find(rowNs.b()).attributes('style')).toContain('margin-inline-start: -16px')
    expect(wrapper.find(rowNs.b()).attributes('style')).toContain('row-gap: 20px')

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500)
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(wrapper.find(rowNs.b()).attributes('style')).toContain('margin-inline-start: -4px')
  })

  it('col applies order offset push pull flex and numeric responsive size', () => {
    const wrapper = mount({
      components: { Row, Col },
      template: `<Row><Col :span="6" :order="2" :offset="1" :push="3" :pull="4" :flex="2" :sm="10">A</Col></Row>`,
    })
    const col = wrapper.find(colNs.b())

    expect(col.classes()).toContain(colNs.m('span-6').slice(1))
    expect(col.classes()).toContain(colNs.m('order-2').slice(1))
    expect(col.classes()).toContain(colNs.m('offset-1').slice(1))
    expect(col.classes()).toContain(colNs.m('push-3').slice(1))
    expect(col.classes()).toContain(colNs.m('pull-4').slice(1))
    expect(col.classes()).toContain(colNs.m('sm-10').slice(1))
    expect(col.attributes('style')).toContain('flex: 2 2 auto')
  })
})
