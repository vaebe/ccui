import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, reactive } from 'vue'
import { Form, FormItem, FormList, FormProvider } from '../index'
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

describe('formList', () => {
  it('initializes from initialValue and registers nested fields under the list path', async () => {
    const model = reactive<{ users?: Array<{ name?: string }> }>({})
    const wrapper = mount(Form, {
      props: { model },
      slots: {
        default: () =>
          h(
            FormList,
            { name: 'users', initialValue: [{ name: 'Alice' }, { name: 'Bob' }] },
            {
              default: (fields: Array<{ key: number; name: number }>) =>
                fields.map((field) =>
                  h(
                    FormItem,
                    { key: field.key, name: [field.name, 'name'], rules: { required: true, message: 'Missing' } },
                    () => h('input'),
                  ),
                ),
            },
          ),
      },
    })

    await nextTick()
    expect(model.users).toEqual([{ name: 'Alice' }, { name: 'Bob' }])
    expect(wrapper.findAll('input')).toHaveLength(2)

    model.users![0].name = ''
    await expect(getFormVm(wrapper).validateField('users.0.name')).resolves.toBe(false)
    expect(wrapper.find(itemNs.e('message')).text()).toBe('Missing')
  })

  it('supports add / remove / move operations', async () => {
    const model = reactive<{ items: any[] }>({ items: [] })

    let captured: { add: any; remove: any; move: any } | null = null
    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(
            Form,
            { model },
            {
              default: () =>
                h(
                  FormList,
                  { name: 'items' },
                  {
                    default: (
                      fields: Array<{ key: number; name: number }>,
                      op: { add: any; remove: any; move: any },
                    ) => {
                      captured = op
                      return fields.map((field) =>
                        h(FormItem, { key: field.key, name: [field.name, 'value'] }, () => h('input')),
                      )
                    },
                  },
                ),
            },
          )
      },
    })

    const wrapper = mount(Wrapper)
    await nextTick()
    expect(model.items).toEqual([])

    captured!.add({ value: 'a' })
    captured!.add({ value: 'b' })
    captured!.add({ value: 'c' })
    await nextTick()
    expect(model.items.map((item) => item.value)).toEqual(['a', 'b', 'c'])
    expect(wrapper.findAll('input')).toHaveLength(3)

    captured!.move(0, 2)
    await nextTick()
    expect(model.items.map((item) => item.value)).toEqual(['b', 'c', 'a'])

    captured!.remove(1)
    await nextTick()
    expect(model.items.map((item) => item.value)).toEqual(['b', 'a'])
    expect(wrapper.findAll('input')).toHaveLength(2)

    captured!.add({ value: 'x' }, 0)
    await nextTick()
    expect(model.items.map((item) => item.value)).toEqual(['x', 'b', 'a'])
  })

  it('preserves child key identity when moving rows', async () => {
    const model = reactive<{ rows: Array<{ value: string }> }>({ rows: [] })
    let captured: { add: any; move: any } | null = null
    const seenKeys: number[][] = []

    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(
            Form,
            { model },
            {
              default: () =>
                h(
                  FormList,
                  { name: 'rows' },
                  {
                    default: (
                      fields: Array<{ key: number; name: number }>,
                      op: { add: any; move: any; remove: any },
                    ) => {
                      captured = op
                      seenKeys.push(fields.map((f) => f.key))
                      return fields.map((field) => h(FormItem, { key: field.key, name: [field.name, 'value'] }))
                    },
                  },
                ),
            },
          )
      },
    })

    mount(Wrapper)
    await nextTick()

    captured!.add({ value: 'a' })
    await nextTick()
    captured!.add({ value: 'b' })
    await nextTick()
    const before = seenKeys[seenKeys.length - 1]
    captured!.move(0, 1)
    await nextTick()
    const after = seenKeys[seenKeys.length - 1]
    expect(after).toEqual([before[1], before[0]])
  })

  it('removes multiple indices at once', async () => {
    const model = reactive<{ rows: Array<{ value: string }> }>({ rows: [] })
    let captured: { add: any; remove: any } | null = null

    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(
            Form,
            { model },
            {
              default: () =>
                h(
                  FormList,
                  { name: 'rows' },
                  {
                    default: (
                      fields: Array<{ key: number; name: number }>,
                      op: { add: any; remove: any; move: any },
                    ) => {
                      captured = op
                      return fields.map((field) => h(FormItem, { key: field.key, name: [field.name, 'value'] }))
                    },
                  },
                ),
            },
          )
      },
    })

    mount(Wrapper)
    await nextTick()
    captured!.add({ value: 'a' })
    captured!.add({ value: 'b' })
    captured!.add({ value: 'c' })
    captured!.add({ value: 'd' })
    await nextTick()
    captured!.remove([0, 2])
    await nextTick()
    expect(model.rows.map((row) => row.value)).toEqual(['b', 'd'])
  })
})

