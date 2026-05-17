#!/usr/bin/env node
/**
 * 预发布 / 正式发布脚本。
 *
 * 工作流（默认全自动，必要节点会交互确认）：
 *   1. npm 登录预检（passkey / 2FA）
 *   2. 工作区干净校验
 *   3. bumpp 同步 bump 三个发布包的版本号
 *   4. conventional-changelog 重新生成 packages/cli/CHANGELOG.md
 *   5. 用户确认后构建 → 发布到 npm
 *   6. 创建 `chore: release vX.Y.Z` 提交（版本号 + changelog）+ 打 tag
 *   7. `git push --follow-tags` 推送
 *
 * 常用：
 *   node scripts/publish.mjs                              # 交互式选版本，dist-tag=beta
 *   node scripts/publish.mjs --release patch              # 非交互式 patch 升版
 *   node scripts/publish.mjs --release 2.1.0 --tag latest # 指定版本 + 正式发版
 *   node scripts/publish.mjs --dry-run                    # 跳过 bump/changelog，只走构建发布预演
 *   node scripts/publish.mjs --skip-bump                  # 复用已 bump 好的版本号
 *   node scripts/publish.mjs --skip-changelog             # 不重新生成 changelog
 *   node scripts/publish.mjs --skip-login                 # 已确认 session 有效
 *
 * 2FA / 鉴权（2026 年起的 npm 新流程）：
 *   - npm 自 2025-09 起停止接受新的 TOTP 注册，改用 WebAuthn / passkey。
 *   - 发布前需要一个 **有效会话**（npm login 后给 2 小时窗口）或
 *     **granular access token with bypass-2FA**。
 *   - 本脚本会先 `npm whoami` 验证；失败时引导 `npm login --auth-type=web`
 *     一次性走完浏览器 passkey 验证。
 *   - 老 TOTP 账号仍可用 --otp=<6位> 兜底；脚本会在发布失败检测到 2FA 错误
 *     时给出明确指引，不再每包死循环问 OTP。
 */
import { spawnSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout, exit, cwd } from 'node:process'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// ── 终端配色 ─────────────────────────────────────────────────────────────────
const isTTY = stdout.isTTY
const color = (c, s) => (isTTY ? `\x1b[${c}m${s}\x1b[0m` : s)
const blue = (s) => color('34', s)
const green = (s) => color('32', s)
const red = (s) => color('31', s)
const yellow = (s) => color('33', s)
const dim = (s) => color('2', s)
const step = (s) => console.log(`\n${blue('▸')} ${s}`)
const ok = (s) => console.log(`${green('✓')} ${s}`)
const warn = (s) => console.log(`${yellow('!')} ${s}`)
const fatal = (s) => {
  console.error(`${red('✗')} ${s}`)
  exit(1)
}

// ── CLI 参数 ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const argOf = (k, fallback) => {
  const i = args.indexOf(k)
  return i >= 0 ? args[i + 1] : fallback
}
const TAG = argOf('--tag', 'beta')
const DRY_RUN = args.includes('--dry-run')
const SKIP_LOGIN = args.includes('--skip-login')
const SKIP_BUMP = args.includes('--skip-bump')
const SKIP_CHANGELOG = args.includes('--skip-changelog')
const RELEASE = argOf('--release', null) // 透传给 bumpp：patch / minor / major / 2.1.0 / ...

// ── 发布矩阵 ─────────────────────────────────────────────────────────────────
// 每项描述一个可发布包：从哪里读版本、用哪个工具发、从哪个工作目录发。
//   tool:  'pnpm' 自动展开 workspace: 协议；'npm' 直接发已生成 build/ 的产物。
//   build: 该包的构建命令（数组），相对 ROOT 工作目录。null 表示无需额外构建。
//   pubDir: publish 命令的工作目录（相对 ROOT）。
//   pkgJson: 读取版本号的 package.json（相对 ROOT）。
const PACKAGES = [
  {
    name: '@vaebe/ccui-icons',
    pkgJson: 'packages/icons/package.json',
    build: ['pnpm', '--filter', '@vaebe/ccui-icons', 'build'],
    pubDir: 'packages/icons',
    tool: 'pnpm',
  },
  {
    name: '@vaebe/ccui',
    pkgJson: 'packages/ccui/package.json',
    // ccui 走 cli：predev 生成入口 → 组件分包构建 → release.js 生成发布用 package.json
    build: [
      ['node', './index.js', 'create', '-t', 'ccui', '--ignore-parse-error'],
      ['node', './index.js', 'build'],
      ['node', './index.js', 'release'],
    ],
    buildCwd: 'packages/cli',
    pubDir: 'packages/ccui/build',
    tool: 'npm',
  },
  {
    name: '@vaebe/unplugin-vue-components-ccui',
    pkgJson: 'packages/resolver/package.json',
    build: ['pnpm', '--filter', '@vaebe/unplugin-vue-components-ccui', 'build'],
    pubDir: 'packages/resolver',
    tool: 'pnpm',
  },
]

