import config from '@/config/index.js'
import {
	getSerialNum,
	dateFormat,
	getPendingSignatureStr,
	withSign
} from '@/utils/index'
export default {
	data() {
		return {
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
				token: "",
			},
			curCity: {
				isAddress: false,
				isCur: true,
				latitude: 23.12463,
				longitude: 113.36199,
				name: '定位中',
			},
			session_key: '',
			submitBool: false
		}
	},
	activated() {},
	created() {
		if (this.$store.state.userInfo) {
			this.userInfo = this.$store.state.userInfo
		}
		this.curCity = this.$store.state.curCity
	},
	watch: {},
	methods: {
		/**
		 * url 必传  访问页面的地址
		 * isLogin 可选 是否登录
		 * data 埋点
		 */
		openToPage(url, data = null, isLogin = false) {
			// 判断是否是绝对链接路径
			const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
			let objExp = new RegExp(Expression);
			// 跳转前判断是否需要登录
			if (isLogin) {
				if (this.$store.state.userInfo.openId === '') {
					this.$store.state.isLogin = isLogin
					this.$store.state.isLoginUrl = url
					this.$store.state.isLoginData = data
					this.getUserInfo()
					return false
				}
			}
			if (objExp.test(url) === true) {
				url = encodeURIComponent(url)
				// 跳内嵌页
				uni.navigateTo({
					url: '/pages/view/web-view?url=' + url
				});
			} else {
				uni.navigateTo({
					url: url
				});
			}
		},
		// 导航 isBaidu 自动定位获取的经纬度 设置为false
		toAddressMap(item, isBaidu = true) {
			let _this = this
			let lngs = item.longitude
			let lats = item.latitude

			// 百度地图经纬度转腾讯
			if (isBaidu) {
				let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
				let x = item.longitude - 0.0065;
				let y = item.latitude - 0.006;
				let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
				let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
				lngs = z * Math.cos(theta);
				lats = z * Math.sin(theta);
			}

			uni.openLocation({
				latitude: lats, //要去的纬度-地址       
				longitude: lngs, //要去的经度-地址
				name: item.name, //地址名称
				address: item.address, //详细地址名称
				success: function() {
					console.log('导航成功');
				},
				fail: function(error) {
					console.log(error)
				}
			})

		},
		// 返回上一页
		backPage() {
			uni.navigateBack()
		},
		// 拨打电话
		makeCall(phone, item = null) {
			uni.makePhoneCall({
				phoneNumber: phone
			})
		},
		// 登录
		getLogin() {
			let _this = this
			uni.login({
				provider: 'weixin',
				success: function(infoRes) {
					_this.$http.get(`${config.baseUrl}/api/v1.0/wechat/login/${infoRes.code}`).then(({
						data: res
					}) => {
						_this.session_key = res.body.session_key
					})
				}
			})
		},
		//获取手机号
		getPhoneNumber(e) {
			console.log(e)
			let _this = this
			if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {} else {
				_this.$http.post(`${config.baseUrl}/api/v1.0/wechat/appletDecrypt`, {
					encrypdata: e.detail.encryptedData,
					ivdata: e.detail.iv,
					sessionkey: _this.session_key,
				}).then(({
					data: resInfo
				}) => {
					console.log(resInfo)
					_this.userInfo.phone = resInfo.body.phoneNumber
					_this.$store.commit('login', _this.userInfo)
				})
			}
		},
		// 获取用户信息
		getUserInfo() {
			let _this = this
			uni.login({
				provider: 'weixin',
				success: function(infoRes) {
					_this.$http.get(`${config.baseUrl}/api/v1.0/wechat/login/${infoRes.code}`).then(({
						data: res
					}) => {
						// 获取解析用户信息
						uni.getUserInfo({
							provider: 'weixin',
							withCredentials: true,
							success: function(userRes) {
								_this.$http.post(`${config.baseUrl}/api/v1.0/wechat/appletDecrypt`, {
									encrypdata: userRes.encryptedData,
									ivdata: userRes.iv,
									signature: userRes.signature,
									rawData: userRes.rawData,
									sessionkey: res.body.session_key,
								}).then(({
									data: resInfo
								}) => {
									_this.userInfo = {
										..._this.userInfo,
										...userRes.userInfo,
										openId: res.body.openId,
										session_key: res.body.session_key,
										...resInfo.body
									}
									_this.$store.commit('login', _this.userInfo)

									// 页面没有登录获取信息之后重新提交
									_this.submit ? _this.submit() : ""

									// 返回上一个页面
									if (_this.$store.state.isLogin) {
										_this.$store.state.isLogin = false
										_this.openToPage(_this.$store.state.isLoginUrl, _this.$store.state.isLoginData, true)
									}
								})
							}
						});
					})
				}
			})
		},
		// 生成小程序码
		getUnLlimited(scene = '?', page = '', width = 280) {
			return new Promise((resolve, reject) => {
				this.$http.post(`${config.baseUrl}/api/v1.0/wechat/getUnlimited`, {
					scene: scene,
					page: page,
					width: width
				}, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(({
					data: res
				}) => {
					resolve(res)
				})
			})
		},
		// 获取地址位置
		getAddressData() {
			let _this = this
			return new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						_this.curCity.latitude = res.latitude
						_this.curCity.longitude = res.longitude
						_this.curCity.isAddress = true
						_this.$http.get(
							`${config.baseUrl}/api/v1.0/wechat/reverseAddress?latitude=${_this.curCity.latitude}&longitude=${_this.curCity.longitude}`
						).then(({
							data: resName
						}) => {
							_this.curCity.name = resName.body.result.ad_info.city.replace('市', '')
							_this.curCity.isCur = false
							resolve(_this.curCity)
						})
					},
					fail() {
						_this.curCity = {
							isAddress: false,
							isCur: true,
							latitude: 23.12463,
							longitude: 113.36199,
							name: '广州',
						}
						reject()
					}
				})
			})
		}
	}
}
