import { computed, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vite-plus/test'
import { useVirtualList } from './use-virtual-list'

describe('useVirtualList', () => {
  it('reacts to runtime item and viewport height changes', async () => {
    const items = computed(() => Array.from({ length: 100 }, (_, index) => index))
    const itemHeight = ref(20)
    const maxHeight = ref(100)
    const virtual = useVirtualList(items, { itemHeight, maxHeight, buffer: 0 })

    expect(virtual.totalHeight.value).toBe(2000)
    expect(virtual.containerHeight.value).toBe(100)
    expect(virtual.visible.value).toHaveLength(5)

    itemHeight.value = 40
    maxHeight.value = 80
    await nextTick()

    expect(virtual.totalHeight.value).toBe(4000)
    expect(virtual.containerHeight.value).toBe(80)
    expect(virtual.visible.value).toHaveLength(2)
  })

  it('normalizes invalid dimensions to finite safe values', () => {
    const items = computed(() => ['a', 'b'])
    const virtual = useVirtualList(items, { itemHeight: 0, maxHeight: -10, buffer: -2 })

    expect(virtual.totalHeight.value).toBe(2)
    expect(virtual.containerHeight.value).toBe(0)
    expect(virtual.visible.value).toEqual([])
  })

  it.each([
    { itemHeight: Number.NaN, maxHeight: 100, buffer: 0 },
    { itemHeight: Number.POSITIVE_INFINITY, maxHeight: 100, buffer: 0 },
    { itemHeight: Number.NEGATIVE_INFINITY, maxHeight: 100, buffer: 0 },
  ])('normalizes non-finite item height: $itemHeight', ({ itemHeight, maxHeight, buffer }) => {
    const items = computed(() => ['a', 'b'])
    const virtual = useVirtualList(items, { itemHeight, maxHeight, buffer })

    expect(virtual.totalHeight.value).toBe(2)
    expect(virtual.containerHeight.value).toBe(2)
    expect(virtual.visible.value).toEqual([
      { index: 0, data: 'a', top: 0 },
      { index: 1, data: 'b', top: 1 },
    ])
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'normalizes non-finite max height: %s',
    (maxHeight) => {
      const items = computed(() => ['a', 'b'])
      const virtual = useVirtualList(items, { itemHeight: 20, maxHeight, buffer: 0 })

      expect(virtual.containerHeight.value).toBe(0)
      expect(virtual.visible.value).toEqual([])
    },
  )

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'normalizes non-finite buffer: %s',
    (buffer) => {
      const items = computed(() => ['a', 'b'])
      const virtual = useVirtualList(items, { itemHeight: 20, maxHeight: 20, buffer })

      expect(virtual.visible.value).toEqual([{ index: 0, data: 'a', top: 0 }])
    },
  )
})
