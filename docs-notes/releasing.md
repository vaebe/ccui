# 发布流程

仓库一次发 3 个公开包到 npm：

| 包名                                  | 角色                                      | 工作目录                              | 发布工具       |
| ------------------------------------- | ----------------------------------------- | ------------------------------------- | -------------- |
| `@vaebe/ccui-icons`                   | 离线 SVG 图标库（Tree switcher 等内部用） | `packages/icons/`                     | `pnpm publish` |
| `@vaebe/ccui`                         | 组件主包                                  | `packages/ccui/build/`（由 cli 生成） | `npm publish`  |
| `@vaebe/unplugin-vue-components-ccui` | 按需引入 resolver                         | `packages/resolver/`                  | `pnpm publish` |

私有包（不上 npm）：`@vaebe/ccui-theme`、`ccui-cli`，都标了 `private: true`。

## 一键发布

```bash
pnpm release                                               # 交互选版本 + dist-tag=beta
pnpm release:dry                                           # 完整检查、构建与 pack，不访问 registry
node scripts/publish.mjs --release 2.2.0 --tag latest      # 指定版本 + 正式版
node scripts/publish.mjs --release patch                   # 非交互 patch 升版
node scripts/publish.mjs --use-current-version --resume    # 中断后续发
```

脚本执行顺序：

1. **发布来源检查** —— 真实发布只能从 `main` 执行；脚本 fetch 后要求 `HEAD === origin/main`。续发仅额外允许本地存在一个尚未推送的 release commit。
2. **工作区与质量门禁** —— 除允许提前编辑的根 `CHANGELOG.md` 外，工作区必须干净；在修改版本文件前依次执行 `pnpm check`、`pnpm test`、`pnpm check:e2e-coverage`。
3. **版本号 bump** —— 用 `bumpp` 同步更新三个公开包版本。
4. **Changelog 检查** —— 根 `CHANGELOG.md` 必须存在 `## [目标版本]` 标题。它是唯一正式发布说明，会和三个版本文件一起进入 release commit。
5. **本地 release commit** —— 构建和发包前固定源码版本；成功前不推送。
6. **顺序构建**：
   - icons：`pnpm --filter @vaebe/ccui-icons build`（tsdown 出 `dist/`）
   - ccui：`cli generate:theme` → `cli create -t ccui` → `cli build` → `cli release`
   - resolver：`pnpm --filter @vaebe/unplugin-vue-components-ccui build`
   - consumer fixture：验证主入口、组件 subpath、CSS 与 resolver 能被下游构建
7. **固定 pack 产物** —— 三个包全部通过 `pnpm pack` 生成临时 tarball，发布阶段不再重新构建。
8. **Registry 预检** —— 普通发布要求三个目标版本都不存在；只有显式 `--resume` 才能跳过已存在包。
9. **隔离发布** —— 先发布到 `release-<version>` 临时 dist-tag；三个包全部成功后，再统一提升到目标 `beta` / `latest`。
10. **Git 收尾** —— 创建 annotated tag `v<version>`，最后 push release commit 与 tag。

`pnpm release:dry` 会运行质量门禁、构建和 pack，但不会 fetch、bump、查询 registry、创建 commit/tag、修改 dist-tag 或 push。npm 的 `publish --dry-run` 仍会查询 registry 并对已发布版本报 E409，因此离线预演以三个固定 tarball 成功生成为完成标准。

## 2FA / 鉴权（重点）

npm 从 **2025-09** 起**停止接受新的 TOTP 注册**，全面推 WebAuthn / passkey。当前规则：

| 账号状态             | 老 TOTP（authenticator app） | Passkey / WebAuthn |
| -------------------- | ---------------------------- | ------------------ |
| 已绑过 TOTP 的老账号 | ✅ 仍可用 `--otp=<6位>`      | ✅ 可叠加          |
| 新账号 / 重新绑 2FA  | ❌ UI 选项已移除             | ✅ 唯一选择        |

### 推荐：passkey 流程

```bash
npm login --auth-type=web
```

- 终端打印一个 `https://www.npmjs.com/login?next=/login/cli/<id>` 链接
- 浏览器打开 → 触发 passkey 弹窗 →
  - Mac：Touch ID 指纹
  - Win：Windows Hello
  - 物理 key：Yubikey 等触摸
