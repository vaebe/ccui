import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  typescript: true,
  ignores: [
    '**/node_modules/*',
    '**/dist/*',
    '**/build/*',
    'packages/**/lib/*',
    '**/__tests__/*',
    '**/*.json',
    '**/*.svg',
    '**/*.d.ts',
    'packages/cli/*',
  ],
})
