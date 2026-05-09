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
  emits: ['update:fileList', 'change', 'remove', 'reject', 'drop'],
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

    function pickFiles(rawFiles: FileList | File[]): void {
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
          const ok = props.beforeUpload(file, files)
          if (ok === false) {
            rejected.push({ file, reason: 'beforeUpload' })
            continue
          }
        }
        accepted.push(file)
      }

      for (const r of rejected) emit('reject', r.file, r.reason)
      if (accepted.length === 0) return

      const newItems = accepted.map((f) => fileToUploadFile(f, props.defaultStatus))
      const next = [...currentList.value, ...newItems]
      commitList(next)
      for (const item of newItems) emit('change', item, next)
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
      const cls = [ns.e('item'), ns.em('item', `status-${item.status ?? 'done'}`)]
      const icon = item.status === 'uploading' ? '⌛' : item.status === 'error' ? '⚠' : '✓'
      return (
        <li key={item.uid} class={cls}>
          <span class={ns.e('item-icon')}>{icon}</span>
          <span class={ns.e('item-name')}>{item.name}</span>
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
      return (
        <ul class={ns.e('list')} role="list">
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
