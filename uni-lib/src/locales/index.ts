import { enMessagesNested, type EnMessagesNested } from "./lang/en";
import {
  zhCNMessagesNested,
  type ZhCNMessagesNested,
} from "./lang/zh-CN";

export * from "./create-i18n";
export * from "./i18n";
export * from "./merge-deep";
export * from "./register-i18n";

/** 库内置文案树（已由 {@link createUniLibI18n} 合并进实例；也可用于按需二次合并）。 */
export const uniLibMessagesNested = {
  "zh-CN": zhCNMessagesNested,
  en: enMessagesNested,
} as const;

export type UniLibZhCNMessagesNested = ZhCNMessagesNested;
export type UniLibEnMessagesNested = EnMessagesNested;
