#!/usr/bin/env node
/**
 * 三包统一发布入口。
 *
 * 真实发布固定执行：main/远端预检 → 同步升版 → 根 Changelog 校验 →
 * check/test → release commit → 三包构建与 pack → 临时 dist-tag 发布 →
 * 全部成功后提升目标 dist-tag → annotated tag 与 push。
 *
 * 常用命令：
 *   node scripts/publish.mjs
 *   node scripts/publish.mjs --release patch
 *   node scripts/publish.mjs --release 2.2.0 --tag latest
 *   node scripts/publish.mjs --dry-run --yes
 *   node scripts/publish.mjs --use-current-version --resume
 *
 * `--skip-bump` 仅作为 `--use-current-version` 的兼容别名保留。
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { cwd, exit, stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import {
  changelogHasVersion,
  classifyRegistryLookup,
  createStagingTag,
  isAllowedReleaseHead,
  parsePorcelainPaths,
} from './publish-helpers.mjs'

// Windows 需要 shell 才能找到 pnpm.cmd 一类 shim；所有参数均来自仓库常量或受控版本字段。
process.noDeprecation = true

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CHANGELOG = 'CHANGELOG.md'
const REGISTRY = 'https://registry.npmjs.org/'

// ── 终端输出 ─────────────────────────────────────────────────────────────────
const isTTY = stdout.isTTY
const color = (code, text) => (isTTY ? `\x1b[${code}m${text}\x1b[0m` : text)
const blue = (text) => color('34', text)
const green = (text) => color('32', text)
const red = (text) => color('31', text)
const yellow = (text) => color('33', text)
const dim = (text) => color('2', text)
const step = (text) => console.log(`\n${blue('▸')} ${text}`)
const ok = (text) => console.log(`${green('✓')} ${text}`)
const warn = (text) => console.log(`${yellow('!')} ${text}`)
const fatal = (text) => {
  console.error(`${red('✗')} ${text}`)
  exit(1)
}

// ── CLI 参数 ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const argOf = (key, fallback) => {
  const index = args.indexOf(key)
  return index >= 0 ? args[index + 1] : fallback
}
const TAG = argOf('--tag', 'beta')
const RELEASE = argOf('--release', null)
const DRY_RUN = args.includes('--dry-run')
const YES = args.includes('--yes') || args.includes('-y')
const RESUME = args.includes('--resume')
const USE_CURRENT_VERSION = args.includes('--use-current-version') || args.includes('--skip-bump')

if (!TAG || TAG.startsWith('-')) fatal('--tag 缺少合法值')
if (args.includes('--skip-bump')) warn('--skip-bump 已弃用，请改用 --use-current-version')

// ── 发布矩阵 ─────────────────────────────────────────────────────────────────
// 顺序同时表达依赖关系：ccui 依赖 icons，resolver peer 依赖 ccui。
const PACKAGES = [
  {
    name: '@vaebe/ccui-icons',
    pkgJson: 'packages/icons/package.json',
    build: ['pnpm', '--filter', '@vaebe/ccui-icons', 'build'],
    pubDir: 'packages/icons',
  },
  {
    name: '@vaebe/ccui',
    pkgJson: 'packages/ccui/package.json',
    // 主包先刷新自动产物，再构建总入口、组件分包和发布专用 package.json。
    build: [
      ['node', './index.js', 'generate:theme'],
      ['node', './index.js', 'create', '-t', 'ccui', '--ignore-parse-error'],
      ['node', './index.js', 'build'],
      ['node', './index.js', 'release'],
    ],
    buildCwd: 'packages/cli',
    pubDir: 'packages/ccui/build',
  },
  {
    name: '@vaebe/unplugin-vue-components-ccui',
    pkgJson: 'packages/resolver/package.json',
    build: ['pnpm', '--filter', '@vaebe/unplugin-vue-components-ccui', 'build'],
    pubDir: 'packages/resolver',
  },
]
const RELEASE_PATHS = [...PACKAGES.map((pkg) => pkg.pkgJson), CHANGELOG]

// ── 子进程与文件工具 ─────────────────────────────────────────────────────────
const IS_WIN = process.platform === 'win32'
const WIN_SHIM_CMDS = new Set(['pnpm', 'npx', 'bumpp', 'pnpx'])
const winShell = (cmd) => IS_WIN && WIN_SHIM_CMDS.has(cmd)

/** 执行需要直接显示输出的命令，并返回是否成功。 */
function run(cmd, commandArgs, options = {}) {
  const result = spawnSync(cmd, commandArgs, {
    stdio: 'inherit',
    cwd: ROOT,
    shell: winShell(cmd),
    ...options,
  })
  return result.status === 0
}

