<template>
  <el-dialog
    v-model="open"
    width="1000px"
    destroy-on-close
    :title="dialogTitle"
    :close-on-click-modal="false"
    @closed="onClosed"
  >
    <div v-if="innerVisible" class="bus-order-form">
      <div class="bus-order-form__scroll">
        <UniForm
          ref="mainUniFormRef"
          v-model="ruleForm"
          :mode="mainUniFormMode"
          :config="mainFormConfig"
        >
          <template #field-admissionNo>
            <el-autocomplete
              v-model="ruleForm.admissionNo"
              style="width: 100%"
              :fetch-suggestions="queryStudents"
              :trigger-on-focus="false"
              :debounce="300"
              clearable
              value-key="value"
              :placeholder="$t('schoolBus.studentApply.placeholders.keyword')"
              :disabled="mainDisabled"
              @select="onStudentPick"
            >
              <template #default="{ item }">
                <div>{{ suggestLine(item) }}</div>
              </template>
            </el-autocomplete>
          </template>
          <template #field-routeTableSlot>
            <div class="bus-order-form__block">
              <div class="bus-order-form__block-head">
                <span>{{ $t('schoolBus.studentOrder.form.routes') }}</span>
                <el-button
                  v-if="!mainDisabled && routeTableData.length < 2"
                  type="primary"
                  link
                  @click="openRouteAdd"
                >
                  {{ $t('schoolBus.studentOrder.form.addRoute') }}
                </el-button>
              </div>
              <el-table :data="routeTableData" border size="small">
                <el-table-column
                  prop="lineName"
                  :label="$t('schoolBus.studentApply.detail.routeLine')"
                  min-width="100"
                />
                <el-table-column
                  prop="stationName"
                  :label="$t('schoolBus.studentApply.detail.routeStation')"
                  min-width="100"
                />
                <el-table-column
                  prop="lineTypeName"
                  :label="$t('schoolBus.studentApply.detail.lineType')"
                  width="120"
                />
                <el-table-column
                  prop="weekDaysLabel"
                  :label="$t('schoolBus.studentOrder.form.dateOption')"
                  width="100"
                />
                <el-table-column
                  prop="ridingWeekDay"
                  :label="$t('schoolBus.studentApply.detail.ridingWeekDay')"
                  min-width="100"
                />
                <el-table-column
                  prop="ridingRange"
                  :label="$t('schoolBus.studentOrder.form.rideRange')"
                  width="200"
                />
                <el-table-column
                  prop="carNumber"
                  :label="$t('schoolBus.studentOrder.form.plate')"
                  width="100"
                />
                <el-table-column
                  :label="$t('schoolBus.studentOrder.form.ops')"
                  width="140"
                  fixed="right"
                >
                  <template #default="{ row, $index }">
                    <el-button type="primary" link @click="openRouteEdit(row, $index)">
                      {{ $t('schoolBus.driver.actions.edit') }}
                    </el-button>
                    <el-button v-if="!mainDisabled" type="danger" link @click="removeRoute($index)">
                      {{ $t('schoolBus.driver.actions.delete') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>

          <template #field-personTableSlot>
            <div class="bus-order-form__block">
              <div class="bus-order-form__block-head">
                <span>{{ $t('schoolBus.studentApply.detail.personTitle') }}</span>
                <el-button type="primary" link @click="openPersonAdd">
                  {{ $t('schoolBus.studentOrder.form.addPerson') }}
                </el-button>
              </div>
              <el-table :data="personTableData" border size="small">
                <el-table-column
                  prop="pickupRelationships"
                  :label="$t('schoolBus.studentApply.detail.relation')"
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
                      class="bus-order-form__thumb"
                    />
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('schoolBus.studentOrder.form.ops')"
                  width="140"
                  fixed="right"
                >
                  <template #default="{ row, $index }">
                    <el-button type="primary" link @click="openPersonEdit(row, $index)">
                      {{ $t('schoolBus.driver.actions.edit') }}
                    </el-button>
                    <el-button type="danger" link @click="removePerson($index)">
                      {{ $t('schoolBus.driver.actions.delete') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>

          <template #field-approvalStatusSlot>
            <el-radio-group
              v-if="formType === 'apply'"
              v-model="ruleForm.approvalStatus"
              :disabled="mainDisabled || String(ruleForm.approvalStatus ?? '') === '2'"
              @change="onApprovalChange"
            >
              <el-radio v-for="a in approvalOpts" :key="String(a.value)" :label="String(a.value)">
                {{ a.label }}
              </el-radio>
            </el-radio-group>
            <el-radio-group
              v-else
              v-model="ruleForm.approvalStatus"
              :disabled="mainDisabled"
              @change="onApprovalChange"
            >
              <el-radio label="1">{{ approvalOpts.find((x) => x.value === '1')?.label }}</el-radio>
            </el-radio-group>
          </template>

          <template #field-paymentStatusSlot>
            <el-radio-group
              v-if="formType === 'apply'"
              v-model="ruleForm.paymentStatus"
              :disabled="mainDisabled"
              @change="onPaymentChange"
            >
              <el-radio v-for="p in paymentOpts" :key="String(p.value)" :label="String(p.value)">
                <span>{{ p.label }}</span>
                <el-input-number
                  v-if="
                    canShowPayInfo &&
                      String(ruleForm.paymentStatus) === '2' &&
                      String(p.value) === '2'
                  "
                  v-model="ruleForm.paymentAmount"
                  class="bus-order-form__pay-inline"
                  :min="0"
                  :step="0.1"
                  :precision="2"
                  :disabled="mainDisabled || !canEditPayInfo"
                />
              </el-radio>
            </el-radio-group>
            <el-radio-group
              v-else
              v-model="ruleForm.paymentStatus"
              :disabled="mainDisabled"
              @change="onPaymentChange"
            >
              <el-radio label="2">
                {{ paymentOpts.find((x) => String(x.value) === '2')?.label }}
                <el-input-number
                  v-if="canShowPayInfo"
                  v-model="ruleForm.paymentAmount"
                  class="bus-order-form__pay-inline"
                  :min="0"
                  :step="0.1"
                  :precision="2"
                  :disabled="mainDisabled || !canEditPayInfo"
                />
              </el-radio>
            </el-radio-group>
          </template>

          <template #field-signImageUrl>
            <div class="bus-order-form__sign-block">
              <div class="bus-order-form__upload-row">
                <el-button :disabled="mainDisabled" @click="triggerSignPick">
                  {{ $t('schoolBus.car.actions.pickImage') }}
                </el-button>
              </div>
              <el-image
                v-if="ruleForm.signImageUrl"
                :src="String(ruleForm.signImageUrl)"
                fit="contain"
                class="bus-order-form__sign-image"
                :preview-src-list="[String(ruleForm.signImageUrl)]"
                preview-teleported
              />
            </div>
            <input
              ref="signFileRef"
              type="file"
              accept="image/*"
              class="bus-order-form__hidden-file"
              @change="onSignFile"
            >
          </template>

          <template #field-paymentDetailSlot>
            <el-row :gutter="16">
              <el-col :span="8">
                <div class="bus-order-form__nested-field">
                  <div class="bus-order-form__nested-label">
                    {{ $t('schoolBus.studentApply.detail.paymentMethod') }}
                  </div>
                  <el-select
                    v-model="ruleForm.paymentMethod"
                    style="width: 100%"
                    :disabled="mainDisabled || !canEditPayInfo"
                  >
                    <el-option
                      v-for="m in paymentMethodOpts"
                      :key="String(m.value)"
                      :label="m.label"
                      :value="m.value"
                    />
                  </el-select>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bus-order-form__nested-field">
                  <div class="bus-order-form__nested-label">
                    {{ $t('schoolBus.studentApply.detail.paymentDate') }}
                  </div>
                  <el-date-picker
                    v-model="ruleForm.paymentDate"
                    type="datetime"
                    style="width: 100%"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    :disabled="mainDisabled || !canEditPayInfo"
                  />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bus-order-form__nested-field">
                  <div class="bus-order-form__nested-label">
                    {{ $t('schoolBus.studentApply.detail.paymentAccount') }}
                  </div>
                  <el-input
                    v-model="ruleForm.paymentAccount"
                    :disabled="mainDisabled || !canEditPayInfo"
                  />
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="8">
                <div class="bus-order-form__nested-field">
                  <div class="bus-order-form__nested-label">
                    {{ $t('schoolBus.studentApply.detail.paymentOrderNo') }}
                  </div>
                  <el-input
                    v-model="ruleForm.paymentOrderNo"
                    :disabled="mainDisabled || !canEditPayInfo"
                  />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bus-order-form__nested-field">
                  <div class="bus-order-form__nested-label">
                    {{ $t('schoolBus.studentApply.detail.receivingAccount') }}
                  </div>
                  <el-input
                    v-model="ruleForm.receivingAccount"
                    :disabled="mainDisabled || !canEditPayInfo"
                  />
                </div>
              </el-col>
            </el-row>
          </template>
        </UniForm>
      </div>

      <div v-if="!mainDisabled" class="bus-order-form__footer-btns">
        <el-button @click="close">{{ $t('schoolBus.driver.actions.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">
          {{ $t('schoolBus.driver.actions.submit') }}
        </el-button>
      </div>
    </div>

    <el-dialog
      v-model="routeDialogVisible"
      width="480px"
      append-to-body
      :title="routeDialogTitle"
      destroy-on-close
      @closed="resetRouteForm"
    >
      <UniForm
        ref="routeUniFormRef"
        v-model="routeForm"
        mode="edit"
        :config="routeDialogFormConfig"
      >
        <template #field-ridingWeekDay>
          <el-select
            v-model="routeFormRidingWeekMulti"
            multiple
            clearable
            style="width: 100%"
            :disabled="mainDisabled"
          >
            <el-option v-for="d in ridingWeekDaySelectOpts" :key="d" :label="d" :value="d" />
          </el-select>
        </template>
        <template #field-ridingDay>
          <el-date-picker
            v-model="routeForm.ridingDay"
            type="daterange"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledRidingDate"
            :disabled="mainDisabled"
            @change="onRidingRangeChange"
          />
        </template>
      </UniForm>
      <template #footer>
        <el-button @click="routeDialogVisible = false">
          {{ $t('schoolBus.driver.actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitRoute">
          {{ $t('schoolBus.driver.actions.submit') }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="personDialogVisible"
      width="400px"
      append-to-body
      :title="personDialogTitle"
      destroy-on-close
      @closed="resetPersonForm"
    >
      <UniForm
        ref="personUniFormRef"
        v-model="personForm"
        mode="edit"
        :config="personDialogFormConfig"
      >
        <template #field-pickupImageUrl>
          <div class="bus-order-form__upload-row">
            <el-button @click="triggerPersonPick">
              {{ $t('schoolBus.car.actions.pickImage') }}
            </el-button>
            <span v-if="personForm.pickupImageUrl" class="bus-order-form__url">{{
              personForm.pickupImageUrl
            }}</span>
          </div>
          <input
            ref="personFileRef"
            type="file"
            accept="image/*"
            class="bus-order-form__hidden-file"
            @change="onPersonFile"
          >
        </template>
      </UniForm>
      <template #footer>
        <el-button @click="personDialogVisible = false">
          {{ $t('schoolBus.driver.actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitPerson">
          {{ $t('schoolBus.driver.actions.submit') }}
        </el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, useUniI18n, useUniPermission } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import {
  approvalStatusOptions,
  paymentMethodOptions,
  paymentStatusOptions,
  pickupMethodOptions,
  studentLineTypeOptions
} from '../use-student-order-filters'

import { protocolApi, schoolBusCommonApi, schoolBusOrderApi } from '@/api'
import type { BusOrderFormModel } from '@/types/modules/school-bus-order'

type Loose = Record<string, unknown>

type StudentSuggest = {
  value: string
  admissonNo?: string
  fullName?: string
  grade?: string
}

type SectionRow = {
  id: string | number
  cnName?: string
  enName?: string
  serviceStartDate?: string
  serviceEndDate?: string
}
type LineRow = { id: string | number; cnName?: string; enName?: string }
type CarRow = { id: string | number; carNumber?: string }
type OrderStationRow = {
  id: string | number
  weekDays?: string
  stationPrices?: Array<{
    id: string | number
    stationId?: string | number
    busStationDTO?: { cnName?: string; enName?: string }
  }>
}
type RouteRow = Loose
type PersonRow = { pickupRelationships?: string; pickupPhone?: string; pickupImageUrl?: string }

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit'
  orderId: string | number | null
  formType: 'apply' | 'order'
  schoolOptions: UniOption[]
  defaultSchoolId: string | number | null
  multiSchool: boolean
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  saved: []
}>()

const { locale, t } = useUniI18n()
const { hasPermission } = useUniPermission()

const open = computed({
  get: () => props.visible,
  set: (v: boolean) => emit('update:visible', v)
})

const innerVisible = ref(false)
const mainUniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const routeUniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const personUniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const signFileRef = ref<HTMLInputElement | null>(null)
const personFileRef = ref<HTMLInputElement | null>(null)

const submitting = ref(false)
const canComputedPrice = ref(true)

const ruleForm = ref<BusOrderFormModel>({})
const routeTableData = ref<RouteRow[]>([])
const personTableData = ref<PersonRow[]>([])

const selectSectionList = ref<SectionRow[]>([])
const selectLineList = ref<LineRow[]>([])
const weekDaysList = ref<OrderStationRow[]>([])
const carList = ref<CarRow[]>([])
const routeStationSelectList = ref<
  Array<{ id: string | number; stationId?: string | number; enName?: string; cnName?: string }>
>([])
const ridingWeekDaySelectOpts = ref<string[]>([])

const routeDialogVisible = ref(false)
const routeModalMode = ref<'add' | 'edit'>('add')
const routeEditIndex = ref(-1)
const routeForm = ref<Loose>({})

const personDialogVisible = ref(false)
const personModalMode = ref<'add' | 'edit'>('add')
const personEditIndex = ref(-1)
const personForm = ref<PersonRow>({})

const approvalOpts = computed(() => approvalStatusOptions(t))
const paymentOpts = computed(() =>
  paymentStatusOptions(t).map((p) => ({ ...p, value: String(p.value) }))
)
const pickupOpts = computed(() => pickupMethodOptions(t))
const lineTypeOpts = computed(() => studentLineTypeOptions(t))
const paymentMethodOpts = computed(() => paymentMethodOptions(t))

const sectionUniOptions = computed<UniOption[]>(() =>
  selectSectionList.value.map((s) => ({
    label: sectionLabel(s),
    value: s.id
  }))
)

const loc = () => locale()

const sectionLabel = (s: SectionRow) =>
  loc() === 'en' ? String(s.enName ?? s.cnName ?? '') : String(s.cnName ?? s.enName ?? '')
const lineLabel = (l: LineRow) =>
  loc() === 'en' ? String(l.enName ?? l.cnName ?? '') : String(l.cnName ?? l.enName ?? '')
const stationOptLabel = (s: { enName?: string; cnName?: string }) =>
  loc() === 'en' ? String(s.enName ?? s.cnName ?? '') : String(s.cnName ?? s.enName ?? '')

const dialogTitle = computed(() =>
  props.mode === 'add' ? t('schoolBus.driver.actions.add') : t('schoolBus.driver.actions.edit')
)

const routeDialogTitle = computed(() =>
  routeModalMode.value === 'add'
    ? t('schoolBus.driver.actions.add')
    : t('schoolBus.driver.actions.edit')
)

const personDialogTitle = computed(() =>
  personModalMode.value === 'add'
    ? t('schoolBus.driver.actions.add')
    : t('schoolBus.driver.actions.edit')
)

const mainDisabled = computed(() => {
  if (props.mode === 'add') {
    return false
  }
  return String(ruleForm.value.paymentStatus ?? '') === '2'
})

const canShowPayInfo = computed(() => hasPermission('isshow_bus_intentionorder_pay_info'))
const canEditPayInfo = computed(() => hasPermission('isedit_bus_intentionorder_pay_info'))

const paymentRulesRequired = ref(false)

const mainRules = computed<FormRules>(() => ({
  schoolId: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleSelect'), trigger: 'change' }
  ],
  sectionId: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleSelect'), trigger: 'change' }
  ],
  admissionNo: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleInput'), trigger: 'blur' }
  ],
  pickupMethod: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleSelect'), trigger: 'change' }
  ],
  denyReason: [
    {
      required: String(ruleForm.value.approvalStatus ?? '') === '2',
      message: t('schoolBus.studentOrder.form.ruleInput'),
      trigger: 'blur'
    }
  ],
  paymentMethod: [
    {
      required: paymentRulesRequired.value,
      message: t('schoolBus.studentOrder.form.ruleSelect'),
      trigger: 'change'
    }
  ],
  paymentDate: [
    {
      required: paymentRulesRequired.value,
      message: t('schoolBus.studentOrder.form.ruleSelect'),
      trigger: 'change'
    }
  ],
  paymentAmount: [
    {
      required: paymentRulesRequired.value,
      message: t('schoolBus.studentOrder.form.ruleInput'),
      trigger: 'blur'
    }
  ]
}))

const routeRules = computed<FormRules>(() => ({
  lineId: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleSelect'), trigger: 'change' }
  ],
  studentLineType: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleSelect'), trigger: 'change' }
  ],
  weekDaysId: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleSelect'), trigger: 'change' }
  ],
  ridingWeekDay: [
    {
      validator: (_r, _v, cb) => {
        const v = routeForm.value.ridingWeekDay
        const ok = Array.isArray(v) ? v.length > 0 : Boolean(v)
        if (ok) {
          cb()
        } else {
          cb(new Error(t('schoolBus.studentOrder.form.ruleSelect')))
        }
      },
      trigger: 'change'
    }
  ],
  stationPriceId: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleSelect'), trigger: 'change' }
  ],
  ridingDay: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleSelect'), trigger: 'change' }
  ]
}))

const personRules = computed<FormRules>(() => ({
  pickupRelationships: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleInput'), trigger: 'blur' }
  ],
  pickupPhone: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleInput'), trigger: 'blur' }
  ],
  pickupImageUrl: [
    { required: true, message: t('schoolBus.studentOrder.form.ruleUpload'), trigger: 'change' }
  ]
}))

const routeFormRidingWeekMulti = computed<string[] | string | undefined>({
  get() {
    const v = routeForm.value.ridingWeekDay
    if (Array.isArray(v)) {
      return v.map(String)
    }
    if (typeof v === 'string' && v) {
      return v.split(',').filter(Boolean)
    }
    return []
  },
  set(next: string[] | string | undefined) {
    if (Array.isArray(next)) {
      routeForm.value.ridingWeekDay = next
    } else {
      routeForm.value.ridingWeekDay = next ? String(next).split(',') : []
    }
  }
})

const pickArray = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[]
  }
  if (payload && typeof payload === 'object') {
    const data = (payload as Loose).data
    if (Array.isArray(data)) {
      return data as Record<string, unknown>[]
    }
  }
  return []
}

