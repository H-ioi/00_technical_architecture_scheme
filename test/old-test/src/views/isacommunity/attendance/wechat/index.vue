<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.微信OpenID") }}</div>
      <div class="community_top_btn">
        <!-- <el-button type="primary" size="large" @click="exportData">{{
          $t("btn.导出")
        }}</el-button> -->
      </div>
    </div>
    <div class="community_centent">
      <div class="community_searchFrom">
        <el-form
          class="df_align_center"
          :label-position="'top'"
          :inline="true"
          :model="searchFrom"
        >
          <el-form-item style="width: 180px">
            <el-select
              filterable
              clearable
              style="width: 100%"
              v-model="searchFrom['schoolIds']"
              :placeholder="$t('isagroup.请选择学校')"
            >
              <el-option
                :key="k"
                v-for="(i, k) in dictionary['school']"
                :label="i.enName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-input
              clearable
              style="width: 100%"
              v-model="searchFrom['admissionNo']"
              :placeholder="$t('isagroup.学号')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-input
              clearable
              style="width: 100%"
              v-model="searchFrom['nickname']"
              :placeholder="$t('isagroup.人员姓名')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-input
              clearable
              style="width: 100%"
              v-model="searchFrom['openId']"
              :placeholder="$t('isagroup.OpenID')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['status']"
              :placeholder="$t('isagroup.状态')"
            >
              <el-option
                :key="k"
                v-for="(i, k) in consts['wechatOpenidType']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-date-picker
              style="width: 100%"
              v-model="searchFrom['beginDate']"
              type="date"
              :placeholder="$t('isagroup.开始时间')"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-date-picker
              style="width: 100%"
              v-model="searchFrom['endDate']"
              type="date"
              :placeholder="$t('isagroup.结束时间')"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: auto; margin-right: 0">
            <el-button
              class="button_text"
              size="medium"
              type="text"
              icon="el-icon-refresh-right"
              @click="clear"
              >{{ $t("btn.重置") }}</el-button
            >
            <el-button size="medium" type="primary" @click="getList">{{
              $t("btn.查询")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="isa_table">
        <Table
          ref="Table"
          :showSelection="true"
          :tableTitle="tabletitle['wechatOpenidTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          :height="520"
          @playTab="playTab"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['archive_wx_openid']"
              type="primary"
              size="mini"
              @click="updateWechatOpenidStatus(1)"
              >{{ $t("isagroup.归档") }}</el-button
            >
            <el-button
              v-if="permissions['archive_wx_openid']"
              type="primary"
              size="mini"
              @click="updateWechatOpenidStatus(0)"
              >{{ $t("isagroup.使用") }}</el-button
            >
          </div>
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            :hasSizes="true"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
          />
        </div>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <Detail ref="Detail" :title="$t('isagroup.详情')" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getWechatOpenidPage,
  exportWechatOpenid,
  updateWechatOpenidStatus,
  getDepartmentList,
} from "@/api/isacommunity/attendance.js";
import { download } from "@/util/download.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Detail from "./modal/detail.vue";
import dayjs from "dayjs";
export default {
  name: "teacher",
  components: { Table, Pagination, Detail },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      tableBtn: [
        {
          name: "查看",
          type: "look",
          icon: "",
          permissions: "",
        },
      ],
      departmentList: [],
    };
  },
  async created() {
    this.getList();
  },
  mounted() {},
  activated() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel", "dictionary"]),
  },
  watch: {
    i18nlocel: {
      handler(newVal, oldVal) {
        this.formatData();
      },
    },
  },
  methods: {
    getList() {
      getWechatOpenidPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getVoteprogramPage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        // item["sendStatusLabel"] = this.$getListLabel(
        //   consts["successOrfail"],
        //   String(item["sendStatus"])
        // );
      });
    },
    exportData() {
      exportWechatOpenid(this.searchFrom).then((res) => {
        download(res.data, res.headers["content-disposition"]);
        this.$message({
          message: this.$t("isagroup.成功"),
          type: "success",
        });
      });
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          this.$refs["Detail"].showModal(item);
          break;
      }
    },
    updateWechatOpenidStatus(type) {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId.length == 0) {
        this.$message({
          message: this.$t("isagroup.请选择"),
          type: "warning",
        });
        return;
      }
      let data = new FormData();
      data.append("ids", selectionId);
      data.append("status", type);
      updateWechatOpenidStatus(data).then((res) => {
        if (res.data.success) {
          this.$message({
            message: this.$t("isagroup.成功"),
            type: "success",
          });
          this.getList();
        }
      });
      //   updateWechatOpenidStatus({
      //     ids: selectionId,
      //     status: type,
      //   }).then((res) => {
      //     if (res.data.success) {
      //       this.$message({
      //         message: this.$t("isagroup.成功"),
      //         type: "success",
      //       });
      //       this.getList();
      //     }
      //   });
    },
    clear() {
      this.searchFrom = {};
      this.getList();
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    handleSizeChange(size) {
      this.pagination["current"] = 1;
      this.pagination["size"] = size;
      this.getList();
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