/** 执行需要分析 stdout/stderr 的命令。 */
function runCapture(cmd, commandArgs, options = {}) {
  return spawnSync(cmd, commandArgs, {
    encoding: 'utf8',
    cwd: ROOT,
    shell: winShell(cmd),
    ...options,
  })
}

/** 执行关键命令，失败时立即终止发布。 */
function runOrFatal(cmd, commandArgs, options = {}) {
  if (!run(cmd, commandArgs, options)) fatal(`${cmd} ${commandArgs.join(' ')} 失败`)
}

/** 读取仓库内 JSON 文件。 */
function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(ROOT, relativePath), 'utf8'))
}

/** 读取 Git 单行输出；Git 异常不能被误当作空值继续。 */
function gitText(commandArgs, { optional = false } = {}) {
  const result = runCapture('git', commandArgs)
  if (result.status !== 0) {
    if (optional) return ''
    process.stderr.write(result.stderr || '')
    fatal(`git ${commandArgs.join(' ')} 失败`)
  }
  return (result.stdout || '').trim()
}

/** 返回 porcelain 状态中的仓库相对路径。 */
function changedPaths() {
  // porcelain 首列允许为空格，不能复用会 trim 的 gitText，否则首条路径会少一个字符。
  const result = runCapture('git', ['status', '--porcelain', '--untracked-files=all'])
  if (result.status !== 0) {
    process.stderr.write(result.stderr || '')
    fatal('git status --porcelain --untracked-files=all 失败')
  }
  return parsePorcelainPaths(result.stdout || '')
}

/** 限定当前工作区只能包含发布流程允许的文件变化。 */
function ensureOnlyChangedPaths(allowedPaths, message) {
  const allowed = new Set(allowedPaths)
  const unexpected = changedPaths().filter((path) => !allowed.has(path))
  if (unexpected.length > 0) {
    console.log(unexpected.map((path) => `  ${path}`).join('\n'))
    fatal(message)
  }
}

if (!existsSync(resolve(ROOT, 'pnpm-workspace.yaml'))) {
  fatal(`未找到 pnpm-workspace.yaml，cwd 异常: ${cwd()}`)
}

const rl = createInterface({ input: stdin, output: stdout })
const ask = (question) => rl.question(question)

// pack 产物只存在系统临时目录；包括异常退出在内都做同步清理。
let packDir = ''
let localResumeCommitSubject = ''
process.on('exit', () => {
  if (packDir) rmSync(packDir, { recursive: true, force: true })
})

// ── Git、版本与 Changelog 预检 ───────────────────────────────────────────────
/**
 * 限制真实发布来源：main 必须与 origin/main 一致；续发允许本地仅多一个 release commit。
 */
function ensureReleaseSource() {
  const branch = gitText(['branch', '--show-current'])
  if (branch !== 'main') fatal(`真实发布只能从 main 执行，当前分支为 ${branch || '(detached HEAD)'}`)

  step('同步并校验 origin/main')
  runOrFatal('git', ['fetch', 'origin', 'main'])
  const head = gitText(['rev-parse', 'HEAD'])
  const remoteHead = gitText(['rev-parse', 'origin/main'])
  const parentHead = gitText(['rev-parse', 'HEAD^'], { optional: true })
  if (!isAllowedReleaseHead({ head, remoteHead, parentHead, resume: RESUME })) {
    fatal('HEAD 与 origin/main 不一致；请先同步 main。--resume 仅允许一个尚未推送的 release commit')
  }
  if (RESUME && head !== remoteHead) {
    const commitPaths = gitText(['diff', '--name-only', 'origin/main..HEAD']).split('\n').filter(Boolean)
    const unexpected = commitPaths.filter((path) => !RELEASE_PATHS.includes(path))
    if (unexpected.length > 0) fatal(`续发 commit 含非发布文件：${unexpected.join(', ')}`)
    localResumeCommitSubject = gitText(['log', '-1', '--format=%s'])
    ok('检测到尚未推送的 release commit，按续发模式继续')
  } else {
    ok('HEAD 与 origin/main 一致')
  }
}

/** 使用 bumpp 同步修改三个公开包版本，不让 bumpp 自行 commit/tag/push。 */
function bumpVersions() {
  step('同步更新三个公开包版本')
  const bumppArgs = ['bumpp', ...PACKAGES.map((pkg) => pkg.pkgJson), '--no-commit', '--no-tag', '--no-push']
  if (RELEASE) bumppArgs.push('--release', RELEASE)
  runOrFatal('pnpm', ['exec', ...bumppArgs])
}

