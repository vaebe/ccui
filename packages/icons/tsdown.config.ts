import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/icons/*.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  target: 'es2020',
  platform: 'neutral',
  treeshake: true,
  external: ['vue'],
  sourcemap: false,
  outDir: 'dist',
})
