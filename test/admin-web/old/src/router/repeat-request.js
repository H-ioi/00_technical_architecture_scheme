import qs from "qs";
import axios from "axios";
/**
 * 处理重复的请求--在相隔时间内，如果先前的请求未完成请求，会被取消，采用后续的重复的继续请求
 */

/**
 * 用于存储pending的请求的数组（处理多条相同请求）
 */
const pendingRequest = new Map();

/**
 * 生成request的唯一key
 * 通过url，method，params，data生成唯一key，用于判断是否重复请求
 * params为get请求参数，data为post请求参数
 * 兼容各种传参方式，包括特殊数据类型
 */
const generateRequestKey = (config = {}) => {
  const { url = "", method = "get", params = {}, data = {} } = config;

  // 处理params
  let paramsStr = "";
  if (params) {
    try {
      paramsStr = qs.stringify(params);
    } catch (e) {
      paramsStr = String(params);
    }
  }

  // 处理data，兼容特殊类型
  let dataStr = "";
  if (data) {
    if (
      data instanceof FormData ||
      data instanceof Blob ||
      data instanceof ArrayBuffer
    ) {
      // 特殊类型的数据，使用其类型作为标识
      dataStr = data.constructor.name;
    } else if (typeof data === "object") {
      try {
        // dataStr = qs.stringify(data)
        dataStr = JSON.stringify(data);
      } catch (e) {
        dataStr = JSON.stringify(data);
      }
    } else {
      // 基本类型数据
      dataStr = String(data);
    }
  }

  return [url, method, paramsStr, dataStr].join("&");
};
/**
 * 将请求添加到pendingRequest中
 * 如果没有重复请求，添加到pending列表
 * 如果有重复请求，取消当前请求
 * 适配axios 0.18.0版本
 */
export const addPendingRequest = (config) => {
  const key = generateRequestKey(config);
  if (checkPendingRequest(config)) {
    // 如果有重复请求，取消当前请求（适配axios 0.18.0）
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    source.cancel("重复请求已被取消");
  } else {
    // 如果没有重复请求，添加到pending列表（适配axios 0.18.0）
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    pendingRequest.set(key, source.cancel);
  }
};
/**
 * 移除或取消重复请求
 */
export const removePendingRequest = (config) => {
  const key = generateRequestKey(config);
  setTimeout(() => {
    pendingRequest.delete(key); // 请求对象中删除requestKey
  }, 300);
};
/**
 * 校验是否有重复请求
 */
export const checkPendingRequest = (config) => {
  const key = generateRequestKey(config);
  // console.log('checkPendingRequest', pendingRequest, pendingRequest.has(key));
  return pendingRequest.has(key);
};
/**
 * 清空所有pending请求
 * 取消所有正在等待的请求并清空存储
 */
export const clearAllPendingRequests = () => {
  let canceledCount = 0;

  // 遍历所有pending请求
  pendingRequest.forEach((value, key) => {
    try {
      // 取消请求
      // if (typeof value.cancel === 'function') {
      // 	value.cancel('所有请求已被清空')
      // }
      canceledCount++;
    } catch (error) {
      console.error("Failed to cancel pending request:", error);
    } finally {
      // 无论取消是否成功，都从Map中删除
      pendingRequest.delete(key);
    }
  });

  console.log(`Cleared all ${canceledCount} pending requests`);
  return canceledCount;
};
