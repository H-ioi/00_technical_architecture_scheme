<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="showModal"
    width="720px"
    class="schoolbus-dialog"
    :before-close="closeModal"
    :close-on-click-modal="false"
  >
    <el-form
      v-if="showModal"
      ref="ruleForm"
      class="schoolbus-dialog-form"
      :label-position="'top'"
      :model="ruleForm"
      :rules="rules"
      v-loading="detailLoading"
    >
      <el-row :gutter="20">
        <el-col v-if="schoolSelectList.length > 1" :span="24">
          <el-form-item :label="$t('schoolbus.校区')" prop="schoolIds">
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
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.司机姓名')" prop="name">
            <el-input
              v-model="ruleForm.name"
              :placeholder="$t('consult.请输入')"
              maxlength="50"
              :disabled="modalType === 'look'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.工号')" prop="employeeNo">
            <el-input
              v-model="ruleForm.employeeNo"
              :placeholder="$t('consult.请输入')"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.联系方式')" prop="contact">
            <el-input
              v-model="ruleForm.contact"
              :placeholder="$t('consult.请输入')"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.年龄')" prop="age">
            <el-input-number
              style="width: 100%"
              v-model="ruleForm.age"
              :precision="0"
              :step="1"
              :min="18"
              :max="80"
              :placeholder="$t('consult.请输入')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.驾照类型')" prop="licenseType">
            <el-input
              v-model="ruleForm.licenseType"
              :placeholder="$t('consult.请输入')"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.状态')" prop="status">
            <el-select
              style="width: 100%"
              v-model="ruleForm.status"
              :placeholder="$t('common.请选择')"
            >
              <el-option
                v-for="(i, k) in serviceTypeOptions"
                :key="k"
                :label="$t('schoolbus.' + i.label)"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
import {
  getBusdriverDetail,
  addBusdriver,
  editBusdriver,
} from "@/api/isacommunity/busdriver.js";
import { BUS_SERVICE_TYPE } from "../../schoolbusConsts.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";

export default {
  name: "BusDriverForm",
  mixins: [schoolListBuscommonMixin],
  data() {
    const that = this;
    return {
      serviceTypeOptions: BUS_SERVICE_TYPE,
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
        name: [{ required: true, message: that.$t("schoolbus.请输入"), trigger: "blur" }],
        employeeNo: [
          { required: true, message: that.$t("schoolbus.请输入"), trigger: "blur" },
        ],
        contact: [
          { required: true, message: that.$t("schoolbus.请输入"), trigger: "blur" },
        ],
        age: [{ required: true, message: that.$t("schoolbus.请输入"), trigger: "blur" }],
        licenseType: [
          { required: true, message: that.$t("schoolbus.请输入"), trigger: "blur" },
        ],
        status: [
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
          await this.getDetail(item.id);
        } else if (this.schoolSelectList.length === 1) {
          const schoolId = this.schoolSelectList[0].id;
          this.ruleForm = { ...this.ruleForm, schoolIds: [schoolId] };
        }
      } finally {
        this.detailLoading = false;
      }
    },
    addData(data) {
      this.isSubmitting = true;
      addBusdriver(data)
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
      editBusdriver(data)
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
    async getDetail(id) {
      const res = await getBusdriverDetail(id);
      if (!res.data.success) return;
      const { schoolIds, name, employeeNo, contact, age, licenseType, status } =
        res.data.data;
      this.$nextTick(() => {
        this.ruleForm = {
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
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        const data = { ...this.ruleForm };
        if (this.modalType === "add") this.addData(data);
        else this.editData(data);
      });
    },
    closeModal() {
      this.showModal = false;
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
    },
  },
};
</script>
