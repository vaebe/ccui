import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Col, Row } from '../index'

const rowNs = useNamespace('row', true)
const colNs = useNamespace('col', true)

describe('grid', () => {
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
})
