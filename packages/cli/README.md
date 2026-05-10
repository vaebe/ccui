# ccui-cli

`vue-ccui` 组件库的内部命令行工具，覆盖组件脚手架、构建、主题、类型声明、发布与代码检查。纯 ESM，Node 22+。

## 命令

| 命令 | 说明 |
| --- | --- |
| `ccui-cli create [-t component\|ccui]` | 交互式创建组件目录，或重新生成 `vue-ccui.ts` / `sidebar.ts` / `enSidebar.ts` |
| `ccui-cli build` | vite 构建组件库；命令完成后自动触发 `generate:theme` 与 `generate:dts` |
| `ccui-cli generate:theme` | 把 `theme/themes/{light,dark}.ts` 编译为 `theme.scss` + `darkTheme.css` |
| `ccui-cli generate:dts` | 写入 `build/index.d.ts` 并复制到各子包目录 |
| `ccui-cli release [-v <version>]` | 把 `build/` 整理为可发布产物（写 package.json、复制 README 与主题资源） |
| `ccui-cli code-check [-t eslint\|unit-test] [-c <names>]` | 跑 ESLint 或单元测试，可用逗号指定组件名 |

`--help` / `-V` 可在任意子命令上使用。

## 目录结构

```
packages/cli/
├── index.js                      # commander 入口
├── commands/                     # 每个文件一条命令
│   ├── build.js
│   ├── build-nuxt-auto-import.js
│   ├── code-check.js
│   ├── create.js
│   ├── generate-dts.js
│   ├── generate-theme.js
│   └── release.js
├── inquirers/                    # inquirer prompt 工厂
│   ├── component.js
│   └── create.js
├── templates/                    # 文本模板（输出 .ts / .scss / .md / .js）
│   ├── component.js
│   ├── vitepress-sidebar.js
│   └── vue-ui.js
└── shared/                       # 通用 helper
    ├── constant.js               # 路径常量、分类映射、白名单等
    ├── discover-components.js    # 扫 ui 子目录返回含 index.ts 的目录名
    ├── fs.js                     # outputFile = mkdir + write（替代 fs-extra）
    ├── logger.js                 # chalk 颜色封装
    ├── run-command.js            # spawnSync 直通 stdio + 非零退出抛错（替代 shelljs）
    ├── utils.js                  # Babel 解析 + 命名转换
    ├── validators.js             # inquirer 验证器工厂
    └── with-spinner.js           # ora 包裹 + 错误重抛（不调 process.exit）
```

## 调试技巧

```bash
node ./index.js --help                  # 列所有子命令
node ./index.js <subcommand> --help     # 查单条命令的 option

# 通过 inspector 调试
node --inspect-brk ./index.js create -t component
```

## 设计取舍

- **不再调 `process.exit` 在工具层**：`with-spinner.js` 失败重抛，由顶层 commander action 决定退出码——便于将来拆测试 / 嵌入 hooks。
- **不再用 shelljs / fs-extra**：`outputFile` 自己实现 `mkdir + write`；`runCommand` 用 `spawnSync({ stdio: 'inherit', shell: true })`，行为更可预测、依赖更少。
- **常量集中在 `shared/constant.js`**：所有跨文件路径与分类映射均派生自此处，禁止其它文件硬编码 `../ccui/...`。
- **lazy 扫描组件**：`code-check.js` 只在真跑命令时才扫 `ui/`，避免每次 `--help` 触发 Babel 解析。

## 依赖

```
commander  inquirer  chalk  ora
vite  @vitejs/plugin-vue  @vitejs/plugin-vue-jsx
@babel/parser  @babel/traverse
lodash-es
conventional-changelog-cli  # 发布流程使用
```

文件操作走 `node:fs/promises`，子进程走 `node:child_process.spawnSync`，URL 处理走 `node:url`，无更多三方 fs / shell 包。
