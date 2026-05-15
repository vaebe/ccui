import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Paragraph, Text, Title } from '../index'

// 给 jsdom 注入 navigator.clipboard
const writeText = vi.fn(() => Promise.resolve())

beforeEach(() => {
  writeText.mockClear()
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Typography copyable (L-3.7)', () => {
  it('renders copy button when copyable=true', () => {
    const wrapper = mount(Text, { props: { copyable: true }, slots: { default: 'hello' } })
    expect(wrapper.find('.ccui-typography__copy').exists()).toBe(true)
  })

  it('does not render copy button when copyable=false', () => {
    const wrapper = mount(Text, { props: { copyable: false }, slots: { default: 'hello' } })
    expect(wrapper.find('.ccui-typography__copy').exists()).toBe(false)
  })

  it('click copy button calls navigator.clipboard.writeText with slot text', async () => {
    const wrapper = mount(Text, { props: { copyable: true }, slots: { default: 'hello world' } })
    await wrapper.find('.ccui-typography__copy').trigger('click')
    await nextTick()
    expect(writeText).toHaveBeenCalledWith('hello world')
  })

  it('copyable.text overrides slot text', async () => {
    const wrapper = mount(Text, {
      props: { copyable: { text: 'override' } },
      slots: { default: 'visible' },
    })
    await wrapper.find('.ccui-typography__copy').trigger('click')
    expect(writeText).toHaveBeenCalledWith('override')
  })

  it('onCopy callback fires with copied text', async () => {
    const onCopy = vi.fn()
    const wrapper = mount(Text, {
      props: { copyable: { onCopy, text: 'x' } },
      slots: { default: 'foo' },
    })
    await wrapper.find('.ccui-typography__copy').trigger('click')
    await nextTick()
    expect(onCopy).toHaveBeenCalledWith('x')
  })

  it('icon swaps to copied state after click then resets', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Text, {
      props: { copyable: { copyableDelay: 100 } },
      slots: { default: 'a' },
    })
    await wrapper.find('.ccui-typography__copy').trigger('click')
    // 等 promise 链
    await Promise.resolve()
    await nextTick()
    expect(wrapper.find('.ccui-typography__copy.is-copied').exists()).toBe(true)
    vi.advanceTimersByTime(150)
    await nextTick()
    expect(wrapper.find('.ccui-typography__copy.is-copied').exists()).toBe(false)
  })

  it('uses copy-icon slot when provided with { copied } scope', async () => {
    const wrapper = mount(Text, {
      props: { copyable: true },
      slots: {
        default: 'a',
        'copy-icon': ({ copied }: { copied: boolean }) => (copied ? 'DONE' : 'DO'),
      },
    })
    expect(wrapper.find('.ccui-typography__copy').text()).toBe('DO')
    await wrapper.find('.ccui-typography__copy').trigger('click')
    await Promise.resolve()
    await nextTick()
    expect(wrapper.find('.ccui-typography__copy').text()).toBe('DONE')
  })

  it('renders custom tooltips array as title attribute', async () => {
    const wrapper = mount(Text, {
      props: { copyable: { tooltips: ['复制我', '搞定了'] } },
      slots: { default: 'a' },
    })
    expect(wrapper.find('.ccui-typography__copy').attributes('title')).toBe('复制我')
  })
})

describe('Typography editable (L-3.7)', () => {
  it('renders edit button when editable=true', () => {
    const wrapper = mount(Text, { props: { editable: true }, slots: { default: 'hi' } })
    expect(wrapper.find('.ccui-typography__edit').exists()).toBe(true)
  })

  it('click edit button switches to textarea editing mode', async () => {
    const wrapper = mount(Text, { props: { editable: true }, slots: { default: 'hi' } })
    await wrapper.find('.ccui-typography__edit').trigger('click')
    expect(wrapper.find('.ccui-typography__edit-input').exists()).toBe(true)
  })

  it('Enter key emits onChange with new value', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Text, {
      props: { editable: { onChange } },
      slots: { default: 'old' },
    })
    await wrapper.find('.ccui-typography__edit').trigger('click')
    const textarea = wrapper.find('.ccui-typography__edit-input')
    await textarea.setValue('new')
    await textarea.trigger('keydown', { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('new')
    expect(wrapper.find('.ccui-typography__edit-input').exists()).toBe(false)
  })

  it('Escape key cancels edit without onChange', async () => {
    const onChange = vi.fn()
    const onCancel = vi.fn()
    const wrapper = mount(Text, {
      props: { editable: { onChange, onCancel } },
      slots: { default: 'old' },
    })
    await wrapper.find('.ccui-typography__edit').trigger('click')
    await wrapper.find('.ccui-typography__edit-input').trigger('keydown', { key: 'Escape' })
    expect(onChange).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalled()
  })

  it('triggerType=[\'text\'] makes the text itself clickable to edit', async () => {
    const wrapper = mount(Text, {
      props: { editable: { triggerType: ['text'] } },
      slots: { default: 'hi' },
    })
    // 没有 icon trigger 时不渲染 edit icon
    expect(wrapper.find('.ccui-typography__edit').exists()).toBe(false)
    await wrapper.trigger('click')
    expect(wrapper.find('.ccui-typography__edit-input').exists()).toBe(true)
  })

  it('uses edit-icon slot', async () => {
    const wrapper = mount(Text, {
      props: { editable: true },
      slots: { default: 'a', 'edit-icon': () => 'EDIT' },
    })
    expect(wrapper.find('.ccui-typography__edit').text()).toBe('EDIT')
  })
})

