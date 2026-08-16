import { mount } from '@vue/test-utils'
import { Comment, defineComponent, Fragment, h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { Table } from '../../table'
import { TableColumn } from '../../table-column'
import { TableSummary } from '../index'

const dataSource = [
  { key: '1', name: '苹果', qty: 10 },
  { key: '2', name: '香蕉', qty: 20 },
]

describe('table-summary', () => {
  it('渲染 tfoot 汇总行', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(TableColumn, { title: '数量', dataIndex: 'qty', columnKey: 'qty' }),
                h(TableSummary, null, {
                  default: () => h('tr', { class: 'my-summary-row' }, [h('td', null, '合计'), h('td', null, '30')]),
                }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(true)
    expect(wrapper.find('tfoot .my-summary-row').exists()).toBe(true)
    expect(wrapper.find('tfoot').text()).toContain('合计')
    expect(wrapper.find('tfoot').text()).toContain('30')
  })

  it('未使用 TableSummary 时 tfoot 不渲染', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' })],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(false)
  })

  it('tfoot 与 tbody / thead 并列存在', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(TableSummary, null, {
                  default: () => h('tr', null, [h('td', null, '汇总')]),
                }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    const table = wrapper.find('table')
    expect(table.find('thead').exists()).toBe(true)
    expect(table.find('tbody').exists()).toBe(true)
    expect(table.find('tfoot').exists()).toBe(true)
  })

  it('卸载组件时移除 tfoot', async () => {
    const Host = defineComponent({
      data: () => ({ showSummary: true }),
      render() {
        const slots = [h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' })]
        if (this.showSummary) {
          slots.push(
            h(TableSummary, null, {
              default: () => h('tr', null, [h('td', null, '汇总')]),
            }),
          )
        }
        return h(Table, { dataSource }, { default: () => slots })
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(true)
    ;(wrapper.vm as any).showSummary = false
    await nextTick()
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(false)
  })

  it('default slot 有无双向切换时同步添加和移除 tfoot', async () => {
    const showContent = ref(true)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(
                  TableSummary,
                  null,
                  showContent.value ? { default: () => h('tr', null, [h('td', null, '动态汇总')]) } : undefined,
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').text()).toContain('动态汇总')

    showContent.value = false
    await nextTick()
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(false)

    showContent.value = true
    await nextTick()
    await nextTick()
    expect(wrapper.find('tfoot').text()).toContain('动态汇总')
  })

  it('default slot 当前返回空内容时不渲染空 tfoot', async () => {
    const showRow = ref(false)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(TableSummary, null, {
                  default: () => (showRow.value ? [h('tr', null, [h('td', null, '动态行')])] : []),
                }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(false)

    showRow.value = true
    await nextTick()
    expect(wrapper.find('tfoot').text()).toContain('动态行')

    showRow.value = false
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(false)
  })

  it('按实际非空内容回退 Summary，并只透传当前实例的原生属性', async () => {
    const firstContent = ref<'array' | 'comment' | 'fragment' | 'row'>('array')
    const showSecond = ref(true)
    const renderFirst = () => {
      if (firstContent.value === 'comment') return h(Comment)
      if (firstContent.value === 'fragment') return h(Fragment, null, [])
      if (firstContent.value === 'row') return h('tr', null, [h('td', null, '第一汇总')])
      return []
    }
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(
                  TableSummary,
                  {
                    id: 'first-summary',
                    class: 'first-summary',
                    style: { color: 'red' },
                    'data-source': 'first',
                    'aria-label': '第一汇总区',
                  },
                  { default: renderFirst },
                ),
                h(
                  TableSummary,
                  {
                    id: 'second-summary',
                    class: 'second-summary',
                    style: { color: 'blue' },
                    'data-source': 'second',
                    'aria-label': '第二汇总区',
                  },
                  { default: () => (showSecond.value ? h('tr', null, [h('td', null, '第二汇总')]) : h(Comment)) },
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()

    const assertSecondActive = () => {
      const summary = wrapper.find('tfoot')
      expect(summary.text()).toContain('第二汇总')
      expect(summary.attributes('id')).toBe('second-summary')
      expect(summary.classes()).toContain('second-summary')
      expect(summary.attributes('style')).toContain('color: blue')
      expect(summary.attributes('data-source')).toBe('second')
      expect(summary.attributes('aria-label')).toBe('第二汇总区')
      expect(summary.classes()).not.toContain('first-summary')
    }
    assertSecondActive()

    firstContent.value = 'comment'
    await nextTick()
    assertSecondActive()

    firstContent.value = 'fragment'
    await nextTick()
    assertSecondActive()

    firstContent.value = 'row'
    await nextTick()
    const firstSummary = wrapper.find('tfoot')
    expect(firstSummary.text()).toContain('第一汇总')
    expect(firstSummary.attributes('id')).toBe('first-summary')
    expect(firstSummary.classes()).toContain('first-summary')
    expect(firstSummary.attributes('style')).toContain('color: red')
    expect(firstSummary.attributes('data-source')).toBe('first')
    expect(firstSummary.attributes('aria-label')).toBe('第一汇总区')
    expect(firstSummary.classes()).not.toContain('second-summary')
    expect(firstSummary.attributes('fixed')).toBeUndefined()
    expect(Object.keys(firstSummary.attributes()).some((name) => name.includes('ccuideclaration'))).toBe(false)

    firstContent.value = 'array'
    showSecond.value = false
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(false)
  })

  it('稳定 default slot 函数从 fnA 切换为 fnB 时更新汇总内容', async () => {
    const useSecond = ref(false)
    const fnA = () => h('tr', null, [h('td', null, '汇总 A')])
    const fnB = () => h('tr', null, [h('td', null, '汇总 B')])
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(TableSummary, null, { default: useSecond.value ? fnB : fnA }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').text()).toContain('汇总 A')

    useSecond.value = true
    await nextTick()
    await nextTick()

    expect(wrapper.find('tfoot').text()).toContain('汇总 B')
    expect(wrapper.find('tfoot').text()).not.toContain('汇总 A')
  })

  it('多个 Summary 中卸载非当前实例不会清除仍挂载的汇总', async () => {
    const showFirst = ref(true)
    const showSecond = ref(true)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                ...(showFirst.value
                  ? [h(TableSummary, { key: 'first' }, { default: () => h('tr', null, [h('td', null, '第一汇总')]) })]
                  : []),
                ...(showSecond.value
                  ? [h(TableSummary, { key: 'second' }, { default: () => h('tr', null, [h('td', null, '第二汇总')]) })]
                  : []),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').text()).toContain('第一汇总')

    showSecond.value = false
    await nextTick()
    await nextTick()
    expect(wrapper.find('tfoot').text()).toContain('第一汇总')

    showSecond.value = true
    await nextTick()
    await nextTick()
    expect(wrapper.find('tfoot').text()).toContain('第一汇总')

    showFirst.value = false
    await nextTick()
    await nextTick()

    expect(wrapper.find('tfoot').exists()).toBe(true)
    expect(wrapper.find('tfoot').text()).toContain('第二汇总')
  })

  it('keyed Summary 重排时按最新声明顺序选择当前实例', async () => {
    const order = ref<Array<'first' | 'second'>>(['first', 'second'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                ...order.value.map((name) =>
                  h(
                    TableSummary,
                    { key: name },
                    { default: () => h('tr', null, [h('td', null, name === 'first' ? '第一汇总' : '第二汇总')]) },
                  ),
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').text()).toContain('第一汇总')

    order.value = ['second', 'first']
    await nextTick()
    await nextTick()

    expect(wrapper.find('tfoot').text()).toContain('第二汇总')
  })

  it('多行 fixed 动态切换时由 tfoot 整组粘性定位，行之间不共享重叠偏移', async () => {
    const fixed = ref<false | true | 'top' | 'bottom'>(false)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource, scroll: { y: 120 } },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(
                  TableSummary,
                  { fixed: fixed.value },
                  {
                    default: () => [h('tr', null, [h('td', null, '汇总一')]), h('tr', null, [h('td', null, '汇总二')])],
                  },
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(
      wrapper
        .find('tfoot')
        .classes()
        .some((name) => name.includes('fixed')),
    ).toBe(false)
    expect(wrapper.find('tfoot').attributes('style')).toBeUndefined()
    expect(Array.from(wrapper.find('table').element.children).map((node) => node.tagName)).toEqual([
      'THEAD',
      'TBODY',
      'TFOOT',
    ])
    expect(wrapper.find('[class*="table__container"]').attributes('style')).toContain('max-height: 120px')

    fixed.value = true
    await nextTick()
    await nextTick()
    expect(
      wrapper
        .find('tfoot')
        .classes()
        .some((name) => name.includes('fixed-bottom')),
    ).toBe(true)
    expect(wrapper.find('tfoot').attributes('style')).toContain('position: sticky')
    expect(wrapper.find('tfoot').attributes('style')).toContain('bottom: 0px')
    expect(wrapper.find('tfoot').attributes('style')).not.toContain('table-header-group')
    expect(Array.from(wrapper.find('table').element.children).map((node) => node.tagName)).toEqual([
      'THEAD',
      'TBODY',
      'TFOOT',
    ])
    expect(wrapper.findAll('tfoot tr')).toHaveLength(2)
    wrapper.findAll('tfoot tr, tfoot td').forEach((node) => {
      expect(node.attributes('style') ?? '').not.toContain('position: sticky')
      expect(node.attributes('style') ?? '').not.toMatch(/(?:top|bottom):/)
    })

    fixed.value = 'top'
    await nextTick()
    await nextTick()
    expect(
      wrapper
        .find('tfoot')
        .classes()
        .some((name) => name.includes('fixed-top')),
    ).toBe(true)
    expect(wrapper.find('tfoot').attributes('style')).toContain('top: 0px')
    expect(wrapper.find('tfoot').attributes('style')).toContain('display: table-header-group')
    expect(wrapper.find('tfoot').attributes('style')).not.toContain('bottom: 0px')
    expect(Array.from(wrapper.find('table').element.children).map((node) => node.tagName)).toEqual([
      'THEAD',
      'TFOOT',
      'TBODY',
    ])

    fixed.value = false
    await nextTick()
    await nextTick()
    expect(
      wrapper
        .find('tfoot')
        .classes()
        .some((name) => name.includes('fixed')),
    ).toBe(false)
    expect(wrapper.find('tfoot').attributes('style')).toBeUndefined()
  })

  it('响应式汇总内容与原生 colspan/rowspan 保持更新和透传', async () => {
    const total = ref(30)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(TableColumn, { title: '数量', dataIndex: 'qty', columnKey: 'qty' }),
                h(TableSummary, null, {
                  default: () => h('tr', null, [h('td', { colspan: 2, rowspan: 1 }, `合计 ${total.value}`)]),
                }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot td').attributes('colspan')).toBe('2')
    expect(wrapper.find('tfoot td').attributes('rowspan')).toBe('1')

    total.value = 45
    await nextTick()
    expect(wrapper.find('tfoot').text()).toContain('合计 45')
  })

  it('脱离 Table 父级时不渲染 DOM 节点', () => {
    const wrapper = mount(TableSummary, {
      slots: { default: () => h('tr', null, 'x') },
    })
    expect(wrapper.element.tagName).toBeUndefined()
  })
})
