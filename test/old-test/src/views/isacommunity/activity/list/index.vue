<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.活动列表") }}</div>
      <div class="community_top_btn">
        <el-button type="primary" size="large" @click="showForm('add')">{{
          $t("btn.新增")
        }}</el-button>
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
          <el-form-item style="width: 180px" v-if="dictionary['school'].length > 1">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['schoolIds']"
              :placeholder="$t('isagroup.请选择学校')"
            >
              <el-option
                :key="k"
                v-for="(i, k) in dictionary['school']"
                :label="i.enName"
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
          <el-form-item style="width: 180px">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['wechatNotify']"
              :placeholder="$t('isagroup.微信提醒')"
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
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['busdriver_del']"
              size="small"
              type="danger"
              plain
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
    <!-- 新增编辑弹窗 -->
    <Form ref="Form" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getActivityPage, delActivity } from "@/api/isacommunity/activity.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "./modal/form.vue";
import dayjs from "dayjs";
export default {
  name: "teacher",
  components: { Table, Pagination, Form },
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
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        {
          name: "查看",
          type: "look",
          icon: "",
          permissions: "",
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
    ...mapGetters(["permissions", "i18nlocel", "dictionary"]),
  },
  watch: {
    i18nlocel: {
      handler(newVal, oldVal) {
        this.formatData();
      },
    },
  },
  methods: {
    initData() {
      if (this.dictionary["school"].length == 1) {
        this.schoolId = this.dictionary["school"][0].id;
        this.pagination["schoolIds"] = this.schoolId;
      }
      this.getList();
    },
    getList() {
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
        this.dictionary["school"].map((school) => {
          if (item["schoolIds"].includes(school.id)) {
            schoolIdsLabel.push(school.enName);
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
        item["wechatNotifyLabel"] = this.$getListLabel(
          consts["yesOrno"],
          item["wechatNotify"]
        );
        item["recommendedLabel"] = this.$getListLabel(
          consts["yesOrno"],
          item["recommended"]
        );
        item["bannerLabel"] = this.$getListLabel(consts["yesOrno"], item["banner"]);
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
          this.showForm("edit", item);
          break;
      }
    },
    delData() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length == 0) {
        this.$message.warning(this.$t("isagroup.请选择要删除的数据"));
      } else {
        this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
          confirmButtonText: this.$t("isagroup.确定"),
        }).then(() => {
          delActivity({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        });
      }
    },
    rowClick(row) {
      console.log("rowClick", row);
      //   this.$refs["Detail"].showModal(row);
      this.$router.push({
        path: "/isacommunity/activity/detail/index",
        query: {
          id: row.id,
        },
      });
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
    showForm(type, item = {}) {
      this.$refs.Form.showForm(type, item);
    },
    batchUpdload() {
      this.$refs.BatchUpdload.showUpload = true;
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
