<template>
  <el-form
    class="df_align_center"
    :label-position="'top'"
    :inline="true"
    :model="searchFrom"
  >
    <el-form-item v-if="schoolList.length > 1" style="width: 15%">
      <el-select
        v-model="searchFrom['schoolIds']"
        clearable
        filterable
        placeholder="所属校区"
        @clear="search"
      >
        <el-option
          :key="k"
          v-for="(i, k) in schoolList"
          :label="i.enName"
          :value="i.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width: 15%">
      <el-select
        v-model="searchFrom['yearGroupName']"
        multiple
        clearable
        filterable
        placeholder="年级"
        @clear="search"
      >
        <el-option
          :key="k"
          v-for="(i, k) in yeargroupList"
          :label="i"
          :value="i"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width: 15%">
      <el-select
        v-model="searchFrom['form']"
        multiple
        clearable
        filterable
        placeholder="班级"
        @clear="search"
      >
        <el-option
          :key="k"
          v-for="(i, k) in formList"
          :label="i"
          :value="i"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width: 15%">
      <el-input
        v-model="searchFrom['isaStudentCodeAndNo']"
        placeholder="学生爱莎ID/学号"
        clearable
        @clear="search"
      ></el-input>
    </el-form-item>
    <el-form-item style="width: 15%">
      <el-input
        v-model="searchFrom['allName']"
        placeholder="学生姓名/昵称"
        clearable
        @clear="search"
      ></el-input>
    </el-form-item>
    <el-form-item class="search_form_btn" style="width: auto; margin-right: 0">
      <el-popover
        placement="bottom"
        width="800"
        trigger="click"
        style="margin-right: 10px;"
      >
        <el-form
          class="df_aw"
          :label-position="'top'"
          :inline="true"
          :model="searchFrom"
        >
          <el-form-item style="width: 23%">
            <el-input
              v-model="searchFrom['projectName']"
              placeholder="所属项目"
              clearable
              @clear="search"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 23%">
            <el-input
              v-model="searchFrom['buildingName']"
              placeholder="楼栋名称"
              clearable
              @clear="search"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 23%">
            <el-input
              v-model="searchFrom['roomNum']"
              placeholder="房间号"
              clearable
              @clear="search"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 23%">
            <el-input
              v-model="searchFrom['bedLabel']"
              placeholder="床位号"
              clearable
              @clear="search"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="large" slot="reference"
          >高级筛选</el-button
        >
      </el-popover>
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
import isaData from "../const.js";
export default {
  name: "form",
  components: {},
  props: {
    yeargroupList: {
      default: () => {
        return [];
      },
      type: Array
    },
    schoolList: {
      default: () => {
        return [];
      },
      type: Array
    },
    formList: {
      default: () => {
        return [];
      },
      type: Array
    }
  },
  data() {
    return {
      isaData: isaData,
      searchFrom: {
        schoolIds: "",
        yearGroupName: [],
        form: [],
        isaStudentCodeAndNo: "",
        allName: "",
        projectName: "",
        buildingName: "",
        roomNum: "",
        bedLabel: ""
      }
    };
  },
  created() {},

  mounted() {},
  activated() {},
  methods: {
    // 搜索
    search() {
      console.log("searchFrom", this.searchFrom);
      this.$emit("search", this.searchFrom);
      setTimeout(() => {
        this.clearForm();
      }, 1000);
    },
    // 全部清除选项
    clear() {
      this.searchFrom = {
        ...this.searchFrom,
        schoolIds: "",
        yearGroupName: [],
        form: [],
        isaStudentCodeAndNo: "",
        allName: "",
        projectName: "",
        buildingName: "",
        roomNum: "",
        bedLabel: ""
      };
      this.search();
    },
    clearForm() {
      this.searchFrom = {
        ...this.searchFrom,
        projectName: "",
        buildingName: "",
        roomNum: "",
        bedLabel: ""
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
