<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.申请意向管理") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['busorder_add']"
          type="primary"
          size="large"
          @click="showForm('add')"
          >{{ $t("btn.新增") }}</el-button
        >
        <el-button
          v-if="permissions['busorder_import_intention_order']"
          type="defult"
          size="large"
          @click="batchUpdload"
          >{{ $t("btn.导入") }}</el-button
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
          <el-form-item style="width: 120px">
            <el-select
              filterable
              style="width: 100%"
              v-model="searchFrom['approvalStatus']"
              :placeholder="$t('isagroup.审批状态')"
            >
              <el-option
                :key="i.value"
                v-for="(i, k) in consts['approvalStatus']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
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
          :tableTitle="tabletitle['applyStudentTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          @playTab="playTab"
          @rowClick="rowClick"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['busorder_batch_approve']"
              size="small"
              type="defult"
              plain
              @click="batchChangeStatus('Approve')"
              >{{ $t("isagroup.批量同意") }}</el-button
            >
            <el-button
              v-if="permissions['busorder_batch_deny']"
              size="small"
              type="defult"
              plain
              @click="batchChangeStatus('Reject')"
              >{{ $t("isagroup.批量拒绝") }}</el-button
            >
            <el-button
              v-if="permissions['busorder_batch_update_payment_status']"
              size="small"
              type="defult"
              plain
              @click="batchChangeStatus('Payment')"
              >{{ $t("isagroup.批量缴费") }}</el-button
            >
            <el-button
              v-if="permissions['busintentionorder_del']"
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
    <Form ref="Form" @getList="getList" formType="apply" />
    <!-- 详情弹窗 -->
    <Detail ref="Detail" :title="$t('isagroup.详情')" />
    <!-- 批量导入弹窗 -->
    <BatchUpdload ref="BatchUpdload" @getList="getList" />
    <!-- 批量拒绝 -->
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
  getPickupMethodList,
} from "@/api/isacommunity/buscommon.js";
import {
  getIntentionOrderPage,
  delIntentionOrder,
  batchApprove,
  batchDeny,
  batchUpdatePaymentStatus,
} from "@/api/isacommunity/busorder.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "./modal/form.vue";
import Detail from "./modal/detail.vue";
import BatchUpdload from "./modal/batchupdload.vue";
import Reject from "./modal/reject.vue";
// 引入 dayjs
import dayjs from "dayjs";
export default {
  name: "teacher",
  components: { Table, Pagination, Detail, Form, BatchUpdload, Reject },
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
      //   this.getBtn();
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
      getIntentionOrderPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getIntentionOrderPage", res.data.data);
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
    batchChangeStatus(type) {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length > 0) {
        let status = [];
        switch (type) {
          case "Payment":
            let ids = [];
            this.tableData.map((item) => {
              if (
                (item.approvalStatus != 1 || item.paymentStatus != 1) &&
                selectionId.includes(item.id)
              ) {
                ids.push(item.approvalStatus);
              }
            });
            if (ids.length > 0) {
              this.$message.warning(
                this.$t("isagroup.只有审核通过的未缴费订单才能修改，请重新选择")
              );
            } else {
              this.$alert(
                this.$t("isagroup.确定要缴费吗？"),
                this.$t("isagroup.批量缴费"),
                {
                  confirmButtonText: this.$t("isagroup.确定"),
                }
              ).then(() => {
                batchUpdatePaymentStatus({ ids: selectionId }).then((res) => {
                  if (res.data.success) {
                    this.$message.success(this.$t("isagroup.成功"));
                    this.getList();
                  }
                });
              });
            }

            break;
          case "Approve":
            this.tableData.map((item) => {
              if (
                !status.includes(item.approvalStatus) &&
                selectionId.includes(item.id)
              ) {
                status.push(item.approvalStatus);
              }
            });
            if (status.includes(1) || status.includes(2)) {
              this.$message.warning(
                this.$t("isagroup.只有全部为待审批数据可以修改，请重新选择")
              );
            } else {
              this.$alert(
                this.$t("isagroup.确定要同意吗？"),
                this.$t("isagroup.批量同意"),
                {
                  confirmButtonText: this.$t("isagroup.确定"),
                }
              ).then(() => {
                batchApprove({ ids: selectionId }).then((res) => {
                  if (res.data.success) {
                    this.$message.success(this.$t("isagroup.成功"));
                    this.getList();
                  }
                });
              });
            }
            break;
          case "Reject":
            this.tableData.map((item) => {
              if (
                !status.includes(item.approvalStatus) &&
                selectionId.includes(item.id)
              ) {
                status.push(item.approvalStatus);
              }
            });
            if (status.includes(1) || status.includes(2)) {
              this.$message.warning(
                this.$t("isagroup.只有全部为待审批数据可以修改，请重新选择")
              );
            } else {
              this.$refs.Reject.showForm(selectionId);
              //   this.$alert(
              //     this.$t("isagroup.确定要拒绝吗？"),
              //     this.$t("isagroup.批量拒绝"),
              //     {
              //       confirmButtonText: this.$t("isagroup.确定"),
              //     }
              //   ).then(() => {
              //     batchDeny({ ids: selectionId }).then((res) => {
              //       if (res.data.success) {
              //         this.$message.success(this.$t("isagroup.成功"));
              //         this.getList();
              //       }
              //     });
              //   });
            }
            break;
        }
      }
    },
    delData() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length > 0) {
        this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
          confirmButtonText: this.$t("isagroup.确定"),
        }).then(() => {
          delIntentionOrder({ ids: selectionId }).then((res) => {
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
