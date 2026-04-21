/* eslint-env node */
const globals = require('globals')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  globals: {
    ...globals.browser,
    ...globals.node,
    defineNuxtConfig: 'readonly',
    defineEventHandler: 'readonly',
    getQuery: 'readonly',
    getRouterParam: 'readonly',
    createError: 'readonly',
    ref: 'readonly',
    computed: 'readonly',
    watch: 'readonly',
    useFetch: 'readonly',
    useRuntimeConfig: 'readonly',
    useRoute: 'readonly',
    useState: 'readonly',
    useExamplePosts: 'readonly',
    useAsyncData: 'readonly',
    definePageMeta: 'readonly',
    defineProps: 'readonly',
    defineEmits: 'readonly',
    withDefaults: 'readonly',
    navigateTo: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-strongly-recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['node_modules/', '.nuxt/', '.output/', 'dist/'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ]
  }
}
