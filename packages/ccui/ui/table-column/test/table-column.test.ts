import { mount } from '@vue/test-utils'
import { defineComponent, Fragment, h, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
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

  it('动态 props 与 customRender slot 更新会传递到 Table', async () => {
    const field = ref<'name' | 'age'>('name')
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource: [dataSource[0]] },
            {
              default: () => [
                h(
                  TableColumn,
                  {
                    title: field.value === 'name' ? '姓名' : '年龄',
                    dataIndex: field.value,
                    columnKey: field.value,
                    width: field.value === 'name' ? 120 : 144,
                    align: field.value === 'name' ? 'left' : 'right',
                    customRender: ({ text }: any) => `prop-${text}`,
                  },
                  { customRender: ({ text }: any) => `slot-${text}` },
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('thead th').text()).toContain('姓名')
    expect(wrapper.find('tbody td').text()).toBe('slot-Tom')

    field.value = 'age'
    await nextTick()
    await nextTick()

    expect(wrapper.find('thead th').text()).toContain('年龄')
    expect(wrapper.find('thead th').attributes('style')).toContain('144px')
    expect(
      wrapper
        .find('thead th')
        .classes()
        .some((name) => name.includes('right')),
    ).toBe(true)
    expect(wrapper.find('tbody td').text()).toBe('slot-28')
  })

  it('customRender slot 有无双向切换时在 slot 与 prop 间回退且不递归更新', async () => {
    const showSlot = ref(true)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const Host = defineComponent({
      setup() {
        const propRender = ({ text }: any) => `prop-${text}`
        return () =>
          h(
            Table,
            { dataSource: [dataSource[0]] },
            {
              default: () => [
                h(
                  TableColumn,
                  {
                    title: '姓名',
                    dataIndex: 'name',
                    columnKey: 'name',
                    customRender: propRender,
                  },
                  showSlot.value ? { customRender: ({ text }: any) => `slot-${text}` } : undefined,
                ),
              ],
            },
          )
      },
    })

    try {
      const wrapper = mount(Host)
      await nextTick()
      expect(wrapper.find('tbody td').text()).toBe('slot-Tom')

      showSlot.value = false
      await nextTick()
      await nextTick()
      expect(wrapper.find('tbody td').text()).toBe('prop-Tom')

      showSlot.value = true
      await nextTick()
      await nextTick()
      expect(wrapper.find('tbody td').text()).toBe('slot-Tom')
      expect(warn.mock.calls.flat().some((args) => String(args).includes('Maximum recursive updates'))).toBe(false)
    } finally {
      warn.mockRestore()
    }
  })

  it('customRender slot 与 prop 都不存在时保留普通文本渲染', async () => {
    const Host = makeHost({
      default: () => [h(TableColumn, { title: '姓名', dataIndex: 'name', columnKey: 'name' })],
    })
    const wrapper = mount(Host)
    await nextTick()

    expect(wrapper.findAll('tbody tr')[0].find('td').text()).toBe('Tom')
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

  it('keyed 列仅重排时保持与最新声明顺序一致', async () => {
    const Host = defineComponent({
      setup() {
        const fields = ref<Array<'name' | 'age'>>(['name', 'age'])
        return { fields }
      },
      render() {
        return h(
          Table,
          { dataSource },
          {
            default: () => [
              h(Fragment, null, [
                h('span', { class: 'ignored-slot-node' }, '不会进入列定义'),
                ...this.fields.map((field) =>
                  h(TableColumn, {
                    key: field,
                    title: field === 'name' ? '姓名' : '年龄',
                    dataIndex: field,
                    columnKey: field,
                  }),
                ),
              ]),
            ],
          },
        )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.findAll('thead th').map((cell) => cell.text())).toEqual(['姓名', '年龄'])

    ;(wrapper.vm as any).fields = ['age', 'name']
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('thead th').map((cell) => cell.text())).toEqual(['年龄', '姓名'])
    expect(
      wrapper
        .findAll('tbody tr')[0]
        .findAll('td')
        .map((cell) => cell.text()),
    ).toEqual(['28', 'Tom'])
  })

  it('声明顺序未变化时保持稳定且不重复注册', async () => {
    const revision = ref(0)
    const Host = defineComponent({
      setup() {
        return () => {
          return h(
            Table,
            { dataSource, class: `revision-${revision.value}` },
            {
              default: () => [
                h(TableColumn, { key: 'name', title: '姓名', dataIndex: 'name', columnKey: 'name' }),
                h(TableColumn, { key: 'age', title: '年龄', dataIndex: 'age', columnKey: 'age' }),
              ],
            },
          )
        }
      },
    })
    const wrapper = mount(Host)
    await nextTick()

    revision.value += 1
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('thead th').map((cell) => cell.text())).toEqual(['姓名', '年龄'])
    expect(wrapper.findAll('tbody tr')[0].findAll('td')).toHaveLength(2)
  })

  it('keyed 列重排后卸载列会清理对应注册项', async () => {
    const fields = ref<Array<'name' | 'age'>>(['name', 'age'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () =>
                fields.value.map((field) =>
                  h(TableColumn, {
                    key: field,
                    title: field === 'name' ? '姓名' : '年龄',
                    dataIndex: field,
                    columnKey: field,
                  }),
                ),
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()

    fields.value = ['age', 'name']
    await nextTick()
    fields.value = ['name']
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('thead th').map((cell) => cell.text())).toEqual(['姓名'])
    expect(
      wrapper
        .findAll('tbody tr')[0]
        .findAll('td')
        .map((cell) => cell.text()),
    ).toEqual(['Tom'])
  })

  it('脱离 Table 父级时不渲染 DOM 节点', () => {
    const wrapper = mount(TableColumn, { props: { title: '孤儿列' } })
    // render() 返回 null → 挂载点为占位注释或空字符串，均无实际 DOM 元素。
    expect(wrapper.element.tagName).toBeUndefined()
  })
})
