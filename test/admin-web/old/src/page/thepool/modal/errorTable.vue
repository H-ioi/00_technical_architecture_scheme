<template>
  <div class="thepool_page">
    <el-dialog
      title="查看错误数据"
      :visible="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
	   custom-class="pooldialog"
    >
      <div style="max-height: 800px; overflow: auto">
        <el-form :label-position="'top'" :inline="true" ref="from">
          <el-form-item
            style="width: 100%"
            :label="`成功：${infoData['successCount']}条,失败：${infoData['failCount']}条`"
          >
            <Table
              style="width: 100%"
              ref="Table"
              :tableTitle="tabelTitle"
              :tableData="tableData"
              :tableBtn="[]"
              :showSelection="false"
            />
          </el-form-item>

          <el-form-item class="modalFromBtn" style="width: 100%">
            <el-button type="primary" size="medium" round @click="downTable">{{
              $t("consult.下载")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Table from "@/components/thepoolcommon/Table.vue";
export default {
  name: "guardians",
  components: {
    Table,
  },
  props: {},
  data() {
    return {
      showModal: false,
      tabelTitle: [
        {
          prop: "rowNum",
          label: "行数",
        },
        {
          prop: "errMsg",
          label: "错误信息",
        },
      ],
      tableData: [],
      infoData: {},
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([]),
  },
  methods: {
    show(data) {
      this.showModal = true;
      this.$nextTick(() => {
        let { errList, failCount, successCount } = data;
        this.tableData = errList;
        this.infoData = {
          failCount,
          successCount,
        };
      });
    },
    downTable() {
      // 定义 CSV 内容的表头
      const headers = this.tabelTitle.map((item) => item.label).join(",");
      // 转换表格数据为 CSV 行
      const rows = this.tableData.map((item) => {
        return this.tabelTitle
          .map((title) => {
            let value = item[title.prop];
            // 处理值中包含逗号的情况，用双引号包裹
            if (typeof value === "string" && value.includes(",")) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",");
      });

      // 合并表头和数据行
      const csvContent = [headers, ...rows].join("\n");

      // 创建一个 Blob 对象
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      // 创建一个下载链接
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "error_table.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
.modalFromBtn {
  text-align: center;
}
</style>
