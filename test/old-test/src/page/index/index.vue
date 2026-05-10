<template>
  <div :class="{ 'avue--collapse': isCollapse }" class="avue-contail">
    <div>
      <!-- 爱莎圈顶部导航栏 -->
      <div class="avue-header community-header" v-if="TENANT_ID == 5">
        <CommunityTop ref="CommunityTop" />
      </div>
      <!-- ems顶部导航栏 -->
      <div class="avue-header community-header" v-else-if="TENANT_ID == 6">
        <EmsTop ref="EmsTop" />
      </div>
      <!-- thepool顶部导航栏 -->
      <div class="avue-header thepool-header" v-else-if="TENANT_ID == 2">
        <ThepoolTop ref="ThepoolTop" />
      </div>

      <!-- 其他租户顶部导航栏 -->
      <div class="avue-header" v-else>
        <top />
      </div>
    </div>

    <div class="avue-layout">
      <div
        :class="[
          'avue-left',
          {
            'thepool-left': TENANT_ID == 2,
            'community-left': TENANT_ID == 5 || TENANT_ID == 6,
          },
        ]"
      >
        <!-- 左侧导航栏 -->
        <sidebar />
      </div>
      <div
        :class="[
          'avue-main',
          {
            'thepool-main': TENANT_ID == 2,
            'community-main': TENANT_ID == 5 || TENANT_ID == 6,
          },
        ]"
      >
        <!-- 顶部标签卡 -->
        <tags v-show="!onShowTags.includes(TENANT_ID)" />
        <!-- 主体视图层 -->
        <el-scrollbar style="overflow-y: auto; overflow-x: hidden" id="avue-view">
          <!-- 路由配置 keepAlive属性缓存-->
          <keep-alive exclude="MailGoupSendRecord">
            <router-view
              class="avue-view"
              :key="$route.fullPath"
              v-if="$route.meta.keepAlive"
            />
          </keep-alive>
          <router-view
            class="avue-view"
            :key="$route.fullPath"
            v-if="!$route.meta.keepAlive"
          />
          <!-- 底部 -->
          <!-- <footers /> -->
        </el-scrollbar>
      </div>
    </div>
    <div class="avue-shade" @click="showCollapse" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tags from "./tags";
import top from "./top/";
import sidebar from "./sidebar/";
import admin from "@/util/admin";
import { getStore, setStore } from "@/util/store.js";
// import * as SockJS from "sockjs-client";
import Stomp from "stomp-websocket";
import store from "@/store";
import footers from "./footer";
import color from "@/mixins/color";
//thepool顶部导航栏
import ThepoolTop from "./thepool/top/index";
//爱莎圈顶部导航栏
import CommunityTop from "./community/top/index";
//ems顶部导航栏
import EmsTop from "./ems/top/index";
export default {
  name: "Index",
  provide() {
    return {
      Index: this,
    };
  },
  components: {
    top,
    tags,
    sidebar,
    footers,
    ThepoolTop,
    CommunityTop,
    EmsTop,
  },
  mixins: [color()],
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$nextTick(() => {
        // console.log("vm.tenantId", vm.tenantId);
        // vm.setTheme(vm.tenantId);
      });
    });
  },
  data() {
    return {
      // 刷新token锁
      refreshLock: false,
      // 刷新token的时间
      refreshTime: "",
      // 计时器
      timer: "",
      TENANT_ID: "",
      onShowTags: [2, 5, 6],
    };
  },
  created() {
    // 实时检测刷新token
    // this.refreshToken();
    this.TENANT_ID = getStore({
      name: "tenantId",
    });
    this.setTheme(this.tenantId);
    this.getchMessageUnread();
  },

  destroyed() {
    clearInterval(this.refreshTime);
    clearInterval(this.timer);
    /*
     * 默认关闭websocket，如需工作流通知，则开启
     * this.disconnect()
     */
  },
  computed: {
    ...mapGetters(["tenantId"]),
  },
  mounted() {
    this.init();
    /*
     * 默认关闭websocket，如需工作流通知，则开启
     * this.initWebSocket()
     */
  },
  computed: mapGetters([
    "userInfo",
    "isLock",
    "isCollapse",
    "website",
    "expires_in",
    "tag",
  ]),
  watch: {
    tag() {
      this.getchMessageUnread();
    },
  },
  methods: {
    showCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    openMenu(data) {
      if (data.length !== 0) {
        this.$router.$avueRouter.formatRoutes(data, true);
      }
    },
    // 屏幕检测
    init() {
      this.$store.commit("SET_SCREEN", admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen());
        }, 0);
      };
    },
    // 实时检测刷新token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: "access_token",
          debug: true,
        });
        if (this.validatenull(token)) {
          return;
        }
        if (this.expires_in <= 1000 && !this.refreshLock) {
          this.refreshLock = true;
          this.$store.dispatch("RefreshToken").catch(() => {
            clearInterval(this.refreshTime);
          });
          this.refreshLock = false;
        }
        this.$store.commit("SET_EXPIRES_IN", this.expires_in - 10);
      }, 10000);
    },
    initWebSocket() {
      this.connection();
      const self = this;
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          self.stompClient.send("test");
        } catch (err) {
          console.log("断线了: " + err);
          self.connection();
        }
      }, 5000);
    },
    connection() {
      const token = store.getters.access_token;
      const TENANT_ID = getStore({ name: "tenantId" })
        ? getStore({ name: "tenantId" })
        : "1";
      const headers = {
        "TENANT-ID": TENANT_ID,
        Authorization: "Bearer " + token,
      };
      // 建立连接对象
      this.socket = new SockJS("/act/ws"); // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.debug = null;
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        () => {
          // 订阅通道  /task/租户ID/用户名称/remind
          let target = `/task/${TENANT_ID}/${this.userInfo.username}/remind`;
          this.stompClient.subscribe(target, (msg) => {
            // 订阅服务端提供的某个topic;
            this.$notify({
              title: "协同提醒",
              type: "warning",
              dangerouslyUseHTMLString: true,
              message: msg.body + "任务，请及时处理",
              offset: 60,
            });
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    getchMessageUnread() {
      // 获取租户2的未读消息数量
      if (this.TENANT_ID == 2) {
        this.$store.dispatch("FetchMessageUnread");
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
