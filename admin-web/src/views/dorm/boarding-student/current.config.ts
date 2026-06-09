import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const hasBedFilterOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.yes'), value: 'true' },
  { label: t('attendance.no'), value: 'false' }
]

export const currentSearchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  buildingOptions: UniOption[],
  floorOptions: UniOption[],
  roomOptions: UniOption[],
  projectOptions: UniOption[],
  hasBedOptions: UniOption[],
  defaultSchoolId?: string | number
): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phSchool') },
      defaultValue: defaultSchoolId,
      colProps: { span: 4 }
    },
    {
      field: 'buildingId',
      label: '',
      component: 'ElSelect',
      options: buildingOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phBuilding') },
      colProps: { span: 4 }
    },
    {
      field: 'floorId',
      label: '',
      component: 'ElSelect',
      options: floorOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phFloor') },
      colProps: { span: 4 }
    },
    {
      field: 'roomId',
      label: '',
      component: 'ElSelect',
      options: roomOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phRoom') },
      colProps: { span: 4 }
    },
    {
      field: 'projectId',
      label: '',
      component: 'ElSelect',
      options: projectOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phProject') },
      colProps: { span: 4 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.boardingStudent.phKeyword') },
      colProps: { span: 4 }
    },
    {
      field: 'hasBed',
      label: '',
      component: 'ElSelect',
      options: hasBedOptions,
      componentProps: { clearable: true, placeholder: t('dorm.boardingStudent.phHasBed') },
      colProps: { span: 4 }
    },
    {
      field: 'checkinDateRange',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        startPlaceholder: t('dorm.boardingStudent.phCheckinDate'),
        endPlaceholder: t('dorm.boardingStudent.phCheckinDate')
      },
      colProps: { span: 6 }
    },
    {
      field: 'plannedCheckoutDateRange',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        startPlaceholder: t('dorm.boardingStudent.phPlannedCheckout'),
        endPlaceholder: t('dorm.boardingStudent.phPlannedCheckout')
      },
      colProps: { span: 6 }
    }
  ]
})

export const currentTableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'schoolName', label: t('dorm.boardingStudent.fieldSchool'), minWidth: 160, fixed: 'left' },
  { prop: 'admission_no', label: t('dorm.boardingStudent.fieldAdmissionNo'), minWidth: 120, fixed: 'left' },
  { prop: 'en_name', label: t('dorm.boardingStudent.fieldName'), minWidth: 120, fixed: 'left' },
  { prop: 'grade_code', label: t('dorm.boardingStudent.fieldGrade'), minWidth: 100 },
  { prop: 'form_code', label: t('dorm.boardingStudent.fieldClass'), minWidth: 100 },
  { prop: 'nationality', label: t('dorm.boardingStudent.fieldNationality'), minWidth: 100 },
  { prop: 'genderLabel', label: t('dorm.boardingStudent.fieldGender'), minWidth: 80 },
  { prop: 'birthdate', label: t('dorm.boardingStudent.fieldBirthdate'), minWidth: 120 },
  { prop: 'hasBedLabel', label: t('dorm.boardingStudent.fieldHasBed'), minWidth: 100 },
  { prop: 'project_name', label: t('dorm.boardingStudent.fieldProject'), minWidth: 100 },
  { prop: 'floor_name', label: t('dorm.boardingStudent.fieldFloor'), minWidth: 100 },
  { prop: 'room_room', label: t('dorm.boardingStudent.fieldRoom'), minWidth: 100 },
  { prop: 'bed_label', label: t('dorm.boardingStudent.fieldBed'), minWidth: 80 },
  { prop: 'checkin_date', label: t('dorm.boardingStudent.fieldCheckinDate'), minWidth: 120 },
  { prop: 'planned_checkout_date', label: t('dorm.boardingStudent.fieldPlannedCheckout'), minWidth: 120 }
]
