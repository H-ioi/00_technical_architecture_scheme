<template>
  <div class="community_page">
    <el-dialog
      title="修改密码"
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
            <el-form-item style="width: 100%" label="密码" prop="password">
              <el-input
                v-model="formData.password"
                placeholder="请输入"
                maxlength="50"
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
import { editSecurityGuardPassword } from "@/api/workorder/user/securityguard.js";
export default {
  data() {
    return {
      showModal: false,
      formData: {},
      formRules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // {
          //   validator: (rule, value, callback) => {
          //     if (
          //       !/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]{8,12}$/.test(
          //         value
          //       )
          //     ) {
          //       callback(
          //         new Error(
          //           "密码长度必须在8-12位之间,包含大小写字母、数字和特殊字符"
          //         )
          //       );
          //     } else {
          //       callback();
          //     }
          //   },
          //   trigger: "blur",
          // },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["dictpermissions"]),
  },
  methods: {
    // 修改密码
    changePassword() {
      editSecurityGuardPassword(this.formData).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.$message.success("编辑成功");
          this.handleClose();
          this.$emit("getList");
        }
      });
    },
    // 提交表单
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.changePassword();
        } else {
          return false;
        }
      });
    },
    // 打开弹窗
    openModal(item = {}) {
      this.showModal = true;
      this.formData = {
        password: "",
        id: item.id,
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
