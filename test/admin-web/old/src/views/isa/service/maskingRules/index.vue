<template>
  <div class="isa_center_page">
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">脱敏规则</div>
      </div>
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item style="width: 20%">
          <el-input
            v-model="searchFrom['FName']"
            placeholder="请输入字段名"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: 20%">
          <el-select
            v-model="searchFrom['maskingMethod']"
            placeholder="请选择脱敏方式"
          >
            <el-option
              v-for="item in maskingMethodList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 20%">
          <el-select
            v-model="searchFrom['maskingStatus']"
            placeholder="请选择脱敏状态"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
    <div class="df_sb palyTableBox">
      <div>
        <el-button
          v-if="permissions['masking_rules_add']"
          type="primary"
          size="medium"
          @click="changeData('add')"
          >新增</el-button
        >
        <el-button
          v-if="permissions['masking_rules_del']"
          type="primary"
          size="medium"
          @click="deletes"
          >删除</el-button
        >
      </div>
      <PaginationInfo :paginationTotal="paginationTotal" />
    </div>
    <div class="tableBox">
      <Table
        ref="Table"
        :showSelection="true"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        @playTab="playTab"
      />
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <!-- 新增编辑弹窗 -->
    <MaskingModal
      ref="MaskingModal"
      :maskingMethodList="maskingMethodList"
      :statusList="statusList"
      :appScenarioList="appScenarioList"
      @resetPageList="getPageList"
    />
    <!-- 详情弹窗 -->
    <el-dialog
      title="查看详情"
      :visible.sync="showDialog"
      width="80%"
      :before-close="() => (showDialog = false)"
    >
      <div class="tabledata">
        <div class="dataitem" v-for="(item, index) in tableTitle" :key="index">
          <div class="dataitem_label">{{ item["label"] }}</div>
          <div class="dataitem_value">
            {{ currenntItem[item["prop"]] ? currenntItem[item["prop"]] : "--" }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getMaskingMethodList,
  getMaskingRulesPage,
  getMaskingRulesDetail,
  editMaskingRulesStatus,
  delMaskingRules
} from "@/api/isa/maskingRules.js";
import moment from "moment";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import MaskingModal from "./modal/maskingmodal.vue";
export default {
  name: "maskingRules",
  components: {
    Pagination,
    PaginationInfo,
    Table,
    MaskingModal
  },
  data() {
    return {
      showDialog: false,
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      searchFrom: {
        FName: "",
        maskingMethod: "",
        maskingStatus: ""
      },
      tableTitle: [
        { label: "ID", prop: "id", width: "" },
        { label: "字段名", prop: "fname", width: "" },
        { label: "脱敏规则", prop: "maskingRule", width: "" },
        { label: "脱敏方式", prop: "maskingMethodLabel", width: "" },
        { label: "创建人", prop: "creator", width: "" },
        { label: "应用场景", prop: "appScenarioLabel", width: "" },
        { label: "状态", prop: "maskingStatusLabel", width: "" },
        { label: "创建时间", prop: "createTime", width: "" },
        { label: "更新时间", prop: "updateTime", width: "" }
      ],
      tableBtn: [],
      btnList: [
        {
          name: "查看",
          type: "look",
          icon: "",
          permissions: ""
        },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "masking_rules_edit"
        },
        {
          name: "启用",
          type: "status",
          icon: "",
          permissions: "masking_rules_control"
        },
        {
          name: "禁用",
          type: "status",
          icon: "",
          permissions: "masking_rules_control"
        },
        {
          name: "删除",
          type: "delete",
          icon: "",
          permissions: "masking_rules_del"
        }
      ],
      currenntItem: {},
      tableData: [],
      maskingMethodList: [],
      maskingMethodObj: {},
      statusList: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 }
      ],
      appScenarioList: [
        { label: "展示", value: "0" },
        { label: "下载", value: "1" }
      ]
    };
  },
  created() {
    this.tableBtn = this.btnList.filter(item => {
      return item["type"] == "look" || this.permissions[item["permissions"]];
    });
    this.getMaskingMethodList();
  },
  mounted() {},
  activated() {
    this.getMaskingMethodList();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getMaskingMethodList() {
      getMaskingMethodList().then(res => {
        if (res.data.success) {
          let data = res.data.data;
          this.maskingMethodObj = data;
          Object.keys(data).forEach(item => {
            this.maskingMethodList.push({
              label: data[item],
              value: String(item)
            });
          });
          this.getPageList();
        }
      });
    },
    getPageList() {
      getMaskingRulesPage({
        ...this.pagination,
        ...this.searchFrom
      }).then(res => {
        if (res.data.success) {
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data.map(item => {
            return {
              ...item,
              status: item["maskingStatus"],
              createTime: moment(item["createTime"]).format("YYYY/MM/DD hh:mm"),
              updateTime: !item["updateTime"]
                ? "--"
                : moment(item["updateTime"]).format("YYYY/MM/DD hh:mm"),
              maskingStatusLabel: item["maskingStatus"] ? "启用" : "禁用",
              maskingMethodLabel: this.maskingMethodObj[item["maskingMethod"]],
              appScenarioLabel: String(
                this.getAppScenarioLabel(item["appScenario"])
              )
            };
          });
        }
      });
    },
    getAppScenarioLabel(value) {
      let arr = value.split(",");
      let data = [];
      this.appScenarioList.map(item => {
        if (arr.includes(item["value"])) {
          console.log('item["label"]', item["label"]);
          data.push(item["label"]);
        }
      });
      return data;
    },
    changeData(type, item = {}) {
      this.$refs["MaskingModal"].initData(type, item);
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          this.showDialog = true;
          break;
        case "edit":
          this.changeData("edit", item);
          break;
        case "status":
          let data = new FormData();
          data.append("maskingRulesid", item["id"]);
          data.append("maskingStatus", item["maskingStatus"] ? 0 : 1);
          editMaskingRulesStatus(data).then(res => {
            this.getPageList();
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          });
          break;
        case "delete":
          this.delMaskingRules([item["id"]]);

          break;
      }
    },
    deletes() {
      let selectAssetsId = this.$refs["Table"].selectionId;
      if (selectAssetsId.length == 0) {
        this.$message.warning("请先选择数据");
      } else {
        this.$confirm("确认删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delMaskingRules(selectAssetsId);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    delMaskingRules(ids) {
      let data = new FormData();
      data.append("maskingRulesIds", ids);
      delMaskingRules(data).then(res => {
        this.getPageList();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },

    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getPageList();
    },
    // 搜索
    search() {
      this.pagination["current"] = 1;
      this.getPageList();
    },
    clear() {
      this.searchFrom = {
        FName: "",
        maskingMethod: "",
        maskingStatus: ""
      };
      this.pagination["current"] = 1;
      this.getPageList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
