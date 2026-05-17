import { kebabCase } from 'lodash-es'
import {
  SITES_COMPONENTS_DIR_NAME,
  SITES_COMPONENTS_DIR_NAME_EN,
  VITEPRESS_SIDEBAR_CATEGORY,
  VITEPRESS_SIDEBAR_CATEGORY_EN,
  VITEPRESS_SIDEBAR_CATEGORY_ZH_TO_EN,
} from '../shared/constant.js'
import logger from '../shared/logger.js'

function buildCategoryOptions(text, items = []) {
  return { text, items }
}

function generateZhMenus(componentsInfo) {
  const categoryMap = VITEPRESS_SIDEBAR_CATEGORY.reduce((map, cate) => map.set(cate, []), new Map())

  componentsInfo.forEach((info) => {
    if (categoryMap.has(info.category)) {
      const componentName = info.name === 'Button3D' ? 'button-3d' : kebabCase(info.name)

      categoryMap.get(info.category).push({
        text: info.title,
        link: `/${SITES_COMPONENTS_DIR_NAME}/${componentName}/`,
        status: info.status,
      })
    } else {
      logger.warning(`组件 ${info.name} 的分类 ${info.category} 不存在！`)
    }
  })
  return Array.from(categoryMap).map(([k, v]) => buildCategoryOptions(k, v))
}

function generateEnMenus(componentsInfo) {
  const categoryMapEn = VITEPRESS_SIDEBAR_CATEGORY_EN.reduce((map, cate) => map.set(cate, []), new Map())
  componentsInfo.forEach((info) => {
    if (categoryMapEn.has(VITEPRESS_SIDEBAR_CATEGORY_ZH_TO_EN[info.category])) {
      categoryMapEn.get(VITEPRESS_SIDEBAR_CATEGORY_ZH_TO_EN[info.category]).push({
        text: info.name,
        link: `/${SITES_COMPONENTS_DIR_NAME_EN}/${kebabCase(info.name)}/`,
        status: info.status,
      })
    }
  })
  return Array.from(categoryMapEn).map(([k, v]) => buildCategoryOptions(k, v))
}

export const createVitepressSidebarTemplates = (componentsInfo = []) => {
  const rootNavs = [
    { text: '快速开始', link: '/', handler: generateZhMenus, lang: 'zh' },
    { text: 'Quick Start', link: '/en-US/', handler: generateEnMenus, lang: 'en' },
  ]

  return rootNavs.map((nav) => {
    const rootItem = {
      text: nav.text,
      link: nav.link,
      items: [
        { text: '简介', link: '/introduce' },
        { text: 'AI 接入', link: '/for-ai' },
      ],
    }
    const sidebar = [rootItem, ...nav.handler(componentsInfo)]
    // 输出原样的 JS 字面量；后续 lint/Prettier 会再格式化为最终风格。
    return {
      lang: nav.lang,
      content: `export default {\n  '/': ${JSON.stringify(sidebar, null, 2)},\n}\n`,
    }
  })
}
