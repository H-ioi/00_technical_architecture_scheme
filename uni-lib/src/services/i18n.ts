import type { Ref } from "vue";

export type UniI18nMessages = Record<string, Record<string, string>>;

export interface UniI18nBridge {
  t: (key: string, params?: Record<string, unknown>) => string;
  locale: () => string;
  setLocale?: (locale: string) => void;
  /**
   * 建议与 vue-i18n 等配合传入（例如 `i18n.global.locale`），
   * 语言切换时 Element Plus 原子组件（日期、分页等）才能同步更新。
   */
  localeRef?: Ref<string>;
  messages?: UniI18nMessages;
}

let bridge: UniI18nBridge | undefined;
let bridgeLocaleRef: Ref<string> | undefined;

const defaultMessages: UniI18nMessages = {
  "zh-CN": {
    "common.empty": "暂无数据",
    "common.yes": "是",
    "common.no": "否",
    "common.copySuccess": "复制成功",
    "common.copyFailed": "复制失败",
    "dataTable.tools": "表格工具",
    "dataTable.refresh": "刷新",
    "dataTable.fullscreen": "最大化",
    "dataTable.exitFullscreen": "退出最大化",
    "dataTable.export": "导出",
    "dataTable.print": "打印",
    "dataTable.density": "密度",
    "dataTable.densityLarge": "宽松",
    "dataTable.densityDefault": "默认",
    "dataTable.densitySmall": "紧凑",
    "dataTable.columnSetting": "列设置",
    "dataTable.fixed": "固定",
    "dataTable.fixedLeft": "左",
    "dataTable.fixedRight": "右",
    "dataTable.moreActions": "更多操作",
    "dataTable.printTitle": "打印表格",
    "searchForm.search": "查询",
    "searchForm.reset": "重置",
    "searchForm.expand": "展开",
    "searchForm.collapse": "收起",
    "upload.trigger": "上传文件",
    "upload.maxSize": "文件大小不能超过 {size} bytes",
    "relativeTime.justNow": "刚刚",
    "relativeTime.minutes": "{value} 分钟{suffix}",
    "relativeTime.hours": "{value} 小时{suffix}",
    "relativeTime.days": "{value} 天{suffix}",
    "relativeTime.ago": "前",
    "relativeTime.later": "后",
  },
  en: {
    "common.empty": "No data",
    "common.yes": "Yes",
    "common.no": "No",
    "common.copySuccess": "Copied",
    "common.copyFailed": "Copy failed",
    "dataTable.tools": "Table tools",
    "dataTable.refresh": "Refresh",
    "dataTable.fullscreen": "Fullscreen",
    "dataTable.exitFullscreen": "Exit fullscreen",
    "dataTable.export": "Export",
    "dataTable.print": "Print",
    "dataTable.density": "Density",
    "dataTable.densityLarge": "Large",
    "dataTable.densityDefault": "Default",
    "dataTable.densitySmall": "Small",
    "dataTable.columnSetting": "Column settings",
    "dataTable.fixed": "Fixed",
    "dataTable.fixedLeft": "Left",
    "dataTable.fixedRight": "Right",
    "dataTable.moreActions": "More actions",
    "dataTable.printTitle": "Print table",
    "searchForm.search": "Search",
    "searchForm.reset": "Reset",
    "searchForm.expand": "Expand",
    "searchForm.collapse": "Collapse",
    "upload.trigger": "Upload file",
    "upload.maxSize": "File size cannot exceed {size} bytes",
    "relativeTime.justNow": "Just now",
    "relativeTime.minutes": "{value} minute(s) {suffix}",
    "relativeTime.hours": "{value} hour(s) {suffix}",
    "relativeTime.days": "{value} day(s) {suffix}",
    "relativeTime.ago": "ago",
    "relativeTime.later": "later",
  },
};

const normalizeLocale = (locale: string) => {
  const normalized = locale.toLowerCase().replace(/_/g, "-");

  if (normalized === "en" || normalized.startsWith("en-")) {
    return "en";
  }

  return "zh-CN";
};

const interpolate = (message: string, params?: Record<string, unknown>) => {
  if (!params) {
    return message;
  }

  return message.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] === undefined || params[key] === null
      ? ""
      : String(params[key]),
  );
};

const resolveMessage = (
  key: string,
  locale: string,
  params?: Record<string, unknown>,
) => {
  const messages = {
    ...defaultMessages[normalizeLocale(locale)],
    ...(bridge?.messages?.[normalizeLocale(locale)] ?? {}),
    ...(bridge?.messages?.[locale] ?? {}),
  };

  return interpolate(messages[key] ?? key, params);
};

export const createUniI18nBridge = (nextBridge: UniI18nBridge) => {
  bridge = nextBridge;
  bridgeLocaleRef = nextBridge.localeRef;
  return bridge;
};

/** 供 {@link UniConfigProvider} 使用：存在时随语言切换驱动 Element Plus locale */
export const useUniLocaleRef = () => bridgeLocaleRef;

export const useUniI18n = () => ({
  t: (key: string, params?: Record<string, unknown>) => {
    const locale = bridge?.locale() ?? "zh-CN";
    const translated = bridge?.t(key, params);

    return translated && translated !== key
      ? translated
      : resolveMessage(key, locale, params);
  },
  locale: () => bridge?.locale() ?? "zh-CN",
  setLocale: (locale: string) => bridge?.setLocale?.(locale),
});
