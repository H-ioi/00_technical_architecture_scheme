<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="500px"
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
              style="width: 100%"
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
            <el-form-item
              :label="$t('isagroup.中文名')"
              prop="cnName"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.cnName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
                :disabled="modalType == 'look'"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文名')"
              prop="enName"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.enName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('isagroup.申请时间')"
              prop="intentDate"
              style="width: 100%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.intentDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.服务时间')"
              prop="serviceDate"
              style="width: 100%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.serviceDate"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
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
import { getTermDetail, addTerm, editTerm } from "@/api/isacommunity/term.js";
export default {
  name: "operation",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        schoolIds: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        cnName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        enName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        intentDate: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        serviceDate: [
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
    showForm(type = "add", item = {}) {
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.$nextTick(() => {
          this.ruleForm = {
            id: item.id,
            schoolIds: item.schoolIds,
            cnName: item.cnName,
            enName: item.enName,
            intentDate: [item.intentStartDate, item.intentEndDate],
            serviceDate: [item.serviceStartDate, item.serviceEndDate],
          };
          console.log(" this.ruleForm", this.ruleForm);
        });
      } else {
        if (this.dictionary["school"].length == 1) {
          let schoolId = this.dictionary["school"][0].id;
          this.ruleForm = {
            ...this.ruleForm,
            schoolIds: schoolId,
          };
        }
      }
    },
    // 新增
    addData(data) {
      addTerm(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editTerm(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("submitForm", valid, this.modalType);
          let data = {
            schoolIds: this.ruleForm.schoolIds,
            cnName: this.ruleForm.cnName,
            enName: this.ruleForm.enName,
            intentStartDate: this.ruleForm.intentDate[0],
            intentEndDate: this.ruleForm.intentDate[1],
            serviceStartDate: this.ruleForm.serviceDate[0],
            serviceEndDate: this.ruleForm.serviceDate[1],
          };

          if (this.modalType == "add") {
            this.addData(data);
          } else {
            data["id"] = this.ruleForm.id;
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
