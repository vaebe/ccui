import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { Cascader } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Form, FormItem } from '../../form'

const ns = useNamespace('cascader', true)
const wrappers: VueWrapper[] = []

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖' },
          { value: 'binjiang', label: '滨江' },
        ],
      },
      {
        value: 'ningbo',
        label: '宁波',
        children: [{ value: 'haishu', label: '海曙' }],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [{ value: 'gulou', label: '鼓楼' }],
      },
      {
        value: 'suzhou',
        label: '苏州',
        disabled: true,
        children: [{ value: 'gusu', label: '姑苏' }],
      },
    ],
  },
]

function mountCascader(props: Record<string, unknown> = {}) {
  const wrapper = mount(Cascader, { props: { options, ...props }, attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}

async function openPanel(wrapper: VueWrapper) {
  await wrapper.find(ns.e('input-wrap')).trigger('click')
  await nextTick()
  await nextTick()
}

function findColumn(wrapper: VueWrapper, index: number) {
  return wrapper.findAll(ns.e('column'))[index]
}

function findItemByLabel(column: ReturnType<VueWrapper['find']>, label: string) {
  return column.findAll('li').find((li) => li.text().includes(label))
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('cascader rendering', () => {
  it('renders input with default placeholder', () => {
    const wrapper = mountCascader()
    expect(wrapper.find('input').attributes('placeholder')).toBe('请选择')
  })

  it('renders custom placeholder', () => {
    const wrapper = mountCascader({ placeholder: '请选择城市' })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请选择城市')
  })

  it('displays selected path joined with separator from modelValue', () => {
    const wrapper = mountCascader({ modelValue: ['zhejiang', 'hangzhou', 'xihu'] })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('浙江 / 杭州 / 西湖')
  })

  it('uses custom separator', () => {
    const wrapper = mountCascader({ modelValue: ['zhejiang', 'hangzhou', 'xihu'], separator: ' > ' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('浙江 > 杭州 > 西湖')
  })

  it('uses custom displayRender', () => {
    const wrapper = mountCascader({
      modelValue: ['zhejiang', 'hangzhou'],
      displayRender: (labels: string[]) => `[${labels.join('::')}]`,
    })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('[浙江::杭州]')
  })

  it('renders empty when modelValue path not found in options', () => {
    const wrapper = mountCascader({ modelValue: ['unknown', 'whatever'] })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })

  it('renders empty when modelValue is null', () => {
    const wrapper = mountCascader({ modelValue: null })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })
})

describe('cascader popup open/close', () => {
  it('opens panel on click and emits popup-visible-change(true)', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    expect(wrapper.emitted('popup-visible-change')?.[0]).toEqual([true])
  })

  it('closes on second click', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('closes on outside mousedown', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('does not open when disabled', async () => {
    const wrapper = mountCascader({ disabled: true })
    await openPanel(wrapper)
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('focuses input on autoFocus', async () => {
    const wrapper = mountCascader({ autoFocus: true })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.find('input').element)
  })
})

describe('cascader column expansion', () => {
  it('renders only top-level column initially when no value', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('column')).length).toBe(1)
    const labels = findColumn(wrapper, 0)
      .findAll('li')
      .map((li) => li.text())
    expect(labels[0]).toContain('浙江')
    expect(labels[1]).toContain('江苏')
  })

  it('opens with selectedPath columns when modelValue is set', async () => {
    const wrapper = mountCascader({ modelValue: ['zhejiang', 'hangzhou'] })
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('column')).length).toBe(3)
    const col2 = findColumn(wrapper, 2)
    expect(col2.text()).toContain('西湖')
  })

  it('clicking a non-leaf reveals next column', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    const zhejiang = findItemByLabel(findColumn(wrapper, 0), '浙江')
    await zhejiang!.trigger('click')
    expect(wrapper.findAll(ns.e('column')).length).toBe(2)
    expect(findColumn(wrapper, 1).text()).toContain('杭州')
  })

  it('clicking another sibling truncates deeper columns', async () => {
    const wrapper = mountCascader({ modelValue: ['zhejiang', 'hangzhou'] })
    await openPanel(wrapper)
    expect(wrapper.findAll(ns.e('column')).length).toBe(3)
    // 切到 江苏
    const jiangsu = findItemByLabel(findColumn(wrapper, 0), '江苏')
    await jiangsu!.trigger('click')
    expect(wrapper.findAll(ns.e('column')).length).toBe(2)
    expect(findColumn(wrapper, 1).text()).toContain('南京')
  })

  it('marks active item in each column', async () => {
    const wrapper = mountCascader({ modelValue: ['zhejiang', 'hangzhou', 'xihu'] })
    await openPanel(wrapper)
    const activeCells = wrapper.findAll(`${ns.em('item', 'active')}`)
    expect(activeCells.length).toBe(3)
    expect(activeCells[0].text()).toContain('浙江')
    expect(activeCells[1].text()).toContain('杭州')
    expect(activeCells[2].text()).toContain('西湖')
  })

  it('renders expand icon for non-leaf items', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    const expandIcons = findColumn(wrapper, 0).findAll(ns.e('expand-icon'))
    expect(expandIcons.length).toBe(2) // 浙江 + 江苏 都有 children
  })

  it('does not render expand icon for leaf items', async () => {
    const wrapper = mountCascader({ modelValue: ['zhejiang', 'hangzhou'] })
    await openPanel(wrapper)
    const col2 = findColumn(wrapper, 2) // 西湖、滨江
    expect(col2.findAll(ns.e('expand-icon')).length).toBe(0)
  })
})

