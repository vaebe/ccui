import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    singleQuote: true,
    semi: false,
    trailingComma: 'all',
    printWidth: 120,
  },
  staged: {
    '*.{vue,js,jsx,ts,tsx,scss,css}': 'vp check --fix',
  },
  lint: {
    plugins: ['oxc', 'typescript', 'unicorn', 'node', 'jsdoc', 'import', 'vue'],
    categories: {
      correctness: 'warn',
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    env: {
      builtin: true,
      es2026: true,
      browser: true,
      node: true,
    },
    globals: {
      defineEmits: 'readonly',
      defineExpose: 'readonly',
      defineProps: 'readonly',
      defineModel: 'readonly',
      computed: 'readonly',
      ref: 'readonly',
      reactive: 'readonly',
      shallowRef: 'readonly',
      shallowReactive: 'readonly',
      toRef: 'readonly',
      toRefs: 'readonly',
      watch: 'readonly',
      watchEffect: 'readonly',
      onMounted: 'readonly',
      onUnmounted: 'readonly',
    },
    ignorePatterns: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/lib/**',
      '**/coverage/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      '**/__snapshots__/**',
      '**/__tests__/**',
      '**/*.d.ts',
      '**/*.svg',
      'packages/ccui/ui/vue-ccui.ts',
      'packages/theme/theme.scss',
      'packages/theme/darkTheme.css',
      'packages/docs/.vitepress/config/sidebar.ts',
      'packages/docs/.vitepress/config/enSidebar.ts',
      'packages/cli/**',
    ],
    overrides: [
      {
        files: ['**/__tests__/**/*.?([cm])[jt]s?(x)', '**/*.spec.?([cm])[jt]s?(x)', '**/*.test.?([cm])[jt]s?(x)'],
        plugins: ['vitest'],
      },
    ],
  },
})
