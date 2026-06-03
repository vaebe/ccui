#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '..')
const componentsDir = path.join(docsRoot, 'components')
const outDir = path.join(docsRoot, 'public')

const SITE_URL = 'https://vaebe.github.io/ccui'

function readMd(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
}

function extractTitle(content, fallback) {
  const m = content.match(/^#\s+(.+?)\s*$/m)
  return m ? m[1].trim() : fallback
}

function extractFirstParagraph(content) {
  const lines = content.split('\n')
  let seenTitle = false
  for (const raw of lines) {
    const line = raw.trim()
    if (!seenTitle) {
      if (/^#\s/.test(line)) seenTitle = true
      continue
    }
    if (!line) continue
    if (line.startsWith('#') || line.startsWith(':::') || line.startsWith('```') || line.startsWith('|') || line.startsWith('-'))
      return ''
    return line.replace(/[。.;；]\s*$/, '')
  }
  return ''
}

function stripLeadingH1(content) {
  return content.replace(/^#\s+.+?\n+/, '')
}

function collectComponents() {
  if (!fs.existsSync(componentsDir)) return []
  const dirs = fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()

  const items = []
  for (const name of dirs) {
    const file = path.join(componentsDir, name, 'index.md')
    const content = readMd(file)
    if (!content) continue
    items.push({
      name,
      title: extractTitle(content, name),
      desc: extractFirstParagraph(content),
      content,
    })
  }
  return items
}

function buildIndex(items) {
  const intro = `# @vaebe/ccui

> Vue 3 + TypeScript 组件库，视觉对齐 Ant Design v6.3.7。83+ 组件、SeedToken/MapToken 双层主题、内置 zhCN/enUS/jaJP/koKR i18n、暗色模式、可访问性审计。所有组件统一以 \`c-\` 前缀使用（例如 \`<c-button>\`）。

本文件遵循 [llms.txt](https://llmstxt.org) 规范，便于 AI agent / IDE 内 Copilot 检索 ccui 的组件能力。完整文档见同目录的 \`llms-full.txt\`。

## 入门

- [简介与安装](${SITE_URL}/introduce.html)：包管理器安装、CDN 引入、完整 / 按需引入、unplugin-vue-components resolver、主题 Token。
- [贡献者](${SITE_URL}/team.html)：项目维护者列表。

## 组件
`
  const lines = items.map(({ name, title, desc }) => {
    const tail = desc ? `：${desc}` : ''
    return `- [${title}](${SITE_URL}/components/${name}/index.html)${tail}`
  })

  const tail = `
## 资源

- 完整文档（单文件，便于 LLM 一次读入）: ${SITE_URL}/llms-full.txt
- 站点首页: ${SITE_URL}/
- 仓库: https://github.com/vaebe/ccui
- npm: https://www.npmjs.com/package/@vaebe/ccui
`

  return `${intro}${lines.join('\n')}\n${tail}`
}

function buildFull(items) {
  const introduceMd = readMd(path.join(docsRoot, 'introduce.md'))
  const header = `# @vaebe/ccui 完整文档

> @vaebe/ccui 是 Vue 3 + TypeScript 组件库，视觉对齐 Ant Design v6.3.7。本文件聚合了官网全部组件文档，供 AI agent / LLM 一次性读入，构成代码生成与问答的知识库。
> 站点：${SITE_URL}/
> 仓库：https://github.com/vaebe/ccui

约定：

- 所有组件以 \`c-\` 前缀使用，如 \`<c-button>\`、\`<c-form-item>\`。
- 命令式组件（Message / Notification / Modal）通过 \`useMessage()\` / \`useNotification()\` / \`useModal()\` 等 hook 在 setup 中调用。
- 完整引入：\`app.use(ccui)\`；按需引入推荐配合 \`@vaebe/unplugin-vue-components-ccui\` 的 \`Vue3CCUIResolver()\`。

---

# 简介

${stripLeadingH1(introduceMd).trim()}
`

  const sections = items.map(({ name, title, content }) => `---

# ${title}

> 文档链接：${SITE_URL}/components/${name}/index.html

${stripLeadingH1(content).trim()}
`)

  return `${header}\n\n${sections.join('\n\n')}\n`
}

function main() {
  const items = collectComponents()
  if (!items.length) {
    console.warn('[llms] 未发现组件文档，跳过生成。')
    return
  }
  fs.mkdirSync(outDir, { recursive: true })

  const indexPath = path.join(outDir, 'llms.txt')
  const fullPath = path.join(outDir, 'llms-full.txt')

  fs.writeFileSync(indexPath, buildIndex(items), 'utf8')
  fs.writeFileSync(fullPath, buildFull(items), 'utf8')

  const fmt = (p) => `${path.relative(process.cwd(), p)} (${(fs.statSync(p).size / 1024).toFixed(1)} KB)`
  console.log(`[llms] 已生成 ${items.length} 个组件:`)
  console.log(`  - ${fmt(indexPath)}`)
  console.log(`  - ${fmt(fullPath)}`)
}

main()
