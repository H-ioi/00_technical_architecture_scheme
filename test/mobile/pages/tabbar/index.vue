<template>
	<view>
		<!-- :class="PageCur=='a'?'tabShow' : 'tabHide'" -->
		<tab-a v-if="PageCur=='a'" ref="tabItemA" ></tab-a>
		<tab-b v-if="PageCur=='b'" ref="tabItemB" :navHeight="navHeight"></tab-b>
		<tab-c v-if="PageCur=='c'" ref="tabItemC" :navHeight="navHeight"></tab-c>
		<tab-d v-if="PageCur=='d'" ref="tabItemD" ></tab-d>
		<view class="tab-foter">
			<view class="action" @click="NavChange" data-cur="a">
				<image v-show="PageCur=='a'" :src="imgUrl + '/a-cur.gif?index=' + imgIndexs[0]" ></image>
				<image v-show="PageCur!=='a'"  src="@/static/img/a.jpg"></image>
				<view :class="PageCur=='a'?'text-green':'text-gray'">首页</view>
			</view>
			<view class="action" @click="NavChange" data-cur="b">
				<image v-show="PageCur=='b'" :src="imgUrl + '/b-cur.gif?index=' +  imgIndexs[1]"></image>
				<image v-show="PageCur!=='b'"  src="@/static/img/b.jpg"></image>
				<view :class="PageCur=='b'?'text-green':'text-gray'">车型</view>
			</view>
			<view class="action" @click="NavChange" data-cur="c">
				<image v-show="PageCur=='c'" :src="imgUrl + '/c-cur.gif?index=' +  imgIndexs[2]"></image>
				<image v-show="PageCur!=='c'" src="@/static/img/c.jpg"></image>
				<view :class="PageCur=='c'?'text-green':'text-gray'">经销商</view>
			</view>
			<view class="action" @click="NavChange" data-cur="d">
				<image v-show="PageCur=='d'"  :src="imgUrl + '/d-cur.gif?index=' +  imgIndexs[3]"></image>
				<image v-show="PageCur!=='d'" src="@/static/img/d.jpg"></image>
				<view :class="PageCur=='d'?'text-green':'text-gray'">我的</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/config/index.js'
	import { debounce } from '@/utils/index.js'
	import tabA from '@/pages/tabbar/tabbar-a'
	import tabB from '@/pages/tabbar/tabbar-b'
	import tabC from '@/pages/tabbar/tabbar-c'
	import tabD from '@/pages/tabbar/tabbar-d'
	export default {
		components:{
			tabA,
			tabB,
			tabC,
			tabD
		},
		data() {
			return {
				imgUrl: config.imgUrl,
				PageCur: 'a',
				background: {
					backgroundColor: '#ffffff',
					boxShadow: '0 0 4rpx rgba(0, 0, 0, 0.2)'
				},
				backTextStyle: {
					width: '120rpx',
					fontSize: '26rpx'
				},
				index: 1,
				navHeight: 0,
				imgIndexs: [0,0,0,0]
			}
		},
		watch: {
			// 监听点击  预加载gif
			PageCur(newValue, oldValue){
				switch(oldValue){
				    case 'a' :
				       this.imgIndexs[0]++
				       break
				    case 'b' :
					   this.imgIndexs[1]++
					   break
					case 'c' :
					   this.imgIndexs[2]++
					   break
					case 'd' :
					   this.imgIndexs[3]++
					   break
				}
			}
		},
		onShow(e) {
			this.$nextTick(() => {
				switch(this.PageCur){
					case 'a':
						this.$refs.tabItemA.init()
						break
					case 'b':
						this.$refs.tabItemB.init()
						break
					case 'c':
						this.$refs.tabItemC.init()
						break
					case 'd':
						this.$refs.tabItemD.init()
						break
				}
			})
		},
		onLoad(res) {
			if (res.index) {
				this.PageCur = res.index
			}
		},
		onShareAppMessage() {
			return {
			  title: this.title,
			  path: '/pages/tabbar/index?index=' + this.PageCur
			}
		},
		onShareTimeline() {
			return {
			  title: this.PageCur === 'a' ? this.title : '「星乐度」' + this.title,
			  query:{
				  index: this.PageCur
			  }
			}
		},
		methods: {
			NavChange (e) {
				this.PageCur = e.currentTarget.dataset.cur
				switch(this.PageCur){
					case 'a':
						this.title = '星乐度'
						break
					case 'b':
						this.title = '新车选购'
						break
					case 'c':
						this.title = '经销商列表'
						break
					case 'd':
						this.title = '我的'
						break
				}
			}
		}
	}
</script>
<style>
	page {
		background: #f0f0f0;
	}
</style>
<style scoped lang="scss">
.tab-foter{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	box-shadow: 0 0 8upx rgba(0, 0, 0, 0.1);
	display: flex;
	z-index: 99;
	.action{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20upx 0 15upx;
		transition: all 0.3s;
		image{
			width: 64upx;
			height: 64upx;
		}
		text{
			font-size: 35upx;
			color: #A9BAC1;
			line-height: 40upx;
			display: block;
		}
		.cur{
			color: #FD543F;
		}
		.text-green{
			font-size: 24upx;
			color: #FD543F;
		}
		.text-gray{
			font-size: 24upx;
			color: #A9BAC1;
			transition: all 0.3s;
		}
	}
}
.tabShow{
	display: block;
}
.tabHide{
	display: none;
}
.slot-wrap{
	padding: 0 0 0 25upx;
	display: flex;
	align-items: center;
	.icon-location{
		font-size: 26upx;
		color: #666666;
		margin-right: 5upx;
		margin-bottom: -3upx;
		font-weight: bold;
	}
	.map-wrap-text{
		font-size: 26upx;
		width: 120upx;
		overflow: hidden;
		color: #666666;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
}
</style>
