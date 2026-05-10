import { resolve, dirname } from 'node:path'
import { promises as fsp } from 'node:fs'
import { isEmpty, kebabCase } from 'lodash-es'
import inquirer from 'inquirer'
import logger from '../shared/logger.js'
import {
  bigCamelCase,
  resolveDirFilesInfo,
  parseExportByFileInfo,
  parseComponentInfo,
  isReadyToRelease,
} from '../shared/utils.js'
import {
  UI_DIR,
  TESTS_DIR_NAME,
  INDEX_FILE_NAME,
  DOCS_FILE_NAME,
  VUE_UI_FILE,
  VUE_UI_IGNORE_DIRS,
  VUE_UI_FILE_NAME,
  CREATE_SUPPORT_TYPES,
  CREATE_SUPPORT_TYPE_MAP,
  SITES_COMPONENTS_DIR,
  VITEPRESS_SIDEBAR_FILE,
  VITEPRESS_SIDEBAR_FILE_NAME,
  VITEPRESS_SIDEBAR_FILE_EN,
  VITEPRESS_SIDEBAR_FILE_NAME_EN,
  isProd,
} from '../shared/constant.js'
import { withSpinner } from '../shared/with-spinner.js'
import { existsSync } from '../shared/fs.js'
import { selectCreateType } from '../inquirers/create.js'
import { selectCategory, selectParts, typeName, typeTitle } from '../inquirers/component.js'
import {
  createComponentTemplate,
  createStyleTemplate,
  createTypesTemplate,
  createDirectiveTemplate,
  createServiceTemplate,
  createIndexTemplate,
  createTestsTemplate,
  createDocumentTemplate,
} from '../templates/component.js'
import { createUiTemplate } from '../templates/vue-ui.js'
import { createVitepressSidebarTemplates } from '../templates/vitepress-sidebar.js'

async function writeIfNew(path, content) {
  await fsp.mkdir(dirname(path), { recursive: true })
  await fsp.writeFile(path, content, 'utf-8')
}

async function createComponent(params = {}) {
  const { name, hasComponent, hasDirective, hasService } = params

  const componentName = kebabCase(name)
  const styleName = componentName
  const typesName = `${componentName}-types`
  const directiveName = `${componentName}-directive`
  const serviceName = `${componentName}-service`
  const testName = `${componentName}.test.ts`

  const _params = {
    ...params,
    componentName,
    typesName,
    directiveName,
    serviceName,
    styleName,
    testName,
  }

  const componentDir = resolve(UI_DIR, componentName)
  const srcDir = resolve(componentDir, 'src')
  const testsDir = resolve(componentDir, TESTS_DIR_NAME)
  const docsDir = resolve(SITES_COMPONENTS_DIR, componentName)

  if (existsSync(componentDir)) {
    logger.error(`${bigCamelCase(componentName)} 组件目录已存在！`)
    process.exit(1)
  }

  await withSpinner(
    `开始创建 ${bigCamelCase(componentName)} 组件...`,
    async () => {
      await Promise.all([
        fsp.mkdir(componentDir, { recursive: true }),
        fsp.mkdir(srcDir, { recursive: true }),
        fsp.mkdir(testsDir, { recursive: true }),
      ])

      const writes = [
        writeIfNew(resolve(componentDir, INDEX_FILE_NAME), createIndexTemplate(_params)),
        writeIfNew(resolve(testsDir, testName), createTestsTemplate(_params)),
      ]

      if (existsSync(docsDir)) {
        logger.warning(`\n${bigCamelCase(componentName)} 组件文档已存在：${resolve(docsDir, DOCS_FILE_NAME)}`)
      } else {
        writes.push(writeIfNew(resolve(docsDir, DOCS_FILE_NAME), createDocumentTemplate(_params)))
      }

      if (hasComponent || hasService) {
        writes.push(writeIfNew(resolve(srcDir, `${typesName}.ts`), createTypesTemplate(_params)))
      }

      if (hasComponent) {
        writes.push(
          writeIfNew(resolve(srcDir, `${componentName}.tsx`), createComponentTemplate(_params)),
          writeIfNew(resolve(srcDir, `${styleName}.scss`), createStyleTemplate(_params)),
        )
      }

      if (hasDirective) {
        writes.push(writeIfNew(resolve(srcDir, `${directiveName}.ts`), createDirectiveTemplate(_params)))
      }

      if (hasService) {
        writes.push(writeIfNew(resolve(srcDir, `${serviceName}.ts`), createServiceTemplate(_params)))
      }

      await Promise.all(writes)
    },
    { successText: `${bigCamelCase(componentName)} 组件创建成功！` },
  )

  logger.info(`组件目录：${componentDir}`)
}

