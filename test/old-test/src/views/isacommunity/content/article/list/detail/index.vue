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
                v-for="(item, index) in tabletitle['contentArticleTable']"
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
                <span>{{ $t("isagroup.主图") }}</span>
                <el-image
                  v-if="detailData.mainImage"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.mainImage"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.内容") }}</span>
                <div
                  class="html-content"
                  v-if="detailData.content"
                  v-html="detailData.content"
                ></div>
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
import { getContentArticleDetail } from "@/api/isacommunity/content.js";
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
      getContentArticleDetail(id).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let data = res.data.data;
            this.detailData = {
              ...data,
              publishStatusLabel: data.publishStatus
                ? this.$t("isagroup.是")
                : this.$t("isagroup.否"),
              visibleLabel: data.visible
                ? this.$t("isagroup.是")
                : this.$t("isagroup.否"),
              isBannerLabel: data.isBanner
                ? this.$t("isagroup.是")
                : this.$t("isagroup.否"),
              recommendedLabel: data.recommended
                ? this.$t("isagroup.是")
                : this.$t("isagroup.否"),
              isWechatPushedLabel: data.isWechatPushed
                ? this.$t("isagroup.是")
                : this.$t("isagroup.否"),
              schoolName:
                this.i18nlocel == "en"
                  ? data["schoolEnNames"] || ""
                  : data["schoolNames"] || "",
              importanceLevelLabel: this.$getListLabel(
                consts["articleImportent"],
                data["importanceLevel"]
              ),
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
