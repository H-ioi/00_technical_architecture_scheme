<template>
  <div class="community_page">
    <div class="community_top activity-detail__top">
      <div class="community_top_title">{{ pageTitle }}</div>
      <div class="community_top_btn activity-detail__actions">
        <el-button size="medium" @click="goBack">{{
          $t("isagroup.返回")
        }}</el-button>
        <template v-if="!isViewMode">
          <!-- <el-button size="medium" @click="cancelEdit">{{
            $t("btn.取消")
          }}</el-button> -->
          <el-button
            v-if="showDetailSave"
            type="primary"
            size="medium"
            @click="saveForm"
            >{{ $t("btn.保存") }}</el-button
          >
        </template>
      </div>
    </div>
    <div
      class="community_centent community_tabs activity-detail__content"
      ref="contentContainer"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('isagroup.活动基本信息')" name="activityInfo">
          <el-scrollbar :style="{ height: scrollHeight }">
            <ActivityDetail
              v-if="isViewMode"
              ref="activityInfo"
              :activity-id="activityId"
            />
            <Form
              v-else
              ref="activityForm"
              embedded
              hide-footer
              :activity-status="activityStatus"
              @saved="onFormSaved"
              @cancel="cancelEdit"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="activityId"
          :label="$t('isagroup.活动项目')"
          name="activityProgram"
        >
          <el-scrollbar :style="{ height: scrollHeight }">
            <ProgramDetail
              :activity-id="activityId"
              :read-only="activityEnded"
              ref="activityProgram"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="activityId"
          :label="$t('isagroup.问卷内容')"
          name="activityQuestionnaire"
        >
          <el-scrollbar :style="{ height: scrollHeight }">
            <QuestionnaireContent
              ref="questionnaireContent"
              :activity-id="activityId"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="activityId"
          :label="$t('isagroup.报名人数')"
          name="activityRegistrationCount"
        >
          <el-scrollbar :style="{ height: scrollHeight }">
            <RegistrationList
              ref="registrationList"
              :activity-id="activityId"
              :read-only="detailRegistrationCheckinReadOnly"
              :show-export-ended="detailSubTabsShowEndedExport"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="activityId"
          :label="$t('isagroup.签到人数')"
          name="activityCheckinCount"
        >
          <el-scrollbar :style="{ height: scrollHeight }">
            <CheckinList
              ref="checkinList"
              :activity-id="activityId"
              :read-only="detailRegistrationCheckinReadOnly"
              :show-export-ended="detailSubTabsShowEndedExport"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="activityId"
          :label="$t('isagroup.获奖名单')"
          name="activityWinnerList"
        >
          <el-scrollbar :style="{ height: scrollHeight }">
            <WinnerList
              ref="winnerList"
              :activity-id="activityId"
              :read-only="detailSubTabsEditReadOnly"
              :show-export-ended="detailSubTabsShowEndedExport"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="activityId"
          :label="$t('isagroup.投票信息')"
          name="activityVoteInfo"
        >
          <el-scrollbar :style="{ height: scrollHeight }">
            <VoteInfoList
              ref="voteInfoList"
              :activity-id="activityId"
              :read-only="detailSubTabsEditReadOnly"
              :show-export-ended="detailSubTabsShowEndedExport"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="activityId"
          :label="$t('isagroup.祝福语内容')"
          name="activityBlessing"
        >
          <el-scrollbar :style="{ height: scrollHeight }">
            <BlessingList
              ref="blessingList"
              :activity-id="activityId"
              :read-only="detailSubTabsEditReadOnly"
              :show-export-ended="detailSubTabsShowEndedExport"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="activityId"
          :label="$t('isagroup.活动反馈')"
          name="activityFeedback"
        >
          <el-scrollbar :style="{ height: scrollHeight }">
            <FeedbackList
              ref="feedbackList"
              :activity-id="activityId"
              :read-only="detailSubTabsEditReadOnly"
              :show-export-ended="detailSubTabsShowEndedExport"
            />
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getActivityDetail } from "@/api/isacommunity/activity.js";
import { ACTIVITY_PATHS } from "@/const/isacommunity/activityRoutes.js";
import consts from "@/const/isacommunity/consts.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import { mapGetters } from "vuex";
import Form from "../modal/form.vue";
import ActivityDetail from "./tabs/activitydetail.vue";
import BlessingList from "./tabs/blessinglist.vue";
import CheckinList from "./tabs/checkinlist.vue";
import FeedbackList from "./tabs/feedbacklist.vue";
import ProgramDetail from "./tabs/programdetail.vue";
import QuestionnaireContent from "./tabs/questionnairecontent.vue";
import RegistrationList from "./tabs/registrationlist.vue";
import VoteInfoList from "./tabs/voteinfolist.vue";
import WinnerList from "./tabs/winnerlist.vue";

