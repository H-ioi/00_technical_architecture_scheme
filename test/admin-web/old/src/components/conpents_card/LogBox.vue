<template>
  <div class="cardcontentbox">
    <div class="title_text">操作记录</div>
    <div>
      <div class="logword" v-if="logList.length == 0">暂无</div>
      <div v-else class="logword" v-for="(item, index) in logList" :key="index">
        {{
          index +
          1 +
          "." +
          ($route.path == "/card/institutions/professional/index"
            ? ""
            : item.createUser) +
          item.title
        }}
      </div>
    </div>
  </div>
</template>

<script>
import { getLogPage } from "@/api/log/index";
export default {
  name: "UniUiLogbox",

  data() {
    return {
      logobj: {
        current: 1,
        size: 100,
        moduleType: 8,
        outerId: "",
      },
      logList: [],
    };
  },
  mounted() {},

  methods: {
    getLogPage() {
      getLogPage(this.logobj).then((res) => {
        console.log("logres", res);
        this.logList = res.data.data.records;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logword {
  font-size: 16px;
  font-family: Source Han Sans CN-Normal, Source Han Sans CN;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}
</style>