const unwrapDetail = (payload: unknown): Loose | null => {
  if (!payload || typeof payload !== 'object') {
    return null
  }
  const d = (payload as Loose).data
  if (d && typeof d === 'object') {
    return d as Loose
  }
  return payload as Loose
}

const syncRouteLineTypeName = () => {
  const v = String(routeForm.value.studentLineType ?? '')
  const hit = lineTypeOpts.value.find((o) => String(o.value) === v)
  routeForm.value.lineTypeName = hit?.label ?? ''
}

const disabledRidingDate = (time: Date) => {
  const sid = ruleForm.value.sectionId
  const sec = selectSectionList.value.find((s) => String(s.id) === String(sid))
  if (!sec?.serviceStartDate || !sec?.serviceEndDate) {
    return false
  }
  const start = new Date(sec.serviceStartDate).setHours(0, 0, 0, 0)
  const end = new Date(sec.serviceEndDate).setHours(23, 59, 59, 999)
  const t0 = time.getTime()
  return t0 < start || t0 > end
}

const refreshPicker = () => {
  /* touch section list ref for date picker */
  selectSectionList.value = [...selectSectionList.value]
}

const resetAll = () => {
  ruleForm.value = {}
  routeTableData.value = []
  personTableData.value = []
  selectSectionList.value = []
  selectLineList.value = []
  weekDaysList.value = []
  carList.value = []
  routeStationSelectList.value = []
  ridingWeekDaySelectOpts.value = []
  canComputedPrice.value = true
  paymentRulesRequired.value = false
  nextTick(() => mainUniFormRef.value?.clearValidate())
}

