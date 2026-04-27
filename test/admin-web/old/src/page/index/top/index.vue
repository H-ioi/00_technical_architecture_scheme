<template>
  <div class="avue-top">
    <div class="top-bar__right">
      <div v-if="TENANT_ID == 2" class="df_sb">
        <div class="news" @click="$router.push('/notification/list')">
          <span class="news_num" v-if="messageNum['unreadall'] > 0">{{
            messageNum["unreadall"]
          }}</span>
          <img src="/img/other/news_default.png" alt="" />
        </div>
        <Language />
      </div>
      <div v-if="TENANT_ID == 3 || TENANT_ID == 5" class="df_sb">
        <Language />
      </div>
      <!-- <span class="block">
        <el-avatar :size="40" :src="circleUrl"></el-avatar>
      </span> -->
      <!-- <topColor /> -->
      <el-dropdown>
        <span class="el-dropdown-link" style="cursor: pointer">
          {{ userInfo.username }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown" class="userdropdown_menu">
          <el-dropdown-item>
            <router-link to="/info/index">修改密码</router-link>
          </el-dropdown-item>
          <!-- <el-dropdown-item divided @click.native="$refs.seting.open()"
            >界面设置
          </el-dropdown-item> -->
          <el-dropdown-item @click.native="logout">退出系统 </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-tooltip
        :content="isFullScreen ? '退出全屏' : '全屏'"
        effect="dark"
        placement="bottom"
      >
        <div class="top-bar__item" style="margin-right: 20px">
          <i
            style="color: #175E67"
            :class="isFullScreen ? 'icon-zuixiaohua' : 'icon-quanpingzuidahua'"
            @click="handleScreen"
          />
        </div>
      </el-tooltip> -->
      <el-tooltip
        content="退出系统"
        effect="dark"
        placement="bottom"
        style="margin-left: 20px"
      >
        <img src="/img/other/退出.png" alt="" width="16px" @click="logout" />
      </el-tooltip>
      <top-setting ref="seting" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { fullscreenToggel, handleImg, listenfullscreen } from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
import topColor from "./top-color";
import topSetting from "./top-setting";
import Language from "../../../components/common/Language";
import { getStore } from "@/util/store";
export default {
  name: "Top",
  components: {
    topLock,
    topMenu,
    topTheme,
    topLogs,
    topColor,
    topSetting,
    Language,
  },
  filters: {},
  data() {
    return {
      TENANT_ID: "",
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    };
  },
  computed: {
    ...mapState({
      showDebug: (state) => state.common.showDebug,
      showTheme: (state) => state.common.showTheme,
      showLock: (state) => state.common.showLock,
      showFullScreen: (state) => state.common.showFullScreen,
      showCollapse: (state) => state.common.showCollapse,
      showMenu: (state) => state.common.showMenu,
      showColor: (state) => state.common.showColor,
    }),
    ...mapGetters([
      "userInfo",
      "isFullScreen",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag",
      "messageNum",
    ]),
  },
  created() {
    // handleImg(this.userInfo.avatar, "thumbnail");
    this.TENANT_ID = getStore({
      name: "tenantId",
    });
  },
  mounted() {
    listenfullscreen(this.setScreen);
  },
  methods: {
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREEN");
    },
    logout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.newdropdown {
  color: #999999;
  margin-right: 35px;
}

.text {
  font-weight: 600;
  font-size: 18px;
  color: rgb(44, 136, 245);
  cursor: pointer;
}

.news {
  position: relative;
  cursor: pointer;

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

  img {
    width: 16px;
    height: 18px;
  }
}
</style>
