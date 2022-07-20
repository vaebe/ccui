# 简介
## 快速开始
### 完整引入
```ts
import {createApp} from 'vue'
import './style.css'
import App from './App.vue'

import ccui from 'vue3-ccui'
import 'vue3-ccui/style.css'

createApp(App).use(ccui).mount('#app')
```
## commit

+ feat : 新功能
+ fix : 修复bug
+ docs : 文档改变
+ style : 代码格式改变
+ refactor : 某个已有功能重构
+ perf : 性能优化
+ test : 增加测试
+ build : 改变了build工具 如 grunt换成了 npm
+ revert : 撤销上一次的 commit
+ chore : 构建过程或辅助工具的变动
