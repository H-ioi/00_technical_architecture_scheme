<template>
  <div class="formgenerator_form_left">
    <div class="formgenerator_form_left_title">
      {{ $t("consult.点击添加到右侧表单") }}
    </div>

    <el-scrollbar style="flex: 1">
      <div v-for="(i, k) in formlist" :key="k">
        <div
          v-if="
            formData['scene'] == '1'
              ? true
              : i.type != 'protocol' && i.type != 'sign'
          "
          class="formlist"
          style="cursor: pointer; margin-bottom: 10px"
          @click="addform(i.attribute)"
        >
          <!-- <i :class="i.icon"></i>{{ i.name }} -->
          {{ $t("consult." + i.name) }}
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { formlist } from "./form.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 可选择组件类型
      formlist: formlist,
    };
  },
  methods: {
    addform(item) {
      this.$emit("addform", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.formgenerator_form_left {
  height: 100%;
  padding: 20px 10px;
  border-right: 1px solid #c5d0cf;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .formgenerator_form_left_title {
    font-size: 14px;
    color: #333333;
    -webkit-background-clip: text;
    margin-bottom: 15px;
  }
  .formlist {
    width: 180px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px dashed #c5d0cf;
    margin-bottom: 10px;
    font-size: 14px;
    font-family: Source Han Sans CN-Light, Source Han Sans CN;
    font-weight: 300;
    color: #333333;
    cursor: pointer;
    i {
      margin-right: 10px;
    }
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      box-shadow: 0px 0px 6px 1px rgba(8, 81, 90, 0.18);
      border: 1px solid #d4ab85;
      color: #d4ab85;
    }
  }
}
</style>
