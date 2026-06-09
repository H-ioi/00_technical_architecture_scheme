<template>
  <div class="thepool_page">
    <div class="orderDetail_baseinfo" style="padding-top: 0 !important">
      <el-steps
        v-if="logList.length > 0"
        class="poolSteps"
        direction="vertical"
        :active="logList.length"
      >
        <el-step v-for="(i, k) in logList" :key="k" :title="i.followTime">
          <template slot="description">
            <div class="df_sb" v-if="i.studentId && isClue">
              <div class="loglabel">
                {{ `${$t("consult.学生")}：${i.studentName}` }}
              </div>
            </div>
            <div class="df_sb" v-if="i.guardianId && isClue">
              <div class="loglabel">
                {{ `${$t("consult.家长")}：${i.guardianName}` }}
              </div>
            </div>
            <div class="df_sb">
              <div class="loglabel">
                {{
                  `${$t("consult.跟进人")}：${
                    (i.extras.length > 0 ? i.extras[0].value : "--") +
                    setLogDescription(i.extras)
                  }`
                }}
              </div>
              <div
                v-if="i.showDetail"
                style="cursor: pointer"
                @click="lookLog(i)"
              >
                {{
                  i.followType != "10"
                    ? $t("consult.详情")
                    : $t("consult.查看邮件")
                }}
              </div>
            </div>
            <ShowText
              v-if="i.followDesc !== null && i.followDesc !== ''"
              :label="$t('consult.备注') + '：' + i.followDesc"
            />
          </template>
        </el-step>
      </el-steps>
    </div>
    <el-empty v-if="logList.length == 0" description="No Data~"></el-empty>
    <!-- 记录信息 -->
    <logDetail
      v-if="logDetail"
      ref="logDetail"
      :logDetail="logDetail"
      :isClue="isClue"
      @changeModal="changeModal"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import ShowText from "@/components/common/ShowText.vue";
import logDetail from "@/page/thepool/consult/modal/logdetail.vue";
export default {
  name: "addlog",
  props: {
    studentList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    guardianList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isClue: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ShowText,
    logDetail,
  },
  data() {
    return {
      logListdata: [],
      logList: [],
      filterLog: {
        outerId: "",
        scene: "enquiry_enroll",
      },
      currentFollow: "all",
      logDetail: false,
      followersIds: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([
      "permissions",
      "dictionary",
      "userList",
      "userInfo",
      "i18nlocel",
    ]),
  },
  methods: {
    setLogList(data) {
      this.logListdata = data;
      this.logListdata.map((item) => {
        if (item["followType"] == null) {
          item["followTypeLabel"] = this.$t("consult.备注");
          item["showDetail"] = false;
        } else {
          item["showDetail"] = true;
          item["followTypeLabel"] = this.getDataLabel(
            item.followType,
            this.dictionary["follow_type"]
          );
        }
      });
      this.logList = this.logListdata;
    },
    // 切换跟进方式
    changeFollowType(data) {
      this.currentFollow = data.value;
      if (data.value == "all") {
        this.logList = this.logListdata;
      } else {
        this.logList = this.logListdata.filter((item) => {
          return item["followType"] == data.value;
        });
      }
    },
    // 查看跟进记录详情
    lookLog(i) {
      if (i.followType == "10") {
        this.$router.push("/thepool/email/senddetail?id=" + i.emailId);
      } else {
        this.logDetail = true;
        this.$nextTick(() => {
          let data = { outerId: i.id, scene: "follow_record_attachment" };
          let extras = i.extras;
          this.$refs["logDetail"].ruleForm = {
            follow_user_name: extras.length > 0 ? extras[0].value : "",
            follow_contactor_name: extras.length > 1 ? extras[1].value : "",
            followTime: i.followTime,
            followTypeLabel: i.followType == null ? "" : i.followTypeLabel,
            followDesc: i.followDesc,
            studentName: i.studentName,
            guardianName: i.guardianName,
          };
          this.$refs["logDetail"].setFeilList(data);
        });
      }
    },
    setLogDescription(data) {
      let str = "";
      let newStatus = "";
      let oldStatus = "";
      data.map((item) => {
        if (
          item["key"] == "follow_student_status_change" ||
          item["key"] == "follow_clue_status_change" ||
          item["key"] == "follow_status_change"
        ) {
          let obj = JSON.parse(item["value"]);
          if (
            (obj["old"] || obj["old"] == 0) &&
            (obj["new"] || obj["new"] == 0)
          ) {
            if (item["key"] == "follow_status_change") {
              oldStatus = consult["followStatus"][obj["old"]];
              newStatus = consult["followStatus"][obj["new"]];
            }
            if (item["key"] == "follow_clue_status_change") {
              oldStatus = consult["followStatus"][obj["old"]];
              newStatus = consult["followStatus"][obj["new"]];
            }
            if (item["key"] == "follow_student_status_change") {
              oldStatus = consult["enrolledStatusObj"][obj["old"]];
              newStatus = consult["enrolledStatusObj"][obj["new"]];
            }
            if (obj["old"] == 3) {
              str = this.$t("consult.激活状态为") + newStatus;
            } else {
              str =
                this.i18nlocel == "en"
                  ? oldStatus + this.$t("consult.修改状态") + newStatus
                  : "修改" + oldStatus + "状态为" + newStatus;
            }
          }
        }
      });

      return str;
    },
    changeModal(type) {
      this.logDetail = type;
    },
    getDataLabel(id, data) {
      console.log("getDataLabel", id, data);
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.poolSteps {
  width: 100%;
}

.loglabel {
  font-size: 14px;
  color: #0d0d0d;
  line-height: 24px;
}
</style>
