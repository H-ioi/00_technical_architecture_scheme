import type { UserInfo } from "@/types/modules/user";

export interface BindPhonePayload {
  encrypted: string;
  iv: string;
  code: string;
}

export interface BindPhoneResult {
  fitUser: Partial<UserInfo>;
}

export interface WechatLoginPayload extends Record<string, unknown> {
  code: string;
}

export interface WechatLoginResult {
  token: string;
  wechatUser: Partial<UserInfo>;
  fitUser: Partial<UserInfo>;
}