// ── 工具函数 ─────────────────────────────────────────────────────────────────
function readJson(rel) {
  return JSON.parse(readFileSync(resolve(ROOT, rel), 'utf8'))
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: ROOT, ...opts })
  return r.status === 0
}

function runCapture(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { encoding: 'utf8', cwd: ROOT, ...opts })
}

function runOrFatal(cmd, args, opts = {}) {
  if (!run(cmd, args, opts)) fatal(`${cmd} ${args.join(' ')} 失败`)
}

const rl = createInterface({ input: stdin, output: stdout })
const ask = (q) => rl.question(q)

// ── 前置校验 ─────────────────────────────────────────────────────────────────
if (!existsSync(resolve(ROOT, 'pnpm-workspace.yaml'))) {
  fatal(`未找到 pnpm-workspace.yaml，cwd 异常: ${cwd()}`)
}

// ── 鉴权预检（passkey 流程） ─────────────────────────────────────────────────
//
// npm 2026 实际流程：
//   - `npm whoami` 成功 = 本地有 auth token，可以读 registry
//   - 但 publish 需要的是 **当前会话内的 2FA 通过状态**
//   - `npm login --auth-type=web` 走浏览器一次 passkey，拿到 2 小时窗口
//   - 或者：用 granular token with bypass-2FA，长期免 2FA
//
// 这里只能"乐观假设" whoami 通过即可尝试 publish；真正的 2FA 校验在 publish
// 时由 registry 强制。失败时给具体指引。
async function ensureLoggedIn() {
  const r = runCapture('npm', ['whoami'])
  if (r.status === 0) {
    ok(`npm 账号：${r.stdout.trim()}`)
    return
  }
  warn('未登录 npm 或会话已过期')
  if (SKIP_LOGIN || DRY_RUN) {
    warn('继续（--skip-login / --dry-run），但 publish 可能失败')
    return
  }
  const yes = await ask('现在打开浏览器走 passkey 登录？[Y/n] ')
  if (/^n$/i.test(yes.trim())) fatal('已取消')
  console.log(dim('npm 会打印一个 URL，浏览器打开并用 passkey/Touch ID 验证'))
  if (!run('npm', ['login', '--auth-type=web'])) fatal('npm login 失败')
  ok('登录成功（2 小时会话）')
}

// ── 工作区干净校验 ────────────────────────────────────────────────────────────
function ensureCleanGit() {
  const r = runCapture('git', ['status', '--porcelain'])
  if ((r.stdout || '').trim()) {
    console.log(r.stdout)
    fatal('工作区有未提交改动。请先 commit / stash，或加 --skip-bump 跳过版本号自动更新')
  }
}

// ── 版本号同步（bumpp） ───────────────────────────────────────────────────────
// bumpp 一把更新三个发布包的 package.json，自己不做 commit/tag/push，
// 由本脚本在 publish 成功后统一打 commit + tag + push（含 changelog）。
async function bumpVersions() {
  step('Bump versions (bumpp)')
  const pkgFiles = PACKAGES.map((p) => p.pkgJson)
  const bumppArgs = [
    'bumpp',
    ...pkgFiles,
    '--no-commit',
    '--no-tag',
    '--no-push',
  ]
  if (RELEASE) bumppArgs.push('--release', RELEASE)
  if (!run('pnpm', ['exec', ...bumppArgs])) fatal('bumpp 失败')
}

