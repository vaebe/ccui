import type { ExtractPropTypes, PropType } from 'vue'

export type CarouselDotPosition = 'top' | 'bottom' | 'left' | 'right'
export type CarouselEffect = 'scrollx' | 'fade'

export interface CarouselExpose {
  goTo: (index: number, dontAnimate?: boolean) => void
  next: () => void
  prev: () => void
}

export const carouselProps = {
  // 受控当前激活索引
  modelValue: {
    type: Number,
    default: undefined,
  },
  // 非受控默认索引
  defaultActive: {
    type: Number,
    default: 0,
  },
  // 是否自动播放
  autoplay: {
    type: Boolean,
    default: false,
  },
  // 自动播放间隔（毫秒）
  autoplaySpeed: {
    type: Number,
    default: 3000,
  },
  // 是否显示指示器
  dots: {
    type: Boolean,
    default: true,
  },
  // 指示器位置
  dotPosition: {
    type: String as PropType<CarouselDotPosition>,
    default: 'bottom',
  },
  // 切换效果
  effect: {
    type: String as PropType<CarouselEffect>,
    default: 'scrollx',
  },
  // 是否循环播放（到末尾后回到开头 / 到开头前跳到末尾）
  infinite: {
    type: Boolean,
    default: true,
  },
  // 是否显示前后切换箭头
  arrows: {
    type: Boolean,
    default: false,
  },
  // hover 时暂停 autoplay
  pauseOnHover: {
    type: Boolean,
    default: true,
  },
  // 切换动画时长（毫秒）
  duration: {
    type: Number,
    default: 500,
  },
} as const

export type CarouselProps = ExtractPropTypes<typeof carouselProps>
