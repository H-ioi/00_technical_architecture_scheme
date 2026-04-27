import axios from "axios";
import { serialize, isObjectValueEqual } from "@/util/util";
import { getStore } from "@/util/store";
import NProgress from "nprogress";
import errorCode from "@/const/errorCode";
import router from "@/router/router";
import { Message } from "element-ui";
import "nprogress/nprogress.css";
import qs from "qs";
import store from "@/store";
import {
  addPendingRequest,
  removePendingRequest,
  clearAllPendingRequests,
} from "./repeat-request";
//解决登录过期时的重复提示
const axiosOuter = axios.create();
const delayTime = 500;
let isRepeat = false;
// axiosOuter.defaults.baseURL = "http://172.16.38.56:8098";
axiosOuter.defaults.timeout = 60000;
// 返回其他状态吗
axiosOuter.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
// 跨域请求，允许保存cookie
axiosOuter.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false,
});

// HTTPrequest拦截
axiosOuter.interceptors.request.use(
  (config) => {
    // console.log('axios.outer.use', config);
    // 处理重复请求
    addPendingRequest(config);
    NProgress.start();
    // config.headers['token'] = "2675bfd7-6fe8-4f89-8d60-8143b9fa4226"
    // headers中配置serialize为true开启序列化
    if (config.method === "post" && config.headers.serialize) {
      config.data = serialize(config.data);
      delete config.data.serialize;
    }

    if (config.method === "get") {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, {
          arrayFormat: "repeat",
        });
      };
    }
    if (config.method === "put") {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { indices: false });
      };
    }
    if (config.method === "delete") {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, {
          arrayFormat: "repeat",
        });
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// HTTPresponse拦截
axiosOuter.interceptors.response.use(
  (res) => {
    // console.log('axios.outer.response', res);
    removePendingRequest(res.config);
    NProgress.done();
    const status = Number(res.status) || 200;
    const message = res.data.msg || errorCode[status] || errorCode["default"];
    let responseType = res.config.responseType == "blob";

    if ((status !== 200 || res.data.code === 1) && !responseType) {
      Message({
        message: message,
        type: "error",
      });
      return Promise.reject(new Error(message));
    }

    return res;
  },
  (error) => {
    removePendingRequest(error.config);
    NProgress.done();

    // 处理 503 网络异常
    // console.log("error", error);
    if (error.response.status === 503) {
      Message({
        message: error.response.data.msg,
        type: "error",
      });
    } else if (error.response.status === 600) {
      return Promise.reject(error);
    } else {
      console.log("error.response.status", error.response.status);
      return Promise.reject(new Error(error.response.data.msg));
    }
  }
);

export default axiosOuter;
