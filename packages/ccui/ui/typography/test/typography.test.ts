import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Link, Paragraph, Text, Title, Typography } from '../index'

const ns = useNamespace('typography', true)

describe('typography', () => {
  it('text renders span with type modifier', () => {
    const wrapper = mount(Text, { props: { type: 'success' }, slots: { default: 'ok' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.find(ns.m('success')).exists()).toBe(true)
  })

  it('paragraph renders div', () => {
    const wrapper = mount(Paragraph, { slots: { default: 'Hello' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find(ns.m('paragraph')).exists()).toBe(true)
  })

  it('title renders h tag based on level', () => {
    const wrapper = mount(Title, { props: { level: 3 }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName).toBe('H3')
    expect(wrapper.find(ns.m('title-3')).exists()).toBe(true)
  })

  it('link renders anchor with href', () => {
    const wrapper = mount(Link, { props: { href: '/x' }, slots: { default: 'go' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/x')
  })

  it('text wraps decorations like strong + code', () => {
    const wrapper = mount(Text, { props: { strong: true, code: true }, slots: { default: 'x' } })
    expect(wrapper.find('strong').exists()).toBe(true)
    expect(wrapper.find('code').exists()).toBe(true)
  })

  it('text applies disabled and all decorations', () => {
    const wrapper = mount(Text, {
      props: {
        disabled: true,
        keyboard: true,
        mark: true,
        underline: true,
        delete: true,
        italic: true,
      },
      slots: { default: 'x' },
    })

    expect(wrapper.find(ns.m('disabled')).exists()).toBe(true)
    expect(wrapper.find('kbd').exists()).toBe(true)
    expect(wrapper.find('mark').exists()).toBe(true)
    expect(wrapper.find('u').exists()).toBe(true)
    expect(wrapper.find('del').exists()).toBe(true)
    expect(wrapper.find('i').exists()).toBe(true)
  })

  it('renders multiple decorated slot children', () => {
    const wrapper = mount(Text, {
      props: { strong: true },
      slots: {
        default: '<span>a</span><span>b</span>',
      },
    })

    expect(wrapper.findAll('strong').length).toBe(2)
  })

  it('renders empty text without slot content', () => {
    const wrapper = mount(Text)
    expect(wrapper.text()).toBe('')
  })

  it('link supports target and type modifier', () => {
    const wrapper = mount(Link, {
      props: { href: '/x', target: '_blank', type: 'danger' },
      slots: { default: 'go' },
    })

    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.find(ns.m('danger')).exists()).toBe(true)
  })

  it('preserves link attrs when href and target props are omitted', () => {
    const wrapper = mount(Link, {
      attrs: { href: '/from-attrs', target: '_blank' },
      slots: { default: 'go' },
    })

    expect(wrapper.attributes('href')).toBe('/from-attrs')
    expect(wrapper.attributes('target')).toBe('_blank')
  })

  it('typography root renders article wrapper', () => {
    const wrapper = mount(Typography, { slots: { default: '<p>Body</p>' } })
    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.find(ns.b()).exists()).toBe(true)
  })

  it('forwards root attrs and gives interactive controls accessible names', () => {
    const wrapper = mount(Text, {
      attrs: { 'data-testid': 'text', 'aria-describedby': 'description' },
      props: { copyable: true, editable: true },
      slots: { default: 'Body' },
    })

    expect(wrapper.attributes('data-testid')).toBe('text')
    expect(wrapper.attributes('aria-describedby')).toBe('description')
    expect(wrapper.find('.ccui-typography__copy').attributes('aria-label')).toBe('复制')
    expect(wrapper.find('.ccui-typography__edit').attributes('aria-label')).toBe('编辑')
  })

  it('preserves caller title when ellipsis tooltip is disabled', () => {
    const wrapper = mount(Text, {
      attrs: { title: 'Keep this native hint' },
      slots: { default: 'Body' },
    })

    expect(wrapper.attributes('title')).toBe('Keep this native hint')
  })
})
