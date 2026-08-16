import type { CSSProperties } from 'vue'
import type { ImageProps } from './image-types'
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  Teleport,
  Transition,
  useAttrs,
  watch,
} from 'vue'
import { useConfig } from '../../config-provider/src/config-provider'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { imageProps } from './image-types'
import './image.scss'

function toSize(v: number | string): string {
  if (v === '' || v === undefined || v === null) {
    return ''
  }
  return typeof v === 'number' ? `${v}px` : String(v)
}

export default defineComponent({
  name: 'CImage',
  inheritAttrs: false,
  props: imageProps,
  emits: ['load', 'error', 'click'],
  setup(props: ImageProps, { emit, slots }) {
    const attrs = useAttrs()
    const ns = useNamespace('image')
    const cfg = useConfig()
    const loadingText = computed(() => cfg.locale?.Image?.loading || '加载中')
    const errorText = computed(() => cfg.locale?.Image?.error || '加载失败')
    const status = ref<'loading' | 'loaded' | 'error'>('loading')
    const fallbackFailed = ref(false)
    const showSrc = ref<string>(props.lazy ? '' : props.src)
    const wrapperRef = ref<HTMLElement>()
    const imageRef = ref<HTMLImageElement>()
    const closeButtonRef = ref<HTMLButtonElement>()

    const previewVisible = ref(false)
    const scale = ref(1)

    const wrapperStyle = computed<CSSProperties>(() => ({
      width: toSize(props.width),
      height: toSize(props.height),
    }))

    const imgStyle = computed<CSSProperties>(() => ({ objectFit: props.fit }))

    const onLoad = (e: Event) => {
      status.value = 'loaded'
      emit('load', e)
    }
    const onError = (e: Event) => {
      status.value = 'error'
      emit('error', e)
    }

    // Fallback failure must settle on the documented error UI instead of retrying forever.
    const onFallbackError = () => {
      fallbackFailed.value = true
    }

    const onImageKeydown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && props.preview && status.value === 'loaded') {
        e.preventDefault()
        onClick(e as unknown as MouseEvent)
      }
    }

    const onClick = (e: MouseEvent) => {
      emit('click', e)
      if (props.preview && status.value === 'loaded') {
        previewVisible.value = true
        scale.value = 1
      }
    }

    const closePreview = () => {
      if (!previewVisible.value) return
      previewVisible.value = false
      void nextTick(() => imageRef.value?.focus({ preventScroll: true }))
    }

    const onPreviewKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !previewVisible.value) return
      event.preventDefault()
      closePreview()
    }

    // 预览使用 Teleport；把 Escape 监听放在 window，确保焦点位于任一工具栏按钮时都能关闭。
    watch(previewVisible, (visible) => {
      if (typeof window === 'undefined') return
      if (visible) {
        window.addEventListener('keydown', onPreviewKeydown)
        void nextTick(() => closeButtonRef.value?.focus({ preventScroll: true }))
      } else {
        window.removeEventListener('keydown', onPreviewKeydown)
      }
    })

    const zoomIn = () => {
      scale.value = Math.min(scale.value * 1.25, 6)
    }
    const zoomOut = () => {
      scale.value = Math.max(scale.value / 1.25, 0.25)
    }
    const reset = () => {
      scale.value = 1
    }

    let observer: IntersectionObserver | null = null
    const setupLazy = () => {
      // 先释放上一次的 observer，避免 src 连续切换时旧 observer 泄漏
      observer?.disconnect()
      observer = null
      if (!props.lazy || !wrapperRef.value) {
        return
      }
      if (typeof IntersectionObserver === 'undefined') {
        showSrc.value = props.src
        return
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              showSrc.value = props.src
              observer?.disconnect()
              observer = null
            }
          })
        },
        { rootMargin: props.rootMargin },
      )
      observer.observe(wrapperRef.value)
    }

    onMounted(() => {
      if (props.lazy) {
        setupLazy()
      }
    })

    watch(
      () => props.src,
      (val) => {
        status.value = 'loading'
        fallbackFailed.value = false
        showSrc.value = props.lazy ? '' : val
        if (props.lazy) {
          setupLazy()
        }
      },
    )

    onBeforeUnmount(() => {
      observer?.disconnect()
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onPreviewKeydown)
    })

    return () => (
      <div
        {...attrs}
        ref={wrapperRef}
        class={[ns.b(), props.classNames?.root]}
        style={[wrapperStyle.value, props.styles?.root] as any}
      >
        {status.value === 'loading' && (
          <div class={ns.e('placeholder')}>
            {slots.placeholder ? slots.placeholder() : <span class={ns.e('loading')}>{loadingText.value}</span>}
          </div>
        )}
        {status.value === 'error' && (
          <div class={ns.e('error')}>
            {slots.error ? (
              slots.error()
            ) : props.fallback && !fallbackFailed.value ? (
              <img
                class={[ns.e('inner'), props.classNames?.image]}
                style={props.styles?.image}
                src={props.fallback}
                alt={props.alt}
                onError={onFallbackError}
              />
            ) : (
              <span>{errorText.value}</span>
            )}
          </div>
        )}
        {showSrc.value && (
          <img
            ref={imageRef}
            v-show={status.value !== 'error'}
            class={[ns.e('inner'), props.preview && ns.em('inner', 'preview'), props.classNames?.image]}
            style={[imgStyle.value, props.styles?.image] as any}
            src={showSrc.value}
            alt={props.alt}
            onLoad={onLoad}
            onError={onError}
            onClick={onClick}
            onKeydown={onImageKeydown}
            tabindex={props.preview && status.value === 'loaded' ? 0 : undefined}
            role={props.preview ? 'button' : undefined}
            aria-label={props.preview ? props.alt || '预览图片' : undefined}
          />
        )}

        {props.preview && (
          <Teleport to="body">
            <Transition name={`${ns.b()}-preview-fade`}>
              {previewVisible.value && (
                <div
                  class={[ns.e('preview-mask'), props.classNames?.previewMask]}
                  style={props.styles?.previewMask}
                  onClick={closePreview}
                >
                  <div class={ns.e('preview-toolbar')} onClick={(e: MouseEvent) => e.stopPropagation()}>
                    <button type="button" onClick={zoomOut} aria-label="zoom out">
                      −
                    </button>
                    <button type="button" onClick={reset} aria-label="reset">
                      ⟳
                    </button>
                    <button type="button" onClick={zoomIn} aria-label="zoom in">
                      +
                    </button>
                    <button ref={closeButtonRef} type="button" onClick={closePreview} aria-label="close">
                      ×
                    </button>
                  </div>
                  <img
                    class={ns.e('preview-img')}
                    src={props.src}
                    alt={props.alt}
                    style={{ transform: `scale(${scale.value})` }}
                    onClick={(e: MouseEvent) => e.stopPropagation()}
                  />
                </div>
              )}
            </Transition>
          </Teleport>
        )}
      </div>
    )
  },
})
