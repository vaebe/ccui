import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  ignores: [
    "node_modules/*",
    "node_modules/*/**",
    "packages/**/node_modules/*",
    "packages/**/dist/*",
    "packages/**/build/*",
    "packages/**/lib/*",
  
    "packages/**/src/*.d.ts",
    "packages/**/__tests__/*",
    "*.json",
    "*.svg",
    'packages/cli/*',
  ],
})
