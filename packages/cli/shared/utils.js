import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { camelCase, upperFirst } from 'lodash-es'
import _traverse from '@babel/traverse'
import * as babelParser from '@babel/parser'
import { INDEX_FILE_NAME, UI_DIR, WHITE_LIST_READY_COMPONENTS } from './constant.js'
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

export const parseComponentInfo = (name) => {
  const componentInfo = { name: bigCamelCase(name) }
  let hasExportDefault = false
  const indexContent = readFileSync(resolve(UI_DIR, name, INDEX_FILE_NAME), { encoding: 'utf-8' })

  const ast = babelParser.parse(indexContent, {
    sourceType: 'module',
    plugins: ['typescript'],
  })
  traverse(ast, {
    ExportDefaultDeclaration({ node }) {
      hasExportDefault = true
      if (node.declaration && node.declaration.properties) {
        node.declaration.properties.forEach((pro) => {
          if (pro.type === 'ObjectProperty') {
            componentInfo[pro.key.name] = pro.value.value
          }
        })
      }
    },
  })

  if (!hasExportDefault) {
    logger.warning(`${componentInfo.name} must have "export default" and component info.`)
  }

  return componentInfo
}

export const isReadyToRelease = (componentName) => {
  return parseComponentInfo(componentName).status === '100%' || WHITE_LIST_READY_COMPONENTS.includes(componentName)
}
