import { COMPONENT_PARTS_MAP, VITEPRESS_SIDEBAR_CATEGORY } from '../shared/constant.js'
import { notEmpty } from '../shared/validators.js'

export const typeName = () => ({
  name: 'name',
  type: 'input',
  message: '（必填）请输入组件 name ，将用作目录及文件名：',
  validate: notEmpty('组件 name '),
})

export const typeTitle = () => ({
  name: 'title',
  type: 'input',
  message: '（必填）请输入组件中文名称，将用作文档列表显示：',
  validate: notEmpty('组件名称'),
})

export const selectCategory = () => ({
  name: 'category',
  type: 'list',
  message: '（必填）请选择组件分类，将用作文档列表分类：',
  choices: VITEPRESS_SIDEBAR_CATEGORY,
  default: 0,
})

export const typeAliasName = () => ({
  name: 'alias',
  type: 'input',
  message: '（选填）请输入组件 name 别名，将用作组件别名被导出：',
})

export const selectParts = () => ({
  name: 'parts',
  type: 'checkbox',
  message: '（必填）请选择包含部件，将自动生成部件文件：',
  choices: COMPONENT_PARTS_MAP,
  default: [],
  validate: notEmpty('部件'),
})
