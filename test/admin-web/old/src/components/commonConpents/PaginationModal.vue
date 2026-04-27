<template>
  <div :class="['pagination', 'df_fe']">
    <el-pagination
      background
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination['current']"
      :page-sizes="pageSizes"
      :page-size="pagination['size']"
      layout="slot,prev, pager, next, jumper"
      :total="total"
    >
      <span>{{
        `共有信息 ${total} 条 目前显示${pagination["size"]}条`
      }}</span>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "UniUiPagination",
  props: {
    // pagination: Object,
  },
  data() {
    return {
      pageSizes: [10, 20, 30, 40],
      total: 0,
      pagination: {
        size: 10,
        current: 1,
        status: 1,
      },
    };
  },
  created() {
    this.changepagination();
  },
  mounted() {},

  methods: {
    changepagination() {
      this.$emit("getDataList", this.pagination);
    },
    handleCurrentChange(e) {
      this.pagination["current"] = e;
      this.changepagination();
    },
    handleSizeChange(e) {
      this.pagination["size"] = e;
      this.changepagination();
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  padding: 30px 10px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 16px;
  span,
  /deep/.el-pager,
  /deep/.el-pagination__jump,
  /deep/.el-pagination__sizes,
  /deep/.el-input__inner {
    font-size: 16px;
    font-family: Noto Sans S Chinese;
    font-weight: 600;
    color: #667e9e;
  }
  /deep/.el-pager li {
    font-size: 16px;
  }
  /deep/.el-icon {
    font-size: 16px !important;
  }
  /deep/.el-pagination__sizes {
    margin-right: 0;
  }
  /deep/.el-input__inner {
    height: 28px !important;
  }
}
</style>