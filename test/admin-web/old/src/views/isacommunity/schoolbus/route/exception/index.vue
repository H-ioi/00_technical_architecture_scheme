<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.异常上报") }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['busexception_add']"
          type="primary"
          size="large"
          @click="showForm('add')"
          >{{ $t("btn.新增") }}</el-button
        >
        <el-button
          v-if="permissions['busexception_import']"
          type="defult"
          size="large"
          @click="batchUpdload"
          >{{ $t("btn.导入") }}</el-button
        >
        <el-button
          v-if="permissions['busexception_export']"
          type="defult"
          size="large"
          @click="exportData"
          >{{ $t("btn.导出") }}</el-button
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
          <el-form-item style="width: 120px" v-if="schoolSelectList.length > 1">
            <el-select
              style="width: 100%"
              v-model="searchFrom['schoolIds']"
              :placeholder="$t('isagroup.请选择学校')"
              multiple
              @change="changeSchool"
            >
              <el-option
                :key="i.id"
                v-for="(i, k) in schoolSelectList"
                :label="schoolDropdownLabel(i)"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-select
              style="width: 100%"
              v-model="searchFrom['sectionId']"
              :placeholder="$t('isagroup.请选择学期')"
            >
              <el-option
                :key="i.id"
                v-for="(i, k) in selectSectionList"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-select
              style="width: 100%"
              v-model="searchFrom['lineIds']"
              :placeholder="$t('isagroup.请选择路线')"
              multiple
            >
              <el-option
                :key="i.id"
                v-for="(i, k) in selectLineList"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-select
              style="width: 100%"
              v-model="searchFrom['carId']"
              :placeholder="$t('isagroup.请选择车辆')"
            >
              <el-option
                :key="i.id"
                v-for="(i, k) in carinfoList"
                :label="i.carNumber"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-select
              style="width: 100%"
              v-model="searchFrom['exceptionType']"
              :placeholder="$t('isagroup.异常类型')"
            >
              <el-option
                :key="i.value"
                v-for="(i, k) in consts['exceptionType']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-select
              style="width: 100%"
              v-model="searchFrom['needDispatch']"
              :placeholder="$t('isagroup.是否调度')"
            >
              <el-option
                :key="i.value"
                v-for="(i, k) in consts['isOrNo']"
                :label="i18nlocel == 'en' ? i.enLabel : i.label"
                :value="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-date-picker
              style="width: 100%"
              v-model="searchFrom['exceptionDateStart']"
              type="date"
              :placeholder="$t('isagroup.开始时间')"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 120px">
            <el-date-picker
              style="width: 100%"
              v-model="searchFrom['exceptionDateEnd']"
              type="date"
              :placeholder="$t('isagroup.结束时间')"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            >
            </el-date-picker>
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
          :tableTitle="tabletitle['exceptionTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          @playTab="playTab"
          @rowClick="rowClick"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['busexception_del']"
              size="small"
              type="danger"
              plain
              @click="batchChange('del')"
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
    <!-- 详情弹窗 -->
    <Detail ref="Detail" :title="$t('isagroup.详情')" />
    <!-- 批量导入弹窗 -->
    <BatchUpdload ref="BatchUpdload" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSectionList,
  getLineList,
  getCarinfoList,
} from "@/api/isacommunity/buscommon.js";
import {
  getExceptPage,
  delExcept,
  exportExcept,
} from "@/api/isacommunity/busexception.js";
import { download } from "@/util/download.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "./modal/form.vue";
import Detail from "./modal/detail.vue";
import BatchUpdload from "./modal/batchupdload.vue";
// 引入 dayjs
import dayjs from "dayjs";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
export default {
  name: "teacher",
  mixins: [schoolListBuscommonMixin],
  components: { Table, Pagination, Detail, Form, BatchUpdload },
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
          permissions: "busexception_edit",
        },
      ],
      sectionList: [],
      lineList: [],
      selectSectionList: [],
      selectLineList: [],
      selectStationList: [],
      carinfoList: [],
      schoolId: "",
    };
  },
  created() {
    this.getBtn();
    this.initData();
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
      this.getBtn();
      await this.fetchSchoolListBuscommon();
      if (this.schoolSelectList.length === 1) {
        this.pagination["schoolIds"] = this.schoolSelectList[0].id;
      }
      this.getSeclectList();
      this.getList();
    },
    async getSeclectList() {
      this.sectionList = await getSectionList();
      this.lineList = await getLineList();
      this.carinfoList = await getCarinfoList();
      if (this.schoolSelectList.length === 1) {
        this.changeSchool(this.pagination["schoolIds"]);
      }
    },
    getList() {
      getExceptPage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getList", res.data.data);
          let { total, data } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        item["exceptionTypeLabel"] = this.$getListLabel(
          consts["exceptionType"],
          item["exceptionType"]
        );
        item["needDispatchLabel"] = this.$getListLabel(
          consts["isOrNo"],
          item["needDispatch"]
        );
        item["sectionName"] =
          this.i18nlocel == "en" ? item["sectionEnName"] : item["sectionCnName"];
        item["createTime"] = item["createTime"]
          ? dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm")
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
    batchChange(type) {
      let selectionId = this.$refs.Table.selectionId;
      switch (type) {
        case "del":
          if (selectionId.length > 0) {
            this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
              confirmButtonText: this.$t("isagroup.确定"),
            }).then(() => {
              delExcept({ ids: selectionId }).then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t("isagroup.成功"));
                  this.getList();
                }
              });
            });
          }
          break;
      }
    },
    exportData() {
      let data = {
        ...this.pagination,
        ...this.searchFrom,
      };
      console.log("exportData", this.pagination, this.searchFrom);

      delete data["size"];
      delete data["current"];
      exportExcept(data).then((res) => {
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    rowClick(row, column, event) {
      this.$refs["Detail"].showModal(row);
    },
    clear() {
      this.searchFrom = {};
      this.selectSectionList = [];
      this.selectLineList = [];
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
    showForm(type = "look", item = {}) {
      console.log("111showForm", type);
      this.$refs.Form.showForm(type, item);
    },
    batchUpdload() {
      this.$refs.BatchUpdload.showUpload = true;
    },
    // 选择校区
    changeSchool(e) {
      const selectedSchoolIds = new Set(e);
      this.selectSectionList = this.sectionList.filter((item) => {
        if (Array.isArray(item.schoolIds)) {
          return item.schoolIds.some((id) => selectedSchoolIds.has(id));
        }
        return selectedSchoolIds.has(item.schoolIds);
      });
      this.selectLineList = this.lineList.filter((item) => {
        if (Array.isArray(item.schoolIds)) {
          return item.schoolIds.some((id) => selectedSchoolIds.has(id));
        }
        return selectedSchoolIds.has(item.schoolIds);
      });
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
