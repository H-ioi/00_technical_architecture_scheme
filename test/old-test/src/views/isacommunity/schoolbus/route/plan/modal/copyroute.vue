<template>
  <el-dialog
    :title="$t('schoolbus.复制路线')"
    :visible.sync="showModal"
    width="560px"
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
    >
      <el-form-item :label="$t('schoolbus.校区')" prop="schoolId">
        <el-select
          multiple
          collapse-tags
          style="width: 100%"
          v-model="ruleForm.schoolId"
          :placeholder="$t('common.请选择')"
          @change="changeSchool"
        >
          <el-option
            v-for="(i, k) in schoolSelectList"
            :key="k"
            :label="schoolDropdownLabel(i)"
            :value="i.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('schoolbus.学期')" prop="sectionId">
        <el-select
          style="width: 100%"
          v-model="ruleForm.sectionId"
          :placeholder="$t('schoolbus.请选择')"
        >
          <el-option
            v-for="(i, k) in selectSectionList"
            :key="k"
            :label="i18nlocel === 'en' ? i.enName : i.cnName"
            :value="i.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeModal">{{ $t("btn.取消") }}</el-button>
      <el-button type="primary" :loading="isSubmitting" @click="submitForm('ruleForm')">
        {{ $t("consult.保存") }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { batchCopy } from "@/api/isacommunity/route.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";

export default {
  name: "BusCopyRoute",
  mixins: [schoolListBuscommonMixin],
  props: {
    sectionList: { type: Array, default: () => [] },
  },
  data() {
    const that = this;
    return {
      showModal: false,
      isSubmitting: false,
      ruleForm: {},
      rules: {
        schoolId: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "change" },
        ],
        sectionId: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "change" },
        ],
      },
      selectSectionList: [],
      selectionId: [],
    };
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    async show(selectionId) {
      await this.fetchSchoolListBuscommon();
      this.selectionId = selectionId;
      this.showModal = true;
    },
    batchCopy(data) {
      this.isSubmitting = true;
      batchCopy(data)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolbus.成功"));
            this.$emit("getList");
            this.closeModal();
          } else {
            this.$message.error(res.data.msg || this.$t("schoolbus.失败"));
          }
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        this.batchCopy({
          ids: this.selectionId,
          schoolIds: this.ruleForm.schoolId,
          sectionId: this.ruleForm.sectionId,
        });
      });
    },
    closeModal() {
      this.showModal = false;
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
    },
    changeSchool(e) {
      const selectedSchoolIds = new Set(e);
      this.selectSectionList = this.sectionList.filter((item) => {
        if (Array.isArray(item.schoolIds)) {
          return item.schoolIds.some((id) => selectedSchoolIds.has(id));
        }
        return selectedSchoolIds.has(item.schoolIds);
      });
    },
  },
};
</script>
