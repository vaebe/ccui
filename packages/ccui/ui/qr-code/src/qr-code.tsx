import type { CSSProperties, VNode } from 'vue'
import type { QRCodeErrorLevel, QRCodeExpose, QRCodeProps } from './qr-code-types'
import qrcode from 'qrcode-generator'
import { computed, defineComponent, h, shallowRef } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { qrCodeProps } from './qr-code-types'
import './qr-code.scss'

interface QRMatrix {
  count: number
  path: string
}

function buildMatrix(value: string, level: QRCodeErrorLevel, dotRadius = 0): QRMatrix | null {
  if (!value) return null
  const qr = qrcode(0, level)
  qr.addData(value)
  qr.make()
  const count = qr.getModuleCount()
  let path = ''
  const radius = Math.max(0, Math.min(0.5, dotRadius))

  if (radius <= 0) {
    // 方形模式：用 horizontal-run 合并优化 path 长度
    for (let r = 0; r < count; r++) {
      let col = 0
      while (col < count) {
        if (qr.isDark(r, col)) {
          let span = 1
          while (col + span < count && qr.isDark(r, col + span)) span++
          path += `M${col} ${r}h${span}v1h-${span}z`
          col += span
        } else {
          col++
        }
      }
    }
  } else {
    // 圆角模式：每个模块独立渲染圆角矩形
    const rx = radius
    const ry = radius
    for (let r = 0; r < count; r++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(r, col)) {
          // 圆角矩形 path：从左上角顺时针绘制
          path += `M${col + rx} ${r}`
          path += `h${1 - 2 * rx}`
          path += `a${rx} ${ry} 0 0 1 ${rx} ${ry}`
          path += `v${1 - 2 * ry}`
          path += `a${rx} ${ry} 0 0 1 -${rx} ${ry}`
          path += `h-${1 - 2 * rx}`
          path += `a${rx} ${ry} 0 0 1 -${rx} -${ry}`
          path += `v-${1 - 2 * ry}`
          path += `a${rx} ${ry} 0 0 1 ${rx} -${ry}z`
        }
      }
    }
  }
  return { count, path }
}

export default defineComponent({
  name: 'CQRCode',
  props: qrCodeProps,
  emits: ['refresh'],
  setup(props: QRCodeProps, { emit, slots, expose }) {
    const ns = useNamespace('qr-code')
    const svgRef = shallowRef<SVGSVGElement | null>(null)

    const matrix = computed(() => {
      try {
        return buildMatrix(props.value, props.errorLevel, props.dotRadius)
      } catch {
        return null
      }
    })

    const gradientId = 'ccui-qr-gradient'

    const iconClampedSize = computed(() => {
      // 限制 logo 不超过 30% 边长，避免覆盖到关键定位图形
      const max = Math.floor(props.size * 0.3)
      return Math.min(props.iconSize, max)
    })

    const containerStyle = computed<CSSProperties>(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`,
      backgroundColor: props.bgColor,
    }))

    function toDataURL(type = 'image/png', quality = 1): Promise<string> {
      return new Promise((resolve, reject) => {
        const svg = svgRef.value
        if (!svg) {
          resolve('')
          return
        }
        const xml = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = props.size
          canvas.height = props.size
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve('')
            return
          }
          ctx.drawImage(img, 0, 0, props.size, props.size)
          URL.revokeObjectURL(url)
          resolve(canvas.toDataURL(type, quality))
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('Failed to load SVG for canvas rendering'))
        }
        img.src = url
      })
    }

    expose<QRCodeExpose>({ toDataURL })

    function handleRefresh(): void {
      emit('refresh')
    }

    function renderSvg(): VNode {
      const m = matrix.value
      if (!m) {
        return h('svg', {
          ref: svgRef,
          class: ns.e('svg'),
          width: props.size,
          height: props.size,
          viewBox: '0 0 1 1',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
        })
      }

      const fillColor = props.gradient ? `url(#${gradientId})` : props.color
      const children: VNode[] = []

      if (props.gradient) {
        const { direction = 'to right', from, to } = props.gradient
        // 解析 direction 到 x1/y1/x2/y2
        const dirMap: Record<string, { x1: string; y1: string; x2: string; y2: string }> = {
          'to right': { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
          'to left': { x1: '100%', y1: '0%', x2: '0%', y2: '0%' },
          'to bottom': { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
          'to top': { x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
          'to bottom right': { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
          'to top left': { x1: '100%', y1: '100%', x2: '0%', y2: '0%' },
        }
        const coords = dirMap[direction] || dirMap['to right']
        children.push(
          h('defs', {}, [
            h('linearGradient', { id: gradientId, ...coords }, [
              h('stop', { offset: '0%', 'stop-color': from }),
              h('stop', { offset: '100%', 'stop-color': to }),
            ]),
          ]),
        )
      }

      children.push(h('path', { d: m.path, fill: fillColor }))

      return h(
        'svg',
        {
          ref: svgRef,
          class: ns.e('svg'),
          width: props.size,
          height: props.size,
          viewBox: `0 0 ${m.count} ${m.count}`,
          xmlns: 'http://www.w3.org/2000/svg',
          shapeRendering: props.dotRadius > 0 ? 'geometricPrecision' : 'crispEdges',
          'aria-hidden': 'true',
        },
        children,
      )
    }

    function renderIcon(): VNode | null {
      if (!props.icon) return null
      const size = iconClampedSize.value
      const iconStyle: CSSProperties = {
        width: `${size}px`,
        height: `${size}px`,
      }
      return h('div', { class: ns.e('icon'), style: iconStyle }, [
        h('img', { src: props.icon, alt: '', class: ns.e('icon-img') }),
      ])
    }

    function renderStatusOverlay(): VNode | null {
      if (props.status === 'active') return null
      if (slots.statusRender) {
        return h('div', { class: ns.e('mask') }, slots.statusRender({ status: props.status }))
      }
      const inner: VNode[] = []
      if (props.status === 'loading') {
        inner.push(h('span', { class: ns.e('spinner'), 'aria-label': 'loading' }))
      } else if (props.status === 'scanned') {
        inner.push(h('span', { class: ns.e('status-text') }, '已扫描'))
      } else if (props.status === 'expired') {
        inner.push(
          h('span', { class: ns.e('status-text') }, '二维码已过期'),
          h(
            'button',
            {
              type: 'button',
              class: ns.e('refresh'),
              onClick: handleRefresh,
            },
            props.refreshText,
          ),
        )
      }
      return h('div', { class: ns.e('mask') }, inner)
    }

    return () => {
      const rootClass = [ns.b(), props.bordered ? ns.is('bordered') : '', ns.em('status', props.status)]
      return h(
        'div',
        {
          class: rootClass,
          style: containerStyle.value,
          role: 'img',
          'aria-label': props.value,
        },
        [renderSvg(), renderIcon(), renderStatusOverlay()],
      )
    }
  },
})
