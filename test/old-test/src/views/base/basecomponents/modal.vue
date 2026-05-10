<template>
  <el-dialog
    :title="labelobj['label']"
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
      <el-form-item :label="labelobj['label']" :prop="labelobj['prop']">
        <el-input
          style="width: 50%"
          v-model="ruleForm[labelobj['prop']]"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort" v-if="showsort">
        <el-input-number
          v-model="ruleForm['sort']"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="单位" prop="remark" v-if="showremark">
        <el-input style="width: 50%" v-model="ruleForm['remark']"></el-input>
      </el-form-item>
      <el-form-item label="合同指标" v-if="showquotas">
        <el-select
          multiple
          :style="`width:100%`"
          v-model="ruleForm['quotastags']"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in contract_quota"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
    dialogVisible: Boolean,
    showsort: Boolean,
    showremark: Boolean,
    showquotas: Boolean,
    labelobj: Object,
    ruleForm: Object,
    contract_quota: Array,
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
          let obj = {};
          if (this.showquotas) {
            let arr = [];
            this.ruleForm["quotastags"].map((item) => {
              let value = {};
              value["value"] = item;
              arr.push(value);
            });
            obj = {
              name: this.ruleForm["name"],
              quotas: arr,
            };
          } else {
            obj = {
              label: this.ruleForm["label"],
              type: this.labelobj["type"],
            };
            if (this.ruleForm["sort"]) {
              obj["sort"] = this.ruleForm["sort"];
            }
            if (this.ruleForm["remark"]) {
              obj["remark"] = this.ruleForm["remark"];
            }
          }
          this.$emit("playtype", obj);
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