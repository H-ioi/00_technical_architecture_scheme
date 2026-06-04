<script>
export default {
	onLaunch: function() {
		// #ifdef MP-WEIXIN
		this.getMenuButtonInfo()
		// #endif
	},
	onHide: function() {
		console.log('退出小程序');
		uni.removeStorageSync('curCityList');
	},
	methods:{
		// 获取胶囊按钮采参数
		getMenuButtonInfo () {
			this.$store.commit('getMenuBtn')
		}
	}
};
</script>

<style>
/*每个页面公共css */
</style>