describe('form preserve', () => {
  it('keeps unmounted field values when preserve is true (default)', async () => {
    const model = reactive<{ name: string; draft?: string }>({ name: '', draft: 'kept' })
    const Wrapper = defineComponent({
      props: { showDraft: { type: Boolean, default: true } },
      setup(props) {
        return () =>
          h(
            Form,
            { model },
            {
              default: () => [
                h(FormItem, { prop: 'name' }, () => h('input')),
                props.showDraft ? h(FormItem, { prop: 'draft' }, () => h('input')) : null,
              ],
            },
          )
      },
    })

    const wrapper = mount(Wrapper)
    await nextTick()
    await wrapper.setProps({ showDraft: false })
    await nextTick()
    expect(model.draft).toBe('kept')
  })

  it('clears unmounted field value when item-level preserve is false', async () => {
    const model = reactive<{ name: string; draft?: string }>({ name: '', draft: 'temp' })
    const Wrapper = defineComponent({
      props: { showDraft: { type: Boolean, default: true } },
      setup(props) {
        return () =>
          h(
            Form,
            { model },
            {
              default: () => [
                h(FormItem, { prop: 'name' }, () => h('input')),
                props.showDraft ? h(FormItem, { prop: 'draft', preserve: false }, () => h('input')) : null,
              ],
            },
          )
      },
    })

    const wrapper = mount(Wrapper)
    await nextTick()
    await wrapper.setProps({ showDraft: false })
    await nextTick()
    expect(model.draft).toBeUndefined()
  })

  it('respects form-level preserve=false when item does not override', async () => {
    const model = reactive<{ name: string; draft?: string }>({ name: '', draft: 'temp' })
    const Wrapper = defineComponent({
      props: { showDraft: { type: Boolean, default: true } },
      setup(props) {
        return () =>
          h(
            Form,
            { model, preserve: false },
            {
              default: () => [
                h(FormItem, { prop: 'name' }, () => h('input')),
                props.showDraft ? h(FormItem, { prop: 'draft' }, () => h('input')) : null,
              ],
            },
          )
      },
    })

    const wrapper = mount(Wrapper)
    await nextTick()
    await wrapper.setProps({ showDraft: false })
    await nextTick()
    expect(model.draft).toBeUndefined()
  })

  it('item-level preserve=true overrides form-level preserve=false', async () => {
    const model = reactive<{ name: string; draft?: string }>({ name: '', draft: 'kept' })
    const Wrapper = defineComponent({
      props: { showDraft: { type: Boolean, default: true } },
      setup(props) {
        return () =>
          h(
            Form,
            { model, preserve: false },
            {
              default: () => [
                h(FormItem, { prop: 'name' }, () => h('input')),
                props.showDraft ? h(FormItem, { prop: 'draft', preserve: true }, () => h('input')) : null,
              ],
            },
          )
      },
    })

    const wrapper = mount(Wrapper)
    await nextTick()
    await wrapper.setProps({ showDraft: false })
    await nextTick()
    expect(model.draft).toBe('kept')
  })
})

