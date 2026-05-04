import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Panel, Splitter } from '../index'

const sNs = useNamespace('splitter', true)
const pNs = useNamespace('splitter-panel', true)

describe('splitter', () => {
  it('renders horizontal layout by default', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter><Panel :default-size="200">A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.find(sNs.b()).exists()).toBe(true)
    expect(wrapper.find(sNs.m('horizontal')).exists()).toBe(true)
    expect(wrapper.findAll(pNs.b()).length).toBe(2)
  })

  it('renders resizer between panels', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter><Panel :default-size="100">A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.findAll(pNs.e('resizer')).length).toBe(2)
  })

  it('vertical layout adds modifier', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter layout="vertical"><Panel>A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.find(sNs.m('vertical')).exists()).toBe(true)
  })

  it('non-resizable panel hides resizer', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter><Panel :resizable="false">A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.findAll(pNs.e('resizer')).length).toBe(1)
  })
})
