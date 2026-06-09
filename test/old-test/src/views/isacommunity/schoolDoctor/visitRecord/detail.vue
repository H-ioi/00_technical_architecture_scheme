<template>
  <div>
    <el-drawer
      :title="drawerTitle"
      :visible.sync="showDialog"
      :size="drawerSize"
      :append-to-body="appendToBody"
      :before-close="closeModal"
      class="drawer-body visit-record-drawer">
      <div class="drawer-content visit-record-content" v-if="showDialog" v-loading="detailLoading">
        <PendingMedicationPanel
          v-if="isPendingMode"
          ref="pendingPanel"
          :detail="pendingDetail"
          :operation-form="operationForm"
          :show-operation-form="showPendingOperationForm"
          :show-operation-records="showPendingOperationRecords"
          :can-edit-operation="canEditPendingOperation"
          :school-select-list="schoolSelectList"
          @view-operation="handleViewOperation"
          @edit-operation="handleEditOperation" />

        <VisitRecordFormPanel
          v-else
          ref="visitPanel"
          :form="ruleForm"
          :modal-type="modalType"
          :school-select-list="schoolSelectList"
          :parent-receipt-refreshing="parentReceiptRefreshing"
          @student-select="handleStudentSelect"
          @student-clear="handleStudentClear"
          @refresh-parent-receipt="handleRefreshParentReceipt" />

        <div class="drawer-footer" v-if="showFooter">
          <el-button @click="closeModal">{{ $t('btn.取消') }}</el-button>
          <template v-if="modalType === 'operatePending'">
            <el-button type="warning" :loading="isSubmitting" @click="handleEndMedication">{{ $t('schoolDoctor.结束用药') }}</el-button>
            <el-button type="primary" :loading="isSubmitting" @click="submitForm">{{ $t('schoolDoctor.保存操作') }}</el-button>
          </template>
          <el-button v-else type="primary" @click="submitForm" :loading="isSubmitting">{{ $t('btn.确认') }}</el-button>
        </div>
      </div>
    </el-drawer>

    <PendingOperationRecordDialog
      ref="operationRecordDialog"
      :get-current-operator="getCurrentOperator"
      @save="handleOperationRecordSave" />
  </div>
</template>

<script>
import {
  addVisitRecord,
  editPendingMedicationOperation,
  editVisitRecord,
  getPendingMedicationDetail,
  getVisitRecordDetail,
  operatePendingMedication
} from '@/api/isacommunity/visitRecord'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import { mapGetters } from 'vuex'
import PendingMedicationPanel from './components/PendingMedicationPanel.vue'
import PendingOperationRecordDialog from './components/PendingOperationRecordDialog.vue'
import VisitRecordFormPanel from './components/VisitRecordFormPanel.vue'
import {
  buildPendingMedicationOperatePayload,
  buildPendingOperationRecordPayload,
  buildPendingStudentDisplayForm,
  createEmptyPendingOperationForm,
  createEmptyVisitForm,
  getNowDateTime,
  resolvePendingApplicationId
} from './utils/visitRecordOptions.js'

