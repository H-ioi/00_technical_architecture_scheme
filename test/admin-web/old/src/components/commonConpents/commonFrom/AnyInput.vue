<template>
  <div class="inputBox">
    <el-form-item
      :label="item.label"
      :prop="item.prop"
      :key="index"
      v-for="(item, index) in inputdata"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <!-- <div v-if="!isedit" class="fromtext">
        {{
          ruleForm[item.prop] == null ||
          ruleForm[item.prop] == undefined ||
          ruleForm[item.prop] == ""
            ? (ruleForm[item.prop] = "无")
            : ruleForm[item.prop]
        }}
      </div> -->
      <div>
        <el-select
          filterable
          :disabled="!isedit"
          v-if="item.formitemtype == 'select'"
          v-model="ruleForm[item.prop]"
          :placeholder="item.placeholder"
        >
          <el-option
            :key="k"
            v-for="(i, k) in item['selectArr']"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
        <el-input
          :disabled="!isedit"
          v-else-if="item.formitemtype == 'input'"
          :placeholder="item.placeholder"
          v-model="ruleForm[item.prop]"
        ></el-input>
        <el-date-picker
          :disabled="!isedit"
          style="width: 100%"
          v-else-if="item.formitemtype == 'date'"
          v-model="ruleForm[item.prop]"
          type="datetime"
          placeholder="请选择日期"
        >
        </el-date-picker>
      </div>
    </el-form-item>
    <el-form-item
      label="创建人"
      :style="`width:${inputwidth}; padding-right: 25px`"
      v-if="
        $route.path == '/contact/client/index/detail' ||
        $route.path == '/contact/client/index/edit'
      "
    >
      <el-input
        :disabled="true"
        placeholder=""
        v-model="ruleForm['createrName']"
      ></el-input>
    </el-form-item>
  </div>
</template>

<script>
import { getselectlist } from "@/const/from/fromdata";
export default {
  name: "UniUiAnyinput",
  props: {
    ruleForm: Object,
    InputData: Array,
    inputwidth: String,
    isedit: Boolean,
  },
  data() {
    return {
      inputdata: [],
    };
  },
  created() {
    this.setdata();
  },
  mounted() {},

  methods: {
    async setdata() {
      let data = await getselectlist(this.InputData);
      this.$nextTick(() => {
        this.inputdata = data;
        console.log(" this.inputdata", this.inputdata);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.inputBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
/deep/.el-input__inner {
  border: 1px solid #dcdfe6;
}
/deep/.el-select {
  display: block;
}
.fromtext {
  background: #f8f8f8;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  font-size: 16px;
  font-family: Alibaba PuHuiTi;
  font-weight: 600;
  color: #cdcdcd;
  padding-left: 20px;
}
/deep/.el-input.is-disabled .el-input__inner {
  background-color: #f8f8f8;
}
</style>