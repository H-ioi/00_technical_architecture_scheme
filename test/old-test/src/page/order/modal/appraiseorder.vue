<template>
  <div>
    <el-dialog
      title="评价工单"
      :visible.sync="showAppraise"
      width="50%"
      :before-close="closeModal"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap">
            <el-form-item label="评价" style="width: 100%" prop="star">
              <el-rate
                v-model="ruleForm.star"
                show-text
                :texts="rateTexts"
                :void-color="'#C6D1DE'"
                :text-color="'#175E67'"
                :colors="['#175E67', '#175E67', '#175E67']"
                void-icon-class="el-icon-star-on"
              >
              </el-rate>
            </el-form-item>
            <el-form-item label="备注" style="width: 100%" prop="content">
              <el-input
                type="textarea"
                :rows="5"
                :maxlength="300"
                show-word-limit
                v-model="ruleForm.content"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button type="default" size="medium" @click="closeModal"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { appraiseOrder, appraiseMyOrder } from "@/api/workorder/order/index.js";
export default {
  name: "PCOrderAddorder",
  props: {
    showAppraise: Boolean,
    currentOrderId: String,
  },
  data() {
    return {
      ruleForm: { content: "", star: 0 },
      rules: {
        reason: [{ required: false, message: "请输入", trigger: "blur" }],
      },
      rateTexts: ["差", "较差", "一般", "较好", "优秀"],
    };
  },

  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userList"]),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ...this.ruleForm,
            ids: [this.currentOrderId],
          };
          if (!data["content"]) {
            delete data["content"];
          }
          this.appraiseOrder(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    appraiseOrder(data) {
      if (this.getIsMy()) {
        appraiseMyOrder(data).then((res) => {
          this.setData(res);
        });
      } else {
        appraiseOrder(data).then((res) => {
          this.setData(res);
        });
      }
    },
    setData(res) {
      if (res.data.success) {
        this.$message.success("已评价");
        this.$emit("refreshData");
        this.closeModal();
      } else {
        this.$message.error("失败");
      }
      this.closeModal();
    },
    getIsMy() {
      return (
        this.$route.path == "/order/mylist/index" || this.$route.query.isMy
      );
    },
    closeModal() {
      this.ruleForm = { content: "", star: 0 };
      this.$emit("changeModal", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>