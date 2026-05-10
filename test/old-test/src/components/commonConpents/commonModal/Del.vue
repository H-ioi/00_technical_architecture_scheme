<template>
  <el-dialog
    title="提示"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="isdel"
    width="30%"
    :before-close="Close"
  >
    <span>确定删除吗？</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Close">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "UniUiDel",
  props: {
    isdel: Boolean,
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {
    Close() {
      this.$emit("Close", false);
    },
    handleOk() {
      this.$emit("isdelcurrent");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>