const applyDefaultStatusForAdd = () => {
  ruleForm.value = {
    ...ruleForm.value,
    approvalStatus: props.formType === 'apply' ? '0' : '1',
    paymentStatus: props.formType === 'apply' ? '1' : '2'
  }
  if (props.formType === 'order') {
    onPaymentChange('1')
  }
}

const loadDetail = async (id: string | number) => {
  canComputedPrice.value = false
  const raw = await schoolBusOrderApi.detail.get(id)
  const data = unwrapDetail(raw)
  if (!data) {
    return
  }
  const schoolId = data.schoolId as string | number
  selectSectionList.value = pickArray(
    await schoolBusCommonApi.sectionList.get({ schoolIds: schoolId })
  ) as SectionRow[]
  const sectionId = data.sectionId
  selectLineList.value = pickArray(
    await schoolBusCommonApi.lineList.get({ schoolIds: schoolId, sectionId, isAll: 0 })
  ) as LineRow[]

  const orderLines = Array.isArray(data.orderLines) ? (data.orderLines as Loose[]) : []
  let weeks: OrderStationRow[] = []
  if (orderLines.length > 0) {
    const lineId = orderLines[0].lineId
    weeks = pickArray(
      await schoolBusCommonApi.orderStationList.get({ schoolIds: schoolId, lineId })
    ) as OrderStationRow[]
  }
  weekDaysList.value = weeks

  ruleForm.value = {
    id: data.id,
    schoolId,
    sectionId,
    admissionNo: data.admissionNo,
    pickupMethod: String(data.pickupMethod ?? ''),
    studentName: data.studentName,
    studentGrade: data.studentGrade,
    amountDue: data.amountDue as number | undefined,
    approvalStatus: String(data.approvalStatus ?? ''),
    denyReason: data.denyReason,
    paymentStatus: String(data.paymentStatus ?? ''),
    paymentAmount: data.paymentAmount as number | undefined,
    signImageUrl: data.signImageUrl,
    paymentMethod: data.paymentMethod,
    paymentDate: data.paymentDate,
    paymentAccount: data.paymentAccount,
    paymentOrderNo: data.paymentOrderNo,
    receivingAccount: data.receivingAccount
  }

  paymentRulesRequired.value = String(ruleForm.value.paymentStatus) === '1'

  const parents = Array.isArray(data.parentInfos) ? (data.parentInfos as Loose[]) : []
  personTableData.value = parents.map((item) => ({
    pickupRelationships: String(item.pickupRelationships ?? ''),
    pickupPhone: String(item.pickupPhone ?? ''),
    pickupImageUrl: item.pickupImageUrl ? String(item.pickupImageUrl) : ''
  }))

  routeTableData.value = orderLines.map((item) => {
    const ridingWeekDay = item.ridingWeekDay ? String(item.ridingWeekDay) : ''
    const start = item.ridingStartDay ? String(item.ridingStartDay) : ''
    const end = item.ridingEndDay ? String(item.ridingEndDay) : ''
    const weekId = item.weekdaysId ?? item.weekDaysId
    const weekRow = weeks.find((w) => String(w.id) === String(weekId))
    const stPriceId = item.stationPriceId
    let stationName = ''
    if (weekRow?.stationPrices) {
      const sp = weekRow.stationPrices.find((x) => String(x.id) === String(stPriceId))
      const dto = sp?.busStationDTO
      stationName = loc() === 'en' ? String(dto?.enName ?? '') : String(dto?.cnName ?? '')
    }
    const lineTypeLabel =
      lineTypeOpts.value.find((o) => String(o.value) === String(item.studentLineType))?.label ?? ''
    const carinfoId = item.carinfoId
    let carNumber = ''
    const lineDto = item.busLineDTO as Loose | undefined
    const cars = lineDto?.carList as CarRow[] | undefined
    if (Array.isArray(cars) && carinfoId != null) {
      carNumber = String(cars.find((c) => String(c.id) === String(carinfoId))?.carNumber ?? '')
    }
    return {
      lineId: item.lineId,
      lineName: loc() === 'en' ? String(item.lineEnName ?? '') : String(item.lineCnName ?? ''),
      stationId: item.stationId,
      stationPriceId: stPriceId,
      stationName,
      weekDaysId: weekId,
      weekDaysLabel: weekRow ? String(weekRow.weekDays ?? '') : '',
      studentLineType: String(item.studentLineType ?? ''),
      lineTypeName: lineTypeLabel,
      ridingStartDay: start,
      ridingEndDay: end,
      ridingWeekDay,
      ridingRange: start && end ? `${start} ~ ${end}` : '',
      carinfoId,
      carNumber
    }
  })

  setTimeout(() => {
    canComputedPrice.value = true
  }, 400)
}

