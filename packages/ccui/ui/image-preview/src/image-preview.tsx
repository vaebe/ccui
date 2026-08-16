import type { ImagePreviewProps, ImagePreviewItem } from './image-preview-types'
import { computed, defineComponent, h, nextTick, onBeforeUnmount, ref, Teleport, Transition, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { activateOverlay, canUseDom, lockBodyScroll } from '../../shared/utils/overlay'
import { imagePreviewProps } from './image-preview-types'
import './image-preview.scss'

function normalizeItems(raw: ImagePreviewProps['items']): ImagePreviewItem[] {
  if (!raw) return []
  return raw.map((item) => {
    if (typeof item === 'string') return { src: item }
    return { src: item.src, alt: item.alt }
  })
}

export default defineComponent({
  name: 'CImagePreview',
  props: imagePreviewProps,
  emits: ['update:preview', 'change', 'visible-change'],
  setup(props: ImagePreviewProps, { emit, slots }) {
    const ns = useNamespace('image-preview')

    const items = computed(() => normalizeItems(props.items))
    const isControlled = computed(() => props.preview !== undefined)

    // 非受控内部状态
    const innerVisible = ref(false)
    const innerCurrent = ref(0)
    const scale = ref(1)
    const overlayRef = ref<HTMLElement | null>(null)
    const triggerRef = ref<HTMLElement | null>(null)
    let releaseOverlay: (() => void) | null = null
    let releaseScroll: (() => void) | null = null

    const visible = computed(() => {
      if (isControlled.value) return !!props.preview?.visible
      return innerVisible.value
    })

    const current = computed(() => {
      const total = items.value.length
      const raw = isControlled.value ? (props.preview?.current ?? 0) : innerCurrent.value
      if (total === 0) return 0
      // 归一化，避免父组件传入越界 current 导致 activeItem 为 undefined
      return ((raw % total) + total) % total
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
      const total = items.value.length
      if (total === 0) return
      const target = ((idx % total) + total) % total
      if (canUseDom() && document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
        triggerRef.value = document.activeElement
      }
      if (!isControlled.value) {
        innerCurrent.value = target
        innerVisible.value = true
      }
      scale.value = 1
      // 同时变更 current 与 visible，合并为一次 update:preview，避免受控下两次 emit 互相用对方旧值覆盖
      emit('change', target)
      emit('visible-change', true)
      emit('update:preview', { ...props.preview, visible: true, current: target })
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
        if (!e.defaultPrevented) close()
      } else if (e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'ArrowRight') {
        next()
      }
    }

    const activeItem = computed(() => items.value[current.value])
    const overlayOpen = computed(() => visible.value && !!activeItem.value)

    watch(
      overlayOpen,
      (val) => {
        if (typeof window === 'undefined') return
        if (val) {
          const activeElement = document.activeElement
          if (
            activeElement instanceof HTMLElement &&
            activeElement !== document.body &&
            !overlayRef.value?.contains(activeElement)
          ) {
            triggerRef.value = activeElement
          }
          window.addEventListener('keydown', onKeydown)
          releaseScroll?.()
          releaseScroll = lockBodyScroll()
          void nextTick(() => {
            if (!overlayOpen.value || !overlayRef.value) return
            releaseOverlay?.()
            releaseOverlay = activateOverlay({
              container: overlayRef.value,
              closeOnEsc: true,
              onEscape: close,
            })
          })
        } else {
          window.removeEventListener('keydown', onKeydown)
          releaseOverlay?.()
          releaseOverlay = null
          releaseScroll?.()
          releaseScroll = null
          const trigger = triggerRef.value
          triggerRef.value = null
          if (trigger && document.body.contains(trigger)) {
            trigger.focus({ preventScroll: true })
          }
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
      releaseOverlay?.()
      releaseScroll?.()
    })

    const renderThumb = (item: ImagePreviewItem, idx: number) =>
      h('img', {
        key: idx,
        class: ns.e('thumb'),
        src: item.src,
        alt: item.alt ?? '',
        'aria-label': item.alt || `Preview image ${idx + 1}`,
        // 缩略图作为打开预览的交互元素，需键盘可达（Enter/Space 与点击行为一致）
        tabindex: 0,
        role: 'button',
        onClick: () => openAt(idx),
        onKeydown: (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openAt(idx)
          }
        },
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
                      ref: overlayRef,
                      class: ns.e('mask'),
                      role: 'dialog',
                      'aria-modal': 'true',
                      'aria-label': activeItem.value.alt ? `${activeItem.value.alt} preview` : 'Image preview',
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
                          h('button', { type: 'button', onClick: prev, 'aria-label': 'prev', class: ns.e('btn') }, '‹'),
                          h(
                            'button',
                            { type: 'button', onClick: zoomOut, 'aria-label': 'zoom out', class: ns.e('btn') },
                            '−',
                          ),
                          h(
                            'button',
                            { type: 'button', onClick: resetZoom, 'aria-label': 'reset', class: ns.e('btn') },
                            '⟳',
                          ),
                          h(
                            'button',
                            { type: 'button', onClick: zoomIn, 'aria-label': 'zoom in', class: ns.e('btn') },
                            '+',
                          ),
                          h('button', { type: 'button', onClick: next, 'aria-label': 'next', class: ns.e('btn') }, '›'),
                          h(
                            'button',
                            { type: 'button', onClick: close, 'aria-label': 'close', class: ns.e('btn') },
                            '×',
                          ),
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
      const children = slots.default ? slots.default() : items.value.map((item, idx) => renderThumb(item, idx))

      return h('div', { class: ns.b() }, [children, renderOverlay()])
    }
  },
})
