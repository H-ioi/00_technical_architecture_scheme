<template>
  <div class="avue-top">
    <div class="top-bar__right">
      <!-- 全局搜索查询 -->
      <!-- 用户校区权限 -->

      <!-- <el-dropdown class="top-bar_school">
        <span class="el-dropdown-text">
          {{
            currentSchool
              ? currentSchool[i18nlocel == "en" ? "enLabel" : "label"]
              : $t("consult.请选择")
          }}<i style="color: #999999" class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="userdropdown_menu">
          <el-dropdown-item
            @click.native="selectSchool(item)"
            v-for="item in pooldictpermissions"
            :key="item.value"
          >
            {{ i18nlocel == "en" ? item.enLabel : item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <div class="news" @click="$router.push('/notification/list')">
        <span class="news_num" v-if="messageNum['unreadall'] > 0">{{
          messageNum["unreadall"]
        }}</span>
        <i class="el-icon-bell"></i>
        <!-- <img src="/img/other/news_default.png" alt="" /> -->
      </div>
      <!-- 用户信息及修改密码 -->
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
            <router-link to="/info/index">{{ $t("consult.修改密码") }}</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout"
            >{{ $t("consult.退出系统") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { clearStore } from "@/util/store";
export default {
  name: "Top",
  components: {},
  filters: {},
  data() {
    return { firstChar: "", currentSchool: null };
  },
  computed: {
    ...mapGetters([
      "tenantId",
      "userInfo",
      "pooldictpermissions",
      "i18nlocel",
      "messageNum",
    ]),
  },
  created() {
    // 初始化首字符
    if (this.userInfo && this.userInfo.username) {
      this.firstChar = this.userInfo.username.charAt(0).toUpperCase();
    }
  },
  mounted() {},
  methods: {
    selectSchool(item) {
      this.currentSchool = item;
    },
    logout() {
      this.$confirm(this.$t("consult.是否退出系统, 是否继续?"), this.$t("consult.提示"), {
        confirmButtonText: this.$t("consult.确认"),
        cancelButtonText: this.$t("consult.取消"),
        type: "warning",
      }).then(() => {
        // this.$store.commit("CLEAR_DICTIONARY");
        clearStore({ type: "session" });
        this.$store.dispatch("LogOut");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.avue-top {
  padding-right: 0 !important;
}
.avue-top,
.top-bar__right {
  height: 80px !important;
}
.top-bar_school {
  margin-right: 20px;
  cursor: pointer;
  .el-dropdown-text {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 16px;
    color: #333333;
  }
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
.news {
  position: relative;
  cursor: pointer;
  margin-right: 20px;
  .news_num {
    display: inline-block;
    position: absolute;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    color: #ffffff;
    background-color: red;
    border-radius: 50%;
    top: 0;
    right: 0;
    font-size: 12px;
    font-weight: 400;
    transform: translate(50%, -50%) scale(0.8);
  }

  i {
    font-size: 24px;
    color: #2a3f54;
    line-height: 24px !important;
  }
}
</style>
