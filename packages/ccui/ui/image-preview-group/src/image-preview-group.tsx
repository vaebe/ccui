import type { ImagePreviewGroupProps, ImagePreviewItem } from './image-preview-group-types'
import { computed, defineComponent, h, onBeforeUnmount, ref, Teleport, Transition, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { imagePreviewGroupProps } from './image-preview-group-types'
import './image-preview-group.scss'

function normalizeItems(raw: ImagePreviewGroupProps['items']): ImagePreviewItem[] {
  if (!raw) return []
  return raw.map((item) => {
    if (typeof item === 'string') return { src: item }
    return { src: item.src, alt: item.alt }
  })
}

export default defineComponent({
  name: 'CImagePreviewGroup',
  props: imagePreviewGroupProps,
  emits: ['update:preview', 'change', 'visible-change'],
  setup(props: ImagePreviewGroupProps, { emit, slots }) {
    const ns = useNamespace('image-preview-group')

    const items = computed(() => normalizeItems(props.items))
    const isControlled = computed(() => props.preview !== undefined)

    // 非受控内部状态
    const innerVisible = ref(false)
    const innerCurrent = ref(0)
    const scale = ref(1)

    const visible = computed(() => {
      if (isControlled.value) return !!props.preview?.visible
      return innerVisible.value
    })

    const current = computed(() => {
      if (isControlled.value) return props.preview?.current ?? 0
      return innerCurrent.value
    })

    const setVisible = (next: boolean) => {
      if (!isControlled.value) innerVisible.value = next
      emit('visible-change', next)
      emit('update:preview', { ...props.preview, visible: next, current: current.value })
    }

    const setCurrent = (next: number) => {
      const total = items.value.length
      if (total === 0) return
      const idx = ((next % total) + total) % total
      if (!isControlled.value) innerCurrent.value = idx
      emit('change', idx)
      emit('update:preview', { ...props.preview, visible: visible.value, current: idx })
    }

    const openAt = (idx: number) => {
      setCurrent(idx)
      scale.value = 1
      setVisible(true)
    }

    const close = () => {
      setVisible(false)
    }

    const next = () => {
      setCurrent(current.value + 1)
      scale.value = 1
    }

    const prev = () => {
      setCurrent(current.value - 1)
      scale.value = 1
    }

    const zoomIn = () => {
      scale.value = Math.min(scale.value * 1.25, props.maxZoom)
    }
    const zoomOut = () => {
      scale.value = Math.max(scale.value / 1.25, props.minZoom)
    }
    const resetZoom = () => {
      scale.value = 1
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (!visible.value) return
      if (e.key === 'Escape') {
        close()
      } else if (e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'ArrowRight') {
        next()
      }
    }

    watch(visible, (val) => {
      if (typeof window === 'undefined') return
      if (val) {
        window.addEventListener('keydown', onKeydown)
      } else {
        window.removeEventListener('keydown', onKeydown)
      }
    })

    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
    })

    const activeItem = computed(() => items.value[current.value])

    const renderThumb = (item: ImagePreviewItem, idx: number) =>
      h('img', {
        key: idx,
        class: ns.e('thumb'),
        src: item.src,
        alt: item.alt ?? '',
        onClick: () => openAt(idx),
      })

    const renderOverlay = () =>
      h(Teleport, { to: 'body' }, [
        h(
          Transition,
          { name: `${ns.b()}-fade` },
          {
            default: () =>
              visible.value && activeItem.value
                ? h(
                    'div',
                    {
                      class: ns.e('mask'),
                      onClick: close,
                    },
                    [
                      h(
                        'div',
                        {
                          class: ns.e('toolbar'),
                          onClick: (e: MouseEvent) => e.stopPropagation(),
                        },
                        [
                          h('button', { onClick: prev, 'aria-label': 'prev', class: ns.e('btn') }, '‹'),
                          h('button', { onClick: zoomOut, 'aria-label': 'zoom out', class: ns.e('btn') }, '−'),
                          h('button', { onClick: resetZoom, 'aria-label': 'reset', class: ns.e('btn') }, '⟳'),
                          h('button', { onClick: zoomIn, 'aria-label': 'zoom in', class: ns.e('btn') }, '+'),
                          h('button', { onClick: next, 'aria-label': 'next', class: ns.e('btn') }, '›'),
                          h('button', { onClick: close, 'aria-label': 'close', class: ns.e('btn') }, '×'),
                          items.value.length > 1
                            ? h('span', { class: ns.e('counter') }, `${current.value + 1} / ${items.value.length}`)
                            : null,
                        ],
                      ),
                      h('img', {
                        class: ns.e('img'),
                        src: activeItem.value.src,
                        alt: activeItem.value.alt ?? '',
                        style: { transform: `scale(${scale.value})` },
                        onClick: (e: MouseEvent) => e.stopPropagation(),
                      }),
                    ],
                  )
                : null,
          },
        ),
      ])

    return () => {
      const children = props.items ? items.value.map((item, idx) => renderThumb(item, idx)) : slots.default?.()

      return h('div', { class: ns.b() }, [children, renderOverlay()])
    }
  },
})
