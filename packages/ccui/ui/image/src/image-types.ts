import type { ExtractPropTypes, PropType } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

export const imageProps = {
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  fit: {
    type: String as PropType<ImageFit>,
    default: 'fill' as ImageFit,
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: '',
  },
  height: {
    type: [Number, String] as PropType<number | string>,
    default: '',
  },
  preview: {
    type: Boolean,
    default: false,
  },
  fallback: {
    type: String,
    default: '',
  },
  lazy: {
    type: Boolean,
    default: false,
  },
  rootMargin: {
    type: String,
    default: '0px',
  },
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `image` / `previewMask`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * 语义化 DOM style 注入。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type ImageProps = ExtractPropTypes<typeof imageProps>
