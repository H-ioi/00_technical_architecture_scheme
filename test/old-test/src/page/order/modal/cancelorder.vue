<template>
  <div>
    <el-dialog
      title="取消工单"
      :visible.sync="showCancel"
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
            <el-form-item label="取消原因" style="width: 100%" prop="reason">
              <el-input
                type="textarea"
                :rows="5"
                :maxlength="300"
                show-word-limit
                v-model="ruleForm.reason"
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
import { cancelOrder, cancelMyOrder } from "@/api/workorder/order/index.js";
export default {
  name: "PCOrderAddorder",
  props: {
    showCancel: Boolean,
    currentOrderId: Array,
  },
  data() {
    return {
      ruleForm: { reason: "" },
      rules: {
        reason: [{ required: true, message: "请输入", trigger: "blur" }],
      },
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
          let obj = new FormData();
          obj.append("ids", this.currentOrderId);
          if (this.ruleForm.reason) {
            obj.append("reason", this.ruleForm.reason);
          }

          this.cancelOrder(obj);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelOrder(data) {
      if (this.$route.path == "/order/mylist/index" || this.$route.query.isMy) {
        cancelMyOrder(data).then((res) => {
          this.setData(res);
        });
      } else {
        cancelOrder(data).then((res) => {
          this.setData(res);
        });
      }
    },
    setData(res) {
      if (res.data.success) {
        this.$message.success("已取消");
        this.$emit("refreshData");
        this.closeModal();
      } else {
        this.$message.error("失败");
      }
      this.closeModal();
    },

    closeModal() {
      this.ruleForm = {
        reason: "",
      };
      this.$emit("changeModal", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>