<template>
  <div class="filterbox df_sb">
    <el-input
      class="mr"
      size="medium"
      style="width: 370px; padding: 0 0 10px"
      v-model="keywords"
      clearable
      prefix-icon="el-icon-search"
      :placeholder="'请输入' + searchPlaceholder"
      @keyup.enter.native="searchkeyword"
      @clear="searchkeyword"
      @blur="searchkeyword"
    ></el-input>
    <div class="df_sb">
      <el-select
        v-if="isShowPersonnel"
        clearable
        class="mr"
        style="width: 200px"
        v-model="isPositionCertValue"
        placeholder="请选择职业认证"
        @change="changeisPositionCert"
      >
        <el-option
          v-for="(item, index) in isPositionCert"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-if="isShowTime"
        clearable
        class="mr"
        style="width: 200px"
        v-model="timeIntValue"
        placeholder="请选择时间"
        @change="changetimeInt"
      >
        <el-option
          v-for="(item, index) in timeInt"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- <el-select
        v-if="isShowCreatedType"
        clearable
        class="mr"
        style="width: 200px"
        v-model="createdTypeValue"
        placeholder="请选择创建类型"
        @change="changeCreatedType"
      >
        <el-option
          v-for="(item, index) in createdType"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select> -->
      <el-date-picker
        class="ml"
        v-model="date.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        :value-format="'yyyy-MM-dd'"
        :format="'yyyy-MM-dd'"
        @change="changeDate"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: "UniUiSearchtop",
  props: {
    isShowPersonnel: Boolean,
    isShowCreatedType: Boolean,
    isShowTime: Boolean,
    searchPlaceholder: String,
  },
  data() {
    return {
      date: {},
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      keywords: "",
      filterTime: [],
      isPositionCert: [
        { label: "职业已认证", value: "1" },
        { label: "职业未认证", value: "0" },
      ],
      isOrganizationCert: [
        { label: "机构已认证", value: "1" },
        { label: "机构未认证", value: "0" },
      ],
      isPositionCertValue: "",
      timeInt: [
        { label: "创建时间", value: "1" },
        { label: "登录时间", value: "2" },
      ],
      timeIntValue: "",
      createdType: [
        { label: "系统创建", value: "1" },
        { label: "个人创建", value: "2" },
      ],
      createdTypeValue: "",
      filterobj: {},
      placeholder: "请输入微信ID/名字/手机号码",
    };
  },

  mounted() {},

  methods: {
    changeCreatedType(e) {
      this.filterobj["type"] = e;
      this.filterobj["current"] = 1;
      this.$emit("filterlist", this.filterobj);
    },
    changetimeInt(e) {
      this.filterobj["timeInt"] = e;
      this.filterobj["current"] = 1;
      if (this.filterobj["begin"] !== "" && this.filterobj["end"] !== "") {
        this.$emit("filterlist", this.filterobj);
      }
    },
    changeisPositionCert(e) {
      this.filterobj["isPositionCert"] = e;
      this.filterobj["current"] = 1;
      this.$emit("filterlist", this.filterobj);
    },
    searchkeyword() {
      this.filterobj["keyword"] = this.keywords;
      this.filterobj["current"] = 1;
      this.$emit("filterlist", this.filterobj);
    },
    changeDate(e) {
      console.log(1111);
      this.filterobj["current"] = 1;
      if (e == null) {
        this.filterobj["begin"] = "";
        this.filterobj["end"] = "";
        this.$emit("filterlist", this.filterobj);
      } else {
        this.filterobj["begin"] = e[0];
        this.filterobj["end"] = e[1];
        this.$emit("filterlist", this.filterobj);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.filterbox {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.mr {
  margin-right: 20px;
}
/deep/.el-input__icon {
  height: 85%;
}
/deep/.el-date-editor .el-range-input,
.el-date-editor .el-range-separator {
  font-size: 16px;
  color: #cdcdcd;
}
/deep/.el-range-editor--small .el-range-separator {
  font-size: 16px;
  color: #cdcdcd;
}
/deep/.el-date-editor .el-range-separator {
  width: 10%;
}
</style>