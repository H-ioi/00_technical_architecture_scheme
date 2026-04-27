<template>
  <div class="formgenerator_right" style="width: 540px; padding-bottom: 0">
    <div class="formgenerator_right_title">
      {{ $t("consult.显示规则配置") }}
    </div>

    <el-scrollbar class="formgenerator_right_scrollbar">
      <div class="formCard" v-for="(form, index) in formList" :key="index">
        <i class="el-icon-delete" @click="removeForm(index)"></i>
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="form"
          ref="setform"
        >
          <div>
            <el-form-item label="触发字段">
              <el-select
                style="width: 100%"
                v-model="form.triggerFieldId"
                placeholder="请选择触发字段"
              >
                <el-option
                  v-for="item in otherFormList"
                  :key="item.fieldId"
                  :label="item.label"
                  :value="item.fieldId"
                  :disabled="isFieldSelected(item.fieldId, index)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="触发选项">
              <el-select
                style="width: 100%"
                multiple
                v-model="form.triggerPropertyIds"
                placeholder="请选择触发选项"
              >
                <el-option
                  v-for="item in currentFormOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="触发条件">
              <el-select
                style="width: 100%"
                v-model="form.matchMode"
                placeholder="请选择触发条件"
              >
                <el-option label="等于" :value="0"></el-option>
                <el-option label="包含" :value="1"></el-option>
                <el-option label="不等于" :value="2"></el-option>
                <el-option label="大于" :value="3"></el-option>
                <el-option label="小于" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-button v-if="isActiveForm" type="primary" @click="addForm"
        >添加</el-button
      >
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    formArr: {
      type: Array,
      default: () => [],
    },
    isActiveForm: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      otherFormList: [],
      currentFormOption: [],
      formList: [],
    };
  },
  created() {},
  computed: {
    ...mapGetters(["pooldictpermissions", "pooldictionary"]),
  },
  watch: {
    // 监听formList数组变化
    formList: {
      handler(newList, oldList) {
        console.log("formList变化:", newList);
        // 当formList变化时，重新生成校验规则
        this.resetVisibleCondition();
      },
      deep: true, // 深度监听，确保数组内部元素变化也能被捕获
    },
  },
  methods: {
    resetVisibleCondition() {
      this.$emit("resetVisibleCondition", this.formList);
    },
    // 添加组件
    addForm() {
      this.formList.push({
        triggerFieldId: "",
        triggerPropertyIds: "",
        matchMode: "",
      });
    },
    // 删除组件
    removeForm(index) {
      // 确认删除
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.formList.splice(index, 1);
      });
    },
    // 设置组件列表
    setFormList(data) {
      console.log("setFormList", data);
      this.formList = data.visibleCondition || [];
      this.otherFormList = this.formArr.filter(
        (item) => item.fieldId != data.fieldId
      );
      this.currentFormOption = data.properties.option || [];
    },
    // 检查formList下每个字段是否填写完整并提示用户填写
    checkFormList() {
      // console.log("checkFormList", this.formList);
      let isComplete = true;
      if (this.formList.length == 0) return isComplete;
      this.formList.forEach((form) => {
        if (
          !form.triggerFieldId ||
          form.triggerPropertyIds.length == 0 ||
          !String(form.matchMode)
        ) {
          isComplete = false;
          this.$message({
            message: "请填写完整触发字段、触发选项和触发条件",
            type: "warning",
          });
        }
      });
      return isComplete;
    },
    // 检查字段是否已被其他规则选中
    isFieldSelected(fieldId, currentIndex) {
      return this.formList.some((form, index) => {
        return index !== currentIndex && form.triggerFieldId === fieldId;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.formCard {
  margin-bottom: 20px;
  border: 1px solid #cccccc;
  padding: 20px;
  border-radius: 20px;
  box-sizing: border-box;
  position: relative;
  .el-icon-delete {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    color: #f56c6c;
    cursor: pointer;
  }
}
.formgenerator_right {
  width: 360px;
  padding-bottom: 20px;
  height: 100%;
  background: #fcfcfc;
  box-shadow: rgba(23, 94, 103, 0.2) 26px 0px 32px -30px inset;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .formgenerator_right_title {
    font-size: 16px;
    font-weight: bold;
    color: #666666;
    padding: 20px 30px;
    border-bottom: 1px solid #cccccc;
  }
  .formgenerator_right_scrollbar {
    flex: 1;
    padding: 40px 30px 0;
    .el-form {
      .el-form-item {
        width: 100%;
        margin-right: 0;
      }
    }
  }
}

.option::before {
  padding: 1px 2px;
  background: #f56c6c;
  cursor: pointer;
}
.addoption {
  font-size: 14px;
  font-weight: 400;
  color: #26919f;
  cursor: pointer;
}
.selectform {
  /deep/.el-input.is-disabled .el-input__inner {
    cursor: default;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: default;
  }
}
</style>
