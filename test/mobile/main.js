import Vue from 'vue'
import App from './App'
import store from './store'
import http from './utils/request'
import uView from 'uview-ui';
import filters from '@/utils/filters'
Vue.use(uView);
Vue.config.productionTip = false
// 挂载全局
Vue.prototype.$http = http
Vue.prototype.$store = store

// 注册过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
