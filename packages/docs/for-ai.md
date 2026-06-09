# AI Agent 接入

ccui 文档站按 [llms.txt 规范](https://llmstxt.org)发布了纯文本索引与全量文档，方便 AI agent / IDE 内 Copilot / RAG 流水线低成本检索组件能力。

## 提供的资源

- [`llms.txt`](https://vaebe.github.io/ccui/llms.txt) —— 站点目录索引，列出"入门 / 全部 83+ 组件 / 仓库链接"，每条附一句话描述。适合让模型一眼看清 ccui 有哪些组件、点进哪个 URL 看细节。
- [`llms-full.txt`](https://vaebe.github.io/ccui/llms-full.txt) —— 单文件聚合简介 + 全部组件文档的完整 Markdown。适合一次性灌入上下文做问答 / 代码生成，或作为 RAG 切分原料。
- **单组件页** `components/<name>/index.html` —— 组件官网文档页，让用户 / 模型从 `llms.txt` 索引点进具体组件。

> 两个 txt 文件随站点构建生成，跟随 `docs:build` 自动更新；本地 `pnpm dev` 也会在 `predev` 阶段生成 `packages/docs/public/llms{,-full}.txt`。

## 推荐告诉模型的"系统约定"

把下面这段塞进 system prompt 或项目说明，能显著降低模型在用 ccui 时编造 prop / 拼错前缀的概率：

```text
你正在使用 @vaebe/ccui（Vue 3 + TypeScript 组件库）。
- 所有组件以 c- 前缀使用，例如 <c-button>、<c-form-item>、<c-table>。
- 命令式 API（Message / Notification / Modal / Drawer 等）通过 setup 内
  useMessage() / useNotification() / useModal() hook 调用。
- 完整引入：app.use(ccui)；按需引入推荐配合
  @vaebe/unplugin-vue-components-ccui 暴露的 Vue3CCUIResolver()。
- 组件 API、可选 props、slots、事件以 https://vaebe.github.io/ccui/llms-full.txt
  为权威来源，未在该文档中出现的 prop 视为不存在。
```

## 在常用工具中接入

### Cursor

`Settings → Features → Docs → Add new doc`，把 URL 填为：

```
https://vaebe.github.io/ccui/llms-full.txt
```

之后在对话中用 `@Docs` 选中 `ccui`，Cursor 会把命中的章节注入上下文。也可直接 `@web https://vaebe.github.io/ccui/llms.txt` 临时让模型读索引。

### Claude / ChatGPT 网页版

直接把 [`/llms-full.txt`](https://vaebe.github.io/ccui/llms-full.txt) 链接发给对话，或下载后作为附件上传，模型可一次性看到全部组件文档。一些工作流也支持把 [`/llms.txt`](https://vaebe.github.io/ccui/llms.txt) 当成"目录"先索引，再按需让模型用 fetch 工具拉取单组件页。

### Claude Code / Codex / Gemini CLI 等终端 agent

在仓库根目录的 `AGENTS.md` / `CLAUDE.md` 加一行：

```md
组件库参考：https://vaebe.github.io/ccui/llms-full.txt
```

需要时让 agent 用 `WebFetch` / `curl` 拉取即可。也可以在 CI 阶段把这个 txt 缓存到本地仓库中规避网络抖动。

### Windsurf / Cline / Roo Code

这些 IDE 内置 agent 大多支持 `@url` 或自定义 docs 源，配置方式与 Cursor 类似——指向 `llms-full.txt` 即可作为知识源参与补全。

### MCP / RAG / 自建检索

- 想做"按组件检索"，按 `# Title` 分块切 `llms-full.txt`，每段一个文档单元即可。
- 想做"目录跳转"，把 `llms.txt` 的 Markdown 链接喂给模型，加一个 `fetch(url)` 工具，让模型按需拉取单组件页（HTML 或同名 md）。
- 想保持离线可用，可以把两个 txt 复制进自己的项目作为 fixture，跟随 ccui 版本升级同步刷新。

## 本地生成

```bash
# 在 packages/docs 目录下
node ./scripts/generate-llms.mjs
```

脚本会扫描 `packages/docs/components/*/index.md`，按目录字母序输出：

- `public/llms.txt` —— 站点目录索引
- `public/llms-full.txt` —— 简介 + 全部组件正文的拼接版

新增组件不需要额外配置，只要把目录放在 `packages/docs/components/<kebab-name>/index.md` 即会被自动收录。
