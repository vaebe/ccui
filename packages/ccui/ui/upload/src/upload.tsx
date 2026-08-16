import type { VNode } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { UploadFile, UploadProps, UploadRequestHandle } from './upload-types'
import { computed, defineComponent, h, inject, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { renderIconNode } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { fileToUploadFile, uploadProps } from './upload-types'
import './upload.scss'

function formatSize(bytes?: number): string {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** 判断拖放文件是否满足原生 input `accept` 使用的扩展名或 MIME 规则。 */
function matchesAccept(file: File, accept: string): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
  if (rules.length === 0) return true

  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()
  return rules.some((rule) => {
    if (rule.startsWith('.')) return fileName.endsWith(rule)
    if (rule.endsWith('/*')) return fileType.startsWith(rule.slice(0, -1))
    return fileType === rule
  })
}

/** 将不受信任的请求异常归一为 Error，确保状态更新始终有可展示消息。 */
function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error))
}

/** 将外部文件列表中的任意进度值限制到合法 ARIA 百分比范围。 */
function normalizePercent(percent: number | undefined): number {
  return Number.isFinite(percent) ? Math.min(100, Math.max(0, percent as number)) : 0
}

interface RequestRecord {
  /** 请求对应的取消句柄可能在异步 customRequest 结束后才出现。 */
  handle?: UploadRequestHandle
  /** 记录该请求实例而非 uid 是否已取消，避免同 uid ABA 误判。 */
  cancelled: boolean
}

