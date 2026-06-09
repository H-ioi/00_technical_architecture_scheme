import type { FormRules } from 'element-plus'
import type { UniFormConfig } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { DormStudentEditModel } from '@/types/modules/dorm-student'

export type BoardingEditFormModel = DormStudentEditModel & {
  roomId?: string | number
}

export const emptyEditModel = (): BoardingEditFormModel => ({
  admissionNo: '',
  school: undefined,
  buildingId: undefined,
  floorId: undefined,
  roomId: undefined,
  bedId: undefined,
  projectId: undefined,
  checkinDate: '',
  plannedCheckoutDate: '',
  paymentStatus: 0
})

export const editFormConfig = (
  t: Translate,
  schoolOptions: Array<{ label: string; value: string | number }>,
  buildingOptions: Array<{ label: string; value: string | number }>,
  floorOptions: Array<{ label: string; value: string | number }>,
  roomOptions: Array<{ label: string; value: string | number }>,
  bedOptions: Array<{ label: string; value: string | number }>,
  projectOptions: Array<{ label: string; value: string | number }>
): UniFormConfig => ({
  labelWidth: '110px',
  schema: [
    {
      field: 'school',
      label: t('dorm.boardingStudent.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phSchool') },
      colProps: { span: 24 }
    },
    {
      field: 'buildingId',
      label: t('dorm.boardingStudent.fieldBuilding'),
      component: 'ElSelect',
      options: buildingOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phBuilding') },
      colProps: { span: 24 }
    },
    {
      field: 'floorId',
      label: t('dorm.boardingStudent.fieldFloor'),
      component: 'ElSelect',
      options: floorOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phFloor') },
      colProps: { span: 24 }
    },
    {
      field: 'roomId',
      label: t('dorm.boardingStudent.fieldRoom'),
      component: 'ElSelect',
      options: roomOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phRoom') },
      colProps: { span: 24 }
    },
    {
      field: 'bedId',
      label: t('dorm.boardingStudent.fieldBed'),
      component: 'ElSelect',
      options: bedOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phBed') },
      colProps: { span: 24 }
    },
    {
      field: 'projectId',
      label: t('dorm.boardingStudent.fieldProject'),
      component: 'ElSelect',
      options: projectOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.boardingStudent.phProject') },
      colProps: { span: 24 }
    },
    {
      field: 'checkinDate',
      label: t('dorm.boardingStudent.fieldCheckinDate'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: t('dorm.boardingStudent.phCheckinDateSingle'),
        style: { width: '100%' }
      },
      colProps: { span: 24 }
    },
    {
      field: 'plannedCheckoutDate',
      label: t('dorm.boardingStudent.fieldPlannedCheckout'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: t('dorm.boardingStudent.phPlannedCheckoutSingle'),
        style: { width: '100%' },
        disabledDate: (date: Date) => date.getTime() <= Date.now()
      },
      colProps: { span: 24 }
    },
    {
      field: 'paymentStatus',
      label: t('dorm.boardingStudent.fieldPaymentStatus'),
      component: 'ElSelect',
      options: [
        { label: t('dorm.boardingStudent.paymentUnpaid'), value: 0 },
        { label: t('dorm.boardingStudent.paymentPaid'), value: 1 }
      ],
      componentProps: { placeholder: t('dorm.boardingStudent.phPaymentStatus'), style: { width: '100%' } },
      colProps: { span: 24 }
    }
  ]
})

export const editFormRules = (t: Translate): FormRules => ({
  school: [{ required: true, message: t('dorm.boardingStudent.ruleSchool'), trigger: 'change' }],
  buildingId: [{ required: true, message: t('dorm.boardingStudent.ruleBuilding'), trigger: 'change' }],
  floorId: [{ required: true, message: t('dorm.boardingStudent.ruleFloor'), trigger: 'change' }],
  roomId: [{ required: true, message: t('dorm.boardingStudent.ruleRoom'), trigger: 'change' }],
  bedId: [{ required: true, message: t('dorm.boardingStudent.ruleBed'), trigger: 'change' }],
  projectId: [{ required: true, message: t('dorm.boardingStudent.ruleProject'), trigger: 'change' }]
})
