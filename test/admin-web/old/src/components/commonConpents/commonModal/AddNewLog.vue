<template>
  <el-dialog
    :title="islooklog ? '跟进记录详情' : '新增跟进记录'"
    :before-close="closeModal"
    :visible.sync="showlog"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
    >
      <NewLog
        ref="log"
        :isedit="true"
        :stage="stage"
        :contacters="contacters"
        :opportunitystageall="opportunitystageall"
        :ruleForm="ruleForm"
        :islooklog="islooklog"
      />
      <el-form-item class="fromBtn" v-if="!islooklog">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { dateFormat } from "@/util/date.js";
import NewLog from "@/components/commonConpents/commonFrom/NewLog";
export default {
  name: "UniUiAddnewcontart",
  props: {
    showlog: Boolean,
    contacters: Array,
    opportunitystageall: Array,
    ruleForm: Object,
    stage: Number,
    islooklog: Boolean,
  },
  data() {
    return {
      rules: {
        userId: [{ required: true, message: "请选择", trigger: "blur" }],
        time: [{ required: true, message: "请选择", trigger: "blur" }],
        followType: [{ required: true, message: "请选择", trigger: "blur" }],
        contacter: [{ required: false, message: "请选择", trigger: "blur" }],
        stage: [{ required: true, message: "请选择", trigger: "blur" }],
      },
    };
  },
  created() {},
  mounted() {},

  methods: {
    closeModal() {
      this.setfile([], []);
      this.$emit("closeModal", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("this.ruleForm99", this.ruleForm);
          this.ruleForm = {
            ...this.ruleForm,
            // time: dateFormat(this.ruleForm["time"]),
            file: this.$refs.log.filelist,
          };
          if (this.$route.path.indexOf("contacter") !== -1) {
            this.ruleForm["contacter"] = [this.$route.query.id];
          }
          this.$emit("addlog", this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setfile(fileobj, filelist) {
      this.$nextTick(() => {
        this.$refs["log"].filelistobj = fileobj;
        this.$refs["log"].filelist = filelist;
      });
    },
  },
  components: {
    NewLog,
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