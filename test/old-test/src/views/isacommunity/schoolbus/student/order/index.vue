<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.乘车学生管理") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['busorder_add']"
          type="primary"
          size="large"
          @click="showForm('add')"
          >{{ $t("btn.新增") }}</el-button
        >
        <el-button
          v-if="permissions['busorder_import_order']"
          type="defult"
          size="large"
          @click="batchUpdload"
          >{{ $t("btn.导入") }}</el-button
        >
        <el-button
          v-if="permissions['busorder_export_order']"
          type="defult"
          size="large"
          @click="exportOrder"
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
          <el-form-item style="width: 120px" v-if="dictionary['school'].length > 1">
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
          <el-form-item style="width: 120px">
            <el-select
              filterable
              style="width: 100%"
              v-model="searchFrom['sectionId']"
              :placeholder="$t('isagroup.请选择学期')"
            >
              <el-option
                :key="i.id"
                v-for="(i, k) in selectSectionList"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-select
              filterable
              style="width: 100%"
              v-model="searchFrom['lineIds']"
              :placeholder="$t('isagroup.请选择路线')"
              multiple
            >
              <el-option
                :key="i.id"
                v-for="(i, k) in selectLineList"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-select
              filterable
              style="width: 100%"
              v-model="searchFrom['stationIds']"
              :placeholder="$t('isagroup.请选择站点')"
              multiple
            >
              <el-option
                :key="i.id"
                v-for="(i, k) in selectStationList"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-input
              clearable
              style="width: 100%"
              v-model="searchFrom['keyword']"
              :placeholder="$t('isagroup.输入学号姓名')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-select
              style="width: 100%"
              v-model="searchFrom['carInfoId']"
              :placeholder="$t('isagroup.请选择车辆')"
            >
              <el-option
                :key="i.id"
                v-for="(i, k) in carinfoList"
                :label="i.carNumber"
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
          :tableTitle="tabletitle['orderStudentTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          @playTab="playTab"
          @rowClick="rowClick"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['busorder_del']"
              size="small"
              type="danger"
              plain
              @click="delData"
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
    <Form ref="Form" @getList="getList" formType="order" />
    <!-- 详情弹窗 -->
    <Detail ref="Detail" :title="$t('isagroup.详情')" />
    <!-- 批量导入弹窗 -->
    <BatchUpdload ref="BatchUpdload" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSectionList,
  getStationList,
  getLineList,
  getCarinfoList,
  getPickupMethodList,
} from "@/api/isacommunity/buscommon.js";
import { getOrderPage, delOrder, exportOrder } from "@/api/isacommunity/busorder.js";
import { download } from "@/util/download.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "../apply/modal/form.vue";
import Detail from "../apply/modal/detail.vue";
import BatchUpdload from "./modal/batchupdload.vue";
// 引入 dayjs
import dayjs from "dayjs";
export default {
  name: "teacher",
  components: { Table, Pagination, Form, Detail, BatchUpdload },
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
      sectionList: [],
      lineList: [],
      stationList: [],
      selectSectionList: [],
      selectLineList: [],
      selectStationList: [],
      carinfoList: [],
      pickupMethodList: [],
      schoolId: "",
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
      if (this.dictionary["school"].length == 1) {
        this.schoolId = this.dictionary["school"][0].id;
        this.pagination["schoolIds"] = this.schoolId;
      }
      this.getSeclectList();
      this.getList();
    },
    async getSeclectList() {
      this.sectionList = await getSectionList();
      this.lineList = await getLineList();
      this.stationList = await getStationList();
      this.carinfoList = await getCarinfoList();
      if (this.dictionary["school"].length == 1) {
        this.changeSchool([this.schoolId]);
      }
    },
    getList() {
      getOrderPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getOrderPage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        item["createTime"] = dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm");
        item["showLineName"] =
          this.i18nlocel == "en" ? item["buslineEnName"] : item["buslineCnName"];
        item["showSectionName"] =
          this.i18nlocel == "en" ? item["sectionEnName"] : item["sectionCnName"];
        item["showStationName"] =
          this.i18nlocel == "en" ? item["busStationEnName"] : item["busStationCnName"];
        item["approvalStatusLabel"] = this.$getListLabel(
          consts["approvalStatus"],
          item.approvalStatus
        );
        item["paymentStatusLabel"] = this.$getListLabel(
          consts["paymentStatus"],
          item.paymentStatus
        );
        item["pickupMethodLabel"] = this.$getListLabel(
          consts["pickupMethod"],
          item.pickupMethod
        );
      });
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
    delData() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length == 0) {
      } else {
        this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
          confirmButtonText: this.$t("isagroup.确定"),
        }).then(() => {
          delOrder({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        });
      }
    },
    rowClick(row, column, event) {
      console.log("rowClick", row);
      this.$refs["Detail"].showModal(row);
    },
    clear() {
      this.searchFrom = {};
      this.selectSectionList = [];
      this.selectLineList = [];
      this.selectStationList = [];
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
    showForm(type, item = {}) {
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
    exportOrder() {
      let data = {
        ...this.pagination,
        ...this.searchFrom,
      };
      delete data["size"];
      delete data["current"];
      exportOrder(data).then((res) => {
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
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
