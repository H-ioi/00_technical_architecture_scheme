<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("schoolbus.路线运营") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['busoperation_import']"
          size="medium"
          @click="batchUpdload"
        >{{ $t("btn.导入") }}</el-button>
        <el-button
          v-if="permissions['busoperation_export']"
          size="medium"
          @click="exportData"
        >{{ $t("btn.导出") }}</el-button>
        <el-button
          v-if="permissions['busoperation_add']"
          type="primary"
          size="medium"
          @click="showForm('add')"
        >{{ $t("btn.新增") }}</el-button>
      </div>
    </div>
    <div class="community_centent_v2">
      <div class="search_body">
        <el-form class="search_form" :label-position="'top'" :inline="true" :model="searchFrom">
          <el-row :gutter="10">
            <el-col v-if="schoolSelectList.length > 1" :span="6">
              <el-form-item>
                <el-select
                  filterable
                  v-model="searchFrom.schoolIds"
                  :placeholder="$t('schoolbus.请选择学校')"
                  multiple
                  @change="changeSchool"
                >
                  <el-option
                    v-for="i in schoolSelectList"
                    :key="i.id"
                    :label="schoolDropdownLabel(i)"
                    :value="i.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select
                  v-model="searchFrom.lineIds"
                  :placeholder="$t('schoolbus.请选择路线')"
                  multiple
                >
                  <el-option
                    v-for="i in selectLineList"
                    :key="i.id"
                    :label="i18nlocel === 'en' ? i.enName : i.cnName"
                    :value="i.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select
                  filterable
                  v-model="searchFrom.stationId"
                  :placeholder="$t('schoolbus.请选择站点')"
                >
                  <el-option
                    v-for="i in selectStationList"
                    :key="i.id"
                    :label="i18nlocel === 'en' ? i.enName : i.cnName"
                    :value="i.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select
                  v-model="searchFrom.status"
                  :placeholder="$t('schoolbus.状态')"
                >
                  <el-option
                    v-for="i in operationStatusOptions"
                    :key="i.value"
                    :label="i18nlocel === 'en' ? i.enLabel : i.label"
                    :value="i.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="searchOpen">
              <el-col :span="6">
                <el-form-item>
                  <el-date-picker
                    v-model="searchFrom.rideDateStart"
                    type="date"
                    :placeholder="$t('schoolbus.开始时间')"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-date-picker
                    v-model="searchFrom.rideDateEnd"
                    type="date"
                    :placeholder="$t('schoolbus.结束时间')"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
        <div class="search_btn">
          <el-button type="primary" size="medium" @click="getList">{{ $t("btn.查询") }}</el-button>
          <el-button text bg size="medium" @click="clear">{{ $t("btn.重置") }}</el-button>
          <span class="open" @click="searchOpen = !searchOpen">
            {{ searchOpen ? $t("schoolbus.收起") : $t("schoolbus.展开") }}
          </span>
        </div>
      </div>

      <div class="isa_table">
        <Table
          ref="Table"
          :showSelection="true"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :tableBtn="tableBtn"
          :height="schoolbusTableHeight"
          @playTab="playTab"
          @rowClick="rowClick"
          @selection-change="handleSelectionChange"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['busoperation_del']"
              :disabled="!selectedIds.length"
              size="mini"
              type="danger"
              @click="batchChange('del')"
            >{{ $t("btn.删除") }}</el-button>
          </div>
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <Form ref="Form" @getList="getList" />
    <Detail ref="Detail" :title="$t('schoolbus.详情')" />
    <BatchUpdload ref="BatchUpdload" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getStationList, getLineList } from "@/api/isacommunity/buscommon.js";
import {
  getOperationPage,
  delOperation,
  exportOperation,
} from "@/api/isacommunity/busoperation.js";
import { download } from "@/util/download.js";
import { BUS_OPERATION_STATUS } from "../../schoolbusConsts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "./modal/form.vue";
import Detail from "./modal/detail.vue";
import BatchUpdload from "./modal/batchupdload.vue";
import dayjs from "dayjs";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import schoolbusListPage from "../../mixins/schoolbusListPage.js";

