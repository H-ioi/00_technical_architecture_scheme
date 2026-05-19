import type { UniFormConfig, UniFormContext, UniFormSection, UniOption } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

const optionLabel = (options: UniOption[], value: unknown) =>
  options.find((item) => String(item.value) === String(value))?.label ?? String(value ?? '')

const optionLabels = (options: UniOption[], value: unknown) => {
  const values = Array.isArray(value) ? value : value == null || value === '' ? [] : [value]
  return values
    .map((item) => optionLabel(options, item))
    .filter(Boolean)
    .join(', ')
}

const rangeLabel = (value: unknown) =>
  Array.isArray(value) && value.length === 2 ? `${value[0] || ''} - ${value[1] || ''}` : ''

const modelValue = (context: UniFormContext, key: string) => context.model[key]
const fullCol = { span: 24 }
const halfCol = { xs: 24, lg: 12 }
const thirdCol = { xs: 24, sm: 12, lg: 8 }

/** 是/否字段：与表单 model 中 `'0'` / `'1'` 字符串一致，避免 Switch 与 boolean 比较触发误改值 */
const ynSwitchProps = (t: Translate) => ({
  inlinePrompt: true,
  activeText: t('activity.yes'),
  inactiveText: t('activity.no'),
  activeValue: '1',
  inactiveValue: '0'
})

type SchemaField = NonNullable<UniFormConfig['schema']>[number]

const ynSwitchField = (
  field: string,
  label: string,
  t: Translate,
  ynOptions: UniOption[],
  extra?: Partial<SchemaField>
): SchemaField => ({
  field,
  label,
  component: 'ElSwitch',
  options: ynOptions,
  viewType: 'enum',
  componentProps: ynSwitchProps(t),
  colProps: { span: 6 },
  formItemProps: { class: 'activity-detail-form__switch-slot' },
  rules: [{ required: true, message: t('activity.ruleSelect'), trigger: 'change' }],
  ...extra
})

