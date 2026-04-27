<template>
  <div>
    <div class="orderDetail">
      <div>
        <div class="orderDetail_item">
          <div class="orderDetail_baseinfo">
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.ID") }}</span>
              <span :title="$checkNull(activityId)">{{
                $checkNull(activityId)
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.状态") }}</span>
              <span :title="$checkNull(detailData['activityStatusLabel'])">{{
                $checkNull(detailData["activityStatusLabel"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.创建人") }}</span>
              <span :title="$checkNull(detailData['publisher'])">{{
                $checkNull(detailData["publisher"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.创建时间") }}</span>
              <span :title="$checkNull(detailData['createTime'])">{{
                $checkNull(detailData["createTime"])
              }}</span>
            </div>
            <div
              style="margin-bottom: 15px; width: 100%"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.背景图") }}</span>
              <span>
                <img :src="detailData.imageUrl" alt="" style="width: 200px" />
              </span>
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
              <span>{{ $t("isagroup.可见范围") }}</span>
              <span :title="$checkNull(detailData['visibleScopeLabel'])">{{
                $checkNull(detailData["visibleScopeLabel"])
              }}</span>
            </div>
            <div
              style="width: 25%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.报名人数限制") }}</span>
              <span
                :title="$checkNull(detailData['registrationLimitLabel'])"
                >{{ $checkNull(detailData["registrationLimitLabel"]) }}</span
              >
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item visible-scope-file-row"
            >
              <span class="visible-scope-list-label">{{
                $t("isagroup.可见范围名单")
              }}</span>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-download"
                @click="handleDownloadVisibleScopeTemplate"
                >{{ $t("isagroup.下载Excel模板") }}</el-button
              >
              <el-upload
                class="visible-scope-upload-inline"
                :show-file-list="false"
                accept=".xlsx,.xls"
                :http-request="handleImportVisibleScope"
              >
                <el-button size="small" icon="el-icon-upload2">{{
                  $t("isagroup.上传可见范围名单")
                }}</el-button>
              </el-upload>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.买票通知邮箱") }}</span>
              <span :title="$checkNull(detailData['ticketNotifyEmailsLabel'])">{{
                $checkNull(detailData["ticketNotifyEmailsLabel"])
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
              <span
                :title="$checkNull(detailData['wechatPushSchoolIdsLabel'])"
                >{{ $checkNull(detailData["wechatPushSchoolIdsLabel"]) }}</span
              >
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
              <div
                style="width: 100%; overflow: auto"
                v-html="detailData['detailCn']"
              ></div>
            </div>
            <div
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.英文详情") }}</span>
              <div
                style="width: 100%; overflow: auto"
                v-html="detailData['detailEn']"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getActivityDetail,
  downloadVisibleScopeTemplate,
  importVisibleScopeFile,
} from "@/api/isacommunity/activity.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import dayjs from "dayjs";
export default {
  name: "detail",
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
    ...mapGetters(["i18nlocel", "dictionary"]),
  },
  methods: {
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
              publisher,
              createTime,
              imageUrl,
              registrationStartTime,
              registrationEndTime,
              visibleScope,
              registrationLimit,
              ticketNotifyEmailEnabled,
              ticketNotifyEmails,
            } = res.data.data;
            let activitySchoolIds = schoolIds || [];
            let wechatSchoolIds = wechatPushSchoolIds || [];
            console.log("activitySchoolIds", schoolIds, activitySchoolIds);
            console.log(
              "wechatSchoolIds",
              wechatPushSchoolIds,
              wechatSchoolIds
            );

            this.$nextTick(() => {
              this.detailData = {
                ...this.detailData,
                id: this.activityId,
                activityCnName,
                activityEnName,
                introCn,
                introEn,
                addressCn,
                addressEn,
                tipsCn,
                tipsEn,
                publisher,
                createTime,
                checkinMethodLabel: this.$getListLabel(
                  consts["activityCheckinMethod"],
                  String(checkinMethod)
                ),
                ticketPrice,
                recommended: this.$getListLabel(
                  consts["yesOrno"],
                  String(recommended)
                ),
                banner: this.$getListLabel(consts["yesOrno"], String(banner)),
                needFeedback: this.$getListLabel(
                  consts["yesOrno"],
                  String(needFeedback)
                ),
                wechatNotify: this.$getListLabel(
                  consts["yesOrno"],
                  String(wechatNotify)
                ),
                wechatPushContent,
                wechatPushRemark,
                activityStatus: String(activityStatus),
                activityStatusLabel: this.$getListLabel(
                  consts["activityStatus"],
                  String(activityStatus)
                ),
                registrationTime:
                  registrationStartTime + " - " + registrationEndTime,
                activityTime: activityStartTime + " - " + activityEndTime,
                detailCn,
                detailEn,
                imageUrl,
                visibleScopeLabel:
                  Number(visibleScope) === 1
                    ? this.i18nlocel == "en"
                      ? "Within activity schools"
                      : "活动校区可见"
                    : this.i18nlocel == "en"
                    ? "All"
                    : "全部可见",
                registrationLimitLabel:
                  registrationLimit != null && registrationLimit !== ""
                    ? String(registrationLimit)
                    : "--",
                ticketNotifyEmailsLabel:
                  Number(ticketPrice) > 0 && String(ticketNotifyEmailEnabled) === "1"
                    ? Array.isArray(ticketNotifyEmails)
                      ? String(ticketNotifyEmails)
                      : ticketNotifyEmails
                    : this.i18nlocel == "en"
                    ? "Disabled"
                    : "关闭",
              };
              let schoolIdsLabel = [];
              this.dictionary["school"].map((school) => {
                if (activitySchoolIds.includes(school.id)) {
                  schoolIdsLabel.push(school.enName);
                }
              });

              let wechatPushSchoolIdsLabel = [];
              this.dictionary["school"].map((school) => {
                if (wechatSchoolIds.includes(school.id)) {
                  wechatPushSchoolIdsLabel.push(school.enName);
                }
              });

              this.detailData["schoolIdsLabel"] = String(schoolIdsLabel);
              this.detailData["wechatPushSchoolIdsLabel"] = String(
                wechatPushSchoolIdsLabel
              );
              this.$emit("loaded", {
                activityStatus: this.detailData["activityStatus"],
              });
            });
          });
        }
      });
    },
    async handleDownloadVisibleScopeTemplate() {
      try {
        const res = await downloadVisibleScopeTemplate();
        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "activity-visible-scope-template.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        this.$message.error(this.$t("isagroup.失败"));
      }
    },
    handleImportVisibleScope(req) {
      const file = req.file;
      importVisibleScopeFile(this.activityId, file)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.getDetail();
          }
        })
        .catch(() => {});
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

.visible-scope-file-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.visible-scope-list-label {
  font-size: 14px;
  color: #999999;
  line-height: 20px;
  margin-right: 8px;
}

.visible-scope-upload-inline {
  display: inline-block;
}
</style>
