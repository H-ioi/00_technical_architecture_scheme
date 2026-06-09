<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.学校邮箱配置") }}</div>
      <div class="community_top_btn">
        <el-button v-if="permissions['busdriver_add']" type="primary" size="large" @click="showForm('add')">{{
          $t("btn.新增") }}</el-button>
      </div>
    </div>
    <div class="community_centent">
      <div class="community_searchFrom">
        <el-form class="df_align_center" :label-position="'top'" :inline="true" :model="searchFrom">
          <el-form-item style="width: 200px">
            <el-select clearable style="width: 100%" v-model="searchFrom['schoolIds']"
              :placeholder="$t('isagroup.请选择学校')">
              <el-option v-for="(i, k) in dictionary['school']" :key="k"
                :label="i18nlocel == 'en' ? i.enName : i.cnName || i.enName" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 200px">
            <el-input clearable style="width: 100%" v-model="searchFrom['keyword']"
              :placeholder="$t('isagroup.邮箱地址')"></el-input>
          </el-form-item>
          <el-form-item style="width: auto; margin-right: 0">
            <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right" @click="clear">{{
              $t("btn.重置") }}</el-button>
            <el-button size="medium" type="primary" @click="getList">{{
              $t("btn.查询")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="isa_table">
        <Table ref="Table" :showSelection="true" :tableTitle="tabletitle['schoolEmailConfigTable']"
          :tableData="tableData" :tableBtn="tableBtn" @playTab="playTab" @rowClick="rowClick" />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button v-if="permissions['busdriver_del']" size="small" type="danger" plain @click="delData">{{
              $t("btn.删除") }}</el-button>
          </div>
          <Pagination :total="paginationTotal" :pagination="pagination" @handleCurrentChange="handleCurrentChange" />
        </div>
      </div>
    </div>
    <Form ref="Form" @getList="getList" />
    <Detail ref="Detail" :title="$t('isagroup.详情')" />
  </div>
</template>

<script>
import { delSchoolEmailConfig, getAppModules, getEmailConfigPage } from "@/api/isacommunity/schoolEmailConfig.js";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Table from "@/components/communitycommon/Table.vue";
import consts from "@/const/isacommunity/consts.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import dayjs from "dayjs";
import { mapGetters } from "vuex";
import Detail from "./modal/detail.vue";
import Form from "./modal/form.vue";
export default {
  name: "emailSchool",
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
      appModuleLabelMap: {},
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
    this.loadAppModuleLabels();
    this.getList();
  },
  activated() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel", "dictionary"]),
  },
  watch: {
    i18nlocel() {
      this.mergeDefaultAppModuleLabels();
      this.formatData();
    },
  },
  methods: {
    mergeDefaultAppModuleLabels() {
      this.$set(this.appModuleLabelMap, "1", this.$t("isagroup.活动"));
    },
    loadAppModuleLabels() {
      this.mergeDefaultAppModuleLabels();
      getAppModules()
        .then((res) => {
          if (!res.data.success) return;
          const raw = res.data.data;
          const list = Array.isArray(raw) ? raw : raw && (raw.list || raw.data || raw.records);
          if (!Array.isArray(list)) return;
          list.forEach((item) => {
            const key =
              item.value != null
                ? item.value
                : item.moduleCode != null
                  ? item.moduleCode
                  : item.code != null
                    ? item.code
                    : item.key != null
                      ? item.key
                      : item.id;
            const lab =
              item.label != null
                ? item.label
                : item.name != null
                  ? item.name
                  : item.desc != null
                    ? item.desc
                    : item.moduleName;
            if (key != null && lab != null) {
              this.$set(this.appModuleLabelMap, String(key), lab);
            }
          });
        })
        .catch(() => { });
    },
    getList() {
      getEmailConfigPage({
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
        const am = item.appModule != null && item.appModule !== "" ? String(item.appModule) : "";
        item.appModuleLabel =
          (am && this.appModuleLabelMap[am]) || (am ? am : "--");
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
          delSchoolEmailConfig({ ids: selectionId }).then((res) => {
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
