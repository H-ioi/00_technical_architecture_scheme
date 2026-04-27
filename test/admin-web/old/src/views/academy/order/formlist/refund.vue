<template>
  <el-form
    class="df_align_center"
    :label-position="'top'"
    :inline="true"
    :model="searchFrom"
  >
    <el-form-item label="名称" style="width: 20%">
      <el-input
        v-model="searchFrom['keywordScene']"
        placeholder="请输入赛事/活动/课程/俱乐部名称"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="订单编号" style="width: 20%">
      <el-input
        v-model="searchFrom['keywordOrder']"
        placeholder="请输入"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="家长账号/学生名称" style="width: 20%">
      <el-input
        v-model="searchFrom['keywordAccount']"
        placeholder="请输入"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="下单时间" style="width: 20%">
      <el-date-picker
        v-model="searchFrom['time']"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :format="'yyyy-MM-dd HH:mm'"
        :value-format="'yyyy-MM-dd HH:mm'"
        @change="changeTime"
      >
      </el-date-picker>
    </el-form-item>

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
import course from "@/const/academy/course.js";
export default {
  name: "form",
  components: {},
  props: {},
  data() {
    return {
      course: course,
      searchFrom: {
        keywordAccount: "",
        keywordOrder: "",
        keywordScene: "",
        time: []
      }
    };
  },
  created() {},

  mounted() {},
  activated() {},
  methods: {
    // 搜索
    search() {
      console.log("this.searchFrom", this.searchFrom);
      let data = {
        keywordAccount: this.searchFrom["keywordAccount"],
        keywordOrder: this.searchFrom["keywordOrder"],
        keywordScene: this.searchFrom["keywordScene"],
        orderingTimeBegin: this.searchFrom["time"]
          ? this.searchFrom["time"][0]
          : "",
        orderingTimeEnd: this.searchFrom["time"]
          ? this.searchFrom["time"][1]
          : ""
      };
      this.$emit("search", data);
    },
    changeTime(e) {
      if (!e) {
        console.log("e", e);
        this.searchFrom["time"] = [];
        console.log("222this.searchFrom", this.searchFrom);
      }
    },
    // 全部清除选项
    clear() {
      this.searchFrom = {
        ...this.searchFrom,
        keywordAccount: "",
        keywordOrder: "",
        keywordScene: "",
        time: []
      };
      this.search();
    },
    clearAll() {
      this.searchFrom = {
        ...this.searchFrom,
        keywordAccount: "",
        keywordOrder: "",
        keywordScene: "",
        time: []
      };
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
