<template>
  <el-dialog
    title="转商机"
    :before-close="closeModal"
    :visible.sync="showToOpportunity"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
    >
      <OpportunityForm
        :inputwidth="`50%`"
        :ruleForm="ruleForm"
        :isedit="true"
        :showdate="false"
        @setuser="setuser"
      />
      <el-form-item class="fromBtn">
        <el-button @click="closeModal">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :loading="isLoading"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import OpportunityForm from "@/components/commonConpents/commonFrom/OpportunityForm";
export default {
  name: "UniUiAddnewcontart",
  props: {
    showToOpportunity: Boolean,
  },
  data() {
    return {
      isLoading: false,
      ruleForm: {},
      rules: {
        name: [{ required: true, message: "请填写", trigger: "blur" }],
        followUser: [{ required: false, message: "请选择", trigger: "blur" }],
        followTeam: [{ required: false, message: "请选择", trigger: "blur" }],
        cooperationUser: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        cooperationTeam: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        amount: [{ required: true, message: "请选择", trigger: "blur" }],
        level: [{ required: true, message: "请选择", trigger: "blur" }],
        remark: [{ required: false, message: "请选择", trigger: "blur" }],
        expireTime: [{ required: true, message: "请选择", trigger: "blur" }],
      },
    };
  },
  created() {
    // this.ruleForm["followUser"] = [String(this.userInfo["id"])];
  },
  mounted() {},
  computed: mapGetters(["userInfo"]),
  methods: {
    closeModal() {
      this.$emit("closeModal", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            this.ruleForm["followUser"].length == 0 &&
            this.ruleForm["followTeam"].length == 0
          ) {
            this.$message.warning("请选择跟进人或者跟进团队");
            return;
          }
          let obj = {
            ...this.ruleForm,
            amount: this.ruleForm["amount"] * 100,
            // expireTime: dateFormat(this.ruleForm["expireTime"]),
          };
          this.isLoading = true;
          this.$emit("toopportunity", obj);
        } else {
          this.isLoading = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeshowAddNewContart() {
      this.$emit("changeshowAddNewContart");
    },
    setuser(data) {
      this.ruleForm = {
        ...this.ruleForm,
        followUser: data,
      };
      console.log(" this.ruleForm", this.ruleForm);
    },
  },
  components: {
    OpportunityForm,
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__footer {
  text-align: center;
}
/deep/.el-dialog__body {
  padding-top: 0;
}
/deep/.dialog-footer {
  .el-button {
    width: 160px;
    height: 40px;
  }
}
</style>