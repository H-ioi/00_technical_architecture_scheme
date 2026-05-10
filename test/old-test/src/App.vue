<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {},
};
</script>
<style lang="scss">
html,
body {
  font-family: Source Han Sans CN-Normal, Source Han Sans CN;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Source Han Sans CN-Normal, Source Han Sans CN;
  font-size: 14px;
}
.el-table__fixed-body-wrapper .el-table__body {
  padding-bottom: 6px; // 6px为横向滚动条高度
}
</style>
