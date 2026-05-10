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
                v-for="(item, index) in tabletitle['operationInfo']"
                :key="index"
              >
                <span>{{ $t("isagroup")[item.label] }}</span>
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
import {
  getSectionList,
  getLineList,
  getStationList,
} from "@/api/isacommunity/buscommon.js";
import { getOperationDetail } from "@/api/isacommunity/busoperation.js";
import consts from "@/const/isacommunity/consts.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
// 引入 dayjs
import dayjs from "dayjs";
export default {
  name: "detail",
  props: {
    title: String,
  },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      showDialog: false,
      baseInfo: {},
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
      this.getDetail(item.id);
    },
    closeModal() {
      this.baseInfo = {};
      this.showDialog = false;
    },
    // 获取详情
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
            this.baseInfo = {
              ...this.baseInfo,
              ...res.data.data,
              sectionName: this.i18nlocel == "en" ? sectionEnName : sectionCnName,
              statusLabel: this.$getListLabel(consts["operationStatus"], status),
              arrivalStatusLabel: this.$getListLabel(
                consts["operationStatus"],
                arrivalStatus
              ),
              rideDate: rideDate ? dayjs(rideDate).format("YYYY-MM-DD") : "--",
              arrivalTime: arrivalTime
                ? dayjs(arrivalTime).format("YYYY-MM-DD HH:mm")
                : "--",
              updateTime: updateTime
                ? dayjs(updateTime).format("YYYY-MM-DD HH:mm")
                : "--",
              createTime: createTime
                ? dayjs(createTime).format("YYYY-MM-DD HH:mm")
                : "--",
            };
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
