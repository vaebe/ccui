import type { WatermarkFont, WatermarkProps } from './watermark-types'
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { watermarkProps } from './watermark-types'
import './watermark.scss'

interface ResolvedFont {
  color: string
  fontSize: number
  fontWeight: NonNullable<WatermarkFont['fontWeight']>
  fontStyle: NonNullable<WatermarkFont['fontStyle']>
  fontFamily: string
}

const FONT_DEFAULTS: ResolvedFont = {
  color: 'rgba(0, 0, 0, 0.15)',
  fontSize: 16,
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontFamily: 'sans-serif',
}

const WATERMARK_TAG = 'data-ccui-watermark'

function getRatio() {
  return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1
}

function buildStyleString(
  zIndex: number,
  gap: [number, number],
  offset: [number, number] | undefined,
  dataUrl: string,
  size: { width: number; height: number },
): string {
  const [gapX, gapY] = gap
  const offsetLeft = offset?.[0] ?? gapX / 2
  const offsetTop = offset?.[1] ?? gapY / 2
  const bgWidth = size.width + gapX
  const bgHeight = size.height + gapY
  return [
    'position: absolute',
    'inset: 0',
    'pointer-events: none',
    `z-index: ${zIndex}`,
    `background-image: url('${dataUrl}')`,
    `background-size: ${bgWidth}px ${bgHeight}px`,
    `background-position: ${offsetLeft}px ${offsetTop}px`,
    'background-repeat: repeat',
  ].join(';')
}

function drawText(ctx: CanvasRenderingContext2D, lines: string[], width: number, height: number, font: ResolvedFont) {
  const fontSize = font.fontSize
  ctx.font = `${font.fontStyle} ${font.fontWeight} ${fontSize}px ${font.fontFamily}`
  ctx.fillStyle = font.color
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const lineHeight = fontSize + 4
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight)
  })
}

export default defineComponent({
  name: 'CWatermark',
  props: watermarkProps,
  setup(props: WatermarkProps, { slots }) {
    const ns = useNamespace('watermark')
    const containerRef = ref<HTMLDivElement>()
    const watermarkEl = ref<HTMLDivElement | null>(null)
    let observer: MutationObserver | null = null

    const generateBase64 = async (): Promise<{ url: string; size: { width: number; height: number } } | null> => {
      const ratio = getRatio()
      const canvas = document.createElement('canvas')
      let ctx: CanvasRenderingContext2D | null = null
      try {
        ctx = canvas.getContext('2d')
      } catch {
        ctx = null
      }
      if (!ctx) {
        return null
      }
      const w = props.width * ratio
      const h = props.height * ratio
      canvas.width = w
      canvas.height = h

      ctx.translate(w / 2, h / 2)
      ctx.rotate((Math.PI / 180) * props.rotate)
      ctx.translate(-w / 2, -h / 2)
      ctx.scale(ratio, ratio)

      const font = { ...FONT_DEFAULTS, ...props.font }

      if (props.image) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = reject
            img.src = props.image
          })
          ctx.drawImage(img, 0, 0, props.width, props.height)
        } catch {
          // fallback to text
          const text = Array.isArray(props.content) ? props.content : [props.content]
          drawText(ctx, text.filter(Boolean) as string[], props.width, props.height, font)
        }
      } else {
        const text = Array.isArray(props.content) ? props.content : [props.content]
        drawText(ctx, text.filter(Boolean) as string[], props.width, props.height, font)
      }

      return {
        url: canvas.toDataURL(),
        size: { width: props.width, height: props.height },
      }
    }

    const renderWatermark = async () => {
      if (!containerRef.value) {
        return
      }
      const result = await generateBase64()
      if (!watermarkEl.value) {
        watermarkEl.value = document.createElement('div')
        watermarkEl.value.setAttribute(WATERMARK_TAG, '1')
        containerRef.value.appendChild(watermarkEl.value)
      }
      const styleStr = result
        ? buildStyleString(props.zIndex, props.gap, props.offset, result.url, result.size)
        : `position: absolute; inset: 0; pointer-events: none; z-index: ${props.zIndex};`
      watermarkEl.value.setAttribute('style', styleStr)
      observe()
    }

    let updatingFromObserver = false
    const observe = () => {
      if (!containerRef.value || observer) {
        return
      }
      if (typeof MutationObserver === 'undefined') {
        return
      }
      observer = new MutationObserver((mutations) => {
        if (updatingFromObserver) {
          return
        }
        let needRebuild = false
        for (const m of mutations) {
          // 节点被删
          m.removedNodes.forEach((n) => {
            if (n === watermarkEl.value) {
              needRebuild = true
            }
          })
        }
        if (needRebuild) {
          updatingFromObserver = true
          watermarkEl.value?.remove()
          watermarkEl.value = null
          renderWatermark().finally(() => {
            updatingFromObserver = false
          })
        }
      })
      observer.observe(containerRef.value, {
        childList: true,
      })
    }

    onMounted(() => {
      renderWatermark()
    })
    onBeforeUnmount(() => {
      observer?.disconnect()
      observer = null
      watermarkEl.value?.remove()
      watermarkEl.value = null
    })

    watch(
      () => [
        props.content,
        props.image,
        props.width,
        props.height,
        props.rotate,
        props.gap,
        props.offset,
        props.zIndex,
        props.font,
      ],
      () => {
        renderWatermark()
      },
      { deep: true },
    )

    return () => (
      <div ref={containerRef} class={ns.b()}>
        {slots.default?.()}
      </div>
    )
  },
})
