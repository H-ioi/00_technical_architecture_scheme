<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="closeModal"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm tagmodal"
      label-position="top"
    >
      <el-form-item label="名称" prop="label">
        <el-input style="width: 50%" v-model="ruleForm.label"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="ruleForm['sort']"></el-input-number>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="ruleForm['description']"></el-input>
      </el-form-item>

      <el-form-item class="fromBtn">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "UniUiModal",
  props: {
    tagsdata: Array,
    ruleForm: Object,
    title: String,
    dialogVisible: Boolean,
  },
  data() {
    return {
      rules: {},
    };
  },
  created() {},
  mounted() {},

  methods: {
    closeModal() {
      this.$emit("closeModal", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("playtype", this.ruleForm);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input-number--small .el-input-number__increase,
.el-input-number--small .el-input-number__decrease {
  width: 40px;
  height: 38px;
  line-height: 40px;
}
/deep/.el-input-number--small .el-input-number__increase,
.el-input-number--small .el-input-number__decrease {
  width: 40px;
  height: 38px;
  line-height: 40px;
}
/deep/.el-form-item {
  margin-bottom: 20px !important;
}
</style>