/** 确保三个公开包采用同一个版本，并返回该版本。 */
function ensureVersionsAligned() {
  const versions = PACKAGES.map((pkg) => ({ name: pkg.name, version: readJson(pkg.pkgJson).version }))
  const unique = [...new Set(versions.map(({ version }) => version))]
  if (unique.length !== 1) {
    versions.forEach(({ name, version }) => console.log(`  ${name}: ${version}`))
    fatal('三个公开包版本不一致')
  }
  return unique[0]
}

/** 确保 --use-current-version 使用的是 HEAD 已提交版本，而不是工作区临时修改。 */
function ensureCurrentVersionsCommitted(version) {
  for (const pkg of PACKAGES) {
    const content = gitText(['show', `HEAD:${pkg.pkgJson}`])
    const committedVersion = JSON.parse(content).version
    if (committedVersion !== version) fatal(`${pkg.pkgJson} 的 ${version} 尚未提交到 HEAD`)
  }
}

/** 根 Changelog 是唯一发布说明；真实发布必须存在目标版本标题。 */
async function ensureChangelog(version) {
  const hasVersion = () => changelogHasVersion(readFileSync(resolve(ROOT, CHANGELOG), 'utf8'), version)
  if (hasVersion()) return
  if (YES) fatal(`${CHANGELOG} 缺少目标版本标题：## [${version}]`)

  console.log(dim(`请把 ${CHANGELOG} 的 Unreleased 内容整理为 ## [${version}]，保存后回到这里。`))
  await ask('更新完成后按 Enter 继续，或 Ctrl+C 终止：')
  if (!hasVersion()) fatal(`${CHANGELOG} 仍缺少目标版本标题：## [${version}]`)
}

/** 发布提交只允许包含三个版本文件和根 Changelog。 */
function createReleaseCommit(version) {
  ensureOnlyChangedPaths(RELEASE_PATHS, '发布准备期间出现了无关文件改动，请处理后重试')
  runOrFatal('git', ['add', ...RELEASE_PATHS])
  const staged = runCapture('git', ['diff', '--cached', '--quiet'])
  if (staged.status === 0) fatal('没有可提交的版本或 Changelog 变化，请改用 --use-current-version')
  runOrFatal('git', ['commit', '-m', `chore: release v${version}`])
  ok(`已创建本地 release commit v${version}；发布成功前不会推送`)
}

/** tag 已存在时只允许续发，并要求它确实指向当前 release commit。 */
function ensureTagState(version) {
  const tag = `v${version}`
  const taggedHead = gitText(['rev-parse', `${tag}^{}`], { optional: true })
  if (!taggedHead) return
  if (!RESUME) fatal(`${tag} 已存在；如需恢复未完成发布，请确认后使用 --resume`)
  if (taggedHead !== gitText(['rev-parse', 'HEAD'])) fatal(`${tag} 未指向当前 HEAD，不能续发`)
  ok(`${tag} 已指向当前 release commit，续发时复用`)
}

// ── 质量、构建与打包 ─────────────────────────────────────────────────────────
/** 发布级质量门禁：静态检查、单测及 E2E 清单完整性检查。 */
function runQualityGates() {
  step('运行发布前质量门禁')
  runOrFatal('pnpm', ['check'])
  runOrFatal('pnpm', ['test'])
  runOrFatal('pnpm', ['check:e2e-coverage'])
}

/** 按依赖顺序构建全部公开包。 */
function buildPackages() {
  for (const [index, pkg] of PACKAGES.entries()) {
    step(`[Build ${index + 1}/${PACKAGES.length}] ${pkg.name}`)
    const buildCwd = pkg.buildCwd ? resolve(ROOT, pkg.buildCwd) : ROOT
    const commands = Array.isArray(pkg.build[0]) ? pkg.build : [pkg.build]
    for (const [cmd, ...commandArgs] of commands) runOrFatal(cmd, commandArgs, { cwd: buildCwd })
  }

  step('构建发布产物消费 fixture')
  runOrFatal('pnpm', ['--dir', 'examples/consumer', 'build'])
}

/**
 * 为每个包生成固定 tarball；后续发布 tarball，避免 publish 阶段重新构建出不同内容。
 */
function packPackages(version) {
  packDir = mkdtempSync(join(tmpdir(), 'ccui-release-'))
  return PACKAGES.map((pkg, index) => {
    step(`[Pack ${index + 1}/${PACKAGES.length}] ${pkg.name}`)
    const filename = `${pkg.name.replace('@', '').replace('/', '-')}-${version}.tgz`
    const tarball = resolve(packDir, filename)
    runOrFatal('pnpm', ['pack', '--out', tarball], { cwd: resolve(ROOT, pkg.pubDir) })
    if (!existsSync(tarball)) fatal(`${pkg.name} 未生成预期 tarball：${tarball}`)
    return { ...pkg, tarball }
  })
}

