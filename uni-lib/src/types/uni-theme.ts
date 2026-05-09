export interface UniThemeTokens {
  primaryColor?: string;
  pageBgColor?: string;
  cardBgColor?: string;
  borderColor?: string;
  textColor?: string;
  textColorSecondary?: string;
  radiusBase?: string;
}

export interface UniThemeOptions extends UniThemeTokens {
  variables?: Record<string, string>;
}

export interface UniThemeSetupOptions extends UniThemeOptions {
  defaultTheme?: UniThemeOptions;
  storageKey?: string;
}