describe('form provider', () => {
  it('triggers onFormFinish when a named child form submits successfully', async () => {
    const finishHandler = vi.fn()
    const model = reactive({ name: 'Ready' })

    const wrapper = mount(FormProvider, {
      attrs: { onFormFinish: finishHandler },
      slots: {
        default: () =>
          h(
            Form,
            {
              name: 'profile',
              model,
              rules: { name: { required: true, message: 'Missing name' } },
            },
            { default: () => h(FormItem, { prop: 'name' }, () => h('input')) },
          ),
      },
    })

    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(finishHandler).toHaveBeenCalledTimes(1)
    expect(finishHandler).toHaveBeenCalledWith('profile', expect.objectContaining({ values: model }))
  })

  it('does not trigger formFinish on validation failure', async () => {
    const finishHandler = vi.fn()
    const model = reactive({ name: '' })

    const wrapper = mount(FormProvider, {
      attrs: { onFormFinish: finishHandler },
      slots: {
        default: () =>
          h(
            Form,
            {
              name: 'profile',
              model,
              rules: { name: { required: true, message: 'Missing name' } },
            },
            { default: () => h(FormItem, { prop: 'name' }, () => h('input')) },
          ),
      },
    })

    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(finishHandler).not.toHaveBeenCalled()
  })

  it('exposes the named form via the forms registry', async () => {
    const finishHandler = vi.fn()
    const modelA = reactive({ value: 'a' })
    const modelB = reactive({ value: 'b' })

    const wrapper = mount(FormProvider, {
      attrs: { onFormFinish: finishHandler },
      slots: {
        default: () => [
          h(
            Form,
            { name: 'one', model: modelA },
            {
              default: () => h(FormItem, { prop: 'value' }, () => h('input')),
            },
          ),
          h(
            Form,
            { name: 'two', model: modelB },
            {
              default: () => h(FormItem, { prop: 'value' }, () => h('input')),
            },
          ),
        ],
      },
    })

    await wrapper.findAll('form')[0].trigger('submit')
    await nextTick()

    const [, info] = finishHandler.mock.calls[0]
    expect(Object.keys(info.forms).sort()).toEqual(['one', 'two'])
    expect(info.forms.two.getFieldsValue()).toBe(modelB)
  })

  it('triggers onFormChange when a field reports a change', async () => {
    const changeHandler = vi.fn()
    const model = reactive({ name: '' })

    const wrapper = mount(FormProvider, {
      attrs: { onFormChange: changeHandler },
      slots: {
        default: () =>
          h(
            Form,
            { name: 'profile', model },
            {
              default: () => h(FormItem, { prop: 'name' }, () => h('input')),
            },
          ),
      },
    })

    await nextTick()
    model.name = 'Tom'
    await wrapper.find('input').trigger('change')
    await nextTick()
    expect(changeHandler).toHaveBeenCalled()
    const [name, info] = changeHandler.mock.calls.at(-1)!
    expect(name).toBe('profile')
    expect(info.changedFields[0].value).toBe('Tom')
  })
})

describe('form shouldUpdate', () => {
  it('shouldUpdate prop is accepted on FormItem', () => {
    const model = reactive({ a: '' })
    const wrapper = mount(
      defineComponent({
        setup: () => () => h(Form, { model }, () => h(FormItem, { prop: 'a', shouldUpdate: false }, () => h('input'))),
      }),
    )
    // FormItem 接受 shouldUpdate prop 不报错
    expect(wrapper.find(itemNs.b()).exists()).toBe(true)
  })

  it('shouldUpdate as function is accepted', () => {
    const model = reactive({ a: '' })
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model }, () => h(FormItem, { prop: 'a', shouldUpdate: () => true }, () => h('input'))),
      }),
    )
    expect(wrapper.find(itemNs.b()).exists()).toBe(true)
  })
})

