<template>
	<view class="login-content">
		<view class="_logo">
			<image src="../../static/img/icon_log.gif" mode=""></image>
		</view>
		<view class="input-item">
			<input v-model="dataForm.loginname" class="uni-input" focus placeholder="账号" />
		</view>
		<view class="input-item">
			<input v-model="dataForm.password" class="uni-input" password type="text" placeholder="密码" />
		</view>
		<button class="submit-btn" :loading="logoLoading" @click="sumbit">登录</button>
		<view class="tab_list">
			<!-- #ifdef MP-WEIXIN -->
			<text class="iconfont icon-weixin" @click="wxLogin"></text>
			<button class='bottom'
				type='primary'
				open-type="getUserInfo"
				withCredentials="true"
				lang="zh_CN"
				@getuserinfo="wxGetUserInfo">授权登录</button>
			<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取电话号码</button> 
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
import { getUUID } from '@/utils/index.js'
export default {
	data() {
		return {
			logoLoading: false,
			dataForm: {
				loginname: 'admin',
				password: '888888',
				uuid: ''
		    }
		};
	},
	onLoad() {
		this.dataForm.uuid = getUUID()
	},
	methods: {
		/**
		 * 登录
		 */
		sumbit () {
			this.$http.post('/sys/User/login', this.dataForm).then(({ data: res }) => {
				// 存储token
				uni.setStorageSync('token', res.token)
				
				// 存储用户数据
				this.$store.dispatch('login', res.data).then(res => {
					// 判断登录成功是前往哪个页面
					let pageCur = getCurrentPages()
					uni.showToast({
					    title: '登录成功',
					    duration: 1000
					})
					if (pageCur[0].route !== 'pages/login/login') {
						uni.navigateBack()
					} else {
						uni.switchTab({
						    url: '/pages/tabbar/index'
						});
					}
				})
			})
		},
		/**
		 * 微信登录
		 */
		wxLogin () {
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes);
					// 获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							console.log('用户昵称为：', infoRes);
						},
						fail: (err) => {
							console.log(err)
						}
					});
				}
			});
		},
		/**
		 * 
		 */
		wxGetUserInfo(){
			let _this = this;
			// 获取用户信息
			uni.getUserInfo({
				provider: 'weixin',
				success: function (infoRes) {
					console.log(infoRes)
				},
				fail: function (fail){console.log("fail:",fail)}
			});
		},
		/**
		 * @param {Object} e
		 * 获取手机号
		 */
		getPhoneNumber: function(e) {    
			console.log(e);    
			if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {    
				console.log('用户拒绝提供手机号');  
			} else {    
				console.log('用户同意提供手机号');  

				console.log(JSON.stringify(e.detail.encryptedData));    
				console.log(JSON.stringify(e.detail.iv));   

				var encryptedData = e.detail.encryptedData;  
				var iv = e.detail.iv;  

				var JSCODE = this.login_code;  
				var APPID = this.APPID;  
				var SECRET = this.SECRET;  
				var wx_author_url = this.WX_AUTH_URL + '?appid=' + APPID + '&secret=' + SECRET + '&js_code=' + JSCODE + '&grant_type=authorization_code';  

				uni.request({  
					url : wx_author_url,  
					success(re){  
						console.log( 'session_key:' + re.data.session_key );  

						var appId = APPID;  
						var sessionKey = re.data.session_key;  

						var pc = new WXBizDataCrypt(appId, sessionKey);  
						var data = pc.decryptData(encryptedData, iv);  
					}  
				});
			}    

		}, 
	}
};
</script>

<style lang="scss">
.login-content {
	padding: 30upx 60upx 0;
	text-align: center;
	._logo{
		margin-bottom: 100upx;
		image{
			width: 100%;
		}
	}
	.input-item{
		margin-bottom: 60upx;
		input{
			line-height: 50upx;
			border-bottom: 1upx solid #DCDCDC;
			text-align: left;
			padding: 10upx;
		}
	}
	.submit-btn{
		border-radius: 50upx;
		width: 50%;
		color: #FFFFFF;
		padding: 15upx 40upx;
		line-height: 60upx;
		background-color: #FD1353;
		box-shadow: 0 0 18upx rgba($color: #FD1353, $alpha: 0.5);
	}
	.tab_list{
		padding: 20upx;
		text{
			font-size: 60upx;
			color: #4CD964;
		}
	}
}
</style>
