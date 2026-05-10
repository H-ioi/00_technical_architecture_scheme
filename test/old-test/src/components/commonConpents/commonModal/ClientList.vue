<template>
  <el-dialog
    title="选择客户"
    :before-close="closeModal"
    :visible.sync="showClientList"
    width="80%"
  >
    <div :class="['searchBox', 'df_sb']">
      <el-input
        prefix-icon="el-icon-search"
        placeholder="请输入内容"
        v-model="input"
        clearable
        size="medium"
        style="width: 370px; border-color: #ccc"
        @keyup.enter.native="filterStatus('keyword', input)"
      >
      </el-input>
      <el-button class="btn_small" type="primary" @click="addNewContacter"
        >新增客户</el-button
      >
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="tableObj.headercellstyle"
      :row-style="tableObj.rowstyle"
      @row-click="rowclick"
    >
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        v-for="(item, index) in tableObj['clientlist']['labelType']"
        :key="index"
      >
      </el-table-column>
    </el-table>
    <!-- <TableBox
      ref="table"
      :tableObj="tableObj['clientlist']"
      :tableData="tableData"
    /> -->
    <Pagination @getDataList="getDataList" ref="Pagination" />
    <!-- <span slot="footer" class="dialog-footer fromBtn">
      <el-button @click="closeModal">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span> -->
  </el-dialog>
</template>

<script>
import { tableObj } from "@/const/tabledata/index";
import { fetchClientList, addObj } from "@/api/contact/client";
import { deepClone } from "@/util/util";
import { setStore, getStore, removeStore } from "@/util/store";
import Pagination from "@/components/commonConpents/PaginationModal";
import TableBox from "@/components/commonConpents/TableBoxRadio";
export default {
  name: "UniUiContacterlist",
  props: {
    showClientList: Boolean,
  },
  data() {
    return {
      input: "",
      total: 100,
      tableObj: tableObj,
      tableData: [],
      dialogVisible: false,
      currentfilterObj: {},
    };
  },
  created() {},
  mounted() {},

  methods: {
    getDataList(data) {
      this.currentfilterObj = data;
      fetchClientList(data).then((res) => {
        let data = deepClone(res.data.data);
        let { records, total } = data;
        this.$nextTick(() => {
          this.tableData = records;
          this.$refs.Pagination.total = total;
        });
      });
    },
    submitForm() {
      // this.$emit("changeClientListList", false, this.$refs.table.selectitem[0]);
      this.$emit("changeClientListList", false);
    },
    addNewContacter() {
      this.$emit("changeClientListList", false);
      this.$router.push("/contact/client/index/addcontact");
    },
    // 筛选数据
    filterStatus(key, value) {
      let obj = {
        size: 10,
        current: 1,
      };
      this.$refs.Pagination["pagination"] = obj;
      if (value !== 0) {
        obj[key] = value;
      }
      this.getDataList(obj);
    },
    closeModal() {
      this.$emit("closeModal", false);
    },
    rowclick(row, column, event) {
      console.log(row, column, event);
      this.$emit("changeClientListList", false, row);
    },
  },
  components: {
    Pagination,
    TableBox,
  },
};
</script>

<style lang="scss" scoped>
</style>