// ── Registry 预检与发布 ───────────────────────────────────────────────────────
/** 查询指定包版本；只有 npm 明确返回 404 才视为未发布。 */
function registryVersionExists(pkg, version) {
  const result = runCapture('npm', ['view', `${pkg.name}@${version}`, 'version', '--json', '--registry', REGISTRY])
  const state = classifyRegistryLookup(result)
  if (state === 'error') {
    process.stderr.write(result.stderr || '')
    fatal(`无法确认 ${pkg.name}@${version} 的 registry 状态`)
  }
  return state === 'exists'
}

/** 普通发布拒绝任何版本碰撞；--resume 才允许跳过已存在的包。 */
function inspectRegistry(packages, version) {
  step('检查 npm registry 版本占用')
  /** @type {Set<string>} 已确认存在于 registry、仅允许续发跳过的包名。 */
  const existing = new Set()
  for (const pkg of packages) {
    if (registryVersionExists(pkg, version)) existing.add(pkg.name)
  }
  if (existing.size > 0 && !RESUME) {
    console.log([...existing].map((name) => `  ${name}@${version}`).join('\n'))
    fatal('目标版本已存在；普通发布不会跳过。确认是中断续发后使用 --resume')
  }
  if (existing.size > 0) warn(`续发将跳过 ${existing.size} 个 registry 已存在的包`)
  else ok('三个目标版本均未占用')
  return existing
}

/** 发布前确认 npm 会话；dry-run 不需要登录。 */
async function ensureLoggedIn() {
  const result = runCapture('npm', ['whoami', '--registry', REGISTRY])
  if (result.status === 0) {
    ok(`npm 账号：${result.stdout.trim()}`)
    return
  }
  warn('未登录 npm 或会话已过期')
  const answer = await ask('现在打开浏览器走 passkey 登录？[Y/n] ')
  if (/^n$/i.test(answer.trim())) fatal('已取消')
  runOrFatal('npm', ['login', '--auth-type=web', '--registry', REGISTRY])
}

/** 将单个 tarball 发布到临时 tag；2FA 可重登或使用老账号 TOTP。 */
async function publishTarball(pkg, index, stagingTag) {
  step(`[Publish ${index + 1}/${PACKAGES.length}] ${pkg.name} → ${stagingTag}`)
  const baseArgs = ['publish', pkg.tarball, '--tag', stagingTag, '--registry', REGISTRY]

  let attempt = 0
  while (attempt < 3) {
    attempt += 1
    const result = spawnSync('npm', baseArgs, {
      cwd: ROOT,
      stdio: ['inherit', 'inherit', 'pipe'],
      encoding: 'utf8',
      shell: winShell('npm'),
    })
    const stderr = result.stderr || ''
    process.stderr.write(stderr)
    if (result.status === 0) {
      ok(`${pkg.name} 发布完成`)
      return
    }

    const duplicate = /E409|cannot publish over|previously published/i.test(stderr)
    if (duplicate) {
      if (RESUME && registryVersionExists(pkg, ensureVersionsAligned())) {
        warn(`${pkg.name} 已由并发或上次尝试发布，按续发模式跳过`)
        return
      }
      fatal(`${pkg.name} 发生版本冲突；只有明确的 --resume 才允许跳过`)
    }

    const needs2FA = /E403|EOTP|Two-?factor authentication|OTP/i.test(stderr)
    if (needs2FA) {
      console.log('  [r] 重新执行 npm login --auth-type=web')
      console.log('  [o] 输入老账号 TOTP')
      console.log('  [x] 终止，之后用 --use-current-version --resume 续发')
      const choice = (await ask('选择 [r/o/x] ')).trim().toLowerCase()
      if (choice === 'x') fatal(`终止于 ${pkg.name}`)
      if (choice === 'o') {
        const otp = (await ask('OTP 6 位：')).trim()
        if (otp && run('npm', [...baseArgs, `--otp=${otp}`])) return
        warn('TOTP 重试失败')
      } else {
        runOrFatal('npm', ['login', '--auth-type=web', '--registry', REGISTRY])
      }
      continue
    }

    warn(`${pkg.name} 发布失败（第 ${attempt} 次），准备重试`)
  }
  fatal(`${pkg.name} 连续三次发布失败；修复后使用 --use-current-version --resume`)
}

