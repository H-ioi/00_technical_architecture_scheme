<template>
  <div class="thepool_page">
    <el-dialog
      :title="type == 'add' ? $t('consult.新增') : $t('consult.编辑')"
      :visible.sync="showModal"
      width="640px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
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
            <el-form-item :label="$t('consult.类型')" prop="userType" style="width: 100%">
              <el-select
                style="width: 100%"
                v-model="ruleForm.userType"
                :placeholder="$t('consult.请选择')"
                :disabled="type == 'edit'"
                @change="changeType"
              >
                <el-option
                  v-for="item in consult['userEmailType']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="userFormName" prop="userId" style="width: 100%">
              <el-select
                filterable
                style="width: 100%"
                v-model="ruleForm.userId"
                :placeholder="$t('consult.请选择')"
                :disabled="type == 'edit'"
                @change="changeUser"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.用户名')"
              prop="username"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.username"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.邮箱')"
              prop="emailAddress"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.emailAddress"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.userType == '1'"
              :label="$t('consult.是否允许使用个人邮箱发送')"
              prop="isAllowPersonalEmail"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.isAllowPersonalEmail"
                :placeholder="$t('consult.请选择')"
                @change="changeAllowPersonalEmail"
              >
                <el-option
                  v-for="item in consult['yesOrno']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.邮箱密钥')"
              prop="emailKey"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.emailKey"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              round
              @click="submitForm('ruleForm')"
              >{{ $t("consult.保存") }}</el-button
            >
            <el-button type="default" size="medium" round @click="closeModal">{{
              $t("consult.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  addUserEmail,
  updateEmail,
  getUserEmailInfo,
  getOrganizationUserEmail,
} from "@/api/consult/email.js";
import { consult } from "@/const/consult/index.js";
export default {
  name: "email",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      consult: consult,
      type: "add",
      showModal: false,
      ruleForm: {},
      rules: this.initRules(),
      userList: [],
      userEmailList: [],
      userFormName: that.$t("consult.用户"),
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["pooldictpermissions", "permissions", "dictionary", "i18nlocel"]),
  },
  watch: {
    i18nlocel: {
      handler: function () {
        // 语言切换时重新初始化验证规则
        this.rules = this.initRules();
        // 清除表单验证状态
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate();
        }
      },
      immediate: false,
    },
    "ruleForm.isAllowPersonalEmail": {
      handler: function () {
        // 当isAllowPersonalEmail变化时，清除emailKey的验证状态，以便重新验证
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate(["emailKey"]);
        }
      },
    },
  },
  methods: {
    // 初始化表单验证规则
    initRules() {
      let that = this; // 保存Vue实例引用
      return {
        username: [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
        ],
        emailAddress: [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
          {
            type: "pattern",
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: this.$t("consult.请输入正确的邮箱格式"),
            trigger: "blur",
          },
        ],
        emailKey: [
          {
            required: true,
            message: this.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        userType: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        userId: [{ required: true, message: this.$t("consult.请选择"), trigger: "blur" }],
        isAllowPersonalEmail: [
          {
            required: false,
            message: this.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
      };
    },

    async initModal() {
      this.type = "add";
      this.userEmailList = await getOrganizationUserEmail();
      this.showModal = true;
    },

    add(data) {
      addUserEmail(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    edit(data) {
      updateEmail(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getUserEmailInfo(id).then(async (res) => {
        if (res.data.success) {
          console.log("getUserEmailInfo", res);
          this.userEmailList = await getOrganizationUserEmail();
          let {
            username,
            emailAddress,
            emailKey,
            userType,
            isAllowPersonalEmail,
            userId,
          } = res.data.data;
          this.type = "edit";
          this.showModal = true;
          this.$nextTick(() => {
            this.setSelectData(String(userType));
            this.ruleForm = {
              id: id,
              userId,
              username,
              emailAddress,
              emailKey,
              userType: String(userType),
              isAllowPersonalEmail: String(isAllowPersonalEmail),
            };
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type == "add") {
            this.add(this.ruleForm);
          } else {
            this.edit(this.ruleForm);
          }
        }
      });
    },
    // 同时，我们需要在isAllowPersonalEmail变化时重新验证emailKey
    // 在changeType方法中添加:
    changeType(e) {
      this.userList = [];
      delete this.ruleForm.userId;
      delete this.ruleForm.username;
      delete this.ruleForm.emailAddress;
      delete this.ruleForm.isAllowPersonalEmail;
      switch (e) {
        case "1":
          this.userFormName = this.$t("consult.用户");
          break;
        case "2":
          this.userFormName = this.$t("consult.学校");
          break;
      }
      this.setSelectData(e);
      // 清除可能存在的验证状态，以便重新验证
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.clearValidate(["emailKey", "isAllowPersonalEmail"]);
      }
      this.$set(
        this.rules["isAllowPersonalEmail"][0],
        "required",
        this.ruleForm.userType == "1"
      );
      this.$set(
        this.rules["emailKey"][0],
        "required",
        !(
          this.ruleForm["userType"] == "1" && this.ruleForm["isAllowPersonalEmail"] == "0"
        )
      );
    },
    changeAllowPersonalEmail(e) {
      this.$set(
        this.rules["emailKey"][0],
        "required",
        !(
          this.ruleForm["userType"] == "1" && this.ruleForm["isAllowPersonalEmail"] == "0"
        )
      );
    },

    setSelectData(e) {
      if (e == "1") {
        this.userList = this.userEmailList;
      } else if (e == "2") {
        this.userList = this.pooldictpermissions.map((item) => {
          return {
            userName: item["enLabel"],
            userId: item["value"],
          };
        });
      }
    },
    changeUser(e) {
      if (this.ruleForm.userType == "1") {
        this.ruleForm["username"] = this.userList.find(
          (item) => item.userId == e
        ).userName;
        this.ruleForm["emailAddress"] = this.userList.find(
          (item) => item.userId == e
        ).email;
      } else if (this.ruleForm.userType == "2") {
        this.ruleForm["username"] = this.userList.find(
          (item) => item.userId == e
        ).userName;
      }
    },

    closeModal() {
      this.type = "add";
      this.ruleForm = {};
      this.showModal = false;
      this.userList = [];
      this.userEmailList = [];
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
