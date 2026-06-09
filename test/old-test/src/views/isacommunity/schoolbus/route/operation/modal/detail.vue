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
        <div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                :style="`width: ${item.width ? item.width : '25%'}; margin-bottom: 15px`"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in detailFields"
                :key="index"
              >
                <span>{{ item.label }}</span>
                <span :title="$checkNull(baseInfo[item.prop])">{{
                  $checkNull(baseInfo[item.prop])
                }}</span>
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
import { getOperationDetail } from "@/api/isacommunity/busoperation.js";
import { BUS_OPERATION_STATUS } from "../../../schoolbusConsts.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import dayjs from "dayjs";
export default {
  name: "detail",
  mixins: [schoolListBuscommonMixin],
  props: {
    title: String,
  },
  data() {
    return {
      showDialog: false,
      baseInfo: {},
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "permissions"]),
    detailFields() {
      return [
        { label: "ID", prop: "id" },
        { label: this.$t("schoolbus.状态"), prop: "statusLabel" },
        { label: this.$t("schoolbus.实际状态"), prop: "arrivalStatusLabel" },
        { label: this.$t("schoolbus.校区"), prop: "schoolEnNames" },
        { label: this.$t("schoolbus.学期"), prop: "sectionName" },
        { label: this.$t("schoolbus.车牌号"), prop: "carNumber" },
        { label: this.$t("schoolbus.跟车老师"), prop: "carTeacher" },
        { label: this.$t("schoolbus.路线"), prop: "lineName" },
        { label: this.$t("schoolbus.站点"), prop: "stationName" },
        { label: this.$t("schoolbus.乘车日期"), prop: "rideDate" },
        { label: this.$t("schoolbus.到达时间"), prop: "arrivalTime" },
        { label: this.$t("schoolbus.创建时间"), prop: "createTime" },
        { label: this.$t("schoolbus.更新时间"), prop: "updateTime" },
        { label: this.$t("schoolbus.备注"), prop: "remark", width: "100%" },
      ];
    },
  },
  methods: {
    async showModal(item) {
      await this.fetchSchoolListBuscommon();
      this.showDialog = true;
      this.getDetail(item.id);
    },
    closeModal() {
      this.baseInfo = {};
      this.showDialog = false;
    },
    getDetail(id) {
      getOperationDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            rideDate,
            arrivalTime,
            sectionEnName,
            sectionCnName,
            updateTime,
            createTime,
            status,
            arrivalStatus,
          } = res.data.data;
          this.$nextTick(() => {
            this.baseInfo = this.withSchoolEnNamesFromIds({
              ...res.data.data,
              sectionName: this.i18nlocel == "en" ? sectionEnName : sectionCnName,
              statusLabel: this.$getListLabel(BUS_OPERATION_STATUS, status),
              arrivalStatusLabel: this.$getListLabel(BUS_OPERATION_STATUS, arrivalStatus),
              rideDate: rideDate ? dayjs(rideDate).format("YYYY-MM-DD") : "--",
              arrivalTime: arrivalTime ? dayjs(arrivalTime).format("YYYY-MM-DD HH:mm") : "--",
              updateTime: updateTime ? dayjs(updateTime).format("YYYY-MM-DD HH:mm") : "--",
              createTime: createTime ? dayjs(createTime).format("YYYY-MM-DD HH:mm") : "--",
            });
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
