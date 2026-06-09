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
              <div
                v-if="baseInfo.needDispatch"
                :style="`width: 25%; margin-bottom: 15px`"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("schoolbus.调度车牌号") }}</span>
                <span :title="$checkNull(baseInfo['dispatchCarNumber'])">{{
                  $checkNull(baseInfo["dispatchCarNumber"])
                }}</span>
              </div>
              <div
                v-if="baseInfo.needDispatch"
                :style="`width: 25%; margin-bottom: 15px`"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("schoolbus.调度司机") }}</span>
                <span :title="$checkNull(baseInfo['dispatchDriver'])">{{
                  $checkNull(baseInfo["dispatchDriver"])
                }}</span>
              </div>
              <div
                :style="`width: 100%; margin-bottom: 15px`"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("schoolbus.详情") }}</span>
                <span :title="$checkNull(baseInfo['details'])">{{
                  $checkNull(baseInfo["details"])
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
import { getExceptDetail } from "@/api/isacommunity/busexception.js";
import { BUS_EXCEPTION_TYPE, BUS_YES_OR_NO } from "../../../schoolbusConsts.js";
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
    ...mapGetters(["i18nlocel", "dictionary", "permissions"]),
    detailFields() {
      return [
        { label: "ID", prop: "id" },
        { label: this.$t("schoolbus.校区"), prop: "schoolEnNames" },
        { label: this.$t("schoolbus.学期"), prop: "sectionName" },
        { label: this.$t("schoolbus.路线"), prop: "lineName" },
        { label: this.$t("schoolbus.站点"), prop: "stationName" },
        { label: this.$t("schoolbus.时间类型"), prop: "schoolTimeTypeLabel" },
        { label: this.$t("schoolbus.车牌号"), prop: "carNumber" },
        { label: this.$t("schoolbus.司机"), prop: "driver" },
        { label: this.$t("schoolbus.跟车老师"), prop: "teacher" },
        { label: this.$t("schoolbus.异常类型"), prop: "exceptionTypeLabel" },
        { label: this.$t("schoolbus.异常日期"), prop: "exceptionDate" },
        { label: this.$t("schoolbus.是否调度"), prop: "needDispatchLabel" },
        { label: this.$t("schoolbus.创建时间"), prop: "createTime" },
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
      getExceptDetail(id).then(async (res) => {
        if (res.data.success) {
          let { needDispatch, exceptionType, sectionEnName, sectionCnName, createTime } =
            res.data.data;
          this.$nextTick(() => {
            this.baseInfo = this.withSchoolEnNamesFromIds({
              ...res.data.data,
              sectionName: this.i18nlocel == "en" ? sectionEnName : sectionCnName,
              exceptionTypeLabel: this.$getListLabel(BUS_EXCEPTION_TYPE, exceptionType),
              needDispatchLabel: this.$getListLabel(BUS_YES_OR_NO, needDispatch),
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
