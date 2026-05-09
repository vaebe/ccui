import type { VNode } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { TransferDirection, TransferItem, TransferProps } from './transfer-types'
import { computed, defineComponent, h, inject, shallowRef } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { DEFAULT_LOCALE, transferProps } from './transfer-types'
import './transfer.scss'

interface PartitionResult {
  left: TransferItem[]
  right: TransferItem[]
}

function partition(data: TransferItem[], targetKeys: string[]): PartitionResult {
  const set = new Set(targetKeys)
  const left: TransferItem[] = []
  const right: TransferItem[] = []
  // right 顺序按 targetKeys 给定的顺序，便于业务排序
  const map = new Map<string, TransferItem>()
  for (const item of data) {
    if (set.has(item.key)) {
      map.set(item.key, item)
    } else {
      left.push(item)
    }
  }
  for (const key of targetKeys) {
    const found = map.get(key)
    if (found) right.push(found)
  }
  return { left, right }
}

export default defineComponent({
  name: 'CTransfer',
  props: transferProps,
  emits: ['update:targetKeys', 'update:selectedKeys', 'change', 'select-change', 'search'],
  setup(props: TransferProps, { emit, slots }) {
    const ns = useNamespace('transfer')
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const leftSearch = shallowRef('')
    const rightSearch = shallowRef('')

    const partitioned = computed(() => partition(props.dataSource, props.targetKeys))

    const locale = computed(() => ({ ...DEFAULT_LOCALE, ...props.locale }))

    function applyFilter(items: TransferItem[], keyword: string): TransferItem[] {
      if (!keyword) return items
      const filter = props.filterOption
      if (filter) {
        return items.filter((item) => filter(keyword, item))
      }
      const needle = keyword.toLowerCase()
      return items.filter((item) => {
        const text = (item.title ?? item.key).toLowerCase()
        return text.includes(needle)
      })
    }

    const filteredLeft = computed(() => applyFilter(partitioned.value.left, leftSearch.value))
    const filteredRight = computed(() => applyFilter(partitioned.value.right, rightSearch.value))

    const selectedSet = computed(() => new Set(props.selectedKeys))

    const leftSelected = computed(() => filteredLeft.value.filter((i) => selectedSet.value.has(i.key) && !i.disabled))
    const rightSelected = computed(() => filteredRight.value.filter((i) => selectedSet.value.has(i.key) && !i.disabled))

    const allLeftSelected = computed(() => {
      const enabled = filteredLeft.value.filter((i) => !i.disabled)
      return enabled.length > 0 && enabled.every((i) => selectedSet.value.has(i.key))
    })
    const allRightSelected = computed(() => {
      const enabled = filteredRight.value.filter((i) => !i.disabled)
      return enabled.length > 0 && enabled.every((i) => selectedSet.value.has(i.key))
    })

    const someLeftSelected = computed(() => leftSelected.value.length > 0 && !allLeftSelected.value)
    const someRightSelected = computed(() => rightSelected.value.length > 0 && !allRightSelected.value)

    function emitSelectedKeys(next: string[]): void {
      emit('update:selectedKeys', next)
      const left = next.filter((k) => !props.targetKeys.includes(k))
      const right = next.filter((k) => props.targetKeys.includes(k))
      emit('select-change', left, right)
    }

    function toggleItem(key: string, disabled: boolean): void {
      if (disabled || props.disabled) return
      const set = new Set(props.selectedKeys)
      if (set.has(key)) set.delete(key)
      else set.add(key)
      emitSelectedKeys(Array.from(set))
    }

    function toggleAll(direction: TransferDirection, checked: boolean): void {
      if (props.disabled) return
      const list = direction === 'left' ? filteredLeft.value : filteredRight.value
      const enabledKeys = list.filter((i) => !i.disabled).map((i) => i.key)
      const set = new Set(props.selectedKeys)
      if (checked) {
        for (const k of enabledKeys) set.add(k)
      } else {
        for (const k of enabledKeys) set.delete(k)
      }
      emitSelectedKeys(Array.from(set))
    }

    function move(direction: TransferDirection): void {
      if (props.disabled) return
      // 'right' 操作：从左侧选中的项移到右；'left' 操作：从右侧选中的项移到左
      const sourceSelected = direction === 'right' ? leftSelected.value : rightSelected.value
      const moveKeys = sourceSelected.map((i) => i.key)
      if (moveKeys.length === 0) return
      let nextTarget: string[]
      if (direction === 'right') {
        nextTarget = [...props.targetKeys, ...moveKeys.filter((k) => !props.targetKeys.includes(k))]
      } else {
        const moveSet = new Set(moveKeys)
        nextTarget = props.targetKeys.filter((k) => !moveSet.has(k))
      }
      // 清掉刚刚被移动的 key 在 selectedKeys 里的勾选
      const moveSet = new Set(moveKeys)
      const nextSelected = props.selectedKeys.filter((k) => !moveSet.has(k))
      emit('update:targetKeys', nextTarget)
      emit('change', nextTarget, direction, moveKeys)
      emit('update:selectedKeys', nextSelected)
      formItem?.validate('change')
    }

    function onSearch(direction: TransferDirection, value: string): void {
      if (direction === 'left') leftSearch.value = value
      else rightSearch.value = value
      emit('search', direction, value)
    }

    function renderItem(item: TransferItem): unknown {
      if (slots.render) return slots.render({ item })
      if (props.render) return props.render(item)
      return item.title ?? String(item.key)
    }

    function renderListHeader(direction: TransferDirection, list: TransferItem[]): VNode {
      const total = list.length
      const checked = direction === 'left' ? allLeftSelected.value : allRightSelected.value
      const indeterminate = direction === 'left' ? someLeftSelected.value : someRightSelected.value
      const selectedCount = direction === 'left' ? leftSelected.value.length : rightSelected.value.length
      const title = direction === 'left' ? props.titles[0] : props.titles[1]
      const unit = total === 1 ? locale.value.itemUnit : locale.value.itemsUnit
      const countText = selectedCount > 0 ? `${selectedCount}/${total} ${unit}` : `${total} ${unit}`
      return (
        <div class={ns.e('header')}>
          <input
            type="checkbox"
            class={ns.e('header-checkbox')}
            checked={checked}
            disabled={props.disabled || total === 0}
            aria-checked={indeterminate ? 'mixed' : checked ? 'true' : 'false'}
            ref={(el: any) => {
              if (el) (el as HTMLInputElement).indeterminate = indeterminate
            }}
            onChange={(e: Event) => toggleAll(direction, (e.target as HTMLInputElement).checked)}
          />
          <span class={ns.e('header-count')}>{countText}</span>
          {title && <span class={ns.e('header-title')}>{title}</span>}
        </div>
      )
    }

    function renderSearchBox(direction: TransferDirection): VNode | null {
      if (!props.showSearch) return null
      const value = direction === 'left' ? leftSearch.value : rightSearch.value
      return (
        <div class={ns.e('search')}>
          <input
            class={ns.e('search-input')}
            type="text"
            value={value}
            placeholder={locale.value.searchPlaceholder}
            disabled={props.disabled}
            onInput={(e: Event) => onSearch(direction, (e.target as HTMLInputElement).value)}
          />
        </div>
      )
    }

    function renderList(direction: TransferDirection): VNode {
      const items = direction === 'left' ? filteredLeft.value : filteredRight.value
      return (
        <div class={ns.e('column')}>
          {renderListHeader(direction, items)}
          {renderSearchBox(direction)}
          {items.length === 0 ? (
            <div class={ns.e('empty')}>{locale.value.notFoundContent}</div>
          ) : (
            <ul class={ns.e('list')} role="listbox" aria-multiselectable="true">
              {items.map((item) => {
                const checked = selectedSet.value.has(item.key)
                const isDisabled = !!item.disabled || props.disabled
                return (
                  <li
                    key={item.key}
                    class={[ns.e('item'), checked ? ns.is('checked') : '', isDisabled ? ns.is('disabled') : '']}
                    role="option"
                    aria-selected={checked}
                    aria-disabled={isDisabled}
                    onClick={() => toggleItem(item.key, isDisabled)}
                  >
                    <input
                      type="checkbox"
                      class={ns.e('item-checkbox')}
                      checked={checked}
                      disabled={isDisabled}
                      onClick={(e: MouseEvent) => e.stopPropagation()}
                      onChange={() => toggleItem(item.key, isDisabled)}
                    />
                    <span class={ns.e('item-content')}>{renderItem(item)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )
    }

    function renderOperations(): VNode {
      return (
        <div class={ns.e('operations')}>
          <button
            type="button"
            class={[ns.e('operation'), ns.em('operation', 'right')]}
            disabled={props.disabled || leftSelected.value.length === 0}
            onClick={() => move('right')}
          >
            {props.operations[0]}
          </button>
          <button
            type="button"
            class={[ns.e('operation'), ns.em('operation', 'left')]}
            disabled={props.disabled || rightSelected.value.length === 0}
            onClick={() => move('left')}
          >
            {props.operations[1]}
          </button>
        </div>
      )
    }

    return () => (
      <div class={[ns.b(), props.disabled ? ns.is('disabled') : '']}>
        {renderList('left')}
        {renderOperations()}
        {renderList('right')}
      </div>
    )
  },
})