export default defineComponent({
  name: 'CUpload',
  props: uploadProps,
  emits: ['update:fileList', 'change', 'remove', 'reject', 'drop', 'preview', 'download'],
  setup(props: UploadProps, { emit, slots }) {
    const ns = useNamespace('upload')
    const inputRef = ref<HTMLInputElement | null>(null)
    const dragOver = shallowRef(false)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const innerList = shallowRef<UploadFile[]>(props.defaultFileList ?? [])
    let latestCommittedList: UploadFile[] = props.fileList ?? innerList.value
    const requests = new Map<string, RequestRecord>()
    let selectionQueue: Promise<void> | null = null
    let isUnmounted = false

    const isControlled = computed(() => props.fileList !== undefined)
    const currentList = computed<UploadFile[]>(() => {
      return isControlled.value ? (props.fileList as UploadFile[]) : innerList.value
    })

    /** 提交一份新的列表快照，并在非受控模式同步内部状态。 */
    function commitList(next: UploadFile[]): void {
      latestCommittedList = next
      if (!isControlled.value) {
        innerList.value = next
      }
      emit('update:fileList', next)
    }

    /** 仅更新目标上传项，避免请求回调覆盖同批次的其他文件。 */
    function updateItemInList(uid: string, patch: Partial<UploadFile>): void {
      const next = latestCommittedList.map((item) => (item.uid === uid ? { ...item, ...patch } : item))
      commitList(next)
    }

    watch(
      () => ({ fileList: props.fileList, ids: props.fileList?.map((file) => file.uid) }),
      ({ fileList, ids }, previous) => {
        if (!fileList) {
          if (previous?.fileList) innerList.value = [...previous.fileList]
          latestCommittedList = innerList.value
          return
        }
        latestCommittedList = fileList
        const retainedIds = new Set(ids)
        requests.forEach((_request, uid) => {
          if (retainedIds.has(uid)) return
          // 受控父级直接移除文件时，也必须终止该文件仍在进行的底层请求。
          cancelRequest(uid)
        })
      },
      { flush: 'sync' },
    )

    /** 启动上传并把同步抛错、异步拒绝以及越界进度收敛到同一状态机。 */
    function doUpload(item: UploadFile): void {
      if (!item.raw) return
      const upload = props.customRequest || (props.action ? defaultRequest : null)
      if (!upload) return

      updateItemInList(item.uid, { status: 'uploading', percent: 0 })
      const request: RequestRecord = { cancelled: false }
      requests.set(item.uid, request)

      const onError = (error: unknown): void => {
        if (requests.get(item.uid) !== request) return
        requests.delete(item.uid)
        updateItemInList(item.uid, { status: 'error', response: normalizeError(error).message })
      }
      let result: ReturnType<NonNullable<UploadProps['customRequest']>>
      try {
        result = upload({
          file: item.raw,
          onProgress: (percent: number) => {
            if (requests.get(item.uid) !== request) return
            const normalized = Number.isFinite(percent) ? Math.min(99, Math.max(0, percent)) : 0
            updateItemInList(item.uid, { percent: normalized })
          },
          onSuccess: (response?: unknown) => {
            if (requests.get(item.uid) !== request) return
            requests.delete(item.uid)
            updateItemInList(item.uid, { status: 'done', percent: 100, response })
          },
          onError,
        })
      } catch (error) {
        onError(error)
        return
      }
      void Promise.resolve(result).then((handle) => {
        if (!handle) return
        if (request.cancelled) {
          handle.abort()
          return
        }
        if (requests.get(item.uid) === request) request.handle = handle
      }, onError)
    }

    /** 取消 uid 当前对应的请求实例；迟到句柄会读取实例级 cancelled 标记后自行终止。 */
    function cancelRequest(uid: string): void {
      const request = requests.get(uid)
      if (!request) return
      requests.delete(uid)
      request.cancelled = true
      request.handle?.abort()
    }

    /** 使用 XHR 执行默认请求，并返回供删除和卸载阶段调用的取消句柄。 */
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

    /** 处理一次文件选择；拖放入口额外执行原生选择器本身会保证的单选约束。 */
    async function pickFiles(files: File[], enforceMultiple: boolean): Promise<void> {
      if (files.length === 0) return

      const accepted: File[] = []
      const rejected: Array<{
        file: File
        reason: 'accept' | 'beforeUpload' | 'maxCount' | 'maxSize' | 'multiple'
      }> = []

      for (const file of files) {
        if (props.disabled || isUnmounted) return
        if (!matchesAccept(file, props.accept)) {
          rejected.push({ file, reason: 'accept' })
          continue
        }
        if (enforceMultiple && !props.multiple && accepted.length > 0) {
          rejected.push({ file, reason: 'multiple' })
          continue
        }
        if (props.maxSize > 0 && file.size > props.maxSize) {
          rejected.push({ file, reason: 'maxSize' })
          continue
        }
        if (props.beforeUpload) {
          let ok: boolean | undefined
          try {
            const result = props.beforeUpload(file, files)
            // 同步 guard 保持同步提交；仅 Promise guard 让出执行权。
            ok = result instanceof Promise ? await result : result
          } catch {
            // 过滤函数失败等同于明确拒收，避免形成未处理的 Promise rejection。
            ok = false
          }
          if (props.disabled || isUnmounted) return
          if (ok === false) {
            rejected.push({ file, reason: 'beforeUpload' })
            continue
          }
        }
        // 异步 beforeUpload 返回后以最新受控/乐观列表重新判定容量。
        if (props.maxCount > 0 && latestCommittedList.length + accepted.length >= props.maxCount) {
          rejected.push({ file, reason: 'maxCount' })
          continue
        }
        accepted.push(file)
      }

      for (const r of rejected) emit('reject', r.file, r.reason)
      if (accepted.length === 0 || props.disabled || isUnmounted) return

      const useUpload = !!(props.customRequest || props.action)
      const status = useUpload ? ('uploading' as const) : props.defaultStatus
      const newItems = accepted.map((f) => fileToUploadFile(f, status))
      const next = [...latestCommittedList, ...newItems]
      commitList(next)
      void formItem?.validate('change')
      for (const item of newItems) {
        emit('change', item, next)
        if (useUpload) doUpload(item)
      }
    }

    /** 只在已有异步过滤尚未结束时排队，兼顾同步选择的既有提交时序与竞态安全。 */
    function enqueueFiles(files: File[], enforceMultiple: boolean): void {
      const task = selectionQueue
        ? selectionQueue.then(() => pickFiles(files, enforceMultiple))
        : pickFiles(files, enforceMultiple)
      selectionQueue = task
      // 两个分支都清理队列，同时避免 `finally` 派生出无人处理的 rejection。
      void task.then(
        () => {
          if (selectionQueue === task) selectionQueue = null
        },
        () => {
          if (selectionQueue === task) selectionQueue = null
        },
      )
    }

    /** 在清空原生 input 前复制 FileList，确保异步队列不会读取失效对象。 */
    function onSelect(e: Event): void {
      const target = e.target as HTMLInputElement
      if (!target.files || target.files.length === 0) return
      const files = Array.from(target.files)
      enqueueFiles(files, false)
      target.value = '' // 允许重复选同一个文件
    }

    /** 打开系统文件选择器；动态禁用后不再响应已有触发器事件。 */
    function openPicker(): void {
      if (props.disabled) return
      inputRef.value?.click()
    }

    /** 移除文件并取消其仍在进行的请求。 */
    function removeItem(item: UploadFile): void {
      if (props.disabled) return
      cancelRequest(item.uid)
      const next = currentList.value.filter((f) => f.uid !== item.uid)
      commitList(next)
      emit('remove', item)
      emit('change', { ...item, status: 'removed' }, next)
      void formItem?.validate('change')
    }

    onBeforeUnmount(() => {
      isUnmounted = true
      requests.forEach((_request, uid) => cancelRequest(uid))
    })

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
    /** 读取拖放文件并复用选择队列，使限制规则在所有入口保持一致。 */
    function onDrop(e: DragEvent): void {
      e.preventDefault()
      if (props.disabled) return
      dragOver.value = false
      emit('drop', e)
      const files = e.dataTransfer?.files
      if (files && files.length > 0) {
        const droppedFiles = Array.from(files)
        enqueueFiles(droppedFiles, true)
      }
    }

    /** 为模拟按钮的拖拽区域补齐原生按钮一致的 Enter/Space 行为。 */
    function onTriggerKeydown(event: KeyboardEvent): void {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      openPicker()
    }

    /** 仅当焦点真正离开整个上传控件时触发一次 FormItem blur 校验。 */
    function onFocusout(event: FocusEvent): void {
      const next = event.relatedTarget
      if (next instanceof Node && (event.currentTarget as HTMLElement).contains(next)) return
      void formItem?.validate('blur')
    }

    function renderTrigger(): VNode {
      if (slots.default && !props.drag)
        return h('div', { class: ns.e('trigger'), onClick: openPicker }, slots.default())

      if (props.drag) {
        return (
          <div
            class={[ns.e('drag'), dragOver.value ? ns.is('dragover') : '', props.disabled ? ns.is('disabled') : '']}
            role="button"
            tabindex={props.disabled ? -1 : 0}
            aria-label={props.dragText}
            aria-disabled={props.disabled ? true : undefined}
            onClick={openPicker}
            onDragenter={onDragenter}
            onDragover={onDragover}
            onDragleave={onDragleave}
            onDrop={onDrop}
            onKeydown={onTriggerKeydown}
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
      const iconName =
        item.status === 'uploading' ? 'mdi:loading' : item.status === 'error' ? 'mdi:alert-circle' : 'mdi:check-circle'
      const icon = renderIconNode(iconName)
      const thumbSrc = item.thumbUrl || item.url
      const showThumb = (props.listType === 'picture' || isCard) && thumbSrc
      const displayedPercent = normalizePercent(item.percent)
      if (isCard) {
        return (
          <li
            key={item.uid}
            class={cls}
            role="listitem"
            aria-label={item.name}
            aria-busy={item.status === 'uploading' ? true : undefined}
          >
            <div class={ns.e('item-card-inner')}>
              {showThumb ? (
                <button type="button" class={ns.e('item-card-preview')} onClick={() => emit('preview', item)}>
                  <img class={ns.e('item-card-thumb')} src={thumbSrc} alt={item.name} />
                </button>
              ) : (
                <span class={ns.e('item-card-icon')}>{icon}</span>
              )}
              {item.status === 'uploading' && (
                <span
                  class={ns.e('item-card-percent')}
                  role="progressbar"
                  aria-label={item.name}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(displayedPercent)}
                >
                  {Math.round(displayedPercent)}%
                </span>
              )}
              <div class={ns.e('item-card-actions')}>
                {!props.disabled && (
                  <button
                    type="button"
                    class={ns.e('item-card-remove')}
                    aria-label={`${props.removeText} ${item.name}`}
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
        <li
          key={item.uid}
          class={cls}
          role="listitem"
          aria-label={item.name}
          aria-busy={item.status === 'uploading' ? true : undefined}
        >
          {showThumb ? (
            <span class={ns.e('item-thumb')}>
              <img src={thumbSrc} alt={item.name} />
            </span>
          ) : (
            <span class={ns.e('item-icon')}>{icon}</span>
          )}
          <button type="button" class={ns.e('item-name')} onClick={() => emit('preview', item)}>
            {item.name}
          </button>
          {item.size !== undefined && <span class={ns.e('item-size')}>{formatSize(item.size)}</span>}
          {item.status === 'uploading' && (
            <span
              class={ns.e('item-percent')}
              role="progressbar"
              aria-label={item.name}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(displayedPercent)}
            >
              {Math.round(displayedPercent)}%
            </span>
          )}
          {!props.disabled && (
            <button
              type="button"
              class={ns.e('item-remove')}
              aria-label={`${props.removeText} ${item.name}`}
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
      <div class={[ns.b(), props.disabled ? ns.is('disabled') : '']} onFocusout={onFocusout}>
        <input
          ref={inputRef}
          type="file"
          class={ns.e('input')}
          accept={props.accept}
          name={props.name}
          capture={props.capture}
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
