<template>
  <div>
    <div class="community_searchFrom">
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item style="width: 240px" v-if="schoolSelectList.length > 1">
          <el-select
            style="width: 100%"
            v-model="searchFrom['schoolIds']"
            :placeholder="$t('isagroup.请选择学校')"
            multiple
          >
            <el-option
              :key="k"
              v-for="(i, k) in schoolSelectList"
              :label="schoolDropdownLabel(i)"
              :value="i.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 240px">
          <el-input
            clearable
            style="width: 100%"
            v-model="searchFrom['sectionName']"
            :placeholder="$t('isagroup.输入学期')"
          ></el-input>
        </el-form-item>

        <el-form-item style="width: auto; margin-right: 0">
          <el-button
            style="color: #2a3f54 !important"
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
        :tableTitle="tabletitle['busTermTable']"
        :tableData="tableData"
        :tableBtn="tableBtn"
        @playTab="playTab"
        @rowClick="rowClick"
      />
      <div class="df_sb isa_table_footer">
        <div>
          <el-button
            v-if="permissions['bussection_del']"
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
    <TermForm ref="TermForm" @getList="getList" />
    <Detail
      ref="Detail"
      :title="$t('isagroup.详情')"
      :detailInfo="tabletitle['busTermTable']"
      :detailData="detailData"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTermPage, delTerm } from "@/api/isacommunity/term.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import TermForm from "../modal/termform.vue";
import Detail from "@/page/isacommunity/modal/detail.vue";
import dayjs from "dayjs";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";

export default {
  name: "teacher",
  mixins: [schoolListBuscommonMixin],
  components: { Table, Pagination, Detail, TermForm },
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
          color: "",
          permissions: "",
        },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          color: "",
          permissions: "bussection_edit",
        },
      ],
      detailData: {},
      schoolId: "",
    };
  },
  created() {
    this.getBtn();
  },
  mounted() {},
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  watch: {
    i18nlocel() {
      this.formatData();
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
      getTermPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getTeacherPage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        // 使用 dayjs 进行日期格式化
        item["intentEndDate"] = dayjs(item["intentEndDate"]).format("YYYY-MM-DD");
        item["intentStartDate"] = dayjs(item["intentStartDate"]).format("YYYY-MM-DD");
        item["serviceEndDate"] = dayjs(item["serviceEndDate"]).format("YYYY-MM-DD");
        item["serviceStartDate"] = dayjs(item["serviceStartDate"]).format("YYYY-MM-DD");
        item["createTime"] = dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm");
        item["showTermName"] = this.i18nlocel == "en" ? item["enName"] : item["cnName"];
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
        case "del":
          delTerm(item.id).then((res) => {
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
      } else {
        this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
          confirmButtonText: this.$t("isagroup.确定"),
        }).then(() => {
          delTerm({ ids: selectionId }).then((res) => {
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
      this.detailData = row;
      this.$refs["Detail"].showModal();
    },
    clear() {
      this.pagination["current"] = 1;
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
    showForm(type = "add", item = {}) {
      this.$refs.TermForm.showForm(type, item);
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
