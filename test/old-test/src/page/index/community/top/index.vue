<template>
  <div class="avue-top">
    <div class="top-bar__right">
      <Language />
      <el-dropdown>
        <span class="el-dropdown-link" style="cursor: pointer">
          <div class="userInfo">
            <span class="userInfo_head">{{ firstChar }}</span>
            <span class="userInfo_name"> {{ userInfo.username }}</span>
            <i class="el-icon-arrow-down el-icon--right" />
          </div>
        </span>
        <el-dropdown-menu slot="dropdown" class="userdropdown_menu">
          <el-dropdown-item>
            <router-link to="/info/index">修改密码</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出系统 </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Language from "@/components/communitycommon/Language";
export default {
  name: "Top",
  components: {
    Language,
  },
  filters: {},
  data() {
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      firstChar: "",
    };
  },
  computed: {
    ...mapGetters(["tenantId", "userInfo"]),
  },
  created() {
    // 初始化首字符
    if (this.userInfo && this.userInfo.username) {
      this.firstChar = this.userInfo.username.charAt(0).toUpperCase();
    }
  },
  mounted() {},
  methods: {
    logout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.commit("CLEAR_DICTIONARY");
        this.$store.dispatch("LogOut");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.avue-top,
.top-bar__right {
  height: 80px !important;
}
.userInfo {
  display: flex;
  align-items: center;
  .userInfo_head {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white; // 设置字体颜色为白色
    background: #2a3f54;
    text-align: center; // 文字居中
    line-height: 40px; // 垂直居中
    font-size: 20px;
  }
  .userInfo_name {
    display: inline-block;
    font-family: AppleSystemUIFont;
    font-size: 16px;
    color: #333333;
    padding-left: 10px;
  }
}
</style>
