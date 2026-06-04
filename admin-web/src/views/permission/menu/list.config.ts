import type {
  UniDataTableTree,
  UniFormConfig,
  UniTableColumn,
  UniTableToolbarConfig
} from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export type MenuParentOption = {
  label: string
  value: string | number
}

export const menuTableToolbar: UniTableToolbarConfig = {
  refresh: true,
  density: true,
  columnSetting: true
}

export const menuTableTree: UniDataTableTree = {
  defaultExpandAll: false,
  props: { children: 'children' }
}

export const tableCols = (t: Translate): UniTableColumn[] => [
  {
    prop: 'name',
    label: t('permission.menu.colName'),
    type: 'text',
    minWidth: 180
  },
  {
    prop: 'icon',
    label: t('permission.menu.colIcon'),
    type: 'text',
    width: 100,
    align: 'center'
  },
  {
    prop: 'sort',
    label: t('permission.menu.colSort'),
    type: 'text',
    width: 72,
    align: 'center'
  },
  {
    prop: 'path',
    label: t('permission.menu.colPath'),
    type: 'text',
    minWidth: 160
  },
  {
    prop: 'type',
    label: t('permission.menu.colType'),
    type: 'text',
    width: 100,
    align: 'center'
  },
  {
    prop: 'keepAlive',
    label: t('permission.menu.colCache'),
    type: 'text',
    width: 88,
    align: 'center'
  },
  {
    prop: 'permission',
    label: t('permission.menu.colPermission'),
    type: 'text',
    minWidth: 160
  }
]

export const menuEditDialogFormConfig = (
  t: Translate,
  parentOptions: MenuParentOption[]
): UniFormConfig => ({
  formProps: {
    labelPosition: 'right',
    labelWidth: '96px'
  },
  rowProps: { gutter: 16 },
  colProps: { span: 24 },
  rules: {
    name: [{ required: true, message: t('permission.menu.fieldName'), trigger: 'blur' }],
    sort: [{ required: true, message: t('permission.menu.sort'), trigger: 'change' }]
  },
  schema: [
    {
      field: 'parentId',
      label: t('permission.menu.parent'),
      component: 'ElSelect',
      options: parentOptions,
      componentProps: {
        filterable: true,
        placeholder: t('permission.menu.parent'),
        style: { width: '100%' }
      }
    },
    {
      field: 'icon',
      label: t('permission.menu.icon'),
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: t('permission.menu.icon')
      }
    },
    {
      field: 'name',
      label: t('permission.menu.fieldName'),
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: t('permission.menu.fieldName')
      }
    },
    {
      field: 'sort',
      label: t('permission.menu.sort'),
      component: 'ElInputNumber',
      componentProps: {
        min: 0,
        controlsPosition: 'right',
        style: { width: '100%' }
      }
    }
  ]
})
