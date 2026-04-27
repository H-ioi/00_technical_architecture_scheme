<template>
  <el-dialog
    :title="`绑定资产`"
    :visible.sync="showBindSpace"
    width="1200px"
    top="5vh"
    :before-close="closeModal"
  >
    <div class="table">
      <el-scrollbar style="height: 600px">
        <Table
          ref="Table"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :tableBtn="tableBtn"
          :showSearch="true"
        />
      </el-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeModal">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getSpaceAssetUnbind,
  bindSpaceAsset
} from "@/api/assets/list/index.js";
import { assetsStatus } from "@/const/assets/index.js";
import Table from "@/components/common/Table.vue";
import { deepClone } from "@/util/util.js";
export default {
  props: {
    spaceId: String,
    showBindSpace: Boolean
  },
  components: {
    Table
  },
  data() {
    return {
      assetsStatus: assetsStatus,
      // 表格
      tableTitle: [
        { label: "资产名称", prop: "name", width: "" },
        // { label: "资产类型", prop: "typeNames", width: "" },
        { label: "资产编码", prop: "code", width: "" },
        { label: "采购日期", prop: "purchaseTime", width: "" },
        { label: "资产状态", prop: "assetsStatus", width: "" },
        { label: "所属空间", prop: "space", width: "" }
      ],
      tableData: [],
      tableBtn: []
    };
  },
  watch: {},
  created() {
    this.getSpaceAssetUnbind();
  },
  methods: {
    getSpaceAssetUnbind() {
      getSpaceAssetUnbind({ spaceId: this.spaceId }).then(res => {
        if (res.data.success) {
          let list = [];
          let data = res.data.data;
          this.tableData = data;
          // this.tableData = data.filter((item) => {
          //   // return item.status != 3;
          // });
          this.tableData.map(item => {
            item["assetsStatus"] = this.getAssetsStatus(item.status);
            if (item.spaceId == this.spaceId) {
              list.push(item);
            }
          });
          console.log("list", list);
          this.$nextTick(() => {
            this.$refs["Table"].toggleSelection(list);
          });
        }
      });
    },
    handleOk() {
      let selectAssetsId = this.$refs["Table"].selectionId;
      if (selectAssetsId.length == 0) {
        this.$message.warning("请先选择数据");
      } else {
        let dataStr = "?spaceId=" + this.spaceId;
        selectAssetsId.map(item => {
          dataStr += "&ids=" + item;
        });
        bindSpaceAsset(dataStr).then(res => {
          if (res.data.success) {
            this.$message.success("绑定成功");
            this.$emit("refreshData");
          }
        });
      }
    },
    getAssetsStatus(status) {
      let statusName = "--";
      this.assetsStatus.map(item => {
        if (item.type == status) {
          statusName = item.name;
        }
      });
      return statusName;
    },
    closeModal() {
      this.$emit("closeModal", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  height: 600px;
}
</style>
