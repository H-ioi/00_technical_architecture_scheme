<template>
  <div class="community_pagination">
    <div></div>
    <el-pagination
      :hide-on-single-page="true"
      :current-page="pagination['current']"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="pagination['size']"
      :layout="getLayout"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
    >
    </el-pagination>
  </div>
</template>

<script>
import { has } from "lodash";

export default {
  name: "Pagination",
  props: {
    hasSizes: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      require: true,
    },
    pagination: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      layout: ["total", "prev", "pager", "next", "slot"],
      sizesLayout: ["total", "prev", "pager", "next", "slot", "sizes"],
    };
  },

  mounted() {},
  computed: {
    // 超过7页显示快捷跳转
    getLayout() {
      let layoutList = [];
      layoutList = this.hasSizes ? this.sizesLayout : this.layout;
      if (this.total > 10) {
        if (!layoutList.includes("jumper")) {
          layoutList.push("jumper");
        }
      }
      return String(layoutList);
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
  },
};
</script>

<style lang="scss" scoped></style>
