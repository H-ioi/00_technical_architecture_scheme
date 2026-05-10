<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    :label-position="'top'"
    ref="ruleForm"
    class="demo-ruleForm"
  >
    <div class="df_aw">
      <el-form-item
        label="公司"
        prop="company"
        :style="`width:33.33%; padding-right: 25px`"
      >
        <el-input
          v-model="ruleForm.company"
          placeholder="请输入公司名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="职位"
        prop="position"
        :style="`width:33.33%; padding-right: 25px`"
      >
        <el-input
          v-model="ruleForm.position"
          placeholder="请输入职位"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="部门"
        prop="department"
        :style="`width:33.33%; padding-right: 25px`"
      >
        <el-input
          v-model="ruleForm.department"
          placeholder="请输入部门"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="入职时间"
        prop="beginTime"
        :style="`width:33.33%; padding-right: 25px`"
      >
        <el-date-picker
          style="width: 100%"
          v-model="ruleForm.beginTime"
          type="date"
          :value-format="'yyyy-MM-dd'"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="是否在职"
        prop="hasFinished"
        :style="`width:33.33%; padding-right: 25px`"
      >
        <el-select
          style="width: 100%; padding-right: 10px"
          v-model="ruleForm.hasFinished"
          placeholder="请选择"
          clearable
        >
          <el-option label="是" :value="true"> </el-option>
          <el-option label="否" :value="false"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="!ruleForm.hasFinished"
        label="离职时间"
        prop="endTime"
        :style="`width:33.33%; padding-right: 25px`"
      >
        <el-date-picker
          style="width: 100%"
          v-model="ruleForm.endTime"
          type="date"
          :value-format="'yyyy-MM-dd'"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="经历描述" :style="`width:80%; padding-right: 25px`">
        <el-input
          v-model="ruleForm.description"
          placeholder="请输入部门"
          type="textarea"
          :rows="4"
        ></el-input>
      </el-form-item>
    </div>
    <el-form-item class="fromBtn">
      <el-button @click="closeModal">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
    </el-form-item></el-form
  >
</template>

<script>
export default {
  name: "UniUiInfoWork",
  props: {
    ruleForm: Object,
    innertype: String,
  },
  data() {
    return {
      rules: {
        company: [{ required: true, message: "请填写", trigger: "blur" }],
        position: [{ required: false, message: "请填写", trigger: "blur" }],
        department: [{ required: true, message: "请选择", trigger: "blur" }],
        beginTime: [{ required: true, message: "请选择", trigger: "blur" }],
        hasFinished: [{ required: true, message: "请选择", trigger: "blur" }],
        endTime: [{ required: true, message: "请选择", trigger: "blur" }],
      },
    };
  },

  mounted() {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("ruleForm", this.ruleForm);
          this.$emit("setOtherData", this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeModal() {
      this.$emit("changeinnerform", false, this.innertype);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>