import type { Translate } from '@/types/i18n'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

export const leavePassSearchForm = (t: Translate, schoolOptions: UniOption[]): UniFormConfig => ({
  schema: [
    {
      field: 'studentSchool',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.holidayPass.placeholders.school'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'isDormitory',
      label: '',
      component: 'ElSelect',
      options: [
        { label: t('attendance.holiday.options.yes'), value: '1' },
        { label: t('attendance.holiday.options.no'), value: '0' }
      ],
      componentProps: {
        clearable: true,
        placeholder: t('attendance.holidayPass.placeholders.dorm')
      },
      colProps: { span: 4 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: t('attendance.holidayPass.placeholders.keyword')
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const leavePassColumns = (t: Translate): UniTableColumn[] => [
  {
    prop: 'studentNo',
    label: t('attendance.holidayPass.columns.studentNo'),
    type: 'text',
    minWidth: 110,
    fixed: 'left'
  },
  {
    prop: 'studentName',
    label: t('attendance.holidayPass.columns.studentName'),
    type: 'text',
    minWidth: 180
  },
  {
    prop: 'studentSchool',
    label: t('attendance.holidayPass.columns.school'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'studentGrade',
    label: t('attendance.holidayPass.columns.grade'),
    type: 'text',
    minWidth: 88
  },
  {
    prop: 'studentClass',
    label: t('attendance.holidayPass.columns.className'),
    type: 'text',
    minWidth: 88
  },
  {
    prop: 'studentDormitoryStatus',
    label: t('attendance.holidayPass.columns.dorm'),
    type: 'text',
    minWidth: 88,
    formatter: (row) => {
      const v = (row as { studentDormitoryStatus?: number }).studentDormitoryStatus
      return v === 1 ? t('attendance.holiday.options.yes') : t('attendance.holiday.options.no')
    }
  },
  {
    prop: 'createdBy',
    label: t('attendance.holidayPass.columns.releasedBy'),
    type: 'text',
    minWidth: 100
  },
  {
    prop: 'way',
    label: t('attendance.holidayPass.columns.way'),
    type: 'text',
    minWidth: 100,
    formatter: (row) => {
      const w = String((row as { way?: string }).way ?? '')
      if (w === 'parents') {
        return t('attendance.holidayPass.options.wayParents')
      }
      if (w === 'self') {
        return t('attendance.holidayPass.options.waySelf')
      }
      return w || '—'
    }
  },
  {
    prop: 'leaveRange',
    label: t('attendance.holidayPass.columns.leaveRange'),
    type: 'text',
    minWidth: 280,
    formatter: (row) => {
      const r = row as { beginTime?: string; endTime?: string }
      if (!r.beginTime && !r.endTime) {
        return '—'
      }
      return `${r.beginTime ?? ''} - ${r.endTime ?? ''}`
    }
  },
  {
    prop: 'passTime',
    label: t('attendance.holidayPass.columns.passTime'),
    type: 'text',
    minWidth: 110
  },
  {
    prop: 'isLeave',
    label: t('attendance.holidayPass.columns.isLeave'),
    type: 'text',
    minWidth: 88,
    formatter: (row) => {
      const v = (row as { isLeave?: number }).isLeave
      return v === 0 ? t('attendance.holiday.options.yes') : t('attendance.holiday.options.no')
    }
  },
  {
    prop: 'dateLimit',
    label: t('attendance.holidayPass.columns.slot'),
    type: 'text',
    minWidth: 110,
    formatter: (row) => {
      const d = (row as { dateLimit?: string[] }).dateLimit
      if (Array.isArray(d) && d.length === 2) {
        return `${d[0]}-${d[1]}`
      }
      return '—'
    }
  },
  {
    prop: 'status',
    label: t('attendance.holiday.columns.status'),
    type: 'text',
    minWidth: 96,
    formatter: (row) => {
      const s = String((row as { status?: number }).status ?? '')
      const map: Record<string, string> = {
        '0': t('attendance.holidayPass.status.active'),
        '1': t('attendance.holidayPass.status.voided'),
        '2': t('attendance.holidayPass.status.pendingGenerate'),
        '3': t('attendance.holidayPass.status.expired')
      }
      return map[s] ?? '—'
    }
  },
  {
    prop: 'createdAt',
    label: t('attendance.holiday.columns.createdAt'),
    type: 'datetime',
    minWidth: 160,
    showOverflowTooltip: true
  }
]
