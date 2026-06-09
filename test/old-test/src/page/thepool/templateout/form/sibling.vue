<template>
  <div class="sibling">
    <div v-for="(item, index) in siblingList" :key="item">
      <div class="sibling-title">
        <span>
          {{ siblingList.length > 1 ? `${index + 1}. ` : "" }}
          {{ $t("consult.兄弟姐妹信息") }}</span
        >
        <i
          v-if="siblingList.length > 1"
          class="el-icon-delete"
          style="cursor: pointer; color: #ff4949; font-size: 16px"
          @click="removeSibling(index)"
        ></i>
      </div>
      <SiblingForm :ref="`SiblingForm${item}`" />
    </div>
    <div class="sibling-add">
      <el-button
        @click="addSibling"
        round
        type="primary"
        size="small"
        icon="el-icon-plus"
      >
        {{ $t("consult.添加兄弟姐妹") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { createCode } from "@/util/util.js";
import SiblingForm from "./siblingform.vue";
export default {
  components: {
    SiblingForm,
  },
  data() {
    return {
      siblingList: [],
    };
  },
  created() {
    this.addSibling();
  },
  methods: {
    // 获取填写的兄弟姐妹信息
    getSiblingList() {
      let resultList = [];
      this.siblingList.forEach((item) => {
        resultList.push(this.$refs[`SiblingForm${item}`][0].onSubmit());
      });
      // 等待所有兄弟姐妹信息获取完成
      return new Promise((resolve, reject) => {
        // 等待所有监护人信息获取完成
        Promise.all(resultList)
          .then((item) => {
            console.log("获取到的兄弟姐妹信息", item);
            // 过滤掉status为false的项
            let filteredList = item.filter((item) => item.status);
            resolve(filteredList);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    // 添加兄弟姐妹
    addSibling() {
      this.siblingList.push(createCode());
    },
    // 删除兄弟姐妹
    removeSibling(index) {
      this.siblingList.splice(index, 1);
    },
    resetInfo(data) {
      this.siblingList = [];
      data.forEach((item) => {
        let id = createCode();
        this.siblingList.push(id);
        // 重置表单数据
        this.$nextTick(() => {
          this.$refs[`SiblingForm${id}`][0].resetForm(item);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sibling {
  .sibling-title {
    font-size: 14px;
    font-weight: bold;
    color: #000;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sibling-add {
    text-align: right;
    .el-button--primary {
      background-color: #2a3f54 !important;
      border-color: #2a3f54 !important;
      color: #fff !important;
    }
  }
}
</style>
