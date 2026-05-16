#!/usr/bin/env node
import { Command, Option } from 'commander'
import { create, validateCreateType } from './commands/create.js'
import { build } from './commands/build.js'
import { generateTheme } from './commands/generate-theme.js'
import { generateDts } from './commands/generate-dts.js'
import { release } from './commands/release.js'
import { codeCheck } from './commands/code-check.js'
import { VERSION, CREATE_SUPPORT_TYPES } from './shared/constant.js'

const program = new Command()

program
  .command('create')
  .description('创建一个组件模板或配置文件')
  .option('-t --type <type>', `创建类型，可选值：${CREATE_SUPPORT_TYPES.join(', ')}`, validateCreateType)
  .option('-e --env <env>', '环境，可选值：dev, prod')
  .option('--ignore-parse-error', '忽略解析错误', false)
  .option('--cover', '覆盖原文件', false)
  .action(create)

program
  .command('build')
  .description('打包组件库')
  .hook('postAction', generateTheme)
  .hook('postAction', generateDts)
  .action(build)

program.command('generate:theme').description('生成主题变量文件').action(generateTheme)

program.command('generate:dts').description('生成ts类型文件').action(generateDts)

program
  .command('prepare-release')
  .alias('release')
  .option('-v --version <version>', '版本号')
  .description(
    '准备 @vaebe/ccui 发布产物：生成 packages/ccui/build/package.json + 拷贝 README / LICENSE / theme。不真正 npm publish —— 用根目录 `node scripts/publish.mjs`。',
  )
  .action(release)

program
  .command('code-check')
  .option('-c --components <components>', '组件名称（支持英文逗号分隔）')
  .addOption(new Option('-t --type <type>', '代码检查类型').choices(['eslint', 'unit-test']))
  .description('代码检查')
  .action(codeCheck)

program.version(VERSION).parse()
