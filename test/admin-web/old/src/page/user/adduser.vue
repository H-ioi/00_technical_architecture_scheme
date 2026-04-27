<template>
  <div>
    <div class="editFromBox">
      <el-form
        :label-position="'top'"
        :inline="true"
        :model="form"
        ref="form"
        :rules="rules"
      >
        <div class="formItem">
          <div class="fromTitle">用户基本信息</div>

          <div class="df_center_wrap">
            <el-form-item label="姓名" prop="nickname">
              <el-input
                v-model="form.nickname"
                placeholder="请输入"
                :maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" prop="department">
              <el-input
                v-model="form.department"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属校区" prop="school">
              <el-select v-model="form.school" placeholder="请选择">
                <el-option
                  :key="k"
                  v-for="(i, k) in dictionary['order_school']"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="密码" v-if="!isEdit" prop="password">
              <el-input v-model="form.password" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.note" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item class="editFromBtn">
          <el-button type="primary" size="medium" @click="submitForm('form')"
            >保存</el-button
          >
          <el-button
            v-if="isEdit"
            type="default"
            size="medium"
            @click="cancelEdit"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formrules } from "@/util/form.js";
import { addOrderUser, editOrderUser } from "@/api/workorder/user/index.js";
export default {
  name: "PCOrderAddorder",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    var formrulesdata = formrules;
    return {
      form: {},
      rules: {
        nickname: [{ required: true, message: "请输入", trigger: "blur" }],
        email: [
          { required: true, message: "请输入", trigger: "blur" },
          // { validator: formrulesdata["isEmail"], trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入", trigger: "blur" },
          // { validator: formrulesdata["isMobileNumber"], trigger: "blur" },
        ],
        department: [{ required: false, message: "请输入", trigger: "blur" }],
        area: [{ required: true, message: "请选择", trigger: "blur" }],
        password: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary"]),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("from", this.form);
          if (this.isEdit) {
            this.editOrderUser(this.form);
          } else {
            this.form["status"] = 1;
            this.addOrderUser(this.form);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addOrderUser(data) {
      addOrderUser(data).then((res) => {
        if (res.data.success) {
          this.form = {};
          this.$message.success("新增成功");
          this.$router.push("/user/index");
        }
      });
    },
    editOrderUser(data) {
      editOrderUser(data).then((res) => {
        if (res.data.success) {
          this.form = {};
          this.$message.success("编辑成功");
          this.cancelEdit();
        }
      });
    },
    cancelEdit() {
      this.$emit("editOrderUser");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>