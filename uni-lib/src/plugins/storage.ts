let storagePrefix = "uni-lib";

export const setUniStoragePrefix = (prefix: string) => {
  storagePrefix = prefix;
};

const resolveKey = (key: string): string => {
  const prefix = `${storagePrefix}:`;

  return key.startsWith(prefix) ? key : `${prefix}${key}`;
};

export const storage = {
  key: resolveKey,

  get<T = string>(key: string): T | null {
    if (typeof window === "undefined") {
      return null;
    }

    const rawValue = window.localStorage.getItem(resolveKey(key));

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return rawValue as T;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") {
      return;
    }

    const nextValue = typeof value === "string" ? value : JSON.stringify(value);

    window.localStorage.setItem(resolveKey(key), nextValue);
  },

  remove(key: string): void {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(resolveKey(key));
  },

  clear(): void {
    if (typeof window === "undefined") {
      return;
    }

    const prefix = `${storagePrefix}:`;

    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        window.localStorage.removeItem(key);
      }
    });
  },
};
