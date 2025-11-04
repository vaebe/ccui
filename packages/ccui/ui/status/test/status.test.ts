import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Status } from '../index'

const ns = useNamespace('status', true)
const baseClass = ns.b()
const typeSuccessClass = ns.m('success')
const typeErrorClass = ns.m('error')
const typeWarningClass = ns.m('warning')
const typeInfoClass = ns.m('info')

describe('status', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Status)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('props', async () => {
    const wrapper = shallowMount(Status, {
      props: {
        type: 'success',
      },
    })

    expect(wrapper.find(typeSuccessClass).exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('renders correct class based on type prop', async () => {
    const wrapper = mount(Status, {
      props: {
        type: 'error',
      },
    })

    expect(wrapper.find(typeErrorClass).exists()).toBeTruthy()
    expect(wrapper.find(typeSuccessClass).exists()).toBeFalsy()
  })

  it('renders default slot content', () => {
    const wrapper = mount(Status, {
      slots: {
        default: 'Status Content',
      },
    })

    expect(wrapper.text()).toContain('Status Content')
  })

  it('applies correct classes for all status types', async () => {
    const wrapper = mount(Status, {
      props: {
        type: 'warning',
      },
    })

    expect(wrapper.find(typeWarningClass).exists()).toBeTruthy()

    await wrapper.setProps({ type: 'info' })
    expect(wrapper.find(typeInfoClass).exists()).toBeTruthy()
  })

  it('renders span element with slot content', () => {
    const wrapper = mount(Status, {
      slots: {
        default: '<span class="inner-content">Inner Content</span>',
      },
    })

    expect(wrapper.find('span.inner-content').exists()).toBe(true)
  })
})
