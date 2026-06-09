<template>
  <div>
    <el-dialog
      :title="title"
      :visible="showDialog"
      width="85%"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="orderDetail" v-if="showDialog">
        <!-- <div class="orderDetail_content"> -->
        <div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                style="width: 25%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in orderBusFields"
                :key="index"
              >
                <span>{{ item.label }}</span>
                <span :title="$checkNull(baseInfo[item.prop])">{{
                  $checkNull(baseInfo[item.prop])
                }}</span>
              </div>
              <div
                v-if="baseInfo['approvalStatus'] == '2'"
                style="width: 100%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("schoolbus.拒绝理由") }}</span>
                <span :title="$checkNull(baseInfo['denyReason'])">{{
                  $checkNull(baseInfo["denyReason"])
                }}</span>
              </div>
              <div
                style="width: 100%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("schoolbus.签名") }}</span>
                <upload-file
                  style="margin-top: 15px"
                  ref="uploadFile"
                  :disabled="true"
                  :limit="1"
                  types="image/*"
                ></upload-file>
              </div>
            </div>
            <div
              style="padding-bottom: 0; padding-top: 0"
              class="orderDetail_baseinfo"
              v-if="
                baseInfo['approvalStatus'] == '1' &&
                permissions['isshow_bus_intentionorder_pay_info']
              "
            >
              <div
                style="width: 25%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in payInfoFields"
                :key="index"
              >
                <span>{{ item.label }}</span>
                <span :title="$checkNull(baseInfo[item.prop])">{{
                  $checkNull(baseInfo[item.prop])
                }}</span>
              </div>
            </div>
          </div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div style="width: 100%; margin-top: 15px">
                <div style="width: 100%">
                  <el-table
                    :header-cell-style="tableHeaderStyle"
                    :data="routeTableData"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(i, k) in bindRouteTableColumns"
                      :key="k"
                      :prop="i['prop']"
                      :label="i['label']"
                      show-overflow-tooltip
                      :width="`${i['width']}`"
                      :fixed="i['fixed']"
                    >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <div class="orderDetail_item" v-if="baseInfo['pickupMethod'] == '2'">
            <div class="orderDetail_baseinfo">
              <div style="width: 100%; margin-top: 15px">
                <div style="width: 100%">
                  <el-table
                    :header-cell-style="tableHeaderStyle"
                    :data="personTableData"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(i, k) in bindPersonTableColumns"
                      :key="k"
                      :prop="i['prop']"
                      :label="i['label']"
                      show-overflow-tooltip
                      :width="`${i['width']}`"
                      :fixed="i['fixed']"
                    >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getOrderDetail } from "@/api/isacommunity/busorder.js";