describe('cascader selection', () => {
  it('emits full path and closes when leaf clicked', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    await findItemByLabel(findColumn(wrapper, 0), '浙江')!.trigger('click')
    await findItemByLabel(findColumn(wrapper, 1), '杭州')!.trigger('click')
    await findItemByLabel(findColumn(wrapper, 2), '西湖')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['zhejiang', 'hangzhou', 'xihu']])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('does not emit on non-leaf without changeOnSelect', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    await findItemByLabel(findColumn(wrapper, 0), '浙江')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('emits on every level with changeOnSelect=true and stays open until leaf', async () => {
    const wrapper = mountCascader({ changeOnSelect: true })
    await openPanel(wrapper)
    await findItemByLabel(findColumn(wrapper, 0), '浙江')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['zhejiang']])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    await findItemByLabel(findColumn(wrapper, 1), '杭州')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['zhejiang', 'hangzhou']])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    await findItemByLabel(findColumn(wrapper, 2), '西湖')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([['zhejiang', 'hangzhou', 'xihu']])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('emits change event with selectedOptions array', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    await findItemByLabel(findColumn(wrapper, 0), '江苏')!.trigger('click')
    await findItemByLabel(findColumn(wrapper, 1), '南京')!.trigger('click')
    await findItemByLabel(findColumn(wrapper, 2), '鼓楼')!.trigger('click')
    const change = wrapper.emitted('change')![0]
    expect(change[0]).toEqual(['jiangsu', 'nanjing', 'gulou'])
    expect((change[1] as Array<{ value: string }>).map((o) => o.value)).toEqual(['jiangsu', 'nanjing', 'gulou'])
  })

  it('clicking a disabled item does not emit', async () => {
    const wrapper = mountCascader()
    await openPanel(wrapper)
    await findItemByLabel(findColumn(wrapper, 0), '江苏')!.trigger('click')
    const suzhou = findItemByLabel(findColumn(wrapper, 1), '苏州')
    expect(suzhou!.classes().some((c) => c.endsWith('item--disabled'))).toBe(true)
    await suzhou!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('cascader fieldNames', () => {
  const customOptions = [
    {
      v: 'a',
      l: 'A',
      kids: [
        { v: 'a1', l: 'A1' },
        { v: 'a2', l: 'A2' },
      ],
    },
  ]

  it('uses custom fieldNames mapping', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options: customOptions,
        fieldNames: { label: 'l', value: 'v', children: 'kids' },
        modelValue: ['a', 'a1'],
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('A / A1')
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    expect(wrapper.findAll(ns.e('column')).length).toBe(2)
  })
})

describe('cascader clearable', () => {
  it('shows clear button when value present', () => {
    const wrapper = mountCascader({ modelValue: ['zhejiang', 'hangzhou', 'xihu'] })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(true)
  })

  it('hides clear button without value', () => {
    const wrapper = mountCascader()
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('hides clear when clearable=false', () => {
    const wrapper = mountCascader({ modelValue: ['zhejiang'], clearable: false })
    expect(wrapper.find(ns.e('clear')).exists()).toBe(false)
  })

  it('emits null on clear click and stops propagation', async () => {
    const wrapper = mountCascader({ modelValue: ['zhejiang', 'hangzhou', 'xihu'] })
    await wrapper.find(ns.e('clear')).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('change')?.[0]).toEqual([null, []])
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})

describe('cascader size and status', () => {
  it.each([['small'], ['default'], ['large']])('applies size modifier %s', (size) => {
    const wrapper = mountCascader({ size })
    expect(wrapper.classes()).toContain(`ccui-cascader--${size}`)
  })

  it('applies status modifier', () => {
    const wrapper = mountCascader({ status: 'error' })
    expect(wrapper.classes()).toContain('ccui-cascader--status-error')
  })
})

describe('cascader integrations', () => {
  it('inherits validate status from FormItem', async () => {
    const Wrapper = defineComponent({
      setup() {
        const model = ref<{ region: string[] | null }>({ region: null })
        const rules = { region: [{ required: true, message: '必填' }] }
        return () =>
          h(
            Form,
            { model: model.value, rules },
            {
              default: () =>
                h(
                  FormItem,
                  { name: 'region', prop: 'region' },
                  { default: () => h(Cascader, { options, modelValue: model.value.region }) },
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
    const wrapper = mountCascader({ popupAppendToBody: true })
    await openPanel(wrapper)
    expect(document.body.querySelector(ns.e('panel'))).toBeTruthy()
  })

  it('uses custom getPopupContainer', async () => {
    const container = document.createElement('div')
    container.id = 'custom-cascader-host'
    document.body.appendChild(container)
    const wrapper = mountCascader({ getPopupContainer: () => container })
    await openPanel(wrapper)
    expect(container.querySelector(ns.e('panel'))).toBeTruthy()
    container.remove()
  })

  it('reflects external v-model echo into display', async () => {
    const Wrapper = defineComponent({
      setup() {
        const value = ref<string[] | null>(null)
        return () =>
          h(Cascader, {
            options,
            modelValue: value.value,
            'onUpdate:modelValue': (v: string[] | null) => (value.value = v),
          })
      },
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper as unknown as VueWrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    await findItemByLabel(findColumn(wrapper as unknown as VueWrapper, 0), '浙江')!.trigger('click')
    await findItemByLabel(findColumn(wrapper as unknown as VueWrapper, 1), '宁波')!.trigger('click')
    await findItemByLabel(findColumn(wrapper as unknown as VueWrapper, 2), '海曙')!.trigger('click')
    await nextTick()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('浙江 / 宁波 / 海曙')
  })
})

describe('cascader notFoundContent', () => {
  it('renders default notFoundContent when options is empty', async () => {
    const wrapper = mount(Cascader, { props: { options: [] }, attachTo: document.body })
    wrappers.push(wrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('empty')).text()).toBe('暂无数据')
  })

  it('renders custom notFoundContent', async () => {
    const wrapper = mount(Cascader, {
      props: { options: [], notFoundContent: 'No data here' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await wrapper.find(ns.e('input-wrap')).trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('empty')).text()).toBe('No data here')
  })
})
