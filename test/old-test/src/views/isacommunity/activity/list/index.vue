<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.活动列表") }}</div>
      <div class="community_top_btn">
        <el-button type="primary" size="large" @click="goCreate">
          {{ $t("btn.新增") }}
        </el-button>
        <el-button
          v-if="permissions['busdriver_edit']"
          type="primary"
          size="large"
          plain
          :disabled="selectionCount === 0"
          @click="handleSelectedWechat(false)"
        >
          {{ $t("btn.发送到微信") }}
        </el-button>
        <el-button
          v-if="permissions['busdriver_edit']"
          type="primary"
          size="large"
          plain
          :disabled="selectionCount === 0"
          @click="handleSelectedWechat(true)"
        >
          {{ $t("btn.发送到微信测试") }}
        </el-button>
        <el-button
          v-if="permissions['busdriver_edit']"
          type="primary"
          size="large"
          plain
          :disabled="selectionCount === 0"
          @click="handleExportFeedback"
        >
          {{ $t("isagroup.导出反馈") }}
        </el-button>
        <el-button
          v-if="permissions['busdriver_edit']"
          type="primary"
          size="large"
          plain
          :disabled="selectionCount === 0"
          @click="handleExportQuestionnaire"
        >
          {{ $t("isagroup.导出问卷答案") }}
        </el-button>
      </div>
    </div>
    <div class="community_centent">
      <div class="community_searchFrom">
        <el-form
          class="df_align_center"
          :label-position="'top'"
          :inline="true"
          :model="searchFrom"
        >
          <el-form-item style="width: 180px">
            <el-input
              clearable
              style="width: 100%"
              v-model="searchFrom['activityCnName']"
              :placeholder="$t('isagroup.中文名')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-input
              clearable
              style="width: 100%"
              v-model="searchFrom['activityEnName']"
              :placeholder="$t('isagroup.英文名')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 180px" v-if="schoolSelectList.length > 1">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['schoolIds']"
              :placeholder="$t('isagroup.请选择学校')"
            >
              <el-option
                :key="k"
                v-for="(i, k) in schoolSelectList"
                :label="schoolDropdownLabel(i)"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="width: 180px">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['activityStatus']"
              :placeholder="$t('isagroup.状态')"
            >
              <el-option
                :key="k"
                v-for="(i, k) in consts['activityStatus']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['isBanner']"
              :placeholder="$t('isagroup.是否Banner')"
            >
              <el-option
                :key="k"
                v-for="(i, k) in consts['yesOrno']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['recommended']"
              :placeholder="$t('isagroup.是否推荐')"
            >
              <el-option
                :key="k"
                v-for="(i, k) in consts['yesOrno']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 微信提醒（筛选）暂时下线
          <el-form-item style="width: 180px">
            <el-select clearable style="width: 100%" v-model="searchFrom['wechatNotify']"
              :placeholder="$t('isagroup.微信提醒')">
              <el-option :key="k" v-for="(i, k) in consts['yesOrno']" :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          -->
          <el-form-item style="width: 180px">
            <el-date-picker
              style="width: 100%"
              v-model="searchFrom['activityStartTime']"
              type="datetime"
              :placeholder="$t('isagroup.开始时间')"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-date-picker
              style="width: 100%"
              v-model="searchFrom['activityEndTime']"
              type="datetime"
              :placeholder="$t('isagroup.结束时间')"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: auto; margin-right: 0">
            <el-button
              class="button_text"
              size="medium"
              type="text"
              icon="el-icon-refresh-right"
              @click="clear"
              >{{ $t("btn.重置") }}</el-button
            >
            <el-button size="medium" type="primary" @click="getList">{{
              $t("btn.查询")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="isa_table">
        <Table
          ref="Table"
          :showSelection="true"
          :tableTitle="tabletitle['activityTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          :tableType="'activity'"
          @playTab="playTab"
          @rowClick="rowClick"
          @selection-change="handleSelectionChange"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['busdriver_edit']"
              size="small"
              type="primary"
              plain
              @click="publishData"
            >
              发布
            </el-button>
            <el-button
              v-if="permissions['busdriver_edit']"
              size="small"
              type="warning"
              plain
              style="margin-left: 8px"
              @click="cancelPublishData"
            >
              取消发布
            </el-button>
            <el-button
              v-if="permissions['busdriver_del']"
              size="small"
              type="danger"
              plain
              style="margin-left: 8px"
              @click="delData"
              >{{ $t("btn.删除") }}</el-button
            >
          </div>
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  batchPublishActivityStatus,
  batchResetActivityStatusToPending,
  delActivity,
  getActivityPage,
  sendWechatMessage,
  sendWechatMessageTest,
} from "@/api/isacommunity/activity.js";
import { exportActivityFeedback } from "@/api/isacommunity/feedback.js";
import { exportQuestionnaireByActivity } from "@/api/isacommunity/questionnaire.js";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Table from "@/components/communitycommon/Table.vue";
import {
  navigateToActivityCreate,
  navigateToActivityDetail,
  navigateToActivityEdit,
} from "@/const/isacommunity/activityRoutes.js";
import consts from "@/const/isacommunity/consts.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import { download, downloadFile } from "@/util/download.js";
import dayjs from "dayjs";
import { mapGetters } from "vuex";
export default {
  name: "teacher",
  mixins: [schoolListBuscommonMixin],
  components: { Table, Pagination },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      searchFrom: {},
      selectionCount: 0,
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        {
          name: "查看",
          type: "look",
          icon: "",
          permissions: "look",
        },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "busdriver_edit",
        },
      ],
      schoolList: [],
      roleList: [],
      detailData: {},
      schoolId: "",
    };
  },
  created() {
    this.getBtn();
    this.initData();
  },
  mounted() {},
  activated() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  watch: {
    i18nlocel: {
      handler(newVal, oldVal) {
        this.formatData();
      },
    },
    "$route.query._menuTap"() {
      if (this.$route.query._menuTap != null) {
        this.getList();
      }
    },
  },
  methods: {
    async initData() {
      await this.fetchSchoolListBuscommon();
      if (this.schoolSelectList.length === 1) {
        this.schoolId = this.schoolSelectList[0].id;
        this.pagination["schoolIds"] = this.schoolId;
      }
      this.getList();
    },
    getList() {
      this.selectionCount = 0;
      getActivityPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getActivityPage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        let schoolIdsLabel = [];
        this.schoolSelectList.forEach((school) => {
          if (item["schoolIds"].includes(school.id)) {
            schoolIdsLabel.push(this.schoolDropdownLabel(school));
          }
        });
        item["schoolIdsLabel"] = String(schoolIdsLabel);
        item["activityStatusLabel"] = this.$getListLabel(
          consts["activityStatus"],
          item["activityStatus"]
        );
        item["checkinMethodLabel"] = this.$getListLabel(
          consts["activityCheckinMethod"],
          item["checkinMethod"]
        );
        // item["wechatNotifyLabel"] = this.$getListLabel(
        //   consts["yesOrno"],
        //   item["wechatNotify"]
        // );
        item["recommendedLabel"] = this.$getListLabel(
          consts["yesOrno"],
          item["recommended"]
        );
        item["bannerLabel"] = this.$getListLabel(
          consts["yesOrno"],
          item["banner"]
        );
        item["createTime"] = item["createTime"]
          ? dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm")
          : "--";
        item["activityStartTime"] = item["activityStartTime"]
          ? dayjs(item["activityStartTime"]).format("YYYY-MM-DD HH:mm")
          : "--";
        item["activityEndTime"] = item["activityEndTime"]
          ? dayjs(item["activityEndTime"]).format("YYYY-MM-DD HH:mm")
          : "--";
      });
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          this.rowClick(item);
          break;
        case "edit":
          if (String(item.activityStatus) === "3") {
            this.$message.warning(this.$t("isagroup.活动已结束不可编辑"));
            return;
          }
          navigateToActivityEdit(this.$router, item.id);
          break;
      }
    },
    handleSelectionChange(arr) {
      this.selectionCount = Array.isArray(arr) ? arr.length : 0;
    },
    handleSelectedWechat(isTest = false) {
      const selectionId = this.$refs.Table.selectionId || [];
      if (selectionId.length === 0) {
        this.$message.warning("请选择活动数据");
        return;
      }
      const selectedRows = this.tableData.filter((row) =>
        selectionId.some((id) => String(row.id) === String(id))
      );
      if (selectedRows.length === 0) {
        this.$message.warning("未找到选中的活动");
        return;
      }
      this.handleSendWechat(selectedRows, isTest);
    },
    handleSendWechat(items, isTest = false) {
      const req = isTest ? sendWechatMessageTest : sendWechatMessage;
      const title = isTest ? "发送到微信测试" : "发送到微信";
      this.$confirm(`确定${title}吗？`, this.$t("isagroup.提示"), {
        type: "warning",
      })
        .then(async () => {
          const list = Array.isArray(items) ? items : [items];
          const results = await Promise.all(
            list.map((item) =>
              req(item.id).then(
                (res) => !!(res && res.data && res.data.success)
              )
            )
          );
          if (results.every(Boolean)) {
            this.$message.success(this.$t("isagroup.成功"));
          } else {
            this.$message.warning("部分活动发送失败");
          }
        })
        .catch(() => {});
    },
    /** 勾选活动后批量导出反馈（每个活动一份文件） */
    async handleExportFeedback() {
      const selectionId = this.$refs.Table.selectionId || [];
      if (selectionId.length === 0) {
        this.$message.warning("请选择活动数据");
        return;
      }
      try {
        for (const id of selectionId) {
          const res = await exportActivityFeedback(id);
          const cd = res.headers["content-disposition"];
          if (cd && cd.indexOf("=") !== -1) {
            download(res.data, cd);
          } else {
            downloadFile(res.data, `activity-feedback-${id}.xlsx`);
          }
        }
        this.$message.success(this.$t("isagroup.成功"));
      } catch (e) {
        this.$message.error(e.message || "导出失败");
      }
    },
    /** 勾选活动后批量导出问卷答案（每个活动一份文件） */
    async handleExportQuestionnaire() {
      const selectionId = this.$refs.Table.selectionId || [];
      if (selectionId.length === 0) {
        this.$message.warning("请选择活动数据");
        return;
      }
      try {
        for (const id of selectionId) {
          const res = await exportQuestionnaireByActivity(id);
          const cd = res.headers["content-disposition"];
          if (cd && cd.indexOf("=") !== -1) {
            download(res.data, cd);
          } else {
            downloadFile(res.data, `questionnaire-answers-${id}.xlsx`);
          }
        }
        this.$message.success(this.$t("isagroup.成功"));
      } catch (e) {
        this.$message.error(e.message || "导出失败");
      }
    },
    publishData() {
      const selectionId = this.$refs.Table.selectionId || [];
      if (selectionId.length === 0) {
        this.$message.warning("请选择活动数据");
        return;
      }
      const idSet = new Set(selectionId.map((id) => String(id)));
      const pendingRows = this.tableData.filter(
        (row) => idSet.has(String(row.id)) && String(row.activityStatus) === "0"
      );
      const ids = pendingRows
        .map((row) => Number(row.id))
        .filter((n) => Number.isFinite(n));
      if (ids.length === 0) {
        this.$message.warning("所选活动中没有待发布状态的活动");
        return;
      }
      const skipped = selectionId.length - pendingRows.length;
      const tip =
        skipped > 0
          ? `将发布 ${ids.length} 个待发布活动（已跳过 ${skipped} 个非待发布）。是否继续？`
          : `确定将选中的 ${ids.length} 个待发布活动批量发布吗？`;
      this.$confirm(tip, this.$t("isagroup.提示"), {
        type: "warning",
      })
        .then(() => {
          batchPublishActivityStatus(ids).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
              this.selectionCount = 0;
            } else if (res.data.msg) {
              this.$message.warning(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    cancelPublishData() {
      const selectionId = this.$refs.Table.selectionId || [];
      if (selectionId.length === 0) {
        this.$message.warning("请选择活动数据");
        return;
      }
      const ids = selectionId
        .map((id) => Number(id))
        .filter((n) => Number.isFinite(n));
      if (ids.length === 0) {
        this.$message.warning("所选活动ID无效");
        return;
      }
      this.$confirm(
        `确定将选中的 ${ids.length} 个活动批量取消发布吗？`,
        this.$t("isagroup.提示"),
        {
          type: "warning",
        }
      )
        .then(() => {
          batchResetActivityStatusToPending(ids).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
              this.selectionCount = 0;
            } else if (res.data.msg) {
              this.$message.warning(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    delData() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length == 0) {
        this.$message.warning(this.$t("isagroup.请选择要删除的数据"));
      } else {
        this.$alert(
          this.$t("isagroup.确定要删除吗？"),
          this.$t("isagroup.删除"),
          {
            confirmButtonText: this.$t("isagroup.确定"),
          }
        ).then(() => {
          delActivity({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
              this.selectionCount = 0;
            }
          });
        });
      }
    },
    rowClick(row) {
      navigateToActivityDetail(this.$router, row.id);
    },
    clear() {
      this.searchFrom = {};
      this.getList();
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    getBtn() {
      this.tableBtn = this.permissionsBtn.filter((item) => {
        return this.permissions[item["permissions"]] || item["type"] == "look";
      });
    },
    goCreate() {
      navigateToActivityCreate(this.$router);
    },
  },
};
</script>

<style lang="scss" scoped>
.tablelist {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
