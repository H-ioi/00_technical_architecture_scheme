import { useUniI18n } from "@/locales/use-uni-i18n";
import type { Recordable } from "@/types/shared";
import type { UniTableColumn } from "@/types/uni-table";
import { formatTableCellText, resolveRowCellValue } from "@/utils/format";

const escapeCsvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function useExport(options: {
  getRows: () => Recordable[];
  getColumns: () => UniTableColumn[];
  getFileName: () => string;
}) {
  const { t } = useUniI18n();
  const getCellText = (
    row: Recordable,
    column: UniTableColumn,
    index: number,
  ) =>
    formatTableCellText(
      row,
      column,
      resolveRowCellValue(row as Record<string, unknown>, column.prop),
      index,
      t,
    );

  const exportCurrentData = () => {
    if (typeof document === "undefined") {
      return;
    }

    const rows = options.getRows();
    const columns = options.getColumns();
    const csv = [
      columns.map((column) => escapeCsvCell(column.label)).join(","),
      ...rows.map((row, index) =>
        columns
          .map((column) => escapeCsvCell(getCellText(row, column, index)))
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${options.getFileName()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printCurrentData = () => {
    if (typeof window === "undefined") {
      return;
    }

    const columns = options.getColumns();
    const rows = options.getRows();
    const html = `
      <html>
        <head>
          <title>${escapeHtml(t("dataTable.printTitle"))}</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${rows.map((row, index) => `<tr>${columns.map((column) => `<td>${escapeHtml(getCellText(row, column, index))}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </body>
      </html>`;
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return {
    exportCurrentData,
    printCurrentData,
  };
}