watch(
  () => props.visible,
  async (vis) => {
    if (!vis) {
      innerVisible.value = false
      return
    }
    innerVisible.value = true
    resetAll()
    if (props.mode === 'add') {
      ruleForm.value.schoolId = props.multiSchool ? undefined : (props.defaultSchoolId ?? undefined)
      if (ruleForm.value.schoolId != null) {
        selectSectionList.value = pickArray(
          await schoolBusCommonApi.sectionList.get({ schoolIds: ruleForm.value.schoolId })
        ) as SectionRow[]
      }
      canComputedPrice.value = true
      applyDefaultStatusForAdd()
      return
    }
    if (props.orderId != null) {
      await loadDetail(props.orderId)
    }
  }
)

watch(
  () => routeTableData.value,
  async () => {
    if (!canComputedPrice.value || routeTableData.value.length === 0) {
      return
    }
    const lines = routeTableData.value.map((item) => ({
      lineId: Number(item.lineId),
      stationId: Number(item.stationId),
      stationPriceId: Number(item.stationPriceId),
      studentLineType: Number(item.studentLineType),
      weekDaysId: Number(item.weekDaysId)
    }))
    try {
      const amount = await schoolBusOrderApi.getLineStationPrice.post(
        lines as unknown as Record<string, unknown>
      )
      let num: number
      if (typeof amount === 'number') {
        num = amount
      } else if (amount && typeof amount === 'object' && 'data' in amount) {
        const inner = (amount as Loose).data
        num = typeof inner === 'number' ? inner : Number(inner)
      } else {
        num = Number(amount)
      }
      if (Number.isFinite(num)) {
        ruleForm.value.amountDue = num
        if (String(ruleForm.value.paymentStatus) === '2') {
          ruleForm.value.paymentAmount = num
        }
      }
    } catch {
      /* request 已提示 */
    }
  },
  { deep: true }
)