function ensureVersionsAligned() {
  const versions = PACKAGES.map((p) => ({ name: p.name, version: readJson(p.pkgJson).version }))
  const uniq = [...new Set(versions.map((v) => v.version))]
  if (uniq.length !== 1) {
    console.log('版本号不一致：')
    versions.forEach((v) => console.log(`  ${v.name}: ${v.version}`))
    fatal('请先把三个发布包的版本号对齐（或不要 --skip-bump）')
  }
  return uniq[0]
}

// ── changelog（conventional-changelog） ──────────────────────────────────────
// cli 里早就接了 `pnpm changelog`（conventional-changelog-cli），
// 这里复用它，避免在 root 再装一份重复依赖。
// 注意：packages/cli/CHANGELOG.md 在仓库 .gitignore 列表里（packages/*/CHANGELOG.md），
// 是「本地生成的参考产物」，不入库。脚本只生成不 add，给作者手写
// 根目录 CHANGELOG.md 时做参考。
function generateChangelog() {
  step('Regenerate CHANGELOG (conventional-changelog)')
  runOrFatal('pnpm', ['--filter', 'ccui-cli', 'changelog'])
  ok('packages/cli/CHANGELOG.md 已更新（本地参考，不入库）')
}

// ── 主流程 ───────────────────────────────────────────────────────────────────
await ensureLoggedIn()

if (DRY_RUN) {
  // dry-run 不改动任何文件，仅验证现有版本号一致并走构建/发布预演
  ensureVersionsAligned()
} else if (SKIP_BUMP) {
  ensureVersionsAligned()
} else {
  ensureCleanGit()
  await bumpVersions()
  ensureVersionsAligned()
  if (!SKIP_CHANGELOG) generateChangelog()
}

const VERSION = ensureVersionsAligned()

console.log(`\n发布版本：${green(VERSION)}    dist-tag：${green(TAG)}    ${DRY_RUN ? yellow('(dry-run)') : ''}`)
if (!DRY_RUN && !SKIP_BUMP) {
  console.log(dim('版本号 + CHANGELOG 已落到工作区但未提交。需要手改 CHANGELOG 现在打开编辑器，'))
  console.log(dim('回到这里再按 y 继续；脚本会在 publish 成功后统一 commit + tag + push。'))
}
const confirm = await ask('确认开始构建并发布？[y/N] ')
if (!/^y$/i.test(confirm.trim())) {
  rl.close()
  fatal('已取消')
}

// ── 构建 ─────────────────────────────────────────────────────────────────────
for (const [i, pkg] of PACKAGES.entries()) {
  step(`[Build ${i + 1}/${PACKAGES.length}] ${pkg.name}`)
  const buildCwd = pkg.buildCwd ? resolve(ROOT, pkg.buildCwd) : ROOT
  const steps = Array.isArray(pkg.build[0]) ? pkg.build : [pkg.build]
  for (const [cmd, ...rest] of steps) {
    runOrFatal(cmd, rest, { cwd: buildCwd })
  }
}

