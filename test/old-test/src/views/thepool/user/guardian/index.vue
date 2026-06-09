<template>
  <div class="thepool_page">
    <div class="pool-search">
      <div class="pool-search-top">
        <StatusItem
          :statusList="statusList"
          :currentstatus="currentstatus"
          @changeStasus="changeStasus"
        />
        <SearchType />
      </div>
      <div class="requestParam" v-if="requestList.length > 0">
        <div class="requestParamlist">
          <div
            @click="selectCurrentRequestParam(item)"
            :class="[
              'requestParamlist_item',
              {
                active_item: item.id == searchRequestParamId,
              },
            ]"
            v-for="(item, index) in requestList"
            :key="index"
          >
            <i
              class="el-icon-circle-close"
              @click.stop="delRequestParam(item.id)"
            ></i>
            <span> {{ item.description }}</span>
          </div>
        </div>
      </div>
      <div class="form-page" v-if="searchType == 'checkbox'">
        <div>
          <div class="form-item" v-if="pooldictpermissions.length > 1">
            <label class="form-label">{{ $t("consult.归属校区") }}：</label>
            <OverflowWrap>
              <el-checkbox-group v-model="searchFrom.schools">
                <el-checkbox
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.value"
                >
                  {{ i18nlocel == "en" ? item.enLabel : item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </OverflowWrap>
          </div>
          <div class="form-item-center">
            <label class="form-label">{{ $t("consult.新增时间") }}：</label>
            <el-date-picker
              style="width: 240px"
              v-model="searchFrom.createdTime"
              type="daterange"
              :range-separator="$t('consult.至')"
              :start-placeholder="$t('consult.开始')"
              :end-placeholder="$t('consult.结束')"
              :value-format="'yyyy-MM-dd'"
              :format="'yyyy-MM-dd'"
              clearable
              @clear="search"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="form-page_btns">
          <el-button type="primary" size="small" round @click.stop="search">{{
            $t("consult.查询")
          }}</el-button>
          <img
            @click.stop="saveRequestParam"
            src="/thepool/icon/icon_save.png"
            alt="保存查询条件"
          />
          <img
            @click.stop="clear"
            src="/thepool/icon/icon_refresh.png"
            alt="清空"
          />
        </div>
      </div>
      <div
        v-if="searchType == 'input'"
        class="searchFromBox search"
        style="padding: 15px 0 0"
      >
        <el-form
          ref="searchFrom"
          class="df_align_center searchFrom"
          :label-position="'top'"
          :inline="true"
          :model="searchFrom"
        >
          <el-form-item
            v-if="pooldictpermissions.length > 1"
            :label="$t('consult.归属校区')"
            style="width: 214px"
          >
            <el-select
              multiple
              v-model="searchFrom.schools"
              :placeholder="$t('consult.请选择')"
              clearable
              @clear="search"
            >
              <el-option
                v-for="item in pooldictpermissions"
                :key="item.value"
                :label="i18nlocel == 'en' ? item.enLabel : item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('consult.新增时间')" style="width: 214px">
            <el-date-picker
              style="width: 100%"
              v-model="searchFrom.createdTime"
              type="daterange"
              :range-separator="$t('consult.至')"
              :start-placeholder="$t('consult.开始')"
              :end-placeholder="$t('consult.结束')"
              :value-format="'yyyy-MM-dd'"
              :format="'yyyy-MM-dd'"
              clearable
              @clear="search"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 170px; margin-right: 0">
            <div class="df_sb">
              <el-button
                type="primary"
                size="small"
                round
                @click.stop="search"
                >{{ $t("consult.查询") }}</el-button
              >
              <img
                style="width: 32px; height: 32px"
                @click.stop="saveRequestParam"
                src="/thepool/icon/icon_save.png"
                alt="保存查询条件"
              />
              <img
                style="width: 32px; height: 32px"
                @click.stop="clear"
                src="/thepool/icon/icon_refresh.png"
                alt="清空"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="pool-tableBox">
      <div class="df_sb palyTableBox">
        <div class="df_sb">
          <el-button
            v-if="permissions['thepool_user_guardian_add']"
            type="primary"
            size="small"
            round
            @click="addGuardians"
            >{{ $t("consult.新增") }}</el-button
          >
          <el-button
            v-if="permissions['thepool_user_guardian_downtemplate']"
            type="defult"
            size="small"
            round
            @click="downloadTemplate"
            >{{ $t("consult.下载模板") }}</el-button
          >
          <el-button
            v-if="permissions['thepool_user_guardian_import']"
            type="defult"
            size="small"
            round
            @click.stop="showUpload = true"
            >{{ $t("consult.导入") }}</el-button
          >
          <el-button
            v-if="
              tableData.length > 0 &&
              permissions['thepool_user_guardian_export']
            "
            type="defult"
            size="small"
            round
            @click="exportList"
            >{{ $t("consult.导出") }}</el-button
          >
          <el-button
            v-if="tableData.length > 0 && permissions['guardian_send_email']"
            type="defult"
            size="small"
            round
            @click="sendEmail"
            >{{ $t("consult.邮件发送") }}</el-button
          >
        </div>
      </div>
      <div class="tableBox">
        <Table
          ref="Table"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :tableBtn="tableBtn"
          :showSelection="true"
          @playTab="playTab"
          @rowClick="rowClick"
          @changeSelectedCount="changeSelectedCount"
        />
        <div class="df_sb" v-if="paginationTotal > 10">
          <div class="df_sb">
            <el-checkbox
              style="padding: 0 10px"
              class="checkbox"
              @change="changeSelectAll"
              v-model="isSelectAll"
              >{{ $t("consult.全选") }}</el-checkbox
            >
            <span v-if="selectedCount != 0" style="color: #999999"
              >{{ $t("consult.已选择") }}
              <span style="color: #ba8e62">{{ selectedCount }}</span>
              {{ $t("consult.条") }},</span
            >
            <span style="color: #999999">{{
              $t("consult.最多选择1000条")
            }}</span>
          </div>
          <div class="palyTableBox df_align_center" style="padding: 0">
            <PaginationInfo
              :paginationTotal="paginationTotal"
              style="margin-right: 20px"
            />
            <Pagination
              :showPageSizes="true"
              :total="paginationTotal"
              :pagination="pagination"
              @handleCurrentChange="handleCurrentChange"
              @handleSizeChange="handleSizeChange"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 批量导入 -->
    <BatchUpdload
      v-if="showUpload"
      ref="BatchUpdload"
      :showUpload="showUpload"
      @importList="importList"
      @closeModal="closeModal"
    />
    <!-- 新增家长 -->
    <AddGuardians ref="AddGuardians" @initData="getList" />
    <!-- 批量导出校验错误信息 -->
    <errorInfo ref="errorInfo" />
    <ErrorTable ref="ErrorTable" />
    <!-- 发送邮件 -->
    <sendemail ref="sendemail" :type="2" @cancelSelectAll="cancelSelectAll" />
    <!-- 保存筛选信息 -->
    <SaveRequestParam
      ref="SaveRequestParam"
      @saveRequestParam="addRequestParam"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getGuardianList,
  delGuardian,
  batchGuardian,
  exportGuardianList,
  downloadGuardianTemplate,
  getGuardianIds,
} from "@/api/consult/student.js";
import {
  getRequestParamList,
  addRequestParam,
  delRequestParam,
} from "@/api/consult/common.js";
import { download } from "@/util/download.js";
import { consult } from "@/const/consult/index.js";
import StatusItem from "@/components/thepoolcommon/StatusItem.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import BatchUpdload from "@/page/thepool/modal/batchupdload.vue";
import AddGuardians from "@/page/thepool/modal/addguardians.vue";
import errorInfo from "@/page/thepool/modal/errorinfo.vue";
import ErrorTable from "@/page/thepool/modal/errorinfo.vue";
import sendemail from "@/page/thepool/email/modal/sendemail.vue";
import SaveRequestParam from "@/page/thepool/modal/saveRequestParam.vue";
import OverflowWrap from "@/components/thepoolcommon/OverflowWrap.vue";
import SearchType from "@/components/thepoolcommon/searchtype.vue";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    BatchUpdload,
    AddGuardians,
    StatusItem,
    errorInfo,
    ErrorTable,
    sendemail,
    SaveRequestParam,
    OverflowWrap,
    SearchType,
  },
  data() {
    return {
      showUpload: false,
      statusList: consult["enrolledStatusList"],
      enrolledStatus: consult["enrolledStatus"],
      currentstatus: "-1",
      tableTitle: consult["guardiansTableTitle"],
      sexList: consult["sexList"],
      tableData: [],
      tableBtn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "thepool_user_guardian_edit",
          icon: "el-icon-view",
        },
        // {
        //   name: "删除",
        //   type: "del",
        //   permissions: "del",
        //   icon: "el-icon-view"
        // }
      ],
      pagination: {
        pageSize: 50,
        pageNum: 1,
      },
      paginationTotal: 0,
      searchData: {},
      searchFrom: {
        keyword: "",
        createdTime: [],
        schools: [],
      },
      enrollLevelList: [],
      isSelectAll: false,
      selectedCount: 0,
      searchRequestParamId: null,
      requestList: [],
      submitting: false,
      routeChange: null,
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictionary",
      "pooldictpermissions",
      "searchType",
    ]),
  },

  created() {
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
    this.initRequestParam();
  },

  watch: {
    i18nlocel() {
      this.resetData();
    },
    "$store.state.thepool.keyword": {
      handler(val) {
        console.log("Vuex keyword changed:", val);
        this.searchFrom["keyword"] = val;
      },
      immediate: true,
    },
  },
  mounted() {
    this.wathKeyDowm();
    this.$store.subscribeAction((action) => {
      console.log("搜索列表", action);
      if (this.$route.path != "/thepool/user/guardian/index") {
        return;
      }
      if (action.type === "searchList") {
        this.searchFrom["keyword"] = action.payload;
        this.search();
      }
    });
  },
  beforeDestroy() {
    this.removeKeyDowm();
  },
  activated() {
    this.wathKeyDowm();
    this.getList();
  },
  methods: {
    // 监听回车事件
    wathKeyDowm() {
      // 添加全局回车事件监听
      document.addEventListener("keydown", this.handleKeyDown);
      // 监听路由变化
      this.routeChange = this.$router.afterEach(() => {
        // 路由跳转后移除事件监听器
        document.removeEventListener("keydown", this.handleKeyDown);
      });
    },
    removeKeyDowm() {
      // 移除全局回车事件监听
      document.removeEventListener("keydown", this.handleKeyDown);
      // 移除路由监听器
      if (this.routeChange) {
        this.routeChange();
      }
    },
    // 处理键盘事件
    handleKeyDown(event) {
      // 监听回车键
      if (event.key === "Enter") {
        // 调用搜索方法
        this.search();
      }
    },
    getList() {
      getGuardianList({
        ...this.pagination,
        ...this.searchData,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data || [];
          this.paginationTotal = Number(total);
          this.resetData();
        }
      });
    },
    resetData() {
      this.tableData.map((item) => {
        item["relationTypeLabel"] = this.getDataLabel(
          item.applySchool,
          "relationType",
          this.dictionary["enquiry_relation_type"]
        );
        item["applySchoolLabel"] = this.$getListLabel(
          this.pooldictionary,
          item.applySchool
        );
        item["sexlabel"] = this.$getListLabel(this.sexList, item.sex);
      });
    },
    // 导入用户
    importList(data) {
      // 防止重复提交
      if (this.submitting) {
        return;
      }

      // 设置提交中状态
      this.submitting = true;
      batchGuardian(data)
        .then((res) => {
          this.submitting = false;
          console.log("res", res);
          if (res.status == 200) {
            this.showUpload = false;
            let { errList, failCount, successCount } = res.data.data;
            if (failCount > 0) {
              this.$refs.ErrorTable.show(res.data.data);
            }
            if (successCount > 0) {
              this.$message.success(this.$t("consult.成功"));
              this.showUpload = false;
              this.getList();
            }
            if (failCount == 0 && successCount == 0) {
              this.$message.success(this.$t("consult.请至少添加一条数据"));
            }
          }
          //    else {
          //     if (res.data.code == "601") {
          //       this.showUpload = false;
          //       this.$refs["errorInfo"].setData(res.data.data);
          //       this.getList();
          //     } else {
          //       this.$message.error(this.$t("consult.失败"));
          //       this.showUpload = false;
          //       this.getList();
          //     }
          //   }
        })
        .catch((error) => {
          this.submitting = false;
          //   console.log("error", error);
          //   if (error.response.status === 600) {
          //     download(error.response.data, error.response.headers["content-disposition"]);
          //     this.$message.warning(
          //       "数据填写有误！请根据下载的错误说明，修改文件后重新上传"
          //     );
          //   }
        })
        .finally(() => {
          // 无论成功或失败，都重置提交状态
          this.submitting = false;
        });
    },
    // 导出
    exportList() {
      let searchData = this.getSearchData();
      let data = {
        ...this.pagination,
        ...searchData,
      };
      delete data["size"];
      delete data["current"];
      exportGuardianList(data).then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 下载模板
    downloadTemplate() {
      downloadGuardianTemplate().then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 表格操作
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.rowClick(item);
          break;
        case "edit":
          this.$refs["AddGuardians"].getGuardianDetail(item.id);
          break;
        case "del":
          delGuardian(item.id).then((res) => {
            this.$message.success(this.$t("consult.成功"));
            this.getList();
          });
          break;
      }
    },
    rowClick(row) {
      this.$router.push("/guardian/detail?id=" + row.id + "&type=2");
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getList();
    },
    handleSizeChange(size) {
      this.pagination["pageNum"] = 1;
      this.pagination["pageSize"] = size;
      this.getList();
    },
    // 搜索
    async search() {
      this.searchData = {};
      this.searchData = this.getSearchData();
      this.pagination["pageNum"] = 1;
      this.getList();
    },
    getSearchData() {
      let searchData = {};
      searchData["keyword"] = this.searchFrom["keyword"];
      searchData["schools"] = this.searchFrom["schools"];
      if (this.pagination["status"]) {
        searchData["status"] = this.pagination["status"];
      }
      if (
        this.searchFrom["createdTime"] &&
        this.searchFrom["createdTime"].length > 0
      ) {
        searchData["createTimeBegin"] = this.searchFrom["createdTime"][0];
        searchData["createTimeEnd"] = this.searchFrom["createdTime"][1];
      }
      return searchData;
    },
    // 清除搜索
    clear() {
      this.$store.dispatch("clearKeyword");
      this.pagination["pageNum"] = 1;
      this.searchData = {};
      this.searchFrom = {
        keyword: "",
        createdTime: [],
        schools: [],
      };
      this.search();
    },
    changeStasus(item, index) {
      this.isSelectAll = false;
      this.$refs["Table"].clearSelection();
      this.currentstatus = item.type;
      this.pagination["pageNum"] = 1;
      if (item.type == "-1") {
        delete this.pagination["status"];
      } else {
        this.pagination["status"] = item.type;
      }
      this.search();
    },
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return (
          res["permissions"] == "look" || this.permissions[res["permissions"]]
        );
      });
      return tableBtn;
    },
    changeModal(type) {},
    getDataLabel(pid, type, cid) {
      let str = "";
      this.pooldictionary.map((item) => {
        if (item.value == pid) {
          if (item["child"][type]) {
            let data = item["child"][type];
            data.map((c) => {
              if (c.value == cid) {
                str = this.i18nlocel == "en" ? c.enLabel : c.label;
              }
            });
          }
        }
      });
      return str;
    },
    addGuardians() {
      this.$refs["AddGuardians"].initGuardian();
    },
    closeModal(type) {
      this.showUpload = type;
      this.$refs["Table"].clearSelection();
    },
    // 发送邮件
    sendEmail() {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择咨询信息"));
      } else {
        this.$refs["sendemail"].initData(selectionId);
      }
    },
    changeSelectAll(e) {
      if (e) {
        this.selectAll();
      } else {
        this.cancelSelectAll();
      }
    },
    changeSelectedCount(length) {
      this.selectedCount = length;
      if (this.paginationTotal > 1000) {
        this.isSelectAll = this.selectedCount == 1000;
      } else {
        this.isSelectAll = this.selectedCount == this.paginationTotal;
      }
    },
    async selectAll() {
      let data = {
        ...this.searchData,
        pageSize: 1000,
      };
      if (this.currentstatus != "-1") {
        data["followStatus"] = [this.currentstatus];
      }
      let ids = await getGuardianIds(data);
      console.log("ids", ids);
      this.$refs["Table"].selectedIds = ids;
      this.$refs["Table"].selectionId = ids;
      this.$refs["Table"].syncSelectedRows();
    },
    cancelSelectAll() {
      this.$refs["Table"].clearSelection();
    },
    saveRequestParam() {
      this.requestParam = this.getSearchData();
      this.$refs["SaveRequestParam"].show();
    },
    // 保存查询条件
    async addRequestParam(name) {
      let data = await addRequestParam({
        description: name,
        type: "3",
        requestParam: JSON.stringify(this.requestParam),
      });
      this.$message.success(this.$t("consult.成功"));
      this.requestList = await getRequestParamList({ type: "3" });
    },
    // 获取查询条件
    setRequestParam() {
      this.search();
    },
    async initRequestParam() {
      this.requestList = await getRequestParamList({ type: "3" });

      if (this.requestList.length > 0) {
        this.selectCurrentRequestParam(this.requestList[0]);
      } else {
        this.setRequestParam();
      }
    },
    async delRequestParam(id) {
      await delRequestParam({
        ids: [id],
      });
      this.$message.success(this.$t("consult.成功"));
      this.requestList = await getRequestParamList({ type: "3" });
    },
    selectCurrentRequestParam(item) {
      let { id, requestParam } = item;
      this.searchRequestParamId = id;
      let data = JSON.parse(requestParam);
      this.searchData = {
        ...data,
      };

      this.$nextTick(() => {
        this.searchFrom = {
          keyword: data.keyword || "",
          schools: data.schools || [],
          createdTime:
            data.createTimeBegin && data.createTimeEnd
              ? [data.createTimeBegin, data.createTimeEnd]
              : [],
        };
        this.search();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-range__close-icon {
  display: none;
}
.searchFrom {
  // justify-content: space-between;
}
.df_align_center {
  flex-wrap: wrap;
}
</style>
