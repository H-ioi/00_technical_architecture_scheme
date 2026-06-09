<template>
  <div class="family">
    <div v-for="(item, index) in familyList" :key="item">
      <div class="family-title">
        <span>
          {{ familyList.length > 1 ? `${index + 1}. ` : "" }}
          {{ $t("consult.家长/监护人") }}</span
        >
        <i
          v-if="familyList.length > 1"
          class="el-icon-delete"
          style="cursor: pointer; color: #ff4949; font-size: 16px"
          @click="removeFamily(index)"
        ></i>
      </div>
      <FamilyForm
        :ref="`FamilyForm${item}`"
        :relationTypeList="relationTypeList"
      />
    </div>
    <div class="family-add">
      <el-button
        @click="addFamily"
        round
        type="primary"
        size="small"
        icon="el-icon-plus"
      >
        {{ $t("consult.添加监护人") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { createCode } from "@/util/util.js";
import FamilyForm from "./familyform.vue";
import { add } from "lodash";
export default {
  components: {
    FamilyForm,
  },
  props: {
    relationTypeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      familyList: [],
    };
  },
  created() {
    this.addFamily();
  },
  methods: {
    // 获取填写的监护人信息
    getFamilyList() {
      let resultList = [];
      this.familyList.forEach((item) => {
        resultList.push(this.$refs[`FamilyForm${item}`][0].onSubmit());
      });
      // 等待所有监护人信息获取完成
      return new Promise((resolve, reject) => {
        // 等待所有监护人信息获取完成
        Promise.all(resultList)
          .then((item) => {
            console.log("获取到的监护人信息", item);
            resolve(item);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    // 添加监护人
    addFamily() {
      this.familyList.push(createCode());
    },
    // 删除监护人
    removeFamily(index) {
      this.familyList.splice(index, 1);
    },
    resetInfo(data) {
      this.familyList = [];
      data.forEach((item) => {
        let id = createCode();
        this.familyList.push(id);
        // 重置表单数据
        this.$nextTick(() => {
          this.$refs[`FamilyForm${id}`][0].resetForm(item);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.family {
  .family-title {
    font-size: 14px;
    font-weight: bold;
    color: #000;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .family-add {
    text-align: right;
    .el-button--primary {
      background-color: #2a3f54 !important;
      border-color: #2a3f54 !important;
      color: #fff !important;
    }
  }
}
</style>
