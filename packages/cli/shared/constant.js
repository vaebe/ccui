import { resolve } from 'node:path'
import pkg from '../package.json' with { type: 'json' }

const CWD = process.cwd()
const UI_DIR = resolve(CWD, '../ccui/ui')
const VUE_UI_FILE_NAME = 'vue-ccui.ts'
const VUE_UI_FILE = resolve(UI_DIR, VUE_UI_FILE_NAME)
const SITES_DIR = resolve(CWD, '../docs')
const SITES_COMPONENTS_DIR_NAME = 'components'
const SITES_COMPONENTS_DIR_NAME_EN = 'en-US/components'
const SITES_COMPONENTS_DIR = resolve(SITES_DIR, SITES_COMPONENTS_DIR_NAME)
const VITEPRESS_DIR = resolve(SITES_DIR, '.vitepress')
const VITEPRESS_SIDEBAR_FILE_NAME = 'sidebar.ts'
const VITEPRESS_SIDEBAR_FILE = resolve(VITEPRESS_DIR, `config/${VITEPRESS_SIDEBAR_FILE_NAME}`)
const VITEPRESS_SIDEBAR_FILE_NAME_EN = 'enSidebar.ts'
const VITEPRESS_SIDEBAR_FILE_EN = resolve(VITEPRESS_DIR, `config/${VITEPRESS_SIDEBAR_FILE_NAME_EN}`)

// 这里的分类顺序将会影响最终生成的页面侧边栏顺序
const VITEPRESS_SIDEBAR_CATEGORY = ['通用', '导航', '反馈', '数据录入', '数据展示', '布局']
const VITEPRESS_SIDEBAR_CATEGORY_EN = ['General', 'Navigation', 'Feedback', 'Data Entry', 'Data Display', 'Layout']
const VITEPRESS_SIDEBAR_CATEGORY_ZH_TO_EN = Object.freeze(
  Object.fromEntries(VITEPRESS_SIDEBAR_CATEGORY.map((zh, i) => [zh, VITEPRESS_SIDEBAR_CATEGORY_EN[i]])),
)

const COMPONENT_PARTS_MAP = [
  { name: 'component（组件）', value: 'component' },
  { name: 'directive（指令）', value: 'directive' },
  { name: 'service（服务）', value: 'service' },
]

const CREATE_SUPPORT_TYPE_MAP = Object.freeze({
  component: 'component',
  ccui: 'ccui',
})
const CREATE_SUPPORT_TYPES = Object.keys(CREATE_SUPPORT_TYPE_MAP)

const WHITE_LIST_READY_COMPONENTS = [
  'select',
  'tooltip',
  'table',
  'tabs',
  'form',
  'dropdown',
  'drawer',
  'date-picker',
  'input-number',
  'tree',
]

export const VERSION = pkg.version
export const isProd = process.env.NODE_ENV === 'production'
export {
  CWD,
  UI_DIR,
  VUE_UI_FILE_NAME,
  VUE_UI_FILE,
  SITES_DIR,
  SITES_COMPONENTS_DIR_NAME,
  SITES_COMPONENTS_DIR_NAME_EN,
  SITES_COMPONENTS_DIR,
  VITEPRESS_DIR,
  VITEPRESS_SIDEBAR_FILE_NAME,
  VITEPRESS_SIDEBAR_FILE,
  VITEPRESS_SIDEBAR_FILE_NAME_EN,
  VITEPRESS_SIDEBAR_FILE_EN,
  VITEPRESS_SIDEBAR_CATEGORY,
  VITEPRESS_SIDEBAR_CATEGORY_EN,
  VITEPRESS_SIDEBAR_CATEGORY_ZH_TO_EN,
  COMPONENT_PARTS_MAP,
  CREATE_SUPPORT_TYPE_MAP,
  CREATE_SUPPORT_TYPES,
  WHITE_LIST_READY_COMPONENTS,
}
export const UI_NAMESPACE = 'c'
export const CSS_CLASS_PREFIX = 'ccui'
export const TESTS_DIR_NAME = 'test'
export const INDEX_FILE_NAME = 'index.ts'
export const DOCS_FILE_NAME = 'index.md'
export const VUE_UI_IGNORE_DIRS = ['shared', 'style']
