<template>
  <div class="thepool_page">
    <div class="searchFromBox search" style="padding: 20px">
      <el-form
        ref="searchFrom"
        class="df_align_center searchFrom"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item
          :label="$t('consult.任务主题')"
          prop="taskSubject"
          style="width: 214px"
        >
          <el-input
            v-model="searchFrom.taskSubject"
            :placeholder="$t('consult.请输入')"
            maxlength="20"
            clearable
            @clear="search"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.所有角色')" style="width: 214px">
          <el-select
            v-model="searchFrom.roleType"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="item in consult['roleTypeList']"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('consult.优先级')" style="width: 214px">
          <el-select
            v-model="searchFrom.priority"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="item in consult['priorityList']"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('consult.完成状态')" style="width: 214px">
          <el-select
            v-model="searchFrom.taskType"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="item in consult['completeStatus']"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 110px; margin-right: 0">
          <div class="df_sb">
            <el-button
              type="defult"
              size="small"
              icon="el-icon-search"
              round
              @click="search"
              >{{ $t("consult.搜索") }}</el-button
            >
            <el-button type="text" size="small" round @click="clear">
              <div class="clear_btn">
                <img src="/thepool/other/clear.png" alt="" />
                <span> {{ $t("consult.清除") }}</span>
              </div>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox" style="padding-top: 0">
      <div class="df_sb">
        <el-button
          v-if="permissions['task_add']"
          type="primary"
          size="small"
          round
          @click="addTask"
          >{{ $t("consult.新增") }}</el-button
        >
      </div>
      <div class="df_sb">
        <el-checkbox
          style="margin-right: 20px"
          v-if="permissions['task_all_list'] && taskType == 'list'"
          class="checkbox_center"
          @change="changeCheckbox"
          v-model="isAllTask"
          >{{ $t("consult.查看全部任务") }}</el-checkbox
        >
        <div class="df_sb">
          <img
            v-if="taskType == 'list'"
            class="taskType_icon"
            src="/thepool/other/team_list_on.png"
            alt=""
          />
          <img
            v-else
            @click="taskType = 'list'"
            class="taskType_icon"
            src="/thepool/other/team_list_off.png"
            alt=""
          />
        </div>
        <div class="df_sb">
          <img
            v-if="taskType == 'board'"
            class="taskType_icon"
            src="/thepool/other/team_board_on.png"
            alt=""
          />
          <img
            v-else
            @click="taskType = 'board'"
            class="taskType_icon"
            src="/thepool/other/team_board_off.png"
            alt=""
          />
        </div>
      </div>
      <!-- <el-select
        @change="changeType"
        v-model="taskType"
        :placeholder="$t('consult.请选择')"
      >
        <el-option :label="$t('consult.列表视图')" :value="'list'"></el-option>
        <el-option :label="$t('consult.看板视图')" :value="'board'"></el-option>
      </el-select> -->
    </div>
    <div class="tableBox" v-if="taskType == 'list'">
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        @row-click="rowClick"
        :header-cell-style="tablestyle.headercellstyle"
        :cell-style="tablestyle.rowstyle"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(i, k) in tableTitle"
          :key="k"
          :prop="i.prop"
          :label="$t('consult')[i.label]"
          show-overflow-tooltip
          :width="`${i.width}`"
          :fixed="i.fixed"
        >
          <template slot-scope="scope">
            <span v-if="i.prop != 'personInChargeName'" class="tableColumnSpan">
              {{
                scope.row[i.prop] === null ||
                scope.row[i.prop] === "" ||
                scope.row[i.prop] === undefined
                  ? "--"
                  : String(scope.row[i.prop])
              }}
            </span>
            <el-popover v-else placement="left" width="400" trigger="hover">
              <div class="popoverBox">
                <div class="popoverinfo">
                  <span>{{ $t("consult.部门") }}：</span>
                  <span>{{ scope.row["taskUser"].taskUserDept || "--" }}</span>
                </div>
                <div class="popoverinfo">
                  <span>{{ $t("consult.邮箱") }}：</span>
                  <span>{{ scope.row["taskUser"].taskUserEmail || "--" }}</span>
                </div>
                <div class="popoverinfo">
                  <span>{{ $t("consult.电话") }}：</span>
                  <span>{{ scope.row["taskUser"].taskUserPhone || "--" }}</span>
                </div>
              </div>
              <span slot="reference">{{ scope.row[i.prop] }}</span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Table
        ref="Table"
        :showSelection="false"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        @rowClick="rowClick"
      /> -->
      <div
        class="df_sb palyTableBox"
        style="padding: 0"
        v-if="paginationTotal > 10"
      >
        <PaginationInfo :paginationTotal="paginationTotal" />
        <Pagination
          :total="paginationTotal"
          :pagination="pagination"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>
    </div>
    <div class="taskboard" v-else>
      <div class="taskboard_type">
        <div class="taskboard_list_title">
          {{ $t("consult.全部任务") }}
          <span class="num">{{ taskBoardAll["taskCount"] }}</span>
        </div>
        <div class="taskboard_list">
          <div
            @click="rowClick(item)"
            class="taskboard_item"
            v-for="item in taskBoardAll['taskList']"
            :key="item.taskId"
          >
            <div class="taskboard_text">
              {{ item.taskSubject }}
            </div>
            <div class="taskboard_info">
              <span class="taskboard_item_clue" :title="item.clueName">{{
                item.clueName
              }}</span>
              <div class="taskboard_item_name">
                {{ item.taskUser["taskUserName"] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="taskboard_type">
        <div class="taskboard_list_title">
          {{ $t("consult.今天要做") }}
          <span class="num">{{ taskBoardToday["taskCount"] }}</span>
        </div>
        <div class="taskboard_list">
          <div
            @click="rowClick(item)"
            class="taskboard_item"
            v-for="item in taskBoardToday['taskList']"
            :key="item.taskId"
          >
            <div class="taskboard_text">
              {{ item.taskSubject }}
            </div>
            <div class="taskboard_info">
              <span class="taskboard_item_clue" :title="item.clueName">{{
                item.clueName
              }}</span>
              <div class="taskboard_item_name">
                {{ item.taskUser["taskUserName"] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="taskboard_type">
        <div class="taskboard_list_title">
          {{ $t("consult.周内要做") }}
          <span class="num">{{ taskBoardWeek["taskCount"] }}</span>
        </div>
        <div class="taskboard_list">
          <div
            @click="rowClick(item)"
            class="taskboard_item"
            v-for="item in taskBoardWeek['taskList']"
            :key="item.taskId"
          >
            <div class="taskboard_text">
              {{ item.taskSubject }}
            </div>
            <div class="taskboard_info">
              <span class="taskboard_item_clue" :title="item.clueName">{{
                item.clueName
              }}</span>
              <div class="taskboard_item_name">
                {{ item.taskUser["taskUserName"] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="taskboard_type">
        <div class="taskboard_list_title">
          {{ $t("consult.未来要做") }}
          <span class="num">{{ taskBoardFuture["taskCount"] }}</span>
        </div>
        <div class="taskboard_list">
          <div
            @click="rowClick(item)"
            class="taskboard_item"
            v-for="item in taskBoardFuture['taskList']"
            :key="item.taskId"
          >
            <div class="taskboard_text">
              {{ item.taskSubject }}
            </div>
            <div class="taskboard_info">
              <span class="taskboard_item_clue" :title="item.clueName">{{
                item.clueName
              }}</span>
              <div class="taskboard_item_name">
                {{ item.taskUser["taskUserName"] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增任务 -->
    <AddTask ref="AddTask" @initData="changeType(taskType)" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getTaskInfoList,
  getAllTaskInfoList,
  getTaskBoard,
} from "@/api/consult/task.js";
import { consult } from "@/const/consult/index.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import AddTask from "@/page/thepool/task/modal/addtask.vue";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    AddTask,
    PaginationInfo,
  },
  data() {
    return {
      taskType: "list",
      consult: consult,
      tablestyle: consult["tablestyle"],
      tableTitle: consult["taskTableTitle"],
      tableData: [],
      tableBtn: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      paginationTotal: 0,
      searchFrom: {},
      taskBoardAll: { taskList: [], taskCount: 0 },
      taskBoardToday: { taskList: [], taskCount: 0 },
      taskBoardWeek: { taskList: [], taskCount: 0 },
      taskBoardFuture: { taskList: [], taskCount: 0 },
      isAllTask: false,
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "permissions", "pooldictpermissions"]),
  },

  created() {
    this.getList();
    this.getTaskBoard();
  },
  mounted() {},
  activated() {
    this.getList();
    this.getTaskBoard();
  },
  methods: {
    getList() {
      if (!this.isAllTask) {
        getTaskInfoList({
          ...this.pagination,
          ...this.searchFrom,
        }).then((res) => {
          console.log("res", res);
          this.setTable(res);
        });
      } else {
        getAllTaskInfoList({
          ...this.pagination,
          ...this.searchFrom,
        }).then((res) => {
          console.log("res", res);
          this.setTable(res);
        });
      }
    },
    setTable(res) {
      if (res.data.success) {
        let { data, total } = res.data.data;
        this.tableData = data;
        this.paginationTotal = Number(total);
        this.tableData.map((item) => {
          item["taskUser"] = item["taskUser"] || {};
          item.taskTimeTypeLabel = this.$getListLabel(
            consult["taskTimeType"],
            item.taskTimeType
          );
          item.personInChargeName = item["taskUser"]["taskUserName"] || "--";
        });
      }
    },
    getTaskBoard() {
      getTaskBoard({
        ...this.searchFrom,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let data = res.data.data;
          this.$nextTick(() => {
            data.map((item) => {
              let taskType = String(item["taskType"]);
              let taskList = item["taskList"] || [];
              let taskCount = item["taskCount"] || 0;

              switch (taskType) {
                case "0":
                  this.taskBoardAll = {
                    ...this.taskBoardAll,
                    taskList: taskList,
                    taskCount: taskCount,
                  };
                  console.log("taskType", taskType);
                  console.log("taskList", taskList);
                  console.log("this.taskBoardAll", this.taskBoardAll);
                  break;
                case "1":
                  this.taskBoardToday = {
                    ...this.taskBoardToday,
                    taskList: taskList,
                    taskCount: taskCount,
                  };
                  break;
                case "2":
                  this.taskBoardWeek = {
                    ...this.taskBoardWeek,
                    taskList: taskList,
                    taskCount: taskCount,
                  };
                  break;
                case "3":
                  this.taskBoardFuture = {
                    ...this.taskBoardFuture,
                    taskList: taskList,
                    taskCount: taskCount,
                  };
                  break;
              }
            });
          });
        }
      });
    },

    rowClick(row) {
      this.$router.push(
        "/thepool/collaboration/task/detail?taskId=" + row.taskId
      );
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getList();
    },
    // 搜索
    search() {
      this.pagination["pageNum"] = 1;
      if (this.taskType == "list") {
        this.getList();
      } else {
        this.getTaskBoard();
      }
    },
    // 清除搜索
    clear() {
      this.pagination["pageNum"] = 1;
      this.searchFrom = {};
      if (this.taskType == "list") {
        this.getList();
      } else {
        this.getTaskBoard();
      }
    },
    // 新增任务
    addTask() {
      this.$refs.AddTask.initModal();
    },
    changeType(e) {
      if (e == "list") {
        this.getList();
      } else {
        this.getTaskBoard();
      }
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 > 0 ? "shinning" : "";
    },
    changeCheckbox(e) {
      this.pagination["pageNum"] = 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-range__close-icon {
  display: none;
}
.searchFrom {
  // justify-content: space-between;
}
.df_align_center {
  flex-wrap: wrap;
}
.taskboard {
  background: #ffffff;
  padding: 20px 20px 30px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  .taskboard_type {
    width: 24%;
    border-radius: 6px;
    border: 1px solid #d6d6d6;
    overflow: hidden;
    .taskboard_list_title {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      text-align: left;
      font-style: normal;
      background: #e7f1fb;
      .num {
        display: inline-block;
        margin-left: 10px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
        text-align: left;
        font-style: normal;
      }
    }
    .taskboard_list {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0;
      height: 500px;
      overflow: auto;
      .taskboard_item {
        cursor: pointer;
        padding: 10px 20px;
        background: #ffffff;

        &:nth-of-type(even) {
          background: #f8f9fa;
        }
        .taskboard_text {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          line-height: 20px;
          text-align: left;
          font-style: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          &:hover {
            color: #d4ab85;
          }
        }
        .taskboard_info {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .taskboard_item_clue {
          display: inline-block;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
          line-height: 17px;
          text-align: left;
          font-style: normal;
        }
        .taskboard_item_name {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
          line-height: 17px;
          text-align: center;
          font-style: normal;
        }
      }
    }
  }
}
.popoverBox {
  .popoverinfo {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 16px;
    text-align: left;
    font-style: normal;
  }
}
.taskType_icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
}
</style>
