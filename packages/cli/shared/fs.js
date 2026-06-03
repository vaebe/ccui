import { promises as fsp, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

// fs-extra.outputFile 的最小替代：自动 mkdir -p 后 writeFile。
export async function outputFile(filePath, data, options = 'utf-8') {
  await fsp.mkdir(dirname(filePath), { recursive: true })
  await fsp.writeFile(filePath, data, options)
}

export function outputFileSync(filePath, data, options = 'utf-8') {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, data, options)
}

export { fsp, existsSync, statSync }
