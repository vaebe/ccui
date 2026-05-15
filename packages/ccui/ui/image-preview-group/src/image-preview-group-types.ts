import type { ExtractPropTypes, PropType } from 'vue'

export interface ImagePreviewItem {
  src: string
  alt?: string
}

/**
 * `preview` 复合配置（受控模式）：
 *
 * - 不传：完全非受控，组件内部自己管 visible / current
 * - 传对象：受控模式，由父组件决定 visible / current；组件通过 `update:preview` 与 `change` 通知
 */
export interface ImagePreviewControl {
  visible?: boolean
  current?: number
}

export const imagePreviewGroupProps = {
  /**
   * 图片数组。
   *
   * - 传 `string[]`：每项作为 src，alt 为空。
   * - 传 `ImagePreviewItem[]`：每项 `{ src, alt? }`。
   *
   * 不传时则只渲染默认 slot，预览由父组件通过 `preview.visible / preview.current` 受控。
   */
  items: {
    type: Array as PropType<string[] | ImagePreviewItem[]>,
    default: undefined,
  },
  /**
   * 受控预览状态。详见 `ImagePreviewControl`。
   */
  preview: {
    type: Object as PropType<ImagePreviewControl>,
    default: undefined,
  },
  /**
   * 缩放上限。
   */
  maxZoom: {
    type: Number,
    default: 6,
  },
  /**
   * 缩放下限。
   */
  minZoom: {
    type: Number,
    default: 0.25,
  },
} as const

export type ImagePreviewGroupProps = ExtractPropTypes<typeof imagePreviewGroupProps>
