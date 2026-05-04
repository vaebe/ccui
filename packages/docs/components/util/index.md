# Util 工具集

vue3-ccui 内部使用的公共工具函数。

## 何时使用

- 在自定义组件中需要复用 ccui 内部的一些通用工具函数。

## DOM

| 函数                       | 说明                                   |
| -------------------------- | -------------------------------------- |
| `inBrowser`                | 是否运行在浏览器环境                   |
| `canUseDom()`              | 同上，函数形式                         |
| `getOffset(el)`            | 获取元素相对文档的偏移 `{ top, left }` |
| `isVisible(el)`            | 元素是否可见                           |
| `contains(parent, target)` | 判断 parent 是否包含 target            |

## 函数

| 函数                 | 说明       |
| -------------------- | ---------- |
| `debounce(fn, wait)` | 防抖       |
| `throttle(fn, wait)` | 节流       |
| `noop()`             | 空函数     |
| `isFunction(v)`      | 是否函数   |
| `isObject(v)`        | 是否纯对象 |

## 类型与工具

| 函数                   | 说明                  |
| ---------------------- | --------------------- |
| `classNames(...args)`  | 合并 class 名称       |
| `isNil(v)`             | 是否 null / undefined |
| `clamp(val, min, max)` | 数值边界限制          |

## 使用示例

```ts
import { clamp, classNames, debounce } from 'vue3-ccui'

const cls = classNames('a', { b: true })
const v = clamp(15, 0, 10) // 10

const onResize = debounce(() => {
  // ...
}, 200)
```
