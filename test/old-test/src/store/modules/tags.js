import { getStore, setStore } from '@/util/store'
import { diff } from '@/util/util'
import website from '@/const/website'
const TENANT_ID = getStore({
	name: "tenantId"
});
function resetItem (action) {
	return {
		// label: action['label'],
		value: action['value'],
		params: action['params'],
		query: action['query'],
		group: action['group']
	}
}
function getTagWel () {
	let tenantId = getStore({
		name: "tenantId"
	});
	return website.systemFistPage[tenantId]
}
const isFirstPage = website.isFirstPage
// const tagWel = website.systemFistPage[TENANT_ID]
const tagWel = getTagWel()
const tagObj = {
	label: '', // 标题名称
	value: '', // 标题的路径
	params: '', // 标题的路径参数
	query: '', // 标题的参数
	group: [] // 分组
}

// 处理首个标签
function setFistTag (list) {
	if (list.length === 1) {
		list[0].close = false
	} else {
		list.forEach(ele => {
			if (ele.value === tagWel.value && isFirstPage === false) {
				ele.close = false
			} else {
				ele.close = true
			}
		})
	}
}

const navs = {
	state: {
		tagList: getStore({ name: 'tagList' }) || [],
		tag: getStore({ name: 'tag' }) || tagObj,
		tagWel: tagWel
	},
	actions: {},
	mutations: {
		ADD_TAG: (state, action) => {
			state.tag = action
			setStore({ name: 'tag', content: state.tag, type: 'session' })
			// if (state.tagList.some(ele => diff(ele, action))) return
			if (state.tagList.some(ele => diff(resetItem(ele), resetItem(action)))) return
			state.tagList.push(action)
			setFistTag(state.tagList)
			setStore({ name: 'tagList', content: state.tagList, type: 'session' })
		},
		DEL_TAG: (state, action) => {
			// console.log("action", action);
			state.tagList = state.tagList.filter(item => {
				return !diff(item, action)
			})
			setFistTag(state.tagList)
			setStore({ name: 'tagList', content: state.tagList, type: 'session' })
		},
		DEL_ALL_TAG: (state, action = false) => {
			state.tagList = action ? [] : [state.tagWel]
			setStore({ name: 'tagList', content: state.tagList ? state.tagList : [], type: 'session' })
		},
		DEL_TAG_OTHER: (state) => {
			state.tagList = state.tagList.filter(item => {
				if (item.value === state.tag.value) {
					return true
				} else if (!website.isFirstPage && item.value === website.fistPage.value) {
					return true
				}
			})
			setFistTag(state.tagList)
			setStore({ name: 'tagList', content: state.tagList, type: 'session' })
		},
		// 关闭当前标签页
		CLOSE_TAG_CURRENT: (state, action) => {
			let currentTag = state.tagList.filter(item => {
				return item.value == action
			})
			state.tagList = state.tagList.filter(item => {
				return !diff(item, currentTag[0])
			})
			setFistTag(state.tagList)
			setStore({ name: 'tagList', content: state.tagList, type: 'session' })
		},
	}
}
export default navs
