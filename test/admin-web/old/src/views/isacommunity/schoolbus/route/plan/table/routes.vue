<template>
  <div>
    <div class="community_searchFrom">
      <el-form class="df_align_center" :label-position="'top'" :inline="true" :model="searchFrom">
        <el-form-item style="width: 180px" v-if="schoolSelectList.length > 1">
          <el-select style="width: 100%" v-model="searchFrom['schoolIds']" :placeholder="$t('isagroup.请选择学校')" multiple
            @change="changeSchool">
            <el-option :key="k" v-for="(i, k) in schoolSelectList" :label="schoolDropdownLabel(i)"
              :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-select style="width: 100%" v-model="searchFrom['sectionId']" :placeholder="$t('isagroup.请选择学期')">
            <el-option :key="k" v-for="(i, k) in selectSectionList" :label="i18nlocel == 'en' ? i.enName : i.cnName"
              :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-select style="width: 100%" v-model="searchFrom['stationIds']" :placeholder="$t('isagroup.请选择站点')">
            <el-option :key="k" v-for="(i, k) in selectStationList" :label="i18nlocel == 'en' ? i.enName : i.cnName"
              :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-select style="width: 100%" v-model="searchFrom['visible']" :placeholder="$t('isagroup.状态')">
            <el-option :key="k" v-for="(i, k) in consts['visibleType']" :label="i18nlocel == 'en' ? i.enLabel : i.label"
              :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input clearable style="width: 100%" v-model="searchFrom['lineName']"
            :placeholder="$t('isagroup.输入路线名称')"></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input clearable style="width: 100%" v-model="searchFrom['carNumber']"
            :placeholder="$t('isagroup.输入车牌号')"></el-input>
        </el-form-item>

        <el-form-item style="width: auto; margin-right: 0">
          <el-button style="color: #2a3f54 !important" class="button_text" size="medium" type="text"
            icon="el-icon-refresh-right" @click="clear">{{ $t("btn.重置") }}</el-button>
          <el-button size="medium" type="primary" @click="getList">{{
            $t("btn.查询")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="isa_table">
      <Table ref="Table" :showSelection="true" :tableTitle="tabletitle['routeTable']" :tableData="tableData"
        :tableBtn="tableBtn" @playTab="playTab" @rowClick="rowClick" />
      <div class="df_sb isa_table_footer">
        <div>
          <el-button v-if="permissions['busline_batch_copy']" size="small" type="defult" plain @click="batchCopy">{{
            $t("isagroup.复制路线") }}</el-button>
          <el-button v-if="permissions['busline_del']" size="small" type="danger" plain @click="delData">{{ $t("btn.删除")
            }}</el-button>
        </div>
        <Pagination :total="paginationTotal" :pagination="pagination" @handleCurrentChange="handleCurrentChange" />
      </div>
    </div>
    <RouteForm ref="RouteForm" @getList="getList" />
    <Detail ref="Detail" :title="$t('isagroup.详情')" :detailInfo="tabletitle['routeTable']" />
    <!-- 批量导入弹窗 -->
    <BatchRoute ref="BatchRoute" @getList="getList" />
    <!-- 复制路线弹窗 -->
    <CopyRoute ref="CopyRoute" @getList="getList" :sectionList="sectionList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSectionList, getStationList } from "@/api/isacommunity/buscommon.js";
import { getRoutePage, delRoute, batchCopy } from "@/api/isacommunity/route.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import RouteForm from "../modal/routeform.vue";
import Detail from "../modal/routedetail.vue";
import BatchRoute from "../modal/batchroute.vue";
import CopyRoute from "../modal/copyroute.vue";
// 引入 dayjs
import dayjs from "dayjs";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
export default {
  name: "teacher",
  mixins: [schoolListBuscommonMixin],
  components: { Table, Pagination, Detail, RouteForm, BatchRoute, CopyRoute },
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
          permissions: "busline_edit",
        },
      ],
      sectionList: [],
      stationList: [],
      selectSectionList: [],
      selectStationList: [],
      schoolId: "",
    };
  },
  created() {
    this.getBtn();
  },
  mounted() { },
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
      this.getSelectList();
    },
    async getSelectList() {
      this.sectionList = await getSectionList();
      this.stationList = await getStationList();
      if (this.schoolSelectList.length === 1) {
        this.changeSchool([this.schoolId]);
      }
    },
    getList() {
      getRoutePage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getRoutePage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        item["lineTypeName"] = this.$getListLabel(consts["routeType"], item.lineType);
        item["createTime"] = dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm");
        item["updateTime"] = dayjs(item["updateTime"]).format("YYYY-MM-DD HH:mm");
        item["showLineName"] = this.i18nlocel == "en" ? item["enName"] : item["cnName"];
        item["showSectionName"] =
          this.i18nlocel == "en" ? item["sectionEnName"] : item["sectionCnName"];
        item["visibleLabel"] = this.$getListLabel(consts["visibleType"], item.visible);
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
        case "copy":
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
          delRoute({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        });
      }
    },
    batchCopy() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length == 0) {
      } else {
        this.$refs.CopyRoute.show(selectionId);
        // this.$alert(this.$t("isagroup.确定要复制吗？"), this.$t("isagroup.复制路线"), {
        //   confirmButtonText: this.$t("isagroup.确定"),
        // }).then(() => {
        //   batchCopy({ ids: selectionId }).then((res) => {
        //     if (res.data.success) {
        //       this.$message.success(this.$t("isagroup.成功"));
        //       this.getList();
        //     }
        //   });
        // });
      }
    },
    rowClick(row, column, event) {
      console.log("rowClick", row);
      this.$refs["Detail"].showModal(row);
    },
    clear() {
      this.pagination["current"] = 1;
      this.searchFrom = {};
      this.selectSectionList = [];
      this.selectStationList = [];
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
      this.$refs.RouteForm.showForm(type, item);
    },
    batchUpdload() {
      this.$refs.BatchRoute.showUpload = true;
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
      this.selectStationList = this.stationList.filter((item) => {
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
