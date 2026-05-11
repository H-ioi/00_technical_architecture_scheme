<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.跟车老师") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['teacheruser_add']"
          type="primary"
          size="large"
          @click="showForm('add')"
          >{{ $t("btn.新增") }}</el-button
        >
        <el-button
          v-if="permissions['teacheruser_import']"
          type="defult"
          size="large"
          @click="batchUpdload"
          >{{ $t("btn.导入") }}</el-button
        >
        <el-button
          v-if="permissions['teacheruser_export']"
          type="defult"
          size="large"
          @click="exportData"
          >{{ $t("btn.导出") }}</el-button
        >
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
          <el-form-item style="width: 240px">
            <el-input
              clearable
              style="width: 100%"
              v-model="searchFrom['keyword']"
              :placeholder="$t('isagroup.关键词')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 240px" v-if="dictionary['school'].length > 1">
            <el-select
              filterable
              style="width: 100%"
              v-model="searchFrom['schoolIds']"
              :placeholder="$t('isagroup.请选择学校')"
              multiple
              @change="changeSchool"
            >
              <el-option
                :key="i.id"
                v-for="(i, k) in dictionary['school']"
                :label="i.enName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: auto; margin-right: 0">
            <el-button
              style="color: #2a3f54 !important"
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
          :tableTitle="tabletitle['followTeacherTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          @playTab="playTab"
          @rowClick="rowClick"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['teacheruser_enble']"
              size="small"
              plain
              @click="batchChange('enable')"
              >{{ $t("btn.启用") }}</el-button
            >
            <el-button
              v-if="permissions['teacheruser_disable']"
              size="small"
              plain
              @click="batchChange('disable')"
              >{{ $t("btn.禁用") }}</el-button
            >
            <el-button
              v-if="permissions['teacheruser_del']"
              size="small"
              type="danger"
              plain
              @click="batchChange('del')"
              >{{ $t("btn.删除") }}</el-button
            >
          </div>
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增编辑弹窗 -->
    <Form ref="Form" @getList="getList" />
    <!-- 详情弹窗 -->
    <Detail ref="Detail" :title="$t('isagroup.详情')" />
    <!-- 批量导入弹窗 -->
    <BatchUpdload ref="BatchUpdload" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getTeacherPage,
  delTeacher,
  batchEnable,
  batchDisabled,
  exportTeacher,
} from "@/api/isacommunity/user.js";
import { download } from "@/util/download.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "./modal/form.vue";
import Detail from "./modal/detail.vue";
import BatchUpdload from "./modal/batchupdload.vue";
// 引入 dayjs
import dayjs from "dayjs";

const MODULE_OPTIONS = [
  { id: 1, label: "校巴", enLabel: "School Bus" },
  { id: 2, label: "活动", enLabel: "Activity" },
];

const ROLE_OPTIONS = [
  { id: 1, label: "校巴运营", enLabel: "School Bus Operation" },
  { id: 2, label: "跟车老师", enLabel: "Car Teacher" },
  { id: 3, label: "活动签到", enLabel: "Activity Check-in" },
];
export default {
  name: "teacher",
  components: { Table, Pagination, Detail, Form, BatchUpdload },
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
          permissions: "",
        },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "busorder_edit",
        },
      ],
    };
  },
  created() {
    this.getBtn();
    this.initData();
  },
  mounted() {},
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
  },
  watch: {
    i18nlocel() {
      this.formatData();
    },
  },
  methods: {
    initData() {
      //   this.getBtn();
      if (this.dictionary["school"].length == 1) {
        this.pagination["schoolIds"] = this.dictionary["school"][0].id;
      }
      this.getList();
    },
    getList() {
      getTeacherPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getTeacherPage", res.data.data);
          let { total, records } = res.data.data;
          this.paginationTotal = total;
          this.tableData = records;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        item["schoolLabel"] = this.$getListLabel(
          this.dictionary["school"],
          item["school"],
          "enName",
          "id"
        );
        item["statusLabel"] = this.$getListLabel(consts["statusType"], item["status"]);
        item["modulesLabel"] = this.formatOptionLabels(item["modules"], MODULE_OPTIONS);
        item["rolesLabel"] = this.formatOptionLabels(item["roles"], ROLE_OPTIONS);
        item["lastLoginTime"] = item["lastLoginTime"]
          ? dayjs(item["lastLoginTime"]).format("YYYY-MM-DD HH:mm")
          : "--";
        item["createTime"] = item["createTime"]
          ? dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm")
          : "--";
      });
    },
    formatOptionLabels(ids, options) {
      if (!Array.isArray(ids) || ids.length === 0) return "--";
      const labelList = options
        .filter((item) => ids.includes(item.id))
        .map((item) => (this.i18nlocel == "en" ? item.enLabel : item.label));
      return labelList.length > 0 ? labelList.join(" / ") : "--";
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          this.rowClick(item);
          break;
        case "edit":
          this.showForm("edit", item);
          break;
      }
    },
    batchChange(type) {
      let selectionId = this.$refs.Table.selectionId;
      switch (type) {
        case "del":
          if (selectionId.length > 0) {
            this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
              confirmButtonText: this.$t("isagroup.确定"),
            }).then(() => {
              delTeacher({ ids: selectionId }).then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t("isagroup.成功"));
                  this.getList();
                }
              });
            });
          }
          break;
        case "enable":
          if (selectionId.length > 0) {
            this.$alert(this.$t("isagroup.确定要启用吗？"), this.$t("isagroup.启用"), {
              confirmButtonText: this.$t("isagroup.确定"),
            }).then(() => {
              batchEnable({ ids: String(selectionId) }).then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t("isagroup.成功"));
                  this.getList();
                }
              });
            });
          }
          break;
        case "disable":
          if (selectionId.length > 0) {
            this.$alert(this.$t("isagroup.确定要禁用吗？"), this.$t("isagroup.禁用"), {
              confirmButtonText: this.$t("isagroup.确定"),
            }).then(() => {
              batchDisabled({ ids: String(selectionId) }).then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t("isagroup.成功"));
                  this.getList();
                }
              });
            });
          }
          break;
      }
    },
    exportData() {
      let data = {
        ...this.pagination,
        ...this.searchFrom,
      };
      delete data["size"];
      delete data["current"];
      exportTeacher(data).then((res) => {
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    rowClick(row, column, event) {
      this.$refs["Detail"].showModal(row);
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
        return this.permissions[item["permissions"]] || item["type"] == "look";
      });
    },
    showForm(type = "look", item = {}) {
      console.log("111showForm", type);
      this.$refs.Form.showForm(type, item);
    },
    batchUpdload() {
      this.$refs.BatchUpdload.showUpload = true;
    },
    // 选择校区
    changeSchool(e) {
      const selectedSchoolIds = new Set(e);
      this.selectSectionList = this.sectionList.filter((item) => {
        if (Array.isArray(item.schoolIds)) {
          return item.schoolIds.some((id) => selectedSchoolIds.has(id));
        }
        return selectedSchoolIds.has(item.schoolIds);
      });
      this.selectStationList = this.stationList.filter((item) => {
        if (Array.isArray(item.schoolIds)) {
          return item.schoolIds.some((id) => selectedSchoolIds.has(id));
        }
        return selectedSchoolIds.has(item.schoolIds);
      });
      this.selectLineList = this.lineList.filter((item) => {
        if (Array.isArray(item.schoolIds)) {
          return item.schoolIds.some((id) => selectedSchoolIds.has(id));
        }
        return selectedSchoolIds.has(item.schoolIds);
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
