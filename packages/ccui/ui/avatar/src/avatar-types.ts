import type { ExtractPropTypes } from 'vue';

export const avatarProps = {
  name: {
    type: String,
    default: null
  },
  gender: {
    type: String as () => 'male' | 'female' | string,
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
    type: String as () => 'fill' | 'contain' | 'cover' | 'none' | 'scale-down',
    default: 'cover'
  }
} as const;

export type AvatarProps = ExtractPropTypes<typeof avatarProps>;