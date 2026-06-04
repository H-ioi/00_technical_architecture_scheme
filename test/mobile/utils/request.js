import uniRequest from '@/node_modules/uni-request/index.js';
import config from '@/config/index.js' // 全局域名配置

/**
 * 提供的方法有
 * uniRequest.request(config)
 * uniRequest.get(url[, config])
 * uniRequest.delete(url[, config])
 * uniRequest.head(url[, config])
 * uniRequest.options(url[, config])
 * uniRequest.post(url[, data[, config]])
 * uniRequest.put(url[, data[, config]])
 * uniRequest.patch(url[, data[, config]])
 * 
 */

// 全局配置
uniRequest.defaults.baseURL = config.baseUrl
// 请求拦截
uniRequest.interceptors.request.use(config => {
	// 赋值token
	config.headers.token = uni.getStorageSync('token') || new Date().getTime()
	// 防止缓存，GET请求默认带_t参数
	if (config.method === 'get') {
		config.params = {
		  ...config.params,
		  ...{ '_t': new Date().getTime() }
		}
	}
	return config;
},err => {
	return Promise.reject(err);
});

// 响应拦截
uniRequest.interceptors.response.use((response) => {
	if (response.data.code === 401) {
		uni.showToast({
		    title: '登录失效，请重新登录',
			icon: 'none',
		    duration: 2000
		});
		setTimeout(function(){
			uni.navigateTo({ url: '/pages/login/login' })
		}, 1500)
		return Promise.reject(response.data.msg)
	}
	
	if (response.data.code === 1002) {
		uni.showToast({
		    title: response.data.msg,
			icon: 'none',
		    duration: 2000
		});
		return Promise.reject(response.data.msg)
	}
	return Promise.resolve(response);
}, (err) => {
	if (err && err.response) {
		switch (err.response.status) {
		  case 301: err.message = '请求的数据具有新的位置且更改是永久的'; break
		  case 302: err.message = '请求的数据临时具有不同 URI'; break
		  case 304: err.message = '未按预期修改文档'; break
		  case 305: err.message = '必须通过代理来访问请求的资源'; break
		  case 400: err.message = '请求中有语法问题，或不能满足请求'; break
		  case 402: err.message = '所使用的模块需要付费使用'; break
		  case 403: err.message = '当前操作没有权限'; break
		  case 404: err.message = '服务器找不到给定的资源'; break
		  case 407: err.message = '客户机首先必须使用代理认证自身'; break
		  case 415: err.message = '请求类型不支持，服务器拒绝服务'; break
		  case 417: err.message = '未绑定登录账号，请使用密码登录后绑定'; break
		  case 426: err.message = '用户名不存在或密码错误'; break
		  case 429: err.message = '请求过于频繁'; break
		  case 500: err.message = '服务器内部错误，无法完成请求'; break
		  case 501: err.message = '服务不支持请求'; break
		  case 502: err.message = '网络错误，服务器接收到上上游服务器无效响应'; break
		  case 503: err.message = '服务器无法处理请求'; break
		  case 504: err.message = '网络请求超时'; break
		  case 999: err.message = '系统未知错误，请反馈给管理员'; break
		}
	} else {
		err.message = '连接服务器失败!'
	}
	uni.showToast({
	    title: err.message,
		icon: 'none',
	    duration: 2000
	});
	return Promise.reject(err);
});


export default uniRequest