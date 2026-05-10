<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div class="orderDetail">
        <div class="orderDetail_content">
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.事件详情") }}</div>
              <div>
                <el-button
                  v-if="permissions['event_edit']"
                  @click="editEvent"
                  type="primary"
                  size="small"
                  round
                  >{{ $t("consult.编辑") }}</el-button
                >
                <el-button
                  v-if="permissions['event_del']"
                  @click="delEvent"
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
                v-for="(item, index) in eventInfo"
                :key="index"
              >
                <span>{{ $t("consult")[item.label] }}</span>
                <span :title="$checkNull(eventData[item.prop])">{{
                  $checkNull(eventData[item.prop])
                }}</span>
              </div>
              <div
                v-if="eventData['publicType'] == '2'"
                :style="`width:20%;`"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("consult.可见部门") }}</span>
                <span :title="$checkNull(eventData['deptNames'])">{{
                  $checkNull(eventData["deptNames"])
                }}</span>
              </div>
              <div
                v-if="eventData['publicType'] == '3'"
                :style="`width:20%;`"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("consult.可见校区") }}</span>
                <span :title="$checkNull(eventData['schoolsNames'])">{{
                  $checkNull(eventData["schoolsNames"])
                }}</span>
              </div>
              <div
                v-if="eventData['publicType'] == '4'"
                :style="`width:20%;`"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("consult.可见团队") }}</span>
                <span :title="$checkNull(eventData['teamNames'])">{{
                  $checkNull(eventData["teamNames"])
                }}</span>
              </div>
              <div :style="`width:100%;`" class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.参与人员") }}</span>
                <span :title="$checkNull(eventData['userNames'])">{{
                  $checkNull(eventData["userNames"])
                }}</span>
              </div>
              <div :style="`width:100%;`" class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.事件详情") }}</span>
                <span :title="$checkNull(eventData['eventDetails'])">{{
                  $checkNull(eventData["eventDetails"])
                }}</span>
              </div>
              <div :style="`width:100%;`" class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.地点") }}</span>
                <span :title="$checkNull(eventData['location'])">{{
                  $checkNull(eventData["location"])
                }}</span>
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
                  v-if="permissions['event_comment']"
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
    <!-- 新增任务评论 -->
    <AddComment ref="AddComment" :eventId="eventId" @initData="initData" />
    <!-- 编辑 -->
    <AddEvent ref="AddEvent" @initData="initData" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import { getEventInfo, delEvent, getComment } from "@/api/consult/event.js";
import { getOrganizationUserInfo, getTeamIds } from "@/api/consult/common.js";
import AddComment from "@/page/thepool/event/modal/addcomment.vue";
import CommentList from "@/page/thepool/event/modal/commentlist.vue";
import AddEvent from "@/page/thepool/event/modal/addevent.vue";
export default {
  name: "Event",
  components: {
    AddComment,
    CommentList,
    AddEvent,
  },
  data() {
    return {
      consult: consult,
      eventId: "",
      eventTimeId: "",
      eventInfo: consult["eventInfo"],
      eventData: {},
      commentList: [],
      deptTreeData: [],
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "permissions"]),
  },

  created() {
    this.eventId = this.$route.query.eventId;
    this.eventTimeId = this.$route.query.eventTimeId;
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
      getEventInfo({ eventId: this.eventId, eventTimeId: this.eventTimeId }).then(
        async (res) => {
          if (res.data.success) {
            let data = res.data.data;
            let participants = data.participants || [];
            let userNames = participants.map((item) => item.userName);
            this.eventData = {
              ...data,
              eventTime: data.startTime + "-" + data.endTime,
              eventTypeLabel: this.$getListLabel(consult["eventType"], data.eventType),
              eventRepeatLabel: this.$getListLabel(
                consult["eventRepeat"],
                data.eventRepeat
              ),
              expirationReminderLabel: this.$getListLabel(
                consult["expirationReminder"],
                data.expirationReminder
              ),
              publicTypeLabel: this.$getListLabel(
                consult["publicTypeList"],
                data.publicType
              ),
              userNames: String(userNames),
              publicIds: data.publicIds,
            };
            this.$nextTick(async () => {
              if (data.publicType == 2) {
                this.deptTreeData = await getOrganizationUserInfo();

                let deptNames = this.getDeptLabelsByPublicIds(data.publicIds);
                this.eventData = {
                  ...this.eventData,
                  deptNames: String(deptNames),
                };
              }
              if (data.publicType == 3) {
                let showNames = [];
                this.pooldictionary.map((item) => {
                  if (data.publicIds.includes(item.value))
                    showNames.push(this.i18nlocel == "en" ? item.enLabel : item.label);
                });
                this.eventData = {
                  ...this.eventData,
                  schoolsNames: String(showNames),
                };
              }
              if (data.publicType == 4) {
                let teamList = await getTeamIds();
                let teamNames = [];
                teamList.map((item) => {
                  if (data.publicIds.includes(item.teamId)) {
                    teamNames.push(item.teamName);
                  }
                });
                this.eventData = {
                  ...this.eventData,
                  teamNames: String(teamNames),
                };
              }
            });
          }
        }
      );
    },
    getComment() {
      getComment({ eventId: this.eventId, pageSize: 1000, pageNum: 1 }).then((res) => {
        console.log("getComment", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.commentList = data;
        }
      });
    },
    editEvent() {
      this.$refs.AddEvent.getUserList();
      setTimeout(() => {
        this.$refs.AddEvent.getDetail({
          eventId: this.eventId,
          eventTimeId: this.eventTimeId,
          type: "edit",
        });
      }, 500);
    },
    addComment() {
      this.$refs.AddComment.initModal();
    },
    delEvent() {
      this.$alert(this.$t("consult.确定要删除吗？"), this.$t("consult.删除"), {
        confirmButtonText: this.$t("consult.确定"),
      }).then(() => {
        delEvent({ eventId: this.eventId }).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("consult.成功"));
            this.$router.push({
              path: "/thepool/collaboration/schedule/index",
            });
          }
        });
      });
    },
    // 新增：根据publicIds获取部门标签
    getDeptLabelsByPublicIds(publicIds) {
      if (!publicIds) return [];
      // 确保publicIds是数组格式
      const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
      const labels = [];

      // 递归查找部门标签
      const findLabels = (nodes) => {
        if (!nodes || !nodes.length) return;

        nodes.forEach((node) => {
          if (ids.includes(node.departmentId)) {
            labels.push(node.departmentName);
          }
          if (node.subDepartments && node.subDepartments.length) {
            findLabels(node.subDepartments);
          }
        });
      };

      findLabels(this.deptTreeData);
      return labels;
    },
  },
};
</script>
<style lang="scss" scoped></style>
