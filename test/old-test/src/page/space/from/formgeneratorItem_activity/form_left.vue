<template>
  <div class="formgenerator_form_left">
    <div class="formgenerator_form_left_title">
      {{ $t("consult.点击添加到右侧表单") }}
    </div>

    <el-scrollbar style="flex: 1">
      <div
        class="formlist"
        v-for="(i, k) in formlist"
        :key="k"
        @click="addform(i.attribute)"
      >
        <!-- <i :class="i.icon"></i>{{ i.name }} -->
        {{ $t("consult." + i.name) }}
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formlist } from "./form.js";
import { createCode, deepClone } from "@/util/util.js";
import { getTemplateList, getTemplateInfo } from "@/api/consult/template.js";
export default {
  props: {
    childTemplateId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 可选择组件类型
      formlist: formlist,
    };
  },
  computed: {
    ...mapGetters(["pooldictionary", "pooldictpermissions"]),
  },
  methods: {
    addform(item) {
      let data = {
        ...item,
        id: "-" + createCode(),
      };
      if (item["type"] == "guardian") {
        data["childTemplateId"] = this.childTemplateId || null;
      }
      console.log("addform", item);
      switch (item["outerType"]) {
        case "base":
          console.log("addform", data);

          this.$emit("addform", data);
          break;
        case "school":
          let option = this.pooldictionary.map((dict, index) => {
            return {
              label: dict["label"],
              id: "-" + (index + 1),
              value: dict["value"],
            };
          });
          this.$set(data, "properties", {
            ...data["properties"],
            option: option,
          });
          this.$emit("addform", data);
          break;
      }
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
      border: 1px solid #175e67;
      color: #175e67;
    }
  }
}
</style>
