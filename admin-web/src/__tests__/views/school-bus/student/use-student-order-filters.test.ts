import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'

// ========== Mock uni-ui-lib ==========
vi.mock('uni-ui-lib', () => ({
  useUniI18n: () => ({
    locale: () => 'zh',
    t: (key: string) => key
  }),
  toUniOptions: (rows: Record<string, unknown>[], opts: Record<string, unknown>) =>
    rows.map((row) => {
      const labelKeys = (opts.labelKeys as string[]) || ['name']
      let label = ''
      for (const key of labelKeys) {
        const val = row[key]
        if (val != null && String(val) !== '') { label = String(val); break }
      }
      return { label, value: row.value ?? row[opts.valueKey as string] ?? row.id }
    })
}))

// ========== Mock @/utils/membership-school ==========
vi.mock('@/utils/membership-school', () => ({
  membershipSchoolToOptions: (records: Record<string, unknown>[], locale: string) =>
    records.map((r) => ({
      label: locale === 'en' ? String(r.enName ?? r.name ?? '') : String(r.cnName ?? r.name ?? ''),
      value: r.id
    }))
}))

// ========== Mock @/api ==========
vi.mock('@/api', () => ({
  membershipApi: {
    school: {
      get: async () => [
        { id: '1', name: '深圳校区', cnName: '深圳校区', enName: 'Shenzhen' },
        { id: '2', name: '广州校区', cnName: '广州校区', enName: 'Guangzhou' }
      ]
    }
  },
  schoolBusCommonApi: {
    sectionList: { get: async () => [{ id: 'S1', cnName: '小学部' }] },
    lineList: { get: async () => [{ id: 'L1', cnName: '1号线' }] },
    stationList: { get: async () => [{ id: 'ST1', cnName: '南门站' }] },
    carinfoList: { get: async () => [{ id: 'C1', carNumber: '粤B00001' }] }
  }
}))

import {
  defaultStudentOrderSearchCascade,
  approvalStatusOptions,
  paymentStatusOptions,
  pickupMethodOptions,
  studentLineTypeOptions,
  paymentMethodOptions,
  useStudentOrderFilters
} from '../../../../views/school-bus/student/use-student-order-filters'

const t = (key: string) => key

describe('use-student-order-filters.ts', () => {

  // ==================== Option Builders ====================
  describe('option builders', () => {
    it('defaultStudentOrderSearchCascade 默认所有字段为 false', () => {
      const state = defaultStudentOrderSearchCascade()
      expect(state.sectionDisabled).toBe(false)
      expect(state.lineDisabled).toBe(false)
      expect(state.stationDisabled).toBe(false)
      expect(state.optionsLoading).toBe(false)
      expect(state.optionsFailed).toBe(false)
    })

    it('approvalStatusOptions 应返回 3 个审批状态', () => {
      const opts = approvalStatusOptions(t)
      expect(opts).toHaveLength(3)
      expect(opts[0]).toMatchObject({ value: '0', type: 'info' })
      expect(opts[1]).toMatchObject({ value: '1', type: 'success' })
      expect(opts[2]).toMatchObject({ value: '2', type: 'danger' })
    })

    it('paymentStatusOptions 应返回 2 个支付状态', () => {
      const opts = paymentStatusOptions(t)
      expect(opts).toHaveLength(2)
      expect(opts[0]).toMatchObject({ value: 1, type: 'warning' })
      expect(opts[1]).toMatchObject({ value: 2, type: 'success' })
    })

    it('pickupMethodOptions 应返回 2 个接送方式', () => {
      const opts = pickupMethodOptions(t)
      expect(opts).toHaveLength(2)
      expect(opts[0]).toMatchObject({ value: '1' })
      expect(opts[1]).toMatchObject({ value: '2' })
    })

    it('studentLineTypeOptions 应返回 2 个线路类型', () => {
      const opts = studentLineTypeOptions(t)
      expect(opts).toHaveLength(2)
      expect(opts[0]).toMatchObject({ value: '0' })
      expect(opts[1]).toMatchObject({ value: '1' })
    })

    it('paymentMethodOptions 应返回 4 个支付方式', () => {
      const opts = paymentMethodOptions(t)
      expect(opts).toHaveLength(4)
      const values = opts.map((o) => o.value)
      expect(values).toEqual([1, 2, 3, 4])
    })
  })

  // ==================== useStudentOrderFilters ====================
  describe('useStudentOrderFilters', () => {
    it('初始 schoolOptions 为空', () => {
      const { schoolOptions } = useStudentOrderFilters()
      expect(schoolOptions.value).toEqual([])
    })

    it('初始 sectionOptions / lineOptions / stationOptions 为空', () => {
      const { sectionOptions, lineOptions, stationOptions } = useStudentOrderFilters()
      expect(sectionOptions.value).toEqual([])
      expect(lineOptions.value).toEqual([])
      expect(stationOptions.value).toEqual([])
    })

    it('初始 carSelectOptions 为空', () => {
      const { carSelectOptions } = useStudentOrderFilters()
      expect(carSelectOptions.value).toEqual([])
    })

    it('初始 commonDataLoading 为 false', () => {
      const { commonDataLoading } = useStudentOrderFilters()
      expect(commonDataLoading.value).toBe(false)
    })

    it('初始 commonDataError 为 false', () => {
      const { commonDataError } = useStudentOrderFilters()
      expect(commonDataError.value).toBe(false)
    })

    it('initSchools 后 schoolOptions 被填充', async () => {
      const { schoolOptions, initSchools } = useStudentOrderFilters()
      await initSchools()
      await nextTick()
      expect(schoolOptions.value).toHaveLength(2)
      expect(schoolOptions.value[0]).toMatchObject({ label: '深圳校区', value: '1' })
    })

    it('initSchools 后 sectionOptions 被填充', async () => {
      const { sectionOptions, initSchools } = useStudentOrderFilters()
      await initSchools()
      await nextTick()
      expect(sectionOptions.value).toHaveLength(1)
      expect(sectionOptions.value[0]).toMatchObject({ label: '小学部', value: 'S1' })
    })

    it('initSchools 后 carSelectOptions 被填充', async () => {
      const { carSelectOptions, initSchools } = useStudentOrderFilters()
      await initSchools()
      await nextTick()
      expect(carSelectOptions.value).toHaveLength(1)
      expect(carSelectOptions.value[0]).toMatchObject({ label: '粤B00001', value: 'C1' })
    })

    it('syncSchoolSelection 应更新 selectedSchoolIds', () => {
      const { syncSchoolSelection, selectedSchoolIds } = useStudentOrderFilters()
      syncSchoolSelection(['1', '2'])
      expect(selectedSchoolIds.value).toEqual(['1', '2'])
    })

    it('syncSchoolSelection 传入 null 应清空', () => {
      const { syncSchoolSelection, selectedSchoolIds } = useStudentOrderFilters()
      syncSchoolSelection(['1'])
      syncSchoolSelection(null)
      expect(selectedSchoolIds.value).toEqual([])
    })

    it('syncSchoolSelection 传入 undefined 应清空', () => {
      const { syncSchoolSelection, selectedSchoolIds } = useStudentOrderFilters()
      syncSchoolSelection(['1'])
      syncSchoolSelection(undefined)
      expect(selectedSchoolIds.value).toEqual([])
    })
  })
})
