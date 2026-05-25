import { describe, it, expect } from 'vitest'

import { buildFlowEditFormConfig } from '../../../../views/attendance/flow/edit.config'
import type { UniOption } from 'uni-ui-lib'

const mockT = (key: string) => key

describe('edit.config.ts', () => {
  const schoolOptions: UniOption[] = [
    { label: '深圳校区', value: '1' },
    { label: '广州校区', value: '2' }
  ]

  describe('buildFlowEditFormConfig', () => {
    const config = buildFlowEditFormConfig(mockT, schoolOptions)

    it('应返回 UniFormConfig 结构', () => {
      expect(config).toHaveProperty('formProps')
      expect(config).toHaveProperty('rowProps')
      expect(config).toHaveProperty('colProps')
      expect(config).toHaveProperty('rules')
      expect(config).toHaveProperty('schema')
    })

    it('formProps 应有 labelWidth', () => {
      expect(config.formProps.labelWidth).toBe('120px')
    })

    it('规则应包含 type、name、schools、leaveType', () => {
      expect(config.rules).toHaveProperty('type')
      expect(config.rules).toHaveProperty('name')
      expect(config.rules).toHaveProperty('schools')
      expect(config.rules).toHaveProperty('leaveType')
    })

    it('type 规则为必填', () => {
      const rule = config.rules!.type![0]
      expect(rule.required).toBe(true)
      expect(rule.message).toBe('attendance.holidayFlow.design.ruleType')
      expect(rule.trigger).toBe('change')
    })

    it('name 规则为必填且 trigger 为 blur', () => {
      const rule = config.rules!.name![0]
      expect(rule.required).toBe(true)
      expect(rule.trigger).toBe('blur')
    })

    it('schools 规则为必填', () => {
      const rule = config.rules!.schools![0]
      expect(rule.required).toBe(true)
    })

    it('leaveType 规则为必填', () => {
      const rule = config.rules!.leaveType![0]
      expect(rule.required).toBe(true)
    })

    it('schema 应包含 5 个表单项', () => {
      expect(config.schema).toHaveLength(5)
    })

    it('第一个 schema 项为 type 选择（请假/销假流程类型）', () => {
      const field = config.schema[0]
      expect(field.field).toBe('type')
      expect(field.label).toBe('attendance.holidayFlow.design.flowType')
      expect(field.component).toBe('ElSelect')
      expect(field.options).toEqual([
        { label: 'attendance.holidayFlow.design.typeLeave', value: 'holiday' },
        { label: 'attendance.holidayFlow.design.typeReturn', value: 'holiday2' }
      ])
    })

    it('第二个 schema 项为 name 输入框', () => {
      const field = config.schema[1]
      expect(field.field).toBe('name')
      expect(field.component).toBe('ElInput')
      expect(field.componentProps).toMatchObject({ clearable: true })
    })

    it('第三个 schema 项为 schools 多选', () => {
      const field = config.schema[2]
      expect(field.field).toBe('schools')
      expect(field.component).toBe('ElSelect')
      expect(field.options).toEqual(schoolOptions)
      expect(field.componentProps).toMatchObject({
        multiple: true,
        collapseTags: true,
        clearable: true,
        filterable: true
      })
    })

    it('第四个 schema 项为 leaveType 选择', () => {
      const field = config.schema[3]
      expect(field.field).toBe('leaveType')
      expect(field.component).toBe('ElSelect')
      expect(field.options).toEqual([
        { label: 'attendance.holiday.leavePersonal', value: '101' },
        { label: 'attendance.holiday.leaveSick', value: '102' }
      ])
    })

    it('第五个 schema 项为 needApproval 选择', () => {
      const field = config.schema[4]
      expect(field.field).toBe('needApproval')
      expect(field.component).toBe('ElSelect')
      expect(field.options).toEqual([
        { label: 'attendance.yes', value: '101' },
        { label: 'attendance.no', value: '102' }
      ])
    })

    it('schema 每项应明确指定 field、label、component', () => {
      for (const field of config.schema) {
        expect(field).toHaveProperty('field')
        expect(field).toHaveProperty('label')
        expect(field).toHaveProperty('component')
      }
    })
  })
})
