import qs from 'qs'
import axios from 'axios'

/**
 * 处理重复的请求--使用防抖机制
*/

// 用于存储pending的请求的Map
const pendingRequest = new Map()
// 用于存储定时器的Map
const requestTimers = new Map()
// 防抖延迟时间，单位：毫秒
const DEBOUNCE_DELAY = 300

/**
 * 生成request的唯一key
*/
const generateRequestKey = (config = {}) => {
	const { url, method, params, data } = config
	return [url, method, qs.stringify(params), qs.stringify(data)].join('&')
}

/**
 * 将请求添加到pendingRequest中，使用防抖机制
*/
export const addPendingRequest = (config) => {
	return new Promise((resolve, reject) => {
		const key = generateRequestKey(config)

		// 如果有相同请求的定时器，清除它
		if (requestTimers.has(key)) {
			clearTimeout(requestTimers.get(key))
		}

		// 创建新的定时器
		const timer = setTimeout(() => {
			// 清除定时器记录
			requestTimers.delete(key)

			// 为请求添加cancelToken
			config.cancelToken = new axios.CancelToken(cancel => {
				pendingRequest.set(key, cancel)
			})

			resolve(config)
		}, DEBOUNCE_DELAY)

		// 保存定时器
		requestTimers.set(key, timer)
	})
}

/**
 * 取消重复请求
*/
export const removePendingRequest = (config) => {
	if (!config) return

	const key = generateRequestKey(config)

	// 清除对应的定时器（如果存在）
	if (requestTimers.has(key)) {
		clearTimeout(requestTimers.get(key))
		requestTimers.delete(key)
	}

	// 从pendingRequest中删除请求
	if (pendingRequest.has(key)) {
		const cancelToken = pendingRequest.get(key)
		cancelToken(key)
		pendingRequest.delete(key)
	}
}