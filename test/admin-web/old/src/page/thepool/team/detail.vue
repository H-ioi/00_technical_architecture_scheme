<template>
  <div class="thepool_page">
    <div class="team_detail">
      <div class="detail_top">
        <img class="team_icon" src="/thepool/other/team.png" />
        <div>
          <div class="team_title">{{ teamInfo["teamName"] }}</div>
          <div class="team_Introduce">{{ teamInfo["teamIntroduce"] }}</div>
        </div>
      </div>
      <div class="detail_data">
        <div class="detail_data_left">
          <div class="detail_Progress">
            <div class="team_title">{{ $t("consult.团队进度") }}</div>
            <el-table
              :data="teamProgress"
              style="width: 100%"
              height="280"
              :header-cell-style="tablestyle.headercellstyle"
              :row-style="tablestyle.rowstyle"
            >
              <el-table-column
                show-overflow-tooltip
                v-for="(item, index) in tableTitle"
                :key="index"
                :label="$t('consult.' + item['label'])"
                :prop="item['prop']"
                :width="item['width'] ? item['width'] : 'auto'"
              >
                <template slot-scope="scope">
                  <el-progress
                    v-if="item['prop'] == 'delayRate'"
                    :percentage="scope.row[item['prop']]"
                    color="#E9AA83"
                  ></el-progress>

                  <span v-else>{{ scope.row[item["prop"]] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="detail_Dynamics">
            <div class="team_title df_sb">
              <span>{{ $t("consult.团队动态") }}</span>
              <el-button
                v-if="teamDynamics.length > 10"
                @click="showDynamicsModal"
                type="text"
                >{{ $t("consult.查看更多") }}</el-button
              >
            </div>
            <div v-if="teamDynamics.length > 0" class="dynamics_list">
              <div
                class="dynamics_list_item df_sb"
                v-for="(item, index) in teamDynamics"
                :key="index"
              >
                <div class="item_info df_align_center">
                  <span style="color: #ba8e62 !important">{{ item.userName }}</span>
                  <span>{{ item.dynamicsTypeName }}：</span>
                  <span>{{ item.dynamicsContent }}</span>
                </div>
                <span class="time">{{ item.createTime.substring(0, 16) }}</span>
              </div>
            </div>
            <el-empty
              v-if="teamDynamics.length == 0"
              :image-size="80"
              :description="$t('consult.暂无数据')"
            ></el-empty>
          </div>
        </div>
        <div class="detail_members">
          <div class="team_title">{{ $t("consult.成员列表") }}</div>
          <el-scrollbar style="height: 540px; padding-right: 5px">
            <div class="userlist">
              <div
                class="user_item df_sb"
                v-for="user in teamInfo.teamParticipants"
                :key="user.userId"
              >
                <div class="df_sb">
                  <div class="user_header">
                    {{ user.userName.charAt(0).toUpperCase() }}
                  </div>
                  <div class="user_name">{{ user.userName }}</div>
                </div>

                <i
                  v-if="permissions['team_del']"
                  style="color: #ee1212; cursor: pointer"
                  @click="removeUser(user.userId)"
                  class="el-icon-delete"
                ></i>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <DynamicsTable ref="dynamicsTable" :teamId="teamId" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import {
  editTeam,
  getTeamInfo,
  getTeamDynamics,
  getTeamProgress,
} from "@/api/consult/team.js";
import DynamicsTable from "@/page/thepool/team/modal/dynamicsTable.vue";
export default {
  name: "team",
  components: {
    DynamicsTable,
  },
  data() {
    return {
      tablestyle: consult["tablestyle"],
      tableTitle: consult["teamTableTitle"],
      teamId: "",
      teamInfo: {},
      teamProgress: [],
      teamDynamics: [],
      teamDynamicsTotal: 0,
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "permissions"]),
  },

  created() {
    this.teamId = this.$route.query.id;
    this.initData();
  },

  watch: {},
  mounted() {},
  activated() {},
  methods: {
    initData() {
      this.getTeamInfo();
      this.getTeamDynamics();
      this.getTeamProgress();
    },
    getTeamInfo() {
      getTeamInfo({ teamId: this.teamId, pageNum: 1, pageSize: 10 }).then((res) => {
        console.log("getTeamInfo", res);

        if (res.data.success) {
          this.teamInfo = res.data.data;
        }
      });
    },
    getTeamDynamics() {
      getTeamDynamics({ teamId: this.teamId, pageNum: 1, pageSize: 10 }).then((res) => {
        console.log("getTeamDynamics", res);
        if (res.data.success) {
          let { pageNum, pageSize, total, data } = res.data.data;
          this.teamDynamicsTotal = total;
          this.teamDynamics = data;
        }
      });
    },
    getTeamProgress() {
      getTeamProgress({ teamId: this.teamId, pageNum: 1, pageSize: 1000 }).then((res) => {
        console.log("getTeamProgress", res);
        if (res.data.success) {
          let { pageNum, pageSize, total, data } = res.data.data;
          this.teamProgress = data;
        }
      });
    },
    removeUser(userId) {
      this.$alert(this.$t("consult.确定要删除吗？"), this.$t("consult.删除"), {
        confirmButtonText: this.$t("consult.确定"),
      }).then(() => {
        let teamParticipantsIds = this.teamInfo.teamParticipants.map(
          (user) => user.userId
        );
        let data = {
          teamId: this.teamInfo.teamId,
          teamName: this.teamInfo.teamName,
          teamParticipantsIds: teamParticipantsIds.filter((id) => id !== userId),
          teamIntroduce: this.teamInfo.teamIntroduce,
        };
        this.editTeam(data);
      });
    },
    editTeam(data) {
      editTeam(data, this.studentId).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.initData();
        }
      });
    },
    showDynamicsModal() {
      this.$refs.dynamicsTable.initModal();
    },
  },
};
</script>
<style lang="scss" scoped>
.team_detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  .team_title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 18px;
    color: #333333;
    line-height: 25px;
    text-align: left;
    margin-bottom: 5px;
  }
  .detail_top {
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .team_icon {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      background: #d4ab85;
      margin-right: 15px;
    }

    .team_Introduce {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      line-height: 20px;
      text-align: left;
      font-style: normal;
    }
  }
  .detail_data {
    flex: 1;
    display: flex;
    justify-content: space-between;
    .detail_data_left {
      flex: 1;
      width: 60%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .detail_Progress {
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
        background-color: #fff;
        margin-bottom: 20px;
      }
      .detail_Dynamics {
        flex: 1;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        .dynamics_list {
          flex: 1;
          overflow: auto;
          margin-top: 10px;
          .dynamics_list_item {
            margin-bottom: 15px;
            .item_info {
              max-width: 600px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 14px;
              color: #000000;
            }
            .time {
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 14px;
              color: #999999;
              margin-left: 10px;
            }
          }
        }
      }
    }
    .detail_members {
      width: 317px;
      height: 100%;
      margin-left: 20px;
      padding: 20px 15px 20px 20px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      .userlist {
        flex: 1;
        .user_item {
          padding: 10px 0;
          .user_header {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #d4ab85;
            color: #fff;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
          }
          .user_name {
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            line-height: 20px;
            text-align: left;
          }
        }
      }
    }
  }
}
</style>
