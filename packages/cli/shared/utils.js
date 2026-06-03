import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { camelCase, upperFirst } from 'lodash-es'
import _traverse from '@babel/traverse'
import * as babelParser from '@babel/parser'
import { INDEX_FILE_NAME, UI_DIR } from './constant.js'
import logger from './logger.js'

// @babel/traverse 是 CJS，主入口同时挂在 default 与函数本身上。
const traverse = _traverse.default ?? _traverse

export const bigCamelCase = (str) => upperFirst(camelCase(str))

export const resolveDirFilesInfo = (targetDir, ignoreDirs = []) => {
  return readdirSync(targetDir)
    .filter(
      (dir) =>
        // 必须是目录、不在忽略列表内、且包含 INDEX_FILE_NAME
        statSync(resolve(targetDir, dir)).isDirectory() &&
        !ignoreDirs.includes(dir) &&
        existsSync(resolve(targetDir, dir, INDEX_FILE_NAME)),
    )
    .map((dir) => ({
      name: bigCamelCase(dir),
      dirname: dir,
      path: resolve(targetDir, dir, INDEX_FILE_NAME),
    }))
}

export const parseExportByFileInfo = (fileInfo, ignoreParseError) => {
  const exportModule = {}
  const indexContent = readFileSync(fileInfo.path, { encoding: 'utf-8' })

  const ast = babelParser.parse(indexContent, {
    sourceType: 'module',
    plugins: ['typescript'],
  })

  const exportName = []
  let exportDefault = null

  traverse(ast, {
    ExportNamedDeclaration({ node }) {
      if (node.exportKind === 'type') return

      if (node.specifiers.length) {
        node.specifiers.forEach((specifier) => {
          if (specifier.exportKind === 'type') return
          exportName.push(specifier.local.name)
        })
      } else if (node.declaration) {
        if (node.declaration.declarations) {
          node.declaration.declarations.forEach((dec) => {
            exportName.push(dec.id.name)
          })
        } else if (node.declaration.id) {
          exportName.push(node.declaration.id.name)
        }
      }
    },
    ExportDefaultDeclaration() {
      exportDefault = `${fileInfo.name}Install`
    },
  })

  if (!exportDefault) {
    logger.error(`${fileInfo.path} must have "export default".`)
    if (ignoreParseError) return exportModule
    process.exit(1)
  }

  if (!exportName.length) {
    logger.error(`${fileInfo.path} must have "export xxx".`)
    if (ignoreParseError) return exportModule
    process.exit(1)
  }

  exportModule.default = exportDefault
  exportModule.parts = exportName
  exportModule.fileInfo = fileInfo

  return exportModule
}

// 轻量读取组件 index.ts 中 `export default { ... }` 对象内的字面量字段（title / category / status）。
//
// 历史上这里走 babel AST（`parseComponentInfo`）顺带强制了 "must have export default" 警告；
// 现在 sidebar / vue-ccui 生成都基于 discoverComponents 全集，不再做 ready/未 ready gate，
// 所以只需要按字段名取 string 字面量即可——所有组件 index.ts 都遵循模板规范，正则足够稳健。
// 取不到字段时返回 undefined，调用方按自身需要 fallback。
export const readComponentMeta = (name) => {
  const meta = { name: bigCamelCase(name) }
  const filepath = resolve(UI_DIR, name, INDEX_FILE_NAME)
  if (!existsSync(filepath)) return meta

  const content = readFileSync(filepath, { encoding: 'utf-8' })
  // 只匹配 `key: 'value'` / `key: "value"` 三个白名单字段，避免误命中 install / 嵌套对象。
  for (const key of ['title', 'category', 'status']) {
    const re = new RegExp(`\\b${key}\\s*:\\s*(['"\`])([^'"\`]*)\\1`)
    const m = content.match(re)
    if (m) meta[key] = m[2]
  }
  return meta
}
