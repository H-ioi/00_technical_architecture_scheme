import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import * as Vuex from 'vuex'
import * as Pinia from 'pinia'
import antd from 'ant-design-vue'
import _ from 'lodash-es'
import moment from 'moment'
import axios from 'axios'
import * as SharedComponents from 'shared-components'

class SharedDependencyManager {
  constructor() {
    this.deps = {
      libs: {},
      components: {}
    }
  }

  init() {
    this.deps.libs = {
      vue: Vue,
      'vue-router': VueRouter,
      vuex: Vuex,
      pinia: Pinia,
      'ant-design-vue': antd,
      lodash: _,
      moment,
      axios
    }

    this.deps.components = { ...SharedComponents }

    window.__SHARED_DEPS = this.deps

    // 与调研文档一致：部分场景会用 UMD 名挂全局（子应用 micro 构建时可对照）
    window.SharedComponents = SharedComponents

    console.log('[main-app] Shared dependencies initialized')
  }

  getDep(name, type = 'libs') {
    return this.deps[type]?.[name]
  }

  addDep(name, dep, type = 'libs') {
    this.deps[type][name] = dep
  }
}

export default new SharedDependencyManager()
