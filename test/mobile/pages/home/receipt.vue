<template>
	
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
	mixins: [mixinViewModule],
	data() {
		return {
			mixinViewModuleOptions: {
				getDataListURL: '/receipt/info/getDataList',
				getDataListIsPage: true,
				deleteURL: '/receipt/info/deleteData',
				deleteIsBatch: true
		    },
			dataForm: {
				name: '',
				status: '',
				startDate: '',
				endDate: '',
				type: ''
			}
		};
	},
	onLoad() {
		console.log(this.$store.state.user)
		this.getDataList()
	},
	methods: {
	}
};
</script>

<style>
</style>
