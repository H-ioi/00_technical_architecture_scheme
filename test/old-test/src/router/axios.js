import axios from 'axios'
import {
	serialize,
	isObjectValueEqual
} from '@/util/util'
import {
	getStore
} from '@/util/store'
import NProgress from 'nprogress'
import errorCode from '@/const/errorCode'
import router from '@/router/router'
import {
	Message
} from 'element-ui'
import 'nprogress/nprogress.css'
import qs from 'qs'
import store from '@/store'
import {
	addPendingRequest,
	removePendingRequest,
	clearAllPendingRequests
} from './repeat-request'
//解决登录过期时的重复提示
const axiosInstance = axios.create()
const delayTime = 500
let isRepeat = false
axios.defaults.timeout = 60000
// 返回其他状态吗
axiosInstance.defaults.validateStatus = function (status) {
	return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axiosInstance.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
	showSpinner: false
})

// HTTPrequest拦截
axiosInstance.interceptors.request.use(config => {
	// console.log('axios.use', config);
	// 处理重复请求
	addPendingRequest(config)
	NProgress.start() // start progress bar
	const TENANT_ID = getStore({
		name: 'tenantId'
	})
	const isToken = (config.headers || {}).isToken === false
	const token = store.getters.access_token
	if (token && !isToken) {
		config.headers['Authorization'] = 'Bearer ' + token // token
	}
	if (TENANT_ID) {
		config.headers['TENANT-ID'] = TENANT_ID // 租户ID
	}

	config.headers['version'] = 'B';
	// headers中配置serialize为true开启序列化
	if (config.method === 'post' && config.headers.serialize) {
		config.data = serialize(config.data)
		delete config.data.serialize
	}

	if (config.method === 'get') {
		config.paramsSerializer = function (params) {
			return qs.stringify(params, {
				arrayFormat: 'repeat'
			})
		}
	}
	if (config.method === 'put') {
		config.paramsSerializer = function (params) {
			return qs.stringify(params, { indices: false })
		}
	}
	if (config.method === 'delete') {
		config.paramsSerializer = function (params) {
			return qs.stringify(params, {
				arrayFormat: 'repeat'
			})
		}
	}

	return config

}, error => {
	return Promise.reject(error)
})

// HTTPresponse拦截
axiosInstance.interceptors.response.use(res => {
	// console.log('axios.response', res);
	// 直接移除pending请求，不需要延迟
	removePendingRequest(res.config)
	NProgress.done()
	const status = Number(res.status) || 200
	const message = res.data.msg || errorCode[status] || errorCode['default']
	let responseType = res.config.responseType == 'blob'
	if (status === 401) {
		if (!isRepeat) {
			isRepeat = true
			Message({
				message: "登录过期,请重新登录 ",
				type: 'error'
			})
			store.dispatch('LogOut').then(() => {
			})
			setTimeout(() => {
				isRepeat = false
			}, 2000);
		}
		return
	}

	if ((status !== 200 || res.data.code === 1) && !responseType) {
		Message({
			message: message,
			type: 'error'
		})
		return Promise.reject(new Error(message))
	}

	return res
}, error => {
	removePendingRequest(error.config)
	NProgress.done()

	// 如果是取消请求的错误，直接返回，不弹出错误提示
	// 适配axios 0.18.0的isCancel方法
	if (axios.isCancel(error)) {
		return new Promise(() => { })
	}

	// 处理 503 网络异常
	if (error.response && error.response.status === 503) {
		Message({
			message: error.response.data.msg,
			type: 'error'
		})
	} else if (error.response && error.response.status === 600) {
		return Promise.reject(error)
	} else if (error.response) {
		console.log("error.response.status", error.response.status);
		return Promise.reject(new Error(error.response.data.msg || '请求失败'))
	} else {
		// 网络错误等情况
		Message({
			message: '网络连接失败，请检查网络设置',
			type: 'error'
		})
		return Promise.reject(new Error('网络连接失败'))
	}
})

export default axiosInstance