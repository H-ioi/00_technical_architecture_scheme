<template>
  <el-dialog
    v-model="visible"
    :title="$t('dorm.boardingStudent.detailTitle')"
    width="900px"
    destroy-on-close
    class="boarding-history-edit-dialog">
    <div v-loading="loading">
      <section class="boarding-history-edit-dialog__section">
        <h3>{{ $t('dorm.boardingStudent.sectionBasic') }}</h3>
        <p>{{ detail.name }} / {{ detail.admissionNo }}</p>
      </section>

      <section v-if="canViewParent" class="boarding-history-edit-dialog__section">
        <h3>{{ $t('dorm.boardingStudent.sectionParent') }}</h3>
        <el-table :data="detail.parents" border>
          <el-table-column prop="relationship" :label="$t('dorm.boardingStudent.fieldRelationship')" />
          <el-table-column prop="phone" :label="$t('dorm.boardingStudent.fieldPhone')" />
          <el-table-column prop="email_address" :label="$t('dorm.boardingStudent.fieldEmail')" />
        </el-table>
      </section>

      <section class="boarding-history-edit-dialog__section">
        <h3>{{ $t('dorm.boardingStudent.sectionLodging') }}</h3>
        <div class="boarding-history-edit-dialog__field">
          <span>{{ $t('dorm.boardingStudent.fieldCheckoutDate') }}</span>
          <el-date-picker
            v-model="checkoutDate"
            type="date"
            value-format="YYYY-MM-DD"
            :placeholder="$t('dorm.boardingStudent.phCheckoutDateSingle')"
            style="width: 260px" />
        </div>
        <p class="boarding-history-edit-dialog__meta">
          {{ $t('dorm.boardingStudent.fieldRoom') }}: {{ detail.room }} /
          {{ $t('dorm.boardingStudent.fieldBed') }}: {{ detail.bed }}
        </p>
      </section>
    </div>
    <template #footer>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('dorm.common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUniI18n, useUniPermission } from 'uni-ui-lib'
import { computed, reactive, ref, watch } from 'vue'

import { dormStudentApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { DormParentInfo } from '@/types/modules/dorm-student'
import { normalizeEnvelope } from '@/utils/api-response-normalize'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  admissionNo?: string
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { hasPermission } = useUniPermission()
const canViewParent = computed(() => hasPermission('boarding-parent-view'))
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()
const submitting = ref(false)
const checkoutDate = ref('')

const detail = reactive({
  admissionNo: '',
  name: '--',
  room: '--',
  bed: '--',
  parents: [] as DormParentInfo[]
})

watch(visible, async (open) => {
  if (!open || !props.admissionNo) {
    return
  }
  checkoutDate.value = ''
  await runWithDetailLoading(async () => {
    const raw = await dormStudentApi.historyDetail.get({ admissionNo: props.admissionNo })
    const body = normalizeEnvelope(raw) as Loose
    const student = (body.student as Loose) ?? {}
    detail.admissionNo = String(body.admission_no ?? props.admissionNo)
    detail.name = String(student.en_name ?? '--')
    detail.room = String(student.room_room ?? '--')
    detail.bed = String(student.bed_label ?? '--')
    detail.parents = Array.isArray(student.parent_info) ? (student.parent_info as DormParentInfo[]) : []
    checkoutDate.value = String(body.checkout_date ?? '').slice(0, 10)
  })
})

async function submit() {
  if (!checkoutDate.value || !props.admissionNo) {
    ElMessage.warning(t('dorm.boardingStudent.ruleCheckoutDate'))
    return
  }
  submitting.value = true
  try {
    await dormStudentApi.historyEditCheckoutDate.post({
      admissionNo: props.admissionNo,
      checkoutDate: checkoutDate.value
    })
    ElMessage.success(t('dorm.common.saveSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.boarding-history-edit-dialog {
  &__section {
    margin-bottom: 20px;

    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 600;
    }
  }

  &__field {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__meta {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}
</style>
