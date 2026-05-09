import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
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

function dispatchDrop(target: HTMLElement, files: File[]): void {
  const dropEvent = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent
  Object.defineProperty(dropEvent, 'dataTransfer', {
    value: { files: makeFileList(files) },
    configurable: true,
  })
  target.dispatchEvent(dropEvent)
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
})

describe('upload file selection', () => {
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
    dispatchDrop(wrapper.find(ns.e('drag')).element as HTMLElement, [makeFile('a.txt')])
    await nextTick()
    expect(wrapper.emitted('update:fileList')).toBeUndefined()
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
})

describe('upload customRequest and action', () => {
  it('calls customRequest for each accepted file when provided', async () => {
    const onProgress = (_p: number) => {}
    const onSuccess = (_r?: unknown) => {}
    const onError = (_e: Error) => {}
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
