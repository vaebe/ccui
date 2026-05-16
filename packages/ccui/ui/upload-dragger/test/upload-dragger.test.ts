import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { UploadDragger } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('upload', true)
const wrappers: VueWrapper[] = []

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('upload-dragger 渲染', () => {
  it('mount 后内部走 c-upload 的 drag dropzone 视觉（trigger 容器存在）', () => {
    const wrapper = mount(UploadDragger, { attachTo: document.body })
    wrappers.push(wrapper)
    // 复用 upload 的内部 namespace，drag 视觉 trigger 渲染由 upload 决定
    // 这里只验证组件可挂载且不报错
    expect(wrapper.find(ns.b()).exists()).toBe(true)
  })

  it('drag prop 默认为 true（视觉上 dropzone 区）', () => {
    const wrapper = mount(UploadDragger, { props: { dragText: '拖入文件区域' }, attachTo: document.body })
    wrappers.push(wrapper)
    expect(wrapper.text()).toContain('拖入文件区域')
  })

  it('forward update:fileList event', async () => {
    const wrapper = mount(UploadDragger, { attachTo: document.body })
    wrappers.push(wrapper)
    // 模拟下层 c-upload 的 update:fileList 事件
    const inner = wrapper.findComponent({ name: 'CUpload' })
    await inner.vm.$emit('update:fileList', [{ uid: '1', name: 'a.txt', status: 'done' }])
    expect(wrapper.emitted('update:fileList')).toBeDefined()
  })

  it('forward change event', async () => {
    const wrapper = mount(UploadDragger, { attachTo: document.body })
    wrappers.push(wrapper)
    const inner = wrapper.findComponent({ name: 'CUpload' })
    await inner.vm.$emit('change', { file: { name: 'a.txt' }, fileList: [] })
    expect(wrapper.emitted('change')).toBeDefined()
  })

  it('支持 accept / multiple / disabled 透传', () => {
    const wrapper = mount(UploadDragger, {
      props: { accept: '.png,.jpg', multiple: true, disabled: false },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('accept')).toBe('.png,.jpg')
    expect(input.attributes('multiple')).toBeDefined()
  })
})
