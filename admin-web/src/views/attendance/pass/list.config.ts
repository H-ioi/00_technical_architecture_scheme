import type { Translate } from '@/types/i18n'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

export const searchForm = (t: Translate, schoolOptions: UniOption[]): UniFormConfig => ({
  schema: [
    {
      field: 'studentSchool',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.phSchoolOrg'),
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
        { label: t('attendance.yes'), value: '1' },
        { label: t('attendance.no'), value: '0' }
      ],
      componentProps: {
        clearable: true,
        placeholder: t('attendance.holidayPass.phDorm')
      },
      colProps: { span: 4 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: t('attendance.phKeyword')
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  {
    prop: 'studentNo',
    label: t('attendance.holidayPass.colStudentNo'),
    type: 'text',
    minWidth: 110,
    fixed: 'left'
  },
  {
    prop: 'studentName',
    label: t('attendance.studentName'),
    type: 'text',
    minWidth: 180
  },
  {
    prop: 'studentSchool',
    label: t('attendance.school'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'studentGrade',
    label: t('attendance.grade'),
    type: 'text',
    minWidth: 88
  },
  {
    prop: 'studentClass',
    label: t('attendance.className'),
    type: 'text',
    minWidth: 88
  },
  {
    prop: 'studentDormitoryStatus',
    label: t('attendance.boarding'),
    type: 'text',
    minWidth: 88,
    formatter: (row) => {
      const v = (row as { studentDormitoryStatus?: number }).studentDormitoryStatus
      return v === 1 ? t('attendance.yes') : t('attendance.no')
    }
  },
  {
    prop: 'createdBy',
    label: t('attendance.holidayPass.releasedBy'),
    type: 'text',
    minWidth: 100
  },
  {
    prop: 'way',
    label: t('attendance.holidayPass.way'),
    type: 'text',
    minWidth: 100,
    formatter: (row) => {
      const w = String((row as { way?: string }).way ?? '')
      if (w === 'parents') {
        return t('attendance.holidayPass.wayParents')
      }
      if (w === 'self') {
        return t('attendance.holidayPass.waySelf')
      }
      return w || '—'
    }
  },
  {
    prop: 'leaveRange',
    label: t('attendance.holidayPass.leaveRange'),
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
    label: t('attendance.holidayPass.passTime'),
    type: 'text',
    minWidth: 110
  },
  {
    prop: 'isLeave',
    label: t('attendance.holidayPass.isLeave'),
    type: 'text',
    minWidth: 88,
    formatter: (row) => {
      const v = (row as { isLeave?: number }).isLeave
      return v === 0 ? t('attendance.yes') : t('attendance.no')
    }
  },
  {
    prop: 'dateLimit',
    label: t('attendance.holidayPass.slot'),
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
    label: t('attendance.status'),
    type: 'text',
    minWidth: 96,
    formatter: (row) => {
      const s = String((row as { status?: number }).status ?? '')
      const map: Record<string, string> = {
        '0': t('attendance.holidayPass.stActive'),
        '1': t('attendance.holidayPass.stVoided'),
        '2': t('attendance.holidayPass.stPendingGenerate'),
        '3': t('attendance.holidayPass.stExpired')
      }
      return map[s] ?? '—'
    }
  },
  {
    prop: 'createdAt',
    label: t('attendance.createdAt'),
    type: 'datetime',
    minWidth: 160,
    showOverflowTooltip: true
  }
]
