import ora from 'ora'

// 包裹一个异步任务：开 spinner，成功 succeed，失败 fail 并抛出。
// 不调用 process.exit —— 退出策略交给 commander 顶层处理，便于测试与组合。
export async function withSpinner(label, fn, { successText } = {}) {
  const spinner = ora(label).start()
  try {
    const result = await fn(spinner)
    spinner.succeed(successText ?? `${label} 成功`)
    return result
  } catch (err) {
    spinner.fail(err?.message ?? String(err))
    throw err
  }
}
