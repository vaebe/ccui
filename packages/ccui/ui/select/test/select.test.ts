import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { h, nextTick, ref } from 'vue'
import { Select } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { formItemInjectionKey } from '../../form/src/form-types'

const ns = useNamespace('select', true)
const options = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma', disabled: true },
]
const manyOptions = options.concat({ label: 'Delta', value: 'delta' })
const wrappers: VueWrapper[] = []

function mountSelect(props = {}, slots = {}) {
  const wrapper = mount(Select, { props, slots })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
})

describe('select', () => {
  it('renders placeholder and opens options', async () => {
    const wrapper = mountSelect({ options, placeholder: 'Pick one' })

    expect(wrapper.find(ns.e('placeholder')).text()).toBe('Pick one')
    await wrapper.trigger('click')
    expect(wrapper.findAll(ns.e('option')).length).toBe(3)
  })

  it('emits selected value in single mode and closes the dropdown', async () => {
    const wrapper = mountSelect({ options })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['beta'])
    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(false)
  })

  it('renders selected label from modelValue', () => {
    const wrapper = mountSelect({ options, modelValue: 'alpha' })

    expect(wrapper.find(ns.e('single')).text()).toBe('Alpha')
  })

  it('does not emit or close when a disabled option is clicked', async () => {
    const wrapper = mountSelect({ options })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(true)
  })

  it('does not open when disabled', async () => {
    const wrapper = mountSelect({ options, disabled: true })

    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Enter' })

    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(false)
    expect(wrapper.emitted('visible-change')).toBeUndefined()
  })

  it('clears a single value and emits clear', async () => {
    const wrapper = mountSelect({ options, modelValue: 'alpha', clearable: true })

    await wrapper.find(ns.e('clear')).trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    expect(wrapper.emitted('change')?.[0]).toEqual([undefined])
    expect(wrapper.emitted('clear')?.length).toBe(1)
    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(false)
  })

  it('supports multiple selection, deselection, and tag removal', async () => {
    const wrapper = mountSelect({ options, multiple: true })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['alpha']])

    await wrapper.setProps({ modelValue: ['alpha'] })
    await wrapper.findAll(ns.e('option'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]])

    await wrapper.setProps({ modelValue: ['alpha'] })
    expect(wrapper.find(ns.e('tag')).text()).toContain('Alpha')
    await wrapper.find(ns.e('tag-close')).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([[]])
  })

  it('clears multiple values as an empty array', async () => {
    const wrapper = mountSelect({ options, multiple: true, modelValue: ['alpha', 'beta'], clearable: true })

    await wrapper.find(ns.e('clear')).trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(wrapper.emitted('change')?.[0]).toEqual([[]])
    expect(wrapper.emitted('clear')?.length).toBe(1)
  })

  it('limits rendered tags with maxTagCount', () => {
    const wrapper = mountSelect({
      options: manyOptions,
      multiple: true,
      modelValue: ['alpha', 'beta', 'delta'],
      maxTagCount: 1,
    })

    const tags = wrapper.findAll(ns.e('tag'))
    expect(tags.length).toBe(2)
    expect(tags[0].text()).toContain('Alpha')
    expect(tags[1].text()).toBe('+2')
  })

  it('filters options by label or value and emits search text', async () => {
    const onSearch = vi.fn()
    const wrapper = mountSelect({ options: manyOptions, filterable: true, onSearch })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('bet')

    expect(onSearch).toHaveBeenCalledWith('bet')
    expect(wrapper.findAll(ns.e('option')).length).toBe(1)
    expect(wrapper.find(ns.e('option')).text()).toContain('Beta')

    await wrapper.find('input').setValue('delta')
    expect(wrapper.find(ns.e('option')).text()).toContain('Delta')
  })

  it('keeps search input available for multiple filterable select with selected tags', async () => {
    const wrapper = mountSelect({ options, multiple: true, filterable: true, modelValue: ['alpha'] })

    await wrapper.trigger('click')
    expect(wrapper.find(ns.e('tag')).text()).toContain('Alpha')
    expect(wrapper.find('input').exists()).toBe(true)

    await wrapper.find('input').setValue('bet')
    expect(wrapper.findAll(ns.e('option')).length).toBe(1)
    expect(wrapper.find(ns.e('option')).text()).toContain('Beta')
  })

  it('resets search text after single selection', async () => {
    const wrapper = mountSelect({ options, filterable: true })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('bet')
    await wrapper.find(ns.e('option')).trigger('click')
    await wrapper.trigger('click')

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
    expect(wrapper.findAll(ns.e('option')).length).toBe(3)
  })

  it('renders loading and empty states with custom text', async () => {
    const wrapper = mountSelect({ options: [], loading: true, loadingText: 'Fetching', noDataText: 'Nothing here' })

    await wrapper.trigger('click')
    expect(wrapper.find(ns.e('loading')).text()).toBe('Fetching')

    await wrapper.setProps({ loading: false })
    expect(wrapper.find(ns.e('empty')).text()).toBe('Nothing here')
  })

  it('emits visible-change on open, escape close, and outside close', async () => {
    const wrapper = mountSelect({ options })

    await wrapper.trigger('click')
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])

    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('visible-change')?.[1]).toEqual([false])

    await wrapper.trigger('click')
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('visible-change')?.[2]).toEqual([true])
    expect(wrapper.emitted('visible-change')?.[3]).toEqual([false])
  })

  it('selects active enabled option from keyboard and skips disabled options', async () => {
    const wrapper = mountSelect({ options })

    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.findAll(ns.e('option'))[1].classes()).toContain(ns.em('option', 'active').slice(1))

    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta'])
  })

  it('renders option groups with group labels and only shows non-empty groups when filtering', async () => {
    const grouped = [
      {
        label: 'Letters',
        options: [
          { label: 'Alpha', value: 'a' },
          { label: 'Beta', value: 'b' },
        ],
      },
      { label: 'Greek', options: [{ label: 'Gamma', value: 'g' }] },
    ]
    const wrapper = mountSelect({ options: grouped, filterable: true })

    await wrapper.trigger('click')
    expect(wrapper.findAll(ns.e('group-label')).length).toBe(2)
    expect(wrapper.findAll(ns.e('option')).length).toBe(3)

    await wrapper.find('input').setValue('alp')
    expect(wrapper.findAll(ns.e('group-label')).length).toBe(1)
    expect(wrapper.findAll(ns.e('option')).length).toBe(1)
    expect(wrapper.find(ns.e('group-label')).text()).toBe('Letters')
  })

  it('supports fieldNames mapping for label/value/disabled/options', async () => {
    const data = [
      {
        name: 'Group A',
        items: [
          { name: 'Apple', id: 1 },
          { name: 'Apricot', id: 2, locked: true },
        ],
      },
    ]
    const wrapper = mountSelect({
      options: data,
      fieldNames: { label: 'name', value: 'id', disabled: 'locked', options: 'items' },
    })

    await wrapper.trigger('click')
    expect(wrapper.find(ns.e('group-label')).text()).toBe('Group A')
    const opts = wrapper.findAll(ns.e('option'))
    expect(opts[0].text()).toContain('Apple')
    expect(opts[1].classes()).toContain(ns.em('option', 'disabled').slice(1))

    await opts[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('disables internal filtering when filterOption is false (remote search)', async () => {
    const wrapper = mountSelect({ options, filterable: true, filterOption: false })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('zzz')

    // all options remain visible since internal filter is bypassed
    expect(wrapper.findAll(ns.e('option')).length).toBe(3)
  })

  it('uses custom filterOption function predicate', async () => {
    const wrapper = mountSelect({
      options: manyOptions,
      filterable: true,
      filterOption: (input: string, option: { label?: string }) => option.label === 'Delta' && input.length > 0,
    })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('x')

    expect(wrapper.findAll(ns.e('option')).length).toBe(1)
    expect(wrapper.find(ns.e('option')).text()).toContain('Delta')
  })

  it('tags mode: Enter on empty match creates a new tag and clears input', async () => {
    const wrapper = mountSelect({ options, mode: 'tags', filterable: true })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('newtag')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['newtag']])
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })

  it('tags mode: ignores empty/whitespace-only and duplicate tags', async () => {
    const wrapper = mountSelect({ options: [], mode: 'tags', filterable: true, modelValue: ['existing'] })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('   ')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.find('input').setValue('existing')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('mode="multiple" behaves like legacy multiple=true', async () => {
    const wrapper = mountSelect({ options, mode: 'multiple' })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['alpha']])
    expect(wrapper.classes()).toContain(ns.m('multiple').substring(1))
  })

  it('Backspace in multiple removes last selected tag when search is empty', async () => {
    const wrapper = mountSelect({
      options,
      multiple: true,
      filterable: true,
      modelValue: ['alpha', 'beta'],
    })

    await wrapper.trigger('click')
    await wrapper.find('input').trigger('keydown', { key: 'Backspace' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['alpha']])
  })

  it('renders custom option slot with selected flag', async () => {
    const wrapper = mountSelect(
      { options },
      {
        option: ({ option, selected }: { option: { label?: string }; selected: boolean }) =>
          h('span', { class: 'custom-opt' }, `${option.label}${selected ? '!' : ''}`),
      },
    )

    await wrapper.trigger('click')
    expect(wrapper.findAll('.custom-opt')).toHaveLength(3)
    expect(wrapper.findAll('.custom-opt')[0].text()).toBe('Alpha')
  })

  it('renders custom tag slot in multiple mode', () => {
    const wrapper = mountSelect(
      { options, multiple: true, modelValue: ['alpha'] },
      {
        tag: ({ option }: { option: { label?: string } }) => h('span', { class: 'custom-tag' }, option.label),
      },
    )

    expect(wrapper.find('.custom-tag').exists()).toBe(true)
    expect(wrapper.find('.custom-tag').text()).toBe('Alpha')
  })

  it('renders custom empty slot when no options match', async () => {
    const wrapper = mountSelect({ options: [] }, { empty: () => h('div', { class: 'no-data' }, 'Try another keyword') })

    await wrapper.trigger('click')
    expect(wrapper.find('.no-data').exists()).toBe(true)
    expect(wrapper.find('.no-data').text()).toBe('Try another keyword')
  })

  it('applies status class for error and warning', async () => {
    const errored = mountSelect({ options, status: 'error' })
    const warned = mountSelect({ options, status: 'warning' })

    expect(errored.classes()).toContain(ns.m('error').substring(1))
    expect(warned.classes()).toContain(ns.m('warning').substring(1))
  })

  it('inherits validateStatus from injected FormItem context', () => {
    const validateStatus = ref<'' | 'error'>('error')
    const onValidate = vi.fn(async () => true)
    const wrapper = mount(Select, {
      props: { options },
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validateStatus,
            isInsideForm: true,
            validate: onValidate,
          },
        },
      },
    })
    wrappers.push(wrapper)

    expect(wrapper.classes()).toContain(ns.m('error').substring(1))
  })

  it('triggers FormItem.validate on modelValue change and on close', async () => {
    const validateStatus = ref<'' | 'success'>('')
    const onValidate = vi.fn(async () => true)
    const wrapper = mount(Select, {
      props: { options },
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validateStatus,
            isInsideForm: true,
            validate: onValidate,
          },
        },
      },
    })
    wrappers.push(wrapper)

    await wrapper.setProps({ modelValue: 'alpha' })
    expect(onValidate).toHaveBeenCalledWith('change')

    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(onValidate).toHaveBeenCalledWith('blur')
  })

  it('placement prop drives popup placement attr on dropdown style', async () => {
    const wrapper = mountSelect({ options, placement: 'top' })
    await wrapper.trigger('click')
    const dropdown = wrapper.find(ns.e('dropdown'))
    expect(dropdown.exists()).toBe(true)
    // floating-ui assigns positioning via style; verify presence of position styles
    expect(dropdown.attributes('style') ?? '').toMatch(/position:\s*absolute|left:|top:/)
  })

  it('popupClassName extends dropdown classes', async () => {
    const wrapper = mountSelect({ options, popupClassName: 'my-popup' })
    await wrapper.trigger('click')
    expect(wrapper.find('.my-popup').exists()).toBe(true)
  })
})
