import { spawnSync } from 'node:child_process'

// 取代 shelljs.exec：同步执行，stdio 直通终端，非零退出码抛错。
export function runCommand(command, { cwd, env } = {}) {
  const { status, error } = spawnSync(command, {
    stdio: 'inherit',
    shell: true,
    cwd,
    env: { ...process.env, ...env },
  })
  if (error) throw error
  if (status !== 0) {
    throw new Error(`命令失败 (exit ${status}): ${command}`)
  }
}
