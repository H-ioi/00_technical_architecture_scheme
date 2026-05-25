import { describe, it, expect } from 'vitest'
import {
  normalizeHolidayListRow,
  normalizeHolidayReturnRow
} from '../../../views/attendance/holiday/holiday-utils'

describe('holiday-utils.ts', () => {
  // ==================== normalizeHolidayListRow ====================
  describe('normalizeHolidayListRow', () => {
    it('camelCase procId 应直接保留', () => {
      const row = normalizeHolidayListRow({ procId: 'PROC-001', id: 'ID-001' })
      expect(row.procId).toBe('PROC-001')
      expect(row.id).toBe('ID-001')
    })

    it('snake_case proc_id 应映射到 procId', () => {
      const row = normalizeHolidayListRow({ proc_id: 'PROC-SNAKE' })
      expect(row.procId).toBe('PROC-SNAKE')
    })

    it('processId 备选', () => {
      const row = normalizeHolidayListRow({ processId: 'PID-001' })
      expect(row.procId).toBe('PID-001')
    })

    it('process_id 备选', () => {
      const row = normalizeHolidayListRow({ process_id: 'pid-002' })
      expect(row.procId).toBe('pid-002')
    })

    it('procInstId 备选', () => {
      const row = normalizeHolidayListRow({ procInstId: 'INST-001' })
      expect(row.procId).toBe('INST-001')
    })

    it('proc_inst_id 备选', () => {
      const row = normalizeHolidayListRow({ proc_inst_id: 'inst-002' })
      expect(row.procId).toBe('inst-002')
    })

    it('procId 已有值时不被覆盖', () => {
      const row = normalizeHolidayListRow({
        procId: 'FIRST',
        proc_id: 'SECOND',
        processId: 'THIRD'
      })
      expect(row.procId).toBe('FIRST')
    })

    it('当 procId 为空串且有 proc_id 时，procId 不填充（?? 不兜底空串）', () => {
      const row = normalizeHolidayListRow({ procId: '', proc_id: 'FILL-ME' })
      // procId 空串虽然会被空值检查，但 ?? 先取了 procId 空串，proc 就是空串，不符合填充条件
      expect(row.procId).toBe('')
    })

    it('当无 procId 仅 proc_id 时正确映射', () => {
      const row = normalizeHolidayListRow({ proc_id: 'FILL-ME' })
      expect(row.procId).toBe('FILL-ME')
    })

    it('holiday_id 应映射到 id', () => {
      const row = normalizeHolidayListRow({ holiday_id: 'HOLIDAY-001' })
      expect(row.id).toBe('HOLIDAY-001')
    })

    it('holidayId 应映射到 id（当 id 为空）', () => {
      const row = normalizeHolidayListRow({ id: '', holidayId: 'H-002' })
      expect(row.id).toBe('H-002')
    })

    it('id 已有值时不被 holidayId 覆盖', () => {
      const row = normalizeHolidayListRow({ id: 'EXISTING', holidayId: 'NEW' })
      expect(row.id).toBe('EXISTING')
    })

    it('data_from 应映射到 dataFrom', () => {
      const row = normalizeHolidayListRow({ data_from: 'manual' })
      expect(row.dataFrom).toBe('manual')
    })

    it('dataFrom 已有值时不被 data_from 覆盖', () => {
      const row = normalizeHolidayListRow({ dataFrom: 'auto', data_from: 'manual' })
      expect(row.dataFrom).toBe('auto')
    })

    it('空对象不应报错', () => {
      const row = normalizeHolidayListRow({})
      expect(row).toBeDefined()
    })

    it('其他字段原样保留', () => {
      const row = normalizeHolidayListRow({ reason: '病假', admissionNo: 'S001' })
      expect(row.reason).toBe('病假')
      expect(row.admissionNo).toBe('S001')
    })
  })

  // ==================== normalizeHolidayReturnRow ====================
  describe('normalizeHolidayReturnRow', () => {

    describe('嵌套对象摊平', () => {
      it('应将 holiday 对象摊平到顶层', () => {
        const row = normalizeHolidayReturnRow({
          otherField: 'keep',
          holiday: { admissionNo: 'S001', type: '病假', reason: '感冒' }
        })
        expect(row.admissionNo).toBe('S001')
        expect(row.type).toBe('病假')
        expect(row.reason).toBe('感冒')
        expect(row.otherField).toBe('keep')
      })

      const nestedKeys = ['holiday', 'holidayInfo', 'isaHoliday', 'leaveHoliday', 'holidayVo', 'holidayDTO', 'holidayEntity']
      nestedKeys.forEach((key) => {
        it(`摊平 ${key} 嵌套对象`, () => {
          const raw = { [key]: { admissionNo: `TEST-${key}` } }
          const result = normalizeHolidayReturnRow(raw)
          expect(result.admissionNo).toBe(`TEST-${key}`)
        })
      })

      it('无嵌套对象时不应报错', () => {
        const result = normalizeHolidayReturnRow({ admissionNo: 'DIRECT' })
        expect(result.admissionNo).toBe('DIRECT')
      })
    })

    describe('学号字段归一化', () => {
      const admissionKeys = ['admissonNo', 'admissionNo', 'studentAdmissionNo', 'admissionNumber', 'student_admission_no', 'admission_no', 'stuNo', 'studentNo', 'student_no']
      admissionKeys.forEach((key) => {
        it(`应从 ${key} 取学号`, () => {
          const result = normalizeHolidayReturnRow({ [key]: 'STU-123' })
          expect(result.admissonNo).toBe('STU-123')
        })
      })
    })

    describe('类型字段归一化', () => {
      it.each([
        ['type', '事假'],
        ['holidayType', '病假'],
        ['leaveType', '年假'],
        ['holiday_type', '事假2'],
        ['leave_type', '调休']
      ])('应从 %s 取请假类型', (sourceKey, expected) => {
        const result = normalizeHolidayReturnRow({ [sourceKey]: expected })
        expect(result.type).toBe(expected)
      })
    })

    describe('原因字段归一化', () => {
      it.each(['reason', 'holidayReason', 'leaveReason', 'remark', 'leave_reason', 'reasonDesc', 'reason_desc'])(
        '应从 %s 取原因', (key) => {
          const result = normalizeHolidayReturnRow({ [key]: 'TestReason' })
          expect(result.reason).toBe('TestReason')
        }
      )
    })

    describe('scope 数组化', () => {
      it('逗号分隔字符串应拆分为数组', () => {
        const result = normalizeHolidayReturnRow({ scope: '周一,周二,周三' })
        expect(result.scope).toEqual(['周一', '周二', '周三'])
      })

      it('中文逗号也应拆分', () => {
        const result = normalizeHolidayReturnRow({ scope: '语文，数学，英语' })
        expect(result.scope).toEqual(['语文', '数学', '英语'])
      })

      it('数组应原样返回', () => {
        const arr = ['A', 'B'] as unknown[]
        const result = normalizeHolidayReturnRow({ scope: arr })
        expect(result.scope).toEqual(arr)
      })

      it('JSON 字符串数组应解析', () => {
        const result = normalizeHolidayReturnRow({ scope: '["X","Y"]' })
        expect(result.scope).toEqual(['X', 'Y'])
      })

      it('null 返回 undefined（firstNonEmptyField 过滤 null）', () => {
        const result = normalizeHolidayReturnRow({ scope: null })
        expect(result.scope).toBeUndefined()
      })
    })

    describe('dateLimit 范围化', () => {
      it('~ 连接符应拆分为数组（日期不含 -）', () => {
        // 注意：日期中的 - 也会被拆分，此处用不含 - 的日期格式测试
        const result = normalizeHolidayReturnRow({ dateLimit: '20240601 ~ 20240630' })
        expect(Array.isArray(result.dateLimit)).toBe(true)
        expect(result.dateLimit).toHaveLength(2)
      })

      it('- 连接符拆分为数组', () => {
        const result = normalizeHolidayReturnRow({ dateLimit: 'Start - End' })
        expect(Array.isArray(result.dateLimit)).toBe(true)
        expect(result.dateLimit).toHaveLength(2)
      })

      it('数组应原样返回', () => {
        const arr = ['start', 'end'] as unknown[]
        const result = normalizeHolidayReturnRow({ dateLimit: arr })
        expect(result.dateLimit).toEqual(arr)
      })

      it('JSON 字符串数组应解析', () => {
        const result = normalizeHolidayReturnRow({ dateLimit: '["2024-01-01","2024-12-31"]' })
        expect(result.dateLimit).toEqual(['2024-01-01', '2024-12-31'])
      })
    })

    describe('weekDays 数组化', () => {
      it('逗号分隔应拆分', () => {
        const result = normalizeHolidayReturnRow({ weekDays: 'Mon,Tue,Wed' })
        expect(result.weekDays).toEqual(['Mon', 'Tue', 'Wed'])
      })

      it('从 week_days 别名取', () => {
        const result = normalizeHolidayReturnRow({ week_days: 'Mon,Wed' })
        expect(result.weekDays).toEqual(['Mon', 'Wed'])
      })
    })

    describe('dateString 时间范围文本', () => {
      it('从 dateString 字段取', () => {
        const result = normalizeHolidayReturnRow({ dateString: '2024-01-01 ~ 2024-01-07' })
        expect(result.dateString).toBe('2024-01-01 ~ 2024-01-07')
      })

      it('从 beginTime + endTime 拼合', () => {
        const result = normalizeHolidayReturnRow({ beginTime: '2024-02-01', endTime: '2024-02-05' })
        expect(result.dateString).toBe('2024-02-01 ~ 2024-02-05')
      })

      it('从 startDate + endDate 拼合', () => {
        const result = normalizeHolidayReturnRow({ startDate: '2024-03-01', end_date: '2024-03-10' })
        expect(result.dateString).toBe('2024-03-01 ~ 2024-03-10')
      })
    })

    describe('isInfectious 归一化', () => {
      it.each(['isInfectious', 'is_infectious', 'infectious'])('从 %s 取', (key) => {
        const result = normalizeHolidayReturnRow({ [key]: 'true' })
        expect(result.isInfectious).toBe('true')
      })
    })

    describe('fixed 归一化', () => {
      it.each(['fixed', 'isFixed', 'fixed_leave', 'fixedLeave'])('从 %s 取', (key) => {
        const result = normalizeHolidayReturnRow({ [key]: '1' })
        expect(result.fixed).toBe('1')
      })
    })

    describe('status 归一化', () => {
      it.each(['status', 'holidayStatus', 'approvalStatus', 'holiday_status'])('从 %s 取', (key) => {
        const result = normalizeHolidayReturnRow({ [key]: 'approved' })
        expect(result.status).toBe('approved')
      })
    })

    describe('createdAt 归一化', () => {
      it.each(['createdAt', 'created_at', 'createTime', 'create_time', 'gmtCreate', 'gmt_create'])(
        '从 %s 取', (key) => {
          const result = normalizeHolidayReturnRow({ [key]: '2024-05-01' })
          expect(result.createdAt).toBe('2024-05-01')
        }
      )
    })

    describe('holidayId 归一化', () => {
      it('从 holidayId 取', () => {
        const result = normalizeHolidayReturnRow({ holidayId: 'HOL-001' })
        expect(result.holidayId).toBe('HOL-001')
      })

      it('从 holiday_id 备选取', () => {
        const result = normalizeHolidayReturnRow({ holiday_id: 'HOL-002' })
        expect(result.holidayId).toBe('HOL-002')
      })

      it('从 leaveId 备选取', () => {
        const result = normalizeHolidayReturnRow({ leaveId: 'LEAVE-001' })
        expect(result.holidayId).toBe('LEAVE-001')
      })
    })

    describe('scope 备选键', () => {
      it.each(['holidayScope', 'scopeList', 'scopes'])('从 %s 取 scope', (key) => {
        const result = normalizeHolidayReturnRow({ [key]: 'A,B' })
        expect(result.scope).toEqual(['A', 'B'])
      })
    })

    describe('weekDays 备选键', () => {
      it.each(['weekDayList'])('从 %s 取 weekDays', (key) => {
        const result = normalizeHolidayReturnRow({ [key]: 'Mon,Thu' })
        expect(result.weekDays).toEqual(['Mon', 'Thu'])
      })
    })
  })
})
