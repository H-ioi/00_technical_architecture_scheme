<template>
  <div>
    <span v-if="i18nlocel == 'en'" class="pagination"
      >There are<span class="pagination_total">&nbsp;{{ paginationTotal }}&nbsp;</span
      >{{ `messages,1 to ${paginationSize} messages are displayed` }}
    </span>
    <span v-else class="pagination"
      >共有信息
      <span class="pagination_total">&nbsp;{{ paginationTotal }}&nbsp;</span>条<span
      ></span>&nbsp;&nbsp;{{ `目前显示1-${paginationSize}条` }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    paginationTotal: {
      require: true,
      type: Number,
    },
    paginationSize: {
      default: 10,
      require: false,
      type: Number,
    },
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
