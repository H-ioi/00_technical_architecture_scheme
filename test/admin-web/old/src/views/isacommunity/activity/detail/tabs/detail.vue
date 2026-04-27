<template>
  <div>
    <div class="community_top_btn" style="text-align: right; margin-bottom: 20px">
      <el-button
        v-if="permissions['busdriver_add']"
        type="primary"
        size="large"
        @click="editActivity"
        >{{ $t("btn.编辑") }}</el-button
      >
    </div>
    <div class="orderDetail">
      <div>
        <div class="orderDetail_item">
          <div class="orderDetail_baseinfo">
            <div
              style="width: 50%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.ID") }}</span>
              <span :title="$checkNull(activityId)">{{ $checkNull(activityId) }}</span>
            </div>
            <div
              style="width: 50%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.状态") }}</span>
              <span :title="$checkNull(detailData['activityStatusLabel'])">{{
                $checkNull(detailData["activityStatusLabel"])
              }}</span>
            </div>
            <div
              style="width: 50%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.中文名") }}</span>
              <span :title="$checkNull(detailData['activityCnName'])">{{
                $checkNull(detailData["activityCnName"])
              }}</span>
            </div>
            <div
              style="width: 50%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.英文名") }}</span>
              <span :title="$checkNull(detailData['activityEnName'])">{{
                $checkNull(detailData["activityEnName"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.中文简介") }}</span>
              <span :title="$checkNull(detailData['introCn'])">{{
                $checkNull(detailData["introCn"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.英文简介") }}</span>
              <span :title="$checkNull(detailData['introEn'])">{{
                $checkNull(detailData["introEn"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.中文地址") }}</span>
              <span :title="$checkNull(detailData['addressCn'])">{{
                $checkNull(detailData["addressCn"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.英文地址") }}</span>
              <span :title="$checkNull(detailData['addressEn'])">{{
                $checkNull(detailData["addressEn"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.中文提示") }}</span>
              <span :title="$checkNull(detailData['tipsCn'])">{{
                $checkNull(detailData["tipsCn"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.英文提示") }}</span>
              <span :title="$checkNull(detailData['tipsEn'])">{{
                $checkNull(detailData["tipsEn"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.活动校区") }}</span>
              <span :title="$checkNull(detailData['schoolIdsLabel'])">{{
                $checkNull(detailData["schoolIdsLabel"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.活动时间") }}</span>
              <span :title="$checkNull(detailData['activityTime'])">{{
                $checkNull(detailData["activityTime"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.报名时间") }}</span>
              <span :title="$checkNull(detailData['registrationTime'])">{{
                $checkNull(detailData["registrationTime"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.签到方式") }}</span>
              <span :title="$checkNull(detailData['checkinMethodLabel'])">{{
                $checkNull(detailData["checkinMethodLabel"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.票价") }}</span>
              <span :title="$checkNull(detailData['ticketPrice'])">{{
                $checkNull(detailData["ticketPrice"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.是否推荐") }}</span>
              <span :title="$checkNull(detailData['recommended'])">{{
                $checkNull(detailData["recommended"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.是否Banner") }}</span>
              <span :title="$checkNull(detailData['banner'])">{{
                $checkNull(detailData["banner"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.是否需要反馈") }}</span>
              <span :title="$checkNull(detailData['needFeedback'])">{{
                $checkNull(detailData["needFeedback"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.微信提醒") }}</span>
              <span :title="$checkNull(detailData['wechatNotify'])">{{
                $checkNull(detailData["wechatNotify"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.推送校区") }}</span>
              <span :title="$checkNull(detailData['wechatPushSchoolIdsLabel'])">{{
                $checkNull(detailData["wechatPushSchoolIdsLabel"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.推送内容") }}</span>
              <span :title="$checkNull(detailData['wechatPushContent'])">{{
                $checkNull(detailData["wechatPushContent"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.推送备注") }}</span>
              <span :title="$checkNull(detailData['wechatPushRemark'])">{{
                $checkNull(detailData["wechatPushRemark"])
              }}</span>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.中文详情") }}</span>
              <div v-html="detailData['detailCn']"></div>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.英文详情") }}</span>
              <div v-html="detailData['detailEn']"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getActivityDetail } from "@/api/isacommunity/activity.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import dayjs from "dayjs";
export default {
  name: "detail",
  components: {},
  props: {
    activityId: String,
  },
  data() {
    return {
      tablestyle: consts["tablestyle"],
      tabletitle: tabletitle,
      showDialog: false,
      detailData: {},
      driverList: [],
    };
  },
  created() {},
  mounted() {
    // this.getDetail();
  },
  computed: {
    ...mapGetters(["i18nlocel", "dictionary", "permissions"]),
  },
  methods: {
    editActivity() {
      this.$refs.Form.showForm(type, item);
    },
    getDetail() {
      getActivityDetail(this.activityId).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let {
              activityCnName,
              activityEnName,
              introCn,
              introEn,
              addressCn,
              addressEn,
              tipsCn,
              tipsEn,
              schoolIds,
              checkinMethod,
              ticketPrice,
              recommended,
              banner,
              needFeedback,
              wechatNotify,
              wechatPushSchoolIds,
              wechatPushContent,
              wechatPushRemark,
              activityStatus,
              detailCn,
              detailEn,
              registrationTime,
              activityStartTime,
              activityEndTime,
            } = res.data.data;
            this.$nextTick(() => {
              this.detailData = {
                ...this.detailData,
                activityCnName,
                activityEnName,
                introCn,
                introEn,
                addressCn,
                addressEn,
                tipsCn,
                tipsEn,
                checkinMethodLabel: this.$getListLabel(
                  consts["activityCheckinMethod"],
                  String(checkinMethod)
                ),
                ticketPrice,
                recommended: this.$getListLabel(consts["yesOrno"], String(recommended)),
                banner: this.$getListLabel(consts["yesOrno"], String(banner)),
                needFeedback: this.$getListLabel(consts["yesOrno"], String(needFeedback)),
                wechatNotify: this.$getListLabel(consts["yesOrno"], String(wechatNotify)),
                wechatPushContent,
                wechatPushRemark,
                activityStatusLabel: this.$getListLabel(
                  consts["activityStatus"],
                  String(activityStatus)
                ),
                registrationTime,
                activityTime: activityStartTime + " - " + activityEndTime,
                detailCn,
                detailEn,
              };
              let schoolIdsLabel = schoolIds
                ? this.dictionary["school"].map((school) => {
                    if (schoolIds.includes(school.id)) {
                      return school.enName;
                    }
                  })
                : "--";
              let wechatPushSchoolIdsLabel = wechatPushSchoolIds
                ? this.dictionary["school"].map((school) => {
                    if (wechatPushSchoolIds.includes(school.id)) {
                      return school.enName;
                    }
                  })
                : "--";
              this.detailData["schoolIdsLabel"] = String(schoolIdsLabel);
              this.detailData["wechatPushSchoolIdsLabel"] = String(
                wechatPushSchoolIdsLabel
              );
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
