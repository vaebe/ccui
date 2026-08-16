import { mount } from '@vue/test-utils'
import { Comment, defineComponent, Fragment, h, nextTick, ref } from 'vue'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Breadcrumb, BreadcrumbItem } from '../index'
import type { BreadcrumbItemProps, BreadcrumbProps, BreadcrumbRoute } from '../index'

const ns = useNamespace('breadcrumb', true)

describe('breadcrumb', () => {
  it('exports its public prop and route types', () => {
    expectTypeOf<BreadcrumbRoute>().toMatchTypeOf<{ href?: string; breadcrumbName?: string }>()
    expectTypeOf<BreadcrumbProps['routes']>().toEqualTypeOf<BreadcrumbRoute[]>()
    expectTypeOf<BreadcrumbItemProps['href']>().toEqualTypeOf<string>()
    expectTypeOf<BreadcrumbItemProps['separator']>().toEqualTypeOf<string | undefined>()
  })

  it('renders routes via prop', () => {
    const wrapper = mount(Breadcrumb, {
      attrs: { 'aria-label': 'Page trail' },
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
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Page trail')
    expect(wrapper.findAll('ol > li')).toHaveLength(3)
    expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1)
    expect(wrapper.findAll('[aria-current="page"]')[0].text()).toBe('Detail')
    expect(wrapper.findAll(ns.e('separator'))).toHaveLength(2)
    expect(
      wrapper.findAll(ns.e('separator')).every((separator) => separator.attributes('aria-hidden') === 'true'),
    ).toBe(true)
  })

  it('does not mark an intermediate route without href as the current page', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        routes: [{ breadcrumbName: 'Home', href: '/' }, { breadcrumbName: 'Section' }, { breadcrumbName: 'Detail' }],
      },
    })

    expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1)
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Detail')
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
    expect(wrapper.findAll('ol > li')).toHaveLength(2)
    expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1)
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Section')
    expect(wrapper.findAll(ns.e('separator'))).toHaveLength(1)
  })

  it('updates current-page and separator when keyed slot items reorder', async () => {
    const items = ref(['Home', 'Section', 'Detail'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(Breadcrumb, null, {
            default: () => [
              h(
                Fragment,
                null,
                items.value.map((label) =>
                  h(BreadcrumbItem, { key: label, href: label === 'Home' ? '/' : '' }, { default: () => label }),
                ),
              ),
            ],
          })
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Detail')

    items.value = ['Detail', 'Home']
    await nextTick()

    expect(wrapper.findAll('ol > li')).toHaveLength(2)
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Home')
    expect(wrapper.findAll(ns.e('separator'))).toHaveLength(1)
    expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1)
  })

  it('normalizes mixed Fragment items without overriding RouterLink current semantics', async () => {
    const order = ref(['home', 'plain', 'router'])
    const RouterLink = defineComponent({
      name: 'RouterLink',
      setup() {
        return () => h('a', { href: '/docs', 'aria-current': 'location' }, 'Docs')
      },
    })
    const Host = defineComponent({
      setup() {
        const nodes = {
          home: () => h(BreadcrumbItem, { key: 'home' }, { default: () => 'Home' }),
          plain: () => h('span', { key: 'plain' }, 'Plain'),
          router: () => h(RouterLink, { key: 'router' }),
        }
        return () =>
          h(Breadcrumb, null, {
            default: () => [
              h(Comment),
              h(Fragment, null, []),
              h(Fragment, null, [order.value.map((key) => nodes[key as keyof typeof nodes]())]),
            ],
          })
      },
    })
    const wrapper = mount(Host)

    expect(wrapper.findAll('ol > li')).toHaveLength(3)
    expect(wrapper.findAll('ol > li > li')).toHaveLength(0)
    expect(wrapper.findAll('ol > li').map((item) => item.text())).toEqual(['Home/', 'Plain/', 'Docs'])
    expect(wrapper.findAll('[aria-current]')).toHaveLength(1)
    expect(wrapper.find('a').attributes('aria-current')).toBe('location')
    expect(wrapper.find('a').element.parentElement?.hasAttribute('aria-current')).toBe(false)

    order.value = ['router', 'plain', 'home']
    await nextTick()

    expect(wrapper.findAll('ol > li').map((item) => item.text())).toEqual(['Docs/', 'Plain/', 'Home'])
    expect(wrapper.findAll(ns.e('separator'))).toHaveLength(2)
    expect(wrapper.findAll('ol > li')[2].find(ns.e('separator')).exists()).toBe(false)
    expect(wrapper.findAll('[aria-current]')).toHaveLength(1)
    expect(wrapper.find('a').attributes('aria-current')).toBe('location')
  })

  it('keeps parent and item separator content reactive and hides the final separator', async () => {
    const separator = ref('/')
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Breadcrumb,
            { separator: separator.value },
            {
              default: () => [
                h(BreadcrumbItem, null, { default: () => 'Home' }),
                h(
                  BreadcrumbItem,
                  { separator: '→' },
                  { default: () => 'Section', separator: () => h('strong', null, 'slot') },
                ),
                h(BreadcrumbItem, { separator: '' }, { default: () => 'Hidden separator' }),
                h(BreadcrumbItem, null, { default: () => 'Detail' }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.findAll(ns.e('separator'))[0].text()).toBe('/')
    expect(wrapper.findAll(ns.e('separator'))[1].text()).toBe('slot')
    expect(wrapper.findAll(ns.e('separator'))[2].text()).toBe('')

    separator.value = '·'
    await nextTick()

    expect(wrapper.findAll(ns.e('separator'))).toHaveLength(3)
    expect(wrapper.findAll(ns.e('separator'))[0].text()).toBe('·')
  })

  it('keeps native anchor keyboard semantics and emits one bubbled click', async () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault())
    const wrapper = mount(BreadcrumbItem, {
      props: { href: '/docs' },
      attrs: { onClick },
      slots: { default: () => 'Docs' },
    })
    const link = wrapper.find('a')

    expect(link.attributes('href')).toBe('/docs')
    expect(link.attributes('tabindex')).toBeUndefined()
    await link.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
