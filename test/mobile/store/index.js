import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/utils/request'
import config from '@/config/index.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: {
			nickName: "微信一键登录",
			gender: 1,
			language: "",
			city: "",
			province: "",
			country: "",
			avatarUrl: "https://gcimage.oss-cn-shenzhen.aliyuncs.com/img/touxiang.png",
			openId: "",
			phone: "",
			session_key: "",
			unionId: "",
			token:"",
		},
		menuButtonInfo: { // 右上角胶囊按钮出参数
			width: 87,
			height: 32,
			top: 24,
			right: 404,
			bottom: 56,
			left: 317
		},
		navHeight: 60, // 自定义导航高度
		isLogin: false, // 授权回去用户信息之后，是否需要继续前往URL
		isLoginUrl: '', // 前往URL
		isLoginData: null, // 前往携带的数据
		imgList: [],   // 详情页当前图片
		videoList: [], // 详情页当前视屏
	},
	mutations: {
		login(state, userInfo) {
			state.userInfo = userInfo
			// 缓存用户信息
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		logout(state) {
			state.userInfo = null
			// 清理缓存用户信息
			uni.removeStorageSync('userInfo')
		},
		setNavHeight(state, h) {
			state.navHeight = h
			// 导航高度
			uni.setStorageSync('navHeight', h)
		},
		getMenuBtn(state) {
			 let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			 state.menuButtonInfo = menuButtonInfo
			 uni.setStorageSync('menuButtonInfo', JSON.stringify(state.menuButtonInfo))
		}
	},
	actions: {
		login({
			commit
		}, params) {
			return new Promise((resolve, reject) => {
				commit('login', params)
				resolve()
			})
		},
		logout({
			commit
		}) {
			commit('logout')
		}
	},
	getters: {
		getUserInfo: state => {
			let userInfo = uni.getStorageInfoSync('userInfo')
			return JSON.parse(userInfo)
		},
		getCurCity: state => {
			let curCity = uni.getStorageInfoSync('curCity')
			console.log('curCity', curCity)
			return JSON.parse(curCity)
		}
	}
})

export default store
