<template>
  <div class="avue-logo df_center">
    <transition name="fade">
      <span key="0" class="avue-logo_subtitle" @click="goIndex">
        <div v-if="TENANT_ID == 1">
          <img src="/img/other/logo.png" alt="" />
          <div class="subtitle_C">{{ website.title }}</div>
        </div>
        <div v-else-if="TENANT_ID == 2">
          <img class="logoImg" src="/img/other/thepool.png" alt="" />
        </div>
        <div v-else-if="TENANT_ID == 3">
          <img class="logoImg" src="/img/isa/logo.png" alt="" />
        </div>
        <div v-else-if="TENANT_ID == 4">
          <img class="logoImg" src="/img/other/logocentre.png" alt="" />
        </div>
        <div v-else-if="TENANT_ID == 5">
          <img class="logoImg" src="/img/isacommunity/logo-top.png" alt="" />
          <!-- <div class="subtitle_C">{{ website["systemLogo"][TENANT_ID] }}</div> -->
        </div>
      </span>
    </transition>
    <!-- <transition-group name="fade">
      <span key="1" class="avue-logo_title" @click="goIndex">
        {{ website.title }}
      </span>
    </transition-group> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getStore } from "@/util/store";
export default {
  name: "Logo",
  data() {
    return {
      TENANT_ID: "",
    };
  },
  computed: {
    ...mapGetters(["website", "keyCollapse"]),
  },
  created() {
    this.TENANT_ID = getStore({
      name: "tenantId",
    });
  },
  methods: {
    goIndex: function () {
      return;
      window.location.href = "/";
    },
  },
};
</script>

<style lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 110px;
  background-color: #ffff;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  // box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;
  border-bottom: 1px solid #eef5f6;
  &_title {
    display: block;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    color: #175e67;
  }
  &_subtitle {
    display: block;
    text-align: center;
    font-weight: bold;
    color: #fff;
    .subtitle_E {
      font-size: 36px;
      font-family: TerminatorTwo-, TerminatorTwo;
      font-weight: normal;
      color: #175e67;
      line-height: 43px;
      -webkit-background-clip: text;
    }
    .subtitle_C {
      font-size: 16px;
      font-family: AlibabaPuHuiTi-Regular-, AlibabaPuHuiTi-Regular;
      font-weight: normal;
      color: #175e67;
      line-height: 19px;
      -webkit-background-clip: text;
    }
  }
}
.logoImg {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
