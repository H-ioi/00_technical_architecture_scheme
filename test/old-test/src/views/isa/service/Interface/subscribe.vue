<template>
  <div class="isa_center_page">
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">接口订阅</div>
      </div>
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item style="width: 20%">
          <el-input
            v-model="searchFrom['interfaceName']"
            placeholder="请输入接口名"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: 20%">
          <el-select
            v-model="searchFrom['interfaceStatus']"
            placeholder="请选择状态"
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
          v-if="permissions['interface_sub_add']"
          type="primary"
          size="medium"
          @click="changeInterfaceFile('add')"
          >新增</el-button
        >
      </div>
      <PaginationInfo :paginationTotal="paginationTotal" />
    </div>
    <div class="tableBox">
      <Table
        ref="Table"
        :showSelection="false"
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
    <FileModal
      ref="FileModal"
      @resetPageList="getPageList"
      :statusList="statusList"
    />
    <!-- 详情弹窗 -->
    <el-dialog
      title="查看详情"
      :visible.sync="showDialog"
      width="80%"
      :before-close="() => (showDialog = false)"
    >
      <div class="tabledata">
        <div
          class="dataitem"
          :style="`width:${item['prop'] == 'applyContent' ? '100%' : '30%'}`"
          v-for="(item, index) in tableTitle"
          :key="index"
        >
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
  getInterfaceSubPage,
  editInterfaceSubStatus,
  delInterfaceSub
} from "@/api/isa/interfacemanager.js";
import { download } from "@/util/download.js";
import moment from "moment";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import FileModal from "./modal/subscribe.vue";
export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table,
    FileModal
  },
  data() {
    return {
      fileModalType: "",
      showDialog: false,
      currenntItem: {},
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      searchFrom: {
        interfaceName: "",
        interfaceStatus: ""
      },
      tableTitle: [
        { label: "ID", prop: "id", width: "" },
        { label: "接口名", prop: "interfaceName", width: "" },
        { label: "申请时间", prop: "applyTime", width: "" },
        { label: "状态", prop: "interfaceStatusLabel", width: "" },
        { label: "对接系统", prop: "dockingSystem", width: "" },
        { label: "申请内容", prop: "applyContent", width: "" }
      ],
      tableBtn: [],
      btnList: [
        { name: "查看", type: "look", icon: "", permissions: "" },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "interface_sub_edit"
        },
        {
          name: "启用",
          type: "status",
          icon: "",
          permissions: "interface_sub_control"
        },
        {
          name: "禁用",
          type: "status",
          icon: "",
          permissions: "interface_sub_control"
        },
        {
          name: "删除",
          type: "delete",
          icon: "",
          permissions: "interface_sub_del"
        }
      ],
      tableData: [],
      statusList: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 }
      ]
    };
  },
  created() {
    this.tableBtn = this.btnList.filter(item => {
      return item["type"] == "look" || this.permissions[item["permissions"]];
    });
    this.getPageList();
  },
  mounted() {},
  activated() {
    this.getPageList();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getPageList() {
      getInterfaceSubPage({
        ...this.pagination,
        ...this.searchFrom
      }).then(res => {
        if (res.data.success) {
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data.map(item => {
            return {
              ...item,
              status: item["interfaceStatus"],
              applyTime: !item["applyTime"]
                ? "--"
                : moment(item["applyTime"]).format("YYYY/MM/DD hh:mm"),
              interfaceStatusLabel: item["interfaceStatus"] ? "启用" : "禁用"
            };
          });
        }
      });
    },
    changeInterfaceFile(type, item = {}) {
      this.$refs["FileModal"].initData(type, item);
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          this.showDialog = true;
          break;
        case "edit":
          this.changeInterfaceFile("edit", item);
          break;
        case "status":
          let data = new FormData();
          data.append("interfaceSubid", item["id"]);
          data.append("interfaceStatus", item["interfaceStatus"] ? 0 : 1);
          editInterfaceSubStatus(data).then(res => {
            this.getPageList();
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          });
          break;
        case "delete":
          delInterfaceSub(item["id"]).then(res => {
            this.getPageList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
          break;
      }
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
      this.searchFrom["interfaceName"] = "";
      this.searchFrom["interfaceStatus"] = "";
      this.pagination["current"] = 1;
      this.getPageList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
