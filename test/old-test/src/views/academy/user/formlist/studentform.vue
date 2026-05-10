<template>
  <el-form
    class="df_align_center"
    :label-position="'top'"
    :inline="true"
    :model="searchFrom"
  >
    <el-form-item label="关键词" style="width: 20%">
      <el-input
        v-model="searchFrom['keyword']"
        placeholder="请输入学生学号/学生姓名/家长账号"
        clearable
        @clear="clear"
      ></el-input>
    </el-form-item>
    <!-- <el-form-item label="是否消费过" style="width: 20%">
      <el-select
        v-model="searchFrom['consumed']"
        clearable
        filterable
        placeholder="请选择"
      >
        <el-option
          :key="k"
          v-for="(i, k) in course['yesOrNo']"
          :label="i.label"
          :value="i.value"
        ></el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item class="search_form_btn" style="width: auto; margin-right: 0">
      <el-button
        class="el-button-icon"
        type="primary"
        size="large"
        icon="el-icon-search"
        @click="search"
      ></el-button>
      <el-button
        class="el-button-icon"
        type="defult"
        size="large"
        icon="el-icon-delete"
        @click="clear"
      ></el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import course from "@/const/academy/course.js";
export default {
  name: "form",
  components: {},
  props: {},
  data() {
    return {
      course: course,
      searchFrom: {
        keyword: "",
        // consumed: ""
      }
    };
  },
  created() {},

  mounted() {},
  activated() {},
  methods: {
    // 搜索
    search() {
      this.$emit("search", this.searchFrom);
    },
    // 全部清除选项
    clear() {
      this.searchFrom = {
        ...this.searchFrom,
        keyword: "",
        // consumed: ""
      };
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
.search_form_btn {
  /deep/.el-form-item__content {
    display: flex !important;
    align-items: center;
  }
}
</style>