describe('form validateDebounce', () => {
  it('delays validation by specified milliseconds', async () => {
    vi.useFakeTimers()
    const model = reactive({ name: '' })
    const rules: Record<string, any[]> = { name: [{ required: true, message: 'required', trigger: 'change' }] }
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model, rules }, () =>
            h(FormItem, { prop: 'name', validateDebounce: 200 }, () =>
              h('input', {
                value: model.name,
                onInput: (e: Event) => (model.name = (e.target as HTMLInputElement).value),
              }),
            ),
          ),
      }),
    )
    // 触发 change 校验
    await wrapper.find('input').trigger('change')
    await nextTick()
    // 校验还没执行（在 debounce 内）
    expect(wrapper.find(itemNs.b()).classes()).not.toContain('ccui-form-item--error')

    // 推过 debounce
    vi.advanceTimersByTime(200)
    await nextTick()
    await nextTick()
    expect(wrapper.find(itemNs.b()).classes()).toContain('ccui-form-item--error')
    vi.useRealTimers()
  })
})

describe('form normalize', () => {
  it('transforms value before validation via normalize prop', async () => {
    const model = reactive({ tag: '' })
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model }, () =>
            h(FormItem, { prop: 'tag', normalize: (v: string) => v.trim().toUpperCase() }, () =>
              h('input', {
                value: model.tag,
                onInput: (e: Event) => (model.tag = (e.target as HTMLInputElement).value),
              }),
            ),
          ),
      }),
    )
    model.tag = '  hello  '
    await wrapper.find('input').trigger('change')
    await nextTick()
    expect(model.tag).toBe('HELLO')
  })
})

// ───────────────────────────────────────────────────────────────
// L-1.6: Ant Design API alignment
// ───────────────────────────────────────────────────────────────

describe('L-1.6 labelCol / wrapperCol 栅格', () => {
  it('FormItem 显式 labelCol.span 计算为百分比 width', async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model: {} }, () => h(FormItem, { label: 'A', labelCol: { span: 6 } }, () => h('input'))),
      }),
    )
    const label = wrapper.find('.ccui-form-item__label')
    expect(label.attributes('style')).toContain('width: 25%') // 6/24 = 25%
  })

  it('FormItem 显式 wrapperCol 应用到 __content', async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model: {} }, () =>
            h(FormItem, { label: 'A', wrapperCol: { span: 18, offset: 2 } }, () => h('input')),
          ),
      }),
    )
    const content = wrapper.find('.ccui-form-item__content')
    expect(content.attributes('style')).toContain('width: 75%') // 18/24 = 75%
    expect(content.attributes('style')).toContain('margin-inline-start: 8.33333') // 2/24 ≈ 8.33%
  })

  it('Form 级 labelCol 默认应用到所有 FormItem', async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model: {}, labelCol: { span: 8 } }, () => h(FormItem, { label: 'A' }, () => h('input'))),
      }),
    )
    const label = wrapper.find('.ccui-form-item__label')
    expect(label.attributes('style')).toContain('width: 33.3333') // 8/24
  })

  it('FormItem labelCol 优先于 Form 级', async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model: {}, labelCol: { span: 8 } }, () =>
            h(FormItem, { label: 'A', labelCol: { span: 12 } }, () => h('input')),
          ),
      }),
    )
    const label = wrapper.find('.ccui-form-item__label')
    expect(label.attributes('style')).toContain('width: 50%') // 12/24
  })

  it('labelCol 优先于 labelWidth', async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model: {}, labelWidth: '200px', labelCol: { span: 6 } }, () =>
            h(FormItem, { label: 'A' }, () => h('input')),
          ),
      }),
    )
    const label = wrapper.find('.ccui-form-item__label')
    expect(label.attributes('style')).toContain('width: 25%')
    expect(label.attributes('style')).not.toContain('200px')
  })
})

