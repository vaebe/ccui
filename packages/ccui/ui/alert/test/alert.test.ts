import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Alert } from '../index'

const ns = useNamespace('alert', true)

describe('alert', () => {
  it('renders message and type modifier', () => {
    const wrapper = mount(Alert, { props: { type: 'success', message: 'ok' } })
    expect(wrapper.find(ns.m('success')).exists()).toBe(true)
    expect(wrapper.text()).toContain('ok')
  })

  it('renders description and toggles modifier', () => {
    const wrapper = mount(Alert, {
      props: { message: 'm', description: 'd' },
    })
    expect(wrapper.find(ns.m('with-description')).exists()).toBe(true)
    expect(wrapper.text()).toContain('d')
  })

  it('shows icon when showIcon', () => {
    const wrapper = mount(Alert, { props: { type: 'info', message: 'm', showIcon: true } })
    expect(wrapper.find(ns.e('icon')).exists()).toBe(true)
  })

  it('emits close and unmounts', async () => {
    const wrapper = mount(Alert, { props: { message: 'm', closable: true } })
    await wrapper.find(ns.e('close')).trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  describe('M-A2 classNames / styles 钩子', () => {
    it('classNames.root 注入到根节点', () => {
      const wrapper = mount(Alert, {
        props: { message: 'm', classNames: { root: 'my-root' } },
      })
      expect(wrapper.find('.ccui-alert').classes()).toContain('my-root')
    })

    it('styles.root 注入到根节点 style', () => {
      const wrapper = mount(Alert, {
        props: { message: 'm', styles: { root: { color: 'red' } } },
      })
      expect(wrapper.find('.ccui-alert').attributes('style') || '').toContain('red')
    })
  })
})
