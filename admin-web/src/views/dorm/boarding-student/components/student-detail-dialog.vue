<template>
  <el-dialog
    v-model="visible"
    :title="$t('dorm.boardingStudent.detailTitle')"
    width="900px"
    destroy-on-close
    class="boarding-detail-dialog"
  >
    <div v-loading="loading">
      <section class="boarding-detail-dialog__section">
        <h3>{{ $t('dorm.boardingStudent.sectionBasic') }}</h3>
        <el-row :gutter="12" class="boarding-detail-dialog__row">
          <el-col :span="8">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldSchool') }}</span>
            <span>{{ detail.schoolName }}</span>
          </el-col>
          <el-col :span="8">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldAdmissionNo') }}</span>
            <span>{{ detail.admissionNo }}</span>
          </el-col>
          <el-col :span="8">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldName') }}</span>
            <span>{{ detail.name }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="boarding-detail-dialog__row">
          <el-col :span="8">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldGrade') }}</span>
            <span>{{ detail.grade }}</span>
          </el-col>
          <el-col :span="8">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldClass') }}</span>
            <span>{{ detail.className }}</span>
          </el-col>
          <el-col :span="8">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldGender') }}</span>
            <span>{{ detail.gender }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="boarding-detail-dialog__row">
          <el-col :span="8">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldNationality') }}</span>
            <span>{{ detail.nationality }}</span>
          </el-col>
          <el-col :span="8">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldBirthdate') }}</span>
            <span>{{ detail.birthdate }}</span>
          </el-col>
        </el-row>
      </section>

      <section v-if="canViewParent" class="boarding-detail-dialog__section">
        <h3>{{ $t('dorm.boardingStudent.sectionParent') }}</h3>
        <el-table :data="detail.parents" border>
          <el-table-column prop="relationship" :label="$t('dorm.boardingStudent.fieldRelationship')" />
          <el-table-column prop="phone" :label="$t('dorm.boardingStudent.fieldPhone')" />
          <el-table-column prop="email_address" :label="$t('dorm.boardingStudent.fieldEmail')" />
        </el-table>
      </section>

      <section class="boarding-detail-dialog__section">
        <h3>{{ $t('dorm.boardingStudent.sectionLodging') }}</h3>
        <el-row :gutter="12" class="boarding-detail-dialog__row">
          <el-col :span="12">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldRoom') }}</span>
            <span>{{ detail.room }}</span>
          </el-col>
          <el-col :span="12">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldBed') }}</span>
            <span>{{ detail.bed }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="boarding-detail-dialog__row">
          <el-col :span="12">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldProject') }}</span>
            <span>{{ detail.project }}</span>
          </el-col>
          <el-col :span="12">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldCheckinDate') }}</span>
            <span>{{ detail.checkinDate }}</span>
          </el-col>
        </el-row>
        <el-row v-if="variant === 'current'" :gutter="12" class="boarding-detail-dialog__row">
          <el-col :span="12">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldPlannedCheckout') }}</span>
            <span>{{ detail.plannedCheckout }}</span>
          </el-col>
          <el-col :span="12">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldPaymentStatus') }}</span>
            <span>{{ detail.paymentStatus }}</span>
          </el-col>
        </el-row>
        <el-row v-else :gutter="12" class="boarding-detail-dialog__row">
          <el-col :span="12">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldCheckoutDate') }}</span>
            <span>{{ detail.checkoutDate }}</span>
          </el-col>
          <el-col :span="12">
            <span class="boarding-detail-dialog__label">{{ $t('dorm.boardingStudent.fieldPaymentStatus') }}</span>
            <span>{{ detail.paymentStatus }}</span>
          </el-col>
        </el-row>
      </section>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useUniI18n, useUniPermission } from 'uni-ui-lib'
import { computed, reactive, watch } from 'vue'

import { dormStudentApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { DormParentInfo } from '@/types/modules/dorm-student'
import { normalizeEnvelope } from '@/utils/api-response-normalize'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  admissionNo?: string
  variant: 'current' | 'history'
}>()

const { t } = useUniI18n()
const { hasPermission } = useUniPermission()
const canViewParent = computed(() => hasPermission('boarding-parent-view'))
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()

const detail = reactive({
  schoolName: '--',
  admissionNo: '--',
  name: '--',
  grade: '--',
  className: '--',
  gender: '--',
  nationality: '--',
  birthdate: '--',
  room: '--',
  bed: '--',
  project: '--',
  checkinDate: '--',
  plannedCheckout: '--',
  checkoutDate: '--',
  paymentStatus: '--',
  parents: [] as DormParentInfo[]
})

function genderLabel(raw: unknown) {
  const g = String(raw ?? '')
  if (g === '1') {
    return t('dorm.room.genderMale')
  }
  if (g === '2') {
    return t('dorm.room.genderFemale')
  }
  return g || '--'
}

function paymentLabel(raw: unknown) {
  const v = String(raw ?? '')
  if (v === '1') {
    return t('dorm.boardingStudent.paymentPaid')
  }
  if (v === '0') {
    return t('dorm.boardingStudent.paymentUnpaid')
  }
  return '--'
}

function fillFromCurrent(body: Loose) {
  const school = body.school as Loose | undefined
  detail.schoolName = String(school?.en_name ?? school?.cn_name ?? '--')
  detail.admissionNo = String(body.admission_no ?? props.admissionNo ?? '--')
  detail.name = String(body.en_name ?? '--')
  detail.grade = String(body.grade_code ?? '--')
  detail.className = String(body.form_code ?? '--')
  detail.gender = genderLabel(body.gender)
  detail.nationality = String(body.nationality ?? '--')
  detail.birthdate = String(body.birthdate ?? '--')
  detail.room = String(body.room_room ?? '--')
  detail.bed = String(body.bed_label ?? '--')
  detail.project = String(body.project_name ?? '--')
  detail.checkinDate = String(body.checkin_date ?? '--').slice(0, 10)
  detail.plannedCheckout = String(body.planned_checkout_date ?? '--').slice(0, 10)
  detail.paymentStatus = paymentLabel(body.payment_status)
  detail.parents = Array.isArray(body.parent_info) ? (body.parent_info as DormParentInfo[]) : []
}

function fillFromHistory(body: Loose) {
  const student = (body.student as Loose) ?? {}
  const school = student.school as Loose | undefined
  detail.schoolName = String(school?.en_name ?? school?.cn_name ?? '--')
  detail.admissionNo = String(body.admission_no ?? props.admissionNo ?? '--')
  detail.name = String(student.en_name ?? '--')
  detail.grade = String(student.grade_code ?? '--')
  detail.className = String(student.form_code ?? '--')
  detail.gender = genderLabel(student.gender)
  detail.nationality = String(student.nationality ?? '--')
  detail.birthdate = String(student.birthdate ?? '--')
  detail.room = String(student.room_room ?? '--')
  detail.bed = String(student.bed_label ?? '--')
  detail.project = String(student.project_name ?? '--')
  detail.checkinDate = String(body.checkin_date ?? student.checkin_date ?? '--').slice(0, 10)
  detail.checkoutDate = String(body.checkout_date ?? '--').slice(0, 10)
  detail.paymentStatus = paymentLabel(student.payment_status)
  detail.parents = Array.isArray(student.parent_info) ? (student.parent_info as DormParentInfo[]) : []
}

watch(visible, async (open) => {
  if (!open || !props.admissionNo) {
    return
  }
  await runWithDetailLoading(async () => {
    const raw =
      props.variant === 'history'
        ? await dormStudentApi.historyDetail.get({ admissionNo: props.admissionNo })
        : await dormStudentApi.detail.get({ admissionNo: props.admissionNo })
    const body = normalizeEnvelope(raw) as Loose
    if (props.variant === 'history') {
      fillFromHistory(body)
    } else {
      fillFromCurrent(body)
    }
  })
})
</script>

<style scoped lang="scss">
.boarding-detail-dialog {
  &__section {
    margin-bottom: 20px;

    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 600;
    }
  }

  &__row {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.6;
  }

  &__label {
    display: inline-block;
    min-width: 88px;
    margin-right: 8px;
    color: var(--el-text-color-secondary);
  }
}
</style>
