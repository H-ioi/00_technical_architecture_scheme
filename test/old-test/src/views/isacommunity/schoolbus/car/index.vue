<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("schoolbus.车辆管理") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['buscarinfo_import']"
          size="medium"
          @click="batchUpdload"
        >{{ $t("btn.导入") }}</el-button>
        <el-button
          v-if="permissions['buscarinfo_add']"
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
                  clearable
                  v-model="searchFrom.schoolIds"
                  :placeholder="$t('schoolbus.请选择学校')"
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
                  v-model="searchFrom.carNumber"
                  :placeholder="$t('schoolbus.车牌号')"
                  @keyup.enter.native="getList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input
                  clearable
                  v-model="searchFrom.driver"
                  :placeholder="$t('schoolbus.司机姓名')"
                  @keyup.enter.native="getList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input
                  clearable
                  v-model="searchFrom.carTeacher"
                  :placeholder="$t('schoolbus.跟车老师')"
                  @keyup.enter.native="getList"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="searchOpen" :span="6">
              <el-form-item>
                <el-select
                  clearable
                  v-model="searchFrom.status"
                  :placeholder="$t('schoolbus.状态')"
                >
                  <el-option
                    v-for="(i, k) in carStatusOptions"
                    :key="k"
                    :label="i18nlocel === 'en' ? i.enLabel : i.label"
                    :value="i.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
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
              v-if="permissions['buscarinfo_del']"
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
    </div>
    <Form ref="Form" @getList="getList" />
    <Detail ref="Detail" :title="$t('schoolbus.详情')" />
    <BatchUpdload ref="BatchUpdload" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCarinfoPage, delCarinfo, batchUpdateStatus } from "@/api/isacommunity/car.js";
import Table from "@/components/communitycommon/Table.vue";
import { BUS_CAR_STATUS } from "../schoolbusConsts.js";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "./modal/form.vue";
import Detail from "./modal/detail.vue";
import BatchUpdload from "./modal/batchupdload.vue";
import dayjs from "dayjs";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import schoolbusListPage from "../mixins/schoolbusListPage.js";

export default {
  name: "teacher",
  mixins: [schoolListBuscommonMixin, schoolbusListPage],
  components: { Table, Pagination, Form, Detail, BatchUpdload },
  data() {
    return {
      carStatusOptions: BUS_CAR_STATUS,
      pagination: { size: 10, current: 1 },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        { name: "查看", type: "look", icon: "", permissions: "" },
        { name: "编辑", type: "edit", icon: "", permissions: "buscarinfo_edit" },
      ],
      schoolId: "",
    };
  },
  created() {
    this.getBtn();
    this.initData();
  },
  activated() {
    this.getList();
  },
  watch: {
    i18nlocel() {
      this.formatData();
    },
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
    tableTitle() {
      return [
        { label: "ID", prop: "id", width: "70", fixed: true },
        { label: this.$t("schoolbus.校区"), prop: "schoolEnNames", minWidth: "140" },
        { label: this.$t("schoolbus.车牌号"), prop: "carNumber", width: "110" },
        { label: this.$t("schoolbus.跟车老师"), prop: "carTeacher", minWidth: "120" },
        { label: this.$t("schoolbus.绑定路线"), prop: "boundLineNamesLabel", minWidth: "160" },
        { label: this.$t("schoolbus.司机姓名"), prop: "driverName", width: "110" },
        { label: this.$t("schoolbus.座位数"), prop: "seatNumber", width: "80" },
        { label: this.$t("schoolbus.照片"), prop: "carImageUrl", width: "90", isUrl: true },
        { label: this.$t("schoolbus.状态"), prop: "statusLabel", width: "90" },
        { label: this.$t("schoolbus.创建时间"), prop: "createTime", width: "170" },
        { label: this.$t("schoolbus.更新时间"), prop: "updateTime", width: "170" },
      ];
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
      getCarinfoPage({ ...this.pagination, ...this.searchFrom }).then((res) => {
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
        item.driverName = item.driverInfo ? item.driverInfo.name : "--";
        item.boundLineNamesLabel = item.boundLineNames || "--";
        item.statusLabel = this.$getListLabel(BUS_CAR_STATUS, item.status);
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
        item.updateTime = dayjs(item.updateTime).format("YYYY-MM-DD HH:mm");
      });
    },
    playTab(name, item) {
      if (name === "look") this.rowClick(item);
      else if (name === "edit") this.showForm("edit", item);
    },
    batchUpdateStatus(status) {
      const selectionId = this.$refs.Table.selectionId;
      if (selectionId.length > 0) {
        const list = this.tableData.map((item) => {
          return item.status != status && selectionId.includes(item.id);
        });
        if (list.length > 0) {
          if (status) {
            this.$message.warning(
              this.$t("schoolbus.只有禁用状态可以修改启用状态，请重新选择")
            );
          } else {
            this.$message.warning(
              this.$t("schoolbus.只有启用状态可以修改禁用状态，请重新选择")
            );
          }
        } else {
          this.$alert(this.$t("schoolbus.确认修改吗"), this.$t("schoolbus.批量修改状态"), {
            confirmButtonText: this.$t("schoolbus.确定"),
          }).then(() => {
            batchUpdateStatus({ ids: selectionId, status }).then((res) => {
              if (res.data.success) {
                this.$message.success(this.$t("schoolbus.成功"));
                this.getList();
              }
            });
          });
        }
      }
    },
    delData() {
      this.confirmBatchDelete(() => {
        delCarinfo({ ids: this.selectedIds }).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolbus.成功"));
            this.getList();
          }
        });
      });
    },
    rowClick(row) {
      this.$refs.Detail.showModal(row);
    },
    clear() {
      this.searchFrom = {};
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
    showForm(type, item = {}) {
      this.$refs.Form.showForm(type, item);
    },
    batchUpdload() {
      this.$refs.BatchUpdload.showUpload = true;
    },
  },
};
</script>