export default {
  name: "ActivityListDetail",
  components: {
    ActivityDetail,
    ProgramDetail,
    Form,
    QuestionnaireContent,
    RegistrationList,
    CheckinList,
    WinnerList,
    VoteInfoList,
    BlessingList,
    FeedbackList,
  },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      activityId: "",
      /** 与 consts.activityStatus 一致：0待发布 1已发布 2已开始 3已结束 */
      activityStatus: "",
      activeName: "activityInfo",
      scrollHeight: "",
    };
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel", "dictionary"]),
    isViewMode() {
      return this.$route.query.mode !== "edit";
    },
    /** 无 id 且为编辑态：列表「新增」进入的创建页 */
    isCreateMode() {
      return !this.activityId && this.$route.query.mode === "edit";
    },
    /** 已开始（进行中），activityStatus === '2' */
    activityInProgress() {
      return String(this.activityStatus || "") === "2";
    },
    activityEnded() {
      return String(this.activityStatus) === "3";
    },
    /**
     * 报名/签到：待发布(0)/已发布(1)/已开始(2) 均可编辑；仅已结束(3)只读（与路由查看无关）。
     */
    detailRegistrationCheckinReadOnly() {
      return this.activityEnded;
    },
    /** 获奖/投票/祝福/反馈：仅 activityStatus=2 可操作；已结束或非进行中不可编辑 */
    detailSubTabsEditReadOnly() {
      return !this.activityInProgress;
    },
    /** 活动已结束时各子 Tab 仍展示导出 */
    detailSubTabsShowEndedExport() {
      return this.activityEnded;
    },
    showDetailSave() {
      if (this.isViewMode) {
        return false;
      }
      if (!this.activityId) {
        return true;
      }
      const s = String(this.activityStatus || "");
      if (s === "2" || s === "3") {
        return false;
      }
      return true;
    },
    pageTitle() {
      if (this.isCreateMode) {
        return this.$t("isagroup.新增活动");
      }
      return this.isViewMode
        ? this.$t("isagroup.活动详情")
        : this.$t("isagroup.活动编辑");
    },
  },
  watch: {
    "$route.query.id"() {
      this.syncActivityId();
      this.loadActivityStatus().then(() => {
        this.bootstrapActiveTab();
      });
    },
    "$route.query.mode"() {
      this.bootstrapActiveTab();
    },
  },
  created() {
    this.syncActivityId();
  },
  mounted() {
    this.updateContentHeight();
    window.addEventListener("resize", this.updateContentHeight);
    this.loadActivityStatus().then(() => {
      this.$nextTick(() => {
        this.bootstrapActiveTab();
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateContentHeight);
  },
  methods: {
    syncActivityId() {
      this.activityId = this.$route.query.id
        ? String(this.$route.query.id)
        : "";
      if (!this.activityId && this.$route.query.mode === "edit") {
        this.activeName = "activityInfo";
      }
    },
    goBack() {
      this.$router.push({ path: ACTIVITY_PATHS.list });
    },
    loadActivityStatus() {
      if (!this.activityId) {
        this.activityStatus = "";
        this.redirectIfEndedEdit();
        return Promise.resolve();
      }
      return getActivityDetail(this.activityId)
        .then((res) => {
          if (res.data.success && res.data.data) {
            const raw = res.data.data.activityStatus;
            this.activityStatus =
              raw !== undefined && raw !== null ? String(raw) : "";
          }
          this.$nextTick(() => this.redirectIfEndedEdit());
        })
        .catch(() => Promise.resolve());
    },
    /** 已结束活动禁止停留在编辑 URL */
    redirectIfEndedEdit() {
      if (
        !this.isCreateMode &&
        this.$route.query.mode === "edit" &&
        this.activityId &&
        this.activityEnded
      ) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, id: this.activityId, mode: "view" },
        });
        this.$message.warning(this.$t("isagroup.活动已结束不可编辑"));
      }
    },
    cancelEdit() {
      if (this.isCreateMode) {
        this.goBack();
        return;
      }
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, mode: "view" },
      });
    },
    saveForm() {
      if (this.$refs.activityForm) {
        this.$refs.activityForm.submitForm("ruleForm");
      }
    },
    onFormSaved(newId) {
      const id =
        newId !== undefined && newId !== null && newId !== ""
          ? String(
              typeof newId === "object" && newId !== null && "id" in newId
                ? newId.id
                : newId
            )
          : this.activityId;
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, ...(id ? { id } : {}), mode: "view" },
      });
      this.$nextTick(() => {
        this.syncActivityId();
        this.loadActivityStatus();
        // this.refreshActivityInfo();
      });
    },
    // refreshActivityInfo() {
    //   this.loadActivityStatus().then(() => {
    //     if (this.$refs.activityInfo) {
    //       this.$refs.activityInfo.getDetail();
    //     }
    //   });
    // },
    bootstrapActiveTab() {
      this.syncActivityId();
      this.$nextTick(() => {
        if (this.activeName === "activityInfo") {
          if (!this.isViewMode && this.$refs.activityForm) {
            if (this.activityId) {
              this.$refs.activityForm.showForm("edit", {
                id: this.activityId,
              });
            } else {
              this.$refs.activityForm.showForm("add", {});
            }
          } else if (this.isViewMode && this.$refs.activityInfo) {
            this.$refs.activityInfo.getDetail();
          }
        } else if (
          this.activeName === "activityProgram" &&
          this.$refs.activityProgram
        ) {
          this.$refs.activityProgram.getDetail();
        } else if (
          this.activeName === "activityRegistrationCount" &&
          this.$refs.registrationList
        ) {
          this.$refs.registrationList.getList();
        } else if (
          this.activeName === "activityCheckinCount" &&
          this.$refs.checkinList
        ) {
          this.$refs.checkinList.getList();
        } else if (
          this.activeName === "activityWinnerList" &&
          this.$refs.winnerList
        ) {
          this.$refs.winnerList.getList();
        } else if (
          this.activeName === "activityVoteInfo" &&
          this.$refs.voteInfoList
        ) {
          this.$refs.voteInfoList.getList();
        } else if (
          this.activeName === "activityBlessing" &&
          this.$refs.blessingList
        ) {
          this.$refs.blessingList.getList();
        } else if (
          this.activeName === "activityFeedback" &&
          this.$refs.feedbackList
        ) {
          this.$refs.feedbackList.getList();
        } else if (
          this.activeName === "activityQuestionnaire" &&
          this.$refs.questionnaireContent
        ) {
          this.$refs.questionnaireContent.load();
        }
      });
    },
    initData() {
      this.bootstrapActiveTab();
    },
    handleClick() {
      switch (this.activeName) {
        case "activityInfo":
          if (!this.isViewMode && this.$refs.activityForm) {
            if (this.activityId) {
              this.$refs.activityForm.showForm("edit", {
                id: this.activityId,
              });
            } else {
              this.$refs.activityForm.showForm("add", {});
            }
          } else if (this.isViewMode && this.$refs.activityInfo) {
            this.$refs.activityInfo.getDetail();
          }
          break;
        case "activityProgram":
          if (this.$refs.activityProgram) {
            this.$refs.activityProgram.getDetail();
          }
          break;
        case "activityRegistrationCount":
          if (this.$refs.registrationList) {
            this.$refs.registrationList.getList();
          }
          break;
        case "activityCheckinCount":
          if (this.$refs.checkinList) {
            this.$refs.checkinList.getList();
          }
          break;
        case "activityWinnerList":
          if (this.$refs.winnerList) {
            this.$refs.winnerList.getList();
          }
          break;
        case "activityVoteInfo":
          if (this.$refs.voteInfoList) {
            this.$refs.voteInfoList.getList();
          }
          break;
        case "activityBlessing":
          if (this.$refs.blessingList) {
            this.$refs.blessingList.getList();
          }
          break;
        case "activityFeedback":
          if (this.$refs.feedbackList) {
            this.$refs.feedbackList.getList();
          }
          break;
        case "activityQuestionnaire":
          if (this.$refs.questionnaireContent) {
            this.$refs.questionnaireContent.load();
          }
          break;
        default:
          break;
      }
    },
    updateContentHeight() {
      if (this.$refs.contentContainer) {
        const contentHeight = this.$refs.contentContainer.clientHeight;
        this.scrollHeight = `${contentHeight - 110}px`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.community_page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.activity-detail__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  min-height: 40px;
  padding-right: 8px;
  box-sizing: border-box;
}

.activity-detail__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.community_centent {
  flex: 1;
  min-height: 0;
  height: calc(100vh - 60px);
}

:deep(.el-tabs__content) {
  height: calc(100% - 140px);
  overflow: hidden;
}
</style>
