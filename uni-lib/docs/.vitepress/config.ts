import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitepress";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  title: "uni-lib",
  description: "Vue 3 + Element Plus 业务组件库",
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/getting-started" },
      { text: "组件", link: "/components/uni-data-table" },
      { text: "插件能力", link: "/plugins/request" },
    ],
    sidebar: [
      {
        text: "指南",
        items: [
          { text: "快速开始", link: "/guide/getting-started" },
          { text: "主题", link: "/guide/theme" },
          { text: "旧系统迁移", link: "/guide/migration-from-old-admin" },
        ],
      },
      {
        text: "组件",
        items: [
          { text: "UniDataTable", link: "/components/uni-data-table" },
          { text: "UniForm", link: "/components/uni-form" },
          { text: "UniSearchForm", link: "/components/uni-search-form" },
          { text: "UniUpload", link: "/components/uni-upload" },
        ],
      },
      {
        text: "插件能力",
        items: [
          { text: "Request", link: "/plugins/request" },
          { text: "Theme", link: "/plugins/theme" },
        ],
      },
      {
        text: "国际化",
        items: [{ text: "I18n 桥接", link: "/locales/i18n" }],
      },
    ],
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../../src"),
      },
    },
    ssr: {
      noExternal: ["element-plus"],
    },
  },
});