import {
  BUS_APPROVAL_STATUS,
  BUS_PAYMENT_STATUS,
  BUS_PICKUP_METHOD,
  BUS_PAYMENT_METHOD,
  BUS_STUDENT_LINE_TYPE,
  BUS_TABLE_STYLE,
  bindRouteTableColumns,
  bindPersonTableColumns,
} from "../../../schoolbusConsts.js";
import uploadFile from "@/components/communitycommon/uploadFile.vue";
import _ from "lodash";
// 引入 dayjs
import dayjs from "dayjs";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
export default {
  name: "detail",
  mixins: [schoolListBuscommonMixin],
  components: { uploadFile },
  props: {
    title: String,
  },
  data() {
    return {
      showDialog: false,
      baseInfo: {},
      personTableData: [],
      routeTableData: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["i18nlocel", "permissions"]),
    tableHeaderStyle() {
      return BUS_TABLE_STYLE.headercellstyle;
    },
    orderBusFields() {
      return [
        { label: "ID", prop: "id" },
        { label: this.$t("schoolbus.申请时间"), prop: "createTime" },
        { label: this.$t("schoolbus.申请状态"), prop: "approvalStatusLabel" },
        { label: this.$t("schoolbus.缴费状态"), prop: "paymentStatusLabel" },
        { label: this.$t("schoolbus.应缴金额"), prop: "amountDue" },
        { label: this.$t("schoolbus.校区"), prop: "schoolEnName" },
        { label: this.$t("schoolbus.学期"), prop: "showSectionName" },
        { label: this.$t("schoolbus.学号"), prop: "admissionNo" },
        { label: this.$t("schoolbus.姓名"), prop: "studentName" },
        { label: this.$t("schoolbus.年级"), prop: "studentGrade" },
        { label: this.$t("schoolbus.接送方式"), prop: "pickupMethodLabel" },
      ];
    },
    payInfoFields() {
      return [
        { label: this.$t("schoolbus.实缴金额"), prop: "paymentAmount" },
        { label: this.$t("schoolbus.缴费方式"), prop: "paymentMethodLabel" },
        { label: this.$t("schoolbus.缴费日期"), prop: "paymentDate" },
        { label: this.$t("schoolbus.缴费账号"), prop: "paymentAccount" },
        { label: this.$t("schoolbus.缴费单号"), prop: "paymentOrderNo" },
        { label: this.$t("schoolbus.收款账号"), prop: "receivingAccount" },
      ];
    },
    bindRouteTableColumns() {
      return bindRouteTableColumns(this);
    },
    bindPersonTableColumns() {
      return bindPersonTableColumns(this);
    },
  },
  methods: {
    async showModal(item) {
      await this.fetchSchoolListBuscommon();
      this.showDialog = true;
      this.$nextTick(() => {
        this.getDetail(item.id);
      });
    },
    closeModal() {
      this.baseInfo = {};
      this.personTableData = [];
      this.routeTableData = [];
      this.$refs.uploadFile.imageUrl = "";
      this.showDialog = false;
    },
    // 获取详情
    getDetail(id) {
      getOrderDetail(id).then(async (res) => {
        if (res.data.success) {
          let data = res.data.data;
          let {
            schoolId,
            sectionId,
            sectionCnName,
            sectionEnName,
            admissionNo,
            pickupMethod,
            studentName,
            studentGrade,
            amountDue,
            approvalStatus,
            denyReason,
            paymentStatus,
            signImageUrl,
            orderLines,
            parentInfos,
            createTime,
            paymentAmount,
            paymentMethod,
            paymentDate,
            paymentAccount,
            paymentOrderNo,
            receivingAccount,
          } = data;
          this.$nextTick(() => {
            this.baseInfo = {
              ...this.baseInfo,
              id,
              schoolEnName: this.schoolLabelById(schoolId) || "--",
              showSectionName: this.i18nlocel == "en" ? sectionEnName : sectionCnName,
              admissionNo,
              pickupMethod,
              pickupMethodLabel: this.$getListLabel(BUS_PICKUP_METHOD, pickupMethod),
              studentName,
              studentGrade,
              amountDue,
              approvalStatus,
              approvalStatusLabel: this.$getListLabel(
                BUS_APPROVAL_STATUS,
                approvalStatus
              ),
              denyReason,
              paymentStatus,
              paymentStatusLabel: this.$getListLabel(
                BUS_PAYMENT_STATUS,
                paymentStatus
              ),
              createTime: dayjs(createTime).format("YYYY-MM-DD HH:mm"),
              paymentAmount,
              paymentMethodLabel: this.$getListLabel(
                BUS_PAYMENT_METHOD,
                paymentMethod
              ),
              paymentDate,
              paymentAccount,
              paymentOrderNo,
              receivingAccount,
            };
            console.log("this.baseInfo", this.baseInfo);

            parentInfos = parentInfos ? parentInfos : [];
            this.personTableData = parentInfos.map((item) => {
              return {
                pickupRelationships: item.pickupRelationships,
                pickupPhone: item.pickupPhone,
                pickupImageUrl: item.pickupImageUrl,
              };
            });
            this.routeTableData = orderLines.map((item) => {
              return {
                lineId: item.lineId,
                stationId: item.stationId,
                studentLineType: String(item.studentLineType),
                ridingWeekDay: item.ridingWeekDay,
                ridingStartDay: item.ridingStartDay,
                ridingEndDay: item.ridingEndDay,
                ridingDay: [item.ridingStartDay, item.ridingEndDay],
                lineName: this.i18nlocel == "en" ? item.lineEnName : item.lineCnName,
                stationName:
                  this.i18nlocel == "en" ? item.stationEnName : item.stationCnName,
                lineTypeName: this.$getListLabel(
                  BUS_STUDENT_LINE_TYPE,
                  item.studentLineType
                ),
                carNumber: item.carinfoId
                  ? this.$getListLabel(
                      item.busLineDTO.carList,
                      item.carinfoId,
                      "carNumber",
                      "id"
                    )
                  : "",
              };
            });
            if (signImageUrl) {
              this.$nextTick(() => {
                this.$refs.uploadFile.imageUrl = signImageUrl;
              });
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
