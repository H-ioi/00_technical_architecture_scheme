<template>
  <div>
    <el-button  size="medium" class="changeLanguage" type="text" @click="changeLanguage">{{
      getCurrentLanguage
    }}</el-button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "TestUniLanguage",

  data() {
    return {};
  },
  computed: {
    getCurrentLanguage() {
      return this.$i18n.locale == "en" ? "CN" : "EN";
    },
  },
  mounted() {},

  methods: {
    ...mapMutations(["SET_I18NLOCALE"]),
    changeLanguage() {
      let locale = this.$i18n.locale;
      console.log("locale", locale);
      this.$i18n.locale = locale == "en" ? "zh" : "en";
      this.SET_I18NLOCALE(locale == "en" ? "zh" : "en");
    },
  },
};
</script>

<style lang="scss" scoped>
.changeLanguage{
  font-size: 16px;
  font-weight: 600;
}
</style>