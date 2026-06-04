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

// 非组件的纯文档指南页（在 docs/components/<slug> 下手写、没有对应 ui/ 组件，
// 因而不会被 discoverComponents 扫到）。这里按分类显式登记，保证 sidebar 重新生成时
// 这些页面入口不会丢失。key 用中文分类名，与 VITEPRESS_SIDEBAR_CATEGORY 对齐。
const EXTRA_GUIDE_PAGES = {
  其他: [{ slug: 'theme', zh: '主题定制 / 深色模式', en: 'Theming / Dark Mode' }],
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

  for (const [cate, pages] of Object.entries(EXTRA_GUIDE_PAGES)) {
    if (!categoryMap.has(cate)) continue
    pages.forEach((p) => {
      categoryMap.get(cate).push({ text: p.zh, link: `/${SITES_COMPONENTS_DIR_NAME}/${p.slug}/` })
    })
  }

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

  for (const [cate, pages] of Object.entries(EXTRA_GUIDE_PAGES)) {
    const enCate = VITEPRESS_SIDEBAR_CATEGORY_ZH_TO_EN[cate]
    if (!categoryMapEn.has(enCate)) continue
    pages.forEach((p) => {
      categoryMapEn.get(enCate).push({ text: p.en, link: `/${SITES_COMPONENTS_DIR_NAME_EN}/${p.slug}/` })
    })
  }

  return Array.from(categoryMapEn).map(([k, v]) => buildCategoryOptions(k, v))
}

export const createVitepressSidebarTemplates = (componentsInfo = []) => {
  const rootNavs = [
    { text: '指南', link: '/', handler: generateZhMenus, lang: 'zh' },
    { text: 'Guide', link: '/en-US/', handler: generateEnMenus, lang: 'en' },
  ]

  return rootNavs.map((nav) => {
    const rootItem = {
      text: nav.text,
      link: nav.link,
      items: [
        { text: '简介', link: '/introduce' },
        { text: '快速开始', link: '/quick-start' },
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