export function buildActivityDetailFormConfig(
  t: Translate,
  opts: {
    schoolOptions: UniOption[]
    emailOptions: UniOption[]
    ynOptions: UniOption[]
    statusOptions: UniOption[]
    checkinOptions: UniOption[]
    visibleScopeOptions: UniOption[]
    showActivityStatus: boolean
  }
): UniFormConfig {
  const {
    schoolOptions,
    emailOptions,
    ynOptions,
    statusOptions,
    checkinOptions,
    visibleScopeOptions,
    showActivityStatus
  } = opts

  const schema: UniFormConfig['schema'] = [
    {
      field: 'activityCnName',
      label: t('activity.eventNameCn'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true, style: { width: '100%' } },
      colProps: { span: 8 },
      rules: [{ required: true, message: t('activity.ruleInput'), trigger: 'blur' }]
    },
    {
      field: 'activityEnName',
      label: t('activity.eventNameEn'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true, style: { width: '100%' } },
      colProps: { span: 8 },
      rules: [{ required: true, message: t('activity.ruleInput'), trigger: 'blur' }]
    },
    {
      field: 'activityStatus',
      label: t('activity.colStatus'),
      component: 'ElRadioGroup',
      options: statusOptions,
      viewType: 'enum',
      componentProps: { disabled: true, style: { width: '100%' } },
      colProps: { span: 8 },
      rules: [{ required: true, message: t('activity.ruleSelect'), trigger: 'change' }]
    },
    {
      field: 'introCn',
      label: t('activity.introCn'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 2,
        maxlength: 100,
        showWordLimit: true,
        style: { width: '100%' }
      },
      colProps: { span: 12 }
    },
    {
      field: 'introEn',
      label: t('activity.introEn'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 2,
        maxlength: 100,
        showWordLimit: true,
        style: { width: '100%' }
      },
      colProps: { span: 12 }
    },
    {
      field: 'imageUrl',
      label: t('activity.coverImage'),
      component: 'ElInput',
      colProps: fullCol,
      formItemProps: { class: 'activity-detail-form__cover-slot' }
    },
    {
      field: 'addressCn',
      label: t('activity.addressCn'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 1,
        maxlength: 100,
        style: { width: '100%' }
      },
      colProps: halfCol
    },
    {
      field: 'addressEn',
      label: t('activity.addressEn'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 1,
        maxlength: 100,
        style: { width: '100%' }
      },
      colProps: halfCol
    },
    {
      field: 'tipsCn',
      label: t('activity.tipsCn'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 1,
        maxlength: 100,
        style: { width: '100%' }
      },
      colProps: halfCol
    },
    {
      field: 'tipsEn',
      label: t('activity.tipsEn'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 1,
        maxlength: 100,
        style: { width: '100%' }
      },
      colProps: halfCol
    },
    {
      field: 'activityTime',
      label: t('activity.fieldActivityPeriod'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' }
      },
      viewRender: (context) => rangeLabel(context.value),
      colProps: { span: 8 },
      rules: [
        {
          type: 'array' as const,
          required: true,
          len: 2,
          message: t('activity.ruleSelect'),
          trigger: 'change'
        }
      ]
    },
    {
      field: 'registrationTime',
      label: t('activity.fieldRegistrationPeriod'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' }
      },
      viewRender: (context) => rangeLabel(context.value),
      colProps: { span: 8 },
      rules: [
        {
          type: 'array' as const,
          required: true,
          len: 2,
          message: t('activity.ruleSelect'),
          trigger: 'change'
        }
      ]
    },
    {
      field: 'schoolIds',
      label: t('activity.colSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      viewRender: (context) => optionLabels(schoolOptions, context.value),
      componentProps: {
        multiple: true,
        filterable: true,
        collapseTags: true,
        placeholder: t('activity.ruleSelect'),
        style: { width: '100%' }
      },
      colProps: { span: 8 },
      rules: [
        {
          type: 'array' as const,
          required: true,
          min: 1,
          message: t('activity.ruleSelect'),
          trigger: 'change'
        }
      ]
    },
    {
      field: 'checkinMethod',
      label: t('activity.colCheckin'),
      component: 'ElRadioGroup',
      options: checkinOptions,
      viewType: 'enum',
      colProps: { span: 8 },
      rules: [{ required: true, message: t('activity.ruleSelect'), trigger: 'change' }]
    },
    {
      field: 'ticketPrice',
      label: t('activity.colTicketPrice'),
      component: 'ElInputNumber',
      componentProps: { min: 0, precision: 2, controlsPosition: 'right' },
      colProps: { span: 6 }
    },
    {
      field: 'registrationLimit',
      label: t('activity.registrationLimit'),
      colProps: { span: 10 }
    },
    {
      field: 'visibleScope',
      label: t('activity.visibleScope'),
      colProps: { span: 24 }
    },
    ynSwitchField('recommended', t('activity.colRecommended'), t, ynOptions),
    ynSwitchField('banner', t('activity.colBanner'), t, ynOptions),
    ynSwitchField('needFeedback', t('activity.needFeedback'), t, ynOptions),
    ynSwitchField('wechatNotify', t('activity.wechatNotify'), t, ynOptions, {
      componentProps: { ...ynSwitchProps(t), disabled: true }
    }),
    {
      field: 'emailConfigIds',
      label: t('activity.emailConfigs'),
      component: 'ElSelect',
      options: emailOptions,
      viewRender: (context) => optionLabels(emailOptions, context.value),
      componentProps: {
        multiple: true,
        filterable: true,
        collapseTags: true,
        placeholder: t('activity.emailConfigsPh'),
        style: { width: '100%' }
      },
      colProps: { span: 12 }
    },
    {
      field: 'wechatPushSchoolIds',
      label: t('activity.wechatPushSchools'),
      component: 'ElSelect',
      options: schoolOptions,
      viewRender: (context) => optionLabels(schoolOptions, context.value),
      componentProps: {
        multiple: true,
        filterable: true,
        style: { width: '100%' }
      },
      colProps: { span: 12 }
    },
    {
      field: 'wechatPushContent',
      label: t('activity.wechatPushContent'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 2,
        maxlength: 200,
        showWordLimit: true,
        style: { width: '100%' }
      },
      colProps: halfCol
    },
    {
      field: 'wechatPushRemark',
      label: t('activity.wechatPushRemark'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 2,
        maxlength: 200,
        showWordLimit: true,
        style: { width: '100%' }
      },
      colProps: halfCol
    },
    {
      field: 'detailCn',
      label: t('activity.detailCn'),
      component: 'ElInput',
      colProps: fullCol,
      formItemProps: { class: 'activity-detail-form__detail-cn-slot' }
    },
    {
      field: 'detailEn',
      label: t('activity.detailEn'),
      component: 'ElInput',
      colProps: fullCol,
      formItemProps: { class: 'activity-detail-form__detail-en-slot' }
    }
  ]

  const sections: UniFormSection[] = [
    {
      title: t('activity.detailSectionBase'),
      // 展示顺序以 schema 声明为准；勿在 sections 里前置字段，否则会打乱栅格行内顺序
      fields: [
        'activityCnName',
        'activityEnName',
        ...(showActivityStatus ? ['activityStatus'] : []),
        'introCn',
        'introEn'
      ]
    },
    {
      title: t('activity.detailSectionDisplay'),
      fields: ['imageUrl', 'addressCn', 'addressEn', 'tipsCn', 'tipsEn']
    },
    {
      title: t('activity.detailSectionTime'),
      fields: ['activityTime', 'registrationTime', 'schoolIds']
    },
    {
      title: t('activity.detailSectionRegistration'),
      fields: ['checkinMethod', 'ticketPrice', 'registrationLimit', 'visibleScope']
    },
    {
      title: t('activity.detailSectionFlags'),
      fields: ['recommended', 'banner', 'needFeedback', 'wechatNotify']
    },
    {
      title: t('activity.detailSectionNotify'),
      fields: [
        'emailConfigIds',
        'ticketNotifyEmailsLabel',
        'wechatPushSchoolIds',
        'wechatPushContent',
        'wechatPushRemark'
      ]
    },
    {
      title: t('activity.detailSectionContent'),
      fields: ['detailCn', 'detailEn']
    }
  ]

  return {
    formProps: { labelPosition: 'top' },
    rowProps: { gutter: 16 },
    colProps: { span: 24 },
    schema,
    sections
  }
}
