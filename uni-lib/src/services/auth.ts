export interface UniAuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface UniAuthOptions<TCredentials = unknown, TUser = unknown> {
  login: (
    credentials: TCredentials,
  ) => Promise<{ tokens: UniAuthTokens; user?: TUser }>;
  logout?: () => Promise<void> | void;
  refreshToken?: (refreshToken: string) => Promise<UniAuthTokens>;
  onTokenChange?: (tokens: UniAuthTokens | null) => void;
  onRefreshError?: (error: unknown) => void;
  clearTokenOnRefreshError?: boolean;
}

export const createUniAuth = <TCredentials = unknown, TUser = unknown>(
  options: UniAuthOptions<TCredentials, TUser>,
) => {
  let tokens: UniAuthTokens | null = null;
  let user: TUser | undefined;

  const setTokens = (nextTokens: UniAuthTokens | null) => {
    tokens = nextTokens;
    options.onTokenChange?.(nextTokens);
  };

  return {
    async login(credentials: TCredentials) {
      const result = await options.login(credentials);
      user = result.user;
      setTokens(result.tokens);
      return result;
    },
    async logout() {
      await options.logout?.();
      user = undefined;
      setTokens(null);
    },
    async refreshToken() {
      if (!tokens?.refreshToken || !options.refreshToken) {
        return tokens;
      }

      try {
        const nextTokens = await options.refreshToken(tokens.refreshToken);
        setTokens(nextTokens);
        return nextTokens;
      } catch (error) {
        options.onRefreshError?.(error);

        if (options.clearTokenOnRefreshError) {
          setTokens(null);
        }

        throw error;
      }
    },
    getTokens: () => tokens,
    getUser: () => user,
    setTokens,
    clearToken: () => setTokens(null),
  };
};
