import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { computed, ref, toValue } from 'vue'

export interface VirtualListItem<T> {
  index: number
  data: T
  top: number
}

export interface UseVirtualListOptions {
  itemHeight: MaybeRefOrGetter<number>
  maxHeight: MaybeRefOrGetter<number>
  buffer?: MaybeRefOrGetter<number>
}

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback
}

export function useVirtualList<T>(
  items: ComputedRef<T[]>,
  options: UseVirtualListOptions,
): {
  scrollTop: Ref<number>
  onScroll: (event: Event) => void
  visible: ComputedRef<VirtualListItem<T>[]>
  totalHeight: ComputedRef<number>
  containerHeight: ComputedRef<number>
  scrollToIndex: (index: number, container?: HTMLElement | null) => void
} {
  const scrollTop = ref(0)
  const itemHeight = computed(() => Math.max(1, finiteOr(toValue(options.itemHeight), 1)))
  const maxHeight = computed(() => Math.max(0, finiteOr(toValue(options.maxHeight), 0)))
  const buffer = computed(() => Math.max(0, Math.floor(finiteOr(toValue(options.buffer ?? 4), 0))))

  const totalHeight = computed(() => items.value.length * itemHeight.value)
  const containerHeight = computed(() => Math.min(maxHeight.value, totalHeight.value))

  const visible = computed<VirtualListItem<T>[]>(() => {
    const allItems = items.value
    if (allItems.length === 0) return []
    const start = Math.max(0, Math.floor(scrollTop.value / itemHeight.value) - buffer.value)
    const visibleCount = Math.ceil(containerHeight.value / itemHeight.value) + buffer.value * 2
    const end = Math.min(allItems.length, start + visibleCount)
    const out: VirtualListItem<T>[] = []
    for (let i = start; i < end; i += 1) {
      out.push({ index: i, data: allItems[i], top: i * itemHeight.value })
    }
    return out
  })

  const onScroll = (event: Event) => {
    scrollTop.value = (event.currentTarget as HTMLElement).scrollTop
  }

  const scrollToIndex = (index: number, container?: HTMLElement | null) => {
    if (!container) return
    const desiredTop = index * itemHeight.value
    if (desiredTop < scrollTop.value) {
      container.scrollTop = desiredTop
    } else if (desiredTop + itemHeight.value > scrollTop.value + containerHeight.value) {
      container.scrollTop = desiredTop - containerHeight.value + itemHeight.value
    }
  }

  return { scrollTop, onScroll, visible, totalHeight, containerHeight, scrollToIndex }
}
