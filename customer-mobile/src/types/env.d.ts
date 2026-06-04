// Vite / Vue 单文件组件全局类型（tsconfig include src/**/*.d.ts 自动加载）
// import.meta.env 与 .env 中的 VITE_* 变量；vue SFC 的 declare module
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}
