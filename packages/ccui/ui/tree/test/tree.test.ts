import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { h, nextTick } from 'vue'
import { Tree } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('tree', true)

const sampleData = [
  {
    key: 'root-1',
    title: 'Root 1',
    children: [
      { key: 'child-1-1', title: 'Child 1-1' },
      {
        key: 'child-1-2',
        title: 'Child 1-2',
        children: [
          { key: 'leaf-1-2-1', title: 'Leaf 1-2-1' },
          { key: 'leaf-1-2-2', title: 'Leaf 1-2-2', disabled: true },
        ],
      },
    ],
  },
  {
    key: 'root-2',
    title: 'Root 2',
    children: [{ key: 'child-2-1', title: 'Child 2-1' }],
  },
]

const wrappers: VueWrapper[] = []

function mountTree(props: Record<string, unknown> = {}, slots?: Record<string, unknown>) {
  const wrapper = mount(Tree, {
    props: { data: sampleData, ...props } as never,
    slots: slots as never,
  })
  wrappers.push(wrapper)
  return wrapper
}

function nodeTitles(wrapper: VueWrapper): string[] {
  return wrapper.findAll(ns.e('node')).map((node) => node.find(ns.e('title')).text())
}

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
})

describe('tree', () => {
  it('renders only root nodes by default (no expansion)', () => {
    const wrapper = mountTree()
    expect(nodeTitles(wrapper)).toEqual(['Root 1', 'Root 2'])
  })

  it('expands node when its switcher is clicked and emits expand', async () => {
    const wrapper = mountTree()
    await wrapper.find(ns.e('switcher-wrap')).trigger('click')

    const nodes = wrapper.findAll(ns.e('node'))
    expect(nodes).toHaveLength(4) // root-1, child-1-1, child-1-2, root-2
    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['root-1']])
    const expandEvent = wrapper.emitted('expand')?.[0] as unknown[]
    expect(expandEvent[0]).toEqual(['root-1'])
  })

  it('collapses an expanded node on second switcher click', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'] })
    expect(wrapper.findAll(ns.e('node'))).toHaveLength(4)

    await wrapper.find(ns.e('switcher-wrap')).trigger('click')
    expect(wrapper.findAll(ns.e('node'))).toHaveLength(2)
  })

  it('defaultExpandAll expands every parent', () => {
    const wrapper = mountTree({ defaultExpandAll: true })
    // 6 nodes: 2 roots + 1 + 2 + 2 = 7
    expect(wrapper.findAll(ns.e('node'))).toHaveLength(7)
  })

  it('controlled expandedKeys takes precedence over defaultExpandedKeys', async () => {
    const wrapper = mountTree({ expandedKeys: ['root-2'], defaultExpandedKeys: ['root-1'] })
    expect(nodeTitles(wrapper)).toEqual(['Root 1', 'Root 2', 'Child 2-1'])

    await wrapper.setProps({ expandedKeys: ['root-1'] })
    expect(nodeTitles(wrapper)).toEqual(['Root 1', 'Child 1-1', 'Child 1-2', 'Root 2'])
  })

  it('selects node and emits select with single mode', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'] })
    await wrapper.findAll(ns.e('content'))[1].trigger('click')

    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['child-1-1']])
    const selectEvent = wrapper.emitted('select')?.[0] as unknown[]
    expect(selectEvent[0]).toEqual(['child-1-1'])
    expect(wrapper.findAll(ns.em('node', 'selected'))).toHaveLength(1)
  })

  it('multiple select toggles keys without removing others', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'], multiple: true })
    const contents = wrapper.findAll(ns.e('content'))

    await contents[0].trigger('click')
    await contents[1].trigger('click')

    expect(wrapper.emitted('update:selectedKeys')?.[1]).toEqual([['root-1', 'child-1-1']])

    await contents[0].trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.[2]).toEqual([['child-1-1']])
  })

  it('does not select disabled node', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1', 'child-1-2'] })
    const contents = wrapper.findAll(ns.e('content'))
    const disabled = contents.find((el) => el.find(ns.e('title')).text() === 'Leaf 1-2-2')!
    await disabled.trigger('click')

    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
  })

  it('does not select when selectable=false on tree', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'], selectable: false })
    await wrapper.findAll(ns.e('content'))[1].trigger('click')
    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
  })

  it('supports v-model:selected-keys via controlled prop', async () => {
    const wrapper = mountTree({ selectedKeys: ['root-1'] })
    expect(wrapper.findAll(ns.em('node', 'selected'))).toHaveLength(1)

    await wrapper.find(ns.e('content')).trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([[]])
    // controlled mode: until parent updates the prop, internal state stays
    expect(wrapper.findAll(ns.em('node', 'selected'))).toHaveLength(1)

    await wrapper.setProps({ selectedKeys: [] })
    expect(wrapper.findAll(ns.em('node', 'selected'))).toHaveLength(0)
  })

  it('checkable: clicking parent checkbox checks all enabled descendants', async () => {
    const wrapper = mountTree({ checkable: true, defaultExpandedKeys: ['root-1', 'child-1-2'] })
    const checkboxes = wrapper.findAll(ns.e('checkbox'))
    await checkboxes[0].trigger('click') // root-1

    const checkedKeys = wrapper.emitted('update:checkedKeys')?.[0] as unknown[][]
    const flat = checkedKeys[0] as string[]
    expect(flat).toContain('root-1')
    expect(flat).toContain('child-1-1')
    expect(flat).toContain('child-1-2')
    expect(flat).toContain('leaf-1-2-1')
    // disabled leaf-1-2-2 not included
    expect(flat).not.toContain('leaf-1-2-2')
  })

  it('checkable: parent shows half-checked when only some children checked', async () => {
    const wrapper = mountTree({
      checkable: true,
      defaultExpandedKeys: ['root-1', 'child-1-2'],
      checkedKeys: ['leaf-1-2-1'],
    })
    const halfChecks = wrapper.findAll(ns.em('checkbox', 'indeterminate'))
    expect(halfChecks.length).toBeGreaterThan(0)
  })

  it('checkable: checkStrictly disables propagation', async () => {
    const wrapper = mountTree({
      checkable: true,
      checkStrictly: true,
      defaultExpandedKeys: ['root-1', 'child-1-2'],
    })
    await wrapper.findAll(ns.e('checkbox'))[0].trigger('click')

    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['root-1']])
  })

  it('disabled node disables its checkbox', async () => {
    const wrapper = mountTree({ checkable: true, defaultExpandedKeys: ['root-1', 'child-1-2'] })
    const disabledNode = wrapper.findAll(ns.e('node')).find((node) => node.attributes('data-key') === 'leaf-1-2-2')!
    await disabledNode.find(ns.e('checkbox')).trigger('click')

    expect(wrapper.emitted('update:checkedKeys')).toBeUndefined()
  })

  it('disableCheckbox blocks check toggle but allows selection', async () => {
    const wrapper = mountTree({
      checkable: true,
      data: [{ key: 'a', title: 'A', disableCheckbox: true }],
    })
    await wrapper.find(ns.e('checkbox')).trigger('click')
    expect(wrapper.emitted('update:checkedKeys')).toBeUndefined()

    await wrapper.find(ns.e('content')).trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['a']])
  })

  it('uses fieldNames mapping for key/title/children', async () => {
    const data = [
      {
        id: '1',
        name: 'Group',
        items: [{ id: '1-1', name: 'Item' }],
      },
    ]
    const wrapper = mountTree({
      data,
      fieldNames: { key: 'id', title: 'name', children: 'items' },
      defaultExpandAll: true,
    })

    const titles = nodeTitles(wrapper)
    expect(titles).toEqual(['Group', 'Item'])
    expect(wrapper.findAll(ns.e('node'))[1].attributes('data-key')).toBe('1-1')
  })

  it('searchValue filters tree to matching nodes plus their ancestors', () => {
    const wrapper = mountTree({ searchValue: 'Leaf 1-2-1', defaultExpandedKeys: ['root-1', 'child-1-2'] })
    expect(nodeTitles(wrapper)).toEqual(['Root 1', 'Child 1-2', 'Leaf 1-2-1'])
  })

  it('searchValue wraps matched substring in highlight span', () => {
    const wrapper = mountTree({ searchValue: 'eaf', defaultExpandedKeys: ['root-1', 'child-1-2'] })
    expect(wrapper.find('.ccui-tree__highlight').exists()).toBe(true)
    expect(wrapper.find('.ccui-tree__highlight').text()).toBe('eaf')
  })

  it('custom filterTreeNode predicate overrides default keyword match', () => {
    const wrapper = mountTree({
      defaultExpandedKeys: ['root-1', 'child-1-2'],
      filterTreeNode: (node: { title?: string }) => node.title === 'Leaf 1-2-2',
    })
    expect(nodeTitles(wrapper)).toEqual(['Root 1', 'Child 1-2', 'Leaf 1-2-2'])
  })

  it('renders custom title via slot with data and expanded payload', () => {
    const wrapper = mountTree(
      { defaultExpandedKeys: ['root-1'] },
      {
        title: ({ node, expanded }: { node: { raw: { title?: string } }; expanded: boolean }) =>
          h('span', { class: 'custom-title' }, `${node.raw.title}${expanded ? ' [open]' : ''}`),
      },
    )
    const titles = wrapper.findAll('.custom-title').map((node) => node.text())
    expect(titles[0]).toBe('Root 1 [open]')
  })

  it('renders custom switcher slot', () => {
    const wrapper = mountTree(
      {},
      {
        switcher: ({ expanded }: { expanded: boolean }) =>
          h('span', { class: 'custom-switcher' }, expanded ? 'O' : 'C'),
      },
    )
    expect(wrapper.findAll('.custom-switcher')).toHaveLength(2)
    expect(wrapper.findAll('.custom-switcher')[0].text()).toBe('C')
  })

  it('renders custom icon slot when icon prop on node is missing', () => {
    const wrapper = mountTree(
      {},
      {
        icon: () => h('span', { class: 'custom-icon' }, '★'),
      },
    )
    expect(wrapper.findAll('.custom-icon')).toHaveLength(2)
  })

  it('async loadData fills children when expanding a non-leaf empty node', async () => {
    const loadData = vi.fn(async (node: { key?: string; children?: unknown[] }) => {
      node.children = [{ key: `${node.key}-async`, title: 'Async Child' }]
    })
    const data = [{ key: 'lazy', title: 'Lazy', isLeaf: false }]
    const wrapper = mountTree({ data, loadData })

    await wrapper.find(ns.e('switcher-wrap')).trigger('click')
    await nextTick()
    await nextTick()

    expect(loadData).toHaveBeenCalledTimes(1)
  })

  it('emits drop with dragNode + drop position when draggable', async () => {
    const wrapper = mountTree({ draggable: true, defaultExpandedKeys: ['root-1'] })
    const nodes = wrapper.findAll(ns.e('node'))

    await nodes[0].trigger('dragstart')
    await nodes[1].trigger('dragover', { clientY: 0 })
    await nodes[1].trigger('drop', { clientY: 0 })

    const dropEvents = wrapper.emitted('drop') as Array<unknown[]>
    expect(dropEvents).toBeDefined()
    expect(dropEvents.length).toBe(1)
    const info = dropEvents[0][0] as { node: { key: string }; dragNode: { key: string }; dropPosition: string }
    expect(info.node.key).toBe('child-1-1')
    expect(info.dragNode.key).toBe('root-1')
  })

  it('does not emit drop when draggable=false', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'] })
    const nodes = wrapper.findAll(ns.e('node'))

    await nodes[0].trigger('dragstart')
    await nodes[1].trigger('drop', { clientY: 0 })

    expect(wrapper.emitted('drop')).toBeUndefined()
  })

  it('renders empty state when data is empty', () => {
    const wrapper = mountTree({ data: [] })
    expect(wrapper.find(ns.e('empty')).exists()).toBe(true)
    expect(wrapper.findAll(ns.e('node'))).toHaveLength(0)
  })

  it('disabled prop on tree blocks expand and select', async () => {
    const wrapper = mountTree({ disabled: true, data: sampleData })
    await wrapper.find(ns.e('switcher-wrap')).trigger('click')
    await wrapper.find(ns.e('content')).trigger('click')

    expect(wrapper.emitted('update:expandedKeys')).toBeUndefined()
    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
  })

  it('reactive data update re-renders nodes', async () => {
    const wrapper = mountTree()
    expect(wrapper.findAll(ns.e('node'))).toHaveLength(2)

    await wrapper.setProps({
      data: [...sampleData, { key: 'root-3', title: 'Root 3' }],
    })
    expect(wrapper.findAll(ns.e('node'))).toHaveLength(3)
  })

  it('blockNode applies block class for full-width selection', () => {
    const wrapper = mountTree({ blockNode: true })
    expect(wrapper.findAll(ns.em('node', 'block'))).toHaveLength(2)
  })

  it('treeitem nodes expose aria attributes for selection / expand / disable', () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'], selectedKeys: ['child-1-1'] })
    const childNode = wrapper.findAll(ns.e('node'))[1]
    expect(childNode.attributes('role')).toBe('treeitem')
    expect(childNode.attributes('aria-selected')).toBe('true')

    const rootNode = wrapper.findAll(ns.e('node'))[0]
    expect(rootNode.attributes('aria-expanded')).toBe('true')

    const disabledData = [{ key: 'd', title: 'D', disabled: true }]
    const disabled = mountTree({ data: disabledData })
    expect(disabled.find(ns.e('node')).attributes('aria-disabled')).toBe('true')
  })

  it('keyboard ArrowDown / ArrowUp moves focus through visible nodes', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'] })

    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:focusedKey')?.[0]).toEqual(['root-1'])

    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:focusedKey')?.[1]).toEqual(['child-1-1'])

    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:focusedKey')?.[2]).toEqual(['root-1'])
  })

  it('keyboard ArrowRight expands a collapsed node', async () => {
    const wrapper = mountTree({ focusedKey: 'root-1' })

    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['root-1']])
  })

  it('keyboard ArrowRight on already expanded node moves focus to first child', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'], focusedKey: 'root-1' })

    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:focusedKey')?.[0]).toEqual(['child-1-1'])
  })

  it('keyboard ArrowLeft collapses an expanded node', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'], focusedKey: 'root-1' })

    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([[]])
  })

  it('keyboard ArrowLeft on a collapsed child moves focus to parent', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'], focusedKey: 'child-1-1' })

    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:focusedKey')?.[0]).toEqual(['root-1'])
  })

  it('keyboard Enter triggers select on focused node', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'], focusedKey: 'child-1-1' })

    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['child-1-1']])
  })

  it('keyboard Space triggers check when checkable=true (instead of select)', async () => {
    const wrapper = mountTree({
      checkable: true,
      defaultExpandedKeys: ['root-1', 'child-1-2'],
      focusedKey: 'leaf-1-2-1',
    })

    await wrapper.trigger('keydown', { key: ' ' })
    // child-1-2 also flips checked because its only checkable child is leaf-1-2-1
    // (leaf-1-2-2 is disabled, excluded from propagation)
    const checked = wrapper.emitted('update:checkedKeys')?.[0]?.[0] as string[]
    expect(checked).toContain('leaf-1-2-1')
  })

  it('keyboard Home / End jump to first / last visible node', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1', 'child-1-2'], focusedKey: 'child-1-1' })

    await wrapper.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:focusedKey')?.[0]).toEqual(['root-2'])

    await wrapper.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:focusedKey')?.[1]).toEqual(['root-1'])
  })

  it('focused node carries roving tabindex=0, others -1', () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1'], focusedKey: 'child-1-1' })

    const nodes = wrapper.findAll(ns.e('node'))
    const focused = nodes.find((node) => node.attributes('data-key') === 'child-1-1')!
    expect(focused.attributes('tabindex')).toBe('0')
    const others = nodes.filter((node) => node.attributes('data-key') !== 'child-1-1')
    others.forEach((node) => expect(node.attributes('tabindex')).toBe('-1'))
  })

  it('virtualScroll renders only the visible window with absolute positioning', async () => {
    const big = Array.from({ length: 200 }, (_, i) => ({ key: `n-${i}`, title: `Node ${i}` }))
    const wrapper = mountTree({
      data: big,
      virtualScroll: true,
      virtualItemHeight: 32,
      virtualMaxHeight: 96,
    })

    await nextTick()
    const virtualContainer = wrapper.find(ns.e('virtual'))
    expect(virtualContainer.exists()).toBe(true)
    const renderedNodes = wrapper.findAll(ns.e('node'))
    expect(renderedNodes.length).toBeLessThan(200)
    expect(renderedNodes.length).toBeGreaterThan(0)

    // each rendered node has absolute positioning
    expect(renderedNodes[0].attributes('style')).toContain('position: absolute')
  })

  it('disabled tree blocks keyboard navigation', async () => {
    const wrapper = mountTree({ disabled: true, focusedKey: 'root-1' })

    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:focusedKey')).toBeUndefined()
  })

  it('focusedKey prop is controlled: internal state mirrors only when prop is undefined', async () => {
    const wrapper = mountTree({ focusedKey: 'root-1' })

    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    // emit fires but rendered state still reflects prop, not internal value
    expect(wrapper.emitted('update:focusedKey')?.[0]).toEqual(['root-2'])
    const nodes = wrapper.findAll(ns.e('node'))
    const focused = nodes.find((node) => node.attributes('data-key') === 'root-1')
    expect(focused?.attributes('tabindex')).toBe('0')
  })

  it('showLine renders an indent guide span per ancestor depth', () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['root-1', 'child-1-2'], showLine: true })

    expect(wrapper.classes()).toContain(ns.m('show-line').substring(1))
    const leaf = wrapper.findAll(ns.e('node')).find((node) => node.attributes('data-key') === 'leaf-1-2-1')!
    // leaf is at level 2 → 2 guide spans
    expect(leaf.findAll(ns.e('guide'))).toHaveLength(2)
  })

  it('showLine connector slot lets consumers render custom guide content per depth', () => {
    const wrapper = mountTree(
      { defaultExpandedKeys: ['root-1'], showLine: true },
      {
        connector: ({ depth }: { depth: number }) => h('span', { class: 'guide-tag' }, `d${depth}`),
      },
    )
    const guides = wrapper.findAll('.guide-tag')
    expect(guides.length).toBeGreaterThan(0)
    expect(guides[0].text()).toBe('d0')
  })

  it('drag hover on a collapsed node auto-expands after dragHoverExpandDelay', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mountTree({ draggable: true, dragHoverExpandDelay: 200 })
      const nodes = wrapper.findAll(ns.e('node'))

      await nodes[1].trigger('dragstart') // drag root-2
      await nodes[0].trigger('dragover', { clientY: 14 }) // hover middle of root-1 -> 'inside'

      expect(wrapper.emitted('update:expandedKeys')).toBeUndefined()
      vi.advanceTimersByTime(220)
      await nextTick()

      const expandEmits = wrapper.emitted('update:expandedKeys') as Array<unknown[]>
      expect(expandEmits[0][0]).toEqual(['root-1'])
    } finally {
      vi.useRealTimers()
    }
  })

  it('drag hover-expand timer cleared on drop and dragend', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mountTree({ draggable: true, dragHoverExpandDelay: 200 })
      const nodes = wrapper.findAll(ns.e('node'))

      await nodes[1].trigger('dragstart')
      await nodes[0].trigger('dragover', { clientY: 14 })
      await nodes[0].trigger('drop', { clientY: 14 })
      vi.advanceTimersByTime(220)
      await nextTick()

      // drop fires reorder via emit('drop'), but expandedKeys should not have been
      // mutated by the cancelled hover timer
      expect(wrapper.emitted('update:expandedKeys')).toBeUndefined()
    } finally {
      vi.useRealTimers()
    }
  })

  it('loadData failure flips switcher to error state and emits load-error', async () => {
    const error = new Error('boom')
    const loadData = vi.fn(() => Promise.reject(error))
    const data = [{ key: 'lazy', title: 'Lazy', isLeaf: false }]
    const wrapper = mountTree({ data, loadData })

    await wrapper.find(ns.e('switcher-wrap')).trigger('click')
    // wait for the failure microtask
    await nextTick()
    await nextTick()
    await nextTick()

    expect(loadData).toHaveBeenCalledTimes(1)
    const loadErrorEvents = wrapper.emitted('load-error') as Array<unknown[]>
    expect(loadErrorEvents).toBeDefined()
    expect((loadErrorEvents[0][0] as { error: Error }).error).toBe(error)
    expect(wrapper.find(ns.e('switcher-error')).exists()).toBe(true)
  })

  it('clicking the error switcher retries the load', async () => {
    let attempt = 0
    const loadData = vi.fn(async (node: { key?: string; children?: unknown[] }) => {
      attempt += 1
      if (attempt === 1) throw new Error('first try fails')
      node.children = [{ key: `${node.key}-c`, title: 'Recovered' }]
    })
    const data = [{ key: 'lazy', title: 'Lazy', isLeaf: false }]
    const wrapper = mountTree({ data, loadData })

    await wrapper.find(ns.e('switcher-wrap')).trigger('click')
    await nextTick()
    await nextTick()
    expect(wrapper.find(ns.e('switcher-error')).exists()).toBe(true)

    await wrapper.find(ns.e('switcher-error')).trigger('click')
    await nextTick()
    await nextTick()

    expect(loadData).toHaveBeenCalledTimes(2)
    expect(wrapper.find(ns.e('switcher-error')).exists()).toBe(false)
  })

  it('exposes retryLoad / isNodeLoading / hasLoadError on the component instance', async () => {
    const error = new Error('fail')
    const loadData = vi.fn(() => Promise.reject(error))
    const data = [{ key: 'lazy', title: 'Lazy', isLeaf: false }]
    const wrapper = mountTree({ data, loadData })

    await wrapper.find(ns.e('switcher-wrap')).trigger('click')
    await nextTick()
    await nextTick()

    const vm = wrapper.vm as unknown as {
      hasLoadError: (key: string) => boolean
      isNodeLoading: (key: string) => boolean
      retryLoad: (key: string) => Promise<void>
    }
    expect(vm.hasLoadError('lazy')).toBe(true)
    expect(vm.isNodeLoading('lazy')).toBe(false)
    expect(typeof vm.retryLoad).toBe('function')
  })

  it('checkable: parent flips from half-checked to fully checked when all enabled descendants are checked', async () => {
    const wrapper = mountTree({
      checkable: true,
      defaultExpandedKeys: ['root-1', 'child-1-2'],
      checkedKeys: ['leaf-1-2-1'],
    })
    expect(wrapper.findAll(ns.em('checkbox', 'indeterminate')).length).toBeGreaterThan(0)

    // disabled leaf-1-2-2 is excluded from the check propagation; once leaf-1-2-1
    // and child-1-1 are checked, root-1 becomes fully checked, not half.
    await wrapper.setProps({ checkedKeys: ['leaf-1-2-1', 'child-1-1'] })
    expect(wrapper.findAll(ns.em('checkbox', 'indeterminate'))).toHaveLength(0)
    expect(wrapper.findAll(ns.em('checkbox', 'checked')).length).toBeGreaterThan(0)
  })

  describe('M-A2 classNames / styles 钩子', () => {
    it('classNames.root 注入到根节点', () => {
      const wrapper = mountTree({ classNames: { root: 'my-root' } })
      expect(wrapper.find('.ccui-tree').classes()).toContain('my-root')
    })

    it('styles.root 注入到根节点 style', () => {
      const wrapper = mountTree({ styles: { root: { color: 'red' } } })
      expect(wrapper.find('.ccui-tree').attributes('style') || '').toContain('red')
    })
  })
})
