<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("attendance.请假管理") }}</div>
      <div class="community_top_btn">
        <!-- <el-button type="primary" size="large" @click="exportData">{{
          $t("btn.导出")
        }}</el-button> -->
      </div>
    </div>
    <div class="community_centent">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('attendance.请假管理')" name="leave">
          <leave-manage ref="leaveManage"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('attendance.销假管理')" name="cancel">
          <cancel-manage ref="cancelManage"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import leaveManage from './leaveManage.vue'
import cancelManage from './cancelManage.vue'

export default {
  name: 'HolidayIndex',
  components: { leaveManage, cancelManage },
  data() {
    return {
      activeTab: 'leave',
    }
  },
  methods: {
    // 处理tab切换
    handleTabClick(tab) {
      if (tab.name === 'leave' && this.$refs.leaveManage) {
        this.$refs.leaveManage.getDataList()
      } else if (tab.name === 'cancel' && this.$refs.cancelManage) {
        this.$refs.cancelManage.getDataList()
      }
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