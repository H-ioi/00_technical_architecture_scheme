<template>
  <div>
    <el-drawer :title="drawerTitle" :visible.sync="showDialog" size="1120px" :before-close="closeModal" class="drawer-body medication-apply-drawer">
      <div class="drawer-content medication-apply-content" v-if="showDialog" v-loading="detailLoading">
        <MedicationApplyFormPanel
          ref="formPanel"
          :form="ruleForm"
          :rules="rules"
          :modal-type="modalType"
          :form-readonly="formReadonly"
          :student-readonly="studentReadonly"
          :approval-editable="approvalEditable"
          :show-approval-section="showApprovalSection"
          :school-select-list="schoolSelectList"
          :symptom-options="symptomOptions"
          :need-medication-options="needMedicationOptions"
          :nurse-approval-options="nurseApprovalOptions"
          :visit-record-list="visitRecordList"
          :visit-loading="visitLoading"
          :uploading="uploading"
          :signature-uploading="signatureUploading"
          :parent-sign-mode.sync="parentSignMode"
          @student-select="handleStudentSelect"
          @student-clear="handleStudentClear"
          @diagnosis-upload="handleDiagnosisUpload"
          @signature-upload="handleSignatureUpload"
          @before-image="beforeImageUpload"
          @remove-diagnosis-image="removeDiagnosisImage"
          @preview-diagnosis-image="previewDiagnosisImage"
          @clear-signature="clearSignature"
          @open-signature="openSignature"
          @open-visit-detail="openVisitDetail" />

        <VisitRecordSignatureDialog ref="signatureDialog" @confirm="handleSignatureConfirm" />

        <div class="drawer-footer" v-if="modalType !== 'look'">
          <el-button @click="closeModal">{{ $t('btn.取消') }}</el-button>
          <template v-if="modalType === 'approve'">
            <el-button type="danger" :loading="isSubmitting" @click="submitApproval(2)">{{ $t('schoolDoctor.拒绝') }}</el-button>
            <el-button type="primary" :loading="isSubmitting" @click="submitApproval(1)">{{ $t('schoolDoctor.通过') }}</el-button>
          </template>
          <el-button v-else type="primary" @click="submitForm" :loading="isSubmitting">{{ $t('schoolDoctor.确认') }}</el-button>
        </div>
      </div>
    </el-drawer>

    <PendingOperationRecordDialog ref="operationRecordDialog" :get-current-operator="getCurrentOperator" />
  </div>
</template>

<script>
import { getDiseaseSettingPage } from '@/api/isacommunity/diseaseSetting'
import { addMedicationApply, editMedicationApply, getMedicationApplyDetail } from '@/api/isacommunity/medicationApply'
import { getPendingMedicationDetail, getPendingMedicationPage } from '@/api/isacommunity/visitRecord'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import myRequest from '@/router/axiosother.js'
import { mapGetters } from 'vuex'
import PendingOperationRecordDialog from '../visitRecord/components/PendingOperationRecordDialog.vue'
import VisitRecordSignatureDialog from '../visitRecord/components/VisitRecordSignatureDialog.vue'
import MedicationApplyFormPanel from './components/MedicationApplyFormPanel.vue'
import {
  createEmptyContentItem,
  createEmptyForm,
  mapMedicationDetailRow,
  NEED_MEDICATION_OPTIONS,
  NURSE_APPROVAL_OPTIONS,
  validateMedicationContentList
} from './utils/medicationApplyOptions.js'

