// HEX / RGB / HSV 互转工具，所有 alpha 取值范围 [0, 1]。
// HSV: h ∈ [0, 360)，s/v ∈ [0, 100]；RGB: r/g/b ∈ [0, 255]。

export interface RGB {
  r: number
  g: number
  b: number
  a: number
}

export interface HSV {
  h: number
  s: number
  v: number
  a: number
}

const HEX3_RE = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i
const HEX4_RE = /^#?([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])$/i
const HEX6_RE = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
const HEX8_RE = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min
  if (n < min) return min
  if (n > max) return max
  return n
}

function pad2(n: number): string {
  const s = Math.round(n).toString(16)
  return s.length === 1 ? `0${s}` : s
}

// 解析 hex 字符串 → RGB；不可识别返回 null。
export function hexToRgb(hex: string): RGB | null {
  if (!hex || typeof hex !== 'string') return null
  const trimmed = hex.trim()

  let m = HEX8_RE.exec(trimmed)
  if (m) {
    return {
      r: Number.parseInt(m[1], 16),
      g: Number.parseInt(m[2], 16),
      b: Number.parseInt(m[3], 16),
      a: Math.round((Number.parseInt(m[4], 16) / 255) * 100) / 100,
    }
  }
  m = HEX6_RE.exec(trimmed)
  if (m) {
    return {
      r: Number.parseInt(m[1], 16),
      g: Number.parseInt(m[2], 16),
      b: Number.parseInt(m[3], 16),
      a: 1,
    }
  }
  m = HEX4_RE.exec(trimmed)
  if (m) {
    return {
      r: Number.parseInt(m[1] + m[1], 16),
      g: Number.parseInt(m[2] + m[2], 16),
      b: Number.parseInt(m[3] + m[3], 16),
      a: Math.round((Number.parseInt(m[4] + m[4], 16) / 255) * 100) / 100,
    }
  }
  m = HEX3_RE.exec(trimmed)
  if (m) {
    return {
      r: Number.parseInt(m[1] + m[1], 16),
      g: Number.parseInt(m[2] + m[2], 16),
      b: Number.parseInt(m[3] + m[3], 16),
      a: 1,
    }
  }
  return null
}

// RGB → hex；alpha < 1 时输出 8 位 hex。
export function rgbToHex(rgb: RGB, includeAlpha = false): string {
  const r = pad2(clamp(rgb.r, 0, 255))
  const g = pad2(clamp(rgb.g, 0, 255))
  const b = pad2(clamp(rgb.b, 0, 255))
  if (includeAlpha || rgb.a < 1) {
    const a = pad2(clamp(Math.round(rgb.a * 255), 0, 255))
    return `#${r}${g}${b}${a}`
  }
  return `#${r}${g}${b}`
}

export function rgbToHsv(rgb: RGB): HSV {
  const r = clamp(rgb.r, 0, 255) / 255
  const g = clamp(rgb.g, 0, 255) / 255
  const b = clamp(rgb.b, 0, 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : Math.round((delta / max) * 100)
  const v = Math.round(max * 100)
  return { h, s, v, a: clamp(rgb.a, 0, 1) }
}

export function hsvToRgb(hsv: HSV): RGB {
  const h = ((hsv.h % 360) + 360) % 360
  const s = clamp(hsv.s, 0, 100) / 100
  const v = clamp(hsv.v, 0, 100) / 100
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: clamp(hsv.a, 0, 1),
  }
}

export function rgbToString(rgb: RGB, includeAlpha = false): string {
  const r = Math.round(clamp(rgb.r, 0, 255))
  const g = Math.round(clamp(rgb.g, 0, 255))
  const b = Math.round(clamp(rgb.b, 0, 255))
  if (includeAlpha || rgb.a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${Math.round(rgb.a * 100) / 100})`
  }
  return `rgb(${r}, ${g}, ${b})`
}

export function hsvToString(hsv: HSV): string {
  const h = Math.round(((hsv.h % 360) + 360) % 360)
  const s = Math.round(clamp(hsv.s, 0, 100))
  const v = Math.round(clamp(hsv.v, 0, 100))
  if (hsv.a < 1) {
    return `hsva(${h}, ${s}%, ${v}%, ${Math.round(hsv.a * 100) / 100})`
  }
  return `hsv(${h}, ${s}%, ${v}%)`
}

// 安全解析任意输入字符串到 RGB；只支持 hex 形态，rgb()/hsv() 字符串不在 80% 范围内。
export function parseColor(input: string | null | undefined): RGB | null {
  if (!input) return null
  return hexToRgb(input)
}

export const DEFAULT_COLOR_HEX = '#1677ff'
