<template>
  <div>
    <!-- 联系人输入框 -->
    <commonInput
      :InputData="InputData"
      :inputwidth="inputwidth"
      :ruleForm="ruleForm"
      :isedit="isedit"
    />
  </div>
</template>

<script>
import commonInput from "@/components/commonConpents/commonFrom/AnyInput";
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
  created() {},
  mounted() {},

  methods: {},
  components: {
    commonInput,
  },
};
</script>

<style lang="scss" scoped>
</style>