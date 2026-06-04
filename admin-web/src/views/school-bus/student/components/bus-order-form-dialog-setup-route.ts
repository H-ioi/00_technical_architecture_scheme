import type { FormRules } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import type { UniForm, UniFormConfig, UniOption } from 'uni-ui-lib'
import { computed, nextTick, ref, type ComputedRef, type Ref } from 'vue'

import { pickArray } from './bus-order-form-helpers'
import type {
  CarRow,
  LineRow,
  Loose,
  OrderStationRow,
  PersonRow,
  RouteRow,
  SectionRow
} from './bus-order-form-types'

import { schoolBusCommonApi } from '@/api'
import type { BusOrderFormModel } from '@/types/modules/school-bus-order'
import { pickLocaleName } from '@/utils/locale-name'

export type RouteSetupDeps = {
  ruleForm: Ref<BusOrderFormModel>
  routeTableData: Ref<RouteRow[]>
  personTableData: Ref<PersonRow[]>
  selectSectionList: Ref<SectionRow[]>
  selectLineList: Ref<LineRow[]>
  locale: Ref<string>
  t: (key: string) => string
  lineTypeOpts: ComputedRef<UniOption[]>
  mainDisabled: ComputedRef<boolean>
  getRouteUniFormRef: () => InstanceType<typeof UniForm> | null
  getPersonUniFormRef: () => InstanceType<typeof UniForm> | null
}

