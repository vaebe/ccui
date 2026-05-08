import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

export interface VirtualListItem<T> {
  index: number
  data: T
  top: number
}

export interface UseVirtualListOptions {
  itemHeight: number
  maxHeight: number
  buffer?: number
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
  const buffer = options.buffer ?? 4

  const totalHeight = computed(() => items.value.length * options.itemHeight)
  const containerHeight = computed(() => Math.min(options.maxHeight, totalHeight.value))

  const visible = computed<VirtualListItem<T>[]>(() => {
    const allItems = items.value
    if (allItems.length === 0) return []
    const start = Math.max(0, Math.floor(scrollTop.value / options.itemHeight) - buffer)
    const visibleCount = Math.ceil(containerHeight.value / options.itemHeight) + buffer * 2
    const end = Math.min(allItems.length, start + visibleCount)
    const out: VirtualListItem<T>[] = []
    for (let i = start; i < end; i += 1) {
      out.push({ index: i, data: allItems[i], top: i * options.itemHeight })
    }
    return out
  })

  const onScroll = (event: Event) => {
    scrollTop.value = (event.currentTarget as HTMLElement).scrollTop
  }

  const scrollToIndex = (index: number, container?: HTMLElement | null) => {
    if (!container) return
    const desiredTop = index * options.itemHeight
    if (desiredTop < scrollTop.value) {
      container.scrollTop = desiredTop
    } else if (desiredTop + options.itemHeight > scrollTop.value + containerHeight.value) {
      container.scrollTop = desiredTop - containerHeight.value + options.itemHeight
    }
  }

  return { scrollTop, onScroll, visible, totalHeight, containerHeight, scrollToIndex }
}
