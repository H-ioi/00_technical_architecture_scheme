<template>
  <div class="avue-logo df_center">
    <transition name="fade">
      <span key="0" class="avue-logo_subtitle" @click="goIndex">
        <div>
          <img class="logoImg" src="/img/ems/logo-top.png" alt="" />
        </div>
      </span>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getStore } from "@/util/store";
export default {
  name: "Logo",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["website", "keyCollapse", "tenantId"]),
  },
  created() {},
  methods: {
    goIndex: function () {
      return;
      window.location.href = "/";
    },
  },
};
</script>

<style lang="scss" scoped>
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
  width: 204px;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: #ffff;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;
  border: none !important;
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
