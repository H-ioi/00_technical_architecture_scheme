<template>
  <el-dialog
    title="区域设置"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="closeModal"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          type="textarea"
          :rows="5"
          v-model="ruleForm.description"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="type !== 'detail'">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确认</el-button
        >
        <el-button @click="closeModal">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "UniUiModal",
  props: {
    dialogVisible: Boolean,
    type: String,
  },
  data() {
    return {
      ruleForm: {},
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序值", trigger: "blur" }],
      },
    };
  },

  mounted() {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid", valid);
          this.$emit("submitFormOk", this.ruleForm);
        }
      });
    },
    closeModal() {
      this.ruleForm = {};
      this.$emit("closeModal", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>