import { describe, it, expect, vi } from 'vitest'

// ========== Mock uni-ui-lib (needed by dict-options.ts) ==========
vi.mock('uni-ui-lib', () => ({
  toUniOptions: (rows: Record<string, unknown>[], opts: Record<string, unknown>) =>
    rows.map((row) => {
      const labelKeys = (opts.labelKeys as string[]) || ['name', 'cnName', 'enName']
      let label = ''
      for (const key of labelKeys) {
        const val = row[key]
        if (val != null && String(val) !== '') {
          label = String(val)
          break
        }
      }
      return { label, value: row.value ?? row[opts.valueKey as string] ?? row.id }
    })
}))

import type { UniOption } from 'uni-ui-lib'
import {
  yesNoOpts,
  statusOpts,
  searchForm,
  tableCols,
  signCols,
  detailForm,
  formRules,
  protocolDialogFormConfig
} from '../../../views/protocol/list.config'

const t = (key: string) => key
const locale = 'zh'

const schoolOpts: UniOption[] = [
  { label: '深圳校区', value: '1' },
  { label: '广州校区', value: '2' }
]
const protocolTypeOpts: UniOption[] = [
  { label: '服务协议', value: '1' },
  { label: '隐私政策', value: '2' }
]
const moduleOpts: UniOption[] = [
  { label: '学生端', value: 'student' },
  { label: '教师端', value: 'teacher' }
]
const yesNoOptsArr: UniOption[] = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]
const statusOptsArr: UniOption[] = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

