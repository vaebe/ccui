import type { CSSProperties, VNode } from 'vue'
import type { BorderBeamColor, BorderBeamColorStop, BorderBeamProps } from './border-beam-types'
import {
  cloneVNode,
  Comment,
  computed,
  defineComponent,
  Fragment,
  h,
  isVNode,
  onBeforeUnmount,
  onUpdated,
  ref,
  Teleport,
  Text,
  useAttrs,
  watch,
} from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { borderBeamProps, MAX_BEAM_COLOR_STOP_PERCENT } from './border-beam-types'
import './border-beam.scss'

const DEFAULT_DURATION = 6
const DEFAULT_BORDER_WIDTH = 1
const DEFAULT_BORDER_RADIUS = 8
const DEFAULT_SIZE = 100

/** 把有效数字补 px、保留非空 CSS 长度；无效值回退，避免生成 NaNpx。 */
function toLength(value: number | string | undefined, fallback: number, allowNegative = false): string {
  if (typeof value === 'number') {
    const valid = Number.isFinite(value) && (allowNegative || value >= 0)
    return `${valid ? value : fallback}px`
  }
  return typeof value === 'string' && value.trim() ? value : `${fallback}px`
}

/** count 只允许正有限数，并向下取整以稳定渲染节点数量。 */
function normalizeCount(value: number): number {
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1
}

/** duration 必须为正有限数，否则使用组件默认速度。 */
function normalizeDuration(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_DURATION
}

/** 将外扩长度转换为 inset 使用的负值。 */
function toInset(value: number | string): string {
  if (typeof value === 'number') return Number.isFinite(value) ? `${-value}px` : '0px'
  return value.trim() ? `calc(-1 * ${value})` : '0px'
}

/** 展开顶层 Fragment 并忽略注释、空白文本，供 asChild 校验唯一目标节点。 */
function getRenderableChildren(nodes: VNode[]): VNode[] {
  const result: VNode[] = []
  nodes.forEach((node) => {
    if (!isVNode(node) || node.type === Comment) return
    if (node.type === Text && (typeof node.children !== 'string' || !node.children.trim())) return
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...getRenderableChildren(node.children.filter(isVNode)))
      return
    }
    result.push(node)
  })
  return result
}

function normalizeColor(value?: BorderBeamColor): BorderBeamColorStop[] {
  if (typeof value === 'string') {
    return value ? [{ color: value, percent: 0 }] : []
  }
  return value ?? []
}

/** 末尾停靠点补到 100%，保证自定义渐变末端有可见拖尾 */
function fillGradientEnd(items: BorderBeamColorStop[]): BorderBeamColorStop[] {
  const last = items[items.length - 1]
  if (!last || last.percent === 100) {
    return items
  }
  return [...items, { ...last, percent: 100 }]
}

/** 把用户的 0~100 映射进光带前 70%（保留尾段淡出），按比例缩放而非硬裁剪 */
function mapStopPercent(percent: number): number {
  const clamped = Math.min(Math.max(percent, 0), 100)
  return Number(((clamped / 100) * MAX_BEAM_COLOR_STOP_PERCENT).toFixed(2))
}

/** 由单色或渐变停靠点构建光带渐变；无颜色时返回 undefined（由样式回退到主题主色） */
function getBorderBeamGradient(value?: BorderBeamColor): string | undefined {
  const stops = fillGradientEnd(normalizeColor(value)).map((item) => ({
    ...item,
    percent: mapStopPercent(item.percent),
  }))
  if (!stops.length) {
    return undefined
  }
  const colorStops = stops.map((item) => `${item.color} ${item.percent}%`).join(', ')
  return `linear-gradient(to left, ${colorStops}, transparent)`
}

