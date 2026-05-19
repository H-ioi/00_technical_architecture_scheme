/** CSV 单行：单元格转义并逗号拼接 */
export function formatCsvRow(cells: unknown[]): string {
  return cells.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
}
