import type { RouteRecordRaw } from "vue-router";

export interface UniAppRouteMeta {
  title: string;
  titleKey?: string;
  icon?: string;
  hidden?: boolean;
  keepAlive?: boolean;
  affix?: boolean;
  permission?: string[];
  activeMenu?: string;
}

export type UniAppRouteRecord = RouteRecordRaw & {
  meta: UniAppRouteMeta;
  children?: UniAppRouteRecord[];
};

export interface UniAppMenuRecord {
  path: string;
  name: string;
  meta: UniAppRouteMeta;
  children?: UniAppMenuRecord[];
}