const onClosed = () => {
  resetAll()
  emit('update:visible', false)
}

const close = () => {
  open.value = false
}

const onSchoolChange = async (sid: string | number | undefined) => {
  ruleForm.value.sectionId = undefined
  ruleForm.value.admissionNo = undefined
  ruleForm.value.studentName = undefined
  ruleForm.value.studentGrade = undefined
  routeTableData.value = []
  selectLineList.value = []
  if (sid == null) {
    selectSectionList.value = []
    return
  }
  selectSectionList.value = pickArray(
    await schoolBusCommonApi.sectionList.get({ schoolIds: sid })
  ) as SectionRow[]
  refreshPicker()
}

const onSectionChange = async (secId: string | number | undefined) => {
  routeTableData.value = []
  refreshPicker()
  const sid = ruleForm.value.schoolId
  if (sid == null || secId == null) {
    selectLineList.value = []
    return
  }
  selectLineList.value = pickArray(
    await schoolBusCommonApi.lineList.get({ schoolIds: sid, sectionId: secId, isAll: 0 })
  ) as LineRow[]
}

const suggestLine = (raw: unknown) => {
  const item = raw as StudentSuggest
  const adm = item.admissonNo ?? item.value ?? ''
  return `${adm} — ${item.fullName ?? ''}`
}

const fetchStudentSuggestList = async (queryString: string): Promise<StudentSuggest[]> => {
  const schoolId = ruleForm.value.schoolId
  const q = queryString?.trim() ?? ''
  if (!schoolId || !q) {
    return []
  }
  try {
    const raw = await schoolBusOrderApi.getStudentInfoList.get({
      schoolId,
      admissionNo: q
    })
    return pickArray(raw).map((item) => {
      const adm = String(item.admissonNo ?? item.admissionNo ?? '')
      return {
        ...item,
        value: adm,
        admissonNo: adm,
        fullName: String(item.fullName ?? ''),
        grade: String(item.grade ?? '')
      } as StudentSuggest
    })
  } catch {
    return []
  }
}

const queryStudents = async (queryString: string, cb: (arg: StudentSuggest[]) => void) => {
  const list = await fetchStudentSuggestList(queryString)
  cb(list)
}

const onStudentPick = (item: Record<string, unknown>) => {
  const s = item as StudentSuggest
  ruleForm.value.studentName = s.fullName
  ruleForm.value.studentGrade = s.grade
  ruleForm.value.admissionNo = s.admissonNo ?? s.value
}

const openRouteAdd = () => {
  routeModalMode.value = 'add'
  routeEditIndex.value = -1
  routeForm.value = {}
  const sec = selectSectionList.value.find((s) => String(s.id) === String(ruleForm.value.sectionId))
  if (sec?.serviceStartDate && sec?.serviceEndDate) {
    routeForm.value.ridingDay = [sec.serviceStartDate, sec.serviceEndDate]
    routeForm.value.ridingStartDay = sec.serviceStartDate
    routeForm.value.ridingEndDay = sec.serviceEndDate
  }
  weekDaysList.value = []
  carList.value = []
  routeStationSelectList.value = []
  ridingWeekDaySelectOpts.value = []
  routeDialogVisible.value = true
  nextTick(() => routeUniFormRef.value?.clearValidate())
}

const openRouteEdit = async (row: RouteRow, index: number) => {
  routeModalMode.value = 'edit'
  routeEditIndex.value = index
  const schoolId = ruleForm.value.schoolId
  if (schoolId == null) {
    return
  }
  weekDaysList.value = pickArray(
    await schoolBusCommonApi.orderStationList.get({ schoolIds: schoolId, lineId: row.lineId })
  ) as OrderStationRow[]
  carList.value = pickArray(
    await schoolBusCommonApi.carinfoList.get({ isAll: 0, lineId: row.lineId })
  ) as CarRow[]
  const weekId = row.weekDaysId
  const week = weekDaysList.value.find((w) => String(w.id) === String(weekId))
  if (week?.stationPrices) {
    routeStationSelectList.value = week.stationPrices.map((sp) => ({
      id: sp.id,
      stationId: sp.stationId,
      enName: sp.busStationDTO?.enName,
      cnName: sp.busStationDTO?.cnName
    }))
  }
  const rw = row.ridingWeekDay ? String(row.ridingWeekDay).split(',').filter(Boolean) : []
  ridingWeekDaySelectOpts.value = week?.weekDays
    ? String(week.weekDays).split(',').filter(Boolean)
    : rw

  const start = String(row.ridingStartDay ?? '')
  const end = String(row.ridingEndDay ?? '')
  routeForm.value = {
    ...row,
    ridingWeekDay: rw.length ? rw : ridingWeekDaySelectOpts.value,
    ridingDay: start && end ? [start, end] : []
  }
  syncRouteLineTypeName()
  routeDialogVisible.value = true
  nextTick(() => routeUniFormRef.value?.clearValidate())
}

