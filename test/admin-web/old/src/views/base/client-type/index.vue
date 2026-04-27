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
        { prop: "label", label: "客户类型" },
        { prop: "sort", label: "排序" },
        { prop: "status", label: "启用状态" },
      ],
      labelobj: {
        label: "客户类型",
        prop: "label",
        type: "client_type",
      },
    };  
  },
};
</script>
 
<style lang = "scss" scoped>
</style>