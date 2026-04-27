<!-- 树状选择器 -->
<template>
  <el-cascader
    class="selectchannlemultiple"
    style="width: 100%; height: 32px"
    :placeholder="$t('consult.请选择')"
    ref="cascader"
    v-model="cascaderValue"
    :options="options"
    :props="props"
    clearable
    @change="changeCascader"
  ></el-cascader>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Pagination",
  props: {
    options: {
      default: [],
      type: Array,
    },
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  watch: {
    i18nlocel: function (newText, oldText) {
      console.log("1111111i18nlocel", newText, oldText);
      this.props["label"] = newText == "zh" ? "label" : "enLabel";
    },
  },
  data() {
    return {
      cascaderValue: [],
      props: {
        children: "child",
        label: "label",
        value: "value",
        checkStrictly: true,
        multiple: true,
      },
      // options: []
    };
  },
  created() {
    this.props["label"] = this.i18nlocel == "zh" ? "label" : "enLabel";
  },
  methods: {
    changeCascader(e) {
      console.log("changeCascader", e);
      this.$emit("setChannel", e);
    },
    clear() {
      this.cascaderValue = [];
    },
  },
};
</script>

<style></style>
