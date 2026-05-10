<template>
  <div class="successbox df_dc">
    <div class="success df_center"><i class="el-icon-check"></i></div>
    <div>已完成</div>
    <div class="back">
      <div class="backtext">{{ num + "秒后返回" }}</div>
      <el-button type="primary" @click="backlist">{{ backtext }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "UniUiSuccessful",
  data() {
    return {
      backtext: "",
      timeer: null,
      num: 5,
    };
  },
  created() {
    this.settext();
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["tagList", "tag"]),
  },
  methods: {
    settime() {
      this.timeer = setInterval(() => {
        if (this.num > 0 && this.num <= 5) {
          this.num--;
        } else {
          this.backlist();
        }
      }, 1000);
    },
    settext() {
      let path = this.$route.name;
      switch (path) {
        case "新增客户":
          this.backtext = "返回客户列表";
          break;
        case "新增联系人":
          this.backtext = "返回联系人列表";
          break;
        case "新增线索":
          if (this.$route.query.type == "my") {
            this.backtext = "返回我的线索";
          } else {
            this.backtext = "返回线索公海";
          }

          break;
        case "新增线索":
          this.backtext = "返回我的商机";
          break;
        case "导入联系人":
          this.backtext = "返回联系人列表";
          break;
        case "新增商机":
          this.backtext = "返回我的商机";
          break;
      }
    },
    backlist() {
      clearInterval(this.timeer);
      this.timeer = null;
      let path = this.$route.name;
      this.cancel();
      switch (path) {
        case "新增客户":
          this.$router.push("/contact/client/index");
          break;
        case "新增联系人":
          this.$router.push("/contact/contacter/index");
          break;
        case "导入联系人":
          this.$router.push("/contact/contacter/index");
          break;
        case "新增线索":
          if (this.$route.query.type == "my") {
            this.$router.push("/clue/my/index");
          } else {
            this.$router.push("/clue/pool/index");
          }
          break;
        case "新增商机":
          this.$router.push("/opportunity/archives/index");
          break;
      }
    },
    cancel() {
      let currentroute = this.$route.fullPath;
      this.tagList.map((item, index) => {
        if (currentroute == item.value) {
          this.$store.commit("DEL_TAG", item);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.successbox {
  font-size: 48px;
  color: #409eff;
  font-weight: 600;
  .success {
    width: 119px;
    height: 119px;
    border: 3px solid #409eff;
    border-radius: 50%;

    margin-bottom: 20px;
  }
  .back {
    margin-top: 30px;
    .backtext {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      text-align: center;
    }
  }
}
</style>