describe('list.config.ts', () => {

  describe('yesNoOpts', () => {
    it('应生成是/否选项', () => {
      const opts = yesNoOpts(t)
      expect(opts).toHaveLength(2)
      expect(opts[0]).toMatchObject({ label: 'protocol.yes', value: 1, type: 'success' })
      expect(opts[1]).toMatchObject({ label: 'protocol.no', value: 0, type: 'info' })
    })
  })

  describe('statusOpts', () => {
    it('应生成启用/禁用选项', () => {
      const opts = statusOpts(t)
      expect(opts).toHaveLength(2)
      expect(opts[0]).toMatchObject({ label: 'protocol.enabled', value: 1, type: 'success' })
      expect(opts[1]).toMatchObject({ label: 'protocol.disabled', value: 0, type: 'info' })
    })
  })

  describe('searchForm', () => {
    const form = searchForm(t, schoolOpts, protocolTypeOpts, moduleOpts, statusOptsArr)

    it('应包含 6 个搜索字段', () => {
      expect(form.schema).toHaveLength(6)
    })

    it('第一个字段为 schoolIds 校区选择', () => {
      const f = form.schema[0]
      expect(f.field).toBe('schoolIds')
      expect(f.component).toBe('ElSelect')
      expect(f.options).toEqual(schoolOpts)
      expect(f.componentProps).toMatchObject({ filterable: true, clearable: true })
    })

    it('第二个字段为 cnName 中文名', () => {
      const f = form.schema[1]
      expect(f.field).toBe('cnName')
      expect(f.component).toBe('ElInput')
    })

    it('第三个字段为 enName 英文名', () => {
      const f = form.schema[2]
      expect(f.field).toBe('enName')
      expect(f.component).toBe('ElInput')
    })

    it('第四个字段为 protocolType 类型选择', () => {
      const f = form.schema[3]
      expect(f.field).toBe('protocolType')
      expect(f.component).toBe('ElSelect')
    })

    it('第五个字段为 module 模块选择', () => {
      const f = form.schema[4]
      expect(f.field).toBe('module')
    })

    it('第六个字段为 status 状态', () => {
      const f = form.schema[5]
      expect(f.field).toBe('status')
    })

    it('rowProps 应有 gutter=8', () => {
      expect(form.rowProps).toEqual({ gutter: 8 })
    })
  })

  describe('tableCols', () => {
    const cols = tableCols(t, locale, schoolOpts, protocolTypeOpts, moduleOpts, yesNoOptsArr, statusOptsArr)

    it('应包含至少 10 列', () => {
      expect(cols.length).toBeGreaterThanOrEqual(10)
    })

    it('ID 列应为 fixed left', () => {
      const idCol = cols.find((c) => c.prop === 'id')
      expect(idCol).toBeDefined()
      expect(idCol?.fixed).toBe('left')
    })

    it('schoolIds 列应为 array 类型', () => {
      const col = cols.find((c) => c.prop === 'schoolIds')
      expect(col).toBeDefined()
      expect(col?.type).toBe('array')
    })

    it('needSign 和 status 列应为 tag 类型', () => {
      const needSignCol = cols.find((c) => c.prop === 'needSign')
      const statusCol = cols.find((c) => c.prop === 'status')
      expect(needSignCol?.type).toBe('tag')
      expect(statusCol?.type).toBe('tag')
    })

    it('protocolType 列应有 formatter', () => {
      const col = cols.find((c) => c.prop === 'protocolType')
      expect(col).toBeDefined()
      expect(col?.formatter).toBeDefined()
    })

    it('createTime / updateTime 应为 datetime 类型', () => {
      const createCol = cols.find((c) => c.prop === 'createTime')
      const updateCol = cols.find((c) => c.prop === 'updateTime')
      expect(createCol?.type).toBe('datetime')
      expect(updateCol?.type).toBe('datetime')
    })
  })

  describe('signCols', () => {
    const cols = signCols(t)

    it('应包含 6 列', () => {
      expect(cols).toHaveLength(6)
    })

    it('应包含 studentName、admissionNo 列', () => {
      const props = cols.map((c) => c.prop)
      expect(props).toContain('studentName')
      expect(props).toContain('admissionNo')
    })

    it('signImageUrl 应为 link 类型', () => {
      const col = cols.find((c) => c.prop === 'signImageUrl')
      expect(col?.type).toBe('link')
    })
  })

  describe('detailForm', () => {
    const form = detailForm(t)

    it('mode 应为 view', () => {
      expect(form.mode).toBe('view')
    })

    it('formProps 应有 labelWidth=120px', () => {
      expect(form.formProps).toMatchObject({ labelWidth: '120px' })
    })

    it('view.emptyText 应为 -', () => {
      expect(form.view).toMatchObject({ emptyText: '-' })
    })

    it('schema 应至少包含 11 个字段', () => {
      expect(form.schema.length).toBeGreaterThanOrEqual(11)
    })

    it('documentUrl 列 colProps 应为 span=24', () => {
      const docCol = form.schema.find((c) => c.field === 'documentUrl')
      expect(docCol?.colProps).toEqual({ span: 24 })
    })
  })

  describe('formRules', () => {
    const rules = formRules(t)

    it('schoolIds 应为必填', () => {
      expect(rules.schoolIds).toBeDefined()
      expect(rules.schoolIds![0].required).toBe(true)
    })

    it('cnName / enName 应为必填', () => {
      expect(rules.cnName![0].required).toBe(true)
      expect(rules.enName![0].required).toBe(true)
    })

    it('protocolType / module 应为必填', () => {
      expect(rules.protocolType![0].required).toBe(true)
      expect(rules.module![0].required).toBe(true)
    })

    it('needSign / status / documentUrl 应为必填', () => {
      expect(rules.needSign![0].required).toBe(true)
      expect(rules.status![0].required).toBe(true)
      expect(rules.documentUrl![0].required).toBe(true)
    })

    it('共 8 个必填字段', () => {
      expect(Object.keys(rules)).toHaveLength(8)
    })
  })

  describe('protocolDialogFormConfig', () => {
    const config = protocolDialogFormConfig(t, schoolOpts, protocolTypeOpts, moduleOpts, yesNoOptsArr, statusOptsArr)

    it('formProps 应为 labelPosition=top', () => {
      expect(config.formProps).toMatchObject({ labelPosition: 'top' })
    })

    it('schema 应包含 8 个字段', () => {
      expect(config.schema).toHaveLength(8)
    })

    it('第一个字段 schoolIds 应有 multiple 和 collapseTags', () => {
      const f = config.schema[0]
      expect(f.field).toBe('schoolIds')
      expect(f.component).toBe('ElSelect')
      expect(f.componentProps).toMatchObject({
        multiple: true,
        collapseTags: true,
        filterable: true,
        clearable: true
      })
    })

    it('cnName 输入框应有 maxlength=50', () => {
      const f = config.schema.find((s) => s.field === 'cnName')
      expect(f?.componentProps).toMatchObject({ maxlength: 50 })
    })

    it('enName 输入框应有 maxlength=50', () => {
      const f = config.schema.find((s) => s.field === 'enName')
      expect(f?.componentProps).toMatchObject({ maxlength: 50 })
    })

    it('documentUrl colProps 应为 span=24', () => {
      const f = config.schema.find((s) => s.field === 'documentUrl')
      expect(f?.colProps).toEqual({ span: 24 })
    })

    it('应有 rules 校验', () => {
      expect(config.rules).toBeDefined()
    })
  })
})
