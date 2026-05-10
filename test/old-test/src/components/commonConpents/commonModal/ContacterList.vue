<template>
  <el-dialog
    title="选择联系人"
    :before-close="cancel"
    :visible.sync="showContacterList"
    width="80%"
  >
    <div :class="['searchBox', 'df_sb']" v-if="showallcontacter">
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
        >新增联系人</el-button
      >
    </div>
    <TableBox
      ref="table"
      :tableObj="tableObj['contacterlist']"
      :tableData="tableData"
    />
    <Pagination
      v-if="showallcontacter"
      @getDataList="getDataList"
      ref="Pagination"
    />
    <span slot="footer" class="dialog-footer fromBtn">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { tableObj } from "@/const/tabledata/index";
import {
  fetchContacterList,
  fetClientContacter,
  addObj,
} from "@/api/contact/contacter";
import { deepClone } from "@/util/util";
import Pagination from "@/components/commonConpents/PaginationModal";
import TableBox from "@/components/commonConpents/TableBox";
export default {
  name: "UniUiContacterlist",
  props: {
    showContacterList: Boolean,
  },
  data() {
    return {
      input: "",
      total: 100,
      tableObj: tableObj,
      tableData: [],
      showAddNewContart: false,
      dialogVisible: false,
      currentfilterObj: {},
      showallcontacter: false,
    };
  },
  created() {
    let name = this.$route.name;
    if (name == "新增客户" || name == "编辑客户") {
      this.showallcontacter = true;
    }
  },
  mounted() {},

  methods: {
    getDataList(data) {
      this.currentfilterObj = data;
      fetchContacterList(data).then((res) => {
        let data = deepClone(res.data.data);
        let { records, total } = data;
        this.$nextTick(() => {
          this.tableData = records;
          this.$refs.Pagination.total = total;
        });
      });
    },
    fetClientContacter(id) {
      fetClientContacter(id).then((res) => {
        this.tableData = res.data.data;
      });
    },
    submitForm() {
      this.$emit(
        "changeshowContacterList",
        false,
        this.$refs.table.SelectionList
      );
    },
    addNewContacter() {
      this.$emit("changeshowContacterList", false);
      this.$router.push("/contact/contacter/add");
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
    addNewContacter() {
      this.$emit("changeshowContacterList", false);
      this.$router.push("/contact/contacter/add");
    },
    cancel() {
      this.$emit("changeshowContacterList", false);
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