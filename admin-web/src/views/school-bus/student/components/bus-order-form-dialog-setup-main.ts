import type { FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniForm, UniFormConfig, UniOption } from 'uni-ui-lib'
import { useUniI18n, useUniPermission } from 'uni-ui-lib'
import { computed, nextTick, ref, watch, type Ref } from 'vue'

import {
  approvalStatusOptions,
  paymentMethodOptions,
  paymentStatusOptions,
  pickupMethodOptions,
  studentLineTypeOptions
} from '../use-student-order-filters'

import { createBusOrderFormRouteSetup } from './bus-order-form-dialog-setup-route'
import { pickArray } from './bus-order-form-helpers'
import type {
  BusOrderFormDialogProps,
  CarRow,
  LineRow,
  Loose,
  OrderStationRow,
  PersonRow,
  RouteRow,
  SectionRow,
  StudentSuggest
} from './bus-order-form-types'

import { protocolApi, schoolBusCommonApi, schoolBusOrderApi } from '@/api'
import type { BusOrderFormModel } from '@/types/modules/school-bus-order'
import { normalizeEnvelope } from '@/utils/api-response-normalize'
import { pickLocaleName } from '@/utils/locale-name'

export type BusOrderFormDialogEmit = {
  (e: 'saved'): void
}

export const createBusOrderFormDialogSetup = (
  props: BusOrderFormDialogProps,
  emit: BusOrderFormDialogEmit,
  visible: Ref<boolean>,
  formRefs: {
    getMainUniFormRef: () => InstanceType<typeof UniForm> | null
    getRouteUniFormRef: () => InstanceType<typeof UniForm> | null
    getPersonUniFormRef: () => InstanceType<typeof UniForm> | null
  }
) => {
  const { locale, t } = useUniI18n()
  const { hasPermission } = useUniPermission()

  const innerVisible = ref(false)
  const formScrollRootRef = ref<HTMLElement | null>(null)
  const baselineFormState = ref('')
  const skipDirtyConfirm = ref(false)

  const submitting = ref(false)
  const canComputedPrice = ref(true)

  const ruleForm = ref<BusOrderFormModel>({})
  const routeTableData = ref<RouteRow[]>([])
  const personTableData = ref<PersonRow[]>([])

  const selectSectionList = ref<SectionRow[]>([])
  const selectLineList = ref<LineRow[]>([])

  const formDetailLoading = ref(false)
  const paymentRulesRequired = ref(false)

  const approvalOpts = computed(() => approvalStatusOptions(t))
  const paymentOpts = computed(() =>
    paymentStatusOptions(t).map((p) => ({ ...p, value: String(p.value) }))
  )
  const pickupOpts = computed(() => pickupMethodOptions(t))
  const lineTypeOpts = computed(() => studentLineTypeOptions(t))
  const paymentMethodOpts = computed(() => paymentMethodOptions(t))

  const sectionUniOptions = computed<UniOption[]>(() =>
    selectSectionList.value.map((s) => ({
      label: pickLocaleName(s, locale.value),
      value: s.id
    }))
  )

  const dialogTitle = computed(() =>
    props.mode === 'add' ? t('schoolBus.add') : t('schoolBus.edit')
  )

  const mainDisabled = computed(() => {
    if (props.mode === 'add') {
      return false
    }
    return String(ruleForm.value.paymentStatus ?? '') === '2'
  })

  const canShowPayInfo = computed(() => hasPermission('isshow_bus_intentionorder_pay_info'))
  const canEditPayInfo = computed(() => hasPermission('isedit_bus_intentionorder_pay_info'))

  const routeSetup = createBusOrderFormRouteSetup({
    ruleForm,
    routeTableData,
    personTableData,
    selectSectionList,
    selectLineList,
    locale,
    t,
    lineTypeOpts,
    mainDisabled,
    getRouteUniFormRef: formRefs.getRouteUniFormRef,
    getPersonUniFormRef: formRefs.getPersonUniFormRef
  })

  const mainRules = computed<FormRules>(() => ({
    schoolId: [
      { required: true, message: t('schoolBus.studentOrder.formRuleSelect'), trigger: 'change' }
    ],
    sectionId: [
      { required: true, message: t('schoolBus.studentOrder.formRuleSelect'), trigger: 'change' }
    ],
    admissionNo: [
      { required: true, message: t('schoolBus.studentOrder.formRuleInput'), trigger: 'blur' }
    ],
    pickupMethod: [
      { required: true, message: t('schoolBus.studentOrder.formRuleSelect'), trigger: 'change' }
    ],
    denyReason: [
      {
        required: String(ruleForm.value.approvalStatus ?? '') === '2',
        message: t('schoolBus.studentOrder.formRuleInput'),
        trigger: 'blur'
      }
    ],
    paymentMethod: [
      {
        required: paymentRulesRequired.value,
        message: t('schoolBus.studentOrder.formRuleSelect'),
        trigger: 'change'
      }
    ],
    paymentDate: [
      {
        required: paymentRulesRequired.value,
        message: t('schoolBus.studentOrder.formRuleSelect'),
        trigger: 'change'
      }
    ],
    paymentAmount: [
      {
        required: paymentRulesRequired.value,
        message: t('schoolBus.studentOrder.formRuleInput'),
        trigger: 'blur'
      }
    ]
  }))

  const refreshPicker = () => {
    selectSectionList.value = [...selectSectionList.value]
  }

  const resetAll = () => {
    baselineFormState.value = ''
    ruleForm.value = {}
    routeTableData.value = []
    personTableData.value = []
    selectSectionList.value = []
    selectLineList.value = []
    canComputedPrice.value = true
    paymentRulesRequired.value = false
    routeSetup.clearRoutePersonState()
    nextTick(() => formRefs.getMainUniFormRef()?.clearValidate())
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
    const data = normalizeEnvelope(raw)
    if (!Object.keys(data).length) {
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
        stationName = pickLocaleName((dto ?? {}) as Record<string, unknown>, locale.value)
      }
      const lineTypeLabel =
        lineTypeOpts.value.find((o) => String(o.value) === String(item.studentLineType))?.label ??
        ''
      const carinfoId = item.carinfoId
      let carNumber = ''
      const lineDto = item.busLineDTO as Loose | undefined
      const cars = lineDto?.carList as CarRow[] | undefined
      if (Array.isArray(cars) && carinfoId != null) {
        carNumber = String(cars.find((c) => String(c.id) === String(carinfoId))?.carNumber ?? '')
      }
      return {
        lineId: item.lineId,
        lineName: pickLocaleName(
          { enName: item.lineEnName, cnName: item.lineCnName },
          locale.value
        ),
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
      captureBaseline()
    }, 400)
  }

  const snapshotFormState = () =>
    JSON.stringify({
      ruleForm: ruleForm.value,
      routes: routeTableData.value,
      persons: personTableData.value
    })

  const captureBaseline = () => {
    void nextTick(() => {
      baselineFormState.value = snapshotFormState()
    })
  }

  const isFormDirty = () =>
    innerVisible.value &&
    baselineFormState.value !== '' &&
    snapshotFormState() !== baselineFormState.value

  const scrollFormTo = (id: string) => {
    const root = formScrollRootRef.value
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null
    if (!root || !el) {
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleMainDialogBeforeClose = (done: () => void) => {
    if (skipDirtyConfirm.value || !isFormDirty()) {
      done()
      return
    }
    ElMessageBox.confirm(t('schoolBus.studentOrder.unsavedCloseConfirm'), t('common.tip'), {
      type: 'warning',
      confirmButtonText: t('common.submit'),
      cancelButtonText: t('common.cancel')
    })
      .then(() => done())
      .catch(() => {})
  }

  watch(visible, async (vis) => {
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
      captureBaseline()
      return
    }
    if (props.orderId != null) {
      formDetailLoading.value = true
      try {
        await loadDetail(props.orderId)
      } finally {
        formDetailLoading.value = false
      }
    }
  })

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
    visible.value = false
  }

  const close = () => {
    visible.value = false
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
      ElMessage.error(t('schoolBus.car.msgUploadFail'))
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
      routeSetup.personForm.value.pickupImageUrl = await protocolApi.upload.post(file)
      nextTick(() => {
        const exposed = formRefs.getPersonUniFormRef() as unknown as
          | { validateField?: (prop: string | string[]) => Promise<unknown> }
          | null
          | undefined
        void exposed?.validateField?.('pickupImageUrl')?.catch(() => undefined)
      })
    } catch {
      ElMessage.error(t('schoolBus.car.msgUploadFail'))
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

  const showPaymentRadios = computed(() => String(ruleForm.value.approvalStatus ?? '') === '1')

  const mainFormConfig = computed<UniFormConfig>(() => {
    const hidePerson = String(ruleForm.value.pickupMethod ?? '') !== '2'
    const hideDeny = String(ruleForm.value.approvalStatus ?? '') !== '2'
    const showPayDetail = canShowPayInfo.value && String(ruleForm.value.paymentStatus) === '2'

    return {
      formProps: { labelPosition: 'top', validateOnRuleChange: false },
      rowProps: { gutter: 16 },
      colProps: { span: 8 },
      rules: (mainDisabled.value ? {} : mainRules.value) as UniFormConfig['rules'],
      schema: [
        {
          field: 'schoolId',
          label: t('schoolBus.studentOrder.formSchool'),
          component: 'ElSelect',
          options: props.schoolOptions,
          onChange: async (ctx) => {
            await onSchoolChange(ctx.model.schoolId as string | number | undefined)
          },
          componentProps: {
            filterable: true,
            clearable: true,
            placeholder: t('schoolBus.studentApply.phSchool'),
            style: { width: '100%' }
          }
        },
        {
          field: 'sectionId',
          label: t('schoolBus.studentOrder.formSection'),
          component: 'ElSelect',
          options: sectionUniOptions.value,
          onChange: async (ctx) => {
            await onSectionChange(ctx.model.sectionId as string | number | undefined)
          },
          componentProps: {
            filterable: true,
            clearable: true,
            placeholder: t('schoolBus.studentApply.phSection'),
            style: { width: '100%' }
          }
        },
        {
          field: 'admissionNo',
          label: t('schoolBus.studentOrder.formAdmissionNo'),
          component: 'ElInput',
          formItemProps: { class: 'bus-order-form__main-field-slot' }
        },
        {
          field: 'studentName',
          label: t('schoolBus.studentOrder.formStudentName'),
          component: 'ElInput',
          componentProps: { disabled: true }
        },
        {
          field: 'studentGrade',
          label: t('schoolBus.studentOrder.formGrade'),
          component: 'ElInput',
          componentProps: { disabled: true }
        },
        {
          field: 'amountDue',
          label: t('schoolBus.studentOrder.formAmountDue'),
          component: 'ElInputNumber',
          componentProps: {
            precision: 2,
            step: 0.1,
            min: 0,
            controlsPosition: 'right',
            style: { width: '100%' }
          }
        },
        {
          field: 'pickupMethod',
          label: t('schoolBus.studentOrder.formPickupMethod'),
          component: 'ElSelect',
          options: pickupOpts.value,
          componentProps: {
            placeholder: t('schoolBus.studentOrder.formSelectPlaceholder'),
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
          field: 'approvalPaymentRowSlot',
          label: '',
          component: 'ElInput',
          colProps: { span: 24 },
          formItemProps: {
            class: 'bus-order-form__main-field-slot bus-order-form__slot-plain'
          }
        },
        {
          field: 'denyReason',
          label: t('schoolBus.studentApply.detailDenyReason'),
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
          field: 'signImageUrl',
          label: t('schoolBus.studentOrder.formSignImage'),
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
    try {
      await formRefs.getMainUniFormRef()?.validate()
    } catch (raw: unknown) {
      const fields = raw as Record<string, unknown> | undefined
      const firstKey =
        fields && typeof fields === 'object'
          ? Object.keys(fields as Record<string, unknown>)[0]
          : undefined
      if (firstKey) {
        formRefs.getMainUniFormRef()?.scrollToField(firstKey)
      }
      return
    }
    if (routeTableData.value.length === 0) {
      ElMessage.error(t('schoolBus.studentOrder.formRouteRequired'))
      scrollFormTo('bus-order-routes')
      return
    }
    if (String(ruleForm.value.pickupMethod) === '2' && personTableData.value.length === 0) {
      ElMessage.error(t('schoolBus.studentOrder.formPersonRequired'))
      scrollFormTo('bus-order-persons')
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
      ElMessage.success(t('schoolBus.operationSuccess'))
      emit('saved')
      skipDirtyConfirm.value = true
      close()
    } catch {
      /* request 已提示 */
    } finally {
      submitting.value = false
    }
  }

  return {
    innerVisible,
    formScrollRootRef,
    formDetailLoading,
    ruleForm,
    routeTableData,
    personTableData,
    dialogTitle,
    mainDisabled,
    mainUniFormMode,
    mainFormConfig,
    submitting,
    canShowPayInfo,
    canEditPayInfo,
    approvalOpts,
    paymentOpts,
    paymentMethodOpts,
    showPaymentRadios,
    queryStudents,
    onStudentPick,
    onSignFile,
    onPersonFile,
    onApprovalChange,
    onPaymentChange,
    handleMainDialogBeforeClose,
    onClosed,
    close,
    submit,
    ...routeSetup
  }
}
