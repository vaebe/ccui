import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { uploadProps } from '../src/upload-types'
import { Upload } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('upload', true)
const wrappers: VueWrapper[] = []

function makeFile(name: string, size = 100, type = 'text/plain'): File {
  const content = 'a'.repeat(size)
  return new File([content], name, { type })
}

function makeFileList(files: File[]): FileList {
  const list: Record<string | number, unknown> = {
    length: files.length,
    item: (i: number) => files[i] ?? null,
    [Symbol.iterator]: function* () {
      for (const f of files) yield f
    },
  }
  files.forEach((f, i) => {
    list[i] = f
  })
  return list as unknown as FileList
}

function mockSelectFiles(wrapper: VueWrapper, files: File[]): void {
  const input = wrapper.find('input[type="file"]').element as HTMLInputElement
  Object.defineProperty(input, 'files', { value: makeFileList(files), configurable: true })
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

/** 构造可检查 defaultPrevented 的文件拖放事件。 */
function dispatchDrop(target: HTMLElement, files: File[]): DragEvent {
  const dropEvent = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent
  Object.defineProperty(dropEvent, 'dataTransfer', {
    value: { files: makeFileList(files) },
    configurable: true,
  })
  target.dispatchEvent(dropEvent)
  return dropEvent
}

function mountU(props: Record<string, unknown> = {}, slots?: Record<string, unknown>) {
  const wrapper = mount(Upload, {
    props,
    slots: slots as never,
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

describe('upload trigger rendering', () => {
  it('renders default button trigger with triggerText', () => {
    const wrapper = mountU({ triggerText: '选择文件' })
    expect(wrapper.find(ns.e('trigger')).text()).toBe('选择文件')
    expect(wrapper.find(ns.e('drag')).exists()).toBe(false)
  })

  it('renders drag area when drag=true', () => {
    const wrapper = mountU({ drag: true, dragText: '拖到这' })
    expect(wrapper.find(ns.e('drag')).exists()).toBe(true)
    expect(wrapper.find(ns.e('drag')).text()).toContain('拖到这')
  })

  it('renders custom trigger via default slot', () => {
    const wrapper = mountU({}, { default: () => h('a', { class: 'my-link' }, 'pick') })
    expect(wrapper.find('.my-link').text()).toBe('pick')
  })

  it('disabled state renders is-disabled class on trigger and disables input', () => {
    const wrapper = mountU({ disabled: true })
    expect(wrapper.find(ns.e('trigger')).classes()).toContain('is-disabled')
    expect((wrapper.find('input[type="file"]').element as HTMLInputElement).disabled).toBe(true)
  })

  it('passes accept and multiple attributes to native input', () => {
    const wrapper = mountU({ accept: 'image/*', multiple: true })
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    expect(input.accept).toBe('image/*')
    expect(input.multiple).toBe(true)
  })

  it('passes name and capture to the native file input', () => {
    const wrapper = mountU({ name: 'attachment', capture: 'environment' })
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('name')).toBe('attachment')
    expect(input.attributes('capture')).toBe('environment')
  })

  it('opens the picker with Enter and Space in drag mode', async () => {
    const wrapper = mountU({ drag: true })
    const click = vi.spyOn(wrapper.find('input[type="file"]').element as HTMLInputElement, 'click')
    const drag = wrapper.find(ns.e('drag'))

    await drag.trigger('keydown', { key: 'Enter' })
    await drag.trigger('keydown', { key: ' ' })

    expect(click).toHaveBeenCalledTimes(2)
  })
})

describe('upload file selection', () => {
  it('limits defaultStatus to states valid for newly selected files', () => {
    expect(uploadProps.defaultStatus.validator('uploading')).toBe(true)
    expect(uploadProps.defaultStatus.validator('done')).toBe(true)
    expect(uploadProps.defaultStatus.validator('error')).toBe(true)
    expect(uploadProps.defaultStatus.validator('removed' as never)).toBe(false)
  })

  it('emits update:fileList and change after picking a file', async () => {
    const wrapper = mountU()
    mockSelectFiles(wrapper, [makeFile('a.txt')])
    await nextTick()
    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{ name: string }>
    expect(list).toHaveLength(1)
    expect(list[0].name).toBe('a.txt')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('renders fileList items after selection', async () => {
    const wrapper = mountU()
    mockSelectFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    await nextTick()
    const items = wrapper.findAll(ns.e('item'))
    expect(items).toHaveLength(2)
    expect(items[0].text()).toContain('a.txt')
    expect(items[1].text()).toContain('b.txt')
  })

  it('rejects files exceeding maxSize and emits reject', async () => {
    const wrapper = mountU({ maxSize: 50 })
    mockSelectFiles(wrapper, [makeFile('big.txt', 200), makeFile('ok.txt', 30)])
    await nextTick()
    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{ name: string }>
    expect(list.map((f) => f.name)).toEqual(['ok.txt'])
    const reject = wrapper.emitted('reject')!
    expect(reject[0][0]).toMatchObject({ name: 'big.txt' })
    expect(reject[0][1]).toBe('maxSize')
  })

  it('rejects files exceeding maxCount once limit is reached', async () => {
    const wrapper = mountU({ maxCount: 2 })
    mockSelectFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt'), makeFile('c.txt')])
    await nextTick()
    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{ name: string }>
    expect(list.map((f) => f.name)).toEqual(['a.txt', 'b.txt'])
    const reject = wrapper.emitted('reject')!
    expect(reject).toHaveLength(1)
    expect(reject[0][1]).toBe('maxCount')
  })

  it('beforeUpload returning false skips that file', async () => {
    const wrapper = mountU({
      beforeUpload: (f: File) => f.name !== 'skip.txt',
    })
    mockSelectFiles(wrapper, [makeFile('keep.txt'), makeFile('skip.txt')])
    await nextTick()
    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{ name: string }>
    expect(list.map((f) => f.name)).toEqual(['keep.txt'])
    expect(wrapper.emitted('reject')!.length).toBe(1)
  })

  it('clears input value after selection so same file can be picked twice', async () => {
    const wrapper = mountU()
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    mockSelectFiles(wrapper, [makeFile('a.txt')])
    await nextTick()
    expect(input.value).toBe('')
  })

  it('respects defaultStatus when adding files', async () => {
    const wrapper = mountU({ defaultStatus: 'uploading' })
    mockSelectFiles(wrapper, [makeFile('a.txt')])
    await nextTick()
    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{ status: string; percent: number }>
    expect(list[0].status).toBe('uploading')
    expect(list[0].percent).toBe(0)
  })
})

describe('upload remove', () => {
  it('clicking item × removes the file and emits remove + change', async () => {
    const wrapper = mountU()
    mockSelectFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    await nextTick()
    const removes = wrapper.findAll(ns.e('item-remove'))
    expect(removes).toHaveLength(2)
    await removes[0].trigger('click')
    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{ name: string }>
    expect(list.map((f) => f.name)).toEqual(['b.txt'])
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect((wrapper.emitted('remove')![0][0] as { name: string }).name).toBe('a.txt')
  })

  it('hides × button when disabled', async () => {
    const wrapper = mountU({ defaultFileList: [{ uid: '1', name: 'pre.txt', status: 'done' }], disabled: true })
    await nextTick()
    expect(wrapper.find(ns.e('item-remove')).exists()).toBe(false)
  })
})

describe('upload list rendering', () => {
  it('hides list when showUploadList=false', async () => {
    const wrapper = mountU({ showUploadList: false })
    mockSelectFiles(wrapper, [makeFile('a.txt')])
    await nextTick()
    expect(wrapper.find(ns.e('list')).exists()).toBe(false)
  })

  it('renders status icons differently per status', () => {
    const wrapper = mountU({
      defaultFileList: [
        { uid: '1', name: 'a.txt', status: 'done' },
        { uid: '2', name: 'b.txt', status: 'uploading', percent: 30 },
        { uid: '3', name: 'c.txt', status: 'error' },
      ],
    })
    const items = wrapper.findAll(ns.e('item'))
    expect(items[0].classes()).toContain('ccui-upload__item--status-done')
    expect(items[1].classes()).toContain('ccui-upload__item--status-uploading')
    expect(items[1].text()).toContain('30%')
    expect(items[2].classes()).toContain('ccui-upload__item--status-error')
  })

  it('formats file size in KB / MB', () => {
    const wrapper = mountU({
      defaultFileList: [
        { uid: '1', name: 'small.txt', size: 500, status: 'done' },
        { uid: '2', name: 'medium.txt', size: 2048, status: 'done' },
        { uid: '3', name: 'big.txt', size: 1024 * 1024 * 3, status: 'done' },
      ],
    })
    const sizes = wrapper.findAll(ns.e('item-size')).map((n) => n.text())
    expect(sizes).toEqual(['500 B', '2.0 KB', '3.0 MB'])
  })

  it('renders custom item via slot', async () => {
    const wrapper = mountU(
      {},
      {
        itemRender: ({ item }: { item: { name: string } }) => h('li', { class: 'custom-item' }, `★${item.name}`),
      },
    )
    mockSelectFiles(wrapper, [makeFile('a.txt')])
    await nextTick()
    expect(wrapper.find('.custom-item').text()).toBe('★a.txt')
  })
})

describe('upload drag and drop', () => {
  it('toggles dragover class on dragenter / dragleave', async () => {
    const wrapper = mountU({ drag: true })
    const drop = wrapper.find(ns.e('drag'))
    await drop.trigger('dragenter')
    expect(drop.classes()).toContain('is-dragover')
    await drop.trigger('dragleave')
    expect(drop.classes()).not.toContain('is-dragover')
  })

  it('drop event reads files from dataTransfer', async () => {
    const wrapper = mountU({ drag: true, multiple: true })
    dispatchDrop(wrapper.find(ns.e('drag')).element as HTMLElement, [makeFile('a.txt'), makeFile('b.txt')])
    await nextTick()
    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{ name: string }>
    expect(list.map((f) => f.name)).toEqual(['a.txt', 'b.txt'])
    expect(wrapper.emitted('drop')).toHaveLength(1)
  })

  it('drop on disabled drag area does not pick files', async () => {
    const wrapper = mountU({ drag: true, disabled: true })
    const event = dispatchDrop(wrapper.find(ns.e('drag')).element as HTMLElement, [makeFile('a.txt')])
    await nextTick()
    expect(wrapper.emitted('update:fileList')).toBeUndefined()
    expect(event.defaultPrevented).toBe(true)
  })

  it('applies accept and multiple restrictions to dropped files', async () => {
    const wrapper = mountU({ drag: true, accept: '.png' })
    dispatchDrop(wrapper.find(ns.e('drag')).element as HTMLElement, [
      makeFile('first.png', 10, 'image/png'),
      makeFile('second.png', 10, 'image/png'),
      makeFile('notes.txt'),
    ])
    await nextTick()
    await nextTick()

    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{ name: string }>
    expect(list.map((file) => file.name)).toEqual(['first.png'])
    expect(wrapper.emitted('reject')!.map((event) => event[1])).toEqual(['multiple', 'accept'])
  })
})

describe('upload v-model:fileList', () => {
  it('controlled mode reflects parent fileList and parent receives mutations', async () => {
    const list = ref<Array<{ uid: string; name: string; status: 'done' | 'uploading' | 'error' | 'removed' }>>([
      { uid: '1', name: 'preset.txt', status: 'done' },
    ])
    const Host = defineComponent({
      setup() {
        return () =>
          h(Upload as never, {
            fileList: list.value,
            'onUpdate:fileList': (next: typeof list.value) => (list.value = next),
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    expect(wrapper.findAll(ns.e('item'))).toHaveLength(1)
    mockSelectFiles(wrapper as never, [makeFile('new.txt')])
    await nextTick()
    expect(list.value.map((f) => f.name)).toEqual(['preset.txt', 'new.txt'])
    // 删除现有
    await wrapper.findAll(ns.e('item-remove'))[0].trigger('click')
    expect(list.value.map((f) => f.name)).toEqual(['new.txt'])
  })

  it('preserves a newly selected controlled file through synchronous request callbacks', async () => {
    const list = ref<
      Array<{
        uid: string
        name: string
        status?: 'done' | 'uploading' | 'error' | 'removed'
        percent?: number
        response?: unknown
      }>
    >([])
    const emittedLists: Array<typeof list.value> = []
    const Host = defineComponent({
      setup() {
        return () =>
          h(Upload as never, {
            fileList: list.value,
            customRequest: (options: any) => {
              options.onProgress(40)
              options.onSuccess({ requestId: 'controlled-success' })
            },
            'onUpdate:fileList': (next: typeof list.value) => {
              emittedLists.push(next)
              list.value = next
            },
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)

    mockSelectFiles(wrapper as never, [makeFile('controlled.txt')])
    await nextTick()

    expect(emittedLists.every((files) => files.length === 1)).toBe(true)
    expect(list.value).toHaveLength(1)
    expect(list.value[0]).toMatchObject({
      name: 'controlled.txt',
      status: 'done',
      percent: 100,
      response: { requestId: 'controlled-success' },
    })
    expect(wrapper.find(ns.e('item')).text()).toContain('controlled.txt')
    expect(wrapper.find(ns.e('item')).classes()).toContain('ccui-upload__item--status-done')
  })

  it('aborts an active request when a controlled parent removes its file', async () => {
    const abort = vi.fn()
    const list = ref<Array<{ uid: string; name: string; status?: string }>>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(Upload as never, {
            fileList: list.value,
            customRequest: () => ({ abort }),
            'onUpdate:fileList': (next: typeof list.value) => (list.value = next),
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    mockSelectFiles(wrapper as never, [makeFile('controlled-active.txt')])
    await nextTick()
    await nextTick()

    list.value = []
    await nextTick()

    expect(abort).toHaveBeenCalledOnce()
  })

  it('detects in-place controlled removal and preserves the last list when control is released', async () => {
    const abort = vi.fn()
    const controlled = ref(true)
    const list = ref<Array<{ uid: string; name: string; status?: string }>>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(Upload as never, {
            fileList: controlled.value ? list.value : undefined,
            customRequest: () => ({ abort }),
            'onUpdate:fileList': (next: typeof list.value) => (list.value = next),
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    mockSelectFiles(wrapper as never, [makeFile('mutable.txt')])
    await nextTick()
    await nextTick()

    controlled.value = false
    await nextTick()
    expect(wrapper.find(ns.e('item')).text()).toContain('mutable.txt')

    controlled.value = true
    await nextTick()
    list.value.splice(0, 1)
    await nextTick()
    expect(abort).toHaveBeenCalledOnce()
  })

  it('still aborts a late handle when a controlled parent removes and re-adds the same uid', async () => {
    const abort = vi.fn()
    let resolveHandle!: (handle: { abort: () => void }) => void
    const list = ref<Array<{ uid: string; name: string; status?: string }>>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(Upload as never, {
            fileList: list.value,
            customRequest: () => new Promise<{ abort: () => void }>((resolve) => (resolveHandle = resolve)),
            'onUpdate:fileList': (next: typeof list.value) => (list.value = next),
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    mockSelectFiles(wrapper as never, [makeFile('aba.txt')])
    await nextTick()
    const uploaded = list.value[0]

    list.value = []
    await nextTick()
    list.value = [uploaded]
    await nextTick()
    resolveHandle({ abort })
    await nextTick()

    expect(abort).toHaveBeenCalledOnce()
  })

  it('uses the optimistic controlled snapshot when the parent delays write-back', async () => {
    const wrapper = mountU({ fileList: [], maxCount: 1 })
    mockSelectFiles(wrapper, [makeFile('first-controlled.txt')])
    mockSelectFiles(wrapper, [makeFile('second-controlled.txt')])
    await nextTick()

    const emittedLists = wrapper.emitted('update:fileList') as Array<[Array<{ name: string }>]> | undefined
    expect(emittedLists).toHaveLength(1)
    expect(emittedLists![0][0].map((file) => file.name)).toEqual(['first-controlled.txt'])
    expect(wrapper.emitted('reject')!.slice(-1)[0][1]).toBe('maxCount')
  })
})

describe('upload customRequest and action', () => {
  it('calls customRequest for each accepted file when provided', async () => {
    const requests: Array<{ file: File }> = []
    const wrapper = mountU({
      customRequest: (opts: any) => {
        requests.push({ file: opts.file })
        opts.onSuccess('ok')
      },
    })
    mockSelectFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    await nextTick()
    expect(requests).toHaveLength(2)
    expect(requests[0].file.name).toBe('a.txt')
  })

  it('sets status to uploading when customRequest is provided', async () => {
    const wrapper = mountU({
      customRequest: () => {},
    })
    mockSelectFiles(wrapper, [makeFile('slow.txt')])
    await nextTick()
    // customRequest 没调 onSuccess，所以 status 应该还是 uploading
    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as any[]
    expect(list[0].status).toBe('uploading')
  })

  it('aborts an active request when its file is removed', async () => {
    const abort = vi.fn()
    const wrapper = mountU({ customRequest: () => ({ abort }) })
    mockSelectFiles(wrapper, [makeFile('slow.txt')])
    await nextTick()

    await wrapper.find(ns.e('item-remove')).trigger('click')
    expect(abort).toHaveBeenCalledOnce()
  })

  it('aborts all active requests when unmounted', async () => {
    const aborts = [vi.fn(), vi.fn()]
    let requestIndex = 0
    const wrapper = mountU({ customRequest: () => ({ abort: aborts[requestIndex++] }) })
    mockSelectFiles(wrapper, [makeFile('one.txt'), makeFile('two.txt')])
    await nextTick()

    wrapper.unmount()
    expect(aborts[0]).toHaveBeenCalledOnce()
    expect(aborts[1]).toHaveBeenCalledOnce()
  })

  it('aborts an async request handle that resolves after removal', async () => {
    const abort = vi.fn()
    let resolveHandle!: (handle: { abort: () => void }) => void
    const wrapper = mountU({
      customRequest: () => new Promise<{ abort: () => void }>((resolve) => (resolveHandle = resolve)),
    })
    mockSelectFiles(wrapper, [makeFile('late-handle.txt')])
    await nextTick()

    await wrapper.find(ns.e('item-remove')).trigger('click')
    resolveHandle({ abort })
    await nextTick()

    expect(abort).toHaveBeenCalledOnce()
  })

  it.each([
    [
      'synchronous throw',
      () => {
        throw new Error('sync failed')
      },
    ],
    ['rejected promise', () => Promise.reject(new Error('async failed'))],
  ])('converts a %s from customRequest into error state', async (_caseName, customRequest) => {
    const wrapper = mountU({ customRequest })
    mockSelectFiles(wrapper, [makeFile('failure.txt')])
    await nextTick()
    await nextTick()

    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{
      status: string
      response: string
    }>
    expect(list[0].status).toBe('error')
    expect(list[0].response).toContain('failed')
  })

  it('clamps invalid progress values before publishing them', async () => {
    const values: number[] = []
    const wrapper = mountU({
      customRequest: (options: any) => {
        options.onProgress(-20)
        options.onProgress(Number.POSITIVE_INFINITY)
        options.onProgress(150)
      },
      'onUpdate:fileList': (list: Array<{ percent: number }>) => values.push(list[0].percent),
    })
    mockSelectFiles(wrapper, [makeFile('progress.txt')])
    await nextTick()

    expect(values.slice(-3)).toEqual([0, 0, 99])
  })
})

describe('upload async beforeUpload', () => {
  it('supports Promise-returning beforeUpload', async () => {
    const wrapper = mountU({
      beforeUpload: (file: File) => Promise.resolve(file.name !== 'bad.txt'),
    })
    mockSelectFiles(wrapper, [makeFile('good.txt'), makeFile('bad.txt')])
    // async beforeUpload 需要额外 await
    await nextTick()
    await nextTick()
    const emitted = wrapper.emitted('update:fileList')
    expect(emitted).toBeDefined()
    const list = emitted!.slice(-1)[0][0] as any[]
    expect(list.map((f: any) => f.name)).toEqual(['good.txt'])
    expect(wrapper.emitted('reject')!.length).toBe(1)
  })

  it('turns a rejected beforeUpload promise into a beforeUpload rejection', async () => {
    const wrapper = mountU({ beforeUpload: () => Promise.reject(new Error('filter failed')) })
    mockSelectFiles(wrapper, [makeFile('blocked.txt')])
    await nextTick()
    await nextTick()

    expect(wrapper.emitted('update:fileList')).toBeUndefined()
    expect(wrapper.emitted('reject')).toHaveLength(1)
    expect(wrapper.emitted('reject')![0][1]).toBe('beforeUpload')
  })

  it('does not commit a pending selection after disable or unmount', async () => {
    let resolveFilter!: (value: boolean) => void
    const wrapper = mountU({
      beforeUpload: () => new Promise<boolean>((resolve) => (resolveFilter = resolve)),
    })
    mockSelectFiles(wrapper, [makeFile('pending.txt')])
    await nextTick()

    await wrapper.setProps({ disabled: true })
    resolveFilter(true)
    await nextTick()
    expect(wrapper.emitted('update:fileList')).toBeUndefined()

    const unmounted = mountU({
      beforeUpload: () => Promise.resolve(true),
    })
    mockSelectFiles(unmounted, [makeFile('unmounted.txt')])
    unmounted.unmount()
    await nextTick()
    expect(unmounted.emitted('update:fileList')).toBeUndefined()
  })

  it('serializes overlapping selections so maxCount uses the latest list', async () => {
    let releaseFirst!: () => void
    let callCount = 0
    const wrapper = mountU({
      maxCount: 1,
      beforeUpload: () => {
        callCount += 1
        return callCount === 1 ? new Promise<boolean>((resolve) => (releaseFirst = () => resolve(true))) : true
      },
    })
    mockSelectFiles(wrapper, [makeFile('first.txt')])
    mockSelectFiles(wrapper, [makeFile('second.txt')])
    await nextTick()
    releaseFirst()
    await nextTick()
    await nextTick()

    const list = wrapper.emitted('update:fileList')!.slice(-1)[0][0] as Array<{ name: string }>
    expect(list.map((file) => file.name)).toEqual(['first.txt'])
    expect(wrapper.emitted('reject')!.slice(-1)[0][1]).toBe('maxCount')
  })

  it('rechecks maxCount after beforeUpload when the controlled list grows', async () => {
    let release!: () => void
    const list = ref<Array<{ uid: string; name: string; status?: string }>>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(Upload as never, {
            fileList: list.value,
            maxCount: 1,
            beforeUpload: () => new Promise<boolean>((resolve) => (release = () => resolve(true))),
            'onUpdate:fileList': (next: typeof list.value) => (list.value = next),
          })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    wrappers.push(wrapper)
    mockSelectFiles(wrapper as never, [makeFile('pending-limit.txt')])
    await nextTick()

    list.value = [{ uid: 'external', name: 'external.txt', status: 'done' }]
    await nextTick()
    release()
    await nextTick()
    await nextTick()

    expect(list.value.map((file) => file.name)).toEqual(['external.txt'])
    expect(wrapper.find(ns.e('item')).text()).toContain('external.txt')
    expect(wrapper.findComponent(Upload).emitted('reject')!.slice(-1)[0][1]).toBe('maxCount')
  })
})

describe('upload form and accessibility integration', () => {
  it('validates on structural changes and when focus leaves the component', async () => {
    const validate = vi.fn(() => Promise.resolve(true))
    const wrapper = mount(Upload, {
      attachTo: document.body,
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validate,
            validateStatus: ref(''),
            isInsideForm: true,
          },
        },
      },
    })
    wrappers.push(wrapper)

    mockSelectFiles(wrapper, [makeFile('form.txt')])
    await nextTick()
    expect(validate).toHaveBeenCalledWith('change')

    await wrapper.find(ns.e('trigger')).trigger('focusout', { relatedTarget: null })
    expect(validate).toHaveBeenCalledWith('blur')
  })

  it('uses keyboard-operable preview controls and unique remove names', () => {
    const wrapper = mountU({
      defaultFileList: [
        { uid: '1', name: 'first.txt', status: 'uploading', percent: 25 },
        { uid: '2', name: 'second.txt', status: 'done' },
      ],
    })

    expect(wrapper.findAll(ns.e('item-name')).every((node) => node.element.tagName === 'BUTTON')).toBe(true)
    expect(wrapper.findAll(ns.e('item-remove')).map((node) => node.attributes('aria-label'))).toEqual([
      '删除 first.txt',
      '删除 second.txt',
    ])
    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('25')
    expect(wrapper.findAll(ns.e('item'))[0].attributes('aria-busy')).toBe('true')
  })

  it('normalizes externally supplied progress before rendering text and ARIA', () => {
    const wrapper = mountU({
      defaultFileList: [
        { uid: '1', name: 'negative.txt', status: 'uploading', percent: -1 },
        { uid: '2', name: 'infinite.txt', status: 'uploading', percent: Number.POSITIVE_INFINITY },
        { uid: '3', name: 'overflow.txt', status: 'uploading', percent: 150 },
      ],
    })

    const progress = wrapper.findAll('[role="progressbar"]')
    expect(progress.map((node) => node.attributes('aria-valuenow'))).toEqual(['0', '0', '100'])
    expect(progress.map((node) => node.text())).toEqual(['0%', '0%', '100%'])
  })
})

describe('upload listType=picture', () => {
  it('renders thumbnail when listType=picture and item has thumbUrl', () => {
    const wrapper = mountU({
      listType: 'picture',
      defaultFileList: [{ uid: '1', name: 'photo.jpg', status: 'done', thumbUrl: 'data:image/png;base64,X' }],
    })
    expect(wrapper.find(ns.e('item-thumb')).exists()).toBe(true)
    expect(wrapper.find(ns.e('item-thumb')).find('img').attributes('src')).toBe('data:image/png;base64,X')
  })

  it('falls back to icon when listType=picture but no thumbUrl/url', () => {
    const wrapper = mountU({
      listType: 'picture',
      defaultFileList: [{ uid: '1', name: 'doc.pdf', status: 'done' }],
    })
    expect(wrapper.find(ns.e('item-thumb')).exists()).toBe(false)
    expect(wrapper.find(ns.e('item-icon')).exists()).toBe(true)
  })
})

describe('upload preview event', () => {
  it('emits preview when clicking file name', async () => {
    const wrapper = mountU({
      defaultFileList: [{ uid: '1', name: 'doc.txt', status: 'done' }],
    })
    await wrapper.find(ns.e('item-name')).trigger('click')
    expect(wrapper.emitted('preview')).toBeDefined()
    expect((wrapper.emitted('preview')![0][0] as any).name).toBe('doc.txt')
  })
})

describe('upload M-B9 listType=picture-card', () => {
  it('list 添加 picture-card 修饰', () => {
    const wrapper = mountU({
      listType: 'picture-card',
      defaultFileList: [{ uid: '1', name: 'a.png', status: 'done', url: 'x.png' }],
    })
    expect(wrapper.find(ns.em('list', 'picture-card')).exists()).toBe(true)
  })

  it('每个 item 渲染 card-inner 容器与 card-name', () => {
    const wrapper = mountU({
      listType: 'picture-card',
      defaultFileList: [{ uid: '1', name: 'photo.jpg', status: 'done', url: 'photo.jpg' }],
    })
    expect(wrapper.find(ns.e('item-card-inner')).exists()).toBe(true)
    expect(wrapper.find(ns.e('item-card-name')).text()).toBe('photo.jpg')
  })

  it('有 url 时渲染缩略图 img', () => {
    const wrapper = mountU({
      listType: 'picture-card',
      defaultFileList: [{ uid: '1', name: 'photo.jpg', status: 'done', url: 'photo.jpg' }],
    })
    const img = wrapper.find(ns.e('item-card-thumb'))
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('photo.jpg')
  })

  it('无 url 时渲染 card-icon 占位', () => {
    const wrapper = mountU({
      listType: 'picture-card',
      defaultFileList: [{ uid: '1', name: 'doc.txt', status: 'done' }],
    })
    expect(wrapper.find(ns.e('item-card-icon')).exists()).toBe(true)
    expect(wrapper.find(ns.e('item-card-thumb')).exists()).toBe(false)
  })

  it('uploading 状态显示百分比', () => {
    const wrapper = mountU({
      listType: 'picture-card',
      defaultFileList: [{ uid: '1', name: 'a.png', status: 'uploading', percent: 42, url: 'a.png' }],
    })
    expect(wrapper.find(ns.e('item-card-percent')).text()).toBe('42%')
  })

  it('点击缩略图 emit preview', async () => {
    const wrapper = mountU({
      listType: 'picture-card',
      defaultFileList: [{ uid: '1', name: 'a.png', status: 'done', url: 'a.png' }],
    })
    await wrapper.find(ns.e('item-card-thumb')).trigger('click')
    expect(wrapper.emitted('preview')).toBeDefined()
  })

  it('点击删除按钮触发 remove', async () => {
    const wrapper = mountU({
      listType: 'picture-card',
      defaultFileList: [{ uid: '1', name: 'a.png', status: 'done', url: 'a.png' }],
    })
    await wrapper.find(ns.e('item-card-remove')).trigger('click')
    expect(wrapper.emitted('remove')).toBeDefined()
  })
})

describe('upload XL-4 ARIA', () => {
  it('drag 触发区加 role="button" + aria-label', () => {
    const wrapper = mountU({ drag: true, dragText: '拖到这' })
    const drag = wrapper.find(ns.e('drag'))
    expect(drag.attributes('role')).toBe('button')
    expect(drag.attributes('aria-label')).toBe('拖到这')
  })

  it('文件列表项加 role="listitem" + aria-label', () => {
    const wrapper = mountU({
      defaultFileList: [{ uid: '1', name: 'a.png', status: 'done' }],
    })
    const item = wrapper.find(ns.e('item'))
    expect(item.attributes('role')).toBe('listitem')
    expect(item.attributes('aria-label')).toBe('a.png')
  })
})
