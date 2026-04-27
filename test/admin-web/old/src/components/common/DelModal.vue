<template>
  <el-dialog
    title="提示"
    :visible.sync="showDelModal"
    width="360px"
    :before-close="closeModal"
  >
    <p class="delMoadlText">确定删除所选内容？</p>
    <span slot="footer" class="modalFromBtn">
      <el-button size="medium" @click="closeModal">取 消</el-button>
      <el-button type="primary" size="medium" @click="handleOkDel"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showDelModal: {
      require: true,
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleOkDel() {
      this.$emit("handleOkDel");
    },
    closeModal() {
      this.$emit("closeModal", false);
    },
  },
};
</script>
 
<style lang = "scss" scoped>
.delMoadlText {
  color: #333333;
  text-align: center;
  font-weight: bold;
  line-height: 0px;
}
</style>