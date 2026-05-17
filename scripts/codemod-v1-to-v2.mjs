#!/usr/bin/env node
/**
 * codemod-v1-to-v2.mjs
 *
 * 把 ccui v1 旧 prop 名自动改写为 v2 新 prop 名。
 *
 * 用法：
 *   node scripts/codemod-v1-to-v2.mjs "<glob>" [--apply] [--verbose]
 *
 * - 默认 dry-run：打印 diff 概要，不写盘
 * - --apply：写回文件
 * - --verbose：打印每条匹配
 *
 * 映射表见 scripts/CODEMOD.md（共 26 条）。
 * 零运行时依赖：仅用 node:fs / node:path / node:url。
 */

import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs'
import { resolve, relative, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// ─────────────────────────────────────────────────────────────────────────────
// 标签匹配辅助
// ─────────────────────────────────────────────────────────────────────────────
//
// 所有组件标签同时兼容 kebab-case 和 PascalCase 两种形式：
//   <c-modal ...>      与 <CModal ...>
//   <c-form-item ...>  与 <CFormItem ...>
//
// 由于 Vue template 中组件名严格区分这两种形式但语义相同，本脚本不区分大小写。
function tagPattern(kebab) {
  // 接收 kebab-case 名（不含尖括号、不含 c- 前缀），返回匹配标签开头的正则片段
  // 例：'modal' → '(?:c-modal|CModal)'
  const pascal = 'C' + kebab.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
  return `(?:c-${kebab}|${pascal})`
}

// 在一个元素开标签的 attribute 区域内，把旧 attr 名换成新 attr 名（同时处理 `:` 绑定形式）
// 元素开标签：从 `<TagPattern` 起，到首个未在引号内的 `>` 结束（不处理跨多文件的复杂情形）
function renameAttrInTag(source, tagRe, oldName, newName) {
  // tagRe 必须是匹配 `<tag` 开头（不带 `<`）的字符串 / 已编入捕获组的片段
  // 我们用一个统一逻辑：枚举所有 `<TagPattern...>` 开标签区段，做替换
  const openTagRe = new RegExp(`<${tagRe}\\b([^>]*)>`, 'g')
  return source.replace(openTagRe, (full, attrs) => {
    let next = attrs
    // 普通形式：oldName="..."
    next = next.replace(
      new RegExp(`(\\s)${escapeRegex(oldName)}(\\s*=\\s*)`, 'g'),
      `$1${newName}$2`,
    )
    // 绑定形式：:oldName="..."
    next = next.replace(
      new RegExp(`(\\s):${escapeRegex(oldName)}(\\s*=\\s*)`, 'g'),
      `$1:${newName}$2`,
    )
    // 短命名（无值）形式：<tag oldName>
    next = next.replace(
      new RegExp(`(\\s)${escapeRegex(oldName)}(\\s|/|$)`, 'g'),
      `$1${newName}$2`,
    )
    return `<${full.slice(1, full.length - attrs.length - 1)}${next}>`
  })
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ─────────────────────────────────────────────────────────────────────────────
// 单条 transform：对一个 (tag, oldName, newName) 应用普通改名
// ─────────────────────────────────────────────────────────────────────────────
function renameAttr(source, tagKebab, oldName, newName) {
  const tagRe = tagPattern(tagKebab)
  return renameAttrInTag(source, tagRe, oldName, newName)
}

// ─────────────────────────────────────────────────────────────────────────────
// 特殊 transform
// ─────────────────────────────────────────────────────────────────────────────

// Modal: hideFooter (boolean) → :footer="null"
// 形式：
//   <c-modal hide-footer>            → <c-modal :footer="null">
//   <c-modal :hide-footer="true">    → <c-modal :footer="null">
//   <c-modal hide-footer="true">     → <c-modal :footer="null">
//   <CModal hideFooter ...>          → <CModal :footer="null" ...>
function transformModalHideFooter(source) {
  const tagRe = tagPattern('modal')
  const openTagRe = new RegExp(`(<${tagRe}\\b)([^>]*)(>)`, 'g')
  return source.replace(openTagRe, (full, head, attrs, tail) => {
    let next = attrs
    // :hide-footer="true" 或 :hideFooter="true" / =true
    next = next.replace(
      /(\s):(?:hide-footer|hideFooter)\s*=\s*"(?:true|"\s*true)"/g,
      '$1:footer="null"',
    )
    // hide-footer="true"
    next = next.replace(
      /(\s)(?:hide-footer|hideFooter)\s*=\s*"true"/g,
      '$1:footer="null"',
    )
    // 短命名 <c-modal hide-footer>
    next = next.replace(
      /(\s)(?:hide-footer|hideFooter)(\s|\/|$)/g,
      '$1:footer="null"$2',
    )
    return `${head}${next}${tail}`
  })
}

// Drawer: showFooter — 不自动转，插入 TODO 注释
function transformDrawerShowFooter(source) {
  const tagRe = tagPattern('drawer')
  const openTagRe = new RegExp(`(<${tagRe}\\b)([^>]*)(>)`, 'g')
  const TODO = '<!-- TODO: codemod: showFooter prop removed; move footer content into <template #footer> slot -->\n'
  return source.replace(openTagRe, (full, head, attrs, tail, offset) => {
    const hasShowFooter = /(?:^|\s)(?::?show-footer|:?showFooter)(\s|=|\/|$)/.test(attrs)
    if (!hasShowFooter) return full
    // 在该开标签前插入 TODO 注释（保留原 attribute 不删，让人工处理）
    return `${TODO}${full}`
  })
}

// Button: 单独 boolean round/circle → shape="round"/shape="circle"
function transformButtonShape(source) {
  const tagRe = tagPattern('button')
  const openTagRe = new RegExp(`(<${tagRe}\\b)([^>]*)(>)`, 'g')
  return source.replace(openTagRe, (full, head, attrs, tail) => {
    let next = attrs
    let shape = null
    // 检测 round
    if (/(\s)(?::round\s*=\s*"true"|round\s*=\s*"true"|round(?=\s|\/|$))/.test(next)) {
      shape = 'round'
      next = next.replace(/(\s):round\s*=\s*"true"/g, '')
      next = next.replace(/(\s)round\s*=\s*"true"/g, '')
      next = next.replace(/(\s)round(?=\s|\/|$)/g, '')
    }
    // 检测 circle
    if (/(\s)(?::circle\s*=\s*"true"|circle\s*=\s*"true"|circle(?=\s|\/|$))/.test(next)) {
      shape = 'circle'
      next = next.replace(/(\s):circle\s*=\s*"true"/g, '')
      next = next.replace(/(\s)circle\s*=\s*"true"/g, '')
      next = next.replace(/(\s)circle(?=\s|\/|$)/g, '')
    }
    if (shape) {
      next = next.replace(/\s+$/, '')
      next = `${next} shape="${shape}"`
    }
    return `${head}${next}${tail}`
  })
}

// Button: boolean plain → variant="filled" (近似)
function transformButtonPlain(source) {
  const tagRe = tagPattern('button')
  const openTagRe = new RegExp(`(<${tagRe}\\b)([^>]*)(>)`, 'g')
  return source.replace(openTagRe, (full, head, attrs, tail) => {
    let next = attrs
    let hit = false
    if (/(\s):plain\s*=\s*"true"/.test(next)) {
      hit = true
      next = next.replace(/(\s):plain\s*=\s*"true"/g, '')
    }
    if (/(\s)plain\s*=\s*"true"/.test(next)) {
      hit = true
      next = next.replace(/(\s)plain\s*=\s*"true"/g, '')
    }
    if (/(\s)plain(?=\s|\/|$)/.test(next)) {
      hit = true
      next = next.replace(/(\s)plain(?=\s|\/|$)/g, '')
    }
    if (hit) {
      next = next.replace(/\s+$/, '')
      next = `${next} variant="filled"`
    }
    return `${head}${next}${tail}`
  })
}

// Tag: :bordered="false" → variant="filled"
function transformTagBordered(source) {
  const tagRe = tagPattern('tag')
  const openTagRe = new RegExp(`(<${tagRe}\\b)([^>]*)(>)`, 'g')
  return source.replace(openTagRe, (full, head, attrs, tail) => {
    let next = attrs
    let hit = false
    if (/(\s):bordered\s*=\s*"false"/.test(next)) {
      hit = true
      next = next.replace(/(\s):bordered\s*=\s*"false"/g, '')
    }
    if (/(\s)bordered\s*=\s*"false"/.test(next)) {
      hit = true
      next = next.replace(/(\s)bordered\s*=\s*"false"/g, '')
    }
    if (hit) {
      next = next.replace(/\s+$/, '')
      next = `${next} variant="filled"`
    }
    return `${head}${next}${tail}`
  })
}

// InputNumber.size: "lg"/"md"/"sm" → "large"/"default"/"small"
function transformInputNumberSize(source) {
  const tagRe = tagPattern('input-number')
  const openTagRe = new RegExp(`(<${tagRe}\\b)([^>]*)(>)`, 'g')
  return source.replace(openTagRe, (full, head, attrs, tail) => {
    let next = attrs
      .replace(/(\s)size\s*=\s*"lg"/g, '$1size="large"')
      .replace(/(\s)size\s*=\s*"md"/g, '$1size="default"')
      .replace(/(\s)size\s*=\s*"sm"/g, '$1size="small"')
    return `${head}${next}${tail}`
  })
}

// ColorPicker: format="hsv" → format="hsb"
function transformColorPickerFormat(source) {
  const tagRe = tagPattern('color-picker')
  const openTagRe = new RegExp(`(<${tagRe}\\b)([^>]*)(>)`, 'g')
  return source.replace(openTagRe, (full, head, attrs, tail) => {
    const next = attrs.replace(/(\s)format\s*=\s*"hsv"/g, '$1format="hsb"')
    return `${head}${next}${tail}`
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 主 transform：按 26 条映射顺序应用
// ─────────────────────────────────────────────────────────────────────────────
export function transform(source, filePath = '<input>') {
  let out = source

  // 1. Modal okLoading → confirmLoading
  out = renameAttr(out, 'modal', 'okLoading', 'confirmLoading')
  out = renameAttr(out, 'modal', 'ok-loading', 'confirm-loading')

  // 2. Modal hideFooter → :footer="null"
  out = transformModalHideFooter(out)

  // 3. Drawer showFooter → 插 TODO 注释
  out = transformDrawerShowFooter(out)

  // 4-8. Tooltip 5 条
  out = renameAttr(out, 'tooltip', 'content', 'title')
  out = renameAttr(out, 'tooltip', 'showArrow', 'arrow')
  out = renameAttr(out, 'tooltip', 'show-arrow', 'arrow')
  out = renameAttr(out, 'tooltip', 'showAfter', 'mouseEnterDelay')
  out = renameAttr(out, 'tooltip', 'show-after', 'mouse-enter-delay')
  out = renameAttr(out, 'tooltip', 'hideAfter', 'mouseLeaveDelay')
  out = renameAttr(out, 'tooltip', 'hide-after', 'mouse-leave-delay')
  out = renameAttr(out, 'tooltip', 'popperClass', 'overlayClassName')
  out = renameAttr(out, 'tooltip', 'popper-class', 'overlay-class-name')

  // 9-13. Popover 5 条
  out = renameAttr(out, 'popover', 'showArrow', 'arrow')
  out = renameAttr(out, 'popover', 'show-arrow', 'arrow')
  out = renameAttr(out, 'popover', 'showAfter', 'mouseEnterDelay')
  out = renameAttr(out, 'popover', 'show-after', 'mouse-enter-delay')
  out = renameAttr(out, 'popover', 'hideAfter', 'mouseLeaveDelay')
  out = renameAttr(out, 'popover', 'hide-after', 'mouse-leave-delay')
  out = renameAttr(out, 'popover', 'popperClass', 'overlayClassName')
  out = renameAttr(out, 'popover', 'popper-class', 'overlay-class-name')
  out = renameAttr(out, 'popover', 'teleported', 'getPopupContainer')

  // 14-15. Popconfirm 2 条
  out = renameAttr(out, 'popconfirm', 'confirmText', 'okText')
  out = renameAttr(out, 'popconfirm', 'confirm-text', 'ok-text')
  out = renameAttr(out, 'popconfirm', 'confirmType', 'okType')
  out = renameAttr(out, 'popconfirm', 'confirm-type', 'ok-type')

  // 16-19. Button 4 条
  out = renameAttr(out, 'button', 'nativeType', 'htmlType')
  out = renameAttr(out, 'button', 'native-type', 'html-type')
  out = transformButtonShape(out) // round + circle → shape
  out = transformButtonPlain(out) // plain → variant="filled"

  // 20-22. Input 3 条
  out = renameAttr(out, 'input', 'clearable', 'allowClear')
  out = renameAttr(out, 'input', 'prepend', 'addonBefore')
  out = renameAttr(out, 'input', 'append', 'addonAfter')

  // 23-25. InputNumber.size 3 条（合并实现）
  out = transformInputNumberSize(out)

  // 26. Tag :bordered="false" → variant="filled"
  out = transformTagBordered(out)

  // 27. ColorPicker format="hsv" → "hsb"
  out = transformColorPickerFormat(out)

  // 28. FormItem prop → name
  out = renameAttr(out, 'form-item', 'prop', 'name')

  // TS/TSX 对象字面量场景：只对常见映射做最小化处理（属性 key 形式：name:）
  // 注意：这里非常保守，避免误伤业务代码；只处理明确属于已知组件配置的 key
  // 已实现的 attribute 改名对 TS/TSX 场景的覆盖度有限——README 局限性章节有说明
  if (/\.tsx?$/.test(filePath)) {
    // 仅做几条最安全的纯 key 替换
    out = out
      .replace(/(\bokLoading\b)(\s*:)/g, 'confirmLoading$2')
      .replace(/(\bnativeType\b)(\s*:)/g, 'htmlType$2')
      .replace(/(\bclearable\b)(\s*:)/g, 'allowClear$2')
      .replace(/(\bpopperClass\b)(\s*:)/g, 'overlayClassName$2')
      .replace(/(\bconfirmText\b)(\s*:)/g, 'okText$2')
      .replace(/(\bconfirmType\b)(\s*:)/g, 'okType$2')
  }

  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// Glob：使用最小 readdir 递归实现（不依赖 globby）
// ─────────────────────────────────────────────────────────────────────────────
// 支持：
//   src/**/*.vue
//   src/**/*.{vue,ts,tsx}
//   path/to/file.vue        （直接相对路径）
//
// 思路：把 glob 拆成 "前缀目录 + 模式"，递归扫目录，按模式正则匹配
function globToRegex(pattern) {
  // 展开 {a,b,c}
  const expand = (p) => {
    const m = p.match(/\{([^}]+)\}/)
    if (!m) return [p]
    const [whole, inner] = m
    const parts = inner.split(',')
    const head = p.slice(0, m.index)
    const tail = p.slice(m.index + whole.length)
    return parts.flatMap((part) => expand(`${head}${part}${tail}`))
  }
  const expanded = expand(pattern)
  // 把每个 expanded pattern 转成正则
  const toRe = (p) => {
    // 转义：. → \.
    let re = ''
    let i = 0
    while (i < p.length) {
      const c = p[i]
      if (c === '*' && p[i + 1] === '*') {
        // ** → .*
        re += '.*'
        i += 2
        if (p[i] === '/') i++
      } else if (c === '*') {
        re += '[^/]*'
        i++
      } else if (c === '?') {
        re += '[^/]'
        i++
      } else if ('.+^$()|[]\\'.includes(c)) {
        re += '\\' + c
        i++
      } else {
        re += c
        i++
      }
    }
    return new RegExp('^' + re + '$')
  }
  return expanded.map(toRe)
}

function findFiles(globPattern, cwd) {
  // 找到不含 magic 字符的最长前缀作为扫描根
  const segments = globPattern.split('/')
  const baseSegs = []
  for (const seg of segments) {
    if (/[*?{]/.test(seg)) break
    baseSegs.push(seg)
  }
  let baseDir = cwd
  let restPattern = globPattern
  if (baseSegs.length > 0) {
    const basePart = baseSegs.join('/')
    baseDir = resolve(cwd, basePart)
    restPattern = segments.slice(baseSegs.length).join('/')
    // 如果整个 glob 没有 magic（即直接文件路径），直接返回
    if (restPattern === '') {
      try {
        const st = statSync(baseDir)
        if (st.isFile()) return [baseDir]
        // 目录但没模式 → 默认所有文件
        restPattern = '**/*'
      } catch {
        return []
      }
    }
  }
  // 扫 baseDir 下所有文件，再用 regex 过滤
  const regexes = globToRegex(restPattern)
  const out = []
  walk(baseDir, baseDir, regexes, out)
  return out
}

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'lib',
  'coverage',
  '.vitepress',
  '.next',
  '.nuxt',
  '.cache',
])

function walk(baseDir, cur, regexes, out) {
  let entries
  try {
    entries = readdirSync(cur, { withFileTypes: true })
  } catch {
    return
  }
  for (const ent of entries) {
    const abs = join(cur, ent.name)
    if (ent.isDirectory()) {
      if (IGNORE_DIRS.has(ent.name)) continue
      walk(baseDir, abs, regexes, out)
    } else if (ent.isFile()) {
      const rel = relative(baseDir, abs).split(sep).join('/')
      if (regexes.some((re) => re.test(rel))) {
        out.push(abs)
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────
function main() {
  const argv = process.argv.slice(2)
  const apply = argv.includes('--apply')
  const verbose = argv.includes('--verbose')
  const positional = argv.filter((a) => !a.startsWith('--'))
  if (positional.length === 0) {
    process.stderr.write(
      'Usage: node scripts/codemod-v1-to-v2.mjs "<glob>" [--apply] [--verbose]\n',
    )
    process.exit(1)
  }
  const globPattern = positional[0]
  const cwd = process.cwd()
  const files = findFiles(globPattern, cwd)

  if (files.length === 0) {
    process.stdout.write(`[codemod] no files matched glob: ${globPattern}\n`)
    return
  }

  let changedCount = 0
  for (const file of files) {
    let src
    try {
      src = readFileSync(file, 'utf8')
    } catch (err) {
      if (verbose) process.stdout.write(`[codemod] skip ${file}: ${err.message}\n`)
      continue
    }
    const next = transform(src, file)
    if (next !== src) {
      changedCount++
      const rel = relative(cwd, file)
      process.stdout.write(`[codemod] ${apply ? 'WRITE' : 'DRY '} ${rel}\n`)
      if (verbose) {
        process.stdout.write(diffSummary(src, next))
      }
      if (apply) {
        writeFileSync(file, next, 'utf8')
      }
    }
  }
  process.stdout.write(
    `[codemod] scanned ${files.length} file(s), ${changedCount} changed${apply ? ' (written)' : ' (dry-run, use --apply to write)'}\n`,
  )
}

function diffSummary(before, after) {
  const bLines = before.split('\n')
  const aLines = after.split('\n')
  const out = []
  const n = Math.max(bLines.length, aLines.length)
  for (let i = 0; i < n; i++) {
    if (bLines[i] !== aLines[i]) {
      if (bLines[i] !== undefined) out.push(`  - ${bLines[i]}`)
      if (aLines[i] !== undefined) out.push(`  + ${aLines[i]}`)
    }
  }
  return out.join('\n') + (out.length ? '\n' : '')
}

const isMain = (() => {
  try {
    return fileURLToPath(import.meta.url) === resolve(process.argv[1] || '')
  } catch {
    return false
  }
})()

if (isMain) {
  main()
}
