<template>
  <div class="visit-form-layout">
    <aside class="visit-form-left">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">{{ $t('schoolDoctor.学生信息') }}</span>
        </div>
        <el-form label-position="top" class="student-select-form">
          <StudentRemoteSelect
            ref="studentSelect"
            field-type="visitRecord"
            :readonly="isLookMode || isLimitedEdit"
            :school-select-list="schoolSelectList"
            @select="$emit('student-select', $event)"
            @clear="$emit('student-clear')" />
        </el-form>
      </div>

      <VisitFormGuide />
    </aside>

    <main class="visit-form-right">
      <el-form class="visit-form" :label-position="'top'" :model="form" :rules="rules" ref="visitForm" :disabled="isLookMode">
        <div class="section-card">
          <div class="section-card__header">
            <span class="section-card__title has-icon">
              <i class="el-icon-document section-card__title-icon"></i>
              {{ $t('schoolDoctor.操作信息') }}
            </span>
            <span class="section-card__subtitle">{{ $t('schoolDoctor.门诊详情录入') }}</span>
          </div>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item prop="visitTime">
                <span slot="label" class="field-label">
                  {{ $t('schoolDoctor.到访时间') }}
                </span>
                <div class="datetime-field">
                  <el-date-picker
                    v-model="form.visitTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    prefix-icon="el-icon-time"
                    :placeholder="$t('schoolDoctor.请选择到访时间')"
                    :disabled="isOperationDisabled"
                    style="width: 100%" />
                  <el-button v-if="!isOperationDisabled" type="text" class="now-btn" @click="setNow('visitTime')">
                    {{ $t('schoolDoctor.此时') }}
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.离开时间')">
                <div class="datetime-field">
                  <el-date-picker
                    v-model="form.leaveTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    prefix-icon="el-icon-time"
                    :placeholder="$t('schoolDoctor.请选择离开时间')"
                    :disabled="isLookMode"
                    style="width: 100%" />
                  <el-button v-if="!isLookMode" type="text" class="now-btn" @click="setNow('leaveTime')">
                    {{ $t('schoolDoctor.此时') }}
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label="$t('schoolDoctor.主诉')">
            <el-input
              v-model="form.chiefComplaint"
              type="textarea"
              :rows="3"
              :disabled="isOperationDisabled"
              :placeholder="$t('schoolDoctor.请输入主诉内容')" />
          </el-form-item>
          <el-form-item :label="$t('schoolDoctor.查体')">
            <el-input v-model="form.physicalExam" type="textarea" :rows="3" :disabled="isOperationDisabled" :placeholder="$t('schoolDoctor.请输入查体描述')" />
          </el-form-item>
          <el-form-item :label="$t('schoolDoctor.诊断及建议')">
            <el-input
              v-model="form.diagnosisAdvice"
              type="textarea"
              :rows="3"
              :disabled="isOperationDisabled"
              :placeholder="$t('schoolDoctor.请输入诊断及建议')" />
          </el-form-item>
          <el-form-item :label="$t('schoolDoctor.备注')">
            <el-input v-model="form.remark" type="textarea" :rows="2" :disabled="isOperationDisabled" :placeholder="$t('schoolDoctor.请输入备注补充')" />
          </el-form-item>

          <el-form-item>
            <span slot="label" class="field-label field-label--between">
              <span>{{ $t('schoolDoctor.附件上传') }}</span>
              <span class="field-tip">{{ $t('schoolDoctor.附件上传格式提示') }}</span>
            </span>
            <div v-if="form.attachmentList.length" class="attachment-list">
              <div v-for="(file, index) in form.attachmentList" :key="file.url || index" class="attachment-item">
                <el-link type="primary" :href="file.url" target="_blank">{{ file.name || `${$t('schoolDoctor.查看附件')}${index + 1}` }}</el-link>
                <i v-if="!isOperationDisabled" class="el-icon-close delete-btn" @click="removeAttachment(index)" />
              </div>
            </div>
            <el-upload
              v-if="!isOperationDisabled"
              class="upload-drag"
              drag
              action="#"
              :show-file-list="false"
              :http-request="handleUpload"
              :before-upload="beforeAttachmentUpload"
              accept=".pdf,.png,.jpg,.jpeg,.docx,application/pdf,image/png,image/jpeg">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{ $t('schoolDoctor.点击上传或拖拽文件') }}</div>
            </el-upload>
          </el-form-item>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.离开去向')">
                <el-select
                  v-model="form.leaveDestination"
                  clearable
                  style="width: 100%"
                  :disabled="isOperationDisabled"
                  :placeholder="$t('schoolDoctor.请选择去向')">
                  <el-option v-for="item in leaveOptions" :key="item.value" :label="$t(`schoolDoctor.${item.labelKey}`)" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.操作人')">
                <el-input v-model="form.operator" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.通知家长')">
                <el-radio-group v-model="form.notifyParent" :disabled="isOperationDisabled">
                  <el-radio :label="1">{{ $t('schoolDoctor.是') }}</el-radio>
                  <el-radio :label="0">{{ $t('schoolDoctor.否') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.是否执行操作')">
                <el-radio-group v-model="form.executeOperation" :disabled="isLookMode">
                  <el-radio :label="1">{{ $t('schoolDoctor.是') }}</el-radio>
                  <el-radio :label="0">{{ $t('schoolDoctor.否') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <el-form class="visit-form parent-receipt-form" :label-position="'top'" :model="form">
        <div class="section-card">
          <div class="section-card__header">
            <span class="section-card__title has-icon">
              <i class="el-icon-tickets section-card__title-icon"></i>
              {{ $t('schoolDoctor.家长回执') }}
            </span>
            <div class="section-card__header-actions">
              <span class="section-card__subtitle is-link">{{ $t('schoolDoctor.家校联通通道') }}</span>
              <el-button
                v-if="modalType !== 'add'"
                type="text"
                class="refresh-btn"
                icon="el-icon-refresh"
                :loading="parentReceiptRefreshing"
                @click="$emit('refresh-parent-receipt')">
                {{ $t('schoolDoctor.刷新') }}
              </el-button>
            </div>
          </div>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.家长是否同意')">
                <el-radio-group v-model="form.parentAgree" :disabled="isParentReceiptDisabled">
                  <el-radio :label="1">{{ $t('schoolDoctor.是') }}</el-radio>
                  <el-radio :label="0">{{ $t('schoolDoctor.否') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.是否同意护士用药')">
                <el-radio-group v-model="form.parentAgree" disabled>
                  <el-radio :label="1">{{ $t('schoolDoctor.同意') }}</el-radio>
                  <el-radio :label="0">{{ $t('schoolDoctor.不同意') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.家长姓名')">
                <el-input v-model="form.parentName" :disabled="isParentReceiptDisabled" :placeholder="$t('schoolDoctor.家长姓名示例')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolDoctor.家长联系方式')">
                <el-input v-model="form.parentContact" :disabled="isParentReceiptDisabled" :placeholder="$t('schoolDoctor.家长联系方式示例')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <span slot="label" class="field-label field-label--between">
                  <span>{{ $t('schoolDoctor.家长签字') }}</span>
                  <el-button v-if="!isParentReceiptDisabled" type="text" class="sign-link" @click="openSignature">
                    {{ $t('schoolDoctor.去签字') }}
                  </el-button>
                </span>
                <div v-if="form.parentSignaturePath" class="signature-preview">
                  <el-image class="signature-preview__image" :src="form.parentSignaturePath" fit="contain" />
                  <i v-if="!isParentReceiptDisabled" class="el-icon-close signature-clear" @click="clearSignature"></i>
                </div>
                <div v-else class="signature-pad" :class="{ 'is-disabled': isParentReceiptDisabled }" @click="openSignature">
                  <i class="el-icon-edit-outline"></i>
                  <span>{{ $t('schoolDoctor.点击开始手写签名') }}</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </main>

    <VisitRecordSignatureDialog ref="signatureDialog" @confirm="handleSignatureConfirm" />
  </div>
</template>

<script>
import myRequest from '@/router/axiosother.js'
import StudentRemoteSelect from '../../components/StudentRemoteSelect.vue'
import { getNowDateTime, hasParentReceipt, LEAVE_DESTINATION_OPTIONS } from '../utils/visitRecordOptions.js'
import VisitFormGuide from './VisitFormGuide.vue'
import VisitRecordSignatureDialog from './VisitRecordSignatureDialog.vue'

export default {
  name: 'VisitRecordFormPanel',
  components: { StudentRemoteSelect, VisitFormGuide, VisitRecordSignatureDialog },
  props: {
    form: { type: Object, required: true },
    modalType: { type: String, default: 'look' },
    schoolSelectList: { type: Array, default: () => [] },
    parentReceiptRefreshing: { type: Boolean, default: false }
  },
  data() {
    return {
      uploading: false,
      leaveOptions: LEAVE_DESTINATION_OPTIONS,
      rules: {
        visitTime: [{ required: true, message: this.$t('schoolDoctor.请选择到访时间'), trigger: 'change' }]
      }
    }
  },
  computed: {
    isLookMode() {
      return this.modalType === 'look'
    },
    parentReceiptExists() {
      return hasParentReceipt(this.form)
    },
    isLimitedEdit() {
      return this.modalType === 'edit' && this.parentReceiptExists
    },
    isOperationDisabled() {
      return this.isLookMode || this.isLimitedEdit
    },
    isParentReceiptDisabled() {
      return this.isLookMode
    }
  },
  methods: {
    validateForm() {
      return new Promise((resolve) => {
        this.$refs.visitForm.validate((valid) => resolve(valid))
      })
    },
    setDisplayFromForm() {
      if (this.$refs.studentSelect) {
        this.$refs.studentSelect.setDisplayFromForm(this.form)
      }
    },
    resetStudentSelect() {
      if (this.$refs.studentSelect) this.$refs.studentSelect.reset()
    },
    setNow(field) {
      this.form[field] = getNowDateTime()
    },
    beforeAttachmentUpload(file) {
      const allowed = /\.(pdf|png|jpe?g|docx)$/i.test(file.name)
      const isLt10M = file.size / 1024 / 1024 <= 10
      if (!allowed) {
        this.$message.warning(this.$t('schoolDoctor.附件上传格式提示'))
        return false
      }
      if (!isLt10M) {
        this.$message.warning(this.$t('schoolDoctor.附件大小超限'))
        return false
      }
      return true
    },
    async handleUpload(option) {
      this.uploading = true
      try {
        const formData = new FormData()
        formData.append('file', option.file)
        formData.append('prefix', 'parent_weapp_upload')
        const response = await myRequest.upload(formData)
        this.form.attachmentList.push({ name: option.file.name, url: response.data.url })
        this.$message.success(this.$t('schoolDoctor.上传成功'))
      } catch (error) {
        this.$message.error(this.$t('schoolDoctor.上传失败'))
      } finally {
        this.uploading = false
      }
    },
    removeAttachment(index) {
      this.form.attachmentList.splice(index, 1)
    },
    openSignature() {
      if (this.isParentReceiptDisabled) return
      this.$refs.signatureDialog.open()
    },
    handleSignatureConfirm(url) {
      this.form.parentSignaturePath = url || ''
    },
    clearSignature() {
      this.form.parentSignaturePath = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.visit-form-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  min-height: calc(100vh - 140px);
  padding: 0 4px 16px;
  background: #f5f7fa;
}

.visit-form-left {
  flex: 0 0 320px;
  width: 320px;
}

.visit-form-right {
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

.section-card__header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-card__subtitle {
  font-size: 12px;
  color: #909399;

  &.is-link {
    color: #ba8e62;
  }
}

.refresh-btn {
  padding: 0;
  font-size: 12px;
  color: #ba8e62;
}

.visit-form {
  ::v-deep .el-form-item__label {
    padding-bottom: 6px;
    line-height: 1.4;
    color: #606266;
  }
}

.field-label {
  display: inline-flex;
  align-items: center;

  &--between {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}

.required {
  margin-left: 2px;
  color: #f56c6c;
  font-style: normal;
}

.field-tip {
  font-size: 12px;
  font-weight: 400;
  color: #909399;
}

.datetime-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.now-btn {
  flex-shrink: 0;
  padding: 0 4px;
  color: #ba8e62;
  font-weight: 500;
  min-width: 0 !important;
}

.upload-drag {
  width: 100%;

  ::v-deep .el-upload {
    width: 100%;
  }

  ::v-deep .el-upload-dragger {
    width: 100%;
    border-color: #dcdfe6;
    background: #fafafa;
  }
}

.attachment-list {
  margin-bottom: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.delete-btn {
  cursor: pointer;
  color: #909399;
}

.sign-link {
  padding: 0;
  font-size: 13px;
}

.signature-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  background: #fafafa;
  color: #909399;
  cursor: pointer;
  transition: border-color 0.2s;

  i {
    margin-bottom: 8px;
    font-size: 28px;
    color: #c0c4cc;
  }

  &:hover:not(.is-disabled) {
    border-color: #ba8e62;
    color: #ba8e62;

    i {
      color: #ba8e62;
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    background: #f5f7fa;
  }
}

.signature-preview {
  position: relative;
  display: inline-block;
  max-width: 100%;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fafafa;
  overflow: hidden;

  ::v-deep .signature-preview__image {
    display: block;
    width: 240px;
    max-width: 100%;
    height: 120px;
  }

  ::v-deep .signature-preview__image .el-image__inner {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.signature-clear {
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 4px;
  color: #909399;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;

  &:hover {
    color: #f56c6c;
  }
}

::v-deep .student-remote-select .student-card {
  margin-bottom: 0;
  box-shadow: none;
}

</style>
