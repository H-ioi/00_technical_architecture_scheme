<template>
    <view>
        <web-view :webview-styles="webviewStyles" :src="url"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#00aa00'
                    }
                },
				url: '',
				set: {
					title: '',
					bgColor: '',
					hideHome: false,
				}
            }
        }, 
		onLoad(res) {
			if (res.url) {
				let url = decodeURIComponent(res.url)
				this.url = url
			}
		}
    }
</script>

<style>

</style>