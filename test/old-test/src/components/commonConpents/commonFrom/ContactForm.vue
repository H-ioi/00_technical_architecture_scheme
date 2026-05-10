<template>
  <div>
    <!-- 客户信息输入框 -->
    <commonInput
      :InputData="InputData"
      :inputwidth="inputwidth"
      :ruleForm="ruleForm"
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

  methods: {},
  components: {
    commonInput,
  },
};
</script>

<style lang="scss" scoped>
</style>