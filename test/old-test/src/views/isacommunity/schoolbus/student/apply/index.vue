<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("schoolbus.申请意向管理") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['busorder_import_intention_order']"
          size="medium"
          @click="batchUpdload"
        >{{ $t("btn.导入") }}</el-button>
        <el-button
          v-if="permissions['busorder_add']"
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
            <el-col :span="6">
              <el-form-item>
                <el-select
                  filterable
                  v-model="searchFrom.approvalStatus"
                  :placeholder="$t('schoolbus.审批状态')"
                >
                  <el-option
                    v-for="i in approvalStatusOptions"
                    :key="i.value"
                    :label="i18nlocel === 'en' ? i.enLabel : i.label"
                    :value="i.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
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
                  filterable
                  v-model="searchFrom.sectionId"
                  :placeholder="$t('schoolbus.请选择学期')"
                >
                  <el-option
                    v-for="i in selectSectionList"
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
            <template v-if="searchOpen">
              <el-col :span="6">
                <el-form-item>
                  <el-select
                    filterable
                    v-model="searchFrom.stationIds"
                    :placeholder="$t('schoolbus.请选择站点')"
                    multiple
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
                  <el-input
                    clearable
                    v-model="searchFrom.keyword"
                    :placeholder="$t('schoolbus.输入学号姓名')"
                    @keyup.enter.native="getList"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select
                    v-model="searchFrom.carInfoId"
                    :placeholder="$t('schoolbus.请选择车辆')"
                  >
                    <el-option
                      v-for="i in carinfoList"
                      :key="i.id"
                      :label="i.carNumber"
                      :value="i.id"
                    />
                  </el-select>
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
              v-if="permissions['busorder_batch_approve']"
              size="small"
              type="defult"
              plain
              @click="batchChangeStatus('Approve')"
            >{{ $t("schoolbus.批量同意") }}</el-button>
            <el-button
              v-if="permissions['busorder_batch_deny']"
              size="small"
              type="defult"
              plain
              @click="batchChangeStatus('Reject')"
            >{{ $t("schoolbus.批量拒绝") }}</el-button>
            <el-button
              v-if="permissions['busorder_batch_update_payment_status']"
              size="small"
              type="defult"
              plain
              @click="batchChangeStatus('Payment')"
            >{{ $t("schoolbus.批量缴费") }}</el-button>
            <el-button
              v-if="permissions['busintentionorder_del']"
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
    <Detail ref="Detail" :title="$t('schoolbus.详情')" />
    <BatchUpdload ref="BatchUpdload" @getList="getList" />
    <Reject ref="Reject" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSectionList,
  getStationList,
  getLineList,
  getCarinfoList,
} from "@/api/isacommunity/buscommon.js";
import {
  getIntentionOrderPage,
  delIntentionOrder,
  batchApprove,
  batchUpdatePaymentStatus,
} from "@/api/isacommunity/busorder.js";
import {
  BUS_APPROVAL_STATUS,
  BUS_PAYMENT_STATUS,
  BUS_PICKUP_METHOD,
} from "../../schoolbusConsts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Detail from "./modal/detail.vue";
import { navigateToStudentApplyForm } from "@/const/isacommunity/schoolbusRoutes.js";
import BatchUpdload from "./modal/batchupdload.vue";
import Reject from "./modal/reject.vue";
import dayjs from "dayjs";
import schoolbusListPage from "../../mixins/schoolbusListPage.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";

