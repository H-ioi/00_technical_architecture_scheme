<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div class="orderDetail">
        <div class="orderDetail_content">
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.任务详情") }}</div>
              <div>
                <el-button
                  v-if="permissions['task_complete'] && taskData['completeStatus'] != 1"
                  @click="addComplete"
                  type="primary"
                  size="small"
                  round
                  >{{ $t("consult.完成任务") }}</el-button
                >
                <el-button
                  v-if="permissions['task_summary']"
                  @click="addSummary"
                  type="primary"
                  size="small"
                  round
                  >{{ $t("consult.总结任务") }}</el-button
                >
                <el-button
                  v-if="permissions['task_edit']"
                  @click="editTask"
                  type="primary"
                  size="small"
                  round
                  >{{ $t("consult.编辑") }}</el-button
                >
                <el-button
                  v-if="permissions['task_del']"
                  @click="delTask"
                  size="small"
                  round
                  >{{ $t("consult.删除") }}</el-button
                >
              </div>
            </div>
            <div class="orderDetail_baseinfo">
              <div
                :style="`width:${item.width ? item.width : '20%'};`"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in taskInfo"
                :key="index"
              >
                <span>{{ $t("consult")[item.label] }}</span>
                <span
                  v-if="item.prop != 'completeProgress'"
                  :title="$checkNull(taskData[item.prop])"
                  >{{ $checkNull(taskData[item.prop]) }}</span
                >
                <el-progress
                  v-else
                  style="width: 60%"
                  color="#E9AA83"
                  :percentage="taskData[item.prop] || 0"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
        <div class="orderDetail_content">
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.评论") }}</div>
              <div>
                <el-button
                  v-if="permissions['task_comment']"
                  @click="addComment"
                  type="primary"
                  size="small"
                  round
                  >{{ $t("consult.新增评论") }}</el-button
                >
              </div>
            </div>
            <div class="orderDetail_baseinfo">
              <CommentList ref="CommentList" :commentList="commentList" />
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- 新增任务总结 -->
    <AddSummary ref="AddSummary" :taskId="taskId" @initData="initData" />
    <!-- 新增任务完成 -->
    <AddComplete ref="AddComplete" :taskId="taskId" @initData="initData" />
    <!-- 新增任务评论 -->
    <AddComment ref="AddComment" :taskId="taskId" @initData="initData" />
    <!-- 编辑 -->
    <AddTask ref="AddTask" @initData="initData" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import { getTaskInfo, getComment, delTask } from "@/api/consult/task.js";
import AddSummary from "@/page/thepool/task/modal/addsummary.vue";
import AddComplete from "@/page/thepool/task/modal/addcomplete.vue";
import AddComment from "@/page/thepool/task/modal/addcomment.vue";
import CommentList from "@/page/thepool/task/modal/commentlist.vue";
import AddTask from "@/page/thepool/task/modal/addtask.vue";
export default {
  name: "team",
  components: {
    AddSummary,
    AddComplete,
    AddComment,
    CommentList,
    AddTask,
  },
  data() {
    return {
      consult: consult,
      taskId: "",
      taskInfo: consult["taskInfo"],
      taskData: {},
      commentList: [],
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "permissions"]),
  },

  created() {
    this.taskId = this.$route.query.taskId;
    this.initData();
  },

  watch: {},
  mounted() {},
  activated() {},
  methods: {
    initData() {
      this.getDetail();
      this.getComment();
    },
    getDetail() {
      getTaskInfo({ taskId: this.taskId }).then((res) => {
        console.log("getTaskInfo", res);
        if (res.data.success) {
          let data = res.data.data;
          this.taskData = {
            ...data,
            statusLabel: this.$getListLabel(consult["taskStatus"], data.status),
            taskTimeTypeLabel: this.$getListLabel(
              consult["taskTimeType"],
              data.taskTimeType
            ),
            importanceLevelLabel: this.$getListLabel(
              consult["importanceLevel"],
              data.importanceLevel
            ),
            expirationReminderLabel: this.$getListLabel(
              consult["expirationReminder"],
              data.expirationReminder
            ),
            participantName: data.participants.map((user) => user.userName).join(","),
          };
        }
      });
    },
    getComment() {
      getComment({ taskId: this.taskId, pageSize: 1000, pageNum: 1 }).then((res) => {
        console.log("getComment", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.commentList = data;
        }
      });
    },
    editTask() {
      this.$refs.AddTask.getDetail(this.taskId);
    },
    addComplete() {
      this.$refs.AddComplete.initModal();
    },
    addSummary() {
      this.$refs.AddSummary.initModal();
    },
    addComment() {
      this.$refs.AddComment.initModal();
    },
    delTask() {
      this.$alert(this.$t("consult.确定要删除吗？"), this.$t("consult.删除"), {
        confirmButtonText: this.$t("consult.确定"),
      }).then(() => {
        delTask({ taskId: this.taskId }).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("consult.成功"));
            this.$router.push({
              path: "/thepool/collaboration/task/index",
            });
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