export default {
  name: 'VisitRecordDetail',
  components: { PendingMedicationPanel, PendingOperationRecordDialog, VisitRecordFormPanel },
  mixins: [schoolListBuscommonMixin],
  props: {
    title: { type: String, default: '' },
    /** 嵌套在其他抽屉内打开时为 true，避免遮罩层级异常 */
    appendToBody: { type: Boolean, default: false }
  },
  data() {
    return {
      modalType: 'look',
      showDialog: false,
      detailLoading: false,
      parentReceiptRefreshing: false,
      isSubmitting: false,
      ruleForm: createEmptyVisitForm(),
      pendingDetail: {},
      operationForm: createEmptyPendingOperationForm()
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo']),
    isPendingMode() {
      return ['lookPending', 'operatePending'].includes(this.modalType)
    },
    drawerSize() {
      return '1120px'
    },
    drawerTitle() {
      const map = {
        lookPending: this.$t('schoolDoctor.待用药详情'),
        operatePending: this.$t('schoolDoctor.操作待用药'),
        add: this.$t('schoolDoctor.新增就诊记录'),
        edit: this.$t('schoolDoctor.编辑就诊记录'),
        look: this.$t('schoolDoctor.就诊记录详情')
      }
      return map[this.modalType] || this.title || this.$t('schoolDoctor.详情')
    },
    showFooter() {
      if (this.modalType === 'operatePending') return true
      if (this.modalType === 'add') return true
      if (this.modalType === 'edit') return true
      return false
    },
    showPendingOperationForm() {
      return this.modalType === 'operatePending'
    },
    showPendingOperationRecords() {
      return ['lookPending', 'operatePending'].includes(this.modalType)
    },
    canEditPendingOperation() {
      const key = 'pendingmedication_operation_edit'
      if (!this.permissions) return true
      if (this.permissions[key] === undefined) return true
      return !!this.permissions[key]
    }
  },
  methods: {
    async showModal(type = 'look', item = {}) {
      this.modalType = type
      this.showDialog = true
      this.detailLoading = true
      try {
        await this.fetchSchoolListBuscommon()
        if (this.isPendingMode) {
          await this.loadPendingDetail(item)
          this.resetPendingOperationForm(type)
        } else if (type === 'add') {
          this.ruleForm = createEmptyVisitForm()
          this.ruleForm.operator = this.getCurrentOperator()
          this.ruleForm.notifyParent = 1
          this.ruleForm.executeOperation = 0
        } else {
          await this.loadVisitDetail(item.id)
        }
      } finally {
        this.detailLoading = false
        this.$nextTick(() => {
          if (this.isPendingMode && this.$refs.pendingPanel) {
            this.$refs.pendingPanel.setStudentDisplay(buildPendingStudentDisplayForm(this.pendingDetail))
            return
          }
          if (!this.$refs.visitPanel) return
          if (type === 'add') {
            this.$refs.visitPanel.resetStudentSelect()
          } else {
            this.$refs.visitPanel.setDisplayFromForm()
          }
        })
      }
    },

    resetPendingOperationForm(type) {
      this.operationForm = createEmptyPendingOperationForm()
      this.operationForm.operator = this.getCurrentOperator()
      if (type === 'operatePending') {
        this.operationForm.operateTime = getNowDateTime()
      }
    },

    async handleRefreshParentReceipt() {
      if (!this.ruleForm.id) {
        this.$message.warning(this.$t('schoolDoctor.请先保存就诊记录'))
        return
      }
      this.parentReceiptRefreshing = true
      try {
        await this.loadVisitDetail(this.ruleForm.id)
        this.$nextTick(() => {
          if (this.$refs.visitPanel) this.$refs.visitPanel.setDisplayFromForm()
        })
      } finally {
        this.parentReceiptRefreshing = false
      }
    },

    loadVisitDetail(id) {
      return getVisitRecordDetail(id).then((res) => {
        if (!res.data.success) return
        const data = res.data.data || {}
        this.ruleForm = {
          ...createEmptyVisitForm(),
          ...data,
          attachmentList: data.attachmentList || [],
          notifyParent: data.notifyParent === 0 ? 0 : data.notifyParent || 1,
          executeOperation: data.executeOperation === 1 ? 1 : 0,
          operator: data.operator || data.creator || this.getCurrentOperator()
        }
      })
    },

    loadPendingDetail(item) {
      const id = item && typeof item === 'object' ? item.id : item
      const listRow = item && typeof item === 'object' ? item : {}
      return getPendingMedicationDetail(id).then((res) => {
        if (!res.data.success) return
        const data = res.data.data || {}
        this.pendingDetail = {
          ...data,
          applicationId: resolvePendingApplicationId({ ...listRow, ...data })
        }
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
      this.ruleForm.drugAllergy = ''
    },

    handleViewOperation(row) {
      const source = this.findOperationRecord(row)
      this.$refs.operationRecordDialog.open('view', source)
    },

    handleEditOperation(row) {
      if (!this.canEditPendingOperation) {
        this.$message.warning(this.$t('schoolDoctor.暂无操作记录编辑权限'))
        return
      }
      const source = this.findOperationRecord(row)
      this.$refs.operationRecordDialog.open('edit', source)
    },
    async handleOperationRecordSave(operationForm) {
      const dialog = this.$refs.operationRecordDialog
      const payload = buildPendingOperationRecordPayload(this.pendingDetail, operationForm)
      if (!payload.pendingId) {
        this.$message.warning(this.$t('schoolDoctor.缺少待用药ID'))
        dialog.finishSubmit()
        return
      }
      if (!payload.id) {
        this.$message.warning(this.$t('schoolDoctor.缺少操作记录ID'))
        dialog.finishSubmit()
        return
      }
      try {
        const res = await editPendingMedicationOperation(payload)
        if (res.data.success) {
          this.$message.success(this.$t('schoolDoctor.编辑成功'))
          await this.loadPendingDetail(this.pendingDetail)
          this.$emit('refresh')
          dialog.handleClose()
        }
      } finally {
        dialog.finishSubmit()
      }
    },
    findOperationRecord(row) {
      const list = this.pendingDetail.operationRecordList || this.pendingDetail.operationList || []
      const targetId = row.operationId || row.id
      return list.find((item) => (item.operationId || item.id) === targetId) || row
    },

    getCurrentOperator() {
      const user = this.userInfo || {}
      return user.username || user.name || user.nickName || ''
    },

    async submitForm() {
      if (this.isSubmitting) return
      if (this.isPendingMode) {
        await this.submitPendingForm()
        return
      }
      const valid = await this.$refs.visitPanel.validateForm()
      if (!valid) return
      if (this.modalType === 'add' && !this.ruleForm.admissionNo) {
        this.$message.warning(this.$t('schoolDoctor.请选择学生'))
        return
      }
      this.isSubmitting = true
      const request = this.modalType === 'add' ? addVisitRecord(this.ruleForm) : editVisitRecord(this.ruleForm)
      request
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.modalType === 'add' ? this.$t('schoolDoctor.新增成功') : this.$t('schoolDoctor.编辑成功'))
            this.$emit('refresh')
            this.closeModal()
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },

    async submitPendingForm(endMedication = false) {
      const valid = await this.$refs.pendingPanel.validateOperationForm()
      if (!valid) return
      const payload = buildPendingMedicationOperatePayload(this.pendingDetail, this.operationForm, false, endMedication)
      if (!payload.applicationId) {
        this.$message.warning(this.$t('schoolDoctor.缺少用药申请ID'))
        return
      }
      this.isSubmitting = true
      const request = operatePendingMedication(payload)
      request
        .then((res) => {
          if (res.data.success) {
            const msg = endMedication ? this.$t('schoolDoctor.结束用药成功') : this.$t('schoolDoctor.操作成功')
            this.$message.success(msg)
            this.$emit('refresh')
            this.closeModal()
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },

    handleEndMedication() {
      this.$refs.pendingPanel.validateOperationForm().then((valid) => {
        if (!valid) return
        this.$confirm(this.$t('schoolDoctor.确认结束用药提示'), this.$t('schoolDoctor.提示'), {
          confirmButtonText: this.$t('btn.确定'),
          cancelButtonText: this.$t('btn.取消'),
          type: 'warning'
        }).then(() => {
          this.submitPendingForm(true)
        })
      })
    },

    closeModal() {
      this.showDialog = false
      this.ruleForm = createEmptyVisitForm()
      this.pendingDetail = {}
      this.operationForm = createEmptyPendingOperationForm()
      this.isSubmitting = false
      this.detailLoading = false
      this.parentReceiptRefreshing = false
      if (this.$refs.visitPanel) this.$refs.visitPanel.resetStudentSelect()
    }
  }
}
</script>

<style lang="scss" scoped>
.visit-record-drawer {
  ::v-deep .el-drawer__body {
    padding: 0;
    background: #f5f7fa;
  }
}

.visit-record-content {
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
.visit-form-layout {
  padding: 20px;
}
</style>
