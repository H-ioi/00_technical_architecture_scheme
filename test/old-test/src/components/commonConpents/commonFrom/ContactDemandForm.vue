<template>
  <div>
    <!-- 客户需求输入框 -->
    <commonInput
      :InputData="InputData"
      :inputwidth="inputwidth"
      :ruleForm="ruleForm"
    />
  </div>
</template>

<script>
import commonInput from "@/components/commonConpents/commonFrom/AnyInput";
import commonTextEare from "@/components/commonConpents/commonFrom/Texteare";
export default {
  name: "UniUiClueform",
  props: {
    InputData: Array,
    inputwidth: String,
    ruleForm: Object,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},

  methods: {},
  components: {
    commonInput,
    commonTextEare,
  },
};
</script>

<style lang="scss" scoped>
</style>