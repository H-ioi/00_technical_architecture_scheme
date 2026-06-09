<template>
  <div class="search-type">
    <img
      @click="changeSearchType('checkbox')"
      :src="`/thepool/icon/icon_checkbox_${
        searchType == 'checkbox' ? 'on' : 'off'
      }.png`"
      alt=""
    />
    <img
      @click="changeSearchType('input')"
      :src="`/thepool/icon/icon_input_${
        searchType == 'checkbox' ? 'off' : 'on'
      }.png`"
      alt=""
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "SearchType",

  data() {
    return {};
  },
  computed: {
    ...mapGetters(["searchType"]),
  },
  mounted() {},

  methods: {
    changeSearchType(type) {
      this.$store.commit("SET_SEARCH_TYPE", type);
    },
  },
};
</script>

<style lang="scss" scoped></style>