// ── 发布 ─────────────────────────────────────────────────────────────────────
//
// 失败处理：
//   1. 检测错误码 E403 / "Two-factor authentication" → 会话失效，引导重登
//   2. 检测错误码 E409 / "cannot publish over the previously published versions"
//      → 版本号撞了，致命退出
//   3. 其他 → 单纯重试一次
async function publish(pkg, idx) {
  step(`[Publish ${idx + 1}/${PACKAGES.length}] ${pkg.name}`)
  let attempt = 0
  while (true) {
    attempt += 1
    const baseArgs = ['publish', '--tag', TAG]
    if (pkg.tool === 'pnpm') baseArgs.push('--no-git-checks')
    if (DRY_RUN) baseArgs.push('--dry-run')

    // capture stderr 用于诊断；同时 inherit stdout/stderr 让用户看到全程
    const result = spawnSync(pkg.tool, baseArgs, {
      cwd: resolve(ROOT, pkg.pubDir),
      stdio: ['inherit', 'inherit', 'pipe'],
      encoding: 'utf8',
    })
    const stderr = result.stderr || ''
    process.stderr.write(stderr)

    if (result.status === 0) {
      ok(`${pkg.name}@${VERSION} 已${DRY_RUN ? '（dry-run）' : ''}发布`)
      return
    }
    if (DRY_RUN) {
      rl.close()
      fatal(`${pkg.name} dry-run 失败`)
    }

    // 2FA 失败：会话过期或未通过 passkey
    const is2FA = /E403|Two-?factor authentication|OTP/i.test(stderr)
    const isDup = /E409|cannot publish over|previously published/i.test(stderr)

    if (isDup) {
      rl.close()
      fatal(`${pkg.name}@${VERSION} 已在 registry 存在，版本号需要 bump`)
    }

    if (is2FA) {
      warn('需要 2FA 授权（passkey 或 OTP）')
      console.log('选项：')
      console.log('  [r] 重新跑 npm login --auth-type=web 再试')
      console.log('  [o] 输入一次性 TOTP（老账号）')
      console.log('  [x] 终止')
      const choice = (await ask('选择 [r/o/x] ')).trim().toLowerCase()
      if (choice === 'x') {
        rl.close()
        fatal(`终止于 ${pkg.name}`)
      }
      if (choice === 'o') {
        const otp = (await ask('OTP 6 位: ')).trim()
        if (!otp) {
          warn('未输 OTP，跳回重试')
          continue
        }
        // 单次重试带 OTP
        const argsWithOtp = [...baseArgs, `--otp=${otp}`]
        if (run(pkg.tool, argsWithOtp, { cwd: resolve(ROOT, pkg.pubDir) })) {
          ok(`${pkg.name}@${VERSION} 已发布`)
          return
        }
        warn('带 OTP 重试仍失败')
        continue
      }
      // 'r' or other → relogin
      if (!run('npm', ['login', '--auth-type=web'])) {
        warn('npm login 失败')
      }
      continue
    }

    if (attempt >= 3) {
      rl.close()
      fatal(`${pkg.name} 连续 ${attempt} 次失败，请人工排查`)
    }
    warn(`${pkg.name} 发布失败（第 ${attempt} 次），重试...`)
  }
}

for (const [i, pkg] of PACKAGES.entries()) {
  await publish(pkg, i)
}

rl.close()

// ── 收尾：commit + tag + push ────────────────────────────────────────────────
if (DRY_RUN) {
  warn('dry-run 模式不打 tag、不 commit、不 push')
} else if (SKIP_BUMP) {
  // 用户自己 bump 的，自己负责 commit；这里只补 tag + push tag
  step(`打 git tag v${VERSION}`)
  const tagExists = spawnSync('git', ['rev-parse', `v${VERSION}`], { stdio: 'ignore' }).status === 0
  if (tagExists) {
    warn(`tag v${VERSION} 已存在，跳过`)
  } else {
    runOrFatal('git', ['tag', '-a', `v${VERSION}`, '-m', `Release v${VERSION}`])
    runOrFatal('git', ['push', 'origin', `v${VERSION}`])
    ok(`tag v${VERSION} 已推送`)
  }
} else {
  step(`提交 release: v${VERSION}`)
  // 只 add 三个发布包的 package.json。
  // packages/cli/CHANGELOG.md 在 .gitignore 里，是本地参考产物，不入库。
  const addPaths = PACKAGES.map((p) => p.pkgJson)
  runOrFatal('git', ['add', ...addPaths])
  runOrFatal('git', ['commit', '-m', `chore: release v${VERSION}`])
  // 必须 annotated tag (-a)，lightweight tag 不会被 push --follow-tags 推上去。
  const tagExists = spawnSync('git', ['rev-parse', `v${VERSION}`], { stdio: 'ignore' }).status === 0
  if (tagExists) {
    warn(`tag v${VERSION} 已存在，跳过 tag`)
  } else {
    runOrFatal('git', ['tag', '-a', `v${VERSION}`, '-m', `Release v${VERSION}`])
  }
  runOrFatal('git', ['push', '--follow-tags'])
  ok(`commit + tag v${VERSION} 已推送`)
}

// ── 收尾 ─────────────────────────────────────────────────────────────────────
console.log(`\n${green('🎉')} 全部完成`)
console.log('验证：')
for (const p of PACKAGES) console.log(`  npm view ${p.name} dist-tags`)
console.log('\n下游安装：')
console.log(`  pnpm add @vaebe/ccui@${TAG} @vaebe/ccui-icons@${TAG}`)
console.log(`  pnpm add -D @vaebe/unplugin-vue-components-ccui@${TAG}`)
