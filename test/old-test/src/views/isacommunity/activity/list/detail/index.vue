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
              :detail-row="activityDetailRow"
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

/** 非「活动基本信息」Tab：ref 字段名与要调用的实例方法 */
const TAB_REF_LOADERS = {
  activityProgram: { ref: "activityProgram", method: "getDetail" },
  activityRegistrationCount: { ref: "registrationList", method: "getList" },
  activityCheckinCount: { ref: "checkinList", method: "getList" },
  activityWinnerList: { ref: "winnerList", method: "getList" },
  activityVoteInfo: { ref: "voteInfoList", method: "getList" },
  activityBlessing: { ref: "blessingList", method: "getList" },
  activityFeedback: { ref: "feedbackList", method: "getList" },
  activityQuestionnaire: { ref: "questionnaireContent", method: "load" },
};

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
      activityId: "",
      /** 后端活动状态：0待发布 1已发布 2已开始 3已结束 */
      activityStatus: "",
      /** 查看态基本信息 Tab：接口层详情，由 loadActivityDetail 写入，交给子组件展示 */
      activityDetailRow: null,
      activeName: "activityInfo",
      scrollHeight: "",
      /** 同 activityId 并发 loadActivityDetail 时复用同一 Promise，避免 repeat-request 互挤 */
      _detailFetchPromise: null,
      _detailFetchRequestId: null,
    };
  },
  computed: {
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
      this.loadActivityDetail().then(() => {
        this.bootstrapAfterDetailLoaded();
      });
    },
    "$route.query.mode"() {
      this.syncActivityId();
      this.loadActivityDetail().then(() => {
        this.bootstrapAfterDetailLoaded();
      });
    },
  },
  created() {
    this.syncActivityId();
  },
  mounted() {
    this.updateContentHeight();
    window.addEventListener("resize", this.updateContentHeight);
    this.loadActivityDetail().then(() => {
      this.bootstrapAfterDetailLoaded();
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
    /** 拉活动详情：更新 activityStatus、activityDetailRow；同 id 在途请求合并为一次 */
    loadActivityDetail() {
      if (!this.activityId) {
        this.activityStatus = "";
        this.activityDetailRow = null;
        this._detailFetchPromise = null;
        this._detailFetchRequestId = null;
        this.redirectIfEndedEdit();
        return Promise.resolve();
      }
      const requestId = this.activityId;
      if (
        this._detailFetchPromise &&
        this._detailFetchRequestId === requestId
      ) {
        return this._detailFetchPromise;
      }
      this._detailFetchRequestId = requestId;
      this._detailFetchPromise = getActivityDetail(requestId)
        .then((res) => {
          if (this.activityId !== requestId) {
            return null;
          }
          if (res.data.success && res.data.data) {
            const raw = res.data.data.activityStatus;
            this.activityStatus =
              raw !== undefined && raw !== null ? String(raw) : "";
            this.activityDetailRow = res.data.data;
          } else {
            this.activityDetailRow = null;
          }
          this.$nextTick(() => this.redirectIfEndedEdit());
        })
        .catch(() => {
          if (this.activityId === requestId) {
            this.activityDetailRow = null;
          }
        })
        .finally(() => {
          if (this._detailFetchRequestId === requestId) {
            this._detailFetchPromise = null;
            this._detailFetchRequestId = null;
          }
        });
      return this._detailFetchPromise;
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
    /** 保存后切到查看态：必须在路由导航完成后再 sync + 拉详情，避免 $nextTick 早于 query 更新导致子组件拿不到 activityDetailRow */
    refreshDetailAfterSavedNavigation() {
      this.syncActivityId();
      return this.loadActivityDetail().then(() => {
        this.bootstrapAfterDetailLoaded();
      });
    },
    onFormSaved(newId) {
      const parsed = this.normalizeSavedActivityId(newId);
      const id = parsed || this.activityId;
      const nextQuery = {
        ...this.$route.query,
        ...(id ? { id: String(id) } : {}),
        mode: "view",
      };
      const run = () => this.refreshDetailAfterSavedNavigation();
      this.$router.replace(
        { path: this.$route.path, query: nextQuery },
        run,
        run
      );
    },
    /** 表单 @saved 可能传 id 字符串或 { id } */
    normalizeSavedActivityId(raw) {
      if (raw === undefined || raw === null || raw === "") {
        return "";
      }
      if (typeof raw === "object" && raw !== null && "id" in raw) {
        return String(raw.id);
      }
      return String(raw);
    },
    // refreshActivityInfo() {
    //   this.loadActivityDetail().then(() => {
    //     if (this.$refs.activityInfo) {
    //       this.$refs.activityInfo.getDetail();
    //     }
    //   });
    // },
    bootstrapActiveTab() {
      this.syncActivityId();
      this.refreshActiveTabContent();
    },
    /**
     * loadActivityDetail 已写入 activityDetailRow 后：查看+基本信息 tab 不必再 refresh（避免重复 GET）；
     * 编辑态或其它 tab 仍刷新。
     */
    bootstrapAfterDetailLoaded() {
      this.syncActivityId();
      this.$nextTick(() => {
        if (!this.isViewMode) {
          this.refreshActiveTabContent();
          return;
        }
        if (this.activeName === "activityInfo") {
          return;
        }
        this.refreshActiveTabContent();
      });
    },
    /** 挂载 / 路由变化 / 切换 Tab 时按需拉取当前 Tab 数据 */
    refreshActiveTabContent() {
      this.$nextTick(() => {
        if (this.activeName === "activityInfo") {
          this.loadActivityInfoTab();
          return;
        }
        const spec = TAB_REF_LOADERS[this.activeName];
        if (!spec) return;
        const vm = this.$refs[spec.ref];
        const fn = vm && vm[spec.method];
        if (typeof fn === "function") fn.call(vm);
      });
    },
    loadActivityInfoTab() {
      if (!this.isViewMode && this.$refs.activityForm) {
        if (this.activityId) {
          this.$refs.activityForm.showForm("edit", {
            id: this.activityId,
          });
        } else {
          this.$refs.activityForm.showForm("add", {});
        }
      } else if (this.isViewMode && this.activityId) {
        this.loadActivityDetail();
      }
    },
    handleClick() {
      this.refreshActiveTabContent();
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
