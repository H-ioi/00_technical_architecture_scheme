export interface DormAssignRuleItemOption {
  code: string
  name?: string
}

export interface DormAssignRuleRecord {
  id: string | number
  school_en_name?: string
  ruleName?: string
  ruleItems?: string
  isActive?: string | number
}

export interface DormAssignRulePageParams {
  current?: number
  size?: number
  schoolId?: string | number
  keyword?: string
  isActive?: string | number
}

export interface DormAssignRuleDetail {
  id: string | number
  school_id?: string | number
  ruleName?: string
  ruleItems?: string
  isActive?: string | number
}

export interface DormAssignRuleFormModel {
  id?: string | number
  schoolId?: string | number
  ruleName?: string
  rulesList: string[]
  is_active?: string
}

export interface DormAssignRulePayload {
  id?: string | number
  school_id?: string | number
  rule_name?: string
  is_active?: number
  rule_items?: string
}
