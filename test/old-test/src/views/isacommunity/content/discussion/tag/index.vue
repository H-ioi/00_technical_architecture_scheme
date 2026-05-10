<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.讨论标签") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['tag_add']"
          type="primary"
          size="large"
          @click="showForm('add')"
          >{{ $t("btn.新增") }}</el-button
        >
      </div>
    </div>
    <div class="community_centent">
      <div class="isa_table">
        <Table
          ref="Table"
          :showSelection="false"
          :tableTitle="tabletitle['discussionTagTable']"
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
  getDiscussionTagPage,
  delDiscussionTag,
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
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        // {
        //   name: "查看",
        //   type: "look",
        //   icon: "",
        //   permissions: "",
        // },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "tag_edit",
        },
        {
          name: "删除",
          type: "del",
          icon: "",
          permissions: "tag_del",
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
      getDiscussionTagPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getDiscussionTagPage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        item["createdAt"] = item["createdAt"]
          ? dayjs(item["createdAt"]).format("YYYY-MM-DD HH:mm")
          : "--";
        item["updatedAt"] = item["updatedAt"]
          ? dayjs(item["updatedAt"]).format("YYYY-MM-DD HH:mm")
          : "--";
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
          // let formData = new FormData();
          // formData.append("id", item.id);
          delDiscussionTag(item.id).then((res) => {
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
          delDiscussionTag({ ids: selectionId }).then((res) => {
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
