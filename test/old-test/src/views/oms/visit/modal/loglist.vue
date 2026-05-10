<template>
  <div class="thepool_page">
    <div class="orderDetail_baseinfo" style="padding-top: 0 !important">
      <el-steps
        v-if="logList.length > 0"
        class="poolSteps"
        direction="vertical"
        :active="logList.length"
      >
        <el-step
          v-for="(i, k) in logList"
          :key="k"
          :title="'审核时间：' + i.auditTime"
        >
          <template slot="description">
            <div class="df_sb">
              <div class="loglabel">审核人：{{ i.userName || "--" }}</div>
            </div>
            <div class="df_sb">
              <div class="loglabel">
                审核状态：{{ i.auditStatusLabel || "--" }}
              </div>
            </div>
            <div class="df_sb">
              <div class="loglabel">备注：{{ i.remark || "--" }}</div>
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>
    <el-empty v-if="logList.length == 0" description="No Data~"></el-empty>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "addlog",
  props: {
    logList: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.poolSteps {
  width: 100%;
  margin-top: 30px;
}

.loglabel {
  font-size: 14px;
  color: #0d0d0d;
  line-height: 24px;
}
</style>
