<template>
  <div class="stepBox">
    <el-steps :active="0" align-center>
      <el-step
        v-for="(item, index) in setpData"
        :key="index"
        :title="item['desc']"
        :status="currentStep >= index ? 'finish' : 'wait'"
        :class="{ stepStyle: currentStep >= index + 1 }"
      ></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: "UniUiStepbox",
  props: {
    setpData: Array,
    currentStep: Number,
  },
  data() {
    return {};
  },
  created(){
    console.log(this.setpData);
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.stepBox {
  padding: 60px 0;
  box-sizing: border-box;
}
/deep/.el-step__icon.is-text {
  width: 67px;
  height: 67px;
}
/deep/.el-step.is-horizontal .el-step__line {
  top: 30px;
}
/deep/.el-step__icon-inner {
  font-weight: 300;
  font-size: 36px;
}
/deep/.el-step__head.is-process {
  .el-step__icon-inner {
    color: #c0c4cc;
  }
}
/deep/.el-step__title.is-process {
  font-weight: 600;
  color: #c0c4cc;
}
/deep/.el-step__icon {
  border: 8px solid #f5f8fa;
}
/deep/.el-step__head.is-finish {
  .el-step__icon {
    color: #fff;
    border-color: #409eff;
    background-color: #409eff;
  }
}
/deep/.el-step__line {
  height: 8px !important;
  background-color: #f5f8fa !important;
}
/deep/.el-step__line-inner {
  height: 8px;
  background-color: #409eff;
}
.stepStyle {
  /deep/ .el-step__line {
    background-color: #409eff !important;
  }
  /deep/.el-step__icon {
    color: #fff;
    background-color: #409eff !important;
  }
}
</style>