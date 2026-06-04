# 星乐度

#### 介绍
星乐度项目，选用uni-app 进行重构，主要原因是为了面APP端调整，能复用重构的页面排版


#### 软件架构
- 使用[uni-app](https://uniapp.dcloud.io/)基础框架
- UI选用[uView](https://uviewui.com/components/install.html)
- 请求类似axios进行了全局请求拦截封装
- 开发工具需要使用HBuilderx进行开发
- 使用vuex同一管理全局登录状态以及全局变量
- 全局域名管理在从config/index.js 中


#### 开发基本要求

- 不要随意引用除本项目已存在的其他插件
- DOM操作使用VUE语法，获取js原生操作，不要用jQuery，不要用jQuery，不要用jQuery
- css 使用 scss 编译方式 像素单位直接用 upx , H5设计稿使用750
- 小图标尽量不用切图，请在[iconfont](https://www.iconfont.cn/)中添加引用到本地, 放在APP.vue 中
- 尽量使用es6语法
- z-index 层级最大为99 请勿随意使用
- 样式定位布局尽量采用 display: flex; 布局
- 留资提交部分需要获取用户信息之后才提交的  提交的方式名同一使用submit 


#### 项目结构
```js

├─main.js             // 入口JS
├─manifest.json
├─App.vue             // 全局样式以及 字体图标  注意默认使用  font-size: 16upx;
├─package-lock.json
├─pages.json          // 页面路径
├─README.md           // 项目说明
├─uview-ui            // UI组件
├─utils
|   ├─index.js        // 公共JS
|   └request.js       // 请求封装
├─unpackage
├─store               // 全局状态管理
├─static              // 静态资源
├─pages
|   ├─view             // 内容页面
|   ├─tabbar
|   |   ├─tabbar-d     // 我的
|   |   ├─tabbar-c     // 经销商
|   |   ├─tabbar-b     // 车型
|   |   ├─tabbar-a     // 首页
|   |   ├─index.vue    // 显示框架
|   ├─login
|   ├─home
├─mixins 
├─config
|   └index.js          // 全局域名配置
├─api
|  └api.js              // 全局API

```


#### APPID 
- 测试  APPID    wxb4e1b2327092d6d6        appSecrect    9072985d476103a5fb764502b2fb5e18

#### 域名

#### 小程序管理后台账号
- cong_yan@GTMC.com.cn    GTMCMaaS2020

#### 腾讯地图
key: PXTBZ-DST6X-QYG4R-ZH3KP-MXPCT-CYFAI
[地址](https://lbs.qq.com)
账号 1579236849   




