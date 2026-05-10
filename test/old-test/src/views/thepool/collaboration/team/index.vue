<template>
  <div class="thepool_page">
    <div class="team">
      <div class="team_top df_sb">
        <div class="team_top_title"></div>
        <div class="df_sb" style="width: 100%">
          <el-checkbox
            v-if="permissions['team_all_list']"
            class="checkbox_center"
            @change="changeCheckbox"
            v-model="isAllTeam"
            >{{ $t("consult.查看全部团队") }}</el-checkbox
          >
          <span v-else></span>
          <div class="df_sb">
            <el-input
              class="search_input"
              @change="getList"
              v-model="pagination['teamName']"
              placeholder="搜索团队"
              @keyup.enter.native="getList"
            ></el-input>
            <el-button
              style="margin-left: 20px"
              v-if="permissions['team_add']"
              @click="addTeam"
              type="primary"
              size="small"
              round
              >{{ $t("consult.新增") }}</el-button
            >
          </div>
        </div>
      </div>
      <el-row :gutter="20" v-if="teamList.length > 0">
        <div class="team_list">
          <el-col :span="8" v-for="item in teamList" :key="item">
            <div
              :class="[
                'team_item',
                {
                  active_item: activeTeam.includes(item),
                },
              ]"
              @click="handleClick(item)"
            >
              <div class="team_item_top df_sb">
                <!-- <div class="team_item_title">{{ $t("consult.任务详情") }}</div> -->
                <div class="team_item_title">{{ item["teamName"] }}</div>

                <!-- <div class="team_item_new">{{ $t("consult.新") }}</div> -->
              </div>
              <div class="team_item_content">
                <div class="team_item_detail">
                  {{ item["teamIntroduce"] }}
                </div>

                <div class="team_item_num df_end_sa">
                  <div class="df_end_sa">
                    <span class="text">{{ $t("consult.成员") }}</span>
                    <span class="num">{{ item["participantsNum"] }}</span>
                  </div>
                  <div class="df_end_sa">
                    <span class="text">{{ $t("consult.咨询") }}</span>
                    <span class="num">{{ item["enquiryNum"] }}</span>
                  </div>
                  <div class="df_end_sa">
                    <span class="text">{{ $t("consult.任务") }}</span>
                    <span class="num">{{ item["taskNum"] }}</span>
                  </div>
                </div>
                <div class="df_center_sa team_item_btn">
                  <el-button
                    @click="palyCurrentTeam(item, 'look')"
                    icon="el-icon-view"
                    type="text"
                    >{{ $t("consult.查看详情") }}</el-button
                  >

                  <el-button
                    v-if="permissions['team_edit']"
                    @click="palyCurrentTeam(item, 'edit')"
                    icon="el-icon-edit"
                    type="text"
                    >{{ $t("consult.编辑团队") }}</el-button
                  >
                  <el-button
                    v-if="permissions['team_del']"
                    @click="palyCurrentTeam(item, 'del')"
                    icon="el-icon-delete"
                    type="text"
                    >{{ $t("consult.删除团队") }}</el-button
                  >
                </div>
              </div>
            </div>
          </el-col>
        </div>
      </el-row>
      <div class="df_sb" v-if="teamList.length > 0">
        <div class="df_sb">
          <!-- <el-checkbox v-model="selectAll">{{ $t("consult.全选") }}</el-checkbox>
          <el-button icon="el-icon-delete" type="text">{{
            $t("consult.删除")
          }}</el-button> -->
        </div>
        <Pagination
          :total="Number(pagination['total'])"
          :pagination="pagination"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>
      <el-empty
        v-if="teamList.length == 0"
        :description="$t('consult.暂无数据')"
      ></el-empty>
    </div>
    <!-- 新增团队 -->
    <AddTeam ref="AddTeam" @initData="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getTeamInfoList,
  getAllTeamInfoList,
  delTeam,
} from "@/api/consult/team.js";
import Pagination from "@/components/common/Pagination.vue";
import AddTeam from "@/page/thepool/team/modal/addteam.vue";
export default {
  name: "team",
  components: {
    AddTeam,
    Pagination,
  },
  data() {
    return {
      pagination: {
        total: 0,
        size: 9,
        current: 1,
        teamName: "",
      },
      teamList: [],
      activeTeam: [],
      selectAll: false,
      isAllTeam: false,
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "permissions"]),
  },

  created() {
    this.getList();
  },

  watch: {},
  mounted() {},
  activated() {
    this.getList();
  },
  methods: {
    getList() {
      let data = {
        pageNum: this.pagination["current"],
        pageSize: this.pagination["size"],
        teamName: this.pagination["teamName"],
      };
      if (!this.isAllTeam) {
        getTeamInfoList(data).then((res) => {
          console.log("res", res);
          if (res.data.success) {
            let { pageNum, pageSize, total, data } = res.data.data;
            this.pagination["total"] = total;
            this.teamList = data;
          }
        });
      } else {
        getAllTeamInfoList(data).then((res) => {
          console.log("res", res);
          if (res.data.success) {
            let { pageNum, pageSize, total, data } = res.data.data;
            this.pagination["total"] = total;
            this.teamList = data;
          }
        });
      }
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    handleClick(item) {
      if (this.activeTeam.includes(item)) {
        this.activeTeam = this.activeTeam.filter((item) => item !== item);
      } else {
        this.activeTeam.push(item);
      }
    },
    addTeam() {
      this.$refs.AddTeam.initModal();
    },
    palyCurrentTeam(item, type) {
      switch (type) {
        case "look":
          // 查看详情
          this.$router.push({
            path: "/thepool/collaboration/team/detail",
            query: { id: item.teamId },
          });
          break;
        case "edit":
          // 编辑团队
          this.$refs.AddTeam.setDetail(item);
          break;
        case "del":
          // 删除团队
          this.$alert(
            this.$t("consult.确定要删除吗？"),
            this.$t("consult.删除"),
            {
              confirmButtonText: this.$t("consult.确定"),
            }
          ).then(() => {
            delTeam({ teamId: item.teamId }).then((res) => {
              if (res.data.success) {
                this.$message.success(this.$t("consult.成功"));
                this.getList();
              }
            });
          });
          break;
      }
    },
    changeCheckbox(e) {
      this.pagination["current"] = 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.team {
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  .team_top {
    margin-bottom: 20px;
    .team_top_title {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 18px;
      color: #333333;
    }
  }
  .team_list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .team_item {
      width: 100%;
      border-radius: 6px;
      border: 1px solid #d6d6d6;
      margin-bottom: 10px;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        border-color: #d4ab85;
      }

      .team_item_top {
        border-radius: 6px 6px 0 0;
        padding: 10px 15px;
        background: #e7f1fb;

        .team_item_title {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #333333;
        }
        .team_item_new {
          color: #ffffff;
          padding: 2px 10px;
          background: #9cd1a0;
          border-radius: 12px;
        }
      }
      .team_item_content {
        padding: 10px 15px;
        .team_item_detail {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: left;
          margin: 10px 0;
          height: 40px;
        }
        .team_item_num {
          .text {
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #999999;
            line-height: 20px;
            margin-right: 5px;
          }
          .num {
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 26px;
            color: #d4ab85;
            line-height: 28px;
          }
        }
        .team_item_btn {
          margin-top: 10px;
          .el-button--text {
            color: #666666 !important;
          }
        }
      }
    }
    .active_item {
      border-color: #d4ab85;
    }
  }
}
</style>
