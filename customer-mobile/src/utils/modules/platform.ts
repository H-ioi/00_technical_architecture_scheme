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
