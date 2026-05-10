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
        <div style="max-height: 600px; overflow-y: auto">
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                style="width: 25%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in tabletitle['discussionContentTable']"
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
                  v-if="detailData.mainImg"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.mainImg"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.第二张图") }}</span>
                <el-image
                  v-if="detailData.secondImg"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.secondImg"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.第三张图") }}</span>
                <el-image
                  v-if="detailData.thirdImg"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.thirdImg"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.第四张图") }}</span>
                <el-image
                  v-if="detailData.fourthImg"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.fourthImg"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.第五张图") }}</span>
                <el-image
                  v-if="detailData.fifthImg"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.fifthImg"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.第六张图") }}</span>
                <el-image
                  v-if="detailData.sixthImg"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.sixthImg"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.第七张图") }}</span>
                <el-image
                  v-if="detailData.seventhImg"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.seventhImg"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.第八张图") }}</span>
                <el-image
                  v-if="detailData.eighthImg"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.eighthImg"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.第九张图") }}</span>
                <el-image
                  v-if="detailData.ninthImg"
                  style="width: 200px; margin-top: 10px"
                  :src="detailData.ninthImg"
                  fit="scale-down"
                ></el-image>
                <span v-else>--</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>PDF</span>
                <div class="pdf_list" v-if="pdfList.length > 0">
                  <a
                    v-for="pdf in pdfList"
                    :key="pdf.pdf"
                    :href="pdf.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ pdf.pdf }}</a
                  >
                </div>
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
import { getDiscussionContentDetail } from "@/api/isacommunity/content.js";
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
      pdfList: [],
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
      this.pdfList = [];
      this.detailData = {};
    },
    // 获取详情
    getDetail(id) {
      getDiscussionContentDetail(id).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let data = res.data.data;
            this.detailData = {
              ...data,
              topLabel: data.top
                ? this.$t("isagroup.是")
                : this.$t("isagroup.否"),
              recommendedLabel: data.recommended
                ? this.$t("isagroup.是")
                : this.$t("isagroup.否"),
              activeLabel: data.active
                ? this.$t("isagroup.是")
                : this.$t("isagroup.否"),
              tagName: data.tagList
                ? this.i18nlocel == "en"
                  ? data.tagList[0].enName
                  : data.tagList[0].cnName
                : "--",
              scopeLabel: this.$getListLabel(consts["scopeList"], data.scope),
            };
            this.pdfList = data.pdfList || [];
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
.pdf_list {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  a {
    color: #ba8e62;
  }
}
</style>
