import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/install.ts', 'src/icons/*.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  target: 'es2020',
  platform: 'neutral',
  treeshake: true,
  external: ['vue', '@iconify/vue'],
  sourcemap: false,
  outDir: 'dist',
})
