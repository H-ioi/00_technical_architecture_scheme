<template>
  <div>
    <!-- 合同输入框 -->
    <commonInput
      :ruleForm="ruleForm"
      :InputData="InputData"
      :inputwidth="inputwidth"
      :isedit="isedit"
    />
  </div>
</template>

<script>
import { getselectlist } from "@/const/from/fromdata";
import commonInput from "@/components/commonConpents/commonFrom/AnyInput";
import commonTextEare from "@/components/commonConpents/commonFrom/Texteare";
export default {
  name: "UniUiClueform",
  props: {
    InputData: Array,
    inputwidth: String,
    ruleForm: Object,
    isedit: Boolean,
  },
  data() {
    return {};
  },
  created() {
    getselectlist(this.InputData);
  },
  mounted() {},

  methods: {
    setRule() {
      this.$emit("setRules", this.rules, this.ruleForm);
    },
  },
  components: {
    commonInput,
  },
};
</script>

<style lang="scss" scoped>
</style>