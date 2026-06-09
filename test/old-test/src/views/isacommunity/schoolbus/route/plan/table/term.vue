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
              <el-input
                clearable
                v-model="searchFrom.sectionName"
                :placeholder="$t('schoolbus.输入学期')"
                @keyup.enter.native="getList"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="search_btn">
        <el-button type="primary" size="medium" @click="getList">{{ $t("btn.查询") }}</el-button>
        <el-button text bg size="medium" @click="clear">{{ $t("btn.重置") }}</el-button>
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
            v-if="permissions['bussection_del']"
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
    <TermForm ref="TermForm" @getList="getList" />
    <Detail
      ref="Detail"
      :title="$t('schoolbus.详情')"
      :detailInfo="tableTitle"
      :detailData="detailData"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTermPage, delTerm } from "@/api/isacommunity/term.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import TermForm from "../modal/termform.vue";
import Detail from "@/page/isacommunity/modal/detail.vue";
import dayjs from "dayjs";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import schoolbusListPage from "../../../mixins/schoolbusListPage.js";

export default {
  name: "teacher",
  mixins: [schoolListBuscommonMixin, schoolbusListPage],
  components: { Table, Pagination, Detail, TermForm },
  data() {
    return {
      schoolbusTabLayout: true,
      pagination: { size: 10, current: 1 },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        { name: "查看", type: "look", icon: "", color: "", permissions: "" },
        { name: "编辑", type: "edit", icon: "", color: "", permissions: "bussection_edit" },
      ],
      detailData: {},
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
        { label: this.$t("schoolbus.学期"), prop: "showTermName", minWidth: "120" },
        { label: this.$t("schoolbus.申请开始时间"), prop: "intentStartDate", width: "170" },
        { label: this.$t("schoolbus.申请结束时间"), prop: "intentEndDate", width: "170" },
        { label: this.$t("schoolbus.服务开始时间"), prop: "serviceStartDate", width: "170" },
        { label: this.$t("schoolbus.服务结束时间"), prop: "serviceEndDate", width: "170" },
        { label: this.$t("schoolbus.创建时间"), prop: "createTime", width: "170" },
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
    },
    getList() {
      getTermPage({ ...this.pagination, ...this.searchFrom }).then((res) => {
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
        item.intentEndDate = dayjs(item.intentEndDate).format("YYYY-MM-DD");
        item.intentStartDate = dayjs(item.intentStartDate).format("YYYY-MM-DD");
        item.serviceEndDate = dayjs(item.serviceEndDate).format("YYYY-MM-DD");
        item.serviceStartDate = dayjs(item.serviceStartDate).format("YYYY-MM-DD");
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
        item.showTermName = this.i18nlocel == "en" ? item.enName : item.cnName;
      });
    },
    playTab(name, item) {
      switch (name) {
        case "look":
          this.rowClick(item);
          break;
        case "edit":
          this.showForm("edit", item);
          break;
        case "del":
          delTerm(item.id).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("schoolbus.成功"));
              this.getList();
            }
          });
          break;
      }
    },
    delData() {
      this.confirmBatchDelete(() => {
        delTerm({ ids: this.selectedIds }).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolbus.成功"));
            this.getList();
          }
        });
      });
    },
    rowClick(row) {
      this.detailData = row;
      this.$refs.Detail.showModal();
    },
    clear() {
      this.pagination.current = 1;
      this.searchFrom = {};
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
      this.$refs.TermForm.showForm(type, item);
    },
  },
};
</script>
