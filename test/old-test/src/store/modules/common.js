import {
	getStore,
	removeStore,
	setStore
} from '@/util/store'
import website from '@/const/website'
import {
	fetchTypeList
} from '@/api/publik'
import {
	filterDictFieldAll,
	filterDictFieldData
} from "@/util/filter.js";

const common = {

	state: {
		isCollapse: true,
		isFullScreen: false,
		isShade: false,
		screen: -1,
		isLock: getStore({
			name: 'isLock'
		}) || false,
		showTag: getStore({
			name: 'showTag'
		}),
		showDebug: getStore({
			name: 'showDebug'
		}),
		showCollapse: getStore({
			name: 'showCollapse'
		}),
		showSearch: getStore({
			name: 'showSearch'
		}),
		showLock: getStore({
			name: 'showLock'
		}),
		showFullScreen: getStore({
			name: 'showFullScreen'
		}),
		showTheme: getStore({
			name: 'showTheme'
		}),
		showColor: getStore({
			name: 'showColor'
		}),
		showMenu: getStore({
			name: 'showMenu'
		}),
		theme: getStore({
			name: 'theme'
		}) || '#175E67',
		themeName: getStore({
			name: 'themeName'
		}) || 'theme-white',
		lockPasswd: getStore({
			name: 'lockPasswd'
		}) || '',
		website: website,
		dictionary: getStore({
			name: 'dictionary'
		}) || {},
		currentstatus: getStore({
			name: 'currentstatus'
		}) || '2',
		i18nlocel: getStore({
			name: 'i18nlocel'
		}) || "zh",
		dictpermissions: getStore({
			name: 'dictpermissions'
		}) || {},
		pooldictionary: getStore({
			name: 'pooldictionary'
		}) || [],
		pooldictpermissions: getStore({
			name: 'pooldictpermissions'
		}) || [],
	},
	actions: {
		GetDictionary ({
			commit
		}, obj) {
			return new Promise(resolve => {
				fetchTypeList(obj.type).then(async (res) => {
					// if (res.data.data == null) return
					let list = res.data.data ? res.data.data : []
					let data = {}
					data[obj.type] = []
					// 过滤禁用的和软删除
					data[obj.type] = await filterDictFieldData(list, obj.type)
					// console.log('GetDictionary', data);
					commit('SET_DICTIONARY', data)
					commit('SET_DICTVALUESDATA', {
						data: data[obj.type],
						type: obj.type
					})
					resolve(data)
				})
			})
		}
	},
	mutations: {
		SET_I18NLOCALE: (state, active) => {
			state.i18nlocel = active
			setStore({
				name: 'i18nlocel',
				content: state.i18nlocel
			})
		},
		SET_SHADE: (state, active) => {
			state.isShade = active
		},
		SET_COLLAPSE: (state) => {
			state.isCollapse = !state.isCollapse
		},
		SET_FULLSCREEN: (state) => {
			state.isFullScreen = !state.isFullScreen
		},
		SET_SHOW_COLLAPSE: (state, active) => {
			state.showCollapse = active
			setStore({
				name: 'showCollapse',
				content: state.showCollapse
			})
		},
		SET_SHOW_TAG: (state, active) => {
			state.showTag = active
			setStore({
				name: 'showTag',
				content: state.showTag
			})
		},
		SET_SHOW_MENU: (state, active) => {
			state.showMenu = active
			setStore({
				name: 'showMenu',
				content: state.showMenu
			})
		},
		SET_SHOW_LOCK: (state, active) => {
			state.showLock = active
			setStore({
				name: 'showLock',
				content: state.showLock
			})
		},
		SET_SHOW_SEARCH: (state, active) => {
			state.showSearch = active
			setStore({
				name: 'showSearch',
				content: state.showSearch
			})
		},
		SET_SHOW_FULL_SCREEN: (state, active) => {
			state.showFullScreen = active
			setStore({
				name: 'showFullScreen',
				content: state.showFullScreen
			})
		},
		SET_SHOW_DEBUG: (state, active) => {
			state.showDebug = active
			setStore({
				name: 'showDebug',
				content: state.showDebug
			})
		},
		SET_SHOW_THEME: (state, active) => {
			state.showTheme = active
			setStore({
				name: 'showTheme',
				content: state.showTheme
			})
		},
		SET_SHOW_COLOR: (state, active) => {
			state.showColor = active
			setStore({
				name: 'showColor',
				content: state.showColor
			})
		},
		SET_LOCK: (state) => {
			state.isLock = true
			setStore({
				name: 'isLock',
				content: state.isLock,
				type: 'session'
			})
		},
		SET_SCREEN: (state, screen) => {
			state.screen = screen
		},
		SET_THEME: (state, color) => {
			state.theme = color
			setStore({
				name: 'theme',
				content: state.theme
			})
		},
		SET_THEME_NAME: (state, themeName) => {
			state.themeName = themeName
			setStore({
				name: 'themeName',
				content: state.themeName
			})
		},
		SET_LOCK_PASSWD: (state, lockPasswd) => {
			state.lockPasswd = lockPasswd
			setStore({
				name: 'lockPasswd',
				content: state.lockPasswd,
				type: 'session'
			})
		},
		CLEAR_LOCK: (state) => {
			state.isLock = false
			state.lockPasswd = ''
			removeStore({
				name: 'lockPasswd'
			})
			removeStore({
				name: 'isLock',
				type: 'session'
			})
		},
		CLEAR_DICTIONARY: (state, data = {}) => {
			state.dictionary = {}
			setStore({
				name: 'dictionary',
				content: {},
				type: 'session'
			})
		},
		SET_DICTIONARY: (state, data = {}) => {
			let obj = {
				...state.dictionary,
				...data
			}
			state.dictionary = obj
			setStore({
				name: 'dictionary',
				content: obj,
				type: 'session'
			})
		},
		SET_CURRENTSTATUS: (state, active) => {
			state.currentstatus = active
			setStore({
				name: 'currentstatus',
				content: active,
				type: 'session'
			})
		},

		//字典权限
		SET_DICTVALUESDATA: (state, obj) => {
			// console.log('SET_DICTVALUESDATA',obj);
			let userInfo = getStore({
				name: 'userInfo',
			})
			let dataDictValues = userInfo["dataDictValues"];
			let arr = []
			if (dataDictValues[obj['type']]) {
				arr = obj['data'].filter((i) => {
					return (
						dataDictValues[obj['type']].includes(i.value) && i.status && !i.archived
					);
				});
				state.dictpermissions[obj['type']] = arr
			}

			setStore({
				name: 'dictpermissions',
				content: state.dictpermissions,
				type: 'session'
			})
		},
		SET_POOL_DICTIONARY: (state, data) => {
			state.pooldictionary = data
			setStore({
				name: 'pooldictionary',
				content: data,
				type: 'session'
			})
		},
		SET_POOL_DICTIONARY_PERMISSIONS: (state, data) => {
			// console.log('SET_POOL_DICTIONARY_PERMISSIONS',data);
			state.pooldictpermissions = data
			setStore({
				name: 'pooldictpermissions',
				content: data,
				type: 'session'
			})
		},
	}
}
export default common
