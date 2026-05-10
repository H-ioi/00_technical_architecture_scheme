<template>
  <el-autocomplete
    style="width: 100%;"
    class="inline-input"
    v-model="assetStr"
    clearable
    :fetch-suggestions="querySearch"
    placeholder="请输入关键词"
    :trigger-on-focus="false"
    @clear="clearAsset"
    @select="selectAsset"
    @keyup.enter.native="selectAsset"
    @input="changeStyle('block', '.el-autocomplete-suggestion')"
    @keyup="changeStyle('block', '.el-autocomplete-suggestion')"
  ></el-autocomplete>
</template>

<script>
import { getOrderAsset } from "@/api/workorder/order/index.js";
export default {
  name: "Pagination",
  props: {
    // 接收校区ID
    schoolId: {
      default: "",
      type: String,
      require: true
    }
  },
  data() {
    return {
      assetStr: "",
      assetId: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 选择资产
    async querySearch(queryString, cb) {
      this.setAsset = "";
      if (queryString) {
        getOrderAsset({
          school: this.schoolId,
          keywords: queryString
        }).then(res => {
          console.log("searchStudentList", res);
          if (res.data.success) {
            let list = res.data.data;
            list.map(item => {
              item["value"] = item["name"] + `(${item["code"]})`;
            });
            console.log("getOrderAsset", list);
            cb(list);
          } else {
            cb([]);
          }
        });
      } else {
        cb([]);
      }
    },
    selectAsset(item) {
      this.changeStyle("none", ".el-autocomplete-suggestion");
      this.assetId = item["id"];
      this.$emit("setAsset", this.assetId);
    },
    clearAsset() {
      this.assetId = "";
      this.$emit("setAsset", this.assetId);
    },
    //根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyle(status, className) {
      let dom = document.querySelectorAll(className);
      dom[0].style.display = status;
    }
  }
};
</script>

<style></style>
