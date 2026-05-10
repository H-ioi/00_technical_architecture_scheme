import {
	availableName
} from "@/api/contact/client.js";
import {
	repeatSpaceName
} from "@/api/space/spacelist.js";
import {
	getAssetTypeCheck
} from "@/api/assets/type/index.js";
import {
	checkAssetName,
	checkAssetcode
} from "@/api/assets/list/index.js";
import router from '@/router/router'
import VueRouter from 'vue-router'
export var formrules = {
	// 手机号码
	isMobileNumber: (rule, value, callback) => {
		if (!value) {
			return new Error("请输入电话号码");
		} else {
			const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
			const isPhone = reg.test(value);
			value = Number(value); //转换为数字
			if (typeof value === "number" && !isNaN(value)) { //判断是否为数字
				value = value.toString(); //转换成字符串
				if (value.length < 0 || value.length > 12 || !isPhone) { //判断是否为11位手机号
					callback(new Error("请输入正确的手机号码"));
				} else {
					callback();
				}
			} else {
				callback(new Error("请输入数字"));
			}
		}
	},
	// 邮箱
	isEmail: (rule, value, callback) => {
		if (!value) {
			callback();
		} else {
			const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
			const email = reg.test(value);
			if (!email) {
				callback(new Error("请输入正确的邮箱"));
			} else {
				callback();
			}
		}

	},
	// 价格
	isPrice: (rule, value, callback) => {
		if (!value) {
			callback();
		} else {
			var reg = /^-?\d{1,4}(?:\.\d{1,2})?$/;
			if (reg.test(value)) {
				callback();
			} else {
				callback(new Error("数字格式:0-9999或小数点后可加1到2位")); //如:1 或1.8 或1.85
			}
		}
	},
	// 网站
	weisite: (rule, value, callback) => {
		if (!value) {
			callback();
		} else {
			var reg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/;
			if (reg.test(value)) {
				callback();
			} else {
				callback(new Error("请输入正确网站"));
			}
		}
	},
	repeatName: (rule, value, callback) => {
		let href = window.location.href
		if (href.indexOf('/contact') !== -1) {
			if (!value) {
				callback();
			} else {
				let clientName = router.app.$route.meta.clientName
				if (clientName !== value) {
					availableName({
						name: value
					}).then((res) => {
						if (!res.data.data) {
							callback(new Error("名字重复，请重新输入"))
						} else {
							callback();
						}
					})
				} else {
					callback();
				}
			}
		} else {
			callback();
		}

	},
	checkSpaceName: (rule, value, callback) => {
		if (!value) {
			callback();
		} else {
			let routeData = router.app.$route
			let obj = {
				name: value,
				pid: routeData.query.pid
			}
			if (routeData.path == '/space/edit') {
				obj['id'] = routeData.query.id
			}
			repeatSpaceName(
				obj
			).then((res) => {
				if (!res.data.data) {
					callback(new Error("名称重复，请重新输入"))
				} else {
					callback();
				}
			})
		}
	},
	checkAssetsTypeCode: (rule, value, callback) => {
		if (!value) {
			callback();
		} else {
			let routeData = router.app.$route
			let obj = {
				code: value,
				menuTypeId: routeData.query.menuTypeId
			}
			if (routeData.query.type == 'edit') {
				obj['id'] = routeData.query.assetTypeId
			}
			getAssetTypeCheck(
				obj
			).then((res) => {
				if (!res.data.data) {
					callback(new Error("编码已存在，请重新输入"))
				} else {
					callback();
				}
			})
		}
	},
	checkAssetsCode: (rule, value, callback) => {
		console.log('checkAssetsCode', rule, value);
		if (!value) {
			callback();
		} else {
			let {
				type,
				checkTypeId,
				id
			} = rule['checkObj']
			let obj = {
				code: value,
			}
			if (type == 'edit') {
				obj['id'] = id
			}
			checkAssetcode(
				obj
			).then((res) => {
				if (!res.data.data) {
					callback(new Error("资产编码已存在，请重新输入"))
				} else {
					callback();
				}
			})
		}
	},
	checkAssetsName: (rule, value, callback) => {
		console.log('checkAssetsName', rule, value);
		if (!value) {
			callback();
		} else {
			let {
				type,
				checkTypeId,
				id
			} = rule['checkObj']
			let obj = {
				name: value,
				checkTypeId: checkTypeId
			}
			if (type == 'edit') {
				obj['id'] = id
			}
			checkAssetName(
				obj
			).then((res) => {
				if (!res.data.data) {
					callback(new Error("资产名称已存在，请重新输入"))
				} else {
					callback();
				}
			})
		}
	},
	checkNum: (rule, value, callback) => {
		if (value == "") {
			callback();
		} else {
			let str = String(value)
			let length = str.length;
			if (length < 4) {
				callback();
			} else {
				callback(new Error("人数最大限制3位数"));
			}
		}
	},
	checkPrice: (rule, value, callback) => {
		console.log("checkPrice", value);
		if (value == "") {
			callback();
		} else {
			let str = String(value)
			let arr = str.split(".");
			let length = arr[0].length;
			console.log("checkPrice", length);
			if (length < 7) {
				callback();
			} else {
				callback(new Error("价格最大限制6位数"));
			}
		}
	}
}
