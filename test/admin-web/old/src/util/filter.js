import VuexStore from '@/store/index.js'
import {
	getStore,
	removeStore,
	setStore
} from '@/util/store'
import {
	getDictFieldAll,
	fetchTypeList
} from "@/api/workorder/order/orderlist.js";
import {
	getRelationDictList,
	getDictTypesAllList
} from "@/api/publik";
import { deepClone } from "@/util/util.js";
export function filterObj (data) {
	let idarr = [];
	let arr = [];
	data.map((item) => {
		if (!idarr.includes(item.id)) {
			idarr.push(item.id)
			arr.push(item);
		}
	});
	return arr;
}
export function filterItem (data, id) {
	let arr = []
	arr = data.filter(item => {
		return item.id !== id
	})
	return arr
}
export function filterPermissionsBtn (data, item) {
	let ishave = false
	Object.keys(data).forEach(key => {
		if (key == item) {
			ishave = true
		}
	})
	return ishave
}
export const filterDictFieldAll = (id, obj = {}, type, cn_name = '') => {
	return new Promise(resolve => {
		getDictFieldAll(id, obj).then((res) => {
			let typeLabelObj = {
				...obj
			}
			let data = res.data.data
			if (data.length > 0) {
				data.map(item => {
					if (item['dictItemType'] == type) {
						typeLabelObj[id] = (item['dictItemValue'] == null || item['dictItemValue'] == '' || item['dictItemValue'] == undefined) ? cn_name : item['dictItemValue']
					}
				})
			}
			resolve(typeLabelObj)
		})

	})
}
export const filterDictFieldData = (data, type) => {
	return new Promise(async resolve => {
		let dictTypesAllList = await getDictTypesAllList({ dictType: type, fieldTypes: "en_US" })
		let arr = data.filter(item => {
			dictTypesAllList[type].map(typeLabel => {
				if (typeLabel['dictItemId'] == item.id) {
					item['enLabel'] = typeLabel['dictItemId'] == null || typeLabel['dictItemId'] == '' ? item['label'] : typeLabel['value']
				}
			})
			return item.status && !item.archived
		})
		resolve(arr)

	})
}
export const getPoolDictionary = (type) => {
	return new Promise(resolve => {
		fetchTypeList(type).then(async (res) => {
			let data = res.data.data;
			if (data == null) {
				resolve([])
			} else {
				let userInfo = getStore({
					name: 'userInfo',
				})
				let dataDictValues = userInfo["dataDictValues"];
				if (!dataDictValues['order_school']) {
					dataDictValues['order_school'] = []
				}
				let dictTypesAllList = await getDictTypesAllList({ dictType: 'order_school', fieldTypes: "en_US" })
				data.map(item => {
					item['disabled'] = !(item['status'] && !item.archived && dataDictValues['order_school'].includes(item['value']))//未删除&&已启用&&有权限
					dictTypesAllList['order_school'].map(a => {
						if (a['dictItemId'] == item['id']) {
							item['enLabel'] = a['value']
						}
					})
				})

				let dictFielChilddAll = data.map(item => {
					return getRelationDictLists(item.id)
				})

				Promise.all(dictFielChilddAll).then(list => {
					let dictData = deepClone(data)
					dictData.map(item => {
						list.map(l => {
							if (item.id == l.pid) {
								let { enquiry_channel, enquiry_channel_child_one, enquiry_direction, enquiry_enroll_level, enquiry_follow_tags, enquiry_pay_subject } = JSON.parse(l['child'])
								item['child'] = {
									enquiry_direction: enquiry_direction ? enquiry_direction : [],
									enquiry_enroll_level: enquiry_enroll_level ? enquiry_enroll_level : [],
									enquiry_channel: enquiry_channel ? reSetchannelOne(enquiry_channel, enquiry_channel_child_one) : [],
									enquiry_channel_child_one: enquiry_channel_child_one ? enquiry_channel_child_one : [],
									enquiry_follow_tags: enquiry_follow_tags ? enquiry_follow_tags : [],
									enquiry_pay_subject: enquiry_pay_subject ? enquiry_pay_subject : [],
								}

							}
						})
					})
					let dictPermissionData = deepClone(dictData)
					setPoolDictPermission(dictPermissionData)
					VuexStore.commit('SET_POOL_DICTIONARY', dictData)
					resolve(dictData)
				})

			}

		})
	})
}
export const setPoolDictPermission = (dict) => {
	let data = JSON.parse(JSON.stringify(dict))
	let userInfo = getStore({
		name: 'userInfo',
	})
	let dataDictValues = userInfo["dataDictValues"];
	let permissDict = []; // 过滤校区下子集的字典权限
	if (dataDictValues['order_school']) {
		permissDict = data.filter(item => {
			let child = item['child']
			Object.keys(child).forEach(res => {
				if (item['child'][res] && child[res]) {
					item['child'][res] = child[res].filter(c => {
						if (dataDictValues[res]) {
							return dataDictValues[res].includes(c.value)
						}

					})
				}

			})
			return dataDictValues['order_school'].includes(item.value) && item.status && !item.archived
			// return item.status && !item.archived
		})
		permissDict.map(item => {
			let child = item['child']
			let { enquiry_channel, enquiry_channel_child_one, } = child
			item['child']['enquiry_channel'] = reSetchannelOne(enquiry_channel, enquiry_channel_child_one)
		})

	}
	VuexStore.commit('SET_POOL_DICTIONARY_PERMISSIONS', permissDict)
	VuexStore.commit('SET_DICTVALUESDATA', {
		data: permissDict,
		type: 'order_school'
	})
}

export const getRelationDictLists = (pid) => {
	return new Promise((resolve, reject) => {
		getRelationDictList(pid).then(res => {
			if (res.data.success) {
				let data = res.data.data;
				let dictFieldAll = [];
				let userInfo = getStore({
					name: 'userInfo',
				})
				let dataDictValues = userInfo["dataDictValues"];
				Object.keys(data).forEach(item => {
					if (!dataDictValues[item]) {
						dataDictValues[item] = []
					}
					dictFieldAll.push(getDictTypesAllList({
						dictType: item, fieldTypes: 'en_US', pid: pid
					}))
				});
				Promise.all(dictFieldAll).then(list => {
					Object.keys(data).forEach(item => {
						data[item].map(type => {
							type['disabled'] = !(type['status'] && !type['archived'] && dataDictValues[item].includes(type['value']))
							list.map(l => {
								if (l[item]) {
									l[item].map(a => {
										if (a['dictItemId'] == type['id']) {
											type['enLabel'] = a['value']
										}
									})
								}

							})
						})
					});
					resolve({ pid: pid, child: JSON.stringify(data) });
				})

			} else {
				resolve({ pid: pid, child: {} });
			}
		});
	});
}
export const reSetchannelOne = (channel, channelChild) => {
	let newChannel = channel ? channel : []
	let newChannelChild = channelChild ? channelChild : []
	newChannel.map(item => {
		item['child'] = newChannelChild.filter(c => {
			return c.pid == item.id
		})
	})
	return newChannel
}