<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t('schoolDoctor.规章制度') }}</div>
      <div class="community_top_btn">
        <el-button type="primary" @click="showModal('add')" size="medium">{{ $t('btn.新增') }}</el-button>
      </div>
    </div>
    <div class="community_centent_v2">
      <div class="search_body">
        <el-form class="search_form" :label-position="'top'" :inline="true" :model="searchFrom">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchFrom.schoolId" clearable :placeholder="$t('schoolDoctor.学校')">
                  <el-option :key="k" v-for="(i, k) in schoolSelectList" :label="schoolDropdownLabel(i)"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchFrom.type" clearable :placeholder="$t('schoolDoctor.类别')">
                  <el-option :label="$t('schoolDoctor.规章制度')" :value="1" />
                  <el-option :label="$t('schoolDoctor.知情同意')" :value="2" />
                  <el-option :label="$t('schoolDoctor.授权同意')" :value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchFrom.status" clearable :placeholder="$t('schoolDoctor.状态')">
                  <el-option :label="$t('schoolDoctor.启用')" :value="1" />
                  <el-option :label="$t('schoolDoctor.禁用')" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchFrom.keyword" :placeholder="$t('schoolDoctor.请输入文件名')" clearable @keyup.enter.native="getList" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="search_btn">
          <el-button type="primary" size="medium" @click="getList">{{ $t('btn.查询') }}</el-button>
          <el-button text bg size="medium" @click="clear">{{ $t('btn.重置') }}</el-button>
        </div>
      </div>

      <div class="isa_table">
        <Table ref="Table" :showSelection="true" :tableTitle="tableTitle" :tableData="tableData" :tableBtn="tableBtn"
          height="calc(100vh - 295px)" @playTab="playTab" @selection-change="handleSelectionChange" />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button :disabled="!selectedIds.length" size="mini" type="danger"
              @click="handleBatchDel">{{ $t('schoolDoctor.批量删除') }}</el-button>
          </div>
          <Pagination :total="paginationTotal" :pagination="pagination" @handleCurrentChange="handleCurrentChange" />
        </div>
      </div>
    </div>
    <!-- 详情弹窗（支持新增、编辑、查看） -->
    <Detail ref="Detail" :title="$t('schoolDoctor.规章制度')" @getList="getList" />
  </div>
</template>

<script>
import {
  delRegulation,
  getRegulationPage,
} from "@/api/isacommunity/regulation";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Table from "@/components/communitycommon/Table.vue";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import { mapGetters } from "vuex";
import Detail from "./detail.vue";

export default {
  name: "Regulation",
  components: { Table, Pagination, Detail },
  mixins: [schoolListBuscommonMixin],
  data() {
    return {
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      selectedIds: [],
    };
  },
  created() {
    this.initData();
  },
  activated() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
    tableTitle() {
      return [
        { label: "ID", prop: "id", width: "70", fixed: true },
        { label: this.$t("schoolDoctor.学校"), prop: "schoolName" },
        { label: this.$t("schoolDoctor.文件名"), prop: "fileName", minWidth: "180" },
        { label: this.$t("schoolDoctor.类别"), prop: "typeText", width: "120" },
        { label: this.$t("schoolDoctor.状态"), prop: "statusText", width: "100" },
        { label: this.$t("schoolDoctor.创建者"), prop: "creator" },
        { label: this.$t("schoolDoctor.创建时间"), prop: "createTime", width: "170" },
        { label: this.$t("schoolDoctor.更新时间"), prop: "updateTime", width: "170" },
      ];
    },
    tableBtn() {
      return [
        { name: "查看", type: "look", icon: "", permissions: "" },
        { name: "编辑", type: "edit", icon: "", permissions: "" },
      ];
    },
  },
  methods: {
    initData() {
      this.fetchSchoolListBuscommon();
      this.getList();
    },

    getList() {
      const params = { ...this.pagination, ...this.searchFrom };
      if (params.schoolId) {
        params.schoolIds = [params.schoolId];
        delete params.schoolId;
      }
      getRegulationPage(params).then((res) => {
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data || [];
          this.formatData();
        }
      });
    },

    formatData() {
      const typeMap = {
        1: this.$t("schoolDoctor.规章制度"),
        2: this.$t("schoolDoctor.知情同意"),
        3: this.$t("schoolDoctor.授权同意"),
      };
      const statusMap = { 1: this.$t("schoolDoctor.启用"), 0: this.$t("schoolDoctor.禁用") };
      this.tableData.forEach((item) => {
        item.fileName = item.attachmentName || item.cnTitle || item.name || "-";
        item.typeText = typeMap[item.type] || "-";
        item.statusText = statusMap[item.status] || "-";
      });
    },

    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id);
    },

    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.$refs.Detail.showModal("look", item);
          break;
        case "edit":
          this.$refs.Detail.showModal("edit", item);
          break;
      }
    },

    handleBatchDel() {
      if (!this.selectedIds.length) return;
      this.$confirm(this.$t("schoolDoctor.将永久删除勾选的内容确认删除"), this.$t("schoolDoctor.提示"), {
        confirmButtonText: this.$t("btn.确定"),
        cancelButtonText: this.$t("btn.取消"),
        type: "warning",
      }).then(() => {
        delRegulation(this.selectedIds).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolDoctor.删除成功"));
            this.selectedIds = [];
            this.getList();
          }
        });
      });
    },

    clear() {
      this.searchFrom = {};
      this.getList();
    },

    handleCurrentChange(page) {
      this.pagination.current = page;
      this.getList();
    },

    showModal(type = "add", item = {}) {
      this.$refs.Detail.showModal(type, item);
    },
  },
};
</script>

<style lang="scss" scoped></style>
