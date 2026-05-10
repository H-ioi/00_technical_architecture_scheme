
import { rule } from "@/util/validateRules";
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  viewBtn: true,
  column: [{
    label: '角色名称',
    prop: 'roleName',
    span: 24,
    rules: [
      { required: true, message: '角色名称不能为空', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    'search': true,
  }, {
    label: '角色标识',
    prop: 'roleCode',
    span: 24,
    editDisabled: true,
    rules: [
      { required: true, message: '角色标识不能为空', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
      { validator: rule.validatorKey, trigger: 'blur' }
    ],
    'search': true,
  }, {
    width: 150,
    label: '角色描述',
    prop: 'roleDesc',
    overHidden: true,
    type: 'textarea',
    span: 24,
    row: true,
    minRows: 2,
    rules: [
      { max: 128, message: '长度在 128 个字符内', trigger: 'blur' }
    ]
  }, {
    width: 120,
    label: '数据权限',
    prop: 'dpType',
    type: 'select',
    span: 24,
    rules: [
      { required: true, message: '请选择数据权限类型', trigger: 'blur' }
    ],
    dicData: [{
      label: '全部',
      value: 1
    }, {
      label: '本人',
      value: 2
    }, {
      label: '本人及下属',
      value: 3
    }, {
      label: '本部门',
      value: 4
    }, {
      label: '本部门及下属部门',
      value: 5
    }, {
      label: '自定义',
      value: 6
    }],
    'search': true,
  }, {
    label: '',
    prop: 'dsScope',
    formslot: true,
    showClomnu: false,
    hide: true
  }, {
    width: 120,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    editDisplay: false,
    addDisplay: false,
    span: 24
  },
  {
    width: 150,
    label: '字典数据权限',
    prop: 'dictItemMap',
    overHidden: true,
    type: 'cascader',
    span: 24,
    row: true,
    multiple: true,
    'collapse-tags': true,
    rules: [],
    dicData: [
    ]
  },]
}