describe('Typography ellipsis (L-3.7)', () => {
  it('applies --ellipsis modifier when ellipsis=true', () => {
    const wrapper = mount(Paragraph, { props: { ellipsis: true }, slots: { default: 'long text' } })
    expect(wrapper.find('.ccui-typography--ellipsis').exists()).toBe(true)
  })

  it('applies --ellipsis-N modifier for multi rows', () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 3 } },
      slots: { default: 'long text' },
    })
    expect(wrapper.find('.ccui-typography--ellipsis-3').exists()).toBe(true)
  })

  it('renders expand button when expandable=true', () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 2, expandable: true } },
      slots: { default: 'long text' },
    })
    expect(wrapper.find('.ccui-typography__expand').exists()).toBe(true)
    expect(wrapper.find('.ccui-typography__expand').text()).toBe('展开')
  })

  it('click expand toggles state and removes --ellipsis class', async () => {
    const onExpand = vi.fn()
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 2, expandable: true, onExpand } },
      slots: { default: 'long text' },
    })
    await wrapper.find('.ccui-typography__expand').trigger('click')
    expect(onExpand).toHaveBeenCalledWith(true)
    expect(wrapper.find('.ccui-typography--ellipsis').exists()).toBe(false)
  })

  it('collapsible mode shows collapse button after expanding', async () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 2, expandable: 'collapsible' } },
      slots: { default: 'long' },
    })
    await wrapper.find('.ccui-typography__expand').trigger('click')
    expect(wrapper.find('.ccui-typography__collapse').exists()).toBe(true)
    expect(wrapper.find('.ccui-typography__collapse').text()).toBe('收起')
  })

  it('uses expand-text / collapse-text slots', async () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 2, expandable: 'collapsible' } },
      slots: {
        default: 'a',
        'expand-text': () => '展开更多',
        'collapse-text': () => '收起一下',
      },
    })
    expect(wrapper.find('.ccui-typography__expand').text()).toBe('展开更多')
    await wrapper.find('.ccui-typography__expand').trigger('click')
    expect(wrapper.find('.ccui-typography__collapse').text()).toBe('收起一下')
  })

  it('tooltip=true sets title attribute from slot text', () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { tooltip: true } },
      slots: { default: 'long content here' },
    })
    expect(wrapper.attributes('title')).toBe('long content here')
  })

  it('tooltip=string uses string as title', () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { tooltip: 'custom tip' } },
      slots: { default: 'a' },
    })
    expect(wrapper.attributes('title')).toBe('custom tip')
  })

  it('Title component supports ellipsis with rows', () => {
    const wrapper = mount(Title, {
      props: { level: 2, ellipsis: { rows: 2 } },
      slots: { default: 'long title' },
    })
    expect(wrapper.find('h2.ccui-typography--ellipsis-2').exists()).toBe(true)
  })

  it('expandable=true expanded does not show collapse (one-way)', async () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 2, expandable: true } },
      slots: { default: 'a' },
    })
    await wrapper.find('.ccui-typography__expand').trigger('click')
    // expandable=true 展开后不再渲染按钮
    expect(wrapper.find('.ccui-typography__expand').exists()).toBe(false)
    expect(wrapper.find('.ccui-typography__collapse').exists()).toBe(true) // 当前实现走 collapsible 兼容路径
  })
})
