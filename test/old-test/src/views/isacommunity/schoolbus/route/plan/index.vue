<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.路线规划") }}</div>
      <div class="community_top_btn" v-if="activeName == 'route'">
        <el-button
          v-if="permissions['busline_add']"
          type="primary"
          size="large"
          @click="showRouteForm"
          >{{ $t("isagroup.新增路线") }}</el-button
        >
        <el-button
          v-if="permissions['busline_import']"
          type="defult"
          size="large"
          @click="batchUpdloadRoute"
          >{{ $t("btn.导入") }}</el-button
        >
      </div>
      <div class="community_top_btn" v-if="activeName == 'bussection'">
        <el-button
          v-if="permissions['bussection_add']"
          type="primary"
          size="large"
          @click="showTermForm"
          >{{ $t("isagroup.新增学期") }}</el-button
        >
      </div>
      <div class="community_top_btn" v-if="activeName == 'station'">
        <el-button
          v-if="permissions['busstation_add']"
          type="primary"
          size="large"
          @click="showStationForm"
          >{{ $t("isagroup.新增站点") }}</el-button
        >
        <el-button
          v-if="permissions['busstation_import']"
          type="defult"
          size="large"
          @click="batchUpdloadSation"
          >{{ $t("btn.导入") }}</el-button
        >
      </div>
    </div>
    <div class="community_centent">
      <div class="community_tabs">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('isagroup.全部路线')" name="route">
            <Routes ref="Routes" />
          </el-tab-pane>
          <el-tab-pane :label="$t('isagroup.学期配置')" name="bussection">
            <Term ref="Term" />
          </el-tab-pane>
          <el-tab-pane :label="$t('isagroup.站点配置')" name="station">
            <Station ref="Station" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Routes from "./table/routes.vue";
import Term from "./table/term.vue";
import Station from "./table/station.vue";
export default {
  name: "teacher",
  components: { Table, Pagination, Routes, Term, Station },
  data() {
    return {
      activeName: "route",
    };
  },
  created() {},
  mounted() {},
  activated() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    handleTabClick(tab) {
      this.activeName = tab.name;
      // 手动调用 doLayout 方法重新计算滑块位置
      this.$nextTick(() => {
        this.$refs.tabRef.doLayout();
      });
    },
    showRouteForm() {
      this.$refs.Routes.showForm();
    },
    batchUpdloadRoute() {
      this.$refs.Routes.batchUpdload();
    },
    showTermForm() {
      this.$refs.Term.showForm();
    },
    showStationForm() {
      this.$refs.Station.showForm();
    },
    batchUpdloadSation() {
      this.$refs.Station.batchUpdload();
    },
  },
};
</script>

<style lang="scss" scoped>
.tablelist {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
