import type { Component } from "vue";

export interface UniLayoutRouteMeta {
  title?: string;
  titleKey?: string;
  icon?: string;
  hidden?: boolean;
  affix?: boolean;
  activeMenu?: string;
}

export interface UniLayoutMenuRecord {
  path: string;
  name?: string;
  meta: UniLayoutRouteMeta;
  children?: UniLayoutMenuRecord[];
}

export interface UniLayoutTag {
  title: string;
  titleKey?: string;
  path: string;
  affix?: boolean;
}

export interface UniLayoutUser {
  name?: string;
  username?: string;
  avatar?: string;
  role?: string;
}

export interface UniLayoutLocaleOption {
  label: string;
  value: string;
}

export interface UniLayoutBreadcrumbItem {
  title: string;
  titleKey?: string;
}

export interface UniLayoutUserCommand {
  label: string;
  command: string;
  divided?: boolean;
}

/** 与常见后端修改密码字段对齐（见应用侧 API）。 */
export interface UniLayoutChangePasswordPayload {
  password: string;
  newpassword1: string;
  newpassword2: string;
}

export type UniLayoutTranslate = (key?: string, fallback?: string) => string;
export type UniLayoutIconMap = Record<string, Component>;
