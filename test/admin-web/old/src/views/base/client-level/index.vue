<template>
  <div>
    <Table :tableTitle="tableTitle" :labelobj="labelobj" />
  </div>
</template>

<script>
import Table from "../basecomponents/table.vue";
export default {
  components: {
    Table,
  },
  data() {
    return {
      tableTitle: [
        { prop: "label", label: "客户等级" },
        { prop: "sort", label: "排序" },
        { prop: "status", label: "启用状态" },
      ],
      labelobj: {
        label: "客户等级",
        prop: "label",
        type: "client_level",
      },
      tableTitle: [
        { prop: "label", label: "合同指标" },
        { prop: "remark", label: "单位" },
        // { prop: "time", label: "配置时间" },
        // { prop: "tenantId", label: "配置人" },
        { prop: "status", label: "启用状态" },
      ],
      tableData: [],
      playBtn: ["编辑", "启用", "删除"],
      labelobj: {
        label: "合同指标",
        prop: "label",
        type: "contract_quota",
      },
    };
  },
};
</script>
 
<style lang = "scss" scoped>
</style>