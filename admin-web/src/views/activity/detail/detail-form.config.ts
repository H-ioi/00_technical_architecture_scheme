import type { UniFormConfig, UniOption } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

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
      colProps: { xs: 24, sm: 12 },
      rules: [{ required: true, message: t('activity.ruleInput'), trigger: 'blur' }]
    },
    {
      field: 'activityEnName',
      label: t('activity.eventNameEn'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true, style: { width: '100%' } },
      colProps: { xs: 24, sm: 12 },
      rules: [{ required: true, message: t('activity.ruleInput'), trigger: 'blur' }]
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
      colProps: { span: 24 }
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
      colProps: { span: 24 }
    },
    {
      field: 'imageUrl',
      label: t('activity.coverImage'),
      component: 'ElInput',
      colProps: { span: 24 },
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
      colProps: { xs: 24, sm: 12 }
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
      colProps: { xs: 24, sm: 12 }
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
      colProps: { xs: 24, sm: 12 }
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
      colProps: { xs: 24, sm: 12 }
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
      colProps: { span: 24 },
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
      colProps: { span: 24 },
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
      componentProps: {
        multiple: true,
        filterable: true,
        collapseTags: true,
        placeholder: t('activity.ruleSelect'),
        style: { width: '100%' }
      },
      colProps: { span: 24 },
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
      component: 'ElSelect',
      options: checkinOptions,
      componentProps: { style: { width: '100%' } },
      colProps: { xs: 24, sm: 12 },
      rules: [{ required: true, message: t('activity.ruleSelect'), trigger: 'change' }]
    },
    {
      field: 'ticketPrice',
      label: t('activity.colTicketPrice'),
      component: 'ElInputNumber',
      componentProps: { min: 0, precision: 2, controlsPosition: 'right', style: { width: '100%' } },
      colProps: { xs: 24, sm: 12 }
    },
    {
      field: 'recommended',
      label: t('activity.colRecommended'),
      component: 'ElSelect',
      options: ynOptions,
      componentProps: { style: { width: '100%' } },
      colProps: { xs: 24, sm: 8 }
    },
    {
      field: 'banner',
      label: t('activity.colBanner'),
      component: 'ElSelect',
      options: ynOptions,
      componentProps: { style: { width: '100%' } },
      colProps: { xs: 24, sm: 8 }
    },
    {
      field: 'needFeedback',
      label: t('activity.needFeedback'),
      component: 'ElSelect',
      options: ynOptions,
      componentProps: { style: { width: '100%' } },
      colProps: { xs: 24, sm: 8 }
    },
    {
      field: 'registrationLimit',
      label: t('activity.registrationLimit'),
      component: 'ElInputNumber',
      colProps: { span: 24 },
      formItemProps: { class: 'activity-detail-form__reg-slot' }
    },
    {
      field: 'visibleScope',
      label: t('activity.visibleScope'),
      component: 'ElSelect',
      options: visibleScopeOptions,
      componentProps: { style: { width: '100%' } },
      colProps: { xs: 24, sm: 12 },
      rules: [{ required: true, message: t('activity.ruleSelect'), trigger: 'change' }]
    },
    {
      field: 'emailConfigIds',
      label: t('activity.emailConfigs'),
      component: 'ElSelect',
      options: emailOptions,
      componentProps: {
        multiple: true,
        filterable: true,
        collapseTags: true,
        placeholder: t('activity.emailConfigsPh'),
        style: { width: '100%' }
      },
      colProps: { span: 24 }
    },
    {
      field: 'wechatPushSchoolIds',
      label: t('activity.wechatPushSchools'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        multiple: true,
        filterable: true,
        collapseTags: true,
        style: { width: '100%' }
      },
      colProps: { span: 24 }
    },
    {
      field: 'wechatPushContent',
      label: t('activity.wechatPushContent'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 2,
        maxlength: 20,
        showWordLimit: true,
        style: { width: '100%' }
      },
      colProps: { span: 24 }
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
      colProps: { span: 24 }
    },
    {
      field: 'detailCn',
      label: t('activity.detailCn'),
      component: 'ElInput',
      colProps: { span: 24 },
      formItemProps: { class: 'activity-detail-form__detail-cn-slot' }
    },
    {
      field: 'detailEn',
      label: t('activity.detailEn'),
      component: 'ElInput',
      colProps: { span: 24 },
      formItemProps: { class: 'activity-detail-form__detail-en-slot' }
    }
  ]

  const head: NonNullable<UniFormConfig['schema']> = showActivityStatus
    ? [
        {
          field: 'activityStatus',
          label: t('activity.colStatus'),
          component: 'ElSelect',
          options: statusOptions,
          componentProps: { style: { width: '100%' } },
          colProps: { span: 24 },
          rules: [{ required: true, message: t('activity.ruleSelect'), trigger: 'change' }]
        }
      ]
    : []

  return {
    formProps: { labelPosition: 'top' },
    rowProps: { gutter: 16 },
    colProps: { span: 24 },
    schema: [...head, ...schema]
  }
}
