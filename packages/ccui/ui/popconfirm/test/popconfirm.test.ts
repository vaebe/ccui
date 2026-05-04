import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Popconfirm } from '../index'

const ns = useNamespace('popconfirm', true)

function makeWrapper(props: Record<string, unknown> = {}) {
  return mount(Popconfirm, {
    props: {
      title: 'Are you sure?',
      visible: true,
      ...props,
    },
    slots: {
      default: '<button>Trigger</button>',
    },
    attachTo: document.body,
  })
}

describe('popconfirm', () => {
  it('renders title and default action buttons', async () => {
    const wrapper = makeWrapper()
    await nextTick()
    expect(document.body.innerHTML).toContain('Are you sure?')
    const buttons = document.body.querySelectorAll(`${ns.e('btn')}`)
    expect(buttons.length).toBe(2)
    wrapper.unmount()
  })

  it('emits confirm on confirm click', async () => {
    const wrapper = makeWrapper()
    await nextTick()
    const confirmBtn = document.body.querySelector(`${ns.em('btn', 'primary')}`) as HTMLElement
    confirmBtn?.click()
    expect(wrapper.emitted('confirm')).toBeTruthy()
    wrapper.unmount()
  })

  it('emits cancel on cancel click', async () => {
    const wrapper = makeWrapper()
    await nextTick()
    const cancelBtn = document.body.querySelector(`${ns.em('btn', 'cancel')}`) as HTMLElement
    cancelBtn?.click()
    expect(wrapper.emitted('cancel')).toBeTruthy()
    wrapper.unmount()
  })

  it('renders description text', async () => {
    const wrapper = makeWrapper({ description: 'Extra info here' })
    await nextTick()
    expect(document.body.innerHTML).toContain('Extra info here')
    wrapper.unmount()
  })

  it('renders custom confirmText / cancelText', async () => {
    const wrapper = makeWrapper({ confirmText: 'GO', cancelText: 'NO' })
    await nextTick()
    expect(document.body.innerHTML).toContain('GO')
    expect(document.body.innerHTML).toContain('NO')
    wrapper.unmount()
  })

  it('applies confirmType modifier to primary button', async () => {
    const wrapper = makeWrapper({ confirmType: 'danger' })
    await nextTick()
    expect(document.body.querySelector(`${ns.em('btn', 'danger')}`)).not.toBeNull()
    wrapper.unmount()
  })

  it('hides icon when hideIcon=true', async () => {
    const wrapper = makeWrapper({ hideIcon: true })
    await nextTick()
    expect(document.body.querySelector(`${ns.e('icon')}`)).toBeNull()
    wrapper.unmount()
  })

  it('renders title via slot over prop', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'fallback', visible: true },
      slots: {
        default: '<button>Trigger</button>',
        title: '<strong class="slot-title">Custom Title</strong>',
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.slot-title')?.textContent).toBe('Custom Title')
    expect(document.body.innerHTML).not.toContain('fallback')
    wrapper.unmount()
  })
})