export default {
  name: "teacher",
  mixins: [schoolListBuscommonMixin, schoolbusListPage],
  components: { Table, Pagination, Detail, BatchUpdload, Reject },
  data() {
    return {
      approvalStatusOptions: BUS_APPROVAL_STATUS,
      pagination: { size: 10, current: 1 },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        { name: "查看", type: "look", icon: "", permissions: "" },
        { name: "编辑", type: "edit", icon: "", permissions: "busorder_edit" },
      ],
      sectionList: [],
      lineList: [],
      stationList: [],
      selectSectionList: [],
      selectLineList: [],
      selectStationList: [],
      carinfoList: [],
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
        { label: this.$t("schoolbus.申请时间"), prop: "createTime", width: "170" },
        { label: this.$t("schoolbus.申请状态"), prop: "approvalStatusLabel", width: "100" },
        { label: this.$t("schoolbus.缴费状态"), prop: "paymentStatusLabel", width: "100" },
        { label: this.$t("schoolbus.校区"), prop: "schoolEnName", minWidth: "140" },
        { label: this.$t("schoolbus.学期"), prop: "showSectionName", minWidth: "120" },
        { label: this.$t("schoolbus.学号"), prop: "admissionNo", width: "110" },
        { label: this.$t("schoolbus.姓名"), prop: "studentName", minWidth: "120" },
        { label: this.$t("schoolbus.年级"), prop: "studentGrade", width: "90" },
        { label: this.$t("schoolbus.路线"), prop: "showLineName", minWidth: "140" },
        { label: this.$t("schoolbus.站点"), prop: "showStationName", minWidth: "120" },
        { label: this.$t("schoolbus.接送方式"), prop: "pickupMethodLabel", width: "110" },
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
      this.getSeclectList();
      this.getList();
    },
    async getSeclectList() {
      this.sectionList = await getSectionList();
      this.lineList = await getLineList();
      this.stationList = await getStationList();
      this.carinfoList = await getCarinfoList();
      if (this.schoolSelectList.length === 1) {
        this.changeSchool([this.schoolId]);
      }
    },
    getList() {
      getIntentionOrderPage({ ...this.pagination, ...this.searchFrom }).then((res) => {
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
        this.applySchoolEnNameFromId(item);
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
        item.showLineName =
          this.i18nlocel == "en" ? item.buslineEnName : item.buslineCnName;
        item.showSectionName =
          this.i18nlocel == "en" ? item.sectionEnName : item.sectionCnName;
        item.showStationName =
          this.i18nlocel == "en" ? item.busStationEnName : item.busStationCnName;
        item.approvalStatusLabel = this.$getListLabel(
          BUS_APPROVAL_STATUS,
          item.approvalStatus
        );
        item.paymentStatusLabel = this.$getListLabel(
          BUS_PAYMENT_STATUS,
          item.paymentStatus
        );
        item.pickupMethodLabel = this.$getListLabel(
          BUS_PICKUP_METHOD,
          item.pickupMethod
        );
      });
    },
    playTab(name, item) {
      if (name === "look") this.rowClick(item);
      else if (name === "edit") this.showForm("edit", item);
    },
    batchChangeStatus(type) {
      const selectionId = this.$refs.Table.selectionId;
      if (selectionId.length > 0) {
        const status = [];
        switch (type) {
          case "Payment": {
            const ids = [];
            this.tableData.forEach((item) => {
              if (
                (item.approvalStatus != 1 || item.paymentStatus != 1) &&
                selectionId.includes(item.id)
              ) {
                ids.push(item.approvalStatus);
              }
            });
            if (ids.length > 0) {
              this.$message.warning(
                this.$t("schoolbus.只有审核通过的未缴费订单才能修改，请重新选择")
              );
            } else {
              this.$alert(
                this.$t("schoolbus.确定要缴费吗？"),
                this.$t("schoolbus.批量缴费"),
                { confirmButtonText: this.$t("schoolbus.确定") }
              ).then(() => {
                batchUpdatePaymentStatus({ ids: selectionId }).then((res) => {
                  if (res.data.success) {
                    this.$message.success(this.$t("schoolbus.成功"));
                    this.getList();
                  }
                });
              });
            }
            break;
          }
          case "Approve":
            this.tableData.forEach((item) => {
              if (
                !status.includes(item.approvalStatus) &&
                selectionId.includes(item.id)
              ) {
                status.push(item.approvalStatus);
              }
            });
            if (status.includes(1) || status.includes(2)) {
              this.$message.warning(
                this.$t("schoolbus.只有全部为待审批数据可以修改，请重新选择")
              );
            } else {
              this.$alert(
                this.$t("schoolbus.确定要同意吗？"),
                this.$t("schoolbus.批量同意"),
                { confirmButtonText: this.$t("schoolbus.确定") }
              ).then(() => {
                batchApprove({ ids: selectionId }).then((res) => {
                  if (res.data.success) {
                    this.$message.success(this.$t("schoolbus.成功"));
                    this.getList();
                  }
                });
              });
            }
            break;
          case "Reject":
            this.tableData.forEach((item) => {
              if (
                !status.includes(item.approvalStatus) &&
                selectionId.includes(item.id)
              ) {
                status.push(item.approvalStatus);
              }
            });
            if (status.includes(1) || status.includes(2)) {
              this.$message.warning(
                this.$t("schoolbus.只有全部为待审批数据可以修改，请重新选择")
              );
            } else {
              this.$refs.Reject.showForm(selectionId);
            }
            break;
        }
      }
    },
    delData() {
      this.confirmBatchDelete(() => {
        delIntentionOrder({ ids: this.selectedIds }).then((res) => {
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
      this.selectSectionList = [];
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
    showForm(type = "add", item = {}) {
      navigateToStudentApplyForm(this.$router, type, item.id);
    },
    batchUpdload() {
      this.$refs.BatchUpdload.showUpload = true;
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
