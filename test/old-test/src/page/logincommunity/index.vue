<template>
  <div class="login-container logingroup">
    <div class="login-weaper animated bounceInDown df_sb">
      <div class="login-black df_center">
        <img style="width: 300px" src="/img/isacommunity/logo.png" alt="" />
      </div>
      <div class="login-from">
        <!-- <p class="login-tip">{{ "爱莎国际教育集团" }}</p> -->
        <div class="login-border">
          <div class="login-main">
            <h4 class="login-title" style="display: none">
              <el-select
                v-model="active"
                class="login-select animated fadeIn"
                placeholder="点击请选择租户"
                @change="handleCommand"
              >
                <el-option
                  v-for="tenant in tenantList"
                  :key="tenant.id"
                  :label="tenant.name"
                  :value="tenant.id"
                ></el-option>
              </el-select>
            </h4>
            <userLogin v-if="activeName === 'user'" />
            <codeLogin v-else-if="activeName === 'code'" />
            <thirdLogin v-else-if="activeName === 'third'" />
            <div class="login-menu">
              <a href="#" @click.stop="activeName = 'user'">账号密码</a>
              <a href="#" @click.stop="activeName = 'code'">手机号登录</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="login-copyright"></div>
  </div>
</template>
<script>
import { fetchList } from "@/api/admin/tenant";
import userLogin from "./userlogin";
import codeLogin from "./codelogin";
import thirdLogin from "./thirdlogin";
import { mapGetters } from "vuex";
import { getStore, setStore } from "@/util/store";
import color from "@/mixins/color";
export default {
  name: "Login",
  components: {
    userLogin,
    codeLogin,
    thirdLogin,
  },
  mixins: [color()],
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$nextTick(() => {
        document.title = "爱莎学校运营管理系统";
        vm.setTheme(5);
      });
    });
  },
  data() {
    return {
      tenantList: [],
      active: "",
      activeName: "user",
      socialForm: {},
    };
  },
  watch: {
    $route: {
      handler() {
        const params = this.$route.query;
        if (this.validatenull(params.state) && this.validatenull(params.code)) return;

        this.socialForm.state = params.state;
        this.socialForm.code = params.code;

        const loading = this.$loading({
          lock: true,
          text: `登录中,请稍后。。。`,
          spinner: "el-icon-loading",
        });
        this.$store
          .dispatch("LoginBySocial", this.socialForm)
          .then(() => {
            loading.close();
            this.$router.push({ path: this.tagWel.value });
          })
          .catch(() => {
            loading.close();
          });
      },
      immediate: true,
    },
  },
  created() {
    // this.themeVal = "#2A3F54";
    this.watermark();
    // this.getTenantList()
    // this.active = getStore({ name: 'tenantId' })
    // setStore({ name: "tenantId", content: 3 });
  },
  mounted() {},
  computed: {
    ...mapGetters(["website", "tagWel"]),
  },
  methods: {
    handleCommand(command) {
      setStore({ name: "tenantId", content: command });
    },
    getTenantList() {
      fetchList().then((response) => {
        this.tenantList = response.data.data;
      });
    },
    watermark() {
      const text = "";
      const canvas = document.createElement("canvas");
      canvas.width = "500";
      canvas.height = "200";
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 200, 200); // 绘制之前画布清除
      ctx.font = "30px 黑体";
      ctx.rotate((-20 * Math.PI) / 180); // 为了实现水印倾斜效果,旋转画布坐标系
      ctx.fillStyle = "rgba(100,100,100,0.15)"; // 画笔颜色
      ctx.fillText(text, -20, 200); // 书写的内容及位置
      ctx.rotate("20*Math.PI/180"); // 坐标系还原,如果后续没有其他操作,这一步可以省略
      // 将canvas的内容转换为base64编码
      const data = canvas.toDataURL("image/png", 1); // 1表示质量(无损压缩)

      window.onload = () => {
        const background = "url(" + data + ") repeat";
        var watermark = document.createElement("div");
        watermark.style.width = "100%";
        watermark.style.height = "100%";
        watermark.style.position = "fixed";
        watermark.style.left = "0";
        watermark.style.top = "0";
        watermark.style.pointerEvents = "none";
        watermark.style.background = background;
        watermark.style.zIndex = "9999";
        // document.body.append(watermark)
      };
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/login.scss";
.logingroup {
  background: url("/img/bg/isa.png") no-repeat !important;
  animation: none;
  background-size: cover !important;
  .login-weaper {
    width: auto;
    padding: 0;
  }
  .login-black {
    width: 380px;
  }
  .login-from {
    width: 300px;
    padding: 30px 40px 0;
    box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.5);
  }
}
</style>
