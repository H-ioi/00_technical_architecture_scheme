import { execute } from "./math";

const FUNC_ERROR_TEXT = "Expected a function";

/** 获取 uuid */
export function getUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 删除第三方地址中的某个参数
 * @param url 完整 URL
 * @param name 需要移除的参数名称
 */
export function urlDel(url: string, name: string): string {
  const poundArr = url.split("#");
  const questionArr: string[] = [];
  if (poundArr) {
    poundArr.forEach((element, index) => {
      let part = element;
      if (index > 0) {
        part = "#" + element;
      }
      const tempArr = part.split("?");
      if (!tempArr) {
        return;
      }
      tempArr.forEach((item, idx) => {
        let piece = item;
        if (idx > 0) {
          piece = "?" + item;
        }
        questionArr.push(piece);
      });
    });
  } else {
    questionArr.push(...url.split("?"));
  }

  if (!questionArr) {
    return url;
  }

  const andArr: string[] = [];
  questionArr.forEach((item) => {
    const andIdx = item.indexOf("&");
    if (andIdx <= -1) {
      andArr.push(item);
      return;
    }
    const tempAndArr = item.split("&");
    tempAndArr.forEach((ele, idx) => {
      let segment = ele;
      if (idx > 0) {
        segment = "&" + ele;
      }
      andArr.push(segment);
    });
  });

  let newUrl = "";
  andArr.forEach((item) => {
    const nameIndex = item.indexOf(name + "=");
    if (nameIndex > -1) {
      const questionIdx = item.indexOf("?");
      if (questionIdx === 0) {
        newUrl += "?";
      }
      return;
    }
    newUrl += item;
  });

  return newUrl.replace(/\?&/g, "?");
}

/**
 * 从 URL 查询串读取指定参数
 * @param url 地址
 * @param name 参数名
 */
export function isGetFilter(
  url: string,
  name: string
): string | undefined {
  const urlA = url.split("?");
  const theRequest: Record<string, string> = {};
  if (urlA[1]) {
    const strs = urlA[1].split("&");
    for (let i = 0; i < strs.length; i++) {
      const pair = strs[i].split("=");
      theRequest[pair[0]] = decodeURI(pair[1]);
    }
  }
  return theRequest[name];
}

/** 加法运算 */
export function add(
  x?: number | string,
  y?: number | string,
  acc?: number | string
): number {
  return execute(x, y, 0, acc);
}

/** 减法运算 */
export function subtract(
  x?: number | string,
  y?: number | string,
  acc?: number | string
): number {
  return execute(x, y, 1, acc);
}

/** 乘法运算 */
export function multiply(
  x?: number | string,
  y?: number | string,
  acc?: number | string
): number {
  return execute(x, y, 2, acc);
}

/** 除法运算 */
export function divide(
  x?: number | string,
  y?: number | string,
  acc?: number | string
): number {
  return execute(x, y, 3, acc);
}

export interface DebounceOptions {
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
}

export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
}

/**
 * 防抖
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait?: number,
  options?: DebounceOptions
): DebouncedFunction<T> {
  let lastArgs: Parameters<T> | undefined;
  let lastThis: unknown;
  let maxWait: number | undefined;
  let result: ReturnType<T> | undefined;
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  if (typeof func !== "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  const waitMs = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing
      ? Math.max(toNumber(options.maxWait) || 0, waitMs)
      : undefined;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args as Parameters<T>) as ReturnType<T>;
    return result;
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, waitMs);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime as number);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = waitMs - timeSinceLastCall;
    return maxing && maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime as number);
    const timeSinceLastInvoke = time - lastInvokeTime;
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= waitMs ||
      timeSinceLastCall < 0 ||
      (maxing && maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timerId = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced(this: unknown, ...args: Parameters<T>) {
    const time = now();
    const isInvoking = shouldInvoke(time);
    lastArgs = args;
    // debounce 需在异步回调中还原调用方 this
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- lodash 同款实现
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, waitMs);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, waitMs);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced as DebouncedFunction<T>;
}

/** 转数字（供 debounce wait 使用） */
function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const n = Number(value.trim());
    return Number.isNaN(n) ? 0 : n;
  }
  if (value === null || value === undefined) {
    return 0;
  }
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/** 判断是否是对象 */
function isObject(value: unknown): value is Record<string, unknown> {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
}

/** 获取毫秒级时间 */
function now(): number {
  return Date.now();
}
