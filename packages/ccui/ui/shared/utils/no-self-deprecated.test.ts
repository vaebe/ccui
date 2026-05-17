/// <reference types="node" />
import { describe, expect, it } from 'vite-plus/test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// 防御库内部继续调用自己已 deprecated 的 prop —— 这类调用会让自己的运行时 deprecation
// warn 落到下游用户控制台（slider/dropdown 早期就踩过：5 条 [ccui] 警告非用户代码触发）。
//
// 新增 deprecation 时，请把废弃 prop 名加进 DEPRECATED_PATTERNS。同时确认 EXCLUDE_PATHS
// 已涵盖该 prop 的"声明地 / 实现地 / 测试地"三类合法位置。

const HERE = dirname(fileURLToPath(import.meta.url))
const UI_DIR = resolve(HERE, '../..') // packages/ccui/ui
const REPO_ROOT = resolve(HERE, '../../../../..')

interface Pattern {
  key: string
  replacement: string
  re: RegExp
}

const DEPRECATED_PATTERNS: Pattern[] = [
  // Tooltip / Popover
  { key: 'showArrow', replacement: 'arrow', re: /\bshowArrow=/ },
  { key: 'show-arrow', replacement: 'arrow', re: /\bshow-arrow=/ },
  { key: 'popperClass', replacement: 'overlayClassName', re: /\bpopperClass=/ },
  { key: 'popper-class', replacement: 'overlay-class-name', re: /\bpopper-class=/ },
  { key: 'showAfter', replacement: 'mouseEnterDelay', re: /\bshowAfter=/ },
  { key: 'show-after', replacement: 'mouse-enter-delay', re: /\bshow-after=/ },
  { key: 'hideAfter', replacement: 'mouseLeaveDelay', re: /\bhideAfter=/ },
  { key: 'hide-after', replacement: 'mouse-leave-delay', re: /\bhide-after=/ },
  { key: 'teleported', replacement: 'getPopupContainer', re: /\bteleported=/ },
]

// "content=" 这类太通用的字面量不可靠 (任何带 content prop 的组件都会假阳)，
// 不在这层防线扫，靠 code review + Tooltip 的运行时 warn 兜底。

const EXCLUDE_RE: RegExp[] = [
  /[\\/]test[\\/]/, // 组件自己的 test 目录
  /\.test\.(ts|tsx)$/,
  /-types\.ts$/, // 废弃 prop 在类型声明文件里登记
  /[\\/]shared[\\/]utils[\\/]deprecated\.ts$/, // 工具函数自身
  // Tooltip / Popover 内部 isPropExplicit 探测时会用到这些 prop 名作为字符串字面量，
  // 不会以 JSX 属性写法出现，但保险起见排除：
  /[\\/]tooltip[\\/]src[\\/]tooltip\.tsx$/,
  /[\\/]popover[\\/]src[\\/]popover\.tsx$/,
]

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === 'build') continue
    const full = resolve(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      walk(full, out)
    } else if (/\.(ts|tsx|vue)$/.test(name)) {
      out.push(full)
    }
  }
  return out
}

describe('packages/ccui internals: no self-deprecated prop usage', () => {
  it('库源码不再调用自家 deprecated 的 Tooltip/Popover prop', () => {
    const files = walk(UI_DIR).filter((f) => !EXCLUDE_RE.some((re) => re.test(f)))
    const violations: string[] = []
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n')
      for (const { key, replacement, re } of DEPRECATED_PATTERNS) {
        lines.forEach((line, idx) => {
          if (re.test(line)) {
            const rel = relative(REPO_ROOT, file)
            violations.push(`${rel}:${idx + 1}  uses deprecated prop "${key}" — replace with "${replacement}"`)
          }
        })
      }
    }
    expect(violations, `内部 deprecated prop 调用：\n${violations.join('\n')}`).toEqual([])
  })
})