const removeRoute = async (index: number) => {
  try {
    await ElMessageBox.confirm(
      t('schoolBus.studentOrder.messages.confirmDelete'),
      t('schoolBus.driver.actions.delete'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  routeTableData.value.splice(index, 1)
}

const onRouteLineChange = async (lineId: string | number | undefined) => {
  routeForm.value.stationPriceId = undefined
  routeForm.value.carinfoId = undefined
  routeForm.value.carNumber = undefined
  routeForm.value.weekDaysId = undefined
  routeForm.value.ridingWeekDay = []
  routeStationSelectList.value = []
  ridingWeekDaySelectOpts.value = []
  const schoolId = ruleForm.value.schoolId
  if (lineId == null || schoolId == null) {
    weekDaysList.value = []
    carList.value = []
    return
  }
  selectLineList.value.forEach((item) => {
    if (String(item.id) === String(lineId)) {
      routeForm.value.lineName = lineLabel(item)
    }
  })
  carList.value = pickArray(
    await schoolBusCommonApi.carinfoList.get({ isAll: 0, lineId })
  ) as CarRow[]
  if (carList.value.length === 1) {
    routeForm.value.carinfoId = carList.value[0].id
    routeForm.value.carNumber = carList.value[0].carNumber
  }
  weekDaysList.value = pickArray(
    await schoolBusCommonApi.orderStationList.get({ schoolIds: schoolId, lineId })
  ) as OrderStationRow[]
}

const onCarChange = (id: string | number | undefined) => {
  const hit = carList.value.find((c) => String(c.id) === String(id))
  routeForm.value.carNumber = hit?.carNumber
}

const onWeekDaysChange = (weekId: string | number | undefined) => {
  routeForm.value.stationPriceId = undefined
  routeForm.value.ridingWeekDay = []
  const week = weekDaysList.value.find((w) => String(w.id) === String(weekId))
  if (!week?.stationPrices) {
    routeStationSelectList.value = []
    ridingWeekDaySelectOpts.value = []
    return
  }
  routeStationSelectList.value = week.stationPrices.map((sp) => ({
    id: sp.id,
    stationId: sp.stationId,
    enName: sp.busStationDTO?.enName,
    cnName: sp.busStationDTO?.cnName
  }))
  ridingWeekDaySelectOpts.value = week.weekDays
    ? String(week.weekDays).split(',').filter(Boolean)
    : []
  routeForm.value.ridingWeekDay = [...ridingWeekDaySelectOpts.value]
  routeForm.value.weekDaysLabel = String(week.weekDays ?? '')
}

const onStationChange = (priceId: string | number | undefined) => {
  const hit = routeStationSelectList.value.find((s) => String(s.id) === String(priceId))
  if (hit) {
    routeForm.value.stationId = hit.stationId
    routeForm.value.stationName = stationOptLabel(hit)
  }
}

const onRidingRangeChange = (val: string[] | null) => {
  if (val && val.length === 2) {
    routeForm.value.ridingStartDay = val[0]
    routeForm.value.ridingEndDay = val[1]
  } else {
    routeForm.value.ridingStartDay = undefined
    routeForm.value.ridingEndDay = undefined
  }
}

const lineSelectOptions = computed<UniOption[]>(() =>
  selectLineList.value.map((l) => ({
    label: lineLabel(l),
    value: l.id
  }))
)

const routeCarSelectOptions = computed<UniOption[]>(() =>
  carList.value.map((c) => ({
    label: String(c.carNumber ?? c.id),
    value: c.id
  }))
)

const weekSelectOptions = computed<UniOption[]>(() =>
  weekDaysList.value.map((w) => ({
    label: String(w.weekDays ?? w.id),
    value: w.id
  }))
)

const stationPriceSelectOptions = computed<UniOption[]>(() =>
  routeStationSelectList.value.map((s) => ({
    label: stationOptLabel(s),
    value: s.id
  }))
)

const routeDialogFormConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top', disabled: mainDisabled.value },
  rowProps: { gutter: 0 },
  colProps: { span: 24 },
  rules: routeRules.value as UniFormConfig['rules'],
  schema: [
    {
      field: 'lineId',
      label: t('schoolBus.studentApply.detail.routeLine'),
      component: 'ElSelect',
      options: lineSelectOptions.value,
      onChange: async (ctx) => {
        await onRouteLineChange(ctx.model.lineId as string | number | undefined)
      },
      componentProps: { filterable: true, style: { width: '100%' } }
    },
    {
      field: 'studentLineType',
      label: t('schoolBus.studentApply.detail.lineType'),
      component: 'ElSelect',
      options: lineTypeOpts.value,
      onChange: () => {
        syncRouteLineTypeName()
      },
      componentProps: { style: { width: '100%' } }
    },
    {
      field: 'carinfoId',
      label: t('schoolBus.studentOrder.form.plate'),
      component: 'ElSelect',
      options: routeCarSelectOptions.value,
      onChange: (ctx) => {
        onCarChange(ctx.model.carinfoId as string | number | undefined)
      },
      componentProps: { clearable: true, style: { width: '100%' } }
    },
    {
      field: 'weekDaysId',
      label: t('schoolBus.studentOrder.form.dateOption'),
      component: 'ElSelect',
      options: weekSelectOptions.value,
      onChange: (ctx) => {
        onWeekDaysChange(ctx.model.weekDaysId as string | number | undefined)
      },
      componentProps: { clearable: true, style: { width: '100%' } }
    },
    {
      field: 'ridingWeekDay',
      label: t('schoolBus.studentApply.detail.ridingWeekDay'),
      component: 'ElInput',
      formItemProps: { class: 'bus-order-form__route-slot' }
    },
    {
      field: 'ridingDay',
      label: t('schoolBus.studentOrder.form.rideRange'),
      component: 'ElInput',
      formItemProps: { class: 'bus-order-form__route-slot' }
    },
    {
      field: 'stationPriceId',
      label: t('schoolBus.studentApply.detail.routeStation'),
      component: 'ElSelect',
      options: stationPriceSelectOptions.value,
      onChange: (ctx) => {
        onStationChange(ctx.model.stationPriceId as string | number | undefined)
      },
      componentProps: { filterable: true, style: { width: '100%' } }
    }
  ]
}))

const personDialogFormConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 0 },
  colProps: { span: 24 },
  rules: personRules.value as UniFormConfig['rules'],
  schema: [
    {
      field: 'pickupRelationships',
      label: t('schoolBus.studentApply.detail.relation'),
      component: 'ElInput',
      componentProps: { maxlength: 50 }
    },
    {
      field: 'pickupPhone',
      label: t('schoolBus.studentApply.detail.phone'),
      component: 'ElInput',
      componentProps: { maxlength: 50 }
    },
    {
      field: 'pickupImageUrl',
      label: t('schoolBus.studentApply.detail.photo'),
      component: 'ElInput',
      formItemProps: { class: 'bus-order-form__route-slot' }
    }
  ]
}))

const submitRoute = async () => {
  const valid = await routeUniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  const rf = { ...routeForm.value }
  const ridingWeekDayStr = Array.isArray(rf.ridingWeekDay)
    ? rf.ridingWeekDay.join(',')
    : String(rf.ridingWeekDay ?? '')
  syncRouteLineTypeName()
  const lineHit = selectLineList.value.find((l) => String(l.id) === String(rf.lineId))
  const weekHit = weekDaysList.value.find((w) => String(w.id) === String(rf.weekDaysId))
  const row: RouteRow = {
    ...rf,
    lineName: rf.lineName ?? (lineHit ? lineLabel(lineHit) : ''),
    weekDaysLabel: rf.weekDaysLabel ?? (weekHit ? String(weekHit.weekDays ?? '') : ''),
    ridingWeekDay: ridingWeekDayStr,
    ridingRange:
      rf.ridingStartDay && rf.ridingEndDay ? `${rf.ridingStartDay} ~ ${rf.ridingEndDay}` : ''
  }
  if (routeModalMode.value === 'add') {
    routeTableData.value.push(row)
  } else if (routeEditIndex.value >= 0) {
    routeTableData.value.splice(routeEditIndex.value, 1, row)
  }
  routeDialogVisible.value = false
}

const resetRouteForm = () => {
  routeForm.value = {}
  routeEditIndex.value = -1
}

const openPersonAdd = () => {
  personModalMode.value = 'add'
  personEditIndex.value = -1
  personForm.value = {}
  personDialogVisible.value = true
  nextTick(() => personUniFormRef.value?.clearValidate())
}

const openPersonEdit = (row: PersonRow, index: number) => {
  personModalMode.value = 'edit'
  personEditIndex.value = index
  personForm.value = { ...row }
  personDialogVisible.value = true
  nextTick(() => personUniFormRef.value?.clearValidate())
}

const removePerson = async (index: number) => {
  try {
    await ElMessageBox.confirm(
      t('schoolBus.studentOrder.messages.confirmDelete'),
      t('schoolBus.driver.actions.delete'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  personTableData.value.splice(index, 1)
}

const submitPerson = async () => {
  const valid = await personUniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  const row = { ...personForm.value }
  if (personModalMode.value === 'add') {
    personTableData.value.push(row)
  } else if (personEditIndex.value >= 0) {
    personTableData.value.splice(personEditIndex.value, 1, row)
  }
  personDialogVisible.value = false
}

const resetPersonForm = () => {
  personForm.value = {}
  personEditIndex.value = -1
}

const triggerSignPick = () => signFileRef.value?.click()
const triggerPersonPick = () => personFileRef.value?.click()

const onSignFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || mainDisabled.value) {
    return
  }
  try {
    ruleForm.value.signImageUrl = await protocolApi.upload.post(file)
  } catch {
    ElMessage.error(t('schoolBus.car.messages.uploadFail'))
  }
}

const onPersonFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  try {
    personForm.value.pickupImageUrl = await protocolApi.upload.post(file)
    nextTick(() => {
      const exposed = personUniFormRef.value as unknown as
        | { validateField?: (prop: string | string[]) => Promise<unknown> }
        | null
        | undefined
      void exposed?.validateField?.('pickupImageUrl')?.catch(() => undefined)
    })
  } catch {
    ElMessage.error(t('schoolBus.car.messages.uploadFail'))
  }
}

const onApprovalChange = () => {
  if (String(ruleForm.value.approvalStatus) !== '2') {
    ruleForm.value.denyReason = undefined
  }
}

const onPaymentChange = (e?: string | number | boolean) => {
  const v = e != null ? String(e) : String(ruleForm.value.paymentStatus ?? '')
  paymentRulesRequired.value = v === '1'
  if (v === '2') {
    ruleForm.value.paymentAmount = ruleForm.value.amountDue as number | undefined
  } else {
    ruleForm.value.paymentAmount = undefined
  }
}

const mainUniFormMode = computed(() => (mainDisabled.value ? 'view' : 'edit'))

