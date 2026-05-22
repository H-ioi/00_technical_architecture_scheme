import { describe, it, expect, vi } from 'vitest'

// Mock uni-ui-lib
vi.mock('uni-ui-lib', () => ({
  toUniOptions: (rows: Record<string, unknown>[], _opts: Record<string, unknown>) => {
    return rows.map((row) => ({
      label: row.label ?? row.name ?? row.desc ?? row.moduleName,
      value: row.value ?? row.moduleCode ?? row.code ?? row.key ?? row.id
    }))
  }
}))

import { appModuleOptionsFromRows } from '../../utils/activity-email-school'

describe('activity-email-school.ts', () => {

  describe('appModuleOptionsFromRows', () => {
    const activityLabel = '活动模块'

    it('正常行生成选项并字符串化 value', () => {
      const rows = [
        { value: '1', label: '活动' },
        { value: '2', label: '通知' }
      ]
      const result = appModuleOptionsFromRows(rows, activityLabel)
      expect(result).toEqual([
        { label: '活动', value: '1' },
        { label: '通知', value: '2' }
      ])
    })

    it('缺少活动模块(value=1)时自动补入', () => {
      const rows = [
        { value: '2', label: '通知' },
        { value: '3', label: '作业' }
      ]
      const result = appModuleOptionsFromRows(rows, activityLabel)
      expect(result[0]).toEqual({ label: activityLabel, value: '1' })
      expect(result).toHaveLength(3)
    })

    it('已有 value=1 时不重复插入', () => {
      const rows = [{ value: 1, label: 'ExistingActivity' }]
      const result = appModuleOptionsFromRows(rows, activityLabel)
      expect(result).toHaveLength(1)
      expect(result[0].value).toBe('1')
    })

    it('value 使用 moduleCode 作为备选键（在补入项之后）', () => {
      const rows = [{ moduleCode: 'M001', label: 'Test' }]
      const result = appModuleOptionsFromRows(rows, activityLabel)
      // activityLabel 补入在 index 0
      expect(result[1].value).toBe('M001')
    })

    it('value 使用 code 作为备选键', () => {
      const rows = [{ code: 'C001', label: 'Test' }]
      const result = appModuleOptionsFromRows(rows, activityLabel)
      expect(result[1].value).toBe('C001')
    })

    it('value 使用 key 作为备选键', () => {
      const rows = [{ key: 'K001', label: 'Test' }]
      const result = appModuleOptionsFromRows(rows, activityLabel)
      expect(result[1].value).toBe('K001')
    })

    it('value 使用 id 作为备选键', () => {
      const rows = [{ id: 'ID001', label: 'Test' }]
      const result = appModuleOptionsFromRows(rows, activityLabel)
      expect(result[1].value).toBe('ID001')
    })

    it('label 使用 name 备选键', () => {
      const rows = [{ value: '10', name: 'NamedItem' }]
      const result = appModuleOptionsFromRows(rows, activityLabel)
      // activityLabel 作为补入的在 index 0
      expect(result[1]?.label).toBe('NamedItem')
    })
  })
})