export default {
  name: "teacher",
  mixins: [schoolListBuscommonMixin, schoolbusListPage],
  components: { Table, Pagination, Detail, Form, BatchUpdload },
  data() {
    return {
      operationStatusOptions: BUS_OPERATION_STATUS,
      pagination: { size: 10, current: 1 },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        { name: "查看", type: "look", icon: "", permissions: "" },
        { name: "编辑", type: "edit", icon: "", permissions: "busoperation_edit" },
      ],
      lineList: [],
      stationList: [],
      selectLineList: [],
      selectStationList: [],
      schoolId: "",
    };
  },
  created() {
    this.getBtn();
    this.initData();
  },
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
    tableTitle() {
      return [
        { label: "ID", prop: "id", width: "70", fixed: true },
        { label: this.$t("schoolbus.状态"), prop: "statusLabel", width: "90" },
        { label: this.$t("schoolbus.实际状态"), prop: "arrivalStatusLabel", width: "100" },
        { label: this.$t("schoolbus.校区"), prop: "schoolEnNames", minWidth: "140" },
        { label: this.$t("schoolbus.学期"), prop: "sectionName", minWidth: "120" },
        { label: this.$t("schoolbus.车牌号"), prop: "carNumber", width: "110" },
        { label: this.$t("schoolbus.跟车老师"), prop: "carTeacher", minWidth: "120" },
        { label: this.$t("schoolbus.路线"), prop: "lineName", minWidth: "120" },
        { label: this.$t("schoolbus.站点"), prop: "stationName", minWidth: "120" },
        { label: this.$t("schoolbus.乘车日期"), prop: "rideDate", width: "120" },
        { label: this.$t("schoolbus.到达时间"), prop: "arrivalTime", width: "170" },
        { label: this.$t("schoolbus.创建时间"), prop: "createTime", width: "170" },
        { label: this.$t("schoolbus.更新时间"), prop: "updateTime", width: "170" },
        { label: this.$t("schoolbus.备注"), prop: "remark", minWidth: "120" },
      ];
    },
  },
  watch: {
    i18nlocel() {
      this.formatData();
    },
  },
  methods: {
    async initData() {
      this.getBtn();
      await this.fetchSchoolListBuscommon();
      if (this.schoolSelectList.length === 1) {
        this.pagination.schoolIds = this.schoolSelectList[0].id;
      }
      this.getList();
      this.getSeclectList();
    },
    async getSeclectList() {
      this.lineList = await getLineList();
      this.stationList = await getStationList();
      if (this.schoolSelectList.length === 1) {
        this.changeSchool(this.pagination.schoolIds);
      }
    },
    getList() {
      getOperationPage({ ...this.pagination, ...this.searchFrom }).then((res) => {
        if (res.data.success) {
          const { total, data } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.forEach((item) => {
        this.applySchoolEnNamesFromIds(item);
        item.sectionName =
          this.i18nlocel === "en" ? item.sectionEnName : item.sectionCnName;
        item.statusLabel = this.$getListLabel(BUS_OPERATION_STATUS, item.status);
        item.arrivalStatusLabel = this.$getListLabel(
          BUS_OPERATION_STATUS,
          item.arrivalStatus
        );
        item.rideDate = item.rideDate
          ? dayjs(item.rideDate).format("YYYY-MM-DD")
          : "--";
        item.arrivalTime = item.arrivalTime
          ? dayjs(item.arrivalTime).format("YYYY-MM-DD HH:mm")
          : "--";
        item.createTime = item.createTime
          ? dayjs(item.createTime).format("YYYY-MM-DD HH:mm")
          : "--";
        item.updateTime = item.updateTime
          ? dayjs(item.updateTime).format("YYYY-MM-DD HH:mm")
          : "--";
      });
    },
    playTab(name, item) {
      if (name === "look") this.rowClick(item);
      else if (name === "edit") this.showForm("edit", item);
    },
    batchChange(type) {
      if (type === "del") {
        this.confirmBatchDelete(() => {
          delOperation({ ids: this.selectedIds }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("schoolbus.成功"));
              this.getList();
            }
          });
        });
      }
    },
    exportData() {
      const data = { ...this.pagination, ...this.searchFrom };
      delete data.size;
      delete data.current;
      exportOperation(data).then((res) => {
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    rowClick(row) {
      this.$refs.Detail.showModal(row);
    },
    clear() {
      this.searchFrom = {};
      this.selectLineList = [];
      this.selectStationList = [];
      this.pagination.current = 1;
      this.getList();
    },
    handleCurrentChange(page) {
      this.pagination.current = page;
      this.getList();
    },
    getBtn() {
      this.tableBtn = this.permissionsBtn.filter(
        (item) => this.permissions[item.permissions] || item.type === "look"
      );
    },
    showForm(type = "look", item = {}) {
      this.$refs.Form.showForm(type, item);
    },
    batchUpdload() {
      this.$refs.BatchUpdload.showUpload = true;
    },
    changeSchool(e) {
      const selectedSchoolIds = new Set(e);
      this.selectLineList = this.lineList.filter((item) => {
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
    },
  },
};
</script>
