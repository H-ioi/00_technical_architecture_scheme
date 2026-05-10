<template>
  <div class="space">
    <el-scrollbar
      class="space_right"
      ref="space_right"
      style="background: #ffffff; padding: 30px"
    >
      <div class="title">使用列表</div>
      <div class="df_fa" style="height: calc(100% - 54px)">
        <el-scrollbar class="areaList">
          <div
            @click="changeSchool(i)"
            :class="[
              'areaItem',
              {
                areaItem_active: currentSchool == i.id,
              },
            ]"
            v-for="(i, k) in spaceTop"
            :key="k"
          >
            {{ i.name }}
          </div>
        </el-scrollbar>
        <div style="flex: 1">
          <div class="searchFromBox search">
            <el-form
              ref="searchFrom"
              class="df_align_center"
              :label-position="'top'"
              :inline="true"
              :model="searchFrom"
              :rules="searchRules"
            >
              <el-form-item label="关键词" style="width: 15%">
                <el-input
                  v-model="searchFrom.keywords"
                  placeholder="请输入关键词"
                ></el-input>
              </el-form-item>
              <el-form-item label="空间类型" style="width: 15%">
                <el-select
                  multiple
                  clearable
                  v-model="searchFrom.typeIds"
                  placeholder="请选择"
                >
                  <el-option
                    :key="k"
                    v-for="(i, k) in spaceType"
                    :label="i.name"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="使用时间" style="width: 30%">
                <el-date-picker
                  style="width: 100%"
                  v-model="searchFrom.time"
                  type="datetimerange"
                  :clearable="false"
                  range-separator="至"
                  start-placeholder="开始"
                  end-placeholder="结束"
                  :value-format="'yyyy-MM-dd HH:mm'"
                  :format="'yyyy-MM-dd HH:mm'"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item style="width: auto; margin-right: 0">
                <el-button
                  class="el-button-icon"
                  type="primary"
                  size="large"
                  icon="el-icon-search"
                  @click="search"
                ></el-button>
                <el-button
                  class="el-button-icon"
                  type="defult"
                  size="large"
                  icon="el-icon-delete"
                  @click="clear"
                ></el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="df_sb paginationInfo" style="margin-top: 0px">
            <div>
              <el-button
                v-if="permissions['space_reserve_export']"
                type="primary"
                size="medium"
                :loading="loadingDownload"
                @click="downloadSpaceUsage"
                >导出</el-button
              >
            </div>
            <PaginationInfo :paginationTotal="paginationTotal" />
          </div>
          <Table
            v-loading="loadingTable"
            ref="Table"
            :tableTitle="tableTitle"
            :tableData="tableData"
            :tableBtn="tableBtn"
            :showSelection="false"
            @playTab="playTab"
          />
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </el-scrollbar>
    <Spaceusage
      ref="spaceusage"
      :showSpaceusage="showSpaceusage"
      :spaceusageType="spaceusageType"
      @changeModal="changeModal"
      @refreshData="refreshData"
    />
  </div>
</template>
        
    <script>
