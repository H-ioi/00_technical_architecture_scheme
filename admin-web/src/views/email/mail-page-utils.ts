/** 群发邮件群组等业务展示（与接口信封无关）。 */

/** 群组 `scopes` 单行编码转可读文案（对齐旧 `group.vue` `convertGroup`）。 */
export const formatMailGroupScopeDisplay = (str: string): string => {
  if (!str) {
    return '—'
  }
  const parts = str.split(',')
  const result: string[] = []
  if (parts[0] && parts[0] !== 'All') {
    result.push(parts[0])
  }
  if (parts[1] && parts[1] !== 'All') {
    result.push(parts[1])
  }
  if (parts[2] && parts[2] !== 'All') {
    result.push(parts[2])
  }
  if (parts[3] && parts[3] !== 'All') {
    result.push(parts[3])
  }
  if (parts[4] && parts[4] !== 'All') {
    if (parts[4] === 'true' || parts[4] === '是') {
      result.push('乘坐校巴(是)')
    } else {
      result.push('乘坐校巴(否)')
    }
  }
  if (parts[5] && parts[5] !== 'All') {
    if (parts[5] === 'true' || parts[5] === '是') {
      result.push('住宿(是)')
    } else {
      result.push('住宿(否)')
    }
  }
  if (parts[6] && parts[6] !== 'All') {
    result.push(parts[6])
  }
  if (parts[7] && parts[7] !== 'All') {
    result.push(parts[7])
  }
  if (parts[8] && parts[8] !== 'All') {
    result.push(parts[8])
  }
  return result.join('，') || '—'
}
