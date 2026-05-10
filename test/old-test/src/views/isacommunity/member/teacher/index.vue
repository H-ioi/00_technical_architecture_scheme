<template>
  <div class="isa_center_page">
    <div class="searchFromBox">
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item style="width: 180px" :label="$t('isagroup.关键词')">
          <el-input
            clearable
            style="width: 100%"
            v-model="searchFrom['keywordssearch']"
            :placeholder="$t('common.请输入')"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: 180px" :label="$t('isagroup.校区')">
          <el-select
            clearable
            style="width: 100%"
            v-model="searchFrom['schoolIds']"
            :placeholder="$t('common.请选择')"
          >
            <el-option
              :key="k"
              v-for="(i, k) in schoolList"
              :label="i.enName"
              :value="i.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px" :label="$t('isagroup.职位')">
          <el-select
            clearable
            style="width: 100%"
            v-model="searchFrom['role']"
            :placeholder="$t('common.请选择')"
          >
            <el-option
              :key="k"
              v-for="(i, k) in roleList"
              :label="i"
              :value="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px" :label="$t('isagroup.状态')">
          <el-select
            clearable
            style="width: 100%"
            v-model="searchFrom['archived']"
            :placeholder="$t('common.请选择')"
          >
            <el-option
              :key="k"
              v-for="(i, k) in consts['teacherStatus']"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: auto; margin-right: 0">
          <el-button type="primary" size="large" @click="getList">{{
            $t("btn.查询")
          }}</el-button>
          <el-button
            type="defult"
            size="large"
            icon="el-icon-refresh-right"
            @click="clear"
            >{{ $t("btn.重置") }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox">
      <span></span>
      <PaginationInfo :paginationTotal="paginationTotal" />
    </div>
    <div class="tablelist">
      <Table
        ref="Table"
        :showSelection="false"
        :tableTitle="tabletitle['teacherTable']"
        :tableData="tableData"
        :tableBtn="tableBtn"
        @playTab="playTab"
        @rowClick="rowClick"
      />
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <Detail
      ref="Detail"
      :title="$t('isagroup.教师详情')"
      :detailInfo="tabletitle['teacherTable']"
      :detailData="detailData"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSchoolList,
  getTeacherRoleList,
  getTeacherPage,
} from "@/api/isacommunity/merber.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Detail from "@/page/isacommunity/modal/detail.vue";
export default {
  name: "teacher",
  components: { Table, Pagination, PaginationInfo, Detail },
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
      tableBtn: [],
      permissionsBtn: [
        {
          name: "查看",
          type: "look",
          icon: "",
          permissions: "dataform_file_look",
        },
      ],
      schoolList: [],
      roleList: [],
      detailData: {},
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    initData() {
      this.getBtn();
      this.getSeclectList();
      this.getList();
    },
    getSeclectList() {
      getSchoolList({}).then((res) => {
        if (res.data.success) {
          this.schoolList = res.data.data;
        }
      });
      getTeacherRoleList({}).then((res) => {
        if (res.data.success) {
          this.roleList = res.data.data;
        }
      });
    },
    getList() {
      getTeacherPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getTeacherPage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.tableData.map((item) => {
            item["archived"] = this.$getListLabel(
              consts["teacherStatus"],
              item["archived"]
            );
          });
        }
      });
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          break;
      }
    },
    rowClick(row, column, event) {
      console.log("rowClick", row);
      //   this.$router.push("/isacommunity/member/teacher/detail?id=" + row.teacherIdInt);
      this.detailData = row;
      this.$refs["Detail"].showModal();
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
    getBtn() {
      this.tableBtn = this.permissionsBtn.filter((item) => {
        return this.permissions[item["permissions"]];
      });
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
