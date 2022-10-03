import type { ExtractPropTypes, PropType } from 'vue';

export type FitType = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
export type GenderType = 'male' | 'female' | string;

export const avatarProps = {
  name: {
    type: String,
    default: null
  },
  gender: {
    type: String as PropType<GenderType>,
    default: null
  },
  width: {
    type: Number,
    default: 36
  },
  height: {
    type: Number,
    default: 36
  },
  isRound: {
    type: Boolean,
    default: true
  },
  imgSrc: {
    type: String,
    default: ''
  },
  customText: {
    type: String,
    default: null
  },
  fit: {
    type: String as PropType<FitType>,
    default: 'cover'
  }
} as const;

export type AvatarProps = ExtractPropTypes<typeof avatarProps>;
