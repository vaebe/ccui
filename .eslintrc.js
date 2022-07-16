module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 6,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-useless-constructor': 'off',
    'no-useless-concat': 'off',
    'max-params': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    complexity: [
      'error',
      {
        max: 40
      }
    ],
    curly: 'error',
    'eol-last': 'error',
    eqeqeq: ['error', 'smart'],
    'no-console': [
      'error',
      {
        allow: [
          'log',
          'warn',
          'dir',
          'timeLog',
          'assert',
          'clear',
          'count',
          'countReset',
          'group',
          'groupEnd',
          'table',
          'dirxml',
          'error',
          'groupCollapsed',
          'Console',
          'profile',
          'profileEnd',
          'timeStamp',
          'context'
        ]
      }
    ],
    'no-multiple-empty-lines': 'error',
    'no-shadow': 'off',
    'no-trailing-spaces': 'error',
    'no-unused-labels': 'error',
    'no-use-before-define': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    semi: 'error',
    'space-in-parens': ['error', 'never'],
    'spaced-comment': ['error', 'always'],
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/no-shadow': 'error',
    'prefer-promise-reject-errors': 'off',
    'max-nested-callbacks': ['error', 6],
    '@typescript-eslint/no-this-alias': 'off',
    'accessor-pairs': 'off',
    'max-depth': 'off',
    '@typescript-eslint/member-ordering': 'off',
    'array-callback-return': 'off'
  }
};
