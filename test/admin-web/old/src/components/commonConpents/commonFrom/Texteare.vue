<template>
  <el-form-item :label="Texteare['label']" :prop="Texteare['prop']">
    <el-input
      :disabled="!isedit"
      type="textarea"
      rows="3"
      :placeholder="Texteare['placeholder']"
      v-model="ruleForm[Texteare['prop']]"
      maxlength="120"
      show-word-limit
      style="width: 60%"
    ></el-input>
    <!-- <span v-else>{{ ruleForm[Texteare["prop"]] }}</span> -->
  </el-form-item>
</template>

<script>
export default {
  name: "UniUiTexteare",
  props: {
    Texteare: Object,
    ruleForm: Object,
    isedit: Boolean,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
/deep/.el-textarea.is-disabled .el-textarea__inner {
  background-color: #f8f8f8;
}
</style>