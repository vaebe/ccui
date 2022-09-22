// .stylelintrc.js
module.exports = {
  // 注册 stylelint 的 prettier 插件
  plugins: ['stylelint-prettier'],
  // 继承一系列规则集合
  extends: [
    // standard 规则集合
    'stylelint-config-standard',
    // 样式属性顺序规则
    'stylelint-config-recess-order',
    // 接入 Prettier 规则
    'stylelint-config-prettier',
    'stylelint-prettier/recommended'
  ],
  // 配置 rules
  rules: {
    // 开启 Prettier 自动格式化功能
    'prettier/prettier': true,
    'selector-class-pattern': null,
    'string-quotes': 'single',
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': true,
    'at-rule-empty-line-before': [
      'always',
      {
        except: [
          'blockless-after-same-name-blockless',
          'first-nested',
          'inside-block'
        ],
        ignore: ['after-comment', 'first-nested']
      }
    ],
    'rule-empty-line-before': [
      'always',
      {
        except: ['after-single-line-comment', 'first-nested']
      }
    ],
    'block-no-empty': true,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: []
      }
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/^d-/']
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['mixin', 'include']
      }
    ],
    'color-hex-length': 'long',
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'no-duplicate-selectors': null,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates']
      }
    ]
  }
};
