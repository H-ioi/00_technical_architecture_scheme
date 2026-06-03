import type {
  UniDataTableTree,
  UniFormConfig,
  UniTableColumn,
  UniTableToolbarConfig
} from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export type DeptParentOption = {
  label: string
  value: string | number
}

export const deptTableToolbar: UniTableToolbarConfig = {
  refresh: true,
  density: true,
  columnSetting: true
}

export const deptTableTree: UniDataTableTree = {
  defaultExpandAll: true,
  props: { children: 'children' }
}

export const deptTableCols = (t: Translate): UniTableColumn[] => [
  {
    prop: 'name',
    label: t('permission.dept.colName'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'id',
    label: t('permission.dept.colId'),
    type: 'text',
    width: 96,
    align: 'center'
  },
  {
    prop: 'parentId',
    label: t('permission.dept.colParentId'),
    type: 'text',
    width: 100,
    align: 'center'
  },
  {
    prop: 'sort',
    label: t('permission.dept.colSort'),
    type: 'text',
    width: 88,
    align: 'center'
  }
]

export const deptDialogFormConfig = (
  t: Translate,
  mode: 'add' | 'edit',
  parentOptions: DeptParentOption[]
): UniFormConfig => ({
  formProps: {
    labelPosition: 'right',
    labelWidth: '108px'
  },
  rowProps: { gutter: 16 },
  colProps: { span: 24 },
  rules: {
    ...(mode === 'add'
      ? {
          parentId: [{ required: true, message: t('permission.dept.parent'), trigger: 'change' }]
        }
      : {
          deptId: [{ required: true, message: t('permission.dept.code'), trigger: 'blur' }]
        }),
    name: [
      { required: true, message: t('permission.dept.name'), trigger: 'blur' },
      { min: 2, max: 50, message: '2-50', trigger: 'blur' }
    ],
    sort: [{ required: true, message: t('permission.dept.sort'), trigger: 'change' }]
  },
  schema:
    mode === 'add'
      ? [
          {
            field: 'parentId',
            label: t('permission.dept.parent'),
            component: 'ElSelect',
            options: parentOptions,
            componentProps: {
              filterable: true,
              placeholder: t('permission.dept.parent'),
              style: { width: '100%' }
            }
          },
          {
            field: 'name',
            label: t('permission.dept.name'),
            component: 'ElInput',
            componentProps: {
              clearable: true,
              maxlength: 50,
              placeholder: t('permission.dept.name')
            }
          },
          {
            field: 'sort',
            label: t('permission.dept.sort'),
            component: 'ElInputNumber',
            componentProps: {
              min: 0,
              step: 1,
              stepStrictly: true,
              precision: 0,
              controlsPosition: 'right',
              style: { width: '100%' }
            }
          }
        ]
      : [
          {
            field: 'parentId',
            label: t('permission.dept.parent'),
            component: 'ElInput',
            componentProps: { disabled: true }
          },
          {
            field: 'deptId',
            label: t('permission.dept.code'),
            component: 'ElInput',
            componentProps: { disabled: true }
          },
          {
            field: 'name',
            label: t('permission.dept.name'),
            component: 'ElInput',
            componentProps: {
              clearable: true,
              maxlength: 50,
              placeholder: t('permission.dept.name')
            }
          },
          {
            field: 'sort',
            label: t('permission.dept.sort'),
            component: 'ElInputNumber',
            componentProps: {
              min: 0,
              step: 1,
              stepStrictly: true,
              precision: 0,
              controlsPosition: 'right',
              style: { width: '100%' }
            }
          }
        ]
})
