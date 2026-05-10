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
                v-for="(item, index) in tabletitle['navigateButtonTable']"
                :key="index"
              >
                <span>{{ $t("isagroup")[item.label] }}</span>
                <span :title="$checkNull(detailData[item.prop])">{{
                  $checkNull(detailData[item.prop])
                }}</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.图标") }}</span>
                <el-image
                  v-if="detailData.icon"
                  style="width: 100px; height: 100px; margin-top: 20px"
                  :src="detailData.icon"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
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
import { getNavigateButtonDetail } from "@/api/isacommunity/content.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import dayjs from "dayjs";
export default {
  name: "detail",
  components: {},
  props: {
    title: String,
  },
  data() {
    return {
      tablestyle: consts["tablestyle"],
      tabletitle: tabletitle,
      showDialog: false,
      detailData: {},
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  methods: {
    showModal(item) {
      this.showDialog = true;
      this.getDetail(item.id);
    },
    closeModal() {
      this.showDialog = false;
    },
    // 获取详情
    getDetail(id) {
      getNavigateButtonDetail(id).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let { cnName, enName, icon, index, active } = res.data.data;
            this.detailData = {
              ...this.ruleForm,
              id,
              cnName,
              enName,
              icon,
              index,
              activeLabel: active
                ? this.$t("isagroup.是")
                : this.$t("isagroup.否"),
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
