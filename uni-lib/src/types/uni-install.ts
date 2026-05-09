import type { UniLibRuntimeOptions } from "./uni-runtime";
import type { UniPermissionOptions } from "./uni-permission";
import type { UniThemeSetupOptions } from "./uni-theme";

export interface UniLibInstallOptions {
  /** 模板注入：存储前缀、HTTP、鉴权、改密接口等 */
  runtime?: UniLibRuntimeOptions;
  permission?: UniPermissionOptions;
  theme?: UniThemeSetupOptions;
}
