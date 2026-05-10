<template>
  <div class="community_page">
    <el-dialog
      title="审批"
      :visible.sync="showModal"
      width="50%"
      :before-close="handleClose"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          ref="form"
          :label-position="'top'"
          :model="formData"
          :rules="formRules"
        >
          <div
            class="df_center_wrap"
            style="max-height: 600px; overflow-y: auto"
          >
            <el-form-item style="width: 100%" label="状态" prop="status">
              <el-radio-group style="width: 100%" v-model="formData.status">
                <el-radio label="2" value="2">拒绝</el-radio>
                <el-radio label="3" value="3">通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item style="width: 100%" label="备注" prop="remark">
              <el-input
                v-model="formData.remark"
                clearable
                placeholder="请输入"
                type="textarea"
                rows="4"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="onSubmit">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { batchApproveVisits } from "@/api/workorder/user/visit.js";
import { order } from "@/const/order/index.js";
export default {
  data() {
    return {
      showModal: false,
      order: order,
      formData: {},
      formRules: {
        status: [
          { required: true, message: "请选择审批状态", trigger: "blur" },
        ],
      },
      visitIds: [],
    };
  },
  computed: {
    ...mapGetters(["dictpermissions"]),
  },
  methods: {
    // 修改密码
    approveVisit() {
      batchApproveVisits(this.formData).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.$message.success("审批成功");
          this.handleClose();
          this.$emit("getList");
        }
      });
    },
    // 提交表单
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.approveVisit();
        } else {
          return false;
        }
      });
    },
    // 打开弹窗
    openModal(ids) {
      this.showModal = true;
      this.visitIds = ids;
      this.formData = {
        ...this.formData,
        ids: ids,
      };
    },
    // 关闭弹窗
    handleClose() {
      this.formData = {};
      this.showModal = false;
    },
  },
};
</script>
