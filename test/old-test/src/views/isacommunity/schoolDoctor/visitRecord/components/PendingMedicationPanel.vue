<template>
  <div class="pending-form-layout">
    <aside class="pending-form-left">
      <div class="section-card student-section">
        <div class="section-card__header">
          <span class="section-card__title">{{ $t('schoolDoctor.学生信息') }}</span>
        </div>
        <StudentRemoteSelect ref="studentSelect" field-type="visitRecord" readonly :school-select-list="schoolSelectList" />
      </div>

      <div class="section-card" :class="{ 'allergy-card--warn': allergyList.length }">
        <div class="section-card__header">
          <span class="section-card__title has-icon">
            <i class="el-icon-warning-outline section-card__title-icon"></i>
            {{ $t('schoolDoctor.过敏警示') }}
          </span>
        </div>
        <div v-if="allergyList.length" class="allergy-list">
          <div v-for="(item, index) in allergyList" :key="index" class="allergy-list__item" :class="{ 'is-warn': item.warn }">
            <span class="allergy-list__label">{{ item.label }}</span>
            <span class="allergy-list__value">{{ item.value }}</span>
          </div>
        </div>
        <div v-else class="empty-tip">{{ $t('schoolDoctor.暂无过敏信息') }}</div>
      </div>

      <PendingMedicationGuide v-if="showOperationForm && !operationReadonly" />
    </aside>

    <main class="pending-form-right">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title has-icon">
            <i class="el-icon-document section-card__title-icon"></i>
            {{ $t('schoolDoctor.申请情况') }}
          </span>
        </div>
        <el-row :gutter="16">
          <el-col :span="12">
            <div class="field-item">
              <div class="field-item__label">{{ $t('schoolDoctor.症状详情') }}</div>
              <div class="field-item__value">{{ application.symptomDetails || '-' }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="field-item">
              <div class="field-item__label">{{ $t('schoolDoctor.申请者') }}</div>
              <div class="field-item__value">{{ application.applicant || '-' }}</div>
            </div>
          </el-col>
          <el-col v-if="application.remark" :span="24">
            <div class="field-item">
              <div class="field-item__label">{{ $t('schoolDoctor.备注') }}</div>
              <div class="field-item__value">{{ application.remark }}</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title has-icon">
            <i class="el-icon-first-aid-kit section-card__title-icon"></i>
            {{ $t('schoolDoctor.用药内容') }}
          </span>
          <span v-if="medicationList.length" class="section-card__subtitle">{{ medicationCountText }}</span>
        </div>
        <template v-if="medicationList.length">
          <PendingMedicationContentCard v-for="(item, index) in medicationList" :key="item.id || index" :content="item" :index="index" />
        </template>
        <el-empty v-else :description="$t('schoolDoctor.暂无用药内容')" :image-size="72" />
        <div v-if="leftoverDisposalText" class="leftover-disposal-field">
          <div class="field-item">
            <div class="field-item__label">{{ $t('schoolDoctor.剩余药物处理') }}</div>
            <div class="field-item__value">{{ leftoverDisposalText }}</div>
          </div>
        </div>
      </div>

      <div v-if="diagnosisImages.length" class="section-card">
        <div class="section-card__header">
          <span class="section-card__title has-icon">
            <i class="el-icon-picture-outline section-card__title-icon"></i>
            {{ $t('schoolDoctor.诊断及药物使用说明') }}
          </span>
        </div>
        <div class="diagnosis-gallery">
          <el-image
            v-for="(img, index) in diagnosisImages"
            :key="img.id || img.imagePath || index"
            class="diagnosis-gallery__item"
            :src="img.imagePath"
            fit="cover"
            :preview-src-list="diagnosisPreviewList" />
        </div>
      </div>

      <div v-if="showOperationForm" class="section-card">
        <div class="section-card__header">
          <span class="section-card__title has-icon">
            <i class="el-icon-edit-outline section-card__title-icon"></i>
            {{ $t('schoolDoctor.操作信息') }}
          </span>
          <span class="section-card__subtitle">{{ $t('schoolDoctor.本次给药操作') }}</span>
        </div>
        <PendingOperationForm ref="operationForm" :operation-form="operationForm" :readonly="operationReadonly" />
      </div>

      <div v-if="showOperationRecords" class="section-card">
        <div class="section-card__header">
          <span class="section-card__title has-icon">
            <i class="el-icon-tickets section-card__title-icon"></i>
            {{ $t('schoolDoctor.操作记录') }}
          </span>
        </div>
        <el-table v-if="operationRecords.length" :data="operationRecords" border size="small">
          <el-table-column :label="$t('schoolDoctor.日期')" prop="operateDate" width="150" />
          <el-table-column :label="$t('schoolDoctor.操作时间')" prop="operateTime" width="150" />
          <el-table-column :label="$t('schoolDoctor.操作状态')" prop="operateStatusText" width="90" />
          <el-table-column :label="$t('schoolDoctor.具体情况')" prop="specificSituation" min-width="140" show-overflow-tooltip />
          <el-table-column :label="$t('schoolDoctor.操作人')" prop="operatorName" width="100" />
          <el-table-column :label="$t('schoolDoctor.离开时间')" prop="leaveTime" width="150" />
          <el-table-column :label="$t('schoolDoctor.离开去向')" prop="leaveDestinationText" width="90" />
          <el-table-column :label="$t('schoolDoctor.附件')" min-width="240">
            <template slot-scope="{ row }">
              <div v-if="row.attachmentList && row.attachmentList.length" class="record-attachment-list">
                <el-link
                  v-for="(file, index) in row.attachmentList"
                  :key="file.attachmentUrl || file.url || index"
                  type="primary"
                  :href="file.attachmentUrl || file.url"
                  target="_blank">
                  {{ file.name || `${$t('schoolDoctor.查看附件')}${index + 1}` }}
                </el-link>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('btn.操作')" width="100" fixed="right">
            <template slot-scope="{ row }">
              <el-button type="text" @click="$emit('view-operation', row)">{{ $t('btn.查看') }}</el-button>
              <el-button v-if="canEditOperation" type="text" @click="$emit('edit-operation', row)">{{ $t('btn.编辑') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="!operationRecords.length" :description="$t('schoolDoctor.暂无数据')" :image-size="72" />
      </div>
    </main>
  </div>
</template>

<script>
import StudentRemoteSelect from '../../components/StudentRemoteSelect.vue'
import { formatOptionValue, LEFTOVER_DISPOSAL_OPTIONS } from '../../medicineApply/utils/medicationApplyOptions.js'
import {
  buildAllergyDisplayList,
  buildPendingStudentDisplayForm,
  formatLeaveDestination,
  formatOperateStatus,
  getPendingApplication,
  getPendingDiagnosisImages,
  getPendingMedicationContentList,
  getPendingStudentMedical,
  mapOperationRecordRow
} from '../utils/visitRecordOptions.js'
import PendingMedicationContentCard from './PendingMedicationContentCard.vue'
import PendingMedicationGuide from './PendingMedicationGuide.vue'
import PendingOperationForm from './PendingOperationForm.vue'

export default {
  name: 'PendingMedicationPanel',
  components: { StudentRemoteSelect, PendingMedicationContentCard, PendingMedicationGuide, PendingOperationForm },
  props: {
    detail: { type: Object, default: () => ({}) },
    operationForm: { type: Object, default: () => ({}) },
    showOperationForm: { type: Boolean, default: false },
    showOperationRecords: { type: Boolean, default: false },
    operationReadonly: { type: Boolean, default: false },
    canEditOperation: { type: Boolean, default: true },
    schoolSelectList: { type: Array, default: () => [] }
  },
  data() {
    return {}
  },
  computed: {
    application() {
      return getPendingApplication(this.detail)
    },
    studentMedical() {
      return getPendingStudentMedical(this.detail)
    },
    medicationList() {
      return getPendingMedicationContentList(this.detail)
    },
    diagnosisImages() {
      return getPendingDiagnosisImages(this.detail)
    },
    diagnosisPreviewList() {
      return this.diagnosisImages.map((item) => item.imagePath).filter(Boolean)
    },
    allergyList() {
      return buildAllergyDisplayList(this.studentMedical, (key) => this.$t(key))
    },
    studentDisplayForm() {
      return buildPendingStudentDisplayForm(this.detail)
    },
    medicationCountText() {
      return this.$t('schoolDoctor.共几种药物').replace('{count}', this.medicationList.length)
    },
    leftoverDisposalText() {
      const legacyValue = this.medicationList[0] && this.medicationList[0].leftoverDisposal
      const resolved = this.application.leftoverDisposal != null ? this.application.leftoverDisposal : legacyValue
      if (resolved === undefined || resolved === null || resolved === '') return ''
      return formatOptionValue(LEFTOVER_DISPOSAL_OPTIONS, resolved, (key) => this.$t(key))
    },
    operationRecords() {
      const list = this.detail.operationList || this.detail.operationRecordList || []
      return list.map((item) => {
        const row = mapOperationRecordRow(item)
        row.operateStatusText = formatOperateStatus(row.operateStatus, (key) => this.$t(key))
        row.leaveDestinationText = formatLeaveDestination(row.leaveDestination, (key) => this.$t(key))
        return row
      })
    }
  },
  watch: {
    studentDisplayForm: {
      immediate: true,
      handler(form) {
        this.$nextTick(() => this.setStudentDisplay(form))
      }
    }
  },
  methods: {
    setStudentDisplay(form) {
      if (!this.$refs.studentSelect) return
      if (form && (form.admissionNo || form.fullName)) {
        this.$refs.studentSelect.setDisplayFromForm(form)
        return
      }
      this.$refs.studentSelect.reset()
    },
    validateOperationForm() {
      if (!this.$refs.operationForm) return Promise.resolve(true)
      return this.$refs.operationForm.validateOperationForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.pending-form-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  min-height: calc(100vh - 140px);
  padding: 0 4px 16px;
  background: #f5f7fa;
  padding: 20px;
}

.pending-form-left {
  flex: 0 0 320px;
  width: 320px;
}

.pending-form-right {
  flex: 1;
  min-width: 0;
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
    padding-left: 0;

    &::before {
      display: none;
    }
  }
}

.section-card__title-icon {
  margin-right: 6px;
  color: #ba8e62;
}

.section-card__subtitle {
  font-size: 12px;
  color: #909399;
}

.allergy-card--warn {
  border-color: #fde2e2;
  background: #fffafa;
}

.student-section {
  ::v-deep .student-remote-select .student-card {
    margin-bottom: 0;
    padding: 0;
    border: none;
    box-shadow: none;
    background: transparent;
  }
}

.allergy-list__item {
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: #f5f7fa;

  &:last-child {
    margin-bottom: 0;
  }

  &.is-warn {
    background: #fef0f0;
    border: 1px solid #fde2e2;
  }
}

.allergy-list__label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #909399;
}

.allergy-list__value {
  font-size: 13px;
  line-height: 1.6;
  color: #303133;
}

.empty-tip {
  font-size: 13px;
  color: #909399;
}

.leftover-disposal-field {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f2f5;
}

.field-item {
  margin-bottom: 12px;
}

.field-item__label {
  margin-bottom: 4px;
  font-size: 12px;
  color: #909399;
}

.field-item__value {
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
  word-break: break-word;
}

.diagnosis-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.diagnosis-gallery__item {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  cursor: pointer;
}

.record-attachment-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

/deep/ .el-button {
  min-width: 0 !important;
}
</style>
