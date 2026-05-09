import type { ExtractPropTypes, PropType } from 'vue'

export type MentionsPlacement = 'top' | 'bottom'

export interface MentionOption {
  value: string
  label?: string
  disabled?: boolean
  [extra: string]: unknown
}

export type MentionsSourceItem = string | MentionOption

export type FilterOption = boolean | ((input: string, option: MentionOption) => boolean)

export const mentionsProps = {
  modelValue: {
    type: String as PropType<string | null>,
    default: undefined,
  },
  defaultValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array as PropType<MentionsSourceItem[]>,
    default: () => [],
  },
  // 触发字符，单个或多个；输入此字符后后跟非空白字符即弹出浮层
  prefix: {
    type: [String, Array] as PropType<string | string[]>,
    default: '@',
  },
  // 选中后追加的分隔符
  split: {
    type: String,
    default: ' ',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 3,
  },
  filterOption: {
    type: [Boolean, Function] as PropType<FilterOption>,
    default: true,
  },
  caseSensitive: {
    type: Boolean,
    default: false,
  },
  notFoundContent: {
    type: String,
    default: '暂无数据',
  },
  placement: {
    type: String as PropType<MentionsPlacement>,
    default: 'bottom',
  },
  popupMaxHeight: {
    type: Number,
    default: 256,
  },
} as const

export type MentionsProps = ExtractPropTypes<typeof mentionsProps>

export interface NormalizedOption {
  value: string
  label: string
  disabled: boolean
  raw: MentionOption
}

export function normalizeMention(item: MentionsSourceItem): NormalizedOption {
  if (typeof item === 'string') {
    return { value: item, label: item, disabled: false, raw: { value: item, label: item } }
  }
  return {
    value: item.value,
    label: item.label !== undefined ? String(item.label) : item.value,
    disabled: !!item.disabled,
    raw: item,
  }
}

// 在文本 cursorPos 之前找最后一个 prefix；要求 prefix 紧跟着光标的内容里没有空白。
// 返回 { prefix, search, start } 或 null。
export interface MentionMatch {
  prefix: string
  search: string
  start: number
}

export function findActiveMention(text: string, cursorPos: number, prefixes: string[]): MentionMatch | null {
  // 取光标前的子串
  const before = text.slice(0, cursorPos)
  let best: MentionMatch | null = null
  for (const prefix of prefixes) {
    const idx = before.lastIndexOf(prefix)
    if (idx === -1) continue
    // prefix 之前必须是字符串开头或空白字符（否则像 email 里的 @ 不应触发）
    const prevChar = before[idx - 1]
    if (idx > 0 && prevChar !== undefined && !/\s/.test(prevChar)) continue
    const between = before.slice(idx + prefix.length)
    if (/\s/.test(between)) continue // prefix 之后到光标之间不能有空白
    const candidate: MentionMatch = { prefix, search: between, start: idx }
    if (!best || candidate.start > best.start) {
      best = candidate
    }
  }
  return best
}
