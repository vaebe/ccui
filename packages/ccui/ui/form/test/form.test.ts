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
    scrollToField: (prop: string | string[]) => void
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

  it('supports name path arrays, initial values, and custom validate messages', async () => {
    const model = reactive<{ users?: Array<{ email?: string }> }>({})
    const wrapper = mount(Form, {
      props: {
        model,
        initialValues: { users: [{ email: 'initial@example.com' }] },
        validateMessages: {
          types: {
            email: '${label} format error',
          },
        },
      },
      slots: {
        default: () =>
          h(FormItem, { label: 'Email', name: ['users', 0, 'email'], rules: { type: 'email' } }, () => h('input')),
      },
    })

    await nextTick()
    expect(model.users?.[0].email).toBe('initial@example.com')

    model.users![0].email = 'broken'
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.find(itemNs.e('message')).text()).toBe('Email format error')

    getFormVm(wrapper).resetFields()
    expect(model.users?.[0].email).toBe('initial@example.com')
  })

  it('revalidates fields when dependencies change', async () => {
    const model = reactive({ password: 'one', confirm: 'one' })
    const wrapper = mount(Form, {
      props: { model },
      slots: {
        default: () => [
          h(FormItem, { prop: 'password' }, () => h('input')),
          h(
            FormItem,
            {
              prop: 'confirm',
              dependencies: ['password'],
              rules: {
                validator: (_rule: unknown, value: string) => value === model.password || 'Passwords differ',
              },
            },
            () => h('input'),
          ),
        ],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validateField('confirm')).resolves.toBe(true)
    model.password = 'two'
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(wrapper.find(itemNs.e('message')).text()).toBe('Passwords differ')
  })

  it('supports layout props, extra text, hidden items, no-style items, and scrolling to fields', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView

    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        layout: 'vertical',
        requiredMark: 'optional',
        scrollToFirstError: true,
      },
      slots: {
        default: () => [
          h(FormItem, { label: 'Name', prop: 'name', rules: { required: true }, extra: 'Visible hint' }, () =>
            h('input'),
          ),
          h(FormItem, { label: 'Nickname', prop: 'nickname', hidden: true }, () => h('input')),
          h(FormItem, { prop: 'raw', noStyle: true }, () => h('input')),
        ],
      },
    })

    await nextTick()
    expect(wrapper.classes()).toContain(formNs.m('vertical').slice(1))
    expect(wrapper.find(itemNs.e('extra')).text()).toBe('Visible hint')
    expect(wrapper.findAllComponents(FormItem)[1].classes()).toContain(itemNs.m('hidden').slice(1))
    expect(wrapper.findAllComponents(FormItem)[2].classes()).toContain(itemNs.m('no-style').slice(1))

    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(scrollIntoView).toHaveBeenCalled()
  })

  it('renders top label position without fixed label width', () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        labelWidth: 120,
        labelPosition: 'top',
      },
      slots: {
        default: () => h(FormItem, { label: 'Name', prop: 'name' }, () => h('input')),
      },
    })

    expect(wrapper.classes()).toContain(formNs.m('label-top').slice(1))
    expect(wrapper.findComponent(FormItem).classes()).toContain(itemNs.m('top').slice(1))
    expect(wrapper.find(itemNs.e('label')).attributes('style')).toBeUndefined()
  })

  it('renders inline layout class', () => {
    const wrapper = mount(Form, {
      props: {
        model: { keyword: '' },
        layout: 'inline',
      },
      slots: {
        default: () => h(FormItem, { label: 'Keyword', prop: 'keyword' }, () => h('input')),
      },
    })

    expect(wrapper.classes()).toContain(formNs.m('inline').slice(1))
  })

  it('supports disabling required mark from form', () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        requiredMark: false,
      },
      slots: {
        default: () => h(FormItem, { label: 'Name', prop: 'name', required: true }, () => h('input')),
      },
    })

    expect(wrapper.findComponent(FormItem).classes()).not.toContain(itemNs.m('required').slice(1))
  })

  it('renders optional mark for non-required fields', () => {
    const wrapper = mount(Form, {
      props: {
        model: { nickname: '' },
        requiredMark: 'optional',
      },
      slots: {
        default: () => h(FormItem, { label: 'Nickname', prop: 'nickname' }, () => h('input')),
      },
    })

    expect(wrapper.find(itemNs.e('optional')).text()).toBe('(optional)')
  })

  it('supports form and item colon configuration', () => {
    const wrapper = mount(Form, {
      props: {
        model: { first: '', second: '' },
        colon: false,
      },
      slots: {
        default: () => [
          h(FormItem, { label: 'First', prop: 'first' }, () => h('input')),
          h(FormItem, { label: 'Second', prop: 'second', colon: true }, () => h('input')),
        ],
      },
    })

    const labels = wrapper.findAll(itemNs.e('label'))
    expect(labels[0].classes()).not.toContain(itemNs.em('label', 'colon').slice(1))
    expect(labels[1].classes()).toContain(itemNs.em('label', 'colon').slice(1))
  })

  it('forwards htmlFor to the label', () => {
    const wrapper = mount(Form, {
      props: {
        model: { email: '' },
      },
      slots: {
        default: () => h(FormItem, { label: 'Email', prop: 'email', htmlFor: 'email-input' }, () => h('input')),
      },
    })

    expect(wrapper.find(itemNs.e('label')).attributes('for')).toBe('email-input')
  })

  it('uses external validateStatus and help text', () => {
    const wrapper = mount(Form, {
      props: {
        model: { email: '' },
      },
      slots: {
        default: () =>
          h(FormItem, { label: 'Email', prop: 'email', validateStatus: 'error', help: 'External error' }, () =>
            h('input'),
          ),
      },
    })

    expect(wrapper.findComponent(FormItem).classes()).toContain(itemNs.m('error').slice(1))
    expect(wrapper.find(itemNs.e('message')).text()).toBe('External error')
  })

  it('clears validation state for all fields', async () => {
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
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.findAll(itemNs.e('message')).length).toBe(2)

    getFormVm(wrapper).clearValidate()
    await nextTick()
    expect(wrapper.findAll(itemNs.e('message')).length).toBe(0)
  })

  it('resets only selected fields', async () => {
    const model = reactive({ name: 'Initial', age: '18' })
    const wrapper = mount(Form, {
      props: { model },
      slots: {
        default: () => [
          h(FormItem, { prop: 'name' }, () => h('input')),
          h(FormItem, { prop: 'age' }, () => h('input')),
        ],
      },
    })

    await nextTick()
    model.name = 'Changed'
    model.age = '20'
    getFormVm(wrapper).resetFields('name')

    expect(model.name).toBe('Initial')
    expect(model.age).toBe('20')
  })

  it('validates multiple selected fields', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '', age: '', city: '' },
        rules: {
          name: { required: true, message: 'Missing name' },
          age: { required: true, message: 'Missing age' },
          city: { required: true, message: 'Missing city' },
        },
      },
      slots: {
        default: () => [
          h(FormItem, { prop: 'name' }, () => h('input')),
          h(FormItem, { prop: 'age' }, () => h('input')),
          h(FormItem, { prop: 'city' }, () => h('input')),
        ],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validateField(['name', 'age'])).resolves.toBe(false)
    expect(wrapper.findAll(itemNs.e('message')).map((item) => item.text())).toEqual(['Missing name', 'Missing age'])
  })

  it('emits submit with true when validation passes', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: 'Ready' },
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

    expect(wrapper.emitted('submit')?.[0][0]).toBe(true)
    expect(wrapper.emitted('validate-failed')).toBeUndefined()
  })

  it('returns true for fields without prop or rules', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
      },
      slots: {
        default: () => [h(FormItem, null, () => h('input')), h(FormItem, { prop: 'name' }, () => h('input'))],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(true)
  })

  it('merges form rules and item rules', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { code: 'ab' },
        rules: {
          code: { pattern: /^\d+$/, message: 'Digits only' },
        },
      },
      slots: {
        default: () => h(FormItem, { prop: 'code', rules: { min: 3, message: 'Too short' } }, () => h('input')),
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.find(itemNs.e('message')).text()).toBe('Digits only')
  })

  it('clears validation when rules change with validateOnRuleChange', async () => {
    const rules = reactive({
      name: { required: true, message: 'Missing name' },
    })
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        rules,
      },
      slots: {
        default: () => h(FormItem, { prop: 'name' }, () => h('input')),
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.find(itemNs.e('message')).exists()).toBe(true)

    await wrapper.setProps({ rules: { name: { required: true, message: 'Still missing' } } })
    expect(wrapper.find(itemNs.e('message')).exists()).toBe(false)
  })

  it('keeps validation state when validateOnRuleChange is false', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        rules: { name: { required: true, message: 'Missing name' } },
        validateOnRuleChange: false,
      },
      slots: {
        default: () => h(FormItem, { prop: 'name' }, () => h('input')),
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    await wrapper.setProps({ rules: { name: { required: true, message: 'Still missing' } } })
    expect(wrapper.find(itemNs.e('message')).text()).toBe('Missing name')
  })

  it('validates primitive and collection types', async () => {
    const wrapper = mount(Form, {
      props: {
        model: {
          title: 1,
          count: '1',
          enabled: 'yes',
          tags: 'tag',
          profile: ['invalid'],
        },
        rules: {
          title: { type: 'string', message: 'Title type error' },
          count: { type: 'number', message: 'Count type error' },
          enabled: { type: 'boolean', message: 'Enabled type error' },
          tags: { type: 'array', message: 'Tags type error' },
          profile: { type: 'object', message: 'Profile type error' },
        },
      },
      slots: {
        default: () => [
          h(FormItem, { prop: 'title' }, () => h('input')),
          h(FormItem, { prop: 'count' }, () => h('input')),
          h(FormItem, { prop: 'enabled' }, () => h('input')),
          h(FormItem, { prop: 'tags' }, () => h('input')),
          h(FormItem, { prop: 'profile' }, () => h('input')),
        ],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.findAll(itemNs.e('message')).map((item) => item.text())).toEqual([
      'Title type error',
      'Count type error',
      'Enabled type error',
      'Tags type error',
      'Profile type error',
    ])
  })

  it('validates email and url types', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { email: 'broken', site: 'ftp://example.com' },
        rules: {
          email: { type: 'email', message: 'Email invalid' },
          site: { type: 'url', message: 'Url invalid' },
        },
      },
      slots: {
        default: () => [
          h(FormItem, { prop: 'email' }, () => h('input')),
          h(FormItem, { prop: 'site' }, () => h('input')),
        ],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.findAll(itemNs.e('message')).map((item) => item.text())).toEqual(['Email invalid', 'Url invalid'])
  })

  it('validates enum and whitespace rules', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { role: 'guest', title: '   ' },
        rules: {
          role: { enum: ['admin', 'user'], message: 'Role invalid' },
          title: { whitespace: true, message: 'Title blank' },
        },
      },
      slots: {
        default: () => [
          h(FormItem, { prop: 'role' }, () => h('input')),
          h(FormItem, { prop: 'title' }, () => h('input')),
        ],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.findAll(itemNs.e('message')).map((item) => item.text())).toEqual(['Role invalid', 'Title blank'])
  })

  it('uses validate message templates for length and range checks', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { code: 'ab', score: 8, tags: ['one', 'two', 'three'] },
        rules: {
          code: { len: 4 },
          score: { type: 'number', min: 10, max: 20 },
          tags: { type: 'array', max: 2 },
        },
        validateMessages: {
          string: { len: '${label} length must be ${len}' },
          number: { range: '${label} must be ${min}-${max}' },
          array: { max: '${label} max ${max}' },
        },
      },
      slots: {
        default: () => [
          h(FormItem, { label: 'Code', prop: 'code' }, () => h('input')),
          h(FormItem, { label: 'Score', prop: 'score' }, () => h('input')),
          h(FormItem, { label: 'Tags', prop: 'tags' }, () => h('input')),
        ],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.findAll(itemNs.e('message')).map((item) => item.text())).toEqual([
      'Code length must be 4',
      'Score must be 10-20',
      'Tags max 2',
    ])
  })

  it('supports validators returning false and Error', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { first: 'bad', second: 'bad' },
        rules: {
          first: { message: 'First invalid', validator: () => false },
          second: { validator: () => new Error('Second invalid') },
        },
      },
      slots: {
        default: () => [
          h(FormItem, { prop: 'first' }, () => h('input')),
          h(FormItem, { prop: 'second' }, () => h('input')),
        ],
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.findAll(itemNs.e('message')).map((item) => item.text())).toEqual(['First invalid', 'Second invalid'])
  })

  it('validates hidden fields while keeping them hidden', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { token: '' },
        rules: {
          token: { required: true, message: 'Token missing' },
        },
      },
      slots: {
        default: () => h(FormItem, { prop: 'token', hidden: true }, () => h('input')),
      },
    })

    await nextTick()
    await expect(getFormVm(wrapper).validate()).resolves.toBe(false)
    expect(wrapper.findComponent(FormItem).classes()).toContain(itemNs.m('hidden').slice(1))
    expect(wrapper.find(itemNs.e('message')).text()).toBe('Token missing')
  })

  it('scrolls to a field through exposed scrollToField', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
      },
      slots: {
        default: () => h(FormItem, { prop: 'name' }, () => h('input')),
      },
    })

    await nextTick()
    getFormVm(wrapper).scrollToField('name')
    expect(scrollIntoView).toHaveBeenCalled()
  })
})
