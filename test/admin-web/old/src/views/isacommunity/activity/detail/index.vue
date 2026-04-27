<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.活动详情") }}</div>
      <div class="community_top_btn"></div>
    </div>
    <div class="community_centent community_tabs" ref="contentContainer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="活动基本信息" name="activityInfo">
          <el-scrollbar :style="{ height: scrollHeight }">
            <Detail :activityId="activityId" ref="activityInfo" />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="活动项目" name="activityProgram">活动项目</el-tab-pane>
        <el-tab-pane label="祝福语" name="activityblessing">祝福语</el-tab-pane>
        <el-tab-pane label="活动反馈" name="activityFeedback">活动反馈</el-tab-pane>
        <el-tab-pane label="报名人数" name="activitySignUp">报名人数</el-tab-pane>
        <el-tab-pane label="签到人数" name="activitySignIn">签到人数</el-tab-pane>
        <el-tab-pane label="获奖名单" name="activityWinner">获奖名单</el-tab-pane>
        <el-tab-pane label="投票信息" name="activityVote">投票信息</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getActivityPage, delActivity } from "@/api/isacommunity/activity.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Detail from "./tabs/detail.vue";
import dayjs from "dayjs";
export default {
  name: "teacher",
  components: { Detail },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      activityId: "",
      activeName: "activityInfo",
      scrollHeight: "",
    };
  },
  created() {
    this.activityId = this.$route.query.id;
    this.initData();
  },
  mounted() {
    this.updateContentHeight();
    // 监听窗口大小变化，更新高度
    window.addEventListener("resize", this.updateContentHeight);
  },
  beforeDestroy() {
    // 清理事件监听
    window.removeEventListener("resize", this.updateContentHeight);
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel", "dictionary"]),
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        this.$refs[this.activeName].getDetail();
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    updateContentHeight() {
      if (this.$refs.contentContainer) {
        // 获取contentContainer元素的实际高度
        const contentHeight = this.$refs.contentContainer.clientHeight;
        console.log("community_centent高度:", contentHeight);

        // 计算滚动区域高度（减去tabs头部高度）
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

.community_top {
  height: 30px;
  flex-shrink: 0;
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
