<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="showModal"
    width="560px"
    class="schoolbus-dialog"
    :before-close="closeModal"
    :close-on-click-modal="false"
  >
    <el-form
      v-if="showModal"
      v-loading="detailLoading"
      ref="ruleForm"
      class="schoolbus-dialog-form"
      :label-position="'top'"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item v-if="schoolSelectList.length > 1" :label="$t('schoolbus.校区')" prop="schoolIds">
        <el-select
          clearable
          collapse-tags
          style="width: 100%"
          v-model="ruleForm.schoolIds"
          :placeholder="$t('common.请选择')"
          multiple
        >
          <el-option
            v-for="(i, k) in schoolSelectList"
            :key="k"
            :label="schoolDropdownLabel(i)"
            :value="i.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('schoolbus.中文名')" prop="cnName">
        <el-input
          v-model="ruleForm.cnName"
          :placeholder="$t('consult.请输入')"
          maxlength="50"
          :disabled="modalType === 'look'"
        />
      </el-form-item>
      <el-form-item :label="$t('schoolbus.英文名')" prop="enName">
        <el-input v-model="ruleForm.enName" :placeholder="$t('consult.请输入')" maxlength="50" />
      </el-form-item>
      <el-form-item :label="$t('schoolbus.申请时间')" prop="intentDate">
        <el-date-picker
          style="width: 100%"
          v-model="ruleForm.intentDate"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item :label="$t('schoolbus.服务时间')" prop="serviceDate">
        <el-date-picker
          style="width: 100%"
          v-model="ruleForm.serviceDate"
          type="datetimerange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeModal">{{ $t("btn.取消") }}</el-button>
      <el-button type="primary" :loading="isSubmitting" @click="submitForm('ruleForm')">
        {{ $t("schoolbus.确认") }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { addTerm, editTerm } from "@/api/isacommunity/term.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";

export default {
  name: "BusTermForm",
  mixins: [schoolListBuscommonMixin],
  data() {
    const that = this;
    return {
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      detailLoading: false,
      isSubmitting: false,
      ruleForm: {},
      rules: {
        schoolIds: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "change" },
        ],
        cnName: [
          { required: true, message: that.$t("schoolbus.请输入"), trigger: "blur" },
        ],
        enName: [
          { required: true, message: that.$t("schoolbus.请输入"), trigger: "blur" },
        ],
        intentDate: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "change" },
        ],
        serviceDate: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "change" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
    dialogTitle() {
      const key = this.typeObj[this.modalType] || "新增";
      return this.$t('schoolbus')[key];
    },
  },
  methods: {
    async showForm(type = "add", item = {}) {
      await this.fetchSchoolListBuscommon();
      this.modalType = type;
      this.showModal = true;
      this.detailLoading = type !== "add";
      try {
        if (type !== "add") {
          await this.$nextTick();
          this.ruleForm = {
            id: item.id,
            schoolIds: item.schoolIds,
            cnName: item.cnName,
            enName: item.enName,
            intentDate: [item.intentStartDate, item.intentEndDate],
            serviceDate: [item.serviceStartDate, item.serviceEndDate],
          };
        } else if (this.schoolSelectList.length === 1) {
          this.ruleForm = { schoolIds: this.schoolSelectList[0].id };
        }
      } finally {
        this.detailLoading = false;
      }
    },
    addData(data) {
      this.isSubmitting = true;
      addTerm(data)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolbus.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    editData(data) {
      this.isSubmitting = true;
      editTerm(data)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolbus.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        const data = {
          schoolIds: this.ruleForm.schoolIds,
          cnName: this.ruleForm.cnName,
          enName: this.ruleForm.enName,
          intentStartDate: this.ruleForm.intentDate[0],
          intentEndDate: this.ruleForm.intentDate[1],
          serviceStartDate: this.ruleForm.serviceDate[0],
          serviceEndDate: this.ruleForm.serviceDate[1],
        };
        if (this.modalType === "add") this.addData(data);
        else {
          data.id = this.ruleForm.id;
          this.editData(data);
        }
      });
    },
    closeModal() {
      this.showModal = false;
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
    },
  },
};
</script>
