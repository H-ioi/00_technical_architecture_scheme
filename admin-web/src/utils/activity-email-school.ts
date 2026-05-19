import type { UniOption } from 'uni-ui-lib'
import { toUniOptions } from 'uni-ui-lib'

/** 邮件学校配置：应用模块下拉（保证活动模块 value=1 存在） */
export function appModuleOptionsFromRows(
  rows: Record<string, unknown>[],
  activityModuleLabel: string
): UniOption[] {
  const normalizedRows = rows.map((row) => {
    const value = row.value ?? row.moduleCode ?? row.code ?? row.key ?? row.id
    return {
      value,
      label: row.label ?? row.name ?? row.desc ?? row.moduleName ?? value
    }
  })
  const options = toUniOptions(normalizedRows, {
    labelKeys: ['label'],
    valueKey: 'value'
  })
  if (!options.some((item) => String(item.value) === '1')) {
    options.unshift({ label: activityModuleLabel, value: '1' })
  }
  return options.map((item) => ({ ...item, value: String(item.value) }))
}
