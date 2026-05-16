import type { VNode } from 'vue'
import type { UploadFile, UploadProps } from './upload-types'
import { computed, defineComponent, h, ref, shallowRef } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { fileToUploadFile, uploadProps } from './upload-types'
import './upload.scss'

function formatSize(bytes?: number): string {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default defineComponent({
  name: 'CUpload',
  props: uploadProps,
  emits: ['update:fileList', 'change', 'remove', 'reject', 'drop', 'preview', 'download'],
  setup(props: UploadProps, { emit, slots }) {
    const ns = useNamespace('upload')
    const inputRef = ref<HTMLInputElement | null>(null)
    const dragOver = shallowRef(false)
    const innerList = shallowRef<UploadFile[]>(props.defaultFileList ?? [])

    const isControlled = computed(() => props.fileList !== undefined)
    const currentList = computed<UploadFile[]>(() => {
      return isControlled.value ? (props.fileList as UploadFile[]) : innerList.value
    })

    function commitList(next: UploadFile[]): void {
      if (!isControlled.value) {
        innerList.value = next
      }
      emit('update:fileList', next)
    }

    function updateItemInList(uid: string, patch: Partial<UploadFile>): void {
      const next = currentList.value.map((item) => (item.uid === uid ? { ...item, ...patch } : item))
      commitList(next)
    }

    function doUpload(item: UploadFile): void {
      if (!item.raw) return
      const upload = props.customRequest || (props.action ? defaultRequest : null)
      if (!upload) return

      updateItemInList(item.uid, { status: 'uploading', percent: 0 })

      upload({
        file: item.raw,
        onProgress: (percent: number) => {
          updateItemInList(item.uid, { percent: Math.min(99, percent) })
        },
        onSuccess: (response?: unknown) => {
          updateItemInList(item.uid, { status: 'done', percent: 100, response })
        },
        onError: (error: Error) => {
          updateItemInList(item.uid, { status: 'error', response: error.message })
        },
      })
    }

    function defaultRequest(options: {
      file: File
      onProgress: (p: number) => void
      onSuccess: (r?: unknown) => void
      onError: (e: Error) => void
    }) {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', props.action)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) options.onProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            options.onSuccess(JSON.parse(xhr.responseText))
          } catch {
            options.onSuccess(xhr.responseText)
          }
        } else {
          options.onError(new Error(`Upload failed: ${xhr.status}`))
        }
      }
      xhr.onerror = () => options.onError(new Error('Network error'))
      const formData = new FormData()
      formData.append('file', options.file)
      xhr.send(formData)
      return { abort: () => xhr.abort() }
    }

    async function pickFiles(rawFiles: FileList | File[]): Promise<void> {
      const files = Array.from(rawFiles)
      if (files.length === 0) return

      const accepted: File[] = []
      const rejected: Array<{ file: File; reason: 'maxSize' | 'maxCount' | 'beforeUpload' }> = []

      const remainingSlots = props.maxCount > 0 ? Math.max(0, props.maxCount - currentList.value.length) : Infinity

      for (const file of files) {
        if (props.maxSize > 0 && file.size > props.maxSize) {
          rejected.push({ file, reason: 'maxSize' })
          continue
        }
        if (accepted.length >= remainingSlots) {
          rejected.push({ file, reason: 'maxCount' })
          continue
        }
        if (props.beforeUpload) {
          const result = props.beforeUpload(file, files)
          // 支持同步和异步 beforeUpload
          const ok = result instanceof Promise ? await result : result
          if (ok === false) {
            rejected.push({ file, reason: 'beforeUpload' })
            continue
          }
        }
        accepted.push(file)
      }

      for (const r of rejected) emit('reject', r.file, r.reason)
      if (accepted.length === 0) return

      const useUpload = !!(props.customRequest || props.action)
      const status = useUpload ? ('uploading' as const) : props.defaultStatus
      const newItems = accepted.map((f) => fileToUploadFile(f, status))
      const next = [...currentList.value, ...newItems]
      commitList(next)
      for (const item of newItems) {
        emit('change', item, next)
        if (useUpload) doUpload(item)
      }
    }

    function onSelect(e: Event): void {
      const target = e.target as HTMLInputElement
      if (!target.files || target.files.length === 0) return
      pickFiles(target.files)
      target.value = '' // 允许重复选同一个文件
    }

    function openPicker(): void {
      if (props.disabled) return
      inputRef.value?.click()
    }

    function removeItem(item: UploadFile): void {
      const next = currentList.value.filter((f) => f.uid !== item.uid)
      commitList(next)
      emit('remove', item)
      emit('change', { ...item, status: 'removed' }, next)
    }

    function onDragenter(e: DragEvent): void {
      if (props.disabled) return
      e.preventDefault()
      dragOver.value = true
    }
    function onDragover(e: DragEvent): void {
      if (props.disabled) return
      e.preventDefault()
      dragOver.value = true
    }
    function onDragleave(e: DragEvent): void {
      if (props.disabled) return
      e.preventDefault()
      dragOver.value = false
    }
    function onDrop(e: DragEvent): void {
      if (props.disabled) return
      e.preventDefault()
      dragOver.value = false
      emit('drop', e)
      const files = e.dataTransfer?.files
      if (files && files.length > 0) {
        pickFiles(files)
      }
    }

    function renderTrigger(): VNode {
      if (slots.default && !props.drag)
        return h('div', { class: ns.e('trigger'), onClick: openPicker }, slots.default())

      if (props.drag) {
        return (
          <div
            class={[ns.e('drag'), dragOver.value ? ns.is('dragover') : '', props.disabled ? ns.is('disabled') : '']}
            onClick={openPicker}
            onDragenter={onDragenter}
            onDragover={onDragover}
            onDragleave={onDragleave}
            onDrop={onDrop}
          >
            <div class={ns.e('drag-icon')}>📁</div>
            <div class={ns.e('drag-text')}>{props.dragText}</div>
          </div>
        )
      }

      return (
        <button
          type="button"
          class={[ns.e('trigger'), props.disabled ? ns.is('disabled') : '']}
          disabled={props.disabled}
          onClick={openPicker}
        >
          {props.triggerText}
        </button>
      )
    }

    function renderItem(item: UploadFile): VNode {
      if (slots.itemRender) return slots.itemRender({ item, remove: () => removeItem(item) }) as unknown as VNode
      const isCard = props.listType === 'picture-card'
      const cls = [
        ns.e('item'),
        ns.em('item', `status-${item.status ?? 'done'}`),
        ns.em('item', `list-${props.listType}`),
      ]
      const icon = item.status === 'uploading' ? '⌛' : item.status === 'error' ? '⚠' : '✓'
      const thumbSrc = item.thumbUrl || item.url
      const showThumb = (props.listType === 'picture' || isCard) && thumbSrc
      if (isCard) {
        return (
          <li key={item.uid} class={cls}>
            <div class={ns.e('item-card-inner')}>
              {showThumb ? (
                <img
                  class={ns.e('item-card-thumb')}
                  src={thumbSrc}
                  alt={item.name}
                  onClick={() => emit('preview', item)}
                />
              ) : (
                <span class={ns.e('item-card-icon')}>{icon}</span>
              )}
              {item.status === 'uploading' && (
                <span class={ns.e('item-card-percent')}>{Math.round(item.percent ?? 0)}%</span>
              )}
              <div class={ns.e('item-card-actions')}>
                {!props.disabled && (
                  <button
                    type="button"
                    class={ns.e('item-card-remove')}
                    aria-label={props.removeText}
                    onClick={() => removeItem(item)}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <span class={ns.e('item-card-name')} title={item.name}>
              {item.name}
            </span>
          </li>
        )
      }
      return (
        <li key={item.uid} class={cls}>
          {showThumb ? (
            <span class={ns.e('item-thumb')}>
              <img src={thumbSrc} alt={item.name} />
            </span>
          ) : (
            <span class={ns.e('item-icon')}>{icon}</span>
          )}
          <span class={ns.e('item-name')} onClick={() => emit('preview', item)} style={{ cursor: 'pointer' }}>
            {item.name}
          </span>
          {item.size !== undefined && <span class={ns.e('item-size')}>{formatSize(item.size)}</span>}
          {item.status === 'uploading' && <span class={ns.e('item-percent')}>{Math.round(item.percent ?? 0)}%</span>}
          {!props.disabled && (
            <button
              type="button"
              class={ns.e('item-remove')}
              aria-label={props.removeText}
              onClick={() => removeItem(item)}
            >
              ✕
            </button>
          )}
        </li>
      )
    }

    function renderList(): VNode | null {
      if (!props.showUploadList) return null
      const list = currentList.value
      if (list.length === 0) return null
      const isCard = props.listType === 'picture-card'
      return (
        <ul class={[ns.e('list'), isCard && ns.em('list', 'picture-card')]} role="list">
          {list.map((item) => renderItem(item))}
        </ul>
      )
    }

    return () => (
      <div class={[ns.b(), props.disabled ? ns.is('disabled') : '']}>
        <input
          ref={inputRef}
          type="file"
          class={ns.e('input')}
          accept={props.accept}
          multiple={props.multiple}
          disabled={props.disabled}
          aria-hidden="true"
          tabindex={-1}
          onChange={onSelect}
        />
        {renderTrigger()}
        {renderList()}
      </div>
    )
  },
})
