import { enMessagesNested, type EnMessagesNested } from "./lang/en";
import {
  zhCNMessagesNested,
  type ZhCNMessagesNested,
} from "./lang/zh-CN";

export * from "./i18n";

/** 与 admin-web 各语言 `lang` 目录下的 index 一致：嵌套树，可直接并入 vue-i18n 的 messages。 */
export const uniLibMessagesNested = {
  "zh-CN": zhCNMessagesNested,
  en: enMessagesNested,
} as const;

export type UniLibZhCNMessagesNested = ZhCNMessagesNested;
export type UniLibEnMessagesNested = EnMessagesNested;
