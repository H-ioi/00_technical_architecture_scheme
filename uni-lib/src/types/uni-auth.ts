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
