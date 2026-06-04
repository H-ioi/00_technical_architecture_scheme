/**
 * 编译期平台标识：Vite/uni 注入的 UNI_PLATFORM（如 h5、mp-weixin）。
 * 用于运行时分支，非条件编译；小程序与 H5 差异逻辑请在此判断并加业务注释。
 */
function getUniPlatform() {
  const env = import.meta.env as Record<string, string | undefined>;
  return env.UNI_PLATFORM ?? "unknown";
}

export function isWeapp() {
  return getUniPlatform() === "mp-weixin";
}

export function isH5() {
  return getUniPlatform() === "h5";
}

export function getPlatformName() {
  return getUniPlatform();
}
