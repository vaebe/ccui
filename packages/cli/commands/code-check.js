const path = require('node:path')
const fs = require('node:fs')
const shell = require('shelljs')
const chalk = require('chalk')
const { isReadyToRelease } = require('../shared/utils')

const log = console.log

const chalkEslint = chalk.hex('#4b32c3')

const chalkUnitTest = chalk.hex('#99425b')

const entryDir = path.resolve(__dirname, '../../ccui/ui')

const completeComponents = fs.readdirSync(entryDir).filter((name) => {
  const componentDir = path.resolve(entryDir, name)
  const isDir = fs.lstatSync(componentDir).isDirectory()
  return (
    isDir
    && fs.readdirSync(componentDir).includes('index.ts')
    && isReadyToRelease(name)
  )
})

async function eslintCheckSingle(name) {
  log(chalkEslint(`Start ESLint check ${name}...`))
  await shell.exec(`eslint --color "./ui/${name}/**/{*.ts,*.tsx}"`)
  log(chalkEslint(`ESLint check ${name} finished!`))
}

async function eslintCheckSome(components) {
  const componentArr = components.split(',')

  for (const name of componentArr) {
    await eslintCheckSingle(name)
  }
}

async function eslintCheckAll() {
  for (const name of completeComponents) {
    await eslintCheckSingle(name)
  }
}

async function eslintCheck(components) {
  log(chalkEslint('Start ESLint check...'))
  if (components) {
    await eslintCheckSome(components)
  }
  else {
    await eslintCheckAll()
  }
  log(chalkEslint('ESLint check finished!'))
}

async function unitTestSingle(name) {
  log(chalkUnitTest(`Start unit test ${name}...`))
  await shell.exec(
    `pnpm test --filter ccui -- --colors --noStackTrace --testMatch **/${name}/**/{*.spec.ts,*.spec.tsx}`,
  )
  log(chalkUnitTest(`Unit test ${name} finished!`))
}

async function unitTestSome(components) {
  const componentArr = components.split(',')

  for (const name of componentArr) {
    await unitTestSingle(name)
  }
}

async function unitTestAll() {
  for (const name of completeComponents) {
    await unitTestSingle(name)
  }
}

async function unitTest(components) {
  log(chalkUnitTest('Start unit test...'))
  if (components) {
    await unitTestSome(components)
  }
  else {
    await unitTestAll()
  }
  log(chalkUnitTest('Unit test finished!'))
}

exports.codeCheck = async function () {
  const { components, type } = this.opts()

  if (!type) {
    await eslintCheck(components)
    await unitTest(components)
  }
  else if (type === 'eslint') {
    await eslintCheck(components)
  }
  else if (type === 'unit-test') {
    await unitTest(components)
  }
}
