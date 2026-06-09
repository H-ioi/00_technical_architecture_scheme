<template>
  <div class="medical-form-layout">
    <aside class="medical-form-left">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">{{ $t('schoolDoctor.学生基本信息') }}</span>
        </div>
        <p class="section-card__desc">{{ $t('schoolDoctor.学生基本信息说明') }}</p>
        <el-form label-position="top" class="student-select-form">
          <StudentRemoteSelect
            ref="studentSelect"
            field-type="medicalInfo"
            :readonly="readonly"
            :school-select-list="schoolSelectList"
            @select="$emit('student-select', $event)"
            @clear="$emit('student-clear')" />
        </el-form>
      </div>
    </aside>

    <main class="medical-form-right">
      <el-form class="medical-form" :label-position="'top'" :model="form" :rules="rules" ref="ruleForm">
        <MedicalInfoHealthSection :form="form" :readonly="readonly" :health-fields="healthFields" :allergy-fields="allergyFields" />

        <MedicalInfoDiseaseSection
          :disease-list="form.diseaseList"
          :disease-options="diseaseOptions"
          :disease-rules="diseaseRules"
          :readonly="readonly"
          :is-other-disease="isOtherDisease"
          @add="$emit('add-disease')"
          @remove="$emit('remove-disease', $event)"
          @disease-change="$emit('disease-change', $event)" />

        <MedicalInfoAttachmentSection
          :attachment-list="form.attachmentList"
          :file-groups="fileGroups"
          :special-proof-remark.sync="specialProofRemarkSync"
          :parent-sign-mode.sync="parentSignModeSync"
          :parent-signature-url="parentSignatureUrl"
          :readonly="readonly"
          :uploading="uploading"
          :get-upload-accept="getUploadAccept"
          @upload="(opt, type) => $emit('upload', opt, type)"
          @before-upload="(file, type) => $emit('before-upload', file, type)"
          @remove-attachment="(type, index) => $emit('remove-attachment', type, index)"
          @open-signature="$emit('open-signature')"
          @clear-signature="$emit('clear-signature')"
          @upload-sign="(opt) => $emit('upload-sign', opt)"
          @before-image="(file) => $emit('before-image', file)" />
      </el-form>
    </main>
  </div>
</template>

<script>
import StudentRemoteSelect from '../../components/StudentRemoteSelect.vue'
import MedicalInfoAttachmentSection from './MedicalInfoAttachmentSection.vue'
import MedicalInfoDiseaseSection from './MedicalInfoDiseaseSection.vue'
import MedicalInfoHealthSection from './MedicalInfoHealthSection.vue'

export default {
  name: 'MedicalInfoFormPanel',
  components: {
    StudentRemoteSelect,
    MedicalInfoHealthSection,
    MedicalInfoDiseaseSection,
    MedicalInfoAttachmentSection
  },
  props: {
    form: { type: Object, required: true },
    rules: { type: Object, default: () => ({}) },
    diseaseRules: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: false },
    schoolSelectList: { type: Array, default: () => [] },
    diseaseOptions: { type: Array, default: () => [] },
    healthFields: { type: Array, default: () => [] },
    allergyFields: { type: Array, default: () => [] },
    fileGroups: { type: Array, default: () => [] },
    specialProofRemark: { type: String, default: '' },
    parentSignMode: { type: String, default: 'draw' },
    parentSignatureUrl: { type: String, default: '' },
    uploading: { type: Boolean, default: false },
    getUploadAccept: { type: Function, required: true },
    isOtherDisease: { type: Function, required: true }
  },
  computed: {
    specialProofRemarkSync: {
      get() {
        return this.specialProofRemark
      },
      set(val) {
        this.$emit('update:specialProofRemark', val)
      }
    },
    parentSignModeSync: {
      get() {
        return this.parentSignMode
      },
      set(val) {
        this.$emit('update:parentSignMode', val)
      }
    }
  },
  methods: {
    validateForm() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate((valid) => resolve(valid))
      })
    },
    resetStudentSelect() {
      if (this.$refs.studentSelect) this.$refs.studentSelect.reset()
    },
    setDisplayFromForm(form) {
      if (this.$refs.studentSelect) this.$refs.studentSelect.setDisplayFromForm(form)
    }
  }
}
</script>

<style lang="scss" scoped>
.medical-form-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  min-height: calc(100vh - 140px);
  padding: 20px;
  background: #f5f7fa;
}

.medical-form-left {
  flex: 0 0 320px;
  width: 320px;
}

.medical-form-right {
  flex: 1;
  min-width: 0;
}

.student-select-form {
  ::v-deep .el-form-item {
    margin-bottom: 12px;
  }
}

.section-card {
  margin-bottom: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(31, 45, 61, 0.04);
}

.section-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-card__title {
  position: relative;
  padding-left: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    width: 4px;
    height: 16px;
    border-radius: 2px;
    background: #ba8e62;
  }
}

.section-card__desc {
  margin: 0 0 12px;
  font-size: 12px;
  line-height: 1.5;
  color: #909399;
}

.medical-form {
  ::v-deep .el-form-item__label {
    padding-bottom: 6px;
    line-height: 1.4;
    color: #606266;
  }
}

::v-deep .student-remote-select .student-card {
  margin-bottom: 0;
  box-shadow: none;
}
</style>
