<template>
  <div class="df_aw">
    <el-form-item
      label="公司"
      prop="company"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <el-input
        v-model="ruleForm.company"
        placeholder="请输入公司名称"
        :disabled="isDisabled"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="职位"
      prop="position"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <el-input
        v-model="ruleForm.position"
        placeholder="请输入职位"
        :disabled="isDisabled"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="部门"
      prop="department"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <el-input
        v-model="ruleForm.department"
        placeholder="请输入部门"
        :disabled="isDisabled"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="行业"
      prop="industryId"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <DeepTree
        ref="Tndustry"
        style="margin-right: 20px"
        size="small"
        :labelModel="labelModel"
        @settreedata="settreedata"
        :isDisabled="isDisabled"
      ></DeepTree>
    </el-form-item>
    <el-form-item
      label="公司地址"
      prop="location"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <el-input
        v-model="ruleForm.location"
        placeholder="请输入公司地址"
        :disabled="isDisabled"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="公司网址"
      prop="website"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <el-input
        v-model="ruleForm.website"
        placeholder="请输入公司网址"
        :disabled="isDisabled"
      ></el-input>
    </el-form-item>
  </div>
</template>

<script>
import DeepTree from "@/components/conpents_card/DeepTree";
export default {
  name: "UniUiInfoCompany",
  props: {
    ruleForm: Object,
    inputwidth: String,
    isDisabled: Boolean,
  },
  data() {
    return {
      labelModel: "",
    };
  },

  mounted() {},

  methods: {
    settreedata(name, id) {
      console.log(9999, name, id);
      this.labelModel = String(name);
      this.$emit("setIndustry", name, id);
    },
    setdept(data, name) {
      this.ruleForm = {
        ...this.ruleForm,
        deptId: String(data),
      };
    },
  },
  components: {
    DeepTree,
  },
};
</script>

<style lang="scss" scoped>
</style>