export const createBusOrderFormRouteSetup = (deps: RouteSetupDeps) => {
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

  const routeDialogTitle = computed(() =>
    routeModalMode.value === 'add' ? deps.t('schoolBus.add') : deps.t('schoolBus.edit')
  )

  const personDialogTitle = computed(() =>
    personModalMode.value === 'add' ? deps.t('schoolBus.add') : deps.t('schoolBus.edit')
  )

  const routeRules = computed<FormRules>(() => ({
    lineId: [
      {
        required: true,
        message: deps.t('schoolBus.studentOrder.formRuleSelect'),
        trigger: 'change'
      }
    ],
    studentLineType: [
      {
        required: true,
        message: deps.t('schoolBus.studentOrder.formRuleSelect'),
        trigger: 'change'
      }
    ],
    weekDaysId: [
      {
        required: true,
        message: deps.t('schoolBus.studentOrder.formRuleSelect'),
        trigger: 'change'
      }
    ],
    ridingWeekDay: [
      {
        validator: (_r, _v, cb) => {
          const v = routeForm.value.ridingWeekDay
          const ok = Array.isArray(v) ? v.length > 0 : Boolean(v)
          if (ok) {
            cb()
          } else {
            cb(new Error(deps.t('schoolBus.studentOrder.formRuleSelect')))
          }
        },
        trigger: 'change'
      }
    ],
    stationPriceId: [
      {
        required: true,
        message: deps.t('schoolBus.studentOrder.formRuleSelect'),
        trigger: 'change'
      }
    ],
    ridingDay: [
      {
        required: true,
        message: deps.t('schoolBus.studentOrder.formRuleSelect'),
        trigger: 'change'
      }
    ]
  }))

  const personRules = computed<FormRules>(() => ({
    pickupRelationships: [
      { required: true, message: deps.t('schoolBus.studentOrder.formRuleInput'), trigger: 'blur' }
    ],
    pickupPhone: [
      { required: true, message: deps.t('schoolBus.studentOrder.formRuleInput'), trigger: 'blur' }
    ],
    pickupImageUrl: [
      {
        required: true,
        message: deps.t('schoolBus.studentOrder.formRuleUpload'),
        trigger: 'change'
      }
    ]
  }))

  const routeFormRidingWeekMulti = computed<string[]>({
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

  const syncRouteLineTypeName = () => {
    const v = String(routeForm.value.studentLineType ?? '')
    const hit = deps.lineTypeOpts.value.find((o) => String(o.value) === v)
    routeForm.value.lineTypeName = hit?.label ?? ''
  }

  const disabledRidingDate = (time: Date) => {
    const sid = deps.ruleForm.value.sectionId
    const sec = deps.selectSectionList.value.find((s) => String(s.id) === String(sid))
    if (!sec?.serviceStartDate || !sec?.serviceEndDate) {
      return false
    }
    const start = new Date(sec.serviceStartDate).setHours(0, 0, 0, 0)
    const end = new Date(sec.serviceEndDate).setHours(23, 59, 59, 999)
    const t0 = time.getTime()
    return t0 < start || t0 > end
  }

  const resetRouteLists = () => {
    weekDaysList.value = []
    carList.value = []
    routeStationSelectList.value = []
    ridingWeekDaySelectOpts.value = []
  }

  const openRouteAdd = () => {
    routeModalMode.value = 'add'
    routeEditIndex.value = -1
    routeForm.value = {}
    const sec = deps.selectSectionList.value.find(
      (s) => String(s.id) === String(deps.ruleForm.value.sectionId)
    )
    if (sec?.serviceStartDate && sec?.serviceEndDate) {
      routeForm.value.ridingDay = [sec.serviceStartDate, sec.serviceEndDate]
      routeForm.value.ridingStartDay = sec.serviceStartDate
      routeForm.value.ridingEndDay = sec.serviceEndDate
    }
    resetRouteLists()
    routeDialogVisible.value = true
    nextTick(() => deps.getRouteUniFormRef()?.clearValidate())
  }

  const openRouteEdit = async (row: RouteRow, index: number) => {
    routeModalMode.value = 'edit'
    routeEditIndex.value = index
    const schoolId = deps.ruleForm.value.schoolId
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
    nextTick(() => deps.getRouteUniFormRef()?.clearValidate())
  }

  const removeRoute = async (index: number) => {
    try {
      await ElMessageBox.confirm(
        deps.t('schoolBus.confirmDeleteRows'),
        deps.t('schoolBus.delete'),
        {
          type: 'warning'
        }
      )
    } catch {
      return
    }
    deps.routeTableData.value.splice(index, 1)
  }

  const onRouteLineChange = async (lineId: string | number | undefined) => {
    routeForm.value.stationPriceId = undefined
    routeForm.value.carinfoId = undefined
    routeForm.value.carNumber = undefined
    routeForm.value.weekDaysId = undefined
    routeForm.value.ridingWeekDay = []
    routeStationSelectList.value = []
    ridingWeekDaySelectOpts.value = []
    const schoolId = deps.ruleForm.value.schoolId
    if (lineId == null || schoolId == null) {
      weekDaysList.value = []
      carList.value = []
      return
    }
    deps.selectLineList.value.forEach((item) => {
      if (String(item.id) === String(lineId)) {
        routeForm.value.lineName = pickLocaleName(item, deps.locale.value)
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
      routeForm.value.stationName = pickLocaleName(hit, deps.locale.value)
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
    deps.selectLineList.value.map((l) => ({
      label: pickLocaleName(l, deps.locale.value),
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
      label: pickLocaleName(s, deps.locale.value),
      value: s.id
    }))
  )

  const routeDialogFormConfig = computed<UniFormConfig>(() => ({
    formProps: { labelPosition: 'top', disabled: deps.mainDisabled.value },
    rowProps: { gutter: 0 },
    colProps: { span: 24 },
    rules: routeRules.value as UniFormConfig['rules'],
    schema: [
      {
        field: 'lineId',
        label: deps.t('schoolBus.studentApply.detailRouteLine'),
        component: 'ElSelect',
        options: lineSelectOptions.value,
        onChange: async (ctx) => {
          await onRouteLineChange(ctx.model.lineId as string | number | undefined)
        },
        componentProps: { filterable: true, style: { width: '100%' } }
      },
      {
        field: 'studentLineType',
        label: deps.t('schoolBus.studentApply.detailLineType'),
        component: 'ElSelect',
        options: deps.lineTypeOpts.value,
        onChange: () => {
          syncRouteLineTypeName()
        },
        componentProps: { style: { width: '100%' } }
      },
      {
        field: 'carinfoId',
        label: deps.t('schoolBus.studentOrder.formPlate'),
        component: 'ElSelect',
        options: routeCarSelectOptions.value,
        onChange: (ctx) => {
          onCarChange(ctx.model.carinfoId as string | number | undefined)
        },
        componentProps: { clearable: true, style: { width: '100%' } }
      },
      {
        field: 'weekDaysId',
        label: deps.t('schoolBus.studentOrder.formDateOption'),
        component: 'ElSelect',
        options: weekSelectOptions.value,
        onChange: (ctx) => {
          onWeekDaysChange(ctx.model.weekDaysId as string | number | undefined)
        },
        componentProps: { clearable: true, style: { width: '100%' } }
      },
      {
        field: 'ridingWeekDay',
        label: deps.t('schoolBus.studentApply.detailRidingWeekDay'),
        component: 'ElInput',
        formItemProps: { class: 'bus-order-form__route-slot' }
      },
      {
        field: 'ridingDay',
        label: deps.t('schoolBus.studentOrder.formRideRange'),
        component: 'ElInput',
        formItemProps: { class: 'bus-order-form__route-slot' }
      },
      {
        field: 'stationPriceId',
        label: deps.t('schoolBus.studentApply.detailRouteStation'),
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
        label: deps.t('schoolBus.studentApply.detailRelation'),
        component: 'ElInput',
        componentProps: { maxlength: 50 }
      },
      {
        field: 'pickupPhone',
        label: deps.t('schoolBus.studentApply.detailPhone'),
        component: 'ElInput',
        componentProps: { maxlength: 50 }
      },
      {
        field: 'pickupImageUrl',
        label: deps.t('schoolBus.studentApply.detailPhoto'),
        component: 'ElInput',
        formItemProps: { class: 'bus-order-form__route-slot' }
      }
    ]
  }))

  const submitRoute = async () => {
    const valid = await deps
      .getRouteUniFormRef()
      ?.validate()
      .catch(() => false)
    if (!valid) {
      return
    }
    const rf = { ...routeForm.value }
    const ridingWeekDayStr = Array.isArray(rf.ridingWeekDay)
      ? rf.ridingWeekDay.join(',')
      : String(rf.ridingWeekDay ?? '')
    syncRouteLineTypeName()
    const lineHit = deps.selectLineList.value.find((l) => String(l.id) === String(rf.lineId))
    const weekHit = weekDaysList.value.find((w) => String(w.id) === String(rf.weekDaysId))
    const row: RouteRow = {
      ...rf,
      lineName: rf.lineName ?? (lineHit ? pickLocaleName(lineHit, deps.locale.value) : ''),
      weekDaysLabel: rf.weekDaysLabel ?? (weekHit ? String(weekHit.weekDays ?? '') : ''),
      ridingWeekDay: ridingWeekDayStr,
      ridingRange:
        rf.ridingStartDay && rf.ridingEndDay ? `${rf.ridingStartDay} ~ ${rf.ridingEndDay}` : ''
    }
    if (routeModalMode.value === 'add') {
      deps.routeTableData.value.push(row)
    } else if (routeEditIndex.value >= 0) {
      deps.routeTableData.value.splice(routeEditIndex.value, 1, row)
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
    nextTick(() => deps.getPersonUniFormRef()?.clearValidate())
  }

  const openPersonEdit = (row: PersonRow, index: number) => {
    personModalMode.value = 'edit'
    personEditIndex.value = index
    personForm.value = { ...row }
    personDialogVisible.value = true
    nextTick(() => deps.getPersonUniFormRef()?.clearValidate())
  }

  const removePerson = async (index: number) => {
    try {
      await ElMessageBox.confirm(
        deps.t('schoolBus.confirmDeleteRows'),
        deps.t('schoolBus.delete'),
        {
          type: 'warning'
        }
      )
    } catch {
      return
    }
    deps.personTableData.value.splice(index, 1)
  }

  const submitPerson = async () => {
    const valid = await deps
      .getPersonUniFormRef()
      ?.validate()
      .catch(() => false)
    if (!valid) {
      return
    }
    const row = { ...personForm.value }
    if (personModalMode.value === 'add') {
      deps.personTableData.value.push(row)
    } else if (personEditIndex.value >= 0) {
      deps.personTableData.value.splice(personEditIndex.value, 1, row)
    }
    personDialogVisible.value = false
  }

  const resetPersonForm = () => {
    personForm.value = {}
    personEditIndex.value = -1
  }

  const clearRoutePersonState = () => {
    resetRouteLists()
    routeForm.value = {}
    routeEditIndex.value = -1
    personForm.value = {}
    personEditIndex.value = -1
  }

  return {
    weekDaysList,
    carList,
    routeDialogVisible,
    routeForm,
    routeDialogTitle,
    routeFormRidingWeekMulti,
    ridingWeekDaySelectOpts,
    routeDialogFormConfig,
    disabledRidingDate,
    onRidingRangeChange,
    openRouteAdd,
    openRouteEdit,
    removeRoute,
    submitRoute,
    resetRouteForm,
    personDialogVisible,
    personForm,
    personDialogTitle,
    personDialogFormConfig,
    openPersonAdd,
    openPersonEdit,
    removePerson,
    submitPerson,
    resetPersonForm,
    clearRoutePersonState
  }
}
