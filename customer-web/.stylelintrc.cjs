/* eslint-env node */
module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['use', 'forward']
      }
    ]
  },
  ignoreFiles: ['**/node_modules/**', '**/.nuxt/**', '**/.output/**']
}
