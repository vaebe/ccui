import type { App } from 'vue'
import { canUseDom, contains, getOffset, inBrowser, isVisible } from './src/dom'
import { debounce, isFunction, isObject, noop, throttle } from './src/func'
import { clamp, classNames, isNil } from './src/type'

export {
  canUseDom,
  clamp,
  classNames,
  contains,
  debounce,
  getOffset,
  inBrowser,
  isFunction,
  isNil,
  isObject,
  isVisible,
  noop,
  throttle,
}

export default {
  title: 'Util 工具集',
  category: '其他',
  status: '100%',
  install(_: App): void {
    // util 仅导出函数，无需注册组件
  },
}
