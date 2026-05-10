<template>
  <div class="community_page">
    <el-dialog
      :title="modalTypeText[modalType]"
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
            <el-form-item style="width: 100%" label="用户名" prop="username">
              <el-input
                v-model="formData.username"
                placeholder="请输入"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" label="手机号" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" label="密码" prop="password">
              <el-input
                v-model="formData.password"
                placeholder="请输入"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" label="所属园区" prop="school">
              <el-select
                style="width: 100%"
                v-model="formData.school"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dictpermissions['order_school']"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 100%" label="备注" prop="note">
              <el-input
                v-model="formData.note"
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
import {
  addSecurityGuard,
  editSecurityGuard,
} from "@/api/workorder/user/securityguard.js";
export default {
  data() {
    return {
      modalType: "add",
      modalTypeText: {
        add: "新增",
        edit: "编辑",
      },
      showModal: false,
      formData: {},
      formRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          // 手机号格式校验11位
          {
            validator: (rule, value, callback) => {
              if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error("请输入正确的手机号"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // 密码长度校验8-12位,包含大小写字母\数字\特殊字符
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
        school: [
          { required: true, message: "请选择所属园区", trigger: "change" },
        ],
        note: [{ required: false, message: "请输入备注", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["dictpermissions"]),
  },
  methods: {
    // 新增
    addItem() {
      addSecurityGuard(this.formData).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.$message.success("新增成功");
          this.handleClose();
          this.$emit("getList");
        }
      });
    },
    // 编辑
    editItem() {
      editSecurityGuard(this.formData).then((res) => {
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
          this.modalType === "add" ? this.addItem() : this.editItem();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 打开弹窗
    openModal(type, item = {}) {
      this.modalType = type;
      this.showModal = true;
      //   if (type === "edit") {
      //     this.formData = item;
      //   }
    },
    // 关闭弹窗
    handleClose() {
      this.formData = {};
      this.showModal = false;
    },
  },
};
</script>
