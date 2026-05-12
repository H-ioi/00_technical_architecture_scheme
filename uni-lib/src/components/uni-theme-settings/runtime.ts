import type { UniThemeOptions, UniThemeSetupOptions } from '@/types/uni-theme'

export type { UniThemeTokens, UniThemeOptions, UniThemeSetupOptions } from '@/types/uni-theme'

const DEFAULT_PRIMARY_COLOR = '#BA8E62'
const DEFAULT_THEME_STORAGE_KEY = 'uni-lib:theme'

const ELEMENT_THEME_VARIABLES: Record<string, string> = {
  '--el-border-radius-circle': '100%',
  '--el-transition-duration': '.3s',
  '--el-transition-duration-fast': '.2s',
  '--el-transition-function-ease-in-out-bezier': 'cubic-bezier(.645, .045, .355, 1)',
  '--el-transition-function-fast-bezier': 'cubic-bezier(.23, 1, .32, 1)',
  '--el-transition-all':
    'all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier)',
  '--el-transition-fade':
    'opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier)',
  '--el-transition-md-fade':
    'transform var(--el-transition-duration) var(--el-transition-function-fast-bezier), opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier)',
  '--el-transition-fade-linear': 'opacity var(--el-transition-duration-fast) linear',
  '--el-transition-border':
    'border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier)',
  '--el-transition-box-shadow':
    'box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier)',
  '--el-transition-color':
    'color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier)',
  '--el-component-size-large': '40px',
  '--el-component-size': '32px',
  '--el-component-size-small': '24px',
  '--lightningcss-light': 'initial',
  '--lightningcss-dark': '',
  'color-scheme': 'light',
  '--el-color-success': '#67c23a',
  '--el-color-success-light-3': '#95d475',
  '--el-color-success-light-5': '#b3e19d',
  '--el-color-success-light-7': '#d1edc4',
  '--el-color-success-light-8': '#e1f3d8',
  '--el-color-success-light-9': '#f0f9eb',
  '--el-color-success-dark-2': '#529b2e',
  '--el-color-warning': '#e6a23c',
  '--el-color-warning-light-3': '#eebe77',
  '--el-color-warning-light-5': '#f3d19e',
  '--el-color-warning-light-7': '#f8e3c5',
  '--el-color-warning-light-8': '#faecd8',
  '--el-color-warning-light-9': '#fdf6ec',
  '--el-color-warning-dark-2': '#b88230',
  '--el-color-danger': '#f56c6c',
  '--el-color-danger-light-3': '#f89898',
  '--el-color-danger-light-5': '#fab6b6',
  '--el-color-danger-light-7': '#fcd3d3',
  '--el-color-danger-light-8': '#fde2e2',
  '--el-color-danger-light-9': '#fef0f0',
  '--el-color-danger-dark-2': '#c45656',
  '--el-color-error': '#f56c6c',
  '--el-color-error-light-3': '#f89898',
  '--el-color-error-light-5': '#fab6b6',
  '--el-color-error-light-7': '#fcd3d3',
  '--el-color-error-light-8': '#fde2e2',
  '--el-color-error-light-9': '#fef0f0',
  '--el-color-error-dark-2': '#c45656',
  '--el-color-info': '#909399',
  '--el-color-info-light-3': '#b1b3b8',
  '--el-color-info-light-5': '#c8c9cc',
  '--el-color-info-light-7': '#dedfe0',
  '--el-color-info-light-8': '#e9e9eb',
  '--el-color-info-light-9': '#f4f4f5',
  '--el-color-info-dark-2': '#73767a',
  '--el-bg-color': '#fff',
  '--el-bg-color-page': '#f2f3f5',
  '--el-bg-color-overlay': '#fff',
  '--el-text-color-primary': '#303133',
  '--el-text-color-regular': '#606266',
  '--el-text-color-secondary': '#909399',
  '--el-text-color-placeholder': '#a8abb2',
  '--el-text-color-disabled': '#c0c4cc',
  '--el-border-color': '#dcdfe6',
  '--el-border-color-light': '#e4e7ed',
  '--el-border-color-lighter': '#ebeef5',
  '--el-border-color-extra-light': '#f2f6fc',
  '--el-border-color-dark': '#d4d7de',
  '--el-border-color-darker': '#cdd0d6',
  '--el-fill-color': '#f0f2f5',
  '--el-fill-color-light': '#f5f7fa',
  '--el-fill-color-lighter': '#fafafa',
  '--el-fill-color-extra-light': '#fafcff',
  '--el-fill-color-dark': '#ebedf0',
  '--el-fill-color-darker': '#e6e8eb',
  '--el-fill-color-blank': '#fff',
  '--el-box-shadow': '0px 12px 32px 4px #0000000a, 0px 8px 20px #00000014',
  '--el-box-shadow-light': '0px 0px 12px #0000001f',
  '--el-box-shadow-lighter': '0px 0px 6px #0000001f',
  '--el-box-shadow-dark':
    '0px 16px 48px 16px #00000014, 0px 12px 32px #0000001f, 0px 8px 16px -8px #00000029',
  '--el-disabled-bg-color': 'var(--el-fill-color-light)',
  '--el-disabled-text-color': 'var(--el-text-color-placeholder)',
  '--el-disabled-border-color': 'var(--el-border-color-light)',
  '--el-overlay-color': '#000c',
  '--el-overlay-color-light': '#000000b3',
  '--el-overlay-color-lighter': '#00000080',
  '--el-mask-color': '#ffffffe6',
  '--el-mask-color-extra-light': '#ffffff4d',
  '--el-border-width': '1px',
  '--el-border-style': 'solid',
  '--el-border-color-hover': 'var(--el-text-color-disabled)',
  '--el-border': 'var(--el-border-width) var(--el-border-style) var(--el-border-color)',
  '--el-svg-monochrome-grey': 'var(--el-border-color)'
}

