<template>
  <div class="status_tabs">
    <div class="tabs_list df_start_center">
      <div
        :class="['tab_Item', { current_tab: currentstatus == i.type }]"
        v-for="(i, k) in statusList"
        :key="k"
        @click="changeStasus(i, k)"
      >
        {{ $t("consult")[i.name] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatusItem",
  props: {
    statusList: Array,
    currentstatus: String,
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {
    changeStasus(i, k) {
      this.$emit("changeStasus", i, k);
    },
  },
};
</script>

<style lang="scss" scoped></style>
