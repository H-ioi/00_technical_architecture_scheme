<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("dorm.住宿生管理") }}</div>
      <div class="community_top_btn">
        <!-- <el-button type="primary" size="large" @click="exportData">{{
          $t("btn.导出")
        }}</el-button> -->
      </div>
    </div>
     <div class="community_centent" style="overflow-y: scroll;">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('dorm.当前住宿生')" name="current">
          <current-student ref="currentManage" v-if="activeTab === 'current'"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('dorm.历史住宿生')" name="history">
          <history-student ref="historyManage" v-if="activeTab === 'history'"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import currentStudent from '../current-student.vue'
import historyStudent from '../history-student.vue'

export default {
  name: 'BoardingStudent',
  components: { currentStudent, historyStudent },
  data() {
    return {
      activeTab: 'current',
    }
  },
  methods: {
    // 处理tab切换
    handleTabClick(tab) {
      // 这里的 v-if 已经可以保证只有选中的 tab 的组件才会被渲染并执行 mounted 里的接口请求
      // 如果需要在切换时强制刷新数据，可以使用 this.$nextTick 等待组件渲染完成后再调用
      /*
      this.$nextTick(() => {
        if (tab.name === 'current' && this.$refs.currentManage) {
          this.$refs.currentManage.getDataList()
        } else if (tab.name === 'history' && this.$refs.historyManage) {
          this.$refs.historyManage.getDataList()
        }
      })
      */
    }
  }
}
</script>

<style scoped>
/* 防止学校列内容换行 */
.el-table .el-table__cell[data-column-key="studentSchool"] {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}
</style>
