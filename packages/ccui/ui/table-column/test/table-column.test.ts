import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { Table } from '../../table'
import { TableColumn } from '../index'

const dataSource = [
  { key: '1', name: 'Tom', age: 28 },
  { key: '2', name: 'Alice', age: 32 },
  { key: '3', name: 'Bob', age: 24 },
]

function makeHost(slots: any) {
  return defineComponent({
    components: { Table, TableColumn },
    setup() {
      return () => h(Table, { dataSource }, slots)
    },
  })
}

describe('table-column', () => {
  it('模板式列声明：渲染列头 + 行数据', async () => {
    const Host = makeHost({
      default: () => [
        h(TableColumn, { title: '姓名', dataIndex: 'name', columnKey: 'name' }),
        h(TableColumn, { title: '年龄', dataIndex: 'age', columnKey: 'age' }),
      ],
    })
    const wrapper = mount(Host)
    await nextTick()
    const ths = wrapper.findAll('thead th')
    expect(ths).toHaveLength(2)
    expect(ths[0].text()).toContain('姓名')
    expect(ths[1].text()).toContain('年龄')
    const bodyRows = wrapper.findAll('tbody tr')
    expect(bodyRows).toHaveLength(3)
    expect(bodyRows[0].text()).toContain('Tom')
    expect(bodyRows[1].text()).toContain('Alice')
  })

  it('columns prop 非空时优先于模板式列（互斥规则）', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            {
              dataSource,
              columns: [{ title: '数组列', dataIndex: 'name', key: 'name' }],
            },
            {
              default: () => [h(TableColumn, { title: '模板列', dataIndex: 'age', columnKey: 'age' })],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    const ths = wrapper.findAll('thead th')
    expect(ths).toHaveLength(1)
    expect(ths[0].text()).toContain('数组列')
    expect(ths[0].text()).not.toContain('模板列')
  })

  it('customRender slot 优先于函数 prop', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource: [{ key: '1', name: 'Tom' }] },
            {
              default: () => [
                h(
                  TableColumn,
                  {
                    title: '姓名',
                    dataIndex: 'name',
                    customRender: (scope: any) => `fn-${scope.text}`,
                  },
                  {
                    customRender: (scope: any) => h('em', { class: 'my-cell' }, `slot-${scope.text}`),
                  },
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('.my-cell').exists()).toBe(true)
    expect(wrapper.find('.my-cell').text()).toBe('slot-Tom')
  })

  it('width / align / fixed props 透传到 Table', async () => {
    const Host = makeHost({
      default: () => [
        h(TableColumn, {
          title: '左',
          dataIndex: 'name',
          columnKey: 'name',
          width: 120,
          align: 'center',
          fixed: 'left',
        }),
        h(TableColumn, { title: '右', dataIndex: 'age', columnKey: 'age' }),
      ],
    })
    const wrapper = mount(Host)
    await nextTick()
    const ths = wrapper.findAll('thead th')
    // 第一个列带 align=center 的 modifier class，fixed=left 的 sticky 样式。
    expect(ths[0].classes().some((c) => c.includes('center'))).toBe(true)
    expect(ths[0].attributes('style') ?? '').toContain('sticky')
  })

  it('sorter prop 启用排序点击 + 切换排序态', async () => {
    const Host = makeHost({
      default: () => [
        h(TableColumn, { title: '姓名', dataIndex: 'name', columnKey: 'name' }),
        h(TableColumn, { title: '年龄', dataIndex: 'age', columnKey: 'age', sorter: true }),
      ],
    })
    const wrapper = mount(Host)
    await nextTick()
    // 点击第二个 th 触发排序 → ascend，age 最小的 Bob 应到第一行。
    const ageTh = wrapper.findAll('thead th')[1]
    await ageTh.trigger('click')
    await nextTick()
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('Bob')
  })

  it('动态增删列触发表头更新', async () => {
    const Host = defineComponent({
      data: () => ({ showAge: true }),
      setup() {
        return {}
      },
      render() {
        const cols = [h(TableColumn, { title: '姓名', dataIndex: 'name', columnKey: 'name' })]
        if (this.showAge) {
          cols.push(h(TableColumn, { title: '年龄', dataIndex: 'age', columnKey: 'age' }))
        }
        return h(Table, { dataSource }, { default: () => cols })
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.findAll('thead th')).toHaveLength(2)
    ;(wrapper.vm as any).showAge = false
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('thead th')).toHaveLength(1)
    expect(wrapper.find('thead th').text()).toContain('姓名')
  })

  it('脱离 Table 父级时不渲染 DOM 节点', () => {
    const wrapper = mount(TableColumn, { props: { title: '孤儿列' } })
    // render() 返回 null → 挂载点为占位注释或空字符串，均无实际 DOM 元素。
    expect(wrapper.element.tagName).toBeUndefined()
  })
})
