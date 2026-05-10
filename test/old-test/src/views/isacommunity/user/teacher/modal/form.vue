<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" style="max-height: 600px; overflow-y: auto">
            <el-form-item
              :label="$t('isagroup.校区')"
              prop="school"
              style="width: 49%"
              v-if="dictionary['school'].length > 1"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['school']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in dictionary['school']"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.昵称')" prop="nickname" style="width: 49%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.nickname"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.部门')"
              prop="department"
              style="width: 49%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.department"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.邮箱')" prop="email" style="width: 49%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.email"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.手机号')" prop="phone" style="width: 49%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.phone"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.密码')" prop="password" style="width: 49%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.password"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.状态')" prop="status" style="width: 49%">
              <el-select
                style="width: 100%"
                v-model="ruleForm['status']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['statusType']"
                  :label="$t('isagroup.' + i.label)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
              $t("isagroup.确认")
            }}</el-button>
            <el-button type="default" size="medium" @click="closeModal">{{
              $t("isagroup.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addTeacher, editTeacher, getTeacherDetail } from "@/api/isacommunity/user.js";
import { formrules } from "@/util/form.js";
import consts from "@/const/isacommunity/consts.js";
export default {
  name: "form",
  props: {},
  data() {
    let that = this;
    let formrulesdata = formrules;
    return {
      consts: consts,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        school: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        nickname: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        department: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        email: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
          { validator: formrulesdata["isEmail"], trigger: "blur" },
        ],
        phone: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
          { validator: formrulesdata["isMobileNumber"], trigger: "blur" },
        ],
        password: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        status: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    // 打开
    async showForm(type = "add", item = {}) {
      this.modalType = type;
      this.showModal = true;

      if (type != "add") {
        this.getDetail(item["id"]);
      } else {
        if (this.dictionary["school"].length == 1) {
          let schoolId = this.dictionary["school"][0].id;
          this.ruleForm = {
            ...this.ruleForm,
            school: schoolId,
          };
        }
      }
    },
    // 新增
    addData(data) {
      addTeacher(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editTeacher(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getTeacherDetail(id).then(async (res) => {
        if (res.data.success) {
          let { school, nickname, department, email, phone, status } = res.data.data;

          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              school,
              nickname,
              department,
              email,
              phone,
              status,
            };
          });
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ...this.ruleForm,
          };

          if (this.modalType == "add") {
            this.addData(data);
          } else {
            this.editData(data);
          }
        }
      });
    },
    // 关闭
    closeModal() {
      this.showModal = false;
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
