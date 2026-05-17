import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from './codemod-v1-to-v2.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const FIX_DIR = resolve(HERE, '__codemod-fixtures__')

const files = readdirSync(FIX_DIR)
const pairs = files
  .filter((f) => f.endsWith('.vue') && !f.endsWith('.expected.vue'))
  .map((input) => ({
    input,
    expected: input.replace(/\.vue$/, '.expected.vue'),
  }))

describe('codemod v1 → v2', () => {
  for (const pair of pairs) {
    it(`transforms ${pair.input}`, () => {
      const src = readFileSync(join(FIX_DIR, pair.input), 'utf8')
      const expected = readFileSync(join(FIX_DIR, pair.expected), 'utf8')
      const actual = transform(src, pair.input)
      expect(actual).toBe(expected)
    })
  }
})
