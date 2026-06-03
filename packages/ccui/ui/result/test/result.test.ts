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

  it('renders 403 and 500 default texts', () => {
    const forbidden = mount(Result, { props: { status: '403' } })
    const error = mount(Result, { props: { status: '500' } })

    expect(forbidden.find(ns.e('title')).text()).toBe('403')
    expect(forbidden.find(ns.e('subtitle')).text()).toContain('not authorized')
    expect(error.find(ns.e('title')).text()).toBe('500')
    expect(error.find(ns.e('subtitle')).text()).toContain('something went wrong')
  })

  it('renders custom icon and default content slots', () => {
    const wrapper = mount(Result, {
      props: { status: 'info' },
      slots: {
        icon: '<span class="custom-icon">i</span>',
        default: '<div class="content">Details</div>',
      },
    })

    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find(ns.e('content')).text()).toBe('Details')
  })

  it('does not render title or subtitle when absent', () => {
    const wrapper = mount(Result, { props: { status: 'info' } })
    expect(wrapper.find(ns.e('title')).exists()).toBe(false)
    expect(wrapper.find(ns.e('subtitle')).exists()).toBe(false)
  })
})
