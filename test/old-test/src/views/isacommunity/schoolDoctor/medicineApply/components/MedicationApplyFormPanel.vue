<template>
  <div class="apply-form-layout">
    <aside class="apply-form-left">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">{{ $t('schoolDoctor.学生基本信息') }}</span>
        </div>
        <p class="section-card__desc">{{ $t('schoolDoctor.学生基本信息说明') }}</p>
        <el-form label-position="top" class="student-select-form">
          <StudentRemoteSelect
            ref="studentSelect"
            field-type="medicineApply"
            :readonly="studentReadonly"
            :school-select-list="schoolSelectList"
            @select="$emit('student-select', $event)"
            @clear="$emit('student-clear')" />
        </el-form>
      </div>

      <div v-if="showApprovalSection" class="section-card approval-section-card">
        <div class="section-card__header">
          <span class="section-card__title has-icon">
            <i class="el-icon-s-check section-card__title-icon"></i>
            {{ $t('schoolDoctor.审批情况') }}
          </span>
        </div>
        <el-form label-position="top" class="approval-form">
          <el-form-item v-if="!approvalEditable" :label="$t('schoolDoctor.护士审批')">
            <el-input :value="formatNurseApproval(form.nurseApproval)" disabled />
          </el-form-item>
          <el-form-item :label="$t('schoolDoctor.操作护士')">
            <el-input v-model="form.nurseOperator" disabled />
          </el-form-item>
          <el-form-item :label="$t('schoolDoctor.审批意见')">
            <el-input v-model="form.remark" type="textarea" :rows="4" :disabled="!approvalEditable" :placeholder="$t('schoolDoctor.请输入审批意见')" />
          </el-form-item>
          <p v-if="approvalEditable" class="approval-action-tip">{{ $t('schoolDoctor.审批操作提示') }}</p>
        </el-form>
      </div>
    </aside>

    <main class="apply-form-right">
      <el-form class="apply-form" :label-position="'top'" :model="form" :rules="rules" ref="ruleForm">
        <div class="section-card">
          <div class="section-card__header">
            <span class="section-card__title has-icon">
              <i class="el-icon-user section-card__title-icon"></i>
              {{ $t('schoolDoctor.身体情况') }}
            </span>
          </div>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.身体症状')">
                <el-select v-model="form.diseaseId" style="width: 100%" clearable filterable :disabled="formReadonly" :placeholder="$t('schoolDoctor.请选择')">
                  <el-option v-for="item in symptomOptions" :key="item.id" :label="item.cnName + ' / ' + item.enName" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.是否需要用药')" prop="applyMedication">
                <el-select
                  v-model="form.applyMedication"
                  style="width: 100%"
                  clearable
                  :disabled="formReadonly"
                  :placeholder="$t('schoolDoctor.请选择是否需要用药')">
                  <el-option v-for="opt in needMedicationOptions" :key="opt.value" :label="$t(`schoolDoctor.${opt.labelKey}`)" :value="opt.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('schoolDoctor.症状详情')">
                <el-input
                  v-model="form.symptomDetails"
                  type="textarea"
                  :rows="3"
                  :disabled="formReadonly"
                  :placeholder="$t('schoolDoctor.请输入疾病相关说明')" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <MedicationApplyAuthSection
          v-if="form.applyMedication === 1"
          :form="form"
          :readonly="formReadonly"
          :uploading="uploading"
          @diagnosis-upload="(opt) => $emit('diagnosis-upload', opt)"
          @before-image="(file) => $emit('before-image', file)"
          @remove-diagnosis-image="(file) => $emit('remove-diagnosis-image', file)"
          @preview-diagnosis-image="(file) => $emit('preview-diagnosis-image', file)" />

        <MedicationApplyParentSection
          :form="form"
          :readonly="formReadonly"
          :modal-type="modalType"
          :parent-sign-mode.sync="parentSignModeSync"
          :signature-uploading="signatureUploading"
          @open-signature="$emit('open-signature')"
          @signature-upload="(opt) => $emit('signature-upload', opt)"
          @before-image="(file) => $emit('before-image', file)"
          @clear-signature="$emit('clear-signature')" />

        <div v-if="modalType === 'look'" class="section-card">
          <div class="section-card__header">
            <span class="section-card__title has-icon">
              <i class="el-icon-tickets section-card__title-icon"></i>
              {{ $t('schoolDoctor.用药详情') }}
            </span>
          </div>
          <el-table
            class="medication-detail-table"
            :data="visitRecordList"
            border
            size="small"
            v-loading="visitLoading"
            style="width: 100%">
            <el-table-column :label="$t('schoolDoctor.日期')" prop="visitDate" width="108" class-name="col-nowrap" />
            <el-table-column
              :label="$t('schoolDoctor.操作时间')"
              prop="visitTime"
              width="168"
              class-name="col-nowrap"
              show-overflow-tooltip />
            <el-table-column :label="$t('schoolDoctor.操作状态')" prop="operateStatusText" width="88" align="center" />
            <el-table-column
              :label="$t('schoolDoctor.具体情况')"
              prop="specificSituation"
              min-width="140"
              show-overflow-tooltip />
            <el-table-column :label="$t('schoolDoctor.操作人')" prop="operatorName" width="96" show-overflow-tooltip />
            <el-table-column
              :label="$t('schoolDoctor.离开时间')"
              prop="leaveTime"
              width="168"
              class-name="col-nowrap"
              show-overflow-tooltip />
            <el-table-column :label="$t('schoolDoctor.离开去向')" prop="leaveDestinationText" width="88" align="center" />
            <el-table-column :label="$t('btn.操作')" width="72" fixed="right" align="center">
              <template slot-scope="{ row }">
                <el-button type="text" @click="$emit('open-visit-detail', row)">{{ $t('btn.查看') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="!visitLoading && !visitRecordList.length" :description="$t('schoolDoctor.暂无数据')" />
        </div>
      </el-form>
    </main>
  </div>
</template>

<script>
import StudentRemoteSelect from '../../components/StudentRemoteSelect.vue'
import MedicationApplyAuthSection from './MedicationApplyAuthSection.vue'
import MedicationApplyParentSection from './MedicationApplyParentSection.vue'

export default {
  name: 'MedicationApplyFormPanel',
  components: { StudentRemoteSelect, MedicationApplyAuthSection, MedicationApplyParentSection },
  props: {
    form: { type: Object, required: true },
    rules: { type: Object, default: () => ({}) },
    modalType: { type: String, default: 'look' },
    formReadonly: { type: Boolean, default: false },
    studentReadonly: { type: Boolean, default: false },
    approvalEditable: { type: Boolean, default: false },
    showApprovalSection: { type: Boolean, default: false },
    schoolSelectList: { type: Array, default: () => [] },
    symptomOptions: { type: Array, default: () => [] },
    needMedicationOptions: { type: Array, default: () => [] },
    nurseApprovalOptions: { type: Array, default: () => [] },
    visitRecordList: { type: Array, default: () => [] },
    visitLoading: { type: Boolean, default: false },
    uploading: { type: Boolean, default: false },
    signatureUploading: { type: Boolean, default: false },
    parentSignMode: { type: String, default: 'draw' }
  },
  computed: {
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
    },
    formatNurseApproval(value) {
      const item = this.nurseApprovalOptions.find((opt) => opt.value === value)
      return item ? this.$t(`schoolDoctor.${item.labelKey}`) : '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.apply-form-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  min-height: calc(100vh - 140px);
  padding: 20px;
  background: #f5f7fa;
}

.apply-form-left {
  flex: 0 0 320px;
  width: 320px;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.approval-section-card {
  margin-bottom: 0;
}

.apply-form-right {
  flex: 1;
  min-width: 0;
}

.apply-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  ::v-deep .el-form-item__label {
    padding-bottom: 6px;
    line-height: 1.4;
    color: #606266;
  }
}

.section-card {
  margin-bottom: 0;
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(31, 45, 61, 0.04);
}

.section-card__header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
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

  &.has-icon {
    display: inline-flex;
    align-items: center;
    padding-left: 0;

    &::before {
      display: none;
    }
  }
}

.section-card__title-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #ba8e62;
}

.section-card__desc {
  margin: 0 0 12px;
  font-size: 12px;
  line-height: 1.5;
  color: #909399;
}

.student-select-form {
  ::v-deep .el-form-item {
    margin-bottom: 12px;
  }
}

.approval-form {
  ::v-deep .el-form-item {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ::v-deep .el-form-item__label {
    padding-bottom: 6px;
    line-height: 1.4;
    color: #606266;
  }
}

.approval-action-tip {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #909399;
}

::v-deep .student-remote-select .student-card {
  margin-bottom: 0;
  box-shadow: none;
}

.medication-detail-table {
  ::v-deep th > .cell,
  ::v-deep td > .cell {
    padding-left: 8px;
    padding-right: 8px;
  }

  ::v-deep .col-nowrap .cell {
    white-space: nowrap;
  }

  ::v-deep .el-button--text {
    padding: 0;
  }
}
</style>
