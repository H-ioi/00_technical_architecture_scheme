<template>
  <div class="language">
    <div
      :class="[
        'language_item',
        {
          active: $i18n.locale == 'zh',
        },
      ]"
      @click="changeLanguage"
    >
      中文
    </div>
    <img @click="changeLanguage" src="/thepool/other/qiehuan.png" />
    <div
      :class="[
        'language_item',
        {
          active: $i18n.locale == 'en',
        },
      ]"
      @click="changeLanguage"
    >
      EN
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "CurrentLanguage",

  data() {
    return {};
  },
  computed: {
    // getCurrentLanguage() {
    //   return this.$i18n.locale == "en" ? "CN" : "EN";
    // },
  },
  mounted() {},

  methods: {
    ...mapMutations(["SET_I18NLOCALE"]),
    changeLanguage() {
      let locale = this.$i18n.locale;
      this.$i18n.locale = locale == "en" ? "zh" : "en";
      this.SET_I18NLOCALE(locale == "en" ? "zh" : "en");
    },
  },
};
</script>

<style lang="scss" scoped>
.language {
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  .language_item {
    font-family: AppleSystemUIFont;
    font-weight: 400;
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;
  }
  img {
    width: 13px;
    padding: 0 10px;
    cursor: pointer;
  }
  .active {
    font-weight: 500;
    color: #d4ab85;
  }
}
</style>
