export function download(res, name = "download") {
    let index = name.indexOf("=");
    let downloadname = decodeURIComponent(
        name.substring(index + 1)
    );
    let binaryData = [];
    binaryData.push(res);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = window.URL.createObjectURL(new Blob(binaryData));
    link.setAttribute("download", downloadname);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
export function downloadFile(res, name) {
    let binaryData = [];
    binaryData.push(res);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = window.URL.createObjectURL(new Blob(binaryData));
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 导出 UTF-8 BOM CSV（Excel 可正确识别中文）
 * @param {string} filename 建议以 .csv 结尾
 * @param {object[]} rows
 * @param {{ header: string, key: string }[]} columns
 */
export function downloadUtf8Csv(filename, rows, columns) {
    const escCell = (v) => {
        if (v == null || v === "") return "";
        const s = String(v);
        if (/[",\n\r]/.test(s)) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    };
    const head = columns.map((c) => escCell(c.header)).join(",");
    const lines = rows.map((row) =>
        columns.map((c) => escCell(row[c.key])).join(",")
    );
    const csv = "\ufeff" + [head, ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
}