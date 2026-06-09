<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("schoolbus.路线规划") }}</div>
      <div class="community_top_btn" v-if="activeName == 'route'">
        <el-button
          v-if="permissions['busline_add']"
          type="primary"
          size="medium"
          @click="showRouteForm"
        >{{ $t("schoolbus.新增路线") }}</el-button>
        <el-button
          v-if="permissions['busline_import']"
          size="medium"
          @click="batchUpdloadRoute"
        >{{ $t("btn.导入") }}</el-button>
      </div>
      <div class="community_top_btn" v-if="activeName == 'bussection'">
        <el-button
          v-if="permissions['bussection_add']"
          type="primary"
          size="medium"
          @click="showTermForm"
        >{{ $t("schoolbus.新增学期") }}</el-button>
      </div>
      <div class="community_top_btn" v-if="activeName == 'station'">
        <el-button
          v-if="permissions['busstation_add']"
          type="primary"
          size="medium"
          @click="showStationForm"
        >{{ $t("schoolbus.新增站点") }}</el-button>
        <el-button
          v-if="permissions['busstation_import']"
          size="medium"
          @click="batchUpdloadSation"
        >{{ $t("btn.导入") }}</el-button>
      </div>
    </div>
    <div class="community_centent_v2">
      <div class="community_tabs">
        <el-tabs ref="tabRef" v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('schoolbus.全部路线')" name="route">
            <Routes ref="Routes" />
          </el-tab-pane>
          <el-tab-pane :label="$t('schoolbus.学期配置')" name="bussection">
            <Term ref="Term" />
          </el-tab-pane>
          <el-tab-pane :label="$t('schoolbus.站点配置')" name="station">
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
  mounted() {
    this.$nextTick(() => {
      this.syncActiveTabData();
    });
  },
  activated() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    syncActiveTabData() {
      const refMap = {
        route: "Routes",
        bussection: "Term",
        station: "Station",
      };
      const refName = refMap[this.activeName];
      const comp = refName && this.$refs[refName];
      if (comp && typeof comp.initData === "function") {
        comp.initData();
      }
    },
    handleTabClick(tab) {
      this.activeName = tab.name;
      this.$nextTick(() => {
        const tr = this.$refs.tabRef;
        if (tr && typeof tr.doLayout === "function") {
          tr.doLayout();
        }
        this.syncActiveTabData();
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
