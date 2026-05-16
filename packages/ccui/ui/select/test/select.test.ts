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

  it('exposes ARIA combobox semantics on the root element', async () => {
    const wrapper = mountSelect({ options })

    expect(wrapper.attributes('role')).toBe('combobox')
    expect(wrapper.attributes('aria-haspopup')).toBe('listbox')
    expect(wrapper.attributes('aria-expanded')).toBe('false')
    expect(wrapper.attributes('aria-controls')).toMatch(/^ccui-select-listbox-/)

    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-expanded')).toBe('true')
    expect(wrapper.attributes('aria-activedescendant')).toMatch(/^ccui-select-option-/)
  })

  it('options carry id, role, and aria-selected attributes', async () => {
    const wrapper = mountSelect({ options, modelValue: 'alpha' })

    await wrapper.trigger('click')
    const opts = wrapper.findAll(ns.e('option'))
    expect(opts[0].attributes('role')).toBe('option')
    expect(opts[0].attributes('id')).toMatch(/^ccui-select-option-/)
    expect(opts[0].attributes('aria-selected')).toBe('true')
    expect(opts[2].attributes('aria-disabled')).toBe('true')
  })

  it('Home / End jump to the first / last enabled option', async () => {
    const wrapper = mountSelect({ options: manyOptions })

    await wrapper.trigger('keydown', { key: 'End' })
    expect(wrapper.findAll(ns.e('option'))[3].classes()).toContain(ns.em('option', 'active').slice(1))

    await wrapper.trigger('keydown', { key: 'Home' })
    expect(wrapper.findAll(ns.e('option'))[0].classes()).toContain(ns.em('option', 'active').slice(1))
  })

  it('PageDown / PageUp move by virtualMaxHeight / itemHeight steps', async () => {
    const big = Array.from({ length: 20 }, (_, i) => ({ label: `O${i}`, value: i }))
    const wrapper = mountSelect({ options: big, virtualMaxHeight: 96, virtualItemHeight: 32 })

    await wrapper.trigger('keydown', { key: 'PageDown' })
    // pageStep = 96/32 = 3
    expect(wrapper.findAll(ns.e('option'))[3].classes()).toContain(ns.em('option', 'active').slice(1))

    await wrapper.trigger('keydown', { key: 'PageUp' })
    expect(wrapper.findAll(ns.e('option'))[0].classes()).toContain(ns.em('option', 'active').slice(1))
  })

  it('renders nested option groups recursively', async () => {
    const nested = [
      {
        label: 'Outer',
        options: [
          {
            label: 'Inner',
            options: [{ label: 'Deep', value: 'deep' }],
          },
        ],
      },
    ]
    const wrapper = mountSelect({ options: nested })

    await wrapper.trigger('click')
    const groupLabels = wrapper.findAll(ns.e('group-label'))
    expect(groupLabels).toHaveLength(2)
    expect(groupLabels[0].text()).toBe('Outer')
    expect(groupLabels[1].text()).toBe('Inner')
    expect(wrapper.findAll(ns.e('option'))).toHaveLength(1)
    expect(wrapper.find(ns.e('option')).text()).toContain('Deep')
  })

  it('hides parent group when nested matches are filtered out', async () => {
    const nested = [
      {
        label: 'Outer',
        options: [
          {
            label: 'Inner',
            options: [{ label: 'Apple', value: 'a' }],
          },
        ],
      },
      {
        label: 'Other',
        options: [{ label: 'Banana', value: 'b' }],
      },
    ]
    const wrapper = mountSelect({ options: nested, filterable: true })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('app')
    expect(wrapper.findAll(ns.e('group-label'))).toHaveLength(2) // Outer + Inner
    expect(wrapper.findAll(ns.e('option'))).toHaveLength(1)
  })

  it('highlightMatch wraps matched substring in <mark>', async () => {
    const wrapper = mountSelect({ options: manyOptions, filterable: true, highlightMatch: true })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('et')
    const mark = wrapper.find('.ccui-select__highlight')
    expect(mark.exists()).toBe(true)
    expect(mark.text()).toBe('et')
  })

  it('teleports popup to body when popupAppendToBody=true', async () => {
    const wrapper = mountSelect({ options, popupAppendToBody: true }, {})
    await wrapper.trigger('click')
    await nextTick()
    // Dropdown should be in document.body, not inside the wrapper root
    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(false)
    const dropdown = document.body.querySelector('.ccui-select__dropdown')
    expect(dropdown).toBeTruthy()
    dropdown?.parentElement?.removeChild(dropdown)
  })

  it('getPopupContainer overrides default popup target', async () => {
    const target = document.createElement('div')
    target.id = 'custom-popup-target'
    document.body.appendChild(target)

    const wrapper = mountSelect({ options, getPopupContainer: () => target })
    await wrapper.trigger('click')
    await nextTick()
    expect(target.querySelector('.ccui-select__dropdown')).toBeTruthy()
    document.body.removeChild(target)
  })

  it('labelInValue emits { value, label } payload for single mode', async () => {
    const wrapper = mountSelect({ options, labelInValue: true })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[0].trigger('click')

    const events = wrapper.emitted('update:modelValue') as Array<unknown[]>
    expect(events[0][0]).toEqual({ value: 'alpha', label: 'Alpha' })
  })

  it('labelInValue handles array payload for multiple mode', async () => {
    const wrapper = mountSelect({ options, mode: 'multiple', labelInValue: true })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[0].trigger('click')

    const events = wrapper.emitted('update:modelValue') as Array<unknown[]>
    expect(events[0][0]).toEqual([{ value: 'alpha', label: 'Alpha' }])
  })

  it('reads modelValue in labelInValue payload form for selection state', () => {
    const wrapper = mountSelect({
      options,
      labelInValue: true,
      modelValue: { value: 'alpha', label: 'Custom Alpha' },
    })

    expect(wrapper.find(ns.e('single')).text()).toBe('Alpha')
  })

  it('maxCount blocks adding beyond the limit in multiple mode', async () => {
    const wrapper = mountSelect({ options, mode: 'multiple', maxCount: 1 })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['alpha']])

    await wrapper.setProps({ modelValue: ['alpha'] })
    await wrapper.findAll(ns.e('option'))[1].trigger('click')
    // second click should not produce a new emission
    expect(wrapper.emitted('update:modelValue')?.length).toBe(1)
  })

  it('maxCount blocks tag creation in tags mode at limit', async () => {
    const wrapper = mountSelect({
      options: [],
      mode: 'tags',
      filterable: true,
      maxCount: 1,
      modelValue: ['existing'],
    })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('newtag')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('autoFocus focuses the root on mount', async () => {
    const wrapper = mount(Select, {
      props: { options, autoFocus: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)

    await nextTick()
    expect(document.activeElement).toBe(wrapper.element)
  })

  it('defaultActiveFirstOption=false starts activeIndex at 0 without seeking enabled', async () => {
    const lead = [
      { label: 'A', value: 'a', disabled: true },
      { label: 'B', value: 'b' },
    ]
    const wrapper = mountSelect({ options: lead, defaultActiveFirstOption: false })

    await wrapper.trigger('click')
    expect(wrapper.findAll(ns.e('option'))[0].classes()).toContain(ns.em('option', 'active').slice(1))
  })

  it('virtualScroll renders only visible window when enabled', async () => {
    const big = Array.from({ length: 200 }, (_, i) => ({ label: `Opt ${i}`, value: i }))
    const wrapper = mountSelect({
      options: big,
      virtualScroll: true,
      virtualItemHeight: 32,
      virtualMaxHeight: 128,
    })

    await wrapper.trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('virtual')).exists()).toBe(true)
    // visible window: ceil(128/32) + 2*4 buffer ≈ 12 items, NOT 200
    const rendered = wrapper.findAll(ns.e('option'))
    expect(rendered.length).toBeLessThan(200)
    expect(rendered.length).toBeGreaterThan(0)
  })

  it('emits focus and blur events from root', async () => {
    const wrapper = mountSelect({ options })

    await wrapper.trigger('focus')
    expect(wrapper.emitted('focus')).toBeDefined()

    await wrapper.trigger('blur')
    expect(wrapper.emitted('blur')).toBeDefined()
  })

  it('optionLabelProp uses a different field for selected display while keeping label for filtering', async () => {
    const data = [
      { label: 'Alpha (long description)', value: 'alpha', short: 'A' },
      { label: 'Beta (long description)', value: 'beta', short: 'B' },
    ]
    const wrapper = mountSelect({
      options: data,
      modelValue: 'alpha',
      optionLabelProp: 'short',
    })

    expect(wrapper.find(ns.e('single')).text()).toBe('A')

    await wrapper.trigger('click')
    expect(wrapper.findAll(ns.e('option'))[0].text()).toContain('Alpha (long description)')
  })

  it('optionLabelProp falls back to label when the field is missing', () => {
    const data = [{ label: 'Alpha', value: 'alpha' }]
    const wrapper = mountSelect({
      options: data,
      modelValue: 'alpha',
      optionLabelProp: 'nonExistent',
    })

    expect(wrapper.find(ns.e('single')).text()).toBe('Alpha')
  })

  it('optionLabelProp also drives multiple-mode tag display', () => {
    const data = [
      { label: 'Alpha (long)', value: 'alpha', short: 'α' },
      { label: 'Beta (long)', value: 'beta', short: 'β' },
    ]
    const wrapper = mountSelect({
      options: data,
      mode: 'multiple',
      modelValue: ['alpha', 'beta'],
      optionLabelProp: 'short',
    })

    const tags = wrapper.findAll(ns.e('tag-label'))
    expect(tags[0].text()).toBe('α')
    expect(tags[1].text()).toBe('β')
  })

  it('showSearch is treated as a filterable alias and reveals search input', async () => {
    const wrapper = mountSelect({ options: manyOptions, showSearch: true })

    await wrapper.trigger('click')
    expect(wrapper.find('input').exists()).toBe(true)
    await wrapper.find('input').setValue('bet')
    expect(wrapper.findAll(ns.e('option')).length).toBe(1)
  })

  it('showSearch + filterOption=false does not filter (remote search alias)', async () => {
    const wrapper = mountSelect({ options, showSearch: true, filterOption: false })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('zzz')
    expect(wrapper.findAll(ns.e('option')).length).toBe(3)
  })

  it('transitionName overrides the default popup transition', async () => {
    // Default transition wraps the popup, only animation class differs. Just verify
    // that overriding the prop does not break the dropdown render path.
    const wrapper = mountSelect({ options, transitionName: 'my-fade' })
    await wrapper.trigger('click')
    await nextTick()
    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(true)
  })

  it('tagsDraggable adds draggable=true and grab cursor class to tags', () => {
    const wrapper = mountSelect({
      options,
      mode: 'multiple',
      modelValue: ['alpha', 'beta'],
      tagsDraggable: true,
    })

    const tag = wrapper.find(ns.e('tag'))
    expect(tag.attributes('draggable')).toBe('true')
    expect(tag.classes()).toContain(ns.em('tag', 'draggable').slice(1))
  })

  it('tagsDraggable: dropping one tag onto another reorders the modelValue', async () => {
    const wrapper = mountSelect({
      options,
      mode: 'multiple',
      modelValue: ['alpha', 'beta'],
      tagsDraggable: true,
    })

    const tags = wrapper.findAll(ns.e('tag'))
    await tags[0].trigger('dragstart')
    await tags[1].trigger('dragover')
    await tags[1].trigger('drop')

    const events = wrapper.emitted('update:modelValue') as Array<unknown[]>
    expect(events?.[0]?.[0]).toEqual(['beta', 'alpha'])
  })

  it('tagsDraggable: dropping on the same tag is a no-op', async () => {
    const wrapper = mountSelect({
      options,
      mode: 'multiple',
      modelValue: ['alpha', 'beta'],
      tagsDraggable: true,
    })

    const tags = wrapper.findAll(ns.e('tag'))
    await tags[0].trigger('dragstart')
    await tags[0].trigger('dragover')
    await tags[0].trigger('drop')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('tagsDraggable=false does not set draggable on tags', () => {
    const wrapper = mountSelect({
      options,
      mode: 'multiple',
      modelValue: ['alpha'],
    })

    expect(wrapper.find(ns.e('tag')).attributes('draggable')).toBeUndefined()
  })

  describe('variant（v5.13+：outlined / filled / borderless / underlined）', () => {
    it('默认 variant 为 outlined', () => {
      const wrapper = mountSelect({ options })
      expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
    })

    it('variant="filled"', () => {
      const wrapper = mountSelect({ options, variant: 'filled' })
      expect(wrapper.find(ns.m('variant-filled')).exists()).toBe(true)
    })

    it('variant="borderless"', () => {
      const wrapper = mountSelect({ options, variant: 'borderless' })
      expect(wrapper.find(ns.m('variant-borderless')).exists()).toBe(true)
    })

    it('variant="underlined"', () => {
      const wrapper = mountSelect({ options, variant: 'underlined' })
      expect(wrapper.find(ns.m('variant-underlined')).exists()).toBe(true)
    })
  })

  describe('M-A4 图标钩子', () => {
    it('suffixIcon prop 渲染 <i>', () => {
      const wrapper = mountSelect({ options, suffixIcon: 'my-arrow' })
      expect(wrapper.find(`${ns.e('arrow')} i.my-arrow`).exists()).toBe(true)
    })

    it('suffixIcon slot 优先级高于 prop', () => {
      const wrapper = mountSelect(
        { options, suffixIcon: 'my-arrow' },
        { suffixIcon: () => h('span', { class: 'slot-suffix' }) },
      )
      expect(wrapper.find('.slot-suffix').exists()).toBe(true)
      expect(wrapper.find('i.my-arrow').exists()).toBe(false)
    })

    it('clearIcon prop（clearable 有值时）渲染 <i>', () => {
      const wrapper = mountSelect({ options, modelValue: 'alpha', clearable: true, clearIcon: 'my-clear' })
      expect(wrapper.find(`${ns.e('clear')} i.my-clear`).exists()).toBe(true)
    })

    it('removeIcon prop（multiple 模式 tag 关闭按钮）渲染 <i>', () => {
      const wrapper = mountSelect({
        options,
        multiple: true,
        modelValue: ['alpha', 'beta'],
        removeIcon: 'my-remove',
      })
      expect(wrapper.find(`${ns.e('tag-close')} i.my-remove`).exists()).toBe(true)
    })
  })

  describe('M-A2 classNames / styles 钩子', () => {
    it('classNames.root 注入到根节点', () => {
      const wrapper = mountSelect({ options, classNames: { root: 'my-root' } })
      expect(wrapper.find(ns.b()).classes()).toContain('my-root')
    })

    it('styles.root 注入到根节点 style', () => {
      const wrapper = mountSelect({ options, styles: { root: { color: 'red' } } })
      expect(wrapper.find(ns.b()).attributes('style') || '').toContain('color: red')
    })
  })

  describe('XL-4 ARIA combobox / listbox', () => {
    it('root 节点暴露 combobox / aria-haspopup="listbox" / aria-controls', () => {
      const wrapper = mountSelect({ options })
      const root = wrapper.find(ns.b())
      expect(root.attributes('role')).toBe('combobox')
      expect(root.attributes('aria-haspopup')).toBe('listbox')
      expect(root.attributes('aria-controls')).toBeTruthy()
    })

    it('multiple 模式 listbox 暴露 aria-multiselectable="true"', async () => {
      const wrapper = mountSelect({ options, multiple: true })
      await wrapper.trigger('click')
      const list = wrapper.find(`${ns.e('list')}[role="listbox"]`)
      expect(list.exists()).toBe(true)
      expect(list.attributes('aria-multiselectable')).toBe('true')
    })
  })
})
