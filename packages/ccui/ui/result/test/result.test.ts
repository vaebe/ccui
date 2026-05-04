import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Result } from '../index'

const ns = useNamespace('result', true)

describe('result', () => {
  it('renders title and subtitle', () => {
    const wrapper = mount(Result, { props: { title: 'OK', subTitle: '操作成功' } })
    expect(wrapper.find(ns.e('title')).text()).toBe('OK')
    expect(wrapper.find(ns.e('subtitle')).text()).toBe('操作成功')
  })

  it('renders default 404 text', () => {
    const wrapper = mount(Result, { props: { status: '404' } })
    expect(wrapper.find(ns.e('title')).text()).toBe('404')
    expect(wrapper.find(ns.e('subtitle')).text()).toContain('does not exist')
  })

  it('renders extra slot', () => {
    const wrapper = mount(Result, {
      props: { title: 'x' },
      slots: { extra: '<button class="back">back</button>' },
    })
    expect(wrapper.find('.back').exists()).toBe(true)
  })

  it('applies status modifier', () => {
    const wrapper = mount(Result, { props: { status: 'success', title: 'ok' } })
    expect(wrapper.find(ns.m('success')).exists()).toBe(true)
  })
})
