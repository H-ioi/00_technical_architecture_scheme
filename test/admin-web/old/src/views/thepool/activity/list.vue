<template>
  <div class="space thepool_page">
    <el-scrollbar class="space_right" ref="space_right">
      <div class="df_fa" style="height: 100%">
        <el-scrollbar class="scrollList">
          <div
            @click="changeSchool(i)"
            :class="[
              'scrollItem',
              {
                scrollItem_active: currentSchool == i.value,
              },
            ]"
            v-for="(i, k) in dictpermissions['order_school']"
            :key="k"
          >
            {{ i18nlocel == "en" ? i.enLabel : i.label }}
          </div>
        </el-scrollbar>
        <div style="flex: 1; height: 100%; background: #ffffff">
          <div class="searchFromBox search" style="padding: 20px">
            <el-form
              ref="searchFrom"
              class="df_align_center searchFrom"
              :label-position="'top'"
              :inline="true"
              :model="searchFrom"
            >
              <el-form-item
                :label="$t('consult.活动名称')"
                prop="activityName"
                style="width: 320px"
              >
                <el-input
                  v-model="searchFrom.activityName"
                  :placeholder="$t('consult.请输入')"
                  maxlength="20"
                  clearable
                  @clear="search"
                  @keyup.enter.native="search"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('consult.创建时间')"
                style="width: 320px"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="searchFrom.activityTime"
                  type="daterange"
                  :range-separator="$t('consult.至')"
                  :start-placeholder="$t('consult.开始')"
                  :end-placeholder="$t('consult.结束')"
                  :value-format="'yyyy-MM-dd'"
                  :format="'yyyy-MM-dd'"
                  clearable
                  @clear="search"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item style="width: 160px; margin-right: 0">
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
          <div class="df_sb palyTableBox">
            <div class="df_sb">
              <div class="df_sb">
                <el-button
                  v-if="permissions['thepool_activity_add']"
                  type="primary"
                  size="small"
                  round
                  @click="addActivity"
                  >{{ $t("consult.新增") }}</el-button
                >
              </div>
            </div>
          </div>
          <div class="tableBox">
            <Table
              ref="Table"
              :tableTitle="tableTitle"
              :tableData="tableData"
              :tableBtn="tableBtn"
              :showSelection="false"
              @playTab="playTab"
              @rowClick="rowClick"
            />
            <div
              class="df_sb palyTableBox"
              v-if="paginationTotal > 10"
              style="padding: 0"
            >
              <PaginationInfo :paginationTotal="paginationTotal" />
              <Pagination
                :total="paginationTotal"
                :pagination="pagination"
                @handleCurrentChange="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- 新增编辑活动 -->
    <AddActivity ref="AddActivity" @initData="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getActivityList,
  delActivity,
  delConfirmActivity,
} from "@/api/consult/activity.js";
import { consult } from "@/const/consult/index.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import AddActivity from "@/page/thepool/modal/addactivity.vue";
export default {
  components: {
    Pagination,
    PaginationInfo,
    Table,
    AddActivity,
  },
  data() {
    return {
      currentSchool: "",
      searchData: {},
      searchFrom: {
        activityName: "",
        activityTime: [],
      },
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      tableTitle: consult["activityTableTitle"],
      tableData: [],
      tableBtn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "thepool_activity_edit",
          icon: "el-icon-view",
        },
        {
          name: "删除",
          type: "del",
          permissions: "thepool_activity_del",
          icon: "el-icon-view",
        },
      ],
    };
  },
  created() {
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
    this.initData();
  },
  activated() {},
  computed: {
    ...mapGetters([
      "permissions",
      "dictpermissions",
      "dictionary",
      "i18nlocel",
    ]),
  },
  methods: {
    // 初始化数据
    initData() {
      if (this.dictpermissions["order_school"].length > 0) {
        this.currentSchool = this.dictpermissions["order_school"][0]["value"];
        this.pagination["schools"] = [this.currentSchool];
      }
      this.getList();
    },
    getList() {
      getActivityList({ ...this.pagination, ...this.searchData }).then(
        (res) => {
          if (res.data.success) {
            let { data, total } = res.data.data;
            this.tableData = data;
            this.paginationTotal = total;
            this.tableData.map((item) => {
              item["activityTypeLabel"] = this.getDatastr(
                item.activityType,
                this.dictionary["activity_type"]
              );
              // item["schoolsLabel"] = String(
              //   item.schools.map((school) => {
              //     return this.getDatastr(school, this.pooldictionary);
              //   })
              // );
            });
            console.log("getActivityList", this.tableData);
          }
        }
      );
    },
    // 切换校区
    changeSchool(item) {
      this.currentSchool = item.value;
      this.pagination["current"] = 1;
      this.pagination["schools"] = [item.value];
      this.getList();
    },
    // 表格操作
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.$router.push("/thepool/activity/detail?id=" + item.id);
          break;
        case "edit":
          this.$refs["AddActivity"].getDetail(item.id);
          break;
        case "del":
          delConfirmActivity(item.id).then((res) => {
            if (res.data.data) {
              this.$alert(
                this.$t(
                  "consult.当前活动关联的收集表已有数据，确定要删除活动吗"
                ),
                this.$t("consult.删除"),
                {
                  confirmButtonText: this.$t("consult.确定"),
                }
              ).then(() => {
                this.delActivity(item.id);
              });
            } else {
              this.delActivity(item.id);
            }
          });

          break;
      }
    },
    delActivity(id) {
      delActivity(id).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.getList();
        }
      });
    },
    rowClick(row, column, event) {
      this.$router.push("/thepool/activity/detail?id=" + row.id);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    // 新增活动
    addActivity() {
      this.$refs["AddActivity"].show(this.currentSchool);
    },
    // 搜索
    search() {
      this.pagination["current"] = 1;
      this.searchData = {};
      this.searchData["activityName"] = this.searchFrom["activityName"];
      if (this.searchFrom["activityTime"].length > 0) {
        this.searchData["createTimeBegin"] = this.searchFrom["activityTime"][0];
        this.searchData["createTimeEnd"] = this.searchFrom["activityTime"][1];
      }
      this.getList();
    },
    // 清除搜索
    clear() {
      this.pagination["current"] = 1;
      this.searchData = {};
      this.searchFrom = {
        activityName: "",
        activityTime: [],
      };
      this.getList();
    },
    getDatastr(id, data) {
      console.log("getDataLabel", id, data);
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return (
          res["permissions"] == "look" || this.permissions[res["permissions"]]
        );
      });
      return tableBtn;
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  box-shadow: none !important;
  padding-bottom: 0px !important;
}
</style>