export default {
  name: 'MedicationApplyDetail',
  components: { VisitRecordSignatureDialog, PendingOperationRecordDialog, MedicationApplyFormPanel },
  mixins: [schoolListBuscommonMixin],
  data() {
    return {
      modalType: 'look',
      showDialog: false,
      detailLoading: false,
      visitLoading: false,
      ruleForm: createEmptyForm(),
      isSubmitting: false,
      uploading: false,
      signatureUploading: false,
      parentSignMode: 'draw',
      symptomOptions: [],
      visitRecordList: [],
      needMedicationOptions: NEED_MEDICATION_OPTIONS,
      nurseApprovalOptions: NURSE_APPROVAL_OPTIONS
    }
  },
  deactivated() {
    // keep-alive 切走页面时须关闭抽屉，否则 el-drawer 遮罩会残留在 body
    this.showDialog = false
    if (this.$refs.operationRecordDialog && this.$refs.operationRecordDialog.visible) {
      this.$refs.operationRecordDialog.handleClose()
    }
  },
  computed: {
    rules() {
      const rules = {}
      if (this.modalType === 'add') {
        rules.applyMedication = [{ required: true, message: this.$t('schoolDoctor.请选择是否需要用药'), trigger: 'change' }]
        rules.informedConsent = [
          {
            validator: (rule, value, callback) => {
              if (value === 1) {
                callback()
                return
              }
              callback(new Error(this.$t('schoolDoctor.请勾选知悉同意')))
            },
            trigger: 'change'
          }
        ]
      }
      return rules
    },
    ...mapGetters(['userInfo']),
    drawerTitle() {
      const map = {
        add: this.$t('schoolDoctor.新增用药申请'),
        approve: this.$t('schoolDoctor.审批用药申请'),
        look: this.$t('schoolDoctor.用药申请详情')
      }
      return map[this.modalType] || this.$t('schoolDoctor.用药申请详情')
    },
    formReadonly() {
      return this.modalType !== 'add'
    },
    studentReadonly() {
      return this.modalType !== 'add'
    },
    approvalEditable() {
      return this.modalType === 'approve'
    },
    showApprovalSection() {
      return this.modalType === 'approve' || (this.modalType === 'look' && this.hasApprovalInfo)
    },
    hasApprovalInfo() {
      return this.ruleForm.nurseApproval !== undefined && this.ruleForm.nurseApproval !== null
    }
  },
  methods: {
    async showModal(type = 'look', item = {}) {
      this.modalType = type
      this.showDialog = true
      this.detailLoading = true
      try {
        await Promise.all([this.fetchSchoolListBuscommon(), this.loadSymptomOptions()])
        if (type === 'add') {
          this.ruleForm = createEmptyForm()
          this.parentSignMode = 'draw'
        } else {
          await this.loadDetail(item.id)
          if (type === 'approve') {
            this.ruleForm.nurseOperator = this.getCurrentOperator()
          }
          if (type === 'look') {
            await this.loadVisitRecords()
          }
        }
      } finally {
        this.detailLoading = false
        this.$nextTick(() => {
          if (!this.$refs.formPanel) return
          if (type === 'add') {
            this.$refs.formPanel.resetStudentSelect()
          } else {
            this.$refs.formPanel.setDisplayFromForm(this.ruleForm)
          }
        })
      }
    },

    loadSymptomOptions() {
      return getDiseaseSettingPage({ current: 1, size: 500, status: 1 }).then((res) => {
        if (res.data.success) {
          this.symptomOptions = (res.data.data && res.data.data.data) || []
        }
      })
    },

    loadDetail(id) {
      return getMedicationApplyDetail(id).then((res) => {
        if (!res.data.success) return
        const data = res.data.data || {}
        const contentList = (data.contentList && data.contentList.length ? data.contentList : [createEmptyContentItem()]).map((item) => {
          const { leftoverDisposal, ...rest } = item || {}
          return {
            ...createEmptyContentItem(),
            ...rest,
            startDate: item.startDate ? String(item.startDate).slice(0, 10) : '',
            endDate: item.endDate ? String(item.endDate).slice(0, 10) : ''
          }
        })
        const legacyLeftoverDisposal = data.contentList && data.contentList[0] && data.contentList[0].leftoverDisposal
        this.ruleForm = {
          ...createEmptyForm(),
          ...data,
          informedConsent: data.informedConsent === 1 ? 1 : 0,
          leftoverDisposal: data.leftoverDisposal != null ? data.leftoverDisposal : legacyLeftoverDisposal,
          contentList,
          diagnosisImageList: data.diagnosisImageList || []
        }
        const embeddedList = data.medicationDetailList || data.visitRecordList || data.operationList
        if (embeddedList && embeddedList.length) {
          this.visitRecordList = embeddedList.map((item) => mapMedicationDetailRow(item, this.$t.bind(this)))
        }
      })
    },

    /** 用药详情：拉取该申请关联的待用药操作记录 */
    loadVisitRecords() {
      if (!this.ruleForm.id) return Promise.resolve()
      if (this.visitRecordList.length) return Promise.resolve()
      this.visitLoading = true
      return getPendingMedicationPage({ current: 1, size: 100, medicationApplicationId: this.ruleForm.id })
        .then((res) => {
          if (!res.data.success) return
          const pendingList = (res.data.data && res.data.data.data) || []
          if (!pendingList.length) {
            this.visitRecordList = []
            return
          }
          return Promise.all(
            pendingList.map((pending) =>
              getPendingMedicationDetail(pending.id).then((detailRes) => {
                if (!detailRes.data.success) return []
                const data = detailRes.data.data || {}
                const ops = data.operationList || data.operationRecordList || []
                return ops.map((op) => mapMedicationDetailRow({ ...op, pendingId: pending.id }, this.$t.bind(this)))
              })
            )
          ).then((groups) => {
            this.visitRecordList = groups.reduce((list, group) => list.concat(group), [])
          })
        })
        .finally(() => {
          this.visitLoading = false
        })
    },

    handleStudentSelect(mappedFields) {
      Object.assign(this.ruleForm, mappedFields)
    },

    handleStudentClear() {
      this.ruleForm.admissionNo = ''
      this.ruleForm.fullName = ''
      this.ruleForm.schoolId = undefined
      this.ruleForm.grade = ''
      this.ruleForm.formCode = ''
    },

    getCurrentOperator() {
      const user = this.userInfo || {}
      return user.username || user.name || user.nickName || ''
    },

    beforeImageUpload(file) {
      const isImage = /^image\//.test(file.type) || /\.(jpe?g|png|gif|webp)$/i.test(file.name || '')
      if (!isImage) {
        this.$message.warning(this.$t('schoolDoctor.请上传图片格式文件'))
        return false
      }
      return true
    },

    async uploadImage(file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('prefix', 'parent_weapp_upload')
      const response = await myRequest.upload(formData)
      return response.data.url
    },

    async handleDiagnosisUpload({ file }) {
      if (!this.beforeImageUpload(file)) return
      this.uploading = true
      try {
        const url = await this.uploadImage(file)
        this.ruleForm.diagnosisImageList.push({ imagePath: url, name: file.name })
        this.$message.success(this.$t('schoolDoctor.上传成功'))
      } catch (error) {
        this.$message.error(this.$t('schoolDoctor.上传失败'))
      } finally {
        this.uploading = false
      }
    },

    async handleSignatureUpload(option) {
      if (!this.beforeImageUpload(option.file)) return
      this.signatureUploading = true
      try {
        this.ruleForm.parentSignaturePath = await this.uploadImage(option.file)
        this.$message.success(this.$t('schoolDoctor.上传成功'))
      } catch (error) {
        this.$message.error(this.$t('schoolDoctor.上传失败'))
      } finally {
        this.signatureUploading = false
      }
    },

    removeDiagnosisImage(file) {
      const index = this.ruleForm.diagnosisImageList.findIndex((item) => item.imagePath === file.url)
      if (index > -1) {
        this.ruleForm.diagnosisImageList.splice(index, 1)
      }
    },

    previewDiagnosisImage(file) {
      if (file.url) {
        window.open(file.url, '_blank')
      }
    },

    openSignature() {
      if (this.formReadonly) return
      this.parentSignMode = 'draw'
      this.$refs.signatureDialog.open()
    },

    handleSignatureConfirm(url) {
      this.ruleForm.parentSignaturePath = url
    },

    clearSignature() {
      this.ruleForm.parentSignaturePath = ''
    },

    buildSubmitData() {
      const data = { ...this.ruleForm }
      if (data.applyMedication !== 1) {
        data.contentList = []
        data.leftoverDisposal = undefined
      } else {
        data.contentList = (data.contentList || []).map((item) => {
          const { leftoverDisposal, ...rest } = item || {}
          return {
            ...rest,
            startDate: rest.startDate && rest.startDate.length === 10 ? `${rest.startDate} 00:00:00` : rest.startDate,
            endDate: rest.endDate && rest.endDate.length === 10 ? `${rest.endDate} 00:00:00` : rest.endDate
          }
        })
      }
      if (this.modalType === 'approve') {
        data.nurseOperator = data.nurseOperator || this.getCurrentOperator()
        if (data.nurseApproval === 1) {
          data.status = 1
        } else if (data.nurseApproval === 2) {
          data.status = 3
        }
      }
      if (this.modalType === 'add') {
        data.informedConsent = data.informedConsent === 1 ? 1 : 0
      }
      return data
    },

    /** 审批：1=通过，2=拒绝 */
    submitApproval(nurseApproval) {
      this.ruleForm.nurseApproval = nurseApproval
      if (nurseApproval === 2 && !String(this.ruleForm.remark || '').trim()) {
        this.$message.warning(this.$t('schoolDoctor.请输入审批意见'))
        return
      }
      this.submitForm()
    },

    async submitForm() {
      if (this.isSubmitting) return
      const valid = await this.$refs.formPanel.validateForm()
      if (!valid) return
      if (this.modalType === 'add' && !this.ruleForm.admissionNo) {
        this.$message.warning(this.$t('schoolDoctor.请选择学生'))
        return
      }
      if (this.modalType === 'add' && this.ruleForm.applyMedication === 1) {
        const contentErrorKey = validateMedicationContentList(this.ruleForm.contentList)
        if (contentErrorKey) {
          this.$message.warning(this.$t(`schoolDoctor.${contentErrorKey}`))
          return
        }
      }
      this.isSubmitting = true
      const data = this.buildSubmitData()
      const request = this.modalType === 'add' ? addMedicationApply(data) : editMedicationApply(data)
      request
        .then((res) => {
          if (res.data.success) {
            let msg = this.$t('schoolDoctor.新增成功')
            if (this.modalType === 'approve') {
              msg = this.ruleForm.nurseApproval === 2 ? this.$t('schoolDoctor.拒绝成功') : this.$t('schoolDoctor.审批成功')
            }
            this.$message.success(msg)
            this.$emit('getList')
            this.closeModal()
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },

    /** 查看待用药操作记录详情（非就诊记录详情） */
    openVisitDetail(row) {
      if (!row || !this.$refs.operationRecordDialog) return
      this.$refs.operationRecordDialog.open('view', row.rawRecord || row)
    },

    closeModal() {
      this.showDialog = false
      this.ruleForm = createEmptyForm()
      this.visitRecordList = []
      this.isSubmitting = false
      this.uploading = false
      this.signatureUploading = false
      this.parentSignMode = 'draw'
      this.detailLoading = false
      if (this.$refs.formPanel) this.$refs.formPanel.resetStudentSelect()
    }
  }
}
</script>

<style lang="scss" scoped>
.medication-apply-drawer {
  ::v-deep .el-drawer__body {
    padding: 0;
    background: #f5f7fa;
  }
}

.medication-apply-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f5f7fa;
}

.drawer-footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid #ebeef5;
  box-shadow: 0 -2px 8px rgba(31, 45, 61, 0.06);
}
</style>
