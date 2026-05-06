import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { h, nextTick, reactive } from 'vue'
import { Form, FormItem } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const formNs = useNamespace('form', true)
const itemNs = useNamespace('form-item', true)

function getFormVm(wrapper: VueWrapper) {
  return wrapper.findComponent(Form).vm.$.exposed as {
    validate: () => Promise<boolean>
    validateField: (prop: string | string[]) => Promise<boolean>
    resetFields: (prop?: string | string[]) => void
    clearValidate: (prop?: string | string[]) => void
  }
}

describe('form', () => {
  it('renders labels, required mark, and layout classes', () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        labelWidth: 96,
        labelPosition: 'left',
      },
      slots: {
        default: () => h(FormItem, { label: 'Name', prop: 'name', required: true }, () => h('input')),
      },
    })

    expect(wrapper.classes()).toContain(formNs.m('label-left').slice(1))
    expect(wrapper.find(itemNs.e('label')).attributes('style')).toContain('width: 96px')
    expect(wrapper.findComponent(FormItem).classes()).toContain(itemNs.m('required').slice(1))
  })

  it('validates required, pattern, and size rules', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '', code: 'ab' },
        rules: {
          name: { required: true, message: 'Name is required' },
          code: { pattern: /^\d+$/, min: 3, message: 'Code is invalid' },
        },
      },
      slots: {
        default: () => [
          h(FormItem, { label: 'Name', prop: 'name' }, () => h('input')),
          h(FormItem, { label: 'Code', prop: 'code' }, () => h('input')),
        ],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.findAll(itemNs.e('message')).map((item) => item.text())).toEqual([
      'Name is required',
      'Code is invalid',
    ])
    expect(wrapper.emitted('validate')?.[0]).toEqual(['name', false, 'Name is required'])
  })

  it('supports async custom validators', async () => {
    const validator = vi.fn(async (_rule, value: string) => value === 'ok' || 'Value must be ok')
    const model = reactive({ status: 'bad' })
    const wrapper = mount(Form, {
      props: {
        model,
        rules: {
          status: { validator },
        },
      },
      slots: {
        default: () => h(FormItem, { prop: 'status' }, () => h('input')),
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.find(itemNs.e('message')).text()).toBe('Value must be ok')

    model.status = 'ok'
    await expect(getFormVm(wrapper).validate()).resolves.toBe(true)
    expect(validator).toHaveBeenCalledTimes(2)
  })

  it('validates a single field and clears selected validation state', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '', age: '' },
        rules: {
          name: { required: true, message: 'Missing name' },
          age: { required: true, message: 'Missing age' },
        },
      },
      slots: {
        default: () => [
          h(FormItem, { prop: 'name' }, () => h('input')),
          h(FormItem, { prop: 'age' }, () => h('input')),
        ],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validateField('name')).resolves.toBe(false)
    expect(wrapper.findAll(itemNs.e('message')).length).toBe(1)

    getFormVm(wrapper).clearValidate('name')
    await nextTick()
    expect(wrapper.find(itemNs.e('message')).exists()).toBe(false)
  })

  it('resets fields back to their initial values', async () => {
    const model = reactive({ user: { name: 'Initial' } })
    const wrapper = mount(Form, {
      props: { model },
      slots: {
        default: () => h(FormItem, { prop: 'user.name' }, () => h('input')),
      },
    })

    await nextTick()
    model.user.name = 'Changed'
    getFormVm(wrapper).resetFields()

    expect(model.user.name).toBe('Initial')
  })

  it('filters validation rules by trigger from captured native events', async () => {
    const model = reactive({ email: '' })
    const wrapper = mount(Form, {
      props: {
        model,
        rules: {
          email: [
            { required: true, trigger: 'blur', message: 'Email required' },
            { pattern: /@/, trigger: 'change', message: 'Email invalid' },
          ],
        },
      },
      slots: {
        default: () => h(FormItem, { prop: 'email' }, () => h('input', { value: model.email })),
      },
    })

    await wrapper.find('input').trigger('change')
    expect(wrapper.find(itemNs.e('message')).text()).toBe('Email invalid')

    model.email = ''
    getFormVm(wrapper).clearValidate()
    await wrapper.find('input').trigger('focusout')
    expect(wrapper.find(itemNs.e('message')).text()).toBe('Email required')
  })

  it('emits submit with validation result', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        rules: {
          name: { required: true, message: 'Missing name' },
        },
      },
      slots: {
        default: () => h(FormItem, { prop: 'name' }, () => h('button', { type: 'submit' }, 'Submit')),
      },
    })

    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(wrapper.emitted('submit')?.[0][0]).toBe(false)
    expect(wrapper.emitted('validate-failed')?.length).toBe(1)
  })
})
