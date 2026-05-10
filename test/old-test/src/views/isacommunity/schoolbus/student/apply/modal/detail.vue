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
                v-for="(item, index) in tabletitle['orderBusTable']"
                :key="index"
              >
                <span>{{ $t("isagroup")[item.label] }}</span>
                <span :title="$checkNull(baseInfo[item.prop])">{{
                  $checkNull(baseInfo[item.prop])
                }}</span>
              </div>
              <div
                v-if="baseInfo['approvalStatus'] == '2'"
                style="width: 100%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.拒绝理由") }}</span>
                <span :title="$checkNull(baseInfo['denyReason'])">{{
                  $checkNull(baseInfo["denyReason"])
                }}</span>
              </div>
              <div
                style="width: 100%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.签名") }}</span>
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
                v-for="(item, index) in tabletitle['payInfo']"
                :key="index"
              >
                <span>{{ $t("isagroup")[item.label] }}</span>
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
                    :header-cell-style="consts['tablestyle']['headercellstyle']"
                    :data="routeTableData"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(i, k) in tabletitle['bindRouteTable']"
                      :key="k"
                      :prop="i['prop']"
                      :label="i['hasEn'] ? $t('isagroup')[i['label']] : i['label']"
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
                    :header-cell-style="consts['tablestyle']['headercellstyle']"
                    :data="personTableData"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(i, k) in tabletitle['bindPersonTable']"
                      :key="k"
                      :prop="i['prop']"
                      :label="i['hasEn'] ? $t('isagroup')[i['label']] : i['label']"
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
import consts from "@/const/isacommunity/consts.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import Table from "@/components/communitycommon/Table.vue";
import uploadFile from "@/components/communitycommon/uploadFile.vue";
import _ from "lodash";
// 引入 dayjs
import dayjs from "dayjs";
export default {
  name: "detail",
  components: { uploadFile },
  props: {
    title: String,
  },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      showDialog: false,
      baseInfo: {},
      personTableData: [],
      routeTableData: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["i18nlocel", "dictionary", "permissions"]),
  },
  methods: {
    showModal(item) {
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
              schoolEnName: this.$getListLabel(
                this.dictionary["school"],
                schoolId,
                "enName",
                "id"
              ),
              showSectionName: this.i18nlocel == "en" ? sectionEnName : sectionCnName,
              admissionNo,
              pickupMethod,
              pickupMethodLabel: this.$getListLabel(consts["pickupMethod"], pickupMethod),
              studentName,
              studentGrade,
              amountDue,
              approvalStatus,
              approvalStatusLabel: this.$getListLabel(
                consts["approvalStatus"],
                approvalStatus
              ),
              denyReason,
              paymentStatus,
              paymentStatusLabel: this.$getListLabel(
                consts["paymentStatus"],
                paymentStatus
              ),
              createTime: dayjs(createTime).format("YYYY-MM-DD HH:mm"),
              paymentAmount,
              paymentMethodLabel: this.$getListLabel(
                consts["paymentMethod"],
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
                  consts["studentLineType"],
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