import { mapGetters } from "vuex";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import { getSpaceTop, getAllSpaceType } from "@/api/space/spacetype.js";
import { deepClone } from "@/util/util.js";
import {
  getSpaceUsagePage,
  downloadSpaceUsage,
  delSpaceUsage,
} from "@/api/space/spaceusage.js";
import { spaceStatus } from "@/const/space/index.js";
import { download } from "@/util/download.js";
import Spaceusage from "@/page/space/modal/spaceusage";
export default {
  components: {
    Table,
    PaginationInfo,
    Pagination,
    Spaceusage,
  },
  data() {
    return {
      // 空间状态
      spaceStatus: spaceStatus,
      // 空间类型
      spaceType: [],
      // 查询条件
      searchFrom: {
        time: [],
        typeIds: [],
        keywords: "",
      },
      searchRules: {},
      spaceTop: [],
      currentSchool: "",

      // 分页
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      // 表格
      tableTitle: [
        { label: "使用人", prop: "username", width: "" },
        { label: "使用人电话", prop: "phone", width: "" },
        { label: "使用空间", prop: "spaceName", width: "" },
        { label: "空间类型", prop: "typeName", width: "" },
        { label: "开始时间", prop: "startTime", width: "" },
        { label: "结束时间", prop: "endTime", width: "" },
        // { label: "备注信息", prop: "remark", width: "" },
        // { label: "填写人", prop: "enterUserName", width: "" },
      ],
      tableData: [],
      tableBtn: [
        {
          name: "编辑",
          type: "edit",
          permissions: "space_reserve_edit",
          color: "",
        },
        {
          name: "删除",
          type: "delete",
          permissions: "space_usage_del",
          color: "",
        },
      ],
      loadingTable: false,
      loadingDownload: false,
      showSpaceusage: false,
      spaceusageType: "edit",
    };
  },

  computed: {
    ...mapGetters(["dictionary", "permissions"]),
  },

  created() {
    this.getSpaceTop();
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
  },
  activated() {
    this.getSpaceUsagePage(this.pagination, this.currentSchool);
  },
  methods: {
    // 筛选条件
    search() {
      this.$refs["searchFrom"].validate((valid) => {
        console.log("valid", this.searchFrom);
        if (valid) {
          let data = deepClone(this.searchFrom);
          if (data["time"]) {
            this.pagination = {
              ...this.pagination,
              ...data,
              startTime: data["time"][0],
              endTime: data["time"][1],
              current: 1,
            };
            delete this.pagination.time;
          }
          this.getSpaceUsagePage(this.pagination, this.currentSchool);
        }
      });
    },
    clear() {
      this.searchFrom = { time: [], typeIds: [], keywords: "" };
      this.pagination["current"] = 1;
      delete this.pagination["typeIds"];
      delete this.pagination["keywords"];
      delete this.pagination["startTime"];
      delete this.pagination["endTime"];
      this.getSpaceUsagePage(this.pagination, this.currentSchool);
    },
    getSpaceUsagePage(data, id) {
      if (id == "") return;
      this.loadingTable = true;
      getSpaceUsagePage(data, id)
        .then((res) => {
          console.log(6666666);
          if (res.data.success) {
            this.tableData = res.data.data.records;
            this.paginationTotal = res.data.data.total;
            this.tableData.map((item) => {
              item["typeName"] = this.getTypeName(item.typeForms);
            });
            this.loadingTable = false;
          } else {
            this.loadingTable = false;
          }
        })
        .catch(() => {
          this.loadingTable = false;
        });
    },
    getTypeName(data) {
      let arr = [];
      data.map((item) => {
        arr.push(item.typeName);
      });
      return arr.length > 0 ? String(arr) : "--";
    },
    getSpaceTop() {
      getSpaceTop().then((res) => {
        if (res.data.success) {
          this.spaceTop = res.data.data;
          this.changeSchool(this.spaceTop[0]);
        }
      });
    },
    // 删除使用
    delSpaceUsage(id) {
      delSpaceUsage(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已删除");
          this.getSpaceUsagePage(this.pagination, this.currentSchool);
        }
      });
    },
    getAllSpaceType(spaceId) {
      getAllSpaceType(spaceId).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.spaceType = data;
          // this.spaceType = data.filter((item) => {
          //   return item.status;
          // });
        }
      });
    },
    downloadSpaceUsage() {
      let _this = this;
      this.loadingDownload = true;
      downloadSpaceUsage(this.currentSchool, this.searchFrom)
        .then((res) => {
          setTimeout(() => {
            this.loadingDownload = false;
          }, 1000);
          if (res.status == 500) {
            console.log("res.status", res.status);
            let reader = new FileReader();
            reader.onload = function (e) {
              let readerres = reader.result;
              let msg = JSON.parse(readerres);
              _this.$message.warning(msg.msg);
            };
            reader.readAsText(res.data, "utf-8");
          } else {
            download(res.data, res.headers["content-disposition"]);
          }
        })
        .catch(() => {
          this.loadingDownload = false;
        });
    },
    changeSchool(i) {
      this.currentSchool = i.id;
      this.getAllSpaceType(i.id);
      this.getSpaceUsagePage(this.pagination, this.currentSchool);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getSpaceUsagePage(this.pagination, this.currentSchool);
    },
    playTab(name, item, scope) {
      switch (name) {
        case "edit":
          // this.showSpaceusage = true;
          // this.setFormData(item);
          this.$router.push(
            `/space/usereservation?pid=${this.currentSchool}&id=${item.spaceId}&startTime=${item.startTime}}&spaceName=${item.spaceName}`
          );
          break;
        case "delete":
          this.delSpaceUsage(item.id);
          break;
      }
    },
    changeModal(type) {
      this.showSpaceusage = type;
    },
    refreshData() {
      this.getSpaceUsagePage(this.pagination, this.currentSchool);
    },
    setFormData(item) {
      this.$nextTick(() => {
        this.$refs["spaceusage"].ruleForm = {
          ...item,
          time: "00:00", //无用的
        };
      });
    },
  },
};
</script>
         
  <style lang = "scss" scoped>
.search {
  padding: 0 !important;
  box-shadow: none !important;
  margin-bottom: 20px;
}
</style>