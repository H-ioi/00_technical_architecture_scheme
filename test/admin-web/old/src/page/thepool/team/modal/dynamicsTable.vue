<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.查看')"
      :visible.sync="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="tableBox" style="padding: 10px">
        <Table
          ref="Table"
          :showSelection="false"
          :tableTitle="consult['teamDynamicsTitle']"
          :tableData="teamDynamics"
          :tableBtn="[]"
        />
        <div class="df_sb palyTableBox" style="padding: 0">
          <PaginationInfo
            v-if="teamDynamicsTotal > 10"
            :paginationTotal="Number(teamDynamicsTotal)"
          />
          <Pagination
            :total="Number(teamDynamicsTotal)"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTeamDynamics } from "@/api/consult/team.js";
import { consult } from "@/const/consult/index.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
export default {
  name: "guardians",
  components: {
    Pagination,
    PaginationInfo,
    Table,
  },
  props: {
    teamId: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      type: "add",
      consult: consult,
      showModal: false,
      pagination: {
        size: 10,
        current: 1,
      },
      teamDynamics: [],
      teamDynamicsTotal: 0,
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    async initModal() {
      this.type = "add";
      this.showModal = true;
      this.getTeamDynamics();
    },
    getTeamDynamics() {
      getTeamDynamics({
        teamId: this.teamId,
        pageSize: this.pagination.size,
        pageNum: this.pagination.current,
      }).then((res) => {
        console.log("getTeamDynamics", res);
        if (res.data.success) {
          let { pageNum, pageSize, total, data } = res.data.data;
          this.teamDynamicsTotal = total;
          this.teamDynamics = data;
          this.teamDynamics.map((item) => {
            item.createTime = item.createTime.substring(0, 16);
          });
        }
      });
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getTeamDynamics();
    },
    closeModal() {
      this.showModal = false;
      this.teamDynamicsTotal = 0;
      this.teamDynamics = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
