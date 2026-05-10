<template>
  <el-dialog
    v-model="open"
    width="85%"
    destroy-on-close
    :title="$t('schoolBus.studentApply.detail.title')"
    @closed="emit('close')"
  >
    <div v-if="loading" class="order-detail__loading">
      {{ $t('schoolBus.studentApply.detail.loading') }}
    </div>
    <template v-else-if="baseInfo">
      <el-descriptions :column="4" border class="order-detail__desc">
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.id')">
          {{ baseInfo.id ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.applyTime')">
          {{ baseInfo.createTime ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.approvalStatus')">
          {{ baseInfo.approvalStatusLabel ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.paymentStatus')">
          {{ baseInfo.paymentStatusLabel ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.detail.amountDue')">
          {{ baseInfo.amountDue ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.school')">
          {{ baseInfo.schoolEnName ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.section')">
          {{ baseInfo.showSectionName ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.admissionNo')">
          {{ baseInfo.admissionNo ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.studentName')">
          {{ baseInfo.studentName ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.grade')">
          {{ baseInfo.studentGrade ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('schoolBus.studentApply.columns.pickup')">
          {{ baseInfo.pickupMethodLabel ?? '--' }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="String(baseInfo.approvalStatus ?? '') === '2'"
          :label="$t('schoolBus.studentApply.detail.denyReason')"
          :span="4"
        >
          {{ baseInfo.denyReason ?? '--' }}
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="canShowPayInfo" class="order-detail__pay">
        <h4>{{ $t('schoolBus.studentApply.detail.payTitle') }}</h4>
        <el-descriptions :column="4" border>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detail.paymentAmount')">
            {{ baseInfo.paymentAmount ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detail.paymentMethod')">
            {{ baseInfo.paymentMethodLabel ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detail.paymentDate')">
            {{ baseInfo.paymentDate ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detail.paymentAccount')">
            {{ baseInfo.paymentAccount ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detail.paymentOrderNo')">
            {{ baseInfo.paymentOrderNo ?? '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('schoolBus.studentApply.detail.receivingAccount')">
            {{ baseInfo.receivingAccount ?? '--' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="order-detail__sign">
        <span>{{ $t('schoolBus.studentApply.detail.sign') }}</span>
        <el-image
          v-if="signImageUrl"
          :src="signImageUrl"
          fit="contain"
          class="order-detail__sign-img"
        />
        <span v-else>--</span>
      </div>

      <h4 class="order-detail__sub-title">{{ $t('schoolBus.studentApply.detail.routeTitle') }}</h4>
      <el-table :data="routeTableData" border size="small">
        <el-table-column
          prop="lineName"
          :label="$t('schoolBus.studentApply.detail.routeLine')"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="stationName"
          :label="$t('schoolBus.studentApply.detail.routeStation')"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="lineTypeName"
          :label="$t('schoolBus.studentApply.detail.lineType')"
          width="120"
        />
        <el-table-column
          prop="ridingWeekDay"
          :label="$t('schoolBus.studentApply.detail.ridingWeekDay')"
          width="120"
        />
        <el-table-column
          prop="carNumber"
          :label="$t('schoolBus.studentOrder.columns.car')"
          width="120"
        />
        <el-table-column
          prop="ridingStartDay"
          :label="$t('schoolBus.studentApply.detail.startDay')"
          width="120"
        />
        <el-table-column
          prop="ridingEndDay"
          :label="$t('schoolBus.studentApply.detail.endDay')"
          width="120"
        />
      </el-table>

      <template v-if="String(baseInfo.pickupMethod ?? '') === '2'">
        <h4 class="order-detail__sub-title">
          {{ $t('schoolBus.studentApply.detail.personTitle') }}
        </h4>
        <el-table :data="personTableData" border size="small">
          <el-table-column
            prop="pickupRelationships"
            :label="$t('schoolBus.studentApply.detail.relation')"
            min-width="100"
          />
          <el-table-column
            prop="pickupPhone"
            :label="$t('schoolBus.studentApply.detail.phone')"
            width="140"
          />
          <el-table-column :label="$t('schoolBus.studentApply.detail.photo')" min-width="120">
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

import {
  approvalStatusOptions,
  paymentMethodOptions,
  paymentStatusOptions,
  pickupMethodOptions,
  studentLineTypeOptions
} from '../use-student-order-filters'

type Loose = Record<string, unknown>

const pickLabel = (
  options: { label: string; value: string | number }[],
  value: unknown
): string => {
  const hit = options.find((o) => String(o.value) === String(value ?? ''))
  return hit?.label ?? String(value ?? '--')
}

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

const loc = () => locale()

const canShowPayInfo = computed(
  () =>
    hasPermission('isshow_bus_intentionorder_pay_info') &&
    String(baseInfo.value?.approvalStatus ?? '') === '1'
)

const lookupCarNumber = (line: Loose, carinfoId: unknown): string => {
  const dto = line.busLineDTO as Loose | undefined
  const list = dto?.carList as Loose[] | undefined
  if (!Array.isArray(list) || carinfoId == null) {
    return '--'
  }
  const hit = list.find((c) => String(c.id) === String(carinfoId))
  return hit?.carNumber ? String(hit.carNumber) : '--'
}

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
    const locStr = loc()
    const schoolMapped = membershipSchoolLabel(schools, schoolId, locStr)
    const schoolDisplay = schoolMapped !== '--' ? schoolMapped : String(data.schoolEnName ?? '--')
    const approvalOpts = approvalStatusOptions(t)
    const paymentOpts = paymentStatusOptions(t)
    const pickupOpts = pickupMethodOptions(t)
    const payMethodOpts = paymentMethodOptions(t)
    const lineTypeOpts = studentLineTypeOptions(t)

    baseInfo.value = {
      id,
      schoolEnName: schoolDisplay,
      showSectionName:
        loc() === 'en' ? String(data.sectionEnName ?? '') : String(data.sectionCnName ?? ''),
      admissionNo: data.admissionNo,
      studentName: data.studentName,
      studentGrade: data.studentGrade,
      amountDue: data.amountDue,
      approvalStatus: data.approvalStatus,
      approvalStatusLabel: pickLabel(approvalOpts, data.approvalStatus),
      denyReason: data.denyReason,
      paymentStatus: data.paymentStatus,
      paymentStatusLabel: pickLabel(paymentOpts, data.paymentStatus),
      pickupMethod: data.pickupMethod,
      pickupMethodLabel: pickLabel(pickupOpts, data.pickupMethod),
      createTime: data.createTime ? dayjs(String(data.createTime)).format('YYYY-MM-DD HH:mm') : '',
      paymentAmount: data.paymentAmount,
      paymentMethodLabel: pickLabel(payMethodOpts, data.paymentMethod),
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
    routeTableData.value = lines.map((item) => ({
      lineName: loc() === 'en' ? item.lineEnName : item.lineCnName,
      stationName: loc() === 'en' ? item.stationEnName : item.stationCnName,
      lineTypeName: pickLabel(lineTypeOpts, item.studentLineType),
      ridingWeekDay: item.ridingWeekDay,
      carNumber: lookupCarNumber(item, item.carinfoId),
      ridingStartDay: item.ridingStartDay,
      ridingEndDay: item.ridingEndDay
    }))

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
.order-detail__loading {
  padding: 24px;
  text-align: center;
}

.order-detail__desc {
  margin-bottom: 16px;
}

.order-detail__pay {
  margin: 16px 0;
}

.order-detail__sign {
  margin: 16px 0;
}

.order-detail__sign-img {
  max-width: 240px;
  max-height: 120px;
  margin-top: 8px;
}

.order-detail__sub-title {
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 600;
}

.order-detail__thumb {
  width: 64px;
  height: 64px;
}
</style>