const normalizeHexColor = (color: string) => {
  const value = color.trim()

  if (/^#[0-9a-f]{6}$/i.test(value)) {
    return value
  }

  if (/^#[0-9a-f]{3}$/i.test(value)) {
    return `#${value
      .slice(1)
      .split('')
      .map((item) => item + item)
      .join('')}`
  }

  return DEFAULT_PRIMARY_COLOR
}

const mixColor = (color: string, mixColorValue: string, weight: number) => {
  const source = normalizeHexColor(color).slice(1)
  const target = normalizeHexColor(mixColorValue).slice(1)
  const channels = [0, 2, 4].map((index) => {
    const sourceValue = Number.parseInt(source.slice(index, index + 2), 16)
    const targetValue = Number.parseInt(target.slice(index, index + 2), 16)
    const mixedValue = Math.round(sourceValue * (1 - weight) + targetValue * weight)

    return mixedValue.toString(16).padStart(2, '0')
  })

  return `#${channels.join('')}`
}

const createElementPrimaryVariables = (primaryColor: string) => {
  const color = normalizeHexColor(primaryColor)

  return {
    '--el-color-primary': color,
    '--el-color-primary-light-3': mixColor(color, '#ffffff', 0.3),
    '--el-color-primary-light-5': mixColor(color, '#ffffff', 0.5),
    '--el-color-primary-light-7': mixColor(color, '#ffffff', 0.7),
    '--el-color-primary-light-8': mixColor(color, '#ffffff', 0.8),
    '--el-color-primary-light-9': mixColor(color, '#ffffff', 0.9),
    '--el-color-primary-dark-2': mixColor(color, '#000000', 0.2)
  }
}

export const createUniThemeVariables = (tokens: UniThemeOptions = {}) => {
  const primaryColor = tokens.primaryColor ?? DEFAULT_PRIMARY_COLOR
  const pageBg = tokens.pageBgColor ?? '#f5f7fb'
  const cardBg = tokens.cardBgColor ?? '#fff'
  const border = tokens.borderColor ?? '#e5e7eb'
  const text = tokens.textColor ?? '#1f2937'
  const textSecondary = tokens.textColorSecondary ?? '#6b7280'
  const radiusBase = tokens.radiusBase ?? '8px'

  return {
    ...ELEMENT_THEME_VARIABLES,
    ...createElementPrimaryVariables(primaryColor),
    '--el-border-radius-base': radiusBase,
    '--el-bg-color-page': pageBg,
    '--el-bg-color': cardBg,
    '--el-bg-color-overlay': cardBg,
    '--el-border-color': border,
    '--el-text-color-primary': text,
    '--el-text-color-regular': text,
    '--el-text-color-secondary': textSecondary,
    '--uni-color-primary': primaryColor,
    '--uni-bg-page': pageBg,
    '--uni-bg-card': cardBg,
    '--uni-border-color': border,
    '--uni-text-color': text,
    '--uni-text-color-secondary': textSecondary,
    '--uni-radius-base': radiusBase,
    '--app-primary-color': primaryColor,
    '--app-bg-color': pageBg,
    '--app-card-bg-color': cardBg,
    '--app-border-color': border,
    '--app-text-color': text,
    '--app-text-color-secondary': textSecondary,
    '--app-radius-base': radiusBase,
    ...tokens.variables
  }
}

export const applyUniTheme = (tokens: UniThemeOptions = {}) => {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement

  Object.entries(createUniThemeVariables(tokens)).forEach(([key, value]) => {
    if (value !== undefined) {
      root.style.setProperty(key, value)
    }
  })
}

export const getStoredUniTheme = (
  storageKey = DEFAULT_THEME_STORAGE_KEY
): UniThemeOptions | null => {
  if (typeof localStorage === 'undefined') {
    return null
  }

  const storedValue = localStorage.getItem(storageKey)

  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(storedValue) as UniThemeOptions
  } catch {
    return null
  }
}

export const saveUniTheme = (theme: UniThemeOptions, storageKey = DEFAULT_THEME_STORAGE_KEY) => {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(storageKey, JSON.stringify(theme))
}

export const setupUniTheme = (options: UniThemeSetupOptions = {}) => {
  const { defaultTheme, storageKey, ...themeOptions } = options
  const fallbackTheme =
    defaultTheme ??
    (Object.keys(themeOptions).length > 0 ? themeOptions : { primaryColor: DEFAULT_PRIMARY_COLOR })
  const theme = getStoredUniTheme(storageKey) ??
    fallbackTheme ?? {
      primaryColor: DEFAULT_PRIMARY_COLOR
    }

  applyUniTheme(theme)

  return theme
}

export const createUniTheme = (initialTokens: UniThemeOptions = {}) => {
  applyUniTheme(initialTokens)

  return {
    apply: applyUniTheme
  }
}
