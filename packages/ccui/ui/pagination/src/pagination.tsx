import type { PaginationProps } from './pagination-types'
import { computed, defineComponent, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { paginationProps } from './pagination-types'
import './pagination.scss'

const ELLIPSIS = -1

function buildPageList(current: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: number[] = [1]
  if (current <= 4) {
    pages.push(2, 3, 4, 5, ELLIPSIS, totalPages)
    return pages
  }
  if (current >= totalPages - 3) {
    pages.push(ELLIPSIS, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    return pages
  }
  pages.push(ELLIPSIS, current - 1, current, current + 1, ELLIPSIS, totalPages)
  return pages
}

export default defineComponent({
  name: 'CPagination',
  props: paginationProps,
  emits: ['update:current', 'update:pageSize', 'change'],
  setup(props: PaginationProps, { emit, slots }) {
    const ns = useNamespace('pagination')

    const innerCurrent = ref(props.current)
    const innerPageSize = ref(props.pageSize)
    const jumperValue = ref('')

    watch(
      () => props.current,
      (val) => {
        innerCurrent.value = val
      },
    )
    watch(
      () => props.pageSize,
      (val) => {
        innerPageSize.value = val
      },
    )

    const totalPages = computed(() => {
      const size = innerPageSize.value || 1
      return Math.max(1, Math.ceil(props.total / size))
    })

    const pageList = computed(() => buildPageList(innerCurrent.value, totalPages.value))

    const range = computed<[number, number]>(() => {
      const start = (innerCurrent.value - 1) * innerPageSize.value + 1
      const end = Math.min(innerCurrent.value * innerPageSize.value, props.total)
      return [Math.min(start, end), end]
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('disabled')]: props.disabled,
      [ns.m('simple')]: props.simple,
      [ns.m('small')]: props.size === 'small',
    }))

    const goTo = (page: number) => {
      if (props.disabled) {
        return
      }
      const target = Math.max(1, Math.min(totalPages.value, page))
      if (target === innerCurrent.value) {
        return
      }
      innerCurrent.value = target
      emit('update:current', target)
      emit('change', target, innerPageSize.value)
    }

    const handlePrev = () => {
      if (innerCurrent.value > 1) {
        goTo(innerCurrent.value - 1)
      }
    }

    const handleNext = () => {
      if (innerCurrent.value < totalPages.value) {
        goTo(innerCurrent.value + 1)
      }
    }

    const handleSizeChange = (e: Event) => {
      const target = e.target as HTMLSelectElement
      const newSize = Number(target.value)
      if (Number.isNaN(newSize) || newSize === innerPageSize.value) {
        return
      }
      innerPageSize.value = newSize
      emit('update:pageSize', newSize)
      const newTotalPages = Math.max(1, Math.ceil(props.total / newSize))
      if (innerCurrent.value > newTotalPages) {
        innerCurrent.value = newTotalPages
        emit('update:current', newTotalPages)
      }
      emit('change', innerCurrent.value, newSize)
    }

    const handleJumperKeydown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') {
        return
      }
      const num = Number(jumperValue.value)
      if (!Number.isNaN(num) && num >= 1) {
        goTo(Math.floor(num))
      }
      jumperValue.value = ''
    }

    const renderTotal = () => {
      if (!props.showTotal) {
        return null
      }
      const text =
        typeof props.showTotal === 'function' ? props.showTotal(props.total, range.value) : `共 ${props.total} 条`
      return <li class={ns.e('total-text')}>{text}</li>
    }

    const renderItem = (page: number) => {
      if (page === ELLIPSIS) {
        return (
          <li class={[ns.e('item'), ns.em('item', 'ellipsis')]} aria-hidden>
            •••
          </li>
        )
      }
      const active = page === innerCurrent.value
      return (
        <li
          key={page}
          class={[ns.e('item'), active && ns.em('item', 'active')]}
          aria-current={active ? 'page' : undefined}
          onClick={() => goTo(page)}
        >
          {page}
        </li>
      )
    }

    const renderSizeChanger = () => {
      if (!props.showSizeChanger) {
        return null
      }
      return (
        <li class={ns.e('size-changer')}>
          <select
            class={ns.e('size-select')}
            value={innerPageSize.value}
            disabled={props.disabled}
            onChange={handleSizeChange}
          >
            {props.pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{`${opt} 条/页`}</option>
            ))}
          </select>
        </li>
      )
    }

    const renderJumper = () => {
      if (!props.showQuickJumper) {
        return null
      }
      return (
        <li class={ns.e('jumper')}>
          跳至
          <input
            class={ns.e('jumper-input')}
            type="text"
            value={jumperValue.value}
            disabled={props.disabled}
            onInput={(e: Event) => {
              jumperValue.value = (e.target as HTMLInputElement).value
            }}
            onKeydown={handleJumperKeydown}
          />
          页
        </li>
      )
    }

    return () => {
      if (props.hideOnSinglePage && totalPages.value <= 1) {
        return null
      }

      const prevDisabled = innerCurrent.value <= 1 || props.disabled
      const nextDisabled = innerCurrent.value >= totalPages.value || props.disabled

      return (
        <ul class={cls.value}>
          {renderTotal()}
          <li
            class={[ns.e('prev'), prevDisabled && ns.is('disabled')]}
            onClick={handlePrev}
            aria-disabled={prevDisabled}
          >
            {slots.prev ? slots.prev() : <span class={ns.e('arrow')}>‹</span>}
          </li>

          {props.simple ? (
            <li class={ns.e('simple-pager')}>
              <input
                class={ns.e('simple-input')}
                type="text"
                value={innerCurrent.value}
                disabled={props.disabled}
                onChange={(e: Event) => {
                  const num = Number((e.target as HTMLInputElement).value)
                  if (!Number.isNaN(num)) {
                    goTo(Math.floor(num))
                  }
                }}
              />
              <span class={ns.e('simple-slash')}>/</span>
              <span class={ns.e('simple-total')}>{totalPages.value}</span>
            </li>
          ) : (
            pageList.value.map(renderItem)
          )}

          <li
            class={[ns.e('next'), nextDisabled && ns.is('disabled')]}
            onClick={handleNext}
            aria-disabled={nextDisabled}
          >
            {slots.next ? slots.next() : <span class={ns.e('arrow')}>›</span>}
          </li>
          {renderSizeChanger()}
          {renderJumper()}
        </ul>
      )
    }
  },
})
