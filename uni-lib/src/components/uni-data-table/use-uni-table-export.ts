import type { Recordable, UniTableColumn } from "@/types/shared";

const getCellText = (row: Recordable, column: UniTableColumn) => {
  const value = row[column.prop];

  if (column.formatter) {
    return column.formatter(row, column, value, 0);
  }

  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join("、");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const escapeCsvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function useUniTableExport(options: {
  getRows: () => Recordable[];
  getColumns: () => UniTableColumn[];
  getFileName: () => string;
}) {
  const exportCurrentData = () => {
    if (typeof document === "undefined") {
      return;
    }

    const rows = options.getRows();
    const columns = options.getColumns();
    const csv = [
      columns.map((column) => escapeCsvCell(column.label)).join(","),
      ...rows.map((row) =>
        columns
          .map((column) => escapeCsvCell(getCellText(row, column)))
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
          <title>打印表格</title>
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
              ${rows
                .map(
                  (row) =>
                    `<tr>${columns
                      .map(
                        (column) =>
                          `<td>${escapeHtml(getCellText(row, column))}</td>`,
                      )
                      .join("")}</tr>`,
                )
                .join("")}
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
