<template>
  <div>
    <el-dialog
      :title="title == 'supply' ? '补充信息' : '提交工单'"
      :visible.sync="showSupply"
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
          <el-form-item style="width: 60%" label="附件">
            <FileListOrder
              ref="filelist"
              :scene="'order_attachment'"
              :isDisabled="false"
            />
          </el-form-item>
          <div class="df_center_wrap">
            <el-form-item label="备注" style="width: 80%">
              <el-input
                type="textarea"
                :rows="5"
                :maxlength="300"
                show-word-limit
                v-model="ruleForm.remark"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
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
import FileListOrder from "@/components/common/FileListOrder";
import {
  completeOrder,
  supplyOrder,
  completeMyOrder,
  supplyMyOrder,
} from "@/api/workorder/order/index.js";
export default {
  name: "PCOrderAddorder",
  props: {
    showSupply: Boolean,
    currentOrderId: String,
    title: String,
  },
  components: {
    FileListOrder,
  },
  data() {
    return {
      ruleForm: { remark: "" },
      rules: {
        remark: [{ required: false, message: "请输入", trigger: "blur" }],
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
          obj.append("id", this.currentOrderId);
          if (this.ruleForm.remark) {
            obj.append("remark", this.ruleForm.remark);
          }

          let fileIds = this.$refs["filelist"].filelist;
          if (fileIds.length > 0) {
            obj.append("fileIds", fileIds);
          }
          if (this.title == "supply") {
            this.supplyOrder(obj);
          } else {
            this.completeOrder(obj);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    completeOrder(data) {
      if (this.getIsMy()) {
        completeMyOrder(data).then((res) => {
          this.setData(res, "已提交");
        });
      } else {
        completeOrder(data).then((res) => {
          this.setData(res, "已提交");
        });
      }
    },
    supplyOrder(data) {
      if (this.getIsMy()) {
        supplyMyOrder(data).then((res) => {
          this.setData(res, "已补充");
        });
      } else {
        supplyOrder(data).then((res) => {
          this.setData(res, "已补充");
        });
      }
    },
    getIsMy() {
      return (
        this.$route.path == "/order/mylist/index" || this.$route.query.isMy
      );
    },
    setData(res, msg) {
      if (res.data.success) {
        this.$message.success(msg);
        this.$emit("refreshData");
        this.closeModal();
      } else {
        this.$message.error("失败");
      }
      this.closeModal();
    },
    closeModal() {
      this.ruleForm = {
        remark: "",
      };
      this.$refs["filelist"].filelist = [];
      this.$refs["filelist"].filelistobj = [];
      this.$emit("changeModal", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>