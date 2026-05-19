import type { UniFormConfig, UniOption } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export type ProgramFormEditCtx = {
  programType: string
  activityOptions: UniOption[]
  ynOptions: UniOption[]
  lotteryIdOptions: UniOption[]
  lotteryScopeOptions: UniOption[]
  blessingOptions: UniOption[]
  programTypeOptions: UniOption[]
  bodyLocked: boolean
  typeChoiceLocked: boolean
  prizeCountMin: number
}

function dp(lock: boolean, extra?: Record<string, unknown>) {
  return lock ? { disabled: true, ...extra } : (extra ?? {})
}

export function buildProgramEditFormConfig(t: Translate, ctx: ProgramFormEditCtx): UniFormConfig {
  const {
    programType,
    activityOptions,
    ynOptions,
    lotteryIdOptions,
    lotteryScopeOptions,
    blessingOptions,
    programTypeOptions,
    bodyLocked,
    typeChoiceLocked,
    prizeCountMin
  } = ctx

  const lock = bodyLocked
  const typeLock = typeChoiceLocked || lock

  const base: UniFormConfig['schema'] = [
    {
      field: 'cnName',
      label: t('activity.eventNameCn'),
      component: 'ElInput',
      componentProps: {
        maxlength: 100,
        clearable: true,
        style: { width: '100%' },
        ...dp(lock)
      },
      colProps: { xs: 24, sm: 12 },
      rules: [{ required: true, message: t('activity.ruleInput'), trigger: 'blur' }]
    },
    {
      field: 'enName',
      label: t('activity.eventNameEn'),
      component: 'ElInput',
      componentProps: {
        maxlength: 100,
        clearable: true,
        style: { width: '100%' },
        ...dp(lock)
      },
      colProps: { xs: 24, sm: 12 },
      rules: [{ required: true, message: t('activity.ruleInput'), trigger: 'blur' }]
    },
    {
      field: 'activityId',
      label: t('activity.colActivityName'),
      component: 'ElSelect',
      options: activityOptions,
      componentProps: {
        filterable: true,
        clearable: true,
        style: { width: '100%' },
        ...dp(lock)
      },
      colProps: { xs: 24, sm: 12 },
      rules: [{ required: true, message: t('activity.ruleSelect'), trigger: 'change' }]
    },
    {
      field: 'backgroundImage',
      label: t('activity.programBackground'),
      component: 'ElInput',
      colProps: { span: 24 },
      formItemProps: { class: 'activity-program-edit__bg-slot' }
    },
    {
      field: 'programType',
      label: t('activity.programType'),
      component: 'ElRadioGroup',
      options: programTypeOptions,
      componentProps: { ...dp(typeLock) },
      colProps: { span: 24 },
      rules: [{ required: true, message: t('activity.ruleSelect'), trigger: 'change' }]
    },
    {
      field: 'sortOrder',
      label: t('activity.colProgramOrder'),
      component: 'ElInputNumber',
      componentProps: {
        min: 0,
        step: 1,
        precision: 0,
        controlsPosition: 'right',
        style: { width: '100%' },
        ...dp(lock)
      },
      colProps: { xs: 24, sm: 12 }
    }
  ]

  const lottery: UniFormConfig['schema'] =
    programType === '1'
      ? [
          {
            field: 'needPayment',
            label: t('activity.needPayment'),
            component: 'ElRadioGroup',
            options: ynOptions,
            componentProps: { ...dp(lock) },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'needCheckin',
            label: t('activity.needCheckin'),
            component: 'ElRadioGroup',
            options: ynOptions,
            componentProps: { ...dp(lock) },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'checkinStartOffsetMinutes',
            label: t('activity.checkinStartOffset'),
            component: 'ElInputNumber',
            componentProps: {
              min: prizeCountMin,
              step: 1,
              precision: 0,
              controlsPosition: 'right',
              style: { width: '100%' },
              ...dp(lock)
            },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'checkinEndOffsetMinutes',
            label: t('activity.checkinEndOffset'),
            component: 'ElInputNumber',
            componentProps: {
              min: 0,
              step: 1,
              precision: 0,
              controlsPosition: 'right',
              style: { width: '100%' },
              ...dp(lock)
            },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'createLotteryPool',
            label: t('activity.createLotteryPool'),
            component: 'ElRadioGroup',
            options: ynOptions,
            componentProps: { ...dp(lock) },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'lotteryIdentifierType',
            label: t('activity.lotteryIdentifier'),
            component: 'ElRadioGroup',
            options: lotteryIdOptions,
            componentProps: { ...dp(lock) },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'lotteryParticipantScope',
            label: t('activity.lotteryParticipantScope'),
            component: 'ElRadioGroup',
            options: lotteryScopeOptions,
            componentProps: { ...dp(lock) },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'totalRounds',
            label: t('activity.colTotalRounds'),
            component: 'ElInputNumber',
            componentProps: {
              min: 0,
              step: 1,
              precision: 0,
              controlsPosition: 'right',
              style: { width: '100%' },
              ...dp(lock)
            },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'prizeCount',
            label: t('activity.prizeCount'),
            component: 'ElInputNumber',
            componentProps: {
              min: 0,
              step: 1,
              precision: 0,
              controlsPosition: 'right',
              style: { width: '100%' }
            },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'programQuotasMarker',
            label: t('activity.programQuotas'),
            component: 'ElInput',
            colProps: { span: 24 },
            formItemProps: { class: 'activity-program-edit__quota-slot' }
          }
        ]
      : []

  const vote: UniFormConfig['schema'] =
    programType === '2'
      ? [
          {
            field: 'needVote',
            label: t('activity.needVote'),
            component: 'ElSelect',
            options: ynOptions,
            componentProps: { style: { width: '100%' }, ...dp(lock) },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'votePerAttemptCount',
            label: t('activity.votePerAttempt'),
            component: 'ElInputNumber',
            componentProps: {
              min: 0,
              step: 1,
              precision: 0,
              controlsPosition: 'right',
              style: { width: '100%' },
              ...dp(lock)
            },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'voteStartTime',
            label: t('activity.voteStart'),
            component: 'ElDatePicker',
            componentProps: {
              type: 'datetime',
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
              style: { width: '100%' },
              ...dp(lock)
            },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'voteEndTime',
            label: t('activity.voteEnd'),
            component: 'ElDatePicker',
            componentProps: {
              type: 'datetime',
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
              style: { width: '100%' },
              ...dp(lock)
            },
            colProps: { xs: 24, sm: 12 }
          },
          {
            field: 'prizeCount',
            label: t('activity.prizeQuota'),
            component: 'ElInputNumber',
            componentProps: {
              min: 0,
              step: 1,
              precision: 0,
              controlsPosition: 'right',
              style: { width: '100%' },
              ...dp(lock)
            },
            colProps: { xs: 24, sm: 12 }
          }
        ]
      : []

  const blessing: UniFormConfig['schema'] =
    programType === '3'
      ? [
          {
            field: 'blessingDisplayRule',
            label: t('activity.blessingRule'),
            component: 'ElRadioGroup',
            options: blessingOptions,
            componentProps: { ...dp(lock) },
            colProps: { span: 24 }
          }
        ]
      : []

  return {
    schema: [...base, ...lottery, ...vote, ...blessing],
    formProps: { labelWidth: '160px' },
    rowProps: { gutter: 16 },
    colProps: { span: 12 },
    view: { emptyText: '-' }
  }
}

export function ynOptions(t: Translate): UniOption[] {
  return [
    { label: t('activity.yes'), value: '1' },
    { label: t('activity.no'), value: '0' }
  ]
}

export function lotteryIdentifierOptions(t: Translate): UniOption[] {
  return [
    { label: t('activity.lotteryIdNone'), value: '0' },
    { label: t('activity.lotteryIdPhone'), value: '1' }
  ]
}

export function lotteryScopeOptions(t: Translate): UniOption[] {
  return [
    { label: t('activity.lotteryScopeAll'), value: '0' },
    { label: t('activity.lotteryScopeUnwon'), value: '1' }
  ]
}

export function blessingRuleOptions(t: Translate): UniOption[] {
  return [
    { label: t('activity.blessingTopBottom'), value: '1' },
    { label: t('activity.blessingLeftRight'), value: '0' }
  ]
}
