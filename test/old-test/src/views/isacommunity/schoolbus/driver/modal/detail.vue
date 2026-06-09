<template>
  <div>
    <el-dialog
      :title="title"
      :visible="showDialog"
      width="85%"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="orderDetail">
        <div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                style="width: 25%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in detailFields"
                :key="index"
              >
                <span>{{ item.label }}</span>
                <span :title="$checkNull(detailData[item.prop])">{{
                  $checkNull(detailData[item.prop])
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
import { getBusdriverDetail } from "@/api/isacommunity/busdriver.js";
import { BUS_SERVICE_TYPE } from "../../schoolbusConsts.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import dayjs from "dayjs";
export default {
  name: "detail",
  mixins: [schoolListBuscommonMixin],
  components: {},
  props: {
    title: String,
  },
  data() {
    return {
      showDialog: false,
      detailData: {},
    };
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
    detailFields() {
      return [
        { label: "ID", prop: "id" },
        { label: this.$t("schoolbus.校区"), prop: "schoolEnNames" },
        { label: this.$t("schoolbus.司机姓名"), prop: "name" },
        { label: this.$t("schoolbus.工号"), prop: "employeeNo" },
        { label: this.$t("schoolbus.联系方式"), prop: "contact" },
        { label: this.$t("schoolbus.年龄"), prop: "age" },
        { label: this.$t("schoolbus.驾照类型"), prop: "licenseType" },
        { label: this.$t("schoolbus.状态"), prop: "statusLabel" },
        { label: this.$t("schoolbus.创建时间"), prop: "createTime" },
        { label: this.$t("schoolbus.更新时间"), prop: "updateTime" },
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
      this.showDialog = false;
    },
    getDetail(id) {
      getBusdriverDetail(id).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let { status, createTime, updateTime } = res.data.data;
            this.detailData = this.withSchoolEnNamesFromIds({
              ...res.data.data,
              statusLabel: this.$getListLabel(BUS_SERVICE_TYPE, status),
              createTime: dayjs(createTime).format("YYYY-MM-DD HH:mm"),
              updateTime: dayjs(updateTime).format("YYYY-MM-DD HH:mm"),
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
