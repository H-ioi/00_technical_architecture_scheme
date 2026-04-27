<template>
    <div>
        <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
            <el-tab-pane :label="$t('attendance.我的待办')" name="todo">
                <mytask ref="mytaskRef"></mytask>
            </el-tab-pane>
            <el-tab-pane :label="$t('attendance.我的已办')" name="done">
                <mycomplete ref="mycompleteRef"></mycomplete>
            </el-tab-pane>
            <el-tab-pane :label="$t('attendance.我的发起')" name="instance">
                <myinstance ref="myinstanceRef"></myinstance>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import mytask from './mytask.vue'
import mycomplete from './mycomplete.vue'
import myinstance from './myinstance.vue'

export default {
    components: {
        mytask,
        mycomplete,
        myinstance
    },
    data() {
        return {
            activeTab: 'todo'
        }
    },
    methods: {
        handleTabClick(tab) {
            // 切换标签页时刷新对应的数据
            if (tab.name === 'todo' && this.$refs.mytaskRef) {
                this.$refs.mytaskRef.getDataList();
            } else if (tab.name === 'done' && this.$refs.mycompleteRef) {
                this.$refs.mycompleteRef.getDataList();
            } else if (tab.name === 'instance' && this.$refs.myinstanceRef) {
                this.$refs.myinstanceRef.getDataList();
            }
        }
    }
}
</script>

<style scoped>
.el-tabs {
    margin-bottom: 20px;
}
</style>