export default defineComponent({
  name: 'CBorderBeam',
  // Keep caller attrs on the visual container while preserving the generated CSS variables.
  inheritAttrs: false,
  props: borderBeamProps,
  setup(props: BorderBeamProps, { slots }) {
    const ns = useNamespace('border-beam')
    const attrs = useAttrs()
    const childHost = ref<HTMLElement | null>(null)
    const childInset = ref('0px')
    let resizeObserver: ResizeObserver | undefined
    let mutationObserver: MutationObserver | undefined
    let warnedInvalidChild = false

    const beamGradient = computed(() => getBorderBeamGradient(props.color))

    const normalizedCount = computed(() => normalizeCount(props.count))
    const normalizedDuration = computed(() => normalizeDuration(props.duration))

    /** 包装模式保留原默认值；asChild 模式则允许圆角变量缺省并从宿主继承。 */
    const sharedEffectStyle = computed<CSSProperties>(() => {
      const vars: Record<string, string> = {
        '--ccui-bb-border-width': toLength(props.borderWidth, DEFAULT_BORDER_WIDTH),
        '--ccui-bb-size': toLength(props.size, DEFAULT_SIZE),
        '--ccui-bb-duration': `${normalizedDuration.value}s`,
      }
      if (props.borderRadius !== undefined)
        vars['--ccui-bb-radius'] = toLength(props.borderRadius, DEFAULT_BORDER_RADIUS)
      if (beamGradient.value) {
        vars['--ccui-bb-beam-gradient'] = beamGradient.value
      }
      return vars as CSSProperties
    })

    const rootStyle = computed<CSSProperties>(() => ({
      ...sharedEffectStyle.value,
      '--ccui-bb-outset': toLength(props.outset, 0, true),
      '--ccui-bb-radius': toLength(props.borderRadius, DEFAULT_BORDER_RADIUS),
    }))

    /** 读取真实宿主的四边边框，使未显式传 outset 时光束自动覆盖现有边框。 */
    const updateChildInset = () => {
      if (!childHost.value || props.outset !== undefined) return
      const style = getComputedStyle(childHost.value)
      const widths = [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth]
      childInset.value = widths.map((width) => `${-(Number.parseFloat(width) || 0)}px`).join(' ')
    }

    /** 宿主变化时重建轻量观察器，覆盖尺寸及 class/style 动态更新。 */
    const observeChildHost = (host: HTMLElement | null) => {
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
      resizeObserver = undefined
      mutationObserver = undefined
      childHost.value = host
      if (!host) {
        childInset.value = '0px'
        return
      }
      updateChildInset()
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(updateChildInset)
        resizeObserver.observe(host)
      }
      if (typeof MutationObserver !== 'undefined') {
        mutationObserver = new MutationObserver(updateChildInset)
        mutationObserver.observe(host, { attributes: true, attributeFilter: ['class', 'style'] })
      }
    }

    /** VNode 生命周期可同时解析原生元素和单根组件最终对应的 HTMLElement。 */
    const syncChildHost = (vnode: VNode) => {
      const element = vnode.el
      if (!(element instanceof HTMLElement)) {
        observeChildHost(null)
        if (!warnedInvalidChild) {
          console.warn('[ccui BorderBeam] asChild 的插槽根节点必须渲染为 HTMLElement。')
          warnedInvalidChild = true
        }
        return
      }
      warnedInvalidChild = false
      observeChildHost(element)
    }

    watch(
      () => props.outset,
      (outset) => {
        if (outset === undefined) updateChildInset()
      },
    )
    watch(
      () => props.asChild,
      (asChild) => {
        if (!asChild) observeChildHost(null)
      },
    )

    onBeforeUnmount(() => observeChildHost(null))
    // 插槽的响应式 class/style 会在本组件更新后落到真实元素，此时重新读取最终计算值。
    onUpdated(updateChildInset)

    /** 每条光束共享几何变量，只通过负延迟均匀分布在路径上。 */
    const renderEffects = (asChild: boolean) =>
      Array.from({ length: normalizedCount.value }, (_, index) => {
        const delay = index > 0 ? `${(-normalizedDuration.value * index) / normalizedCount.value}s` : '0s'
        const style = {
          ...sharedEffectStyle.value,
          '--ccui-bb-delay': delay,
          ...(asChild && {
            '--ccui-bb-inset-offset': props.outset === undefined ? childInset.value : toInset(props.outset),
          }),
        } as CSSProperties
        return h('div', {
          key: index,
          class: [ns.e('effect'), asChild && ns.em('effect', 'child')],
          style,
          'aria-hidden': 'true',
        })
      })

    return () => {
      if (!props.asChild) {
        return h('div', { ...attrs, class: [ns.b(), attrs.class], style: [attrs.style, rootStyle.value] }, [
          slots.default?.(),
          ...renderEffects(false),
        ])
      }

      const children = getRenderableChildren(slots.default?.() ?? [])
      if (children.length !== 1 || children[0].type === Text) {
        if (!warnedInvalidChild) {
          console.warn('[ccui BorderBeam] asChild 需要唯一的元素或单根组件插槽。')
          warnedInvalidChild = true
        }
        return children
      }
      warnedInvalidChild = false

      const child = cloneVNode(
        children[0],
        {
          ...attrs,
          onVnodeMounted: syncChildHost,
          onVnodeUpdated: syncChildHost,
          onVnodeBeforeUnmount: () => observeChildHost(null),
        },
        true,
      )
      return h(Fragment, null, [
        child,
        childHost.value ? h(Teleport, { to: childHost.value }, renderEffects(true)) : null,
      ])
    }
  },
})
