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
	removePendingRequest
} from './repeat-request'
//解决登录过期时的重复提示
let isRepeat = false
axios.defaults.timeout = 60000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
	return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
	showSpinner: false
})

// HTTPrequest拦截
axios.interceptors.request.use(async config => {
	try {
		// 先移除可能存在的相同请求
		removePendingRequest(config)

		// 使用防抖机制处理请求
		config = await addPendingRequest(config)

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
	} catch (error) {
		if (axios.isCancel(error)) {
			console.log('Request canceled:', error.message)
			return Promise.reject(error)
		}
		return Promise.reject(error)
	}
}, error => {
	// 处理请求拦截器中的取消错误
	if (axios.isCancel(error)) {
		console.log('Request canceled:', error.message)
		return Promise.reject(error)
	}
	return Promise.reject(error)
})

// 同时修改响应拦截器中的错误处理
// HTTPresponse拦截
axios.interceptors.response.use(res => {
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
	removePendingRequest(error.config || {})
	NProgress.done()

	// 如果是取消请求的错误，不显示错误提示
	if (axios.isCancel(error)) {
		console.log('Request canceled:', error.message)
		return Promise.reject(error)
	}

	// 处理 503 网络异常
	// console.log("error", error);
	if (error.response.status === 503) {
		Message({
			message: error.response.data.msg,
			type: 'error'
		})
	} else if (error.response.status === 600) {
		return Promise.reject(error)
	} else {
		console.log("error.response.status", error.response.status);
		return Promise.reject(new Error(error.response.data.msg))
	}



})

export default axios