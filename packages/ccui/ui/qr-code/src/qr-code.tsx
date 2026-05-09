import type { CSSProperties, VNode } from 'vue'
import type { QRCodeErrorLevel, QRCodeProps } from './qr-code-types'
import qrcode from 'qrcode-generator'
import { computed, defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { qrCodeProps } from './qr-code-types'
import './qr-code.scss'

interface QRMatrix {
  count: number
  path: string
}

function buildMatrix(value: string, level: QRCodeErrorLevel): QRMatrix | null {
  if (!value) return null
  // typeNumber=0 让库自动选择最小可容纳的版本
  const qr = qrcode(0, level)
  qr.addData(value)
  qr.make()
  const count = qr.getModuleCount()
  let path = ''
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
  return { count, path }
}

export default defineComponent({
  name: 'CQRCode',
  props: qrCodeProps,
  emits: ['refresh'],
  setup(props: QRCodeProps, { emit, slots }) {
    const ns = useNamespace('qr-code')

    const matrix = computed(() => {
      try {
        return buildMatrix(props.value, props.errorLevel)
      } catch {
        // value 太长导致版本超出 40，或编码失败时降级到空 matrix
        return null
      }
    })

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

    function handleRefresh(): void {
      emit('refresh')
    }

    function renderSvg(): VNode {
      const m = matrix.value
      if (!m) {
        return h('svg', {
          class: ns.e('svg'),
          width: props.size,
          height: props.size,
          viewBox: '0 0 1 1',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
        })
      }
      return h(
        'svg',
        {
          class: ns.e('svg'),
          width: props.size,
          height: props.size,
          viewBox: `0 0 ${m.count} ${m.count}`,
          xmlns: 'http://www.w3.org/2000/svg',
          shapeRendering: 'crispEdges',
          'aria-hidden': 'true',
        },
        [h('path', { d: m.path, fill: props.color })],
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
