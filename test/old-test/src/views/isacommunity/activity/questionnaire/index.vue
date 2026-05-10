<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.问卷管理") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['questionnaire_add']"
          type="primary"
          size="large"
          @click="addQuestionnaire"
          >{{ $t("btn.新增") }}</el-button
        >
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
              v-model="searchFrom['name']"
              :placeholder="$t('isagroup.问卷名称')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['schoolIds']"
              :placeholder="$t('isagroup.校区')"
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
              v-model="searchFrom['activityId']"
              :placeholder="$t('isagroup.活动')"
            >
              <el-option
                v-for="(i, k) in activityList"
                :label="i18nlocel == 'en' ? i.activityEnName : i.activityCnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['status']"
              :placeholder="$t('isagroup.是否有效')"
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
              v-model="searchFrom['createStartTime']"
              type="datetime"
              :placeholder="$t('isagroup.开始时间')"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-date-picker
              style="width: 100%"
              v-model="searchFrom['createEndTime']"
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
          :tableTitle="tabletitle['questionnaireTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          @playTab="playTab"
          @rowClick="rowClick"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['questionnaire_delete']"
              size="small"
              type="danger"
              plain
              @click="delData"
              >{{ $t("btn.删除") }}</el-button
            >
            <el-button
              v-if="permissions['questionnaire_edit_status']"
              size="small"
              type="default"
              plain
              @click="editStatus"
              >{{ $t("btn.更改状态") }}</el-button
            >
            <el-button
              v-if="permissions['questionnaire_edit_frozen']"
              size="small"
              type="default"
              plain
              @click="editFrozen"
              >{{ $t("btn.更改冻结状态") }}</el-button
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
    <!-- copy弹窗 -->
    <CopyForm ref="CopyForm" @getList="getList" />
    <FrozenForm ref="FrozenForm" @getList="getList" />
    <StatusForm ref="StatusForm" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getQuestionnairePage,
  delQuestionnaire,
} from "@/api/isacommunity/questionnaire.js";
import { getActivityList } from "@/api/isacommunity/activity.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import CopyForm from "./modal/copy.vue";
import FrozenForm from "./modal/frozen.vue";
import StatusForm from "./modal/status.vue";
import dayjs from "dayjs";
export default {
  name: "teacher",
  components: { Table, Pagination, CopyForm, FrozenForm, StatusForm },
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
          permissions: "questionnaire_edit",
        },
        {
          name: "复制",
          type: "copy",
          icon: "",
          permissions: "questionnaire_copy",
        },
        {
          name: "复制链接",
          type: "link",
          icon: "",
          permissions: "",
        },
        // {
        //   name: "更改状态",
        //   type: "status",
        //   icon: "",
        //   permissions: "busdriver_edit",
        // },
        // {
        //   name: "更改冻结状态",
        //   type: "frozen",
        //   icon: "",
        //   permissions: "busdriver_edit",
        // },
      ],
      schoolList: [],
      roleList: [],
      detailData: {},
      schoolId: "",
      activityList: [],
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
  methods: {
    async initData() {
      this.activityList = await getActivityList();
      this.getList();
    },
    getList() {
      getQuestionnairePage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getList", res.data.data);
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
        item["statusLabel"] = this.$getListLabel(
          consts["yesOrno"],
          String(item["status"])
        );
        item["frozenLabel"] = this.$getListLabel(
          consts["yesOrno"],
          String(item["frozen"])
        );
        item["needStudentInfoLabel"] = this.$getListLabel(
          consts["yesOrno"],
          String(item["needStudentInfo"])
        );
        item["createTime"] = dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm");
        item["updateTime"] = dayjs(item["updateTime"]).format("YYYY-MM-DD HH:mm");
      });
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          this.rowClick(item);
          break;
        case "edit":
          this.$router.push({
            path:
              "/isacommunity/activity/questionnaire/form?id=" + item.id + "&type=edit",
          });
          break;
        case "copy":
          this.$refs.CopyForm.initData(item.id);
          break;
        case "link":
          this.$copyText(
            `${process.env.VUE_APP_BASE_COMMUNITY}/#/isacommunity/activity/questionnaire/signup?id=${item.id}`
          ).then(
            (e) => {
              this.$message.success(this.$t("consult.已复制到粘贴板"));
            },
            (e) => {
              console.log("复制失败：", e);
            }
          );
          break;
        case "status":
          break;
        case "frozen":
          break;
      }
    },
    delData() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length == 0) {
      } else {
        this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
          confirmButtonText: this.$t("isagroup.确定"),
        }).then(() => {
          let formData = new FormData();
          formData.append("ids", selectionId);
          delQuestionnaire(formData).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        });
      }
    },
    editStatus() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length > 0) {
        this.$refs.StatusForm.initData(selectionId);
      } else {
        this.$message.warning(this.$t("isagroup.请选择一条数据进行操作"));
      }
    },
    editFrozen() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length > 0) {
        this.$refs.FrozenForm.initData(selectionId);
      } else {
        this.$message.warning(this.$t("isagroup.请选择一条数据进行操作"));
      }
    },
    copyData() {},
    rowClick(row, column, event) {
      console.log("rowClick", row);
      this.$router.push({
        path: "/isacommunity/activity/questionnaire/templateresult?id=" + row.id,
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
        return (
          item["type"] == "look" ||
          item["type"] == "link" ||
          this.permissions[item["permissions"]]
        );
      });
    },

    addQuestionnaire() {
      this.$router.push({ path: "/isacommunity/activity/questionnaire/form?type=add" });
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
