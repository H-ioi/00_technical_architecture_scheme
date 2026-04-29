export interface UniThemeTokens {
  primaryColor?: string;
  pageBgColor?: string;
  cardBgColor?: string;
  borderColor?: string;
  textColor?: string;
  radiusBase?: string;
}

export const applyUniTheme = (tokens: UniThemeTokens) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const tokenMap: Record<keyof UniThemeTokens, string> = {
    primaryColor: "--uni-color-primary",
    pageBgColor: "--uni-bg-page",
    cardBgColor: "--uni-bg-card",
    borderColor: "--uni-border-color",
    textColor: "--uni-text-color",
    radiusBase: "--uni-radius-base",
  };

  Object.entries(tokens).forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(tokenMap[key as keyof UniThemeTokens], value);
    }
  });
};

export const createUniTheme = (initialTokens: UniThemeTokens = {}) => {
  applyUniTheme(initialTokens);

  return {
    apply: applyUniTheme,
  };
};
