import { execute } from './index-math.js'
/**
 * 获取uuid
 */
export function getUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
	})
}


/**
 * 删除第三方地址中的某个参数
 * @param  url
 * @param  name 需要移除的参数名称
 */
export function urlDel(url, name) {
	//根据#号拆分
	let poundArr = url.split('#')
	//？拆分
	let questionArr = []
	if (poundArr) {
		//把#接上
		poundArr.forEach((element, index) => {
			if (index > 0) {
				element = '#' + element
			}

			let tempArr = element.split('?')
			if (!tempArr) {
				return true
			}
			tempArr.forEach((item, idx) => {
				//保留问号
				if (idx > 0) {
					item = '?' + item
				}
				questionArr.push(item)
			})
		});
	} else {
		questionArr = url.split('?')
		if (questionArr) {
			questionArr.forEach((item, idx) => {
				if (idx > 0) {
					item = '?' + item
				}
			})
		}
	}

	if (!questionArr) {
		return url
	}

	//&符号的处理
	let andArr = []
	questionArr.forEach((item, index) => {
		let andIdx = item.indexOf('&')
		if (andIdx <= -1) {
			andArr.push(item)
			return true
		}

		let tempAndArr = item.split('&')
		tempAndArr.forEach((ele, idx) => {
			if (idx > 0) {
				ele = '&' + ele
			}
			andArr.push(ele)
		})
	})


	let newUrl = ''
	andArr.forEach(item => {
		let nameIndex = item.indexOf(name + '=')
		//不拼接要删除的参数
		if (nameIndex > -1) {
			//保留第一个问号
			let questionIdx = item.indexOf('?')
			if (questionIdx == 0) {
				newUrl += '?'
			}
			return true
		}
		newUrl += item
	})

	return newUrl.replace(/\?\&/g, "?")
}

/**
 * @param {Object} url 地址
 * @param {Object} name 需要获取返回值
 * @param return  返回 name value
 */
export function isGetFilter(url, name) {
	let urlA = url.split("?")
	let theRequest = new Object()
	if (urlA[1]) {
		let strs = urlA[1].split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest[name]

}


//加法运算
export function add(x, y, acc) {
    return execute(x, y, 0, 0);
}

//减法运算
export function subtract(x, y, acc) {
    return execute(x, y, 1, 0);
}

//乘法运算
export function multiply(x, y, acc) {
    return execute(x, y, 2, 0);
}

//除法运算
export function divide(x, y, acc) {
    return execute(x, y, 3, 0);
}