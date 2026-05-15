import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { Mentions } from '../index'
import { findActiveMention } from '../src/mentions-types'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('mentions', true)
const wrappers: VueWrapper[] = []

const SAMPLE = ['anna', 'alice', 'bob', { value: 'charlie', label: 'Charlie' }, { value: 'dora', disabled: true }]

function mountM(props: Record<string, unknown> = {}) {
  const wrapper = mount(Mentions, {
    props: { options: SAMPLE, ...props },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

async function typeAt(wrapper: VueWrapper, value: string, cursor?: number) {
  const ta = wrapper.find('textarea').element as HTMLTextAreaElement
  ta.value = value
  if (cursor !== undefined) {
    ta.setSelectionRange(cursor, cursor)
  } else {
    ta.setSelectionRange(value.length, value.length)
  }
  ta.dispatchEvent(new Event('input', { bubbles: true }))
  await nextTick()
  await nextTick() // 第二次 tick 让 refreshMatch 完成
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('findActiveMention pure function', () => {
  it('detects @ at start of string', () => {
    expect(findActiveMention('@a', 2, ['@'])).toEqual({ prefix: '@', search: 'a', start: 0 })
  })

  it('detects @ after a space', () => {
    expect(findActiveMention('hi @bo', 6, ['@'])).toEqual({ prefix: '@', search: 'bo', start: 3 })
  })

  it('does not match when @ is preceded by non-whitespace (email-style)', () => {
    expect(findActiveMention('me@x', 4, ['@'])).toBeNull()
  })

  it('does not match when whitespace is between @ and cursor', () => {
    expect(findActiveMention('@bo  end', 8, ['@'])).toBeNull()
  })

  it('chooses the latest prefix when multiple are present', () => {
    expect(findActiveMention('hi @x and @y', 12, ['@'])?.start).toBe(10)
  })

  it('supports multiple prefix characters', () => {
    expect(findActiveMention('hi #ta', 6, ['@', '#'])).toEqual({ prefix: '#', search: 'ta', start: 3 })
  })

  it('returns null when no prefix is present', () => {
    expect(findActiveMention('hello world', 11, ['@'])).toBeNull()
  })
})

describe('mentions rendering', () => {
  it('renders a textarea with placeholder and rows', () => {
    const wrapper = mountM({ placeholder: 'say something', rows: 5 })
    const ta = wrapper.find('textarea')
    expect(ta.attributes('placeholder')).toBe('say something')
    expect(ta.attributes('rows')).toBe('5')
  })

  it('reflects modelValue as textarea value', () => {
    const wrapper = mountM({ modelValue: 'hello' })
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('hello')
  })

  it('disabled state applies is-disabled and disables textarea', () => {
    const wrapper = mountM({ disabled: true })
    expect(wrapper.find(ns.b()).classes()).toContain('is-disabled')
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).disabled).toBe(true)
  })
})

describe('mentions popup trigger', () => {
  it('does not show popup until prefix is typed', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, 'hello')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('opens popup when @ is typed at the start', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, '@')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
  })

  it('opens popup when @ is typed after a space', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, 'hi @')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    expect(wrapper.findAll(ns.e('option'))).toHaveLength(5)
  })

  it('does not open popup when @ is preceded by non-whitespace', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, 'me@x')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('closes popup when whitespace is typed after prefix', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, '@a')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    await typeAt(wrapper, '@a ')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('emits search with current keyword and prefix', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, '@al')
    const last = wrapper.emitted('search')!.slice(-1)[0]
    expect(last).toEqual(['al', '@'])
  })
})

describe('mentions filtering', () => {
  it('default filter narrows options by includes', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, '@al')
    const labels = wrapper.findAll(ns.e('option')).map((n) => n.text())
    expect(labels).toEqual(['alice'])
  })

  it('filterOption=false shows all options', async () => {
    const wrapper = mountM({ filterOption: false })
    await typeAt(wrapper, '@xx')
    expect(wrapper.findAll(ns.e('option'))).toHaveLength(5)
  })

  it('custom filterOption function', async () => {
    const wrapper = mountM({
      filterOption: (input: string, option: { value: string }) => option.value.startsWith(input),
    })
    await typeAt(wrapper, '@a')
    const labels = wrapper.findAll(ns.e('option')).map((n) => n.text())
    expect(labels.sort()).toEqual(['alice', 'anna'])
  })

  it('renders notFoundContent when no matches', async () => {
    const wrapper = mountM({ notFoundContent: '没人' })
    await typeAt(wrapper, '@zz')
    expect(wrapper.find(ns.e('empty')).text()).toBe('没人')
  })
})

