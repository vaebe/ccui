import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { TreeSelect } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Form, FormItem } from '../../form'
import { formItemInjectionKey } from '../../form/src/form-types'

const ns = useNamespace('tree-select', true)
const wrappers: VueWrapper[] = []

const treeData = [
  {
    value: 'parent-1',
    label: '父节点 1',
    children: [
      { value: 'leaf-1-1', label: '叶子 1-1' },
      { value: 'leaf-1-2', label: '叶子 1-2' },
    ],
  },
  {
    value: 'parent-2',
    label: '父节点 2',
    children: [
      { value: 'leaf-2-1', label: '叶子 2-1' },
      { value: 'leaf-2-2', label: '叶子 2-2', disabled: true },
    ],
  },
]

function mountTS(props: Record<string, unknown> = {}) {
  const wrapper = mount(TreeSelect, {
    props: { treeData, treeDefaultExpandAll: true, ...props },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

async function openPanel(wrapper: VueWrapper) {
  await wrapper.find(ns.e('input-wrap')).trigger('click')
  await nextTick()
  await nextTick()
}

function findTreeNodeByLabel(wrapper: VueWrapper, label: string) {
  const all = wrapper.findAll('.ccui-tree__node')
  return all.find((n) => n.text().includes(label))
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('tree-select rendering', () => {
  it('renders input with default placeholder', () => {
    const wrapper = mountTS()
    expect(wrapper.find('input').attributes('placeholder')).toBe('请选择')
  })

  it('renders custom placeholder', () => {
    const wrapper = mountTS({ placeholder: '请选择节点' })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请选择节点')
  })

  it('displays selected label from single modelValue', () => {
    const wrapper = mountTS({ modelValue: 'leaf-1-1' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('叶子 1-1')
  })

  it('renders empty for unknown single value', () => {
    const wrapper = mountTS({ modelValue: 'no-such-key' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })

  it('renders empty for null', () => {
    const wrapper = mountTS({ modelValue: null })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })
})

describe('tree-select multi rendering', () => {
  it('renders tags for multi modelValue', () => {
    const wrapper = mountTS({ multiple: true, modelValue: ['leaf-1-1', 'leaf-2-1'] })
    const tags = wrapper.findAll(ns.e('tag'))
    expect(tags.length).toBe(2)
    expect(tags[0].text()).toContain('叶子 1-1')
    expect(tags[1].text()).toContain('叶子 2-1')
  })

  it('shows placeholder when multi value empty', () => {
    const wrapper = mountTS({ multiple: true })
    expect(wrapper.find(ns.e('placeholder')).text()).toBe('请选择')
  })

  it('renders +N overflow tag when exceeds maxTagCount', () => {
    const wrapper = mountTS({
      multiple: true,
      modelValue: ['leaf-1-1', 'leaf-1-2', 'leaf-2-1', 'leaf-2-2'],
      maxTagCount: 2,
    })
    const tags = wrapper.findAll(ns.e('tag'))
    expect(tags.length).toBe(3) // 2 visible + 1 overflow
    expect(tags[2].text()).toContain('+ 2')
  })

  it('does not show input element in multiple mode', () => {
    const wrapper = mountTS({ multiple: true, modelValue: ['leaf-1-1'] })
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('removes single tag on tag close click and stops propagation', async () => {
    const wrapper = mountTS({
      multiple: true,
      modelValue: ['leaf-1-1', 'leaf-2-1'],
    })
    await wrapper.findAll(ns.e('tag-close'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['leaf-2-1']])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('emits null when last tag removed', async () => {
    const wrapper = mountTS({ multiple: true, modelValue: ['leaf-1-1'] })
    await wrapper.find(ns.e('tag-close')).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('hides tag close when disabled', () => {
    const wrapper = mountTS({ multiple: true, modelValue: ['leaf-1-1'], disabled: true })
    expect(wrapper.find(ns.e('tag-close')).exists()).toBe(false)
  })
})

describe('tree-select popup open/close', () => {
  it('opens panel and emits popup-visible-change', async () => {
    const wrapper = mountTS()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    expect(wrapper.emitted('popup-visible-change')?.[0]).toEqual([true])
  })

  it('closes on second click', async () => {
    const wrapper = mountTS()
    await openPanel(wrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('closes on outside mousedown', async () => {
    const wrapper = mountTS()
    await openPanel(wrapper)
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('does not open when disabled', async () => {
    const wrapper = mountTS({ disabled: true })
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('renders empty popup when treeData is empty', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData: [] }, attachTo: document.body })
    wrappers.push(wrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('empty')).text()).toBe('暂无数据')
  })

  it('renders custom notFoundContent', async () => {
    const wrapper = mount(TreeSelect, {
      props: { treeData: [], notFoundContent: 'No nodes' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('empty')).text()).toBe('No nodes')
  })
})

describe('tree-select single selection', () => {
  it('emits scalar value on tree node select and closes', async () => {
    const wrapper = mountTS()
    await openPanel(wrapper)
    const node = findTreeNodeByLabel(wrapper, '叶子 1-2')
    await node!.find('.ccui-tree__content').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['leaf-1-2'])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('emits change with labels array', async () => {
    const wrapper = mountTS()
    await openPanel(wrapper)
    await findTreeNodeByLabel(wrapper, '叶子 1-1')!.find('.ccui-tree__content').trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual(['leaf-1-1', ['叶子 1-1']])
  })

  it('selecting parent emits parent value (single mode allows non-leaf)', async () => {
    const wrapper = mountTS()
    await openPanel(wrapper)
    await findTreeNodeByLabel(wrapper, '父节点 1')!.find('.ccui-tree__content').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['parent-1'])
  })
})

describe('tree-select multiple checkable', () => {
  it('emits array on check', async () => {
    const wrapper = mountTS({ multiple: true, treeCheckStrictly: true })
    await openPanel(wrapper)
    // checkable 模式下，find checkbox by 节点 + 内部 checkbox role
    const node = findTreeNodeByLabel(wrapper, '叶子 1-1')
    const checkbox = node!.find('.ccui-tree__checkbox')
    await checkbox.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['leaf-1-1']])
    // 多选 check 不关闭面板
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('appends keys on multiple checks', async () => {
    const wrapper = mountTS({ multiple: true, treeCheckStrictly: true, modelValue: ['leaf-1-1'] })
    await openPanel(wrapper)
    const node = findTreeNodeByLabel(wrapper, '叶子 2-1')
    await node!.find('.ccui-tree__checkbox').trigger('click')
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as string[]
    expect(last).toContain('leaf-1-1')
    expect(last).toContain('leaf-2-1')
  })

  it('uncheck removes from value and emits null when last removed', async () => {
    const wrapper = mountTS({
      multiple: true,
      treeCheckStrictly: true,
      modelValue: ['leaf-1-1'],
    })
    await openPanel(wrapper)
    const node = findTreeNodeByLabel(wrapper, '叶子 1-1')
    await node!.find('.ccui-tree__checkbox').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('renders checkboxes when multiple + treeCheckable', async () => {
    const wrapper = mountTS({ multiple: true })
    await openPanel(wrapper)
    expect(wrapper.findAll('.ccui-tree__checkbox').length).toBeGreaterThan(0)
  })

  it('does not render checkbox when treeCheckable=false (multiple selectable mode)', async () => {
    const wrapper = mountTS({ multiple: true, treeCheckable: false })
    await openPanel(wrapper)
    expect(wrapper.find('.ccui-tree__checkbox').exists()).toBe(false)
  })

  it('multiple selectable mode emits array on select without closing', async () => {
    const wrapper = mountTS({ multiple: true, treeCheckable: false })
    await openPanel(wrapper)
    await findTreeNodeByLabel(wrapper, '叶子 1-1')!.find('.ccui-tree__content').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['leaf-1-1']])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })
})

describe('tree-select fieldNames', () => {
  const customData = [
    {
      v: 'a',
      l: 'A',
      kids: [{ v: 'a1', l: 'A1' }],
    },
  ]

  it('uses custom fieldNames', () => {
    const wrapper = mount(TreeSelect, {
      props: {
        treeData: customData,
        fieldNames: { label: 'l', value: 'v', children: 'kids' },
        modelValue: 'a1',
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('A1')
  })

  it('emits with custom fieldNames mapping', async () => {
    const wrapper = mount(TreeSelect, {
      props: {
        treeData: customData,
        fieldNames: { label: 'l', value: 'v', children: 'kids' },
        treeDefaultExpandAll: true,
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    await findTreeNodeByLabel(wrapper, 'A1')!.find('.ccui-tree__content').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a1'])
  })
})

describe('tree-select clearable', () => {
  it('shows clear when single value present', () => {
    const wrapper = mountTS({ modelValue: 'leaf-1-1' })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
  })

  it('shows clear when multi value present', () => {
    const wrapper = mountTS({ multiple: true, modelValue: ['leaf-1-1'] })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
  })

  it('hides clear when no value', () => {
    const wrapper = mountTS()
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('hides clear when clearable=false', () => {
    const wrapper = mountTS({ modelValue: 'leaf-1-1', clearable: false })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('emits null on clear and stops propagation', async () => {
    const wrapper = mountTS({ multiple: true, modelValue: ['leaf-1-1', 'leaf-2-1'] })
    await wrapper.find(ns.e('clear')).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})

describe('tree-select size and status', () => {
  it.each([['small'], ['default'], ['large']])('applies size modifier %s', (size) => {
    const wrapper = mountTS({ size })
    expect(wrapper.classes()).toContain(`ccui-tree-select--${size}`)
  })

  it('applies status modifier', () => {
    const wrapper = mountTS({ status: 'error' })
    expect(wrapper.classes()).toContain('ccui-tree-select--status-error')
  })

  it('applies status="warning" modifier', () => {
    const wrapper = mountTS({ status: 'warning' })
    expect(wrapper.classes()).toContain('ccui-tree-select--status-warning')
  })

  it('adds is-multiple modifier in multiple mode', () => {
    const wrapper = mountTS({ multiple: true })
    expect(wrapper.classes()).toContain('is-multiple')
  })
})

describe('tree-select integrations', () => {
  it('triggers FormItem.validate on blur', async () => {
    const onValidate = vi.fn(async () => true)
    const wrapper = mount(TreeSelect, {
      props: { treeData },
      attachTo: document.body,
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validateStatus: ref(''),
            isInsideForm: true,
            validate: onValidate,
          },
        },
      },
    })
    wrappers.push(wrapper)
    await wrapper.find('input').trigger('blur')
    expect(onValidate).toHaveBeenCalledWith('blur')
  })

  it('inherits validate status from FormItem', async () => {
    const Wrapper = defineComponent({
      setup() {
        const model = ref<{ node: string | null }>({ node: null })
        const rules = { node: [{ required: true, message: '必填' }] }
        return () =>
          h(
            Form,
            { model: model.value, rules },
            {
              default: () =>
                h(
                  FormItem,
                  { name: 'node', prop: 'node' },
                  { default: () => h(TreeSelect, { treeData, modelValue: model.value.node }) },
                ),
            },
          )
      },
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper as unknown as VueWrapper)
    await nextTick()
    const form = wrapper.findComponent(Form).vm.$.exposed as { validate: () => Promise<boolean> }
    await form.validate().catch(() => false)
    await nextTick()
    expect(
      wrapper
        .find(ns.b())
        .classes()
        .some((c) => c.includes('status-error')),
    ).toBe(true)
  })

  it('teleports panel to body when popupAppendToBody', async () => {
    const wrapper = mountTS({ popupAppendToBody: true })
    await openPanel(wrapper)
    expect(document.body.querySelector(ns.e('panel'))).toBeTruthy()
  })

  it('uses custom getPopupContainer', async () => {
    const container = document.createElement('div')
    container.id = 'custom-tree-select-host'
    document.body.appendChild(container)
    const wrapper = mountTS({ getPopupContainer: () => container })
    await openPanel(wrapper)
    expect(container.querySelector(ns.e('panel'))).toBeTruthy()
    container.remove()
  })

  it('reflects external v-model echo into single display', async () => {
    const Wrapper = defineComponent({
      setup() {
        const value = ref<string | null>(null)
        return () =>
          h(TreeSelect, {
            treeData,
            treeDefaultExpandAll: true,
            modelValue: value.value,
            'onUpdate:modelValue': (v: string | null) => (value.value = v),
          })
      },
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper as unknown as VueWrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    await findTreeNodeByLabel(wrapper as unknown as VueWrapper, '叶子 2-1')!
      .find('.ccui-tree__content')
      .trigger('click')
    await nextTick()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('叶子 2-1')
  })

  describe('variant', () => {
    it('默认 variant 为 outlined', () => {
      const wrapper = mountTS()
      expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
    })

    it('variant="filled"', () => {
      const wrapper = mountTS({ variant: 'filled' })
      expect(wrapper.find(ns.m('variant-filled')).exists()).toBe(true)
    })

    it('variant="borderless"', () => {
      const wrapper = mountTS({ variant: 'borderless' })
      expect(wrapper.find(ns.m('variant-borderless')).exists()).toBe(true)
    })

    it('variant="underlined"', () => {
      const wrapper = mountTS({ variant: 'underlined' })
      expect(wrapper.find(ns.m('variant-underlined')).exists()).toBe(true)
    })
  })

  describe('M-A4 图标钩子', () => {
    it('suffixIcon prop 渲染 <i>', () => {
      const wrapper = mountTS({ suffixIcon: 'my-arrow' })
      expect(wrapper.find(`${ns.e('suffix')} i.my-arrow`).exists()).toBe(true)
    })

    it('suffixIcon slot 优先级高于 prop', () => {
      const wrapper = mount(TreeSelect, {
        props: { treeData, treeDefaultExpandAll: true, suffixIcon: 'my-arrow' },
        slots: { suffixIcon: () => h('span', { class: 'slot-suffix' }) },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      expect(wrapper.find('.slot-suffix').exists()).toBe(true)
    })

    it('clearIcon prop（有值时）渲染 <i>', () => {
      const wrapper = mountTS({ modelValue: 'leaf-2-1', clearable: true, clearIcon: 'my-clear' })
      expect(wrapper.find(`${ns.e('clear')} i.my-clear`).exists()).toBe(true)
    })

    it('removeIcon prop（multiple 模式 tag 关闭按钮）渲染 <i>', () => {
      const wrapper = mountTS({
        multiple: true,
        modelValue: ['leaf-2-1'],
        removeIcon: 'my-remove',
      })
      expect(wrapper.find(`${ns.e('tag-close')} i.my-remove`).exists()).toBe(true)
    })
  })
})

describe('tree-select M-A2 classNames / styles 钩子', () => {
  it('classNames.root 注入到根节点', () => {
    const wrapper = mountTS({ classNames: { root: 'my-root' } })
    expect(wrapper.find(ns.b()).classes()).toContain('my-root')
  })

  it('styles.root 注入到根节点 style', () => {
    const wrapper = mountTS({ styles: { root: { color: 'red' } } })
    expect(wrapper.find(ns.b()).attributes('style') || '').toContain('color: red')
  })
})

describe('tree-select M-B5 showSearch', () => {
  it('启用 showSearch 时面板渲染搜索框', async () => {
    const wrapper = mountTS({ showSearch: true })
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('search-input')).exists()).toBe(true)
  })

  it('未启用 showSearch 时面板不渲染搜索框', async () => {
    const wrapper = mountTS()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('search-input')).exists()).toBe(false)
  })

  it('输入 search 值时按 label 过滤节点', async () => {
    const wrapper = mountTS({ showSearch: true })
    await openPanel(wrapper)
    const input = wrapper.find(ns.e('search-input'))
    await input.setValue('叶子 1-1')
    await nextTick()
    const nodes = wrapper.findAll('.ccui-tree__node')
    const visibleLabels = nodes.map((n) => n.text())
    expect(visibleLabels.join('|')).toContain('叶子 1-1')
    // 不应包含 '叶子 2-1' / '叶子 2-2'
    expect(visibleLabels.join('|')).not.toContain('叶子 2-1')
  })

  it('支持 showSearch 对象形态自定义 filterTreeNode', async () => {
    const wrapper = mountTS({
      showSearch: {
        filterTreeNode: (input: string, node: Record<string, unknown>) => String(node.value).includes(input),
      },
    })
    await openPanel(wrapper)
    await wrapper.find(ns.e('search-input')).setValue('parent-1')
    await nextTick()
    const nodes = wrapper.findAll('.ccui-tree__node')
    expect(nodes.map((n) => n.text()).join('|')).toContain('父节点 1')
  })

  it('关闭面板时清空 search 值', async () => {
    const wrapper = mountTS({ showSearch: true })
    await openPanel(wrapper)
    await wrapper.find(ns.e('search-input')).setValue('foo')
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    // 重开
    await openPanel(wrapper)
    expect((wrapper.find(ns.e('search-input')).element as HTMLInputElement).value).toBe('')
  })
})

describe('tree-select M-B5 loadData', () => {
  it('loadData 转发到 c-tree，点击未加载叶子时触发', async () => {
    const asyncData = [
      { value: 'a', label: 'A', isLeaf: false },
      { value: 'b', label: 'B', isLeaf: false },
    ]
    const loadData = vi.fn(async () => {
      await Promise.resolve()
    })
    const wrapper = mount(TreeSelect, {
      props: { treeData: asyncData, loadData: loadData as never },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await openPanel(wrapper)
    // 点开 A 的 switcher 触发 loadData
    const switcher = wrapper.find('.ccui-tree__switcher')
    expect(switcher.exists()).toBe(true)
    await switcher.trigger('click')
    await nextTick()
    expect(loadData).toHaveBeenCalledTimes(1)
    const calledNode = (loadData.mock.calls[0] as unknown as [{ value: string }])[0]
    expect(calledNode.value).toBe('a')
  })
})

describe('tree-select M-B5 键盘导航', () => {
  it('Enter 在关闭态打开面板', async () => {
    const wrapper = mountTS()
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('ArrowDown 在关闭态打开面板', async () => {
    const wrapper = mountTS()
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('Escape 关闭面板', async () => {
    const wrapper = mountTS()
    await openPanel(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('Tab 关闭面板', async () => {
    const wrapper = mountTS()
    await openPanel(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'Tab' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})
