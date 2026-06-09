<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="760px"
    append-to-body
    :close-on-click-modal="false"
    class="pending-operation-record-dialog"
    @close="handleClose">
    <PendingOperationForm ref="operationForm" :operation-form="operationForm" :readonly="readonly" />
    <div slot="footer">
      <el-button @click="handleClose">{{ readonly ? $t('btn.关闭') : $t('btn.取消') }}</el-button>
      <el-button v-if="!readonly" type="primary" :loading="submitting" @click="handleSave">{{ $t('btn.确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createEmptyPendingOperationForm,
  mapOperationRecordRow,
  mapPendingOperationAttachmentsFromApi
} from '../utils/visitRecordOptions.js'
import PendingOperationForm from './PendingOperationForm.vue'

export default {
  name: 'PendingOperationRecordDialog',
  components: { PendingOperationForm },
  props: {
    getCurrentOperator: { type: Function, default: () => '' }
  },
  data() {
    return {
      visible: false,
      readonly: false,
      submitting: false,
      operationForm: createEmptyPendingOperationForm()
    }
  },
  computed: {
    dialogTitle() {
      return this.readonly ? this.$t('schoolDoctor.操作记录详情') : this.$t('schoolDoctor.编辑操作记录')
    }
  },
  methods: {
    /** 打开操作记录弹窗：view 只读查看，edit 可编辑 */
    open(type, record = {}) {
      this.readonly = type === 'view'
      this.operationForm = createEmptyPendingOperationForm()
      const row = mapOperationRecordRow(record)
      Object.assign(this.operationForm, {
        operationId: row.operationId,
        operateTime: row.operateTime === '-' ? '' : row.operateTime,
        operateStatus: row.operateStatus || 1,
        specificSituation: row.specificSituation === '-' ? '' : row.specificSituation,
        operator: row.operatorName === '-' ? this.getCurrentOperator() : row.operatorName,
        notifyParent: record.notifyParent === 0 ? 0 : 1,
        attachmentList: mapPendingOperationAttachmentsFromApi(record.attachmentList),
        leaveTime: row.leaveTime === '-' ? '' : row.leaveTime,
        leaveDestination: row.leaveDestination
      })
      this.visible = true
    },
    handleClose() {
      this.visible = false
      this.submitting = false
      this.operationForm = createEmptyPendingOperationForm()
    },
    async handleSave() {
      const valid = await this.$refs.operationForm.validateOperationForm()
      if (!valid) return
      this.submitting = true
      this.$emit('save', { ...this.operationForm })
    },
    finishSubmit() {
      this.submitting = false
    }
  }
}
</script>
