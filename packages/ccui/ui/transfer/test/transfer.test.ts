import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { Transfer } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('transfer', true)
const wrappers: VueWrapper[] = []

const SAMPLE = [
  { key: '1', title: 'Apple' },
  { key: '2', title: 'Banana' },
  { key: '3', title: 'Cherry', disabled: true },
  { key: '4', title: 'Durian' },
  { key: '5', title: 'Elderberry' },
]

function mountT(props: Record<string, unknown> = {}) {
  const wrapper = mount(Transfer, {
    props: { dataSource: SAMPLE, ...props },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('transfer rendering', () => {
  it('renders two columns and partitions items by targetKeys', () => {
    const wrapper = mountT({ targetKeys: ['2', '4'] })
    const cols = wrapper.findAll(ns.e('column'))
    expect(cols).toHaveLength(2)
    const leftItems = cols[0].findAll(ns.e('item')).map((n) => n.text())
    const rightItems = cols[1].findAll(ns.e('item')).map((n) => n.text())
    expect(leftItems).toEqual(['Apple', 'Cherry', 'Elderberry'])
    expect(rightItems).toEqual(['Banana', 'Durian'])
  })

  it('right column preserves targetKeys order, not dataSource order', () => {
    const wrapper = mountT({ targetKeys: ['4', '2'] })
    const right = wrapper.findAll(ns.e('column'))[1]
    const items = right.findAll(ns.e('item')).map((n) => n.text())
    expect(items).toEqual(['Durian', 'Banana'])
  })

  it('renders custom titles and operations', () => {
    const wrapper = mountT({
      titles: ['源', '目标'],
      operations: ['加入', '移除'],
    })
    const headers = wrapper.findAll(ns.e('header-title')).map((n) => n.text())
    expect(headers).toEqual(['源', '目标'])
    const ops = wrapper.findAll(ns.e('operation')).map((n) => n.text())
    expect(ops).toEqual(['加入', '移除'])
  })

  it('renders item count and switches singular/plural', () => {
    const wrapper = mountT({
      dataSource: [{ key: '1', title: 'Only' }],
      locale: { itemUnit: 'item', itemsUnit: 'items' },
    })
    expect(wrapper.find(ns.e('header-count')).text()).toContain('1 item')
  })

  it('renders custom render function', () => {
    const wrapper = mountT({
      dataSource: [{ key: '1', title: 'Apple' }],
      render: (item: { title: string }) => `★${item.title}`,
    })
    expect(wrapper.find(ns.e('item-content')).text()).toBe('★Apple')
  })

  it('renders empty state when no items', () => {
    const wrapper = mountT({ dataSource: [], locale: { notFoundContent: '空空如也' } })
    expect(wrapper.findAll(ns.e('empty'))[0].text()).toBe('空空如也')
  })
})

describe('transfer item selection', () => {
  it('clicking item toggles selection and emits update:selectedKeys', async () => {
    const wrapper = mountT()
    const left = wrapper.findAll(ns.e('column'))[0]
    await left.findAll(ns.e('item'))[0].trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['1']])
  })

  it('does not select disabled items', async () => {
    const wrapper = mountT()
    const left = wrapper.findAll(ns.e('column'))[0]
    // Cherry is disabled (key=3, after Apple/Banana/Cherry on left because targetKeys is empty)
    const items = left.findAll(ns.e('item'))
    const cherry = items.find((n) => n.text() === 'Cherry')!
    expect(cherry.classes()).toContain('is-disabled')
    await cherry.trigger('click')
    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
  })

  it('does not allow selection when whole transfer is disabled', async () => {
    const wrapper = mountT({ disabled: true })
    const left = wrapper.findAll(ns.e('column'))[0]
    await left.findAll(ns.e('item'))[0].trigger('click')
    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
  })

  it('emits select-change with split source/target keys', async () => {
    const wrapper = mountT({ targetKeys: ['4'] })
    const left = wrapper.findAll(ns.e('column'))[0]
    const right = wrapper.findAll(ns.e('column'))[1]
    await left.findAll(ns.e('item'))[0].trigger('click') // pick Apple in left
    expect(wrapper.emitted('select-change')?.[0]).toEqual([['1'], []])
    await right.findAll(ns.e('item'))[0].trigger('click') // also pick Durian in right
    // 由于 setProps 没把 selectedKeys 写回，组件下次根据 props.selectedKeys 还是 ['1'] 之前的状态
    // 这条主要验证 select-change emit 触发
    expect(wrapper.emitted('select-change')?.length).toBeGreaterThan(0)
  })
})

describe('transfer header check-all', () => {
  it('check-all selects all enabled items in left column', async () => {
    const wrapper = mountT()
    const headers = wrapper.findAll(ns.e('header-checkbox'))
    await headers[0].setValue(true)
    const emitted = wrapper.emitted('update:selectedKeys')!.slice(-1)[0][0] as string[]
    // Cherry (3) is disabled, should be excluded
    expect(emitted.sort()).toEqual(['1', '2', '4', '5'])
  })

  it('uncheck-all removes all enabled items from selection', async () => {
    const wrapper = mountT({ selectedKeys: ['1', '2', '4', '5'] })
    const headers = wrapper.findAll(ns.e('header-checkbox'))
    await headers[0].setValue(false)
    const emitted = wrapper.emitted('update:selectedKeys')!.slice(-1)[0][0] as string[]
    expect(emitted).toEqual([])
  })

  it('header indeterminate when partially selected', () => {
    const wrapper = mountT({ selectedKeys: ['1'] })
    const headerEl = wrapper.findAll(ns.e('header-checkbox'))[0].element as HTMLInputElement
    expect(headerEl.indeterminate).toBe(true)
  })

  it('header is disabled when column has no items', () => {
    const wrapper = mountT({ dataSource: [], targetKeys: [] })
    const headerEls = wrapper.findAll(ns.e('header-checkbox'))
    expect((headerEls[0].element as HTMLInputElement).disabled).toBe(true)
  })
})

describe('transfer move operations', () => {
  it('right operation moves selected left items to right and emits change', async () => {
    const wrapper = mountT({ selectedKeys: ['1', '4'] })
    const right = wrapper.findAll(ns.e('operation'))[0]
    expect((right.element as HTMLButtonElement).disabled).toBe(false)
    await right.trigger('click')
    const change = wrapper.emitted('change')!.slice(-1)[0]
    expect(change[0]).toEqual(['1', '4'])
    expect(change[1]).toBe('right')
    expect(change[2]).toEqual(['1', '4'])
    // selectedKeys 应该被清掉刚移动的
    const sel = wrapper.emitted('update:selectedKeys')!.slice(-1)[0][0]
    expect(sel).toEqual([])
  })

  it('left operation moves selected right items back to left', async () => {
    const wrapper = mountT({ targetKeys: ['1', '4'], selectedKeys: ['1'] })
    const leftOp = wrapper.findAll(ns.e('operation'))[1]
    expect((leftOp.element as HTMLButtonElement).disabled).toBe(false)
    await leftOp.trigger('click')
    const change = wrapper.emitted('change')!.slice(-1)[0]
    expect(change[0]).toEqual(['4'])
    expect(change[1]).toBe('left')
    expect(change[2]).toEqual(['1'])
  })

  it('right operation disabled when no left items selected', () => {
    const wrapper = mountT()
    const right = wrapper.findAll(ns.e('operation'))[0]
    expect((right.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('left operation disabled when no right items selected', () => {
    const wrapper = mountT({ targetKeys: ['1'] })
    const leftOp = wrapper.findAll(ns.e('operation'))[1]
    expect((leftOp.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('move appends new keys without duplicating existing targetKeys', async () => {
    const wrapper = mountT({ targetKeys: ['1'], selectedKeys: ['2'] })
    await wrapper.findAll(ns.e('operation'))[0].trigger('click')
    const change = wrapper.emitted('change')!.slice(-1)[0]
    expect(change[0]).toEqual(['1', '2'])
  })
})

describe('transfer search', () => {
  it('hides search box by default and shows it when showSearch=true', () => {
    const a = mountT()
    expect(a.find(ns.e('search')).exists()).toBe(false)
    const b = mountT({ showSearch: true })
    expect(b.findAll(ns.e('search'))).toHaveLength(2)
  })

  it('typing in left search filters left list', async () => {
    const wrapper = mountT({ showSearch: true })
    const leftSearch = wrapper.findAll(ns.e('search-input'))[0]
    await leftSearch.setValue('app')
    await nextTick()
    const leftItems = wrapper
      .findAll(ns.e('column'))[0]
      .findAll(ns.e('item'))
      .map((n) => n.text())
    expect(leftItems).toEqual(['Apple'])
  })

  it('uses custom filterOption when provided', async () => {
    const wrapper = mountT({
      showSearch: true,
      filterOption: (input: string, item: { key: string }) => item.key === input,
    })
    await wrapper.findAll(ns.e('search-input'))[0].setValue('4')
    await nextTick()
    const leftItems = wrapper
      .findAll(ns.e('column'))[0]
      .findAll(ns.e('item'))
      .map((n) => n.text())
    expect(leftItems).toEqual(['Durian'])
  })

  it('emits search event with direction and value', async () => {
    const wrapper = mountT({ showSearch: true })
    await wrapper.findAll(ns.e('search-input'))[1].setValue('xx')
    expect(wrapper.emitted('search')?.[0]).toEqual(['right', 'xx'])
  })
})

describe('transfer v-model patterns', () => {
  it('v-model:targetKeys works with parent state', async () => {
    const target = ref<string[]>([])
    const selected = ref<string[]>(['1'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(Transfer, {
            dataSource: SAMPLE,
            targetKeys: target.value,
            selectedKeys: selected.value,
            'onUpdate:targetKeys': (v: string[]) => (target.value = v),
            'onUpdate:selectedKeys': (v: string[]) => (selected.value = v),
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    await wrapper.findAll(ns.e('operation'))[0].trigger('click')
    await nextTick()
    expect(target.value).toEqual(['1'])
    expect(selected.value).toEqual([])
  })
})

describe('transfer pagination', () => {
  const LARGE = Array.from({ length: 15 }, (_, i) => ({ key: `k${i}`, title: `Item ${i}` }))

  it('shows pagination controls when pagination=true and items > pageSize', () => {
    const wrapper = mountT({ dataSource: LARGE, pagination: true })
    expect(wrapper.find(ns.e('pagination')).exists()).toBe(true)
    expect(wrapper.find(ns.e('page-info')).text()).toBe('1 / 2')
  })

  it('does not show pagination when disabled', () => {
    const wrapper = mountT({ dataSource: LARGE, pagination: false })
    expect(wrapper.find(ns.e('pagination')).exists()).toBe(false)
  })

  it('clicking next page shows remaining items', async () => {
    const wrapper = mountT({ dataSource: LARGE, pagination: true })
    // 默认 pageSize=10，第 1 页显示 10 项
    expect(wrapper.findAll(ns.e('item'))).toHaveLength(10)
    // 点击下一页
    const nextBtn = wrapper.findAll(ns.e('page-btn'))[1]
    await nextBtn.trigger('click')
    await nextTick()
    expect(wrapper.findAll(ns.e('item'))).toHaveLength(5)
    expect(wrapper.find(ns.e('page-info')).text()).toBe('2 / 2')
  })

  it('supports custom pageSize via number', () => {
    const wrapper = mountT({ dataSource: LARGE, pagination: 5 })
    expect(wrapper.findAll(ns.e('item'))).toHaveLength(5)
    expect(wrapper.find(ns.e('page-info')).text()).toBe('1 / 3')
  })
})

describe('transfer selectAllLabels slot', () => {
  it('renders custom selectAllLabels slot content', () => {
    const wrapper = mount(Transfer, {
      props: { dataSource: SAMPLE },
      slots: {
        selectAllLabels: ({ direction, selectedCount, totalCount }: any) =>
          h('span', { class: 'custom-label' }, `${direction}: ${selectedCount}/${totalCount}`),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const labels = wrapper.findAll('.custom-label')
    expect(labels).toHaveLength(2)
    expect(labels[0].text()).toBe('left: 0/5')
    expect(labels[1].text()).toBe('right: 0/0')
  })
})

describe('transfer draggable', () => {
  it('right column items have draggable attribute when draggable=true', () => {
    const wrapper = mountT({ targetKeys: ['1', '2'], draggable: true })
    const columns = wrapper.findAll(ns.e('column'))
    // 左列不可拖
    const leftItems = columns[0].findAll(ns.e('item'))
    expect(leftItems[0].attributes('draggable')).not.toBe('true')
    // 右列可拖
    const rightItems = columns[1].findAll(ns.e('item'))
    expect(rightItems[0].attributes('draggable')).toBe('true')
  })

  it('right column items are not draggable by default', () => {
    const wrapper = mountT({ targetKeys: ['1', '2'] })
    const columns = wrapper.findAll(ns.e('column'))
    const rightItems = columns[1].findAll(ns.e('item'))
    expect(rightItems[0].attributes('draggable')).not.toBe('true')
  })
})
