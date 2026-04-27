<template>
  <div>
    <div :class="['content_top', 'df_sb']">
      <div class="content_type">
        <div
          @click="filterStatus(item, index)"
          v-for="(item, index) in Status"
          :key="index"
          :class="{ currentStatus: index == currentStatus }"
        >
          {{ `${item.name}` }}
        </div>
      </div>
      <el-input
        prefix-icon="el-icon-search"
        placeholder="请输入内容"
        v-model="input"
        clearable
        size="medium"
        style="width: 370px; padding: 0 0 10px"
        @keyup.enter.native="searchInput"
      >
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "UniUiSuccessful",
  props: {
    Status: Array,
  },
  data() {
    return {
      currentStatus: 0,
      input: "",
      status: {
        全部: 0,
        待跟进: 1,
        认领中: 4,
        跟进中: 7,
        已转商机: 10,
        已关闭: 15,
      },
    };
  },
  created() {
    let statusName = this.$route.query.statusName;
    this.Status.map((item, index) => {
      if (statusName === item.name) {
        this.currentStatus = index;
      }
    });
  },
  mounted() {},

  methods: {
    filterStatus(item, index) {
      this.currentStatus = index;
      this.$emit("filterStatus", "status", item.status);
    },
    // 监听输入框回车事件
    searchInput() {
      this.$emit("filterStatus", "name", this.input);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input__icon {
  height: 85%;
}
</style>