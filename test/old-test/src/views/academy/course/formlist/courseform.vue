<template>
  <el-form
    class="df_align_center"
    :label-position="'top'"
    :inline="true"
    :model="searchFrom"
  >
    <el-form-item label="类型" style="width: 20%">
      <el-select
        v-model="searchFrom['type']"
        clearable
        filterable
        placeholder="请选择"
      >
        <el-option
          :key="k"
          v-for="(i, k) in course['courseFormType']"
          :label="i.label"
          :value="i.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="上架状态" style="width: 20%">
      <el-select
        v-model="searchFrom['release']"
        clearable
        filterable
        placeholder="请选择"
      >
        <el-option
          :key="k"
          v-for="(i, k) in course['courseStatus']"
          :label="i.label"
          :value="i.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否置顶" style="width: 20%">
      <el-select
        v-model="searchFrom['recommend']"
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
    </el-form-item>
    <el-form-item label="上传时间" style="width: 20%">
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
    <el-form-item label="名称" style="width: 20%">
      <el-input
        v-model="searchFrom['name']"
        placeholder="请输入名称"
        clearable
      ></el-input>
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
        type: "",
        release: "",
        name: "",
        recommend: "",
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
        type: this.searchFrom["type"],
        release: this.searchFrom["release"],
        keywords: this.searchFrom["name"],
        recommend: this.searchFrom["recommend"],
        startTime:
          this.searchFrom["time"].length > 0 ? this.searchFrom["time"][0] : "",
        endTime:
          this.searchFrom["time"].length > 0 ? this.searchFrom["time"][1] : ""
      };
      this.$emit("search", data);
    },
    changeTime(e) {
      console.log("e", e);
      if (!e) {
        this.searchFrom["time"] = [];
      }
      console.log("this.searchFrom", this.searchFrom);
    },
    // 全部清除选项
    clear() {
      this.searchFrom = {
        ...this.searchFrom,
        type: "",
        release: "",
        name: "",
        recommend: "",
        time: []
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
