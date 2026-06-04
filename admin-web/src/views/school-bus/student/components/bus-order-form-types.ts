import type { InjectionKey, Ref } from 'vue'

import type { BusOrderFormModel } from '@/types/modules/school-bus-order'

/** 子区块 inject 共享表单 ref，避免 prop 双向绑定触发 no-mutating-props */
export const busOrderRuleFormKey: InjectionKey<Ref<BusOrderFormModel>> = Symbol('busOrderRuleForm')

export type Loose = Record<string, unknown>

export type StudentSuggest = {
  value: string
  admissonNo?: string
  fullName?: string
  grade?: string
}

export type SectionRow = {
  id: string | number
  cnName?: string
  enName?: string
  serviceStartDate?: string
  serviceEndDate?: string
}

export type LineRow = { id: string | number; cnName?: string; enName?: string }

export type CarRow = { id: string | number; carNumber?: string }

export type OrderStationRow = {
  id: string | number
  weekDays?: string
  stationPrices?: Array<{
    id: string | number
    stationId?: string | number
    busStationDTO?: { cnName?: string; enName?: string }
  }>
}

export type RouteRow = Loose

export type PersonRow = {
  pickupRelationships?: string
  pickupPhone?: string
  pickupImageUrl?: string
}

export type BusOrderFormDialogProps = {
  mode: 'add' | 'edit'
  orderId: string | number | null
  formType: 'apply' | 'order'
  schoolOptions: import('uni-ui-lib').UniOption[]
  defaultSchoolId: string | number | null
  multiSchool: boolean
}

export type BusOrderFormCoreRefs = {
  ruleForm: import('vue').Ref<BusOrderFormModel>
  routeTableData: import('vue').Ref<RouteRow[]>
  personTableData: import('vue').Ref<PersonRow[]>
  selectSectionList: import('vue').Ref<SectionRow[]>
  selectLineList: import('vue').Ref<LineRow[]>
}
