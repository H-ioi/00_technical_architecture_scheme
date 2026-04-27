import "babel-polyfill";
import "classlist-polyfill";
import Vue from "vue";
import axios from "./router/axios";
import VueAxios from "vue-axios";
import App from "./App";
import "./permission"; // 权限
import "./cache"; //页面缓冲
import router from "./router/router";
import store from "./store";
import ElementUI from "element-ui";
// import 'element-ui/lib/theme-chalk/index.css'
import "./styles/index.scss";
import { loadStyle } from "./util/util";
import * as urls from "@/config/env";
import _ from "lodash";

import "bpmn-js/dist/assets/diagram-js.css"; // 左边工具栏以及编辑节点的样式
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"; // 右边工具栏样式

import { iconfontUrl, iconfontVersion } from "@/config/env";
import * as filters from "./filters"; // 全局filter
// 语言包
import i18n from "./i18n/i18n";

import basicContainer from "./components/basic-container/main";
import globalMethods from "./const/common/index.js";
// 滚动插件
import VueDragscroll from "vue-dragscroll";
import VueClipBoard from "vue-clipboard2";
Vue.use(VueClipBoard);
Vue.use(VueDragscroll);
// 插件 json 展示
Vue.use(router);

window.axios = axios;
Vue.use(VueAxios, axios);

Vue.use(ElementUI, {
  size: "small",
  menuType: "text",
});

Vue.use(AVUE, {
  size: "small",
  menuType: "text",
});

// 注册全局容器
Vue.component("basicContainer", basicContainer);

// 加载相关url地址
Object.keys(urls).forEach((key) => {
  Vue.prototype[key] = urls[key];
});

// 加载过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
// 挂载全局方法
Object.keys(globalMethods).forEach((key) => {
  Vue.prototype[key] = globalMethods[key];
});
// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace("$key", ele));
});

Vue.config.productionTip = false;
// 判断是否为Safari浏览器
Vue.prototype.isSafari = function () {
  return (
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  );
};
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
