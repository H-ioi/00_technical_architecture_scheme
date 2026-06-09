/**
 * 校巴列表页布局 mixin（对齐 schoolDoctor community_centent_v2）
 * - 表格固定高度、勾选批量操作
 */
export default {
  data() {
    return {
      selectedIds: [],
      searchOpen: false,
      /** 子 Tab 页（路线规划内）设为 true，表格高度预留 Tab 栏 */
      schoolbusTabLayout: false,
    };
  },
  computed: {
    schoolbusTableHeight() {
      const offset = (this.searchOpen ? 345 : 295) + (this.schoolbusTabLayout ? 45 : 0);
      return `calc(100vh - ${offset}px)`;
    },
  },
  methods: {
    handleSelectionChange(selection) {
      this.selectedIds = (selection || []).map((item) => item.id);
    },
    /** 批量删除确认 */
    confirmBatchDelete(onConfirm) {
      if (!this.selectedIds.length) return;
      this.$confirm(this.$t('schoolbus.确定要删除吗？'), this.$t('schoolbus.删除'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning',
      }).then(onConfirm);
    },
  },
};
