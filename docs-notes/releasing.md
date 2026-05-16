# 发布流程

仓库一次发 3 个公开包到 npm：

| 包名 | 角色 | 工作目录 | 发布工具 |
|---|---|---|---|
| `@vaebe/ccui-icons` | 离线 SVG 图标库（Tree switcher 等内部用） | `packages/icons/` | `pnpm publish` |
| `@vaebe/ccui` | 组件主包 | `packages/ccui/build/`（由 cli 生成） | `npm publish` |
| `@vaebe/unplugin-vue-components-ccui` | 按需引入 resolver | `packages/resolver/` | `pnpm publish` |

私有包（不上 npm）：`@vaebe/ccui-theme`、`ccui-cli`，都标了 `private: true`。

## 一键发布

```bash
pnpm release          # dist-tag=beta，预发布
pnpm release:dry      # 走全流程但不真 publish（验证用）
node scripts/publish.mjs --tag latest    # 正式发版
node scripts/publish.mjs --skip-login    # 已知 session 有效时跳过预检
```

脚本执行顺序：

1. **登录预检** —— `npm whoami` 失败时引导 `npm login --auth-type=web`
2. **版本一致性校验** —— 三包 version 必须相等，否则拒绝
3. **顺序构建**：
   - icons：`pnpm --filter @vaebe/ccui-icons build`（tsdown 出 `dist/`）
   - ccui：`cli create -t ccui` → `cli build` → `cli prepare-release`（生成 `packages/ccui/build/package.json`，展开 `workspace:` 协议）
   - resolver：`pnpm --filter @vaebe/unplugin-vue-components-ccui build`
4. **顺序 publish**（依赖顺序：icons → ccui → resolver）
5. **git tag** `v<version>` + `git push origin v<version>`

## 2FA / 鉴权（重点）

npm 从 **2025-09** 起**停止接受新的 TOTP 注册**，全面推 WebAuthn / passkey。当前规则：

| 账号状态 | 老 TOTP（authenticator app） | Passkey / WebAuthn |
|---|---|---|
| 已绑过 TOTP 的老账号 | ✅ 仍可用 `--otp=<6位>` | ✅ 可叠加 |
| 新账号 / 重新绑 2FA | ❌ UI 选项已移除 | ✅ 唯一选择 |

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

版本号撞了。bump 三包 version 后重试。脚本会**致命退出**不重试，防止误覆盖。

### `ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC`

某个包 devDependencies 写了 `"vue": "catalog:"` 但 `pnpm-workspace.yaml` 的 catalog 里没登记。要么把它加进 catalog，要么写显式版本号（如 `"vue": "^3.5.33"`）。

### Icons / resolver 的 workspace dep 在发布产物里仍是 `workspace:^`

确认走的是 `pnpm publish` 而不是 `npm publish` —— 后者不展开 workspace 协议。`@vaebe/ccui` 主包是例外：它从 `packages/ccui/build/` 用 `npm publish` 发，但 build/ 里的 `package.json` 已由 `cli prepare-release` 提前展开。

## 版本号管理

三包 version **必须保持一致**，由发布脚本强制校验。bump 时同步改：

```
packages/icons/package.json
packages/ccui/package.json
packages/resolver/package.json
```

可以手改，也可以用 [`bumpp`](https://github.com/antfu/bumpp)（已在根 devDeps）：

```bash
npx bumpp packages/*/package.json
```

之后跑 `pnpm release` 即可。