const mainFormConfig = computed<UniFormConfig>(() => {
  const hidePerson = String(ruleForm.value.pickupMethod ?? '') !== '2'
  const hideDeny = String(ruleForm.value.approvalStatus ?? '') !== '2'
  const showPaymentRadios = String(ruleForm.value.approvalStatus ?? '') === '1'
  const showPayDetail = canShowPayInfo.value && String(ruleForm.value.paymentStatus) === '2'

  return {
    // 审批/缴费联动会更新 rules；关闭「规则变更即校验」，避免点选审批状态就刷出其它必填项红字
    formProps: { labelPosition: 'top', validateOnRuleChange: false },
    rowProps: { gutter: 16 },
    colProps: { span: 8 },
    rules: (mainDisabled.value ? {} : mainRules.value) as UniFormConfig['rules'],
    schema: [
      {
        field: 'schoolId',
        label: t('schoolBus.studentOrder.form.school'),
        component: 'ElSelect',
        options: props.schoolOptions,
        onChange: async (ctx) => {
          await onSchoolChange(ctx.model.schoolId as string | number | undefined)
        },
        componentProps: {
          filterable: true,
          clearable: true,
          placeholder: t('schoolBus.studentApply.placeholders.school'),
          style: { width: '100%' }
        }
      },
      {
        field: 'sectionId',
        label: t('schoolBus.studentOrder.form.section'),
        component: 'ElSelect',
        options: sectionUniOptions.value,
        onChange: async (ctx) => {
          await onSectionChange(ctx.model.sectionId as string | number | undefined)
        },
        componentProps: {
          filterable: true,
          clearable: true,
          placeholder: t('schoolBus.studentApply.placeholders.section'),
          style: { width: '100%' }
        }
      },
      {
        field: 'admissionNo',
        label: t('schoolBus.studentOrder.form.admissionNo'),
        component: 'ElInput',
        formItemProps: { class: 'bus-order-form__main-field-slot' }
      },
      {
        field: 'studentName',
        label: t('schoolBus.studentOrder.form.studentName'),
        component: 'ElInput',
        componentProps: { disabled: true }
      },
      {
        field: 'studentGrade',
        label: t('schoolBus.studentOrder.form.grade'),
        component: 'ElInput',
        componentProps: { disabled: true }
      },
      {
        field: 'amountDue',
        label: t('schoolBus.studentOrder.form.amountDue'),
        component: 'ElInputNumber',
        componentProps: {
          min: 0,
          step: 0.1,
          precision: 2,
          style: { width: '100%' }
        }
      },
      {
        field: 'pickupMethod',
        label: t('schoolBus.studentOrder.form.pickupMethod'),
        component: 'ElSelect',
        options: pickupOpts.value,
        componentProps: {
          placeholder: t('schoolBus.studentOrder.form.selectPlaceholder'),
          style: { width: '100%' }
        }
      },
      {
        field: 'routeTableSlot',
        label: '',
        component: 'ElInput',
        colProps: { span: 24 },
        formItemProps: {
          class: 'bus-order-form__main-field-slot bus-order-form__slot-plain'
        }
      },
      {
        field: 'personTableSlot',
        label: '',
        component: 'ElInput',
        hidden: hidePerson,
        colProps: { span: 24 },
        formItemProps: {
          class: 'bus-order-form__main-field-slot bus-order-form__slot-plain'
        }
      },
      {
        field: 'approvalStatusSlot',
        label: t('schoolBus.studentOrder.form.approvalStatus'),
        component: 'ElInput',
        colProps: { span: 24 },
        formItemProps: { class: 'bus-order-form__main-field-slot' }
      },
      {
        field: 'denyReason',
        label: t('schoolBus.studentApply.detail.denyReason'),
        component: 'ElInput',
        hidden: hideDeny,
        colProps: { span: 24 },
        componentProps: {
          type: 'textarea',
          rows: 3,
          maxlength: 300,
          showWordLimit: true
        }
      },
      {
        field: 'paymentStatusSlot',
        label: t('schoolBus.studentOrder.form.paymentStatus'),
        component: 'ElInput',
        hidden: !showPaymentRadios,
        colProps: { span: 24 },
        formItemProps: { class: 'bus-order-form__main-field-slot' }
      },
      {
        field: 'signImageUrl',
        label: t('schoolBus.studentOrder.form.signImage'),
        component: 'ElInput',
        colProps: { span: 24 },
        formItemProps: { class: 'bus-order-form__main-field-slot' }
      },
      {
        field: 'paymentDetailSlot',
        label: '',
        component: 'ElInput',
        hidden: !showPayDetail,
        colProps: { span: 24 },
        formItemProps: {
          class: 'bus-order-form__main-field-slot bus-order-form__slot-plain'
        }
      }
    ]
  }
})

const buildPayload = (): BusOrderFormModel => {
  const data: BusOrderFormModel = {
    schoolId: ruleForm.value.schoolId,
    sectionId: ruleForm.value.sectionId,
    admissionNo: ruleForm.value.admissionNo,
    pickupMethod: ruleForm.value.pickupMethod,
    studentName: ruleForm.value.studentName,
    studentGrade: ruleForm.value.studentGrade,
    amountDue: ruleForm.value.amountDue,
    approvalStatus: ruleForm.value.approvalStatus,
    denyReason: ruleForm.value.denyReason,
    paymentStatus: ruleForm.value.paymentStatus,
    paymentAmount: ruleForm.value.paymentAmount,
    signImageUrl: ruleForm.value.signImageUrl,
    paymentMethod: ruleForm.value.paymentMethod,
    paymentDate: ruleForm.value.paymentDate,
    paymentAccount: ruleForm.value.paymentAccount,
    paymentOrderNo: ruleForm.value.paymentOrderNo,
    receivingAccount: ruleForm.value.receivingAccount,
    orderLines: [],
    parentInfos: []
  }
  if (String(ruleForm.value.paymentStatus) !== '2') {
    delete data.paymentAmount
  }
  data.orderLines = routeTableData.value.map((item) => ({
    lineId: item.lineId,
    stationId: item.stationId,
    stationPriceId: item.stationPriceId,
    studentLineType: item.studentLineType,
    ridingStartDay: item.ridingStartDay,
    ridingEndDay: item.ridingEndDay,
    weekDaysId: item.weekDaysId,
    carinfoId: item.carinfoId,
    ridingWeekDay: String(item.ridingWeekDay ?? '')
  }))
  if (data.pickupMethod === '2' && personTableData.value.length > 0) {
    data.parentInfos = personTableData.value.map((p) => ({ ...p }))
  }
  if (props.mode === 'edit' && ruleForm.value.id != null) {
    data.id = ruleForm.value.id
  }
  return data
}

const submit = async () => {
  const valid = await mainUniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  if (routeTableData.value.length === 0) {
    ElMessage.error(t('schoolBus.studentOrder.form.routeRequired'))
    return
  }
  if (String(ruleForm.value.pickupMethod) === '2' && personTableData.value.length === 0) {
    ElMessage.error(t('schoolBus.studentOrder.form.personRequired'))
    return
  }
  const data = buildPayload()
  submitting.value = true
  try {
    if (props.mode === 'add') {
      await schoolBusOrderApi.add.post(data)
    } else {
      await schoolBusOrderApi.edit.post(data)
    }
    ElMessage.success(t('schoolBus.studentApply.messages.success'))
    emit('saved')
    close()
  } catch {
    /* request 已提示 */
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.bus-order-form__block {
  margin-top: 16px;
}

.bus-order-form__block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 500;
}

.bus-order-form__thumb {
  width: 48px;
  height: 48px;
  border-radius: 4px;
}

.bus-order-form__footer-btns {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.bus-order-form__slot-plain :deep(.el-form-item__label-wrap),
.bus-order-form__slot-plain :deep(.el-form-item__label) {
  display: none;
}

.bus-order-form__nested-field {
  margin-bottom: 12px;
}

.bus-order-form__nested-label {
  font-size: 12px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
  margin-bottom: 6px;
}

.bus-order-form__pay-inline {
  width: 120px;
  margin-left: 8px;
}

.bus-order-form__upload-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.bus-order-form__sign-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.bus-order-form__sign-image {
  width: 160px;
  height: 120px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: var(--el-fill-color-light);
}

.bus-order-form__sign-image :deep(.el-image__inner) {
  object-fit: contain;
}

.bus-order-form__url {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  word-break: break-all;
}

.bus-order-form__hidden-file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