- 通过后终端拿到 **2 小时会话 token**
- 期间 `npm publish` 不再要求 OTP

### 兜底：TOTP（仅老账号）

发布脚本检测到 2FA 失败时会给三选项：

```
需要 2FA 授权（passkey 或 OTP）
选项：
  [r] 重新跑 npm login --auth-type=web 再试
  [o] 输入一次性 TOTP（老账号）
  [x] 终止
```

按 `o` 输 6 位码即可单次重试。

### 一劳永逸：granular access token with bypass-2FA

适合 CI/CD 或不想每 2 小时重登的本地开发：

1. https://www.npmjs.com/settings/<user>/tokens/granular-access-tokens/new
2. 配置：
   - **Expiration**：30/90/365 天自选
   - **Packages and scopes** → "Only select packages and scopes" → 勾 `@vaebe` scope → **Read and write**
   - **2FA** → 勾 **Allow this token to bypass 2FA**
3. 生成后复制（**只能看一次**），写入：
   ```bash
   npm config set //registry.npmjs.org/:_authToken <token>
   ```
4. 跑发布，OTP 提示直接回车跳过

## 故障排查

### `E403 Two-factor authentication required`

会话过期或未通过 2FA。按上面 passkey/TOTP 流程处理。

### `E402 npm 2FA token required` 或 `EOTP`

同上，需 2FA。

### `E409 cannot publish over previously published versions`

普通发布遇到版本占用会终止，防止误把其他发布当作当前批次。若确认是本脚本中断造成的部分发布，保持 release commit 不变并执行：

```bash
node scripts/publish.mjs --use-current-version --resume --tag beta
```

续发会重新检查、构建和 pack，跳过 registry 已存在的包，然后补发其余包并统一提升最终 dist-tag。

### `ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC`

某个包 devDependencies 写了 `"vue": "catalog:"` 但 `pnpm-workspace.yaml` 的 catalog 里没登记。要么把它加进 catalog，要么写显式版本号（如 `"vue": "^3.5.33"`）。

### Icons / resolver 的 workspace dep 在发布产物里仍是 `workspace:^`

确认走的是 `pnpm publish` 而不是 `npm publish` —— 后者不展开 workspace 协议。`@vaebe/ccui` 主包是例外：它从 `packages/ccui/build/` 用 `npm publish` 发，但 build/ 里的 `package.json` 已由 `cli prepare-release` 提前展开。

## 版本号管理

三包 version **必须保持一致**，由发布脚本强制校验：

```
packages/icons/package.json
packages/ccui/package.json
packages/resolver/package.json
```

正常情况**不用手动改**——`pnpm release` 内部已用 [`bumpp`](https://github.com/antfu/bumpp)（已在根 devDeps）一把同步 bump 三个包（交互选档，或 `--release patch|minor|major|<version>` 非交互）。

需要在发布前单独 bump（比如先开 PR 改版本号）时再手动跑：

```bash
npx bumpp packages/icons/package.json packages/ccui/package.json packages/resolver/package.json
```

提前升版时必须同时更新根 `CHANGELOG.md`，把版本文件和 Changelog 提交到 `main`，然后使用：

```bash
node scripts/publish.mjs --use-current-version
```

旧参数 `--skip-bump` 目前仍是兼容别名，但会显示弃用警告。

## Changelog 约定

- 根 `CHANGELOG.md` 是唯一正式发布记录；`packages/*/CHANGELOG.md` 不参与发布。
- 开发期间把内容写在 `## [Unreleased]`。
- 发布前将其整理为 `## [x.y.z] - YYYY-MM-DD`；脚本会校验目标版本标题并纳入 release commit。
- `--yes` 不会跳过 Changelog 校验，因此非交互发布必须提前准备好目标版本标题。

## 中断恢复边界

- release commit 已创建但尚未发布：修复环境后使用 `--use-current-version --resume`。
- 部分包已经发布到临时 tag：同一命令会显式跳过已存在版本并继续。
- 三包已发布但最终 tag 或 Git push 失败：续发会幂等地重做 dist-tag 提升并补推 Git。
- 不确认 registry 中的版本是否属于当前 release commit 时，不要使用 `--resume`。
