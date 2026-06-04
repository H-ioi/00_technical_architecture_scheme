/**
 * uni-app 与 Vue 组合式/API 挂载声明（由 tsconfig include 自动加载）
 * - 引用 @dcloudio/types
 * - 将 App/Page 实例钩子并入 ComponentCustomOptions
 */
/// <reference types="@dcloudio/types" />
import "vue";

declare module "@vue/runtime-core" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks {}
}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks {}
}