describe('L-1.6 hasFeedback', () => {
  it('FormItem hasFeedback=true 校验成功时显示 ✓ 图标', async () => {
    const model = reactive({ name: '' })
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model }, () =>
            h(FormItem, { prop: 'name', hasFeedback: true, rules: { required: true } }, () =>
              h('input', {
                value: model.name,
                onInput: (e: Event) => (model.name = (e.target as HTMLInputElement).value),
              }),
            ),
          ),
      }),
    )
    model.name = 'ok'
    await wrapper.find('input').trigger('change')
    await nextTick()
    const feedback = wrapper.find('.ccui-form-item__feedback')
    expect(feedback.exists()).toBe(true)
    expect(feedback.classes()).toContain('ccui-form-item__feedback--success')
    expect(feedback.text()).toBe('✓')
  })

  it('校验失败时显示 ✕ 图标 + error 类', async () => {
    const model = reactive({ name: 'x' })
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model }, () =>
            h(FormItem, { prop: 'name', hasFeedback: true, rules: { min: 5, message: '太短' } }, () =>
              h('input', {
                value: model.name,
                onInput: (e: Event) => (model.name = (e.target as HTMLInputElement).value),
              }),
            ),
          ),
      }),
    )
    await wrapper.find('input').trigger('change')
    await nextTick()
    const feedback = wrapper.find('.ccui-form-item__feedback')
    expect(feedback.exists()).toBe(true)
    expect(feedback.classes()).toContain('ccui-form-item__feedback--error')
    expect(feedback.text()).toBe('✕')
  })

  it('Form 级 hasFeedback 默认应用到所有 FormItem', async () => {
    const model = reactive({ name: 'ok' })
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model, hasFeedback: true }, () =>
            h(FormItem, { prop: 'name', rules: { required: true } }, () =>
              h('input', {
                value: model.name,
                onInput: (e: Event) => (model.name = (e.target as HTMLInputElement).value),
              }),
            ),
          ),
      }),
    )
    await wrapper.find('input').trigger('change')
    await nextTick()
    expect(wrapper.find('.ccui-form-item__feedback').exists()).toBe(true)
  })
})

describe('L-1.6 warningOnly rule', () => {
  it('warningOnly rule 失败时 status=warning 但不阻塞 submit', async () => {
    const model = reactive({ name: 'x' })
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            Form,
            {
              model,
              ref: 'f',
            },
            () =>
              h(
                FormItem,
                {
                  prop: 'name',
                  rules: { min: 5, message: '太短', warningOnly: true },
                },
                () =>
                  h('input', {
                    value: model.name,
                    onInput: (e: Event) => (model.name = (e.target as HTMLInputElement).value),
                  }),
              ),
          ),
      }),
    )
    await wrapper.find('input').trigger('change')
    await nextTick()
    // 视觉降级到 warning
    const item = wrapper.find('.ccui-form-item')
    expect(item.classes()).toContain('ccui-form-item--warning')
    // 消息正常显示
    expect(wrapper.find('.ccui-form-item__message').text()).toBe('太短')
    // form-level submit 不被阻塞
    const formInstance = wrapper.vm.$refs.f as any
    const valid = await formInstance.validate()
    expect(valid).toBe(true)
  })
})

describe('L-1.6 rules 函数式', () => {
  it('rules 接受 (model) => Rule | Rule[]，基于当前 model 派生规则', async () => {
    const model = reactive({ pwd: '', confirm: 'abc' })
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model }, () =>
            h(
              FormItem,
              {
                prop: 'confirm',
                // 函数式 rules：要求 confirm === pwd
                rules: (m: any) => ({
                  validator: (_r: any, v: any) => (v === m.pwd ? true : new Error('两次密码不一致')),
                }),
              },
              () =>
                h('input', {
                  value: model.confirm,
                  onInput: (e: Event) => (model.confirm = (e.target as HTMLInputElement).value),
                }),
            ),
          ),
      }),
    )
    await wrapper.find('input').trigger('change')
    await nextTick()
    expect(wrapper.find('.ccui-form-item').classes()).toContain('ccui-form-item--error')
    expect(wrapper.find('.ccui-form-item__message').text()).toBe('两次密码不一致')
  })
})
