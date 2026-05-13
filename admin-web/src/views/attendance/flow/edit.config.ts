import type { UniFormConfig, UniOption } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 流程建模编辑页「流程配置」UniForm：schema + 校验 */
export function buildFlowEditFormConfig(t: Translate, schoolOptions: UniOption[]): UniFormConfig {
  return {
    formProps: { labelWidth: '120px' },
    rowProps: { gutter: 16 },
    colProps: { span: 24 },
    rules: {
      type: [
        { required: true, message: t('attendance.holidayFlow.design.ruleType'), trigger: 'change' }
      ],
      name: [
        { required: true, message: t('attendance.holidayFlow.design.ruleName'), trigger: 'blur' }
      ],
      schools: [
        {
          required: true,
          message: t('attendance.holidayFlow.design.ruleSchool'),
          trigger: 'change'
        }
      ],
      leaveType: [
        {
          required: true,
          message: t('attendance.holidayFlow.design.ruleLeaveType'),
          trigger: 'change'
        }
      ]
    },
    schema: [
      {
        field: 'type',
        label: t('attendance.holidayFlow.design.flowType'),
        component: 'ElSelect',
        options: [
          { label: t('attendance.holidayFlow.design.typeLeave'), value: 'holiday' },
          { label: t('attendance.holidayFlow.design.typeReturn'), value: 'holiday2' }
        ],
        componentProps: {
          style: { width: '360px', maxWidth: '100%' }
        }
      },
      {
        field: 'name',
        label: t('attendance.holidayFlow.flowDef.colName'),
        component: 'ElInput',
        componentProps: {
          clearable: true,
          style: { width: '360px', maxWidth: '100%' }
        }
      },
      {
        field: 'schools',
        label: t('attendance.school'),
        component: 'ElSelect',
        options: schoolOptions,
        componentProps: {
          multiple: true,
          collapseTags: true,
          clearable: true,
          filterable: true,
          style: { width: '360px', maxWidth: '100%' }
        }
      },
      {
        field: 'leaveType',
        label: t('attendance.holidayFlow.flowDef.colLeaveType'),
        component: 'ElSelect',
        options: [
          { label: t('attendance.holiday.leavePersonal'), value: '101' },
          { label: t('attendance.holiday.leaveSick'), value: '102' }
        ],
        componentProps: {
          clearable: true,
          style: { width: '360px', maxWidth: '100%' }
        }
      },
      {
        field: 'needApproval',
        label: t('attendance.holidayFlow.flowDef.needApproval'),
        component: 'ElSelect',
        options: [
          { label: t('attendance.yes'), value: '101' },
          { label: t('attendance.no'), value: '102' }
        ],
        componentProps: {
          style: { width: '360px', maxWidth: '100%' }
        }
      }
    ]
  }
}
