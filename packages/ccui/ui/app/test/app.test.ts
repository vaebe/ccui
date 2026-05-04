import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { App, useApp } from '../index'

const ns = useNamespace('app', true)

const Consumer = defineComponent({
  setup() {
    const ctx = useApp()
    return () => h('div', { 'data-testid': 'consumer' }, typeof ctx.message.info === 'function' ? 'ok' : 'no')
  },
})

describe('app', () => {
  it('renders wrapper with namespace class', () => {
    const wrapper = mount(App, { slots: { default: '<span>x</span>' } })
    expect(wrapper.find(ns.b()).exists()).toBe(true)
  })

  it('appends custom className', () => {
    const wrapper = mount(App, { props: { className: 'my-app' }, slots: { default: 'x' } })
    expect(wrapper.classes()).toContain('my-app')
  })

  it('provides default app context to descendants', () => {
    const wrapper = mount({
      components: { App, Consumer },
      template: `<App><Consumer /></App>`,
    })
    expect(wrapper.find('[data-testid="consumer"]').text()).toBe('ok')
  })
})
