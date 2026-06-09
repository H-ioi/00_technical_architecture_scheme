<template>
  <div class="thepool_page">
    <div class="schedule">
      <el-scrollbar style="height: 100%">
        <div class="schedule_top">
          <el-input
            style="width: 200px; margin-bottom: 20px"
            v-model="searchFrom['eventSubject']"
            placeholder="输入关键字"
            @change="changeWord"
            @keyup.enter.native="changeWord"
            clearable
            @clear="changeWord"
          ></el-input>
          <div class="df_sb">
            <el-date-picker
              v-model="searchFrom['eventTime']"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="changeEventTime"
            >
            </el-date-picker>
            <div class="df_sb">
              <el-checkbox
                style="margin: 0"
                class="checkbox_center"
                @change="changeCheckbox"
                v-model="searchFrom['showTodayAndAfter']"
                >{{ $t("consult.显示今天及以后的事件") }}</el-checkbox
              >
              <el-checkbox
                style="margin-left: 20px"
                v-if="permissions['event_all_list']"
                class="checkbox_center"
                @change="changeAllEvent"
                v-model="isAllEvent"
                >{{ $t("consult.查看全部事件") }}</el-checkbox
              >
            </div>
          </div>
        </div>
        <div class="schedule_content">
          <div class="schedule_list" v-if="scheduleList.length > 0">
            <div
              class="schedule_item"
              @click="toDetail(item)"
              v-for="item in scheduleList"
              :key="item.eventTimeId"
            >
              <div class="schedule_item_title">{{ item.eventSubject }}</div>
              <div class="schedule_item_info">
                <div class="schedule_item_time">
                  {{ $t("consult.开始时间") }}：{{
                    item.startTime.substring(0, 16)
                  }}
                </div>
                <div class="schedule_item_user">{{ item.userName }}</div>
              </div>
            </div>
          </div>
          <el-empty v-else :description="$t('consult.暂无数据')"></el-empty>
        </div>

        <div class="df_sb palyTableBox" style="padding: 0">
          <PaginationInfo
            v-if="paginationTotal > 10"
            :paginationTotal="paginationTotal"
          />
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getEventInfoList, getAllEventList } from "@/api/consult/event.js";
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
      consult: consult,
      tableTitle: consult["taskTableTitle"],
      tableData: [],
      tableBtn: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      paginationTotal: 0,
      searchFrom: {},
      scheduleList: [],
      isAllEvent: false,
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "permissions", "pooldictionary"]),
  },

  created() {
    this.getList();
  },
  mounted() {},
  activated() {
    this.getList();
  },
  methods: {
    getList() {
      let data = {
        ...this.pagination,
      };
      data["eventSubject"] = this.searchFrom["eventSubject"];
      data["showTodayAndAfter"] = this.searchFrom["showTodayAndAfter"];
      if (this.searchFrom["eventTime"]) {
        data["startTime"] = this.searchFrom["eventTime"][0] || "";
        data["endTime"] = this.searchFrom["eventTime"][1] || "";
      }
      if (!this.isAllEvent) {
        getEventInfoList(data).then((res) => {
          console.log("res", res);
          if (res.data.success) {
            let { data, total } = res.data.data;
            this.scheduleList = data;
            this.paginationTotal = Number(total);
          }
        });
      } else {
        getAllEventList(data).then((res) => {
          console.log("res", res);
          if (res.data.success) {
            let { data, total } = res.data.data;
            this.scheduleList = data;
            this.paginationTotal = Number(total);
          }
        });
      }
    },

    toDetail(item) {
      this.$router.push(
        "/thepool/collaboration/event/detail?eventId=" +
          item.eventId +
          "&eventTimeId=" +
          item.eventTimeId
      );
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getList();
    },
    changeEventTime(e) {
      this.getList();
    },
    changeWord(e) {
      this.getList();
    },
    changeCheckbox(e) {
      this.getList();
    },
    changeAllEvent(e) {
      this.pagination["pageNum"] = 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.schedule {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .schedule_top {
    text-align: right;
  }
  .schedule_content {
    flex: 1;
    padding: 10px 0;
    box-sizing: border-box;
  }
  .schedule_list {
    .schedule_item {
      cursor: pointer;
      margin: 10px 5px;
      padding: 15px;
      border-radius: 6px;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid #f5f5f5;
      text-align: left;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.11);
      &:hover {
        border-color: #d4ab85;
      }
      .schedule_item_title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 16px;
        color: #333333;
        line-height: 22px;
        text-align: left;
        font-style: normal;
      }
      .schedule_item_info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .schedule_item_time {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
          line-height: 20px;
          text-align: left;
          font-style: normal;
        }
        .schedule_item_user {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          line-height: 22px;
          text-align: left;
          font-style: normal;
        }
      }
    }
  }
}
</style>
