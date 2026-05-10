<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.内容列表") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['discussion_add']"
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
              v-model="searchFrom['keyword']"
              :placeholder="$t('isagroup.关键字')"
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
                :key="k"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              style="width: 100%"
              v-model="searchFrom.tagId"
              :placeholder="$t('isagroup.讨论标签')"
            >
              <el-option
                v-for="(i, k) in tagList"
                :key="k"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              style="width: 100%"
              v-model="searchFrom.active"
              :placeholder="$t('isagroup.是否可见')"
            >
              <el-option
                v-for="(i, k) in consts['yesOrno']"
                :key="k"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.boolean"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 180px">
            <el-select
              style="width: 100%"
              v-model="searchFrom.top"
              :placeholder="$t('isagroup.是否置顶')"
            >
              <el-option
                v-for="(i, k) in consts['yesOrno']"
                :key="k"
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
                :key="k"
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
          :tableTitle="tabletitle['discussionContentTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          :height="520"
          @playTab="playTab"
          @rowClick="rowClick"
        />
        <div class="df_sb isa_table_footer">
          <div></div>
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
  getDiscussionContentPage,
  delDiscussionContent,
  getDiscussionTagList,
  getContentSchoolList,
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
          permissions: "discussion_edit",
        },
        {
          name: "删除",
          type: "del",
          icon: "",
          permissions: "discussion_del",
        },
      ],
      schoolList: [],
      roleList: [],
      detailData: {},
      schoolId: "",
      tagList: [],
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
      this.tagList = await getDiscussionTagList();
      if (this.dictionary["school"].length == 1) {
        this.schoolId = this.dictionary["school"][0].id;
        this.pagination["schoolIds"] = this.schoolId;
      }
      this.getList();
    },
    getList() {
      getDiscussionContentPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getDiscussionContentPage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        item["topLabel"] = item["top"]
          ? this.$t("isagroup.是")
          : this.$t("isagroup.否");
        item["recommendedLabel"] = item["recommended"]
          ? this.$t("isagroup.是")
          : this.$t("isagroup.否");
        item["activeLabel"] = item["active"]
          ? this.$t("isagroup.是")
          : this.$t("isagroup.否");
        item["createdAt"] = dayjs(item["createdAt"]).format("YYYY-MM-DD HH:mm");
        item["updatedAt"] = dayjs(item["updatedAt"]).format("YYYY-MM-DD HH:mm");
        item["tagName"] =
          item.tagList && item.tagList.length > 0
            ? this.i18nlocel == "en"
              ? item.tagList[0].enName
              : item.tagList[0].cnName
            : "--";
        item["scopeLabel"] = this.$getListLabel(
          consts["scopeList"],
          item["scope"]
        );
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
          this.$alert(
            this.$t("isagroup.将永久删除勾选的内容，确认删除？"),
            this.$t("isagroup.删除"),
            {
              confirmButtonText: this.$t("isagroup.确定"),
              cancelButtonText: this.$t("isagroup.取消"),
              type: "warning",
            }
          ).then(() => {
            let formData = new FormData();
            formData.append("id", item.id);
            delDiscussionContent(formData).then((res) => {
              if (res.data.success) {
                this.$message.success(this.$t("isagroup.成功"));
                this.getList();
              }
            });
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
          delDiscussionContent({ ids: selectionId }).then((res) => {
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
