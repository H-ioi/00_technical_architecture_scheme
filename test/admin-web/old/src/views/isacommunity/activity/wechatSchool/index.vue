<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.学校微信配置") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['busdriver_add']"
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
          <el-form-item style="width: 200px">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['schoolId']"
              :placeholder="$t('isagroup.请选择学校')"
            >
              <el-option
                v-for="(i, k) in dictionary['school']"
                :key="k"
                :label="i18nlocel == 'en' ? i.enName : i.cnName || i.enName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 200px">
            <el-input
              clearable
              style="width: 100%"
              v-model="searchFrom['keyword']"
              :placeholder="$t('isagroup.微信AppID')"
            ></el-input>
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
          :tableTitle="tabletitle['wechatSchoolInfoTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
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
    <Form ref="Form" @getList="getList" />
    <Detail ref="Detail" :title="$t('isagroup.详情')" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getWechatInfoPage, delWechatSchoolInfo } from "@/api/isacommunity/wechatSchoolInfo.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "./modal/form.vue";
import Detail from "./modal/detail.vue";
import dayjs from "dayjs";
export default {
  name: "wechatSchoolConfig",
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
    };
  },
  created() {
    this.getBtn();
    this.initData();
  },
  activated() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel", "dictionary"]),
  },
  watch: {
    i18nlocel() {
      this.formatData();
    },
  },
  methods: {
    initData() {
      this.getList();
    },
    getList() {
      getWechatInfoPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          const pack = res.data.data;
          const data = pack.data || pack.records || pack.list || [];
          let total = pack.total != null ? pack.total : pack.totalCount;
          if (total == null && Array.isArray(data)) {
            total = data.length;
          }
          this.paginationTotal = total || 0;
          this.tableData = data || [];
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.forEach((item) => {
        item.schoolIdLabel = this.schoolLabel(item.schoolId);
        item.activeLabel = this.$getListLabel(consts["yesOrno"], String(item.active));
        item.createdAt = item.createdAt
          ? dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")
          : "--";
        item.updatedAt = item.updatedAt
          ? dayjs(item.updatedAt).format("YYYY-MM-DD HH:mm")
          : "--";
      });
    },
    schoolLabel(schoolId) {
      if (schoolId == null || schoolId === "") return "--";
      const list = this.dictionary["school"] || [];
      const row = list.find((s) => String(s.id) === String(schoolId));
      if (!row) return String(schoolId);
      return this.i18nlocel === "en" ? row.enName || row.cnName : row.cnName || row.enName;
    },
    playTab(name, item) {
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
      if (selectionId.length === 0) {
        this.$message.warning(this.$t("isagroup.请选择要删除的数据"));
      } else {
        this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
          confirmButtonText: this.$t("isagroup.确定"),
        }).then(() => {
          delWechatSchoolInfo({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        });
      }
    },
    rowClick(row) {
      this.$refs["Detail"].showModal(row);
    },
    clear() {
      this.searchFrom = {};
      this.getList();
    },
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    getBtn() {
      this.tableBtn = this.permissionsBtn.filter((item) => {
        return this.permissions[item["permissions"]] || item["type"] === "look";
      });
    },
    showForm(type, item = {}) {
      this.$refs.Form.showForm(type, item);
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
