import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Breadcrumb, BreadcrumbItem } from '../index'

const ns = useNamespace('breadcrumb', true)

describe('breadcrumb', () => {
  it('renders routes via prop', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        routes: [
          { breadcrumbName: 'Home', href: '/' },
          { breadcrumbName: 'List', path: '/list' },
          { breadcrumbName: 'Detail' },
        ],
      },
    })
    expect(wrapper.findAll(ns.e('item')).length).toBe(3)
    expect(wrapper.findAll('a').length).toBe(2)
  })

  it('renders custom items via slot', () => {
    const wrapper = mount({
      components: { Breadcrumb, BreadcrumbItem },
      template: `
        <Breadcrumb separator=">">
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Section</BreadcrumbItem>
        </Breadcrumb>
      `,
    })
    expect(wrapper.findAll(ns.e('item')).length).toBe(2)
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Section')
  })
})
