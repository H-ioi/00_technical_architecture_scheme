<template>
  <el-dialog
    v-model="open"
    width="85%"
    destroy-on-close
    :title="$t('schoolBus.studentApply.detailTitle')"
    @closed="emit('close')"
  >
    <div v-if="loading" class="order-detail__loading">
      {{ $t('schoolBus.studentApply.detailLoading') }}
    </div>
    <template v-else-if="baseInfo">
      <el-descriptions :column="4" border class="order-detail__desc">
        <el-descriptions-item :label="$t('schoolBus.studentApply.colId')">
          {{ baseInfo.id ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.colApplyTime')">
          {{ baseInfo.createTime ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.colApprovalStatus')">
          {{ baseInfo.approvalStatusLabel ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.colPaymentStatus')">
          {{ baseInfo.paymentStatusLabel ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.detailAmountDue')">
          {{ baseInfo.amountDue ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.colSchool')">
          {{ baseInfo.schoolEnName ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.colSection')">
          {{ baseInfo.showSectionName ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.colAdmissionNo')">
          {{ baseInfo.admissionNo ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.colStudentName')">
          {{ baseInfo.studentName ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.colGrade')">
          {{ baseInfo.studentGrade ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.colPickup')">
          {{ baseInfo.pickupMethodLabel ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="String(baseInfo.approvalStatus ?? '') === '2'"
          :label="$t('schoolBus.studentApply.detailDenyReason')"
          :span="4"
        >
          {{ baseInfo.denyReason ?? '--' }}
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="canShowPayInfo" class="order-detail__pay">
        <h4>{{ $t('schoolBus.studentApply.detailPayTitle') }}</h4>
        <el-descriptions :column="4" border>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detailPaymentAmount')">
            {{ baseInfo.paymentAmount ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detailPaymentMethod')">
            {{ baseInfo.paymentMethodLabel ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detailPaymentDate')">
            {{ baseInfo.paymentDate ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detailPaymentAccount')">
            {{ baseInfo.paymentAccount ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detailPaymentOrderNo')">
            {{ baseInfo.paymentOrderNo ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detailReceivingAccount')">
            {{ baseInfo.receivingAccount ?? '--' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="order-detail__sign">
        <span>{{ $t('schoolBus.studentApply.detailSign') }}</span>
        <el-image
          v-if="signImageUrl"
          :src="signImageUrl"
          fit="contain"
          class="order-detail__sign-img"
        />
        <span v-else>--</span>
      </div>

      <h4 class="order-detail__sub-title">{{ $t('schoolBus.studentApply.detailRouteTitle') }}</h4>
      <el-table :data="routeTableData" border size="small">
        <el-table-column
          prop="lineName"
          :label="$t('schoolBus.studentApply.detailRouteLine')"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="stationName"
          :label="$t('schoolBus.studentApply.detailRouteStation')"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="lineTypeName"
          :label="$t('schoolBus.studentApply.detailLineType')"
          width="120"
        />
        <el-table-column
          prop="ridingWeekDay"
          :label="$t('schoolBus.studentApply.detailRidingWeekDay')"
          width="120"
        />
        <el-table-column
          prop="carNumber"
          :label="$t('schoolBus.studentOrder.colPlate')"
          width="120"
        />
        <el-table-column
          prop="ridingStartDay"
          :label="$t('schoolBus.studentApply.detailStartDay')"
          width="120"
        />
        <el-table-column
          prop="ridingEndDay"
          :label="$t('schoolBus.studentApply.detailEndDay')"
          width="120"
        />
      </el-table>

      <template v-if="String(baseInfo.pickupMethod ?? '') === '2'">
        <h4 class="order-detail__sub-title">
          {{ $t('schoolBus.studentApply.detailPersonTitle') }}
        </h4>
        <el-table :data="personTableData" border size="small">
          <el-table-column
            prop="pickupRelationships"
            :label="$t('schoolBus.studentApply.detailRelation')"
            min-width="100"
          />
          <el-table-column
            prop="pickupPhone"
            :label="$t('schoolBus.studentApply.detailPhone')"
            width="140"
          />
          <el-table-column :label="$t('schoolBus.studentApply.detailPhoto')" min-width="120">
            <template #default="{ row }">
              <el-image
                v-if="row.pickupImageUrl"
                :src="String(row.pickupImageUrl)"
                class="order-detail__thumb"
              />
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { useUniI18n, useUniPermission } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { membershipApi, schoolBusOrderApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { membershipSchoolLabel } from '@/utils/membership-school'

import { formatOptionLabels } from '@/utils/form-display'
import { pickLocaleName } from '@/utils/locale-name'
import {
  approvalStatusOptions,
  paymentMethodOptions,
  paymentStatusOptions,
  pickupMethodOptions,
  studentLineTypeOptions
} from '../use-student-order-filters'

type Loose = Record<string, unknown>

const props = defineProps<{
  visible: boolean
  orderId: string | number | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { locale, t } = useUniI18n()
const { hasPermission } = useUniPermission()

const open = computed({
  get: () => props.visible,
  set: (v: boolean) => {
    if (!v) {
      emit('close')
    }
  }
})

const loading = ref(false)
const baseInfo = ref<Loose | null>(null)
const routeTableData = ref<Loose[]>([])
const personTableData = ref<Loose[]>([])
const signImageUrl = ref('')

const canShowPayInfo = computed(
  () =>
    hasPermission('isshow_bus_intentionorder_pay_info') &&
    String(baseInfo.value?.approvalStatus ?? '') === '1'
)

const loadDetail = async (id: string | number) => {
  loading.value = true
  baseInfo.value = null
  routeTableData.value = []
  personTableData.value = []
  signImageUrl.value = ''
  try {
    const raw = await schoolBusOrderApi.detail.get(id)
    const data = (raw && typeof raw === 'object' ? (raw as Loose).data : raw) as Loose | undefined
    if (!data) {
      return
    }
    const schoolRaw = await membershipApi.school.get()
    const schools: SchoolOptionRecord[] = Array.isArray(schoolRaw)
      ? (schoolRaw as SchoolOptionRecord[])
      : Array.isArray((schoolRaw as Loose)?.data)
        ? ((schoolRaw as Loose).data as unknown as SchoolOptionRecord[])
        : []
    const schoolId = data.schoolId as string | number | undefined
    const schoolMapped = membershipSchoolLabel(schools, schoolId, locale.value)
    const schoolDisplay = schoolMapped !== '--' ? schoolMapped : String(data.schoolEnName ?? '--')
    const approvalOpts = approvalStatusOptions(t)
    const paymentOpts = paymentStatusOptions(t)
    const pickupOpts = pickupMethodOptions(t)
    const payMethodOpts = paymentMethodOptions(t)
    const lineTypeOpts = studentLineTypeOptions(t)

    baseInfo.value = {
      id,
      schoolEnName: schoolDisplay,
      showSectionName: pickLocaleName(
        { enName: data.sectionEnName, cnName: data.sectionCnName },
        locale.value
      ),
      admissionNo: data.admissionNo,
      studentName: data.studentName,
      studentGrade: data.studentGrade,
      amountDue: data.amountDue,
      approvalStatus: data.approvalStatus,
      approvalStatusLabel: formatOptionLabels(approvalOpts, data.approvalStatus) || '--',
      denyReason: data.denyReason,
      paymentStatus: data.paymentStatus,
      paymentStatusLabel: formatOptionLabels(paymentOpts, data.paymentStatus) || '--',
      pickupMethod: data.pickupMethod,
      pickupMethodLabel: formatOptionLabels(pickupOpts, data.pickupMethod) || '--',
      createTime: data.createTime ? dayjs(String(data.createTime)).format('YYYY-MM-DD HH:mm') : '',
      paymentAmount: data.paymentAmount,
      paymentMethodLabel: formatOptionLabels(payMethodOpts, data.paymentMethod) || '--',
      paymentDate: data.paymentDate,
      paymentAccount: data.paymentAccount,
      paymentOrderNo: data.paymentOrderNo,
      receivingAccount: data.receivingAccount
    }

    const parents = Array.isArray(data.parentInfos) ? (data.parentInfos as Loose[]) : []
    personTableData.value = parents.map((item) => ({
      pickupRelationships: item.pickupRelationships,
      pickupPhone: item.pickupPhone,
      pickupImageUrl: item.pickupImageUrl
    }))

    const lines = Array.isArray(data.orderLines) ? (data.orderLines as Loose[]) : []
    routeTableData.value = lines.map((item) => {
      const carinfoId = item.carinfoId
      const cars = (item.busLineDTO as Loose | undefined)?.carList as Loose[] | undefined
      let carNumber = '--'
      if (Array.isArray(cars) && carinfoId != null) {
        const hit = cars.find((c) => String(c.id) === String(carinfoId))
        if (hit?.carNumber) {
          carNumber = String(hit.carNumber)
        }
      }
      return {
        lineName: pickLocaleName(
          { enName: item.lineEnName, cnName: item.lineCnName },
          locale.value
        ),
        stationName: pickLocaleName(
          { enName: item.stationEnName, cnName: item.stationCnName },
          locale.value
        ),
        lineTypeName: formatOptionLabels(lineTypeOpts, item.studentLineType) || '--',
        ridingWeekDay: item.ridingWeekDay,
        carNumber,
        ridingStartDay: item.ridingStartDay,
        ridingEndDay: item.ridingEndDay
      }
    })

    signImageUrl.value = data.signImageUrl ? String(data.signImageUrl) : ''
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.visible, props.orderId] as const,
  ([vis, oid]) => {
    if (vis && oid != null) {
      loadDetail(oid)
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.order-detail {
  &__loading {
    padding: 24px;
    text-align: center;
  }

  &__desc {
    margin-bottom: 16px;
  }

  &__pay {
    margin: 16px 0;
  }

  &__sign {
    margin: 16px 0;
  }

  &__sign-img {
    max-width: 240px;
    max-height: 120px;
    margin-top: 8px;
  }

  &__sub-title {
    margin: 16px 0 8px;
    font-size: 14px;
    font-weight: 600;
  }

  &__thumb {
    width: 64px;
    height: 64px;
  }
}
</style>
