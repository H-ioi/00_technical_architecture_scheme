<template>
  <div>
    <div class="search_body">
      <el-form class="search_form" :label-position="'top'" :inline="true" :model="searchFrom">
        <el-row :gutter="10">
          <el-col v-if="schoolSelectList.length > 1" :span="6">
            <el-form-item>
              <el-select
                v-model="searchFrom.schoolIds"
                :placeholder="$t('schoolbus.请选择学校')"
                multiple
                @change="changeSchool"
              >
                <el-option
                  v-for="(i, k) in schoolSelectList"
                  :key="k"
                  :label="schoolDropdownLabel(i)"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select
                v-model="searchFrom.sectionId"
                :placeholder="$t('schoolbus.请选择学期')"
              >
                <el-option
                  v-for="(i, k) in selectSectionList"
                  :key="k"
                  :label="i18nlocel === 'en' ? i.enName : i.cnName"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select
                v-model="searchFrom.stationIds"
                :placeholder="$t('schoolbus.请选择站点')"
              >
                <el-option
                  v-for="(i, k) in selectStationList"
                  :key="k"
                  :label="i18nlocel === 'en' ? i.enName : i.cnName"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select
                v-model="searchFrom.visible"
                :placeholder="$t('schoolbus.状态')"
              >
                <el-option
                  v-for="(i, k) in visibleTypeOptions"
                  :key="k"
                  :label="i18nlocel === 'en' ? i.enLabel : i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="searchOpen">
            <el-col :span="6">
              <el-form-item>
                <el-input
                  clearable
                  v-model="searchFrom.lineName"
                  :placeholder="$t('schoolbus.输入路线名称')"
                  @keyup.enter.native="getList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input
                  clearable
                  v-model="searchFrom.carNumber"
                  :placeholder="$t('schoolbus.输入车牌号')"
                  @keyup.enter.native="getList"
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
            v-if="permissions['busline_batch_copy']"
            size="small"
            type="defult"
            plain
            @click="batchCopy"
          >{{ $t("schoolbus.复制路线") }}</el-button>
          <el-button
            v-if="permissions['busline_del']"
            :disabled="!selectedIds.length"
            size="mini"
            type="danger"
            @click="delData"
          >{{ $t("btn.删除") }}</el-button>
        </div>
        <Pagination
          :total="paginationTotal"
          :pagination="pagination"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>
    </div>
    <Detail ref="Detail" :title="$t('schoolbus.详情')" :detailInfo="tableTitle" />
    <BatchRoute ref="BatchRoute" @getList="getList" />
    <CopyRoute ref="CopyRoute" @getList="getList" :sectionList="sectionList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSectionList, getStationList } from "@/api/isacommunity/buscommon.js";
import { getRoutePage, delRoute } from "@/api/isacommunity/route.js";
import { BUS_ROUTE_TYPE, BUS_VISIBLE_TYPE } from "../../../schoolbusConsts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Detail from "../modal/routedetail.vue";
import { navigateToRouteForm } from "@/const/isacommunity/schoolbusRoutes.js";
import BatchRoute from "../modal/batchroute.vue";
import CopyRoute from "../modal/copyroute.vue";
import dayjs from "dayjs";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import schoolbusListPage from "../../../mixins/schoolbusListPage.js";

export default {
  name: "teacher",
  mixins: [schoolListBuscommonMixin, schoolbusListPage],
  components: { Table, Pagination, Detail, BatchRoute, CopyRoute },
  data() {
    return {
      schoolbusTabLayout: true,
      visibleTypeOptions: BUS_VISIBLE_TYPE,
      pagination: { size: 10, current: 1 },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        { name: "查看", type: "look", icon: "", permissions: "" },
        { name: "编辑", type: "edit", icon: "", permissions: "busline_edit" },
      ],
      sectionList: [],
      stationList: [],
      selectSectionList: [],
      selectStationList: [],
      schoolId: "",
    };
  },
  created() {
    this.getBtn();
  },
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
    tableTitle() {
      return [
        { label: "ID", prop: "id", width: "70", fixed: true },
        { label: this.$t("schoolbus.校区"), prop: "schoolEnNames", minWidth: "140" },
        { label: this.$t("schoolbus.路线"), prop: "showLineName", minWidth: "140" },
        { label: this.$t("schoolbus.路线类型"), prop: "lineTypeName", width: "100" },
        { label: this.$t("schoolbus.学期"), prop: "showSectionName", minWidth: "120" },
        { label: this.$t("schoolbus.状态"), prop: "visibleLabel", width: "90" },
        { label: this.$t("schoolbus.创建时间"), prop: "createTime", width: "170" },
        { label: this.$t("schoolbus.更新时间"), prop: "updateTime", width: "170" },
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
      await this.fetchSchoolListBuscommon();
      if (this.schoolSelectList.length === 1) {
        this.schoolId = this.schoolSelectList[0].id;
        this.pagination.schoolIds = this.schoolId;
      }
      this.getList();
      this.getSelectList();
    },
    async getSelectList() {
      this.sectionList = await getSectionList();
      this.stationList = await getStationList();
      if (this.schoolSelectList.length === 1) {
        this.changeSchool([this.schoolId]);
      }
    },
    getList() {
      getRoutePage({ ...this.pagination, ...this.searchFrom }).then((res) => {
        if (res.data.success) {
          const { data, total } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.forEach((item) => {
        this.applySchoolEnNamesFromIds(item);
        item.lineTypeName = this.$getListLabel(BUS_ROUTE_TYPE, item.lineType);
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
        item.updateTime = dayjs(item.updateTime).format("YYYY-MM-DD HH:mm");
        item.showLineName = this.i18nlocel == "en" ? item.enName : item.cnName;
        item.showSectionName =
          this.i18nlocel == "en" ? item.sectionEnName : item.sectionCnName;
        item.visibleLabel = this.$getListLabel(BUS_VISIBLE_TYPE, item.visible);
      });
    },
    playTab(name, item) {
      if (name === "look") this.rowClick(item);
      else if (name === "edit") this.showForm("edit", item);
    },
    delData() {
      this.confirmBatchDelete(() => {
        delRoute({ ids: this.selectedIds }).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolbus.成功"));
            this.getList();
          }
        });
      });
    },
    batchCopy() {
      if (this.selectedIds.length > 0) {
        this.$refs.CopyRoute.show(this.selectedIds);
      }
    },
    rowClick(row) {
      this.$refs.Detail.showModal(row);
    },
    clear() {
      this.pagination.current = 1;
      this.searchFrom = {};
      this.selectSectionList = [];
      this.selectStationList = [];
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
    showForm(type = "add", item = {}) {
      navigateToRouteForm(this.$router, type, item.id);
    },
    batchUpdload() {
      this.$refs.BatchRoute.showUpload = true;
    },
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
    },
  },
};
</script>
