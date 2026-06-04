<template>
	<view class="content">
		页面 - A
	</view>
</template>

<script>
	import { add } from '@/utils/index.js'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			
		},
		methods: {
			// 初始化页面
			init() {
				console.log(0.1+0.2)
				console.log(add(0.1, 0.2))
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
		margin-top: 200upx;
	}
</style>
