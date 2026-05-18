<template>
  <div v-loading="detailLoading">
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
              <span>{{ $t("isagroup.报名人数限制") }}</span>
              <span :title="$checkNull(detailData['registrationLimitLabel'])">{{
                $checkNull(detailData["registrationLimitLabel"])
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
              v-if="Number(detailData.visibleScope) === 1"
              style="width: 100%; margin-bottom: 15px"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.可见范围名单") }}</span>
              <span :title="$checkNull(detailData['visibleScopeFileLabel'])">{{
                $checkNull(detailData["visibleScopeFileLabel"])
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
              <span>{{ $t("isagroup.推送邮箱") }}</span>
              <span :title="$checkNull(detailData['emailConfigIdsLabel'])">{{
                $checkNull(detailData["emailConfigIdsLabel"])
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
import {
  getSchoolEmailConfigDetail,
  getSchoolEmailConfigList,
} from "@/api/isacommunity/schoolEmailConfig.js";
import consts from "@/const/isacommunity/consts.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import { mapGetters } from "vuex";
export default {
  name: "detail",
  mixins: [schoolListBuscommonMixin],
  props: {
    activityId: String,
    /** 父级 getActivityDetail 返回的 data 对象，子组件不再请求详情接口 */
    detailRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      detailData: {},
      detailLoading: false,
    };
  },
  watch: {
    detailRow: {
      handler(row) {
        this.applyDetailRow(row);
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  methods: {
    /** 接口校区 id 多为字符串，字典 option 的 id 多为数字 */
    schoolIdIncluded(rawIds, schoolId) {
      const sid = schoolId != null ? String(schoolId) : "";
      if (!sid) return false;
      const arr = Array.isArray(rawIds) ? rawIds : [];
      return arr.some((x) => String(x) === sid);
    },
    normalizeEmailConfigIdList(raw) {
      if (raw == null || raw === "") {
        return [];
      }
      const arr = Array.isArray(raw) ? raw : [raw];
      return arr
        .map((item) => {
          const id =
            item != null &&
            typeof item === "object" &&
            !Array.isArray(item) &&
            "id" in item
              ? item.id
              : item;
          if (id == null || id === "") {
            return null;
          }
          return id;
        })
        .filter((id) => id != null && id !== "");
    },
    resolveEmailConfigLabels(
      emailConfigIds,
      activitySchoolIds,
      emailConfigEmails
    ) {
      const ids = this.normalizeEmailConfigIdList(emailConfigIds);
      if (!ids.length) {
        this.$set(this.detailData, "emailConfigIdsLabel", "--");
        return;
      }
      const emails = Array.isArray(emailConfigEmails) ? emailConfigEmails : [];
      if (emails.length) {
        const parts = ids
          .map((id, i) => {
            const e = emails[i];
            return e != null && String(e).trim() !== "" ? String(e).trim() : "";
          })
          .filter(Boolean);
        if (parts.length) {
          this.$set(this.detailData, "emailConfigIdsLabel", parts.join(", "));
          return;
        }
      }
      const params = { appModule: "1" };
      if (activitySchoolIds && activitySchoolIds.length) {
        params.schoolIds = activitySchoolIds;
      }
      getSchoolEmailConfigList(params)
        .then(async (res) => {
          if (
            !(res.data && res.data.success !== false && res.data.data != null)
          ) {
            this.$set(this.detailData, "emailConfigIdsLabel", "--");
            return;
          }
          const list = Array.isArray(res.data.data) ? res.data.data : [];
          const parts = [];
          for (const id of ids) {
            let o = list.find(
              (x) =>
                x &&
                x.id != null &&
                String(x.id).trim() !== "" &&
                String(x.id) === String(id)
            );
            if (!o) {
              try {
                const dr = await getSchoolEmailConfigDetail(id);
                if (dr.data && dr.data.success && dr.data.data) {
                  o = dr.data.data;
                }
              } catch (e) {
                o = null;
              }
            }
            if (!o) {
              continue;
            }
            const email = o.email || "";
            const school = this.schoolSelectList.find(
              (s) => s.id === o.schoolId || String(s.id) === String(o.schoolId)
            );
            const sn = school
              ? this.schoolDropdownLabel(school)
              : o.schoolId != null
              ? String(o.schoolId)
              : "";
            parts.push(sn ? `${email}（${sn}）` : email);
          }
          const line = parts
            .filter((p) => p != null && String(p).trim() !== "")
            .join(", ");
          this.$set(this.detailData, "emailConfigIdsLabel", line || "--");
        })
        .catch(() => {
          this.$set(this.detailData, "emailConfigIdsLabel", "--");
        });
    },
    /** 接口 layer → 详情展示字段（不含异步邮箱解析） */
    buildActivityDetailViewModel(row) {
      const visibleScope =
        row.visibleScope !== undefined && row.visibleScope !== null
          ? Number(row.visibleScope)
          : 0;
      const vf = row.visibleScopeFile;
      const activitySchoolIds = row.schoolIds || [];
      const wechatSchoolIds = row.wechatPushSchoolIds || [];
      const yn = (v) =>
        this.$getListLabel(
          consts["yesOrno"],
          String(v == null || v === "" ? "0" : v)
        );

      const schoolIdsLabel = [];
      const wechatPushSchoolIdsLabel = [];
      this.schoolSelectList.forEach((school) => {
        if (this.schoolIdIncluded(activitySchoolIds, school.id)) {
          schoolIdsLabel.push(this.schoolDropdownLabel(school));
        }
        if (this.schoolIdIncluded(wechatSchoolIds, school.id)) {
          wechatPushSchoolIdsLabel.push(this.schoolDropdownLabel(school));
        }
      });

      const ticketPrice = row.ticketPrice;
      const ticketNotifyEmailEnabled = row.ticketNotifyEmailEnabled;
      const ticketNotifyEmails = row.ticketNotifyEmails;

      return {
        ...this.detailData,
        id: this.activityId,
        activityCnName: row.activityCnName,
        activityEnName: row.activityEnName,
        introCn: row.introCn,
        introEn: row.introEn,
        addressCn: row.addressCn,
        addressEn: row.addressEn,
        tipsCn: row.tipsCn,
        tipsEn: row.tipsEn,
        publisher: row.publisher,
        createTime: row.createTime,
        checkinMethodLabel: this.$getListLabel(
          consts["activityCheckinMethod"],
          String(row.checkinMethod)
        ),
        ticketPrice,
        recommended: yn(row.recommended),
        banner: yn(row.banner),
        needFeedback: yn(row.needFeedback),
        wechatNotify: yn(row.wechatNotify),
        wechatPushContent: row.wechatPushContent,
        wechatPushRemark: row.wechatPushRemark,
        activityStatus: String(row.activityStatus),
        activityStatusLabel: this.$getListLabel(
          consts["activityStatus"],
          String(row.activityStatus)
        ),
        registrationTime: `${row.registrationStartTime || ""} - ${
          row.registrationEndTime || ""
        }`,
        activityTime: `${row.activityStartTime || ""} - ${
          row.activityEndTime || ""
        }`,
        detailCn: row.detailCn,
        detailEn: row.detailEn,
        imageUrl: row.imageUrl,
        visibleScope,
        visibleScopeLabel:
          visibleScope === 1
            ? this.i18nlocel == "en"
              ? "Designated"
              : "指定"
            : this.i18nlocel == "en"
            ? "Public"
            : "公开",
        visibleScopeFileLabel:
          visibleScope === 1 && vf && vf.fileName ? vf.fileName : "--",
        registrationLimitLabel:
          row.registrationLimit != null && row.registrationLimit !== ""
            ? String(row.registrationLimit)
            : "--",
        ticketNotifyEmailsLabel:
          Number(ticketPrice) > 0 && String(ticketNotifyEmailEnabled) === "1"
            ? Array.isArray(ticketNotifyEmails)
              ? String(ticketNotifyEmails)
              : ticketNotifyEmails
            : this.i18nlocel == "en"
            ? "Disabled"
            : "关闭",
        schoolIdsLabel: String(schoolIdsLabel),
        wechatPushSchoolIdsLabel: String(wechatPushSchoolIdsLabel),
      };
    },
    /** 父级传入的接口 layer → 详情展示（仍含邮箱等衍生异步请求） */
    applyDetailRow(row) {
      if (row == null || typeof row !== "object") {
        this.detailData = {};
        this.detailLoading = false;
        return;
      }
      this.detailLoading = true;
      const activitySchoolIds = row.schoolIds || [];
      this.$nextTick(() => {
        try {
          this.detailData = this.buildActivityDetailViewModel(row);
          this.resolveEmailConfigLabels(
            row.emailConfigIds,
            activitySchoolIds,
            row.emailConfigEmails
          );
        } catch {
          this.detailData = {};
        } finally {
          this.detailLoading = false;
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
