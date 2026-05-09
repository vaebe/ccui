import type { ExtractPropTypes, PropType } from 'vue'

export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'
export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanned'

export const qrCodeProps = {
  // 二维码内容（文本 / URL）
  value: {
    type: String,
    required: true as const,
  },
  // 边长（包含 padding，单位 px）
  size: {
    type: Number,
    default: 160,
  },
  // 前景色（深色模块色）
  color: {
    type: String,
    default: '#000000',
  },
  // 背景色
  bgColor: {
    type: String,
    default: '#FFFFFF',
  },
  // 容错率：L=7% / M=15% / Q=25% / H=30%
  errorLevel: {
    type: String as PropType<QRCodeErrorLevel>,
    default: 'M',
  },
  // 是否显示外边框（白底 + 1px 边）
  bordered: {
    type: Boolean,
    default: true,
  },
  // 中心 logo 图片地址
  icon: {
    type: String,
    default: '',
  },
  // logo 边长（px），居中正方形覆盖
  iconSize: {
    type: Number,
    default: 40,
  },
  // 状态：active 正常 / expired 过期 / loading 加载 / scanned 已扫描
  status: {
    type: String as PropType<QRCodeStatus>,
    default: 'active',
  },
  // 「点击刷新」文案，仅 status='expired' 时显示
  refreshText: {
    type: String,
    default: '点击刷新',
  },
  // 圆角半径（0 = 方形，0.5 = 正圆），取值 0~0.5
  dotRadius: {
    type: Number,
    default: 0,
  },
  // 渐变前景色配置，传入后 color 仅作为 fallback
  gradient: {
    type: Object as PropType<{ type?: 'linear'; direction?: string; from: string; to: string }>,
    default: undefined,
  },
} as const

export interface QRCodeExpose {
  toDataURL: (type?: string, quality?: number) => Promise<string>
}

export type QRCodeProps = ExtractPropTypes<typeof qrCodeProps>