/** 三包全部存在后，才统一把用户可见 dist-tag 指向目标版本。 */
function promoteDistTags(packages, version, stagingTag) {
  step(`统一提升 dist-tag：${TAG}`)
  for (const pkg of packages) {
    runOrFatal('npm', ['dist-tag', 'add', `${pkg.name}@${version}`, TAG, '--registry', REGISTRY])
    ok(`${pkg.name}@${version} → ${TAG}`)
  }

  // 临时 tag 已完成隔离职责；删除失败不影响最终 tag，保留警告供人工清理。
  for (const pkg of packages) {
    const result = runCapture('npm', ['dist-tag', 'rm', pkg.name, stagingTag, '--registry', REGISTRY])
    if (result.status !== 0) warn(`${pkg.name} 的临时 tag ${stagingTag} 未删除，请人工确认`)
  }
}

/** 发布与 dist-tag 提升成功后，补齐 annotated tag 并推送 release commit。 */
function pushRelease(version) {
  const tag = `v${version}`
  const existing = gitText(['rev-parse', `${tag}^{}`], { optional: true })
  if (!existing) runOrFatal('git', ['tag', '-a', tag, '-m', `Release ${tag}`])
  else if (existing !== gitText(['rev-parse', 'HEAD'])) fatal(`${tag} 指向异常，拒绝推送`)
  runOrFatal('git', ['push', '--follow-tags', 'origin', 'main'])
  ok(`release commit 与 ${tag} 已推送`)
}

// ── 主流程 ───────────────────────────────────────────────────────────────────
if (!DRY_RUN) {
  ensureReleaseSource()
  // 自动升版允许作者提前编辑唯一的根 Changelog；其余改动一律拒绝。
  ensureOnlyChangedPaths(USE_CURRENT_VERSION ? [] : [CHANGELOG], '真实发布前存在无关工作区改动')
  // 在修改版本文件前先挡住格式、类型和测试问题，失败时不留下半完成的升版状态。
  runQualityGates()
}

if (!DRY_RUN && !USE_CURRENT_VERSION) bumpVersions()
const VERSION = ensureVersionsAligned()
const STAGING_TAG = createStagingTag(VERSION)

if (localResumeCommitSubject && localResumeCommitSubject !== `chore: release v${VERSION}`) {
  fatal(`续发 commit 标题与目标版本不符：${localResumeCommitSubject}`)
}

console.log(`\n发布版本：${green(VERSION)}    目标 tag：${green(TAG)}    临时 tag：${green(STAGING_TAG)}`)
if (DRY_RUN) {
  if (!changelogHasVersion(readFileSync(resolve(ROOT, CHANGELOG), 'utf8'), VERSION)) {
    warn(`dry-run：${CHANGELOG} 尚无 ${VERSION} 标题，真实发布会拒绝`)
  }
} else {
  await ensureChangelog(VERSION)
  if (USE_CURRENT_VERSION) ensureCurrentVersionsCommitted(VERSION)
  ensureTagState(VERSION)
}

let existingPackages = new Set()
if (!DRY_RUN) existingPackages = inspectRegistry(PACKAGES, VERSION)

if (DRY_RUN) runQualityGates()

if (!DRY_RUN && !USE_CURRENT_VERSION) createReleaseCommit(VERSION)

buildPackages()
const packedPackages = packPackages(VERSION)

// npm publish --dry-run 仍会查询 registry 并对已发布版本报 E409；pack 成功即完成离线预演。
if (DRY_RUN) {
  rl.close()
  warn('dry-run 完成：tarball 已验证；未查询 registry、未发布、未改 dist-tag、未创建 tag 或推送')
  console.log(`\n${green('🎉')} 发布预演完成`)
  exit(0)
}

if (YES) ok('--yes / -y：跳过发布确认')
else {
  const confirmation = await ask('确认发布三个 tarball？[y/N] ')
  if (!/^y$/i.test(confirmation.trim())) fatal('已取消')
}

await ensureLoggedIn()

for (const [index, pkg] of packedPackages.entries()) {
  if (existingPackages.has(pkg.name)) {
    warn(`[Publish ${index + 1}/${PACKAGES.length}] ${pkg.name}@${VERSION} 已存在，续发跳过`)
    continue
  }
  await publishTarball(pkg, index, STAGING_TAG)
}

rl.close()

promoteDistTags(packedPackages, VERSION, STAGING_TAG)
pushRelease(VERSION)

console.log(`\n${green('🎉')} 发布流程完成`)
console.log('验证：')
for (const pkg of PACKAGES) console.log(`  npm view ${pkg.name} dist-tags`)
