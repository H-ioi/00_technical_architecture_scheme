<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.文章内容") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['article_add']"
          type="primary"
          size="large"
          @click="showForm('add')"
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
              v-model="searchFrom['title']"
              :placeholder="$t('isagroup.标题')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              style="width: 100%"
              v-model="searchFrom.schoolId"
              :placeholder="$t('isagroup.校区')"
            >
              <el-option
                v-for="(i, k) in schoolList"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              style="width: 100%"
              v-model="searchFrom.categoryId"
              :placeholder="$t('isagroup.内容分类')"
            >
              <el-option
                v-for="(i, k) in categoryList"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              style="width: 100%"
              v-model="searchFrom.importanceLevel"
              :placeholder="$t('isagroup.重要等级')"
            >
              <el-option
                v-for="(i, k) in consts['articleImportent']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              style="width: 100%"
              v-model="searchFrom.visible"
              :placeholder="$t('isagroup.是否可见')"
            >
              <el-option
                v-for="(i, k) in consts['yesOrno']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.boolean"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              style="width: 100%"
              v-model="searchFrom.isBanner"
              :placeholder="$t('isagroup.是否Banner')"
            >
              <el-option
                v-for="(i, k) in consts['yesOrno']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.boolean"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              style="width: 100%"
              v-model="searchFrom.recommended"
              :placeholder="$t('isagroup.是否推荐')"
            >
              <el-option
                v-for="(i, k) in consts['yesOrno']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.boolean"
              ></el-option>
            </el-select>
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
          :showSelection="false"
          :tableTitle="tabletitle['contentArticleTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          :height="520"
          @playTab="playTab"
          @rowClick="rowClick"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <!-- <el-button size="small" type="danger" plain @click="delData">{{
              $t("btn.删除")
            }}</el-button> -->
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
    <Detail ref="Detail" :title="$t('isagroup.详情')" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getContentSchoolList,
  getContentArticlePage,
  delContentArticle,
  getContentCategoryList,
} from "@/api/isacommunity/content.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "./modal/form.vue";
import Detail from "./detail/index.vue";
import dayjs from "dayjs";
export default {
  name: "teacher",
  components: { Table, Pagination, Form, Detail },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      pagination: {
        size: 100,
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
          permissions: "article_edit",
        },
        {
          name: "删除",
          type: "del",
          icon: "",
          permissions: "article_del",
        },
      ],
      schoolList: [],
      categoryList: [],
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
    async initData() {
      this.schoolList = await getContentSchoolList();
      this.categoryList = await getContentCategoryList();
      if (this.schoolList.length == 1) {
        this.pagination["schoolId"] = this.schoolId;
      }
      this.getList();
    },
    getList() {
      getContentArticlePage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getContentArticlePage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        item["importanceLevelLabel"] = this.$getListLabel(
          consts["articleImportent"],
          item["importanceLevel"]
        );
        item["publishStatusLabel"] = item["publishStatus"]
          ? this.$t("isagroup.是")
          : this.$t("isagroup.否");
        item["visibleLabel"] = item["visible"]
          ? this.$t("isagroup.是")
          : this.$t("isagroup.否");
        item["isBannerLabel"] = item["isBanner"]
          ? this.$t("isagroup.是")
          : this.$t("isagroup.否");
        item["recommendedLabel"] = item["recommended"]
          ? this.$t("isagroup.是")
          : this.$t("isagroup.否");
        item["isWechatPushedLabel"] = item["isWechatPushed"]
          ? this.$t("isagroup.是")
          : this.$t("isagroup.否");
        item["schoolName"] =
          this.i18nlocel == "en"
            ? item["schoolEnNames"] || ""
            : item["schoolNames"] || "";
      });
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          this.$refs.Detail.showModal(item);
          break;
        case "edit":
          this.showForm("edit", item);
          break;
        case "del":
          let formData = new FormData();
          formData.append("id", item.id);
          delContentArticle(formData).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
          break;
      }
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
          delContentArticle({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        });
      }
    },
    rowClick(row, column, event) {
      console.log("rowClick", row);
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
    batchCopy() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length == 0) {
      } else {
        this.$refs.Copy.show(selectionId);
      }
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
