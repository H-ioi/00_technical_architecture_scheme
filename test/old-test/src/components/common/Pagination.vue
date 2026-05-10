<template>
  <div class="commonPpagination">
    <el-pagination
      :current-page="pagination['current']"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="pagination['size']"
      :layout="getLayout"
      :total="total"
      :page-sizes="[10, 50, 100]"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "PCOrderPagination",
  props: {
    total: {
      type: Number,
      require: true,
    },
    pagination: {
      type: Object,
      require: true,
    },
    showPageSizes: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      layout: ["prev", "pager", "next", "slot"],
    };
  },
  created() {
    this.resetLayout(this.showPageSizes);
  },
  mounted() {},
  computed: {
    // 超过7页显示快捷跳转
    getLayout() {
      let layoutList = [];
      layoutList = this.layout;
      if (this.total > 10) {
        if (!layoutList.includes("jumper")) {
          layoutList.push("jumper");
        }
      }
      return String(layoutList);
    },
  },
  methods: {
    resetLayout(newVal) {
      console.log("resetLayout", newVal);

      if (newVal) {
        this.layout.push("sizes");
      } else {
        this.layout = this.layout.filter((item) => item !== "sizes");
      }
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
  },
};
</script>

<style lang="scss" scoped></style>