async function createVueUi(params, { ignoreParseError, env } = {}) {
  const fileInfo = resolveDirFilesInfo(UI_DIR, VUE_UI_IGNORE_DIRS).filter(
    ({ name }) => (env === 'prod' && isReadyToRelease(kebabCase(name))) || !env || env === 'dev',
  )

  const exportModules = []
  for (const f of fileInfo) {
    const em = parseExportByFileInfo(f, ignoreParseError)
    if (!isEmpty(em)) exportModules.push(em)
  }

  const template = createUiTemplate(exportModules)

  await withSpinner(
    `开始创建 ${VUE_UI_FILE_NAME} 文件...`,
    async () => {
      await writeIfNew(VUE_UI_FILE, template)
    },
    { successText: `${VUE_UI_FILE_NAME} 文件创建成功！` },
  )

  logger.info(`文件地址：${VUE_UI_FILE}`)
}

async function createVitepressSidebar() {
  const generateFileConfig = {
    zh: { fileName: VITEPRESS_SIDEBAR_FILE_NAME, location: VITEPRESS_SIDEBAR_FILE },
    en: { fileName: VITEPRESS_SIDEBAR_FILE_NAME_EN, location: VITEPRESS_SIDEBAR_FILE_EN },
  }
  const fileInfo = resolveDirFilesInfo(UI_DIR, VUE_UI_IGNORE_DIRS)
  const componentsInfo = []
  for (const f of fileInfo) {
    const info = parseComponentInfo(f.dirname)
    if (isEmpty(info) || (isProd && !isReadyToRelease(f.dirname))) continue
    componentsInfo.push(info)
  }

  const templates = createVitepressSidebarTemplates(componentsInfo)
  for (const template of templates) {
    const { fileName, location } = generateFileConfig[template.lang]
    await withSpinner(
      `开始创建 ${fileName} 文件...`,
      async () => {
        await writeIfNew(location, template.content)
      },
      { successText: `${fileName} 文件创建成功！` },
    )
    logger.info(`文件地址：${location}`)
  }
}

export const validateCreateType = (type) => {
  const flag = CREATE_SUPPORT_TYPES.includes(type)
  if (!flag) logger.error(`类型错误，可选类型为：${CREATE_SUPPORT_TYPES.join(', ')}`)
  return flag ? type : null
}

export const create = async (cwd) => {
  let { type } = cwd

  if (isEmpty(type)) {
    const result = await inquirer.prompt([selectCreateType()])
    type = result.type
  }

  let params = {}

  try {
    switch (type) {
      case CREATE_SUPPORT_TYPE_MAP.component:
        params = await inquirer.prompt([typeName(), typeTitle(), selectCategory(), selectParts()])
        params.hasComponent = params.parts.includes('component')
        params.hasDirective = params.parts.includes('directive')
        params.hasService = params.parts.includes('service')
        await createComponent(params, cwd)
        break
      case CREATE_SUPPORT_TYPE_MAP.ccui:
        await createVueUi(params, cwd)
        await createVitepressSidebar()
        break
      default:
        break
    }
  } catch (e) {
    logger.error(e?.message ?? String(e))
    process.exit(1)
  }
}
