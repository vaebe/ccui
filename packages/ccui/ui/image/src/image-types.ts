import type { ExtractPropTypes, PropType } from 'vue'

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
} as const

export type ImageProps = ExtractPropTypes<typeof imageProps>
