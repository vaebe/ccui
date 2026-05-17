import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import chalk from 'chalk'
import { discoverComponents } from '../shared/discover-components.js'
import { runCommand } from '../shared/run-command.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const log = console.log
const chalkEslint = chalk.hex('#4b32c3')
const chalkUnitTest = chalk.hex('#99425b')

const entryDir = path.resolve(__dirname, '../../ccui/ui')

// 懒求值：只有 code-check 真正运行时才扫描组件，避免每次 --help 触发组件解析。
// 范围 = discovered 全集；与 build / release / dts pipeline 对齐，不再用 ready-to-release gate。
let _completeComponents
function getCompleteComponents() {
  if (!_completeComponents) {
    _completeComponents = discoverComponents(entryDir)
  }
  return _completeComponents
}

function splitOrAll(components) {
  return components ? components.split(',') : getCompleteComponents()
}

function eslintCheckSingle(name) {
  log(chalkEslint(`Start ESLint check ${name}...`))
  runCommand(`eslint --color "./ui/${name}/**/{*.ts,*.tsx}"`)
  log(chalkEslint(`ESLint check ${name} finished!`))
}

function unitTestSingle(name) {
  log(chalkUnitTest(`Start unit test ${name}...`))
  runCommand(`pnpm test --filter ccui -- --colors --noStackTrace --testMatch **/${name}/**/{*.spec.ts,*.spec.tsx}`)
  log(chalkUnitTest(`Unit test ${name} finished!`))
}

function eslintCheck(components) {
  log(chalkEslint('Start ESLint check...'))
  splitOrAll(components).forEach(eslintCheckSingle)
  log(chalkEslint('ESLint check finished!'))
}

function unitTest(components) {
  log(chalkUnitTest('Start unit test...'))
  splitOrAll(components).forEach(unitTestSingle)
  log(chalkUnitTest('Unit test finished!'))
}

export const codeCheck = async function () {
  const { components, type } = this.opts()

  if (!type || type === 'eslint') eslintCheck(components)
  if (!type || type === 'unit-test') unitTest(components)
}
