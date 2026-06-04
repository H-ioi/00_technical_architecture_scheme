/**
 * ip地址或域名
 */
const ENV = 1 // 1 测试机 2正式机
let BAST_URL = '';  // 请求接口域名
let IMG_URL = '';  // 图片

/**
 * 针对不同平台的baseUrl
 */
const getBaseUrl = () => {
	if (ENV === 1) {
		BAST_URL = 'http://127.0.0.1:1000'
		IMG_URL = 'https://gcimage.oss-cn-shenzhen.aliyuncs.com/img'
	} else if (ENV === 2) {
		BAST_URL = ''
		IMG_URL = 'https://gcimage.oss-cn-shenzhen.aliyuncs.com/img'
	}
}

getBaseUrl()
export default {
	/**
	 * 针对不同平台的baseUrl
	 */
	baseUrl: BAST_URL,
	imgUrl: IMG_URL,
}
