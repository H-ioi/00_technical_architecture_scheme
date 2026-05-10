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
              prop="schoolIds"
              style="width: 49%"
              v-if="dictionary['school'].length > 1"
            >
              <el-select
                clearable
                collapse-tags
                style="width: 100%"
                v-model="ruleForm['schoolIds']"
                :placeholder="$t('common.请选择')"
                multiple
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in dictionary['school']"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.司机姓名')" prop="name" style="width: 49%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.name"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
                :disabled="modalType == 'look'"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.工号')"
              prop="employeeNo"
              style="width: 49%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.employeeNo"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.联系方式')"
              prop="contact"
              style="width: 49%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.contact"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.年龄')" prop="age" style="width: 49%">
              <el-input-number
                style="width: 100%"
                v-model="ruleForm.age"
                :precision="0"
                :step="1"
                :min="18"
                :max="80"
                :placeholder="$t('consult.请输入')"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.驾照类型')"
              prop="licenseType"
              style="width: 49%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.licenseType"
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
                  v-for="(i, k) in consts['serviceType']"
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
import {
  getBusdriverDetail,
  addBusdriver,
  editBusdriver,
} from "@/api/isacommunity/busdriver.js";
import consts from "@/const/isacommunity/consts.js";
export default {
  name: "operation",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      consts: consts,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        schoolIds: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        name: [{ required: true, message: that.$t("isagroup.请输入"), trigger: "blur" }],
        employeeNo: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        contact: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        age: [{ required: true, message: that.$t("isagroup.请输入"), trigger: "blur" }],
        licenseType: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        status: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      },
      schoolList: [],
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
            schoolIds: [schoolId],
          };
        }
      }
    },
    // 新增
    addData(data) {
      addBusdriver(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editBusdriver(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getBusdriverDetail(id).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let {
              schoolIds,
              name,
              employeeNo,
              contact,
              age,
              licenseType,
              status,
            } = res.data.data;
            this.ruleForm = {
              ...this.ruleForm,
              id,
              schoolIds,
              name,
              employeeNo,
              contact,
              age,
              licenseType,
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
          console.log("submitForm", valid, this.modalType);
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
