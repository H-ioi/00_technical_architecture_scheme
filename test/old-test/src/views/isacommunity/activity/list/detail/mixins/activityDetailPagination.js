/** 列表子 Tab 共用：翻页后拉取 getList（各组件需自带 pagination、getList） */
export default {
  methods: {
    handleCurrentChange(page) {
      this.pagination.current = page;
      this.getList();
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.current = 1;
      this.getList();
    },
  },
};