describe('mentions selection', () => {
  it('clicking an option inserts prefix + value + split into textarea', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, 'hi @bo')
    const bob = wrapper.findAll(ns.e('option')).find((n) => n.text() === 'bob')!
    await bob.trigger('mousedown')
    await nextTick()
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('hi @bob ')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })

  it('uses option.value not label when they differ', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, '@ch')
    const charlie = wrapper.findAll(ns.e('option')).find((n) => n.text() === 'Charlie')!
    await charlie.trigger('mousedown')
    await nextTick()
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('@charlie ')
    const sel = wrapper.emitted('select')!.slice(-1)[0]
    expect(sel[0]).toMatchObject({ value: 'charlie', label: 'Charlie' })
    expect(sel[1]).toBe('@')
  })

  it('does not insert disabled option', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, '@d')
    const dora = wrapper.findAll(ns.e('option')).find((n) => n.text() === 'dora')!
    expect(dora.classes()).toContain('is-disabled')
    await dora.trigger('mousedown')
    await nextTick()
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('custom split character', async () => {
    const wrapper = mountM({ split: ', ' })
    await typeAt(wrapper, '@bo')
    await wrapper
      .findAll(ns.e('option'))
      .find((n) => n.text() === 'bob')!
      .trigger('mousedown')
    await nextTick()
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('@bob, ')
  })

  it('preserves text after the cursor when inserting', async () => {
    const wrapper = mountM()
    // 中间插入：cursor 在 5（@b 后），然后选 bob → 应替换 @b 为 @bob 并保留尾部
    const ta = wrapper.find('textarea').element as HTMLTextAreaElement
    ta.value = 'hi @b end'
    ta.setSelectionRange(5, 5)
    ta.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    await nextTick()
    await wrapper
      .findAll(ns.e('option'))
      .find((n) => n.text() === 'bob')!
      .trigger('mousedown')
    await nextTick()
    expect(ta.value).toBe('hi @bob  end')
  })
})

describe('mentions keyboard navigation', () => {
  it('ArrowDown advances active option, skipping disabled', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, '@')
    // start: activeIndex=0 (anna)
    let active = wrapper.findAll(ns.e('option')).findIndex((n) => n.classes().includes('is-active'))
    expect(active).toBe(0)
    await wrapper.find('textarea').trigger('keydown', { key: 'ArrowDown' })
    active = wrapper.findAll(ns.e('option')).findIndex((n) => n.classes().includes('is-active'))
    expect(active).toBe(1) // alice
  })

  it('Enter selects the active option', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, '@')
    await wrapper.find('textarea').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('@alice ')
  })

  it('Escape closes popup without inserting', async () => {
    const wrapper = mountM()
    await typeAt(wrapper, '@')
    await wrapper.find('textarea').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
    // 不 emit select
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})

describe('mentions multiple prefixes', () => {
  it('supports prefix as array; matches the latest one', async () => {
    const wrapper = mountM({ prefix: ['@', '#'] })
    await typeAt(wrapper, 'hi #')
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    const last = wrapper.emitted('search')!.slice(-1)[0]
    expect(last).toEqual(['', '#'])
  })
})

describe('mentions v-model', () => {
  it('uncontrolled defaultValue and emit update:modelValue', async () => {
    const wrapper = mountM({ defaultValue: 'init' })
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('init')
    await typeAt(wrapper, 'init typed')
    expect(wrapper.emitted('update:modelValue')!.slice(-1)[0]).toEqual(['init typed'])
  })

  it('controlled mode: typing emits but parent must write back', async () => {
    const value = ref('start')
    const Host = defineComponent({
      setup() {
        return () =>
          h(Mentions, {
            modelValue: value.value,
            options: SAMPLE,
            'onUpdate:modelValue': (v: string) => (value.value = v),
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    const ta = wrapper.find('textarea').element as HTMLTextAreaElement
    ta.value = 'start @al'
    ta.setSelectionRange(9, 9)
    ta.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    await nextTick()
    expect(value.value).toBe('start @al')
  })
})

describe('mentions Tab selection', () => {
  it('Tab key selects active option like Enter', async () => {
    const wrapper = mountM({ options: SAMPLE })
    const ta = wrapper.find('textarea')
    await ta.setValue('@')
    ta.element.setSelectionRange(1, 1)
    ta.element.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    await nextTick()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(true)
    // Tab 选中第一项
    await ta.trigger('keydown', { key: 'Tab' })
    await nextTick()
    expect(wrapper.emitted('select')).toBeDefined()
    expect(wrapper.find(ns.e('panel')).exists()).toBe(false)
  })
})

describe('mentions autoSize', () => {
  it('renders textarea without fixed rows when autoSize=true', () => {
    const wrapper = mountM({ autoSize: true })
    // autoSize 模式下组件仍渲染 textarea
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('accepts object { minRows, maxRows } config', () => {
    const wrapper = mountM({ autoSize: { minRows: 2, maxRows: 6 } })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })
})

describe('mentions variant', () => {
  it('默认 variant 为 outlined', () => {
    const wrapper = mountM()
    expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
  })

  it('variant="filled"', () => {
    const wrapper = mountM({ variant: 'filled' })
    expect(wrapper.find(ns.m('variant-filled')).exists()).toBe(true)
  })

  it('variant="borderless"', () => {
    const wrapper = mountM({ variant: 'borderless' })
    expect(wrapper.find(ns.m('variant-borderless')).exists()).toBe(true)
  })

  it('variant="underlined"', () => {
    const wrapper = mountM({ variant: 'underlined' })
    expect(wrapper.find(ns.m('variant-underlined')).exists()).toBe(true)
  })
})
